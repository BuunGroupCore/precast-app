/**
 * @fileoverview Advanced metrics calculation service
 * @module services/advanced-metrics
 */

import type {
  PostHogEventResponse,
  PostHogEvent,
  StackCombination,
  DeveloperExperience,
  PerformanceMetrics,
  UserJourney,
  AIAutomationMetrics,
  ErrorMetrics,
  PluginMetrics,
  QualityMetrics,
} from "../types";

export class AdvancedMetricsService {
  /**
   * Analyze stack combinations and their success rates
   */
  analyzeStackCombinations(events: PostHogEventResponse): StackCombination[] {
    const combinations = new Map<string, StackCombination>();

    if (events.results) {
      for (const event of events.results) {
        if (event.event === "project_created" && event.properties) {
          const key = this.getStackKey(event.properties);
          if (key) {
            const existing = combinations.get(key) || this.createStackEntry(event.properties);
            existing.frequency++;
            
            // Calculate success rate based on completion events
            if (event.properties.success === true) {
              existing.successRate = (existing.successRate * (existing.frequency - 1) + 100) / existing.frequency;
            }
            
            // Track setup time
            if (typeof event.properties.duration === 'number') {
              existing.avgSetupTime = (existing.avgSetupTime * (existing.frequency - 1) + event.properties.duration) / existing.frequency;
            }
            
            combinations.set(key, existing);
          }
        }
      }
    }

    return Array.from(combinations.values())
      .sort((a, b) => b.frequency - a.frequency)
      .slice(0, 20); // Top 20 combinations
  }

  /**
   * Calculate developer experience metrics
   */
  calculateDeveloperExperience(events: PostHogEventResponse): DeveloperExperience {
    const metrics = {
      typeScriptAdoption: 0,
      dockerUsage: 0,
      gitInitRate: 0,
      eslintEnabled: 0,
      prettierEnabled: 0,
      testingSetup: 0,
      cicdConfigured: 0,
    };

    let totalProjects = 0;

    if (events.results) {
      for (const event of events.results) {
        if (event.event === "project_created") {
          totalProjects++;
          const props = event.properties;
          
          // Handle both boolean and string "true" values
          if (props?.typescript === true || props?.typescript === "true") metrics.typeScriptAdoption++;
          if (props?.docker === true || props?.docker === "true") metrics.dockerUsage++;
          if (props?.git === true || props?.git === "true") metrics.gitInitRate++;
          if (props?.eslint === true || props?.eslint === "true") metrics.eslintEnabled++;
          if (props?.prettier === true || props?.prettier === "true") metrics.prettierEnabled++;
          
          // Testing can be a string value
          if (props?.testing && typeof props.testing === 'string' && props.testing !== "none") {
            metrics.testingSetup++;
          }
          
          // CI/CD flag
          if (props?.cicd === true || props?.cicd === "true") metrics.cicdConfigured++;
        }
      }
    }

    // Convert to percentages
    if (totalProjects > 0) {
      Object.keys(metrics).forEach(key => {
        metrics[key as keyof typeof metrics] = Math.round((metrics[key as keyof typeof metrics] / totalProjects) * 100);
      });
    }

    return metrics;
  }

  /**
   * Calculate performance metrics
   */
  calculatePerformanceMetrics(events: PostHogEventResponse): PerformanceMetrics {
    const pmTimes: Record<string, number[]> = {
      npm: [],
      yarn: [],
      pnpm: [],
      bun: [],
    };

    const frameworkSuccess: Record<string, { success: number; total: number }> = {};
    const pmSuccess: Record<string, { success: number; total: number }> = {};
    const setupTimes: number[] = [];

    if (events.results) {
      for (const event of events.results) {
        if (event.event === "project_created" || event.event === "dependencies_installed") {
          const props = event.properties;
          
          // Track setup times
          if (typeof props?.duration === 'number') {
            setupTimes.push(props.duration);
            
            // Track by package manager
            const pm = props?.packageManager as string;
            if (pm && pmTimes[pm]) {
              pmTimes[pm].push(props.duration);
            }
          }
          
          // Track success rates
          if (props?.framework) {
            const fw = props.framework as string;
            if (!frameworkSuccess[fw]) {
              frameworkSuccess[fw] = { success: 0, total: 0 };
            }
            frameworkSuccess[fw].total++;
            if (props.success === true) {
              frameworkSuccess[fw].success++;
            }
          }
          
          if (props?.packageManager) {
            const pm = props.packageManager as string;
            if (!pmSuccess[pm]) {
              pmSuccess[pm] = { success: 0, total: 0 };
            }
            pmSuccess[pm].total++;
            if (props.success === true) {
              pmSuccess[pm].success++;
            }
          }
        }
      }
    }

    return {
      avgProjectSetupTime: this.calculateAverage(setupTimes),
      avgDependencyInstallTime: {
        npm: this.calculateAverage(pmTimes.npm),
        yarn: this.calculateAverage(pmTimes.yarn),
        pnpm: this.calculateAverage(pmTimes.pnpm),
        bun: this.calculateAverage(pmTimes.bun),
      },
      successRates: {
        overall: this.calculateOverallSuccessRate(events),
        byFramework: this.calculateSuccessRates(frameworkSuccess),
        byPackageManager: this.calculateSuccessRates(pmSuccess),
      },
    };
  }

  /**
   * Analyze user journeys
   */
  analyzeUserJourneys(events: PostHogEventResponse): UserJourney {
    const journeyData = {
      entryPoints: { cli: 0, website: 0, github: 0, unknown: 0 },
      completions: 0,
      totalAttempts: 0,
      completionTimes: [] as number[],
      dropoffs: new Map<string, number>(),
      retries: new Map<string, number>(),
      paths: new Map<string, number>(),
    };

    if (events.results) {
      // Group events by session/user
      const sessions = this.groupEventsBySessions(events.results);
      
      for (const session of sessions) {
        // Analyze entry point
        const entryPoint = this.detectEntryPoint(session);
        journeyData.entryPoints[entryPoint]++;
        journeyData.totalAttempts++;
        
        // Check completion - look for project_completed OR success=true in project_created
        const completed = session.some(e => 
          e.event === "project_completed" || 
          (e.event === "project_created" && e.properties?.success === true)
        );
        
        if (completed) {
          journeyData.completions++;
          
          // Use duration property from events if available, otherwise calculate from timestamps
          const completionEvent = session.find(e => 
            e.event === "project_completed" || 
            (e.event === "project_created" && e.properties?.success === true)
          );
          
          if (completionEvent?.properties?.duration && typeof completionEvent.properties.duration === 'number') {
            // Use the duration property from the event (in milliseconds)
            journeyData.completionTimes.push(completionEvent.properties.duration);
          } else {
            // Fallback to timestamp calculation
            const startTime = new Date(session[0].timestamp).getTime();
            const endTime = completionEvent ? new Date(completionEvent.timestamp).getTime() : new Date(session[session.length - 1].timestamp).getTime();
            journeyData.completionTimes.push(endTime - startTime);
          }
        } else {
          // Track dropoff point
          const lastEvent = session[session.length - 1].event;
          journeyData.dropoffs.set(lastEvent, (journeyData.dropoffs.get(lastEvent) || 0) + 1);
        }
        
        // Track retries from retryCount property
        for (const event of session) {
          if (event.properties?.retryCount && typeof event.properties.retryCount === 'number' && event.properties.retryCount > 0) {
            const sessionId = event.properties?.sessionId as string || 'unknown';
            journeyData.retries.set(sessionId, event.properties.retryCount);
          }
        }
        
        // Track path
        const path = session.map(e => e.event).join(" → ");
        journeyData.paths.set(path, (journeyData.paths.get(path) || 0) + 1);
      }
    }

    // Determine most common entry point
    const topEntry = Object.entries(journeyData.entryPoints)
      .sort(([, a], [, b]) => b - a)[0][0] as UserJourney["entryPoint"];

    return {
      entryPoint: topEntry,
      completionRate: journeyData.totalAttempts > 0 
        ? Math.round((journeyData.completions / journeyData.totalAttempts) * 100)
        : 0,
      avgTimeToCompletion: this.calculateAverage(journeyData.completionTimes),
      dropoffPoints: Array.from(journeyData.dropoffs.entries())
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([point]) => point),
      retryAttempts: this.calculateAverageRetries(journeyData.retries),
      commonPaths: Array.from(journeyData.paths.entries())
        .sort(([, a], [, b]) => b - a)
        .slice(0, 10)
        .map(([path, frequency]) => ({
          path: path.split(" → "),
          frequency,
        })),
    };
  }

  /**
   * Calculate AI and automation metrics
   */
  calculateAIAutomationMetrics(events: PostHogEventResponse): AIAutomationMetrics {
    const metrics = {
      claudeProjects: 0,
      totalProjects: 0,
      mcpServers: new Map<string, number>(),
      dockerProjects: 0,
      githubActionsProjects: 0,
      cicdProjects: 0,
    };

    if (events.results) {
      for (const event of events.results) {
        if (event.event === "project_created") {
          metrics.totalProjects++;
          const props = event.properties;
          
          // Check for AI assistant
          if (props?.aiAssistant === "claude") {
            metrics.claudeProjects++;
          }
          
          // Handle MCP servers as array or comma-separated string
          if (props?.mcpServers) {
            let servers: string[] = [];
            if (Array.isArray(props.mcpServers)) {
              servers = props.mcpServers.filter((s): s is string => typeof s === 'string');
            } else if (typeof props.mcpServers === 'string' && props.mcpServers.trim() !== '') {
              servers = props.mcpServers.split(',').map(s => s.trim()).filter(Boolean);
            }
            
            for (const server of servers) {
              metrics.mcpServers.set(server, (metrics.mcpServers.get(server) || 0) + 1);
            }
          }
          
          // Handle boolean flags
          if (props?.docker === true || props?.docker === "true") metrics.dockerProjects++;
          if (props?.githubActions === true || props?.githubActions === "true") metrics.githubActionsProjects++;
          if (props?.cicd === true || props?.cicd === "true") metrics.cicdProjects++;
        }
      }
    }

    return {
      claudeIntegrationRate: metrics.totalProjects > 0
        ? Math.round((metrics.claudeProjects / metrics.totalProjects) * 100)
        : 0,
      mcpServerAdoption: Object.fromEntries(metrics.mcpServers),
      aiAssistedProjects: metrics.claudeProjects,
      automationFeatures: {
        docker: metrics.dockerProjects,
        githubActions: metrics.githubActionsProjects,
        cicd: metrics.cicdProjects,
      },
    };
  }

  /**
   * Analyze errors and recovery patterns
   */
  analyzeErrorMetrics(events: PostHogEventResponse): ErrorMetrics {
    const errorMap = new Map<string, {
      frequency: number;
      resolutionTimes: number[];
      resolutions: string[];
    }>();
    
    const fallbacks = {
      bunToNpm: 0,
      templateRetries: 0,
      manualInterventions: 0,
    };
    
    let totalErrors = 0;
    let recoveredErrors = 0;

    if (events.results) {
      for (const event of events.results) {
        if (event.event === "error_occurred") {
          totalErrors++;
          const errorType = event.properties?.errorType as string || "unknown";
          const errorData = errorMap.get(errorType) || {
            frequency: 0,
            resolutionTimes: [],
            resolutions: [],
          };
          errorData.frequency++;
          errorMap.set(errorType, errorData);
        }
        
        if (event.event === "error_recovered") {
          recoveredErrors++;
          const errorType = event.properties?.errorType as string || "unknown";
          const errorData = errorMap.get(errorType);
          if (errorData && typeof event.properties?.resolutionTime === 'number') {
            errorData.resolutionTimes.push(event.properties.resolutionTime);
            if (event.properties?.resolution) {
              errorData.resolutions.push(event.properties.resolution as string);
            }
          }
        }
        
        // Track fallbacks
        if (event.event === "fallback_triggered") {
          const fallbackType = event.properties?.fallbackType as string;
          if (fallbackType === "bun_to_npm") fallbacks.bunToNpm++;
          if (fallbackType === "template_retry") fallbacks.templateRetries++;
          if (fallbackType === "manual_intervention") fallbacks.manualInterventions++;
        }
      }
    }

    return {
      commonErrors: Array.from(errorMap.entries())
        .map(([type, data]) => ({
          type,
          message: this.getErrorMessage(type),
          frequency: data.frequency,
          avgTimeToResolve: this.calculateAverage(data.resolutionTimes),
          resolution: this.getMostCommonResolution(data.resolutions),
        }))
        .sort((a, b) => b.frequency - a.frequency)
        .slice(0, 10),
      fallbackUsage: fallbacks,
      recoveryRate: totalErrors > 0
        ? Math.round((recoveredErrors / totalErrors) * 100)
        : 0,
    };
  }

  /**
   * Analyze plugin ecosystem
   */
  analyzePluginMetrics(events: PostHogEventResponse): PluginMetrics {
    const plugins = new Map<string, { usage: number; success: number }>();
    const combinations = new Map<string, number>();
    const authProviders = new Map<string, number>();
    const paymentProviders = new Map<string, number>();

    if (events.results) {
      for (const event of events.results) {
        if (event.event === "project_created") {
          const props = event.properties;
          
          // Track plugins - handle both array and comma-separated string
          let pluginList: string[] = [];
          if (props?.plugins) {
            if (Array.isArray(props.plugins)) {
              pluginList = props.plugins.filter((p): p is string => typeof p === 'string');
            } else if (typeof props.plugins === 'string' && props.plugins.trim() !== '') {
              pluginList = props.plugins.split(',').map(p => p.trim()).filter(Boolean);
            }
          }
          
          if (pluginList.length > 0) {
            for (const plugin of pluginList) {
              const data = plugins.get(plugin) || { usage: 0, success: 0 };
              data.usage++;
              if (props.success === true || props.success === "true") data.success++;
              plugins.set(plugin, data);
            }
            
            // Track combinations
            const comboKey = pluginList.sort().join("+");
            combinations.set(comboKey, (combinations.get(comboKey) || 0) + 1);
          }
          
          // Track auth providers - check both auth and authProvider fields
          const authValue = props?.authProvider || props?.auth;
          if (authValue && typeof authValue === 'string' && authValue !== 'none') {
            authProviders.set(authValue, (authProviders.get(authValue) || 0) + 1);
          }
          
          // Track payment integrations from plugin list
          if (pluginList.length > 0) {
            const paymentPlugins = ["stripe", "paddle", "lemonsqueezy", "resend"];
            for (const plugin of pluginList) {
              if (paymentPlugins.includes(plugin)) {
                paymentProviders.set(plugin, (paymentProviders.get(plugin) || 0) + 1);
              }
            }
          }
        }
      }
    }

    return {
      popularPlugins: Array.from(plugins.entries())
        .map(([name, data]) => ({
          name,
          usage: data.usage,
          successRate: data.usage > 0 ? Math.round((data.success / data.usage) * 100) : 0,
        }))
        .sort((a, b) => b.usage - a.usage)
        .slice(0, 10),
      pluginCombinations: Array.from(combinations.entries())
        .map(([combo, frequency]) => ({
          plugins: combo.split("+"),
          frequency,
        }))
        .sort((a, b) => b.frequency - a.frequency)
        .slice(0, 10),
      authProviderPreferences: Object.fromEntries(authProviders),
      paymentIntegrations: Object.fromEntries(paymentProviders),
    };
  }

  /**
   * Calculate template performance metrics
   */
  calculateTemplateMetrics(events: PostHogEventResponse): {
    templateUsage: Record<string, number>;
    avgGenerationTime: Record<string, number>;
    templateSuccessRate: Record<string, number>;
    totalTemplatesGenerated: number;
  } {
    const templateStats = new Map<string, {
      usage: number;
      totalTime: number;
      successes: number;
      fileCount: number;
    }>();
    
    let totalGenerated = 0;

    if (events.results) {
      for (const event of events.results) {
        // Extract template data from both template_generated and project_created events
        if (event.event === "template_generated" || event.event === "project_created") {
          totalGenerated++;
          
          // For project_created events, the template is a combination of framework + backend
          let template: string;
          if (event.event === "project_created") {
            const framework = event.properties?.framework as string || "unknown";
            const backend = event.properties?.backend as string || "none";
            // Ensure we capture the template name correctly
            template = backend && backend !== "none" ? `${framework}-${backend}` : framework;
          } else {
            template = event.properties?.template as string || "unknown";
          }
          
          // Safely parse duration and validate it's a reasonable value
          let duration = 0;
          const rawDuration = event.properties?.duration;
          if (rawDuration !== undefined && rawDuration !== null) {
            const parsed = Number(rawDuration);
            // Only accept reasonable duration values (0-5 minutes in milliseconds)
            if (!isNaN(parsed) && isFinite(parsed) && parsed >= 0 && parsed <= 300000) {
              duration = parsed;
            }
          }
          
          const success = event.properties?.success === true;
          const fileCount = Number(event.properties?.fileCount) || 0;
          
          const stats = templateStats.get(template) || {
            usage: 0,
            totalTime: 0,
            successes: 0,
            fileCount: 0,
          };
          
          stats.usage++;
          stats.totalTime += duration;
          stats.fileCount += fileCount;
          if (success) stats.successes++;
          
          templateStats.set(template, stats);
        }
      }
    }

    const templateUsage: Record<string, number> = {};
    const avgGenerationTime: Record<string, number> = {};
    const templateSuccessRate: Record<string, number> = {};

    for (const [template, stats] of templateStats.entries()) {
      templateUsage[template] = stats.usage;
      avgGenerationTime[template] = stats.usage > 0 ? Math.round(stats.totalTime / stats.usage) : 0;
      templateSuccessRate[template] = stats.usage > 0 ? Math.round((stats.successes / stats.usage) * 100) : 0;
    }

    // If no templates were processed, provide some basic data based on project_created events
    if (totalGenerated === 0 && events.results) {
      for (const event of events.results) {
        if (event.event === "project_created") {
          totalGenerated++;
          const framework = event.properties?.framework as string || "unknown";
          const backend = event.properties?.backend as string || "none";
          const template = backend && backend !== "none" ? `${framework}-${backend}` : framework;
          
          templateUsage[template] = (templateUsage[template] || 0) + 1;
          avgGenerationTime[template] = 1000; // Default 1 second
          templateSuccessRate[template] = 100; // Default success
        }
      }
    }

    return {
      templateUsage,
      avgGenerationTime,
      templateSuccessRate,
      totalTemplatesGenerated: totalGenerated,
    };
  }

  /**
   * Calculate user preference metrics
   */
  calculateUserPreferenceMetrics(events: PostHogEventResponse): {
    packageManagerPreferences: Record<string, number>;
    installModePreferences: Record<string, number>;
    workflowTypes: Record<string, number>;
    aiUsagePatterns: Record<string, number>;
  } {
    const preferences = {
      packageManagerPreferences: {} as Record<string, number>,
      installModePreferences: {} as Record<string, number>,
      workflowTypes: {} as Record<string, number>,
      aiUsagePatterns: {} as Record<string, number>,
    };

    if (events.results) {
      for (const event of events.results) {
        // Extract preferences from user_preference, project_created, and workflow_completed events
        if (event.event === "user_preference") {
          const type = event.properties?.preferenceType as string;
          const value = event.properties?.value as string;
          
          if (type === "package_manager" && value) {
            preferences.packageManagerPreferences[value] = (preferences.packageManagerPreferences[value] || 0) + 1;
          } else if (type === "install_mode" && value) {
            preferences.installModePreferences[value] = (preferences.installModePreferences[value] || 0) + 1;
          }
        } else if (event.event === "project_created") {
          // Extract preferences from project_created events
          const packageManager = event.properties?.packageManager as string;
          const autoInstall = event.properties?.autoInstall;
          const aiAssistant = event.properties?.aiAssistant as string;
          
          // Package manager preferences
          if (packageManager) {
            preferences.packageManagerPreferences[packageManager] = (preferences.packageManagerPreferences[packageManager] || 0) + 1;
          }
          
          // Install mode preferences (based on autoInstall)
          const installMode = autoInstall === true ? "auto" : "manual";
          preferences.installModePreferences[installMode] = (preferences.installModePreferences[installMode] || 0) + 1;
          
          // Workflow types (based on complexity)
          const hasBackend = event.properties?.backend && event.properties.backend !== "none";
          const hasDatabase = event.properties?.database && event.properties.database !== "none";
          let workflowType = "quick_start";
          if (hasBackend && hasDatabase) {
            workflowType = "full_customization";
          } else if (hasBackend || hasDatabase) {
            workflowType = "template_only";
          }
          preferences.workflowTypes[workflowType] = (preferences.workflowTypes[workflowType] || 0) + 1;
          
          // AI usage patterns
          if (aiAssistant && aiAssistant !== "none") {
            preferences.aiUsagePatterns["ai_assisted"] = (preferences.aiUsagePatterns["ai_assisted"] || 0) + 1;
          } else {
            preferences.aiUsagePatterns["manual"] = (preferences.aiUsagePatterns["manual"] || 0) + 1;
          }
        } else if (event.event === "workflow_completed") {
          const workflowType = event.properties?.workflowType as string || "unknown";
          preferences.workflowTypes[workflowType] = (preferences.workflowTypes[workflowType] || 0) + 1;
        } else if (event.event === "ai_assistant_used") {
          const action = event.properties?.action as string || "unknown";
          preferences.aiUsagePatterns[action] = (preferences.aiUsagePatterns[action] || 0) + 1;
        }
      }
    }

    // If no preferences were found, extract basic data from project_created events
    const hasAnyPreferences = Object.keys(preferences.packageManagerPreferences).length > 0 ||
                             Object.keys(preferences.installModePreferences).length > 0 ||
                             Object.keys(preferences.workflowTypes).length > 0 ||
                             Object.keys(preferences.aiUsagePatterns).length > 0;

    if (!hasAnyPreferences && events.results) {
      for (const event of events.results) {
        if (event.event === "project_created") {
          const packageManager = event.properties?.packageManager as string;
          const autoInstall = event.properties?.autoInstall;
          
          // Basic package manager preferences
          if (packageManager) {
            preferences.packageManagerPreferences[packageManager] = (preferences.packageManagerPreferences[packageManager] || 0) + 1;
          }
          
          // Basic install mode preferences
          const installMode = autoInstall === true ? "auto" : "manual";
          preferences.installModePreferences[installMode] = (preferences.installModePreferences[installMode] || 0) + 1;
          
          // Basic workflow classification
          const hasBackend = event.properties?.backend && event.properties.backend !== "none";
          const hasDatabase = event.properties?.database && event.properties.database !== "none";
          let workflowType = "quick_start";
          if (hasBackend && hasDatabase) {
            workflowType = "full_customization";
          } else if (hasBackend || hasDatabase) {
            workflowType = "template_only";
          }
          preferences.workflowTypes[workflowType] = (preferences.workflowTypes[workflowType] || 0) + 1;
        }
      }
    }

    return preferences;
  }

  /**
   * Calculate quality metrics
   */
  calculateQualityMetrics(events: PostHogEventResponse): QualityMetrics {
    const metrics = {
      securityAuditPass: 0,
      totalAudits: 0,
      codeQualityTools: {
        eslint: 0,
        prettier: 0,
        husky: 0,
        lintStaged: 0,
      },
      testingFrameworks: new Map<string, number>(),
      docsAdded: 0,
      totalProjects: 0,
    };

    if (events.results) {
      for (const event of events.results) {
        if (event.event === "project_created") {
          metrics.totalProjects++;
          const props = event.properties;
          
          // Handle both boolean and string "true" values
          if (props?.eslint === true || props?.eslint === "true") metrics.codeQualityTools.eslint++;
          if (props?.prettier === true || props?.prettier === "true") metrics.codeQualityTools.prettier++;
          if (props?.husky === true || props?.husky === "true") metrics.codeQualityTools.husky++;
          if (props?.lintStaged === true || props?.lintStaged === "true") metrics.codeQualityTools.lintStaged++;
          
          if (props?.testing && typeof props.testing === 'string' && props.testing !== "none") {
            metrics.testingFrameworks.set(props.testing, (metrics.testingFrameworks.get(props.testing) || 0) + 1);
          }
          
          if (props?.documentation === true || props?.documentation === "true") metrics.docsAdded++;
        }
        
        if (event.event === "security_audit_completed") {
          metrics.totalAudits++;
          if (event.properties?.passed === true) {
            metrics.securityAuditPass++;
          }
        }
      }
    }

    return {
      securityAuditPass: metrics.totalAudits > 0
        ? Math.round((metrics.securityAuditPass / metrics.totalAudits) * 100)
        : 0,
      codeQualityTools: {
        eslint: Math.round((metrics.codeQualityTools.eslint / Math.max(metrics.totalProjects, 1)) * 100),
        prettier: Math.round((metrics.codeQualityTools.prettier / Math.max(metrics.totalProjects, 1)) * 100),
        husky: Math.round((metrics.codeQualityTools.husky / Math.max(metrics.totalProjects, 1)) * 100),
        lintStaged: Math.round((metrics.codeQualityTools.lintStaged / Math.max(metrics.totalProjects, 1)) * 100),
      },
      testingFrameworks: Object.fromEntries(metrics.testingFrameworks),
      documentationAdded: Math.round((metrics.docsAdded / Math.max(metrics.totalProjects, 1)) * 100),
    };
  }

  // Helper methods
  private getStackKey(properties: Record<string, unknown>): string | null {
    const framework = properties.framework as string;
    const backend = properties.backend as string || "none";
    const database = properties.database as string || "none";
    const orm = properties.orm as string || "none";
    const styling = properties.styling as string || "none";
    
    if (framework) {
      return `${framework}-${backend}-${database}-${orm}-${styling}`;
    }
    return null;
  }

  private createStackEntry(properties: Record<string, unknown>): StackCombination {
    return {
      framework: properties.framework as string || "",
      backend: properties.backend as string || "none",
      database: properties.database as string || "none",
      orm: properties.orm as string || "none",
      styling: properties.styling as string || "none",
      frequency: 0,
      successRate: 0,
      avgSetupTime: 0,
    };
  }

  private calculateAverage(numbers: number[]): number {
    if (numbers.length === 0) return 0;
    const sum = numbers.reduce((a, b) => a + b, 0);
    return Math.round(sum / numbers.length);
  }

  private calculateOverallSuccessRate(events: PostHogEventResponse): number {
    let total = 0;
    let successful = 0;
    
    if (events.results) {
      for (const event of events.results) {
        if (event.event === "project_created") {
          total++;
          if (event.properties?.success === true || event.properties?.success === "true" || event.properties?.success !== false) {
            successful++;
          }
        }
      }
    }
    
    return total > 0 ? Math.round((successful / total) * 100) : 0;
  }

  private calculateSuccessRates(data: Record<string, { success: number; total: number }>): Record<string, number> {
    const rates: Record<string, number> = {};
    for (const [key, value] of Object.entries(data)) {
      rates[key] = value.total > 0 ? Math.round((value.success / value.total) * 100) : 0;
    }
    return rates;
  }

  private groupEventsBySessions(events: PostHogEvent[]): PostHogEvent[][] {
    const sessions: Map<string, PostHogEvent[]> = new Map();
    
    // Define CLI-related events (exact match, not pattern matching)
    const cliEvents = [
      'project_created', 'project_completed', 'project_failed',
      'feature_added', 'feature_configured', 'feature_enabled',
      'error_occurred', 'error_recovered', 'fallback_triggered',
      'dependencies_installed', 'security_audit_completed',
      'performance_measured', 'command_init', 'command_add',
      'command_status', 'command_telemetry', 'template_generated',
      'user_preference', 'project_customized', 'workflow_completed',
      'ai_assistant_used'
    ];
    
    for (const event of events) {
      // Only include CLI-related events in journey analysis
      // Check for exact match or if source is "cli"
      const isCliEvent = cliEvents.includes(event.event) || event.properties?.source === "cli";
      if (!isCliEvent) {
        continue;
      }
      
      const sessionId = event.properties?.sessionId as string || event.properties?.distinct_id as string || event.person?.id || "cli-session";
      const session = sessions.get(sessionId) || [];
      session.push(event);
      sessions.set(sessionId, session);
    }
    
    // Sort events within each session by timestamp
    for (const session of sessions.values()) {
      session.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    }
    
    return Array.from(sessions.values()).filter(session => session.length > 0);
  }

  private detectEntryPoint(session: PostHogEvent[]): UserJourney["entryPoint"] {
    const firstEvent = session[0];
    
    // Check explicit source property first
    if (firstEvent.properties?.source === "cli") return "cli";
    if (firstEvent.properties?.source === "website") return "website";
    if (firstEvent.properties?.source === "github") return "github";
    
    // Check entryPoint property as fallback
    if (firstEvent.properties?.entryPoint === "cli") return "cli";
    if (firstEvent.properties?.entryPoint === "website") return "website";
    if (firstEvent.properties?.entryPoint === "github") return "github";
    
    // If no explicit source, assume CLI for CLI events
    const cliEvents = ['project_created', 'project_completed', 'command_init', 'command_add'];
    if (cliEvents.includes(firstEvent.event)) return "cli";
    
    return "unknown";
  }

  private calculateAverageRetries(retries: Map<string, number>): number {
    if (retries.size === 0) return 0;
    const total = Array.from(retries.values()).reduce((a, b) => a + b, 0);
    return Math.round(total / retries.size);
  }

  private getErrorMessage(errorType: string): string {
    const errorMessages: Record<string, string> = {
      "dependency_install_failed": "Failed to install dependencies",
      "template_generation_failed": "Failed to generate project template",
      "git_init_failed": "Failed to initialize git repository",
      "docker_setup_failed": "Failed to setup Docker configuration",
      "auth_setup_failed": "Failed to configure authentication",
      "database_connection_failed": "Failed to connect to database",
    };
    return errorMessages[errorType] || errorType;
  }

  private getMostCommonResolution(resolutions: string[]): string {
    if (resolutions.length === 0) return "Manual intervention required";
    
    const counts = new Map<string, number>();
    for (const resolution of resolutions) {
      counts.set(resolution, (counts.get(resolution) || 0) + 1);
    }
    
    return Array.from(counts.entries())
      .sort(([, a], [, b]) => b - a)[0][0];
  }
}
/**
 * @fileoverview Type definitions for PostHog metrics worker
 * @module types
 */

/**
 * Worker environment bindings
 */
export interface WorkerEnv {
  /** R2 bucket for metrics storage */
  METRICS_BUCKET: R2Bucket;
  /** PostHog project ID */
  POSTHOG_PROJECT_ID: string;
  /** PostHog API key */
  POSTHOG_API_KEY: string;
  /** PostHog host (optional, defaults to app.posthog.com) */
  POSTHOG_HOST?: string;
}

/**
 * PostHog metrics data structure
 */
export interface PostHogMetricsData {
  timestamp: string;
  project: {
    name: string;
    id: string;
  };
  usage: {
    totalEvents: number;
    uniqueUsers: number;
    eventsLast30Days: number;
    eventsLast7Days: number;
    activeUsersLast30Days: number;
    activeUsersLast7Days: number;
  };
  events: {
    breakdown: EventBreakdown[];
    topEvents: EventBreakdown[];
    timeline: RawEventData[]; // Raw events with all properties
    dailyTimeline: TimelineData[]; // Daily aggregated timeline
  };
  frameworks: {
    breakdown: Record<string, number>;
    topFrameworks: FrameworkUsage[];
  };
  features: {
    breakdown: Record<string, number>;
    topFeatures: FeatureUsage[];
  };
  // Advanced metrics
  stackCombinations?: StackCombination[];
  developerExperience?: DeveloperExperience;
  performance?: PerformanceMetrics;
  userJourney?: UserJourney;
  aiAutomation?: AIAutomationMetrics;
  errors?: ErrorMetrics;
  plugins?: PluginMetrics;
  quality?: QualityMetrics;
  templates?: TemplateMetrics;
  userPreferences?: UserPreferenceMetrics;
  insights?: InsightData[];
  lastUpdated: string;
}

/**
 * Event breakdown data
 */
export interface EventBreakdown {
  event: string;
  count: number;
  percentage?: number;
}

/**
 * Timeline data point
 */
export interface TimelineData {
  date: string;
  count: number;
}

/**
 * Raw event data with all properties
 */
export interface RawEventData {
  event: string;
  timestamp: string;
  properties: Record<string, unknown>;
  // Common extracted properties for easy access
  cli_version?: string;
  cli_version_major?: string;
  platform?: string;
  platform_display?: string;
  platform_arch?: string;
  platform_type?: string;
  platform_release?: string;
  node_version?: string;
  node_version_major?: string;
  framework?: string;
  backend?: string;
  database?: string;
  orm?: string;
  styling?: string;
  packageManager?: string;
  sessionId?: string;
  source?: string;
}

/**
 * Framework usage data
 */
export interface FrameworkUsage {
  name: string;
  count: number;
  percentage: number;
}

/**
 * Feature usage data
 */
export interface FeatureUsage {
  name: string;
  count: number;
  percentage: number;
}

/**
 * Stack combination analysis
 */
export interface StackCombination {
  framework: string;
  backend: string;
  database: string;
  orm: string;
  styling: string;
  frequency: number;
  successRate: number;
  avgSetupTime: number;
}

/**
 * Developer experience metrics
 */
export interface DeveloperExperience {
  typeScriptAdoption: number;
  dockerUsage: number;
  gitInitRate: number;
  eslintEnabled: number;
  prettierEnabled: number;
  testingSetup: number;
  cicdConfigured: number;
}

/**
 * Performance metrics by package manager
 */
export interface PerformanceMetrics {
  avgProjectSetupTime: number;
  avgDependencyInstallTime: {
    npm: number;
    yarn: number;
    pnpm: number;
    bun: number;
  };
  successRates: {
    overall: number;
    byFramework: Record<string, number>;
    byPackageManager: Record<string, number>;
  };
}

/**
 * User journey analytics
 */
export interface UserJourney {
  entryPoint: "cli" | "website" | "github" | "unknown";
  completionRate: number;
  avgTimeToCompletion: number;
  dropoffPoints: string[];
  retryAttempts: number;
  commonPaths: Array<{
    path: string[];
    frequency: number;
  }>;
}

/**
 * AI and automation insights
 */
export interface AIAutomationMetrics {
  claudeIntegrationRate: number;
  mcpServerAdoption: Record<string, number>;
  aiAssistedProjects: number;
  automationFeatures: {
    docker: number;
    githubActions: number;
    cicd: number;
  };
}

/**
 * Error and recovery analytics
 */
export interface ErrorMetrics {
  commonErrors: Array<{
    type: string;
    message: string;
    frequency: number;
    avgTimeToResolve: number;
    resolution: string;
  }>;
  fallbackUsage: {
    bunToNpm: number;
    templateRetries: number;
    manualInterventions: number;
  };
  recoveryRate: number;
}

/**
 * Plugin ecosystem metrics
 */
export interface PluginMetrics {
  popularPlugins: Array<{
    name: string;
    usage: number;
    successRate: number;
  }>;
  pluginCombinations: Array<{
    plugins: string[];
    frequency: number;
  }>;
  authProviderPreferences: Record<string, number>;
  paymentIntegrations: Record<string, number>;
}

/**
 * Quality metrics
 */
export interface QualityMetrics {
  securityAuditPass: number;
  codeQualityTools: {
    eslint: number;
    prettier: number;
    husky: number;
    lintStaged: number;
  };
  testingFrameworks: Record<string, number>;
  documentationAdded: number;
}

/**
 * Template performance metrics
 */
export interface TemplateMetrics {
  templateUsage: Record<string, number>;
  avgGenerationTime: Record<string, number>;
  templateSuccessRate: Record<string, number>;
  totalTemplatesGenerated: number;
}

/**
 * User preference metrics
 */
export interface UserPreferenceMetrics {
  packageManagerPreferences: Record<string, number>;
  installModePreferences: Record<string, number>;
  workflowTypes: Record<string, number>;
  aiUsagePatterns: Record<string, number>;
}

/**
 * PostHog insight data
 */
export interface InsightData {
  id: string;
  name: string;
  type: string;
  results?: unknown;
}

/**
 * PostHog query types
 */
export interface PostHogQuery {
  kind: string;
  select?: string[];
  where?: string[];
  orderBy?: string[];
  limit?: number;
  [key: string]: unknown;
}

/**
 * PostHog query response
 */
export interface PostHogQueryResponse {
  results: unknown[];
  columns?: string[];
  types?: string[];
  [key: string]: unknown;
}

/**
 * PostHog API response types
 */
export interface PostHogEventResponse {
  results: PostHogEvent[];
  count: number;
}

export interface PostHogEvent {
  id: string;
  timestamp: string;
  event: string;
  properties: Record<string, unknown>;
  person?: {
    id: string;
    properties: Record<string, unknown>;
  };
}

export interface PostHogPersonResponse {
  results: PostHogPerson[];
  count: number;
}

export interface PostHogPerson {
  id: string;
  properties: Record<string, unknown>;
  created_at: string;
}

export interface PostHogInsightResponse {
  results: PostHogInsight[];
  count: number;
}

export interface PostHogInsight {
  id: number;
  name: string;
  description?: string;
  query?: unknown;
  result?: unknown;
}

/**
 * @module analytics
 * @description PostHog telemetry integration for Precast CLI
 */

import crypto from "crypto";
import { readFileSync, existsSync, writeFileSync } from "fs";
import os from "os";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

import { PostHog } from "posthog-node";

const POSTHOG_API_KEY = process.env.POSTHOG_API_KEY || "";
const POSTHOG_HOST = process.env.POSTHOG_HOST || "https://us.i.posthog.com";

const TELEMETRY_DISABLED_KEY = "PRECAST_TELEMETRY_DISABLED";
const SESSION_FILE = join(os.homedir(), ".precast-cli-session");
const TELEMETRY_CONFIG_FILE = join(os.homedir(), ".precast-telemetry");

// Buffer for analytics debug messages
const analyticsDebugBuffer: string[] = [];

export interface TelemetryEvent {
  framework?: string;
  backend?: string;
  database?: string;
  orm?: string;
  styling?: string;
  uiLibrary?: string;
  auth?: string;
  apiClient?: string;
  aiAssistant?: string;
  typescript?: boolean;
  docker?: boolean;
  git?: boolean;
  eslint?: boolean;
  prettier?: boolean;
  testing?: string;
  cicd?: boolean;
  powerups?: string[];
  mcpServers?: string[];
  plugins?: string[];
  duration?: number;
  success?: boolean;
  errorType?: string;
  errorMessage?: string;
  errorResolution?: string;
  packageManager?: string;
  entryPoint?: "cli" | "website" | "github";
  sessionId?: string;
  retryCount?: number;
  securityAuditPassed?: boolean;
  husky?: boolean;
  lintStaged?: boolean;
  documentation?: boolean;
  autoInstall?: boolean; // Track installation preference
  createdAt?: string; // ISO timestamp for project creation
  createdHour?: number; // Hour of day (0-23) for hourly distribution
  platform?: string; // Operating system platform
}

/**
 * Checks if telemetry collection is enabled
 * @returns {boolean} True if telemetry is enabled, false otherwise
 */
export function isTelemetryEnabled(): boolean {
  if (
    process.env[TELEMETRY_DISABLED_KEY] === "1" ||
    process.env[TELEMETRY_DISABLED_KEY] === "true"
  ) {
    return false;
  }

  if (process.env.CI === "true" || process.env.CONTINUOUS_INTEGRATION === "true") {
    return false;
  }

  try {
    if (existsSync(TELEMETRY_CONFIG_FILE)) {
      const config = JSON.parse(readFileSync(TELEMETRY_CONFIG_FILE, "utf-8"));
      if (config.disabled === true) {
        return false;
      }
    }
  } catch {
    // Ignore errors reading config file
  }

  return true;
}

/**
 * Gets or creates a persistent anonymous client ID for telemetry
 * @returns {string} The unique client identifier
 */
function getClientId(): string {
  try {
    if (existsSync(SESSION_FILE)) {
      return readFileSync(SESSION_FILE, "utf-8").trim();
    }
  } catch {
    // Continue with new ID generation
  }

  const clientId = crypto.randomUUID();

  try {
    writeFileSync(SESSION_FILE, clientId);
  } catch {
    // Non-critical error, proceed with generated ID
  }

  return clientId;
}

/**
 * Gets or creates a session ID for user journey tracking
 * Sessions expire after 30 minutes of inactivity
 * @returns {string} The current session identifier
 */
function getSessionId(): string {
  const SESSION_TIMEOUT = 30 * 60 * 1000;
  const sessionFile = join(os.tmpdir(), ".precast-session-current");

  try {
    if (existsSync(sessionFile)) {
      const data = JSON.parse(readFileSync(sessionFile, "utf-8"));
      const elapsed = Date.now() - data.timestamp;

      if (elapsed < SESSION_TIMEOUT) {
        data.timestamp = Date.now();
        writeFileSync(sessionFile, JSON.stringify(data));
        return data.sessionId;
      }
    }
  } catch {
    // Session invalid, create new one
  }

  const sessionId = crypto.randomUUID();
  const sessionData = {
    sessionId,
    timestamp: Date.now(),
    startTime: Date.now(),
  };

  try {
    writeFileSync(sessionFile, JSON.stringify(sessionData));
  } catch {
    // Non-critical error
  }

  return sessionId;
}

/**
 * Retrieves the CLI version from package.json
 * @returns {string} The CLI version or "unknown" if unavailable
 */
function getCliVersion(): string {
  try {
    // For development/testing, hardcode the version if we can't find package.json
    const CURRENT_VERSION = "0.1.31";

    // Get current file directory in ESM
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);

    // Try multiple possible locations for package.json
    const possiblePaths = [
      join(__dirname, "../../package.json"), // Built version (dist/utils -> package.json)
      join(__dirname, "../package.json"), // One level up
      join(__dirname, "../../../package.json"), // Alternative path
    ];

    // If we're in the CLI package directory during development
    if (__dirname.includes("packages/cli")) {
      // Split by packages/cli and reconstruct the path
      const rootPath = __dirname.split("packages/cli")[0];
      possiblePaths.unshift(
        join(rootPath, "packages/cli/package.json"),
        join(rootPath, "packages", "cli", "package.json")
      );
    }

    // Try src directory paths too (during development)
    if (__dirname.includes("/src/")) {
      const srcIndex = __dirname.indexOf("/src/");
      const packageRoot = __dirname.substring(0, srcIndex);
      possiblePaths.unshift(join(packageRoot, "package.json"));
    }

    for (const packageJsonPath of possiblePaths) {
      if (existsSync(packageJsonPath)) {
        const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf-8"));
        // Make sure it's the CLI package by checking the name
        if (packageJson.name === "create-precast-app") {
          return packageJson.version || CURRENT_VERSION;
        }
      }
    }

    // Fallback: try to get from environment variable if set during build
    if (process.env.CLI_VERSION) {
      return process.env.CLI_VERSION;
    }

    // Return hardcoded version as last resort (better than "unknown")
    return CURRENT_VERSION;
  } catch (error) {
    // Log error in debug mode only
    if (process.env.DEBUG_ANALYTICS) {
      console.error("[Analytics] Failed to get CLI version:", error);
    }
    // Return hardcoded version as fallback
    return "0.1.31";
  }
}

/**
 * Creates a PostHog client instance with privacy-focused settings
 * @returns {PostHog | null} PostHog client or null if telemetry is disabled
 */
function getPostHogClient(): PostHog | null {
  if (!isTelemetryEnabled() || !POSTHOG_API_KEY) {
    return null;
  }

  return new PostHog(POSTHOG_API_KEY, {
    host: POSTHOG_HOST,
    flushAt: 1,
    flushInterval: 0,
    privacyMode: true,
    disableGeoip: true,
  });
}

/**
 * Get buffered analytics debug messages
 * @returns {string[]} Array of buffered debug messages
 */
export function getAnalyticsDebugMessages(): string[] {
  return [...analyticsDebugBuffer];
}

/**
 * Clear analytics debug message buffer
 */
export function clearAnalyticsDebugBuffer(): void {
  analyticsDebugBuffer.length = 0;
}

/**
 * Sends telemetry event to PostHog with sanitized parameters
 * @param {string} eventName - The name of the event to track
 * @param {Record<string, any>} parameters - Event properties to send
 * @returns {Promise<void>}
 * @private
 */
async function sendToPostHog(eventName: string, parameters: Record<string, any>): Promise<void> {
  const client = getPostHogClient();
  if (!client) {
    if (process.env.DEBUG_ANALYTICS) {
      const msg = "Skipped - telemetry disabled or no API key";
      analyticsDebugBuffer.push(msg);
      // Only log to stderr if not in interactive mode
      if (!process.stdout.isTTY) {
        console.error(msg);
      }
    }
    return;
  }

  try {
    const cleanParams: Record<string, any> = {};
    for (const [key, value] of Object.entries(parameters)) {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          cleanParams[key] = value.join(",");
        } else if (typeof value === "boolean") {
          cleanParams[key] = value;
        } else {
          cleanParams[key] = String(value);
        }
      }
    }

    // Extract major Node.js version for grouping
    const nodeVersionFull = process.version.replace("v", "");
    const nodeVersionMajor = parseInt(nodeVersionFull.split(".")[0], 10);

    // Get detailed platform information
    const platformInfo = {
      os: os.platform(), // 'darwin', 'win32', 'linux', etc.
      os_release: os.release(),
      os_arch: os.arch(), // 'x64', 'arm64', etc.
      os_type: os.type(), // 'Darwin', 'Windows_NT', 'Linux'
    };

    // Map platform to friendly names for charts
    const platformMap: Record<string, string> = {
      darwin: "macOS",
      win32: "Windows",
      linux: "Linux",
      freebsd: "FreeBSD",
      openbsd: "OpenBSD",
      sunos: "Solaris",
      aix: "AIX",
      android: "Android",
      cygwin: "Cygwin",
      haiku: "Haiku",
      netbsd: "NetBSD",
    };
    const platformDisplay = platformMap[platformInfo.os] || platformInfo.os;

    const eventData = {
      distinctId: getClientId(),
      event: eventName,
      properties: {
        ...cleanParams,
        sessionId: getSessionId(),
        source: "cli",
        cli_version: getCliVersion(),
        cli_version_major: getCliVersion().split(".")[0], // Major version for grouping
        platform: platformInfo.os,
        platform_display: platformDisplay, // For PLATFORM.PIE chart
        platform_arch: platformInfo.os_arch, // For architecture distribution
        platform_type: platformInfo.os_type, // For detailed OS type
        platform_release: platformInfo.os_release, // OS version/release info
        node_version: nodeVersionFull,
        node_version_major: nodeVersionMajor, // For NODE_VERSIONS.BAR chart
        $ip: null,
      },
    };

    if (process.env.DEBUG_ANALYTICS) {
      const msg1 = `Sending event: ${eventName}`;
      // Show ALL properties being sent to PostHog, not just cleanParams
      const msg2 = `Properties: ${JSON.stringify(eventData.properties, null, 2)}`;
      analyticsDebugBuffer.push(msg1);
      analyticsDebugBuffer.push(msg2);
      // Only log to stderr if not in interactive mode
      if (!process.stdout.isTTY) {
        console.error(`[Analytics] ${msg1}`);
        console.error(`[Analytics] ${msg2}`);
      }
    }

    client.capture(eventData);
    await client.shutdown();

    if (process.env.DEBUG_ANALYTICS) {
      const msg = `✓ Event sent successfully`;
      analyticsDebugBuffer.push(msg);
      // Only log to stderr if not in interactive mode
      if (!process.stdout.isTTY) {
        console.error(`[Analytics] ${msg}`);
      }
    }
  } catch (error) {
    if (process.env.DEBUG_ANALYTICS) {
      const msg = `Failed to send event: ${error}`;
      analyticsDebugBuffer.push(msg);
      // Only log to stderr if not in interactive mode
      if (!process.stdout.isTTY) {
        console.error(`[Analytics] ${msg}`);
      }
    }
  }
}

/**
 * Tracks project creation event with comprehensive metrics
 * @param {TelemetryEvent} config - Project configuration and metadata
 * @returns {Promise<void>}
 */
export async function trackProjectCreation(config: TelemetryEvent): Promise<void> {
  const startTime = Date.now();
  const creationDate = new Date();

  const eventParams: Record<string, any> = {
    framework: config.framework || "unknown",
    backend: config.backend || "none",
    database: config.database || "none",
    orm: config.orm || "none",
    styling: config.styling || "css",
    ui_library: config.uiLibrary || "none",
    authProvider: config.auth || "none",
    apiClient: config.apiClient || "none",
    aiAssistant: config.aiAssistant || "none",
    typescript: config.typescript === true,
    docker: config.docker === true,
    git: config.git === true,
    eslint: config.eslint === true,
    prettier: config.prettier === true,
    testing: config.testing || "none",
    cicd: config.cicd === true,
    husky: config.husky === true,
    lintStaged: config.lintStaged === true,
    documentation: config.documentation === true,
    powerups: config.powerups?.join(",") || "",
    mcpServers: config.mcpServers?.join(",") || "",
    plugins: config.plugins?.join(",") || "",
    duration: config.duration || Date.now() - startTime,
    packageManager: config.packageManager || "npm",
    autoInstall: config.autoInstall === true, // For INSTALL_PREFERENCE.PIE chart
    createdAt: config.createdAt || creationDate.toISOString(), // ISO timestamp
    createdHour: config.createdHour !== undefined ? config.createdHour : creationDate.getUTCHours(), // Hour (0-23) for hourly distribution
    createdDate: creationDate.toISOString().split("T")[0], // YYYY-MM-DD for daily aggregation
    createdWeekday: creationDate.getUTCDay(), // 0-6 (Sunday-Saturday)
    platform: config.platform || os.platform(), // Platform distribution
    success: config.success !== false,
    entryPoint: config.entryPoint || "cli",
    retryCount: config.retryCount || 0,
    securityAuditPassed: config.securityAuditPassed,
  };

  await sendToPostHog("project_created", eventParams);

  if (config.success !== false) {
    await sendToPostHog("project_completed", eventParams);
  }
}

/**
 * Tracks when a feature is added to a project
 * @param {string} feature - The name of the feature being added
 * @param {Record<string, any>} [details] - Additional feature details
 * @returns {Promise<void>}
 */
export async function trackFeatureAdded(
  feature: string,
  details?: Record<string, any>
): Promise<void> {
  await sendToPostHog("feature_added", {
    feature_name: feature,
    ...details,
  });
}

/**
 * Tracks CLI command usage
 * @param {string} command - The command being executed
 * @param {Record<string, any>} [options] - Command options and parameters
 * @returns {Promise<void>}
 */
export async function trackCommand(command: string, options?: Record<string, any>): Promise<void> {
  await sendToPostHog(`command_${command}`, options || {});
}

/**
 * Tracks errors that occur during CLI operations
 * @param {string} errorType - The type/category of error
 * @param {Record<string, any>} [details] - Error details and context
 * @returns {Promise<void>}
 */
export async function trackError(errorType: string, details?: Record<string, any>): Promise<void> {
  await sendToPostHog("error_occurred", {
    errorType: errorType,
    errorMessage: details?.message || "",
    errorStack: details?.stack || "",
    context: details?.context || "",
    ...details,
  });
}

/**
 * Tracks successful error recovery
 * @param {string} errorType - The type of error that was recovered from
 * @param {string} resolution - How the error was resolved
 * @param {number} [resolutionTime] - Time taken to resolve in milliseconds
 * @returns {Promise<void>}
 */
export async function trackErrorRecovery(
  errorType: string,
  resolution: string,
  resolutionTime?: number
): Promise<void> {
  await sendToPostHog("error_recovered", {
    errorType,
    resolution,
    resolutionTime: resolutionTime || 0,
  });
}

/**
 * Tracks when fallback mechanisms are triggered
 * @param {"bun_to_npm" | "template_retry" | "manual_intervention"} fallbackType - Type of fallback used
 * @param {Record<string, any>} [details] - Additional context about the fallback
 * @returns {Promise<void>}
 */
export async function trackFallback(
  fallbackType: "bun_to_npm" | "template_retry" | "manual_intervention",
  details?: Record<string, any>
): Promise<void> {
  await sendToPostHog("fallback_triggered", {
    fallbackType,
    ...details,
  });
}

/**
 * Tracks dependency installation metrics
 * @param {string} packageManager - The package manager used (npm, yarn, pnpm, bun)
 * @param {number} duration - Installation duration in milliseconds
 * @param {boolean} success - Whether installation succeeded
 * @param {number} [packageCount] - Number of packages installed
 * @returns {Promise<void>}
 */
export async function trackDependencyInstall(
  packageManager: string,
  duration: number,
  success: boolean,
  packageCount?: number,
  context?: string
): Promise<void> {
  const eventData: any = {
    packageManager,
    duration,
    success,
    packageCount: packageCount || 0,
  };

  // Add context if provided
  if (context) {
    eventData.installationContext = context;
  }

  await sendToPostHog("dependencies_installed", eventData);
}

/**
 * Tracks security audit results
 * @param {boolean} passed - Whether the audit passed
 * @param {number} [vulnerabilities] - Number of vulnerabilities found
 * @param {boolean} [autoFixed] - Whether vulnerabilities were automatically fixed
 * @returns {Promise<void>}
 */
export async function trackSecurityAudit(
  passed: boolean,
  vulnerabilities?: number,
  autoFixed?: boolean
): Promise<void> {
  await sendToPostHog("security_audit_completed", {
    passed,
    vulnerabilities: vulnerabilities || 0,
    autoFixed: autoFixed || false,
  });
}

/**
 * Tracks performance-related metrics
 * @param {string} metric - The metric being measured
 * @param {number} value - The metric value
 * @param {Record<string, any>} [context] - Additional context
 * @returns {Promise<void>}
 */
export async function trackPerformance(
  metric: string,
  value: number,
  context?: Record<string, any>
): Promise<void> {
  await sendToPostHog("performance_measured", {
    metric,
    value,
    ...context,
  });
}

/**
 * Tracks template generation metrics
 * @param {string} template - The template being generated
 * @param {number} fileCount - Number of files generated
 * @param {number} duration - Generation duration in milliseconds
 * @param {boolean} success - Whether generation succeeded
 * @returns {Promise<void>}
 */
export async function trackTemplateGeneration(
  template: string,
  fileCount: number,
  duration: number,
  success: boolean
): Promise<void> {
  await sendToPostHog("template_generated", {
    template,
    fileCount,
    duration,
    success,
  });
}

/**
 * Tracks user preferences and choices
 * @param {string} preferenceType - Type of preference (e.g., 'package_manager', 'install_mode')
 * @param {string} value - The chosen value
 * @param {Record<string, any>} [context] - Additional context
 * @returns {Promise<void>}
 */
export async function trackUserPreference(
  preferenceType: string,
  value: string,
  context?: Record<string, any>
): Promise<void> {
  await sendToPostHog("user_preference", {
    preferenceType,
    value,
    ...context,
  });
}

/**
 * Tracks project customization metrics
 * @param {string} customizationType - Type of customization
 * @param {string} value - The customization value
 * @param {Record<string, any>} [details] - Additional details
 * @returns {Promise<void>}
 */
export async function trackProjectCustomization(
  customizationType: string,
  value: string,
  details?: Record<string, any>
): Promise<void> {
  await sendToPostHog("project_customized", {
    customizationType,
    value,
    ...details,
  });
}

/**
 * Tracks CLI usage patterns and workflows
 * @param {string} workflowType - Type of workflow (e.g., 'quick_start', 'full_customization')
 * @param {string[]} steps - Steps taken in the workflow
 * @param {number} totalTime - Total time for workflow in milliseconds
 * @returns {Promise<void>}
 */
export async function trackWorkflow(
  workflowType: string,
  steps: string[],
  totalTime: number
): Promise<void> {
  await sendToPostHog("workflow_completed", {
    workflowType,
    steps: steps.join(" → "),
    stepCount: steps.length,
    totalTime,
  });
}

/**
 * Tracks AI assistant usage
 * @param {string} action - AI action performed
 * @param {string} assistant - AI assistant used
 * @param {Record<string, any>} [context] - Additional context
 * @returns {Promise<void>}
 */
export async function trackAIUsage(
  action: string,
  assistant: string,
  context?: Record<string, any>
): Promise<void> {
  await sendToPostHog("ai_assistant_used", {
    action,
    assistant,
    ...context,
  });
}

/**
 * Displays telemetry opt-out notice to first-time users
 * @returns {void}
 */
export function displayTelemetryNotice(): void {
  if (!isTelemetryEnabled()) {
    return;
  }

  try {
    if (existsSync(TELEMETRY_CONFIG_FILE)) {
      return;
    }
  } catch {
    // Show notice on error
  }

  console.log(`
  📊 Precast collects anonymous usage data to improve the CLI.
     No personal information or IP addresses are collected.
     
     To opt-out: create-precast-app telemetry disable
     Or set: export PRECAST_TELEMETRY_DISABLED=1
     
     Learn more: https://precast.dev/docs/telemetry
  `);
}

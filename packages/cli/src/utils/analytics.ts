/**
 * Google Analytics 4 telemetry for Precast CLI
 */

import crypto from "crypto";
import { readFileSync, existsSync, writeFileSync } from "fs";
import os from "os";
import { join } from "path";

const GA_MEASUREMENT_ID = "G-4S73687P86";
const GA_API_SECRET = "";
const GA_ENDPOINT = "https://www.google-analytics.com/mp/collect";
const TELEMETRY_DISABLED_KEY = "PRECAST_TELEMETRY_DISABLED";
const SESSION_FILE = join(os.homedir(), ".precast-cli-session");

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
  powerups?: string[];
  mcpServers?: string[];
  duration?: number;
  success?: boolean;
  errorType?: string;
}

/**
 * Check if telemetry is enabled
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

  return true;
}

/**
 * Get or create a persistent anonymous client ID
 */
function getClientId(): string {
  try {
    if (existsSync(SESSION_FILE)) {
      return readFileSync(SESSION_FILE, "utf-8").trim();
    }
  } catch {
    // Ignore read errors
  }

  const clientId = crypto.randomUUID();

  try {
    writeFileSync(SESSION_FILE, clientId);
  } catch {
    // Ignore write errors
  }

  return clientId;
}

/**
 * Get CLI version
 */
function getCliVersion(): string {
  try {
    const packageJsonPath = join(__dirname, "../../package.json");
    const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf-8"));
    return packageJson.version || "unknown";
  } catch {
    return "unknown";
  }
}

/**
 * Send event to Google Analytics 4
 */
async function sendToGA4(eventName: string, parameters: Record<string, any>): Promise<void> {
  if (!isTelemetryEnabled()) {
    return;
  }

  try {
    const url = new URL(GA_ENDPOINT);
    url.searchParams.append("measurement_id", GA_MEASUREMENT_ID);
    if (GA_API_SECRET) {
      url.searchParams.append("api_secret", GA_API_SECRET);
    }

    const cleanParams: Record<string, any> = {};
    for (const [key, value] of Object.entries(parameters)) {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          cleanParams[key] = value.join(",");
        } else {
          cleanParams[key] = String(value);
        }
      }
    }

    const payload = {
      client_id: getClientId(),
      events: [
        {
          name: eventName,
          params: {
            ...cleanParams,
            cli_version: getCliVersion(),
            platform: os.platform(),
            node_version: process.version.replace("v", ""),
            engagement_time_msec: "100",
          },
        },
      ],
    };

    fetch(url.toString(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }).catch(() => {
      // Ignore fetch errors
    });
  } catch {
    // Never break CLI
  }
}

/**
 * Track project creation
 */
export async function trackProjectCreation(config: TelemetryEvent): Promise<void> {
  const startTime = Date.now();

  const gaParams: Record<string, any> = {
    framework: config.framework,
    backend: config.backend,
    database: config.database,
    orm: config.orm,
    styling: config.styling,
    ui_library: config.uiLibrary,
    auth_provider: config.auth,
    api_client: config.apiClient,
    ai_assistant: config.aiAssistant,
    has_typescript: config.typescript,
    has_docker: config.docker,
    has_git: config.git,
    powerups: config.powerups?.join(",") || "",
    mcp_servers: config.mcpServers?.join(",") || "",
    duration_ms: config.duration || Date.now() - startTime,
    success: config.success !== false,
  };

  await sendToGA4("project_created", gaParams);
}

/**
 * Track feature addition
 */
export async function trackFeatureAdded(
  feature: string,
  details?: Record<string, any>
): Promise<void> {
  await sendToGA4("feature_added", {
    feature_name: feature,
    ...details,
  });
}

/**
 * Track command usage
 */
export async function trackCommand(command: string, options?: Record<string, any>): Promise<void> {
  await sendToGA4(`command_${command}`, options || {});
}

/**
 * Track errors (anonymous)
 */
export async function trackError(errorType: string, details?: Record<string, any>): Promise<void> {
  await sendToGA4("cli_error", {
    error_type: errorType,
    ...details,
  });
}

/**
 * Display telemetry notice to users
 */
export function displayTelemetryNotice(): void {
  if (!isTelemetryEnabled()) {
    return;
  }

  console.log(`
  📊 Precast collects anonymous usage data to improve the CLI.
     No personal information is collected.
     
     To opt-out: export PRECAST_TELEMETRY_DISABLED=1
     Learn more: https://precast.dev/docs/telemetry
  `);
}

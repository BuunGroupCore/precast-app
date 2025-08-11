import { homedir } from "os";
import { join } from "path";

import fsExtra from "fs-extra";
// eslint-disable-next-line import/no-named-as-default-member
const { readFile, writeFile, pathExists } = fsExtra;

import { isTelemetryEnabled } from "../utils/analytics.js";
import {
  theme,
  createHeroBanner,
  createFancyBox,
  divider,
  createLink,
  comicDecorations,
} from "../utils/cli-theme.js";

const TELEMETRY_CONFIG_FILE = join(homedir(), ".precast-telemetry");

interface TelemetryConfig {
  disabled: boolean;
  timestamp: string;
}

/**
 * Read telemetry configuration from user's home directory
 * @returns Promise<TelemetryConfig | null> - Configuration object or null if not found
 */
async function readTelemetryConfig(): Promise<TelemetryConfig | null> {
  try {
    if (await pathExists(TELEMETRY_CONFIG_FILE)) {
      const content = await readFile(TELEMETRY_CONFIG_FILE, "utf-8");
      return JSON.parse(content);
    }
  } catch {
    // Silently ignore errors
  }
  return null;
}

/**
 * Write telemetry configuration to user's home directory
 * @param config - Configuration object to save
 */
async function writeTelemetryConfig(config: TelemetryConfig): Promise<void> {
  try {
    await writeFile(TELEMETRY_CONFIG_FILE, JSON.stringify(config, null, 2));
  } catch {
    console.log();
    const errorBox = createFancyBox(
      `${theme.error("❌ Configuration Error")}\n\n` +
        `Failed to save telemetry configuration\n\n` +
        `${theme.info("💡 This won't affect CLI functionality")}`,
      "⚠️  Config Save Failed"
    );
    console.log(errorBox);
    console.log();
  }
}

/**
 * Get shell configuration file path based on current shell environment
 * @returns string - Path to the appropriate shell config file
 */
function getShellConfigFile(): string {
  const shell = process.env.SHELL || "";

  if (shell.includes("zsh")) {
    return join(homedir(), ".zshrc");
  } else if (shell.includes("bash")) {
    const profilePath = join(homedir(), ".bash_profile");
    const rcPath = join(homedir(), ".bashrc");

    if (process.platform === "darwin") {
      return profilePath;
    }
    return rcPath;
  } else if (shell.includes("fish")) {
    return join(homedir(), ".config", "fish", "config.fish");
  }

  return join(homedir(), ".bashrc");
}

/**
 * Telemetry command handler with beautiful UI
 * @param action - Action to perform: status, enable, or disable
 */
export async function telemetryCommand(action?: string): Promise<void> {
  const validActions = ["status", "enable", "disable"];

  if (!action) {
    action = "status";
  }

  if (!validActions.includes(action)) {
    console.log();
    const errorBox = createFancyBox(
      `${theme.error("❌ Invalid Action")}\n\n` +
        `Action "${action}" is not recognized\n\n` +
        `${theme.info("💡 Valid actions:")}\n` +
        `  • ${theme.accent("status")} - Check current telemetry status\n` +
        `  • ${theme.accent("enable")} - Enable telemetry data collection\n` +
        `  • ${theme.accent("disable")} - Disable telemetry data collection`,
      "⚠️  Command Error"
    );
    console.log(errorBox);
    console.log();
    process.exit(1);
  }

  const heroBanner = await createHeroBanner("TELEMETRY", `📊 Privacy & data collection settings`);
  console.log();
  console.log(heroBanner);
  console.log();

  switch (action) {
    case "status": {
      const isEnabled = isTelemetryEnabled();
      const config = await readTelemetryConfig();

      const statusContent = isEnabled
        ? `${theme.success("✅ TELEMETRY ENABLED")} ${comicDecorations.rocket}\n\n` +
          `The CLI collects ${theme.bold("anonymous usage data")} to improve the tool.\n` +
          `${theme.info("🔒 No personal information")} is ever collected.\n\n` +
          `${theme.accent("🎯 What we collect:")}\n` +
          `  • Framework choices (React, Vue, etc.)\n` +
          `  • Feature usage patterns\n` +
          `  • Error frequencies (anonymous)\n` +
          `  • Performance metrics\n\n` +
          `${theme.muted("💡 To opt-out:")}\n` +
          `${theme.bold("create-precast-app telemetry disable")}`
        : `${theme.error("❌ TELEMETRY DISABLED")} ${comicDecorations.pow}\n\n` +
          `No usage data is being collected.\n` +
          `You've opted out of anonymous analytics.\n\n` +
          `${theme.muted("💡 To help us improve:")}\n` +
          `${theme.bold("create-precast-app telemetry enable")}`;

      const statusBox = createFancyBox(statusContent, "📊 Current Status");
      console.log(statusBox);
      console.log();

      if (config) {
        const configInfo = `Configuration saved: ${theme.dim(
          new Date(config.timestamp).toLocaleDateString()
        )}`;
        console.log(theme.muted(`  ${configInfo}`));
        console.log();
      }

      if (process.env.PRECAST_TELEMETRY_DISABLED) {
        const envInfo = createFancyBox(
          `${theme.warning("⚠️  Environment Override")}\n\n` +
            `The ${theme.bold("PRECAST_TELEMETRY_DISABLED")} environment variable is set.\n` +
            `This overrides any local configuration.`,
          "🌍 Environment Variable"
        );
        console.log(envInfo);
        console.log();
      }

      console.log(theme.muted(divider()));
      console.log(
        theme.muted(
          `  Learn more: ${createLink("telemetry docs", "https://precast.dev/docs/telemetry")}`
        )
      );
      console.log();
      break;
    }

    case "disable": {
      await writeTelemetryConfig({
        disabled: true,
        timestamp: new Date().toISOString(),
      });

      const shellConfigFile = getShellConfigFile();
      const exportLine = "export PRECAST_TELEMETRY_DISABLED=1";

      const successContent =
        `${theme.success("✅ TELEMETRY DISABLED")} ${comicDecorations.pow}\n\n` +
        `Analytics collection has been turned off.\n` +
        `Your privacy preferences have been saved locally.\n\n` +
        `${theme.info("🔒 Privacy guaranteed:")} No data will be collected.`;

      const successBox = createFancyBox(successContent, "🎯 Mission Accomplished");
      console.log(successBox);
      console.log();

      const shellContent =
        `${theme.bold("Make it permanent across terminal sessions:")}\n\n` +
        `${theme.muted("Add to")} ${theme.accent(shellConfigFile)}\n` +
        `${theme.bold(exportLine)}\n\n` +
        `${theme.muted("Quick command:")}\n` +
        `${theme.info(`echo '${exportLine}' >> ${shellConfigFile}`)}\n\n` +
        `${theme.muted("💡 The local setting is already active for this session!")}`;

      const shellBox = createFancyBox(shellContent, "🐚 Shell Configuration");
      console.log(shellBox);
      console.log();

      console.log(theme.muted(divider()));
      console.log(theme.muted(`  ${theme.bold("Thank you")} for using Precast! 🎉`));
      console.log();
      break;
    }

    case "enable": {
      await writeTelemetryConfig({
        disabled: false,
        timestamp: new Date().toISOString(),
      });

      const shellConfigFile = getShellConfigFile();

      const enableContent =
        `${theme.success("✅ TELEMETRY ENABLED")} ${comicDecorations.super}\n\n` +
        `Thank you for helping us improve Precast! 🎉\n\n` +
        `${theme.info("🎯 What this enables:")}\n` +
        `  • Anonymous usage analytics\n` +
        `  • Error frequency tracking (no personal data)\n` +
        `  • Feature usage patterns\n` +
        `  • Performance improvements based on real usage\n\n` +
        `${theme.muted("🔒 Privacy guaranteed:")} No personal information is collected.`;

      const enableBox = createFancyBox(enableContent, "🚀 Analytics Activated");
      console.log(enableBox);
      console.log();

      if (process.env.PRECAST_TELEMETRY_DISABLED) {
        const warningContent =
          `${theme.warning("⚠️  ENVIRONMENT VARIABLE OVERRIDE")}\n\n` +
          `The ${theme.bold("PRECAST_TELEMETRY_DISABLED")} environment variable is still set.\n` +
          `This will override your local configuration.\n\n` +
          `${theme.bold("To fully enable telemetry:")}\n\n` +
          `${theme.muted("Remove from")} ${theme.accent(shellConfigFile)}\n` +
          `${theme.dim("export PRECAST_TELEMETRY_DISABLED=1")}\n\n` +
          `${theme.muted("Or unset for this session:")}\n` +
          `${theme.info("unset PRECAST_TELEMETRY_DISABLED")}`;

        const warningBox = createFancyBox(warningContent, "🌍 Environment Override");
        console.log(warningBox);
        console.log();
      }

      console.log(theme.muted(divider()));
      console.log(
        theme.muted(
          `  Learn more: ${createLink("what we collect", "https://precast.dev/docs/telemetry")}`
        )
      );
      console.log();
      break;
    }
  }
}

/**
 * Check if telemetry notice should be displayed to new users
 * @returns Promise<boolean> - True if notice should be shown, false otherwise
 */
export async function shouldShowTelemetryNotice(): Promise<boolean> {
  if (!isTelemetryEnabled()) {
    return false;
  }

  const config = await readTelemetryConfig();
  if (config) {
    return false;
  }

  return true;
}

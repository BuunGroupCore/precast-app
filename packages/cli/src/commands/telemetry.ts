import { homedir } from "os";
import { join } from "path";

import { select, confirm } from "@clack/prompts";
import chalk from "chalk";
import cliWidth from "cli-width";
import fsExtra from "fs-extra";
import { createSpinner } from "nanospinner";

const { readFile, writeFile, pathExists } = fsExtra;

import { isTelemetryEnabled } from "@/utils/analytics/analytics.js";
import { createFancyBox, theme } from "@/utils/ui/cli-theme.js";
import { PrecastBanner } from "@/utils/ui/precast-banner.js";

const TELEMETRY_CONFIG_FILE = join(homedir(), ".precast-telemetry");

interface TelemetryConfig {
  disabled: boolean;
  timestamp: string;
}

/**
 * Sleep helper
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Create a beautiful full-width table with comic book styling
 */
function createTable(title: string, rows: [string, string][], color: string = "#ffd600"): string {
  const termWidth = cliWidth({ defaultWidth: 80 });
  const tableWidth = Math.min(termWidth - 4, 70);
  const maxKeyLength = Math.max(...rows.map((r) => r[0].length), 15);
  const maxValueLength = tableWidth - maxKeyLength - 7;

  let output = "";

  // Top border
  output += chalk.hex(color).bold("╔" + "═".repeat(tableWidth - 2) + "╗") + "\n";

  // Title row - handle emoji display width manually
  const titleClean = title.replace(/\x1b\[[0-9;]*m/g, ""); // eslint-disable-line no-control-regex
  // Count visual characters and add extra width for emojis (they display wider)
  const chars = [...titleClean];
  const emojiCount = chars.filter((char) =>
    char.match(/[\u{1F000}-\u{1FFFF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/u)
  ).length;
  const visualLength = chars.length + emojiCount; // Each emoji takes roughly 2 character widths
  const totalPadding = tableWidth - visualLength - 2;
  let leftPadding = Math.floor(totalPadding / 2);
  let rightPadding = totalPadding - leftPadding;

  // Manual adjustment for specific titles that need tweaking
  if (titleClean.includes("TELEMETRY STATUS")) {
    leftPadding += 2;
    rightPadding -= 2;
  }

  output +=
    chalk.hex(color).bold("║") +
    " ".repeat(leftPadding) +
    chalk.hex("#ff1744").bold(title) +
    " ".repeat(rightPadding) +
    chalk.hex(color).bold("║") +
    "\n";

  // Separator
  output += chalk.hex(color).bold("╠" + "═".repeat(tableWidth - 2) + "╣") + "\n";

  // Data rows
  rows.forEach((row) => {
    const [key, value] = row;
    const formattedKey = chalk.hex("#2962ff").bold(key.padEnd(maxKeyLength));
    const formattedValue = chalk.white(value.substring(0, maxValueLength).padEnd(maxValueLength));

    output +=
      chalk.hex(color)("║ ") +
      formattedKey +
      chalk.hex("#9e9e9e")(" │ ") +
      formattedValue +
      " " +
      chalk.hex(color)("║") +
      "\n";
  });

  // Bottom border
  output += chalk.hex(color).bold("╚" + "═".repeat(tableWidth - 2) + "╝");

  return output;
}

/**
 * Animated text reveal
 */
async function animatedReveal(text: string, delay: number = 20): Promise<void> {
  const lines = text.split("\n");
  for (const line of lines) {
    console.log(line);
    await sleep(delay);
  }
}

/**
 * Create loading animation
 */
async function showLoadingAnimation(message: string, duration: number = 1000): Promise<void> {
  const spinner = createSpinner(message).start({
    color: "yellow",
  });

  const colors = ["yellow", "cyan", "green", "magenta", "blue", "red"] as const;
  let colorIndex = 0;

  const colorInterval = setInterval(() => {
    spinner.update({ color: colors[colorIndex] });
    colorIndex = (colorIndex + 1) % colors.length;
  }, 200);

  await sleep(duration);

  clearInterval(colorInterval);
  spinner.success({ text: chalk.hex("#00e676").bold("✓") + " " + chalk.white(message), mark: " " });
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
    // Ignore errors
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
      `${theme.error("✗ Configuration Error")}\n\n` +
        `Failed to save telemetry configuration\n\n` +
        `${theme.info("ⓘ This won't affect CLI functionality")}`,
      "[WARN] Config Save Failed"
    );
    console.log(errorBox);
    console.log();
  }
}

/**
 * Get shell configuration file path based on current shell environment
 * @returns string - Path to the appropriate shell config file
 */
function _getShellConfigFile(): string {
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
 * Enhanced telemetry command with table-based UI and interactive toggle
 * @param action - Action to perform: status, enable, disable, or undefined for interactive mode
 */
export async function telemetryCommand(action?: string): Promise<void> {
  try {
    // Show banner
    await PrecastBanner.show({
      subtitle: "TELEMETRY SETTINGS",
      gradient: false,
    });

    // Load current configuration
    await showLoadingAnimation("Loading telemetry configuration", 500);
    const isEnabled = isTelemetryEnabled();
    const config = await readTelemetryConfig();

    console.log();

    // Status table
    const statusIcon = isEnabled ? "✓" : "✗";
    const statusText = isEnabled ? "Enabled" : "Disabled";
    const statusColor = isEnabled ? "#00e676" : "#ff1744";
    const lastUpdated = config ? new Date(config.timestamp).toLocaleDateString() : "Never";
    const envOverride = process.env.PRECAST_TELEMETRY_DISABLED ? "Yes" : "No";

    const statusRows: [string, string][] = [
      ["Status", statusText],
      ["Last Updated", lastUpdated],
      ["Environment Override", envOverride],
      ["Privacy Level", "Anonymous Only"],
    ];

    const statusTable = createTable(
      `[DATA] TELEMETRY STATUS ${statusIcon}`,
      statusRows,
      statusColor
    );
    await animatedReveal(statusTable, 15);
    console.log();

    // Data collection info table
    const dataRows: [string, string][] = [
      ["Framework Choices", "React, Vue, Angular, etc."],
      ["Feature Usage", "Auth providers, databases, etc."],
      ["Error Patterns", "Anonymous error frequencies"],
      ["Performance Metrics", "Build times, installation speed"],
      ["Personal Data", "NEVER collected"],
    ];

    const dataTable = createTable("[INFO] WHAT WE COLLECT", dataRows, "#aa00ff");
    await animatedReveal(dataTable, 15);
    console.log();

    // Handle specific actions
    if (action === "enable" || action === "disable") {
      const newState = action === "enable";
      await showLoadingAnimation(`${newState ? "Enabling" : "Disabling"} telemetry`, 800);

      await writeTelemetryConfig({
        disabled: !newState,
        timestamp: new Date().toISOString(),
      });

      console.log();
      const message = newState
        ? chalk.hex("#00e676").bold("✓ Telemetry enabled! Thank you for helping improve Precast.")
        : chalk.hex("#ff1744").bold("✓ Telemetry disabled. Your privacy choice has been saved.");

      console.log(`  ${message}`);
      console.log();
      return;
    }

    // Interactive mode if no action specified
    if (!action) {
      console.log(chalk.hex("#ffd600").bold("  [CFG] TELEMETRY SETTINGS"));
      console.log();

      const choices = [
        {
          value: isEnabled ? "disable" : "enable",
          label: isEnabled
            ? `${chalk.hex("#ff1744")("✗")} Disable telemetry`
            : `${chalk.hex("#00e676")("✓")} Enable telemetry`,
          hint: isEnabled ? "Turn off data collection" : "Help improve Precast",
        },
        {
          value: "exit",
          label: `${chalk.hex("#9e9e9e")("↵")} Exit (Press Enter)`,
          hint: "Keep current settings",
        },
      ];

      const choice = await select({
        message: "What would you like to do?",
        options: choices,
      });

      if (choice === "exit" || typeof choice === "symbol") {
        console.log();
        console.log(chalk.hex("#9e9e9e")("  Settings unchanged. Have a great day!"));
        console.log();
        return;
      }

      // Confirm the action
      const confirmMessage =
        choice === "enable"
          ? "Enable anonymous telemetry to help improve Precast?"
          : "Disable telemetry data collection?";

      const shouldProceed = await confirm({
        message: confirmMessage,
        initialValue: choice === "enable",
      });

      if (!shouldProceed || typeof shouldProceed === "symbol") {
        console.log();
        console.log(chalk.hex("#9e9e9e")("  Operation cancelled. Settings unchanged."));
        console.log();
        return;
      }

      // Apply the change
      const newState = choice === "enable";
      await showLoadingAnimation(`${newState ? "Enabling" : "Disabling"} telemetry`, 800);

      await writeTelemetryConfig({
        disabled: !newState,
        timestamp: new Date().toISOString(),
      });

      console.log();
      const message = newState
        ? chalk.hex("#00e676").bold("✓ Telemetry enabled! Thank you for helping improve Precast.")
        : chalk.hex("#ff1744").bold("✓ Telemetry disabled. Your privacy choice has been saved.");

      console.log(`  ${message}`);

      if (newState) {
        console.log(
          chalk.hex("#9e9e9e")("  [DOCS] Learn more: https://precast.dev/docs/telemetry")
        );
      }
      console.log();
    }
  } catch (error) {
    console.log();
    console.log(chalk.hex("#ff1744").bold("[ERR] Error managing telemetry settings"));
    console.log(
      chalk.hex("#ff1744")(`  ✗ ${error instanceof Error ? error.message : "Unknown error"}`)
    );
    console.log();
    process.exit(1);
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

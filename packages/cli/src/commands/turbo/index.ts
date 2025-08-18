/**
 * Turbo Command - Main entry point for all Turbo operations
 * Handles subcommands: build, dev
 */

import { Command } from "commander";
import chalk from "chalk";

import { theme, createFancyBox, statusSymbols, actionSymbols } from "@/utils/ui/cli-theme.js";
import { PrecastBanner } from "@/utils/ui/precast-banner.js";
import { turboBuildCommand } from "./build.js";
import { devCommand } from "./dev.js";

interface TurboOptions {
  help?: boolean;
}

/**
 * Main turbo command handler
 * Routes to appropriate subcommand or shows help
 */
export async function turboCommand(subcommand?: string, options?: TurboOptions): Promise<void> {
  try {
    // Handle help or no subcommand
    if (options?.help || !subcommand) {
      await showTurboHelp();
      return;
    }

    // Route to appropriate subcommand
    switch (subcommand) {
      case "build":
        await turboBuildCommand();
        break;
      case "dev":
        await devCommand();
        break;
      default:
        console.log();
        const errorBox = createFancyBox(
          `${theme.error(`${statusSymbols.error} Unknown Turbo Command`)}\n\n` +
            `Unknown subcommand: ${theme.accent(subcommand)}\n\n` +
            `${theme.info(`${statusSymbols.info} Available commands:`)}\n` +
            `• ${theme.bold("build")} ${theme.muted("- Run Turbo build with TUI dashboard")}\n` +
            `• ${theme.bold("dev")} ${theme.muted("- Run Turbo dev with task interaction")}\n\n` +
            `${theme.accent("◆ Usage:")}\n` +
            `${theme.bold("create-precast-app turbo <command>")}`,
          "[TURBO] Invalid Command"
        );
        console.log(errorBox);
        console.log();
        process.exit(1);
    }
  } catch (error) {
    console.log();
    const errorBox = createFancyBox(
      `${theme.error(`${statusSymbols.error} Turbo Command Failed`)}\n\n` +
        `${error instanceof Error ? error.message : "An unexpected error occurred"}\n\n` +
        `${theme.info(`${statusSymbols.info} Try running:`)} ${theme.bold("create-precast-app turbo --help")}\n` +
        `${theme.muted("   for available commands and options")}`,
      "[ERR] Turbo Error"
    );
    console.log(errorBox);
    console.log();
    process.exit(1);
  }
}

/**
 * Show comprehensive Turbo help with beautiful styling
 */
export async function showTurboHelp(): Promise<void> {
  console.log();
  await PrecastBanner.show({
    subtitle: "TURBO",
    gradient: false,
  });
  console.log();

  // Commands section
  console.log(chalk.hex("#2962ff").bold("  Available Commands:"));
  console.log();
  console.log(
    `    ${chalk.hex("#00e676")("[BUILD]")}  ${chalk.white.bold("build")}   ${chalk.hex("#9e9e9e")("Run Turbo build with TUI dashboard")}`
  );
  console.log(
    `    ${chalk.hex("#ffd600")("[DEV]")}    ${chalk.white.bold("dev")}     ${chalk.hex("#9e9e9e")("Run Turbo dev with interactive task management")}`
  );
  console.log();

  // Usage section
  console.log(chalk.hex("#2962ff").bold("  Usage:"));
  console.log();
  console.log(
    `    ${chalk.white.bold("create-precast-app turbo build")}     ${chalk.hex("#9e9e9e")("- Build all packages")}`
  );
  console.log(
    `    ${chalk.white.bold("create-precast-app turbo dev")}       ${chalk.hex("#9e9e9e")("- Start dev servers interactively")}`
  );
  console.log();

  // Features section
  console.log(chalk.hex("#2962ff").bold("  Features:"));
  console.log();
  console.log(
    `    ${chalk.hex("#aa00ff")("[TUI]")}     ${chalk.white("Beautiful terminal dashboards")}`
  );
  console.log(
    `    ${chalk.hex("#aa00ff")("[REAL]")}    ${chalk.white("Real-time output streaming")}`
  );
  console.log(
    `    ${chalk.hex("#aa00ff")("[SPLIT]")}   ${chalk.white("Split-panel task management")}`
  );
  console.log(
    `    ${chalk.hex("#aa00ff")("[INTER]")}   ${chalk.white("Interactive task selection (dev)")}`
  );
  console.log();

  // Example workflows
  console.log(chalk.hex("#2962ff").bold("  Example Workflows:"));
  console.log();
  console.log(`    ${chalk.hex("#ffd600")("1.")} ${chalk.white.bold("Production Build:")}`);
  console.log(`       ${chalk.white("create-precast-app turbo build")}`);
  console.log(`       ${chalk.hex("#9e9e9e")("       ├─ Shows build progress for all packages")}`);
  console.log(`       ${chalk.hex("#9e9e9e")("       ├─ Real-time error detection")}`);
  console.log(`       ${chalk.hex("#9e9e9e")("       └─ Clean exit when complete")}`);
  console.log();
  console.log(`    ${chalk.hex("#ffd600")("2.")} ${chalk.white.bold("Development Mode:")}`);
  console.log(`       ${chalk.white("create-precast-app turbo dev")}`);
  console.log(`       ${chalk.hex("#9e9e9e")("       ├─ Interactive task dashboard")}`);
  console.log(`       ${chalk.hex("#9e9e9e")("       ├─ Individual task output viewing")}`);
  console.log(`       ${chalk.hex("#9e9e9e")("       └─ Hot reload monitoring")}`);
  console.log();

  console.log(chalk.hex("#9e9e9e").bold("━".repeat(66)));
  console.log(
    `  ${chalk.hex("#aa00ff")("[INFO]")}    ${chalk.hex("#9e9e9e")("Turbo commands work in monorepo projects")}`
  );
  console.log(
    `  ${chalk.hex("#aa00ff")("[DOCS]")}    ${chalk.hex("#9e9e9e")("Learn more:")} ${chalk.hex("#00e676").bold("https://turbo.build/repo")}`
  );
  console.log();
}

/**
 * Setup Commander.js integration for turbo commands
 */
export function setupTurboCommands(program: Command): void {
  const turboCmd = program
    .command("turbo")
    .description("Turbo monorepo build system with enhanced TUI")
    .action(async () => {
      await showTurboHelp();
    });

  // Build subcommand
  turboCmd
    .command("build")
    .description("Run Turbo build with TUI dashboard")
    .action(async () => {
      await turboBuildCommand();
    });

  // Dev subcommand
  turboCmd
    .command("dev")
    .description("Run Turbo dev with interactive task management")
    .action(async () => {
      await devCommand();
    });
}

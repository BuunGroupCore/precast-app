import chalk from "chalk";
import cliWidth from "cli-width";
import { Command } from "commander";

import { PrecastBanner } from "./precast-banner.js";

/**
 * Configuration for a command group in the help display
 */
export interface CommandGroup {
  /** Group title */
  title: string;
  /** Group description */
  description?: string;
  /** Commands in this group */
  commands: CommandInfo[];
}

/**
 * Information about a single command for help display
 */
export interface CommandInfo {
  /** Command name */
  name: string;
  /** Command aliases */
  aliases?: string[];
  /** Command description */
  description: string;
  /** Usage example */
  usage?: string;
  /** Whether this is the default command */
  isDefault?: boolean;
}

/**
 * Enhanced help system with comic book styling and dynamic command discovery
 */
export class EnhancedHelp {
  /** Terminal width for layout calculations */
  private width: number;
  /** Comic book color palette */
  private colors = {
    primary: "#ff1744",
    secondary: "#2962ff",
    accent: "#ffd600",
    success: "#00e676",
    muted: "#9e9e9e",
    purple: "#aa00ff",
  };

  constructor() {
    this.width = cliWidth({ defaultWidth: 80 });
  }

  /**
   * Display the main help screen with beautiful formatting
   * @param program - Commander program instance
   */
  async showMainHelp(program: Command): Promise<void> {
    // Show compact banner
    await PrecastBanner.showCompact("CLI", "Modern Full-Stack Application Scaffolding");

    const commands = this.extractCommands(program);

    this.displayCompactCommands(commands);
    this.displayCompactFooter();
  }

  /**
   * Display help for a specific command
   * @param command - Commander command instance
   */
  async showCommandHelp(command: Command): Promise<void> {
    await PrecastBanner.showCompact(command.name(), command.description());

    this.displayCompactCommandUsage(command);
    this.displayCompactCommandOptions(command);
  }

  /**
   * Extract all commands from the commander program
   * @param program - Commander program instance
   * @returns Array of command information
   */
  private extractCommands(program: Command): CommandInfo[] {
    const commands: CommandInfo[] = [];

    // Get all registered commands
    program.commands.forEach((cmd) => {
      commands.push({
        name: cmd.name(),
        aliases: cmd.aliases(),
        description: cmd.description(),
        usage: cmd.usage(),
        isDefault: (cmd as any)._defaultCommandName === cmd.name(),
      });
    });

    return commands;
  }

  /**
   * Display commands in a compact table format
   * @param commands - Array of command information
   */
  private displayCompactCommands(commands: CommandInfo[]): void {
    const boxWidth = Math.min(this.width - 4, 70);

    console.log();
    console.log(chalk.hex(this.colors.accent).bold("━".repeat(boxWidth)));
    console.log(chalk.hex(this.colors.primary).bold("  📋 COMMANDS"));
    console.log(chalk.hex(this.colors.accent).bold("━".repeat(boxWidth)));
    console.log();

    // Calculate column width for proper alignment
    const maxNameLength = Math.max(
      ...commands.map((cmd) => {
        const nameWithAliases =
          cmd.aliases && cmd.aliases.length > 0 ? `${cmd.name}|${cmd.aliases.join("|")}` : cmd.name;
        return nameWithAliases.length;
      }),
      12
    );

    commands.forEach((cmd) => {
      const nameWithAliases =
        cmd.aliases && cmd.aliases.length > 0 ? `${cmd.name}|${cmd.aliases.join("|")}` : cmd.name;

      const paddedName = nameWithAliases.padEnd(maxNameLength + 2);
      const defaultIndicator = cmd.isDefault ? chalk.hex(this.colors.accent)(" (default)") : "";

      console.log(
        `  ${chalk.hex(this.colors.secondary).bold(paddedName)} ${chalk.white(cmd.description)}${defaultIndicator}`
      );
    });
    console.log();
  }

  /**
   * Display a compact footer
   */
  private displayCompactFooter(): void {
    const boxWidth = Math.min(this.width - 4, 70);

    console.log(chalk.hex(this.colors.accent).bold("━".repeat(boxWidth)));
    console.log();
    console.log(
      `  ${chalk.hex(this.colors.muted)("Usage:")} ${chalk.hex(this.colors.success).bold("create-precast-app")} ${chalk.hex(this.colors.muted)("[command] [options]")}`
    );
    console.log(
      `  ${chalk.hex(this.colors.muted)("Help:")}  ${chalk.hex(this.colors.success).bold("create-precast-app [command] --help")}`
    );
    console.log();
    console.log(chalk.hex(this.colors.accent).bold("━".repeat(boxWidth)));
    console.log();
    console.log(
      `  ${chalk.hex(this.colors.muted)("📚 Docs:")}    ${chalk.hex(this.colors.secondary)("https://precast.dev/docs")}`
    );
    console.log(
      `  ${chalk.hex(this.colors.muted)("🐙 GitHub:")}  ${chalk.hex(this.colors.secondary)("https://github.com/BuunGroupCore/precast-app")}`
    );
    console.log(
      `  ${chalk.hex(this.colors.muted)("💬 Support:")} ${chalk.hex(this.colors.secondary)("https://discord.gg/4Wen9Pg3rG")}`
    );
    console.log();
  }

  /**
   * Display compact usage for a specific command
   * @param command - Commander command instance
   */
  private displayCompactCommandUsage(command: Command): void {
    const usage = command.usage() || `${command.name()} [options]`;
    console.log();
    console.log(
      `  ${chalk.hex(this.colors.muted)("Usage:")} ${chalk.hex(this.colors.secondary).bold("create-precast-app")} ${chalk.hex(this.colors.success).bold(usage)}`
    );
    console.log();
  }

  /**
   * Display compact options for a specific command
   * @param command - Commander command instance
   */
  private displayCompactCommandOptions(command: Command): void {
    const options = command.options;
    if (options.length === 0) return;

    const boxWidth = Math.min(this.width - 4, 70);

    console.log(chalk.hex(this.colors.accent).bold("━".repeat(boxWidth)));
    console.log(chalk.hex(this.colors.primary).bold("  ⚙️  OPTIONS"));
    console.log(chalk.hex(this.colors.accent).bold("━".repeat(boxWidth)));
    console.log();

    // Calculate column width for alignment
    const maxOptionLength = Math.max(...options.map((opt) => opt.flags.length));

    options.forEach((opt) => {
      const paddedFlags = opt.flags.padEnd(maxOptionLength + 2);
      console.log(
        `  ${chalk.hex(this.colors.secondary).bold(paddedFlags)} ${chalk.white(opt.description)}`
      );
    });
    console.log();
  }
}

/**
 * Create a singleton instance for easy access
 */
export const enhancedHelp = new EnhancedHelp();

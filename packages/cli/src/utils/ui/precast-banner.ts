import boxen from "boxen";
import chalk from "chalk";
import gradient from "gradient-string";

/**
 * Configuration options for banner display
 */
export interface BannerOptions {
  /** Whether to show the version number */
  showVersion?: boolean;
  /** Whether to show the tagline */
  showTagline?: boolean;
  /** Optional subtitle text */
  subtitle?: string;
  /** Whether to wrap the banner in a box */
  boxed?: boolean;
  /** Whether to use gradient colors instead of solid colors */
  gradient?: boolean;
}

/**
 * The official Precast CLI banner used consistently across all commands
 */
export class PrecastBanner {
  /** Current CLI version */
  private static readonly VERSION = "0.1.37";
  /** Official product tagline */
  private static readonly TAGLINE = "Modern Full-Stack Application Scaffolding";
  /** ASCII art logo for the banner */
  private static readonly LOGO = `
██████╗ ██████╗ ███████╗ ██████╗ █████╗ ███████╗████████╗
██╔══██╗██╔══██╗██╔════╝██╔════╝██╔══██╗██╔════╝╚══██╔══╝
██████╔╝██████╔╝█████╗  ██║     ███████║███████╗   ██║   
██╔═══╝ ██╔══██╗██╔══╝  ██║     ██╔══██║╚════██║   ██║   
██║     ██║  ██║███████╗╚██████╗██║  ██║███████║   ██║   
╚═╝     ╚═╝  ╚═╝╚══════╝ ╚═════╝╚═╝  ╚═╝╚══════╝   ╚═╝   `;

  /**
   * Display the main Precast banner with rotating colors
   * @param options - Banner configuration options
   */
  static async show(options: BannerOptions = {}): Promise<void> {
    const {
      showVersion = true,
      showTagline = true,
      subtitle,
      boxed = false,
      gradient: useGradient = false,
    } = options;

    let bannerText = "";

    /** Comic book color palette that rotates on each run */
    const colorRotation = ["#ff1744", "#ffd600", "#2962ff", "#00e676", "#aa00ff"];
    const colorIndex = Date.now() % colorRotation.length;
    const primaryColor = colorRotation[colorIndex];
    const secondaryColor = colorRotation[(colorIndex + 1) % colorRotation.length];
    const accentColor = colorRotation[(colorIndex + 2) % colorRotation.length];

    if (useGradient) {
      const precastGradient = gradient([primaryColor, secondaryColor, accentColor]);
      bannerText = precastGradient.multiline(this.LOGO);
    } else {
      bannerText = chalk.hex(primaryColor).bold(this.LOGO);
    }

    /** Layout configuration for the info section */
    const infoWidth = 56;
    const borderChar = "─";
    const topBorder = chalk.hex(secondaryColor)("╭" + borderChar.repeat(infoWidth - 2) + "╮");
    const bottomBorder = chalk.hex(secondaryColor)("╰" + borderChar.repeat(infoWidth - 2) + "╯");

    const lines: string[] = [bannerText];

    if (showVersion || showTagline) {
      lines.push("");
      lines.push(topBorder);

      if (showTagline) {
        const taglineText = this.TAGLINE;
        const taglinePadding = Math.floor((infoWidth - taglineText.length - 4) / 2);
        const taglineFormatted =
          " ".repeat(taglinePadding) +
          chalk.hex(accentColor)(taglineText) +
          " ".repeat(infoWidth - taglineText.length - taglinePadding - 4);
        lines.push(
          chalk.hex(secondaryColor)("│ ") + taglineFormatted + chalk.hex(secondaryColor)(" │")
        );
      }

      if (showVersion && showTagline) {
        lines.push(chalk.hex(secondaryColor)("├" + borderChar.repeat(infoWidth - 2) + "┤"));
      }

      if (showVersion) {
        const versionText = `Version ${this.VERSION}`;
        const versionPadding = Math.floor((infoWidth - versionText.length - 4) / 2);
        const versionFormatted =
          " ".repeat(versionPadding) +
          chalk.hex("#ffd600").bold(versionText) +
          " ".repeat(infoWidth - versionText.length - versionPadding - 4);
        lines.push(
          chalk.hex(secondaryColor)("│ ") + versionFormatted + chalk.hex(secondaryColor)(" │")
        );
      }

      lines.push(bottomBorder);
    }

    if (subtitle) {
      lines.push("");
      lines.push(chalk.hex(secondaryColor)("━".repeat(infoWidth)));
      lines.push("");
      const subtitleFormatted = chalk.hex(primaryColor).bold(subtitle);
      lines.push(center(subtitleFormatted, infoWidth));
      lines.push("");
      lines.push(chalk.hex(secondaryColor)("━".repeat(infoWidth)));
    }

    const finalBanner = lines.join("\n");

    if (boxed) {
      const box = boxen(finalBanner, {
        padding: 1,
        margin: 0,
        borderStyle: "bold",
        borderColor: "yellow",
        align: "center",
      });
      console.log(box);
    } else {
      console.log();
      console.log(finalBanner);
      console.log();
    }
  }

  /**
   * Display a simple text banner (for non-TTY environments)
   * @param subtitle - Optional subtitle text
   */
  static showSimple(subtitle?: string): void {
    console.log();
    console.log(chalk.hex("#ff1744").bold("💥 PRECAST"));
    console.log(chalk.hex("#ffd600")(`v${this.VERSION}`));
    if (subtitle) {
      console.log(chalk.hex("#2962ff")(subtitle));
    }
    console.log();
  }

  /**
   * Display a compact banner for subcommands
   * @param command - The command name to display
   * @param description - Optional command description
   */
  static async showCompact(command: string, description?: string): Promise<void> {
    /** Comic book color palette rotation */
    const colorRotation = ["#ff1744", "#ffd600", "#2962ff", "#00e676", "#aa00ff"];
    const colorIndex = Date.now() % colorRotation.length;
    const primaryColor = colorRotation[colorIndex];
    const secondaryColor = colorRotation[(colorIndex + 1) % colorRotation.length];

    const commandText = chalk.hex(primaryColor).bold(`Precast ${command}`);
    const versionText = chalk.hex(secondaryColor)(`v${this.VERSION}`);

    console.log();
    console.log(`${commandText} ${versionText}`);
    console.log(chalk.hex(secondaryColor)("━".repeat(60)));
    console.log();
  }

  /**
   * Display a minimal banner for quick operations
   */
  static showMinimal(): void {
    const colorRotation = ["#ff1744", "#ffd600", "#2962ff", "#00e676", "#aa00ff"];
    const colorIndex = Date.now() % colorRotation.length;
    const primaryColor = colorRotation[colorIndex];
    const secondaryColor = colorRotation[(colorIndex + 1) % colorRotation.length];

    console.log();
    console.log(
      chalk.hex(primaryColor).bold("💥 PRECAST") + chalk.hex(secondaryColor)(` v${this.VERSION}`)
    );
    console.log();
  }

  /**
   * Get the current CLI version
   * @returns The version string
   */
  static getVersion(): string {
    return this.VERSION;
  }
}

/**
 * Center text within a given width, accounting for ANSI escape codes
 * @param text - The text to center
 * @param width - The target width for centering
 * @returns The centered text with appropriate padding
 */
function center(text: string, width: number): string {
  // eslint-disable-next-line no-control-regex
  const textLength = text.replace(/\x1b\[[0-9;]*m/g, "").length;
  const padding = Math.max(0, Math.floor((width - textLength) / 2));
  return " ".repeat(padding) + text;
}

/**
 * Create an animated banner reveal effect (for special occasions)
 * @param options - Banner configuration options
 */
export async function animatedBannerReveal(options: BannerOptions = {}): Promise<void> {
  if (!process.stdout.isTTY) {
    PrecastBanner.showSimple(options.subtitle);
    return;
  }

  const logo = PrecastBanner["LOGO"];
  const lines = logo.trim().split("\n");
  const colors = ["#ff1744", "#ffd600", "#2962ff", "#00e676", "#aa00ff"];

  console.log();

  /** Reveal each line with comic book colors */
  for (let i = 0; i < lines.length; i++) {
    const color = chalk.hex(colors[i % colors.length]).bold;
    process.stdout.write(color(lines[i]) + "\n");
    await sleep(50);
  }
  if (options.showVersion !== false) {
    await sleep(100);
    console.log();
    console.log(center(chalk.dim(`v${PrecastBanner.getVersion()}`), 58));
  }

  if (options.showTagline !== false) {
    await sleep(50);
    console.log(center(chalk.dim("Modern Full-Stack Application Scaffolding"), 58));
  }

  if (options.subtitle) {
    await sleep(100);
    console.log();
    console.log(center(chalk.yellow(options.subtitle), 58));
  }

  console.log();
  await sleep(200);
}

/**
 * Utility function for creating delays in animations
 * @param ms - Milliseconds to sleep
 * @returns Promise that resolves after the specified delay
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

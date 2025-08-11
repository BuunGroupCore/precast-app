import boxen, { type Options as BoxenOptions } from "boxen";
import chalk, { type ChalkInstance } from "chalk";
import figlet from "figlet";
import gradient from "gradient-string";
import terminalLink from "terminal-link";

// Define our color theme (matching Precast brand) with explicit typing to avoid export issues
export const theme: {
  primary: ChalkInstance;
  secondary: ChalkInstance;
  accent: ChalkInstance;
  success: ChalkInstance;
  error: ChalkInstance;
  warning: ChalkInstance;
  info: ChalkInstance;
  muted: ChalkInstance;
  bold: ChalkInstance;
  dim: ChalkInstance;
  gradient: {
    precast: (text: string) => string;
    rainbow: (text: string) => string;
    cool: (text: string) => string;
    warm: (text: string) => string;
    vice: (text: string) => string;
    fire: (text: string) => string;
    retro: (text: string) => string;
  };
} = {
  // Brand colors
  primary: chalk.hex("#FF6B6B"),
  secondary: chalk.hex("#4ECDC4"),
  accent: chalk.hex("#FFE66D"),

  // Status colors
  success: chalk.green,
  error: chalk.red,
  warning: chalk.yellow,
  info: chalk.cyan,

  // Text colors
  muted: chalk.gray,
  bold: chalk.bold,
  dim: chalk.dim,

  // Gradients
  gradient: {
    precast: gradient(["#FF6B6B", "#4ECDC4", "#FFE66D"]),
    rainbow: gradient([
      "#ff0000",
      "#ff8000",
      "#ffff00",
      "#80ff00",
      "#00ff00",
      "#00ff80",
      "#00ffff",
      "#0080ff",
      "#0000ff",
      "#8000ff",
      "#ff00ff",
      "#ff0080",
    ]),
    cool: gradient(["#667eea", "#764ba2"]),
    warm: gradient(["#f093fb", "#f5576c"]),
    vice: gradient(["#4ECDC4", "#44A08D"]),
    fire: gradient(["#ff512f", "#dd2476"]),
    retro: gradient(["#3f5efb", "#fc466b"]),
  },
};

/**
 * Create ASCII art title with figlet
 */
export async function createAsciiTitle(text: string, font?: figlet.Fonts): Promise<string> {
  return new Promise((resolve, reject) => {
    figlet.text(
      text,
      {
        font: font || "ANSI Shadow",
        horizontalLayout: "default",
        verticalLayout: "default",
      },
      (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data || "");
        }
      }
    );
  });
}

/**
 * Create a small ASCII art title
 */
export async function createSmallTitle(text: string): Promise<string> {
  return new Promise((resolve, reject) => {
    figlet.text(
      text,
      {
        font: "Small",
        horizontalLayout: "default",
      },
      (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data || "");
        }
      }
    );
  });
}

/**
 * Create a stylized box with content
 */
export function createBox(content: string, title?: string, options?: BoxenOptions): string {
  return boxen(content, {
    padding: 1,
    margin: 0,
    borderStyle: "round",
    borderColor: "cyan",
    title,
    titleAlignment: "center",
    ...options,
  });
}

/**
 * Create a fancy box with gradient border
 */
export function createFancyBox(content: string, title?: string): string {
  return boxen(content, {
    padding: { top: 1, right: 2, bottom: 1, left: 2 },
    margin: 0,
    borderStyle: "double",
    borderColor: "magenta",
    title,
    titleAlignment: "center",
    backgroundColor: "#000000",
  });
}

/**
 * Format a status badge
 */
export function statusBadge(
  label: string,
  value: string,
  status?: "success" | "error" | "warning" | "info"
): string {
  const colorFn = status ? theme[status] : theme.info;
  return `${theme.muted(label)} ${colorFn.bold(value)}`;
}

/**
 * Create a progress bar
 */
export function progressBar(current: number, total: number, width: number = 20): string {
  const percentage = Math.round((current / total) * 100);
  const filled = Math.round((current / total) * width);
  const empty = width - filled;

  const bar = theme.success("█").repeat(filled) + theme.muted("░").repeat(empty);
  return `${bar} ${theme.bold(`${percentage}%`)}`;
}

/**
 * Create a section divider
 */
export function divider(text?: string, width: number = 60): string {
  if (!text) {
    return theme.muted("─".repeat(width));
  }

  const padding = Math.floor((width - text.length - 2) / 2);
  const leftPad = "─".repeat(padding);
  const rightPad = "─".repeat(width - padding - text.length - 2);

  return theme.muted(`${leftPad} ${theme.bold(text)} ${rightPad}`);
}

/**
 * Create a bullet list
 */
export function bulletList(items: string[], bullet: string = "•"): string {
  return items.map((item) => `  ${theme.accent(bullet)} ${item}`).join("\n");
}

/**
 * Create a numbered list
 */
export function numberedList(items: string[]): string {
  return items.map((item, index) => `  ${theme.accent(`${index + 1}.`)} ${item}`).join("\n");
}

/**
 * Format key-value pairs
 */
export function keyValue(key: string, value: string | undefined, indent: number = 0): string {
  const spaces = " ".repeat(indent);
  if (!value || value === "none") {
    return `${spaces}${theme.muted(key + ":")} ${theme.dim("Not configured")}`;
  }
  return `${spaces}${theme.muted(key + ":")} ${theme.bold(value)}`;
}

/**
 * Create a table
 */
export function createTable(headers: string[], rows: string[][]): string {
  const columnWidths = headers.map((header, index) => {
    const maxRowWidth = Math.max(...rows.map((row) => (row[index] || "").length));
    return Math.max(header.length, maxRowWidth) + 2;
  });

  // Header
  const headerRow = headers
    .map((header, index) => theme.bold(header.padEnd(columnWidths[index])))
    .join(theme.muted("│"));

  // Separator
  const separator = columnWidths.map((width) => "─".repeat(width)).join(theme.muted("┼"));

  // Data rows
  const dataRows = rows
    .map((row) =>
      row.map((cell, index) => (cell || "").padEnd(columnWidths[index])).join(theme.muted("│"))
    )
    .join("\n");

  return [headerRow, theme.muted(separator), dataRows].join("\n");
}

/**
 * Create a link if terminal supports it
 */
export function createLink(text: string, url: string): string {
  if (terminalLink.isSupported) {
    return terminalLink(theme.info.underline(text), url);
  }
  return `${theme.info.underline(text)} (${theme.dim(url)})`;
}

/**
 * Display framework icon
 */
export function getFrameworkIcon(framework: string): string {
  const icons: Record<string, string> = {
    react: "⚛️ ",
    vue: "🟢",
    angular: "🔺",
    next: "▲",
    nuxt: "🟩",
    svelte: "🔥",
    solid: "🔷",
    remix: "💿",
    astro: "🚀",
    vite: "⚡",
    vanilla: "🍦",
  };
  return icons[framework] || "📦";
}

/**
 * Display tech stack badges
 */
export function techBadge(tech: string): string {
  const badges: Record<string, { icon: string; color: (text: string) => string }> = {
    // Databases
    postgres: { icon: "🐘", color: chalk.blue },
    mysql: { icon: "🐬", color: chalk.cyan },
    mongodb: { icon: "🍃", color: chalk.green },
    sqlite: { icon: "🗄️", color: chalk.gray },

    // ORMs
    prisma: { icon: "◼", color: chalk.white },
    drizzle: { icon: "💧", color: chalk.blue },
    typeorm: { icon: "🔧", color: chalk.yellow },

    // Styling
    tailwind: { icon: "🎨", color: chalk.cyan },
    css: { icon: "🎨", color: chalk.blue },
    scss: { icon: "🎨", color: chalk.magenta },

    // Auth
    "better-auth": { icon: "🔐", color: chalk.green },
    "auth.js": { icon: "🔑", color: chalk.yellow },
    clerk: { icon: "🔒", color: chalk.blue },

    // UI Libraries
    shadcn: { icon: "🎭", color: chalk.white },
    mui: { icon: "🎨", color: chalk.blue },
    chakra: { icon: "⚡", color: chalk.cyan },

    // Backends
    express: { icon: "🚂", color: chalk.yellow },
    fastify: { icon: "⚡", color: chalk.green },
    hono: { icon: "🔥", color: chalk.red },
    nestjs: { icon: "🐱", color: chalk.red },
  };

  const badge = badges[tech.toLowerCase()];
  if (badge) {
    return `${badge.icon} ${badge.color(tech)}`;
  }
  return tech;
}

/**
 * Spinner frames for loading animations
 */
export const spinnerFrames = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];
export const dotsSpinner = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];
export const lineSpinner = ["-", "\\", "|", "/"];
export const arrowSpinner = ["←", "↖", "↑", "↗", "→", "↘", "↓", "↙"];

/**
 * Comic/cartoon style decorations (matching Precast brand)
 */
export const comicDecorations = {
  pow: "💥 POW!",
  bam: "💢 BAM!",
  boom: "💣 BOOM!",
  zap: "⚡ ZAP!",
  wow: "✨ WOW!",
  super: "🦸 SUPER!",
  hero: "🦸‍♂️ HERO MODE",
  rocket: "🚀 BLAST OFF!",
  star: "⭐ STELLAR!",
  fire: "🔥 ON FIRE!",
};

/**
 * Create comic-style speech bubble
 */
export function speechBubble(text: string): string {
  const lines = text.split("\n");
  const maxLength = Math.max(...lines.map((l) => l.length));
  const top = "╭" + "─".repeat(maxLength + 2) + "╮";
  const bottom = "╰" + "─".repeat(maxLength + 2) + "╯";
  const middle = lines.map((line) => `│ ${line.padEnd(maxLength)} │`).join("\n");

  return theme.accent([top, middle, bottom].join("\n"));
}

/**
 * Create a hero banner for commands
 */
export async function createHeroBanner(title: string, subtitle?: string): Promise<string> {
  const asciiTitle = await createAsciiTitle(title);
  const gradientTitle = theme.gradient.precast(asciiTitle);

  if (subtitle) {
    return `${gradientTitle}\n${theme.dim(subtitle)}`;
  }

  return gradientTitle;
}

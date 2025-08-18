import * as clack from "@clack/prompts";
import chalk from "chalk";
import cliWidth from "cli-width";
import gradient from "gradient-string";
import logUpdate from "log-update";

/**
 * Individual log entry with metadata
 */
export interface LogEntry {
  /** Timestamp when the log was created */
  timestamp: Date;
  /** Log level for categorization */
  level: "info" | "success" | "error" | "warning" | "debug" | "verbose";
  /** Main log message */
  message: string;
  /** Optional additional details */
  details?: string;
  /** Optional metadata object */
  metadata?: Record<string, any>;
}

/**
 * Message format for streaming output
 */
export interface StreamingMessage {
  /** Message type for styling */
  type: "info" | "success" | "error" | "warning" | "step";
  /** Main message content */
  message: string;
  /** Optional additional details */
  details?: string;
}

/**
 * Configuration options for the streaming logger
 */
export interface StreamingLoggerOptions {
  /** Maximum number of entries to keep in buffer */
  maxBufferSize?: number;
  /** Whether to show timestamps in output */
  showTimestamps?: boolean;
  /** Whether to colorize output */
  colorize?: boolean;
  /** Terminal width for formatting */
  width?: number;
  /** Enable debug mode */
  debug?: boolean;
  /** Enable verbose output */
  verbose?: boolean;
}

/**
 * Advanced streaming logger with beautiful formatting and real-time updates
 */
export class StreamingLogger {
  /** Buffer for pending log entries */
  private buffer: LogEntry[] = [];
  /** Maximum number of entries to keep in buffer */
  private maxBufferSize: number;
  /** Whether to show timestamps */
  private showTimestamps: boolean;
  /** Whether to colorize output */
  private colorize: boolean;
  /** Terminal width for layout */
  private width: number;
  /** Debug mode flag */
  private debug: boolean;
  /** Verbose output flag */
  private verbose: boolean;
  /** Whether streaming is active */
  private isStreaming: boolean = false;
  /** Interval for streaming updates */
  private streamInterval?: NodeJS.Timeout;
  /** Currently active log section */
  private activeSection?: string;
  /** Timestamp when current section started */
  private sectionStartTime?: Date;
  /** Complete log history */
  private logHistory: LogEntry[] = [];
  /** Maximum entries to keep in history */
  private maxHistorySize: number = 1000;

  /**
   * Initialize the streaming logger
   * @param options - Configuration options
   */
  constructor(options: StreamingLoggerOptions = {}) {
    this.maxBufferSize = options.maxBufferSize || 100;
    this.showTimestamps = options.showTimestamps ?? false;
    this.colorize = options.colorize ?? true;
    this.width = options.width || cliWidth({ defaultWidth: 80 });
    this.debug = options.debug || false;
    this.verbose = options.verbose || false;
  }

  /**
   * Start a new section with animated header
   */
  async startSection(title: string, description?: string): Promise<void> {
    this.activeSection = title;
    this.sectionStartTime = new Date();

    if (!process.stdout.isTTY) {
      console.log(`\n${chalk.bold(title)}`);
      if (description) console.log(chalk.dim(description));
      return;
    }

    // Create animated section header
    const border = "━".repeat(this.width - 10);
    const rainbowGradient = gradient([
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
    ]);
    const gradientBorder = rainbowGradient(border);

    console.log();
    console.log(gradientBorder);

    // Animate title appearance
    const titleChars = title.split("");
    let animatedTitle = "";

    for (const char of titleChars) {
      animatedTitle += char;
      logUpdate(chalk.bold.white(animatedTitle));
      await this.sleep(20);
    }

    logUpdate.clear();
    const coolGradient = gradient(["#667eea", "#764ba2"]);
    console.log(coolGradient(title));

    if (description) {
      console.log(chalk.dim(description));
    }

    console.log(gradientBorder);
    console.log();
  }

  /**
   * End the current section with summary
   */
  endSection(summary?: string): void {
    if (!this.activeSection) return;

    const duration = this.sectionStartTime
      ? ((new Date().getTime() - this.sectionStartTime.getTime()) / 1000).toFixed(1)
      : "0.0";

    const sectionSummary = summary || `Completed in ${duration}s`;

    console.log();
    console.log(chalk.dim("─".repeat(this.width - 10)));
    console.log(chalk.green(`[OK] ${this.activeSection}: ${sectionSummary}`));
    console.log();

    this.activeSection = undefined;
    this.sectionStartTime = undefined;
  }

  /**
   * Start streaming mode for real-time updates
   */
  startStreaming(): void {
    if (this.isStreaming) return;

    this.isStreaming = true;

    if (!process.stdout.isTTY) return;

    this.streamInterval = setInterval(() => {
      if (this.buffer.length > 0) {
        this.flushBuffer();
      }
    }, 100);
  }

  /**
   * Stop streaming mode
   */
  stopStreaming(): void {
    this.isStreaming = false;

    if (this.streamInterval) {
      clearInterval(this.streamInterval);
      this.streamInterval = undefined;
    }

    // Flush any remaining buffer
    this.flushBuffer();
  }

  /**
   * Add a message to the streaming buffer
   */
  stream(message: StreamingMessage): void {
    if (!this.isStreaming || !process.stdout.isTTY) {
      this.outputStreamMessage(message);
      return;
    }

    this.buffer.push({
      timestamp: new Date(),
      level: message.type as LogEntry["level"],
      message: message.message,
      details: message.details,
    });
  }

  /**
   * Output a streaming message directly
   */
  private outputStreamMessage(message: StreamingMessage): void {
    // In non-debug mode, be more selective about what we show
    if (!this.debug) {
      // Only show success, warnings and errors, suppress info and step messages
      if (message.type === "info" || message.type === "step") {
        return;
      }
    }

    const icons = {
      info: chalk.blue("[i]"),
      success: chalk.green("[OK]"),
      error: chalk.red("[ERR]"),
      warning: chalk.yellow("[WARN]"),
      step: chalk.cyan("[>>]"),
    };

    const icon = icons[message.type as keyof typeof icons] || "";
    const formattedMessage = `${icon} ${message.message}`;

    console.log(formattedMessage);

    if (message.details && (this.debug || message.type === "error" || message.type === "warning")) {
      const detailLines = message.details.split("\n");
      detailLines.forEach((line: string) => {
        console.log(chalk.dim(`  ${line}`));
      });
    }
  }

  /**
   * Log an info message
   */
  info(message: string, details?: string): void {
    this.log("info", message, details);
  }

  /**
   * Log a success message
   */
  success(message: string, details?: string): void {
    this.log("success", message, details);
  }

  /**
   * Log an error message
   */
  error(message: string, details?: string): void {
    this.log("error", message, details);
  }

  /**
   * Log a warning message
   */
  warning(message: string, details?: string): void {
    this.log("warning", message, details);
  }

  /**
   * Log a debug message (only shown when debug mode is enabled)
   */
  logDebug(message: string, details?: string): void {
    if (!this.debug) return;
    this.log("debug", message, details);
  }

  /**
   * Log a verbose message (only shown when verbose mode is enabled)
   */
  logVerbose(message: string, details?: string): void {
    if (!this.verbose) return;
    this.log("verbose", message, details);
  }

  /**
   * Core logging function
   */
  private log(level: LogEntry["level"], message: string, details?: string): void {
    const entry: LogEntry = {
      timestamp: new Date(),
      level,
      message,
      details,
    };

    // Add to history
    this.logHistory.push(entry);
    if (this.logHistory.length > this.maxHistorySize) {
      this.logHistory.shift();
    }

    if (this.isStreaming && process.stdout.isTTY) {
      // Add to buffer for streaming output
      this.buffer.push(entry);
      if (this.buffer.length > this.maxBufferSize) {
        this.buffer.shift();
      }
    } else {
      // Direct output for non-streaming mode
      this.outputLogEntry(entry);
    }
  }

  /**
   * Flush the buffer and display all pending log entries
   */
  private flushBuffer(): void {
    if (this.buffer.length === 0) return;

    const entries = [...this.buffer];
    this.buffer = [];

    entries.forEach((entry) => this.outputLogEntry(entry));
  }

  /**
   * Output a single log entry with formatting
   */
  private outputLogEntry(entry: LogEntry): void {
    const { timestamp, level, message, details } = entry;

    // Format timestamp if enabled
    const timestampStr = this.showTimestamps
      ? chalk.dim(`[${timestamp.toISOString().split("T")[1].split(".")[0]}] `)
      : "";

    // Get level formatting
    const { icon, color } = this.getLevelFormatting(level);

    // Format the message
    let formattedMessage = `${timestampStr}${icon} ${message}`;

    if (this.colorize) {
      formattedMessage = color(formattedMessage);
    }

    console.log(formattedMessage);

    // Output details if provided
    if (details) {
      const detailLines = details.split("\n");
      detailLines.forEach((line) => {
        console.log(chalk.dim(`    ${line}`));
      });
    }
  }

  /**
   * Get formatting for log level
   */
  private getLevelFormatting(level: LogEntry["level"]): {
    icon: string;
    color: (text: string) => string;
  } {
    switch (level) {
      case "info":
        return { icon: chalk.blue("ℹ"), color: chalk.blue };
      case "success":
        return { icon: chalk.green("[OK]"), color: chalk.green };
      case "error":
        return { icon: chalk.red("[ERR]"), color: chalk.red };
      case "warning":
        return { icon: chalk.yellow("[WARN]"), color: chalk.yellow };
      case "debug":
        return { icon: chalk.gray("[DBG]"), color: chalk.gray };
      case "verbose":
        return { icon: chalk.dim("▸"), color: chalk.dim };
      default:
        return { icon: "", color: (text: string) => text };
    }
  }

  /**
   * Create a beautiful progress indicator for long-running operations
   */
  async showProgress(message: string, operation: () => Promise<void>): Promise<void> {
    if (!process.stdout.isTTY) {
      console.log(message);
      await operation();
      console.log(`${chalk.green("[OK]")} ${message}`);
      return;
    }

    const spinner = clack.spinner();
    spinner.start(message);

    try {
      await operation();
      spinner.stop(`${message} ${chalk.green("[OK]")}`);
    } catch (error) {
      spinner.stop(`${message} ${chalk.red("[ERR]")}`);
      throw error;
    }
  }

  /**
   * Display a beautiful table of data
   */
  displayTable(headers: string[], rows: string[][]): void {
    // Calculate column widths
    const columnWidths = headers.map((header, index) => {
      const maxRowWidth = Math.max(...rows.map((row) => (row[index] || "").length));
      return Math.max(header.length, maxRowWidth) + 2;
    });

    // Display header
    const headerRow = headers
      .map((header, index) => chalk.bold(header.padEnd(columnWidths[index])))
      .join(chalk.dim("│"));

    console.log(headerRow);

    // Display separator
    const separator = columnWidths.map((width) => "─".repeat(width)).join(chalk.dim("┼"));

    console.log(chalk.dim(separator));

    // Display rows
    rows.forEach((row) => {
      const formattedRow = row
        .map((cell, index) => (cell || "").padEnd(columnWidths[index]))
        .join(chalk.dim("│"));

      console.log(formattedRow);
    });
  }

  /**
   * Create an animated loading message
   */
  async animatedLog(message: string, duration: number = 1000): Promise<void> {
    if (!process.stdout.isTTY) {
      console.log(message);
      return;
    }

    const frames = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];
    let frameIndex = 0;

    const interval = setInterval(() => {
      const frame = frames[frameIndex];
      frameIndex = (frameIndex + 1) % frames.length;
      logUpdate(`${chalk.cyan(frame)} ${message}`);
    }, 80);

    await this.sleep(duration);

    clearInterval(interval);
    logUpdate.clear();
    console.log(`${chalk.green("[OK]")} ${message}`);
  }

  /**
   * Display a multi-line box with content
   */
  displayBox(
    title: string,
    content: string[],
    style: "single" | "double" | "round" = "round"
  ): void {
    const borders = {
      single: { tl: "┌", tr: "┐", bl: "└", br: "┘", h: "─", v: "│" },
      double: { tl: "╔", tr: "╗", bl: "╚", br: "╝", h: "═", v: "║" },
      round: { tl: "╭", tr: "╮", bl: "╰", br: "╯", h: "─", v: "│" },
    };

    const border = borders[style];
    const maxLength = Math.max(title.length, ...content.map((line) => line.length));
    const boxWidth = Math.min(maxLength + 4, this.width - 4);

    // Top border with title
    const titlePadding = Math.floor((boxWidth - title.length - 2) / 2);
    const topBorder =
      border.tl +
      border.h.repeat(titlePadding) +
      " " +
      chalk.bold(title) +
      " " +
      border.h.repeat(boxWidth - titlePadding - title.length - 2) +
      border.tr;

    const coolGradient = gradient(["#667eea", "#764ba2"]);
    console.log(coolGradient(topBorder));

    // Content
    content.forEach((line) => {
      const paddedLine = line.padEnd(boxWidth - 2);
      console.log(`${chalk.dim(border.v)} ${paddedLine} ${chalk.dim(border.v)}`);
    });

    // Bottom border
    const bottomBorder = border.bl + border.h.repeat(boxWidth) + border.br;
    console.log(coolGradient(bottomBorder));
  }

  /**
   * Get log history
   */
  getHistory(level?: LogEntry["level"]): LogEntry[] {
    if (level) {
      return this.logHistory.filter((entry) => entry.level === level);
    }
    return [...this.logHistory];
  }

  /**
   * Clear log history
   */
  clearHistory(): void {
    this.logHistory = [];
  }

  /**
   * Helper function to sleep
   */
  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

/**
 * Create a default streaming logger instance
 */
export const streamingLogger = new StreamingLogger({
  showTimestamps: false,
  colorize: true,
  debug: process.env.DEBUG === "true",
  verbose: process.env.VERBOSE === "true",
});

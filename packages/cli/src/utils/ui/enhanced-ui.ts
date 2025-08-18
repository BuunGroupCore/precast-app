import * as clack from "@clack/prompts";
import chalk from "chalk";
import cliWidth from "cli-width";
import gradient from "gradient-string";
import { Listr, type ListrTask } from "listr2";
import { createSpinner } from "nanospinner";

import { theme } from "./cli-theme.js";

/**
 * Configuration for an enhanced task with progress tracking
 */
export interface EnhancedTask {
  /** Unique identifier for the task */
  id: string;
  /** Display title for the task */
  title: string;
  /** Async function to execute */
  task: () => Promise<void>;
  /** Whether this task can run concurrently with others */
  concurrent?: boolean;
  /** Number of retry attempts on failure */
  retry?: number;
  /** Whether to exit the entire process on task failure */
  exitOnError?: boolean;
}

/**
 * Message format for streaming output
 */
export interface StreamingMessage {
  /** Type of message for styling */
  type: "info" | "success" | "error" | "warning" | "step";
  /** Main message content */
  message: string;
  /** Optional additional details */
  details?: string;
}

/**
 * Enhanced UI system with multi-threaded progress bars and beautiful animations
 */
export class EnhancedUI {
  /** Terminal width for layout calculations */
  private width: number;
  /** Whether the environment supports interactive output */
  private isInteractive: boolean;
  /** Map of active progress bars by task ID */
  private progressBars: Map<string, any> = new Map();
  /** Map of active spinners by task ID */
  private activeSpinners: Map<string, any> = new Map();
  /** Buffer for streaming messages */
  private streamBuffer: StreamingMessage[] = [];
  /** Whether streaming mode is active */
  private isStreaming: boolean = false;
  /** Debug mode flag */
  private debug: boolean;

  /**
   * Initialize the enhanced UI system
   * @param options - Configuration options
   */
  constructor(options: { debug?: boolean } = {}) {
    this.width = cliWidth({ defaultWidth: 80 });
    this.isInteractive = process.stdout.isTTY && !process.env.CI;
    this.debug = options.debug || false;
  }

  /**
   * Display a beautiful animated banner
   */
  async showBanner(title: string, subtitle?: string): Promise<void> {
    if (!this.isInteractive) {
      console.log(chalk.bold(title));
      if (subtitle) console.log(chalk.dim(subtitle));
      return;
    }

    const precastGradient = gradient(["#FF6B6B", "#4ECDC4", "#FFE66D"]);
    const gradientTitle = precastGradient.multiline(title);
    const lines = gradientTitle.split("\n");

    // Animate each line appearing
    for (const line of lines) {
      process.stdout.write(line + "\n");
      await this.sleep(50);
    }

    if (subtitle) {
      await this.sleep(100);
      const coolGradient = gradient(["#667eea", "#764ba2"]);
      const subtitleGradient = coolGradient(subtitle);
      console.log(chalk.dim(subtitleGradient));
    }

    await this.sleep(300);
  }

  /**
   * Create a multi-threaded task runner with beautiful visualization
   */
  async runTasks(
    tasks: EnhancedTask[],
    options: { title?: string; exitOnError?: boolean } = {}
  ): Promise<void> {
    const { title = "Processing tasks", exitOnError = true } = options;

    if (!this.isInteractive) {
      // Fallback for non-interactive environments
      console.log(chalk.bold(title));
      for (const task of tasks) {
        console.log(`${chalk.dim("→")} ${task.title}`);
        try {
          await task.task();
          console.log(`${chalk.green("✓")} ${task.title}`);
        } catch (error) {
          console.log(
            `${chalk.red("✗")} ${task.title}: ${error instanceof Error ? error.message : "Unknown error"}`
          );
          if (exitOnError || task.exitOnError) throw error;
        }
      }
      return;
    }

    // Group tasks by concurrent vs sequential
    const concurrentTasks = tasks.filter((t) => t.concurrent);
    const sequentialTasks = tasks.filter((t) => !t.concurrent);

    const listrTasks: ListrTask[] = [];

    // Add sequential tasks
    if (sequentialTasks.length > 0) {
      listrTasks.push({
        title: "Sequential Operations",
        task: (ctx, task) => {
          return task.newListr(
            sequentialTasks.map((t) => ({
              title: t.title,
              task: async () => {
                await t.task();
              },
              retry: t.retry,
              exitOnError: t.exitOnError ?? exitOnError,
            })),
            {
              concurrent: false,
              rendererOptions: {
                collapse: !this.debug, // Collapse sequential tasks unless debugging
                showTimer: this.debug,
              },
            }
          );
        },
      });
    }

    // Add concurrent tasks
    if (concurrentTasks.length > 0) {
      listrTasks.push({
        title: "Parallel Operations",
        task: (ctx, task) => {
          return task.newListr(
            concurrentTasks.map((t) => ({
              title: t.title,
              task: async () => {
                await t.task();
              },
              retry: t.retry,
              exitOnError: t.exitOnError ?? exitOnError,
            })),
            {
              concurrent: true,
              rendererOptions: {
                collapse: !this.debug, // Collapse parallel tasks unless debugging
                showTimer: this.debug,
              },
            }
          );
        },
      });
    }

    const listr = new Listr(listrTasks, {
      concurrent: false,
      exitOnError,
      rendererOptions: {
        showSubtasks: true,
        collapse: !this.debug, // Collapse by default, expand only in debug mode
        collapseSkips: true,
        showSkipMessage: false,
        suffixSkips: false,
        showErrorMessage: true,
        showTimer: this.debug, // Show timer only in debug mode
      },
    });

    try {
      await listr.run();
    } catch (error) {
      if (this.debug) {
        console.error(chalk.red("Debug output:"), error);
      }
      throw error;
    }
  }

  /**
   * Create a beautiful multi-progress bar display
   * @param items - Array of progress bar configurations
   */
  createMultiProgressBar(items: { id: string; label: string; total: number }[]): void {
    if (!this.isInteractive) return;

    // Use simpler progress bars without terminal-kit
    console.clear();
    if (process.stdout.isTTY) {
      process.stdout.write("\x1B[?25l"); // Hide cursor
    }

    items.forEach((item) => {
      console.log(chalk.bold(item.label));
      this.progressBars.set(item.id, {
        label: item.label,
        total: item.total,
        current: 0,
      });
    });
  }

  /**
   * Update a specific progress bar
   * @param id - Progress bar identifier
   * @param current - Current progress value
   */
  updateProgress(id: string, current: number): void {
    if (!this.isInteractive) return;

    const progress = this.progressBars.get(id);
    if (progress) {
      progress.current = current;
      const percent = current / progress.total;
      progress.bar.update(percent);
    }
  }

  /**
   * Complete all progress bars and clean up display
   */
  completeProgress(): void {
    if (!this.isInteractive) return;

    this.progressBars.forEach((progress) => {
      const bar = theme.success("█").repeat(30);
      console.log(`${progress.label}: ${bar} 100%`);
    });

    if (process.stdout.isTTY) {
      process.stdout.write("\x1B[?25h"); // Show cursor
    }
    console.log("\n");
    this.progressBars.clear();
  }

  /**
   * Start a beautiful streaming output session
   * @param title - Title for the streaming session
   */
  async startStreaming(title: string): Promise<void> {
    if (!this.isInteractive) {
      console.log(chalk.bold(title));
      return;
    }

    this.isStreaming = true;
    const spinner = clack.spinner();
    spinner.start(title);

    // Start streaming animation
    const frames = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];
    let frameIndex = 0;

    const interval = setInterval(() => {
      if (!this.isStreaming) {
        clearInterval(interval);
        spinner.stop();
        return;
      }

      frameIndex = (frameIndex + 1) % frames.length;

      if (this.streamBuffer.length > 0) {
        const message = this.streamBuffer.shift()!;
        this.displayStreamMessage(message);
      }
    }, 100);

    this.activeSpinners.set("main", { spinner, interval });
  }

  /**
   * Add a message to the streaming buffer
   * @param message - The message to stream
   */
  stream(message: StreamingMessage): void {
    if (!this.isInteractive) {
      this.displayStreamMessage(message);
      return;
    }

    this.streamBuffer.push(message);
  }

  /**
   * Stop streaming and flush remaining messages
   * @param success - Whether the operation was successful
   */
  stopStreaming(success: boolean = true): void {
    this.isStreaming = false;

    const mainSpinner = this.activeSpinners.get("main");
    if (mainSpinner) {
      clearInterval(mainSpinner.interval);
      mainSpinner.spinner.stop(success ? "Completed" : "Failed");
      this.activeSpinners.delete("main");
    }

    // Flush remaining buffer
    while (this.streamBuffer.length > 0) {
      const message = this.streamBuffer.shift()!;
      this.displayStreamMessage(message);
    }
  }

  /**
   * Display a streaming message with appropriate formatting
   */
  private displayStreamMessage(message: StreamingMessage): void {
    const icons = {
      info: chalk.blue("ℹ"),
      success: chalk.green("✓"),
      error: chalk.red("✗"),
      warning: chalk.yellow("⚠"),
      step: chalk.cyan("→"),
    };

    const icon = icons[message.type] || "";
    const formattedMessage = `${icon} ${message.message}`;

    console.log(formattedMessage);

    if (message.details) {
      const detailLines = message.details.split("\n");
      detailLines.forEach((line) => {
        console.log(chalk.dim(`  ${line}`));
      });
    }
  }

  /**
   * Create an animated loading sequence with color cycling
   * @param message - Loading message to display
   * @param duration - Duration of the animation in milliseconds
   */
  async showLoadingAnimation(message: string, duration: number = 2000): Promise<void> {
    if (!this.isInteractive) {
      console.log(message);
      await this.sleep(duration);
      return;
    }

    const spinner = createSpinner(message).start();

    // Cycle through colors
    const colors = ["cyan", "green", "yellow", "blue", "magenta", "red"] as const;
    let colorIndex = 0;

    const colorInterval = setInterval(() => {
      spinner.update({ color: colors[colorIndex] });
      colorIndex = (colorIndex + 1) % colors.length;
    }, 300);

    await this.sleep(duration);

    clearInterval(colorInterval);
    spinner.success({ text: `${message} ${chalk.green("✓")}` });
  }

  /**
   * Display a beautiful error with suggestions
   * @param error - The error to display
   * @param suggestions - Optional suggestions for fixing the error
   */
  showError(error: Error, suggestions?: string[]): void {
    console.log();
    console.log(chalk.red.bold("⚠ Error Detected"));
    console.log(chalk.red("━".repeat(this.width - 10)));
    console.log();
    console.log(chalk.white(error.message));

    if (error.stack && this.debug) {
      console.log();
      console.log(chalk.dim("Stack trace:"));
      console.log(chalk.dim(error.stack));
    }

    if (suggestions && suggestions.length > 0) {
      console.log();
      console.log(chalk.yellow("💡 Suggestions:"));
      suggestions.forEach((suggestion, index) => {
        console.log(chalk.yellow(`  ${index + 1}. ${suggestion}`));
      });
    }

    console.log();
    console.log(chalk.red("━".repeat(this.width - 10)));
    console.log();
  }

  /**
   * Create a beautiful summary display with status indicators
   * @param items - Array of summary items with labels, values, and optional status
   */
  showSummary(
    items: { label: string; value: string; status?: "success" | "warning" | "error" }[]
  ): void {
    const maxLabelLength = Math.max(...items.map((item) => item.label.length));

    console.log();
    console.log(chalk.bold("📊 Summary"));
    console.log(chalk.dim("─".repeat(this.width - 10)));

    items.forEach((item) => {
      const paddedLabel = item.label.padEnd(maxLabelLength);
      let valueColor = chalk.white;

      if (item.status === "success") valueColor = chalk.green;
      else if (item.status === "warning") valueColor = chalk.yellow;
      else if (item.status === "error") valueColor = chalk.red;

      console.log(`  ${chalk.dim(paddedLabel)} : ${valueColor(item.value)}`);
    });

    console.log(chalk.dim("─".repeat(this.width - 10)));
  }

  /**
   * Create an interactive selection with beautiful styling
   * @param options - Selection configuration
   * @returns The selected value
   */
  async select<T extends string>(options: {
    message: string;
    options: Array<{ value: T; label: string; hint?: string }>;
    initialValue?: T;
  }): Promise<T> {
    const result = await clack.select({
      message: options.message,
      options: options.options as any, // Type cast to avoid clack type conflicts
      initialValue: options.initialValue,
    });

    if (clack.isCancel(result)) {
      throw new Error("Selection cancelled");
    }

    return result as T;
  }

  /**
   * Create a beautiful confirmation prompt
   * @param message - The confirmation message
   * @param initialValue - Default value for the prompt
   * @returns The user's confirmation choice
   */
  async confirm(message: string, initialValue: boolean = false): Promise<boolean> {
    const result = await clack.confirm({
      message,
      initialValue,
    });

    if (clack.isCancel(result)) {
      throw new Error("Confirmation cancelled");
    }

    return result;
  }

  /**
   * Utility function for creating delays
   * @param ms - Milliseconds to sleep
   * @returns Promise that resolves after the delay
   */
  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Clean up resources and restore terminal state
   */
  cleanup(): void {
    this.stopStreaming(false);
    this.completeProgress();
    this.activeSpinners.forEach((spinner) => {
      clearInterval(spinner.interval);
      spinner.spinner.stop();
    });
    this.activeSpinners.clear();
    if (process.stdout.isTTY) {
      process.stdout.write("\x1B[?25h"); // Show cursor
    }
  }
}

/**
 * Create a singleton instance for easy access
 */
export const enhancedUI = new EnhancedUI();

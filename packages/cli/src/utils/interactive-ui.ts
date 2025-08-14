import chalk from "chalk";
import { SingleBar } from "cli-progress";
import logUpdate from "log-update";
import ora, { type Ora } from "ora";

import { theme, statusSymbols, progressSpinner } from "./cli-theme.js";

export interface Task {
  id: string;
  title: string;
  status: "pending" | "running" | "completed" | "failed" | "skipped";
  message?: string;
  subtasks?: Task[];
  isStage?: boolean; // Indicates if this is a stage header
}

export interface TaskRunnerOptions {
  debug?: boolean;
  silent?: boolean;
}

/**
 * Interactive task runner with progress tracking
 */
export class InteractiveTaskRunner {
  private tasks: Task[] = [];
  private debug: boolean;
  private silent: boolean;
  private startTime: number = 0;
  private animationInterval?: NodeJS.Timeout;
  private spinnerFrames = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];
  private spinnerIndex = 0;
  private renderTimeout?: NodeJS.Timeout;
  private lastRender: string = "";
  private useFallbackMode: boolean;
  private isErrored: boolean = false;
  private errorBuffer: Array<{ task: string; error: string }> = [];
  private isCompleted: boolean = false;

  constructor(options: TaskRunnerOptions = {}) {
    this.debug = options.debug || process.env.DEBUG === "true" || process.env.DEBUG_ERRORS === "1";
    this.silent = options.silent || false;
    this.useFallbackMode =
      !process.stdout.isTTY ||
      process.env.PRECAST_SIMPLE_PROGRESS === "true" ||
      process.env.DEBUG_ERRORS === "1";

    if (this.useFallbackMode && this.debug) {
      console.log(
        theme.dim("[DEBUG] Using fallback progress mode (non-TTY or DEBUG_ERRORS enabled)")
      );
    }
  }

  /**
   * Add a task to the runner
   */
  addTask(task: Task): void {
    this.tasks.push(task);
  }

  /**
   * Add multiple tasks
   */
  addTasks(tasks: Task[]): void {
    this.tasks.push(...tasks);
  }

  /**
   * Start the task runner
   */
  start(title?: string): void {
    if (this.silent) return;

    this.startTime = Date.now();

    if (title) {
      console.log();
      console.log(theme.gradient.precast(title));
      console.log();
    }

    for (const task of this.tasks) {
      if (task.isStage && task.subtasks) {
        this.updateStageStatus(task);
      }
    }

    if (!this.useFallbackMode) {
      this.lastRender = "";

      this.renderTasks();
      this.startAnimation();
    } else {
      console.log(theme.info("Starting project creation..."));
    }
  }

  /**
   * Start the spinner animation
   */
  private startAnimation(): void {
    if (this.animationInterval) return;

    this.animationInterval = setInterval(() => {
      const hasRunningTask = this.tasks.some(
        (t) =>
          t.status === "running" || (t.subtasks && t.subtasks.some((st) => st.status === "running"))
      );

      if (hasRunningTask) {
        this.spinnerIndex = (this.spinnerIndex + 1) % this.spinnerFrames.length;
        this.renderTasks();
      } else if (this.animationInterval) {
        clearInterval(this.animationInterval);
        this.animationInterval = undefined;
      }
    }, 100);
  }

  /**
   * Update task status
   */
  updateTask(taskId: string, status: Task["status"], message?: string): void {
    if (this.useFallbackMode) {
      const task = this.findTask(taskId);
      if (task && task.status !== status) {
        if (status === "completed") {
          console.log(`${theme.success("✓")} ${task.title}`);
        } else if (status === "failed") {
          console.log(`${theme.error("✗")} ${task.title} ${message ? `(${message})` : ""}`);
        }
        task.status = status;
        if (message) task.message = message;
      }
      return;
    }

    const task = this.findTask(taskId);
    if (task) {
      if (task.status === status) return;

      task.status = status;
      if (message) task.message = message;

      for (const stage of this.tasks) {
        if (stage.subtasks && stage.subtasks.includes(task)) {
          this.updateStageStatus(stage);
          break;
        }
      }

      if (!this.batchMode) {
        this.renderTasks();
      }
    }
  }

  private batchMode: boolean = false;

  /**
   * Batch multiple task updates
   */
  batchUpdate(fn: () => void): void {
    this.batchMode = true;
    fn();
    this.batchMode = false;

    if (this.renderTimeout) {
      clearTimeout(this.renderTimeout);
      this.renderTimeout = undefined;
    }

    const output: string[] = [];

    for (let i = 0; i < this.tasks.length; i++) {
      const task = this.tasks[i];

      const formatted = this.formatTask(task, 0);
      if (i === 0 && task.isStage && formatted.startsWith("\n")) {
        output.push(formatted.substring(1));
      } else {
        output.push(formatted);
      }

      if (task.subtasks) {
        for (const subtask of task.subtasks) {
          output.push(this.formatTask(subtask, task.isStage ? 1 : 2));
        }
      }
    }

    const newRender = output.join("\n");

    if (newRender !== this.lastRender) {
      logUpdate(newRender);
      this.lastRender = newRender;
    }
  }

  /**
   * Start a specific task
   */
  async runTask(
    taskId: string,
    fn: () => Promise<void>,
    continueOnError: boolean = false
  ): Promise<void> {
    const task = this.findTask(taskId);
    if (!task) return;

    if (task.isStage) {
      console.warn(`Cannot run stage task directly: ${taskId}`);
      return;
    }

    for (const t of this.tasks) {
      if (t.status === "running") {
        t.status = "pending";
      }
      if (t.subtasks) {
        for (const st of t.subtasks) {
          if (st.status === "running") {
            st.status = "pending";
          }
        }
      }
    }

    this.updateTask(taskId, "running");

    if (!this.useFallbackMode) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    try {
      await fn();

      if (this.animationInterval) {
        clearInterval(this.animationInterval);
        this.animationInterval = undefined;
      }

      this.updateTask(taskId, "completed");

      this.startAnimation();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";

      const { errorCollector, logErrorToFile } = await import("./error-collector.js");

      errorCollector.addError(taskId, error);
      if (process.env.DEBUG_ERRORS) {
        logErrorToFile(taskId, error);
      }

      this.updateTask(taskId, "failed", errorMessage);

      const task = this.findTask(taskId);
      if (task) {
        this.errorBuffer.push({ task: task.title, error: errorMessage });
      }

      if (process.env.DEBUG_ERRORS) {
        process.stderr.write(`\n📍 [TASK FAILED] ${taskId}: ${errorMessage}\n`);
        if (error instanceof Error && error.stack) {
          process.stderr.write(`Stack trace:\n${error.stack}\n`);
        }
        process.stderr.write(`${"=".repeat(80)}\n`);
      }

      if (continueOnError) {
        this.startAnimation();
      } else {
        this.isErrored = true;

        if (this.animationInterval) {
          clearInterval(this.animationInterval);
          this.animationInterval = undefined;
        }

        if (this.renderTimeout) {
          clearTimeout(this.renderTimeout);
          this.renderTimeout = undefined;
        }

        if (!this.useFallbackMode && !process.env.DEBUG_ERRORS) {
          logUpdate.clear();
          logUpdate.done();
        }

        if (this.debug) {
          console.error(chalk.red("\nDebug output:"));
          console.error(error);
        }

        throw error;
      }
    }
  }

  /**
   * Skip a task
   */
  skipTask(taskId: string, reason?: string): void {
    this.updateTask(taskId, "skipped", reason);
  }

  /**
   * Complete all tasks
   */
  complete(message?: string): void {
    if (this.silent) return;

    if (this.animationInterval) {
      clearInterval(this.animationInterval);
      this.animationInterval = undefined;
    }

    if (this.renderTimeout) {
      clearTimeout(this.renderTimeout);
      this.renderTimeout = undefined;
    }

    if (this.useFallbackMode) {
      const elapsed = ((Date.now() - this.startTime) / 1000).toFixed(1);
      console.log();
      console.log(theme.success(`${statusSymbols.success} All tasks completed in ${elapsed}s`));
      if (message) {
        console.log(theme.dim(message));
      }
      return;
    }

    const output: string[] = [];
    for (let i = 0; i < this.tasks.length; i++) {
      const task = this.tasks[i];
      const formatted = this.formatTask(task, 0);
      if (i === 0 && task.isStage && formatted.startsWith("\n")) {
        output.push(formatted.substring(1));
      } else {
        output.push(formatted);
      }
      if (task.subtasks) {
        for (const subtask of task.subtasks) {
          output.push(this.formatTask(subtask, task.isStage ? 1 : 2));
        }
      }
    }

    this.isCompleted = true;

    logUpdate.clear();
    logUpdate(output.join("\n"));
    logUpdate.done();

    const elapsed = ((Date.now() - this.startTime) / 1000).toFixed(1);
    console.log();
    console.log(theme.success(`${statusSymbols.success} All tasks completed in ${elapsed}s`));

    if (message) {
      console.log(theme.dim(message));
    }
  }

  /**
   * Show error and stop
   */
  error(message: string): void {
    if (this.silent) return;

    this.isErrored = true;

    if (this.animationInterval) {
      clearInterval(this.animationInterval);
      this.animationInterval = undefined;
    }

    if (this.renderTimeout) {
      clearTimeout(this.renderTimeout);
      this.renderTimeout = undefined;
    }

    if (!this.useFallbackMode) {
      logUpdate.clear();
      logUpdate.done();
    }

    console.log();
    console.log(theme.error(`${statusSymbols.error} ${message}`));
  }

  /**
   * Get buffered errors
   */
  getErrorBuffer(): Array<{ task: string; error: string }> {
    return [...this.errorBuffer];
  }

  /**
   * Clear error buffer
   */
  clearErrorBuffer(): void {
    this.errorBuffer.length = 0;
  }

  /**
   * Render the task list
   */
  private renderTasks(): void {
    if (this.silent || this.batchMode || this.isErrored || this.isCompleted || this.useFallbackMode)
      return;

    if (process.env.DEBUG_ERRORS) {
      return;
    }

    if (this.renderTimeout) {
      clearTimeout(this.renderTimeout);
      this.renderTimeout = undefined;
    }

    this.renderTimeout = setTimeout(() => {
      if (this.renderTimeout === null) return;

      const output: string[] = [];

      for (let i = 0; i < this.tasks.length; i++) {
        const task = this.tasks[i];

        const formatted = this.formatTask(task, 0);
        if (i === 0 && task.isStage && formatted.startsWith("\n")) {
          output.push(formatted.substring(1));
        } else {
          output.push(formatted);
        }

        if (task.subtasks) {
          for (const subtask of task.subtasks) {
            output.push(this.formatTask(subtask, task.isStage ? 1 : 2));
          }
        }
      }

      const newRender = output.join("\n");

      if (newRender !== this.lastRender && !this.isErrored && !this.isCompleted) {
        try {
          logUpdate(newRender);
          this.lastRender = newRender;
        } catch {
          console.log(newRender);
        }
      }
      this.renderTimeout = undefined;
    }, 50);
  }

  /**
   * Simple rendering for non-TTY environments
   */
  private renderSimple(): void {
    return;
  }

  /**
   * Format a single task for display
   */
  private formatTask(task: Task, indent: number = 0): string {
    const indentStr = "  ".repeat(indent);

    if (task.isStage) {
      let titleColor = theme.info; // Use info color (cyan) by default for visibility
      let statusIcon = "";

      if (task.status === "completed") {
        titleColor = theme.success;
        statusIcon = "✓ ";
      } else if (task.status === "running") {
        titleColor = theme.info;
        statusIcon = "→ ";
      } else if (task.status === "failed") {
        titleColor = theme.error;
        statusIcon = "✗ ";
      } else {
        statusIcon = "  ";
      }

      return `\n${indentStr}${titleColor(statusIcon + task.title + ":")}`;
    }

    let checkbox: string;
    let titleColor: (text: string) => string;
    let spinner = "";

    switch (task.status) {
      case "completed":
        checkbox = "[✓]";
        titleColor = theme.success;
        break;
      case "running":
        checkbox = "[ ]";
        titleColor = theme.info;
        spinner = ` ${theme.info(this.spinnerFrames[this.spinnerIndex])}`;
        break;
      case "failed":
        checkbox = "[✗]";
        titleColor = theme.error;
        break;
      case "skipped":
        checkbox = "[-]";
        titleColor = theme.muted;
        break;
      default:
        checkbox = "[ ]";
        titleColor = theme.dim;
    }

    let line = `${indentStr}${theme.dim(checkbox)} ${titleColor(task.title)}${spinner}`;

    if (task.message && (task.status === "failed" || this.debug)) {
      line += ` ${theme.dim(`(${task.message})`)}`;
    }

    return line;
  }

  /**
   * Find a task by ID
   */
  private findTask(taskId: string): Task | undefined {
    for (const task of this.tasks) {
      if (task.id === taskId) return task;
      if (task.subtasks) {
        const subtask = task.subtasks.find((st) => st.id === taskId);
        if (subtask) return subtask;
      }
    }
    return undefined;
  }

  /**
   * Update stage status based on subtasks
   */
  private updateStageStatus(stage: Task): void {
    if (!stage.isStage || !stage.subtasks) return;

    const allCompleted = stage.subtasks.every(
      (st) => st.status === "completed" || st.status === "skipped"
    );
    const anyRunning = stage.subtasks.some((st) => st.status === "running");
    const anyFailed = stage.subtasks.some((st) => st.status === "failed");

    let newStatus = stage.status;

    if (anyFailed) {
      newStatus = "failed";
    } else if (anyRunning) {
      newStatus = "running";
    } else if (allCompleted) {
      newStatus = "completed";
    } else {
      newStatus = "pending";
    }

    if (stage.status !== newStatus) {
      stage.status = newStatus;
    }
  }
}

/**
 * Create a progress bar for file operations
 */
export function createFileProgressBar(total: number, label: string): SingleBar {
  const bar = new SingleBar({
    format: `${theme.info(label)} |${chalk.cyan("{bar}")}| {percentage}% | {value}/{total} files`,
    barCompleteChar: "\u2588",
    barIncompleteChar: "\u2591",
    hideCursor: true,
  });

  bar.start(total, 0);
  return bar;
}

/**
 * Create a simple spinner with text
 */
export function createSpinner(text: string): Ora {
  return ora({
    text,
    spinner: {
      frames: progressSpinner,
      interval: 80,
    },
    color: "cyan",
  });
}

/**
 * Show a task completion summary
 */
export function showTaskSummary(
  tasks: { name: string; status: "success" | "failed" | "skipped"; time?: number }[]
): void {
  console.log();
  console.log(theme.bold("Task Summary:"));
  console.log(theme.dim("─".repeat(50)));

  for (const task of tasks) {
    let icon: string;
    let color: (text: string) => string;

    switch (task.status) {
      case "success":
        icon = statusSymbols.success;
        color = theme.success;
        break;
      case "failed":
        icon = statusSymbols.error;
        color = theme.error;
        break;
      case "skipped":
        icon = "-";
        color = theme.muted;
        break;
    }

    let line = `  ${color(icon)} ${task.name}`;
    if (task.time) {
      line += theme.dim(` (${task.time}ms)`);
    }
    console.log(line);
  }

  console.log(theme.dim("─".repeat(50)));
}

/**
 * Display debug information
 */
export function debugLog(message: string, data?: any): void {
  if (process.env.DEBUG !== "true") return;

  console.log(theme.dim(`[DEBUG] ${message}`));
  if (data) {
    console.log(theme.dim(JSON.stringify(data, null, 2)));
  }
}

/**
 * Create an animated task list that updates in place
 */
export class AnimatedTaskList {
  private tasks: Map<string, { title: string; status: Task["status"]; startTime: number }> =
    new Map();
  private interval: NodeJS.Timeout | null = null;

  add(id: string, title: string): void {
    this.tasks.set(id, { title, status: "pending", startTime: Date.now() });
    this.start();
  }

  update(id: string, status: Task["status"]): void {
    const task = this.tasks.get(id);
    if (task) {
      task.status = status;
      this.render();
    }
  }

  private start(): void {
    if (this.interval) return;

    this.interval = setInterval(() => {
      this.render();
    }, 100);
  }

  private render(): void {
    const lines: string[] = [];

    for (const [, task] of this.tasks) {
      const elapsed = Math.floor((Date.now() - task.startTime) / 1000);
      let icon: string;
      let color: (text: string) => string;

      switch (task.status) {
        case "completed":
          icon = statusSymbols.success;
          color = theme.success;
          break;
        case "running": {
          const frame = progressSpinner[Math.floor(Date.now() / 100) % progressSpinner.length];
          icon = frame;
          color = theme.info;
          break;
        }
        case "failed":
          icon = statusSymbols.error;
          color = theme.error;
          break;
        default:
          icon = statusSymbols.pending;
          color = theme.dim;
      }

      lines.push(`${color(icon)} ${task.title} ${theme.dim(`[${elapsed}s]`)}`);
    }

    logUpdate(lines.join("\n"));
  }

  stop(): void {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
    logUpdate.clear();
  }
}

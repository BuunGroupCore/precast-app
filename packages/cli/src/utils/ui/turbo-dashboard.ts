import chalk from "chalk";
import cliWidth from "cli-width";
import stripAnsi from "strip-ansi";

export interface TurboTask {
  id: string;
  name: string;
  status: "pending" | "running" | "success" | "error" | "skipped";
  startTime?: Date;
  endTime?: Date;
  output: string[];
  progress?: number;
}

export interface TurboDashboardOptions {
  showOutput?: boolean;
  maxOutputLines?: number;
  refreshRate?: number;
  title?: string;
  mode?: "build" | "dev";
  interactive?: boolean;
}

export class TurboDashboard {
  private tasks: Map<string, TurboTask> = new Map();
  private currentOutput: string[] = [];
  private options: Required<TurboDashboardOptions>;
  private isActive: boolean = false;
  private refreshInterval?: NodeJS.Timeout;
  private lastRenderTime: number = 0;
  private hasChanges: boolean = false;

  constructor(options: TurboDashboardOptions = {}) {
    this.options = {
      showOutput: options.showOutput ?? true,
      maxOutputLines: options.maxOutputLines ?? 15,
      refreshRate: options.refreshRate ?? 500, // 500ms refresh by default
      title: options.title ?? "[TURBO] BUILD DASHBOARD",
      mode: options.mode ?? "build",
      interactive: options.interactive ?? false,
    };
  }

  start(): void {
    this.isActive = true;
    this.render();

    if (this.options.refreshRate > 0) {
      this.refreshInterval = setInterval(() => {
        if (this.isActive && this.hasChanges) {
          this.render();
          this.hasChanges = false;
        }
      }, this.options.refreshRate);
    }
  }

  stop(): void {
    this.isActive = false;
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
  }

  addTask(task: Omit<TurboTask, "output">): void {
    this.tasks.set(task.id, { ...task, output: [] });
    this.hasChanges = true;
    if (this.options.refreshRate === 0) this.render();
  }

  updateTask(id: string, updates: Partial<TurboTask>): void {
    const task = this.tasks.get(id);
    if (task) {
      Object.assign(task, updates);
      this.hasChanges = true;
      if (this.options.refreshRate === 0) this.render();
    }
  }

  addOutput(taskId: string, message: string): void {
    const task = this.tasks.get(taskId);
    if (task) {
      task.output.push(message);
      // Keep output manageable
      if (task.output.length > this.options.maxOutputLines * 2) {
        task.output = task.output.slice(-this.options.maxOutputLines);
      }
    }

    // Update current output view
    this.currentOutput.push(`[${taskId}] ${message}`);
    if (this.currentOutput.length > this.options.maxOutputLines) {
      this.currentOutput = this.currentOutput.slice(-this.options.maxOutputLines);
    }

    this.hasChanges = true;
    if (this.options.refreshRate === 0) this.render();
  }

  private render(): void {
    if (!this.isActive) return;

    // Rate limiting - don't render more than once per 100ms
    const now = Date.now();
    if (now - this.lastRenderTime < 100) return;
    this.lastRenderTime = now;

    const termWidth = cliWidth({ defaultWidth: 120 });
    const taskPanelWidth = Math.max(40, Math.floor(termWidth * 0.4));
    const outputPanelWidth = termWidth - taskPanelWidth - 3;

    // Clear screen and move to top
    process.stdout.write("\x1B[2J\x1B[0f");

    // Header
    const header = this.renderHeader(termWidth);
    console.log(header);

    // Main content area
    if (this.options.showOutput) {
      this.renderSplitView(taskPanelWidth, outputPanelWidth);
    } else {
      this.renderTasksOnly(termWidth);
    }

    // Footer
    const footer = this.renderFooter(termWidth);
    console.log(footer);
  }

  private renderHeader(width: number): string {
    const title = this.options.title;
    const runningTasks = Array.from(this.tasks.values()).filter(
      (t) => t.status === "running"
    ).length;
    const completedTasks = Array.from(this.tasks.values()).filter(
      (t) => t.status === "success"
    ).length;
    const totalTasks = this.tasks.size;

    const stats = `Running: ${runningTasks} | Completed: ${completedTasks}/${totalTasks}`;

    const headerLine = "━".repeat(width);
    const titleLine = this.centerText(title, width);
    const statsLine = this.centerText(stats, width);

    return [
      chalk.hex("#00d4aa")(headerLine),
      chalk.hex("#00d4aa").bold(titleLine),
      chalk.hex("#64748b")(statsLine),
      chalk.hex("#00d4aa")(headerLine),
    ].join("\n");
  }

  private renderSplitView(taskWidth: number, outputWidth: number): void {
    const maxHeight = 20;
    const tasks = Array.from(this.tasks.values());

    // Create side-by-side layout
    const taskLines = this.renderTaskPanel(tasks, taskWidth, maxHeight);
    const outputLines = this.renderOutputPanel(outputWidth, maxHeight);

    // Ensure both panels have the same height
    const maxLines = Math.max(taskLines.length, outputLines.length);
    while (taskLines.length < maxLines) taskLines.push(" ".repeat(taskWidth));
    while (outputLines.length < maxLines) outputLines.push(" ".repeat(outputWidth));

    // Render side by side
    for (let i = 0; i < maxLines; i++) {
      const taskLine = taskLines[i] || " ".repeat(taskWidth);
      const outputLine = outputLines[i] || " ".repeat(outputWidth);
      console.log(`${taskLine} │ ${outputLine}`);
    }
  }

  private renderTaskPanel(tasks: TurboTask[], width: number, maxHeight: number): string[] {
    const lines: string[] = [];
    const contentWidth = width - 4; // Account for borders and padding

    // Panel header
    lines.push(chalk.hex("#3b82f6").bold(` TASKS `.padEnd(width)));
    lines.push(chalk.hex("#64748b")("─".repeat(width)));

    // Task list
    tasks.slice(0, maxHeight - 3).forEach((task, index) => {
      const icon = this.getTaskIcon(task.status);
      const name =
        task.name.length > contentWidth - 8
          ? task.name.slice(0, contentWidth - 11) + "..."
          : task.name;

      const duration =
        task.startTime && task.status === "running"
          ? ` (${this.formatDuration(Date.now() - task.startTime.getTime())})`
          : "";

      const line = ` ${icon} ${name}${duration}`.slice(0, contentWidth);
      lines.push(this.colorizeTaskLine(line, task.status).padEnd(width));
    });

    // Fill remaining space
    while (lines.length < maxHeight) {
      lines.push(" ".repeat(width));
    }

    return lines;
  }

  private renderOutputPanel(width: number, maxHeight: number): string[] {
    const lines: string[] = [];
    const contentWidth = width - 2;

    // Panel header
    lines.push(chalk.hex("#10b981").bold(`OUTPUT`.padEnd(width)));
    lines.push(chalk.hex("#64748b")("─".repeat(width)));

    // Recent output
    const recentOutput = this.currentOutput.slice(-(maxHeight - 3));
    recentOutput.forEach((line) => {
      const cleanLine = stripAnsi(line);
      const truncated =
        cleanLine.length > contentWidth ? cleanLine.slice(0, contentWidth - 3) + "..." : cleanLine;
      lines.push(chalk.hex("#9ca3af")(` ${truncated}`).padEnd(width));
    });

    // Fill remaining space
    while (lines.length < maxHeight) {
      lines.push(" ".repeat(width));
    }

    return lines;
  }

  private renderTasksOnly(width: number): void {
    const tasks = Array.from(this.tasks.values());

    console.log(chalk.hex("#3b82f6").bold("TASKS:"));
    console.log(chalk.hex("#64748b")("─".repeat(width)));

    tasks.forEach((task, index) => {
      const icon = this.getTaskIcon(task.status);
      const progress = task.progress ? ` (${Math.round(task.progress)}%)` : "";
      const duration = this.getTaskDuration(task);

      const line = `  ${icon} ${task.name}${progress}${duration}`;
      console.log(this.colorizeTaskLine(line, task.status));
    });
  }

  private renderFooter(width: number): string {
    const controls = "Press Ctrl+C to exit";
    const footerLine = "━".repeat(width);
    const controlsLine = this.centerText(controls, width);

    return [chalk.hex("#64748b")(footerLine), chalk.hex("#64748b")(controlsLine)].join("\n");
  }

  private getTaskIcon(status: TurboTask["status"]): string {
    const icons = {
      pending: chalk.hex("#64748b")("[WAIT]"),
      running: chalk.hex("#3b82f6")("[RUN]"),
      success: chalk.hex("#10b981")("[OK]"),
      error: chalk.hex("#ef4444")("[ERR]"),
      skipped: chalk.hex("#64748b")("[SKIP]"),
    };
    return icons[status];
  }

  private colorizeTaskLine(line: string, status: TurboTask["status"]): string {
    switch (status) {
      case "running":
        return chalk.hex("#3b82f6")(line);
      case "success":
        return chalk.hex("#10b981")(line);
      case "error":
        return chalk.hex("#ef4444")(line);
      case "pending":
        return chalk.hex("#64748b")(line);
      case "skipped":
        return chalk.hex("#64748b").dim(line);
      default:
        return line;
    }
  }

  private getTaskDuration(task: TurboTask): string {
    if (!task.startTime) return "";

    const endTime = task.endTime || new Date();
    const duration = endTime.getTime() - task.startTime.getTime();
    return ` (${this.formatDuration(duration)})`;
  }

  private formatDuration(ms: number): string {
    if (ms < 1000) return `${ms}ms`;
    const seconds = Math.floor(ms / 1000);
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    return `${minutes}m ${seconds % 60}s`;
  }

  private centerText(text: string, width: number): string {
    const padding = Math.max(0, width - text.length);
    const leftPad = Math.floor(padding / 2);
    const rightPad = padding - leftPad;
    return " ".repeat(leftPad) + text + " ".repeat(rightPad);
  }

  // Public methods for integration
  getRunningTasks(): TurboTask[] {
    return Array.from(this.tasks.values()).filter((t) => t.status === "running");
  }

  getCompletedTasks(): TurboTask[] {
    return Array.from(this.tasks.values()).filter(
      (t) => t.status === "success" || t.status === "error"
    );
  }

  getTotalProgress(): number {
    const tasks = Array.from(this.tasks.values());
    if (tasks.length === 0) return 0;

    const completed = tasks.filter((t) => t.status === "success" || t.status === "error").length;
    return (completed / tasks.length) * 100;
  }

  /**
   * Start interactive mode for dev tasks (placeholder implementation)
   * This would be implemented with proper keyboard handling and task management
   */
  async startInteractive(
    taskStates: Record<string, any>,
    handlers: {
      onTaskToggle?: (taskId: string, enabled: boolean) => void;
      onTaskRestart?: (taskId: string) => void;
      onTaskView?: (taskId: string) => void;
      onExit?: () => void;
    }
  ): Promise<void> {
    // Convert task states to TurboTask format
    Object.entries(taskStates).forEach(([id, state]) => {
      this.addTask({
        id,
        name: state.name,
        status:
          state.status === "ready"
            ? "success"
            : state.status === "error"
              ? "error"
              : state.status === "running"
                ? "running"
                : "pending",
      });
    });

    this.start();

    // Simple implementation - for a full interactive version, you'd need:
    // - Keyboard input handling (readline or similar)
    // - Cursor navigation
    // - Key bindings (Enter, Space, q, r, etc.)
    // - Real-time task state updates

    console.log(chalk.hex("#ffd600")("\n  Interactive mode started - Press Ctrl+C to exit"));

    // Keep running until interrupted
    return new Promise((resolve) => {
      process.on("SIGINT", () => {
        this.stop();
        if (handlers.onExit) handlers.onExit();
        resolve();
      });
    });
  }
}

// Usage example:
export function createTurboDemo(): TurboDashboard {
  const dashboard = new TurboDashboard({
    showOutput: true,
    maxOutputLines: 15,
    refreshRate: 200,
  });

  // Add some example tasks
  dashboard.addTask({ id: "web", name: "@repo/web:build", status: "pending" });
  dashboard.addTask({ id: "ui", name: "@repo/ui:build", status: "pending" });
  dashboard.addTask({ id: "api", name: "@repo/api:build", status: "pending" });

  return dashboard;
}

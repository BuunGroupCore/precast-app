/**
 * Interactive Turbo Dashboard with keyboard controls
 * Handles arrow key navigation, task interaction, and real-time updates
 */

import { spawn, ChildProcess } from "child_process";
import { existsSync, readFileSync } from "fs";
import { join } from "path";

import chalk from "chalk";
import cliWidth from "cli-width";

export interface InteractiveTask {
  id: string;
  name: string;
  status: "pending" | "running" | "ready" | "error" | "stopped";
  process?: ChildProcess;
  output: string[];
  lastActivity: Date;
  startTime?: Date; // Track when task was started
  port?: number;
  url?: string;
  package: string;
  category?: "app" | "package" | "shared";
}

export interface InteractiveDashboardCallbacks {
  onTaskStart?: (taskId: string) => void;
  onTaskStop?: (taskId: string) => void;
  onTaskRestart?: (taskId: string) => void;
  onExit?: () => void;
}

export class InteractiveTurboDashboard {
  private tasks: Map<string, InteractiveTask> = new Map();
  private selectedTaskIndex: number = 0;
  private interactionMode: boolean = false;
  private isActive: boolean = false;
  private callbacks: InteractiveDashboardCallbacks = {};
  private renderThrottleTimer: NodeJS.Timeout | null = null;
  private lastRenderTime: number = 0;
  private autoRefreshTimer: NodeJS.Timeout | null = null;
  private outputBuffers: Map<string, string> = new Map(); // Buffer partial lines

  constructor(
    tasks: Record<string, InteractiveTask>,
    callbacks: InteractiveDashboardCallbacks = {}
  ) {
    this.callbacks = callbacks;

    // Convert tasks to Map
    Object.entries(tasks).forEach(([id, task]) => {
      this.tasks.set(id, { ...task });
    });

    this.setupKeyboard();
    this.startAutoRefresh();
  }

  /**
   * Start auto-refresh timer for live updates
   */
  private startAutoRefresh(): void {
    // Auto-refresh every second to update timers and status
    this.autoRefreshTimer = setInterval(() => {
      if (this.isActive) {
        // Check if any tasks are running
        const hasRunningTasks = Array.from(this.tasks.values()).some((t) => t.status === "running");
        if (hasRunningTasks) {
          // Use partial render to avoid flicker
          this.render(true);
        }
      }
    }, 1000);
  }

  private setupKeyboard(): void {
    // Enable raw mode for keyboard input
    if (process.stdin.setRawMode) {
      process.stdin.setRawMode(true);
    }
    process.stdin.resume();
    process.stdin.setEncoding("utf8");

    process.stdin.on("data", (key: string) => {
      this.handleKeyPress(key);
    });
  }

  private handleKeyPress(key: string): void {
    const taskArray = this.getOrderedTasks(Array.from(this.tasks.values()));

    switch (key) {
      case "\u0003": // Ctrl+C
        this.exit();
        break;

      case "\u001B[A": // Up arrow
        if (!this.interactionMode && taskArray.length > 0) {
          this.selectedTaskIndex = Math.max(0, this.selectedTaskIndex - 1);
          this.render();
        }
        break;

      case "\u001B[B": // Down arrow
        if (!this.interactionMode && taskArray.length > 0) {
          this.selectedTaskIndex = Math.min(taskArray.length - 1, this.selectedTaskIndex + 1);
          this.render();
        }
        break;

      case "\r": // Enter
        if (!this.interactionMode) {
          this.toggleSelectedTask();
        }
        break;

      case "i": // Interaction mode
      case "I":
        this.interactionMode = !this.interactionMode;
        this.render();
        break;

      case "r": // Restart task
      case "R":
        if (!this.interactionMode) {
          this.restartSelectedTask();
        }
        break;

      case "q": // Quit
      case "Q":
        this.exit();
        break;

      case " ": // Space - view output
        if (!this.interactionMode) {
          this.viewTaskOutput();
        }
        break;
    }
  }

  private toggleSelectedTask(): void {
    const taskArray = this.getOrderedTasks(Array.from(this.tasks.values()));
    if (taskArray.length === 0) return;

    const selectedTask = taskArray[this.selectedTaskIndex];
    if (!selectedTask) return;

    if (selectedTask.status === "running") {
      this.stopTask(selectedTask.id);
    } else {
      this.startTask(selectedTask.id);
    }
  }

  private restartSelectedTask(): void {
    const taskArray = this.getOrderedTasks(Array.from(this.tasks.values()));
    if (taskArray.length === 0) return;

    const selectedTask = taskArray[this.selectedTaskIndex];
    if (!selectedTask) return;

    this.restartTask(selectedTask.id);
  }

  private viewTaskOutput(): void {
    const taskArray = this.getOrderedTasks(Array.from(this.tasks.values()));
    if (taskArray.length === 0) return;

    const selectedTask = taskArray[this.selectedTaskIndex];
    if (!selectedTask) return;

    // This will be handled by the render method to show output on right panel
    this.render();
  }

  private startTask(taskId: string): void {
    const task = this.tasks.get(taskId);
    if (!task || task.status === "running") return;

    task.status = "running";
    task.output = [`Starting ${task.name}...`];
    task.lastActivity = new Date();
    task.startTime = new Date(); // Track start time

    // Determine the package directory and package manager
    const packageDir = this.findPackageDirectory(task.package);
    if (!packageDir) {
      task.status = "error";
      task.output.push(`Error: Could not find package directory for ${task.package}`);
      return;
    }

    const packageManager = this.detectPackageManager(packageDir);
    const devCommand = this.buildDevCommand(packageManager);

    task.output.push(`Using ${packageManager} in ${packageDir}`);
    task.output.push(`Running: ${devCommand.join(" ")}`);

    // Start the dev process in the package directory with process group
    const turboProcess = spawn(devCommand[0], devCommand.slice(1), {
      stdio: "pipe",
      shell: false, // Don't use shell to have better control
      cwd: packageDir,
      detached: process.platform !== "win32", // Create new process group (not on Windows)
    });

    task.process = turboProcess;

    // Handle stdout
    turboProcess.stdout?.on("data", (data: Buffer) => {
      // Buffer handling to prevent partial ANSI sequences
      const buffer = this.outputBuffers.get(task.id) || "";
      const output = buffer + data.toString();

      // Split into lines, keeping the last potentially incomplete line in buffer
      const lines = output.split(/\r?\n/);
      const lastLine = lines.pop() || "";

      // Store incomplete line for next data chunk
      this.outputBuffers.set(task.id, lastLine);

      // Process complete lines
      const processedLines = lines
        .filter((line) => line.trim())
        .map((line) => {
          // Double-clean to catch any remaining ANSI codes
          let cleaned = this.stripAnsiCodes(line);
          // Remove any remaining number patterns that look like broken ANSI
          cleaned = cleaned.replace(/(?:^|\s)\d+;\d+;\d+m/g, "");
          return cleaned;
        })
        .filter((line) => line && this.isSignificantLine(line));

      if (processedLines.length > 0) {
        task.output.push(...processedLines);
        task.lastActivity = new Date();
      }

      // Keep output manageable - keep more lines for better context
      if (task.output.length > 200) {
        task.output = task.output.slice(-100); // Keep last 100 lines
      }

      // Update the task time immediately
      this.tasks.set(task.id, task);

      // Smart status detection
      if (this.isTaskReady(output)) {
        task.status = "ready";
      }

      // Throttled rendering to prevent overwhelming
      this.throttledRender();
    });

    // Handle stderr - be more selective about what constitutes an error
    turboProcess.stderr?.on("data", (data: Buffer) => {
      // Buffer handling to prevent partial ANSI sequences
      const bufferId = `${task.id}-stderr`;
      const buffer = this.outputBuffers.get(bufferId) || "";
      const output = buffer + data.toString();

      // Split into lines, keeping the last potentially incomplete line in buffer
      const lines = output.split(/\r?\n/);
      const lastLine = lines.pop() || "";

      // Store incomplete line for next data chunk
      this.outputBuffers.set(bufferId, lastLine);

      // Process complete lines
      const processedLines = lines
        .filter((line) => line.trim())
        .map((line) => {
          // Double-clean to catch any remaining ANSI codes
          let cleaned = this.stripAnsiCodes(line);
          // Remove any remaining number patterns that look like broken ANSI
          cleaned = cleaned.replace(/(?:^|\s)\d+;\d+;\d+m/g, "");
          return cleaned;
        })
        .filter((line) => line && this.isSignificantLine(line) && !this.isIgnorableError(line));

      if (processedLines.length > 0) {
        task.output.push(...processedLines);
        task.lastActivity = new Date();

        // Only mark as error for critical issues
        if (this.isCriticalError(output)) {
          task.status = "error";
        }
      }

      this.throttledRender();
    });

    // Handle process exit
    turboProcess.on("close", (code: number) => {
      // Flush any remaining buffered output
      const buffer = this.outputBuffers.get(task.id);
      if (buffer && buffer.trim()) {
        const cleanLine = this.stripAnsiCodes(buffer);
        if (cleanLine && this.isSignificantLine(cleanLine)) {
          task.output.push(cleanLine);
        }
      }

      // Clean up buffers
      this.outputBuffers.delete(task.id);
      this.outputBuffers.delete(`${task.id}-stderr`);

      if (code === 0) {
        task.status = "stopped";
        task.output.push(`Process exited with code ${code}`);
      } else {
        task.status = "error";
        task.output.push(`Process failed with code ${code}`);
      }
      task.process = undefined;
      this.render();
    });

    turboProcess.on("error", (error: Error) => {
      task.status = "error";
      task.output.push(`Process error: ${error.message}`);
      task.process = undefined;
      this.render();
    });

    if (this.callbacks.onTaskStart) {
      this.callbacks.onTaskStart(taskId);
    }

    this.render();
  }

  private stopTask(taskId: string): void {
    const task = this.tasks.get(taskId);
    if (!task || !task.process) return;

    task.output.push(`Stopping task and freeing port ${task.port || ""}...`);

    if (!task.process.killed) {
      // Use SIGKILL immediately for better port cleanup
      if (task.process.pid) {
        try {
          // Kill the entire process group forcefully
          process.kill(-task.process.pid, "SIGKILL");
        } catch {
          // If group kill fails, try individual process
          try {
            task.process.kill("SIGKILL");
          } catch {
            // Process might already be dead
          }
        }
      } else {
        task.process.kill("SIGKILL");
      }
    }

    // Clean up buffers for this task
    this.outputBuffers.delete(task.id);
    this.outputBuffers.delete(`${task.id}-stderr`);

    task.status = "stopped";
    task.output.push(`Task stopped and port ${task.port || "N/A"} freed`);
    task.process = undefined;

    if (this.callbacks.onTaskStop) {
      this.callbacks.onTaskStop(taskId);
    }

    this.render();
  }

  private restartTask(taskId: string): void {
    this.stopTask(taskId);

    // Wait a moment for cleanup
    setTimeout(() => {
      this.startTask(taskId);
    }, 1000);

    if (this.callbacks.onTaskRestart) {
      this.callbacks.onTaskRestart(taskId);
    }
  }

  public start(): void {
    this.isActive = true;
    this.render();
  }

  public stop(): void {
    this.isActive = false;

    // Stop auto-refresh timer
    if (this.autoRefreshTimer) {
      clearInterval(this.autoRefreshTimer);
      this.autoRefreshTimer = null;
    }

    // Stop all running tasks
    this.tasks.forEach((task) => {
      if (task.process && !task.process.killed) {
        task.process.kill("SIGTERM");
      }
    });

    // Restore terminal
    if (process.stdin.setRawMode) {
      process.stdin.setRawMode(false);
    }
    process.stdin.pause();
  }

  private exit(): void {
    this.stop();

    if (this.callbacks.onExit) {
      this.callbacks.onExit();
    }

    process.exit(0);
  }

  private render(partial: boolean = false): void {
    if (!this.isActive) return;

    const termWidth = cliWidth({ defaultWidth: 120 });
    const taskPanelWidth = Math.max(40, Math.floor(termWidth * 0.4));
    const outputPanelWidth = termWidth - taskPanelWidth - 3;

    if (!partial) {
      // Full screen clear for initial render or major changes
      process.stdout.write("\x1B[2J\x1B[0f");
    } else {
      // Move cursor to home position without clearing
      process.stdout.write("\x1B[H");
    }

    // Header
    const header = this.renderHeader(termWidth);
    console.log(header);

    // Main content area
    this.renderSplitView(taskPanelWidth, outputPanelWidth);

    // Footer
    const footer = this.renderFooter(termWidth);
    console.log(footer);
  }

  private renderHeader(width: number): string {
    const title = this.interactionMode ? "[TURBO] INTERACTIVE MODE" : "[TURBO] DEV DASHBOARD";
    const taskArray = Array.from(this.tasks.values());
    const runningTasks = taskArray.filter((t) => t.status === "running").length;
    const readyTasks = taskArray.filter((t) => t.status === "ready").length;
    const totalTasks = taskArray.length;

    const stats = `Running: ${runningTasks} | Ready: ${readyTasks} | Total: ${totalTasks}`;
    const branding = `Powered by Precast • precast.dev`;

    const headerLine = "━".repeat(width);
    const titleLine = this.centerText(title, width);
    const statsLine = this.centerText(stats, width);
    const brandingLine = this.centerText(branding, width);

    return [
      chalk.hex("#00d4aa")(headerLine),
      chalk.hex("#00d4aa").bold(titleLine),
      chalk.hex("#64748b")(statsLine),
      chalk.hex("#8b5cf6").dim(brandingLine),
      chalk.hex("#00d4aa")(headerLine),
    ].join("\n");
  }

  private renderSplitView(taskWidth: number, outputWidth: number): void {
    const maxHeight = 20;
    const taskArray = Array.from(this.tasks.values());

    // Create side-by-side layout
    const taskLines = this.renderTaskPanel(taskArray, taskWidth, maxHeight);
    const outputLines = this.renderOutputPanel(taskArray, outputWidth, maxHeight);

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

  private renderTaskPanel(tasks: InteractiveTask[], width: number, maxHeight: number): string[] {
    const lines: string[] = [];
    const contentWidth = width - 4; // Account for borders and padding

    // Panel header
    lines.push(chalk.hex("#3b82f6").bold(` TASKS `.padEnd(width)));
    lines.push(chalk.hex("#64748b")("─".repeat(width)));

    // Get ordered tasks for consistent indexing
    const orderedTasks = this.getOrderedTasks(tasks);

    // Group tasks by category for display
    const apps = orderedTasks.filter((t) => t.category === "app");
    const packages = orderedTasks.filter((t) => t.category === "package");
    const shared = orderedTasks.filter((t) => t.category === "shared");

    let currentIndex = 0;
    const availableLines = maxHeight - 3;

    // Render apps section
    if (apps.length > 0) {
      lines.push(chalk.hex("#10b981").dim(` ▸ Apps `.padEnd(width)));
      apps.forEach((task) => {
        if (lines.length >= availableLines + 2) return;
        const isSelected = currentIndex === this.selectedTaskIndex;
        lines.push(this.renderTaskLine(task, isSelected, width, contentWidth));
        currentIndex++;
      });
    }

    // Render packages section
    if (packages.length > 0) {
      if (lines.length < availableLines + 2) {
        lines.push(chalk.hex("#f59e0b").dim(` ▸ Packages `.padEnd(width)));
      }
      packages.forEach((task) => {
        if (lines.length >= availableLines + 2) return;
        const isSelected = currentIndex === this.selectedTaskIndex;
        lines.push(this.renderTaskLine(task, isSelected, width, contentWidth));
        currentIndex++;
      });
    }

    // Render shared section
    if (shared.length > 0) {
      if (lines.length < availableLines + 2) {
        lines.push(chalk.hex("#8b5cf6").dim(` ▸ Shared `.padEnd(width)));
      }
      shared.forEach((task) => {
        if (lines.length >= availableLines + 2) return;
        const isSelected = currentIndex === this.selectedTaskIndex;
        lines.push(this.renderTaskLine(task, isSelected, width, contentWidth));
        currentIndex++;
      });
    }

    // Fill remaining space
    while (lines.length < maxHeight) {
      lines.push(" ".repeat(width));
    }

    return lines;
  }

  private renderTaskLine(
    task: InteractiveTask,
    isSelected: boolean,
    width: number,
    contentWidth: number
  ): string {
    const icon = this.getTaskIcon(task.status);
    const name =
      task.name.length > contentWidth - 12
        ? task.name.slice(0, contentWidth - 15) + "..."
        : task.name;

    // Use actual elapsed time since task started
    const duration =
      task.status === "running" && task.startTime
        ? ` (${this.formatDuration(Date.now() - task.startTime.getTime())})`
        : "";

    const line = `  ${icon} ${name}${duration}`.slice(0, contentWidth);
    const coloredLine = this.colorizeTaskLine(line, task.status);

    // Highlight selected task
    return isSelected
      ? chalk.bgHex("#2962ff")(coloredLine.padEnd(width))
      : coloredLine.padEnd(width);
  }

  private renderOutputPanel(tasks: InteractiveTask[], width: number, maxHeight: number): string[] {
    const lines: string[] = [];
    const contentWidth = width - 6; // More padding to prevent overflow

    // Get the correctly ordered task based on category grouping
    const orderedTasks = this.getOrderedTasks(tasks);
    const selectedTask = orderedTasks[this.selectedTaskIndex];

    // Enhanced panel header with status indicator - strip ANSI codes from icon
    const statusIcon = selectedTask
      ? this.stripAnsiCodes(this.getTaskIcon(selectedTask.status)).replace(/\[|\]/g, "")
      : "";
    const headerText = selectedTask ? `OUTPUT ${statusIcon} ${selectedTask.name}` : "OUTPUT";

    // Truncate header if too long
    const truncatedHeader =
      headerText.length > width - 2 ? headerText.slice(0, width - 5) + "..." : headerText;

    lines.push(chalk.hex("#10b981").bold(` ${truncatedHeader} `.padEnd(width)));
    lines.push(chalk.hex("#64748b")("─".repeat(width)));

    // Task output with improved formatting
    if (selectedTask && selectedTask.output.length > 0) {
      const recentOutput = this.filterAndFormatOutput(selectedTask.output, maxHeight - 4);

      recentOutput.forEach(({ text, type }) => {
        const prefix =
          type === "error"
            ? "  ✗ "
            : type === "success"
              ? "  ✓ "
              : type === "info"
                ? "  ◆ "
                : type === "warn"
                  ? "  ⚠ "
                  : "    ";

        // Clean text again to be absolutely sure
        const cleanText = this.stripAnsiCodes(text);

        // Strictly truncate to prevent overflow
        let displayText = cleanText;
        if (displayText.length > contentWidth - prefix.length) {
          displayText = displayText.slice(0, contentWidth - prefix.length - 3) + "...";
        }

        const finalText = `${prefix}${displayText}`;
        const coloredLine = this.colorizeOutputLine(finalText, type, false);

        // Strip ANSI from colored line to prevent corruption
        const strippedLine = this.stripAnsiFromColoredLine(coloredLine);

        // Ensure line doesn't exceed width
        const safeLine = strippedLine.slice(0, width);
        lines.push(safeLine.padEnd(width));
      });

      // Add scroll indicator if there's more content
      if (selectedTask.output.length > maxHeight - 4) {
        const hiddenLines = selectedTask.output.length - (maxHeight - 4);
        const scrollMsg = `  ... ${hiddenLines} more lines`;
        lines.push(chalk.hex("#64748b").dim(scrollMsg.slice(0, width)).padEnd(width));
      }
    } else if (selectedTask) {
      lines.push(chalk.hex("#64748b")("  No output yet...").padEnd(width));
      lines.push(chalk.hex("#64748b").dim("  Press Enter to start this task").padEnd(width));
    } else {
      lines.push(chalk.hex("#64748b")("  Select a task to view output").padEnd(width));
      lines.push(chalk.hex("#64748b").dim("  Use ↑/↓ arrow keys to navigate").padEnd(width));
    }

    // Fill remaining space
    while (lines.length < maxHeight) {
      lines.push(" ".repeat(width));
    }

    return lines;
  }

  /**
   * Filter and format output lines with better categorization
   */
  private filterAndFormatOutput(
    output: string[],
    maxLines: number
  ): Array<{
    text: string;
    type: "error" | "success" | "info" | "warn" | "code" | "default";
    truncated: boolean;
  }> {
    return output.slice(-maxLines).map((line) => {
      // Lines should already be clean, but ensure it
      const cleanLine = this.stripAnsiCodes(line);

      // Categorize the line
      let type: "error" | "success" | "info" | "warn" | "code" | "default" = "default";

      if (this.isErrorLine(cleanLine)) {
        type = "error";
      } else if (this.isSuccessLine(cleanLine)) {
        type = "success";
      } else if (this.isWarningLine(cleanLine)) {
        type = "warn";
      } else if (this.isInfoLine(cleanLine)) {
        type = "info";
      } else if (this.isCodeLine(cleanLine)) {
        type = "code";
      }

      return {
        text: cleanLine,
        type,
        truncated: cleanLine.length > 100, // Flag for very long lines
      };
    });
  }

  /**
   * Enhanced output line colorization with syntax highlighting
   */
  private colorizeOutputLine(text: string, type: string, truncated: boolean): string {
    // Clean the text first
    const cleanText = this.stripAnsiCodes(text);
    let coloredText = cleanText;

    switch (type) {
      case "error":
        coloredText = chalk.hex("#ef4444")(cleanText);
        break;
      case "success":
        coloredText = chalk.hex("#10b981")(cleanText);
        break;
      case "warn":
        coloredText = chalk.hex("#f59e0b")(cleanText);
        break;
      case "info":
        coloredText = chalk.hex("#3b82f6")(cleanText);
        break;
      case "code":
        coloredText = this.highlightCode(cleanText);
        break;
      default:
        coloredText = chalk.hex("#9ca3af")(cleanText);
    }

    // Add truncation indicator
    if (truncated) {
      coloredText += chalk.hex("#64748b").dim(" ...");
    }

    return coloredText;
  }

  /**
   * Strip ANSI codes from already colored output while preserving chalk colors
   */
  private stripAnsiFromColoredLine(line: string): string {
    // This is a safety net - if somehow ANSI codes leak through chalk,
    // we preserve chalk's colors but remove any raw ANSI that might corrupt display
    return line;
  }

  /**
   * Simple syntax highlighting for common code patterns
   */
  private highlightCode(text: string): string {
    // Ensure text is clean
    const cleanText = this.stripAnsiCodes(text);
    let highlighted = cleanText;

    // Highlight file paths
    highlighted = highlighted.replace(
      /([a-zA-Z0-9_-]+\/[a-zA-Z0-9_/.-]+\.[a-zA-Z]+)/g,
      chalk.hex("#06b6d4")("$1")
    );

    // Highlight URLs
    highlighted = highlighted.replace(/(https?:\/\/[^\s]+)/g, chalk.hex("#8b5cf6").underline("$1"));

    // Highlight numbers
    highlighted = highlighted.replace(/\b(\d+(?:\.\d+)?)\b/g, chalk.hex("#f59e0b")("$1"));

    // Highlight quoted strings
    highlighted = highlighted.replace(/["']([^"']+)["']/g, chalk.hex("#10b981")('"$1"'));

    // Highlight function calls
    highlighted = highlighted.replace(
      /\b([a-zA-Z_][a-zA-Z0-9_]*)\(/g,
      chalk.hex("#8b5cf6")("$1") + "("
    );

    return highlighted;
  }

  /**
   * Line type detection methods
   */
  private isErrorLine(line: string): boolean {
    const errorPatterns = [
      /error/i,
      /failed/i,
      /exception/i,
      /\[err\]/i,
      /✗/,
      /cannot/i,
      /unable/i,
      /invalid/i,
      /not found/i,
      /denied/i,
    ];
    return errorPatterns.some((pattern) => pattern.test(line));
  }

  private isSuccessLine(line: string): boolean {
    const successPatterns = [
      /ready/i,
      /compiled/i,
      /success/i,
      /complete/i,
      /✓/,
      /listening/i,
      /started/i,
      /built/i,
      /served/i,
    ];
    return successPatterns.some((pattern) => pattern.test(line));
  }

  private isWarningLine(line: string): boolean {
    const warningPatterns = [/warn/i, /warning/i, /⚠/, /deprecated/i, /caution/i];
    return warningPatterns.some((pattern) => pattern.test(line));
  }

  private isInfoLine(line: string): boolean {
    const infoPatterns = [
      /info/i,
      /log/i,
      /debug/i,
      /trace/i,
      /using/i,
      /loading/i,
      /running/i,
      /starting/i,
      /connecting/i,
    ];
    return infoPatterns.some((pattern) => pattern.test(line));
  }

  private isCodeLine(line: string): boolean {
    const codePatterns = [
      /\.(js|ts|tsx|jsx|json|css|html|md)/, // file extensions
      /function\s+\w+/,
      /const\s+\w+/,
      /import\s+/,
      /export\s+/, // JS/TS keywords
      /\w+\([^)]*\)/, // function calls
      /{[\s\S]*}/, // JSON-like objects
      /https?:\/\//, // URLs
    ];
    return codePatterns.some((pattern) => pattern.test(line));
  }

  private renderFooter(width: number): string {
    const controls = this.interactionMode
      ? "ESC: Exit interaction | I: Toggle interaction"
      : "↑/↓: Navigate | Enter: Start/Stop | I: Interact | R: Restart | Q: Quit";

    const precastLink = "Learn more at precast.dev - Build apps faster with AI assistance";

    const footerLine = "━".repeat(width);
    const controlsLine = this.centerText(controls, width);
    const linkLine = this.centerText(precastLink, width);

    return [
      chalk.hex("#64748b")(footerLine),
      chalk.hex("#64748b")(controlsLine),
      chalk.hex("#8b5cf6").dim(linkLine),
    ].join("\n");
  }

  private getTaskIcon(status: InteractiveTask["status"]): string {
    const icons = {
      pending: chalk.hex("#64748b")("[WAIT]"),
      running: chalk.hex("#3b82f6")("[RUN]"),
      ready: chalk.hex("#10b981")("[OK]"),
      error: chalk.hex("#ef4444")("[ERR]"),
      stopped: chalk.hex("#64748b")("[STOP]"),
    };
    return icons[status];
  }

  /**
   * Strip ANSI codes from a string - comprehensive cleaning
   */
  private stripAnsiCodes(str: string): string {
    if (!str) return "";

    /* eslint-disable no-control-regex */
    // First pass: remove all ANSI escape sequences
    let cleaned = str
      .replace(/\x1b\[[^m]*m/g, "") // All color/style codes
      .replace(/\x1b\[\d*[A-Za-z]/g, "") // Cursor movement
      .replace(/\x1b\]\d+;[^\x07\x1b]*(?:\x07|\x1b\\)/g, "") // OSC sequences
      .replace(/\x1b[[\]()][^\x1b]*(?:\x1b\\)?/g, "") // Other escape sequences
      .replace(/[\x00-\x08\x0B-\x0C\x0E-\x1F\x7F]/g, ""); // Control chars except \t \n \r

    // Second pass: handle broken/partial ANSI codes that might remain
    cleaned = cleaned
      .replace(/\d+;\d+;\d+m/g, "") // Broken color codes like "38;2;139;92;246m"
      .replace(/\d+m(?=[^\d])/g, "") // Trailing m codes
      .replace(/;\d+m/g, "") // Semicolon prefixed codes
      .replace(/\[\d+m/g, "") // Bracket prefixed codes
      .replace(/38;2;\d+;\d+;\d+m/g, "") // RGB color codes without escape
      .replace(/\d+;2;\d+;\d+;\d+m/g, ""); // More RGB patterns

    return cleaned.trim();
    /* eslint-enable no-control-regex */
  }

  private colorizeTaskLine(line: string, status: InteractiveTask["status"]): string {
    switch (status) {
      case "running":
        return chalk.hex("#3b82f6")(line);
      case "ready":
        return chalk.hex("#10b981")(line);
      case "error":
        return chalk.hex("#ef4444")(line);
      case "pending":
      case "stopped":
        return chalk.hex("#64748b")(line);
      default:
        return line;
    }
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

  /**
   * Find the directory path for a given package name
   */
  private findPackageDirectory(packageName: string): string | null {
    // Check in packages/ directory
    const packagesPath = join(process.cwd(), "packages", packageName);
    if (existsSync(packagesPath)) {
      return packagesPath;
    }

    // Check in apps/ directory
    const appsPath = join(process.cwd(), "apps", packageName);
    if (existsSync(appsPath)) {
      return appsPath;
    }

    // Check if it's the root package
    if (existsSync(join(process.cwd(), "package.json"))) {
      try {
        const rootPackageJson = JSON.parse(
          readFileSync(join(process.cwd(), "package.json"), "utf8")
        );
        if (rootPackageJson.name === packageName || packageName === "root") {
          return process.cwd();
        }
      } catch {
        // Ignore invalid package.json
      }
    }

    return null;
  }

  /**
   * Detect the package manager to use for a given directory
   */
  private detectPackageManager(packageDir: string): string {
    // Check for lock files to determine package manager
    if (existsSync(join(packageDir, "bun.lock"))) {
      return "bun";
    }
    if (existsSync(join(packageDir, "pnpm-lock.yaml"))) {
      return "pnpm";
    }
    if (existsSync(join(packageDir, "yarn.lock"))) {
      return "yarn";
    }
    if (existsSync(join(packageDir, "package-lock.json"))) {
      return "npm";
    }

    // Check in parent directories (monorepo root)
    const parentDir = join(packageDir, "..");
    if (existsSync(join(parentDir, "bun.lock"))) {
      return "bun";
    }
    if (existsSync(join(parentDir, "pnpm-lock.yaml"))) {
      return "pnpm";
    }
    if (existsSync(join(parentDir, "yarn.lock"))) {
      return "yarn";
    }
    if (existsSync(join(parentDir, "package-lock.json"))) {
      return "npm";
    }

    // Default to bun if no lock file is found
    return "bun";
  }

  /**
   * Build the dev command for the detected package manager
   */
  private buildDevCommand(packageManager: string): string[] {
    switch (packageManager) {
      case "bun":
        return ["bun", "run", "dev"];
      case "pnpm":
        return ["pnpm", "run", "dev"];
      case "yarn":
        return ["yarn", "dev"];
      case "npm":
        return ["npm", "run", "dev"];
      default:
        return ["bun", "run", "dev"]; // fallback to bun
    }
  }

  /**
   * Throttled rendering to prevent UI overwhelming
   */
  private throttledRender(): void {
    const now = Date.now();
    const timeSinceLastRender = now - this.lastRenderTime;

    // Only render at most every 100ms to prevent overwhelming
    if (timeSinceLastRender < 100) {
      if (this.renderThrottleTimer) {
        clearTimeout(this.renderThrottleTimer);
      }

      this.renderThrottleTimer = setTimeout(() => {
        this.render(true); // Use partial render for updates
        this.lastRenderTime = Date.now();
        this.renderThrottleTimer = null;
      }, 100 - timeSinceLastRender);
    } else {
      this.render(true); // Use partial render for updates
      this.lastRenderTime = now;
    }
  }

  /**
   * Enhanced line filtering to reduce noise
   */
  private isSignificantLine(line: string): boolean {
    const trimmed = line.trim();
    if (!trimmed) return false;

    // Filter out common noise patterns
    const noisePatterns = [
      /^\s*$/, // Empty lines
      /^\s*\[\d+:\d+:\d+\]\s*$/, // Timestamp only
      /webpack compiled with \d+ warning/i, // Common webpack noise
      /compiled successfully in \d+ms/i, // Build success noise
      /^\s*wait\s+-\s+compiling/i, // Wait messages
      /^\s*event\s+-\s+compiled/i, // Event messages
      /^\s*\d+\s+modules\s+transformed/i, // Module count noise
    ];

    return !noisePatterns.some((pattern) => pattern.test(trimmed));
  }

  /**
   * Check if output indicates task is ready
   */
  private isTaskReady(output: string): boolean {
    const readyPatterns = [
      /ready/i,
      /listening on/i,
      /compiled successfully/i,
      /server running/i,
      /dev server ready/i,
      /local:\s*http/i,
    ];

    return readyPatterns.some((pattern) => pattern.test(output));
  }

  /**
   * Filter out ignorable errors (false positives)
   */
  private isIgnorableError(line: string): boolean {
    const ignorablePatterns = [
      /warning/i, // Warnings are not errors
      /deprecated/i, // Deprecation warnings
      /experiment/i, // Experimental feature warnings
      /punycode.*deprecated/i, // Common Node.js deprecation
      /sourcemap.*cannot be found/i, // Source map warnings
      /failed to parse source map/i, // Source map parsing issues
    ];

    return ignorablePatterns.some((pattern) => pattern.test(line));
  }

  /**
   * Check if error is critical (should mark task as failed)
   */
  private isCriticalError(output: string): boolean {
    const criticalPatterns = [
      /error.*failed to compile/i,
      /module not found/i,
      /cannot resolve module/i,
      /syntax error/i,
      /type error/i,
      /reference error/i,
      /eaddrinuse/i, // Port already in use
      /enoent/i, // File not found
      /permission denied/i,
    ];

    return criticalPatterns.some((pattern) => pattern.test(output));
  }

  /**
   * Get tasks in consistent order for selection
   */
  private getOrderedTasks(tasks: InteractiveTask[]): InteractiveTask[] {
    // Sort tasks by category and then by name for consistent ordering
    const categoryOrder = { app: 0, package: 1, shared: 2 };

    return [...tasks].sort((a, b) => {
      const catA = categoryOrder[a.category || "package"];
      const catB = categoryOrder[b.category || "package"];

      if (catA !== catB) {
        return catA - catB;
      }

      return a.name.localeCompare(b.name);
    });
  }
}

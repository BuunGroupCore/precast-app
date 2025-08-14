/**
 * Global error collector for the CLI.
 * Collects all errors and warnings during execution for batch display at the end.
 * Provides debugging capabilities and persistent logging when needed.
 */

export interface CollectedError {
  task: string;
  error: string;
  timestamp: Date;
  type: "error" | "warning";
}

class ErrorCollector {
  private errors: CollectedError[] = [];
  private isEnabled: boolean = true;

  enable() {
    this.isEnabled = true;
  }

  disable() {
    this.isEnabled = false;
  }

  addError(task: string, error: any, type: "error" | "warning" = "error") {
    if (!this.isEnabled) return;

    const errorMessage =
      error instanceof Error
        ? error.message
        : typeof error === "string"
          ? error
          : JSON.stringify(error);

    const fullErrorDetails = error instanceof Error ? error.stack || error.message : errorMessage;

    this.errors.push({
      task,
      error: errorMessage,
      timestamp: new Date(),
      type,
    });

    // Immediately log to stderr in debug mode to bypass UI clearing
    if (process.env.DEBUG || process.env.DEBUG_ERRORS) {
      // Use stderr to avoid being cleared by logUpdate
      process.stderr.write(`\n[ERROR COLLECTED - ${new Date().toISOString()}] ${task}:\n`);
      process.stderr.write(`${fullErrorDetails}\n`);
      process.stderr.write(`---\n`);
    }
  }

  addWarning(task: string, warning: any) {
    this.addError(task, warning, "warning");
  }

  getErrors(): CollectedError[] {
    return [...this.errors];
  }

  hasErrors(): boolean {
    return this.errors.filter((e) => e.type === "error").length > 0;
  }

  hasWarnings(): boolean {
    return this.errors.filter((e) => e.type === "warning").length > 0;
  }

  clear() {
    this.errors = [];
  }

  getErrorCount(): number {
    return this.errors.filter((e) => e.type === "error").length;
  }

  getWarningCount(): number {
    return this.errors.filter((e) => e.type === "warning").length;
  }
}

// Global singleton instance
export const errorCollector = new ErrorCollector();

/**
 * Write error to persistent log file for debugging purposes.
 * Creates a .precast-debug directory with detailed error logs when DEBUG_ERRORS is enabled.
 *
 * @param task - Name of the task that failed
 * @param error - Error object or message to log
 */
export function logErrorToFile(task: string, error: any) {
  if (!process.env.DEBUG_ERRORS) return;

  try {
    const fs = require("fs");
    const path = require("path");
    const logDir = path.join(process.cwd(), ".precast-debug");

    // Ensure debug directory exists
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }

    const logFile = path.join(logDir, "errors.log");
    const timestamp = new Date().toISOString();
    const errorMessage = error instanceof Error ? error.stack || error.message : String(error);

    const logEntry = `[${timestamp}] TASK: ${task}\nERROR: ${errorMessage}\n${"=".repeat(80)}\n`;

    fs.appendFileSync(logFile, logEntry);

    // Also write to stderr immediately
    process.stderr.write(`\n🐛 Error logged to: ${logFile}\n`);
  } catch {
    // Ignore logging errors
  }
}

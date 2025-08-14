import chalk from "chalk";

let verboseMode = false;
let suppressOutput = false;

/**
 * Set verbose mode for detailed logging output
 *
 * @param verbose - Whether to enable verbose logging
 */
export function setVerboseMode(verbose: boolean) {
  verboseMode = verbose;
}

/**
 * Check if verbose mode is enabled via flag or environment variable
 *
 * @returns True if verbose logging is enabled
 */
export function isVerbose(): boolean {
  return verboseMode || process.env.VERBOSE === "true";
}

/**
 * Set output suppression mode for hiding console output during task execution
 *
 * @param suppress - Whether to suppress console output
 */
export function setSuppressOutput(suppress: boolean) {
  suppressOutput = suppress;
}

/**
 * Check if output should be suppressed (unless in verbose mode)
 *
 * @returns True if output should be suppressed
 */
export function isSuppressed(): boolean {
  return suppressOutput && !isVerbose();
}

/**
 * Logger utility for formatted console output with suppression support.
 * Provides consistent styling and respects verbose/suppress modes.
 */
export const logger = {
  /**
   * Display a header message with background styling
   * @param message - Header text to display
   */
  header: (message: string) => {
    if (!isSuppressed()) {
      console.log("\n" + chalk.bold.bgYellow.black(` ${message} `) + "\n");
    }
  },
  /**
   * Display an informational message
   * @param message - Info text to display
   */
  info: (message: string) => {
    if (!isSuppressed()) {
      console.log(message);
    }
  },
  /**
   * Display a success message with checkmark
   * @param message - Success text to display
   */
  success: (message: string) => {
    if (!isSuppressed()) {
      console.log(chalk.green("✓") + " " + message);
    }
  },
  /**
   * Display an error message with X mark
   * @param message - Error text to display
   */
  error: (message: string) => {
    // Never suppress errors
    console.log(chalk.red("✗") + " " + message);
  },
  /**
   * Display a warning message with warning symbol
   * @param message - Warning text to display
   */
  warn: (message: string) => {
    if (!isSuppressed()) {
      console.log(chalk.yellow("⚠") + " " + message);
    }
  },
  /**
   * Display a debug message (only when DEBUG env var is set)
   * @param message - Debug text to display
   */
  debug: (message: string) => {
    if (process.env.DEBUG) {
      console.log(chalk.gray("[DEBUG]") + " " + message);
    }
  },
  /**
   * Display a verbose message (only when --verbose flag is used)
   * @param message - Verbose text to display
   */
  verbose: (message: string) => {
    if (isVerbose() && !isSuppressed()) {
      console.log(chalk.gray("ℹ") + " " + message);
    }
  },
  /**
   * Display a plain message without prefix
   * @param message - Message text to display
   */
  message: (message: string) => {
    if (!isSuppressed()) {
      console.log(message);
    }
  },
};

import chalk from "chalk";

/**
 * Logger utility for formatted console output
 */
export const logger = {
  /**
   * Display a header message with background styling
   * @param message - Header text to display
   */
  header: (message: string) => {
    console.log("\n" + chalk.bold.bgYellow.black(` ${message} `) + "\n");
  },
  /**
   * Display an informational message
   * @param message - Info text to display
   */
  info: (message: string) => {
    console.log(message);
  },
  /**
   * Display a success message with checkmark
   * @param message - Success text to display
   */
  success: (message: string) => {
    console.log(chalk.green("✓") + " " + message);
  },
  /**
   * Display an error message with X mark
   * @param message - Error text to display
   */
  error: (message: string) => {
    console.log(chalk.red("✗") + " " + message);
  },
  /**
   * Display a warning message with warning symbol
   * @param message - Warning text to display
   */
  warn: (message: string) => {
    console.log(chalk.yellow("⚠") + " " + message);
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
};

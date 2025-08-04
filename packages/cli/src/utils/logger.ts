import chalk from "chalk";
export const logger = {
  header: (message: string) => {
    console.log("\n" + chalk.bold.bgYellow.black(` ${message} `) + "\n");
  },
  info: (message: string) => {
    console.log(message);
  },
  success: (message: string) => {
    console.log(chalk.green("✓") + " " + message);
  },
  error: (message: string) => {
    console.log(chalk.red("✗") + " " + message);
  },
  warn: (message: string) => {
    console.log(chalk.yellow("⚠") + " " + message);
  },
  debug: (message: string) => {
    if (process.env.DEBUG) {
      console.log(chalk.gray("[DEBUG]") + " " + message);
    }
  },
};

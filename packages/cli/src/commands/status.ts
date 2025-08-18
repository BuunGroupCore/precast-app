import * as path from "path";

import chalk from "chalk";
import cliWidth from "cli-width";
import fsExtra from "fs-extra";
import { createSpinner } from "nanospinner";

import { getFrameworkIcon } from "@/utils/ui/cli-theme.js";
import { PrecastBanner } from "@/utils/ui/precast-banner.js";

const { pathExists, readFile } = fsExtra;

interface PrecastConfig {
  name: string;
  version: string;
  framework: string;
  backend?: string;
  database?: string;
  orm?: string;
  authProvider?: string;
  styling?: string;
  uiLibrary?: string;
  packageManager?: string;
  apiClient?: string;
  testing?: string;
  aiAssistant?: string;
  deployment?: string;
  deploymentType?: string;
  colorPalette?: string;
  plugins?: string[];
  powerups?: string[];
  mcpServers?: string[];
  docker?: boolean;
  typescript?: boolean;
  git?: boolean;
  createdAt?: string;
  lastModified?: string;
  [key: string]: any;
}

/**
 * Sleep helper
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Create a beautiful full-width table with comic book styling
 */
function createTable(title: string, rows: [string, string][], color: string = "#ffd600"): string {
  const termWidth = cliWidth({ defaultWidth: 80 });
  const tableWidth = Math.min(termWidth - 4, 70); // Max 70 chars wide for readability
  const maxKeyLength = Math.max(...rows.map((r) => r[0].length), 15);
  const maxValueLength = tableWidth - maxKeyLength - 7;

  let output = "";

  // Top border
  output += chalk.hex(color).bold("╔" + "═".repeat(tableWidth - 2) + "╗") + "\n";

  // Title row - ensure proper centering (account for emoji display width)
  // Strip ANSI codes and emojis for length calculation
  const titleLength = title.replace(
    /[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu,
    "  "
  ).length;
  const totalPadding = tableWidth - titleLength - 2;
  const leftPadding = Math.floor(totalPadding / 2);
  const rightPadding = totalPadding - leftPadding;

  output +=
    chalk.hex(color).bold("║") +
    " ".repeat(leftPadding) +
    chalk.hex("#ff1744").bold(title) +
    " ".repeat(rightPadding) +
    chalk.hex(color).bold("║") +
    "\n";

  // Separator
  output += chalk.hex(color).bold("╠" + "═".repeat(tableWidth - 2) + "╣") + "\n";

  // Data rows
  rows.forEach((row) => {
    const [key, value] = row;
    const formattedKey = chalk.hex("#2962ff").bold(key.padEnd(maxKeyLength));
    const formattedValue = chalk.white(value.substring(0, maxValueLength).padEnd(maxValueLength));

    output +=
      chalk.hex(color)("║ ") +
      formattedKey +
      chalk.hex("#9e9e9e")(" │ ") +
      formattedValue +
      " " +
      chalk.hex(color)("║") +
      "\n";
  });

  // Bottom border
  output += chalk.hex(color).bold("╚" + "═".repeat(tableWidth - 2) + "╝");

  return output;
}

/**
 * Create a health check table with status indicators
 */
function createHealthTable(title: string, rows: [string, string, string][]): string {
  const termWidth = cliWidth({ defaultWidth: 80 });
  const tableWidth = Math.min(termWidth - 4, 70);
  const maxKeyLength = Math.max(...rows.map((r) => r[0].length), 15);
  const maxValueLength = tableWidth - maxKeyLength - 9;

  let output = "";
  const color = "#aa00ff";

  // Top border
  output += chalk.hex(color).bold("╔" + "═".repeat(tableWidth - 2) + "╗") + "\n";

  // Title row - ensure proper centering (account for emoji display width)
  const titleLength = title.replace(
    /[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu,
    "  "
  ).length;
  const totalPadding = tableWidth - titleLength - 2;
  const leftPadding = Math.floor(totalPadding / 2);
  const rightPadding = totalPadding - leftPadding;

  output +=
    chalk.hex(color).bold("║") +
    " ".repeat(leftPadding) +
    chalk.hex(color).bold(title) +
    " ".repeat(rightPadding) +
    chalk.hex(color).bold("║") +
    "\n";

  // Separator
  output += chalk.hex(color).bold("╠" + "═".repeat(tableWidth - 2) + "╣") + "\n";

  // Data rows
  rows.forEach((row) => {
    const [key, value, icon] = row;
    const statusColor =
      icon === "✓"
        ? chalk.hex("#00e676")
        : icon === "✗"
          ? chalk.hex("#ff1744")
          : chalk.hex("#ffd600");

    const formattedStatus = statusColor.bold(icon);
    const formattedKey = chalk.hex("#2962ff").bold(key.padEnd(maxKeyLength));
    const formattedValue = chalk.white(value.substring(0, maxValueLength).padEnd(maxValueLength));

    output +=
      chalk.hex(color)("║ ") +
      formattedStatus +
      " " +
      formattedKey +
      chalk.hex("#9e9e9e")(" │ ") +
      formattedValue +
      " " +
      chalk.hex(color)("║") +
      "\n";
  });

  // Bottom border
  output += chalk.hex(color).bold("╚" + "═".repeat(tableWidth - 2) + "╝");

  return output;
}

/**
 * Animated text reveal
 */
async function animatedReveal(text: string, delay: number = 20): Promise<void> {
  const lines = text.split("\n");
  for (const line of lines) {
    console.log(line);
    await sleep(delay);
  }
}

/**
 * Create loading animation with task numbering
 */
async function showLoadingAnimation(
  message: string,
  duration: number = 1500,
  taskNumber?: number
): Promise<void> {
  const taskPrefix = taskNumber ? chalk.hex("#9e9e9e")(`[${taskNumber}] `) : "";
  const spinner = createSpinner(taskPrefix + message).start({
    color: "yellow",
  });

  // Cycle through colors
  const colors = ["yellow", "cyan", "green", "magenta", "blue", "red"] as const;
  let colorIndex = 0;

  const colorInterval = setInterval(() => {
    spinner.update({ color: colors[colorIndex] });
    colorIndex = (colorIndex + 1) % colors.length;
  }, 200);

  await sleep(duration);

  clearInterval(colorInterval);
  spinner.success({
    text: taskPrefix + chalk.hex("#00e676").bold("✓") + " " + chalk.white(message),
    mark: " ",
  });
}

/**
 * Enhanced status command with beautiful table-based output
 */
export async function statusCommand(
  projectPath?: string,
  options?: { debug?: boolean }
): Promise<void> {
  const debug = options?.debug || process.env.DEBUG === "true";

  try {
    const targetPath = projectPath ? path.resolve(projectPath) : process.cwd();
    const precastConfigPath = path.join(targetPath, "precast.jsonc");

    if (!(await pathExists(precastConfigPath))) {
      await PrecastBanner.show({
        subtitle: "[ERR] WHOOPS! No project found!",
        gradient: false,
      });
      console.log();
      console.log(chalk.hex("#ff1744").bold("  ✗ No precast.jsonc found in this directory"));
      console.log(
        chalk.hex("#ffd600")(
          `  → Run: ${chalk.white.bold("create-precast-app init")} to create a new project`
        )
      );
      console.log();
      process.exit(1);
    }

    // Show the beautiful banner
    await PrecastBanner.show({
      subtitle: "PROJECT STATUS CHECK",
      gradient: false,
    });

    // Start analyzing animation
    await showLoadingAnimation("Analyzing project configuration", 800, 1);

    const configContent = await readFile(precastConfigPath, "utf-8");
    let jsonContent = configContent;
    jsonContent = jsonContent.replace(/(?:^|\s)\/\/.*$/gm, "");
    jsonContent = jsonContent.replace(/\/\*[\s\S]*?\*\//g, "");
    jsonContent = jsonContent.replace(/,\s*([}\]])/g, "$1");
    const config: PrecastConfig = JSON.parse(jsonContent);

    await showLoadingAnimation("Scanning project health", 600, 2);

    const projectName = config.name || path.basename(targetPath);

    console.log();

    // Project Info Table
    const projectInfoTable = createTable(
      "PROJECT INFORMATION",
      [
        ["Name", projectName],
        ["Version", config.version || "1.0.0"],
        ["Type", config.deploymentType || "standard"],
        [
          "Created",
          config.createdAt ? new Date(config.createdAt).toLocaleDateString() : "Recently",
        ],
        ["Package Manager", config.packageManager || "npm"],
        ["Environment", process.env.NODE_ENV || "development"],
      ],
      "#ffd600"
    );

    await animatedReveal(projectInfoTable, 15);
    console.log();

    // Tech Stack Table
    const techStackRows: [string, string][] = [];

    if (config.framework) {
      techStackRows.push(["Frontend", `${getFrameworkIcon(config.framework)} ${config.framework}`]);
    }
    if (config.backend && config.backend !== "none") {
      techStackRows.push(["Backend", config.backend]);
    }
    if (config.database && config.database !== "none") {
      techStackRows.push(["Database", config.database]);
    }
    if (config.orm && config.orm !== "none") {
      techStackRows.push(["ORM", config.orm]);
    }
    if (config.styling && config.styling !== "none") {
      techStackRows.push(["Styling", config.styling]);
    }
    if (config.uiLibrary && config.uiLibrary !== "none") {
      techStackRows.push(["UI Library", config.uiLibrary]);
    }
    if (config.authProvider && config.authProvider !== "none") {
      techStackRows.push(["Authentication", config.authProvider]);
    }
    if (config.apiClient && config.apiClient !== "none") {
      techStackRows.push(["API Client", config.apiClient]);
    }
    if (config.testing && config.testing !== "none") {
      techStackRows.push(["Testing", config.testing]);
    }

    if (techStackRows.length > 0) {
      const techStackTable = createTable("TECH STACK", techStackRows, "#00e676");
      await animatedReveal(techStackTable, 15);
      console.log();
    }

    // Health Check
    await showLoadingAnimation("Running health checks", 500, 3);

    const nodeModulesPath = path.join(targetPath, "node_modules");
    const hasNodeModules = await pathExists(nodeModulesPath);
    const dockerComposePath = path.join(targetPath, "docker", "docker-compose.yml");
    const hasDocker = await pathExists(dockerComposePath);
    const envPath = path.join(targetPath, ".env");
    const envLocalPath = path.join(targetPath, ".env.local");
    const hasEnv = (await pathExists(envPath)) || (await pathExists(envLocalPath));
    const gitPath = path.join(targetPath, ".git");
    const hasGit = await pathExists(gitPath);

    console.log();

    // Health Check Table
    const healthRows: [string, string, string][] = [
      ["Dependencies", hasNodeModules ? "Installed" : "Not Installed", hasNodeModules ? "✓" : "✗"],
      ["Environment", hasEnv ? "Configured" : "Not Configured", hasEnv ? "✓" : "⚠"],
      ["Git Repository", hasGit ? "Initialized" : "Not Initialized", hasGit ? "✓" : "⚠"],
    ];

    if (config.docker || hasDocker) {
      healthRows.push([
        "Docker",
        hasDocker ? "Configured" : "Not Configured",
        hasDocker ? "✓" : "⚠",
      ]);
    }

    if (config.typescript) {
      const tsconfigPath = path.join(targetPath, "tsconfig.json");
      const hasTsConfig = await pathExists(tsconfigPath);
      healthRows.push([
        "TypeScript",
        hasTsConfig ? "Configured" : "Not Configured",
        hasTsConfig ? "✓" : "✗",
      ]);
    }

    // Check for test files
    const testPath = path.join(targetPath, "test");
    const testsPath = path.join(targetPath, "tests");
    const hasTests = (await pathExists(testPath)) || (await pathExists(testsPath));
    healthRows.push(["Tests", hasTests ? "Found" : "Not Found", hasTests ? "✓" : "⚠"]);

    const healthTable = createHealthTable("HEALTH CHECK", healthRows);
    await animatedReveal(healthTable, 15);
    console.log();

    // Commands Table
    const pm = config.packageManager || "npm";
    const runCmd = pm === "npm" ? "npm run" : pm;

    const commandRows: [string, string][] = [];

    if (!hasNodeModules) {
      commandRows.push(["Install Dependencies", `${pm} install`]);
    }

    if (hasDocker && config.database && config.database !== "none") {
      commandRows.push(["Start Docker", `${runCmd} docker:up`]);
    }

    commandRows.push(["Development Server", `${runCmd} dev`]);
    commandRows.push(["Production Build", `${runCmd} build`]);

    if (config.testing && config.testing !== "none") {
      commandRows.push(["Run Tests", `${runCmd} test`]);
    }

    commandRows.push(["Lint Code", `${runCmd} lint`]);
    commandRows.push(["Type Check", `${runCmd} typecheck`]);

    const commandsTable = createTable("QUICK COMMANDS", commandRows, "#2962ff");
    await animatedReveal(commandsTable, 15);
    console.log();

    // Clean ending without the comic book footer
    console.log();
  } catch (error) {
    console.log();
    console.log(chalk.hex("#ff1744").bold("[ERR] CRASH! Something went wrong!"));
    console.log();

    if (error instanceof SyntaxError) {
      console.log(chalk.hex("#ff1744")("  ✗ Failed to parse precast.jsonc"));
      console.log(chalk.hex("#ffd600")("  → Check your JSON syntax for errors"));
    } else if (error instanceof Error) {
      console.log(chalk.hex("#ff1744")(`  ✗ ${error.message}`));
      if (debug) {
        console.log(chalk.hex("#9e9e9e")("\nStack trace:"));
        console.log(chalk.hex("#9e9e9e")(error.stack));
      }
    }

    console.log();
    process.exit(1);
  }
}

export default statusCommand;

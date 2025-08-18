/**
 * Turbo Dev Command - Interactive development mode with task management
 * Handles persistent dev tasks with individual task interaction and output viewing
 */

// import { spawn } from "child_process"; // Handled by InteractiveTurboDashboard
import { existsSync, readFileSync, readdirSync } from "fs";
import { join } from "path";

import chalk from "chalk";

import { theme, createFancyBox, statusSymbols } from "@/utils/ui/cli-theme.js";
import {
  InteractiveTurboDashboard,
  type InteractiveTask,
} from "@/utils/ui/interactive-turbo-dashboard.js";
import { PrecastBanner } from "@/utils/ui/precast-banner.js";

// Use the InteractiveTask interface from the dashboard
type DevTaskState = InteractiveTask;

/**
 * Run Turbo dev with interactive task management
 */
export async function devCommand(): Promise<void> {
  try {
    // Check if we're in a Turbo project
    if (!existsSync("turbo.json")) {
      console.log();
      const errorBox = createFancyBox(
        `${theme.error(`${statusSymbols.error} Not a Turbo Project`)}\n\n` +
          `This command requires a ${theme.accent("turbo.json")} file.\n\n` +
          `${theme.info(`${statusSymbols.info} Run this in:`)} A monorepo with Turbo configured\n` +
          `${theme.muted("   or create one with")} ${theme.bold("create-precast-app init my-project --monorepo")}`,
        "[TURBO] Configuration Missing"
      );
      console.log(errorBox);
      console.log();
      process.exit(1);
    }

    console.log();
    await PrecastBanner.show({
      subtitle: "TURBO DEV",
      gradient: false,
    });
    console.log();

    // Show development info
    await showDevInfo();

    // Start interactive dashboard
    console.log(
      `  ${chalk.hex("#2962ff")("[START]")} ${chalk.hex("#9e9e9e")("Starting interactive dashboard...")}`
    );
    console.log(
      `  ${chalk.hex("#ffd600")("[INFO]")} ${chalk.hex("#9e9e9e")("Use arrow keys to navigate, Enter to start/stop, 'i' to interact")}`
    );
    console.log();

    // Start dev mode with interactive management
    await runInteractiveDev();
  } catch (error) {
    console.log();
    const errorBox = createFancyBox(
      `${theme.error(`${statusSymbols.error} Turbo Dev Failed`)}\n\n` +
        `${error instanceof Error ? error.message : "An unexpected error occurred"}\n\n` +
        `${theme.info(`${statusSymbols.info} Common solutions:`)}\n` +
        `• Check turbo.json configuration\n` +
        `• Ensure dev tasks are properly configured\n` +
        `• Verify all packages have dev scripts`,
      "[ERR] Dev Command Failed"
    );
    console.log(errorBox);
    console.log();
    process.exit(1);
  }
}

/**
 * Show development mode information
 */
async function showDevInfo(): Promise<void> {
  console.log(chalk.hex("#ffd600").bold("━".repeat(66)));
  console.log(chalk.hex("#00e676").bold("                    [DEV] DEVELOPMENT MODE"));
  console.log(chalk.hex("#ffd600").bold("━".repeat(66)));
  console.log();
  console.log(chalk.hex("#2962ff").bold("  Interactive Features:"));
  console.log();
  console.log(
    `    ${chalk.hex("#aa00ff")("[SELECT]")} ${chalk.white("Choose which tasks to run")}`
  );
  console.log(
    `    ${chalk.hex("#aa00ff")("[VIEW]")}   ${chalk.white("Individual task output viewing")}`
  );
  console.log(
    `    ${chalk.hex("#aa00ff")("[MANAGE]")} ${chalk.white("Start/stop tasks individually")}`
  );
  console.log(
    `    ${chalk.hex("#aa00ff")("[WATCH]")}  ${chalk.white("Real-time file change monitoring")}`
  );
  console.log(
    `    ${chalk.hex("#aa00ff")("[PORTS]")}  ${chalk.white("Proper port cleanup on task stop")}`
  );
  console.log();
  console.log(chalk.hex("#2962ff").bold("  Controls:"));
  console.log();
  console.log(`    ${chalk.hex("#ffd600")("↑/↓")}     ${chalk.white("Navigate tasks")}`);
  console.log(
    `    ${chalk.hex("#ffd600")("Enter")}   ${chalk.white("Toggle task on/off (kills ports)")}`
  );
  console.log(`    ${chalk.hex("#ffd600")("Space")}   ${chalk.white("View task output")}`);
  console.log(`    ${chalk.hex("#ffd600")("r")}       ${chalk.white("Restart task")}`);
  console.log(`    ${chalk.hex("#ffd600")("q")}       ${chalk.white("Quit development mode")}`);
  console.log();
  console.log(
    chalk.hex("#8b5cf6").dim("  Built with Precast • precast.dev • AI-powered development")
  );
  console.log();
  console.log(chalk.hex("#ffd600").bold("━".repeat(66)));
  console.log();
}

/**
 * Run interactive development mode with task management
 */
async function runInteractiveDev(): Promise<void> {
  console.log(
    `  ${chalk.hex("#2962ff")("[SCAN]")} ${chalk.hex("#9e9e9e")("Discovering dev tasks...")}`
  );

  // Discover available dev tasks
  const tasks = await discoverDevTasks();

  if (tasks.length === 0) {
    console.log();
    const errorBox = createFancyBox(
      `${theme.error(`${statusSymbols.error} No Dev Tasks Found`)}\n\n` +
        `No packages with dev scripts were discovered.\n\n` +
        `${theme.info(`${statusSymbols.info} Expected:`)} Packages with "dev" script in package.json\n` +
        `${theme.muted("   and configured in turbo.json tasks")}`,
      "[DEV] No Tasks Available"
    );
    console.log(errorBox);
    console.log();
    return;
  }

  console.log(
    `  ${chalk.hex("#00e676")("[OK]")} ${chalk.hex("#9e9e9e")("Found")} ${chalk.hex("#00e676").bold(tasks.length.toString())} ${chalk.hex("#9e9e9e")("dev tasks")}`
  );
  console.log();

  // Initialize task states
  const taskStates: Record<string, DevTaskState> = {};
  tasks.forEach((task) => {
    taskStates[task.id] = {
      id: task.id,
      name: task.name,
      status: "pending",
      output: [],
      lastActivity: new Date(),
      port: task.port,
      url: task.url,
      package: task.package,
      category: task.category,
    };
  });

  // Start interactive dashboard
  const dashboard = new InteractiveTurboDashboard(taskStates, {
    onTaskStart: (taskId: string) => {
      console.log(`Starting task: ${taskId}`);
    },
    onTaskStop: (taskId: string) => {
      console.log(`Stopping task: ${taskId}`);
    },
    onTaskRestart: (taskId: string) => {
      console.log(`Restarting task: ${taskId}`);
    },
    onExit: () => {
      console.log("Exiting development mode...");
      process.exit(0);
    },
  });

  dashboard.start();
}

/**
 * Discover available dev tasks from turbo.json and package.json files
 */
async function discoverDevTasks(): Promise<
  Array<{
    id: string;
    name: string;
    package: string;
    category?: "app" | "package" | "shared";
    port?: number;
    url?: string;
  }>
> {
  const tasks: Array<{
    id: string;
    name: string;
    package: string;
    category?: "app" | "package" | "shared";
    port?: number;
    url?: string;
  }> = [];

  try {
    // Read turbo.json to understand task configuration
    const turboConfig = JSON.parse(readFileSync("turbo.json", "utf8"));
    const hasDevTask = turboConfig.tasks && turboConfig.tasks.dev;

    if (!hasDevTask) {
      return tasks;
    }

    // Find all packages with dev scripts in both packages/ and apps/ directories
    const dirsToScan = [];
    if (existsSync("packages")) dirsToScan.push("packages");
    if (existsSync("apps")) dirsToScan.push("apps");

    if (dirsToScan.length > 0) {
      let portCounter = 3000;

      for (const dir of dirsToScan) {
        const packages = readdirSync(dir, { withFileTypes: true })
          .filter((dirent: any) => dirent.isDirectory())
          .map((dirent: any) => dirent.name);

        for (const pkg of packages) {
          const pkgPath = join(dir, pkg);
          const packageJsonPath = join(pkgPath, "package.json");

          if (existsSync(packageJsonPath)) {
            try {
              const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf8"));

              if (packageJson.scripts && packageJson.scripts.dev) {
                const isWeb =
                  pkg.includes("web") || pkg.includes("frontend") || pkg.includes("app");
                const isApi =
                  pkg.includes("api") || pkg.includes("backend") || pkg.includes("server");
                const isShared =
                  pkg.includes("shared") || pkg.includes("common") || pkg.includes("utils");

                let port: number | undefined = portCounter++;
                let url: string | undefined = undefined;
                let category: "app" | "package" | "shared" = "package";

                // Assign common ports and categories based on package type
                if (isWeb) {
                  port = 3000;
                  url = `http://localhost:${port}`;
                  category = "app";
                } else if (isApi) {
                  port = 3001;
                  url = `http://localhost:${port}`;
                  category = "app";
                } else if (isShared) {
                  category = "shared";
                  // Shared packages typically don't have ports
                  port = undefined;
                  url = undefined;
                } else if (dir === "apps") {
                  category = "app";
                } else {
                  category = "package";
                }

                tasks.push({
                  id: `${pkg}-dev`,
                  name: `${pkg} (dev)`,
                  package: pkg,
                  category,
                  port,
                  url,
                });
              }
            } catch {
              // Skip packages with invalid package.json
              continue;
            }
          }
        }
      }
    } else {
      // Single package mode
      if (existsSync("package.json")) {
        try {
          const packageJson = JSON.parse(readFileSync("package.json", "utf8"));
          if (packageJson.scripts && packageJson.scripts.dev) {
            tasks.push({
              id: "dev",
              name: "Development Server",
              package: "root",
              port: 3000,
              url: "http://localhost:3000",
            });
          }
        } catch {
          // Skip if invalid package.json
        }
      }
    }

    return tasks;
  } catch (error) {
    console.error("Failed to discover dev tasks:", error);
    return tasks;
  }
}

// Task management functions are now handled by the InteractiveTurboDashboard class

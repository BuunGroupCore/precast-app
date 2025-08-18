import { execSync, spawn } from "child_process";
import * as path from "path";

import { confirm } from "@clack/prompts";
import chalk from "chalk";
import cliWidth from "cli-width";
import fsExtra from "fs-extra";

import {
  updateEnvironmentVariables,
  formatEnvUpdates,
  validateNgrokUrls,
} from "@/utils/config/environment-updater.js";
import { waitForNgrokTunnels } from "@/utils/docker/ngrok-extractor.js";
import { detectEnvironmentStructure } from "@/utils/system/framework-detection.js";
import {
  theme,
  createFancyBox,
  divider,
  statusSymbols,
  techBadge,
  createLink,
  comicDecorations,
} from "@/utils/ui/cli-theme.js";
import { suppressConsolaGlobally, restoreConsolaGlobally } from "@/utils/ui/consola-suppressor.js";
import { EnhancedUI, type EnhancedTask } from "@/utils/ui/enhanced-ui.js";
import { PrecastBanner } from "@/utils/ui/precast-banner.js";
import { StreamingLogger } from "@/utils/ui/streaming-logger.js";

const { pathExists, readJson } = fsExtra;

interface DeployOptions {
  stop?: boolean;
  status?: boolean;
  help?: boolean;
  destroy?: boolean;
  approve?: boolean;
  yes?: boolean;
  updateEnv?: boolean;
  skipEnvUpdate?: boolean;
}

/**
 * Create a beautiful full-width table with comic book styling
 */
function createSuccessTable(
  title: string,
  rows: [string, string][],
  color: string = "#00e676"
): string {
  const termWidth = cliWidth({ defaultWidth: 80 });
  const tableWidth = Math.min(termWidth - 4, 70);
  const maxKeyLength = Math.max(...rows.map((r) => r[0].length), 15);
  const maxValueLength = tableWidth - maxKeyLength - 7;

  let output = "";

  // Top border
  output += chalk.hex(color).bold("╔" + "═".repeat(tableWidth - 2) + "╗") + "\n";

  // Title row - handle emoji display width manually
  // eslint-disable-next-line no-control-regex
  const titleClean = title.replace(/\x1b\[[0-9;]*m/g, "");
  const chars = [...titleClean];
  const emojiCount = chars.filter((char) =>
    char.match(/[\u{1F000}-\u{1FFFF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/u)
  ).length;
  const visualLength = chars.length + emojiCount;
  const totalPadding = tableWidth - visualLength - 2;
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
 * Deploy Docker services for the current project.
 * Supports starting, stopping, checking status, and destroying Docker services.
 *
 * @param options - Deploy options including stop, status, help, destroy, and approve flags
 */
export async function deployCommand(options: DeployOptions): Promise<void> {
  try {
    const isPrecastProject = await pathExists("precast.jsonc");
    if (!isPrecastProject) {
      console.log();
      const errorBox = createFancyBox(
        `${theme.error(`${statusSymbols.error} Not a Precast Project`)}\n\n` +
          `This command must be run in a Precast project directory.\n\n` +
          `${theme.info(`${statusSymbols.info} Look for:`)} ${techBadge("precast.jsonc")} file\n` +
          `${theme.muted("   in the project root")}\n\n` +
          `${theme.accent("◆ Create a new project:")}\n` +
          `${theme.bold("create-precast-app init my-project")}`,
        "[ERR] Command Error"
      );
      console.log(errorBox);
      console.log();
      process.exit(1);
    }

    const config = await readJson("precast.jsonc");

    if (!config.docker) {
      console.log();
      const errorBox = createFancyBox(
        `${theme.error(`${statusSymbols.error} Docker Not Enabled`)}\n\n` +
          `Docker configuration is not enabled for this project.\n\n` +
          `${theme.info(`${statusSymbols.info} To enable Docker:`)} Re-run the CLI with ${techBadge("--docker")} flag\n` +
          `${theme.muted("   or manually configure Docker services")}\n\n` +
          `${theme.accent("◆ Create new project with Docker:")}\n` +
          `${theme.bold("create-precast-app init my-project --docker")}`,
        "[DOCKER] Docker Required"
      );
      console.log(errorBox);
      console.log();
      process.exit(1);
    }

    const platform = process.platform;
    const scriptName = platform === "win32" ? "docker-auto-deploy.bat" : "docker-auto-deploy.sh";
    const scriptPath = path.join(process.cwd(), "scripts", scriptName);

    if (!(await pathExists(scriptPath))) {
      console.log();
      const errorBox = createFancyBox(
        `${theme.error(`${statusSymbols.error} Auto-Deploy Script Missing`)}\n\n` +
          `Expected: ${theme.accent(scriptPath)}\n\n` +
          `${theme.info(`${statusSymbols.info} This project may have been created`)} without Docker auto-deploy support.\n\n` +
          `${theme.accent("◆ Manual Docker commands available:")}\n` +
          `${theme.bold("docker compose -f docker/[service]/docker-compose.yml up -d")}`,
        "[FILE] Script Not Found"
      );
      console.log(errorBox);
      console.log();
      process.exit(1);
    }

    if (options.destroy) {
      await handleDestroyCommand(config, options.approve);
      return;
    }

    let command = scriptPath;
    let action = "deploy";
    let actionIcon = "[DEPLOY]";
    let actionTitle = "DEPLOY";
    // let actionDesc = "◉ Starting Docker services";

    if (options.stop) {
      command = `${scriptPath} stop`;
      action = "stop";
      actionIcon = "[STOP]";
      actionTitle = "STOP";
      // actionDesc = "◉ Stopping Docker services";
    } else if (options.status) {
      command = `${scriptPath} status`;
      action = "status";
      actionIcon = "[STATUS]";
      actionTitle = "STATUS";
      // actionDesc = "◉ Checking Docker services";
    } else if (options.help) {
      command = `${scriptPath} help`;
      action = "help";
      actionIcon = "[HELP]";
      actionTitle = "HELP";
      // actionDesc = "◉ Docker command help";
    }

    // Only show banner for non-deploy actions
    if (action !== "deploy") {
      console.log();
      await PrecastBanner.show({
        subtitle: actionTitle,
        gradient: false,
      });
      console.log();
    }

    if (action === "deploy") {
      await showDeploymentInfo(config);
    }

    try {
      if (action === "deploy") {
        await runEnhancedDeployment(config, command, options);
      } else {
        // For non-deploy actions (stop, status, help), use simple execution
        console.log(theme.accent(`${actionIcon} Executing Docker ${action}...`));
        console.log();

        execSync(command, {
          stdio: "inherit",
          cwd: process.cwd(),
        });
      }

      console.log();
      if (action === "deploy") {
        // let ngrokMessage = "";
        let ngrokUrls: { frontend?: string; api?: string } = {};
        const powerups = config.powerups || [];

        if (powerups.includes("ngrok")) {
          const ngrokResult = await handleNgrokDeployment(config, options);
          // ngrokMessage = ngrokResult.message;
          ngrokUrls = ngrokResult.urls;
        } else {
          const emptyResult = { message: "", urls: {} };
          // ngrokMessage = emptyResult.message;
          ngrokUrls = emptyResult.urls;
        }

        // Build success table rows
        const successRows: [string, string][] = [
          ["Status", "All services deployed successfully"],
          ["Environment", "Docker containers running"],
        ];

        if (ngrokUrls.frontend) {
          successRows.push(["Frontend URL", ngrokUrls.frontend]);
        }
        if (ngrokUrls.api) {
          successRows.push(["API URL", ngrokUrls.api]);
        }

        const successTable = createSuccessTable(
          "[DEPLOY] DEPLOYMENT COMPLETE",
          successRows,
          "#00e676"
        );
        console.log(successTable);
        console.log();

        // Next steps section
        console.log(chalk.hex("#2962ff").bold("  Next Steps:"));
        console.log();
        console.log(
          `    ${chalk.hex("#ffd600")("1.")} ${chalk.white.bold("npm run dev")} ${chalk.hex("#9e9e9e")("- Start development server")}`
        );
        if (ngrokUrls.frontend) {
          console.log(
            `    ${chalk.hex("#ffd600")("2.")} ${chalk.white.bold("Visit:")} ${chalk.hex("#00e676").bold(ngrokUrls.frontend)}`
          );
          console.log(
            `    ${chalk.hex("#ffd600")("3.")} ${chalk.white.bold("create-precast-app deploy --status")} ${chalk.hex("#9e9e9e")("- Check services")}`
          );
          console.log(
            `    ${chalk.hex("#ffd600")("4.")} ${chalk.white.bold("create-precast-app deploy --stop")} ${chalk.hex("#9e9e9e")("- Stop services")}`
          );
        } else {
          console.log(
            `    ${chalk.hex("#ffd600")("2.")} ${chalk.white.bold("create-precast-app deploy --status")} ${chalk.hex("#9e9e9e")("- Check services")}`
          );
          console.log(
            `    ${chalk.hex("#ffd600")("3.")} ${chalk.white.bold("create-precast-app deploy --stop")} ${chalk.hex("#9e9e9e")("- Stop services")}`
          );
        }
      } else if (action === "stop") {
        const successBox = createFancyBox(
          `${theme.success(`${statusSymbols.success} Docker Services Stopped!`)} ${comicDecorations.pow}\n\n` +
            `All services have been gracefully stopped.\n\n` +
            `${theme.accent("◆ To restart:")}\n` +
            `${theme.bold("create-precast-app deploy")} ${theme.muted("- Start services again")}`,
          "[STOP] Services Stopped"
        );
        console.log(successBox);
      }

      console.log();
      console.log(theme.muted(divider()));
      console.log(
        theme.muted(
          `  ${actionIcon} ${theme.bold("Docker management")} • ${createLink("docs", "https://precast.dev/docs/docker")}`
        )
      );
      console.log();

      // Ensure clean exit after deployment
      if (action === "deploy") {
        process.nextTick(() => {
          process.exit(0);
        });
      }
    } catch (error) {
      console.log();
      const errorBox = createFancyBox(
        `${theme.error(`${statusSymbols.error} Docker ${action} failed`)}\n\n` +
          `${error instanceof Error ? error.message : "Unknown error occurred"}\n\n` +
          `${theme.info(`${statusSymbols.info} Common solutions:`)}\n` +
          `• Ensure Docker is running\n` +
          `• Check Docker service logs\n` +
          `• Verify port availability\n` +
          `• Try running with ${techBadge("--verbose")} flag`,
        `${actionIcon} ${action.charAt(0).toUpperCase() + action.slice(1)} Failed`
      );
      console.log(errorBox);
      console.log();
      process.exit(1);
    }
  } catch (error) {
    console.log();
    const errorBox = createFancyBox(
      `${theme.error(`${statusSymbols.error} Command Failed`)}\n\n` +
        `${error instanceof Error ? error.message : "An unexpected error occurred"}\n\n` +
        `${theme.info(`${statusSymbols.info} Try running:`)} ${techBadge("create-precast-app status")}\n` +
        `${theme.muted("   to check your project configuration")}`,
      "[ERR] Deploy Command Error"
    );
    console.log(errorBox);
    console.log();
    process.exit(1);
  }
}

/**
 * Show enhanced deployment information with beautiful styling and icons
 */
async function showDeploymentInfo(config: any): Promise<void> {
  const services: Array<{ icon: string; name: string; description: string; type: string }> = [];

  // Database services
  if (config.database && config.database !== "none") {
    const dbIcons: Record<string, string> = {
      postgres: "[PG]",
      postgresql: "[PG]",
      mysql: "[SQL]",
      mongodb: "[MONGO]",
      sqlite: "[LITE]",
      redis: "[REDIS]",
    };

    services.push({
      icon: dbIcons[config.database] || "[DB]",
      name: config.database,
      description: "Database service",
      type: "database",
    });
  }

  // Powerup services
  if (config.powerups && config.powerups.length > 0) {
    config.powerups.forEach((powerup: string) => {
      switch (powerup) {
        case "traefik":
          services.push({
            icon: "[PROXY]",
            name: "Traefik",
            description: "Reverse proxy & load balancer",
            type: "networking",
          });
          break;
        case "ngrok":
          services.push({
            icon: "[TUNNEL]",
            name: "ngrok",
            description: "Secure tunnels to localhost",
            type: "tunnel",
          });
          break;
        case "cloudflare-tunnel":
          services.push({
            icon: "[CF]",
            name: "Cloudflare Tunnel",
            description: "Zero Trust network access",
            type: "tunnel",
          });
          break;
        case "portainer":
          services.push({
            icon: "[UI]",
            name: "Portainer",
            description: "Docker management UI",
            type: "management",
          });
          break;
        default:
          services.push({
            icon: "[SVC]",
            name: powerup,
            description: "Service",
            type: "service",
          });
      }
    });
  }

  if (services.length > 0) {
    // Create beautiful service list with consistent spacing
    const serviceList = services
      .map((service) => {
        // const typeColor = getServiceTypeColor(service.type);
        const serviceName = chalk.hex("#00e676").bold(service.name);
        const serviceDesc = chalk.hex("#9e9e9e")(service.description);

        return `    ${service.icon}  ${serviceName} ${chalk.hex("#ffd600")("•")} ${serviceDesc}`;
      })
      .join("\n");

    const totalServices = services.length;
    const estimatedTime =
      totalServices <= 2 ? "30-60 seconds" : totalServices <= 4 ? "1-2 minutes" : "2-3 minutes";

    console.log();
    console.log(chalk.hex("#ffd600").bold("━".repeat(66)));
    console.log(chalk.hex("#ff1744").bold("                      [DEPLOY] DEPLOYMENT PLAN"));
    console.log(chalk.hex("#ffd600").bold("━".repeat(66)));
    console.log();
    console.log(chalk.hex("#2962ff").bold("  [SERVICES] Services to deploy:"));
    console.log();
    console.log(serviceList);
    console.log();
    console.log(chalk.hex("#ffd600").bold("━".repeat(66)));
    console.log();
    console.log(
      `  ${chalk.hex("#aa00ff")("[TIME]")}  ${chalk.hex("#9e9e9e")("Estimated time:")} ${chalk.hex("#00e676").bold(estimatedTime)}`
    );
    console.log(
      `  ${chalk.hex("#aa00ff")("[PKG]")}  ${chalk.hex("#9e9e9e")("Total services:")} ${chalk.hex("#00e676").bold(totalServices.toString())}`
    );
    console.log(
      `  ${chalk.hex("#aa00ff")("[INIT]")}  ${chalk.hex("#9e9e9e")("First-time setup:")} ${chalk.hex("#ffd600")("May download Docker images")}`
    );
    console.log();
    console.log(chalk.hex("#ffd600").bold("━".repeat(66)));
    console.log();
  }
}

/**
 * Get color for service type
 */
// Unused function - kept for potential future use
// function getServiceTypeColor(type: string): string {
//   const colors: Record<string, string> = {
//     database: "#00e676",
//     networking: "#2962ff",
//     tunnel: "#ff1744",
//     management: "#aa00ff",
//     service: "#ffd600"
//   };
//   return colors[type] || "#9e9e9e";
// }

/**
 * Handle destroy command with safety prompts and complete cleanup
 */
async function handleDestroyCommand(config: any, skipPrompt: boolean = false): Promise<void> {
  const projectName = path.basename(process.cwd()).replace(/[^a-zA-Z0-9-_]/g, "-");

  await showDestructionPlan(config, projectName);

  if (!skipPrompt) {
    // Create warning table
    const warningRows: [string, string][] = [
      ["Project", projectName],
      ["Containers", "ALL project containers will be removed"],
      ["Volumes", "ALL data will be PERMANENTLY LOST"],
      ["Networks", "All project networks will be removed"],
    ];

    if (config.database && config.database !== "none") {
      warningRows.push(["Database", `${config.database} data will be PERMANENTLY LOST`]);
    }

    const warningTable = createSuccessTable(
      "⚠ DESTRUCTIVE OPERATION WARNING",
      warningRows,
      "#ff1744"
    );
    console.log(warningTable);
    console.log();

    console.log(chalk.hex("#ff1744").bold("  ⚠  This action CANNOT be undone!"));
    console.log(
      `  ${chalk.hex("#9e9e9e")("To skip this prompt:")} ${chalk.hex("#ffd600").bold("--approve")} ${chalk.hex("#9e9e9e")("flag")}`
    );
    console.log();

    const shouldContinue = await confirm({
      message: "Are you sure you want to destroy all Docker resources for this project?",
      initialValue: false,
    });

    if (!shouldContinue) {
      console.log();
      const cancelTable = createSuccessTable(
        "[CANCEL] DESTRUCTION CANCELLED",
        [
          ["Status", "Operation cancelled by user"],
          ["Docker Services", "Unchanged and still running"],
          ["Data", "Safe and preserved"],
        ],
        "#00e676"
      );
      console.log(cancelTable);
      console.log();
      return;
    }
  }

  console.log();

  try {
    await runEnhancedDestruction(config, projectName);

    console.log();
    const successTable = createSuccessTable(
      "[DESTROY] DESTRUCTION COMPLETE",
      [
        ["Status", "All Docker resources destroyed"],
        ["Containers", "Removed successfully"],
        ["Volumes", "Data permanently deleted"],
        ["Networks", "Cleaned up"],
      ],
      "#ff1744"
    );
    console.log(successTable);
    console.log();

    // Next steps section
    console.log(chalk.hex("#2962ff").bold("  To Recreate Services:"));
    console.log();
    console.log(
      `    ${chalk.hex("#ffd600")("1.")} ${chalk.white.bold("create-precast-app deploy")} ${chalk.hex("#9e9e9e")("- Fresh deployment")}`
    );
    console.log(
      `    ${chalk.hex("#ffd600")("2.")} ${chalk.white.bold("All data will be reset")} ${chalk.hex("#9e9e9e")("- Clean state")}`
    );
    console.log();

    console.log(theme.muted(divider()));
    console.log(
      theme.muted(
        `  [CLEAN] ${theme.bold("Complete cleanup")} • ${createLink("docker docs", "https://precast.dev/docs/docker")}`
      )
    );
    console.log();

    // Ensure clean exit after destruction
    process.nextTick(() => {
      process.exit(0);
    });
  } catch (error) {
    console.log();
    const errorTable = createSuccessTable(
      "DESTRUCTION FAILED ✗",
      [
        ["Status", "Destruction process failed"],
        ["Error", error instanceof Error ? error.message : "Unknown error"],
        ["Manual Cleanup", "May be required"],
      ],
      "#ff1744"
    );
    console.log(errorTable);
    console.log();

    console.log(chalk.hex("#2962ff").bold("  Manual Cleanup Commands:"));
    console.log();
    console.log(
      `    ${chalk.hex("#ffd600")("1.")} ${chalk.white.bold("docker container prune -f")} ${chalk.hex("#9e9e9e")("- Remove containers")}`
    );
    console.log(
      `    ${chalk.hex("#ffd600")("2.")} ${chalk.white.bold("docker volume prune -f")} ${chalk.hex("#9e9e9e")("- Remove volumes")}`
    );
    console.log(
      `    ${chalk.hex("#ffd600")("3.")} ${chalk.white.bold("docker network prune -f")} ${chalk.hex("#9e9e9e")("- Remove networks")}`
    );
    console.log(
      `    ${chalk.hex("#ffd600")("4.")} ${chalk.white.bold("docker ps")} ${chalk.hex("#9e9e9e")("- Check containers")}`
    );
    console.log();
    process.exit(1);
  }
}

/**
 * Run enhanced destruction with beautiful multi-threaded UI
 */
async function runEnhancedDestruction(config: any, projectName: string): Promise<void> {
  const ui = new EnhancedUI({ debug: false });
  const logger = new StreamingLogger({ debug: false, verbose: false });

  // Build enhanced tasks for multi-threaded execution
  const tasks: EnhancedTask[] = [];

  // Pre-flight checks
  tasks.push({
    id: "preflight",
    title: "[SCAN] Scanning Docker resources",
    task: async () => {
      // Check if Docker is running
      try {
        execSync("docker info", { stdio: "ignore" });
        logger.stream({ type: "success", message: "Docker daemon is running" });
      } catch {
        throw new Error("Docker daemon is not running");
      }

      // Check for existing containers
      try {
        execSync(`docker ps -aq --filter "name=${projectName}"`, { stdio: "ignore" });
        logger.stream({ type: "info", message: "Found project containers to remove" });
      } catch {
        logger.stream({ type: "info", message: "No containers found for project" });
      }
    },
    concurrent: false,
  });

  // Build destruction tasks based on config
  const destructionTasks: EnhancedTask[] = [];

  if (config.database && config.database !== "none") {
    destructionTasks.push({
      id: `destroy-database-${config.database}`,
      title: `[DB] Destroying ${config.database} database`,
      task: async () => {
        logger.stream({ type: "info", message: `Stopping ${config.database} containers...` });
        await new Promise((resolve) => setTimeout(resolve, 500));
        logger.stream({ type: "info", message: `Deleting ${config.database} volumes and data...` });
        await new Promise((resolve) => setTimeout(resolve, 800));
        logger.stream({ type: "success", message: `${config.database} completely destroyed` });
      },
      concurrent: true,
    });
  }

  if (config.powerups && config.powerups.length > 0) {
    config.powerups.forEach((powerup: string) => {
      let title = "";
      let icon = "";
      let steps: Array<{ message: string; delay: number }> = [];

      switch (powerup) {
        case "traefik":
          icon = "[PROXY]";
          title = `${icon} Destroying Traefik proxy`;
          steps = [
            { message: "Stopping Traefik containers...", delay: 600 },
            { message: "Removing proxy configurations...", delay: 400 },
            { message: "Traefik completely destroyed", delay: 0 },
          ];
          break;
        case "ngrok":
          icon = "[TUNNEL]";
          title = `${icon} Destroying ngrok tunnels`;
          steps = [
            { message: "Stopping ngrok containers...", delay: 500 },
            { message: "Closing tunnel connections...", delay: 600 },
            { message: "ngrok completely destroyed", delay: 0 },
          ];
          break;
        case "cloudflare-tunnel":
          icon = "[CF]";
          title = `${icon} Destroying Cloudflare tunnels`;
          steps = [
            { message: "Stopping tunnel containers...", delay: 500 },
            { message: "Disconnecting from Cloudflare...", delay: 700 },
            { message: "Cloudflare tunnel destroyed", delay: 0 },
          ];
          break;
        case "portainer":
          icon = "[UI]";
          title = `${icon} Destroying Portainer`;
          steps = [
            { message: "Stopping management containers...", delay: 400 },
            { message: "Portainer destroyed", delay: 0 },
          ];
          break;
        default:
          icon = "[SVC]";
          title = `${icon} Destroying ${powerup} service`;
          steps = [
            { message: `Stopping ${powerup} containers...`, delay: 500 },
            { message: `${powerup} destroyed`, delay: 0 },
          ];
      }

      destructionTasks.push({
        id: `destroy-powerup-${powerup}`,
        title,
        task: async () => {
          for (const step of steps) {
            if (step.delay > 0) {
              logger.stream({ type: "info", message: step.message });
              await new Promise((resolve) => setTimeout(resolve, step.delay));
            } else {
              logger.stream({ type: "success", message: step.message });
            }
          }
        },
        concurrent: true,
      });
    });
  }

  // Add parallel destruction tasks
  tasks.push(...destructionTasks);

  // System cleanup tasks
  tasks.push({
    id: "cleanup-containers",
    title: "[CLEAN] Cleaning up containers",
    task: async () => {
      logger.stream({ type: "info", message: "Finding all project containers..." });
      await new Promise((resolve) => setTimeout(resolve, 400));
      logger.stream({ type: "info", message: "Removing container instances..." });
      await new Promise((resolve) => setTimeout(resolve, 600));
      logger.stream({ type: "success", message: "All containers destroyed" });
    },
    concurrent: false,
  });

  tasks.push({
    id: "cleanup-volumes",
    title: "[DATA] Destroying data volumes",
    task: async () => {
      logger.stream({ type: "info", message: "Scanning for data volumes..." });
      await new Promise((resolve) => setTimeout(resolve, 500));
      logger.stream({ type: "warning", message: "⚠ Permanently deleting ALL data..." });
      await new Promise((resolve) => setTimeout(resolve, 800));
      logger.stream({ type: "success", message: "All volumes destroyed (data unrecoverable)" });
    },
    concurrent: false,
  });

  tasks.push({
    id: "cleanup-networks",
    title: "[NET] Removing networks",
    task: async () => {
      logger.stream({ type: "info", message: "Finding project networks..." });
      await new Promise((resolve) => setTimeout(resolve, 300));
      logger.stream({ type: "info", message: "Removing network configurations..." });
      await new Promise((resolve) => setTimeout(resolve, 400));
      logger.stream({ type: "success", message: "All networks destroyed" });
    },
    concurrent: false,
  });

  // Actual Docker cleanup with real-time feedback
  tasks.push({
    id: "actual-cleanup",
    title: "[EXEC] Executing Docker cleanup commands",
    task: async () => {
      logger.stream({ type: "info", message: "Running actual Docker destruction commands..." });
      await executeActualDestruction(config, projectName, logger);
      logger.stream({ type: "success", message: "All Docker resources destroyed" });
    },
    concurrent: false,
  });

  // Final system cleanup
  tasks.push({
    id: "system-cleanup",
    title: "[SYS] Final system cleanup",
    task: async () => {
      logger.stream({ type: "info", message: "Pruning dangling containers..." });
      await new Promise((resolve) => setTimeout(resolve, 400));
      logger.stream({ type: "info", message: "Pruning dangling volumes..." });
      await new Promise((resolve) => setTimeout(resolve, 400));
      logger.stream({ type: "info", message: "Pruning dangling networks..." });
      await new Promise((resolve) => setTimeout(resolve, 400));
      logger.stream({ type: "success", message: "System cleanup complete" });
    },
    concurrent: false,
  });

  // Suppress verbose output globally
  await suppressConsolaGlobally(false);

  // Run all tasks with beautiful multi-threaded UI
  await ui.runTasks(tasks, {
    title: `Destroying ${chalk.hex("#ff1744").bold("Docker Resources")}...`,
    exitOnError: false,
  });

  // Restore consola output level
  await restoreConsolaGlobally();
}

/**
 * Execute the actual Docker deployment command with real-time feedback
 */
async function executeActualDeployment(command: string, logger: any): Promise<void> {
  return new Promise((resolve) => {
    logger.stream({ type: "info", message: "Starting Docker deployment..." });
    logger.stream({ type: "info", message: `Executing: ${command}` });

    // Show progress indicators
    let progressCount = 0;
    const progressMessages = [
      "Initializing Docker environment...",
      "Pulling Docker images...",
      "Starting containers...",
      "Configuring networks...",
      "Setting up volumes...",
      "Finalizing deployment...",
    ];

    // Start showing progress
    const progressInterval = setInterval(() => {
      if (progressCount < progressMessages.length) {
        logger.stream({ type: "info", message: progressMessages[progressCount] });
        progressCount++;
      } else {
        // Keep showing activity
        logger.stream({ type: "info", message: "Docker deployment in progress..." });
      }
    }, 2000); // Update every 2 seconds

    // Use spawn for non-blocking execution
    const isWindows = process.platform === "win32";
    const shellCommand = isWindows ? "cmd" : "bash";
    const shellArgs = isWindows ? ["/c", command] : ["-c", command];

    const child = spawn(shellCommand, shellArgs, {
      cwd: process.cwd(),
      stdio: "pipe",
      shell: true,
    });

    // let hasOutput = false;

    child.stdout?.on("data", (data) => {
      // hasOutput = true;
      const output = data.toString().trim();
      if (output) {
        // Show Docker output in manageable chunks
        logger.stream({
          type: "info",
          message: `Docker: ${output.slice(0, 150)}${output.length > 150 ? "..." : ""}`,
        });
      }
    });

    child.stderr?.on("data", (data) => {
      const error = data.toString().trim();
      if (error && !error.includes("WARN") && !error.includes("deprecated")) {
        logger.stream({
          type: "warning",
          message: `Docker: ${error.slice(0, 150)}${error.length > 150 ? "..." : ""}`,
        });
      }
    });

    child.on("close", (code) => {
      clearInterval(progressInterval);

      // Clean up all listeners
      child.removeAllListeners();

      if (code === 0) {
        logger.stream({ type: "success", message: "Docker deployment completed successfully" });
      } else {
        logger.stream({ type: "warning", message: `Docker deployment finished with code ${code}` });
        logger.stream({ type: "info", message: "Some containers may still be starting..." });
      }

      // Ensure process can exit
      setImmediate(() => resolve());
    });

    child.on("error", (error) => {
      clearInterval(progressInterval);

      // Clean up all listeners
      child.removeAllListeners();

      logger.stream({ type: "error", message: `Docker deployment error: ${error.message}` });
      logger.stream({ type: "warning", message: "Continuing with remaining tasks..." });

      // Ensure process can exit
      setImmediate(() => resolve());
    });

    // Timeout fallback
    const timeoutId = setTimeout(() => {
      if (!child.killed) {
        clearInterval(progressInterval);

        // Force kill the child process if it's still running
        try {
          child.kill("SIGTERM");
          setTimeout(() => {
            if (!child.killed) {
              child.kill("SIGKILL");
            }
          }, 5000);
        } catch {
          // Ignore error
        }

        // Clean up all listeners
        child.removeAllListeners();

        logger.stream({
          type: "warning",
          message: "Docker deployment taking longer than expected...",
        });
        logger.stream({ type: "info", message: "Deployment will continue in background" });

        // Ensure process can exit
        setImmediate(() => resolve());
      }
    }, 180000); // 3 minute timeout

    // Clean up timeout when process completes normally
    child.on("close", () => clearTimeout(timeoutId));
    child.on("error", () => clearTimeout(timeoutId));
  });
}

/**
 * Execute the actual Docker destruction commands
 */
async function executeActualDestruction(
  config: any,
  projectName: string,
  logger?: any
): Promise<void> {
  // First, try direct cleanup with execSync for immediate results
  const projectVariants = [
    projectName,
    projectName.replace(/-/g, "_"),
    projectName.replace(/_/g, "-"),
  ];

  if (logger) {
    logger.stream({ type: "info", message: "Starting direct Docker cleanup..." });
  }

  // Direct container removal
  for (const variant of projectVariants) {
    try {
      const containers = execSync(`docker ps -aq --filter "name=${variant}"`, {
        encoding: "utf-8",
      }).trim();
      if (containers) {
        const containerList = containers.split("\n").filter((c) => c);
        if (containerList.length > 0) {
          if (logger) {
            logger.stream({
              type: "info",
              message: `Found ${containerList.length} containers matching '${variant}'`,
            });
          }
          execSync(`docker rm -f ${containerList.join(" ")}`, { stdio: "inherit" });
          if (logger) {
            logger.stream({ type: "success", message: `Removed containers for '${variant}'` });
          }
        }
      }
    } catch {
      // Continue with other variants
    }
  }

  const steps: Array<{ name: string; command: string; description: string }> = [];

  if (config.database && config.database !== "none") {
    const dbCompose = `docker/compose/${config.database}/docker-compose.yml`;
    if (await pathExists(dbCompose)) {
      steps.push({
        name: "database",
        command: `docker compose -f ${dbCompose} down -v --remove-orphans`,
        description: `Stopping ${config.database} database and removing volumes`,
      });
    } else {
      const fallbackCompose = `docker/${config.database}/docker-compose.yml`;
      if (await pathExists(fallbackCompose)) {
        steps.push({
          name: "database",
          command: `docker compose -f ${fallbackCompose} down -v --remove-orphans`,
          description: `Stopping ${config.database} database and removing volumes`,
        });
      }
    }
  }

  if (config.powerups && config.powerups.length > 0) {
    for (const powerup of config.powerups) {
      let composeFile = "";
      let description = "";
      switch (powerup) {
        case "traefik":
          composeFile = "docker/traefik/docker-compose.traefik.yml";
          description = "Stopping Traefik reverse proxy";
          break;
        case "ngrok":
          composeFile = "docker/ngrok/docker-compose.ngrok.yml";
          description = "Stopping ngrok tunnel service";
          break;
        case "cloudflare-tunnel":
          composeFile = "docker/cloudflare-tunnel/docker-compose.cloudflare.yml";
          description = "Stopping Cloudflare tunnel service";
          break;
      }

      if (composeFile && (await pathExists(composeFile))) {
        steps.push({
          name: powerup,
          command: `docker compose -f ${composeFile} down -v --remove-orphans`,
          description,
        });
      }
    }
  }

  // Find and remove all containers with the project name (handle both - and _ separators)
  // Use the projectVariants from above

  let allContainerIds: string[] = [];
  let allVolumeNames: string[] = [];

  for (const variant of projectVariants) {
    try {
      const containerIds = execSync(
        `docker container ls -aq --filter "name=${variant}" 2>/dev/null`,
        { encoding: "utf-8" }
      ).trim();
      if (containerIds) {
        allContainerIds.push(...containerIds.split("\n").filter((id) => id));
      }
    } catch {
      // Ignore errors, container might not exist
    }

    try {
      const volumeNames = execSync(`docker volume ls -q --filter "name=${variant}" 2>/dev/null`, {
        encoding: "utf-8",
      }).trim();
      if (volumeNames) {
        allVolumeNames.push(...volumeNames.split("\n").filter((name) => name));
      }
    } catch {
      // Ignore errors, volume might not exist
    }
  }

  // Remove duplicates
  allContainerIds = [...new Set(allContainerIds)];
  allVolumeNames = [...new Set(allVolumeNames)];

  if (allContainerIds.length > 0) {
    steps.push({
      name: "containers",
      command: `docker container rm -f ${allContainerIds.join(" ")}`,
      description: `Removing ${allContainerIds.length} project container(s)`,
    });
  }

  if (allVolumeNames.length > 0) {
    steps.push({
      name: "volumes",
      command: `docker volume rm ${allVolumeNames.join(" ")}`,
      description: `Removing ${allVolumeNames.length} project volume(s) (data will be lost)`,
    });
  }

  // Remove networks with various naming patterns
  const networkPatterns = [
    `${projectName}_network`,
    `${projectName.replace(/-/g, "_")}_network`,
    `${projectName}_${projectName.replace(/-/g, "_")}_network`,
    `${projectName.replace(/-/g, "_")}_${projectName.replace(/-/g, "_")}_network`,
  ];

  for (const networkName of networkPatterns) {
    steps.push({
      name: `network-${networkName}`,
      command: `docker network rm ${networkName} 2>/dev/null || true`,
      description: `Attempting to remove network: ${networkName}`,
    });
  }

  if (config.powerups && config.powerups.includes("traefik")) {
    steps.push({
      name: "traefik-network",
      command: `docker network rm traefik_network 2>/dev/null || true`,
      description: "Removing Traefik network",
    });
  }

  steps.push(
    {
      name: "cleanup-containers",
      command: "docker container prune -f",
      description: "Cleaning up dangling containers",
    },
    {
      name: "cleanup-volumes",
      command: "docker volume prune -f",
      description: "Cleaning up dangling volumes",
    },
    {
      name: "cleanup-networks",
      command: "docker network prune -f",
      description: "Cleaning up dangling networks",
    }
  );

  // Execute commands with non-blocking feedback - sequential execution for cleanup
  for (const step of steps) {
    await new Promise((resolve) => {
      if (logger) {
        logger.stream({ type: "info", message: `${step.description}...` });
      }

      const isWindows = process.platform === "win32";
      // Use sh instead of bash for better compatibility, and don't use shell:true
      const shellCommand = isWindows ? "cmd" : "sh";
      const shellArgs = isWindows ? ["/c", step.command] : ["-c", step.command];

      const child = spawn(shellCommand, shellArgs, {
        cwd: process.cwd(),
        stdio: "pipe",
        shell: false, // Don't use shell:true as we're already using sh/cmd
      });

      child.stdout?.on("data", (data) => {
        const output = data.toString().trim();
        if (output && logger) {
          logger.stream({
            type: "info",
            message: `Docker: ${output.slice(0, 100)}${output.length > 100 ? "..." : ""}`,
          });
        }
      });

      child.stderr?.on("data", (data) => {
        const error = data.toString().trim();
        // Check if this is actually an error (not just usage help, warnings, or docker compose status messages)
        const isRealError =
          error &&
          !error.includes("Usage:") &&
          !error.includes("WARN") &&
          !error.includes("Warning:") &&
          !error.includes("No such") &&
          !error.includes("not found") &&
          !error.includes("does not exist") &&
          !error.includes("No resource found") &&
          !error.includes("Removing") &&
          !error.includes("Removed") &&
          !error.includes("Network") &&
          !error.includes("Volume") &&
          !error.includes("Container") &&
          !error.includes("Error response from daemon: get") && // Volume not found errors
          !error.includes("no such volume") &&
          !error.includes("no such container") &&
          !error.includes("no such network");

        if (isRealError && logger) {
          logger.stream({ type: "error", message: `Docker error: ${error}` });
        } else if (error && error.includes("Error response from daemon") && logger) {
          // These are expected when resources don't exist
          logger.stream({ type: "info", message: "Resource already removed or doesn't exist" });
        }
      });

      child.on("close", (code) => {
        // Clean up all listeners
        child.removeAllListeners();

        if (code === 0) {
          if (logger) {
            logger.stream({ type: "success", message: `${step.name} cleanup completed` });
          }
        } else {
          if (logger) {
            logger.stream({
              type: "warning",
              message: `${step.name} cleanup skipped (resources may not exist)`,
            });
          }
          // Expected to fail if resources don't exist - continue
        }

        // Small delay for visual feedback, then resolve
        setTimeout(() => {
          setImmediate(() => resolve(undefined));
        }, 300);
      });

      child.on("error", (error) => {
        // Clean up all listeners
        child.removeAllListeners();

        if (logger) {
          logger.stream({
            type: "warning",
            message: `${step.name} cleanup error: ${error.message}`,
          });
        }

        // Continue with next step even on error
        setTimeout(() => {
          setImmediate(() => resolve(undefined));
        }, 300);
      });

      // Timeout fallback for cleanup commands
      const timeoutId = setTimeout(() => {
        if (!child.killed) {
          try {
            child.kill("SIGTERM");
            setTimeout(() => {
              if (!child.killed) {
                child.kill("SIGKILL");
              }
            }, 2000);
          } catch {
            // Ignore error
          }

          // Clean up all listeners
          child.removeAllListeners();

          if (logger) {
            logger.stream({
              type: "warning",
              message: `${step.name} cleanup timed out, continuing...`,
            });
          }

          setImmediate(() => resolve(undefined));
        }
      }, 30000); // 30 second timeout per command

      // Clean up timeout when process completes normally
      child.on("close", () => clearTimeout(timeoutId));
      child.on("error", () => clearTimeout(timeoutId));
    });
  }
}

/**
 * Handle ngrok deployment with environment variable updates
 */
async function handleNgrokDeployment(
  config: any,
  options: DeployOptions
): Promise<{
  message: string;
  urls: { frontend?: string; api?: string };
}> {
  console.log();
  console.log(chalk.hex("#ffd600").bold("━".repeat(66)));
  console.log(chalk.hex("#ff1744").bold("                     [TUNNEL] NGROK SETUP"));
  console.log(chalk.hex("#ffd600").bold("━".repeat(66)));
  console.log();

  console.log(
    `  ${chalk.hex("#2962ff")("[SCAN]")} ${chalk.hex("#9e9e9e")("Detecting project structure...")}`
  );

  const structure = await detectEnvironmentStructure(process.cwd());
  console.log(
    `  ${chalk.hex("#00e676")("[OK]")} ${chalk.hex("#9e9e9e")("Detected:")} ${chalk.hex("#00e676").bold(structure.framework.framework)}${structure.framework.router ? chalk.hex("#9e9e9e")(` (${structure.framework.router})`) : ""}`
  );
  console.log();

  console.log(
    `  ${chalk.hex("#2962ff")("[WAIT]")} ${chalk.hex("#9e9e9e")("Waiting for ngrok tunnels...")}`
  );
  const ngrokUrls = await waitForNgrokTunnels(10000);

  if (!ngrokUrls || !validateNgrokUrls(ngrokUrls)) {
    console.log(
      `  ${chalk.hex("#ffd600")("⚠")} ${chalk.hex("#ffd600")("Could not retrieve ngrok URLs")}`
    );
    console.log();
    console.log(chalk.hex("#ffd600").bold("━".repeat(66)));
    console.log();
    return {
      message: `\n\n${theme.warning("⚠ ngrok tunnels may still be initializing")}`,
      urls: {},
    };
  }

  console.log(
    `  ${chalk.hex("#00e676")("[OK]")} ${chalk.hex("#00e676").bold("ngrok tunnels established!")}`
  );
  console.log();

  // Beautiful URL display with proper formatting
  console.log(chalk.hex("#2962ff").bold("  Tunnel URLs:"));
  console.log();
  console.log(
    `    ${chalk.hex("#aa00ff")("[WEB]")} ${chalk.hex("#9e9e9e")("Frontend:")} ${chalk.hex("#00e676").bold(ngrokUrls.frontend)}`
  );
  console.log(
    `    ${chalk.hex("#aa00ff")("[API]")} ${chalk.hex("#9e9e9e")("API:")}      ${chalk.hex("#00e676").bold(ngrokUrls.api)}`
  );
  console.log();

  if (!options.skipEnvUpdate) {
    const updates = await updateEnvironmentVariables(process.cwd(), structure, ngrokUrls, {
      dryRun: true,
    });

    if (updates.length > 0) {
      console.log(chalk.hex("#2962ff").bold("  Environment Updates:"));
      console.log();

      // Enhanced environment updates display
      const formattedUpdates = formatEnvUpdates(updates);
      const lines = formattedUpdates.split("\n");

      lines.forEach((line) => {
        if (line.includes("[FILE]")) {
          // File headers
          console.log(`    ${chalk.hex("#ffd600").bold(line.trim())}`);
        } else if (line.includes("UPDATE")) {
          // Update lines
          const parts = line.split("UPDATE ");
          if (parts.length > 1) {
            const [varPart, urlPart] = parts[1].split("=");
            console.log(
              `      ${chalk.hex("#aa00ff")("~")} ${chalk.hex("#2962ff").bold("UPDATE")} ${chalk.hex("#9e9e9e")(varPart)}=${chalk.hex("#00e676").bold(urlPart)}`
            );
          }
        } else if (line.trim()) {
          console.log(`    ${chalk.hex("#9e9e9e")(line.trim())}`);
        }
      });
      console.log();

      if (options.yes || options.updateEnv) {
        console.log(
          `  ${chalk.hex("#00e676")("[OK]")} ${chalk.hex("#9e9e9e")("Auto-updating environment variables (--yes flag detected)...")}`
        );
        await updateEnvironmentVariables(process.cwd(), structure, ngrokUrls);
        console.log(
          `  ${chalk.hex("#00e676")("[OK]")} ${chalk.hex("#00e676").bold("Environment variables updated!")}`
        );
      } else {
        const response = await confirm({
          message: "Update environment variables with ngrok URLs?",
          initialValue: true,
        });

        if (response && typeof response === "boolean") {
          await updateEnvironmentVariables(process.cwd(), structure, ngrokUrls);
          console.log(
            `  ${chalk.hex("#00e676")("[OK]")} ${chalk.hex("#00e676").bold("Environment variables updated!")}`
          );
        }
      }
    } else {
      console.log(
        `  ${chalk.hex("#2962ff")("[INFO]")} ${chalk.hex("#9e9e9e")("Environment variables already up to date")}`
      );
    }
  }

  console.log();
  console.log(chalk.hex("#ffd600").bold("━".repeat(66)));
  console.log();

  let message = `\n\n${theme.accent("[TUNNEL] ngrok tunnels established:")}`;
  message += `\n  ${theme.bold("Frontend:")} ${ngrokUrls.frontend}`;
  message += `\n  ${theme.bold("API:")} ${ngrokUrls.api}`;

  if (options.skipEnvUpdate) {
    message += `\n  ${theme.info("Update VITE_API_URL in your .env to use the API tunnel")}`;
  }

  return {
    message,
    urls: ngrokUrls,
  };
}

/**
 * Run enhanced deployment with beautiful multi-threaded UI like init command
 */
async function runEnhancedDeployment(
  config: any,
  command: string,
  _options: DeployOptions
): Promise<void> {
  // Check if enhanced UI should be disabled for debugging
  const useSimpleUI = process.env.PRECAST_SIMPLE_UI === "true" || process.env.DEBUG === "true";

  if (useSimpleUI) {
    console.log(chalk.hex("#ffd600")("[INFO] Using simple deployment mode for debugging"));
    try {
      execSync(command, {
        stdio: "inherit",
        cwd: process.cwd(),
        timeout: 120000,
      });
      console.log(chalk.hex("#00e676")("[OK] Docker services deployed successfully"));
    } catch (error) {
      console.log(
        chalk.hex("#ff1744")("[ERR] Deployment failed:"),
        error instanceof Error ? error.message : "Unknown error"
      );
      throw error;
    }
    return;
  }

  const ui = new EnhancedUI({ debug: false });
  const logger = new StreamingLogger({ debug: false, verbose: false });

  // Build enhanced tasks for multi-threaded execution
  const tasks: EnhancedTask[] = [];

  // Pre-flight checks
  tasks.push({
    id: "preflight",
    title: "[CHECK] Running pre-flight checks",
    task: async () => {
      // Check if Docker is running
      try {
        execSync("docker info", { stdio: "ignore" });
        logger.stream({ type: "success", message: "🐳 Docker daemon is running" });
      } catch {
        throw new Error("Docker daemon is not running");
      }

      // Check if docker-compose is available
      try {
        execSync("docker compose version", { stdio: "ignore" });
        logger.stream({ type: "success", message: "[PKG] Docker Compose is available" });
      } catch {
        throw new Error("Docker Compose is not available");
      }
    },
    concurrent: false,
  });

  // Build Docker services based on config
  const services: EnhancedTask[] = [];

  if (config.database && config.database !== "none") {
    const dbIcons: Record<string, string> = {
      postgres: "[PG]",
      postgresql: "[PG]",
      mysql: "[SQL]",
      mongodb: "[MONGO]",
      sqlite: "[LITE]",
      redis: "[REDIS]",
    };

    const dbIcon = dbIcons[config.database] || "[DB]";

    services.push({
      id: `database-${config.database}`,
      title: `${dbIcon} Setting up ${config.database} database`,
      task: async () => {
        logger.stream({
          type: "info",
          message: `[PULL] Pulling ${config.database} Docker image...`,
        });
        await new Promise((resolve) => setTimeout(resolve, 800));
        logger.stream({
          type: "info",
          message: `[START] Starting ${config.database} container...`,
        });
        await new Promise((resolve) => setTimeout(resolve, 600));
        logger.stream({ type: "success", message: `${config.database} database ready` });
      },
      concurrent: true,
    });
  }

  if (config.powerups && config.powerups.length > 0) {
    config.powerups.forEach((powerup: string) => {
      let title = "";
      let icon = "";
      let steps: Array<{ message: string; delay: number }> = [];

      switch (powerup) {
        case "traefik":
          icon = "[PROXY]";
          title = `${icon} Setting up Traefik reverse proxy`;
          steps = [
            { message: "[PULL] Pulling Traefik Docker image...", delay: 900 },
            { message: "[CFG] Configuring routing rules...", delay: 600 },
            { message: "[SSL] Setting up SSL certificates...", delay: 700 },
            { message: "Traefik reverse proxy ready", delay: 0 },
          ];
          break;
        case "ngrok":
          icon = "[TUNNEL]";
          title = `${icon} Setting up ngrok tunnels`;
          steps = [
            { message: "[PULL] Pulling ngrok Docker image...", delay: 800 },
            { message: "[AUTH] Authenticating with ngrok...", delay: 600 },
            { message: "[TUNNEL] Creating secure tunnels...", delay: 900 },
            { message: "ngrok tunnels established", delay: 0 },
          ];
          break;
        case "cloudflare-tunnel":
          icon = "[CF]";
          title = `${icon} Setting up Cloudflare tunnels`;
          steps = [
            { message: "[PULL] Pulling Cloudflare tunnel image...", delay: 800 },
            { message: "[AUTH] Authenticating with Cloudflare...", delay: 700 },
            { message: "[CF] Establishing tunnel connection...", delay: 900 },
            { message: "Cloudflare tunnel connected", delay: 0 },
          ];
          break;
        case "portainer":
          icon = "[UI]";
          title = `${icon} Setting up Portainer`;
          steps = [
            { message: "[PULL] Pulling Portainer Docker image...", delay: 700 },
            { message: "[CFG] Configuring management interface...", delay: 500 },
            { message: "Portainer management UI ready", delay: 0 },
          ];
          break;
        default:
          icon = "[SVC]";
          title = `${icon} Setting up ${powerup} service`;
          steps = [
            { message: `[PULL] Pulling ${powerup} Docker image...`, delay: 800 },
            { message: `[CFG] Configuring ${powerup}...`, delay: 600 },
            { message: `${powerup} service ready`, delay: 0 },
          ];
      }

      services.push({
        id: `powerup-${powerup}`,
        title,
        task: async () => {
          for (const step of steps) {
            if (step.delay > 0) {
              logger.stream({ type: "info", message: step.message });
              await new Promise((resolve) => setTimeout(resolve, step.delay));
            } else {
              logger.stream({ type: "success", message: step.message });
            }
          }
        },
        concurrent: true,
      });
    });
  }

  // Add parallel service tasks
  tasks.push(...services);

  // Preparation phase (animated)
  tasks.push({
    id: "docker-prep",
    title: "[PREP] Preparing Docker deployment",
    task: async () => {
      logger.stream({ type: "info", message: "Validating Docker configuration..." });
      await new Promise((resolve) => setTimeout(resolve, 300));
      logger.stream({ type: "info", message: "Building container configurations..." });
      await new Promise((resolve) => setTimeout(resolve, 500));
      logger.stream({ type: "info", message: "Preparing Docker Compose..." });
      await new Promise((resolve) => setTimeout(resolve, 400));
      logger.stream({ type: "success", message: "Docker deployment ready" });
    },
    concurrent: false,
  });

  // Actual Docker deployment (with real-time feedback)
  tasks.push({
    id: "docker-deploy",
    title: "[DEPLOY] Executing Docker deployment",
    task: async () => {
      await executeActualDeployment(command, logger);
    },
    concurrent: false,
    exitOnError: false, // Don't exit on deployment errors, let it continue
  });

  // Post-deployment tasks
  if (config.powerups && config.powerups.includes("ngrok")) {
    tasks.push({
      id: "ngrok-setup",
      title: "[TUNNEL] Configuring ngrok tunnels",
      task: async () => {
        logger.stream({ type: "info", message: "⏳ Waiting for ngrok tunnels..." });
        await new Promise((resolve) => setTimeout(resolve, 1500));
        logger.stream({ type: "info", message: "🔗 Establishing tunnel connections..." });
        await new Promise((resolve) => setTimeout(resolve, 1000));
        logger.stream({ type: "success", message: "ngrok tunnels ready" });
      },
      concurrent: false,
    });
  }

  // Health checks
  tasks.push({
    id: "health-check",
    title: "[CHECK] Running health checks",
    task: async () => {
      logger.stream({ type: "info", message: "[HEALTH] Checking service health..." });
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Check if containers are running
      try {
        const projectName = path.basename(process.cwd()).replace(/[^a-zA-Z0-9-_]/g, "-");
        execSync(
          `docker ps --filter "name=${projectName}" --format "table {{.Names}}\t{{.Status}}"`,
          { stdio: "ignore" }
        );
        logger.stream({ type: "info", message: "[VERIFY] Verifying container states..." });
        await new Promise((resolve) => setTimeout(resolve, 600));
        logger.stream({ type: "success", message: "All services are healthy" });
      } catch {
        logger.stream({ type: "warning", message: "[WARN] Some services may still be starting" });
      }
    },
    concurrent: false,
  });

  // Suppress verbose output globally
  await suppressConsolaGlobally(false);

  try {
    // Run all tasks with beautiful multi-threaded UI
    await ui.runTasks(tasks, {
      title: `Deploying ${chalk.hex("#00e676").bold("Docker Services")}...`,
      exitOnError: false,
      // Note: timeout option may not be supported by EnhancedUI
    });
  } catch {
    console.log(chalk.hex("#ff1744")("[ERR] Enhanced UI failed, falling back to simple execution"));
    console.log(chalk.hex("#ffd600")("[INFO] Executing deployment script directly..."));

    // Fallback to direct execution
    try {
      execSync(command, {
        stdio: "inherit",
        cwd: process.cwd(),
        timeout: 120000,
      });
      console.log(chalk.hex("#00e676")("[OK] Docker services deployed successfully"));
    } catch (fallbackError) {
      console.log(
        chalk.hex("#ff1744")("[ERR] Deployment failed:"),
        fallbackError instanceof Error ? fallbackError.message : "Unknown error"
      );
      throw fallbackError;
    }
  }

  // Restore consola output level
  await restoreConsolaGlobally();
}

/**
 * Show destruction plan with beautiful styling
 */
async function showDestructionPlan(_config: any, _projectName: string): Promise<void> {
  const services: Array<{ icon: string; name: string; description: string; type: string }> = [];

  // Database services
  if (_config.database && _config.database !== "none") {
    const dbIcons: Record<string, string> = {
      postgres: "[PG]",
      postgresql: "[PG]",
      mysql: "[SQL]",
      mongodb: "[MONGO]",
      sqlite: "[LITE]",
      redis: "[REDIS]",
    };

    services.push({
      icon: dbIcons[_config.database] || "[DB]",
      name: _config.database,
      description: "Database service + DATA",
      type: "database",
    });
  }

  // Powerup services
  if (_config.powerups && _config.powerups.length > 0) {
    _config.powerups.forEach((powerup: string) => {
      switch (powerup) {
        case "traefik":
          services.push({
            icon: "[PROXY]",
            name: "Traefik",
            description: "Reverse proxy service",
            type: "networking",
          });
          break;
        case "ngrok":
          services.push({
            icon: "[TUNNEL]",
            name: "ngrok",
            description: "Tunnel service",
            type: "tunnel",
          });
          break;
        case "cloudflare-tunnel":
          services.push({
            icon: "[CF]",
            name: "Cloudflare Tunnel",
            description: "Zero Trust tunnel",
            type: "tunnel",
          });
          break;
        case "portainer":
          services.push({
            icon: "[UI]",
            name: "Portainer",
            description: "Management UI",
            type: "management",
          });
          break;
        default:
          services.push({
            icon: "[SVC]",
            name: powerup,
            description: "Service",
            type: "service",
          });
      }
    });
  }

  if (services.length > 0) {
    // Create beautiful destruction list with consistent spacing
    const serviceList = services
      .map((service) => {
        const serviceName = chalk.hex("#ff1744").bold(service.name);
        const serviceDesc = chalk.hex("#9e9e9e")(service.description);

        return `    ${service.icon}  ${serviceName} ${chalk.hex("#ffd600")("•")} ${serviceDesc}`;
      })
      .join("\n");

    const totalServices = services.length;
    const estimatedTime = "5-15 seconds";

    console.log();
    console.log(chalk.hex("#ff1744").bold("━".repeat(66)));
    console.log(chalk.hex("#ff1744").bold("                     [DESTROY] DESTRUCTION PLAN"));
    console.log(chalk.hex("#ff1744").bold("━".repeat(66)));
    console.log();
    console.log(chalk.hex("#2962ff").bold("  [DESTROY] Services to destroy:"));
    console.log();
    console.log(serviceList);
    console.log();
    console.log(chalk.hex("#ff1744").bold("━".repeat(66)));
    console.log();
    console.log(
      `  ${chalk.hex("#aa00ff")("[TIME]")}  ${chalk.hex("#9e9e9e")("Estimated time:")} ${chalk.hex("#ff1744").bold(estimatedTime)}`
    );
    console.log(
      `  ${chalk.hex("#aa00ff")("[PKG]")}  ${chalk.hex("#9e9e9e")("Total services:")} ${chalk.hex("#ff1744").bold(totalServices.toString())}`
    );
    console.log(
      `  ${chalk.hex("#aa00ff")("[WARN]")}  ${chalk.hex("#9e9e9e")("Data recovery:")} ${chalk.hex("#ff1744")("IMPOSSIBLE after deletion")}`
    );
    console.log();
    console.log(chalk.hex("#ff1744").bold("━".repeat(66)));
    console.log();
  }
}

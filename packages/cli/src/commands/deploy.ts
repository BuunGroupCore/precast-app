import { execSync } from "child_process";
import * as path from "path";

import { confirm } from "@clack/prompts";
import fsExtra from "fs-extra";

import {
  theme,
  createHeroBanner,
  createFancyBox,
  divider,
  statusSymbols,
  actionSymbols,
  techBadge,
  createLink,
  comicDecorations,
} from "../utils/cli-theme.js";
import {
  updateEnvironmentVariables,
  formatEnvUpdates,
  validateNgrokUrls,
} from "../utils/environment-updater.js";
import { detectEnvironmentStructure } from "../utils/framework-detection.js";
import { waitForNgrokTunnels } from "../utils/ngrok-extractor.js";

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
        "🚫 Command Error"
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
        "🐳 Docker Required"
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
        "📄 Script Not Found"
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
    let actionIcon = "🚀";
    let actionTitle = "DEPLOY";
    let actionDesc = "◉ Starting Docker services";

    if (options.stop) {
      command = `${scriptPath} stop`;
      action = "stop";
      actionIcon = "⏹️";
      actionTitle = "STOP";
      actionDesc = "◉ Stopping Docker services";
    } else if (options.status) {
      command = `${scriptPath} status`;
      action = "status";
      actionIcon = "📊";
      actionTitle = "STATUS";
      actionDesc = "◉ Checking Docker services";
    } else if (options.help) {
      command = `${scriptPath} help`;
      action = "help";
      actionIcon = "❓";
      actionTitle = "HELP";
      actionDesc = "◉ Docker command help";
    }

    console.log();
    const heroBanner = await createHeroBanner(actionTitle, actionDesc);
    console.log(heroBanner);
    console.log();

    if (action === "deploy") {
      await showDeploymentInfo(config);
    }

    try {
      console.log(theme.accent(`${actionIcon} Executing Docker ${action}...`));
      console.log();

      execSync(command, {
        stdio: "inherit",
        cwd: process.cwd(),
      });

      console.log();
      if (action === "deploy") {
        let ngrokMessage = "";
        let ngrokUrls: { frontend?: string; api?: string } = {};
        const powerups = config.powerups || [];

        if (powerups.includes("ngrok")) {
          const ngrokResult = await handleNgrokDeployment(config, options);
          ngrokMessage = ngrokResult.message;
          ngrokUrls = ngrokResult.urls;
        } else {
          const emptyResult = { message: "", urls: {} };
          ngrokMessage = emptyResult.message;
          ngrokUrls = emptyResult.urls;
        }

        const successBox = createFancyBox(
          `${theme.success(`${statusSymbols.success} Docker Services Deployed!`)} ${comicDecorations.rocket}\n\n` +
            `All configured services are now running.${ngrokMessage}\n\n` +
            `${theme.accent("◆ Next steps:")}\n` +
            `${theme.bold("npm run dev")} ${theme.muted("- Start development server")}\n` +
            (ngrokUrls.frontend ? `${theme.bold("Visit:")} ${ngrokUrls.frontend}\n` : "") +
            `${theme.bold("create-precast-app deploy --status")} ${theme.muted("- Check service status")}\n` +
            `${theme.bold("create-precast-app deploy --stop")} ${theme.muted("- Stop services")}`,
          "✅ Deployment Complete"
        );
        console.log(successBox);
      } else if (action === "stop") {
        const successBox = createFancyBox(
          `${theme.success(`${statusSymbols.success} Docker Services Stopped!`)} ${comicDecorations.pow}\n\n` +
            `All services have been gracefully stopped.\n\n` +
            `${theme.accent("◆ To restart:")}\n` +
            `${theme.bold("create-precast-app deploy")} ${theme.muted("- Start services again")}`,
          "⏹️ Services Stopped"
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
      "💥 Deploy Command Error"
    );
    console.log(errorBox);
    console.log();
    process.exit(1);
  }
}

/**
 * Show deployment information before starting services
 */
async function showDeploymentInfo(config: any): Promise<void> {
  const services: string[] = [];

  if (config.database && config.database !== "none") {
    services.push(`${techBadge(config.database)} ${theme.muted("database")}`);
  }

  if (config.powerups && config.powerups.length > 0) {
    config.powerups.forEach((powerup: string) => {
      switch (powerup) {
        case "traefik":
          services.push(`${techBadge("traefik")} ${theme.muted("reverse proxy")}`);
          break;
        case "ngrok":
          services.push(`${techBadge("ngrok")} ${theme.muted("tunnel")}`);
          break;
        case "cloudflare-tunnel":
          services.push(`${techBadge("cloudflare-tunnel")} ${theme.muted("tunnel")}`);
          break;
        default:
          services.push(`${techBadge(powerup)} ${theme.muted("service")}`);
      }
    });
  }

  if (services.length > 0) {
    const deploymentContent =
      `${theme.accent("◆ Services to deploy:")}\n\n` +
      services.map((service) => `  ${actionSymbols.deploy} ${service}`).join("\n") +
      `\n\n${theme.info(`${statusSymbols.info} This may take a few moments for first-time setup`)}`;

    const deploymentBox = createFancyBox(deploymentContent, "🚀 Deployment Plan");
    console.log(deploymentBox);
    console.log();
  }
}

/**
 * Handle destroy command with safety prompts and complete cleanup
 */
async function handleDestroyCommand(config: any, skipPrompt: boolean = false): Promise<void> {
  const projectName = path.basename(process.cwd()).replace(/[^a-zA-Z0-9-_]/g, "-");

  console.log();
  const heroBanner = await createHeroBanner("DESTROY", "💥 Complete Docker cleanup");
  console.log(heroBanner);
  console.log();

  if (!skipPrompt) {
    const warningContent =
      `${theme.error(`${statusSymbols.error} DESTRUCTIVE OPERATION WARNING`)} ${comicDecorations.pow}\n\n` +
      `This will ${theme.bold("completely destroy")} all Docker services and data:\n\n` +
      `${theme.accent("◆ What will be destroyed:")}\n` +
      `  • All containers for project: ${techBadge(projectName)}\n` +
      `  • All volumes ${theme.error("(databases will lose ALL data)")}\n` +
      `  • All project networks\n` +
      (config.database && config.database !== "none"
        ? `  • ${techBadge(config.database)} ${theme.error("database data will be PERMANENTLY LOST")}\n`
        : "") +
      `\n${theme.warning(`${statusSymbols.warning} This action CANNOT be undone!`)}\n\n` +
      `${theme.info(`${statusSymbols.info} To proceed without confirmation:`)} ${techBadge("--approve")} flag`;

    const warningBox = createFancyBox(warningContent, "⚠️ Danger Zone");
    console.log(warningBox);
    console.log();

    const shouldContinue = await confirm({
      message: "Are you sure you want to destroy all Docker resources for this project?",
      initialValue: false,
    });

    if (!shouldContinue) {
      console.log();
      const cancelBox = createFancyBox(
        `${theme.info(`${statusSymbols.info} Operation Cancelled`)} ${comicDecorations.super}\n\n` +
          `No changes have been made to your Docker services.\n\n` +
          `${theme.accent("◆ Your data is safe!")}`,
        "✋ Destruction Cancelled"
      );
      console.log(cancelBox);
      console.log();
      return;
    }
  }

  console.log();
  console.log(`${theme.accent("◆ Starting destruction process:")} ${comicDecorations.boom}`);
  console.log();

  try {
    await destroyDockerResources(config, projectName);

    console.log();
    const successBox = createFancyBox(
      `${theme.success(`${statusSymbols.success} Destruction Complete!`)} ${comicDecorations.boom}\n\n` +
        `All Docker services and data have been destroyed.\n\n` +
        `${theme.accent("◆ To recreate services:")}\n` +
        `${theme.bold("create-precast-app deploy")} ${theme.muted("- Fresh deployment")}\n\n` +
        `${theme.info(`${statusSymbols.info} All data will be reset to initial state`)}`,
      "💥 Total Destruction"
    );
    console.log(successBox);
    console.log();

    console.log(theme.muted(divider()));
    console.log(
      theme.muted(
        `  💥 ${theme.bold("Complete cleanup")} • ${createLink("docker docs", "https://precast.dev/docs/docker")}`
      )
    );
    console.log();
  } catch (error) {
    console.log();
    const errorBox = createFancyBox(
      `${theme.error(`${statusSymbols.error} Destruction Failed`)}\n\n` +
        `${error instanceof Error ? error.message : "Unknown error occurred"}\n\n` +
        `${theme.info(`${statusSymbols.info} Manual cleanup may be required:`)}\n` +
        `${theme.bold("docker container prune -f")}\n` +
        `${theme.bold("docker volume prune -f")}\n` +
        `${theme.bold("docker network prune -f")}\n\n` +
        `${theme.accent("◆ Check running containers:")}\n` +
        `${theme.bold("docker ps")}`,
      "⚠️ Cleanup Incomplete"
    );
    console.log(errorBox);
    console.log();
    process.exit(1);
  }
}

/**
 * Destroy all Docker resources for the project with live streaming output
 */
async function destroyDockerResources(config: any, projectName: string): Promise<void> {
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

  steps.push({
    name: "containers",
    command: `docker container rm -f $(docker container ls -aq --filter "name=${projectName}") 2>/dev/null || true`,
    description: "Removing all project containers",
  });

  steps.push({
    name: "volumes",
    command: `docker volume rm $(docker volume ls -q --filter "name=${projectName}") 2>/dev/null || true`,
    description: "Removing all project volumes (data will be lost)",
  });

  steps.push({
    name: "networks",
    command: `docker network rm ${projectName}_network 2>/dev/null || true`,
    description: "Removing project network",
  });

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

  const totalSteps = steps.length;
  for (let i = 0; i < steps.length; i++) {
    const step = steps[i];
    const stepNumber = i + 1;

    console.log(
      `${theme.accent(`[${stepNumber}/${totalSteps}]`)} ${theme.bold(step.description)}...`
    );

    try {
      execSync(step.command, {
        stdio: "inherit",
        cwd: process.cwd(),
      });

      console.log(
        `${theme.success(`${statusSymbols.success}`)} ${theme.muted(step.description)} ${theme.success("completed")}`
      );
    } catch {
      // Expected to fail if resources don't exist
      console.log(
        `${theme.warning(`${statusSymbols.warning}`)} ${theme.muted(step.description)} ${theme.warning("skipped (no resources found)")}`
      );
    }

    if (i < steps.length - 1) {
      await new Promise((resolve) => setTimeout(resolve, 200));
    }
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
  console.log(`${theme.accent("🔍 Detecting project structure...")}`);

  const structure = await detectEnvironmentStructure(process.cwd());
  console.log(
    `${theme.success("✓")} Detected: ${structure.framework.framework}${structure.framework.router ? ` (${structure.framework.router})` : ""}`
  );

  console.log(`${theme.accent("⏳ Waiting for ngrok tunnels...")}`);
  const ngrokUrls = await waitForNgrokTunnels(10000);

  if (!ngrokUrls || !validateNgrokUrls(ngrokUrls)) {
    console.log(`${theme.warning("⚠️ Could not retrieve ngrok URLs")}`);
    return {
      message: `\n\n${theme.warning("⚠️ ngrok tunnels may still be initializing")}`,
      urls: {},
    };
  }

  console.log(`${theme.success("✓")} ngrok tunnels established:`);
  console.log(`   Frontend: ${ngrokUrls.frontend}`);
  console.log(`   API: ${ngrokUrls.api}`);

  if (!options.skipEnvUpdate) {
    const updates = await updateEnvironmentVariables(process.cwd(), structure, ngrokUrls, {
      dryRun: true,
    });

    if (updates.length > 0) {
      console.log(`\n${theme.accent("📝 Environment updates needed:")}`);
      console.log(formatEnvUpdates(updates));

      let shouldUpdate = false;

      if (options.yes || options.updateEnv) {
        shouldUpdate = true;
        console.log(`${theme.info("✓ Auto-updating environment variables...")}`);
      } else {
        const response = await confirm({
          message: "Update environment variables with ngrok URLs?",
          initialValue: true,
        });
        shouldUpdate = typeof response === "boolean" ? response : false;
      }

      if (shouldUpdate) {
        await updateEnvironmentVariables(process.cwd(), structure, ngrokUrls);
        console.log(`${theme.success("✅ Environment variables updated!")}`);
      }
    } else {
      console.log(`${theme.info("ℹ️ Environment variables already up to date")}`);
    }
  }

  let message = `\n\n${theme.accent("🌐 ngrok tunnels established:")}`;
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

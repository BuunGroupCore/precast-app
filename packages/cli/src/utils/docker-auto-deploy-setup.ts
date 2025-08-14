import path from "path";

import { consola } from "consola";
import fsExtra from "fs-extra";

import type { ProjectConfig } from "../../../shared/stack-config.js";
import type { TemplateEngine } from "../core/template-engine.js";

const { ensureDir, writeFile, chmod, pathExists } = fsExtra;

export interface DockerAutoDeployConfig {
  projectName: string;
  hasDocker: boolean;
  database: string;
  powerups: string[];
  timestamp: string;
  autoDeploy?: boolean;
}

/**
 * Setup Docker auto-deploy script for projects with Docker enabled
 * This creates a comprehensive script that automatically starts Docker services
 * based on the project configuration including databases and powerups
 */
export async function setupDockerAutoDeploy(
  config: ProjectConfig,
  projectPath: string,
  templateEngine: TemplateEngine,
  autoDeploy?: boolean
): Promise<void> {
  if (!config.docker) {
    consola.debug("Docker not enabled, skipping auto-deploy script setup");
    return;
  }

  consola.start("Setting up Docker auto-deploy script...");

  try {
    const scriptDir = path.join(projectPath, "scripts");
    await ensureDir(scriptDir);

    // Prepare template context
    const templateContext = {
      ...config,
      projectName: path.basename(projectPath).replace(/[^a-zA-Z0-9-_]/g, "-"), // Sanitize project name for Docker
      hasDocker: config.docker,
      database: config.database || "none",
      powerups: config.powerups || [],
      timestamp: new Date().toISOString(),
      autoDeploy: autoDeploy,
    };

    // Generate scripts for different platforms
    await generateCrossPlatformScripts(templateEngine, templateContext, scriptDir);

    // Update package.json with auto-deploy scripts
    await updatePackageJsonScripts(projectPath, templateContext);

    consola.success("Docker auto-deploy script configured successfully");
    consola.info(`Script location: ${path.relative(process.cwd(), scriptDir)}`);
  } catch (error) {
    consola.error("Failed to setup Docker auto-deploy script:", error);
    throw error;
  }
}

/**
 * Generate platform-specific Docker scripts
 */
async function generateCrossPlatformScripts(
  templateEngine: TemplateEngine,
  templateContext: any,
  scriptDir: string
): Promise<void> {
  const platform = process.platform;

  if (platform === "win32") {
    // Windows batch script
    const batContent = await templateEngine.renderTemplate(
      "scripts/docker-auto-deploy.bat.hbs",
      templateContext
    );
    const batPath = path.join(scriptDir, "docker-auto-deploy.bat");
    await writeFile(batPath, batContent);
    consola.info("Generated Windows batch script");
  } else {
    // Unix shell script (Mac/Linux/WSL)
    const bashContent = await templateEngine.renderTemplate(
      "scripts/docker-auto-deploy.sh.hbs",
      templateContext
    );
    const bashPath = path.join(scriptDir, "docker-auto-deploy.sh");
    await writeFile(bashPath, bashContent);
    await chmod(bashPath, 0o755);
    consola.info("Generated Unix shell script");
  }
}

/**
 * Get platform-appropriate script command
 */
function getCrossPlatformScript(command: string): string {
  const arg = command === "deploy" ? "" : ` ${command}`;
  const platform = process.platform;

  if (platform === "win32") {
    // Windows: Use batch script directly
    return `scripts/docker-auto-deploy.bat${arg}`;
  } else {
    // Unix: Use shell script directly
    return `./scripts/docker-auto-deploy.sh${arg}`;
  }
}

/**
 * Get platform-appropriate Docker command
 */
function getCrossPlatformDockerCommand(command: string): string {
  const platform = process.platform;

  if (platform === "win32") {
    // Windows: Use docker command directly (relies on Docker Desktop being in PATH)
    return command;
  } else {
    // Unix: Use docker command directly (PATH should include /usr/bin, /usr/local/bin, etc.)
    return command;
  }
}

/**
 * Get platform-appropriate open command for URLs
 */
function getCrossPlatformOpenCommand(url: string): string {
  const platform = process.platform;

  if (platform === "win32") {
    return `start ${url}`;
  } else if (platform === "darwin") {
    return `open ${url}`;
  } else {
    return `xdg-open ${url} || echo "Please visit: ${url}"`;
  }
}

/**
 * Update package.json with Docker auto-deploy scripts
 */
async function updatePackageJsonScripts(
  projectPath: string,
  config: DockerAutoDeployConfig
): Promise<void> {
  const packageJsonPath = path.join(projectPath, "package.json");

  if (!(await pathExists(packageJsonPath))) {
    consola.warn("package.json not found, skipping script integration");
    return;
  }

  try {
    const packageJson = await fsExtra.readJson(packageJsonPath);

    // Ensure scripts object exists
    if (!packageJson.scripts) {
      packageJson.scripts = {};
    }

    // Add Docker auto-deploy scripts (cross-platform)
    const newScripts: Record<string, string> = {
      "docker:deploy": getCrossPlatformScript("deploy"),
      "docker:stop": getCrossPlatformScript("stop"),
      "docker:status": getCrossPlatformScript("status"),
      "docker:help": getCrossPlatformScript("help"),
      "docker:down": getCrossPlatformScript("stop"), // Comprehensive stop for all services
    };

    // Note: Auto-deploy is handled via the 'deploy' command, not postinstall scripts
    // Users can run: npx create-precast-app deploy
    // Or use the convenient npm scripts below

    // Add database-specific convenience scripts if database is configured
    if (config.database && config.database !== "none") {
      newScripts[`${config.database}:up`] = getCrossPlatformDockerCommand(
        `docker compose -f docker/${config.database}/docker-compose.yml up -d`
      );
      newScripts[`${config.database}:down`] = getCrossPlatformDockerCommand(
        `docker compose -f docker/${config.database}/docker-compose.yml down`
      );
      newScripts[`${config.database}:logs`] = getCrossPlatformDockerCommand(
        `docker compose -f docker/${config.database}/docker-compose.yml logs -f`
      );
    }

    // Add powerup-specific scripts
    for (const powerup of config.powerups) {
      switch (powerup) {
        case "traefik":
          newScripts["traefik:up"] = getCrossPlatformDockerCommand(
            "docker compose -f docker/traefik/docker-compose.traefik.yml up -d"
          );
          newScripts["traefik:down"] = getCrossPlatformDockerCommand(
            "docker compose -f docker/traefik/docker-compose.traefik.yml down"
          );
          newScripts["traefik:dashboard"] = getCrossPlatformOpenCommand(
            "http://traefik.localhost:8080"
          );
          break;
        case "ngrok":
          newScripts["ngrok:up"] = getCrossPlatformDockerCommand(
            "docker compose -f docker/ngrok/docker-compose.ngrok.yml up -d"
          );
          newScripts["ngrok:down"] = getCrossPlatformDockerCommand(
            "docker compose -f docker/ngrok/docker-compose.ngrok.yml down"
          );
          newScripts["ngrok:dashboard"] = getCrossPlatformOpenCommand("http://localhost:4040");
          newScripts["ngrok:url"] = getCrossPlatformDockerCommand(
            "docker logs $(npm config get name)_ngrok 2>&1 | grep -o 'https://[a-z0-9-]*.ngrok.io' | head -1 || echo 'Tunnel not ready yet'"
          );
          break;
        case "cloudflare-tunnel":
          newScripts["cloudflare:up"] = getCrossPlatformDockerCommand(
            "docker compose -f docker/cloudflare-tunnel/docker-compose.cloudflare.yml up -d"
          );
          newScripts["cloudflare:down"] = getCrossPlatformDockerCommand(
            "docker compose -f docker/cloudflare-tunnel/docker-compose.cloudflare.yml down"
          );
          newScripts["cloudflare:logs"] = getCrossPlatformDockerCommand(
            "docker compose -f docker/cloudflare-tunnel/docker-compose.cloudflare.yml logs -f"
          );
          break;
      }
    }

    // Update or modify existing development scripts
    if (packageJson.scripts.setup) {
      // Enhance existing setup script to include auto-deploy
      const currentSetup = packageJson.scripts.setup;
      if (!currentSetup.includes("docker-auto-deploy")) {
        packageJson.scripts.setup = `${currentSetup} && ${getCrossPlatformScript("deploy")}`;
      }
    } else {
      // Create new setup script
      packageJson.scripts.setup = `${getPackageManagerInstallCommand()} && ${getCrossPlatformScript("deploy")}`;
    }

    // Add or enhance dev:docker script for full automated development workflow
    const sleepCommand = `node -e "setTimeout(() => {}, 3000)"`; // Cross-platform sleep
    packageJson.scripts["dev:docker"] =
      `${getCrossPlatformScript("deploy")} && ${sleepCommand} && npm run dev`;

    // Merge new scripts with existing ones
    Object.assign(packageJson.scripts, newScripts);

    // Write updated package.json
    await fsExtra.writeJson(packageJsonPath, packageJson, { spaces: 2 });

    consola.success("Package.json updated with Docker auto-deploy scripts");
  } catch (error) {
    consola.warn("Failed to update package.json scripts:", error);
  }
}

/**
 * Get the appropriate package manager install command
 */
function getPackageManagerInstallCommand(): string {
  // This would ideally check the package manager from config
  // For now, we'll use a generic approach
  if (process.env.npm_config_user_agent?.includes("bun")) {
    return "bun install";
  } else if (process.env.npm_config_user_agent?.includes("pnpm")) {
    return "pnpm install";
  } else if (process.env.npm_config_user_agent?.includes("yarn")) {
    return "yarn install";
  } else {
    return "npm install";
  }
}

/**
 * Generate helpful Docker deployment instructions for README
 */
export function generateDockerDeploymentInstructions(config: DockerAutoDeployConfig): string {
  const instructions = [`# Docker Auto-Deploy`];

  instructions.push(
    `This project includes automated Docker deployment for ${config.database !== "none" ? `${config.database} database` : "services"}${config.powerups.length > 0 ? ` and ${config.powerups.join(", ")} powerups` : ""}.`
  );

  instructions.push("");
  instructions.push("## Quick Start");
  instructions.push("");
  instructions.push("```bash");
  instructions.push("# Install dependencies and start all Docker services");
  instructions.push("npm run setup");
  instructions.push("");
  instructions.push("# Start development with Docker services");
  instructions.push("npm run dev:docker");
  instructions.push("```");

  instructions.push("");
  instructions.push("## Docker Commands");
  instructions.push("");
  instructions.push("```bash");
  instructions.push("# Start all services");
  instructions.push("npm run docker:deploy");
  instructions.push("");
  instructions.push("# Stop all services");
  instructions.push("npm run docker:stop");
  instructions.push("");
  instructions.push("# Check service status");
  instructions.push("npm run docker:status");
  instructions.push("");
  instructions.push("# Get help");
  instructions.push("npm run docker:help");
  instructions.push("```");

  if (config.database && config.database !== "none") {
    instructions.push("");
    instructions.push(
      `## ${config.database.charAt(0).toUpperCase() + config.database.slice(1)} Database`
    );
    instructions.push("");
    instructions.push("```bash");
    instructions.push(`# Start ${config.database} only`);
    instructions.push(`npm run ${config.database}:up`);
    instructions.push("");
    instructions.push(`# Stop ${config.database}`);
    instructions.push(`npm run ${config.database}:down`);
    instructions.push("");
    instructions.push(`# View ${config.database} logs`);
    instructions.push(`npm run ${config.database}:logs`);
    instructions.push("```");
  }

  if (config.powerups.length > 0) {
    instructions.push("");
    instructions.push("## Network Services");

    for (const powerup of config.powerups) {
      switch (powerup) {
        case "traefik":
          instructions.push("");
          instructions.push("### Traefik Reverse Proxy");
          instructions.push("");
          instructions.push("```bash");
          instructions.push("# Start Traefik");
          instructions.push("npm run traefik:up");
          instructions.push("");
          instructions.push("# Open Traefik dashboard");
          instructions.push("npm run traefik:dashboard");
          instructions.push("```");
          instructions.push("");
          instructions.push("Dashboard: http://traefik.localhost:8080");
          break;
        case "ngrok":
          instructions.push("");
          instructions.push("### ngrok Tunnel");
          instructions.push("");
          instructions.push("```bash");
          instructions.push("# Start ngrok");
          instructions.push("npm run ngrok:up");
          instructions.push("");
          instructions.push("# Get tunnel URL");
          instructions.push("npm run ngrok:url");
          instructions.push("");
          instructions.push("# Open ngrok dashboard");
          instructions.push("npm run ngrok:dashboard");
          instructions.push("```");
          instructions.push("");
          instructions.push("Dashboard: http://localhost:4040");
          break;
      }
    }
  }

  return instructions.join("\n");
}

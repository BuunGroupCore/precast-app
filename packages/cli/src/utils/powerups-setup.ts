import * as path from "path";
import { fileURLToPath } from "url";

import { consola } from "consola";
import fsExtra from "fs-extra";
import Handlebars from "handlebars";

import type { ProjectConfig } from "../../../shared/stack-config.js";

import { installDependencies } from "./package-manager.js";

const { ensureDir, pathExists, readFile, writeFile, readJson, writeJson } = fsExtra;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * PowerUp configuration structure
 */
export interface PowerUpConfig {
  id: string;
  name: string;
  description?: string;
  dependencies?: Record<string, string[]>;
  devDependencies?: Record<string, string[]>;
  envVariables?: Record<string, string>;
  scripts?: Record<string, string>;
  setupFiles?: Record<string, Array<{ template: string; output: string }>>;
  packageJsonConfig?: Record<string, any>;
}

/**
 * Sets up powerups using template-based configuration
 * This is a wrapper for backward compatibility
 * @param projectPath - Path to the project
 * @param framework - Framework name
 * @param powerUpIds - List of powerup IDs to install
 * @param typescript - Whether to use TypeScript
 */
export async function setupPowerUps(
  projectPath: string,
  framework: string,
  powerUpIds: string[],
  typescript: boolean = true
): Promise<void> {
  if (!powerUpIds || powerUpIds.length === 0) {
    return;
  }

  consola.info(`🚀 Setting up powerups: ${powerUpIds.join(", ")}...`);

  try {
    const isMonorepo = await pathExists(path.join(projectPath, "apps"));
    const targetPath = isMonorepo ? path.join(projectPath, "apps", "web") : projectPath;

    const allDependencies: Set<string> = new Set();
    const allDevDependencies: Set<string> = new Set();
    const allEnvVariables: Record<string, string> = {};
    const allScripts: Record<string, string> = {};
    const allPackageJsonConfigs: Record<string, any> = {};

    for (const powerUpId of powerUpIds) {
      const powerUpConfig = await loadPowerUpConfig(powerUpId);

      if (!powerUpConfig) {
        consola.warn(`PowerUp configuration not found for: ${powerUpId}`);
        continue;
      }

      consola.info(`Setting up ${powerUpConfig.name}...`);

      const deps =
        powerUpConfig.dependencies?.[framework] || powerUpConfig.dependencies?.["*"] || [];
      const devDeps =
        powerUpConfig.devDependencies?.[framework] || powerUpConfig.devDependencies?.["*"] || [];

      deps.forEach((dep) => allDependencies.add(dep));
      devDeps.forEach((dep) => allDevDependencies.add(dep));

      if (powerUpConfig.envVariables) {
        Object.assign(allEnvVariables, powerUpConfig.envVariables);
      }

      if (powerUpConfig.scripts) {
        Object.assign(allScripts, powerUpConfig.scripts);
      }

      if (powerUpConfig.packageJsonConfig) {
        Object.assign(allPackageJsonConfigs, powerUpConfig.packageJsonConfig);
      }

      const backend = isMonorepo ? "express" : "none"; // Infer backend from monorepo status
      const projectRootPath = isMonorepo ? projectPath : undefined;
      await setupPowerUpFiles(
        powerUpConfig,
        targetPath,
        framework,
        typescript,
        backend,
        projectRootPath
      );

      if (powerUpId === "ngrok" || powerUpId === "traefik") {
        const dockerEnvPath = isMonorepo
          ? path.join(projectPath, "docker", powerUpId)
          : path.join(targetPath, "docker", powerUpId);

        if (await pathExists(dockerEnvPath)) {
          const dockerEnvFile = path.join(dockerEnvPath, ".env");
          const envContent: string[] = [];

          if (powerUpConfig.envVariables) {
            for (const [key, value] of Object.entries(powerUpConfig.envVariables)) {
              let systemValue = process.env[key];
              if (!systemValue && key === "NGROK_AUTHTOKEN") {
                systemValue = process.env["NGROK_AUTH_TOKEN"];
              } else if (!systemValue && key === "NGROK_AUTH_TOKEN") {
                systemValue = process.env["NGROK_AUTHTOKEN"];
              }

              const envValue = systemValue || value;
              envContent.push(`${key}=${envValue}`);
              if (systemValue) {
                consola.info(`Using system ${key} for ${powerUpId}`);
              }
            }
          }

          if (envContent.length > 0) {
            await writeFile(dockerEnvFile, envContent.join("\n"));
            consola.success(`Created ${powerUpId} .env with environment variables`);
          }
        }
      }

      const config: ProjectConfig = {
        name: path.basename(projectPath),
        framework: framework as any,
        backend: isMonorepo ? "express" : "none", // Assume express if monorepo for now
        database: "none",
        orm: "none",
        styling: "css",
        typescript,
        git: false,
        gitignore: false,
        eslint: false,
        prettier: false,
        docker: true,
        packageManager: "npm",
        projectPath,
        language: typescript ? "typescript" : "javascript",
      };
      await runSpecialSetup(powerUpId, targetPath, config);
    }

    if (allDependencies.size > 0) {
      consola.info("📦 Installing powerup dependencies...");
      await installDependencies(Array.from(allDependencies), {
        packageManager: "npm",
        projectPath: targetPath,
        dev: false,
        context: "powerups",
      });
    }

    if (allDevDependencies.size > 0) {
      consola.info("📦 Installing powerup dev dependencies...");
      await installDependencies(Array.from(allDevDependencies), {
        packageManager: "npm",
        projectPath: targetPath,
        dev: true,
        context: "powerups_dev",
      });
    }

    if (Object.keys(allEnvVariables).length > 0) {
      await updateEnvFile(targetPath, allEnvVariables);
    }

    if (Object.keys(allScripts).length > 0) {
      const projectName = path.basename(projectPath);
      const scriptsPath = isMonorepo ? projectPath : targetPath;
      await updatePackageJsonScripts(scriptsPath, allScripts, projectName);
    }

    if (Object.keys(allPackageJsonConfigs).length > 0) {
      await updatePackageJsonConfig(targetPath, allPackageJsonConfigs);
    }

    consola.success("✅ PowerUps setup completed!");
  } catch (error) {
    consola.error("Failed to setup powerups:", error);
    throw error;
  }
}

/**
 * Sets up powerups using template-based configuration
 * @param config - Project configuration
 * @param projectPath - Path to the project
 * @param powerUpIds - List of powerup IDs to install
 */
export async function setupPowerUpsWithConfig(
  config: ProjectConfig,
  projectPath: string,
  powerUpIds: string[]
): Promise<void> {
  if (!powerUpIds || powerUpIds.length === 0) {
    return;
  }

  consola.info(`🚀 Setting up powerups: ${powerUpIds.join(", ")}...`);

  try {
    const isMonorepo = config.backend && config.backend !== "none";
    const targetPath = isMonorepo ? path.join(projectPath, "apps", "web") : projectPath;

    const allDependencies: Set<string> = new Set();
    const allDevDependencies: Set<string> = new Set();
    const allEnvVariables: Record<string, string> = {};
    const allScripts: Record<string, string> = {};
    const allPackageJsonConfigs: Record<string, any> = {};

    for (const powerUpId of powerUpIds) {
      const powerUpConfig = await loadPowerUpConfig(powerUpId);

      if (!powerUpConfig) {
        consola.warn(`PowerUp configuration not found for: ${powerUpId}`);
        continue;
      }

      consola.info(`Setting up ${powerUpConfig.name}...`);

      const framework = config.framework || "react";
      const deps =
        powerUpConfig.dependencies?.[framework] || powerUpConfig.dependencies?.["*"] || [];
      const devDeps =
        powerUpConfig.devDependencies?.[framework] || powerUpConfig.devDependencies?.["*"] || [];

      deps.forEach((dep) => allDependencies.add(dep));
      devDeps.forEach((dep) => allDevDependencies.add(dep));

      if (powerUpConfig.envVariables) {
        Object.assign(allEnvVariables, powerUpConfig.envVariables);
      }

      if (powerUpConfig.scripts) {
        Object.assign(allScripts, powerUpConfig.scripts);
      }

      if (powerUpConfig.packageJsonConfig) {
        Object.assign(allPackageJsonConfigs, powerUpConfig.packageJsonConfig);
      }

      const projectRootPath = isMonorepo ? projectPath : undefined;
      await setupPowerUpFiles(
        powerUpConfig,
        targetPath,
        framework,
        config.typescript ?? true,
        config.backend,
        projectRootPath
      );

      if (powerUpId === "ngrok" || powerUpId === "traefik") {
        const dockerEnvPath = isMonorepo
          ? path.join(projectPath, "docker", powerUpId)
          : path.join(targetPath, "docker", powerUpId);

        if (await pathExists(dockerEnvPath)) {
          const dockerEnvFile = path.join(dockerEnvPath, ".env");
          const envContent: string[] = [];

          if (powerUpConfig.envVariables) {
            for (const [key, value] of Object.entries(powerUpConfig.envVariables)) {
              let systemValue = process.env[key];
              if (!systemValue && key === "NGROK_AUTHTOKEN") {
                systemValue = process.env["NGROK_AUTH_TOKEN"];
              } else if (!systemValue && key === "NGROK_AUTH_TOKEN") {
                systemValue = process.env["NGROK_AUTHTOKEN"];
              }

              const envValue = systemValue || value;
              envContent.push(`${key}=${envValue}`);
              if (systemValue) {
                consola.info(`Using system ${key} for ${powerUpId}`);
              }
            }
          }

          if (envContent.length > 0) {
            await writeFile(dockerEnvFile, envContent.join("\n"));
            consola.success(`Created ${powerUpId} .env with environment variables`);
          }
        }
      }

      await runSpecialSetup(powerUpId, targetPath, config);
    }

    if (allDependencies.size > 0) {
      consola.info("📦 Installing powerup dependencies...");
      await installDependencies(Array.from(allDependencies), {
        packageManager: config.packageManager,
        projectPath: targetPath,
        dev: false,
        context: "powerups",
      });
    }

    if (allDevDependencies.size > 0) {
      consola.info("📦 Installing powerup dev dependencies...");
      await installDependencies(Array.from(allDevDependencies), {
        packageManager: config.packageManager,
        projectPath: targetPath,
        dev: true,
        context: "powerups_dev",
      });
    }

    if (Object.keys(allEnvVariables).length > 0) {
      await updateEnvFile(targetPath, allEnvVariables);
    }

    if (Object.keys(allScripts).length > 0) {
      const projectName = path.basename(projectPath);
      const scriptsPath = isMonorepo ? projectPath : targetPath;
      await updatePackageJsonScripts(scriptsPath, allScripts, projectName);
    }

    if (Object.keys(allPackageJsonConfigs).length > 0) {
      await updatePackageJsonConfig(targetPath, allPackageJsonConfigs);
    }

    consola.success("✅ PowerUps setup completed!");
  } catch (error) {
    consola.error("Failed to setup powerups:", error);
    throw error;
  }
}

/**
 * Load powerup configuration from template directory
 */
async function loadPowerUpConfig(powerUpId: string): Promise<PowerUpConfig | null> {
  const configPaths = [
    path.join(__dirname, "templates", "powerups", powerUpId, "config.json"),
    path.join(__dirname, "..", "..", "src", "templates", "powerups", powerUpId, "config.json"),
  ];

  for (const configPath of configPaths) {
    if (await pathExists(configPath)) {
      try {
        const config = await readJson(configPath);
        return config as PowerUpConfig;
      } catch (error) {
        consola.warn(`Failed to load powerup config from ${configPath}:`, error);
      }
    }
  }

  // Fallback to built-in configurations for backward compatibility
  return getBuiltInConfig(powerUpId);
}

/**
 * Setup powerup template files
 */
async function setupPowerUpFiles(
  powerUpConfig: PowerUpConfig,
  targetPath: string,
  framework: string,
  typescript: boolean,
  backend?: string,
  projectRootPath?: string
): Promise<void> {
  if (!powerUpConfig.setupFiles) return;

  // Register custom Handlebars helpers
  Handlebars.registerHelper("ifEquals", function (this: any, arg1: any, arg2: any, options: any) {
    return arg1 === arg2 ? options.fn(this) : options.inverse(this);
  });

  Handlebars.registerHelper("eq", (a: any, b: any) => a === b);
  Handlebars.registerHelper("ne", (a: any, b: any) => a !== b);
  Handlebars.registerHelper("and", (a: any, b: any) => a && b);
  Handlebars.registerHelper("or", (a: any, b: any) => a || b);
  Handlebars.registerHelper("not", (a: any) => !a);

  const files = powerUpConfig.setupFiles[framework] || powerUpConfig.setupFiles["*"] || [];

  for (const file of files) {
    const templatePaths = [
      path.join(__dirname, "templates", "powerups", powerUpConfig.id, framework, file.template),
      path.join(__dirname, "templates", "powerups", powerUpConfig.id, file.template),
      path.join(
        __dirname,
        "..",
        "..",
        "src",
        "templates",
        "powerups",
        powerUpConfig.id,
        framework,
        file.template
      ),
      path.join(
        __dirname,
        "..",
        "..",
        "src",
        "templates",
        "powerups",
        powerUpConfig.id,
        file.template
      ),
    ];

    let templateContent: string | null = null;
    for (const templatePath of templatePaths) {
      if (await pathExists(templatePath)) {
        templateContent = await readFile(templatePath, "utf-8");
        break;
      }
    }

    if (!templateContent) {
      consola.warn(`Template not found: ${file.template} for ${powerUpConfig.id}`);
      continue;
    }

    // Process template with Handlebars
    const template = Handlebars.compile(templateContent);

    // Get the actual project name (for monorepos, go up to find the root)
    const projectName = targetPath.includes("/apps/")
      ? path.basename(path.dirname(path.dirname(targetPath)))
      : path.basename(targetPath);

    const content = template({
      typescript,
      framework,
      backend: backend || "none",
      projectName,
      name: projectName, // Add 'name' for backward compatibility with templates
      nodeEnv: process.env.NODE_ENV || "development",
    });

    // Determine output path - use project root for docker-related files in monorepos
    let basePath = targetPath;

    // For monorepo projects, put docker files at the root level
    if (projectRootPath && file.output.startsWith("docker/")) {
      basePath = projectRootPath;
    }

    let outputPath = path.join(basePath, file.output);

    // Adjust file extension for TypeScript/JavaScript (but not for docker/config files)
    if (!file.output.startsWith("docker/")) {
      if (!typescript && outputPath.endsWith(".ts")) {
        outputPath = outputPath.replace(/\.ts$/, ".js");
      } else if (typescript && outputPath.endsWith(".js") && !outputPath.includes("config")) {
        outputPath = outputPath.replace(/\.js$/, ".ts");
      }
    }

    // Ensure directory exists
    await ensureDir(path.dirname(outputPath));

    // Write file
    await writeFile(outputPath, content);
    consola.success(`Created ${path.relative(targetPath, outputPath)}`);
  }
}

/**
 * Update environment file with new variables
 */
async function updateEnvFile(
  projectPath: string,
  envVariables: Record<string, string>
): Promise<void> {
  const envPath = path.join(projectPath, ".env");
  const envExamplePath = path.join(projectPath, ".env.example");

  for (const filePath of [envPath, envExamplePath]) {
    let content = "";
    if (await pathExists(filePath)) {
      content = await readFile(filePath, "utf-8");
    }

    const lines: string[] = [];
    let hasSection = false;

    for (const [key, value] of Object.entries(envVariables)) {
      if (!content.includes(key)) {
        if (!hasSection) {
          lines.push("\n# PowerUp Environment Variables");
          hasSection = true;
        }
        // Check if the environment variable exists in the system
        // Also check for NGROK_AUTHTOKEN vs NGROK_AUTH_TOKEN variants
        let systemValue = process.env[key];
        if (!systemValue && key === "NGROK_AUTHTOKEN") {
          systemValue = process.env["NGROK_AUTH_TOKEN"];
        } else if (!systemValue && key === "NGROK_AUTH_TOKEN") {
          systemValue = process.env["NGROK_AUTHTOKEN"];
        }

        const envValue = systemValue || value;
        lines.push(`${key}=${envValue}`);

        // Log if we're using a system value
        if (systemValue && filePath.endsWith(".env")) {
          consola.info(`Using system environment variable for ${key}`);
        }
      }
    }

    if (lines.length > 0) {
      const newContent = content + (content.endsWith("\n") ? "" : "\n") + lines.join("\n");
      await writeFile(filePath, newContent);
    }
  }

  if (Object.keys(envVariables).length > 0) {
    consola.success("Added environment variables");
  }
}

/**
 * Update package.json scripts
 */
async function updatePackageJsonScripts(
  projectPath: string,
  scripts: Record<string, string>,
  projectName?: string
): Promise<void> {
  const packageJsonPath = path.join(projectPath, "package.json");

  if (!(await pathExists(packageJsonPath))) {
    consola.warn("package.json not found");
    return;
  }

  const packageJson = await readJson(packageJsonPath);
  packageJson.scripts = packageJson.scripts || {};

  // Get the project name from package.json if not provided
  const name = projectName || packageJson.name || path.basename(projectPath);

  for (const [key, value] of Object.entries(scripts)) {
    if (!packageJson.scripts[key]) {
      // Replace $(npm config get name) with the actual project name
      const processedValue = value.replace(/\$\(npm config get name\)/g, name);
      packageJson.scripts[key] = processedValue;
    }
  }

  await writeJson(packageJsonPath, packageJson, { spaces: 2 });
  consola.success("Updated package.json scripts");
}

/**
 * Update package.json configuration
 */
async function updatePackageJsonConfig(
  projectPath: string,
  config: Record<string, any>
): Promise<void> {
  const packageJsonPath = path.join(projectPath, "package.json");

  if (!(await pathExists(packageJsonPath))) {
    return;
  }

  const packageJson = await readJson(packageJsonPath);

  for (const [key, value] of Object.entries(config)) {
    if (typeof value === "object" && !Array.isArray(value)) {
      packageJson[key] = { ...packageJson[key], ...value };
    } else {
      packageJson[key] = value;
    }
  }

  await writeJson(packageJsonPath, packageJson, { spaces: 2 });
}

/**
 * Run special setup for specific powerups
 */
async function runSpecialSetup(
  powerUpId: string,
  targetPath: string,
  config: ProjectConfig
): Promise<void> {
  switch (powerUpId) {
    case "husky":
      await setupHusky(targetPath);
      break;
    case "prettier":
      await setupPrettier(targetPath, config);
      break;
    case "eslint":
      await setupESLint(targetPath, config);
      break;
    case "ngrok":
      await setupNgrokViteConfig(targetPath, config);
      break;
    case "traefik": {
      // Traefik requires Docker to be enabled
      if (!config.docker) {
        consola.warn("⚠️  Traefik requires Docker. Enabling Docker automatically...");
        config.docker = true;
      }

      // Setup traefik environment configuration
      await setupTraefikEnvironment(targetPath, config);

      // Get framework-specific default ports
      const getFrameworkPort = (framework: string): number => {
        switch (framework) {
          case "next":
          case "nuxt":
          case "solid":
            return 3000;
          case "angular":
            return 4200;
          case "astro":
            return 4321;
          case "react":
          case "vue":
          case "svelte":
          case "vite":
            return 5173;
          default:
            return 3000;
        }
      };

      // Get backend-specific default ports
      const getBackendPort = (backend: string): number => {
        switch (backend) {
          case "express":
            return 5000;
          case "fastify":
            return 3001;
          case "hono":
          case "nest":
          case "next-api":
            return 3000;
          default:
            return 5000;
        }
      };

      const frontendPort = getFrameworkPort(config.framework);
      const apiPort = config.backend ? getBackendPort(config.backend) : 5000;

      consola.info("🎯 Traefik configured successfully!");
      consola.info(
        "   1. Run 'npm run traefik:network' to create the Docker network (one-time setup)"
      );
      consola.info("   2. Run 'npm run traefik:up' to start Traefik");
      consola.info(`   3. Access your app at http://app.localhost (port ${frontendPort})`);
      if (config.backend && config.backend !== "none" && config.backend !== "next-api") {
        consola.info(`   4. Access your API at http://api.localhost (port ${apiPort})`);
      }
      consola.info("   5. View Traefik dashboard at http://traefik.localhost:8080 (admin/admin)");
      break;
    }
    // Add more special setups as needed
  }
}

/**
 * Setup Husky pre-commit hooks
 */
async function setupHusky(projectPath: string): Promise<void> {
  const packageJsonPath = path.join(projectPath, "package.json");

  if (!(await pathExists(packageJsonPath))) {
    return;
  }

  const packageJson = await readJson(packageJsonPath);

  // Add prepare script
  packageJson.scripts = packageJson.scripts || {};
  packageJson.scripts.prepare = "husky install";

  // Add lint-staged configuration
  packageJson["lint-staged"] = {
    "*.{js,jsx,ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.{json,css,md}": ["prettier --write"],
  };

  await writeJson(packageJsonPath, packageJson, { spaces: 2 });
  consola.success("Configured Husky and lint-staged");
}

/**
 * Setup Prettier configuration
 */
async function setupPrettier(_projectPath: string, _config: ProjectConfig): Promise<void> {
  // Additional Prettier setup if needed
  consola.success("Prettier configuration added");
}

/**
 * Setup ESLint configuration
 */
async function setupESLint(_projectPath: string, _config: ProjectConfig): Promise<void> {
  // Additional ESLint setup if needed
  consola.success("ESLint configuration added");
}

/**
 * Setup ngrok Vite configuration to allow ngrok hosts
 */
async function setupNgrokViteConfig(projectPath: string, config: ProjectConfig): Promise<void> {
  // Setup Vite config for frontend
  await setupNgrokViteAllowedHosts(projectPath, config);

  // Setup CORS for API if it exists
  await setupNgrokApiCors(projectPath, config);
}

/**
 * Setup ngrok allowed hosts in Vite config
 */
async function setupNgrokViteAllowedHosts(
  projectPath: string,
  config: ProjectConfig
): Promise<void> {
  // Only for Vite-based frameworks
  const viteFrameworks = [
    "react",
    "vue",
    "svelte",
    "solid",
    "vite",
    "react-router",
    "tanstack-router",
    "tanstack-start",
  ];
  if (!viteFrameworks.includes(config.framework)) {
    return;
  }

  // Find vite.config file
  const viteConfigFiles = [
    path.join(projectPath, "vite.config.ts"),
    path.join(projectPath, "vite.config.js"),
    path.join(projectPath, "vite.config.mjs"),
  ];

  let viteConfigPath: string | null = null;
  for (const file of viteConfigFiles) {
    if (await pathExists(file)) {
      viteConfigPath = file;
      break;
    }
  }

  if (!viteConfigPath) {
    consola.warn("Could not find vite.config file to add ngrok allowed hosts");
    return;
  }

  // Read the vite config
  let content = await readFile(viteConfigPath, "utf-8");

  // Check if server.allowedHosts is already configured
  if (content.includes("allowedHosts") || content.includes("ngrok")) {
    consola.info("Vite config already has allowedHosts configuration");
    return;
  }

  // Add server configuration for ngrok
  const serverConfig = `  server: {
    // Allow ngrok tunnels
    allowedHosts: [
      "localhost",
      ".ngrok.app",
      ".ngrok-free.app",
      ".ngrok.io"
    ]
  },`;

  // Find where to insert the server config
  // Look for the defineConfig({ ... }) block
  const defineConfigRegex = /defineConfig\s*\(\s*\{/;
  const match = content.match(defineConfigRegex);

  if (match && match.index !== undefined) {
    // Insert after the opening brace of defineConfig
    const insertPosition = match.index + match[0].length;

    // Check if there are already properties in the config
    const afterMatch = content.slice(insertPosition).trim();
    if (afterMatch.startsWith("}")) {
      // Empty config, just add the server config
      content =
        content.slice(0, insertPosition) +
        "\n" +
        serverConfig +
        "\n" +
        content.slice(insertPosition);
    } else {
      // Config has properties, add server config at the beginning
      content =
        content.slice(0, insertPosition) +
        "\n" +
        serverConfig +
        "\n" +
        content.slice(insertPosition);
    }

    await writeFile(viteConfigPath, content);
    consola.success("Added ngrok allowed hosts to Vite configuration");
  } else {
    consola.warn("Could not find defineConfig in vite.config - manual configuration may be needed");
  }
}

/**
 * Setup ngrok CORS configuration for API server
 */
async function setupNgrokApiCors(projectPath: string, config: ProjectConfig): Promise<void> {
  // Check if this is a monorepo with a separate API
  const isMonorepo = config.backend && config.backend !== "none" && config.backend !== "next-api";
  if (!isMonorepo) {
    return;
  }

  // Get the API path - in monorepos, it's the root path
  const apiPath = projectPath.endsWith("/apps/web")
    ? path.join(projectPath, "..", "..", "apps", "api")
    : path.join(projectPath, "apps", "api");

  // Check if API directory exists first
  if (!(await pathExists(apiPath))) {
    consola.debug(
      "API directory not found yet - CORS configuration will be needed when API is set up"
    );
    return;
  }

  // Find the constants file
  const constantsFiles = [
    path.join(apiPath, "src", "config", "constants.ts"),
    path.join(apiPath, "src", "config", "constants.js"),
    path.join(apiPath, "src", "constants.ts"),
    path.join(apiPath, "src", "constants.js"),
  ];

  let constantsPath: string | null = null;
  for (const file of constantsFiles) {
    if (await pathExists(file)) {
      constantsPath = file;
      break;
    }
  }

  if (!constantsPath) {
    consola.info(
      "ℹ API CORS configuration: You'll need to add ngrok origins to your API's CORS settings"
    );
    consola.info("  Add these origins to your CORS configuration:");
    consola.info("    - https://*.ngrok.app");
    consola.info("    - https://*.ngrok-free.app");
    consola.info("    - https://*.ngrok.io");
    return;
  }

  // Read the constants file
  let content = await readFile(constantsPath, "utf-8");

  // Check if ngrok is already in CORS
  if (content.includes("ngrok")) {
    consola.info("API CORS already configured for ngrok");
    return;
  }

  // Add ngrok domains to CORS origin array
  const ngrokOrigins = `      // Allow ngrok tunnels
      "https://*.ngrok.app",
      "https://*.ngrok-free.app", 
      "https://*.ngrok.io",`;

  // Find the CORS_CONFIG origin array
  const corsRegex = /origin:.*?\[([^\]]*)\]/s;
  const match = content.match(corsRegex);

  if (match && match.index !== undefined) {
    // Insert ngrok origins into the existing array
    const insertPosition = match.index + match[0].indexOf("[") + 1;

    // Add ngrok origins after the opening bracket
    content =
      content.slice(0, insertPosition) + "\n" + ngrokOrigins + content.slice(insertPosition);

    await writeFile(constantsPath, content);
    consola.success("Added ngrok origins to API CORS configuration");
  } else {
    consola.warn("Could not find CORS_CONFIG origin array - manual configuration may be needed");
  }
}

/**
 * Setup traefik environment configuration
 */
async function setupTraefikEnvironment(projectPath: string, config: ProjectConfig): Promise<void> {
  const isMonorepo = config.backend && config.backend !== "none" && config.backend !== "next-api";

  // Update frontend environment to use traefik routes
  if (isMonorepo) {
    // Get the actual project root (go up from apps/web if needed)
    const projectRoot = projectPath.endsWith("/apps/web")
      ? path.dirname(path.dirname(projectPath))
      : projectPath;

    // Update frontend .env files
    const frontendEnvFiles = [
      path.join(projectRoot, "apps", "web", ".env"),
      path.join(projectRoot, "apps", "web", ".env.local"),
      path.join(projectRoot, "apps", "web", ".env.example"),
    ];

    for (const envFile of frontendEnvFiles) {
      if (await pathExists(envFile)) {
        let content = await readFile(envFile, "utf-8");

        // Check if we already have traefik config
        if (content.includes("# Traefik Configuration")) {
          continue;
        }

        // Add traefik configuration section
        const traefikConfig = `
# Traefik Configuration
# When using traefik, uncomment the line below and comment the localhost version
# VITE_API_URL=http://api.localhost
# Default (without traefik):
VITE_API_URL=http://localhost:3001
`;

        // Replace existing API_URL or append if not found
        if (content.includes("VITE_API_URL")) {
          content = content.replace(/VITE_API_URL=.*/, traefikConfig.trim());
        } else {
          content += "\n" + traefikConfig;
        }

        await writeFile(envFile, content);
        consola.success(`Updated ${path.basename(envFile)} with traefik configuration`);
      }
    }

    // Update backend .env files for Docker database connections
    if (config.database === "postgres") {
      // Check if API directory exists first
      const apiDir = path.join(projectRoot, "apps", "api");
      if (!(await pathExists(apiDir))) {
        consola.debug("API directory not found - skipping backend env configuration");
        return;
      }

      const backendEnvFiles = [path.join(apiDir, ".env"), path.join(apiDir, ".env.example")];

      for (const envFile of backendEnvFiles) {
        if (await pathExists(envFile)) {
          let content = await readFile(envFile, "utf-8");

          // Check if we already have Docker config
          if (content.includes("# Docker Configuration")) {
            continue;
          }

          // Add Docker database configuration
          const dockerConfig = `
# Docker Configuration
# When running with Docker Compose, use the container name for the database host:
# DATABASE_URL=postgresql://postgres:postgres@${config.name}-postgres:5432/${config.name}
# Default (for local development without Docker):
`;

          // Insert before the DATABASE_URL line
          if (content.includes("DATABASE_URL")) {
            content = content.replace(/(DATABASE_URL=.*)/, dockerConfig.trim() + "\n$1");
          }

          await writeFile(envFile, content);
          consola.success(`Updated ${path.basename(envFile)} with Docker database configuration`);
        }
      }
    }
  }
}

/**
 * Get built-in configuration for backward compatibility
 */
function getBuiltInConfig(powerUpId: string): PowerUpConfig | null {
  // This would contain a subset of the most common powerups as fallback
  const builtInConfigs: Record<string, PowerUpConfig> = {
    prettier: {
      id: "prettier",
      name: "Prettier",
      description: "Code formatter",
      devDependencies: {
        "*": ["prettier"],
      },
      scripts: {
        format: "prettier --write .",
        "format:check": "prettier --check .",
      },
      setupFiles: {
        "*": [
          { template: ".prettierrc.hbs", output: ".prettierrc" },
          { template: ".prettierignore.hbs", output: ".prettierignore" },
        ],
      },
    },
    eslint: {
      id: "eslint",
      name: "ESLint",
      description: "Code linter",
      devDependencies: {
        react: ["eslint", "eslint-config-prettier", "eslint-plugin-react"],
        vue: ["eslint", "eslint-plugin-vue", "eslint-config-prettier"],
        "*": ["eslint", "eslint-config-prettier"],
      },
      scripts: {
        lint: "eslint .",
        "lint:fix": "eslint . --fix",
      },
      setupFiles: {
        "*": [
          { template: ".eslintrc.js.hbs", output: ".eslintrc.js" },
          { template: ".eslintignore.hbs", output: ".eslintignore" },
        ],
      },
    },
    vitest: {
      id: "vitest",
      name: "Vitest",
      description: "Testing framework",
      devDependencies: {
        "*": ["vitest", "@vitest/ui", "jsdom"],
      },
      scripts: {
        test: "vitest",
        "test:ui": "vitest --ui",
        "test:coverage": "vitest --coverage",
      },
      setupFiles: {
        "*": [
          { template: "vitest.config.js.hbs", output: "vitest.config.js" },
          { template: "setup.ts.hbs", output: "test/setup.ts" },
        ],
      },
    },
    // Add more built-in configs as needed
  };

  return builtInConfigs[powerUpId] || null;
}

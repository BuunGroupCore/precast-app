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
  const config: ProjectConfig = {
    name: path.basename(projectPath),
    framework: framework as any,
    backend: "none",
    database: "none",
    orm: "none",
    styling: "css",
    typescript,
    git: false,
    gitignore: false,
    eslint: false,
    prettier: false,
    docker: false,
    packageManager: "npm",
    projectPath,
    language: typescript ? "typescript" : "javascript",
  };

  return setupPowerUpsWithConfig(config, projectPath, powerUpIds);
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

    // Collect all dependencies and configurations
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

      // Process dependencies
      const framework = config.framework || "react";
      const deps =
        powerUpConfig.dependencies?.[framework] || powerUpConfig.dependencies?.["*"] || [];
      const devDeps =
        powerUpConfig.devDependencies?.[framework] || powerUpConfig.devDependencies?.["*"] || [];

      deps.forEach((dep) => allDependencies.add(dep));
      devDeps.forEach((dep) => allDevDependencies.add(dep));

      // Process environment variables
      if (powerUpConfig.envVariables) {
        Object.assign(allEnvVariables, powerUpConfig.envVariables);
      }

      // Process scripts
      if (powerUpConfig.scripts) {
        Object.assign(allScripts, powerUpConfig.scripts);
      }

      // Process package.json configurations
      if (powerUpConfig.packageJsonConfig) {
        Object.assign(allPackageJsonConfigs, powerUpConfig.packageJsonConfig);
      }

      // Process setup files
      await setupPowerUpFiles(powerUpConfig, targetPath, framework, config.typescript ?? true);

      // Run special setup for specific powerups
      await runSpecialSetup(powerUpId, targetPath, config);
    }

    // Install dependencies
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

    // Update environment variables
    if (Object.keys(allEnvVariables).length > 0) {
      await updateEnvFile(targetPath, allEnvVariables);
    }

    // Update package.json scripts
    if (Object.keys(allScripts).length > 0) {
      await updatePackageJsonScripts(targetPath, allScripts);
    }

    // Update package.json configurations
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
  typescript: boolean
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
    const content = template({
      typescript,
      framework,
      projectName: path.basename(targetPath),
      nodeEnv: process.env.NODE_ENV || "development",
    });

    // Determine output path
    let outputPath = path.join(targetPath, file.output);

    // Adjust file extension for TypeScript/JavaScript
    if (!typescript && outputPath.endsWith(".ts")) {
      outputPath = outputPath.replace(/\.ts$/, ".js");
    } else if (typescript && outputPath.endsWith(".js") && !outputPath.includes("config")) {
      outputPath = outputPath.replace(/\.js$/, ".ts");
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
        lines.push(`${key}=${value}`);
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
  scripts: Record<string, string>
): Promise<void> {
  const packageJsonPath = path.join(projectPath, "package.json");

  if (!(await pathExists(packageJsonPath))) {
    consola.warn("package.json not found");
    return;
  }

  const packageJson = await readJson(packageJsonPath);
  packageJson.scripts = packageJson.scripts || {};

  for (const [key, value] of Object.entries(scripts)) {
    if (!packageJson.scripts[key]) {
      packageJson.scripts[key] = value;
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
    case "traefik":
      // Traefik requires Docker to be enabled
      if (!config.docker) {
        consola.warn("⚠️  Traefik requires Docker. Enabling Docker automatically...");
        config.docker = true;
      }

      // Detect if monorepo or single repo
      const projectRoot =
        config.backend && config.backend !== "none" && config.backend !== "next-api"
          ? path.dirname(path.dirname(targetPath)) // Go up to monorepo root
          : targetPath;

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

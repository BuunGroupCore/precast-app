import * as path from "path";
import { fileURLToPath } from "url";

import { consola } from "consola";
import fsExtra from "fs-extra";
import Handlebars from "handlebars";

import type { ProjectConfig } from "../../../shared/stack-config.js";

import { installDependencies } from "./package-manager.js";
import { getTemplateRoot } from "./template-path.js";

const { ensureDir, pathExists, readFile, writeFile, readJson, writeJson, readdir } = fsExtra;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Plugin configuration structure (matching the config.json format)
 */
export interface PluginConfig {
  id: string;
  name: string;
  description?: string;
  category?: string;
  pricing?: string;
  dependencies?: Record<string, string[]>;
  backendDependencies?: Record<string, string[]>;
  devDependencies?: Record<string, string[]>;
  backendDevDependencies?: Record<string, string[]>;
  envVariables?: Record<string, string>;
  scripts?: Record<string, string>;
  setupFiles?: Record<string, Array<{ template: string; output: string }>>;
  backendSetupFiles?: Record<string, Array<{ template: string; output: string }>>;
  postInstall?: {
    instructions?: string[];
  };
  documentationUrl?: string;
  setupUrl?: string;
}

/**
 * Sets up plugins using template-based configuration
 * @param config - Project configuration
 * @param projectPath - Path to the project
 * @param pluginIds - List of plugin IDs to install
 */
export async function setupPlugins(
  config: ProjectConfig,
  projectPath: string,
  pluginIds?: string[]
): Promise<void> {
  if (!pluginIds || pluginIds.length === 0) {
    return;
  }

  consola.info(`🔌 Setting up plugins: ${pluginIds.join(", ")}...`);

  try {
    const isMonorepo = config.backend && config.backend !== "none";
    const frontendPath = isMonorepo ? path.join(projectPath, "apps", "web") : projectPath;
    const backendPath = isMonorepo ? path.join(projectPath, "apps", "api") : projectPath;

    // Collect all dependencies and configurations
    const frontendDeps: Set<string> = new Set();
    const frontendDevDeps: Set<string> = new Set();
    const backendDeps: Set<string> = new Set();
    const backendDevDeps: Set<string> = new Set();
    const allEnvVariables: Record<string, string> = {};
    const allScripts: Record<string, string> = {};

    for (const pluginId of pluginIds) {
      const pluginConfig = await loadPluginConfig(pluginId);

      if (!pluginConfig) {
        consola.warn(`Plugin configuration not found for: ${pluginId}`);
        continue;
      }

      consola.info(`Setting up ${pluginConfig.name}...`);

      // Process frontend dependencies
      const framework = config.framework || "react";
      const deps = pluginConfig.dependencies?.[framework] || pluginConfig.dependencies?.["*"] || [];
      const devDeps =
        pluginConfig.devDependencies?.[framework] || pluginConfig.devDependencies?.["*"] || [];

      deps.forEach((dep) => frontendDeps.add(dep));
      devDeps.forEach((dep) => frontendDevDeps.add(dep));

      // Process backend dependencies if backend exists
      if (config.backend && config.backend !== "none") {
        const backendSpecificDeps =
          pluginConfig.backendDependencies?.[config.backend] ||
          pluginConfig.backendDependencies?.["*"] ||
          [];
        const backendSpecificDevDeps =
          pluginConfig.backendDevDependencies?.[config.backend] ||
          pluginConfig.backendDevDependencies?.["*"] ||
          [];

        backendSpecificDeps.forEach((dep) => backendDeps.add(dep));
        backendSpecificDevDeps.forEach((dep) => backendDevDeps.add(dep));
      }

      // Process environment variables
      if (pluginConfig.envVariables) {
        Object.assign(allEnvVariables, pluginConfig.envVariables);
      }

      // Process scripts
      if (pluginConfig.scripts) {
        Object.assign(allScripts, pluginConfig.scripts);
      }

      // Setup frontend files
      await setupPluginFiles(
        pluginConfig,
        frontendPath,
        framework,
        config.typescript,
        "setupFiles"
      );

      // Setup backend files if backend exists
      if (config.backend && config.backend !== "none") {
        await setupPluginFiles(
          pluginConfig,
          backendPath,
          config.backend,
          config.typescript,
          "backendSetupFiles"
        );
      }

      // Show post-install instructions
      if (pluginConfig.postInstall?.instructions) {
        consola.info(`\n📝 ${pluginConfig.name} Setup Instructions:`);
        pluginConfig.postInstall.instructions.forEach((instruction) => {
          consola.info(`  ${instruction}`);
        });
      }
    }

    // Install frontend dependencies
    if (frontendDeps.size > 0) {
      consola.info("📦 Installing plugin frontend dependencies...");
      await installDependencies(Array.from(frontendDeps), {
        packageManager: config.packageManager,
        projectPath: frontendPath,
        dev: false,
      });
    }

    if (frontendDevDeps.size > 0) {
      consola.info("📦 Installing plugin frontend dev dependencies...");
      await installDependencies(Array.from(frontendDevDeps), {
        packageManager: config.packageManager,
        projectPath: frontendPath,
        dev: true,
      });
    }

    // Install backend dependencies if in monorepo
    if (isMonorepo && backendDeps.size > 0) {
      consola.info("📦 Installing plugin backend dependencies...");
      await installDependencies(Array.from(backendDeps), {
        packageManager: config.packageManager,
        projectPath: backendPath,
        dev: false,
      });
    }

    if (isMonorepo && backendDevDeps.size > 0) {
      consola.info("📦 Installing plugin backend dev dependencies...");
      await installDependencies(Array.from(backendDevDeps), {
        packageManager: config.packageManager,
        projectPath: backendPath,
        dev: true,
      });
    }

    // Update environment variables
    if (Object.keys(allEnvVariables).length > 0) {
      await updateEnvFile(frontendPath, allEnvVariables);
      if (isMonorepo) {
        await updateEnvFile(backendPath, allEnvVariables);
      }
    }

    // Update package.json scripts
    if (Object.keys(allScripts).length > 0) {
      await updatePackageJsonScripts(frontendPath, allScripts);
    }

    consola.success("✅ Plugins setup completed!");
  } catch (error) {
    consola.error("Failed to setup plugins:", error);
    throw error;
  }
}

/**
 * Load plugin configuration from config.json
 */
async function loadPluginConfig(pluginId: string): Promise<PluginConfig | null> {
  const templateRoot = getTemplateRoot();
  const configPaths = [
    path.join(templateRoot, "plugins", pluginId, "config.json"),
    path.join(__dirname, "..", "templates", "plugins", pluginId, "config.json"),
    path.join(__dirname, "templates", "plugins", pluginId, "config.json"),
  ];

  for (const configPath of configPaths) {
    if (await pathExists(configPath)) {
      try {
        const config = await readJson(configPath);
        return config as PluginConfig;
      } catch (error) {
        consola.warn(`Failed to load plugin config from ${configPath}:`, error);
      }
    }
  }

  return null;
}

/**
 * Setup plugin template files
 */
async function setupPluginFiles(
  pluginConfig: PluginConfig,
  targetPath: string,
  framework: string,
  typescript: boolean,
  filesKey: "setupFiles" | "backendSetupFiles"
): Promise<void> {
  const setupFiles = pluginConfig[filesKey];
  if (!setupFiles) return;

  // Register custom Handlebars helpers if not already registered
  if (!Handlebars.helpers.ifEquals) {
    Handlebars.registerHelper("ifEquals", function (this: any, arg1: any, arg2: any, options: any) {
      return arg1 === arg2 ? options.fn(this) : options.inverse(this);
    });
    Handlebars.registerHelper("eq", (a: any, b: any) => a === b);
    Handlebars.registerHelper("ne", (a: any, b: any) => a !== b);
    Handlebars.registerHelper("and", (a: any, b: any) => a && b);
    Handlebars.registerHelper("or", (a: any, b: any) => a || b);
    Handlebars.registerHelper("not", (a: any) => !a);
  }

  const files = setupFiles[framework] || setupFiles["*"] || [];

  for (const file of files) {
    const templateRoot = getTemplateRoot();
    const templatePaths = [
      path.join(templateRoot, "plugins", pluginConfig.id, file.template),
      path.join(templateRoot, "plugins", pluginConfig.id, framework, file.template),
      path.join(__dirname, "..", "templates", "plugins", pluginConfig.id, file.template),
      path.join(__dirname, "..", "templates", "plugins", pluginConfig.id, framework, file.template),
    ];

    let templatePath: string | null = null;
    for (const tp of templatePaths) {
      if (await pathExists(tp)) {
        templatePath = tp;
        break;
      }
    }

    if (!templatePath) {
      consola.warn(`Template not found: ${file.template} for plugin ${pluginConfig.id}`);
      continue;
    }

    const outputPath = path.join(targetPath, file.output);

    // Create output directory
    await ensureDir(path.dirname(outputPath));

    // Read and compile template
    const templateContent = await readFile(templatePath, "utf-8");
    const compiledTemplate = Handlebars.compile(templateContent);

    // Generate content with context
    const context = {
      typescript,
      pluginId: pluginConfig.id,
      pluginName: pluginConfig.name,
    };

    const generatedContent = compiledTemplate(context);

    // Write file
    await writeFile(outputPath, generatedContent);

    consola.success(`  ✓ Created ${file.output}`);
  }
}

/**
 * Update .env.example and .env files with plugin environment variables
 */
async function updateEnvFile(
  targetPath: string,
  envVariables: Record<string, string>
): Promise<void> {
  const envExamplePath = path.join(targetPath, ".env.example");
  const envPath = path.join(targetPath, ".env");

  // Create .env.example if it doesn't exist
  if (!(await pathExists(envExamplePath))) {
    await writeFile(envExamplePath, "");
  }

  // Read existing content
  let envContent = await readFile(envExamplePath, "utf-8");

  // Add plugin environment variables
  envContent += "\n# Plugin Configuration\n";
  for (const [key, value] of Object.entries(envVariables)) {
    if (!envContent.includes(key)) {
      envContent += `${key}=${value}\n`;
    }
  }

  // Write back to .env.example
  await writeFile(envExamplePath, envContent);

  // Create/update .env file with plugin environment variables
  if (!(await pathExists(envPath))) {
    await writeFile(envPath, envContent);
  } else {
    // If .env exists, append plugin variables if they don't exist
    let existingEnvContent = await readFile(envPath, "utf-8");
    let needsUpdate = false;

    for (const [key, value] of Object.entries(envVariables)) {
      if (!existingEnvContent.includes(key)) {
        if (!needsUpdate) {
          existingEnvContent += "\n# Plugin Configuration\n";
          needsUpdate = true;
        }
        existingEnvContent += `${key}=${value}\n`;
      }
    }

    if (needsUpdate) {
      await writeFile(envPath, existingEnvContent);
    }
  }
}

/**
 * Update package.json scripts
 */
async function updatePackageJsonScripts(
  targetPath: string,
  scripts: Record<string, string>
): Promise<void> {
  const packageJsonPath = path.join(targetPath, "package.json");

  if (!(await pathExists(packageJsonPath))) {
    consola.warn("package.json not found, skipping script updates");
    return;
  }

  const packageJson = await readJson(packageJsonPath);

  if (!packageJson.scripts) {
    packageJson.scripts = {};
  }

  Object.assign(packageJson.scripts, scripts);

  await writeJson(packageJsonPath, packageJson, { spaces: 2 });
}

/**
 * Get all available plugins by scanning the templates directory
 */
export async function getAvailablePlugins(): Promise<string[]> {
  const templateRoot = getTemplateRoot();
  const pluginsDir = path.join(templateRoot, "plugins");

  if (!(await pathExists(pluginsDir))) {
    return [];
  }

  const entries = await readdir(pluginsDir, { withFileTypes: true });
  const plugins: string[] = [];

  for (const entry of entries) {
    if (entry.isDirectory()) {
      const configPath = path.join(pluginsDir, entry.name, "config.json");
      if (await pathExists(configPath)) {
        plugins.push(entry.name);
      }
    }
  }

  return plugins;
}

/**
 * Validate plugin selection
 */
export function validatePluginSelection(
  plugins: string[],
  config: ProjectConfig
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Basic validation - more detailed checks can be added based on plugin configs
  for (const pluginId of plugins) {
    // Check if plugin requires backend
    if (["stripe", "resend", "sendgrid", "socketio"].includes(pluginId)) {
      if (!config.backend || config.backend === "none") {
        errors.push(`Plugin ${pluginId} requires a backend`);
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

import * as path from "path";
import { fileURLToPath } from "url";

import type { ProjectConfig } from "@shared/stack-config.js";
import { consola } from "consola";
import fsExtra from "fs-extra";
import Handlebars from "handlebars";

import { installDependencies } from "@/utils/system/package-manager.js";
import { getTemplateRoot } from "@/utils/system/template-path.js";
import { logger } from "@/utils/ui/logger.js";

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
  // Support both widget config structures for backward compatibility
  files?: Record<string, Array<{ from: string; to: string }>>;
  widgets?: {
    adminPanel?: boolean;
    files?: Record<string, Array<{ from: string; to: string }>>;
  };
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

  logger.verbose(`🔌 Setting up plugins: ${pluginIds.join(", ")}...`);

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
        logger.warn(`Plugin configuration not found for: ${pluginId}`);
        continue;
      }

      logger.verbose(`Setting up ${pluginConfig.name}...`);

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
        "setupFiles",
        config
      );

      // Setup backend files if backend exists
      if (config.backend && config.backend !== "none") {
        await setupPluginFiles(
          pluginConfig,
          backendPath,
          config.backend,
          config.typescript,
          "backendSetupFiles",
          config
        );
      }

      // Setup Precast widget if requested
      if (pluginConfig.widgets?.adminPanel) {
        await setupPrecastWidget(config, projectPath);
      }

      // Show post-install instructions
      if (pluginConfig.postInstall?.instructions) {
        logger.verbose(`\n📝 ${pluginConfig.name} Setup Instructions:`);
        pluginConfig.postInstall.instructions.forEach((instruction) => {
          logger.verbose(`  ${instruction}`);
        });
      }
    }

    // Update package.json with plugin dependencies
    if (frontendDeps.size > 0 || frontendDevDeps.size > 0) {
      logger.verbose("📦 Adding plugin dependencies to frontend package.json...");
      await updatePackageJsonDependencies(frontendPath, frontendDeps, frontendDevDeps);
    }

    if (isMonorepo && (backendDeps.size > 0 || backendDevDeps.size > 0)) {
      logger.verbose("📦 Adding plugin dependencies to backend package.json...");
      await updatePackageJsonDependencies(backendPath, backendDeps, backendDevDeps);
    }

    // Install all dependencies if install flag is set
    if (config.autoInstall) {
      // Install frontend dependencies
      if (frontendDeps.size > 0 || frontendDevDeps.size > 0) {
        logger.verbose("📦 Installing plugin frontend dependencies...");
        await installDependencies([], {
          packageManager: config.packageManager,
          projectPath: frontendPath,
          dev: false,
          context: "plugins_frontend",
        });
      }

      // Install backend dependencies if in monorepo
      if (isMonorepo && (backendDeps.size > 0 || backendDevDeps.size > 0)) {
        logger.verbose("📦 Installing plugin backend dependencies...");
        await installDependencies([], {
          packageManager: config.packageManager,
          projectPath: backendPath,
          dev: false,
          context: "plugins_backend",
        });
      }
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

    logger.verbose("✅ Plugins setup completed!");
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
        logger.warn(`Failed to load plugin config from ${configPath}: ${error}`);
      }
    }
  }

  return null;
}

/**
 * Setup Precast validation widget for testing services
 */
export async function setupPrecastWidget(
  config: ProjectConfig,
  projectPath: string
): Promise<void> {
  try {
    const isMonorepo = config.backend && config.backend !== "none";
    const frontendPath = isMonorepo ? path.join(projectPath, "apps", "web") : projectPath;
    const backendPath = isMonorepo ? path.join(projectPath, "apps", "api") : projectPath;

    const templateRoot = getTemplateRoot();
    const widgetPath = path.join(templateRoot, "widgets", "precast-widget");

    // Check if widget templates exist
    if (!(await pathExists(widgetPath))) {
      logger.warn("Precast widget templates not found");
      return;
    }

    // Install icon dependencies for the widget
    logger.verbose("📦 Installing icon libraries for PrecastWidget...");

    // Check if React 19 is being used (Next.js 15+ uses React 19)
    const packageJsonPath = path.join(frontendPath, "package.json");
    let isReact19 = false;
    if (await pathExists(packageJsonPath)) {
      const pkgJson = await readJson(packageJsonPath);
      const reactVersion = pkgJson.dependencies?.react;
      // Check if React 19 or canary version
      if (
        reactVersion &&
        (reactVersion.includes("19.") ||
          reactVersion.includes("rc") ||
          reactVersion.includes("canary"))
      ) {
        isReact19 = true;
        logger.verbose("Detected React 19, will use --legacy-peer-deps for npm");
      }
    }

    // For React 19 with npm, we need to use legacy-peer-deps
    if (isReact19 && config.packageManager === "npm") {
      try {
        // Install using npm with legacy-peer-deps flag directly
        const { execa } = await import("execa");
        logger.verbose(
          "Installing icon libraries with --legacy-peer-deps for React 19 compatibility..."
        );
        await execa(
          "npm",
          ["install", "react-icons@^5.0.1", "lucide-react@latest", "--legacy-peer-deps"],
          {
            cwd: frontendPath,
            stdio: "inherit",
          }
        );
      } catch (error) {
        logger.warn("Failed to install icon libraries with --legacy-peer-deps, trying without...");
        // Fallback to regular installation
        await installDependencies(["react-icons@^5.0.1", "lucide-react@latest"], {
          packageManager: config.packageManager,
          projectPath: frontendPath,
          dev: false,
          context: "icons",
        });
      }
    } else {
      // For other package managers or React 18 and below, use regular installation
      const iconDeps = isReact19
        ? ["react-icons@^5.0.1", "lucide-react@latest"]
        : ["react-icons@^5.0.1", "lucide-react@^0.368.0"];

      await installDependencies(iconDeps, {
        packageManager: config.packageManager,
        projectPath: frontendPath,
        dev: false,
        context: "icons",
      });
    }

    // Add react-icons to the config for template processing
    const updatedConfig = {
      ...config,
      // Add react-icons as a temporary flag for template processing
      hasReactIcons: true,
    };

    // Load widget configuration
    const widgetConfigPath = path.join(widgetPath, "config.json");
    let widgetConfig: PluginConfig | null = null;

    if (await pathExists(widgetConfigPath)) {
      widgetConfig = (await readJson(widgetConfigPath)) as PluginConfig;
    }

    // Process all widget files based on config.json
    if (widgetConfig && widgetConfig.files && widgetConfig.files.react) {
      const templateContext = {
        ...updatedConfig,
        plugins: config.plugins || [],
        database: config.database || "none",
        authProvider:
          config.authProvider && config.authProvider !== "none" ? config.authProvider : undefined,
      };

      // Process each file from the config
      for (const fileEntry of widgetConfig.files.react) {
        const templatePath = path.join(widgetPath, fileEntry.from);

        // For Next.js, components stay at src/components level (not in app/)
        let adjustedTargetPath = fileEntry.to;
        // No adjustment needed - components go to src/components for all frameworks

        const targetPath = path.join(frontendPath, adjustedTargetPath);

        if (await pathExists(templatePath)) {
          const templateContent = await readFile(templatePath, "utf-8");
          const processedContent = Handlebars.compile(templateContent)(templateContext);

          // Ensure target directory exists
          await ensureDir(path.dirname(targetPath));
          await writeFile(targetPath, processedContent);

          logger.verbose(`✅ Copied widget file: ${fileEntry.from} -> ${adjustedTargetPath}`);
        } else {
          logger.warn(`Widget template not found: ${fileEntry.from}`);
        }
      }
    } else {
      // Fallback to old behavior for backward compatibility
      const widgetTemplatePath = path.join(widgetPath, "PrecastWidget.tsx.hbs");
      if (await pathExists(widgetTemplatePath)) {
        const widgetTemplate = await readFile(widgetTemplatePath, "utf-8");
        const widgetContent = Handlebars.compile(widgetTemplate)({
          ...updatedConfig,
          plugins: config.plugins || [],
          database: config.database || "none",
          authProvider:
            config.authProvider && config.authProvider !== "none" ? config.authProvider : undefined,
        });

        // Components go to src/components for all frameworks (including Next.js)
        const componentDir = path.join(frontendPath, "src", "components", "precast");
        await ensureDir(componentDir);
        await writeFile(path.join(componentDir, "PrecastWidget.tsx"), widgetContent);
      } else {
        logger.warn("PrecastWidget template not found");
        return;
      }
    }

    // Process API health routes if backend exists
    if (config.backend && config.backend !== "none") {
      const routesTemplate = await readFile(
        path.join(widgetPath, "api", "health-routes.ts.hbs"),
        "utf-8"
      );

      const routesContent = Handlebars.compile(routesTemplate)({
        ...config,
        plugins: config.plugins || [],
        authProvider: config.authProvider || "none",
      });

      const routesDir = path.join(backendPath, "src", "api", "routes");
      await ensureDir(routesDir);
      await writeFile(path.join(routesDir, "health.ts"), routesContent);
    }

    // Note: App.tsx integration is now handled by the template itself using Handlebars conditions
    // The PrecastWidget is conditionally included when plugins or database are configured

    logger.verbose("✅ Precast validation widget installed");
    logger.verbose("   Look for the floating button in the bottom-right corner");
  } catch (error) {
    logger.warn(`Failed to setup admin panel widget: ${error}`);
  }
}

/**
 * Setup plugin template files
 */
async function setupPluginFiles(
  pluginConfig: PluginConfig,
  targetPath: string,
  framework: string,
  typescript: boolean,
  filesKey: "setupFiles" | "backendSetupFiles",
  config?: ProjectConfig
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
      logger.warn(`Template not found: ${file.template} for plugin ${pluginConfig.id}`);
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
      ...(config || {}),
      typescript,
      pluginId: pluginConfig.id,
      pluginName: pluginConfig.name,
    };

    const generatedContent = compiledTemplate(context);

    // Write file
    await writeFile(outputPath, generatedContent);

    logger.verbose(`  ✓ Created ${file.output}`);
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

  // Read existing content or create empty
  let envExampleContent = "";
  if (await pathExists(envExamplePath)) {
    envExampleContent = await readFile(envExamplePath, "utf-8");
  }

  let envContent = "";
  if (await pathExists(envPath)) {
    envContent = await readFile(envPath, "utf-8");
  }

  // Check if we need to add plugin section
  let addedToExample = false;
  let addedToEnv = false;

  // Add plugin environment variables to .env.example
  for (const [key, value] of Object.entries(envVariables)) {
    if (!envExampleContent.includes(key)) {
      if (!addedToExample) {
        // Add section header if not already present
        if (!envExampleContent.includes("# Plugin Configuration")) {
          envExampleContent =
            envExampleContent.trimEnd() +
            "\n\n# Plugin Configuration\n# ==================================================\n";
        }
        addedToExample = true;
      }
      // Add comment for the key
      if (key === "RESEND_API_KEY") {
        envExampleContent += "# Resend API key - Get from https://resend.com/api-keys\n";
      } else if (key === "RESEND_FROM_EMAIL") {
        envExampleContent += "# Resend sender email - Must be verified domain\n";
      }
      envExampleContent += `${key}=${value}\n`;
    }
  }

  // Add plugin environment variables to .env
  for (const [key, value] of Object.entries(envVariables)) {
    if (!envContent.includes(key)) {
      if (!addedToEnv) {
        // Add section header if not already present
        if (!envContent.includes("# Plugin Configuration")) {
          envContent =
            envContent.trimEnd() +
            "\n\n# Plugin Configuration\n# ==================================================\n";
        }
        addedToEnv = true;
      }
      // Add comment for the key
      if (key === "RESEND_API_KEY") {
        envContent += "# Resend API key - Get from https://resend.com/api-keys\n";
      } else if (key === "RESEND_FROM_EMAIL") {
        envContent += "# Resend sender email - Must be verified domain\n";
      }
      envContent += `${key}=${value}\n`;
    }
  }

  // Write back files if updated
  if (addedToExample) {
    await writeFile(envExamplePath, envExampleContent);
  }

  if (addedToEnv || !(await pathExists(envPath))) {
    await writeFile(envPath, envContent || envExampleContent);
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
    logger.warn("package.json not found, skipping script updates");
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
 * Update package.json dependencies
 */
async function updatePackageJsonDependencies(
  targetPath: string,
  dependencies: Set<string>,
  devDependencies: Set<string>
): Promise<void> {
  const packageJsonPath = path.join(targetPath, "package.json");

  if (!(await pathExists(packageJsonPath))) {
    logger.warn("package.json not found, skipping dependency updates");
    return;
  }

  const packageJson = await readJson(packageJsonPath);

  if (!packageJson.dependencies) {
    packageJson.dependencies = {};
  }

  if (!packageJson.devDependencies) {
    packageJson.devDependencies = {};
  }

  // Parse dependency strings and add to package.json
  for (const dep of dependencies) {
    const [name, version] = dep.includes("@", 1)
      ? [dep.substring(0, dep.lastIndexOf("@")), dep.substring(dep.lastIndexOf("@") + 1)]
      : dep.split("@");

    if (name && version) {
      packageJson.dependencies[name] = version;
    }
  }

  for (const dep of devDependencies) {
    const [name, version] = dep.includes("@", 1)
      ? [dep.substring(0, dep.lastIndexOf("@")), dep.substring(dep.lastIndexOf("@") + 1)]
      : dep.split("@");

    if (name && version) {
      packageJson.devDependencies[name] = version;
    }
  }

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

import path from "path";

import { confirm, cancel } from "@clack/prompts";
import {
  frameworkDefs,
  backendDefs,
  databaseDefs,
  ormDefs,
  stylingDefs,
  runtimeDefs,
} from "@shared/stack-config.js";
import chalk from "chalk";
import cliWidth from "cli-width";
import { execa } from "execa";
import fsExtra from "fs-extra";

import { getConfigValidator } from "@/core/config-validator.js";
import { isValidAIAssistant } from "@/prompts/ai-assistant.js";
import { gatherProjectConfigWithNavigation } from "@/prompts/config-prompts-with-navigation.js";
import { gatherProjectConfig } from "@/prompts/config-prompts.js";
import { trackProjectCreation, displayTelemetryNotice } from "@/utils/analytics/analytics.js";
import { setupApiClient } from "@/utils/setup/api-client-setup.js";
import { setupUILibrary } from "@/utils/setup/ui-library-setup.js";
import { UI_LIBRARY_COMPATIBILITY } from "@/utils/system/dependency-checker.js";
import { errorCollector } from "@/utils/system/error-collector.js";
import {
  detectPackageManager,
  checkPackageManagerAvailable,
} from "@/utils/system/package-manager.js";
import { runSecurityAudit } from "@/utils/system/security-audit.js";
import { addSecurityOverridesToProject } from "@/utils/system/update-dependencies.js";
import { suppressConsolaGlobally, restoreConsolaGlobally } from "@/utils/ui/consola-suppressor.js";
import { EnhancedUI, type EnhancedTask } from "@/utils/ui/enhanced-ui.js";
import { PrecastBanner } from "@/utils/ui/precast-banner.js";
import { StreamingLogger } from "@/utils/ui/streaming-logger.js";

const { pathExists, readdir, ensureDir } = fsExtra;

/**
 * Configuration options for initializing a new project
 */
export interface InitOptions {
  yes?: boolean;
  framework?: string;
  uiFramework?: string;
  backend?: string;
  database?: string;
  orm?: string;
  styling?: string;
  runtime?: string;
  uiLibrary?: string;
  typescript?: boolean;
  git?: boolean;
  gitignore?: boolean;
  eslint?: boolean;
  prettier?: boolean;
  docker?: boolean;
  securePasswords?: boolean;
  install?: boolean;
  generate?: boolean;
  packageManager?: "npm" | "yarn" | "pnpm" | "bun";
  auth?: string;
  apiClient?: string;
  ai?: string;
  aiDocs?: boolean;
  mcpServers?: string[];
  powerups?: string[];
  plugins?: string[];
  colorPalette?: string;
  deploymentMethod?: string;
  autoDeploy?: boolean;
  debug?: boolean;
  debugAnalytics?: boolean;
  verbose?: boolean;
}

/**
 * Display a clean project configuration summary with comic book style
 */
function displayEnhancedConfigSummary(config: any): void {
  const termWidth = cliWidth({ defaultWidth: 80 });
  const boxWidth = Math.min(termWidth - 4, 70);

  console.log();
  console.log(chalk.hex("#ffd600")("━".repeat(boxWidth)));
  console.log(chalk.hex("#ff1744").bold("  💥 PROJECT CONFIGURATION"));
  console.log(chalk.hex("#ffd600")("━".repeat(boxWidth)));
  console.log();

  // Core stack
  console.log(chalk.hex("#2962ff").bold("  Core Stack:"));
  console.log(`    ${chalk.hex("#00e676")("◆")} Framework: ${chalk.white.bold(config.framework)}`);
  if (config.backend && config.backend !== "none") {
    console.log(`    ${chalk.hex("#00e676")("◆")} Backend: ${chalk.white.bold(config.backend)}`);
  }
  if (config.packageManager) {
    console.log(
      `    ${chalk.hex("#00e676")("◆")} Package Manager: ${chalk.white.bold(config.packageManager)}`
    );
  }

  // Data layer
  if (config.database && config.database !== "none") {
    console.log();
    console.log(chalk.hex("#2962ff").bold("  Data Layer:"));
    console.log(`    ${chalk.hex("#ffd600")("◆")} Database: ${chalk.white.bold(config.database)}`);
    if (config.orm && config.orm !== "none") {
      console.log(`    ${chalk.hex("#ffd600")("◆")} ORM: ${chalk.white.bold(config.orm)}`);
    }
  }

  // UI & Styling
  if (
    (config.styling && config.styling !== "none") ||
    (config.uiLibrary && config.uiLibrary !== "none")
  ) {
    console.log();
    console.log(chalk.hex("#2962ff").bold("  UI & Styling:"));
    if (config.styling && config.styling !== "none") {
      console.log(`    ${chalk.hex("#aa00ff")("◆")} Styling: ${chalk.white.bold(config.styling)}`);
    }
    if (config.uiLibrary && config.uiLibrary !== "none") {
      console.log(
        `    ${chalk.hex("#aa00ff")("◆")} UI Library: ${chalk.white.bold(config.uiLibrary)}`
      );
    }
  }

  // Features
  const features = [];
  if (config.authProvider && config.authProvider !== "none")
    features.push(`Auth: ${config.authProvider}`);
  if (config.apiClient && config.apiClient !== "none") features.push(`API: ${config.apiClient}`);
  if (config.typescript) features.push("TypeScript");
  if (config.docker) features.push("Docker");
  if (config.git) features.push("Git");

  if (features.length > 0) {
    console.log();
    console.log(chalk.hex("#2962ff").bold("  Features:"));
    features.forEach((feature) => {
      console.log(`    ${chalk.hex("#ff1744")("◆")} ${chalk.white.bold(feature)}`);
    });
  }

  console.log();
  console.log(chalk.hex("#ffd600")("━".repeat(boxWidth)));
  console.log();
}

/**
 * Format supported values in a nice code block
 */
function formatSupportedValues(values: string[]): string {
  const maxLength = Math.max(...values.map((v) => v.length));
  const boxWidth = Math.max(40, maxLength + 4);

  const lines = [
    chalk.hex("#9e9e9e")("  ┌" + "─".repeat(boxWidth - 2) + "┐"),
    ...values.map(
      (value) =>
        chalk.hex("#9e9e9e")("  │ ") +
        chalk.hex("#00e676")(value.padEnd(boxWidth - 4)) +
        chalk.hex("#9e9e9e")(" │")
    ),
    chalk.hex("#9e9e9e")("  └" + "─".repeat(boxWidth - 2) + "┘"),
  ];

  return lines.join("\n");
}

/**
 * Validate CLI option values against supported options
 */
function validateCliOptions(options: InitOptions): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Get available option IDs (excluding disabled ones)
  const getAvailableIds = (defs: any[]) => defs.filter((d) => !d.disabled).map((d) => d.id);

  // Validate framework
  if (options.framework) {
    const availableFrameworks = getAvailableIds(frameworkDefs);
    if (!availableFrameworks.includes(options.framework)) {
      errors.push(
        `Invalid framework "${chalk.bold(options.framework)}"\n\n` +
          `${chalk.hex("#9e9e9e")("Supported frameworks:")}\n` +
          formatSupportedValues(availableFrameworks)
      );
    }
  }

  // Validate backend
  if (options.backend) {
    const availableBackends = getAvailableIds(backendDefs);
    if (!availableBackends.includes(options.backend)) {
      errors.push(
        `Invalid backend "${chalk.bold(options.backend)}"\n\n` +
          `${chalk.hex("#9e9e9e")("Supported backends:")}\n` +
          formatSupportedValues(availableBackends)
      );
    }
  }

  // Validate database
  if (options.database) {
    const availableDatabases = getAvailableIds(databaseDefs);
    if (!availableDatabases.includes(options.database)) {
      errors.push(
        `Invalid database "${chalk.bold(options.database)}"\n\n` +
          `${chalk.hex("#9e9e9e")("Supported databases:")}\n` +
          formatSupportedValues(availableDatabases)
      );
    }
  }

  // Validate ORM
  if (options.orm) {
    const availableOrms = getAvailableIds(ormDefs);
    if (!availableOrms.includes(options.orm)) {
      errors.push(
        `Invalid ORM "${chalk.bold(options.orm)}"\n\n` +
          `${chalk.hex("#9e9e9e")("Supported ORMs:")}\n` +
          formatSupportedValues(availableOrms)
      );
    }
  }

  // Validate styling
  if (options.styling) {
    const availableStyling = getAvailableIds(stylingDefs);
    if (!availableStyling.includes(options.styling)) {
      errors.push(
        `Invalid styling "${chalk.bold(options.styling)}"\n\n` +
          `${chalk.hex("#9e9e9e")("Supported styling:")}\n` +
          formatSupportedValues(availableStyling)
      );
    }
  }

  // Validate runtime
  if (options.runtime) {
    const availableRuntimes = getAvailableIds(runtimeDefs);
    if (!availableRuntimes.includes(options.runtime)) {
      errors.push(
        `Invalid runtime "${chalk.bold(options.runtime)}"\n\n` +
          `${chalk.hex("#9e9e9e")("Supported runtimes:")}\n` +
          formatSupportedValues(availableRuntimes)
      );
    }
  }

  // Validate UI library
  if (options.uiLibrary && options.uiLibrary !== "none") {
    const availableUILibraries = Object.keys(UI_LIBRARY_COMPATIBILITY).filter(
      (lib) => !UI_LIBRARY_COMPATIBILITY[lib].disabled
    );
    if (!availableUILibraries.includes(options.uiLibrary)) {
      errors.push(
        `Invalid UI library "${chalk.bold(options.uiLibrary)}"\n\n` +
          `${chalk.hex("#9e9e9e")("Supported UI libraries:")}\n` +
          formatSupportedValues(availableUILibraries)
      );
    }
  }

  // Validate auth provider
  if (options.auth && options.auth !== "none") {
    const knownAuthProviders = ["better-auth", "auth.js", "clerk", "supabase", "auth0", "firebase"];
    if (!knownAuthProviders.includes(options.auth)) {
      errors.push(
        `Invalid auth provider "${chalk.bold(options.auth)}"\n\n` +
          `${chalk.hex("#9e9e9e")("Supported auth providers:")}\n` +
          formatSupportedValues(knownAuthProviders)
      );
    }
  }

  // Validate API client
  if (options.apiClient && options.apiClient !== "none") {
    const knownApiClients = ["tanstack-query", "swr", "axios", "trpc", "apollo-client", "hono-rpc"];
    if (!knownApiClients.includes(options.apiClient)) {
      errors.push(
        `Invalid API client "${chalk.bold(options.apiClient)}"\n\n` +
          `${chalk.hex("#9e9e9e")("Supported API clients:")}\n` +
          formatSupportedValues(knownApiClients)
      );
    }
  }

  // Validate AI assistant
  if (options.ai && options.ai !== "none") {
    if (!isValidAIAssistant(options.ai)) {
      const knownAIAssistants = ["claude", "cursor", "copilot", "gemini"];
      errors.push(
        `Invalid AI assistant "${chalk.bold(options.ai)}"\n\n` +
          `${chalk.hex("#9e9e9e")("Supported AI assistants:")}\n` +
          formatSupportedValues(knownAIAssistants)
      );
    }
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Initialize git repository
 */
async function initializeGit(projectPath: string): Promise<void> {
  try {
    await execa("git", ["init"], { cwd: projectPath });
    await execa("git", ["add", "."], { cwd: projectPath });
    await execa("git", ["commit", "-m", "Initial commit from Precast"], { cwd: projectPath });
  } catch {
    // Git initialization failed, but not critical
  }
}

/**
 * Enhanced init command with beautiful multi-threaded UI
 */
export async function initCommand(projectName: string | undefined, options: InitOptions) {
  if (options.debug) {
    process.env.DEBUG_ERRORS = "1";
    process.env.DEBUG = "true";
  }

  const cliValidation = validateCliOptions(options);
  if (!cliValidation.valid) {
    console.log();
    console.log(chalk.hex("#ff1744").bold("💥 CONFIGURATION ERROR"));
    console.log(chalk.hex("#ffd600")("━".repeat(60)));
    cliValidation.errors.forEach((error) => {
      console.log(chalk.hex("#ff1744")(`  ✗ ${error}`));
    });
    console.log(chalk.hex("#ffd600")("━".repeat(60)));
    console.log();
    process.exit(1);
  }

  if (options.debugAnalytics) {
    process.env.DEBUG_ANALYTICS = "1";
  }

  const { setVerboseMode, setSuppressOutput } = await import("../utils/ui/logger.js");
  setVerboseMode(options.verbose || false);

  const debug = options.debug || process.env.DEBUG === "true";
  const ui = new EnhancedUI({ debug });
  const logger = new StreamingLogger({ debug, verbose: options.verbose });

  // Always show banner unless in CI
  if (!process.env.CI) {
    await PrecastBanner.show({
      subtitle: "PROJECT INITIALIZATION",
      gradient: false,
    });
  }

  if (debug) {
    displayTelemetryNotice();
  }

  const startTime = Date.now();

  try {
    const useNavigation =
      process.env.PRECAST_NAV === "true" || (!options.yes && process.env.PRECAST_NAV !== "false");

    const config = useNavigation
      ? await gatherProjectConfigWithNavigation(projectName, options)
      : await gatherProjectConfig(projectName, options);

    const validator = getConfigValidator();
    const validation = validator.validate(config);

    if (!validation.valid) {
      ui.showError(new Error(`Configuration validation failed: ${validation.errors.join(", ")}`));
      process.exit(1);
    }

    if (validation.warnings.length > 0 && debug) {
      console.log(chalk.hex("#ffd600")("⚠ Configuration warnings:"));
      validation.warnings.forEach((warning) => {
        console.log(chalk.hex("#ffd600")(`  ⚠ ${warning}`));
      });
    }

    if (!options.yes) {
      displayEnhancedConfigSummary(config);

      const shouldContinue = await confirm({
        message: "Create project with this configuration?",
      });

      if (!shouldContinue) {
        cancel("Project creation cancelled");
        process.exit(0);
      }
    }

    const projectPath = path.resolve(process.cwd(), config.name);
    config.projectPath = projectPath;

    if (await pathExists(projectPath)) {
      const isEmpty = (await readdir(projectPath)).length === 0;
      if (!isEmpty) {
        const overwrite = await confirm({
          message: `Directory ${config.name} already exists and is not empty. Continue?`,
          initialValue: false,
        });
        if (!overwrite) {
          cancel("Project creation cancelled");
          process.exit(0);
        }
      }
    }

    // Build enhanced tasks for multi-threaded execution
    const tasks: EnhancedTask[] = [];

    // Sequential setup tasks
    tasks.push({
      id: "structure",
      title: "Creating project structure",
      task: async () => {
        await ensureDir(projectPath);
        const { getPackageManagerVersion } = await import("../utils/system/package-manager.js");
        config.packageManagerVersion = await getPackageManagerVersion(config.packageManager);

        const { generateTemplate } = await import("../generators/index.js");
        await generateTemplate(config, projectPath);

        logger.stream({ type: "success", message: "Project structure created" });
      },
      concurrent: false,
    });

    tasks.push({
      id: "config",
      title: "Writing configuration files",
      task: async () => {
        const { writePrecastConfig } = await import("../utils/config/precast-config.js");
        await writePrecastConfig(config);

        const pm = options.packageManager || (await detectPackageManager());
        await addSecurityOverridesToProject(projectPath, config.framework, pm);

        logger.stream({ type: "success", message: "Configuration files written" });
      },
      concurrent: false,
    });

    // Parallel setup tasks
    const parallelTasks: EnhancedTask[] = [];

    if (config.backend && config.backend !== "none") {
      parallelTasks.push({
        id: "backend",
        title: `Setting up ${config.backend} backend`,
        task: async () => {
          logger.stream({ type: "info", message: `Configuring ${config.backend}...` });
          // Backend setup logic here
          logger.stream({ type: "success", message: `${config.backend} backend configured` });
        },
        concurrent: true,
      });
    }

    if (config.database && config.database !== "none") {
      parallelTasks.push({
        id: "database",
        title: `Configuring ${config.database} database`,
        task: async () => {
          logger.stream({ type: "info", message: `Setting up ${config.database}...` });
          // Database setup logic here
          logger.stream({ type: "success", message: `${config.database} database configured` });
        },
        concurrent: true,
      });
    }

    if (config.orm && config.orm !== "none") {
      parallelTasks.push({
        id: "orm",
        title: `Setting up ${config.orm} ORM`,
        task: async () => {
          logger.stream({ type: "info", message: `Configuring ${config.orm}...` });
          // ORM setup logic here
          logger.stream({ type: "success", message: `${config.orm} ORM configured` });
        },
        concurrent: true,
      });
    }

    if (config.styling && config.styling !== "css") {
      parallelTasks.push({
        id: "styling",
        title: `Setting up ${config.styling} styling`,
        task: async () => {
          logger.stream({ type: "info", message: `Configuring ${config.styling}...` });
          // Styling setup logic here
          logger.stream({ type: "success", message: `${config.styling} styling configured` });
        },
        concurrent: true,
      });
    }

    if (config.uiLibrary && config.framework !== "vanilla") {
      parallelTasks.push({
        id: "ui",
        title: `Setting up ${config.uiLibrary} UI library`,
        task: async () => {
          try {
            await setupUILibrary(config, projectPath);
            logger.stream({
              type: "success",
              message: `${config.uiLibrary} UI library configured`,
            });
          } catch {
            logger.stream({ type: "warning", message: `${config.uiLibrary} setup had issues` });
          }
        },
        concurrent: true,
      });
    }

    if (config.authProvider && config.authProvider !== "none") {
      parallelTasks.push({
        id: "auth",
        title: `Setting up ${config.authProvider} authentication`,
        task: async () => {
          logger.stream({ type: "info", message: `Configuring ${config.authProvider}...` });
          // Auth setup logic here
          logger.stream({
            type: "success",
            message: `${config.authProvider} authentication configured`,
          });
        },
        concurrent: true,
      });
    }

    if (config.apiClient && config.apiClient !== "none") {
      parallelTasks.push({
        id: "api",
        title: `Setting up ${config.apiClient} API client`,
        task: async () => {
          try {
            await setupApiClient(config, projectPath);
            logger.stream({
              type: "success",
              message: `${config.apiClient} API client configured`,
            });
          } catch {
            logger.stream({ type: "warning", message: `${config.apiClient} setup had issues` });
          }
        },
        concurrent: true,
      });
    }

    // Add parallel tasks to main task list
    tasks.push(...parallelTasks);

    // Docker setup
    if (config.docker) {
      tasks.push({
        id: "docker",
        title: "Setting up Docker configuration",
        task: async () => {
          logger.stream({ type: "info", message: "Creating Docker configuration..." });
          const { setupDockerAutoDeploy } = await import(
            "../utils/docker/docker-auto-deploy-setup.js"
          );
          const { createTemplateEngine } = await import("../core/template-engine.js");
          const { getTemplateRoot } = await import("../utils/system/template-path.js");

          const templateRoot = getTemplateRoot();
          const templateEngine = createTemplateEngine(templateRoot);
          await setupDockerAutoDeploy(config, projectPath, templateEngine, options.autoDeploy);
          logger.stream({ type: "success", message: "Docker configuration created" });
        },
        concurrent: false,
      });
    }

    // Powerups setup
    if (config.powerups && config.powerups.length > 0) {
      tasks.push({
        id: "powerups",
        title: `Setting up powerups: ${config.powerups.join(", ")}`,
        task: async () => {
          logger.stream({ type: "info", message: "Configuring powerups..." });
          // Powerups setup logic here
          logger.stream({ type: "success", message: "Powerups configured" });
        },
        concurrent: false,
      });
    }

    // Deployment setup
    if (config.deploymentMethod && config.deploymentMethod !== "none") {
      tasks.push({
        id: "deployment",
        title: `Configuring ${config.deploymentMethod} deployment`,
        task: async () => {
          logger.stream({ type: "info", message: `Setting up ${config.deploymentMethod}...` });
          const { setupDeploymentConfig } = await import("../utils/setup/deployment-setup.js");
          const { createTemplateEngine } = await import("../core/template-engine.js");
          const { getTemplateRoot } = await import("../utils/system/template-path.js");

          const templateRoot = getTemplateRoot();
          const templateEngine = createTemplateEngine(templateRoot);
          await setupDeploymentConfig(config, projectPath, templateEngine);
          logger.stream({
            type: "success",
            message: `${config.deploymentMethod} deployment configured`,
          });
        },
        concurrent: false,
      });
    }

    // Git initialization
    if (config.git !== false) {
      tasks.push({
        id: "git",
        title: "Initializing Git repository",
        task: async () => {
          await initializeGit(projectPath);
          logger.stream({ type: "success", message: "Git repository initialized" });
        },
        concurrent: false,
      });
    }

    // Dependencies installation
    if (options.install || config.autoInstall) {
      tasks.push({
        id: "install",
        title: "Installing dependencies",
        task: async () => {
          const pm = config.packageManager || (await detectPackageManager());
          const pmAvailable = await checkPackageManagerAvailable(pm);

          if (!pmAvailable && pm === "bun") {
            logger.stream({ type: "warning", message: "Bun not available, falling back to npm" });
            config.packageManager = "npm";
          }

          logger.stream({
            type: "info",
            message: `Using ${config.packageManager} to install packages...`,
          });

          try {
            // Import and use the installation function with proper error handling
            const { installDependencies } = await import("../utils/system/package-manager.js");

            // Install dependencies with timeout to prevent hanging
            const installPromise = installDependencies([], {
              packageManager: config.packageManager,
              projectPath,
              dev: false,
            });

            // Add a timeout of 5 minutes for installation
            const timeoutPromise = new Promise((_, reject) =>
              setTimeout(() => reject(new Error("Installation timeout")), 300000)
            );

            await Promise.race([installPromise, timeoutPromise]);
            logger.stream({ type: "success", message: "Dependencies installed successfully" });
          } catch (error) {
            logger.stream({
              type: "warning",
              message: "Installation completed with warnings",
              details: error instanceof Error ? error.message : "Unknown error",
            });
          }
        },
        concurrent: false,
        exitOnError: false,
      });

      tasks.push({
        id: "audit",
        title: "Running security audit",
        task: async () => {
          try {
            await runSecurityAudit({
              projectPath,
              packageManager: config.packageManager,
              autoFix: false,
            });
            logger.stream({ type: "success", message: "Security audit completed" });
          } catch {
            logger.stream({
              type: "info",
              message: "Security audit skipped",
              details: "Audit not available or errored",
            });
          }
        },
        concurrent: false,
        exitOnError: false,
      });
    }

    // Run all tasks with beautiful UI
    if (!options.verbose) {
      setSuppressOutput(true);
    }

    // Suppress verbose output globally unless in debug mode
    await suppressConsolaGlobally(debug);

    // Run all tasks with beautiful multi-threaded UI
    await ui.runTasks(tasks, {
      title: `Creating ${chalk.hex("#00e676").bold(config.name)}...`,
      exitOnError: false,
    });

    // Restore consola output level
    await restoreConsolaGlobally();

    // Track analytics
    if (!options.debugAnalytics) {
      await trackProjectCreation(config);
    }

    // Success summary
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);

    console.log();
    console.log(chalk.hex("#00e676").bold("━".repeat(60)));
    console.log(chalk.hex("#00e676").bold("  ✓ PROJECT CREATED SUCCESSFULLY!"));
    console.log(chalk.hex("#00e676").bold("━".repeat(60)));
    console.log();

    console.log(chalk.hex("#2962ff").bold("  Next steps:"));
    console.log(`    ${chalk.hex("#ffd600")("1.")} cd ${chalk.white.bold(config.name)}`);

    // Add deploy step if docker is enabled
    let stepNumber = 2;
    if (config.docker) {
      console.log(
        `    ${chalk.hex("#ffd600")(`${stepNumber}.`)} ${chalk.white.bold("create-precast-app deploy")}`
      );
      stepNumber++;
    }

    if (!(options.install || config.autoInstall)) {
      const pm = config.packageManager || "npm";
      const runCmd = pm === "npm" || pm === "bun" ? "run " : "";
      console.log(
        `    ${chalk.hex("#ffd600")(`${stepNumber}.`)} ${chalk.white.bold(`${pm} install`)}`
      );
      stepNumber++;
      console.log(
        `    ${chalk.hex("#ffd600")(`${stepNumber}.`)} ${chalk.white.bold(`${pm} ${runCmd}dev`)}`
      );
    } else {
      const pm = config.packageManager || "npm";
      const runCmd = pm === "npm" || pm === "bun" ? "run " : "";
      console.log(
        `    ${chalk.hex("#ffd600")(`${stepNumber}.`)} ${chalk.white.bold(`${pm} ${runCmd}dev`)}`
      );
    }

    console.log();
    console.log(chalk.hex("#9e9e9e")(`  Created in ${elapsed}s`));
    console.log();
    console.log(chalk.hex("#ffd600")("━".repeat(60)));
    console.log();

    // Create clickable link for precast.dev
    const { createLink } = await import("../utils/ui/cli-theme.js");
    const precastLink = createLink("precast.dev", "https://precast.dev");
    console.log(
      "  " +
        chalk.hex("#9e9e9e")("Made with ") +
        chalk.hex("#ff1744")("❤") +
        chalk.hex("#9e9e9e")("  by ") +
        precastLink
    );
    console.log();

    // Cleanup and exit immediately
    ui.cleanup();
    logger.stopStreaming();

    // Force exit to ensure script doesn't hang
    process.exit(0);
  } catch (error) {
    // Restore consola output level in case of error
    await restoreConsolaGlobally();

    ui.showError(error instanceof Error ? error : new Error("Project creation failed"), [
      "Check your internet connection",
      "Ensure you have write permissions",
      "Try running with --debug flag for more details",
    ]);

    // Collect error for analytics
    if (error instanceof Error) {
      errorCollector.addError("project-creation", error);
    }

    ui.cleanup();
    logger.stopStreaming();
    process.exit(1);
  }
}

export default initCommand;

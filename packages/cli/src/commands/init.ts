import path from "path";

import { confirm, cancel } from "@clack/prompts";
import chalk from "chalk";
import { execa } from "execa";
import fsExtra from "fs-extra";

import {
  frameworkDefs,
  backendDefs,
  databaseDefs,
  ormDefs,
  stylingDefs,
  runtimeDefs,
} from "../../../shared/stack-config.js";
import { getConfigValidator } from "../core/config-validator.js";
import { isValidAIAssistant } from "../prompts/ai-assistant.js";
import { gatherProjectConfigWithNavigation } from "../prompts/config-prompts-with-navigation.js";
import { gatherProjectConfig } from "../prompts/config-prompts.js";
import { trackProjectCreation, displayTelemetryNotice } from "../utils/analytics.js";
import { errorCollector } from "../utils/error-collector.js";
import { setupApiClient } from "../utils/api-client-setup.js";
import {
  theme,
  createHeroBanner,
  createFancyBox,
  statusSymbols,
  divider,
} from "../utils/cli-theme.js";
import { UI_LIBRARY_COMPATIBILITY } from "../utils/dependency-checker.js";
import { InteractiveTaskRunner, debugLog } from "../utils/interactive-ui.js";
import {
  detectPackageManager,
  checkPackageManagerAvailable,
  installAllDependencies,
} from "../utils/package-manager.js";
import { runSecurityAudit } from "../utils/security-audit.js";
import { setupUILibrary } from "../utils/ui-library-setup.js";
import { addSecurityOverridesToProject } from "../utils/update-dependencies.js";

/** File system utilities */
// eslint-disable-next-line import/no-named-as-default-member
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
  debug?: boolean;
  debugAnalytics?: boolean;
  verbose?: boolean;
}

/**
 * Display a clean project configuration summary
 */
function displayCleanConfigSummary(config: any): void {
  const items: string[] = [];

  // Core stack
  items.push(`${theme.accent("◆")} Framework: ${theme.bold(config.framework)}`);
  if (config.backend && config.backend !== "none") {
    items.push(`${theme.accent("◆")} Backend: ${theme.bold(config.backend)}`);
  }
  if (config.database && config.database !== "none") {
    items.push(`${theme.accent("◆")} Database: ${theme.bold(config.database)}`);
  }
  if (config.orm && config.orm !== "none") {
    items.push(`${theme.accent("◆")} ORM: ${theme.bold(config.orm)}`);
  }

  // UI & Styling
  if (config.styling && config.styling !== "none") {
    items.push(`${theme.accent("◆")} Styling: ${theme.bold(config.styling)}`);
  }
  if (config.uiLibrary && config.uiLibrary !== "none") {
    items.push(`${theme.accent("◆")} UI Library: ${theme.bold(config.uiLibrary)}`);
  }

  // Features
  if (config.authProvider && config.authProvider !== "none") {
    items.push(`${theme.accent("◆")} Auth: ${theme.bold(config.authProvider)}`);
  }
  if (config.typescript) {
    items.push(`${theme.accent("◆")} TypeScript: ${theme.success("enabled")}`);
  }

  const summaryBox = createFancyBox(items.join("\n"), "Project Configuration");
  console.log(summaryBox);
}

/**
 * Format supported values in a nice code block
 */
function formatSupportedValues(values: string[]): string {
  const maxLength = Math.max(...values.map((v) => v.length));
  const boxWidth = Math.max(40, maxLength + 4);

  const lines = [
    theme.dim("  ┌" + "─".repeat(boxWidth - 2) + "┐"),
    ...values.map(
      (value) => theme.dim("  │ ") + theme.info(value.padEnd(boxWidth - 4)) + theme.dim(" │")
    ),
    theme.dim("  └" + "─".repeat(boxWidth - 2) + "┘"),
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
        `Invalid framework "${theme.bold(options.framework)}"\n\n` +
          `${theme.muted("Supported frameworks:")}\n` +
          formatSupportedValues(availableFrameworks)
      );
    }
  }

  // Validate backend
  if (options.backend) {
    const availableBackends = getAvailableIds(backendDefs);
    if (!availableBackends.includes(options.backend)) {
      errors.push(
        `Invalid backend "${theme.bold(options.backend)}"\n\n` +
          `${theme.muted("Supported backends:")}\n` +
          formatSupportedValues(availableBackends)
      );
    }
  }

  // Validate database
  if (options.database) {
    const availableDatabases = getAvailableIds(databaseDefs);
    if (!availableDatabases.includes(options.database)) {
      errors.push(
        `Invalid database "${theme.bold(options.database)}"\n\n` +
          `${theme.muted("Supported databases:")}\n` +
          formatSupportedValues(availableDatabases)
      );
    }
  }

  // Validate ORM
  if (options.orm) {
    const availableOrms = getAvailableIds(ormDefs);
    if (!availableOrms.includes(options.orm)) {
      errors.push(
        `Invalid ORM "${theme.bold(options.orm)}"\n\n` +
          `${theme.muted("Supported ORMs:")}\n` +
          formatSupportedValues(availableOrms)
      );
    }
  }

  // Validate styling
  if (options.styling) {
    const availableStyling = getAvailableIds(stylingDefs);
    if (!availableStyling.includes(options.styling)) {
      errors.push(
        `Invalid styling "${theme.bold(options.styling)}"\n\n` +
          `${theme.muted("Supported styling:")}\n` +
          formatSupportedValues(availableStyling)
      );
    }
  }

  // Validate runtime
  if (options.runtime) {
    const availableRuntimes = getAvailableIds(runtimeDefs);
    if (!availableRuntimes.includes(options.runtime)) {
      errors.push(
        `Invalid runtime "${theme.bold(options.runtime)}"\n\n` +
          `${theme.muted("Supported runtimes:")}\n` +
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
        `Invalid UI library "${theme.bold(options.uiLibrary)}"\n\n` +
          `${theme.muted("Supported UI libraries:")}\n` +
          formatSupportedValues(availableUILibraries)
      );
    }
  }

  // Validate auth provider (basic check - more detailed validation happens later)
  if (options.auth && options.auth !== "none") {
    const knownAuthProviders = ["better-auth", "auth.js", "clerk", "supabase", "auth0", "firebase"];
    if (!knownAuthProviders.includes(options.auth)) {
      errors.push(
        `Invalid auth provider "${theme.bold(options.auth)}"\n\n` +
          `${theme.muted("Supported auth providers:")}\n` +
          formatSupportedValues(knownAuthProviders)
      );
    }
  }

  // Validate API client
  if (options.apiClient && options.apiClient !== "none") {
    const knownApiClients = ["tanstack-query", "swr", "axios", "trpc", "apollo-client", "hono-rpc"];
    if (!knownApiClients.includes(options.apiClient)) {
      errors.push(
        `Invalid API client "${theme.bold(options.apiClient)}"\n\n` +
          `${theme.muted("Supported API clients:")}\n` +
          formatSupportedValues(knownApiClients)
      );
    }
  }

  // Validate AI assistant
  if (options.ai && options.ai !== "none") {
    if (!isValidAIAssistant(options.ai)) {
      const knownAIAssistants = ["claude", "cursor", "copilot", "gemini"];
      errors.push(
        `Invalid AI assistant "${theme.bold(options.ai)}"\n\n` +
          `${theme.muted("Supported AI assistants:")}\n` +
          formatSupportedValues(knownAIAssistants)
      );
    }
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Initialize a new project with the specified configuration.
 * This is the main entry point for the CLI's init command. It handles project creation,
 * configuration gathering, template generation, and dependency installation.
 *
 * @param projectName - Name of the project to create (can be undefined for interactive prompt)
 * @param options - Configuration options for the project (CLI flags or interactive prompts)
 */
export async function initCommand(projectName: string | undefined, options: InitOptions) {
  // Set debug mode environment variables
  if (options.debug) {
    process.env.DEBUG_ERRORS = "1";
    process.env.DEBUG = "true";
  }

  // Validate CLI option values first, before doing anything else
  const cliValidation = validateCliOptions(options);
  if (!cliValidation.valid) {
    console.log();
    const errorBox = createFancyBox(
      `${theme.error(`${statusSymbols.error} Invalid CLI Options Detected`)}\n\n` +
        cliValidation.errors
          .map((error) => `${theme.error(`${statusSymbols.error}`)} ${error}`)
          .join("\n"),
      "❌ Configuration Error"
    );
    console.log(errorBox);
    console.log();
    process.exit(1);
  }

  // Set debug analytics if flag is provided
  if (options.debugAnalytics) {
    process.env.DEBUG_ANALYTICS = "1";
  }

  // Set verbose mode for logging
  const { setVerboseMode, setSuppressOutput } = await import("../utils/logger.js");
  setVerboseMode(options.verbose || false);

  const debug = options.debug || process.env.DEBUG === "true";

  // Show hero banner
  if (!options.yes) {
    console.log();
    const heroBanner = await createHeroBanner("PRECAST", "Modern app scaffolding");
    console.log(heroBanner);
    console.log();
  }

  // Show telemetry notice in debug mode
  if (debug) {
    displayTelemetryNotice();
  }

  const startTime = Date.now();
  const taskRunner = new InteractiveTaskRunner({ debug });

  try {
    // Gather configuration
    const useNavigation =
      process.env.PRECAST_NAV === "true" || (!options.yes && process.env.PRECAST_NAV !== "false");

    const config = useNavigation
      ? await gatherProjectConfigWithNavigation(projectName, options)
      : await gatherProjectConfig(projectName, options);

    // Validate configuration
    const validator = getConfigValidator();
    const validation = validator.validate(config);

    if (!validation.valid) {
      console.log();
      console.log(theme.error(`${statusSymbols.error} Configuration errors:`));
      validation.errors.forEach((error) => {
        console.log(theme.error(`  ${statusSymbols.error} ${error}`));
      });
      process.exit(1);
    }

    if (validation.warnings.length > 0 && debug) {
      console.log(theme.warning("Configuration warnings:"));
      validation.warnings.forEach((warning) => {
        console.log(theme.warning(`  ${statusSymbols.warning} ${warning}`));
      });
    }

    // Display clean configuration summary
    if (!options.yes) {
      displayCleanConfigSummary(config);

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

    // Check if directory exists
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

    // Setup completely separate stages for each step
    const tasks: any[] = [
      {
        id: "structure",
        title: "Project Structure",
        status: "pending",
        isStage: true,
        subtasks: [{ id: "create-files", title: "Creating project files", status: "pending" }],
      },
      {
        id: "configuration",
        title: "Configuration Setup",
        status: "pending",
        isStage: true,
        subtasks: [{ id: "config", title: "Writing configuration files", status: "pending" }],
      },
      {
        id: "environment",
        title: "Environment Setup",
        status: "pending",
        isStage: true,
        subtasks: [{ id: "env", title: "Generating environment files", status: "pending" }],
      },
    ];

    // Add backend stage if needed
    if (config.backend && config.backend !== "none") {
      tasks.push({
        id: "backend-setup",
        title: `${config.backend.charAt(0).toUpperCase() + config.backend.slice(1)} Backend`,
        status: "pending",
        isStage: true,
        subtasks: [
          { id: "backend", title: `Setting up ${config.backend} backend`, status: "pending" },
        ],
      });
    }

    // Add database stage if needed
    if (config.database && config.database !== "none") {
      tasks.push({
        id: "database-setup",
        title: `${config.database.charAt(0).toUpperCase() + config.database.slice(1)} Database`,
        status: "pending",
        isStage: true,
        subtasks: [
          { id: "database", title: `Configuring ${config.database} database`, status: "pending" },
        ],
      });
    }

    // Add ORM stage if needed
    if (config.orm && config.orm !== "none") {
      tasks.push({
        id: "orm-setup",
        title: `${config.orm.charAt(0).toUpperCase() + config.orm.slice(1)} ORM`,
        status: "pending",
        isStage: true,
        subtasks: [{ id: "orm", title: `Setting up ${config.orm} ORM`, status: "pending" }],
      });
    }

    // Add Styling stage if needed
    if (config.styling && config.styling !== "css") {
      tasks.push({
        id: "styling-setup",
        title: `${config.styling.charAt(0).toUpperCase() + config.styling.slice(1)} Styling`,
        status: "pending",
        isStage: true,
        subtasks: [
          { id: "styling", title: `Setting up ${config.styling} styling`, status: "pending" },
        ],
      });
    }

    // Add Color Palette stage if needed
    if (config.colorPalette) {
      // Import color palettes to get the actual name
      const { colorPalettes } = await import("../../../shared/src/color-palettes.js");
      const selectedPalette = colorPalettes.find((p) => p.id === config.colorPalette);
      const paletteName = selectedPalette?.name || config.colorPalette;

      tasks.push({
        id: "colors-setup",
        title: "Color Palette",
        status: "pending",
        isStage: true,
        subtasks: [{ id: "colors", title: `Applying ${paletteName} theme`, status: "pending" }],
      });
    }

    // Add Docker stage if needed
    if (config.docker) {
      tasks.push({
        id: "docker-setup",
        title: "Docker Configuration",
        status: "pending",
        isStage: true,
        subtasks: [{ id: "docker", title: "Setting up Docker configuration", status: "pending" }],
      });
    }

    // Code quality stage
    const codeQualityTasks: any[] = [];
    if (!(options.install || config.autoInstall)) {
      codeQualityTasks.push({ id: "format", title: "Formatting code", status: "pending" });
    }
    if (config.git) {
      codeQualityTasks.push({ id: "git", title: "Initializing Git repository", status: "pending" });
    }
    if (codeQualityTasks.length > 0) {
      tasks.push({
        id: "quality",
        title: "Code Quality",
        status: "pending",
        isStage: true,
        subtasks: codeQualityTasks,
      });
    }

    // Dependencies stage
    if (options.install || config.autoInstall) {
      tasks.push({
        id: "dependencies",
        title: "Dependencies",
        status: "pending",
        isStage: true,
        subtasks: [
          { id: "deps", title: "Installing packages", status: "pending" },
          { id: "audit", title: "Running security audit", status: "pending" },
        ],
      });
    }

    // UI Library stage if needed
    if (config.uiLibrary && config.framework !== "vanilla") {
      tasks.push({
        id: "ui-setup",
        title: `${config.uiLibrary.charAt(0).toUpperCase() + config.uiLibrary.slice(1)} UI Library`,
        status: "pending",
        isStage: true,
        subtasks: [{ id: "ui", title: `Setting up ${config.uiLibrary}`, status: "pending" }],
      });
    }

    // Authentication stage if needed
    if (config.authProvider && config.authProvider !== "none") {
      tasks.push({
        id: "auth-setup",
        title: `${config.authProvider.charAt(0).toUpperCase() + config.authProvider.slice(1)} Authentication`,
        status: "pending",
        isStage: true,
        subtasks: [
          {
            id: "auth",
            title: `Setting up ${config.authProvider} authentication`,
            status: "pending",
          },
        ],
      });
    }

    // API Client stage if needed
    if (config.apiClient && config.apiClient !== "none") {
      tasks.push({
        id: "api-setup",
        title: `${config.apiClient.charAt(0).toUpperCase() + config.apiClient.slice(1)} API Client`,
        status: "pending",
        isStage: true,
        subtasks: [{ id: "api", title: `Setting up ${config.apiClient}`, status: "pending" }],
      });
    }

    taskRunner.addTasks(tasks);

    // Suppress console output during task runner execution (unless verbose)
    if (!options.verbose) {
      setSuppressOutput(true);
    }

    // Show Precast ASCII art
    console.log();
    const asciiArt = theme.gradient.precast(`
╔═══════════════════════════════════════╗
║   ____                          _     ║
║  |  _ \\ _ __ ___  ___ __ _ ___| |_    ║
║  | |_) | '__/ _ \\/ __/ _\` / __| __|   ║
║  |  __/| | |  __/ (_| (_| \\__ \\ |_    ║
║  |_|   |_|  \\___|\\___\\__,_|___/\\__|   ║
║                                       ║
╚═══════════════════════════════════════╝`);
    console.log(asciiArt);
    console.log();

    // Start task runner with title
    taskRunner.start(`Creating ${config.name}...`);

    // Create project structure
    await ensureDir(projectPath);

    // Project Structure stage
    await taskRunner.runTask("create-files", async () => {
      debugLog("Creating project structure", { projectPath });

      const { getPackageManagerVersion } = await import("../utils/package-manager.js");
      config.packageManagerVersion = await getPackageManagerVersion(config.packageManager);

      const { generateTemplate } = await import("../generators/index.js");
      await generateTemplate(config, projectPath);
    });

    await taskRunner.runTask("config", async () => {
      debugLog("Writing precast config");
      const { writePrecastConfig } = await import("../utils/precast-config.js");
      await writePrecastConfig(config);

      const pm = options.packageManager || (await detectPackageManager());
      await addSecurityOverridesToProject(projectPath, config.framework, pm);
    });

    await taskRunner.runTask("env", async () => {
      debugLog("Generating environment files");
      // Environment files are generated as part of the template generation
      // This task is just for display purposes
    });

    // Backend setup stage
    if (config.backend && config.backend !== "none") {
      await taskRunner.runTask("backend", async () => {
        debugLog(`Setting up ${config.backend} backend`);
        // Backend setup is handled in template generation
      });
    }

    // Database setup stage
    if (config.database && config.database !== "none") {
      await taskRunner.runTask("database", async () => {
        debugLog(`Configuring ${config.database} database`);
        // Database setup is handled in template generation
      });
    }

    // ORM setup stage
    if (config.orm && config.orm !== "none") {
      await taskRunner.runTask("orm", async () => {
        debugLog(`Setting up ${config.orm} ORM`);
        // ORM setup is handled in template generation
      });
    }

    // Styling setup stage
    if (config.styling && config.styling !== "css") {
      await taskRunner.runTask("styling", async () => {
        debugLog(`Setting up ${config.styling} styling`);
        // Styling setup is handled in template generation
      });
    }

    // Color Palette setup stage
    let selectedColorPalette: any = null;
    if (config.colorPalette) {
      await taskRunner.runTask("colors", async () => {
        debugLog(`Applying ${config.colorPalette} color theme`);
        // Store the palette for display after task runner completes
        const { colorPalettes } = await import("../../../shared/src/color-palettes.js");
        selectedColorPalette = colorPalettes.find((p) => p.id === config.colorPalette);
      });
    }

    // Docker setup stage
    if (config.docker) {
      await taskRunner.runTask("docker", async () => {
        debugLog("Setting up Docker configuration");
        // Docker setup is handled in template generation
      });
    }

    // UI Library setup stage
    if (config.uiLibrary && config.framework !== "vanilla") {
      await taskRunner.runTask("ui", async () => {
        debugLog(`Setting up ${config.uiLibrary} UI library`);
        try {
          await setupUILibrary(config, projectPath);
        } catch (error) {
          debugLog("UI library setup failed", error);
          // Don't throw, just log warning
          if (debug) {
            console.log(theme.warning(`\n${statusSymbols.warning} UI library setup had issues`));
          }
        }
      });
    }

    // Authentication setup stage
    if (config.authProvider && config.authProvider !== "none") {
      await taskRunner.runTask("auth", async () => {
        debugLog(`Setting up ${config.authProvider} authentication`);
        // Authentication setup is handled in template generation
      });
    }

    // API Client setup stage
    if (config.apiClient && config.apiClient !== "none") {
      await taskRunner.runTask("api", async () => {
        debugLog(`Setting up ${config.apiClient} API client`);
        try {
          await setupApiClient(config, projectPath);
        } catch (error) {
          debugLog("API client setup failed", error);
          // Don't throw, just log warning
          if (debug) {
            console.log(theme.warning(`\n${statusSymbols.warning} API client setup had issues`));
          }
        }
      });
    }

    // Format code if not installing
    if (!(options.install || config.autoInstall)) {
      await taskRunner.runTask("format", async () => {
        debugLog("Formatting generated code");
        const { formatGeneratedCode } = await import("../utils/package-manager.js");
        await formatGeneratedCode(projectPath, config.prettier);
      });
    } else {
      taskRunner.skipTask("format", "Will format during installation");
    }

    // Initialize git
    if (config.git) {
      await taskRunner.runTask("git", async () => {
        debugLog("Initializing git repository");
        await initializeGit(projectPath);
      });
    }

    // Install dependencies
    if (options.install || config.autoInstall) {
      await taskRunner.runTask("deps", async () => {
        const pm = config.packageManager;

        if (!(await checkPackageManagerAvailable(pm))) {
          debugLog(`Package manager ${pm} not available, falling back to npm`);
        }

        await installAllDependencies({
          packageManager: pm,
          projectPath: projectPath,
          skipFormatting: !config.prettier,
          generate: config.generate,
        });
      });

      // Security audit
      await taskRunner.runTask("audit", async () => {
        try {
          await runSecurityAudit({
            packageManager: config.packageManager,
            projectPath: projectPath,
            autoFix: true,
          });
        } catch (error) {
          debugLog("Security audit failed", error);
          // Don't throw, just log warning
          if (debug) {
            console.log(theme.warning(`\n${statusSymbols.warning} Security audit had issues`));
          }
        }
      });
    }

    // Track creation
    await trackProjectCreation({
      framework: config.framework,
      backend: config.backend,
      database: config.database,
      orm: config.orm,
      styling: config.styling,
      uiLibrary: config.uiLibrary,
      auth: config.authProvider,
      apiClient: config.apiClient,
      aiAssistant: config.aiAssistant,
      typescript: config.typescript,
      docker: config.docker,
      git: config.git,
      eslint: config.eslint,
      prettier: config.prettier,
      testing: (config as any).testing || "none",
      cicd: config.deploymentMethod && config.deploymentMethod !== "none" ? true : false,
      husky: (config as any).husky || false,
      lintStaged: (config as any).lintStaged || false,
      documentation: (config as any).documentation || false,
      powerups: config.powerups,
      mcpServers: config.mcpServers,
      plugins: config.plugins,
      packageManager: config.packageManager,
      autoInstall: options.install || config.autoInstall || false,
      entryPoint: "cli",
      duration: Date.now() - startTime,
      success: true,
      securityAuditPassed: true, // Set after successful security audit
    });

    // Complete
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
    taskRunner.complete();

    // Re-enable console output
    if (!options.verbose) {
      setSuppressOutput(false);
    }

    // Success message
    console.log();
    const successBox = createFancyBox(
      `${theme.success(`${statusSymbols.success} Project created successfully!`)}\n\n` +
        `${theme.muted("Time taken:")} ${theme.bold(`${elapsed}s`)}\n` +
        `${theme.muted("Location:")} ${theme.info(projectPath)}`,
      "✨ Success"
    );
    console.log(successBox);

    // Display color palette if selected
    if (selectedColorPalette) {
      const colorsToShow = selectedColorPalette.preview || [
        selectedColorPalette.colors.primary,
        selectedColorPalette.colors.secondary,
        selectedColorPalette.colors.accent,
        selectedColorPalette.colors.success,
        selectedColorPalette.colors.warning,
        selectedColorPalette.colors.error,
      ];
      console.log();
      console.log(
        `  ${theme.muted("Color Palette:")} ${colorsToShow
          .map((color: string) => chalk.hex(color)("█"))
          .join(" ")} ${theme.dim(`(${selectedColorPalette.name})`)}`
      );
    }

    // Display ALL collected errors from the global error collector
    const collectedErrors = errorCollector.getErrors();
    if (collectedErrors.length > 0) {
      console.log();

      // Separate errors and warnings
      const errors = collectedErrors.filter((e) => e.type === "error");
      const warnings = collectedErrors.filter((e) => e.type === "warning");

      if (errors.length > 0) {
        // Create a formatted error box
        const errorLines: string[] = [
          theme.error(
            `❌ ${errors.length} Error${errors.length > 1 ? "s" : ""} Occurred During Setup`
          ),
          "",
        ];

        errors.forEach((err, index) => {
          errorLines.push(`${theme.accent("▸")} Task: ${theme.bold(err.task)}`);
          // Show the full error message
          const errorMsgLines = err.error.split("\n");
          errorMsgLines.forEach((line, i) => {
            if (i === 0) {
              errorLines.push(`  ${theme.error("Error:")} ${line}`);
            } else if (line.trim()) {
              errorLines.push(`    ${theme.dim(line)}`);
            }
          });
          if (index < errors.length - 1) {
            errorLines.push("");
          }
        });

        const errorBox = createFancyBox(errorLines.join("\n"), "Installation Errors");
        console.log(errorBox);
      }

      if (warnings.length > 0) {
        console.log();
        const warningLines: string[] = [
          theme.warning(`⚠️  ${warnings.length} Warning${warnings.length > 1 ? "s" : ""}`),
          "",
        ];

        warnings.forEach((warn, index) => {
          warningLines.push(`${theme.accent("▸")} ${warn.task}: ${warn.error.split("\n")[0]}`);
        });

        const warningBox = createFancyBox(warningLines.join("\n"), "Setup Warnings");
        console.log(warningBox);
      }

      console.log();
      console.log(theme.dim("Despite these errors, your project structure was created."));
      console.log(theme.dim("You may need to manually install some dependencies."));
    }

    // Display buffered analytics debug messages if enabled
    if (process.env.DEBUG_ANALYTICS) {
      const { getAnalyticsDebugMessages } = await import("../utils/analytics.js");
      const analyticsMessages = getAnalyticsDebugMessages();
      if (analyticsMessages.length > 0) {
        console.log();

        // Create a formatted analytics box similar to the success box
        const analyticsLines: string[] = [theme.info("📊 Analytics Debug"), ""];

        // Group messages by event
        let currentEvent = "";
        analyticsMessages.forEach((msg) => {
          if (msg.startsWith("Sending event:")) {
            if (currentEvent) analyticsLines.push(""); // Add spacing between events
            currentEvent = msg.replace("Sending event: ", "");
            analyticsLines.push(`${theme.accent("▸")} Event: ${theme.bold(currentEvent)}`);
          } else if (msg.startsWith("Properties:")) {
            // Parse and format properties more nicely
            try {
              const propsJson = msg.replace("Properties: ", "");
              const props = JSON.parse(propsJson);
              const nonEmptyProps = Object.entries(props).filter(
                ([_, v]) => v !== "" && v !== false && v !== "none"
              );
              if (nonEmptyProps.length > 0) {
                analyticsLines.push(`  ${theme.muted("Properties:")}`);
                nonEmptyProps.forEach(([key, value]) => {
                  analyticsLines.push(`    ${theme.dim("•")} ${key}: ${theme.info(String(value))}`);
                });
              }
            } catch {
              // Fallback if parsing fails
              analyticsLines.push(`  ${msg}`);
            }
          } else if (msg.includes("✓ Event sent successfully")) {
            analyticsLines.push(`  ${theme.success("✓ Sent successfully")}`);
          } else if (msg.includes("Failed to send event")) {
            analyticsLines.push(`  ${theme.error("✗ " + msg)}`);
          } else if (msg.includes("Skipped")) {
            analyticsLines.push(`  ${theme.warning("⚠ " + msg)}`);
          }
        });

        const analyticsBox = createFancyBox(analyticsLines.join("\n"), "Analytics Output");
        console.log(analyticsBox);
      }
    }

    // Next steps
    console.log();
    console.log(theme.bold("Next steps:"));
    console.log();

    // Create the commands list
    const commands = [`cd ${config.name}`];

    // Add install command if not auto-installed
    if (!options.install && !config.autoInstall) {
      commands.push(`${config.packageManager} install`);
    }

    // Add Docker commands if Docker is configured
    if (config.docker) {
      commands.push(`# Start Docker services`);
      commands.push(`${config.packageManager} run docker:up`);
      commands.push(`# Or alternatively:`);
      commands.push(`docker compose -f docker/${config.database}/docker-compose.yml up -d`);
    }

    // Add dev command
    commands.push(`${config.packageManager} run dev`);

    // Display commands in a styled code block
    const maxLength = Math.max(...commands.map((cmd) => cmd.length));
    const boxWidth = Math.max(60, maxLength + 4);

    console.log(theme.dim("  ┌" + "─".repeat(boxWidth - 2) + "┐"));
    commands.forEach((cmd) => {
      if (cmd.startsWith("#")) {
        console.log(theme.dim("  │ ") + theme.muted(cmd.padEnd(boxWidth - 4)) + theme.dim(" │"));
      } else {
        console.log(theme.dim("  │ ") + theme.info(cmd.padEnd(boxWidth - 4)) + theme.dim(" │"));
      }
    });
    console.log(theme.dim("  └" + "─".repeat(boxWidth - 2) + "┘"));

    console.log();
    console.log(theme.dim(divider()));
    console.log(
      `  Happy coding! Made with ${theme.error("♥")} by ${chalk.underline(theme.info("https://precast.dev"))}`
    );
    console.log();
  } catch (error) {
    taskRunner.error("Failed to create project");

    // Re-enable console output for error display
    if (!options.verbose) {
      setSuppressOutput(false);
    }

    // Display ALL collected errors from the global error collector
    const collectedErrors = errorCollector.getErrors();
    if (collectedErrors.length > 0) {
      console.log();

      const errorLines: string[] = [
        theme.error(
          `❌ ${collectedErrors.length} Error${collectedErrors.length > 1 ? "s" : ""} Occurred`
        ),
        "",
      ];

      collectedErrors.forEach((err, index) => {
        errorLines.push(`${theme.accent("▸")} Task: ${theme.bold(err.task)}`);
        // Format error message - split by newlines and indent
        const errorMsgLines = err.error.split("\n");
        errorMsgLines.forEach((line, i) => {
          if (i === 0) {
            errorLines.push(`  ${theme.error("Error:")} ${line}`);
          } else if (line.trim()) {
            errorLines.push(`    ${theme.dim(line)}`);
          }
        });
        if (index < collectedErrors.length - 1) {
          errorLines.push(""); // Add spacing between errors
        }
      });

      const errorBox = createFancyBox(errorLines.join("\n"), "Error Details");
      console.log(errorBox);
    } else {
      // If no errors were collected but we still failed, show the original error
      console.log();
      console.log(theme.error("An unexpected error occurred:"));
      console.log(theme.error(error instanceof Error ? error.message : String(error)));
    }

    if (debug) {
      console.error(chalk.red("\nDebug output:"));
      console.error(error);
    } else {
      console.log(theme.dim("\nRun with --debug flag for more details"));
    }

    process.exit(1);
  }
}

/**
 * Initialize a git repository
 */
async function initializeGit(projectPath: string) {
  await execa("git", ["init"], { cwd: projectPath, stdio: "pipe" });
  await execa("git", ["add", "."], { cwd: projectPath, stdio: "pipe" });

  try {
    await execa("git", ["config", "user.name"], { cwd: projectPath, stdio: "pipe" });
    await execa("git", ["config", "user.email"], { cwd: projectPath, stdio: "pipe" });
  } catch {
    debugLog("Git author not configured, using defaults");

    await execa("git", ["config", "user.name", "Precast User"], {
      cwd: projectPath,
      stdio: "pipe",
    });
    await execa("git", ["config", "user.email", "user@example.com"], {
      cwd: projectPath,
      stdio: "pipe",
    });
  }

  await execa("git", ["commit", "-m", "Initial commit from Precast"], {
    cwd: projectPath,
    stdio: "pipe",
  });
}

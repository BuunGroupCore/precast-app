#!/usr/bin/env node

import path from "path";
import { fileURLToPath } from "url";

import { Command } from "commander";
import fsExtra from "fs-extra";

import { addCommand } from "@/commands/add.js";
import { initCommand } from "@/commands/init.js";
import { statusCommand } from "@/commands/status.js";
import { telemetryCommand } from "@/commands/telemetry.js";
import { enhancedHelp } from "@/utils/ui/enhanced-help.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const packageJson = await fsExtra.readJSON(path.join(__dirname, "..", "package.json"));

/**
 * Main CLI program definition.
 * Configures the create-precast-app command with all available options and subcommands.
 */
const program = new Command();
program
  .name("create-precast-app")
  .description("CLI to scaffold modern web applications with your chosen stack")
  .version(packageJson.version);

// Override default help with our enhanced help system
program.configureHelp({
  helpWidth: 80,
  sortSubcommands: false,
});

// Custom help command with beautiful styling
program
  .command("help [command]")
  .description("Display help information with beautiful styling")
  .action(async (command) => {
    if (command) {
      // Find the specific command and show its help
      const targetCommand = program.commands.find(
        (cmd) => cmd.name() === command || cmd.aliases().includes(command)
      );
      if (targetCommand) {
        await enhancedHelp.showCommandHelp(targetCommand);
      } else {
        console.log(`Unknown command: ${command}`);
        await enhancedHelp.showMainHelp(program);
      }
    } else {
      await enhancedHelp.showMainHelp(program);
    }
  });

// Override the default --help behavior with our enhanced help
program.helpOption(false); // Disable default help
program.option("-h, --help", "Display help information with beautiful styling");

// Handle help flag manually
program.on("option:help", async () => {
  await enhancedHelp.showMainHelp(program);
  process.exit(0);
});
program
  .command("init [project-name]", { isDefault: true })
  .description("Create a new project")
  .option("-y, --yes", "Skip all prompts and use defaults")
  .option("-f, --framework <framework>", "Frontend framework")
  .option("--ui-framework <framework>", "UI framework (react, vue, solid, svelte) - used with Vite")
  .option("-b, --backend <backend>", "Backend framework")
  .option("-d, --database <database>", "Database")
  .option("-o, --orm <orm>", "ORM")
  .option("-s, --styling <styling>", "Styling solution")
  .option("-r, --runtime <runtime>", "Runtime environment")
  .option(
    "-u, --ui-library <library>",
    "UI component library (shadcn, daisyui, mui, chakra, antd, mantine)"
  )
  .option("--no-typescript", "Disable TypeScript")
  .option("--no-git", "Skip git initialization")
  .option("--no-gitignore", "Skip .gitignore file creation")
  .option("--no-eslint", "Skip ESLint configuration")
  .option("--no-prettier", "Skip Prettier configuration")
  .option("--docker", "Include Docker configuration")
  .option("--auto-deploy", "Automatically start Docker services after project creation")
  .option(
    "--no-secure-passwords",
    "Use generic passwords instead of secure random ones (Docker only)"
  )
  .option("--install", "Install dependencies after project creation")
  .option("--no-generate", "Skip automatic ORM client generation during installation")
  .option("--pm, --package-manager <pm>", "Package manager to use (npm, yarn, pnpm, bun)")
  .option("-a, --auth <provider>", "Authentication provider (auth.js, better-auth)")
  .option(
    "--api-client <client>",
    "API client library (tanstack-query, swr, axios, trpc, apollo-client)"
  )
  .option("--ai <assistant>", "AI assistant (claude, cursor, copilot, gemini)")
  .option("--ai-docs", "Generate AI documentation files (SPEC.md, PRD.md) in docs/ai/ folder")
  .option(
    "--mcp-servers <servers...>",
    "MCP servers to include when using Claude AI (filesystem, memory, github-official, github-api, gitlab, postgresql, supabase, mongodb, cloudflare, aws-mcp, azure-mcp, etc.)"
  )
  .option(
    "--powerups <powerups>",
    "Comma-separated list of powerups (sentry, posthog, storybook, prettier, eslint, husky, vitest, playwright)"
  )
  .option(
    "--plugins <plugins>",
    "Comma-separated list of plugins (stripe, resend, sendgrid, socketio)"
  )
  .option(
    "--color-palette <palette>",
    "Color palette theme (minimal-pro, monochrome, gradient, midnight, breeze, electric, nature, sunset, developer, arctic)"
  )
  .option(
    "--deployment <method>",
    "Deployment method (cloudflare-pages, vercel, netlify, github-pages, docker, aws, azure, gcp)"
  )
  .option("--debug", "Enable debug mode for verbose output")
  .option("--debug-analytics", "Enable debug logging for analytics events")
  .option("-v, --verbose", "Show detailed installation logs")
  .action(async (projectName, options) => {
    await initCommand(projectName, {
      yes: options.yes,
      framework: options.framework,
      uiFramework: options.uiFramework,
      backend: options.backend,
      database: options.database,
      orm: options.orm,
      styling: options.styling,
      runtime: options.runtime,
      uiLibrary: options.uiLibrary,
      typescript: options.typescript,
      git: options.git,
      gitignore: options.gitignore,
      eslint: options.eslint,
      prettier: options.prettier,
      docker: options.docker,
      autoDeploy: options.autoDeploy,
      securePasswords: options.securePasswords,
      install: options.install,
      generate: options.generate,
      packageManager: options.packageManager,
      auth: options.auth,
      apiClient: options.apiClient,
      ai: options.ai,
      aiDocs: options.aiDocs,
      mcpServers: options.mcpServers,
      powerups: options.powerups ? options.powerups.split(",") : undefined,
      plugins: options.plugins ? options.plugins.split(",") : undefined,
      colorPalette: options.colorPalette,
      deploymentMethod: options.deployment,
      debug: options.debug,
      debugAnalytics: options.debugAnalytics,
      verbose: options.verbose,
    });
  });
program
  .command("add [resource]")
  .description("Add a new resource to your project (component, route, api, feature, etc.)")
  .option("-n, --name <name>", "Resource name")
  .option("--ui <library>", "UI component library to add")
  .option("--auth <provider>", "Authentication provider to add")
  .option("--api-client <client>", "API client library to add")
  .option("--ai <assistant>", "AI assistant to add")
  .option("--plugin <plugin>", "Plugin to add (stripe, resend, sendgrid, socketio)")
  .option("--no-typescript", "Generate JavaScript instead of TypeScript")
  .action(async (resource, options) => {
    await addCommand(resource, {
      ui: options.ui,
      auth: options.auth,
      apiClient: options.apiClient,
      ai: options.ai,
      plugin: options.plugin,
      typescript: options.typescript,
    });
  });
program
  .command("status [path]")
  .description("Show the status and configuration of a Precast project")
  .option("--debug", "Enable debug mode for verbose output")
  .action(async (projectPath, options) => {
    await statusCommand(projectPath, options);
  });

program
  .command("list")
  .description("List available downloadable components and features")
  .option(
    "-c, --category <category>",
    "Filter by category (authentication, dashboard, payments, ui, utils, etc.)"
  )
  .option("-s, --search <term>", "Search features by name or description")
  .option("-f, --format <format>", "Display format (grid, table, compact)", "grid")
  .option("-v, --verbose", "Show detailed statistics and information")
  .action(async (options) => {
    const { listCommand } = await import("./commands/list.js");
    await listCommand({
      category: options.category,
      search: options.search,
      format: options.format,
      verbose: options.verbose,
    });
  });

program
  .command("generate")
  .alias("gen")
  .description("Generate ORM client and shared types")
  .option("--orm <orm>", "Specify ORM type (prisma, drizzle, typeorm)")
  .action(async (options) => {
    const { generateCommand } = await import("./commands/generate.js");
    await generateCommand(options);
  });

program
  .command("deploy")
  .description("Deploy Docker services for the current project")
  .option("--stop", "Stop all Docker services")
  .option("--status", "Show status of running Docker services")
  .option("--destroy", "Destroy all Docker services and data (DESTRUCTIVE)")
  .option("--approve", "Skip confirmation prompts (use with --destroy)")
  .option("--help-docker", "Show Docker auto-deploy help")
  .option("-y, --yes", "Auto-confirm all prompts and update environment variables")
  .option("--update-env", "Update environment variables with ngrok URLs")
  .option("--skip-env-update", "Skip environment variable updates")
  .action(async (options) => {
    const { deployCommand } = await import("./commands/deploy.js");
    await deployCommand({
      stop: options.stop,
      status: options.status,
      destroy: options.destroy,
      approve: options.approve,
      help: options.helpDocker,
      yes: options.yes,
      updateEnv: options.updateEnv,
      skipEnvUpdate: options.skipEnvUpdate,
    });
  });

// Setup turbo commands with proper nested structure
const turboCmd = program
  .command("turbo")
  .description("Turbo monorepo build system with enhanced TUI");

// Show turbo help when no subcommand is provided
turboCmd.action(async () => {
  const { showTurboHelp } = await import("./commands/turbo/index.js");
  await showTurboHelp();
});

// Turbo build subcommand
turboCmd
  .command("build")
  .description("Run Turbo build with TUI dashboard")
  .option("--filter <packages...>", "Filter packages to build")
  .option("--no-parallel", "Run builds sequentially")
  .option("--no-cache", "Force rebuild without cache")
  .option("--force", "Force rebuild all packages")
  .option("--output-logs <type>", "Output log type (full, errors-only, new-only)", "errors-only")
  .option("--no-dashboard", "Disable TUI dashboard")
  .option("--demo", "Run dashboard demo")
  .action(async (options) => {
    if (options.demo) {
      const { runTurboDashboardDemo } = await import("./commands/turbo/build.js");
      await runTurboDashboardDemo();
    } else {
      const { turboBuildCommand } = await import("./commands/turbo/build.js");
      await turboBuildCommand({
        filter: options.filter,
        parallel: options.parallel,
        cache: options.cache,
        force: options.force,
        outputLogs: options.outputLogs,
        dashboard: options.dashboard,
      });
    }
  });

// Turbo dev subcommand
turboCmd
  .command("dev")
  .description("Run Turbo dev with interactive task management")
  .action(async () => {
    const { devCommand } = await import("./commands/turbo/dev.js");
    await devCommand();
  });

program
  .command("telemetry [action]")
  .description("Manage telemetry settings (status, enable, disable)")
  .action(async (action) => {
    await telemetryCommand(action);
  });

program.parse();

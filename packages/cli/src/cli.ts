#!/usr/bin/env node

import path from "path";
import { fileURLToPath } from "url";

import { Command } from "commander";
import fsExtra from "fs-extra";

import { addCommand } from "@/commands/add.js";
import { initCommand } from "@/commands/init.js";
import { statusCommand } from "@/commands/status.js";
import { telemetryCommand } from "@/commands/telemetry.js";

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
      deployment: options.deployment,
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
      name: options.name,
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
  .description("List available templates and features")
  .action(async () => {
    /** @todo Implement list command to show available templates and features */
    console.log("List command not yet implemented");
  });

program
  .command("banner")
  .description("Create a banner template file for customization")
  .action(async () => {
    /** Dynamically import banner utilities to avoid loading them unless needed */
    const { createBannerTemplate } = await import("./utils/ui/banner.js");
    await createBannerTemplate();
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
  .option("--yes, -y", "Auto-confirm all prompts and update environment variables")
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

program
  .command("telemetry [action]")
  .description("Manage telemetry settings (status, enable, disable)")
  .action(async (action) => {
    await telemetryCommand(action);
  });

program.parse();

#!/usr/bin/env node

import path from "path";
import { fileURLToPath } from "url";

import { Command } from "commander";
import fsExtra from "fs-extra";

import { addCommand } from "./commands/add.js";
import { initCommand } from "./commands/init.js";
import { statusCommand } from "./commands/status.js";
import { telemetryCommand } from "./commands/telemetry.js";

/** Current file and directory paths */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** Package metadata for version information */
// eslint-disable-next-line import/no-named-as-default-member
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
  .option(
    "--no-secure-passwords",
    "Use generic passwords instead of secure random ones (Docker only)"
  )
  .option("--install", "Install dependencies after project creation")
  .option("--pm, --package-manager <pm>", "Package manager to use (npm, yarn, pnpm, bun)")
  .option("-a, --auth <provider>", "Authentication provider (auth.js, better-auth)")
  .option(
    "--api-client <client>",
    "API client library (tanstack-query, swr, axios, trpc, apollo-client)"
  )
  .option("--ai <assistant>", "AI assistant (claude, cursor, copilot, gemini)")
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
      securePasswords: options.securePasswords,
      install: options.install,
      packageManager: options.packageManager,
      auth: options.auth,
      apiClient: options.apiClient,
      ai: options.ai,
      mcpServers: options.mcpServers,
      powerups: options.powerups ? options.powerups.split(",") : undefined,
      plugins: options.plugins ? options.plugins.split(",") : undefined,
      colorPalette: options.colorPalette,
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
  .action(async (projectPath) => {
    await statusCommand(projectPath);
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
    const { createBannerTemplate } = await import("./utils/banner.js");
    await createBannerTemplate();
  });

program
  .command("telemetry [action]")
  .description("Manage telemetry settings (status, enable, disable)")
  .action(async (action) => {
    await telemetryCommand(action);
  });

program.parse();

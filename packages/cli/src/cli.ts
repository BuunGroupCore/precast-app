#!/usr/bin/env node

import path from "path";
import { fileURLToPath } from "url";

import { Command } from "commander";
import fsExtra from "fs-extra";

import { addFeaturesCommand } from "./commands/add-features.js";
import { addCommand } from "./commands/add.js";
import { initCommand } from "./commands/init.js";

/** File system utilities */
// eslint-disable-next-line import/no-named-as-default-member
const { readJSON } = fsExtra;

/** Current file and directory paths */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** Package metadata for version information */
const packageJson = await readJSON(path.join(__dirname, "..", "package.json"));

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
  .option("--docker", "Include Docker configuration")
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
  .action(async (projectName, options) => {
    await initCommand(projectName, {
      yes: options.yes,
      framework: options.framework,
      backend: options.backend,
      database: options.database,
      orm: options.orm,
      styling: options.styling,
      runtime: options.runtime,
      uiLibrary: options.uiLibrary,
      typescript: options.typescript,
      git: options.git,
      docker: options.docker,
      install: options.install,
      packageManager: options.packageManager,
      auth: options.auth,
      apiClient: options.apiClient,
      ai: options.ai,
      mcpServers: options.mcpServers,
    });
  });
program
  .command("add [resource]")
  .description("Add a new resource to your project (component, route, api, etc.)")
  .option("-n, --name <name>", "Resource name")
  .option("--no-typescript", "Generate JavaScript instead of TypeScript")
  .action(async (resource, options) => {
    await addCommand(resource, {
      name: options.name,
      typescript: options.typescript,
    });
  });
program
  .command("add-features")
  .description("Add features to an existing Precast project (UI libraries, AI context files)")
  .option("--ui <library>", "UI component library to add")
  .option("--ai <tools...>", "AI assistance tools to add (claude, copilot, cursor, gemini)")
  .option("-y, --yes", "Skip all prompts and use defaults")
  .action(async (options) => {
    await addFeaturesCommand(process.cwd(), {
      ui: options.ui,
      ai: options.ai,
      yes: options.yes,
    });
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
program.parse();

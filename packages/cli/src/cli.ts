#!/usr/bin/env node
import path from "path";
import { fileURLToPath } from "url";

import { Command } from "commander";
import fs from "fs-extra";

import { initCommand } from "./commands/init.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read package.json for version
const packageJson = await fs.readJSON(path.join(__dirname, "..", "package.json"));

const program = new Command();

program
  .name("create-precast-app")
  .description("CLI to scaffold modern web applications with your chosen stack")
  .version(packageJson.version);

// Init command (default)
program
  .command("init [project-name]", { isDefault: true })
  .description("Create a new project")
  .option("-y, --yes", "Skip all prompts and use defaults")
  .option("-f, --framework <framework>", "Frontend framework")
  .option("-b, --backend <backend>", "Backend framework")
  .option("-d, --database <database>", "Database")
  .option("-o, --orm <orm>", "ORM")
  .option("-s, --styling <styling>", "Styling solution")
  .option("--no-typescript", "Disable TypeScript")
  .option("--no-git", "Skip git initialization")
  .option("--docker", "Include Docker configuration")
  .option("--install", "Install dependencies after project creation")
  .option("--pm, --package-manager <pm>", "Package manager to use (npm, yarn, pnpm, bun)")
  .action(async (projectName, options) => {
    await initCommand(projectName, {
      yes: options.yes,
      framework: options.framework,
      backend: options.backend,
      database: options.database,
      orm: options.orm,
      styling: options.styling,
      typescript: options.typescript,
      git: options.git,
      docker: options.docker,
      install: options.install,
      packageManager: options.packageManager,
    });
  });

// Add command (for future implementation)
program
  .command("add <feature>")
  .description("Add a feature to an existing project")
  .option("--install", "Install dependencies after adding feature")
  .action(async (feature, _options) => {
    console.log("Add command not yet implemented");
    console.log(`Would add feature: ${feature}`);
    // TODO: Implement add command
  });

// List command (for future implementation)
program
  .command("list")
  .description("List available templates and features")
  .action(async () => {
    console.log("List command not yet implemented");
    // TODO: Implement list command
  });

program.parse();

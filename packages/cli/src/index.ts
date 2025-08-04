#!/usr/bin/env node
import path from "path";
import { fileURLToPath } from "url";

import chalk from "chalk";
import { Command } from "commander";
import inquirer from "inquirer";
import ora from "ora";

import {
  validateConfiguration,
  frameworkDefs,
  backendDefs,
  databaseDefs,
  ormDefs,
  stylingDefs,
  runtimeDefs,
  type ProjectConfig,
} from "../../shared/stack-config.js";

import { createProject } from "./create-project.js";
import { logger } from "./utils/logger.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const program = new Command();
program
  .name("create-precast-app")
  .description("CLI to scaffold modern web applications with your chosen stack")
  .version("0.1.0")
  .argument("[project-name]", "Name of the project")
  .option("-f, --framework <framework>", "Frontend framework")
  .option("-b, --backend <backend>", "Backend framework")
  .option("-d, --database <database>", "Database")
  .option("-o, --orm <orm>", "ORM")
  .option("-s, --styling <styling>", "Styling solution")
  .option("-r, --runtime <runtime>", "Runtime environment")
  .option("--no-typescript", "Disable TypeScript")
  .option("--no-git", "Skip git initialization")
  .option("--docker", "Include Docker configuration")
  .option("-y, --yes", "Skip all prompts and use defaults")
  .action(async (projectName, options) => {
    logger.header("🚀 PRECAST APP GENERATOR");
    if (!projectName) {
      const { name } = await inquirer.prompt([
        {
          type: "input",
          name: "name",
          message: "What is your project name?",
          default: "my-awesome-project",
          validate: (input) => {
            if (!input) return "Project name is required";
            if (!/^[a-z0-9-]+$/.test(input)) {
              return "Project name must be lowercase and contain only letters, numbers, and hyphens";
            }
            return true;
          },
        },
      ]);
      projectName = name;
    }
    const config: ProjectConfig = {
      name: projectName,
      framework: options.framework || "",
      backend: options.backend || "",
      database: options.database || "",
      orm: options.orm || "",
      styling: options.styling || "",
      runtime: options.runtime || "",
      typescript: options.typescript !== false,
      git: options.git !== false,
      docker: options.docker || false,
      packageManager: options.packageManager || "npm",
      uiLibrary: undefined,
      aiContext: undefined,
      projectPath: path.resolve(process.cwd(), projectName),
      language: options.typescript !== false ? "typescript" : "javascript",
    };
    if (
      config.framework &&
      config.backend &&
      config.database &&
      config.orm &&
      config.styling &&
      config.runtime
    ) {
      const validation = validateConfiguration(config);
      if (!validation.valid) {
        logger.error("Configuration errors:");
        validation.errors.forEach((error) => {
          logger.error(`  • ${error}`);
        });
        process.exit(1);
      }
    }
    if (!config.framework) {
      const { framework } = await inquirer.prompt([
        {
          type: "list",
          name: "framework",
          message: "Choose your frontend framework:",
          choices: frameworkDefs.map((f) => ({
            name: `${f.name} - ${f.description}`,
            value: f.id,
            short: f.name,
          })),
        },
      ]);
      config.framework = framework;
    }
    if (!config.backend) {
      const { backend } = await inquirer.prompt([
        {
          type: "list",
          name: "backend",
          message: "Choose your backend:",
          choices: backendDefs.map((b) => ({
            name: `${b.name} - ${b.description}`,
            value: b.id,
            short: b.name,
          })),
        },
      ]);
      config.backend = backend;
    }
    if (!config.database && config.backend !== "none") {
      const { database } = await inquirer.prompt([
        {
          type: "list",
          name: "database",
          message: "Choose your database:",
          choices: databaseDefs.map((d) => ({
            name: `${d.name} - ${d.description}`,
            value: d.id,
            short: d.name,
          })),
        },
      ]);
      config.database = database;
    } else if (config.backend === "none") {
      config.database = "none";
    }
    if (!config.orm && config.database !== "none") {
      const compatibleOrms = ormDefs.filter((o) => {
        if (o.incompatible?.includes(config.database)) return false;
        return true;
      });
      const { orm } = await inquirer.prompt([
        {
          type: "list",
          name: "orm",
          message: "Choose your ORM:",
          choices: compatibleOrms.map((o) => ({
            name: `${o.name} - ${o.description}`,
            value: o.id,
            short: o.name,
          })),
        },
      ]);
      config.orm = orm;
    } else if (config.database === "none") {
      config.orm = "none";
    }
    if (!config.styling) {
      const { styling } = await inquirer.prompt([
        {
          type: "list",
          name: "styling",
          message: "Choose your styling solution:",
          choices: stylingDefs.map((s) => ({
            name: `${s.name} - ${s.description}`,
            value: s.id,
            short: s.name,
          })),
        },
      ]);
      config.styling = styling;
    }
    if (!config.runtime) {
      const { runtime } = await inquirer.prompt([
        {
          type: "list",
          name: "runtime",
          message: "Choose your runtime environment:",
          choices: runtimeDefs.map((r) => ({
            name: `${r.name} - ${r.description}`,
            value: r.id,
            short: r.name,
          })),
        },
      ]);
      config.runtime = runtime;
    }
    if (!options.yes) {
      if (options.typescript === undefined) {
        const { typescript } = await inquirer.prompt([
          {
            type: "confirm",
            name: "typescript",
            message: "Use TypeScript?",
            default: true,
          },
        ]);
        config.typescript = typescript;
      }
      if (options.git === undefined) {
        const { git } = await inquirer.prompt([
          {
            type: "confirm",
            name: "git",
            message: "Initialize git repository?",
            default: true,
          },
        ]);
        config.git = git;
      }
      if (!options.docker) {
        const { docker } = await inquirer.prompt([
          {
            type: "confirm",
            name: "docker",
            message: "Include Docker configuration?",
            default: false,
          },
        ]);
        config.docker = docker;
      }
    }
    const validation = validateConfiguration(config);
    if (!validation.valid) {
      logger.error("Configuration errors:");
      validation.errors.forEach((error) => {
        logger.error(`  • ${error}`);
      });
      process.exit(1);
    }
    if (validation.warnings.length > 0) {
      logger.warn("Configuration warnings:");
      validation.warnings.forEach((warning) => {
        logger.warn(`  • ${warning}`);
      });
    }
    logger.info("\n📋 Configuration Summary:");
    logger.info(`  Project: ${chalk.cyan(config.name)}`);
    logger.info(`  Framework: ${chalk.green(config.framework)}`);
    logger.info(`  Backend: ${chalk.yellow(config.backend)}`);
    logger.info(`  Database: ${chalk.blue(config.database)}`);
    logger.info(`  ORM: ${chalk.magenta(config.orm)}`);
    logger.info(`  Styling: ${chalk.cyan(config.styling)}`);
    logger.info(`  Runtime: ${chalk.yellow(config.runtime)}`);
    logger.info(`  TypeScript: ${config.typescript ? chalk.green("✓") : chalk.red("✗")}`);
    logger.info(`  Git: ${config.git ? chalk.green("✓") : chalk.red("✗")}`);
    logger.info(`  Docker: ${config.docker ? chalk.green("✓") : chalk.red("✗")}`);
    if (!options.yes) {
      const { confirm } = await inquirer.prompt([
        {
          type: "confirm",
          name: "confirm",
          message: "Create project with this configuration?",
          default: true,
        },
      ]);
      if (!confirm) {
        logger.info("Project creation cancelled");
        process.exit(0);
      }
    }
    const spinner = ora("Creating your project...").start();
    try {
      await createProject(config);
      spinner.succeed("Project created successfully!");
      logger.success(`\n✨ Your project is ready!`);
      logger.info(`\nNext steps:`);
      logger.info(`  ${chalk.cyan(`cd ${config.name}`)}`);
      logger.info(`  ${chalk.cyan("npm install")} (or yarn/pnpm/bun install)`);
      logger.info(`  ${chalk.cyan("npm run dev")}`);
      logger.info(`\nHappy coding! 🚀`);
    } catch (error) {
      spinner.fail("Failed to create project");
      logger.error(error instanceof Error ? error.message : "Unknown error");
      process.exit(1);
    }
  });
program.parse();

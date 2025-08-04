import path from "path";
import { fileURLToPath } from "url";

import { intro, outro, spinner, confirm, cancel, log } from "@clack/prompts";
import { execa, execaSync } from "execa";
import { pathExists, readdir, ensureDir, remove, existsSync } from "fs-extra";
import pc from "picocolors";

import { getConfigValidator } from "../core/config-validator.js";
import { gatherProjectConfig } from "../prompts/config-prompts.js";
import { displayConfigSummary } from "../utils/display-config.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export interface InitOptions {
  yes?: boolean;
  framework?: string;
  backend?: string;
  database?: string;
  orm?: string;
  styling?: string;
  typescript?: boolean;
  git?: boolean;
  docker?: boolean;
  install?: boolean;
  packageManager?: "npm" | "yarn" | "pnpm" | "bun";
}

export async function initCommand(projectName: string | undefined, options: InitOptions) {
  intro(pc.bgCyan(pc.black(" create-precast-app ")));

  try {
    // Get project configuration
    const config = await gatherProjectConfig(projectName, options);

    // Validate configuration
    const validator = getConfigValidator();
    const validation = validator.validate(config);

    if (!validation.valid) {
      log.error("Configuration errors:");
      validation.errors.forEach((error) => {
        log.error(`  ${pc.red("✗")} ${error}`);
      });
      cancel("Invalid configuration");
      process.exit(1);
    }

    if (validation.warnings.length > 0) {
      log.warning("Configuration warnings:");
      validation.warnings.forEach((warning) => {
        log.warning(`  ${pc.yellow("⚠")} ${warning}`);
      });
    }

    // Display configuration summary
    displayConfigSummary(config);

    // Confirm project creation
    if (!options.yes) {
      const shouldContinue = await confirm({
        message: "Create project with this configuration?",
      });

      if (!shouldContinue) {
        cancel("Project creation cancelled");
        process.exit(0);
      }
    }

    // Check if directory exists
    const projectPath = path.resolve(process.cwd(), config.name);
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

    // Create project directory
    await ensureDir(projectPath);

    // Create project
    const s = spinner();
    s.start("Creating project structure");

    try {
      // Use the new generator system for all frameworks
      const { generateTemplate } = await import("../generators/index.js");
      await generateTemplate(config, projectPath);

      s.stop("Project structure created");

      // Initialize git if requested
      if (config.git) {
        s.start("Initializing git repository");
        await initializeGit(projectPath);
        s.stop("Git repository initialized");
      }

      // Install dependencies if requested
      if (options.install) {
        s.start("Installing dependencies");
        await installDependencies(projectPath, options.packageManager || detectPackageManager());
        s.stop("Dependencies installed");
      }

      // Success!
      outro(pc.green("✨ Project created successfully!"));

      log.message("");
      log.message("Next steps:");
      log.message(`  ${pc.cyan(`cd ${config.name}`)}`);

      if (!options.install) {
        const pm = options.packageManager || detectPackageManager();
        log.message(`  ${pc.cyan(`${pm} install`)}`);
      }

      log.message(`  ${pc.cyan(`${options.packageManager || detectPackageManager()} run dev`)}`);
      log.message("");
      log.message("Happy coding! 🚀");
    } catch (error) {
      s.stop("Failed to create project");

      // Clean up on error
      await remove(projectPath);
      throw error;
    }
  } catch (error) {
    log.error(error instanceof Error ? error.message : "Unknown error");
    process.exit(1);
  }
}

async function initializeGit(projectPath: string) {
  await execa("git", ["init"], { cwd: projectPath });
  await execa("git", ["add", "."], { cwd: projectPath });
  await execa("git", ["commit", "-m", "Initial commit"], { cwd: projectPath });
}

async function installDependencies(projectPath: string, packageManager: string) {
  const installCommands: Record<string, string[]> = {
    npm: ["npm", "install"],
    yarn: ["yarn"],
    pnpm: ["pnpm", "install"],
    bun: ["bun", "install"],
  };

  const [command, ...args] = installCommands[packageManager] || installCommands.npm;
  await execa(command, args, { cwd: projectPath, stdio: "inherit" });
}

function detectPackageManager(): string {
  // Check for lock files
  if (existsSync("bun.lockb")) return "bun";
  if (existsSync("pnpm-lock.yaml")) return "pnpm";
  if (existsSync("yarn.lock")) return "yarn";
  if (existsSync("package-lock.json")) return "npm";

  // Check if commands are available
  try {
    execaSync("bun", ["--version"]);
    return "bun";
  } catch {
    // Command not available
  }

  try {
    execaSync("pnpm", ["--version"]);
    return "pnpm";
  } catch {
    // Command not available
  }

  try {
    execaSync("yarn", ["--version"]);
    return "yarn";
  } catch {
    // Command not available
  }

  return "npm";
}

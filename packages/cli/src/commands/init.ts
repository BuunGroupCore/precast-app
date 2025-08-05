import path from "path";
import { fileURLToPath } from "url";

import { intro, outro, spinner, confirm, cancel, log } from "@clack/prompts";
import { execa } from "execa";
import fsExtra from "fs-extra";
import pc from "picocolors";

import { getConfigValidator } from "../core/config-validator.js";
import { gatherProjectConfig } from "../prompts/config-prompts.js";
import { displayBanner } from "../utils/banner.js";
import { displayConfigSummary } from "../utils/display-config.js";
import {
  detectPackageManager,
  checkPackageManagerAvailable,
  installAllDependencies,
} from "../utils/package-manager.js";
import { runSecurityAudit } from "../utils/security-audit.js";
import { setupUILibrary } from "../utils/ui-library-setup.js";
import { addSecurityOverridesToProject } from "../utils/update-dependencies.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export interface InitOptions {
  yes?: boolean;
  framework?: string;
  backend?: string;
  database?: string;
  orm?: string;
  styling?: string;
  runtime?: string;
  uiLibrary?: string;
  typescript?: boolean;
  git?: boolean;
  docker?: boolean;
  install?: boolean;
  packageManager?: "npm" | "yarn" | "pnpm" | "bun";
  auth?: string;
}

/**
 * Initialize a new project with the specified configuration
 * @param projectName - Name of the project to create
 * @param options - Configuration options for the project
 */
export async function initCommand(projectName: string | undefined, options: InitOptions) {
  await displayBanner();
  intro(pc.bgCyan(pc.black(" create-precast-app ")));
  try {
    const config = await gatherProjectConfig(projectName, options);
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
    displayConfigSummary(config);
    if (!options.yes) {
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
    if (await fsExtra.pathExists(projectPath)) {
      const isEmpty = (await fsExtra.readdir(projectPath)).length === 0;
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
    await fsExtra.ensureDir(projectPath);
    const s = spinner();
    s.start("Creating project structure");
    try {
      const { generateTemplate } = await import("../generators/index.js");
      await generateTemplate(config, projectPath);

      const { writePrecastConfig } = await import("../utils/precast-config.js");
      await writePrecastConfig(config);

      s.stop("Project structure created");

      // Add security overrides to package.json
      const pm = options.packageManager || (await detectPackageManager());
      await addSecurityOverridesToProject(projectPath, config.framework, pm);
      if (config.git) {
        s.start("Initializing git repository");
        await initializeGit(projectPath);
        s.stop("Git repository initialized");
      }
      if (options.install || config.autoInstall) {
        s.start("Installing dependencies");
        const pm = options.packageManager || (await detectPackageManager());
        if (!(await checkPackageManagerAvailable(pm))) {
          log.warning(`Package manager ${pm} not available, falling back to npm`);
        }
        // Install all dependencies from package.json using enhanced function with fallbacks
        await installAllDependencies({
          packageManager: pm,
          projectPath: projectPath,
        });
        s.stop("Dependencies installed");

        // Run security audit after dependencies are installed
        s.start("Running security audit");
        try {
          await runSecurityAudit({
            packageManager: pm,
            projectPath: projectPath,
            autoFix: true,
          });
          s.stop("Security audit completed");
        } catch (error) {
          s.stop("Security audit failed");
          log.warn(
            `Security audit failed: ${error instanceof Error ? error.message : "Unknown error"}`
          );
        }

        // Setup UI library AFTER dependencies are installed
        if (config.uiLibrary && config.framework !== "vanilla") {
          s.start(`Setting up ${config.uiLibrary}`);
          try {
            await setupUILibrary(config, projectPath);
            s.stop(`${config.uiLibrary} setup completed`);
          } catch {
            s.stop(`Failed to setup ${config.uiLibrary}`);
            log.warn(`UI library setup failed. You can retry manually later.`);
          }
        }
      }
      outro(pc.green("✨ Project created successfully!"));
      log.message("");
      log.message("Next steps:");
      log.message(`  ${pc.cyan(`cd ${config.name}`)}`);
      if (!options.install && !config.autoInstall) {
        const pm = options.packageManager || (await detectPackageManager());
        log.message(`  ${pc.cyan(`${pm} install`)}`);
      }
      log.message(
        `  ${pc.cyan(`${options.packageManager || (await detectPackageManager())} run dev`)}`
      );
      log.message("");
      log.message("Happy coding! 🚀");
    } catch (error) {
      s.stop("Failed to create project");
      await fsExtra.remove(projectPath);
      throw error;
    }
  } catch (error) {
    log.error(error instanceof Error ? error.message : "Unknown error");
    process.exit(1);
  }
}
/**
 * Initialize a git repository in the project directory
 * @param projectPath - Path to the project directory
 */
async function initializeGit(projectPath: string) {
  await execa("git", ["init"], { cwd: projectPath, stdio: "pipe" });
  await execa("git", ["add", "."], { cwd: projectPath, stdio: "pipe" });
  try {
    await execa("git", ["config", "user.name"], { cwd: projectPath, stdio: "pipe" });
    await execa("git", ["config", "user.email"], { cwd: projectPath, stdio: "pipe" });
  } catch {
    log.warning("Git author not configured. Setting project-specific configuration.");
    let userName = "Precast User";
    let userEmail = "user@example.com";
    try {
      const { stdout: globalName } = await execa("git", ["config", "--global", "user.name"], {
        stdio: "pipe",
      });
      if (globalName) userName = globalName;
    } catch {
      // Global name not set, using default
    }
    try {
      const { stdout: globalEmail } = await execa("git", ["config", "--global", "user.email"], {
        stdio: "pipe",
      });
      if (globalEmail) userEmail = globalEmail;
    } catch {
      // Global email not set, using default
    }
    await execa("git", ["config", "user.name", userName], { cwd: projectPath, stdio: "pipe" });
    await execa("git", ["config", "user.email", userEmail], { cwd: projectPath, stdio: "pipe" });
    log.message(`Git configured with: ${userName} <${userEmail}>`);
    log.message("To set your global git identity, run:");
    log.message(`  git config --global user.name "Your Name"`);
    log.message(`  git config --global user.email "your.email@example.com"`);
  }
  await execa("git", ["commit", "-m", "Initial commit"], { cwd: projectPath, stdio: "pipe" });
}

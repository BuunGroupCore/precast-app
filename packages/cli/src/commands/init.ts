import path from "path";
import { fileURLToPath } from "url";

import { intro, outro, spinner, confirm, cancel, log } from "@clack/prompts";
import { execa } from "execa";
import fsExtra from "fs-extra";
const { pathExists, readdir, ensureDir, remove } = fsExtra;
import pc from "picocolors";

import { getConfigValidator } from "../core/config-validator.js";
import { gatherProjectConfig } from "../prompts/config-prompts.js";
import { displayConfigSummary } from "../utils/display-config.js";
import { detectPackageManager, checkPackageManagerAvailable } from "../utils/package-manager.js";
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
  typescript?: boolean;
  git?: boolean;
  docker?: boolean;
  install?: boolean;
  packageManager?: "npm" | "yarn" | "pnpm" | "bun";
}
export async function initCommand(projectName: string | undefined, options: InitOptions) {
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
    await ensureDir(projectPath);
    const s = spinner();
    s.start("Creating project structure");
    try {
      const { generateTemplate } = await import("../generators/index.js");
      await generateTemplate(config, projectPath);
      s.stop("Project structure created");
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
        // Install all dependencies from package.json
        await execa(pm, ["install"], { cwd: projectPath, stdio: "inherit" });
        s.stop("Dependencies installed");
      }
      outro(pc.green("✨ Project created successfully!"));
      log.message("");
      log.message("Next steps:");
      log.message(`  ${pc.cyan(`cd ${config.name}`)}`);
      if (!options.install && !config.autoInstall) {
        const pm = options.packageManager || (await detectPackageManager());
        log.message(`  ${pc.cyan(`${pm} install`)}`);
      }
      log.message(`  ${pc.cyan(`${options.packageManager || (await detectPackageManager())} run dev`)}`);
      log.message("");
      log.message("Happy coding! 🚀");
    } catch (error) {
      s.stop("Failed to create project");
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
  try {
    await execa("git", ["config", "user.name"], { cwd: projectPath });
    await execa("git", ["config", "user.email"], { cwd: projectPath });
  } catch {
    log.warning("Git author not configured. Setting project-specific configuration.");
    let userName = "Precast User";
    let userEmail = "user@example.com";
    try {
      const { stdout: globalName } = await execa("git", ["config", "--global", "user.name"]);
      if (globalName) userName = globalName;
    } catch {}
    try {
      const { stdout: globalEmail } = await execa("git", ["config", "--global", "user.email"]);
      if (globalEmail) userEmail = globalEmail;
    } catch {}
    await execa("git", ["config", "user.name", userName], { cwd: projectPath });
    await execa("git", ["config", "user.email", userEmail], { cwd: projectPath });
    log.message(`Git configured with: ${userName} <${userEmail}>`);
    log.message("To set your global git identity, run:");
    log.message(`  git config --global user.name "Your Name"`);
    log.message(`  git config --global user.email "your.email@example.com"`);
  }
  await execa("git", ["commit", "-m", "Initial commit"], { cwd: projectPath });
}

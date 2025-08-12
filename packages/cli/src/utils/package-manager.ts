import path from "path";
import { consola } from "consola";
import { execa } from "execa";
import fsExtra from "fs-extra";
import { logger, isVerbose } from "./logger.js";
import { trackError, trackFallback, trackDependencyInstall } from "./analytics.js";
import { errorCollector } from "./error-collector.js";

export type PackageManager = "npm" | "yarn" | "pnpm" | "bun";

export interface PackageManagerConfig {
  id: PackageManager;
  installCommand: string;
  addCommand: string;
  devFlag: string;
  globalFlag: string;
  runCommand: string;
  lockFile: string;
}

export const PACKAGE_MANAGERS: Record<PackageManager, PackageManagerConfig> = {
  npm: {
    id: "npm",
    installCommand: "install",
    addCommand: "install",
    devFlag: "--save-dev",
    globalFlag: "--global",
    runCommand: "run",
    lockFile: "package-lock.json",
  },
  yarn: {
    id: "yarn",
    installCommand: "install",
    addCommand: "add",
    devFlag: "--dev",
    globalFlag: "--global",
    runCommand: "run",
    lockFile: "yarn.lock",
  },
  pnpm: {
    id: "pnpm",
    installCommand: "install",
    addCommand: "add",
    devFlag: "--save-dev",
    globalFlag: "--global",
    runCommand: "run",
    lockFile: "pnpm-lock.yaml",
  },
  bun: {
    id: "bun",
    installCommand: "install",
    addCommand: "add",
    devFlag: "--dev",
    globalFlag: "--global",
    runCommand: "run",
    lockFile: "bun.lockb",
  },
};

/**
 * Get the configuration for a specific package manager
 * @param packageManager - The package manager name
 * @returns The package manager configuration
 */
export function getPackageManagerConfig(packageManager: string): PackageManagerConfig {
  const pm = packageManager as PackageManager;
  const config = PACKAGE_MANAGERS[pm];
  if (!config) {
    consola.warn(`Unknown package manager: ${packageManager}, falling back to npm`);
    return PACKAGE_MANAGERS.npm;
  }
  return config;
}

/**
 * Detect which package manager to use based on lock files and availability
 * @returns The detected package manager
 */
export async function detectPackageManager(): Promise<PackageManager> {
  const fs = await import("fs-extra");

  if (await fs.pathExists("bun.lockb")) return "bun";
  if (await fs.pathExists("pnpm-lock.yaml")) return "pnpm";
  if (await fs.pathExists("yarn.lock")) return "yarn";
  if (await fs.pathExists("package-lock.json")) return "npm";

  // Check which package managers are available
  return detectAvailablePackageManager();
}

/**
 * Detect which package manager is available on the system (ignoring lock files)
 * This is useful for initial project creation where we shouldn't be influenced
 * by parent directory lock files
 * @returns The detected package manager
 */
export async function detectAvailablePackageManager(): Promise<PackageManager> {
  // Check which package managers are available, preferring bun
  try {
    await execa("bun", ["--version"], { stdio: "ignore" });
    return "bun";
  } catch {
    // Not available
  }

  try {
    await execa("pnpm", ["--version"], { stdio: "ignore" });
    return "pnpm";
  } catch {
    // Not available
  }

  try {
    await execa("yarn", ["--version"], { stdio: "ignore" });
    return "yarn";
  } catch {
    // Not available
  }

  return "npm";
}

export async function installDependencies(
  dependencies: string[],
  options: {
    packageManager: string;
    projectPath: string;
    dev?: boolean;
    exact?: boolean;
    context?: string;
  }
): Promise<void> {
  if (dependencies.length === 0) return;

  const startTime = Date.now();
  const pm = getPackageManagerConfig(options.packageManager);
  const args = [pm.addCommand, ...dependencies];

  if (options.dev) {
    args.push(pm.devFlag);
  }

  if (options.exact && pm.id !== "bun") {
    args.push("--exact");
  }

  const pmIcons: Record<string, string> = {
    npm: "📦",
    yarn: "🧶",
    pnpm: "📦",
    bun: "🥟",
  };
  const pmIcon = pmIcons[pm.id] || "📦";

  logger.verbose(`${pmIcon} Installing dependencies with ${pm.id}...`);
  consola.debug(`Command: ${pm.id} ${args.join(" ")}`);

  try {
    // Check if Node.js is available when using Bun (needed for postinstall scripts)
    if (pm.id === "bun") {
      try {
        await execa("node", ["--version"], { stdio: "ignore" });
      } catch {
        consola.warn("Node.js not found - some package postinstall scripts may fail with Bun");
        consola.info("Consider installing Node.js or switching to npm/yarn/pnpm");

        try {
          await execa("npm", ["--version"], { stdio: "ignore" });
          consola.info("Falling back to npm for installation...");
          const npmPm = getPackageManagerConfig("npm");
          const npmArgs = [npmPm.addCommand, ...dependencies];
          if (options.dev) npmArgs.push(npmPm.devFlag);
          if (options.exact) npmArgs.push("--exact");

          await execa("npm", npmArgs, {
            cwd: options.projectPath,
            stdio: "inherit",
          });
          logger.verbose("Dependencies installed successfully with npm (fallback)");
          return;
        } catch {
          consola.warn("npm not available either, continuing with bun...");
        }
      }
    }

    // For Bun, add --ignore-scripts flag to avoid postinstall script failures
    if (pm.id === "bun" && !args.includes("--ignore-scripts")) {
      args.push("--ignore-scripts");
      logger.verbose("💡 Using --ignore-scripts flag to avoid postinstall script issues with Bun");
    }

    // Show output only in verbose mode
    const stdio = isVerbose() ? "inherit" : "pipe";

    await execa(pm.id, args, {
      cwd: options.projectPath,
      stdio,
    });

    if (!isVerbose()) {
      logger.verbose(`✅ Dependencies installed successfully with ${pm.id}`);
    }

    // Track successful installation
    await trackDependencyInstall(
      pm.id,
      Date.now() - startTime,
      true,
      dependencies.length,
      options.context || "core"
    );
  } catch (error) {
    consola.error(`❌ Failed to install dependencies with ${pm.id}:`, error);

    // Collect the error
    errorCollector.addError(`Installing ${dependencies.join(", ")} with ${pm.id}`, error);

    // Track the initial failure
    await trackError("dependency_install_failed", {
      packageManager: pm.id,
      packages: dependencies.join(","),
      errorMessage: error instanceof Error ? error.message : String(error),
      dev: options.dev || false,
    });

    // If bun failed and npm is available, try fallback
    if (pm.id === "bun") {
      try {
        await execa("npm", ["--version"], { stdio: "ignore" });
        consola.info("Attempting fallback to npm...");

        // Track fallback attempt
        await trackFallback("bun_to_npm", {
          originalPackageManager: "bun",
          fallbackPackageManager: "npm",
          packages: "all",
        });
        const npmPm = getPackageManagerConfig("npm");
        const npmArgs = [npmPm.addCommand, ...dependencies];
        if (options.dev) npmArgs.push(npmPm.devFlag);
        if (options.exact) npmArgs.push("--exact");

        await execa("npm", npmArgs, {
          cwd: options.projectPath,
          stdio: isVerbose() ? "inherit" : "pipe",
        });
        if (!isVerbose()) {
          logger.verbose("Dependencies installed successfully with npm (fallback)");
        }

        // Track successful fallback
        await trackDependencyInstall(
          "npm",
          Date.now() - startTime,
          true,
          dependencies.length,
          options.context || "core_fallback"
        );
        return;
      } catch (fallbackError) {
        consola.error("Fallback to npm also failed:", fallbackError);

        // Collect the fallback error
        errorCollector.addError(`Fallback npm install for all dependencies`, fallbackError);

        // Track fallback failure
        await trackError("dependency_install_fallback_failed", {
          originalPackageManager: "bun",
          fallbackPackageManager: "npm",
          packages: "all",
          errorMessage:
            fallbackError instanceof Error ? fallbackError.message : String(fallbackError),
        });
      }
    }

    throw error;
  }
}

export async function runScript(
  script: string,
  options: {
    packageManager: string;
    projectPath: string;
    args?: string[];
  }
): Promise<void> {
  const pm = getPackageManagerConfig(options.packageManager);
  const args = [pm.runCommand, script, ...(options.args || [])];

  consola.info(`Running script: ${pm.id} ${args.join(" ")}`);

  try {
    await execa(pm.id, args, {
      cwd: options.projectPath,
      stdio: "inherit",
    });
  } catch (error) {
    consola.error(`Failed to run script ${script}:`, error);
    throw error;
  }
}

export async function checkPackageManagerAvailable(packageManager: string): Promise<boolean> {
  try {
    await execa(packageManager, ["--version"], { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

export async function getPackageManagerVersion(packageManager: string): Promise<string> {
  try {
    const { stdout } = await execa(packageManager, ["--version"], { stdio: "pipe" });
    // Clean up the version string (remove 'v' prefix if present, trim whitespace)
    return stdout.trim().replace(/^v/, "");
  } catch {
    // Return a fallback version if we can't detect it
    const fallbackVersions: Record<string, string> = {
      npm: "10.2.5",
      yarn: "1.22.19",
      pnpm: "8.15.5",
      bun: "1.1.0",
    };
    return fallbackVersions[packageManager] || "latest";
  }
}

export async function installAllDependencies(options: {
  packageManager: string;
  projectPath: string;
  skipFormatting?: boolean;
}): Promise<void> {
  const pm = getPackageManagerConfig(options.packageManager);

  const pmIcons: Record<string, string> = {
    npm: "📦",
    yarn: "🧶",
    pnpm: "📦",
    bun: "🥟",
  };

  // Check if this is a workspace and scan all package.json files for problematic packages
  const actualPackageManager = pm.id;

  const actualPm = getPackageManagerConfig(actualPackageManager);
  const actualPmIcon = pmIcons[actualPm.id] || "📦";

  consola.info(`${actualPmIcon} Installing all dependencies with ${actualPm.id}...`);

  try {
    // For Bun, use --ignore-scripts to avoid postinstall script failures
    const installArgs = ["install"];
    if (actualPm.id === "bun") {
      installArgs.push("--ignore-scripts");
      logger.verbose("💡 Using --ignore-scripts flag to avoid postinstall script issues with Bun");
    }

    // For pnpm, check if we're in a workspace and add --ignore-workspace flag
    if (actualPm.id === "pnpm") {
      try {
        // Check if we're in a pnpm workspace by looking for pnpm-workspace.yaml
        const parentPath = path.dirname(options.projectPath);
        const workspaceFile = path.join(parentPath, "pnpm-workspace.yaml");
        if (await fsExtra.pathExists(workspaceFile)) {
          installArgs.push("--ignore-workspace");
          consola.info("💡 Using --ignore-workspace flag as project is inside a pnpm workspace");
        }
      } catch (_error) {
        // Ignore errors when checking for workspace file
      }
    }

    await execa(actualPm.id, installArgs, {
      cwd: options.projectPath,
      stdio: isVerbose() ? "inherit" : "pipe",
    });
    if (!isVerbose()) {
      logger.verbose(`✅ Dependencies installed successfully with ${actualPm.id}`);
    }
  } catch (error) {
    consola.error(`❌ Failed to install dependencies with ${actualPm.id}:`, error);

    // If we already tried npm as a fallback, don't try again
    if (actualPm.id === "npm") {
      throw error;
    }

    // If the original attempt failed and we haven't tried npm yet, try it
    if (pm.id === "bun") {
      try {
        await execa("npm", ["--version"], { stdio: "ignore" });
        consola.info("Attempting fallback to npm...");

        // Track fallback attempt
        await trackFallback("bun_to_npm", {
          originalPackageManager: "bun",
          fallbackPackageManager: "npm",
          packages: "all",
        });

        await execa("npm", ["install"], {
          cwd: options.projectPath,
          stdio: isVerbose() ? "inherit" : "pipe",
        });
        if (!isVerbose()) {
          logger.verbose("✅ Dependencies installed successfully with npm (fallback)");
        }
      } catch (fallbackError) {
        consola.error("Fallback to npm also failed:", fallbackError);

        // Collect the fallback error
        errorCollector.addError(`Fallback npm install for all dependencies`, fallbackError);

        // Track fallback failure
        await trackError("dependency_install_fallback_failed", {
          originalPackageManager: "bun",
          fallbackPackageManager: "npm",
          packages: "all",
          errorMessage:
            fallbackError instanceof Error ? fallbackError.message : String(fallbackError),
        });
        throw error;
      }
    } else {
      throw error;
    }
  }

  // Format all generated code with Prettier after installation
  if (!options.skipFormatting) {
    await formatGeneratedCode(options.projectPath, true);
  }
}

/**
 * Format all generated code with Prettier for consistency
 * @param projectPath - Path to the project
 * @param usePrettier - Whether to use prettier formatting (respects --no-prettier flag)
 */
export async function formatGeneratedCode(
  projectPath: string,
  usePrettier: boolean = true
): Promise<void> {
  if (!usePrettier) {
    consola.info("⏭️  Skipping code formatting (--no-prettier flag)");
    return;
  }

  consola.info("🎨 Formatting generated code with Prettier...");

  try {
    // Create a comprehensive .prettierrc with proper configuration
    const prettierConfigPath = `${projectPath}/.prettierrc`;
    const prettierConfig = {
      semi: true,
      trailingComma: "es5",
      singleQuote: false, // Use double quotes
      printWidth: 100,
      tabWidth: 2,
      useTabs: false,
      arrowParens: "always",
      endOfLine: "lf",
      bracketSpacing: true,
      bracketSameLine: false,
    };
    await fsExtra.writeFile(prettierConfigPath, JSON.stringify(prettierConfig, null, 2));

    // Create .prettierignore to avoid formatting issues
    const prettierIgnorePath = `${projectPath}/.prettierignore`;
    const prettierIgnoreContent = `node_modules/
dist/
build/
coverage/
.next/
.nuxt/
.vercel/
.netlify/
*.min.*
package-lock.json
yarn.lock
pnpm-lock.yaml
bun.lockb`;
    await fsExtra.writeFile(prettierIgnorePath, prettierIgnoreContent);

    // Use npx directly with specific config - more reliable
    consola.info("Formatting files with Prettier...");
    await execa(
      "npx",
      [
        "-y",
        "prettier@latest",
        "--write",
        "**/*.{ts,tsx,js,jsx,json,css,scss,md,html,yml,yaml}",
        "--config",
        ".prettierrc",
        "--ignore-path",
        ".prettierignore",
        "--log-level",
        "warn",
      ],
      {
        cwd: projectPath,
        stdio: "inherit", // Show output so we can see what's happening
      }
    );

    consola.success("✨ Code formatted successfully with Prettier");
  } catch (error) {
    consola.error("❌ Prettier formatting failed:", error);
    consola.warn("⚠️ Code formatting skipped - files may not follow project style guidelines");
  }
}

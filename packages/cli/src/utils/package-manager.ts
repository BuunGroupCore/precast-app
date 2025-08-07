import { consola } from "consola";
import { execa } from "execa";

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
  }
): Promise<void> {
  if (dependencies.length === 0) return;

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

  consola.info(`${pmIcon} Installing dependencies with ${pm.id}...`);
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
          consola.success("Dependencies installed successfully with npm (fallback)");
          return;
        } catch {
          consola.warn("npm not available either, continuing with bun...");
        }
      }
    }

    // For Bun, add --ignore-scripts flag to avoid postinstall script failures
    if (pm.id === "bun" && !args.includes("--ignore-scripts")) {
      args.push("--ignore-scripts");
      consola.info("💡 Using --ignore-scripts flag to avoid postinstall script issues with Bun");
    }

    await execa(pm.id, args, {
      cwd: options.projectPath,
      stdio: "inherit",
    });
    consola.success(`✅ Dependencies installed successfully with ${pm.id}`);
  } catch (error) {
    consola.error(`❌ Failed to install dependencies with ${pm.id}:`, error);

    // If bun failed and npm is available, try fallback
    if (pm.id === "bun") {
      try {
        await execa("npm", ["--version"], { stdio: "ignore" });
        consola.info("Attempting fallback to npm...");
        const npmPm = getPackageManagerConfig("npm");
        const npmArgs = [npmPm.addCommand, ...dependencies];
        if (options.dev) npmArgs.push(npmPm.devFlag);
        if (options.exact) npmArgs.push("--exact");

        await execa("npm", npmArgs, {
          cwd: options.projectPath,
          stdio: "inherit",
        });
        consola.success("Dependencies installed successfully with npm (fallback)");
        return;
      } catch (fallbackError) {
        consola.error("Fallback to npm also failed:", fallbackError);
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
      consola.info("💡 Using --ignore-scripts flag to avoid postinstall script issues with Bun");
    }

    await execa(actualPm.id, installArgs, {
      cwd: options.projectPath,
      stdio: "inherit",
    });
    consola.success(`✅ Dependencies installed successfully with ${actualPm.id}`);
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

        await execa("npm", ["install"], {
          cwd: options.projectPath,
          stdio: "inherit",
        });
        consola.success("✅ Dependencies installed successfully with npm (fallback)");
      } catch (fallbackError) {
        consola.error("Fallback to npm also failed:", fallbackError);
        throw error;
      }
    } else {
      throw error;
    }
  }

  // Format all generated code with Prettier after installation
  if (!options.skipFormatting) {
    await formatGeneratedCode(options.projectPath);
  }
}

/**
 * Format all generated code with Prettier for consistency
 * @param projectPath - Path to the project
 */
export async function formatGeneratedCode(projectPath: string): Promise<void> {
  consola.info("🎨 Formatting generated code with Prettier...");

  try {
    const fs = await import("fs-extra");

    // Create a basic .prettierrc with double quotes for consistency
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
    };
    await fs.writeJSON(prettierConfigPath, prettierConfig, { spaces: 2 });

    // First, ensure prettier is installed
    consola.info("Installing Prettier temporarily for formatting...");
    await execa("npm", ["install", "--no-save", "prettier"], {
      cwd: projectPath,
      stdio: "pipe",
    });

    // Format all relevant files
    const filePatterns = "**/*.{ts,tsx,js,jsx,json,css,scss,md,html,yml,yaml}";

    // Run prettier directly
    await execa("npx", ["prettier", "--write", filePatterns, "--ignore-path", ".gitignore"], {
      cwd: projectPath,
      stdio: "pipe",
    });

    // Remove prettier after formatting
    await execa("npm", ["uninstall", "prettier"], {
      cwd: projectPath,
      stdio: "pipe",
    });

    consola.success("✨ Code formatted successfully");
  } catch {
    // Try a simpler approach with just npx
    try {
      consola.info("Trying alternative formatting approach...");
      await execa("npx", ["-y", "prettier@latest", "--write", ".", "--ignore-path", ".gitignore"], {
        cwd: projectPath,
        stdio: "pipe",
      });
      consola.success("✨ Code formatted successfully");
    } catch (fallbackError) {
      consola.debug("Prettier formatting failed:", fallbackError);
      consola.warn("⚠️ Code formatting skipped - install Prettier manually if needed");
    }
  }
}

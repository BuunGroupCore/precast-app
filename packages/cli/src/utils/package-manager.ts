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

export function getPackageManagerConfig(packageManager: string): PackageManagerConfig {
  const pm = packageManager as PackageManager;
  const config = PACKAGE_MANAGERS[pm];
  if (!config) {
    consola.warn(`Unknown package manager: ${packageManager}, falling back to npm`);
    return PACKAGE_MANAGERS.npm;
  }
  return config;
}

export async function detectPackageManager(): Promise<PackageManager> {
  // Check for lock files in order of preference
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
    // bun not available
  }

  try {
    await execa("pnpm", ["--version"], { stdio: "ignore" });
    return "pnpm";
  } catch {
    // pnpm not available
  }

  try {
    await execa("yarn", ["--version"], { stdio: "ignore" });
    return "yarn";
  } catch {
    // yarn not available
  }

  return "npm"; // fallback
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

  // Get package manager icon
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

        // Try to fallback to npm if available
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
}): Promise<void> {
  const pm = getPackageManagerConfig(options.packageManager);

  // Get package manager icon
  const pmIcons: Record<string, string> = {
    npm: "📦",
    yarn: "🧶",
    pnpm: "📦",
    bun: "🥟",
  };

  // Check if this is a workspace and scan all package.json files for problematic packages
  const shouldFallbackFromBun = false;

  // NOTE: Automatic fallback is disabled since we now use --ignore-scripts with Bun
  // This code is kept for reference but not executed
  /*
  if (pm.id === "bun") {
    try {
      const fs = await import("fs-extra");
      const path = await import("path");

      const problematicPackages = [
        "prisma",
        "@prisma/client",
        "@prisma/engines",
        "esbuild",
        "@esbuild/",
        "sharp",
        "playwright",
        "puppeteer",
        "sqlite3",
        "bcrypt",
        "canvas",
        "node-sass",
        "tsx", // Often causes issues with Bun
        "tsup", // Can have esbuild dependencies
      ];

      // Check root package.json
      const rootPackageJsonPath = `${options.projectPath}/package.json`;
      const packageJsonPaths = [rootPackageJsonPath];

      // Check for workspace structure and add workspace package.json files
      if (await fs.pathExists(rootPackageJsonPath)) {
        const rootPackageJson = await fs.readJSON(rootPackageJsonPath);
        if (rootPackageJson.workspaces) {
          // This is a workspace - check all sub-packages
          const appsDir = path.join(options.projectPath, "apps");
          const packagesDir = path.join(options.projectPath, "packages");

          // Check apps/* directories
          if (await fs.pathExists(appsDir)) {
            const appDirs = await fs.readdir(appsDir);
            for (const appDir of appDirs) {
              const appPackageJson = path.join(appsDir, appDir, "package.json");
              if (await fs.pathExists(appPackageJson)) {
                packageJsonPaths.push(appPackageJson);
              }
            }
          }

          // Check packages/* directories
          if (await fs.pathExists(packagesDir)) {
            const packageDirs = await fs.readdir(packagesDir);
            for (const packageDir of packageDirs) {
              const packagePackageJson = path.join(packagesDir, packageDir, "package.json");
              if (await fs.pathExists(packagePackageJson)) {
                packageJsonPaths.push(packagePackageJson);
              }
            }
          }
        }
      }

      // Scan all package.json files for problematic packages
      for (const packageJsonPath of packageJsonPaths) {
        if (await fs.pathExists(packageJsonPath)) {
          const packageJson = await fs.readJSON(packageJsonPath);
          const allDeps = {
            ...packageJson.dependencies,
            ...packageJson.devDependencies,
          };

          const foundProblematic = problematicPackages.some((pkg) =>
            pkg.endsWith("/")
              ? Object.keys(allDeps).some((dep) => dep.startsWith(pkg))
              : allDeps[pkg]
          );

          if (foundProblematic) {
            const problemPackages = problematicPackages.filter((pkg) =>
              pkg.endsWith("/")
                ? Object.keys(allDeps).some((dep) => dep.startsWith(pkg))
                : allDeps[pkg]
            );
            consola.warn(
              `🚨 Detected packages with known Bun postinstall issues: ${problemPackages.join(", ")}`
            );
            consola.info("💡 Automatically using npm for better compatibility");
            consola.info("📝 Note: These packages require Node.js for postinstall scripts");
            shouldFallbackFromBun = true;
            break;
          }
        }
      }
    } catch (error) {
      consola.debug("Error checking for problematic packages:", error);
      // If we can't read package.json files, continue with normal flow
    }
  }
  */

  // If we detected problematic packages, use npm instead of bun immediately
  let actualPackageManager = pm.id;
  if (pm.id === "bun" && shouldFallbackFromBun) {
    try {
      await execa("npm", ["--version"], { stdio: "ignore" });
      actualPackageManager = "npm";
      consola.info("🔄 Using npm instead of bun to avoid postinstall script issues...");
    } catch {
      consola.warn("npm not available, will attempt bun but expect failures...");
    }
  }

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
        return;
      } catch (fallbackError) {
        consola.error("Fallback to npm also failed:", fallbackError);
      }
    }

    throw error;
  }
}

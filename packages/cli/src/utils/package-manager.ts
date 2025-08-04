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
  
  consola.info(`Installing dependencies with ${pm.id}...`);
  consola.debug(`Command: ${pm.id} ${args.join(" ")}`);
  
  try {
    await execa(pm.id, args, {
      cwd: options.projectPath,
      stdio: "inherit",
    });
    consola.success(`Dependencies installed successfully with ${pm.id}`);
  } catch (error) {
    consola.error(`Failed to install dependencies with ${pm.id}:`, error);
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
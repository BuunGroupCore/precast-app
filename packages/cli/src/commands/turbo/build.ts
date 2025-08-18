import { execSync, spawn } from "child_process";
import path from "path";

import { consola } from "consola";
import fsExtra from "fs-extra";

import { TurboDashboard, type TurboTask } from "@/utils/ui/turbo-dashboard.js";

const { pathExists, readJson } = fsExtra;

interface TurboBuildOptions {
  filter?: string[];
  parallel?: boolean;
  cache?: boolean;
  force?: boolean;
  outputLogs?: "full" | "errors-only" | "new-only";
  dashboard?: boolean;
}

interface TurboConfig {
  pipeline?: Record<
    string,
    {
      dependsOn?: string[];
      outputs?: string[];
      inputs?: string[];
    }
  >;
  tasks?: Record<
    string,
    {
      dependsOn?: string[];
      outputs?: string[];
      inputs?: string[];
    }
  >;
}

interface PackageJson {
  name: string;
  scripts?: Record<string, string>;
  workspaces?: string[] | { packages: string[] };
}

/**
 * Enhanced Turbo build command with beautiful TUI dashboard
 */
export async function turboBuildCommand(options: TurboBuildOptions = {}): Promise<void> {
  try {
    // Check if this is a Turbo monorepo
    const turboBuildPath = path.join(process.cwd(), "turbo.json");
    const packageJsonPath = path.join(process.cwd(), "package.json");

    if (!(await pathExists(turboBuildPath))) {
      consola.error("[ERR] turbo.json not found - this doesn't appear to be a Turbo monorepo");
      consola.info("[INFO] Run 'npx turbo init' to set up Turbo in this repository");
      process.exit(1);
    }

    if (!(await pathExists(packageJsonPath))) {
      consola.error("[ERR] package.json not found in root directory");
      process.exit(1);
    }

    // Read configuration
    const turboConfig: TurboConfig = await readJson(turboBuildPath);
    const packageJson: PackageJson = await readJson(packageJsonPath);

    // Detect workspaces and build tasks
    const workspaces = await detectWorkspaces(packageJson);
    const buildTasks = await detectBuildTasks(workspaces, turboConfig);

    if (buildTasks.length === 0) {
      consola.warn("[WARN] No build tasks found in workspace packages");
      consola.info("[INFO] Make sure your packages have 'build' scripts defined");
      return;
    }

    // Use dashboard if enabled (default for interactive terminals)
    if (options.dashboard !== false && process.stdout.isTTY) {
      await runWithDashboard(buildTasks, options);
    } else {
      await runWithSimpleLogs(buildTasks, options);
    }
  } catch (error) {
    consola.error("[ERR] Turbo build failed:", error);
    process.exit(1);
  }
}

/**
 * Run builds with the enhanced dashboard TUI
 */
async function runWithDashboard(
  buildTasks: TurboTask[],
  options: TurboBuildOptions
): Promise<void> {
  const dashboard = new TurboDashboard({
    showOutput: true,
    maxOutputLines: 15,
    refreshRate: 1000, // Only refresh every second, rely on change detection
  });

  // Add all tasks to dashboard
  buildTasks.forEach((task) => {
    dashboard.addTask({
      id: task.id,
      name: task.name,
      status: "pending",
    });
  });

  // Start dashboard
  dashboard.start();

  try {
    // Build command arguments
    const args = buildTurboBuildArgs(options);
    const command = `npx turbo build ${args.join(" ")}`;

    dashboard.addOutput("system", `[BUILD] Starting: ${command}`);
    dashboard.addOutput("system", `[INFO] Found ${buildTasks.length} packages to build`);

    // Execute turbo build with real-time parsing
    await executeWithDashboard(command, dashboard, buildTasks);

    // Show final summary
    const completed = dashboard.getCompletedTasks();
    const failed = completed.filter((t) => t.status === "error");

    dashboard.addOutput("system", "");
    dashboard.addOutput("system", "[SUMMARY] Build Complete");
    dashboard.addOutput("system", `[STATS] Completed: ${completed.length}/${buildTasks.length}`);

    if (failed.length > 0) {
      dashboard.addOutput("system", `[ERROR] Failed: ${failed.length} packages`);
      failed.forEach((task) => {
        dashboard.addOutput("system", `[FAIL] ${task.name}`);
      });
    } else {
      dashboard.addOutput("system", "[SUCCESS] All packages built successfully!");
    }

    // Keep dashboard open for a moment to show results
    await new Promise((resolve) => setTimeout(resolve, 2000));
  } finally {
    dashboard.stop();
  }

  // Exit with error code if any builds failed
  const failedTasks = dashboard.getCompletedTasks().filter((t) => t.status === "error");
  if (failedTasks.length > 0) {
    process.exit(1);
  }
}

/**
 * Execute Turbo build with dashboard integration
 */
async function executeWithDashboard(
  command: string,
  dashboard: TurboDashboard,
  tasks: TurboTask[]
): Promise<void> {
  return new Promise((resolve, reject) => {
    const child = spawn("bash", ["-c", command], {
      cwd: process.cwd(),
      stdio: "pipe",
    });

    let currentTask: string | null = null;
    const taskMap = new Map(tasks.map((t) => [t.name.split(":")[0], t.id]));

    child.stdout?.on("data", (data) => {
      const lines = data.toString().split("\n").filter(Boolean);

      lines.forEach((line: string) => {
        const cleanLine = line.trim();
        if (!cleanLine) return;

        // Parse different Turbo output patterns

        // 1. Task starting: "packagename:build: cache miss, executing abc123"
        const taskStartMatch = cleanLine.match(
          /^(.+?):(build|dev|test):\s*(cache miss, executing|started)/i
        );
        if (taskStartMatch) {
          const packageName = taskStartMatch[1];
          const taskId = taskMap.get(packageName);

          if (taskId && currentTask !== taskId) {
            currentTask = taskId;
            dashboard.updateTask(taskId, {
              status: "running",
              startTime: new Date(),
            });
            dashboard.addOutput(taskId, `[START] Building ${packageName}...`);
          }
        }

        // 2. Task completion: "packagename:build: finished in 1.2s"
        const taskCompleteMatch = cleanLine.match(
          /^(.+?):(build|dev|test):\s*(finished|completed|done)/i
        );
        if (taskCompleteMatch) {
          const packageName = taskCompleteMatch[1];
          const taskId = taskMap.get(packageName);

          if (taskId) {
            dashboard.updateTask(taskId, {
              status: "success",
              endTime: new Date(),
            });
            dashboard.addOutput(taskId, `[COMPLETE] Build finished`);
          }
        }

        // 3. Cache hits: "packagename:build: cached"
        const cacheHitMatch = cleanLine.match(/^(.+?):(build|dev|test):\s*cached/i);
        if (cacheHitMatch) {
          const packageName = cacheHitMatch[1];
          const taskId = taskMap.get(packageName);

          if (taskId) {
            dashboard.updateTask(taskId, {
              status: "success",
              endTime: new Date(),
            });
            dashboard.addOutput(taskId, "[CACHE] Used cached result ⚡");
          }
        }

        // 4. Task errors: Look for error patterns
        if (
          cleanLine.includes("ERROR") ||
          cleanLine.includes("Failed") ||
          cleanLine.includes("error")
        ) {
          const errorTaskMatch = cleanLine.match(/^(.+?):(build|dev|test)/);
          if (errorTaskMatch) {
            const packageName = errorTaskMatch[1];
            const taskId = taskMap.get(packageName);
            if (taskId) {
              dashboard.updateTask(taskId, {
                status: "error",
                endTime: new Date(),
              });
            }
          }
        }

        // Add output (but filter out repetitive system messages)
        if (
          !cleanLine.includes("Remote caching disabled") &&
          !cleanLine.includes("Packages in scope") &&
          !cleanLine.includes("Running build in")
        ) {
          const outputTarget = currentTask || "system";
          dashboard.addOutput(outputTarget, cleanLine);
        }
      });
    });

    child.stderr?.on("data", (data) => {
      const lines = data.toString().split("\n").filter(Boolean);
      lines.forEach((line: string) => {
        const cleanLine = line.trim();

        // Check for task errors
        const errorMatch = cleanLine.match(/(@[\w-]+\/[\w-]+|\w+):(build|dev|test).*error/i);
        if (errorMatch) {
          const packageName = errorMatch[1];
          const taskId = taskMap.get(packageName);
          if (taskId) {
            dashboard.updateTask(taskId, {
              status: "error",
              endTime: new Date(),
            });
          }
        }

        const outputTarget = currentTask || "system";
        dashboard.addOutput(outputTarget, `[ERROR] ${cleanLine}`);
      });
    });

    child.on("close", (code) => {
      // Mark final task as complete
      if (currentTask) {
        dashboard.updateTask(currentTask, {
          status: code === 0 ? "success" : "error",
          endTime: new Date(),
        });
      }

      // Mark any remaining pending tasks based on build result
      tasks.forEach((task) => {
        const dashboardTask = dashboard["tasks"].get(task.id);
        if (dashboardTask?.status === "pending") {
          // If build succeeded, mark remaining as success (likely cached)
          // If build failed, mark as skipped
          dashboard.updateTask(task.id, {
            status: code === 0 ? "success" : "skipped",
            endTime: new Date(),
          });
        }
      });

      dashboard.addOutput("system", "");
      dashboard.addOutput(
        "system",
        code === 0 ? "[SUCCESS] Build completed!" : "[ERROR] Build failed!"
      );

      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Build failed with exit code ${code}`));
      }
    });

    child.on("error", (error) => {
      dashboard.addOutput("system", `[ERROR] Process error: ${error.message}`);
      reject(error);
    });
  });
}

/**
 * Run builds with simple console logs (fallback)
 */
async function runWithSimpleLogs(
  buildTasks: TurboTask[],
  options: TurboBuildOptions
): Promise<void> {
  consola.info(`[BUILD] Starting Turbo build for ${buildTasks.length} packages...`);

  const args = buildTurboBuildArgs(options);
  const command = `npx turbo build ${args.join(" ")}`;

  consola.info(`[CMD] ${command}`);

  try {
    execSync(command, {
      stdio: "inherit",
      cwd: process.cwd(),
    });
    consola.success("[OK] All builds completed successfully!");
  } catch (error) {
    consola.error("[ERR] Build failed");
    throw error;
  }
}

/**
 * Detect workspace packages
 */
async function detectWorkspaces(packageJson: PackageJson): Promise<string[]> {
  let workspacePatterns: string[] = [];

  if (packageJson.workspaces) {
    if (Array.isArray(packageJson.workspaces)) {
      workspacePatterns = packageJson.workspaces;
    } else if (packageJson.workspaces.packages) {
      workspacePatterns = packageJson.workspaces.packages;
    }
  }

  // Default patterns for common monorepo structures
  if (workspacePatterns.length === 0) {
    workspacePatterns = ["packages/*", "apps/*"];
  }

  const workspaces: string[] = [];

  for (const pattern of workspacePatterns) {
    // Handle glob patterns like "apps/*" and "packages/*"
    const globPath = pattern.replace("*", "");
    const basePath = path.join(process.cwd(), globPath);

    try {
      const dirs = await fsExtra.readdir(basePath);
      for (const dir of dirs) {
        const packagePath = path.join(basePath, dir, "package.json");
        if (await pathExists(packagePath)) {
          const pkg = await readJson(packagePath);
          if (pkg.name && pkg.scripts?.build) {
            // Only include packages that have a build script
            workspaces.push(pkg.name);
          }
        }
      }
    } catch (error) {
      // Directory doesn't exist or can't read, skip silently
      if (process.env.DEBUG) {
        consola.debug(`[DEBUG] Could not read workspace pattern ${pattern}:`, error);
      }
    }
  }

  if (workspaces.length === 0) {
    consola.warn("[WARN] No workspace packages found with build scripts");
    consola.info("[INFO] Checked patterns:", workspacePatterns.join(", "));
  }

  return workspaces;
}

/**
 * Detect build tasks from workspaces
 */
async function detectBuildTasks(
  workspaces: string[],
  turboConfig: TurboConfig
): Promise<TurboTask[]> {
  const tasks: TurboTask[] = [];

  // Check if 'build' task is defined in turbo pipeline or tasks
  const taskConfig = turboConfig.tasks || turboConfig.pipeline || {};

  if (!taskConfig.build) {
    consola.warn("[WARN] No 'build' task found in turbo.json");
    consola.info("[INFO] Available tasks:", Object.keys(taskConfig).join(", "));
    return tasks;
  }

  workspaces.forEach((workspace) => {
    tasks.push({
      id: workspace.replace(/[@/]/g, "_"),
      name: `${workspace}:build`,
      status: "pending",
      output: [],
    });
  });

  return tasks;
}

/**
 * Build Turbo command arguments
 */
function buildTurboBuildArgs(options: TurboBuildOptions): string[] {
  const args: string[] = [];

  if (options.filter && options.filter.length > 0) {
    args.push(`--filter=${options.filter.join(",")}`);
  }

  if (options.parallel === false) {
    args.push("--concurrency=1");
  }

  if (options.force) {
    args.push("--force");
  }

  if (options.outputLogs) {
    args.push(`--output-logs=${options.outputLogs}`);
  }

  return args;
}

// Demo/test function
export async function runTurboDashboardDemo(): Promise<void> {
  const dashboard = new TurboDashboard();

  dashboard.addTask({ id: "ui", name: "@repo/ui:build", status: "pending" });
  dashboard.addTask({ id: "web", name: "@repo/web:build", status: "pending" });
  dashboard.addTask({ id: "api", name: "@repo/api:build", status: "pending" });

  dashboard.start();

  // Simulate build process
  await new Promise((resolve) => setTimeout(resolve, 1000));
  dashboard.updateTask("ui", { status: "running", startTime: new Date() });
  dashboard.addOutput("ui", "Installing dependencies...");

  await new Promise((resolve) => setTimeout(resolve, 2000));
  dashboard.addOutput("ui", "Building TypeScript...");
  dashboard.addOutput("ui", "Generating types...");

  await new Promise((resolve) => setTimeout(resolve, 1500));
  dashboard.updateTask("ui", { status: "success", endTime: new Date() });
  dashboard.updateTask("web", { status: "running", startTime: new Date() });
  dashboard.addOutput("web", "Building Next.js app...");

  await new Promise((resolve) => setTimeout(resolve, 3000));
  dashboard.updateTask("web", { status: "success", endTime: new Date() });
  dashboard.updateTask("api", { status: "running", startTime: new Date() });

  await new Promise((resolve) => setTimeout(resolve, 2000));
  dashboard.updateTask("api", { status: "success", endTime: new Date() });

  await new Promise((resolve) => setTimeout(resolve, 2000));
  dashboard.stop();
}

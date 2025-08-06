import { execSync } from "child_process";
import { existsSync, rmSync } from "fs";
import path from "path";

export interface CLITestResult {
  exitCode: number;
  stdout: string;
  stderr: string;
}

/**
 * Run the CLI with given arguments and capture output
 * @param args - CLI arguments
 * @param options - Execution options
 * @returns CLI execution result
 */
export function runCLI(args: string[], options?: { cwd?: string }): CLITestResult {
  const cliPath = path.resolve(process.cwd(), "dist/cli.js");
  const command = `${process.execPath} ${cliPath} ${args.join(" ")}`;

  try {
    const stdout = execSync(command, {
      cwd: options?.cwd || process.cwd(),
      encoding: "utf8",
      stdio: "pipe",
    });

    return {
      exitCode: 0,
      stdout,
      stderr: "",
    };
  } catch (error: any) {
    return {
      exitCode: error.status || 1,
      stdout: error.stdout || "",
      stderr: error.stderr || error.message || "",
    };
  }
}

/**
 * Clean up test projects by removing directories
 * @param projectNames - List of project directories to remove
 */
export function cleanupTestProjects(projectNames: string[]) {
  for (const name of projectNames) {
    if (existsSync(name)) {
      rmSync(name, { recursive: true, force: true });
    }
  }
}

/**
 * Check if a project exists and has a package.json
 * @param name - Project directory name
 * @returns True if project exists
 */
export function projectExists(name: string): boolean {
  return existsSync(name) && existsSync(path.join(name, "package.json"));
}

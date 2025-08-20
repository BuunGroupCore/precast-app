import { exec } from "child_process";
import { existsSync } from "fs";
import { readFile } from "fs/promises";
import path from "path";
import { promisify } from "util";

import type { TestCombination } from "../config/test-matrix.js";

const execAsync = promisify(exec);

/**
 * Result from running a CLI command
 */
export interface CLIResult {
  exitCode: number;
  stdout: string;
  stderr: string;
  duration: number;
}

/**
 * Result from validating a generated project
 */
export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * CLITestRunner wraps the CLI for testing purposes.
 * Handles command execution, project generation, and validation.
 */
export class CLITestRunner {
  private cliPath: string;

  constructor() {
    this.cliPath = path.resolve(__dirname, "../../dist/cli.js");

    if (!existsSync(this.cliPath)) {
      throw new Error(`CLI not built. Expected at: ${this.cliPath}`);
    }
  }

  /**
   * Runs a CLI command with the specified arguments.
   * @param args - Command line arguments
   * @param options - Execution options (cwd, timeout, env)
   * @returns CLI execution result
   */
  async runCommand(
    args: string[],
    options: {
      cwd?: string;
      timeout?: number;
      env?: Record<string, string>;
    } = {}
  ): Promise<CLIResult> {
    const startTime = Date.now();
    const command = `node ${this.cliPath} ${args.join(" ")}`;

    try {
      const { stdout, stderr } = await execAsync(command, {
        cwd: options.cwd || process.cwd(),
        timeout: options.timeout || 30000,
        env: {
          ...process.env,
          NODE_ENV: "test",
          PRECAST_TEST_MODE: "true",
          FORCE_COLOR: "0",
          ...options.env,
        },
      });

      return {
        exitCode: 0,
        stdout,
        stderr,
        duration: Date.now() - startTime,
      };
    } catch (error: unknown) {
      const execError = error as any;
      return {
        exitCode: execError.code || 1,
        stdout: execError.stdout || "",
        stderr: execError.stderr || execError.message || String(error),
        duration: Date.now() - startTime,
      };
    }
  }

  /**
   * Generates a project using the CLI with specified configuration.
   * @param projectName - Name of the project to generate
   * @param combination - Test combination configuration
   * @param workingDir - Directory to generate project in
   * @param options - Generation options (install flag)
   * @returns CLI execution result
   */
  async generateProject(
    projectName: string,
    combination: TestCombination,
    workingDir: string,
    options: { install?: boolean; packageManager?: string } = {}
  ): Promise<CLIResult> {
    const args = [
      "init",
      projectName,
      `--framework=${combination.framework}`,
      `--backend=${combination.backend}`,
      `--database=${combination.database}`,
      `--orm=${combination.orm}`,
      `--styling=${combination.styling}`,
      `--runtime=${combination.runtime}`,
      combination.typescript ? "" : "--no-typescript",
      "--no-git",
      options.install ? "--install" : "",
      options.packageManager ? `--pm=${options.packageManager}` : "",
      "--yes",
    ].filter(Boolean);

    const timeout = options.install
      ? combination.expectedDuration + 120000
      : combination.expectedDuration + 10000;

    return this.runCommand(args, {
      cwd: workingDir,
      timeout,
    });
  }

  /**
   * Validates a generated project structure and configuration.
   * @param projectPath - Path to the generated project
   * @param combination - Test combination to validate against
   * @returns Validation result with errors and warnings
   */
  async validateProject(
    projectPath: string,
    combination: TestCombination
  ): Promise<ValidationResult> {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!existsSync(projectPath)) {
      errors.push(`Project directory does not exist: ${projectPath}`);
      return { valid: false, errors, warnings };
    }

    const packageJsonPath = path.join(projectPath, "package.json");
    if (!existsSync(packageJsonPath)) {
      errors.push("package.json not found");
    } else {
      try {
        const packageJson = JSON.parse(await readFile(packageJsonPath, "utf8"));

        if (!packageJson.name) {
          errors.push("package.json missing name field");
        }

        if (!packageJson.scripts) {
          warnings.push("package.json missing scripts field");
        }
      } catch (error) {
        errors.push(`Invalid package.json: ${error}`);
      }
    }

    await this.validateFrameworkFiles(projectPath, combination, errors, warnings);
    await this.validateBackendFiles(projectPath, combination, errors, warnings);

    return {
      valid: errors.length === 0,
      errors,
      warnings,
    };
  }

  private async validateFrameworkFiles(
    projectPath: string,
    combination: TestCombination,
    errors: string[],
    _warnings: string[]
  ): Promise<void> {
    const { framework, backend } = combination;

    // Determine if this is a monorepo structure
    const isMonorepo = backend !== "none" && backend !== "next-api";
    const webPath = isMonorepo ? path.join(projectPath, "apps", "web") : projectPath;

    switch (framework) {
      case "react":
        if (
          !existsSync(path.join(webPath, "src", "App.tsx")) &&
          !existsSync(path.join(webPath, "src", "App.jsx"))
        ) {
          errors.push("React App component not found");
        }
        break;

      case "next":
        if (
          !existsSync(path.join(webPath, "next.config.js")) &&
          !existsSync(path.join(webPath, "next.config.mjs"))
        ) {
          errors.push("Next.js config not found");
        }
        break;

      case "vue":
        if (!existsSync(path.join(webPath, "src", "App.vue"))) {
          errors.push("Vue App component not found");
        }
        break;

      case "vanilla":
        if (!existsSync(path.join(webPath, "index.html"))) {
          errors.push("Vanilla HTML index file not found");
        }
        break;
    }
  }

  private async validateBackendFiles(
    projectPath: string,
    combination: TestCombination,
    errors: string[],
    _warnings: string[]
  ): Promise<void> {
    const { backend } = combination;

    if (backend === "none") return;

    const apiPath =
      backend === "next-api"
        ? path.join(projectPath, "src", "pages", "api")
        : path.join(projectPath, "apps", "api");

    if (backend === "next-api") {
      // Next.js API routes
      if (!existsSync(apiPath)) {
        _warnings.push("Next.js API directory not found");
      }
    } else {
      // Separate backend
      if (!existsSync(apiPath)) {
        errors.push(`Backend directory not found: ${apiPath}`);
      } else {
        const backendPackageJson = path.join(apiPath, "package.json");
        if (!existsSync(backendPackageJson)) {
          errors.push("Backend package.json not found");
        }
      }
    }
  }
}

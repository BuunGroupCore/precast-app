import { exec } from "child_process";
import { existsSync } from "fs";
import path from "path";
import { promisify } from "util";

const execAsync = promisify(exec);

export interface QualityCheckResult {
  passed: boolean;
  typeCheck?: {
    passed: boolean;
    errors: string[];
    output: string;
  };
  lintCheck?: {
    passed: boolean;
    errors: string[];
    warnings: string[];
    output: string;
  };
  prettierCheck?: {
    passed: boolean;
    unformattedFiles: string[];
    output: string;
  };
  installCheck?: {
    passed: boolean;
    errors: string[];
    output: string;
  };
  buildCheck?: {
    passed: boolean;
    errors: string[];
    output: string;
  };
}

export class ProjectQualityValidator {
  async runFullQualityCheck(
    projectPath: string,
    options: {
      skipInstall?: boolean;
      skipTypeCheck?: boolean;
      skipLint?: boolean;
      skipPrettier?: boolean;
      skipBuild?: boolean;
      timeout?: number;
    } = {}
  ): Promise<QualityCheckResult> {
    const result: QualityCheckResult = {
      passed: true,
    };

    // First, install dependencies if not skipped
    if (!options.skipInstall) {
      console.info(`Installing dependencies for ${projectPath}...`);
      result.installCheck = await this.checkInstall(projectPath, options.timeout);
      if (!result.installCheck?.passed) {
        result.passed = false;
        return result; // Can't continue without dependencies
      }
    }

    // Run all quality checks in parallel where possible
    const checks = await Promise.all([
      !options.skipTypeCheck ? this.checkTypeScript(projectPath, options.timeout) : null,
      !options.skipLint ? this.checkLinting(projectPath, options.timeout) : null,
      !options.skipPrettier ? this.checkFormatting(projectPath, options.timeout) : null,
      !options.skipBuild ? this.checkBuild(projectPath, options.timeout) : null,
    ]);

    // Assign results
    if (checks[0]) {
      result.typeCheck = checks[0];
      if (!checks[0].passed) result.passed = false;
    }
    if (checks[1]) {
      result.lintCheck = checks[1];
      if (!checks[1].passed) result.passed = false;
    }
    if (checks[2]) {
      result.prettierCheck = checks[2];
      if (!checks[2].passed) result.passed = false;
    }
    if (checks[3]) {
      result.buildCheck = checks[3];
      if (!checks[3].passed) result.passed = false;
    }

    return result;
  }

  private async checkInstall(
    projectPath: string,
    timeout: number = 120000
  ): Promise<QualityCheckResult["installCheck"]> {
    try {
      // Detect package manager
      const packageManager = await this.detectPackageManager(projectPath);
      const installCommand = this.getInstallCommand(packageManager);

      const { stdout, stderr } = await execAsync(installCommand, {
        cwd: projectPath,
        timeout,
        env: {
          ...process.env,
          CI: "true",
          FORCE_COLOR: "0",
        },
      });

      // Check if node_modules exists
      const nodeModulesExists = existsSync(path.join(projectPath, "node_modules"));

      // Check for monorepo structure
      const isMonorepo = existsSync(path.join(projectPath, "apps"));
      if (isMonorepo) {
        const webModules = existsSync(path.join(projectPath, "apps", "web", "node_modules"));
        const apiModules = existsSync(path.join(projectPath, "apps", "api", "node_modules"));

        if (!nodeModulesExists && !webModules && !apiModules) {
          return {
            passed: false,
            errors: ["No node_modules found after installation"],
            output: stdout + stderr,
          };
        }
      } else if (!nodeModulesExists) {
        return {
          passed: false,
          errors: ["No node_modules found after installation"],
          output: stdout + stderr,
        };
      }

      return {
        passed: true,
        errors: [],
        output: stdout,
      };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      return {
        passed: false,
        errors: [`Installation failed: ${errorMessage}`],
        output: errorMessage,
      };
    }
  }

  private async checkTypeScript(
    projectPath: string,
    timeout: number = 60000
  ): Promise<QualityCheckResult["typeCheck"]> {
    try {
      // Check if TypeScript is configured
      const tsconfigPath = path.join(projectPath, "tsconfig.json");
      if (!existsSync(tsconfigPath)) {
        // Not a TypeScript project, skip
        return {
          passed: true,
          errors: [],
          output: "Not a TypeScript project",
        };
      }

      const { stdout, stderr } = await execAsync("npx tsc --noEmit", {
        cwd: projectPath,
        timeout,
        env: {
          ...process.env,
          FORCE_COLOR: "0",
        },
      });

      // Parse TypeScript errors
      const errors = this.parseTypeScriptErrors(stderr || stdout);

      return {
        passed: errors.length === 0,
        errors,
        output: stdout + stderr,
      };
    } catch (error: unknown) {
      const errorOutput =
        error instanceof Error && "stdout" in error
          ? String((error as unknown as { stdout: string }).stdout) +
            String((error as unknown as { stderr: string }).stderr)
          : String(error);

      const errors = this.parseTypeScriptErrors(errorOutput);

      return {
        passed: false,
        errors: errors.length > 0 ? errors : ["TypeScript check failed"],
        output: errorOutput,
      };
    }
  }

  private async checkLinting(
    projectPath: string,
    timeout: number = 60000
  ): Promise<QualityCheckResult["lintCheck"]> {
    try {
      // Check for ESLint config
      const hasEslint =
        existsSync(path.join(projectPath, ".eslintrc")) ||
        existsSync(path.join(projectPath, ".eslintrc.json")) ||
        existsSync(path.join(projectPath, "eslint.config"));

      if (!hasEslint) {
        return {
          passed: true,
          errors: [],
          warnings: [],
          output: "No ESLint configuration found",
        };
      }

      const { stdout, stderr } = await execAsync("npx eslint . --format json", {
        cwd: projectPath,
        timeout,
        env: {
          ...process.env,
          FORCE_COLOR: "0",
        },
      });

      // Parse ESLint JSON output
      const results = JSON.parse(stdout || "[]");
      const errors: string[] = [];
      const warnings: string[] = [];

      results.forEach(
        (file: {
          filePath: string;
          messages?: Array<{ message: string; ruleId: string; severity: number }>;
        }) => {
          file.messages?.forEach((message) => {
            const msg = `${file.filePath}: ${message.message} (${message.ruleId})`;
            if (message.severity === 2) {
              errors.push(msg);
            } else {
              warnings.push(msg);
            }
          });
        }
      );

      return {
        passed: errors.length === 0,
        errors,
        warnings,
        output: stderr,
      };
    } catch (error: unknown) {
      // ESLint returns non-zero exit code when there are errors
      const errorOutput =
        error instanceof Error && "stdout" in error
          ? String((error as unknown as { stdout: string }).stdout)
          : "";

      try {
        const results = JSON.parse(errorOutput || "[]");
        const errors: string[] = [];
        const warnings: string[] = [];

        results.forEach(
          (file: {
            filePath: string;
            messages?: Array<{ message: string; ruleId: string; severity: number }>;
          }) => {
            file.messages?.forEach((message) => {
              const msg = `${file.filePath}: ${message.message} (${message.ruleId})`;
              if (message.severity === 2) {
                errors.push(msg);
              } else {
                warnings.push(msg);
              }
            });
          }
        );

        return {
          passed: errors.length === 0,
          errors,
          warnings,
          output: "",
        };
      } catch {
        return {
          passed: false,
          errors: ["ESLint check failed"],
          warnings: [],
          output: String(error),
        };
      }
    }
  }

  private async checkFormatting(
    projectPath: string,
    timeout: number = 60000
  ): Promise<QualityCheckResult["prettierCheck"]> {
    try {
      // Check for Prettier config
      const hasPrettier =
        existsSync(path.join(projectPath, ".prettierrc")) ||
        existsSync(path.join(projectPath, ".prettierrc")) ||
        existsSync(path.join(projectPath, ".prettierrc.json"));

      if (!hasPrettier) {
        return {
          passed: true,
          unformattedFiles: [],
          output: "No Prettier configuration found",
        };
      }

      const { stdout } = await execAsync("npx prettier --check .", {
        cwd: projectPath,
        timeout,
        env: {
          ...process.env,
          FORCE_COLOR: "0",
        },
      });

      return {
        passed: true,
        unformattedFiles: [],
        output: stdout,
      };
    } catch (error: unknown) {
      // Prettier returns non-zero exit code when files need formatting
      const errorOutput =
        error instanceof Error && "stdout" in error
          ? String((error as unknown as { stdout: string }).stdout)
          : String(error);

      // Parse unformatted files from output
      const unformattedFiles = errorOutput
        .split("\n")
        .filter((line) => line.includes("[warn]"))
        .map((line) => line.replace("[warn]", "").trim());

      return {
        passed: false,
        unformattedFiles,
        output: errorOutput,
      };
    }
  }

  private async checkBuild(
    projectPath: string,
    timeout: number = 120000
  ): Promise<QualityCheckResult["buildCheck"]> {
    try {
      // Check if build script exists
      const packageJsonPath = path.join(projectPath, "package.json");
      if (!existsSync(packageJsonPath)) {
        return {
          passed: true,
          errors: [],
          output: "No package.json found",
        };
      }

      const { readFileSync } = await import("fs");
      const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf8"));
      if (!packageJson.scripts?.build) {
        return {
          passed: true,
          errors: [],
          output: "No build script found",
        };
      }

      const { stdout, stderr } = await execAsync("npm run build", {
        cwd: projectPath,
        timeout,
        env: {
          ...process.env,
          CI: "true",
          FORCE_COLOR: "0",
        },
      });

      // Check if build output exists
      const distExists =
        existsSync(path.join(projectPath, "dist")) ||
        existsSync(path.join(projectPath, "build")) ||
        existsSync(path.join(projectPath, ".next"));

      if (!distExists) {
        return {
          passed: false,
          errors: ["No build output found"],
          output: stdout + stderr,
        };
      }

      return {
        passed: true,
        errors: [],
        output: stdout,
      };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      return {
        passed: false,
        errors: [`Build failed: ${errorMessage}`],
        output: errorMessage,
      };
    }
  }

  private async detectPackageManager(projectPath: string): Promise<string> {
    if (existsSync(path.join(projectPath, "bun.lockb"))) return "bun";
    if (existsSync(path.join(projectPath, "pnpm-lock.yaml"))) return "pnpm";
    if (existsSync(path.join(projectPath, "yarn.lock"))) return "yarn";
    return "npm";
  }

  private getInstallCommand(packageManager: string): string {
    switch (packageManager) {
      case "bun":
        return "bun install";
      case "pnpm":
        return "pnpm install";
      case "yarn":
        return "yarn install";
      default:
        return "npm install";
    }
  }

  private parseTypeScriptErrors(output: string): string[] {
    const errors: string[] = [];
    const lines = output.split("\n");

    lines.forEach((line) => {
      // Match TypeScript error format: file.ts(line,col): error TS####: message
      if (line.includes("error TS")) {
        errors.push(line.trim());
      }
    });

    return errors;
  }
}

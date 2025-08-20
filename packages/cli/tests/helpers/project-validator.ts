import { existsSync } from "fs";
import { readFile } from "fs/promises";
import path from "path";

import type { ProjectFixture, ValidationRule } from "../fixtures";

/**
 * Detailed validation result with passed and failed rules
 */
export interface DetailedValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  passedRules: ValidationRule[];
  failedRules: ValidationRule[];
}

/**
 * ProjectValidator validates generated project structure against fixtures.
 * Checks files, dependencies, scripts, and custom validation rules.
 */
export class ProjectValidator {
  /**
   * Validates a project against a fixture definition.
   * @param projectPath - Path to the generated project
   * @param fixture - Expected project structure and rules
   * @returns Detailed validation results
   */
  async validateProject(
    projectPath: string,
    fixture: ProjectFixture
  ): Promise<DetailedValidationResult> {
    const result: DetailedValidationResult = {
      valid: true,
      errors: [],
      warnings: [],
      passedRules: [],
      failedRules: [],
    };

    if (!existsSync(projectPath)) {
      result.errors.push(`Project directory does not exist: ${projectPath}`);
      result.valid = false;
      return result;
    }

    for (const expectedFile of fixture.expectedFiles) {
      const filePath = path.join(projectPath, expectedFile);
      if (!existsSync(filePath)) {
        result.errors.push(`Expected file missing: ${expectedFile}`);
        result.valid = false;
      }
    }

    for (const rule of fixture.validationRules) {
      try {
        const ruleResult = await this.validateRule(projectPath, rule);
        if (ruleResult.passed) {
          result.passedRules.push(rule);
        } else {
          result.failedRules.push(rule);
          result.errors.push(ruleResult.error || `Rule failed: ${rule.description}`);
          result.valid = false;
        }
      } catch (error) {
        result.failedRules.push(rule);
        result.errors.push(`Rule validation error: ${rule.description} - ${error}`);
        result.valid = false;
      }
    }

    const packageJsonPath = path.join(projectPath, "package.json");
    if (existsSync(packageJsonPath)) {
      try {
        const packageValidation = await this.validatePackageJson(packageJsonPath, fixture);
        result.errors.push(...packageValidation.errors);
        result.warnings.push(...packageValidation.warnings);
        if (packageValidation.errors.length > 0) {
          result.valid = false;
        }
      } catch (error) {
        result.errors.push(`Package.json validation failed: ${error}`);
        result.valid = false;
      }
    }

    return result;
  }

  private async validateRule(
    projectPath: string,
    rule: ValidationRule
  ): Promise<{ passed: boolean; error?: string }> {
    switch (rule.type) {
      case "file-exists":
        if (!rule.path) {
          return { passed: false, error: "File path not specified" };
        }
        return {
          passed: existsSync(path.join(projectPath, rule.path)),
          error: existsSync(path.join(projectPath, rule.path))
            ? undefined
            : `File does not exist: ${rule.path}`,
        };

      case "dependency-present":
        if (!rule.package) {
          return { passed: false, error: "Package name not specified" };
        }
        return this.validateDependency(projectPath, rule.package);

      case "script-exists":
        if (!rule.script) {
          return { passed: false, error: "Script name not specified" };
        }
        return this.validateScript(projectPath, rule.script);

      case "config-valid":
        if (!rule.path) {
          return { passed: false, error: "Config file path not specified" };
        }
        return this.validateConfigFile(projectPath, rule.path);

      default:
        return { passed: false, error: `Unknown rule type: ${rule.type}` };
    }
  }

  private async validateDependency(
    projectPath: string,
    packageName: string
  ): Promise<{ passed: boolean; error?: string }> {
    const packageJsonPath = path.join(projectPath, "package.json");
    if (!existsSync(packageJsonPath)) {
      return { passed: false, error: "package.json not found" };
    }

    try {
      const packageJson = JSON.parse(await readFile(packageJsonPath, "utf8"));
      const dependencies = packageJson.dependencies || {};
      const devDependencies = packageJson.devDependencies || {};

      const hasPackage = dependencies[packageName] || devDependencies[packageName];
      return {
        passed: !!hasPackage,
        error: hasPackage ? undefined : `Package not found: ${packageName}`,
      };
    } catch (error) {
      return { passed: false, error: `Failed to read package.json: ${error}` };
    }
  }

  private async validateScript(
    projectPath: string,
    scriptName: string
  ): Promise<{ passed: boolean; error?: string }> {
    const packageJsonPath = path.join(projectPath, "package.json");
    if (!existsSync(packageJsonPath)) {
      return { passed: false, error: "package.json not found" };
    }

    try {
      const packageJson = JSON.parse(await readFile(packageJsonPath, "utf8"));
      const scripts = packageJson.scripts || {};

      const hasScript = !!scripts[scriptName];
      return {
        passed: hasScript,
        error: hasScript ? undefined : `Script not found: ${scriptName}`,
      };
    } catch (error) {
      return { passed: false, error: `Failed to read package.json: ${error}` };
    }
  }

  private async validateConfigFile(
    projectPath: string,
    configPath: string
  ): Promise<{ passed: boolean; error?: string }> {
    const fullPath = path.join(projectPath, configPath);
    if (!existsSync(fullPath)) {
      return { passed: false, error: `Config file not found: ${configPath}` };
    }

    // Basic validation - check if file is readable
    try {
      await readFile(fullPath, "utf8");
      return { passed: true };
    } catch (error) {
      return { passed: false, error: `Config file not readable: ${error}` };
    }
  }

  private async validatePackageJson(
    packageJsonPath: string,
    fixture: ProjectFixture
  ): Promise<{ errors: string[]; warnings: string[] }> {
    const errors: string[] = [];
    const warnings: string[] = [];

    try {
      const packageJson = JSON.parse(await readFile(packageJsonPath, "utf8"));

      // Basic structure validation
      if (!packageJson.name) {
        errors.push("package.json missing name field");
      }

      if (!packageJson.scripts) {
        warnings.push("package.json missing scripts field");
      }

      // Only validate dependencies if not skipping install
      if (!fixture.skipInstall) {
        const dependencies = packageJson.dependencies || {};
        const devDependencies = packageJson.devDependencies || {};

        for (const expectedDep of fixture.expectedDependencies) {
          if (!dependencies[expectedDep] && !devDependencies[expectedDep]) {
            errors.push(`Missing expected dependency: ${expectedDep}`);
          }
        }

        for (const expectedDevDep of fixture.expectedDevDependencies) {
          if (!devDependencies[expectedDevDep]) {
            warnings.push(`Missing expected dev dependency: ${expectedDevDep}`);
          }
        }
      }
    } catch (error) {
      errors.push(`Invalid package.json: ${error}`);
    }

    return { errors, warnings };
  }
}

import { describe, it, expect, beforeEach, afterEach } from "vitest";

import { FIXTURES, getFixturesByCategory } from "../fixtures/index";
import { ProjectValidator } from "../helpers/project-validator";
import { TestSandbox } from "../helpers/sandbox";
import { CLITestRunner } from "../helpers/test-cli";

describe("CLI Project Generation - Integration Tests", () => {
  let testRunner: CLITestRunner;
  let validator: ProjectValidator;
  let sandbox: TestSandbox;

  beforeEach(async () => {
    testRunner = new CLITestRunner();
    validator = new ProjectValidator();
    sandbox = new TestSandbox();
    await sandbox.setup();
  });

  afterEach(async () => {
    await sandbox.cleanup();
  });

  describe("Critical Project Templates", () => {
    const criticalFixtures = getFixturesByCategory("critical");

    criticalFixtures.forEach((fixture) => {
      it(
        `should generate ${fixture.name} project successfully`,
        async () => {
          const projectName = `test-${fixture.name}`;
          const workingDir = sandbox.getTempDir();

          // Generate project with install for proper validation
          const result = await testRunner.generateProject(projectName, fixture.config, workingDir, {
            install: process.env.RUN_FULL_TESTS === "true",
          });

          // Check CLI execution
          expect(result.exitCode).toBe(0);
          if (result.exitCode !== 0) {
            console.error(`CLI failed for ${fixture.name}:`);
            console.error(`stdout: ${result.stdout}`);
            console.error(`stderr: ${result.stderr}`);
          }

          // Validate project structure
          const projectPath = sandbox.getPath(projectName);
          const validation = await validator.validateProject(projectPath, fixture);

          if (!validation.valid) {
            console.error(`Validation failed for ${fixture.name}:`);
            console.error("Errors:", validation.errors);
            console.error(
              "Failed rules:",
              validation.failedRules.map((r) => r.description)
            );
          }

          expect(validation.valid).toBe(true);
          expect(validation.errors).toHaveLength(0);
        },
        fixture.config.expectedDuration + 15000 // Add buffer
      );
    });
  });

  describe("Framework-Specific Validation", () => {
    it("should generate React project with correct structure", async () => {
      const fixture = FIXTURES.find((f) => f.name === "react-express-postgres");
      if (!fixture) throw new Error("React fixture not found");

      const projectName = "test-react-structure";
      const workingDir = sandbox.getTempDir();

      const result = await testRunner.generateProject(projectName, fixture.config, workingDir);

      expect(result.exitCode).toBe(0);

      const projectPath = sandbox.getPath(projectName);
      const validation = await validator.validateProject(projectPath, fixture);

      expect(validation.valid).toBe(true);

      // React-specific checks
      expect(
        validation.passedRules.some((r) => r.description.includes("React App component"))
      ).toBe(true);
    });

    it("should generate Next.js project with correct structure", async () => {
      const fixture = FIXTURES.find((f) => f.name === "next-frontend-only");
      if (!fixture) throw new Error("Next.js fixture not found");

      const projectName = "test-next-structure";
      const workingDir = sandbox.getTempDir();

      const result = await testRunner.generateProject(projectName, fixture.config, workingDir);

      expect(result.exitCode).toBe(0);

      const projectPath = sandbox.getPath(projectName);
      const validation = await validator.validateProject(projectPath, fixture);

      expect(validation.valid).toBe(true);

      // Next.js-specific checks
      expect(
        validation.passedRules.some((r) => r.description.includes("Next.js app router page"))
      ).toBe(true);
    });
  });

  describe("Error Handling", () => {
    it("should handle invalid framework gracefully", async () => {
      const projectName = "test-invalid-framework";
      const workingDir = sandbox.getTempDir();

      const result = await testRunner.runCommand(
        ["init", projectName, "--framework=invalid-framework", "--backend=none", "--yes"],
        { cwd: workingDir }
      );

      // Should fail gracefully
      expect(result.exitCode).not.toBe(0);
      expect(result.stderr).toContain("framework");
    });

    it("should handle missing project name", async () => {
      const workingDir = sandbox.getTempDir();

      const result = await testRunner.runCommand(["init", "--framework=react", "--yes"], {
        cwd: workingDir,
        timeout: 5000,
      }); // Short timeout

      // Should provide helpful error
      expect(result.exitCode).not.toBe(0);
    }, 10000); // Test timeout
  });

  describe("CLI Arguments Validation", () => {
    it("should respect --no-typescript flag", async () => {
      const projectName = "test-no-typescript";
      const workingDir = sandbox.getTempDir();

      const result = await testRunner.runCommand(
        ["init", projectName, "--framework=react", "--backend=none", "--no-typescript", "--yes"],
        { cwd: workingDir }
      );

      expect(result.exitCode).toBe(0);

      const projectPath = sandbox.getPath(projectName);

      // Should not have TypeScript dependencies
      const validation = await validator.validateProject(projectPath, {
        name: "no-typescript-test",
        config: {
          name: "no-typescript-test",
          framework: "react",
          backend: "none",
          database: "none",
          orm: "none",
          styling: "css",
          runtime: "node",
          typescript: false,
          category: "common",
          expectedDuration: 5000,
        },
        expectedFiles: ["package.json"],
        expectedDependencies: ["react"],
        expectedDevDependencies: [],
        validationRules: [
          { type: "file-exists", path: "package.json", description: "Package.json exists" },
        ],
      });

      expect(validation.valid).toBe(true);
    });
  });
});

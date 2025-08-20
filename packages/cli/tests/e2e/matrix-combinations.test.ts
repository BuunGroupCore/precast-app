import { describe, it, expect, beforeEach, afterEach } from "vitest";

import { TEST_MATRIX } from "../config/test-matrix.js";
import { FIXTURES } from "../fixtures/index.js";
import { ProjectValidator } from "../helpers/project-validator.js";
import { TestSandbox } from "../helpers/sandbox.js";
import { CLITestRunner } from "../helpers/test-cli.js";

describe("CLI Matrix Testing - E2E", () => {
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

  describe("Critical Combinations Matrix", () => {
    TEST_MATRIX.critical.forEach((combination) => {
      it(
        `should generate ${combination.name} project`,
        async () => {
          const projectName = `matrix-${combination.name}`;
          const workingDir = sandbox.getTempDir();

          const result = await testRunner.generateProject(projectName, combination, workingDir);

          if (result.exitCode !== 0) {
            console.error(`Matrix test failed for ${combination.name}:`);
            console.error(
              `Command: ${JSON.stringify({
                framework: combination.framework,
                backend: combination.backend,
                database: combination.database,
                orm: combination.orm,
              })}`
            );
            console.error(`stdout: ${result.stdout}`);
            console.error(`stderr: ${result.stderr}`);
          }

          expect(result.exitCode).toBe(0);
          expect(result.duration).toBeLessThan(combination.expectedDuration + 10000);

          // Basic validation
          const projectPath = sandbox.getPath(projectName);

          // Find matching fixture for detailed validation
          const fixture = FIXTURES.find((f) => f.name === combination.name);
          if (fixture) {
            const validation = await validator.validateProject(projectPath, fixture);
            expect(validation.valid).toBe(true);
          } else {
            // Basic validation without fixture
            const basicValidation = await testRunner.validateProject(projectPath, combination);
            expect(basicValidation.valid).toBe(true);
          }
        },
        combination.expectedDuration + 20000 // Extra buffer for E2E
      );
    });
  });

  describe("Common Combinations Matrix", () => {
    TEST_MATRIX.common.forEach((combination) => {
      it(
        `should generate ${combination.name} project`,
        async () => {
          const projectName = `matrix-common-${combination.name}`;
          const workingDir = sandbox.getTempDir();

          const result = await testRunner.generateProject(projectName, combination, workingDir);

          expect(result.exitCode).toBe(0);
          expect(result.duration).toBeLessThan(combination.expectedDuration + 10000);

          const projectPath = sandbox.getPath(projectName);
          const validation = await testRunner.validateProject(projectPath, combination);
          expect(validation.valid).toBe(true);
        },
        combination.expectedDuration + 20000
      );
    });
  });

  describe("Edge Case Combinations Matrix", () => {
    TEST_MATRIX.edge.forEach((combination) => {
      it(
        `should generate ${combination.name} project`,
        async () => {
          const projectName = `matrix-edge-${combination.name}`;
          const workingDir = sandbox.getTempDir();

          const result = await testRunner.generateProject(projectName, combination, workingDir);

          expect(result.exitCode).toBe(0);
          expect(result.duration).toBeLessThan(combination.expectedDuration + 10000);

          const projectPath = sandbox.getPath(projectName);
          const validation = await testRunner.validateProject(projectPath, combination);
          expect(validation.valid).toBe(true);
        },
        combination.expectedDuration + 20000
      );
    });
  });

  describe("Cross-Framework Compatibility", () => {
    const frameworkBackendPairs = [
      { framework: "react", backend: "express" },
      { framework: "react", backend: "fastify" },
      { framework: "vue", backend: "express" },
      { framework: "vue", backend: "fastify" },
      { framework: "next", backend: "none" },
      { framework: "next", backend: "next-api" },
    ];

    frameworkBackendPairs.forEach(({ framework, backend }) => {
      it(`should support ${framework} with ${backend}`, async () => {
        const projectName = `compat-${framework}-${backend}`;
        const workingDir = sandbox.getTempDir();

        const combination = {
          name: `${framework}-${backend}`,
          framework,
          backend,
          database: "none",
          orm: "none",
          styling: "tailwind",
          runtime: "node",
          typescript: true,
          category: "common" as const,
          expectedDuration: 8000,
        };

        const result = await testRunner.generateProject(projectName, combination, workingDir);

        expect(result.exitCode).toBe(0);

        const projectPath = sandbox.getPath(projectName);
        const validation = await testRunner.validateProject(projectPath, combination);
        expect(validation.valid).toBe(true);
      }, 15000);
    });
  });

  describe("Database Integration Matrix", () => {
    const databaseOrmPairs = [
      { database: "postgres", orm: "prisma" },
      { database: "postgres", orm: "drizzle" },
      { database: "mysql", orm: "prisma" },
      { database: "sqlite", orm: "drizzle" },
    ];

    databaseOrmPairs.forEach(({ database, orm }) => {
      it(`should support ${database} with ${orm}`, async () => {
        const projectName = `db-${database}-${orm}`;
        const workingDir = sandbox.getTempDir();

        const combination = {
          name: `${database}-${orm}`,
          framework: "react",
          backend: "express",
          database,
          orm,
          styling: "tailwind",
          runtime: "node",
          typescript: true,
          category: "common" as const,
          expectedDuration: 10000,
        };

        const result = await testRunner.generateProject(projectName, combination, workingDir);

        expect(result.exitCode).toBe(0);

        const projectPath = sandbox.getPath(projectName);
        const validation = await testRunner.validateProject(projectPath, combination);
        expect(validation.valid).toBe(true);
      }, 20000);
    });
  });

  describe("Performance Benchmarks", () => {
    it("should generate projects within expected time limits", async () => {
      const benchmarks = TEST_MATRIX.critical.map(async (combination) => {
        const projectName = `perf-${combination.name}`;
        const workingDir = sandbox.getTempDir();

        const startTime = Date.now();
        const result = await testRunner.generateProject(projectName, combination, workingDir);
        const actualDuration = Date.now() - startTime;

        return {
          name: combination.name,
          expectedDuration: combination.expectedDuration,
          actualDuration,
          success: result.exitCode === 0,
          withinExpected: actualDuration <= combination.expectedDuration * 1.5, // 50% buffer
        };
      });

      const results = await Promise.all(benchmarks);

      // All should succeed
      results.forEach((result) => {
        expect(result.success).toBe(true);
      });

      // At least 80% should be within expected time
      const withinTime = results.filter((r) => r.withinExpected).length;
      const successRate = withinTime / results.length;

      expect(successRate).toBeGreaterThanOrEqual(0.8);

      // Log performance data
      console.log("Performance Results:");
      results.forEach((result) => {
        console.log(
          `${result.name}: ${result.actualDuration}ms (expected: ${result.expectedDuration}ms)`
        );
      });
    }, 120000); // 2 minutes for all benchmarks
  });
});

import { describe, it, expect, beforeAll, afterEach } from "vitest";

import { SMART_TEST_COMBINATIONS } from "../generated-tests/smart-combinations";
import { runCLI, cleanupTestProjects, projectExists } from "../src/test-utils";

describe("CLI Core Functionality", () => {
  beforeAll(async () => {
    // Ensure CLI is built
    const buildResult = runCLI(["--version"]);
    expect(buildResult.exitCode).toBe(0);
  });

  it("should show help", () => {
    const result = runCLI(["--help"]);
    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain("create-precast-app");
    expect(result.stdout).toContain("init");
  });

  it("should show version", () => {
    const result = runCLI(["--version"]);
    expect(result.exitCode).toBe(0);
  });

  it("should handle invalid commands", () => {
    const result = runCLI(["invalid-command"]);
    // The CLI defaults to interactive mode for unknown commands
    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain("Choose your frontend framework");
  });
});

describe("CLI Project Generation - Critical Tests", () => {
  const testProjects: string[] = [];

  afterEach(() => {
    cleanupTestProjects(testProjects);
    testProjects.length = 0;
  });

  SMART_TEST_COMBINATIONS.critical.forEach((combination) => {
    it(
      `should generate ${combination.name}`,
      () => {
        const projectName = `test-${combination.name}`;
        testProjects.push(projectName);

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
          "--yes",
        ].filter(Boolean);

        const result = runCLI(args);

        expect(result.exitCode).toBe(0);
        expect(projectExists(projectName)).toBe(true);
      },
      combination.expectedDuration + 10000
    ); // Add 10s buffer
  });
});

describe("CLI Project Generation - Full Test Suite", () => {
  const testProjects: string[] = [];

  afterEach(() => {
    cleanupTestProjects(testProjects);
    testProjects.length = 0;
  });

  // Test a subset of all combinations to avoid extremely long test runs
  const testCombinations = [
    ...SMART_TEST_COMBINATIONS.critical.slice(0, 3), // First 3 critical
    ...SMART_TEST_COMBINATIONS.common.slice(0, 2), // First 2 common
    ...SMART_TEST_COMBINATIONS.edge.slice(0, 1), // First 1 edge case
  ];

  testCombinations.forEach((combination) => {
    it(
      `should generate ${combination.name} (${combination.category})`,
      () => {
        const projectName = `test-full-${combination.name}`;
        testProjects.push(projectName);

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
          "--yes",
        ].filter(Boolean);

        const result = runCLI(args);

        if (result.exitCode !== 0) {
          console.error(`CLI Error for ${combination.name}:`, result.stderr);
        }

        expect(result.exitCode).toBe(0);
        expect(projectExists(projectName)).toBe(true);
      },
      combination.expectedDuration + 10000
    );
  });
});

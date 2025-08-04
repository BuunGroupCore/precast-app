/**
 * Test configuration presets for different testing scenarios
 */
import type { TestConfig } from "./test-runner.js";

/**
 * Default test configuration for development
 */
export const defaultConfig: TestConfig = {
  suites: ["core", "generation"],
  reportFormat: "json",
  parallel: false,
  verbose: false,
};

/**
 * CI/CD test configuration with parallel execution and JUnit reporting
 */
export const ciConfig: TestConfig = {
  suites: ["core", "generation"],
  reportFormat: "junit",
  reportPath: "./reports/junit.xml",
  parallel: true,
  verbose: true,
};

/**
 * Quick test configuration for basic functionality checks
 */
export const quickConfig: TestConfig = {
  suites: ["core"],
  tags: ["basic"],
  parallel: false,
  verbose: false,
};

/**
 * Comprehensive test configuration with HTML reporting
 */
export const fullConfig: TestConfig = {
  suites: ["core", "generation"],
  reportFormat: "html",
  reportPath: "./reports/full-report.html",
  parallel: true,
  verbose: true,
};

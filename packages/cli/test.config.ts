import type { TestConfig } from "./test-runner.js";

export const defaultConfig: TestConfig = {
  suites: ["core", "generation"],
  reportFormat: "json",
  parallel: false,
  verbose: false,
};

export const ciConfig: TestConfig = {
  suites: ["core", "generation"],
  reportFormat: "junit",
  reportPath: "./reports/junit.xml",
  parallel: true,
  verbose: true,
};

export const quickConfig: TestConfig = {
  suites: ["core"],
  tags: ["basic"],
  parallel: false,
  verbose: false,
};

export const fullConfig: TestConfig = {
  suites: ["core", "generation"],
  reportFormat: "html",
  reportPath: "./reports/full-report.html",
  parallel: true,
  verbose: true,
};

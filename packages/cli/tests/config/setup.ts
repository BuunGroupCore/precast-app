import { beforeAll, afterEach } from "vitest";

import { TestSandbox } from "../helpers/sandbox.js";

// Global test setup
beforeAll(async () => {
  // Ensure CLI is built before running tests
  process.env.NODE_ENV = "test";
  process.env.PRECAST_TEST_MODE = "true";

  // Initialize global reporter
  console.info("📊 Test reporter initialized");
});

// Cleanup after each test
afterEach(async () => {
  await TestSandbox.globalCleanup();
});

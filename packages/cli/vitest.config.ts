import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    testTimeout: 60000, // 60 seconds for CLI tests
    hookTimeout: 30000,
    teardownTimeout: 30000,
    // Run tests sequentially in CI to avoid resource contention
    poolOptions: {
      threads: {
        singleThread: process.env.CI === "true",
      },
    },
  },
});

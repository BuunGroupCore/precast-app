import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    testTimeout: 60000,
    hookTimeout: 30000,
    teardownTimeout: 30000,

    poolOptions: {
      threads: {
        singleThread: process.env.CI === "true",
      },
    },
  },
});

import * as path from "path";

import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    setupFiles: [path.resolve(__dirname, "setup.ts")],
    testTimeout: 30000,
    fileParallelism: false,
    include: ["src/**/*.test.ts", "tests/**/*.test.ts"],
    exclude: ["tests/e2e/**/*.test.ts"],
    globals: true,
    reporters: ["default", path.resolve(__dirname, "../helpers/vitest-reporter.ts")],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "../../src"),
    },
  },
});

import { defineConfig } from "tsup";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  entry: ["src/cli.ts", "src/index.ts"],
  format: ["esm"],
  clean: true,
  target: "es2022",
  env: {
    // These will be injected at build time
    POSTHOG_API_KEY: process.env.POSTHOG_API_KEY || "",
    POSTHOG_HOST: process.env.POSTHOG_HOST || "https://app.posthog.com",
  },
  esbuildOptions(options) {
    options.alias = {
      "@": path.resolve(__dirname, "src"),
      "@shared": path.resolve(__dirname, "../shared"),
    };
  },
});

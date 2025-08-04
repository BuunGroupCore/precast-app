import path from "path";
import { fileURLToPath } from "url";

import { TestSuite } from "../src/test-framework/index.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CLI_PATH = path.resolve(process.cwd(), "dist/cli.js");
export function createGeneratorStructureTests() {
  const suite = new TestSuite(CLI_PATH);
  suite.beforeAll(async () => {
    console.log("🏗️ Setting up generator structure tests...");
  });
  suite.afterAll(async () => {
    console.log("🧹 Cleaning up generator structure tests...");
  });
  suite.test(
    "All framework generators are available",
    async (_context) => {
      const generators = await import("../src/generators/index.js");
      if (typeof generators.generateTemplate !== "function") {
        throw new Error("generateTemplate function not found");
      }
      const frameworks = [
        "react",
        "vue",
        "angular",
        "next",
        "nuxt",
        "svelte",
        "solid",
        "astro",
        "remix",
        "vite",
        "vanilla",
      ];
      const mockConfig = {
        name: "test-project",
        framework: "",
        backend: "none",
        database: "none",
        orm: "none",
        styling: "css",
        typescript: true,
        git: false,
        docker: false,
      };
      for (const framework of frameworks) {
        try {
          await generators.generateTemplate({ ...mockConfig, framework }, "/tmp/test-" + framework);
        } catch (error) {
          const errorMessage = (error as Error).message || "";
          if (errorMessage.includes("not yet implemented")) {
            throw new Error(`${framework} generator is not properly implemented: ${errorMessage}`);
          }
          if (!errorMessage.includes("ENOENT") && !errorMessage.includes("no such file")) {
            throw new Error(`Unexpected error for ${framework}: ${errorMessage}`);
          }
        }
      }
    },
    {
      tags: ["structure", "generators"],
      timeout: 30000,
    }
  );
  suite.test(
    "Individual generator modules exist",
    async (_context) => {
      const generatorModules = [
        "../src/generators/react-template.js",
        "../src/generators/vue-template.js",
        "../src/generators/angular-template.js",
        "../src/generators/next-template.js",
        "../src/generators/nuxt-template.js",
        "../src/generators/svelte-template.js",
        "../src/generators/solid-template.js",
        "../src/generators/astro-template.js",
        "../src/generators/remix-template.js",
        "../src/generators/vite-template.js",
        "../src/generators/vanilla-template.js",
      ];
      for (const modulePath of generatorModules) {
        try {
          const module = await import(modulePath);
          const frameworkName = modulePath.split("/").pop()?.replace("-template.js", "");
          const functionName = `generate${frameworkName?.charAt(0).toUpperCase()}${frameworkName?.slice(1)}Template`;
          if (typeof module[functionName] !== "function") {
            throw new Error(`${functionName} not found in ${modulePath}`);
          }
        } catch (error) {
          throw new Error(`Failed to import ${modulePath}: ${(error as Error).message}`);
        }
      }
    },
    {
      tags: ["structure", "imports"],
      timeout: 10000,
    }
  );
  return suite;
}
export default createGeneratorStructureTests;

import path from "path";
import { fileURLToPath } from "url";

import { TestSuite } from "../src/test-framework/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CLI_PATH = path.resolve(process.cwd(), "dist/cli.js");

export function createProjectGenerationTests() {
  const suite = new TestSuite(CLI_PATH);

  // Setup hooks
  suite.beforeAll(async () => {
    console.log("🏗️ Setting up project generation tests...");
  });

  suite.afterAll(async () => {
    console.log("🧹 Cleaning up project generation tests...");
  });

  // Test 1: React Project Generation
  suite.test(
    "Creates React project with TypeScript",
    async (_context) => {
      const result = await suite.runCLI(
        [
          "init",
          "react-ts-project",
          "--framework=react",
          "--backend=none",
          "--database=none",
          "--orm=none",
          "--styling=tailwind",
          "--no-git",
        ],
        {
          input: "n\ny\n", // Docker: no, Confirm: yes
          timeout: 45000,
        }
      );

      await suite.expectExitCode(result, 0, "Project creation should succeed");

      // Check project structure
      await suite.expectFileExists("react-ts-project/package.json");
      await suite.expectFileExists("react-ts-project/src/App.tsx");
      await suite.expectFileExists("react-ts-project/vite.config.ts");
      await suite.expectFileExists("react-ts-project/tsconfig.json");
      await suite.expectFileExists("react-ts-project/tailwind.config.js");

      // Check package.json content
      await suite.expectFileContains("react-ts-project/package.json", '"react"');
      await suite.expectFileContains("react-ts-project/package.json", '"typescript"');
      await suite.expectFileContains("react-ts-project/package.json", '"tailwindcss"');
    },
    {
      tags: ["generation", "react", "typescript"],
      timeout: 60000,
    }
  );

  // Test 2: Vue Project Generation (JavaScript)
  suite.test(
    "Creates Vue project without TypeScript",
    async (_context) => {
      const result = await suite.runCLI(
        [
          "init",
          "vue-js-project",
          "--framework=vue",
          "--backend=none",
          "--database=none",
          "--orm=none",
          "--styling=css",
          "--no-typescript",
          "--no-git",
        ],
        {
          input: "n\ny\n", // Docker: no, Confirm: yes
          timeout: 45000,
        }
      );

      await suite.expectExitCode(result, 0, "Project creation should succeed");

      // Check project structure
      await suite.expectFileExists("vue-js-project/package.json");
      await suite.expectFileExists("vue-js-project/src/App.vue");
      await suite.expectFileExists("vue-js-project/vite.config.js");
      await suite.expectFileNotExists("vue-js-project/tsconfig.json");

      // Check package.json content
      await suite.expectFileContains("vue-js-project/package.json", '"vue"');
      await suite.expectFileNotContains("vue-js-project/package.json", '"typescript"');
    },
    {
      tags: ["generation", "vue", "javascript"],
      timeout: 60000,
    }
  );

  // Test 3: Full Stack Project with Database
  suite.test(
    "Creates full-stack project with Prisma and PostgreSQL",
    async (_context) => {
      const result = await suite.runCLI(
        [
          "init",
          "fullstack-project",
          "--framework=next",
          "--backend=node",
          "--database=postgres",
          "--orm=prisma",
          "--styling=tailwind",
          "--no-git",
        ],
        {
          input: "y\ny\n", // Docker: yes, Confirm: yes
          timeout: 60000,
        }
      );

      await suite.expectExitCode(result, 0, "Project creation should succeed");

      // Check project structure
      await suite.expectFileExists("fullstack-project/package.json");
      await suite.expectFileExists("fullstack-project/prisma/schema.prisma");
      await suite.expectFileExists("fullstack-project/Dockerfile");
      await suite.expectFileExists("fullstack-project/docker-compose.yml");

      // Check package.json content
      await suite.expectFileContains("fullstack-project/package.json", '"next"');
      await suite.expectFileContains("fullstack-project/package.json", '"@prisma/client"');
      await suite.expectFileContains("fullstack-project/package.json", '"prisma"');

      // Check Docker configuration
      await suite.expectFileContains("fullstack-project/docker-compose.yml", "postgres");
      await suite.expectFileContains("fullstack-project/Dockerfile", "FROM node");
    },
    {
      tags: ["generation", "fullstack", "database", "docker"],
      timeout: 90000,
    }
  );

  // Test 4: Existing Directory Error
  suite.test(
    "Handles existing directory error gracefully",
    async (_context) => {
      // Create a directory first
      const fs = await import("fs-extra");
      const existingDir = path.join(_context.tempDir, "existing-project");
      await fs.ensureDir(existingDir);

      const result = await suite.runCLI(
        [
          "init",
          "existing-project",
          "--framework=react",
          "--backend=none",
          "--database=none",
          "--orm=none",
          "--styling=css",
          "--no-git",
        ],
        {
          timeout: 10000,
        }
      );

      // Should fail gracefully
      if (result.exitCode === 0) {
        throw new Error("Should have failed for existing directory");
      }

      await suite.expectContains(
        result.stderr,
        "already exists",
        "Should show directory exists error"
      );
    },
    {
      tags: ["error-handling", "validation"],
      timeout: 15000,
    }
  );

  return suite;
}

export default createProjectGenerationTests;

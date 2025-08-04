import path from "path";
import { fileURLToPath } from "url";

import { TestSuite } from "../src/test-framework/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CLI_PATH = path.resolve(process.cwd(), "dist/cli.js");

export function createFrameworkGenerationTests() {
  const suite = new TestSuite(CLI_PATH);

  // Setup hooks
  suite.beforeAll(async () => {
    console.log("🏗️ Setting up framework generation tests...");
  });

  suite.afterAll(async () => {
    console.log("🧹 Cleaning up framework generation tests...");
  });

  // Define all frameworks to test
  const frameworks = [
    {
      name: "react",
      expectedFiles: ["src/App.tsx", "vite.config.ts", "tsconfig.json"],
      expectedPackages: ["react", "react-dom", "@vitejs/plugin-react"],
    },
    {
      name: "vue",
      expectedFiles: ["src/App.vue", "vite.config.ts", "tsconfig.json"],
      expectedPackages: ["vue", "@vitejs/plugin-vue"],
    },
    {
      name: "angular",
      expectedFiles: ["src/main.ts", "angular.json", "tsconfig.json"],
      expectedPackages: ["@angular/core", "@angular/common", "@angular/platform-browser"],
    },
    {
      name: "next",
      expectedFiles: ["next.config.js", "tsconfig.json", "app/page.tsx"],
      expectedPackages: ["next", "react", "react-dom"],
    },
    {
      name: "nuxt",
      expectedFiles: ["nuxt.config.ts", "tsconfig.json", "app.vue"],
      expectedPackages: ["nuxt", "vue"],
    },
    {
      name: "svelte",
      expectedFiles: ["src/App.svelte", "vite.config.ts", "tsconfig.json"],
      expectedPackages: ["svelte", "@sveltejs/vite-plugin-svelte"],
    },
    {
      name: "solid",
      expectedFiles: ["src/App.tsx", "vite.config.ts", "tsconfig.json"],
      expectedPackages: ["solid-js", "vite-plugin-solid"],
    },
    {
      name: "astro",
      expectedFiles: ["src/pages/index.astro", "astro.config.mjs", "tsconfig.json"],
      expectedPackages: ["astro"],
    },
    {
      name: "remix",
      expectedFiles: ["remix.config.js", "tsconfig.json", "app/root.tsx"],
      expectedPackages: ["@remix-run/node", "@remix-run/react"],
    },
    {
      name: "vite",
      expectedFiles: ["src/main.ts", "vite.config.ts", "tsconfig.json"],
      expectedPackages: ["vite"],
    },
    {
      name: "vanilla",
      expectedFiles: ["src/main.js", "index.html", "vite.config.js"],
      expectedPackages: ["vite"],
    },
  ];

  // Generate test for each framework
  frameworks.forEach((framework) => {
    suite.test(
      `Creates ${framework.name} project with TypeScript and Tailwind`,
      async (_context) => {
        const projectName = `${framework.name}-test-project`;
        const result = await suite.runCLI(
          [
            "init",
            projectName,
            `--framework=${framework.name}`,
            "--backend=none",
            "--database=none",
            "--orm=none",
            "--styling=tailwind",
            "--no-git",
          ],
          {
            input: "n\ny\n", // Docker: no, Confirm: yes
            timeout: 60000,
          }
        );

        await suite.expectExitCode(result, 0, `${framework.name} project creation should succeed`);

        // Check project structure
        await suite.expectFileExists(`${projectName}/package.json`);

        // Check framework-specific files
        for (const file of framework.expectedFiles) {
          await suite.expectFileExists(`${projectName}/${file}`);
        }

        // Check package.json content for framework packages
        for (const pkg of framework.expectedPackages) {
          await suite.expectFileContains(`${projectName}/package.json`, `"${pkg}"`);
        }

        // Check Tailwind CSS is included
        await suite.expectFileContains(`${projectName}/package.json`, '"tailwindcss"');
        await suite.expectFileExists(`${projectName}/tailwind.config.js`);

        // Check TypeScript is included (except for vanilla)
        if (framework.name !== "vanilla") {
          await suite.expectFileContains(`${projectName}/package.json`, '"typescript"');
        }
      },
      {
        tags: ["generation", framework.name, "typescript", "tailwind"],
        timeout: 90000,
      }
    );

    // Test without TypeScript for frameworks that support it
    if (framework.name !== "angular") {
      // Angular requires TypeScript
      suite.test(
        `Creates ${framework.name} project without TypeScript`,
        async (_context) => {
          const projectName = `${framework.name}-js-project`;
          const result = await suite.runCLI(
            [
              "init",
              projectName,
              `--framework=${framework.name}`,
              "--backend=none",
              "--database=none",
              "--orm=none",
              "--styling=css",
              "--no-typescript",
              "--no-git",
            ],
            {
              input: "n\ny\n", // Docker: no, Confirm: yes
              timeout: 60000,
            }
          );

          await suite.expectExitCode(
            result,
            0,
            `${framework.name} JavaScript project creation should succeed`
          );

          // Check project structure
          await suite.expectFileExists(`${projectName}/package.json`);

          // Check TypeScript is NOT included
          await suite.expectFileNotContains(`${projectName}/package.json`, '"typescript"');
          await suite.expectFileNotExists(`${projectName}/tsconfig.json`);

          // Check for JavaScript config files
          if (framework.name === "vite" || framework.name === "vanilla") {
            await suite.expectFileExists(`${projectName}/vite.config.js`);
          }
        },
        {
          tags: ["generation", framework.name, "javascript"],
          timeout: 90000,
        }
      );
    }
  });

  // Test framework with backend integration
  suite.test(
    "Creates Next.js project with Express backend",
    async (_context) => {
      const result = await suite.runCLI(
        [
          "init",
          "next-express-project",
          "--framework=next",
          "--backend=express",
          "--database=none",
          "--orm=none",
          "--styling=tailwind",
          "--no-git",
        ],
        {
          input: "n\ny\n", // Docker: no, Confirm: yes
          timeout: 60000,
        }
      );

      await suite.expectExitCode(result, 0, "Next.js + Express project creation should succeed");

      // Check project structure
      await suite.expectFileExists("next-express-project/package.json");
      await suite.expectFileExists("next-express-project/next.config.js");

      // Check backend integration
      await suite.expectFileContains("next-express-project/package.json", '"express"');
    },
    {
      tags: ["generation", "next", "backend", "express"],
      timeout: 90000,
    }
  );

  // Test framework with database
  suite.test(
    "Creates React project with Prisma and PostgreSQL",
    async (_context) => {
      const result = await suite.runCLI(
        [
          "init",
          "react-prisma-project",
          "--framework=react",
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

      await suite.expectExitCode(result, 0, "React + Prisma project creation should succeed");

      // Check project structure
      await suite.expectFileExists("react-prisma-project/package.json");
      await suite.expectFileExists("react-prisma-project/prisma/schema.prisma");
      await suite.expectFileExists("react-prisma-project/docker-compose.yml");

      // Check packages
      await suite.expectFileContains("react-prisma-project/package.json", '"@prisma/client"');
      await suite.expectFileContains("react-prisma-project/package.json", '"prisma"');
    },
    {
      tags: ["generation", "react", "database", "prisma"],
      timeout: 90000,
    }
  );

  // Test error handling for incompatible combinations
  suite.test(
    "Handles incompatible framework-backend combination",
    async (_context) => {
      const result = await suite.runCLI(
        [
          "init",
          "invalid-project",
          "--framework=angular",
          "--backend=fastapi", // FastAPI is incompatible with TypeScript
          "--database=none",
          "--orm=none",
          "--styling=css",
          "--no-git",
        ],
        {
          timeout: 10000,
        }
      );

      // Should fail due to incompatibility
      if (result.exitCode === 0) {
        throw new Error("Should have failed for incompatible combination");
      }

      await suite.expectContains(
        result.stderr,
        "incompatible",
        "Should show incompatibility error"
      );
    },
    {
      tags: ["error-handling", "validation", "angular"],
      timeout: 15000,
    }
  );

  return suite;
}

export default createFrameworkGenerationTests;

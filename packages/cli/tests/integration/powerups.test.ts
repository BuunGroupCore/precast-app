import { describe, it, expect, beforeEach, afterEach } from "vitest";

import { POWERUP_FIXTURES } from "../fixtures/expanded-fixtures";
import { TestSandbox } from "../helpers/sandbox";
import { CLITestRunner } from "../helpers/test-cli";

describe("PowerUps Tests", () => {
  let testRunner: CLITestRunner;
  let sandbox: TestSandbox;

  beforeEach(async () => {
    testRunner = new CLITestRunner();
    sandbox = new TestSandbox();
    await sandbox.setup();
  });

  afterEach(async () => {
    await sandbox.cleanup();
  });

  describe("PowerUp Installation", () => {
    POWERUP_FIXTURES.slice(0, 3).forEach((fixture) => {
      it(`should install ${fixture.name} with powerups`, async () => {
        const projectName = `powerup-${fixture.name}`;
        const workingDir = sandbox.getTempDir();

        console.info(`🚀 Generating project with powerups: ${fixture.config.powerups?.join(", ")}`);

        const result = await testRunner.generateProject(projectName, fixture.config, workingDir, {
          install: false,
        });

        expect(result.exitCode).toBe(0);

        const projectPath = sandbox.getPath(projectName);
        const { existsSync, readFileSync } = await import("fs");

        // Check package.json for powerup dependencies
        const packageJsonPath =
          fixture.config.backend !== "none"
            ? `${projectPath}/apps/web/package.json`
            : `${projectPath}/package.json`;

        const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf-8"));

        // Validate powerup dependencies are added
        fixture.expectedDevDependencies.forEach((dep) => {
          if (!["typescript", "@types/react", "@types/express"].includes(dep)) {
            expect(
              packageJson.devDependencies?.[dep] || packageJson.dependencies?.[dep]
            ).toBeDefined();
          }
        });

        // Validate powerup config files are created
        fixture.expectedFiles.forEach((file) => {
          const fullPath = `${projectPath}/${file}`;
          expect(existsSync(fullPath)).toBe(true);
        });
      }, 45000);
    });
  });

  describe("Testing PowerUps", () => {
    it("should setup Vitest for unit testing", async () => {
      const projectName = "vitest-setup";
      const workingDir = sandbox.getTempDir();

      const config = {
        name: projectName,
        framework: "react",
        backend: "none",
        database: "none",
        orm: "none",
        styling: "tailwind",
        runtime: "node",
        typescript: true,
        powerups: ["vitest"],
        category: "common" as const,
        expectedDuration: 7000,
      };

      const result = await testRunner.generateProject(projectName, config, workingDir, {
        install: false,
      });

      expect(result.exitCode).toBe(0);

      const projectPath = sandbox.getPath(projectName);
      const { existsSync, readFileSync } = await import("fs");

      // Check for Vitest config
      expect(existsSync(`${projectPath}/vitest.config.ts`)).toBe(true);

      // Check for test files
      expect(existsSync(`${projectPath}/src/__tests__`)).toBe(true);

      // Check package.json scripts
      const packageJson = JSON.parse(readFileSync(`${projectPath}/package.json`, "utf-8"));
      expect(packageJson.scripts?.test).toContain("vitest");
      expect(packageJson.devDependencies?.vitest).toBeDefined();
      expect(packageJson.devDependencies?.["@testing-library/react"]).toBeDefined();
    }, 30000);

    it("should setup Playwright for E2E testing", async () => {
      const projectName = "playwright-e2e";
      const workingDir = sandbox.getTempDir();

      const config = {
        name: projectName,
        framework: "next",
        backend: "none",
        database: "none",
        orm: "none",
        styling: "tailwind",
        runtime: "node",
        typescript: true,
        powerups: ["playwright"],
        category: "common" as const,
        expectedDuration: 8000,
      };

      const result = await testRunner.generateProject(projectName, config, workingDir, {
        install: false,
      });

      expect(result.exitCode).toBe(0);

      const projectPath = sandbox.getPath(projectName);
      const { existsSync, readFileSync } = await import("fs");

      // Check for Playwright config
      expect(existsSync(`${projectPath}/playwright.config.ts`)).toBe(true);

      // Check for E2E test directory
      expect(existsSync(`${projectPath}/tests/e2e`)).toBe(true);

      // Check package.json
      const packageJson = JSON.parse(readFileSync(`${projectPath}/package.json`, "utf-8"));
      expect(packageJson.scripts?.["test:e2e"]).toContain("playwright");
      expect(packageJson.devDependencies?.["@playwright/test"]).toBeDefined();
    }, 30000);

    it("should setup Cypress for component testing", async () => {
      const projectName = "cypress-testing";
      const workingDir = sandbox.getTempDir();

      const config = {
        name: projectName,
        framework: "react",
        backend: "none",
        database: "none",
        orm: "none",
        styling: "css",
        runtime: "node",
        typescript: true,
        powerups: ["cypress"],
        category: "edge" as const,
        expectedDuration: 8000,
      };

      const result = await testRunner.generateProject(projectName, config, workingDir, {
        install: false,
      });

      expect(result.exitCode).toBe(0);

      const projectPath = sandbox.getPath(projectName);
      const { existsSync, readFileSync } = await import("fs");

      // Check for Cypress config
      expect(existsSync(`${projectPath}/cypress.config.ts`)).toBe(true);

      // Check for Cypress directories
      expect(existsSync(`${projectPath}/cypress/e2e`)).toBe(true);
      expect(existsSync(`${projectPath}/cypress/support`)).toBe(true);

      // Check package.json
      const packageJson = JSON.parse(readFileSync(`${projectPath}/package.json`, "utf-8"));
      expect(packageJson.scripts?.["cypress:open"]).toBeDefined();
      expect(packageJson.devDependencies?.cypress).toBeDefined();
    }, 30000);
  });

  describe("Code Quality PowerUps", () => {
    it("should setup ESLint and Prettier", async () => {
      const projectName = "code-quality";
      const workingDir = sandbox.getTempDir();

      const config = {
        name: projectName,
        framework: "react",
        backend: "express",
        database: "none",
        orm: "none",
        styling: "tailwind",
        runtime: "node",
        typescript: true,
        powerups: ["eslint", "prettier"],
        category: "common" as const,
        expectedDuration: 7000,
      };

      const result = await testRunner.generateProject(projectName, config, workingDir, {
        install: false,
      });

      expect(result.exitCode).toBe(0);

      const projectPath = sandbox.getPath(projectName);
      const { existsSync, readFileSync } = await import("fs");

      // Check for ESLint config
      expect(existsSync(`${projectPath}/.eslintrc.js`)).toBe(true);

      // Check for Prettier config
      expect(existsSync(`${projectPath}/.prettierrc`)).toBe(true);
      expect(existsSync(`${projectPath}/.prettierignore`)).toBe(true);

      // Check package.json scripts
      const packageJson = JSON.parse(readFileSync(`${projectPath}/package.json`, "utf-8"));
      expect(packageJson.scripts?.lint).toBeDefined();
      expect(packageJson.scripts?.format).toBeDefined();
      expect(packageJson.devDependencies?.eslint).toBeDefined();
      expect(packageJson.devDependencies?.prettier).toBeDefined();
    }, 30000);

    it("should setup Husky for git hooks", async () => {
      const projectName = "husky-hooks";
      const workingDir = sandbox.getTempDir();

      const config = {
        name: projectName,
        framework: "vue",
        backend: "none",
        database: "none",
        orm: "none",
        styling: "css",
        runtime: "node",
        typescript: true,
        powerups: ["husky", "commitizen"],
        category: "common" as const,
        expectedDuration: 7000,
      };

      const result = await testRunner.generateProject(projectName, config, workingDir, {
        install: false,
      });

      expect(result.exitCode).toBe(0);

      const projectPath = sandbox.getPath(projectName);
      const { existsSync, readFileSync } = await import("fs");

      // Check for Husky hooks
      expect(existsSync(`${projectPath}/.husky`)).toBe(true);
      expect(existsSync(`${projectPath}/.husky/pre-commit`)).toBe(true);

      // Check for Commitizen config
      expect(existsSync(`${projectPath}/.czrc`)).toBe(true);

      // Check package.json
      const packageJson = JSON.parse(readFileSync(`${projectPath}/package.json`, "utf-8"));
      expect(packageJson.devDependencies?.husky).toBeDefined();
      expect(packageJson.devDependencies?.commitizen).toBeDefined();
      expect(packageJson.scripts?.prepare).toContain("husky");
    }, 30000);
  });

  describe("Build Optimization PowerUps", () => {
    it("should setup Bundle Analyzer", async () => {
      const projectName = "bundle-analyzer";
      const workingDir = sandbox.getTempDir();

      const config = {
        name: projectName,
        framework: "react",
        backend: "none",
        database: "none",
        orm: "none",
        styling: "css",
        runtime: "node",
        typescript: true,
        powerups: ["bundle-analyzer"],
        category: "edge" as const,
        expectedDuration: 6000,
      };

      const result = await testRunner.generateProject(projectName, config, workingDir, {
        install: false,
      });

      expect(result.exitCode).toBe(0);

      const projectPath = sandbox.getPath(projectName);
      const { existsSync, readFileSync } = await import("fs");

      // Check for bundle analyzer config
      expect(existsSync(`${projectPath}/webpack-bundle-analyzer.config.js`)).toBe(true);

      // Check package.json
      const packageJson = JSON.parse(readFileSync(`${projectPath}/package.json`, "utf-8"));
      expect(packageJson.scripts?.analyze).toBeDefined();
      expect(packageJson.devDependencies?.["webpack-bundle-analyzer"]).toBeDefined();
    }, 30000);

    it("should setup Million.js optimizer", async () => {
      const projectName = "million-optimizer";
      const workingDir = sandbox.getTempDir();

      const config = {
        name: projectName,
        framework: "react",
        backend: "none",
        database: "none",
        orm: "none",
        styling: "tailwind",
        runtime: "node",
        typescript: true,
        powerups: ["million"],
        category: "edge" as const,
        expectedDuration: 6000,
      };

      const result = await testRunner.generateProject(projectName, config, workingDir, {
        install: false,
      });

      expect(result.exitCode).toBe(0);

      const projectPath = sandbox.getPath(projectName);
      const { readFileSync } = await import("fs");

      // Check vite config includes Million
      const viteConfig = readFileSync(`${projectPath}/vite.config.ts`, "utf-8");
      expect(viteConfig).toContain("million");

      // Check package.json
      const packageJson = JSON.parse(readFileSync(`${projectPath}/package.json`, "utf-8"));
      expect(packageJson.devDependencies?.million).toBeDefined();
    }, 30000);

    it("should setup PWA support", async () => {
      const projectName = "pwa-app";
      const workingDir = sandbox.getTempDir();

      const config = {
        name: projectName,
        framework: "react",
        backend: "none",
        database: "none",
        orm: "none",
        styling: "tailwind",
        runtime: "node",
        typescript: true,
        powerups: ["vite-pwa"],
        category: "common" as const,
        expectedDuration: 7000,
      };

      const result = await testRunner.generateProject(projectName, config, workingDir, {
        install: false,
      });

      expect(result.exitCode).toBe(0);

      const projectPath = sandbox.getPath(projectName);
      const { existsSync, readFileSync } = await import("fs");

      // Check for PWA manifest
      expect(existsSync(`${projectPath}/public/manifest.json`)).toBe(true);

      // Check vite config includes PWA plugin
      const viteConfig = readFileSync(`${projectPath}/vite.config.ts`, "utf-8");
      expect(viteConfig).toContain("vite-plugin-pwa");

      // Check package.json
      const packageJson = JSON.parse(readFileSync(`${projectPath}/package.json`, "utf-8"));
      expect(packageJson.devDependencies?.["vite-plugin-pwa"]).toBeDefined();
    }, 30000);
  });

  describe("Monorepo PowerUps", () => {
    it("should setup Turborepo", async () => {
      const projectName = "turborepo-monorepo";
      const workingDir = sandbox.getTempDir();

      const config = {
        name: projectName,
        framework: "react",
        backend: "express",
        database: "postgres",
        orm: "prisma",
        styling: "tailwind",
        runtime: "node",
        typescript: true,
        powerups: ["turborepo"],
        category: "edge" as const,
        expectedDuration: 9000,
      };

      const result = await testRunner.generateProject(projectName, config, workingDir, {
        install: false,
      });

      expect(result.exitCode).toBe(0);

      const projectPath = sandbox.getPath(projectName);
      const { existsSync, readFileSync } = await import("fs");

      // Check for Turborepo config
      expect(existsSync(`${projectPath}/turbo.json`)).toBe(true);

      // Check turbo.json content
      const turboConfig = JSON.parse(readFileSync(`${projectPath}/turbo.json`, "utf-8"));
      expect(turboConfig.pipeline).toBeDefined();

      // Check package.json
      const packageJson = JSON.parse(readFileSync(`${projectPath}/package.json`, "utf-8"));
      expect(packageJson.devDependencies?.turbo).toBeDefined();
      expect(packageJson.scripts?.build).toContain("turbo");
    }, 30000);

    it("should setup Nx", async () => {
      const projectName = "nx-monorepo";
      const workingDir = sandbox.getTempDir();

      const config = {
        name: projectName,
        framework: "react",
        backend: "nestjs",
        database: "postgres",
        orm: "typeorm",
        styling: "scss",
        runtime: "node",
        typescript: true,
        powerups: ["nx"],
        category: "edge" as const,
        expectedDuration: 10000,
      };

      const result = await testRunner.generateProject(projectName, config, workingDir, {
        install: false,
      });

      expect(result.exitCode).toBe(0);

      const projectPath = sandbox.getPath(projectName);
      const { existsSync, readFileSync } = await import("fs");

      // Check for Nx config
      expect(existsSync(`${projectPath}/nx.json`)).toBe(true);

      // Check package.json
      const packageJson = JSON.parse(readFileSync(`${projectPath}/package.json`, "utf-8"));
      expect(packageJson.devDependencies?.nx).toBeDefined();
    }, 30000);
  });

  describe("I18n PowerUps", () => {
    it("should setup React i18next", async () => {
      const projectName = "react-i18n";
      const workingDir = sandbox.getTempDir();

      const config = {
        name: projectName,
        framework: "react",
        backend: "none",
        database: "none",
        orm: "none",
        styling: "tailwind",
        runtime: "node",
        typescript: true,
        powerups: ["react-i18next"],
        category: "common" as const,
        expectedDuration: 6000,
      };

      const result = await testRunner.generateProject(projectName, config, workingDir, {
        install: false,
      });

      expect(result.exitCode).toBe(0);

      const projectPath = sandbox.getPath(projectName);
      const { existsSync, readFileSync } = await import("fs");

      // Check for i18n setup
      expect(existsSync(`${projectPath}/src/i18n/index.ts`)).toBe(true);
      expect(existsSync(`${projectPath}/src/locales/en.json`)).toBe(true);

      // Check package.json
      const packageJson = JSON.parse(readFileSync(`${projectPath}/package.json`, "utf-8"));
      expect(packageJson.dependencies?.["i18next"]).toBeDefined();
      expect(packageJson.dependencies?.["react-i18next"]).toBeDefined();
    }, 30000);

    it("should setup Vue i18n", async () => {
      const projectName = "vue-i18n";
      const workingDir = sandbox.getTempDir();

      const config = {
        name: projectName,
        framework: "vue",
        backend: "none",
        database: "none",
        orm: "none",
        styling: "tailwind",
        runtime: "node",
        typescript: true,
        powerups: ["vue-i18n"],
        category: "common" as const,
        expectedDuration: 6000,
      };

      const result = await testRunner.generateProject(projectName, config, workingDir, {
        install: false,
      });

      expect(result.exitCode).toBe(0);

      const projectPath = sandbox.getPath(projectName);
      const { existsSync, readFileSync } = await import("fs");

      // Check for i18n setup
      expect(existsSync(`${projectPath}/src/i18n/index.ts`)).toBe(true);
      expect(existsSync(`${projectPath}/src/locales/en.json`)).toBe(true);

      // Check package.json
      const packageJson = JSON.parse(readFileSync(`${projectPath}/package.json`, "utf-8"));
      expect(packageJson.dependencies?.["vue-i18n"]).toBeDefined();
    }, 30000);
  });

  describe("Multiple PowerUps", () => {
    it("should install multiple powerups together", async () => {
      const projectName = "multi-powerup-project";
      const workingDir = sandbox.getTempDir();

      const config = {
        name: projectName,
        framework: "next",
        backend: "none",
        database: "postgres",
        orm: "prisma",
        styling: "tailwind",
        runtime: "node",
        typescript: true,
        powerups: ["vitest", "playwright", "eslint", "prettier", "husky"],
        category: "critical" as const,
        expectedDuration: 12000,
      };

      const result = await testRunner.generateProject(projectName, config, workingDir, {
        install: false,
      });

      expect(result.exitCode).toBe(0);

      const projectPath = sandbox.getPath(projectName);
      const { existsSync, readFileSync } = await import("fs");

      // Check all powerup configs exist
      expect(existsSync(`${projectPath}/vitest.config.ts`)).toBe(true);
      expect(existsSync(`${projectPath}/playwright.config.ts`)).toBe(true);
      expect(existsSync(`${projectPath}/.eslintrc.js`)).toBe(true);
      expect(existsSync(`${projectPath}/.prettierrc`)).toBe(true);
      expect(existsSync(`${projectPath}/.husky`)).toBe(true);

      // Check package.json for all dependencies
      const packageJson = JSON.parse(readFileSync(`${projectPath}/package.json`, "utf-8"));

      expect(packageJson.devDependencies?.vitest).toBeDefined();
      expect(packageJson.devDependencies?.["@playwright/test"]).toBeDefined();
      expect(packageJson.devDependencies?.eslint).toBeDefined();
      expect(packageJson.devDependencies?.prettier).toBeDefined();
      expect(packageJson.devDependencies?.husky).toBeDefined();
    }, 45000);
  });
});

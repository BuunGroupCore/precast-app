import { describe, it, expect, beforeEach, afterEach } from "vitest";

import { FRAMEWORK_BACKEND_FIXTURES } from "../fixtures/expanded-fixtures";
import { ProjectValidator } from "../helpers/project-validator";
import { TestSandbox } from "../helpers/sandbox";
import { CLITestRunner } from "../helpers/test-cli";

describe("Framework-Backend Matrix Tests", () => {
  let testRunner: CLITestRunner;
  let validator: ProjectValidator;
  let sandbox: TestSandbox;

  beforeEach(async () => {
    testRunner = new CLITestRunner();
    validator = new ProjectValidator();
    sandbox = new TestSandbox();
    await sandbox.setup();
  });

  afterEach(async () => {
    await sandbox.cleanup();
  });

  describe("All Framework-Backend Combinations", () => {
    // Test all framework-backend combinations
    FRAMEWORK_BACKEND_FIXTURES.forEach((fixture) => {
      it(`should generate ${fixture.name} successfully`, async () => {
        const projectName = `matrix-${fixture.name}`;
        const workingDir = sandbox.getTempDir();

        console.info(`🔧 Testing: ${fixture.config.framework} + ${fixture.config.backend}`);

        const result = await testRunner.generateProject(projectName, fixture.config, workingDir, {
          install: false,
        });

        expect(result.exitCode).toBe(0);

        const projectPath = sandbox.getPath(projectName);

        // Validate project structure
        const validation = await validator.validateProject(projectPath, fixture);

        if (!validation.valid) {
          console.error(`Validation failed for ${fixture.name}:`);
          console.error("Errors:", validation.errors);
        }

        expect(validation.valid).toBe(true);
        expect(validation.errors).toHaveLength(0);

        // Validate specific files exist
        const { existsSync } = await import("fs");
        fixture.expectedFiles.forEach((file) => {
          const fullPath = `${projectPath}/${file}`;
          expect(existsSync(fullPath)).toBe(true);
        });
      }, 60000); // 1 minute timeout for complex projects
    });
  });

  describe("React Framework Combinations", () => {
    const reactFixtures = FRAMEWORK_BACKEND_FIXTURES.filter((f) => f.config.framework === "react");

    reactFixtures.forEach((fixture) => {
      it(`React + ${fixture.config.backend} should have correct structure`, async () => {
        const projectName = `react-${fixture.config.backend}-test`;
        const workingDir = sandbox.getTempDir();

        const result = await testRunner.generateProject(projectName, fixture.config, workingDir, {
          install: false,
        });

        expect(result.exitCode).toBe(0);

        const projectPath = sandbox.getPath(projectName);
        const { existsSync, readFileSync } = await import("fs");

        // Check React-specific files
        if (fixture.config.backend !== "none") {
          expect(existsSync(`${projectPath}/apps/web/src/App.tsx`)).toBe(true);

          // Check package.json for React dependencies
          const webPackageJson = JSON.parse(
            readFileSync(`${projectPath}/apps/web/package.json`, "utf-8")
          );
          expect(webPackageJson.dependencies?.react).toBeDefined();
          expect(webPackageJson.dependencies?.["react-dom"]).toBeDefined();
        } else {
          expect(existsSync(`${projectPath}/src/App.tsx`)).toBe(true);
        }
      }, 45000);
    });
  });

  describe("Vue Framework Combinations", () => {
    const vueFixtures = FRAMEWORK_BACKEND_FIXTURES.filter((f) => f.config.framework === "vue");

    vueFixtures.forEach((fixture) => {
      it(`Vue + ${fixture.config.backend} should have correct structure`, async () => {
        const projectName = `vue-${fixture.config.backend}-test`;
        const workingDir = sandbox.getTempDir();

        const result = await testRunner.generateProject(projectName, fixture.config, workingDir, {
          install: false,
        });

        expect(result.exitCode).toBe(0);

        const projectPath = sandbox.getPath(projectName);
        const { existsSync, readFileSync } = await import("fs");

        // Check Vue-specific files
        if (fixture.config.backend !== "none") {
          expect(existsSync(`${projectPath}/apps/web/src/App.vue`)).toBe(true);

          // Check package.json for Vue dependencies
          const webPackageJson = JSON.parse(
            readFileSync(`${projectPath}/apps/web/package.json`, "utf-8")
          );
          expect(webPackageJson.dependencies?.vue).toBeDefined();
        } else {
          expect(existsSync(`${projectPath}/src/App.vue`)).toBe(true);
        }
      }, 45000);
    });
  });

  describe("Next.js Full-Stack", () => {
    const nextFixtures = FRAMEWORK_BACKEND_FIXTURES.filter((f) => f.config.framework === "next");

    nextFixtures.forEach((fixture) => {
      it(`Next.js with ${fixture.config.database || "no"} database`, async () => {
        const projectName = `next-fullstack-${fixture.config.database}`;
        const workingDir = sandbox.getTempDir();

        const result = await testRunner.generateProject(projectName, fixture.config, workingDir, {
          install: false,
        });

        expect(result.exitCode).toBe(0);

        const projectPath = sandbox.getPath(projectName);
        const { existsSync, readFileSync } = await import("fs");

        // Check Next.js specific structure
        expect(existsSync(`${projectPath}/src/app/page.tsx`)).toBe(true);
        expect(existsSync(`${projectPath}/next.config.ts`)).toBe(true);

        // Check for API routes if backend is next-api
        if (fixture.config.backend === "next-api") {
          expect(existsSync(`${projectPath}/src/app/api`)).toBe(true);
        }

        // Check for database setup
        if (fixture.config.orm === "prisma") {
          expect(existsSync(`${projectPath}/prisma/schema.prisma`)).toBe(true);
        } else if (fixture.config.orm === "drizzle") {
          expect(existsSync(`${projectPath}/drizzle.config.ts`)).toBe(true);
        }

        // Check package.json
        const packageJson = JSON.parse(readFileSync(`${projectPath}/package.json`, "utf-8"));
        expect(packageJson.dependencies?.next).toBeDefined();
      }, 45000);
    });
  });

  describe("Backend Framework Tests", () => {
    const backendTypes = ["express", "hono", "nestjs", "koa", "fastapi", "cloudflare-workers"];

    backendTypes.forEach((backend) => {
      const fixture = FRAMEWORK_BACKEND_FIXTURES.find((f) => f.config.backend === backend);

      if (fixture) {
        it(`${backend} backend should have correct server setup`, async () => {
          const projectName = `backend-${backend}-test`;
          const workingDir = sandbox.getTempDir();

          const result = await testRunner.generateProject(projectName, fixture.config, workingDir, {
            install: false,
          });

          expect(result.exitCode).toBe(0);

          const projectPath = sandbox.getPath(projectName);
          const { existsSync, readFileSync } = await import("fs");

          // Check backend-specific files
          switch (backend) {
            case "express":
            case "hono":
            case "koa":
              expect(existsSync(`${projectPath}/apps/api/src/index.ts`)).toBe(true);
              break;
            case "nestjs":
              expect(existsSync(`${projectPath}/apps/api/src/main.ts`)).toBe(true);
              expect(existsSync(`${projectPath}/apps/api/src/app.module.ts`)).toBe(true);
              break;
            case "fastapi":
              expect(existsSync(`${projectPath}/apps/api/app/main.py`)).toBe(true);
              expect(existsSync(`${projectPath}/apps/api/requirements.txt`)).toBe(true);
              break;
            case "cloudflare-workers":
              expect(existsSync(`${projectPath}/src/index.ts`)).toBe(true);
              expect(existsSync(`${projectPath}/wrangler.toml`)).toBe(true);
              break;
          }

          // Check package.json for backend dependencies (except FastAPI)
          if (backend !== "fastapi") {
            const packageJsonPath =
              backend === "cloudflare-workers"
                ? `${projectPath}/package.json`
                : `${projectPath}/apps/api/package.json`;

            const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf-8"));

            switch (backend) {
              case "express":
                expect(packageJson.dependencies?.express).toBeDefined();
                break;
              case "hono":
                expect(packageJson.dependencies?.hono).toBeDefined();
                break;
              case "nestjs":
                expect(packageJson.dependencies?.["@nestjs/core"]).toBeDefined();
                break;
              case "koa":
                expect(packageJson.dependencies?.koa).toBeDefined();
                break;
              case "cloudflare-workers":
                expect(packageJson.devDependencies?.wrangler).toBeDefined();
                break;
            }
          }
        }, 45000);
      }
    });
  });

  describe("Database and ORM Combinations", () => {
    const dbOrmCombos = [
      { database: "postgres", orm: "prisma" },
      { database: "postgres", orm: "drizzle" },
      { database: "mysql", orm: "prisma" },
      { database: "mysql", orm: "typeorm" },
      { database: "mongodb", orm: "mongoose" },
      { database: "cloudflare-d1", orm: "drizzle" },
      { database: "duckdb", orm: "none" },
    ];

    dbOrmCombos.forEach(({ database, orm }) => {
      it(`${database} + ${orm} should have correct setup`, async () => {
        const projectName = `db-${database}-${orm}`;
        const workingDir = sandbox.getTempDir();

        const config = {
          name: projectName,
          framework: "react",
          backend: "express",
          database,
          orm,
          styling: "css",
          runtime: "node",
          typescript: true,
          category: "common" as const,
          expectedDuration: 8000,
        };

        const result = await testRunner.generateProject(projectName, config, workingDir, {
          install: false,
        });

        expect(result.exitCode).toBe(0);

        const projectPath = sandbox.getPath(projectName);
        const { existsSync, readFileSync } = await import("fs");

        // Check ORM-specific files
        switch (orm) {
          case "prisma":
            expect(existsSync(`${projectPath}/apps/api/prisma/schema.prisma`)).toBe(true);
            break;
          case "drizzle":
            expect(existsSync(`${projectPath}/apps/api/drizzle.config.ts`)).toBe(true);
            expect(existsSync(`${projectPath}/apps/api/src/db/schema.ts`)).toBe(true);
            break;
          case "typeorm":
            expect(existsSync(`${projectPath}/apps/api/src/entities`)).toBe(true);
            expect(existsSync(`${projectPath}/apps/api/ormconfig.ts`)).toBe(true);
            break;
          case "mongoose":
            expect(existsSync(`${projectPath}/apps/api/src/models`)).toBe(true);
            break;
        }

        // Check package.json for ORM dependencies
        if (orm !== "none") {
          const packageJson = JSON.parse(
            readFileSync(`${projectPath}/apps/api/package.json`, "utf-8")
          );

          switch (orm) {
            case "prisma":
              expect(packageJson.dependencies?.["@prisma/client"]).toBeDefined();
              expect(packageJson.devDependencies?.prisma).toBeDefined();
              break;
            case "drizzle":
              expect(packageJson.dependencies?.["drizzle-orm"]).toBeDefined();
              break;
            case "typeorm":
              expect(packageJson.dependencies?.typeorm).toBeDefined();
              break;
            case "mongoose":
              expect(packageJson.dependencies?.mongoose).toBeDefined();
              break;
          }
        }

        // Check database driver dependencies
        const packageJson = JSON.parse(
          readFileSync(`${projectPath}/apps/api/package.json`, "utf-8")
        );

        switch (database) {
          case "postgres":
            expect(
              packageJson.dependencies?.pg || packageJson.dependencies?.postgres
            ).toBeDefined();
            break;
          case "mysql":
            expect(packageJson.dependencies?.mysql2).toBeDefined();
            break;
          case "mongodb":
            expect(
              packageJson.dependencies?.mongodb || packageJson.dependencies?.mongoose
            ).toBeDefined();
            break;
          case "duckdb":
            expect(packageJson.dependencies?.duckdb).toBeDefined();
            break;
        }
      }, 45000);
    });
  });

  describe("Styling Options", () => {
    const stylingOptions = [
      "tailwind",
      "css",
      "scss",
      "css-modules",
      "styled-components",
      "emotion",
    ];

    stylingOptions.forEach((styling) => {
      it(`should setup ${styling} correctly`, async () => {
        const projectName = `styling-${styling}`;
        const workingDir = sandbox.getTempDir();

        const config = {
          name: projectName,
          framework: "react",
          backend: "none",
          database: "none",
          orm: "none",
          styling,
          runtime: "node",
          typescript: true,
          category: "edge" as const,
          expectedDuration: 6000,
        };

        const result = await testRunner.generateProject(projectName, config, workingDir, {
          install: false,
        });

        expect(result.exitCode).toBe(0);

        const projectPath = sandbox.getPath(projectName);
        const { existsSync, readFileSync } = await import("fs");

        // Check styling-specific files and dependencies
        const packageJson = JSON.parse(readFileSync(`${projectPath}/package.json`, "utf-8"));

        switch (styling) {
          case "tailwind":
            expect(existsSync(`${projectPath}/tailwind.config.js`)).toBe(true);
            expect(existsSync(`${projectPath}/postcss.config.js`)).toBe(true);
            expect(packageJson.devDependencies?.tailwindcss).toBeDefined();
            break;
          case "scss":
            expect(packageJson.devDependencies?.sass).toBeDefined();
            break;
          case "styled-components":
            expect(packageJson.dependencies?.["styled-components"]).toBeDefined();
            break;
          case "emotion":
            expect(packageJson.dependencies?.["@emotion/react"]).toBeDefined();
            expect(packageJson.dependencies?.["@emotion/styled"]).toBeDefined();
            break;
        }
      }, 30000);
    });
  });

  describe("TypeScript vs JavaScript", () => {
    it("should generate TypeScript project with correct config", async () => {
      const projectName = "typescript-project";
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
        category: "common" as const,
        expectedDuration: 8000,
      };

      const result = await testRunner.generateProject(projectName, config, workingDir, {
        install: false,
      });

      expect(result.exitCode).toBe(0);

      const projectPath = sandbox.getPath(projectName);
      const { existsSync } = await import("fs");

      // Check TypeScript files
      expect(existsSync(`${projectPath}/tsconfig.json`)).toBe(true);
      expect(existsSync(`${projectPath}/apps/web/tsconfig.json`)).toBe(true);
      expect(existsSync(`${projectPath}/apps/api/tsconfig.json`)).toBe(true);
      expect(existsSync(`${projectPath}/apps/web/src/App.tsx`)).toBe(true);
      expect(existsSync(`${projectPath}/apps/api/src/index.ts`)).toBe(true);
    }, 30000);

    it("should generate JavaScript project without TypeScript", async () => {
      const projectName = "javascript-project";
      const workingDir = sandbox.getTempDir();

      const config = {
        name: projectName,
        framework: "react",
        backend: "express",
        database: "postgres",
        orm: "prisma",
        styling: "css",
        runtime: "node",
        typescript: false,
        category: "common" as const,
        expectedDuration: 8000,
      };

      const result = await testRunner.generateProject(projectName, config, workingDir, {
        install: false,
      });

      expect(result.exitCode).toBe(0);

      const projectPath = sandbox.getPath(projectName);
      const { existsSync } = await import("fs");

      // Check JavaScript files
      expect(existsSync(`${projectPath}/apps/web/src/App.jsx`)).toBe(true);
      expect(existsSync(`${projectPath}/apps/api/src/index.js`)).toBe(true);

      // TypeScript config should not exist
      expect(existsSync(`${projectPath}/tsconfig.json`)).toBe(false);
    }, 30000);
  });
});

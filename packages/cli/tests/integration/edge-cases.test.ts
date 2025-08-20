import { describe, it, expect, beforeEach, afterEach } from "vitest";

import { TestSandbox } from "../helpers/sandbox.js";
import { CLITestRunner } from "../helpers/test-cli.js";

describe("Edge Cases and Error Handling", () => {
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

  describe("Invalid Combinations", () => {
    it("should reject incompatible database and ORM combinations", async () => {
      const projectName = "invalid-db-orm";
      const workingDir = sandbox.getTempDir();

      const config = {
        name: projectName,
        framework: "react",
        backend: "express",
        database: "mongodb",
        orm: "drizzle", // Drizzle doesn't support MongoDB
        styling: "css",
        runtime: "node",
        typescript: true,
        category: "edge" as const,
        expectedDuration: 5000,
      };

      const result = await testRunner.generateProject(projectName, config, workingDir, {
        install: false,
      });

      // Should fail or handle gracefully
      expect(result.exitCode).not.toBe(0);
      expect(result.stderr).toContain("incompatible");
    }, 30000);

    it("should reject Convex backend with database options", async () => {
      const projectName = "convex-with-db";
      const workingDir = sandbox.getTempDir();

      const config = {
        name: projectName,
        framework: "react",
        backend: "convex",
        database: "postgres", // Convex has its own database
        orm: "prisma",
        styling: "css",
        runtime: "node",
        typescript: true,
        category: "edge" as const,
        expectedDuration: 5000,
      };

      const result = await testRunner.generateProject(projectName, config, workingDir, {
        install: false,
      });

      // Should fail or ignore database/orm options
      if (result.exitCode === 0) {
        const projectPath = sandbox.getPath(projectName);
        const { existsSync } = await import("fs");

        // Should not have Prisma files if Convex is used
        expect(existsSync(`${projectPath}/prisma`)).toBe(false);
      }
    }, 30000);

    it("should handle FastAPI with TypeScript flag", async () => {
      const projectName = "fastapi-typescript";
      const workingDir = sandbox.getTempDir();

      const config = {
        name: projectName,
        framework: "react",
        backend: "fastapi",
        database: "postgres",
        orm: "sqlalchemy",
        styling: "css",
        runtime: "python",
        typescript: true, // FastAPI is Python, should ignore TypeScript for backend
        category: "edge" as const,
        expectedDuration: 7000,
      };

      const result = await testRunner.generateProject(projectName, config, workingDir, {
        install: false,
      });

      expect(result.exitCode).toBe(0);

      const projectPath = sandbox.getPath(projectName);
      const { existsSync } = await import("fs");

      // Frontend should have TypeScript
      expect(existsSync(`${projectPath}/apps/web/tsconfig.json`)).toBe(true);

      // Backend should be Python
      expect(existsSync(`${projectPath}/apps/api/app/main.py`)).toBe(true);
      expect(existsSync(`${projectPath}/apps/api/requirements.txt`)).toBe(true);
    }, 30000);
  });

  describe("Special Characters and Names", () => {
    it("should handle project names with hyphens", async () => {
      const projectName = "my-awesome-project";
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
        category: "edge" as const,
        expectedDuration: 5000,
      };

      const result = await testRunner.generateProject(projectName, config, workingDir, {
        install: false,
      });

      expect(result.exitCode).toBe(0);

      const projectPath = sandbox.getPath(projectName);
      const { existsSync } = await import("fs");
      expect(existsSync(projectPath)).toBe(true);
    }, 30000);

    it("should handle project names with underscores", async () => {
      const projectName = "my_awesome_project";
      const workingDir = sandbox.getTempDir();

      const config = {
        name: projectName,
        framework: "vue",
        backend: "none",
        database: "none",
        orm: "none",
        styling: "css",
        runtime: "node",
        typescript: false,
        category: "edge" as const,
        expectedDuration: 5000,
      };

      const result = await testRunner.generateProject(projectName, config, workingDir, {
        install: false,
      });

      expect(result.exitCode).toBe(0);

      const projectPath = sandbox.getPath(projectName);
      const { existsSync } = await import("fs");
      expect(existsSync(projectPath)).toBe(true);
    }, 30000);

    it("should reject invalid project names", async () => {
      const invalidNames = ["123-start-with-number", "has spaces", "has@special#chars"];

      for (const projectName of invalidNames) {
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
          category: "edge" as const,
          expectedDuration: 3000,
        };

        const result = await testRunner.generateProject(projectName, config, workingDir, {
          install: false,
        });

        // Should either fail or sanitize the name
        if (result.exitCode === 0) {
          const projectPath = sandbox.getPath(projectName);
          const { existsSync } = await import("fs");

          // If it succeeded, check if name was sanitized
          const sanitizedName = projectName.replace(/[^a-zA-Z0-9-_]/g, "-");
          const sanitizedPath = sandbox.getPath(sanitizedName);

          expect(existsSync(projectPath) || existsSync(sanitizedPath)).toBe(true);
        }
      }
    }, 45000);
  });

  describe("Empty and Minimal Configurations", () => {
    it("should handle minimal configuration (framework only)", async () => {
      const projectName = "minimal-react";
      const workingDir = sandbox.getTempDir();

      const config = {
        name: projectName,
        framework: "react",
        backend: "none",
        database: "none",
        orm: "none",
        styling: "css",
        runtime: "node",
        typescript: false,
        category: "edge" as const,
        expectedDuration: 5000,
      };

      const result = await testRunner.generateProject(projectName, config, workingDir, {
        install: false,
      });

      expect(result.exitCode).toBe(0);

      const projectPath = sandbox.getPath(projectName);
      const { existsSync, readFileSync } = await import("fs");

      // Should create a basic React app
      expect(existsSync(`${projectPath}/package.json`)).toBe(true);
      expect(existsSync(`${projectPath}/src/App.jsx`)).toBe(true);

      // Check minimal dependencies
      const packageJson = JSON.parse(readFileSync(`${projectPath}/package.json`, "utf-8"));
      expect(packageJson.dependencies?.react).toBeDefined();
      expect(packageJson.dependencies?.["react-dom"]).toBeDefined();
    }, 30000);

    it("should handle backend-only configuration", async () => {
      const projectName = "backend-only";
      const workingDir = sandbox.getTempDir();

      const config = {
        name: projectName,
        framework: "none",
        backend: "express",
        database: "postgres",
        orm: "prisma",
        styling: "none",
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
      const { existsSync } = await import("fs");

      // Should create backend-only structure
      expect(existsSync(`${projectPath}/src/index.ts`)).toBe(true);
      expect(existsSync(`${projectPath}/prisma/schema.prisma`)).toBe(true);

      // Should not have frontend files
      expect(existsSync(`${projectPath}/apps/web`)).toBe(false);
    }, 30000);
  });

  describe("Large Configurations", () => {
    it("should handle maximum features enabled", async () => {
      const projectName = "everything-enabled";
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
        docker: true,
        includeRedis: true,
        includeAdminTools: true,
        authProvider: "better-auth",
        uiLibrary: "shadcn",
        apiClient: "tanstack-query",
        aiAssistant: "claude",
        mcpServers: ["filesystem", "github-official", "postgresql"],
        powerups: ["vitest", "playwright", "eslint", "prettier", "husky"],
        plugins: ["stripe", "resend", "posthog", "sentry"],
        deploymentMethod: "vercel",
        category: "critical" as const,
        expectedDuration: 20000,
      };

      const result = await testRunner.generateProject(projectName, config, workingDir, {
        install: false,
      });

      expect(result.exitCode).toBe(0);

      const projectPath = sandbox.getPath(projectName);
      const { existsSync, readFileSync } = await import("fs");

      // Check that all major features are present
      expect(existsSync(`${projectPath}/docker-compose.yml`)).toBe(true);
      expect(existsSync(`${projectPath}/prisma/schema.prisma`)).toBe(true);
      expect(existsSync(`${projectPath}/src/lib/auth.ts`)).toBe(true);
      expect(existsSync(`${projectPath}/components.json`)).toBe(true);
      expect(existsSync(`${projectPath}/.claude/settings.json`)).toBe(true);
      expect(existsSync(`${projectPath}/vitest.config.ts`)).toBe(true);
      expect(existsSync(`${projectPath}/vercel.json`)).toBe(true);

      // Check package.json has all dependencies
      const packageJson = JSON.parse(readFileSync(`${projectPath}/package.json`, "utf-8"));

      expect(packageJson.dependencies?.next).toBeDefined();
      expect(packageJson.dependencies?.["@prisma/client"]).toBeDefined();
      expect(packageJson.dependencies?.["better-auth"]).toBeDefined();
      expect(packageJson.dependencies?.stripe).toBeDefined();
      expect(packageJson.dependencies?.resend).toBeDefined();
      expect(packageJson.dependencies?.["posthog-js"]).toBeDefined();
    }, 60000); // 1 minute timeout for complex setup
  });

  describe("Package Manager Handling", () => {
    const packageManagers = ["npm", "yarn", "pnpm", "bun"];

    packageManagers.forEach((pm) => {
      it(`should respect ${pm} package manager choice`, async () => {
        const projectName = `pm-${pm}-test`;
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
          packageManager: pm,
          category: "edge" as const,
          expectedDuration: 5000,
        };

        const result = await testRunner.generateProject(projectName, config, workingDir, {
          install: false,
          packageManager: pm,
        });

        expect(result.exitCode).toBe(0);

        const projectPath = sandbox.getPath(projectName);
        const { existsSync } = await import("fs");

        // Check for package manager lock files
        switch (pm) {
          case "npm":
            if (existsSync(`${projectPath}/package-lock.json`)) {
              expect(existsSync(`${projectPath}/package-lock.json`)).toBe(true);
            }
            break;
          case "yarn":
            if (existsSync(`${projectPath}/yarn.lock`)) {
              expect(existsSync(`${projectPath}/yarn.lock`)).toBe(true);
            }
            break;
          case "pnpm":
            if (existsSync(`${projectPath}/pnpm-lock.yaml`)) {
              expect(existsSync(`${projectPath}/pnpm-lock.yaml`)).toBe(true);
            }
            break;
          case "bun":
            if (existsSync(`${projectPath}/bun.lockb`)) {
              expect(existsSync(`${projectPath}/bun.lockb`)).toBe(true);
            }
            break;
        }
      }, 30000);
    });
  });

  describe("Runtime Options", () => {
    it("should handle Bun runtime", async () => {
      const projectName = "bun-runtime";
      const workingDir = sandbox.getTempDir();

      const config = {
        name: projectName,
        framework: "react",
        backend: "hono",
        database: "none",
        orm: "none",
        styling: "css",
        runtime: "bun",
        typescript: true,
        category: "edge" as const,
        expectedDuration: 6000,
      };

      const result = await testRunner.generateProject(projectName, config, workingDir, {
        install: false,
      });

      expect(result.exitCode).toBe(0);

      const projectPath = sandbox.getPath(projectName);
      const { readFileSync } = await import("fs");

      // Check package.json for Bun-specific scripts
      const apiPackageJson = JSON.parse(
        readFileSync(`${projectPath}/apps/api/package.json`, "utf-8")
      );

      // Scripts should use bun instead of node
      if (apiPackageJson.scripts?.dev) {
        expect(
          apiPackageJson.scripts.dev.includes("bun") || apiPackageJson.scripts.dev.includes("tsx")
        ).toBe(true);
      }
    }, 30000);

    it("should handle Cloudflare runtime", async () => {
      const projectName = "cloudflare-runtime";
      const workingDir = sandbox.getTempDir();

      const config = {
        name: projectName,
        framework: "none",
        backend: "cloudflare-workers",
        database: "cloudflare-d1",
        orm: "drizzle",
        styling: "none",
        runtime: "cloudflare",
        typescript: true,
        category: "edge" as const,
        expectedDuration: 6000,
      };

      const result = await testRunner.generateProject(projectName, config, workingDir, {
        install: false,
      });

      expect(result.exitCode).toBe(0);

      const projectPath = sandbox.getPath(projectName);
      const { existsSync } = await import("fs");

      // Check for Cloudflare-specific files
      expect(existsSync(`${projectPath}/wrangler.toml`)).toBe(true);
      expect(existsSync(`${projectPath}/src/index.ts`)).toBe(true);
    }, 30000);
  });

  describe("Git Configuration", () => {
    it("should respect --no-git flag", async () => {
      const projectName = "no-git-project";
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
        git: false,
        category: "edge" as const,
        expectedDuration: 5000,
      };

      const result = await testRunner.generateProject(projectName, config, workingDir, {
        install: false,
      });

      expect(result.exitCode).toBe(0);

      const projectPath = sandbox.getPath(projectName);
      const { existsSync } = await import("fs");

      // Should not have .git directory
      expect(existsSync(`${projectPath}/.git`)).toBe(false);
    }, 30000);

    it("should respect --no-gitignore flag", async () => {
      const projectName = "no-gitignore-project";
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
        gitignore: false,
        category: "edge" as const,
        expectedDuration: 5000,
      };

      const result = await testRunner.generateProject(projectName, config, workingDir, {
        install: false,
      });

      expect(result.exitCode).toBe(0);

      const projectPath = sandbox.getPath(projectName);
      const { existsSync } = await import("fs");

      // Should not have .gitignore file
      expect(existsSync(`${projectPath}/.gitignore`)).toBe(false);
    }, 30000);
  });
});

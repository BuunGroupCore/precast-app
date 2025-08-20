import { describe, it, expect, beforeEach, afterEach } from "vitest";

import { DOCKER_FIXTURES } from "../fixtures/expanded-fixtures";
import { ProjectValidator } from "../helpers/project-validator";
import { TestSandbox } from "../helpers/sandbox";
import { CLITestRunner } from "../helpers/test-cli";

describe("Docker Deployment Tests", () => {
  let testRunner: CLITestRunner;
  let _validator: ProjectValidator;
  let sandbox: TestSandbox;

  beforeEach(async () => {
    testRunner = new CLITestRunner();
    _validator = new ProjectValidator();
    sandbox = new TestSandbox();
    await sandbox.setup();
  });

  afterEach(async () => {
    await sandbox.cleanup();
  });

  describe("Docker Configuration Generation", () => {
    DOCKER_FIXTURES.forEach((fixture) => {
      it(`should generate ${fixture.name} with Docker configuration`, async () => {
        const projectName = `docker-${fixture.name}`;
        const workingDir = sandbox.getTempDir();

        console.info(`🐳 Generating Docker project: ${projectName}`);

        const result = await testRunner.generateProject(projectName, fixture.config, workingDir, {
          install: false,
        });

        expect(result.exitCode).toBe(0);

        const projectPath = sandbox.getPath(projectName);

        // Validate Docker files exist
        const { existsSync } = await import("fs");
        expect(existsSync(`${projectPath}/docker-compose.yml`)).toBe(true);

        // Check for database-specific Docker configs
        if (fixture.config.database && fixture.config.database !== "none") {
          const dbDockerPath = `${projectPath}/docker/${fixture.config.database}/docker-compose.yml`;
          expect(existsSync(dbDockerPath)).toBe(true);
        }

        // Validate .env.docker file
        expect(existsSync(`${projectPath}/.env.docker`)).toBe(true);

        // Validate docker scripts
        if (fixture.config.database !== "none") {
          expect(existsSync(`${projectPath}/docker/wait-for-db.sh`)).toBe(true);
        }
      }, 30000);
    });
  });

  describe("Docker with Auto-Deploy", () => {
    it("should generate Docker config with auto-deploy scripts", async () => {
      const projectName = "docker-auto-deploy";
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
        docker: true,
        autoDeploy: true,
        category: "common" as const,
        expectedDuration: 10000,
      };

      const result = await testRunner.generateProject(projectName, config, workingDir, {
        install: false,
      });

      expect(result.exitCode).toBe(0);

      const projectPath = sandbox.getPath(projectName);
      const { existsSync } = await import("fs");

      // Check for auto-deploy scripts
      expect(existsSync(`${projectPath}/scripts/docker-auto-deploy.sh`)).toBe(true);
      expect(existsSync(`${projectPath}/scripts/docker-auto-deploy.bat`)).toBe(true);
    }, 30000);
  });

  describe("Docker with Multiple Databases", () => {
    const databases = ["postgres", "mysql", "mongodb"];

    databases.forEach((database) => {
      it(`should generate Docker config for ${database}`, async () => {
        const projectName = `docker-${database}-test`;
        const workingDir = sandbox.getTempDir();

        const config = {
          name: projectName,
          framework: "react",
          backend: "express",
          database,
          orm: database === "mongodb" ? "mongoose" : "prisma",
          styling: "css",
          runtime: "node",
          typescript: true,
          docker: true,
          category: "common" as const,
          expectedDuration: 8000,
        };

        const result = await testRunner.generateProject(projectName, config, workingDir, {
          install: false,
        });

        expect(result.exitCode).toBe(0);

        const projectPath = sandbox.getPath(projectName);
        const { existsSync } = await import("fs");

        // Verify database-specific Docker configuration
        expect(existsSync(`${projectPath}/docker/${database}/docker-compose.yml`)).toBe(true);

        // Check for database-specific environment variables
        const { readFileSync } = await import("fs");
        const envContent = readFileSync(`${projectPath}/.env.docker`, "utf-8");

        if (database === "postgres") {
          expect(envContent).toContain("POSTGRES_USER");
          expect(envContent).toContain("POSTGRES_PASSWORD");
          expect(envContent).toContain("POSTGRES_DB");
        } else if (database === "mysql") {
          expect(envContent).toContain("MYSQL_ROOT_PASSWORD");
          expect(envContent).toContain("MYSQL_DATABASE");
        } else if (database === "mongodb") {
          expect(envContent).toContain("MONGO_INITDB_ROOT_USERNAME");
          expect(envContent).toContain("MONGO_INITDB_ROOT_PASSWORD");
        }
      }, 30000);
    });
  });

  describe("Docker with Redis", () => {
    it("should include Redis when includeRedis option is set", async () => {
      const projectName = "docker-with-redis";
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
        docker: true,
        includeRedis: true,
        category: "common" as const,
        expectedDuration: 10000,
      };

      const result = await testRunner.generateProject(projectName, config, workingDir, {
        install: false,
      });

      expect(result.exitCode).toBe(0);

      const projectPath = sandbox.getPath(projectName);
      const { readFileSync } = await import("fs");

      // Check docker-compose includes Redis
      const dockerComposeContent = readFileSync(`${projectPath}/docker-compose.yml`, "utf-8");
      expect(dockerComposeContent).toContain("redis");

      // Check for Redis environment variables
      const envContent = readFileSync(`${projectPath}/.env.docker`, "utf-8");
      expect(envContent).toContain("REDIS_URL");
    }, 30000);
  });

  describe("Docker with Admin Tools", () => {
    it("should include admin tools when includeAdminTools is set", async () => {
      const projectName = "docker-with-admin";
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
        includeAdminTools: true,
        category: "edge" as const,
        expectedDuration: 10000,
      };

      const result = await testRunner.generateProject(projectName, config, workingDir, {
        install: false,
      });

      expect(result.exitCode).toBe(0);

      const projectPath = sandbox.getPath(projectName);
      const { readFileSync } = await import("fs");

      // Check docker-compose includes pgAdmin for PostgreSQL
      const dockerComposeContent = readFileSync(`${projectPath}/docker-compose.yml`, "utf-8");
      expect(dockerComposeContent).toContain("pgadmin");
    }, 30000);
  });

  describe("Docker Security", () => {
    it("should use secure passwords by default", async () => {
      const projectName = "docker-secure";
      const workingDir = sandbox.getTempDir();

      const config = {
        name: projectName,
        framework: "react",
        backend: "express",
        database: "postgres",
        orm: "prisma",
        styling: "css",
        runtime: "node",
        typescript: true,
        docker: true,
        securePasswords: true,
        category: "common" as const,
        expectedDuration: 8000,
      };

      const result = await testRunner.generateProject(projectName, config, workingDir, {
        install: false,
      });

      expect(result.exitCode).toBe(0);

      const projectPath = sandbox.getPath(projectName);
      const { readFileSync } = await import("fs");

      // Check that passwords are not simple defaults
      const envContent = readFileSync(`${projectPath}/.env.docker`, "utf-8");
      expect(envContent).not.toContain("password123");
      expect(envContent).not.toContain("admin");
      expect(envContent).not.toContain("root");

      // Should contain complex password patterns
      const passwordPattern = /[A-Za-z0-9]{16,}/;
      expect(envContent).toMatch(passwordPattern);
    }, 30000);

    it("should allow simple passwords when --no-secure-passwords is used", async () => {
      const projectName = "docker-simple-pass";
      const workingDir = sandbox.getTempDir();

      const config = {
        name: projectName,
        framework: "react",
        backend: "express",
        database: "postgres",
        orm: "prisma",
        styling: "css",
        runtime: "node",
        typescript: true,
        docker: true,
        securePasswords: false,
        category: "edge" as const,
        expectedDuration: 8000,
      };

      const result = await testRunner.generateProject(projectName, config, workingDir, {
        install: false,
      });

      expect(result.exitCode).toBe(0);

      const projectPath = sandbox.getPath(projectName);
      const { readFileSync } = await import("fs");

      // Check that passwords are simple for development
      const envContent = readFileSync(`${projectPath}/.env.docker`, "utf-8");
      expect(envContent).toContain("postgres");
    }, 30000);
  });
});

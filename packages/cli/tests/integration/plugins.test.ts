import { describe, it, expect, beforeEach, afterEach } from "vitest";

import { PLUGIN_FIXTURES } from "../fixtures/expanded-fixtures";
import { TestSandbox } from "../helpers/sandbox";
import { CLITestRunner } from "../helpers/test-cli";

describe("Plugin System Tests", () => {
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

  describe("Plugin Installation", () => {
    PLUGIN_FIXTURES.forEach((fixture) => {
      it(`should install ${fixture.name} with plugins`, async () => {
        const projectName = `plugin-${fixture.name}`;
        const workingDir = sandbox.getTempDir();

        console.info(`🔌 Generating project with plugins: ${fixture.config.plugins?.join(", ")}`);

        const result = await testRunner.generateProject(projectName, fixture.config, workingDir, {
          install: false,
        });

        expect(result.exitCode).toBe(0);

        const projectPath = sandbox.getPath(projectName);
        const { existsSync, readFileSync } = await import("fs");

        // Check package.json for plugin dependencies
        const packageJsonPath =
          fixture.config.backend !== "none"
            ? `${projectPath}/apps/web/package.json`
            : `${projectPath}/package.json`;

        const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf-8"));

        // Validate plugin dependencies are added
        fixture.expectedDependencies.forEach((dep) => {
          if (dep !== "react" && dep !== "express" && dep !== "next" && dep !== "vue") {
            expect(
              packageJson.dependencies?.[dep] || packageJson.devDependencies?.[dep]
            ).toBeDefined();
          }
        });

        // Validate plugin files are created
        fixture.expectedFiles.forEach((file) => {
          if (file.includes("src/") || file.includes("app/")) {
            const fullPath = `${projectPath}/${file}`;
            expect(existsSync(fullPath)).toBe(true);
          }
        });
      }, 45000);
    });
  });

  describe("Stripe Plugin", () => {
    it("should setup Stripe with all necessary files", async () => {
      const projectName = "stripe-integration";
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
        plugins: ["stripe"],
        category: "critical" as const,
        expectedDuration: 10000,
      };

      const result = await testRunner.generateProject(projectName, config, workingDir, {
        install: false,
      });

      expect(result.exitCode).toBe(0);

      const projectPath = sandbox.getPath(projectName);
      const { existsSync, readFileSync } = await import("fs");

      // Check for Stripe API routes
      expect(existsSync(`${projectPath}/src/app/api/stripe/route.ts`)).toBe(true);

      // Check for Stripe components
      expect(existsSync(`${projectPath}/src/components/stripe/CheckoutForm.tsx`)).toBe(true);

      // Check for environment variables template
      const envExample = readFileSync(`${projectPath}/.env.example`, "utf-8");
      expect(envExample).toContain("STRIPE_PUBLISHABLE_KEY");
      expect(envExample).toContain("STRIPE_SECRET_KEY");
      expect(envExample).toContain("STRIPE_WEBHOOK_SECRET");

      // Check package.json for Stripe dependencies
      const packageJson = JSON.parse(readFileSync(`${projectPath}/package.json`, "utf-8"));
      expect(packageJson.dependencies?.["stripe"]).toBeDefined();
      expect(packageJson.dependencies?.["@stripe/stripe-js"]).toBeDefined();
    }, 30000);
  });

  describe("Email Plugins", () => {
    const emailPlugins = ["resend", "sendgrid"];

    emailPlugins.forEach((plugin) => {
      it(`should setup ${plugin} email service`, async () => {
        const projectName = `${plugin}-email`;
        const workingDir = sandbox.getTempDir();

        const config = {
          name: projectName,
          framework: "react",
          backend: "express",
          database: "none",
          orm: "none",
          styling: "css",
          runtime: "node",
          typescript: true,
          plugins: [plugin],
          category: "common" as const,
          expectedDuration: 8000,
        };

        const result = await testRunner.generateProject(projectName, config, workingDir, {
          install: false,
        });

        expect(result.exitCode).toBe(0);

        const projectPath = sandbox.getPath(projectName);
        const { existsSync, readFileSync } = await import("fs");

        // Check for email service files
        expect(existsSync(`${projectPath}/apps/api/src/services/${plugin}.ts`)).toBe(true);

        // Check environment variables
        const envExample = readFileSync(`${projectPath}/.env.example`, "utf-8");
        if (plugin === "resend") {
          expect(envExample).toContain("RESEND_API_KEY");
        } else if (plugin === "sendgrid") {
          expect(envExample).toContain("SENDGRID_API_KEY");
        }

        // Check package.json
        const packageJson = JSON.parse(
          readFileSync(`${projectPath}/apps/api/package.json`, "utf-8")
        );

        if (plugin === "resend") {
          expect(packageJson.dependencies?.["resend"]).toBeDefined();
        } else if (plugin === "sendgrid") {
          expect(packageJson.dependencies?.["@sendgrid/mail"]).toBeDefined();
        }
      }, 30000);
    });
  });

  describe("Socket.IO Plugin", () => {
    it("should setup Socket.IO for real-time communication", async () => {
      const projectName = "socketio-realtime";
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
        plugins: ["socketio"],
        category: "common" as const,
        expectedDuration: 9000,
      };

      const result = await testRunner.generateProject(projectName, config, workingDir, {
        install: false,
      });

      expect(result.exitCode).toBe(0);

      const projectPath = sandbox.getPath(projectName);
      const { existsSync, readFileSync } = await import("fs");

      // Check for Socket.IO server setup
      expect(existsSync(`${projectPath}/apps/api/src/socket/index.ts`)).toBe(true);

      // Check for Socket.IO client hooks
      expect(existsSync(`${projectPath}/apps/web/src/hooks/useSocket.ts`)).toBe(true);

      // Check package.json for Socket.IO dependencies
      const apiPackageJson = JSON.parse(
        readFileSync(`${projectPath}/apps/api/package.json`, "utf-8")
      );
      const webPackageJson = JSON.parse(
        readFileSync(`${projectPath}/apps/web/package.json`, "utf-8")
      );

      expect(apiPackageJson.dependencies?.["socket.io"]).toBeDefined();
      expect(webPackageJson.dependencies?.["socket.io-client"]).toBeDefined();
    }, 30000);
  });

  describe("Analytics Plugins", () => {
    it("should setup PostHog analytics", async () => {
      const projectName = "posthog-analytics";
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
        plugins: ["posthog"],
        category: "common" as const,
        expectedDuration: 7000,
      };

      const result = await testRunner.generateProject(projectName, config, workingDir, {
        install: false,
      });

      expect(result.exitCode).toBe(0);

      const projectPath = sandbox.getPath(projectName);
      const { existsSync, readFileSync } = await import("fs");

      // Check for PostHog setup files
      expect(existsSync(`${projectPath}/src/lib/posthog.ts`)).toBe(true);

      // Check environment variables
      const envExample = readFileSync(`${projectPath}/.env.example`, "utf-8");
      expect(envExample).toContain("NEXT_PUBLIC_POSTHOG_KEY");
      expect(envExample).toContain("NEXT_PUBLIC_POSTHOG_HOST");

      // Check package.json
      const packageJson = JSON.parse(readFileSync(`${projectPath}/package.json`, "utf-8"));
      expect(packageJson.dependencies?.["posthog-js"]).toBeDefined();
    }, 30000);

    it("should setup Sentry error tracking", async () => {
      const projectName = "sentry-monitoring";
      const workingDir = sandbox.getTempDir();

      const config = {
        name: projectName,
        framework: "react",
        backend: "express",
        database: "none",
        orm: "none",
        styling: "css",
        runtime: "node",
        typescript: true,
        plugins: ["sentry"],
        category: "common" as const,
        expectedDuration: 8000,
      };

      const result = await testRunner.generateProject(projectName, config, workingDir, {
        install: false,
      });

      expect(result.exitCode).toBe(0);

      const projectPath = sandbox.getPath(projectName);
      const { existsSync, readFileSync } = await import("fs");

      // Check for Sentry configuration files
      expect(existsSync(`${projectPath}/sentry.client.config.ts`)).toBe(true);
      expect(existsSync(`${projectPath}/sentry.server.config.ts`)).toBe(true);

      // Check environment variables
      const envExample = readFileSync(`${projectPath}/.env.example`, "utf-8");
      expect(envExample).toContain("SENTRY_DSN");

      // Check package.json
      const webPackageJson = JSON.parse(
        readFileSync(`${projectPath}/apps/web/package.json`, "utf-8")
      );
      expect(webPackageJson.dependencies?.["@sentry/react"]).toBeDefined();
    }, 30000);
  });

  describe("Storage Plugins", () => {
    it("should setup Cloudinary for image storage", async () => {
      const projectName = "cloudinary-storage";
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
        plugins: ["cloudinary"],
        category: "edge" as const,
        expectedDuration: 7000,
      };

      const result = await testRunner.generateProject(projectName, config, workingDir, {
        install: false,
      });

      expect(result.exitCode).toBe(0);

      const projectPath = sandbox.getPath(projectName);
      const { existsSync, readFileSync } = await import("fs");

      // Check for Cloudinary setup
      expect(existsSync(`${projectPath}/src/lib/cloudinary.ts`)).toBe(true);

      // Check environment variables
      const envExample = readFileSync(`${projectPath}/.env.example`, "utf-8");
      expect(envExample).toContain("CLOUDINARY_CLOUD_NAME");
      expect(envExample).toContain("CLOUDINARY_API_KEY");
      expect(envExample).toContain("CLOUDINARY_API_SECRET");

      // Check package.json
      const packageJson = JSON.parse(readFileSync(`${projectPath}/package.json`, "utf-8"));
      expect(packageJson.dependencies?.["cloudinary"]).toBeDefined();
    }, 30000);
  });

  describe("Multiple Plugins", () => {
    it("should install multiple plugins together", async () => {
      const projectName = "multi-plugin-project";
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
        plugins: ["stripe", "resend", "posthog", "sentry"],
        category: "critical" as const,
        expectedDuration: 12000,
      };

      const result = await testRunner.generateProject(projectName, config, workingDir, {
        install: false,
      });

      expect(result.exitCode).toBe(0);

      const projectPath = sandbox.getPath(projectName);
      const { readFileSync } = await import("fs");

      // Check package.json for all plugin dependencies
      const packageJson = JSON.parse(readFileSync(`${projectPath}/package.json`, "utf-8"));

      expect(packageJson.dependencies?.["stripe"]).toBeDefined();
      expect(packageJson.dependencies?.["resend"]).toBeDefined();
      expect(packageJson.dependencies?.["posthog-js"]).toBeDefined();
      expect(packageJson.dependencies?.["@sentry/nextjs"]).toBeDefined();

      // Check environment variables for all plugins
      const envExample = readFileSync(`${projectPath}/.env.example`, "utf-8");
      expect(envExample).toContain("STRIPE_PUBLIC_KEY");
      expect(envExample).toContain("RESEND_API_KEY");
      expect(envExample).toContain("NEXT_PUBLIC_POSTHOG_KEY");
      expect(envExample).toContain("SENTRY_DSN");
    }, 45000);
  });
});

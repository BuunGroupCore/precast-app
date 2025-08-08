import * as path from "path";

import { consola } from "consola";
// eslint-disable-next-line import/default
import fsExtra from "fs-extra";

// eslint-disable-next-line import/no-named-as-default-member
const { ensureDir, writeFile, readFile, pathExists } = fsExtra;

import type { ProjectConfig } from "../../../../shared/stack-config.js";
import type { TemplateEngine } from "../../core/template-engine.js";
import { installDependencies } from "../../utils/package-manager.js";

import type { DatabaseGenerator } from "./database-generator.interface.js";

export class TursoGenerator implements DatabaseGenerator {
  id = "turso";
  name = "Turso";
  supportedORMs = ["drizzle", "prisma"];

  async setup(
    config: ProjectConfig,
    projectPath: string,
    templateEngine: TemplateEngine
  ): Promise<void> {
    consola.info("Setting up Turso database configuration...");

    // Create database directories
    const dbDir = path.join(projectPath, "src", "lib");
    await ensureDir(dbDir);

    // Copy Turso-specific configuration files
    await this.copyConfigurationFiles(config, projectPath, templateEngine);

    // Create database connection helper
    await this.setupConnectionHelper(config, projectPath);

    // Add database health check endpoint
    await this.setupHealthCheck(config, projectPath, templateEngine);
  }

  async installDependencies(config: ProjectConfig, projectPath: string): Promise<void> {
    const packages = ["@libsql/client"];
    const devPackages: string[] = [];

    // Add ORM-specific packages
    switch (config.orm) {
      case "drizzle":
        packages.push("drizzle-orm");
        devPackages.push("drizzle-kit");
        break;
      case "prisma":
        packages.push("@prisma/adapter-libsql");
        devPackages.push("prisma");
        packages.push("@prisma/client");
        break;
    }

    // Install packages
    consola.info("📦 Installing Turso packages...");
    await installDependencies(packages, {
      packageManager: config.packageManager,
      projectPath,
      dev: false,
    });

    if (devPackages.length > 0) {
      await installDependencies(devPackages, {
        packageManager: config.packageManager,
        projectPath,
        dev: true,
      });
    }
  }

  async setupEnvironment(config: ProjectConfig, projectPath: string): Promise<void> {
    const envPath = path.join(projectPath, ".env");
    const envExamplePath = path.join(projectPath, ".env.example");

    const envContent = `
# Turso Database Configuration
TURSO_DATABASE_URL="libsql://[database]-[organization].turso.io"
TURSO_AUTH_TOKEN="[your-auth-token]"
# Get your credentials from https://turso.tech

# For local development
# LOCAL_DB_PATH="file:local.db"
`;

    // Update .env files
    for (const filePath of [envPath, envExamplePath]) {
      let existingContent = "";
      if (await pathExists(filePath)) {
        existingContent = await readFile(filePath, "utf-8");
      }

      if (!existingContent.includes("TURSO_DATABASE_URL")) {
        await writeFile(filePath, existingContent + envContent);
      }
    }
  }

  getConnectionString(_config: ProjectConfig): string {
    return `libsql://[database]-[organization].turso.io`;
  }

  private async copyConfigurationFiles(
    config: ProjectConfig,
    projectPath: string,
    templateEngine: TemplateEngine
  ): Promise<void> {
    const templateRoot = templateEngine["templateRoot"];

    // Copy database configuration template
    const configTemplate = path.join(
      templateRoot,
      "database",
      "turso",
      `config.${config.typescript ? "ts" : "js"}.hbs`
    );

    if (await pathExists(configTemplate)) {
      await templateEngine.processTemplate(
        configTemplate,
        path.join(projectPath, "src", "lib", `turso-config.${config.typescript ? "ts" : "js"}`),
        config
      );
    }
  }

  private async setupConnectionHelper(config: ProjectConfig, projectPath: string): Promise<void> {
    const dbContent = config.typescript
      ? `
import { createClient } from "@libsql/client";

export const turso = createClient({
  url: process.env.TURSO_DATABASE_URL || "file:local.db",
  authToken: process.env.TURSO_AUTH_TOKEN,
});
`
      : `
const { createClient } = require("@libsql/client");

const turso = createClient({
  url: process.env.TURSO_DATABASE_URL || "file:local.db",
  authToken: process.env.TURSO_AUTH_TOKEN,
});

module.exports = { turso };
`;

    const dbPath = path.join(projectPath, "src", "lib", config.typescript ? "db.ts" : "db.js");
    await writeFile(dbPath, dbContent.trim());
  }

  private async setupHealthCheck(
    config: ProjectConfig,
    projectPath: string,
    _templateEngine: TemplateEngine
  ): Promise<void> {
    const healthCheckCode = `
import ${config.orm === "prisma" ? "{ PrismaClient }" : "{ turso }"} from '${config.orm === "prisma" ? "@prisma/client" : "./db"}';

${config.orm === "prisma" ? "const prisma = new PrismaClient();" : ""}

export async function checkDatabaseConnection()${config.typescript ? ": Promise<boolean>" : ""} {
  try {
    ${config.orm === "prisma" ? "await prisma.$queryRaw`SELECT 1`;" : "await turso.execute('SELECT 1');"}
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    return false;
  }
}
`;

    const healthCheckPath = path.join(
      projectPath,
      "src",
      "lib",
      `health-check.${config.typescript ? "ts" : "js"}`
    );

    await writeFile(healthCheckPath, healthCheckCode);
  }

  getNextSteps(): string[] {
    return [
      "1. Install Turso CLI: https://docs.turso.tech/cli/installation",
      "2. Sign up: turso auth signup",
      "3. Create database: turso db create [database-name]",
      "4. Get database URL: turso db show [database-name]",
      "5. Create auth token: turso db tokens create [database-name]",
      "6. Update environment variables in your .env file",
    ];
  }
}

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

export class NeonGenerator implements DatabaseGenerator {
  id = "neon";
  name = "Neon";
  supportedORMs = ["prisma", "drizzle"];

  async setup(
    config: ProjectConfig,
    projectPath: string,
    templateEngine: TemplateEngine
  ): Promise<void> {
    consola.info("Setting up Neon database configuration...");

    // Create database directories
    const dbDir = path.join(projectPath, "src", "lib");
    await ensureDir(dbDir);

    // Copy Neon-specific configuration files
    await this.copyConfigurationFiles(config, projectPath, templateEngine);

    // Create database connection helper
    await this.setupConnectionHelper(config, projectPath);

    // Add database health check endpoint
    await this.setupHealthCheck(config, projectPath, templateEngine);
  }

  async installDependencies(config: ProjectConfig, projectPath: string): Promise<void> {
    const packages = ["@neondatabase/serverless"];
    const devPackages: string[] = [];

    // Add ORM-specific packages
    switch (config.orm) {
      case "prisma":
        packages.push("@prisma/adapter-neon", "ws");
        devPackages.push("prisma");
        packages.push("@prisma/client");
        break;
      case "drizzle":
        packages.push("drizzle-orm");
        devPackages.push("drizzle-kit");
        break;
    }

    // Install packages
    consola.info("📦 Installing Neon packages...");
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
# Neon Database Configuration
DATABASE_URL="postgresql://[user]:[password]@[neon_hostname]/[dbname]?sslmode=require"
# Get your connection string from https://console.neon.tech

# For local development with Docker (optional)
# LOCAL_DATABASE_URL="postgresql://postgres:password@localhost:5432/${config.name.replace(/-/g, "_")}"
`;

    // Update .env files
    for (const filePath of [envPath, envExamplePath]) {
      let existingContent = "";
      if (await pathExists(filePath)) {
        existingContent = await readFile(filePath, "utf-8");
      }

      if (!existingContent.includes("DATABASE_URL")) {
        await writeFile(filePath, existingContent + envContent);
      }
    }
  }

  getConnectionString(config: ProjectConfig): string {
    return `postgresql://[user]:[password]@[neon_hostname]/${config.name.replace(/-/g, "_")}?sslmode=require`;
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
      "neon",
      `config.${config.typescript ? "ts" : "js"}.hbs`
    );

    if (await pathExists(configTemplate)) {
      await templateEngine.processTemplate(
        configTemplate,
        path.join(projectPath, "src", "lib", `neon-config.${config.typescript ? "ts" : "js"}`),
        config
      );
    }
  }

  private async setupConnectionHelper(config: ProjectConfig, projectPath: string): Promise<void> {
    const dbContent = config.typescript
      ? `
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

export { sql };
`
      : `
const { neon } = require('@neondatabase/serverless');

const sql = neon(process.env.DATABASE_URL);

module.exports = { sql };
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
import ${config.orm === "prisma" ? "{ PrismaClient }" : "{ sql }"} from '${config.orm === "prisma" ? "@prisma/client" : "./db"}';

${config.orm === "prisma" ? "const prisma = new PrismaClient();" : ""}

export async function checkDatabaseConnection()${config.typescript ? ": Promise<boolean>" : ""} {
  try {
    ${config.orm === "prisma" ? "await prisma.$queryRaw`SELECT 1`;" : "await sql`SELECT 1`;"}
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
      "1. Create a Neon account at https://console.neon.tech",
      "2. Create a new database project",
      "3. Copy the connection string from Neon dashboard",
      "4. Update DATABASE_URL in your .env file",
      "5. Run your ORM migrations or schema sync",
    ];
  }
}

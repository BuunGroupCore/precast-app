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

export class PlanetScaleGenerator implements DatabaseGenerator {
  id = "planetscale";
  name = "PlanetScale";
  supportedORMs = ["prisma", "drizzle"];

  async setup(
    config: ProjectConfig,
    projectPath: string,
    templateEngine: TemplateEngine
  ): Promise<void> {
    consola.info("Setting up PlanetScale database configuration...");

    // Create database directories
    const dbDir = path.join(projectPath, "src", "lib");
    await ensureDir(dbDir);

    // Copy PlanetScale-specific configuration files
    await this.copyConfigurationFiles(config, projectPath, templateEngine);

    // Create database connection helper
    await this.setupConnectionHelper(config, projectPath);

    // Add database health check endpoint
    await this.setupHealthCheck(config, projectPath, templateEngine);
  }

  async installDependencies(config: ProjectConfig, projectPath: string): Promise<void> {
    const packages = ["@planetscale/database"];
    const devPackages: string[] = [];

    // Add ORM-specific packages
    switch (config.orm) {
      case "prisma":
        packages.push("@prisma/adapter-planetscale");
        devPackages.push("prisma");
        packages.push("@prisma/client");
        break;
      case "drizzle":
        packages.push("drizzle-orm");
        devPackages.push("drizzle-kit");
        break;
    }

    // Install packages
    consola.info("📦 Installing PlanetScale packages...");
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
# PlanetScale Database Configuration
DATABASE_URL="mysql://[username]:[password]@[host]/[database]?ssl={"rejectUnauthorized":true}"
# Get your connection string from https://app.planetscale.com

# Alternative: Use individual credentials
# DATABASE_HOST="aws.connect.psdb.cloud"
# DATABASE_USERNAME="[username]"
# DATABASE_PASSWORD="[password]"
# DATABASE_NAME="[database]"
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
    return `mysql://[username]:[password]@[host]/${config.name.replace(/-/g, "_")}?ssl={"rejectUnauthorized":true}`;
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
      "planetscale",
      `config.${config.typescript ? "ts" : "js"}.hbs`
    );

    if (await pathExists(configTemplate)) {
      await templateEngine.processTemplate(
        configTemplate,
        path.join(
          projectPath,
          "src",
          "lib",
          `planetscale-config.${config.typescript ? "ts" : "js"}`
        ),
        config
      );
    }
  }

  private async setupConnectionHelper(config: ProjectConfig, projectPath: string): Promise<void> {
    const dbContent = config.typescript
      ? `
import { connect } from '@planetscale/database';

const config = {
  url: process.env.DATABASE_URL,
  // Or use individual credentials:
  // host: process.env.DATABASE_HOST,
  // username: process.env.DATABASE_USERNAME,
  // password: process.env.DATABASE_PASSWORD,
};

export const db = connect(config);
`
      : `
const { connect } = require('@planetscale/database');

const config = {
  url: process.env.DATABASE_URL,
  // Or use individual credentials:
  // host: process.env.DATABASE_HOST,
  // username: process.env.DATABASE_USERNAME,
  // password: process.env.DATABASE_PASSWORD,
};

const db = connect(config);

module.exports = { db };
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
import ${config.orm === "prisma" ? "{ PrismaClient }" : "{ db }"} from '${config.orm === "prisma" ? "@prisma/client" : "./db"}';

${config.orm === "prisma" ? "const prisma = new PrismaClient();" : ""}

export async function checkDatabaseConnection()${config.typescript ? ": Promise<boolean>" : ""} {
  try {
    ${config.orm === "prisma" ? "await prisma.$queryRaw`SELECT 1`;" : "await db.execute('SELECT 1');"}
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
      "1. Create a PlanetScale account at https://app.planetscale.com",
      "2. Create a new database",
      "3. Create a branch and get connection string",
      "4. Update DATABASE_URL in your .env file",
      "5. Use schema changes instead of migrations (PlanetScale handles schema diffing)",
    ];
  }
}

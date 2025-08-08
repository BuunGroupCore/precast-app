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

export class PostgreSQLGenerator implements DatabaseGenerator {
  id = "postgres";
  name = "PostgreSQL";
  supportedORMs = ["prisma", "drizzle", "typeorm"];

  async setup(
    config: ProjectConfig,
    projectPath: string,
    templateEngine: TemplateEngine
  ): Promise<void> {
    consola.info("Setting up PostgreSQL configuration...");

    // Create database directories
    const dbDir = path.join(projectPath, "src", "database");
    await ensureDir(dbDir);

    // Copy PostgreSQL-specific configuration files
    await this.copyConfigurationFiles(config, projectPath, templateEngine);

    // Setup connection pooling configuration
    await this.setupConnectionPooling(config, projectPath);

    // Add database health check endpoint
    await this.setupHealthCheck(config, projectPath, templateEngine);
  }

  async installDependencies(config: ProjectConfig, projectPath: string): Promise<void> {
    const packages: string[] = [];
    const devPackages: string[] = [];

    // Add PostgreSQL client based on ORM
    switch (config.orm) {
      case "prisma":
        // Prisma includes its own PostgreSQL client
        devPackages.push("prisma");
        packages.push("@prisma/client");
        break;
      case "drizzle":
        packages.push("postgres", "drizzle-orm");
        devPackages.push("drizzle-kit");
        break;
      case "typeorm":
        packages.push("pg", "typeorm", "reflect-metadata");
        devPackages.push("@types/pg");
        break;
      default:
        // Raw PostgreSQL client
        packages.push("pg");
        if (config.typescript) {
          devPackages.push("@types/pg");
        }
    }

    // Install packages
    if (packages.length > 0) {
      consola.info("📦 Installing PostgreSQL packages...");
      await installDependencies(packages, {
        packageManager: config.packageManager,
        projectPath,
        dev: false,
      });
    }

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

    const connectionString = this.getConnectionString(config);
    const envContent = `
# PostgreSQL Database Configuration
DATABASE_URL="${connectionString}"
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=${config.name.replace(/-/g, "_")}
POSTGRES_HOST=localhost
POSTGRES_PORT=5432

# Connection Pool Settings
DATABASE_POOL_MIN=2
DATABASE_POOL_MAX=10
DATABASE_POOL_ACQUIRE=30000
DATABASE_POOL_IDLE=10000
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
    const dbName = config.name.replace(/-/g, "_");
    return `postgresql://postgres:postgres@localhost:5432/${dbName}`;
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
      "postgres",
      `config.${config.typescript ? "ts" : "js"}.hbs`
    );

    if (await pathExists(configTemplate)) {
      await templateEngine.processTemplate(
        configTemplate,
        path.join(projectPath, "src", "database", `config.${config.typescript ? "ts" : "js"}`),
        config
      );
    }
  }

  private async setupConnectionPooling(config: ProjectConfig, projectPath: string): Promise<void> {
    const poolConfig = `
${config.typescript ? "export interface PoolConfig {" : "/**"}
${config.typescript ? "  min: number;" : " * @typedef {Object} PoolConfig"}
${config.typescript ? "  max: number;" : " * @property {number} min - Minimum pool size"}
${config.typescript ? "  acquireTimeout: number;" : " * @property {number} max - Maximum pool size"}
${config.typescript ? "  idleTimeout: number;" : " * @property {number} acquireTimeout - Acquire timeout"}
${config.typescript ? "}" : " * @property {number} idleTimeout - Idle timeout"}
${config.typescript ? "" : " */"}

${config.typescript ? "export const poolConfig: PoolConfig = {" : "export const poolConfig = {"}
  min: parseInt(process.env.DATABASE_POOL_MIN || '2'),
  max: parseInt(process.env.DATABASE_POOL_MAX || '10'),
  acquireTimeout: parseInt(process.env.DATABASE_POOL_ACQUIRE || '30000'),
  idleTimeout: parseInt(process.env.DATABASE_POOL_IDLE || '10000'),
};
`;

    const poolConfigPath = path.join(
      projectPath,
      "src",
      "database",
      `pool-config.${config.typescript ? "ts" : "js"}`
    );

    await writeFile(poolConfigPath, poolConfig);
  }

  private async setupHealthCheck(
    config: ProjectConfig,
    projectPath: string,
    _templateEngine: TemplateEngine
  ): Promise<void> {
    const healthCheckCode = `
import ${config.orm === "prisma" ? "{ PrismaClient }" : config.orm === "drizzle" ? "{ db }" : "{ Pool }"} from '${config.orm === "prisma" ? "@prisma/client" : config.orm === "drizzle" ? "./drizzle" : "pg"}';

${config.orm === "prisma" ? "const prisma = new PrismaClient();" : ""}
${config.orm === "typeorm" ? "const pool = new Pool(poolConfig);" : ""}

export async function checkDatabaseConnection()${config.typescript ? ": Promise<boolean>" : ""} {
  try {
    ${config.orm === "prisma" ? "await prisma.$queryRaw`SELECT 1`;" : config.orm === "drizzle" ? "await db.execute('SELECT 1');" : "await pool.query('SELECT 1');"}
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
      "database",
      `health-check.${config.typescript ? "ts" : "js"}`
    );

    await writeFile(healthCheckPath, healthCheckCode);
  }

  getNextSteps(): string[] {
    return [
      "1. Ensure PostgreSQL is installed and running locally",
      "2. Create your database: createdb <your_database_name>",
      "3. Update DATABASE_URL in your .env file",
      "4. Run migrations (if using an ORM)",
      "5. Test the connection with the health check endpoint",
    ];
  }
}

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

export class MySQLGenerator implements DatabaseGenerator {
  id = "mysql";
  name = "MySQL";
  supportedORMs = ["prisma", "drizzle", "typeorm"];

  async setup(
    config: ProjectConfig,
    projectPath: string,
    templateEngine: TemplateEngine
  ): Promise<void> {
    consola.info("Setting up MySQL configuration...");

    // Create database directories
    const dbDir = path.join(projectPath, "src", "database");
    await ensureDir(dbDir);

    // Copy MySQL-specific configuration files
    await this.copyConfigurationFiles(config, projectPath, templateEngine);

    // Setup connection pooling configuration
    await this.setupConnectionPooling(config, projectPath);

    // Add database health check endpoint
    await this.setupHealthCheck(config, projectPath, templateEngine);
  }

  async installDependencies(config: ProjectConfig, projectPath: string): Promise<void> {
    const packages: string[] = [];
    const devPackages: string[] = [];

    // Add MySQL client based on ORM
    switch (config.orm) {
      case "prisma":
        // Prisma includes its own MySQL client
        devPackages.push("prisma");
        packages.push("@prisma/client");
        break;
      case "drizzle":
        packages.push("mysql2", "drizzle-orm");
        devPackages.push("drizzle-kit");
        break;
      case "typeorm":
        packages.push("mysql2", "typeorm", "reflect-metadata");
        break;
      default:
        // Raw MySQL client
        packages.push("mysql2");
    }

    // Install packages
    if (packages.length > 0) {
      consola.info("📦 Installing MySQL packages...");
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
# MySQL Database Configuration
DATABASE_URL="${connectionString}"
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_DATABASE=${config.name.replace(/-/g, "_")}
MYSQL_USER=root
MYSQL_PASSWORD=password

# Connection Pool Settings
DATABASE_POOL_MIN=2
DATABASE_POOL_MAX=10
DATABASE_CONNECTION_LIMIT=10
DATABASE_QUEUE_LIMIT=0
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
    return `mysql://root:password@localhost:3306/${dbName}`;
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
      "mysql",
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
${config.typescript ? "  connectionLimit: number;" : " * @typedef {Object} PoolConfig"}
${config.typescript ? "  queueLimit: number;" : " * @property {number} connectionLimit - Connection limit"}
${config.typescript ? "  waitForConnections: boolean;" : " * @property {number} queueLimit - Queue limit"}
${config.typescript ? "  enableKeepAlive: boolean;" : " * @property {boolean} waitForConnections - Wait for connections"}
${config.typescript ? "  keepAliveInitialDelay: number;" : " * @property {boolean} enableKeepAlive - Enable keep alive"}
${config.typescript ? "}" : " * @property {number} keepAliveInitialDelay - Keep alive initial delay"}
${config.typescript ? "" : " */"}

${config.typescript ? "export const poolConfig: PoolConfig = {" : "export const poolConfig = {"}
  connectionLimit: parseInt(process.env.DATABASE_CONNECTION_LIMIT || '10'),
  queueLimit: parseInt(process.env.DATABASE_QUEUE_LIMIT || '0'),
  waitForConnections: true,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
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
import ${config.orm === "prisma" ? "{ PrismaClient }" : config.orm === "drizzle" ? "{ db }" : "mysql from 'mysql2/promise'"} from '${config.orm === "prisma" ? "@prisma/client" : config.orm === "drizzle" ? "./drizzle" : "mysql2/promise"}';
${config.orm === "typeorm" ? "import { DataSource } from 'typeorm';" : ""}

${config.orm === "prisma" ? "const prisma = new PrismaClient();" : ""}
${
  config.orm === "none"
    ? `const pool = mysql.createPool({
  host: process.env.MYSQL_HOST || 'localhost',
  port: parseInt(process.env.MYSQL_PORT || '3306'),
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
});`
    : ""
}

export async function checkDatabaseConnection()${config.typescript ? ": Promise<boolean>" : ""} {
  try {
    ${config.orm === "prisma" ? "await prisma.$queryRaw`SELECT 1`;" : config.orm === "drizzle" ? "await db.execute('SELECT 1');" : config.orm === "typeorm" ? "const dataSource = new DataSource(/* your config */); await dataSource.query('SELECT 1');" : "const connection = await pool.getConnection(); await connection.execute('SELECT 1'); connection.release();"}
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
      "1. Ensure MySQL is installed and running locally",
      "2. Create your database: mysql -u root -p -e 'CREATE DATABASE <your_database_name>'",
      "3. Update DATABASE_URL in your .env file",
      "4. Run migrations (if using an ORM)",
      "5. Test the connection with the health check endpoint",
    ];
  }
}

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

export class MongoDBGenerator implements DatabaseGenerator {
  id = "mongodb";
  name = "MongoDB";
  supportedORMs = ["mongoose", "prisma"];

  async setup(
    config: ProjectConfig,
    projectPath: string,
    templateEngine: TemplateEngine
  ): Promise<void> {
    consola.info("Setting up MongoDB configuration...");

    // Create database directories
    const dbDir = path.join(projectPath, "src", "database");
    await ensureDir(dbDir);

    // Copy MongoDB-specific configuration files
    await this.copyConfigurationFiles(config, projectPath, templateEngine);

    // Setup connection configuration
    await this.setupConnectionConfig(config, projectPath);

    // Add database health check endpoint
    await this.setupHealthCheck(config, projectPath, templateEngine);
  }

  async installDependencies(config: ProjectConfig, projectPath: string): Promise<void> {
    const packages: string[] = [];
    const devPackages: string[] = [];

    // Add MongoDB client based on ORM
    switch (config.orm) {
      case "mongoose":
        packages.push("mongoose");
        // Note: @types/mongoose is deprecated, Mongoose includes its own TypeScript definitions
        break;
      case "prisma":
        // Prisma includes its own MongoDB client
        devPackages.push("prisma");
        packages.push("@prisma/client");
        break;
      default:
        // Raw MongoDB client
        packages.push("mongodb");
        if (config.typescript) {
          devPackages.push("@types/mongodb");
        }
    }

    // Install packages
    if (packages.length > 0) {
      consola.info("📦 Installing MongoDB packages...");
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
# MongoDB Database Configuration
MONGODB_URI="${connectionString}"
MONGODB_DB_NAME=${config.name.replace(/-/g, "_")}

# MongoDB Connection Options
MONGODB_MAX_POOL_SIZE=10
MONGODB_MIN_POOL_SIZE=2
MONGODB_MAX_IDLE_TIME_MS=30000
MONGODB_SERVER_SELECTION_TIMEOUT_MS=5000
`;

    // Update .env files
    for (const filePath of [envPath, envExamplePath]) {
      let existingContent = "";
      if (await pathExists(filePath)) {
        existingContent = await readFile(filePath, "utf-8");
      }

      if (!existingContent.includes("MONGODB_URI")) {
        await writeFile(filePath, existingContent + envContent);
      }
    }
  }

  getConnectionString(config: ProjectConfig): string {
    const dbName = config.name.replace(/-/g, "_");
    return `mongodb://localhost:27017/${dbName}`;
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
      "mongodb",
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

  private async setupConnectionConfig(config: ProjectConfig, projectPath: string): Promise<void> {
    const connectionConfig = `
${config.typescript ? "export interface MongoConnectionConfig {" : "/**"}
${config.typescript ? "  maxPoolSize: number;" : " * @typedef {Object} MongoConnectionConfig"}
${config.typescript ? "  minPoolSize: number;" : " * @property {number} maxPoolSize - Maximum pool size"}
${config.typescript ? "  maxIdleTimeMS: number;" : " * @property {number} minPoolSize - Minimum pool size"}
${config.typescript ? "  serverSelectionTimeoutMS: number;" : " * @property {number} maxIdleTimeMS - Max idle time"}
${config.typescript ? "  retryWrites: boolean;" : " * @property {number} serverSelectionTimeoutMS - Server selection timeout"}
${config.typescript ? "}" : " * @property {boolean} retryWrites - Retry writes"}
${config.typescript ? "" : " */"}

${config.typescript ? "export const mongoConfig: MongoConnectionConfig = {" : "export const mongoConfig = {"}
  maxPoolSize: parseInt(process.env.MONGODB_MAX_POOL_SIZE || '10'),
  minPoolSize: parseInt(process.env.MONGODB_MIN_POOL_SIZE || '2'),
  maxIdleTimeMS: parseInt(process.env.MONGODB_MAX_IDLE_TIME_MS || '30000'),
  serverSelectionTimeoutMS: parseInt(process.env.MONGODB_SERVER_SELECTION_TIMEOUT_MS || '5000'),
  retryWrites: true,
};
`;

    const configPath = path.join(
      projectPath,
      "src",
      "database",
      `mongo-config.${config.typescript ? "ts" : "js"}`
    );

    await writeFile(configPath, connectionConfig);
  }

  private async setupHealthCheck(
    config: ProjectConfig,
    projectPath: string,
    _templateEngine: TemplateEngine
  ): Promise<void> {
    const healthCheckCode = `
import ${config.orm === "mongoose" ? "mongoose" : config.orm === "prisma" ? "{ PrismaClient }" : "{ MongoClient }"} from '${config.orm === "mongoose" ? "mongoose" : config.orm === "prisma" ? "@prisma/client" : "mongodb"}';

${config.orm === "prisma" ? "const prisma = new PrismaClient();" : ""}
${config.orm === "none" ? `const client = new MongoClient(process.env.MONGODB_URI || 'mongodb://localhost:27017');` : ""}

export async function checkDatabaseConnection()${config.typescript ? ": Promise<boolean>" : ""} {
  try {
    ${config.orm === "mongoose" ? "await mongoose.connection.db.admin().ping();" : config.orm === "prisma" ? "await prisma.$queryRaw`SELECT 1`;" : "await client.connect(); await client.db().admin().ping(); await client.close();"}
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
      "1. Ensure MongoDB is installed and running locally",
      "2. Create your database (MongoDB creates databases on first use)",
      "3. Update MONGODB_URI in your .env file if needed",
      "4. Setup your data models/schemas",
      "5. Test the connection with the health check endpoint",
    ];
  }
}

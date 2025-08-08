import path from "path";

import { consola } from "consola";
// eslint-disable-next-line import/default
import fsExtra from "fs-extra";

import type { ProjectConfig } from "../../../shared/stack-config.js";
import { createTemplateEngine } from "../core/template-engine.js";

import { getTemplateRoot } from "./template-path.js";

// Database generators
import { CloudflareD1Generator } from "@/generators/database/cloudflare-d1-generator.js";
import type { DatabaseGenerator } from "@/generators/database/database-generator.interface.js";
import { MongoDBGenerator } from "@/generators/database/mongodb-generator.js";
import { MySQLGenerator } from "@/generators/database/mysql-generator.js";
import { NeonGenerator } from "@/generators/database/neon-generator.js";
import { PlanetScaleGenerator } from "@/generators/database/planetscale-generator.js";
import { PostgreSQLGenerator } from "@/generators/database/postgres-generator.js";
import { TursoGenerator } from "@/generators/database/turso-generator.js";
// ORM generators
import { DrizzleGenerator } from "@/generators/orm/drizzle-generator.js";
import { MongooseGenerator } from "@/generators/orm/mongoose-generator.js";
import type { ORMGenerator } from "@/generators/orm/orm-generator.interface.js";
import { PrismaGenerator } from "@/generators/orm/prisma-generator.js";
import { TypeORMGenerator } from "@/generators/orm/typeorm-generator.js";

// eslint-disable-next-line import/no-named-as-default-member
const { writeFile, ensureDir } = fsExtra;

/**
 * Setup database-specific files and configurations using the modular generator system
 * @param config - Project configuration
 * @param projectPath - Path to the project
 */
export async function setupDatabase(config: ProjectConfig, projectPath: string): Promise<void> {
  if (config.database === "none" || !config.orm || config.orm === "none") {
    return;
  }

  consola.info(`🗄️ Setting up ${config.database} database with ${config.orm}...`);

  const templateRoot = getTemplateRoot();
  const templateEngine = createTemplateEngine(templateRoot);

  // Determine the correct path for database files
  let targetPath = projectPath;
  if (config.backend && config.backend !== "none") {
    // Monorepo structure - database setup goes in apps/api
    targetPath = path.join(projectPath, "apps", "api");
  }

  // Get database generator
  const databaseGenerator = getDatabaseGenerator(config.database);
  if (!databaseGenerator) {
    throw new Error(`Unsupported database: ${config.database}`);
  }

  // Get ORM generator
  const ormGenerator = getORMGenerator(config.orm);
  if (!ormGenerator) {
    throw new Error(`Unsupported ORM: ${config.orm}`);
  }

  // Verify compatibility
  if (!databaseGenerator.supportedORMs.includes(config.orm)) {
    throw new Error(
      `Database '${config.database}' is not compatible with ORM '${config.orm}'. Supported ORMs: ${databaseGenerator.supportedORMs.join(", ")}`
    );
  }

  if (!ormGenerator.supportedDatabases.includes(config.database)) {
    throw new Error(
      `ORM '${config.orm}' is not compatible with database '${config.database}'. Supported databases: ${ormGenerator.supportedDatabases.join(", ")}`
    );
  }

  try {
    // Setup database
    await databaseGenerator.setup(config, targetPath, templateEngine);
    await databaseGenerator.installDependencies(config, targetPath);
    await databaseGenerator.setupEnvironment(config, targetPath);

    // Setup ORM
    await ormGenerator.setup(config, targetPath, templateEngine);
    await ormGenerator.installDependencies(config, targetPath);

    // Add database connection test for frontend projects
    if (config.framework && config.framework !== "none") {
      await setupDatabaseConnectionTest(config, projectPath);
    }

    consola.success(`✅ Database setup completed for ${config.database} with ${config.orm}!`);
  } catch (error) {
    consola.error("❌ Failed to setup database configuration:", error);
    throw error;
  }
}

/**
 * Get the appropriate database generator
 */
function getDatabaseGenerator(database: string): DatabaseGenerator | null {
  switch (database) {
    case "postgres":
      return new PostgreSQLGenerator();
    case "mysql":
      return new MySQLGenerator();
    case "mongodb":
      return new MongoDBGenerator();
    case "neon":
      return new NeonGenerator();
    case "planetscale":
      return new PlanetScaleGenerator();
    case "turso":
      return new TursoGenerator();
    case "cloudflare-d1":
      return new CloudflareD1Generator();
    default:
      return null;
  }
}

/**
 * Get the appropriate ORM generator
 */
function getORMGenerator(orm: string): ORMGenerator | null {
  switch (orm) {
    case "prisma":
      return new PrismaGenerator();
    case "drizzle":
      return new DrizzleGenerator();
    case "typeorm":
      return new TypeORMGenerator();
    case "mongoose":
      return new MongooseGenerator();
    default:
      return null;
  }
}

/**
 * Add database connection test utilities for frontend applications
 */
async function setupDatabaseConnectionTest(
  config: ProjectConfig,
  projectPath: string
): Promise<void> {
  consola.info("Adding database connection test utilities...");

  // Determine frontend app path
  const frontendPath =
    config.backend && config.backend !== "none"
      ? path.join(projectPath, "apps", "web")
      : projectPath;

  const utilsPath = path.join(frontendPath, "src", "lib");

  // Ensure the directory exists
  await ensureDir(utilsPath);

  const testUtilPath = path.join(utilsPath, `db-test.${config.typescript ? "ts" : "js"}`);

  const testUtilContent = config.typescript
    ? `
import { toast } from 'react-hot-toast';

export async function testDatabaseConnection(): Promise<boolean> {
  try {
    const response = await fetch('/api/health/db');
    const data = await response.json();
    
    if (data.success) {
      toast.success('Database connection successful!');
      return true;
    } else {
      toast.error('Database connection failed!');
      return false;
    }
  } catch (error) {
    console.error('Database connection test failed:', error);
    toast.error('Database connection test failed!');
    return false;
  }
}
`
    : `
export async function testDatabaseConnection() {
  try {
    const response = await fetch('/api/health/db');
    const data = await response.json();
    
    if (data.success) {
      console.log('Database connection successful!');
      return true;
    } else {
      console.error('Database connection failed!');
      return false;
    }
  } catch (error) {
    console.error('Database connection test failed:', error);
    return false;
  }
}
`;

  await writeFile(testUtilPath, testUtilContent.trim());
  consola.success("✅ Database connection test utilities added!");
}

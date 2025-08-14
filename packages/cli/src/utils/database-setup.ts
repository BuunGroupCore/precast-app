import * as path from "path";
import { fileURLToPath } from "url";

import fsExtra from "fs-extra";
import Handlebars from "handlebars";

const { copy, ensureDir, pathExists, readdir, readFile, stat, writeFile } = fsExtra;

import type { ProjectConfig } from "../../../shared/stack-config.js";

import { errorCollector } from "./error-collector.js";
import { logger } from "./logger.js";
import { installDependencies } from "./package-manager.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Sets up database configuration using Handlebars templates
 * @param config - Project configuration
 * @param projectPath - Path to the project
 */
export async function setupDatabase(config: ProjectConfig, projectPath: string): Promise<void> {
  if (config.database === "none") {
    return;
  }

  // For modern databases, we can set up connections even without an ORM
  const modernDatabases = ["neon", "planetscale", "turso", "cloudflare-d1"];
  if (!config.orm || config.orm === "none") {
    if (!modernDatabases.includes(config.database || "")) {
      return; // Traditional databases need an ORM
    }
  }

  logger.verbose(`🗄️ Setting up ${config.database} database with ${config.orm || "none"}...`);

  try {
    const databaseProviderMap: Record<string, string> = {
      postgres: "postgresql",
      mysql: "mysql",
      sqlite: "sqlite",
      mongodb: "mongodb",
      neon: "postgresql",
      planetscale: "mysql",
      turso: "sqlite",
      "cloudflare-d1": "sqlite",
    };

    const context = {
      ...config,
      database: config.database,
      databaseProvider: databaseProviderMap[config.database || ""] || "postgresql",
      orm: config.orm,
      name: config.name.replace(/-/g, "_"),
      projectName: config.name,
      typescript: config.typescript ?? true,
      kebabCase: (str: string) => str.replace(/_/g, "-"),
      camelCase: (str: string) => str.replace(/-([a-z])/g, (g) => g[1].toUpperCase()),
    };

    const isMonorepo = config.backend && config.backend !== "none";
    const targetPath = isMonorepo ? path.join(projectPath, "apps", "api") : projectPath;

    logger.verbose(
      `Setting up ${config.database === "postgres" ? "PostgreSQL" : config.database} configuration...`
    );
    await setupDatabasePackages(config, targetPath);

    if (config.orm && config.orm !== "none") {
      logger.verbose(`Setting up ${config.orm === "prisma" ? "Prisma" : config.orm} ORM...`);
      await setupORM(config, targetPath, context);
    } else if (["neon", "planetscale", "turso", "cloudflare-d1"].includes(config.database || "")) {
      // Setup connection files for modern databases when no ORM is selected
      await setupDatabaseConnection(config, targetPath, context);
    }

    logger.verbose(`✅ Database setup completed for ${config.database} with ${config.orm}!`);
  } catch (error) {
    logger.error(`Failed to setup database configuration: ${error}`);
    throw error;
  }
}

/**
 * Setup ORM configuration from templates
 */
async function setupORM(
  config: ProjectConfig,
  targetPath: string,
  context: Record<string, any>
): Promise<void> {
  if (!config.orm || config.orm === "none") return;

  const ormTemplateDir = path.join(__dirname, "templates", "database", config.orm);
  const srcOrmTemplateDir = path.join(
    __dirname,
    "..",
    "..",
    "src",
    "templates",
    "database",
    config.orm
  );

  let templateDir = ormTemplateDir;
  if (!(await pathExists(ormTemplateDir)) && (await pathExists(srcOrmTemplateDir))) {
    templateDir = srcOrmTemplateDir;
  }

  if (!(await pathExists(templateDir))) {
    logger.warn(`ORM templates not found for ${config.orm}`);
    return;
  }

  await processTemplateDirectory(templateDir, targetPath, context);

  if (config.orm === "prisma" && config.database) {
    const prismaDir = path.join(targetPath, "prisma");
    await ensureDir(prismaDir);

    // Handle schema file selection
    let schemaTemplate = "schema.prisma.hbs";
    if (config.database === "neon") schemaTemplate = "schema-neon.prisma.hbs";
    else if (config.database === "planetscale") schemaTemplate = "schema-planetscale.prisma.hbs";
    else if (config.database === "turso") schemaTemplate = "schema-turso.prisma.hbs";

    const schemaPath = path.join(templateDir, schemaTemplate);
    if (await pathExists(schemaPath)) {
      const content = await readFile(schemaPath, "utf-8");
      const template = Handlebars.compile(content);
      const rendered = template(context);
      await writeFile(path.join(prismaDir, "schema.prisma"), rendered);
      logger.verbose("Created Prisma schema");
    }

    // Handle client file selection based on database type
    const modernDatabases = ["neon", "planetscale", "turso"];
    let clientTemplate = "client.ts.hbs";

    // Check if we should use a database-specific client template
    if (modernDatabases.includes(config.database)) {
      const specificClientTemplate = `client-${config.database}.ts.hbs`;
      const specificClientPath = path.join(templateDir, specificClientTemplate);

      // Use specific client template if it exists, otherwise fall back to default
      if (await pathExists(specificClientPath)) {
        clientTemplate = specificClientTemplate;
      }
    }

    const clientPath = path.join(templateDir, clientTemplate);
    if (await pathExists(clientPath)) {
      const content = await readFile(clientPath, "utf-8");
      const template = Handlebars.compile(content);
      const rendered = template(context);

      // Create the lib directory for the client file
      const libDir = path.join(targetPath, "src", "lib");
      await ensureDir(libDir);

      // Write the client file to the lib directory
      const ext = context.typescript ? "ts" : "js";
      await writeFile(path.join(libDir, `prisma.${ext}`), rendered);
      logger.verbose(`Created Prisma client (${config.database} configuration)`);
    }
  }

  if (config.orm === "drizzle" && config.database) {
    const drizzleDir = path.join(targetPath, "src", "db");
    await ensureDir(drizzleDir);

    let schemaTemplate = "schema.ts.hbs";
    let connectionTemplate = "connection.ts.hbs";

    if (config.database === "neon") {
      schemaTemplate = "schema-neon.ts.hbs";
      connectionTemplate = "connection-neon.ts.hbs";
    } else if (config.database === "planetscale") {
      schemaTemplate = "schema-planetscale.ts.hbs";
      connectionTemplate = "connection-planetscale.ts.hbs";
    } else if (config.database === "turso") {
      schemaTemplate = "schema-turso.ts.hbs";
      connectionTemplate = "connection-turso.ts.hbs";
    } else if (config.database === "cloudflare-d1") {
      schemaTemplate = "schema-cloudflare-d1.ts.hbs";
      connectionTemplate = "connection-cloudflare-d1.ts.hbs";
    }

    const schemaPath = path.join(templateDir, schemaTemplate);
    if (await pathExists(schemaPath)) {
      const content = await readFile(schemaPath, "utf-8");
      const template = Handlebars.compile(content);
      const rendered = template(context);
      await writeFile(path.join(drizzleDir, "schema.ts"), rendered);
      logger.verbose("Created Drizzle schema");
    }

    const connectionPath = path.join(templateDir, connectionTemplate);
    if (await pathExists(connectionPath)) {
      const content = await readFile(connectionPath, "utf-8");
      const template = Handlebars.compile(content);
      const rendered = template(context);
      await writeFile(path.join(drizzleDir, "index.ts"), rendered);
      logger.verbose("Created Drizzle connection");
    }

    // Generate drizzle.config.ts
    const configTemplatePath = path.join(templateDir, "..", "..", "drizzle", "config.ts.hbs");
    if (await pathExists(configTemplatePath)) {
      const content = await readFile(configTemplatePath, "utf-8");
      const template = Handlebars.compile(content);
      const rendered = template(context);
      await writeFile(path.join(targetPath, "drizzle.config.ts"), rendered);
      logger.verbose("Created drizzle.config.ts");
    }
  }
}

/**
 * Setup database connection for modern providers when no ORM is selected
 */
async function setupDatabaseConnection(
  config: ProjectConfig,
  targetPath: string,
  context: Record<string, any>
): Promise<void> {
  if (!config.database) return;

  const dbTemplateDir = path.join(__dirname, "templates", "database", config.database);
  const srcDbTemplateDir = path.join(
    __dirname,
    "..",
    "..",
    "src",
    "templates",
    "database",
    config.database
  );

  let templateDir = dbTemplateDir;
  if (!(await pathExists(dbTemplateDir)) && (await pathExists(srcDbTemplateDir))) {
    templateDir = srcDbTemplateDir;
  }

  if (!(await pathExists(templateDir))) {
    logger.warn(`Database templates not found for ${config.database}`);
    return;
  }

  // Create lib directory for connection file
  const libDir = path.join(targetPath, "src", "lib");
  await ensureDir(libDir);

  // Process connection template
  const connectionTemplate = path.join(templateDir, "connection.ts.hbs");
  if (await pathExists(connectionTemplate)) {
    const content = await readFile(connectionTemplate, "utf-8");
    const template = Handlebars.compile(content);
    const rendered = template(context);
    const ext = context.typescript ? "ts" : "js";
    await writeFile(path.join(libDir, `db.${ext}`), rendered);
    logger.verbose(`Created ${config.database} connection file`);
  }

  // Process env template
  const envTemplate = path.join(templateDir, ".env.hbs");
  if (await pathExists(envTemplate)) {
    const content = await readFile(envTemplate, "utf-8");
    const template = Handlebars.compile(content);
    const rendered = template(context);

    // Add to .env and .env.example
    const envPath = path.join(targetPath, ".env");
    const envExamplePath = path.join(targetPath, ".env.example");

    for (const filePath of [envPath, envExamplePath]) {
      let existingContent = "";
      if (await pathExists(filePath)) {
        existingContent = await readFile(filePath, "utf-8");
      }

      if (!existingContent.includes("DATABASE_URL") && !existingContent.includes("TURSO_")) {
        await writeFile(filePath, existingContent + "\n" + rendered);
      }
    }
    logger.verbose("Added environment variables");
  }
}

/**
 * Process a template directory recursively
 */
async function processTemplateDirectory(
  templateDir: string,
  targetPath: string,
  context: Record<string, any>
): Promise<void> {
  const files = await readdir(templateDir);

  for (const file of files) {
    const filePath = path.join(templateDir, file);
    const stats = await stat(filePath);

    if (stats.isDirectory()) {
      const targetDir = path.join(targetPath, file);
      await ensureDir(targetDir);
      await processTemplateDirectory(filePath, targetDir, context);
    } else if (file.endsWith(".hbs")) {
      // Skip ALL client, schema, and connection files - they're handled separately
      if (
        file.startsWith("client-") ||
        file === "client.ts.hbs" ||
        file.startsWith("schema-") ||
        file === "schema.prisma.hbs" ||
        file === "schema.ts.hbs" ||
        file.startsWith("connection-") ||
        file === "connection.ts.hbs"
      ) {
        continue; // Skip these files as they're handled specially in setupORM
      }

      const templateContent = await readFile(filePath, "utf-8");
      const template = Handlebars.compile(templateContent);
      const rendered = template(context);
      const outputFileName = file.replace(".hbs", "");
      const outputPath = path.join(targetPath, outputFileName);

      const dir = path.dirname(outputPath);
      await ensureDir(dir);

      await writeFile(outputPath, rendered);
    } else {
      const outputPath = path.join(targetPath, file);
      await copy(filePath, outputPath);
    }
  }
}

/**
 * Install database and ORM packages
 */
async function setupDatabasePackages(config: ProjectConfig, targetPath: string): Promise<void> {
  const packages: string[] = [];
  const devPackages: string[] = [];

  if (config.database === "postgres") {
    logger.verbose("📦 Installing PostgreSQL packages...");
    packages.push("pg");
    devPackages.push("@types/pg");
  } else if (config.database === "mysql") {
    logger.verbose("📦 Installing MySQL packages...");
    packages.push("mysql2");
  } else if (config.database === "mongodb") {
    logger.verbose("📦 Installing MongoDB packages...");
    packages.push("mongodb");
  } else if (config.database === "sqlite") {
    packages.push("better-sqlite3");
    devPackages.push("@types/better-sqlite3");
  } else if (config.database === "neon") {
    packages.push("@neondatabase/serverless");
  } else if (config.database === "planetscale") {
    packages.push("@planetscale/database");
  } else if (config.database === "turso") {
    packages.push("@libsql/client");
  }

  if (config.orm === "prisma") {
    logger.verbose("📦 Installing Prisma packages...");
    packages.push("@prisma/client");
    devPackages.push("prisma");

    // Add adapter packages for modern databases
    if (config.database === "neon") {
      packages.push("@prisma/adapter-neon", "ws");
    } else if (config.database === "planetscale") {
      packages.push("@prisma/adapter-planetscale");
    } else if (config.database === "turso") {
      packages.push("@prisma/adapter-libsql", "@libsql/client");
    }
  } else if (config.orm === "drizzle") {
    logger.verbose("📦 Installing Drizzle packages...");
    packages.push("drizzle-orm");
    devPackages.push("drizzle-kit");

    if (config.database === "postgres") {
      packages.push("postgres");
    } else if (config.database === "mysql") {
      packages.push("mysql2");
    } else if (config.database === "sqlite" || config.database === "turso") {
      packages.push("@libsql/client");
    } else if (config.database === "neon") {
      packages.push("@neondatabase/serverless");
    } else if (config.database === "planetscale") {
      packages.push("@planetscale/database");
    }
  } else if (config.orm === "typeorm") {
    logger.verbose("📦 Installing TypeORM packages...");
    packages.push("typeorm", "reflect-metadata");
  } else if (config.orm === "mongoose") {
    logger.verbose("📦 Installing Mongoose packages...");
    packages.push("mongoose");
  }

  if (packages.length > 0) {
    try {
      await installDependencies(packages, {
        packageManager: config.packageManager,
        projectPath: targetPath,
        dev: false,
        context: "database",
      });
      logger.verbose("✅ Dependencies installed successfully with " + config.packageManager);
    } catch (error) {
      logger.error(`Failed to install database packages: ${error}`);
      errorCollector.addError("Database package installation", error);
      // Don't throw - let the process continue
    }
  }

  if (devPackages.length > 0) {
    try {
      await installDependencies(devPackages, {
        packageManager: config.packageManager,
        projectPath: targetPath,
        dev: true,
        context: "database_dev",
      });
    } catch (error) {
      logger.error(`Failed to install dev packages: ${error}`);
      errorCollector.addError("Database dev package installation", error);
      // Don't throw - let the process continue
    }
  }
}

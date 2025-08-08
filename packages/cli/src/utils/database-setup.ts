import path from "path";

import { consola } from "consola";
// eslint-disable-next-line import/default
import fsExtra from "fs-extra";

import type { ProjectConfig } from "../../../shared/stack-config.js";
import { createTemplateEngine, type TemplateEngine } from "../core/template-engine.js";

import { installDependencies } from "./package-manager.js";
import { getTemplateRoot } from "./template-path.js";

// eslint-disable-next-line import/no-named-as-default-member
const { ensureDir, readFile, writeFile } = fsExtra;

/**
 * Setup database-specific files and configurations
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

  // Handle database-specific setup first
  await setupDatabaseSpecificFiles(config, targetPath, templateEngine);

  // Then handle ORM setup
  switch (config.orm) {
    case "mongoose":
      await setupMongoose(config, targetPath, templateEngine);
      break;
    case "prisma":
      await setupPrisma(config, targetPath, templateEngine);
      break;
    case "drizzle":
      await setupDrizzle(config, targetPath, templateEngine);
      break;
    case "typeorm":
      await setupTypeORM(config, targetPath, templateEngine);
      break;
    default:
      consola.warn(`Unknown ORM: ${config.orm}`);
  }

  // Add database connection test for frontend projects
  if (config.framework && config.framework !== "none" && config.database !== "none") {
    await setupDatabaseConnectionTest(config, projectPath, templateEngine);
  }

  consola.success(`✅ Database setup completed for ${config.database} with ${config.orm}!`);
}

/**
 * Setup Mongoose for MongoDB
 * @param config - Project configuration
 * @param projectPath - Path to the project
 * @param templateEngine - Template engine instance
 */
async function setupMongoose(
  config: ProjectConfig,
  projectPath: string,
  templateEngine: TemplateEngine
): Promise<void> {
  consola.info("Setting up Mongoose configuration...");

  // Create directories
  const directories = ["src/database", "src/database/models", "src/database/scripts"];

  for (const dir of directories) {
    await ensureDir(path.join(projectPath, dir));
  }

  // Copy database connection file
  const templateRoot = getTemplateRoot();
  await templateEngine.processTemplate(
    path.join(templateRoot, "database/mongoose/connection.ts.hbs"),
    path.join(projectPath, "src/database", config.typescript ? "connection.ts" : "connection.js"),
    config
  );

  // Copy User model example
  await templateEngine.processTemplate(
    path.join(templateRoot, "database/mongoose/models/User.ts.hbs"),
    path.join(projectPath, "src/database/models", config.typescript ? "User.ts" : "User.js"),
    config
  );

  // Copy seed script
  await templateEngine.processTemplate(
    path.join(templateRoot, "database/mongoose/scripts/seed.js.hbs"),
    path.join(projectPath, "src/database/scripts", "seed.js"),
    config
  );

  // Create .env.example with MongoDB URI
  const envExamplePath = path.join(projectPath, ".env.example");
  let envContent = "";

  try {
    envContent = await readFile(envExamplePath, "utf-8");
  } catch {
    // File doesn't exist, create it
  }

  if (!envContent.includes("MONGODB_URI")) {
    envContent += `\n# MongoDB Configuration\nMONGODB_URI=mongodb://localhost:27017/${config.name}\n`;
    await writeFile(envExamplePath, envContent.trim() + "\n");
  }

  consola.success("✅ Mongoose setup completed!");
}

/**
 * Setup database-specific configuration files
 * @param config - Project configuration
 * @param projectPath - Path to the project
 * @param templateEngine - Template engine instance
 */
async function setupDatabaseSpecificFiles(
  config: ProjectConfig,
  projectPath: string,
  templateEngine: TemplateEngine
): Promise<void> {
  switch (config.database) {
    case "postgres":
      await setupPostgreSQL(config, projectPath);
      break;
    case "mysql":
      await setupMySQL(config, projectPath);
      break;
    case "mongodb":
      await setupMongoDB(config, projectPath);
      break;
    case "supabase":
      await setupSupabase(config, projectPath, templateEngine);
      break;
    case "firebase":
      await setupFirebase(config, projectPath, templateEngine);
      break;
    case "neon":
      await setupNeon(config, projectPath);
      break;
    case "turso":
      await setupTurso(config, projectPath);
      break;
    case "planetscale":
      await setupPlanetScale(config, projectPath);
      break;
    case "cloudflare-d1":
      await setupCloudflareD1(config, projectPath);
      break;
    default:
    // No specific database setup needed
  }
}

/**
 * Setup PostgreSQL configuration
 * @param config - Project configuration
 * @param projectPath - Path to the project
 */
async function setupPostgreSQL(config: ProjectConfig, projectPath: string): Promise<void> {
  consola.info("Setting up PostgreSQL configuration...");

  const envExamplePath = path.join(projectPath, ".env.example");
  let envContent = "";

  try {
    envContent = await readFile(envExamplePath, "utf-8");
  } catch {
    // File doesn't exist, create it
  }

  if (!envContent.includes("DATABASE_URL")) {
    const dbUrl = `postgresql://postgres:password@localhost:5432/${config.name.replace(/-/g, "_")}`;
    envContent += `\n# PostgreSQL Configuration\nDATABASE_URL=${dbUrl}\n`;
    await writeFile(envExamplePath, envContent.trim() + "\n");
  }
}

/**
 * Setup MySQL configuration
 * @param config - Project configuration
 * @param projectPath - Path to the project
 */
async function setupMySQL(config: ProjectConfig, projectPath: string): Promise<void> {
  consola.info("Setting up MySQL configuration...");

  const envExamplePath = path.join(projectPath, ".env.example");
  let envContent = "";

  try {
    envContent = await readFile(envExamplePath, "utf-8");
  } catch {
    // File doesn't exist, create it
  }

  if (!envContent.includes("DATABASE_URL")) {
    const dbUrl = `mysql://root:password@localhost:3306/${config.name.replace(/-/g, "_")}`;
    envContent += `\n# MySQL Configuration\nDATABASE_URL=${dbUrl}\n`;
    await writeFile(envExamplePath, envContent.trim() + "\n");
  }
}

/**
 * Setup MongoDB configuration
 * @param config - Project configuration
 * @param projectPath - Path to the project
 */
async function setupMongoDB(config: ProjectConfig, projectPath: string): Promise<void> {
  consola.info("Setting up MongoDB configuration...");

  const envExamplePath = path.join(projectPath, ".env.example");
  let envContent = "";

  try {
    envContent = await readFile(envExamplePath, "utf-8");
  } catch {
    // File doesn't exist, create it
  }

  if (!envContent.includes("MONGODB_URI")) {
    envContent += `\n# MongoDB Configuration\nMONGODB_URI=mongodb://localhost:27017/${config.name}\n`;
    await writeFile(envExamplePath, envContent.trim() + "\n");
  }
}

/**
 * Setup Supabase configuration
 * @param config - Project configuration
 * @param projectPath - Path to the project
 * @param templateEngine - Template engine instance
 */
async function setupSupabase(
  config: ProjectConfig,
  projectPath: string,
  templateEngine: TemplateEngine
): Promise<void> {
  consola.info("Setting up Supabase configuration...");

  // Install Supabase dependencies
  await installDependencies(["@supabase/supabase-js"], {
    packageManager: config.packageManager,
    projectPath,
    dev: false,
  });

  if (config.typescript) {
    await installDependencies(["@types/node"], {
      packageManager: config.packageManager,
      projectPath,
      dev: true,
    });
  }

  // Create Supabase client configuration
  await ensureDir(path.join(projectPath, "src", "lib"));

  const templateRoot = getTemplateRoot();
  await templateEngine.processTemplate(
    path.join(templateRoot, "database/supabase/client.ts.hbs"),
    path.join(projectPath, "src/lib", config.typescript ? "supabase.ts" : "supabase.js"),
    config
  );

  // Setup environment variables
  const envExamplePath = path.join(projectPath, ".env.example");
  let envContent = "";

  try {
    envContent = await readFile(envExamplePath, "utf-8");
  } catch {
    // File doesn't exist, create it
  }

  if (!envContent.includes("SUPABASE_URL")) {
    envContent += `\n# Supabase Configuration\nSUPABASE_URL=your-supabase-project-url\nSUPABASE_ANON_KEY=your-supabase-anon-key\n`;
    await writeFile(envExamplePath, envContent.trim() + "\n");
  }
}

/**
 * Setup Firebase configuration
 * @param config - Project configuration
 * @param projectPath - Path to the project
 * @param templateEngine - Template engine instance
 */
async function setupFirebase(
  config: ProjectConfig,
  projectPath: string,
  templateEngine: TemplateEngine
): Promise<void> {
  consola.info("Setting up Firebase configuration...");

  // Install Firebase dependencies
  await installDependencies(["firebase"], {
    packageManager: config.packageManager,
    projectPath,
    dev: false,
  });

  // Create Firebase configuration
  await ensureDir(path.join(projectPath, "src", "lib"));

  const templateRoot = getTemplateRoot();
  await templateEngine.processTemplate(
    path.join(templateRoot, "database/firebase/config.ts.hbs"),
    path.join(projectPath, "src/lib", config.typescript ? "firebase.ts" : "firebase.js"),
    config
  );

  // Setup environment variables
  const envExamplePath = path.join(projectPath, ".env.example");
  let envContent = "";

  try {
    envContent = await readFile(envExamplePath, "utf-8");
  } catch {
    // File doesn't exist, create it
  }

  if (!envContent.includes("FIREBASE_API_KEY")) {
    envContent += `\n# Firebase Configuration\nFIREBASE_API_KEY=your-firebase-api-key\nFIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com\nFIREBASE_PROJECT_ID=your-project-id\nFIREBASE_STORAGE_BUCKET=your-project.appspot.com\nFIREBASE_MESSAGING_SENDER_ID=123456789\nFIREBASE_APP_ID=1:123456789:web:abcdef123456\n`;
    await writeFile(envExamplePath, envContent.trim() + "\n");
  }
}

/**
 * Setup Prisma ORM
 * @param config - Project configuration
 * @param projectPath - Path to the project
 * @param templateEngine - Template engine instance
 */
async function setupPrisma(
  config: ProjectConfig,
  projectPath: string,
  templateEngine: TemplateEngine
): Promise<void> {
  consola.info("Setting up Prisma ORM...");

  // Install Prisma dependencies
  await installDependencies(["@prisma/client"], {
    packageManager: config.packageManager,
    projectPath,
    dev: false,
  });

  await installDependencies(["prisma"], {
    packageManager: config.packageManager,
    projectPath,
    dev: true,
  });

  // Create Prisma schema
  await ensureDir(path.join(projectPath, "prisma"));

  const templateRoot = getTemplateRoot();

  // Use database-specific schema template if available
  let schemaTemplate = "database/prisma/schema.prisma.hbs";
  if (["neon", "planetscale"].includes(config.database)) {
    schemaTemplate = `database/prisma/schema-${config.database}.prisma.hbs`;
  }

  await templateEngine.processTemplate(
    path.join(templateRoot, schemaTemplate),
    path.join(projectPath, "prisma/schema.prisma"),
    { ...config, databaseProvider: getDatabaseProvider(config.database) }
  );

  // Create Prisma client
  await ensureDir(path.join(projectPath, "src", "lib"));

  // Use database-specific client template if available
  let clientTemplate = "database/prisma/client.ts.hbs";
  if (["neon", "planetscale"].includes(config.database)) {
    clientTemplate = `database/prisma/client-${config.database}.ts.hbs`;
  }

  await templateEngine.processTemplate(
    path.join(templateRoot, clientTemplate),
    path.join(projectPath, "src/lib", config.typescript ? "prisma.ts" : "prisma.js"),
    config
  );

  consola.info("Run 'npx prisma migrate dev' to create your first migration");
}

/**
 * Setup Drizzle ORM
 * @param config - Project configuration
 * @param projectPath - Path to the project
 * @param templateEngine - Template engine instance
 */
async function setupDrizzle(
  config: ProjectConfig,
  projectPath: string,
  templateEngine: TemplateEngine
): Promise<void> {
  consola.info("Setting up Drizzle ORM...");

  // Install Drizzle dependencies based on database
  const drizzlePackages = ["drizzle-orm"];
  const devPackages = ["drizzle-kit"];

  switch (config.database) {
    case "postgres":
      drizzlePackages.push("pg");
      if (config.typescript) {
        devPackages.push("@types/pg");
      }
      break;
    case "mysql":
      drizzlePackages.push("mysql2");
      break;
    case "neon":
      drizzlePackages.push("@neondatabase/serverless");
      break;
    case "planetscale":
      drizzlePackages.push("@planetscale/database");
      break;
    case "turso":
      drizzlePackages.push("@libsql/client");
      break;
    case "cloudflare-d1":
      if (config.typescript) {
        devPackages.push("@cloudflare/workers-types");
      }
      break;
    default:
      break;
  }

  await installDependencies(drizzlePackages, {
    packageManager: config.packageManager,
    projectPath,
    dev: false,
  });

  await installDependencies(devPackages, {
    packageManager: config.packageManager,
    projectPath,
    dev: true,
  });

  // Create Drizzle configuration
  await ensureDir(path.join(projectPath, "src", "db"));

  const templateRoot = getTemplateRoot();
  await templateEngine.processTemplate(
    path.join(templateRoot, "database/drizzle/config.ts.hbs"),
    path.join(projectPath, "drizzle.config.ts"),
    { ...config, databaseProvider: getDatabaseProvider(config.database) }
  );

  // Use database-specific connection template if available
  let connectionTemplate = "database/drizzle/connection.ts.hbs";
  if (["neon", "planetscale", "turso", "cloudflare-d1"].includes(config.database)) {
    connectionTemplate = `database/drizzle/connection-${config.database}.ts.hbs`;
  }

  await templateEngine.processTemplate(
    path.join(templateRoot, connectionTemplate),
    path.join(projectPath, "src/db", config.typescript ? "connection.ts" : "connection.js"),
    { ...config, databaseProvider: getDatabaseProvider(config.database) }
  );

  // Use database-specific schema template if available
  let schemaTemplate = "database/drizzle/schema.ts.hbs";
  if (["neon", "planetscale", "turso", "cloudflare-d1"].includes(config.database)) {
    schemaTemplate = `database/drizzle/schema-${config.database}.ts.hbs`;
  }

  await templateEngine.processTemplate(
    path.join(templateRoot, schemaTemplate),
    path.join(projectPath, "src/db", config.typescript ? "schema.ts" : "schema.js"),
    config
  );

  consola.info("Run 'npx drizzle-kit push' to sync your schema with the database");
}

/**
 * Setup TypeORM
 * @param config - Project configuration
 * @param projectPath - Path to the project
 * @param templateEngine - Template engine instance
 */
async function setupTypeORM(
  config: ProjectConfig,
  projectPath: string,
  templateEngine: TemplateEngine
): Promise<void> {
  consola.info("Setting up TypeORM...");

  // Install TypeORM dependencies
  const typeormPackages = ["typeorm", "reflect-metadata"];
  const devPackages: string[] = [];

  switch (config.database) {
    case "postgres":
      typeormPackages.push("pg");
      if (config.typescript) {
        devPackages.push("@types/pg");
      }
      break;
    case "mysql":
      typeormPackages.push("mysql2");
      break;
    default:
      break;
  }

  await installDependencies(typeormPackages, {
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

  // Create TypeORM configuration
  await ensureDir(path.join(projectPath, "src", "entity"));
  await ensureDir(path.join(projectPath, "src", "migration"));

  const templateRoot = getTemplateRoot();
  await templateEngine.processTemplate(
    path.join(templateRoot, "database/typeorm/data-source.ts.hbs"),
    path.join(projectPath, "src", config.typescript ? "data-source.ts" : "data-source.js"),
    { ...config, databaseProvider: getDatabaseProvider(config.database) }
  );

  await templateEngine.processTemplate(
    path.join(templateRoot, "database/typeorm/entity/User.ts.hbs"),
    path.join(projectPath, "src/entity", config.typescript ? "User.ts" : "User.js"),
    config
  );

  consola.info("Run 'npm run typeorm migration:generate' to create migrations");
}

/**
 * Get the database provider name for ORM configurations
 * @param database - Database type
 * @returns Provider name
 */
function getDatabaseProvider(database: string): string {
  switch (database) {
    case "postgres":
    case "supabase":
    case "neon":
      return "postgresql";
    case "mysql":
    case "planetscale":
      return "mysql";
    case "mongodb":
      return "mongodb";
    case "turso":
    case "cloudflare-d1":
      return "sqlite";
    default:
      return "postgresql";
  }
}

/**
 * Setup database connection test for frontend projects
 * @param config - Project configuration
 * @param projectPath - Path to the project
 * @param templateEngine - Template engine instance
 */
async function setupDatabaseConnectionTest(
  config: ProjectConfig,
  projectPath: string,
  templateEngine: TemplateEngine
): Promise<void> {
  consola.info("Adding database connection test utilities...");

  // Determine where to place the test file based on framework
  let testFilePath = projectPath;

  // For monorepo structures, place in the web app
  if (config.backend && config.backend !== "none") {
    testFilePath = path.join(projectPath, "apps", "web");
  }

  // Create utils directory
  const utilsDir = path.join(testFilePath, "src", "utils");
  await ensureDir(utilsDir);

  // Copy database connection test template
  const templateRoot = getTemplateRoot();
  const testTemplatePath = path.join(
    templateRoot,
    "database/connection/database-connection.ts.hbs"
  );
  const outputFileName = config.typescript ? "database-connection.ts" : "database-connection.js";

  await templateEngine.processTemplate(
    testTemplatePath,
    path.join(utilsDir, outputFileName),
    config
  );

  // Update main file to include database test
  const mainFilePath = path.join(testFilePath, "src", config.typescript ? "main.ts" : "main.js");

  try {
    let mainContent = await readFile(mainFilePath, "utf-8");

    // Add import for database test
    const importStatement = `import { initializeDatabaseHealthMonitoring } from './utils/database-connection'${
      config.typescript ? "" : ""
    }\n`;

    // Add import at the beginning of the file
    if (!mainContent.includes("initializeDatabaseHealthMonitoring")) {
      mainContent = importStatement + mainContent;

      // Add initialization call at the end
      mainContent += `\n// Initialize database health monitoring\ninitializeDatabaseHealthMonitoring()\n`;

      await writeFile(mainFilePath, mainContent);
      consola.success("Added database health monitoring to main file");
    }
  } catch (error) {
    // Main file might not exist for some frameworks
    consola.debug("Could not update main file:", error);
  }

  consola.success("✅ Database connection test utilities added!");
}

/**
 * Setup Neon database configuration
 * @param config - Project configuration
 * @param projectPath - Path to the project
 */
async function setupNeon(config: ProjectConfig, projectPath: string): Promise<void> {
  consola.info("Setting up Neon database configuration...");

  // Install Neon serverless driver
  const packages = ["@neondatabase/serverless"];

  if (config.orm === "prisma") {
    packages.push("@prisma/adapter-neon", "ws");
  } else if (config.orm === "drizzle") {
    packages.push("@neondatabase/serverless");
  }

  await installDependencies(packages, {
    packageManager: config.packageManager,
    projectPath,
    dev: false,
  });

  // Setup environment variables
  const envExamplePath = path.join(projectPath, ".env.example");
  let envContent = "";

  try {
    envContent = await readFile(envExamplePath, "utf-8");
  } catch {
    // File doesn't exist, create it
  }

  if (!envContent.includes("DATABASE_URL")) {
    envContent += `
# Neon Database Configuration
DATABASE_URL="postgresql://[user]:[password]@[neon_hostname]/[dbname]?sslmode=require"
# Get your connection string from https://console.neon.tech

# For local development with Docker (optional)
# LOCAL_DATABASE_URL="postgresql://postgres:password@localhost:5432/${config.name.replace(/-/g, "_")}"
`;
    await writeFile(envExamplePath, envContent.trim() + "\n");
  }

  // Create database connection helper
  const dbDir = path.join(projectPath, "src", "lib");
  await ensureDir(dbDir);

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

  await writeFile(path.join(dbDir, config.typescript ? "db.ts" : "db.js"), dbContent.trim());

  consola.success("✅ Neon database setup completed!");
}

/**
 * Setup Turso database configuration
 * @param config - Project configuration
 * @param projectPath - Path to the project
 */
async function setupTurso(config: ProjectConfig, projectPath: string): Promise<void> {
  consola.info("Setting up Turso database configuration...");

  // Install libSQL client
  const packages = ["@libsql/client"];

  if (config.orm === "drizzle") {
    packages.push("drizzle-orm");
  }

  await installDependencies(packages, {
    packageManager: config.packageManager,
    projectPath,
    dev: false,
  });

  // Setup environment variables
  const envExamplePath = path.join(projectPath, ".env.example");
  let envContent = "";

  try {
    envContent = await readFile(envExamplePath, "utf-8");
  } catch {
    // File doesn't exist, create it
  }

  if (!envContent.includes("TURSO_DATABASE_URL")) {
    envContent += `
# Turso Database Configuration
TURSO_DATABASE_URL="libsql://[database]-[organization].turso.io"
TURSO_AUTH_TOKEN="[your-auth-token]"
# Get your credentials from https://turso.tech

# For local development
# LOCAL_DB_PATH="file:local.db"
`;
    await writeFile(envExamplePath, envContent.trim() + "\n");
  }

  // Create database connection helper
  const dbDir = path.join(projectPath, "src", "lib");
  await ensureDir(dbDir);

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

  await writeFile(path.join(dbDir, config.typescript ? "db.ts" : "db.js"), dbContent.trim());

  consola.success("✅ Turso database setup completed!");
}

/**
 * Setup PlanetScale database configuration
 * @param config - Project configuration
 * @param projectPath - Path to the project
 */
async function setupPlanetScale(config: ProjectConfig, projectPath: string): Promise<void> {
  consola.info("Setting up PlanetScale database configuration...");

  // Install PlanetScale database driver
  const packages = ["@planetscale/database"];

  if (config.orm === "prisma") {
    packages.push("@prisma/adapter-planetscale");
  } else if (config.orm === "drizzle") {
    packages.push("drizzle-orm");
  }

  await installDependencies(packages, {
    packageManager: config.packageManager,
    projectPath,
    dev: false,
  });

  // Setup environment variables
  const envExamplePath = path.join(projectPath, ".env.example");
  let envContent = "";

  try {
    envContent = await readFile(envExamplePath, "utf-8");
  } catch {
    // File doesn't exist, create it
  }

  if (!envContent.includes("DATABASE_URL")) {
    envContent += `
# PlanetScale Database Configuration
DATABASE_URL="mysql://[username]:[password]@[host]/[database]?ssl={"rejectUnauthorized":true}"
# Get your connection string from https://app.planetscale.com

# Alternative: Use individual credentials
# DATABASE_HOST="aws.connect.psdb.cloud"
# DATABASE_USERNAME="[username]"
# DATABASE_PASSWORD="[password]"
# DATABASE_NAME="[database]"
`;
    await writeFile(envExamplePath, envContent.trim() + "\n");
  }

  // Create database connection helper
  const dbDir = path.join(projectPath, "src", "lib");
  await ensureDir(dbDir);

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

  await writeFile(path.join(dbDir, config.typescript ? "db.ts" : "db.js"), dbContent.trim());

  consola.success("✅ PlanetScale database setup completed!");
}

/**
 * Setup Cloudflare D1 database configuration
 * @param config - Project configuration
 * @param projectPath - Path to the project
 */
async function setupCloudflareD1(config: ProjectConfig, projectPath: string): Promise<void> {
  consola.info("Setting up Cloudflare D1 database configuration...");

  // Install Cloudflare/Wrangler dependencies
  const packages = ["wrangler"];

  if (config.orm === "drizzle") {
    packages.push("drizzle-orm", "@cloudflare/workers-types");
  }

  await installDependencies(packages, {
    packageManager: config.packageManager,
    projectPath,
    dev: true,
  });

  // Create wrangler.toml configuration
  const wranglerConfig = `name = "${config.name}"
compatibility_date = "2024-01-01"
compatibility_flags = ["nodejs_compat"]

[[d1_databases]]
binding = "DB" # Available in your Worker as env.DB
database_name = "${config.name}-db"
database_id = "YOUR_DATABASE_ID" # Set after creating database with: wrangler d1 create ${config.name}-db
migrations_dir = "./migrations"

# For local development
[env.dev.d1_databases]
[[env.dev.d1_databases]]
binding = "DB"
database_name = "${config.name}-db-dev"
preview_database_id = "YOUR_PREVIEW_DATABASE_ID" # Set after creating preview database

# Environment variables
[vars]
NODE_ENV = "development"

[env.dev.vars]
NODE_ENV = "development"
`;

  await writeFile(path.join(projectPath, "wrangler.toml"), wranglerConfig);

  // Setup environment variables
  const envExamplePath = path.join(projectPath, ".env.example");
  let envContent = "";

  try {
    envContent = await readFile(envExamplePath, "utf-8");
  } catch {
    // File doesn't exist, create it
  }

  if (!envContent.includes("CLOUDFLARE_ACCOUNT_ID")) {
    envContent += `
# Cloudflare D1 Configuration
# Run these commands to set up your database:
# 1. wrangler login
# 2. wrangler d1 create ${config.name}-db
# 3. wrangler d1 create ${config.name}-db-dev
# 4. Update database_id values in wrangler.toml with the IDs returned

CLOUDFLARE_ACCOUNT_ID="your-account-id"
CLOUDFLARE_API_TOKEN="your-api-token"
`;
    await writeFile(envExamplePath, envContent.trim() + "\n");
  }

  // Create migrations directory
  await ensureDir(path.join(projectPath, "migrations"));

  // Create initial migration file
  const migrationContent = `-- Initial schema for ${config.name}
-- This migration will be applied when you run: wrangler d1 migrations apply ${config.name}-db

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX idx_users_email ON users(email);
`;

  await writeFile(
    path.join(projectPath, "migrations", "0001_initial_schema.sql"),
    migrationContent
  );

  // Create database helper for Worker environment
  const dbDir = path.join(projectPath, "src", "lib");
  await ensureDir(dbDir);

  const dbContent = config.typescript
    ? `
import type { D1Database } from '@cloudflare/workers-types';

export interface Env {
  DB: D1Database;
}

export function getDatabase(env: Env): D1Database {
  if (!env.DB) {
    throw new Error('D1 database binding not found. Make sure DB is configured in wrangler.toml');
  }
  return env.DB;
}
`
    : `
function getDatabase(env) {
  if (!env.DB) {
    throw new Error('D1 database binding not found. Make sure DB is configured in wrangler.toml');
  }
  return env.DB;
}

module.exports = { getDatabase };
`;

  await writeFile(path.join(dbDir, config.typescript ? "d1.ts" : "d1.js"), dbContent.trim());

  consola.info("📝 Next steps for Cloudflare D1:");
  consola.info("   1. Run: wrangler login");
  consola.info(`   2. Run: wrangler d1 create ${config.name}-db`);
  consola.info(`   3. Run: wrangler d1 create ${config.name}-db-dev`);
  consola.info("   4. Update wrangler.toml with the database IDs");
  consola.info(`   5. Run: wrangler d1 migrations apply ${config.name}-db --local`);

  consola.success("✅ Cloudflare D1 database setup completed!");
}

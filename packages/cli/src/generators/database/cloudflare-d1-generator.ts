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

export class CloudflareD1Generator implements DatabaseGenerator {
  id = "cloudflare-d1";
  name = "Cloudflare D1";
  supportedORMs = ["drizzle"];

  async setup(
    config: ProjectConfig,
    projectPath: string,
    templateEngine: TemplateEngine
  ): Promise<void> {
    consola.info("Setting up Cloudflare D1 database configuration...");

    // Create database directories
    const dbDir = path.join(projectPath, "src", "lib");
    await ensureDir(dbDir);

    // Create migrations directory
    await ensureDir(path.join(projectPath, "migrations"));

    // Copy Cloudflare D1-specific configuration files
    await this.copyConfigurationFiles(config, projectPath, templateEngine);

    // Create wrangler.toml configuration
    await this.setupWranglerConfig(config, projectPath);

    // Create initial migration
    await this.setupInitialMigration(config, projectPath);

    // Create database helper for Worker environment
    await this.setupConnectionHelper(config, projectPath);

    // Add database health check endpoint
    await this.setupHealthCheck(config, projectPath, templateEngine);
  }

  async installDependencies(config: ProjectConfig, projectPath: string): Promise<void> {
    const packages: string[] = [];
    const devPackages = ["wrangler"];

    // Add ORM-specific packages
    if (config.orm === "drizzle") {
      packages.push("drizzle-orm");
      devPackages.push("drizzle-kit", "@cloudflare/workers-types");
    }

    // Install packages
    consola.info("📦 Installing Cloudflare D1 packages...");
    if (packages.length > 0) {
      await installDependencies(packages, {
        packageManager: config.packageManager,
        projectPath,
        dev: false,
      });
    }

    await installDependencies(devPackages, {
      packageManager: config.packageManager,
      projectPath,
      dev: true,
    });
  }

  async setupEnvironment(config: ProjectConfig, projectPath: string): Promise<void> {
    const envPath = path.join(projectPath, ".env");
    const envExamplePath = path.join(projectPath, ".env.example");

    const envContent = `
# Cloudflare D1 Configuration
# Run these commands to set up your database:
# 1. wrangler login
# 2. wrangler d1 create ${config.name}-db
# 3. wrangler d1 create ${config.name}-db-dev
# 4. Update database_id values in wrangler.toml with the IDs returned

CLOUDFLARE_ACCOUNT_ID="your-account-id"
CLOUDFLARE_API_TOKEN="your-api-token"
`;

    // Update .env files
    for (const filePath of [envPath, envExamplePath]) {
      let existingContent = "";
      if (await pathExists(filePath)) {
        existingContent = await readFile(filePath, "utf-8");
      }

      if (!existingContent.includes("CLOUDFLARE_ACCOUNT_ID")) {
        await writeFile(filePath, existingContent + envContent);
      }
    }
  }

  getConnectionString(config: ProjectConfig): string {
    return `D1 binding in Cloudflare Workers (${config.name}-db)`;
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
      "cloudflare-d1",
      `config.${config.typescript ? "ts" : "js"}.hbs`
    );

    if (await pathExists(configTemplate)) {
      await templateEngine.processTemplate(
        configTemplate,
        path.join(projectPath, "src", "lib", `d1-config.${config.typescript ? "ts" : "js"}`),
        config
      );
    }
  }

  private async setupWranglerConfig(config: ProjectConfig, projectPath: string): Promise<void> {
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
  }

  private async setupInitialMigration(config: ProjectConfig, projectPath: string): Promise<void> {
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
  }

  private async setupConnectionHelper(config: ProjectConfig, projectPath: string): Promise<void> {
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

    const dbPath = path.join(projectPath, "src", "lib", config.typescript ? "d1.ts" : "d1.js");
    await writeFile(dbPath, dbContent.trim());
  }

  private async setupHealthCheck(
    config: ProjectConfig,
    projectPath: string,
    _templateEngine: TemplateEngine
  ): Promise<void> {
    const healthCheckCode = config.typescript
      ? `
import type { Env } from './d1';
import { getDatabase } from './d1';

export async function checkDatabaseConnection(env: Env): Promise<boolean> {
  try {
    const db = getDatabase(env);
    await db.prepare('SELECT 1').first();
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    return false;
  }
}
`
      : `
const { getDatabase } = require('./d1');

async function checkDatabaseConnection(env) {
  try {
    const db = getDatabase(env);
    await db.prepare('SELECT 1').first();
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    return false;
  }
}

module.exports = { checkDatabaseConnection };
`;

    const healthCheckPath = path.join(
      projectPath,
      "src",
      "lib",
      `health-check.${config.typescript ? "ts" : "js"}`
    );

    await writeFile(healthCheckPath, healthCheckCode.trim());
  }

  getNextSteps(): string[] {
    return [
      "1. Run: wrangler login",
      `2. Run: wrangler d1 create ${this.id}-db`,
      `3. Run: wrangler d1 create ${this.id}-db-dev`,
      "4. Update wrangler.toml with the database IDs",
      `5. Run: wrangler d1 migrations apply ${this.id}-db --local`,
      "6. Deploy with: wrangler publish",
    ];
  }
}

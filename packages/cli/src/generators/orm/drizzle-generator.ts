import * as path from "path";

import { consola } from "consola";
// eslint-disable-next-line import/default
import fsExtra from "fs-extra";

// eslint-disable-next-line import/no-named-as-default-member
const { ensureDir, writeFile, pathExists } = fsExtra;

import type { ProjectConfig } from "../../../../shared/stack-config.js";
import type { TemplateEngine } from "../../core/template-engine.js";
import { installDependencies } from "../../utils/package-manager.js";

import type { ORMGenerator } from "./orm-generator.interface.js";

export class DrizzleGenerator implements ORMGenerator {
  id = "drizzle";
  name = "Drizzle ORM";
  supportedDatabases = [
    "postgres",
    "mysql",
    "sqlite",
    "neon",
    "planetscale",
    "turso",
    "cloudflare-d1",
  ];

  async setup(
    config: ProjectConfig,
    projectPath: string,
    templateEngine: TemplateEngine
  ): Promise<void> {
    consola.info("Setting up Drizzle ORM...");

    // Create database directories
    await ensureDir(path.join(projectPath, "src", "db"));

    // Generate config file
    await this.generateConfig(config, projectPath);

    // Generate schema files
    await this.generateSchema(config, projectPath, templateEngine);

    // Generate client files
    await this.generateClient(config, projectPath, templateEngine);
  }

  async installDependencies(config: ProjectConfig, projectPath: string): Promise<void> {
    const packages = ["drizzle-orm"];
    const devPackages = ["drizzle-kit"];

    // Add database-specific packages
    switch (config.database) {
      case "postgres":
        packages.push("postgres");
        if (config.typescript) {
          devPackages.push("@types/pg");
        }
        break;
      case "mysql":
        packages.push("mysql2");
        break;
      case "neon":
        packages.push("@neondatabase/serverless");
        break;
      case "planetscale":
        packages.push("@planetscale/database");
        break;
      case "turso":
        packages.push("@libsql/client");
        break;
      case "cloudflare-d1":
        if (config.typescript) {
          devPackages.push("@cloudflare/workers-types");
        }
        break;
    }

    // Install packages
    consola.info("📦 Installing Drizzle packages...");
    await installDependencies(packages, {
      packageManager: config.packageManager,
      projectPath,
      dev: false,
    });

    await installDependencies(devPackages, {
      packageManager: config.packageManager,
      projectPath,
      dev: true,
    });
  }

  async generateSchema(
    config: ProjectConfig,
    projectPath: string,
    templateEngine: TemplateEngine
  ): Promise<void> {
    const templateRoot = templateEngine["templateRoot"];

    // Use database-specific schema template if available
    let schemaTemplate = "database/drizzle/schema.ts.hbs";
    if (["neon", "planetscale", "turso", "cloudflare-d1"].includes(config.database)) {
      schemaTemplate = `database/drizzle/schema-${config.database}.ts.hbs`;
    }

    const schemaTemplatePath = path.join(templateRoot, schemaTemplate);

    if (await pathExists(schemaTemplatePath)) {
      await templateEngine.processTemplate(
        schemaTemplatePath,
        path.join(projectPath, "src/db", config.typescript ? "schema.ts" : "schema.js"),
        config
      );
    } else {
      // Fallback to default schema
      await this.generateDefaultSchema(config, projectPath);
    }
  }

  async generateClient(
    config: ProjectConfig,
    projectPath: string,
    templateEngine: TemplateEngine
  ): Promise<void> {
    const templateRoot = templateEngine["templateRoot"];

    // Use database-specific connection template if available
    let connectionTemplate = "database/drizzle/connection.ts.hbs";
    if (["neon", "planetscale", "turso", "cloudflare-d1"].includes(config.database)) {
      connectionTemplate = `database/drizzle/connection-${config.database}.ts.hbs`;
    }

    const connectionTemplatePath = path.join(templateRoot, connectionTemplate);

    if (await pathExists(connectionTemplatePath)) {
      await templateEngine.processTemplate(
        connectionTemplatePath,
        path.join(projectPath, "src/db", config.typescript ? "connection.ts" : "connection.js"),
        { ...config, databaseProvider: this.getDatabaseProvider(config.database) }
      );
    } else {
      // Fallback to default connection
      await this.generateDefaultConnection(config, projectPath);
    }
  }

  private async generateConfig(config: ProjectConfig, projectPath: string): Promise<void> {
    const configContent = config.typescript
      ? `
import type { Config } from 'drizzle-kit';

export default {
  schema: './src/db/schema.ts',
  out: './drizzle',
  driver: '${this.getDrizzleDriver(config.database)}',
  dbCredentials: ${this.getDbCredentials(config.database)},
} satisfies Config;
`
      : `
/** @type { import("drizzle-kit").Config } */
export default {
  schema: './src/db/schema.js',
  out: './drizzle',
  driver: '${this.getDrizzleDriver(config.database)}',
  dbCredentials: ${this.getDbCredentials(config.database)},
};
`;

    await writeFile(
      path.join(projectPath, config.typescript ? "drizzle.config.ts" : "drizzle.config.js"),
      configContent.trim()
    );
  }

  private async generateDefaultSchema(config: ProjectConfig, projectPath: string): Promise<void> {
    const imports = this.getSchemaImports(config.database);
    const tableFunction = this.getTableFunction(config.database);

    const schemaContent = `
${imports}

export const users = ${tableFunction}('users', {
  id: ${this.getIdColumn(config.database)},
  email: ${this.getVarcharColumn(config.database)}('email', { length: 255 }).notNull().unique(),
  name: ${this.getVarcharColumn(config.database)}('name', { length: 255 }),
  createdAt: ${this.getTimestampColumn(config.database)}('created_at').defaultNow(),
  updatedAt: ${this.getTimestampColumn(config.database)}('updated_at').defaultNow(),
});
`;

    await writeFile(
      path.join(projectPath, "src/db", config.typescript ? "schema.ts" : "schema.js"),
      schemaContent.trim()
    );
  }

  private async generateDefaultConnection(
    config: ProjectConfig,
    projectPath: string
  ): Promise<void> {
    const connectionContent = this.getConnectionCode(config);

    await writeFile(
      path.join(projectPath, "src/db", config.typescript ? "connection.ts" : "connection.js"),
      connectionContent.trim()
    );
  }

  private getDatabaseProvider(database: string): string {
    switch (database) {
      case "postgres":
      case "neon":
        return "postgresql";
      case "mysql":
      case "planetscale":
        return "mysql";
      case "sqlite":
      case "turso":
      case "cloudflare-d1":
        return "sqlite";
      default:
        return "postgresql";
    }
  }

  private getDrizzleDriver(database: string): string {
    switch (database) {
      case "postgres":
        return "pg";
      case "mysql":
        return "mysql2";
      case "neon":
        return "neon-http";
      case "planetscale":
        return "planetscale-serverless";
      case "turso":
        return "libsql";
      case "cloudflare-d1":
        return "d1";
      default:
        return "pg";
    }
  }

  private getDbCredentials(database: string): string {
    switch (database) {
      case "postgres":
        return `{
    connectionString: process.env.DATABASE_URL!,
  }`;
      case "mysql":
        return `{
    connectionString: process.env.DATABASE_URL!,
  }`;
      case "neon":
        return `{
    connectionString: process.env.DATABASE_URL!,
  }`;
      case "planetscale":
        return `{
    url: process.env.DATABASE_URL!,
  }`;
      case "turso":
        return `{
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN!,
  }`;
      case "cloudflare-d1":
        return `{
    wranglerConfigPath: './wrangler.toml',
    dbName: 'DB',
  }`;
      default:
        return `{
    connectionString: process.env.DATABASE_URL!,
  }`;
    }
  }

  private getSchemaImports(database: string): string {
    switch (database) {
      case "postgres":
      case "neon":
        return `import { pgTable, serial, varchar, timestamp } from 'drizzle-orm/pg-core';`;
      case "mysql":
      case "planetscale":
        return `import { mysqlTable, serial, varchar, timestamp } from 'drizzle-orm/mysql-core';`;
      case "sqlite":
      case "turso":
      case "cloudflare-d1":
        return `import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';`;
      default:
        return `import { pgTable, serial, varchar, timestamp } from 'drizzle-orm/pg-core';`;
    }
  }

  private getTableFunction(database: string): string {
    switch (database) {
      case "postgres":
      case "neon":
        return "pgTable";
      case "mysql":
      case "planetscale":
        return "mysqlTable";
      case "sqlite":
      case "turso":
      case "cloudflare-d1":
        return "sqliteTable";
      default:
        return "pgTable";
    }
  }

  private getIdColumn(database: string): string {
    switch (database) {
      case "postgres":
      case "neon":
      case "mysql":
      case "planetscale":
        return "serial('id').primaryKey()";
      case "sqlite":
      case "turso":
      case "cloudflare-d1":
        return "integer('id').primaryKey({ autoIncrement: true })";
      default:
        return "serial('id').primaryKey()";
    }
  }

  private getVarcharColumn(database: string): string {
    switch (database) {
      case "sqlite":
      case "turso":
      case "cloudflare-d1":
        return "text";
      default:
        return "varchar";
    }
  }

  private getTimestampColumn(database: string): string {
    switch (database) {
      case "sqlite":
      case "turso":
      case "cloudflare-d1":
        return "text";
      default:
        return "timestamp";
    }
  }

  private getConnectionCode(config: ProjectConfig): string {
    const { database, typescript } = config;

    switch (database) {
      case "postgres":
        return typescript
          ? `
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const queryClient = postgres(process.env.DATABASE_URL!);
export const db = drizzle(queryClient, { schema });
`
          : `
const { drizzle } = require('drizzle-orm/postgres-js');
const postgres = require('postgres');
const schema = require('./schema');

const queryClient = postgres(process.env.DATABASE_URL);
const db = drizzle(queryClient, { schema });

module.exports = { db };
`;

      case "mysql":
        return typescript
          ? `
import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from './schema';

const connection = await mysql.createConnection(process.env.DATABASE_URL!);
export const db = drizzle(connection, { schema });
`
          : `
const { drizzle } = require('drizzle-orm/mysql2');
const mysql = require('mysql2/promise');
const schema = require('./schema');

const connection = await mysql.createConnection(process.env.DATABASE_URL);
const db = drizzle(connection, { schema });

module.exports = { db };
`;

      case "neon":
        return typescript
          ? `
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from './schema';

const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql, { schema });
`
          : `
const { drizzle } = require('drizzle-orm/neon-http');
const { neon } = require('@neondatabase/serverless');
const schema = require('./schema');

const sql = neon(process.env.DATABASE_URL);
const db = drizzle(sql, { schema });

module.exports = { db };
`;

      case "planetscale":
        return typescript
          ? `
import { drizzle } from 'drizzle-orm/planetscale-serverless';
import { connect } from '@planetscale/database';
import * as schema from './schema';

const connection = connect({
  url: process.env.DATABASE_URL!,
});

export const db = drizzle(connection, { schema });
`
          : `
const { drizzle } = require('drizzle-orm/planetscale-serverless');
const { connect } = require('@planetscale/database');
const schema = require('./schema');

const connection = connect({
  url: process.env.DATABASE_URL,
});

const db = drizzle(connection, { schema });

module.exports = { db };
`;

      case "turso":
        return typescript
          ? `
import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from './schema';

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

export const db = drizzle(client, { schema });
`
          : `
const { drizzle } = require('drizzle-orm/libsql');
const { createClient } = require('@libsql/client');
const schema = require('./schema');

const client = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

const db = drizzle(client, { schema });

module.exports = { db };
`;

      case "cloudflare-d1":
        return typescript
          ? `
import { drizzle } from 'drizzle-orm/d1';
import * as schema from './schema';

export function getDb(env: { DB: D1Database }) {
  return drizzle(env.DB, { schema });
}
`
          : `
const { drizzle } = require('drizzle-orm/d1');
const schema = require('./schema');

function getDb(env) {
  return drizzle(env.DB, { schema });
}

module.exports = { getDb };
`;

      default:
        return this.getConnectionCode({ ...config, database: "postgres" });
    }
  }

  getNextSteps(): string[] {
    return [
      "1. Run 'npx drizzle-kit generate' to create migration files",
      "2. Run 'npx drizzle-kit push' to sync your schema with the database",
      "3. Use 'npx drizzle-kit studio' to explore your data in the browser",
      "4. Learn more at https://orm.drizzle.team/docs/overview",
    ];
  }
}

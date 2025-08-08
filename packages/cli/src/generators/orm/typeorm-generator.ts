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

export class TypeORMGenerator implements ORMGenerator {
  id = "typeorm";
  name = "TypeORM";
  supportedDatabases = ["postgres", "mysql", "sqlite", "mongodb"];

  async setup(
    config: ProjectConfig,
    projectPath: string,
    templateEngine: TemplateEngine
  ): Promise<void> {
    consola.info("Setting up TypeORM...");

    // Create TypeORM directories
    await ensureDir(path.join(projectPath, "src", "entity"));
    await ensureDir(path.join(projectPath, "src", "migration"));
    await ensureDir(path.join(projectPath, "src", "subscriber"));

    // Generate data source configuration
    await this.generateClient(config, projectPath, templateEngine);

    // Generate schema files
    await this.generateSchema(config, projectPath, templateEngine);
  }

  async installDependencies(config: ProjectConfig, projectPath: string): Promise<void> {
    const packages = ["typeorm", "reflect-metadata"];
    const devPackages: string[] = [];

    // Add database-specific packages
    switch (config.database) {
      case "postgres":
        packages.push("pg");
        if (config.typescript) {
          devPackages.push("@types/pg");
        }
        break;
      case "mysql":
        packages.push("mysql2");
        break;
      case "sqlite":
        packages.push("sqlite3");
        if (config.typescript) {
          devPackages.push("@types/sqlite3");
        }
        break;
      case "mongodb":
        packages.push("mongodb");
        if (config.typescript) {
          devPackages.push("@types/mongodb");
        }
        break;
    }

    // Install packages
    consola.info("📦 Installing TypeORM packages...");
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

  async generateSchema(
    config: ProjectConfig,
    projectPath: string,
    templateEngine: TemplateEngine
  ): Promise<void> {
    const templateRoot = templateEngine["templateRoot"];

    // Use TypeORM entity template if available
    const entityTemplate = path.join(templateRoot, "database/typeorm/entity/User.ts.hbs");

    if (await pathExists(entityTemplate)) {
      await templateEngine.processTemplate(
        entityTemplate,
        path.join(projectPath, "src/entity", config.typescript ? "User.ts" : "User.js"),
        config
      );
    } else {
      // Fallback to default entity
      await this.generateDefaultEntity(config, projectPath);
    }
  }

  async generateClient(
    config: ProjectConfig,
    projectPath: string,
    templateEngine: TemplateEngine
  ): Promise<void> {
    const templateRoot = templateEngine["templateRoot"];

    // Use TypeORM data source template if available
    const dataSourceTemplate = path.join(templateRoot, "database/typeorm/data-source.ts.hbs");

    if (await pathExists(dataSourceTemplate)) {
      await templateEngine.processTemplate(
        dataSourceTemplate,
        path.join(projectPath, "src", config.typescript ? "data-source.ts" : "data-source.js"),
        { ...config, databaseProvider: this.getDatabaseProvider(config.database) }
      );
    } else {
      // Fallback to default data source
      await this.generateDefaultDataSource(config, projectPath);
    }
  }

  private async generateDefaultEntity(config: ProjectConfig, projectPath: string): Promise<void> {
    const entityContent = config.typescript
      ? `
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ unique: true })
    email!: string;

    @Column({ nullable: true })
    name?: string;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}
`
      : `
const { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } = require("typeorm");

@Entity()
class User {
    @PrimaryGeneratedColumn()
    id;

    @Column({ unique: true })
    email;

    @Column({ nullable: true })
    name;

    @CreateDateColumn()
    createdAt;

    @UpdateDateColumn()
    updatedAt;
}

module.exports = { User };
`;

    await writeFile(
      path.join(projectPath, "src/entity", config.typescript ? "User.ts" : "User.js"),
      entityContent.trim()
    );
  }

  private async generateDefaultDataSource(
    config: ProjectConfig,
    projectPath: string
  ): Promise<void> {
    const dataSourceContent = config.typescript
      ? `
import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entity/User";

export const AppDataSource = new DataSource({
    type: "${this.getDatabaseProvider(config.database)}",
    ${this.getConnectionConfig(config)},
    synchronize: true,
    logging: false,
    entities: [User],
    migrations: [],
    subscribers: [],
});
`
      : `
require("reflect-metadata");
const { DataSource } = require("typeorm");
const { User } = require("./entity/User");

const AppDataSource = new DataSource({
    type: "${this.getDatabaseProvider(config.database)}",
    ${this.getConnectionConfig(config)},
    synchronize: true,
    logging: false,
    entities: [User],
    migrations: [],
    subscribers: [],
});

module.exports = { AppDataSource };
`;

    await writeFile(
      path.join(projectPath, "src", config.typescript ? "data-source.ts" : "data-source.js"),
      dataSourceContent.trim()
    );
  }

  private getDatabaseProvider(database: string): string {
    switch (database) {
      case "postgres":
        return "postgres";
      case "mysql":
        return "mysql";
      case "sqlite":
        return "sqlite";
      case "mongodb":
        return "mongodb";
      default:
        return "postgres";
    }
  }

  private getConnectionConfig(config: ProjectConfig): string {
    switch (config.database) {
      case "postgres":
        return `url: process.env.DATABASE_URL`;
      case "mysql":
        return `url: process.env.DATABASE_URL`;
      case "sqlite":
        return `database: "database.sqlite"`;
      case "mongodb":
        return `url: process.env.MONGODB_URI`;
      default:
        return `url: process.env.DATABASE_URL`;
    }
  }

  async setupMigrations(config: ProjectConfig, projectPath: string): Promise<void> {
    // Create ormconfig for TypeORM CLI
    const ormConfig = config.typescript
      ? `
import { DataSource } from 'typeorm';

export default new DataSource({
    type: '${this.getDatabaseProvider(config.database)}',
    ${this.getConnectionConfig(config)},
    synchronize: false,
    logging: false,
    entities: ['src/entity/**/*.ts'],
    migrations: ['src/migration/**/*.ts'],
    subscribers: ['src/subscriber/**/*.ts'],
    cli: {
        entitiesDir: 'src/entity',
        migrationsDir: 'src/migration',
        subscribersDir: 'src/subscriber',
    },
});
`
      : `
const { DataSource } = require('typeorm');

module.exports = new DataSource({
    type: '${this.getDatabaseProvider(config.database)}',
    ${this.getConnectionConfig(config)},
    synchronize: false,
    logging: false,
    entities: ['src/entity/**/*.js'],
    migrations: ['src/migration/**/*.js'],
    subscribers: ['src/subscriber/**/*.js'],
    cli: {
        entitiesDir: 'src/entity',
        migrationsDir: 'src/migration',
        subscribersDir: 'src/subscriber',
    },
});
`;

    await writeFile(
      path.join(projectPath, config.typescript ? "ormconfig.ts" : "ormconfig.js"),
      ormConfig.trim()
    );
  }

  getNextSteps(): string[] {
    return [
      "1. Run 'npm run typeorm migration:generate -- -n InitialMigration' to create initial migration",
      "2. Run 'npm run typeorm migration:run' to apply migrations",
      "3. Use 'npm run typeorm entity:create -- -n EntityName' to create new entities",
      "4. Learn more at https://typeorm.io/",
    ];
  }
}

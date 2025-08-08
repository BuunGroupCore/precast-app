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

export class PrismaGenerator implements ORMGenerator {
  id = "prisma";
  name = "Prisma";
  supportedDatabases = [
    "postgres",
    "mysql",
    "sqlite",
    "mongodb",
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
    consola.info("Setting up Prisma ORM...");

    // Create Prisma directory
    await ensureDir(path.join(projectPath, "prisma"));

    // Generate schema files
    await this.generateSchema(config, projectPath, templateEngine);

    // Generate client files
    await this.generateClient(config, projectPath, templateEngine);

    // Setup migrations if needed
    await this.setupMigrations?.(config, projectPath);
  }

  async installDependencies(config: ProjectConfig, projectPath: string): Promise<void> {
    const packages = ["@prisma/client"];
    const devPackages = ["prisma"];

    // Add database-specific packages
    switch (config.database) {
      case "neon":
        packages.push("@prisma/adapter-neon", "ws");
        break;
      case "planetscale":
        packages.push("@prisma/adapter-planetscale");
        break;
      case "turso":
        packages.push("@prisma/adapter-libsql");
        break;
    }

    // Install packages
    consola.info("📦 Installing Prisma packages...");
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
    let schemaTemplate = "database/prisma/schema.prisma.hbs";
    if (["neon", "planetscale"].includes(config.database)) {
      schemaTemplate = `database/prisma/schema-${config.database}.prisma.hbs`;
    }

    const schemaTemplatePath = path.join(templateRoot, schemaTemplate);

    if (await pathExists(schemaTemplatePath)) {
      await templateEngine.processTemplate(
        schemaTemplatePath,
        path.join(projectPath, "prisma/schema.prisma"),
        { ...config, databaseProvider: this.getDatabaseProvider(config.database) }
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
    // Create lib directory
    await ensureDir(path.join(projectPath, "src", "lib"));

    const templateRoot = templateEngine["templateRoot"];

    // Use database-specific client template if available
    let clientTemplate = "database/prisma/client.ts.hbs";
    if (["neon", "planetscale"].includes(config.database)) {
      clientTemplate = `database/prisma/client-${config.database}.ts.hbs`;
    }

    const clientTemplatePath = path.join(templateRoot, clientTemplate);

    if (await pathExists(clientTemplatePath)) {
      await templateEngine.processTemplate(
        clientTemplatePath,
        path.join(projectPath, "src/lib", config.typescript ? "prisma.ts" : "prisma.js"),
        config
      );
    } else {
      // Fallback to default client
      await this.generateDefaultClient(config, projectPath);
    }
  }

  async setupMigrations(config: ProjectConfig, projectPath: string): Promise<void> {
    // Create migrations directory
    await ensureDir(path.join(projectPath, "prisma", "migrations"));

    // Create seed script
    const seedContent = config.typescript
      ? `
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Start seeding...");
  
  // Add your seed data here
  // Example:
  // await prisma.user.create({
  //   data: {
  //     email: "admin@example.com",
  //     name: "Admin User",
  //   },
  // });

  console.log("Seeding finished.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
`
      : `
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  console.log("Start seeding...");
  
  // Add your seed data here
  // Example:
  // await prisma.user.create({
  //   data: {
  //     email: "admin@example.com",
  //     name: "Admin User",
  //   },
  // });

  console.log("Seeding finished.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
`;

    await writeFile(
      path.join(projectPath, "prisma", config.typescript ? "seed.ts" : "seed.js"),
      seedContent.trim()
    );
  }

  private async generateDefaultSchema(config: ProjectConfig, projectPath: string): Promise<void> {
    const provider = this.getDatabaseProvider(config.database);

    const schemaContent = `
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "${provider}"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  @@map("users")
}
`;

    await writeFile(path.join(projectPath, "prisma/schema.prisma"), schemaContent.trim());
  }

  private async generateDefaultClient(config: ProjectConfig, projectPath: string): Promise<void> {
    const clientContent = config.typescript
      ? `
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
`
      : `
const { PrismaClient } = require("@prisma/client");

const globalForPrisma = globalThis;

const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

module.exports = { prisma };
`;

    await writeFile(
      path.join(projectPath, "src/lib", config.typescript ? "prisma.ts" : "prisma.js"),
      clientContent.trim()
    );
  }

  private getDatabaseProvider(database: string): string {
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
      case "sqlite":
      case "turso":
      case "cloudflare-d1":
        return "sqlite";
      default:
        return "postgresql";
    }
  }

  getNextSteps(): string[] {
    return [
      "1. Run 'npx prisma generate' to generate the Prisma Client",
      "2. Run 'npx prisma db push' to sync your schema to the database",
      "3. Run 'npx prisma db seed' to populate your database with initial data",
      "4. Use 'npx prisma studio' to explore your data in the browser",
      "5. Learn more at https://prisma.io/docs",
    ];
  }
}

import { execSync } from "child_process";
import * as path from "path";

import { consola } from "consola";
import fsExtra from "fs-extra";

const { pathExists, readJson } = fsExtra;

interface GenerateOptions {
  orm?: string;
}

/**
 * Generate ORM client and rebuild shared types for the current project.
 * Supports Prisma, Drizzle, and TypeORM with automatic detection of monorepo structure.
 *
 * @param options - Generation options including ORM type override
 */
export async function generateCommand(options: GenerateOptions): Promise<void> {
  try {
    const isPrecastProject = await pathExists("precast.jsonc");
    if (!isPrecastProject) {
      consola.error("❌ This command must be run in a Precast project directory");
      consola.info("💡 Look for a 'precast.jsonc' file in the project root");
      process.exit(1);
    }

    const config = await readJson("precast.jsonc");
    const detectedOrm = config.orm || options.orm;

    if (!detectedOrm || detectedOrm === "none") {
      consola.error("❌ No ORM detected in this project");
      consola.info("💡 This command is only useful for projects with Prisma, Drizzle, or TypeORM");
      process.exit(1);
    }

    consola.start(`🔄 Generating ${detectedOrm} client...`);

    const isMonorepo = await pathExists("apps/api");
    const workingDir = isMonorepo ? "apps/api" : ".";

    switch (detectedOrm) {
      case "prisma":
        await generatePrisma(workingDir);
        break;
      case "drizzle":
        await generateDrizzle(workingDir);
        break;
      case "typeorm":
        await generateTypeORM(workingDir);
        break;
      default:
        consola.error(`❌ Unsupported ORM: ${detectedOrm}`);
        process.exit(1);
    }

    if (await pathExists("packages/shared")) {
      consola.start("🔄 Rebuilding shared package...");
      try {
        execSync("cd packages/shared && npm run build", { stdio: "inherit" });
        consola.success("✅ Shared package rebuilt successfully");
      } catch {
        consola.warn("⚠️  Failed to rebuild shared package, but ORM generation was successful");
      }
    }

    consola.success(`✅ ${detectedOrm} client generated successfully!`);
    consola.info("💡 You can now use the generated types in your application");
  } catch (error) {
    consola.error("❌ Failed to generate ORM client:", error);
    process.exit(1);
  }
}

/**
 * Generate Prisma client and optionally sync database schema
 *
 * @param workingDir - Directory containing the Prisma schema
 */
async function generatePrisma(workingDir: string): Promise<void> {
  const schemaPath = path.join(workingDir, "prisma/schema.prisma");
  if (!(await pathExists(schemaPath))) {
    throw new Error("Prisma schema not found. Expected: prisma/schema.prisma");
  }

  execSync(`cd ${workingDir} && npx prisma generate`, { stdio: "inherit" });
  consola.success("✅ Prisma client generated");

  try {
    execSync(`cd ${workingDir} && npx prisma db push --skip-generate`, { stdio: "pipe" });
    consola.success("✅ Database schema synced");
  } catch {
    consola.info("💡 Database not available or not needed - only client generated");
  }
}

/**
 * Generate Drizzle migrations from schema
 *
 * @param workingDir - Directory containing the Drizzle configuration
 */
async function generateDrizzle(workingDir: string): Promise<void> {
  const hasConfig =
    (await pathExists(path.join(workingDir, "drizzle.config.ts"))) ||
    (await pathExists(path.join(workingDir, "drizzle.config.js")));

  if (!hasConfig) {
    throw new Error("Drizzle config not found. Expected: drizzle.config.ts or drizzle.config.js");
  }

  execSync(`cd ${workingDir} && npx drizzle-kit generate`, { stdio: "inherit" });
  consola.success("✅ Drizzle migrations generated");
}

/**
 * Validate TypeORM setup - TypeORM doesn't require generation
 *
 * @param workingDir - Directory containing the TypeORM data source
 */
async function generateTypeORM(workingDir: string): Promise<void> {
  const hasDataSource =
    (await pathExists(path.join(workingDir, "src/data-source.ts"))) ||
    (await pathExists(path.join(workingDir, "src/data-source.js")));

  if (!hasDataSource) {
    throw new Error("TypeORM data source not found. Expected: src/data-source.ts");
  }

  consola.info("💡 TypeORM doesn't require generation - entities are used directly");
  consola.success("✅ TypeORM is ready to use");
}

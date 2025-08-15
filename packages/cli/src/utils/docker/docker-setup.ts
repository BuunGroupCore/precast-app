import * as crypto from "crypto";
import * as path from "path";
import { fileURLToPath } from "url";

import type { ProjectConfig } from "@shared/stack-config.js";
import { consola } from "consola";
import fsExtra from "fs-extra";
import Handlebars from "handlebars";

import { logger } from "@/utils/ui/logger.js";

const { copy, ensureDir, pathExists, readdir, readFile, readJson, stat, writeFile, writeJson } =
  fsExtra;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Generates a cryptographically secure random password
 * @param length - Length of the password to generate (default: 20)
 * @returns A random password string containing alphanumeric and special characters
 */
function generatePassword(length: number = 20): string {
  // Use Docker-safe characters (no $ which causes variable substitution issues)
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#%^&*";
  let password = "";
  for (let i = 0; i < length; i++) {
    password += chars.charAt(crypto.randomInt(0, chars.length));
  }
  return password;
}

/**
 * Sets up Docker Compose configuration for local database development.
 * Uses Handlebars templates for consistent, maintainable Docker configurations.
 *
 * @param config - Project configuration
 * @param projectPath - Path to the project root
 * @returns Promise that resolves when Docker setup is complete
 */
export async function setupDockerCompose(
  config: ProjectConfig,
  projectPath: string
): Promise<{ passwords?: Record<string, string> }> {
  const database = config.database;

  if (!database || database === "none" || database === "firebase" || database === "supabase") {
    logger.info("Skipping Docker setup - no local database needed");
    return {};
  }

  if (database === "turso") {
    logger.info("ℹ️ Turso uses SQLite locally, Docker setup not needed");
    logger.info("   Run 'turso dev' to start a local libSQL server");
    return {};
  }

  if (database === "cloudflare-d1") {
    logger.info("ℹ️ Cloudflare D1 uses Wrangler locally, Docker setup not needed");
    logger.info("   Run 'wrangler d1 execute' to interact with your local database");
    return {};
  }

  logger.verbose(`🐳 Setting up Docker Compose for ${database}...`);

  try {
    const dockerDir = path.join(projectPath, "docker");
    const dbDir = path.join(dockerDir, database);
    await ensureDir(dockerDir);
    await ensureDir(dbDir);

    const passwords = {
      POSTGRES_PASSWORD: generatePassword(),
      MYSQL_ROOT_PASSWORD: generatePassword(),
      MYSQL_PASSWORD: generatePassword(),
      MONGO_ROOT_PASSWORD: generatePassword(),
      MONGO_PASSWORD: generatePassword(),
      REDIS_PASSWORD: generatePassword(),
    };

    const context = {
      ...config,
      ...passwords,
      name: config.name.replace(/-/g, "_"),
      projectName: config.name,
    };

    const templateDir = path.join(__dirname, "templates", "docker", database);

    if (!(await pathExists(templateDir))) {
      const srcTemplateDir = path.join(
        __dirname,
        "..",
        "..",
        "src",
        "templates",
        "docker",
        database
      );
      if (await pathExists(srcTemplateDir)) {
        const files = await readdir(srcTemplateDir);
        for (const file of files) {
          const filePath = path.join(srcTemplateDir, file);
          const stats = await stat(filePath);

          if (stats.isDirectory()) {
            const targetDir = path.join(dbDir, file);
            await copy(filePath, targetDir);
          } else if (file.endsWith(".hbs")) {
            const templateContent = await readFile(filePath, "utf-8");
            const template = Handlebars.compile(templateContent);
            const rendered = template(context);
            const outputFileName = file.replace(".hbs", "");
            const outputPath = path.join(dbDir, outputFileName);
            await writeFile(outputPath, rendered);
            logger.verbose(`Created ${database}/${outputFileName}`);
          } else {
            const outputPath = path.join(dbDir, file);
            await copy(filePath, outputPath);
          }
        }
      } else {
        logger.warn(`Docker templates not found for ${database}`);
        return {};
      }
    } else {
      const files = await readdir(templateDir);

      for (const file of files) {
        const filePath = path.join(templateDir, file);
        const stats = await stat(filePath);

        if (stats.isDirectory()) {
          const targetDir = path.join(dbDir, file);
          await copy(filePath, targetDir);
        } else if (file.endsWith(".hbs")) {
          const templateContent = await readFile(filePath, "utf-8");
          const template = Handlebars.compile(templateContent);
          const rendered = template(context);
          const outputFileName = file.replace(".hbs", "");
          const outputPath = path.join(dbDir, outputFileName);
          await writeFile(outputPath, rendered);
          consola.success(`Created ${database}/${outputFileName}`);
        } else {
          const outputPath = path.join(dbDir, file);
          await copy(filePath, outputPath);
        }
      }
    }

    const waitScriptTemplatePath = path.join(
      __dirname,
      "templates",
      "docker",
      "wait-for-db.sh.hbs"
    );
    const srcWaitScriptPath = path.join(
      __dirname,
      "..",
      "..",
      "src",
      "templates",
      "docker",
      "wait-for-db.sh.hbs"
    );

    const waitScriptPath = (await pathExists(waitScriptTemplatePath))
      ? waitScriptTemplatePath
      : srcWaitScriptPath;

    if (await pathExists(waitScriptPath)) {
      const waitScriptTemplate = await readFile(waitScriptPath, "utf-8");
      const waitScriptContent = Handlebars.compile(waitScriptTemplate)(context);
      const waitScriptOutputPath = path.join(dbDir, "wait-for-db.sh");
      await writeFile(waitScriptOutputPath, waitScriptContent);
      await fsExtra.chmod(waitScriptOutputPath, 0o755);
      logger.verbose(`Created ${database}/wait-for-db.sh script`);
    }

    const encodedPasswords = {
      POSTGRES_PASSWORD: encodeURIComponent(passwords.POSTGRES_PASSWORD),
      MYSQL_ROOT_PASSWORD: encodeURIComponent(passwords.MYSQL_ROOT_PASSWORD),
      MYSQL_PASSWORD: encodeURIComponent(passwords.MYSQL_PASSWORD),
      MONGO_ROOT_PASSWORD: encodeURIComponent(passwords.MONGO_ROOT_PASSWORD),
      MONGO_PASSWORD: encodeURIComponent(passwords.MONGO_PASSWORD),
      REDIS_PASSWORD: encodeURIComponent(passwords.REDIS_PASSWORD),
    };

    const envContent = `# Docker Environment Variables
# Generated by create-precast-app

PROJECT_NAME=${config.name}
DB_NAME=${context.name}

# Database Passwords (change these in production!)
${database === "postgres" ? `POSTGRES_PASSWORD=${passwords.POSTGRES_PASSWORD}` : ""}
${
  database === "mysql"
    ? `MYSQL_ROOT_PASSWORD=${passwords.MYSQL_ROOT_PASSWORD}
MYSQL_PASSWORD=${passwords.MYSQL_PASSWORD}`
    : ""
}
${
  database === "mongodb"
    ? `MONGO_ROOT_PASSWORD=${passwords.MONGO_ROOT_PASSWORD}
MONGO_PASSWORD=${passwords.MONGO_PASSWORD}`
    : ""
}
${database === "redis" ? `REDIS_PASSWORD=${passwords.REDIS_PASSWORD}` : ""}

# Database URLs (passwords are URL-encoded)
${database === "postgres" ? `DATABASE_URL=postgresql://postgres:${encodedPasswords.POSTGRES_PASSWORD}@localhost:5432/${context.name}` : ""}
${database === "mysql" ? `DATABASE_URL=mysql://root:${encodedPasswords.MYSQL_ROOT_PASSWORD}@localhost:3306/${context.name}` : ""}
${database === "mongodb" ? `MONGODB_URI=mongodb://root:${encodedPasswords.MONGO_ROOT_PASSWORD}@localhost:27017/${context.name}?authSource=admin` : ""}
${database === "redis" ? `REDIS_URL=redis://:${encodedPasswords.REDIS_PASSWORD}@localhost:6379` : ""}
`.trim();

    await writeFile(path.join(dbDir, ".env"), envContent);
    await writeFile(path.join(dbDir, ".env.example"), envContent);

    const isMonorepo = config.backend && config.backend !== "none" && config.backend !== "next-api";

    // Update root package.json
    const packageJsonPath = path.join(projectPath, "package.json");
    if (await pathExists(packageJsonPath)) {
      const packageJson = await readJson(packageJsonPath);

      const executeCommand = "npx create-precast-app@latest";

      packageJson.scripts = {
        ...packageJson.scripts,
        "docker:up": `${executeCommand} deploy`,
        "docker:down": `${executeCommand} deploy --stop`,
        "docker:logs": `docker compose -f docker/${database}/docker-compose.yml logs -f`,
        "docker:reset": `${executeCommand} deploy --destroy --approve && ${executeCommand} deploy`,
        "docker:ps": `${executeCommand} deploy --status`,
        "docker:destroy": `${executeCommand} deploy --destroy`,
      };

      await writeJson(packageJsonPath, packageJson, { spaces: 2 });
      logger.verbose("Added Docker scripts to root package.json");
    }

    if (isMonorepo) {
      const apiPackageJsonPath = path.join(projectPath, "apps/api/package.json");
      if (await pathExists(apiPackageJsonPath)) {
        const apiPackageJson = await readJson(apiPackageJsonPath);

        if (config.orm === "prisma") {
          apiPackageJson.scripts = {
            ...apiPackageJson.scripts,
            "db:migrate": "prisma migrate deploy",
            "db:push": "prisma db push",
            "db:studio": "prisma studio",
          };
        } else if (config.orm === "drizzle") {
          apiPackageJson.scripts = {
            ...apiPackageJson.scripts,
            "db:push": "drizzle-kit push",
            "db:studio": "drizzle-kit studio",
            "db:generate": "drizzle-kit generate",
          };
        } else if (config.orm === "typeorm") {
          apiPackageJson.scripts = {
            ...apiPackageJson.scripts,
            "db:migrate": "typeorm migration:run",
            "db:generate": "typeorm migration:generate",
            "db:revert": "typeorm migration:revert",
          };
        }

        await writeJson(apiPackageJsonPath, apiPackageJson, { spaces: 2 });
        logger.verbose("Added database scripts to API package.json");
      }
    }

    const readmeContent = `# Docker Development Environment

This directory contains Docker Compose configuration for local development.

## Quick Start

1. Start the services:
   \`\`\`bash
   npm run docker:up
   \`\`\`

2. View logs:
   \`\`\`bash
   npm run docker:logs
   \`\`\`

3. Stop services:
   \`\`\`bash
   npm run docker:down
   \`\`\`

4. Reset database (removes all data):
   \`\`\`bash
   npm run docker:reset
   \`\`\`

## Services

- **${database}**: Database server
${database === "postgres" ? "- **pgAdmin**: Database management UI at http://localhost:5050" : ""}
${database === "mysql" ? "- **phpMyAdmin**: Database management UI at http://localhost:8080" : ""}
${database === "mongodb" ? "- **Mongo Express**: Database management UI at http://localhost:8081" : ""}

## Configuration

Database credentials are stored in \`.env\` file. 
**Important**: Change these passwords before deploying to production!

## Connecting to the Database

Use the connection string from the \`.env\` file in your application.
`;

    await writeFile(path.join(dbDir, "README.md"), readmeContent);

    logger.verbose("");
    logger.verbose("📚 Docker setup complete! Next steps:");
    logger.verbose(`   1. Review docker/${database}/.env and update passwords if needed`);
    logger.verbose("   2. Start services: npm run docker:up");
    logger.verbose("   3. View logs: npm run docker:logs");
    logger.verbose("   4. Stop services: npm run docker:down");
    logger.verbose("");
    logger.verbose(`📖 See docker/${database}/README.md for detailed instructions`);

    return { passwords };
  } catch (error) {
    consola.error("❌ Failed to setup Docker configuration:", error);
    throw error;
  }
}

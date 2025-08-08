import * as crypto from "crypto";
import * as path from "path";
import { fileURLToPath } from "url";

import { consola } from "consola";
import {
  copy,
  ensureDir,
  pathExists,
  readdir,
  readFile,
  readJson,
  stat,
  writeFile,
  writeJson,
} from "fs-extra";
import Handlebars from "handlebars";

import type { ProjectConfig } from "../../../shared/stack-config.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Generates a cryptographically secure random password
 * @param length - Length of the password to generate (default: 20)
 * @returns A random password string containing alphanumeric and special characters
 */
function generatePassword(length: number = 20): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
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
): Promise<void> {
  const database = config.database;

  if (!database || database === "none" || database === "firebase" || database === "supabase") {
    consola.info("Skipping Docker setup - no local database needed");
    return;
  }

  if (database === "turso") {
    consola.info("ℹ️ Turso uses SQLite locally, Docker setup not needed");
    consola.info("   Run 'turso dev' to start a local libSQL server");
    return;
  }

  if (database === "cloudflare-d1") {
    consola.info("ℹ️ Cloudflare D1 uses Wrangler locally, Docker setup not needed");
    consola.info("   Run 'wrangler d1 execute' to interact with your local database");
    return;
  }

  consola.info(`🐳 Setting up Docker Compose for ${database}...`);

  try {
    const dockerDir = path.join(projectPath, "docker");
    await ensureDir(dockerDir);

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
            const targetDir = path.join(dockerDir, file);
            await copy(filePath, targetDir);
          } else if (file.endsWith(".hbs")) {
            const templateContent = await readFile(filePath, "utf-8");
            const template = Handlebars.compile(templateContent);
            const rendered = template(context);
            const outputFileName = file.replace(".hbs", "");
            const outputPath = path.join(dockerDir, outputFileName);
            await writeFile(outputPath, rendered);
            consola.success(`Created ${outputFileName}`);
          } else {
            const outputPath = path.join(dockerDir, file);
            await copy(filePath, outputPath);
          }
        }
      } else {
        consola.warn(`Docker templates not found for ${database}`);
        return;
      }
    } else {
      const files = await readdir(templateDir);

      for (const file of files) {
        const filePath = path.join(templateDir, file);
        const stats = await stat(filePath);

        if (stats.isDirectory()) {
          const targetDir = path.join(dockerDir, file);
          await copy(filePath, targetDir);
        } else if (file.endsWith(".hbs")) {
          const templateContent = await readFile(filePath, "utf-8");
          const template = Handlebars.compile(templateContent);
          const rendered = template(context);
          const outputFileName = file.replace(".hbs", "");
          const outputPath = path.join(dockerDir, outputFileName);
          await writeFile(outputPath, rendered);
          consola.success(`Created ${outputFileName}`);
        } else {
          const outputPath = path.join(dockerDir, file);
          await copy(filePath, outputPath);
        }
      }
    }

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

# Database URLs
${database === "postgres" ? `DATABASE_URL=postgresql://postgres:${passwords.POSTGRES_PASSWORD}@localhost:5432/${context.name}` : ""}
${database === "mysql" ? `DATABASE_URL=mysql://root:${passwords.MYSQL_ROOT_PASSWORD}@localhost:3306/${context.name}` : ""}
${database === "mongodb" ? `MONGODB_URI=mongodb://root:${passwords.MONGO_ROOT_PASSWORD}@localhost:27017/${context.name}?authSource=admin` : ""}
${database === "redis" ? `REDIS_URL=redis://:${passwords.REDIS_PASSWORD}@localhost:6379` : ""}
`.trim();

    await writeFile(path.join(dockerDir, ".env"), envContent);
    await writeFile(path.join(dockerDir, ".env.example"), envContent);

    const packageJsonPath = path.join(projectPath, "package.json");
    if (await pathExists(packageJsonPath)) {
      const packageJson = await readJson(packageJsonPath);

      packageJson.scripts = {
        ...packageJson.scripts,
        "docker:up": "docker compose -f docker/docker-compose.yml up -d",
        "docker:down": "docker compose -f docker/docker-compose.yml down",
        "docker:logs": "docker compose -f docker/docker-compose.yml logs -f",
        "docker:reset":
          "docker compose -f docker/docker-compose.yml down -v && docker compose -f docker/docker-compose.yml up -d",
        "docker:ps": "docker compose -f docker/docker-compose.yml ps",
      };

      await writeJson(packageJsonPath, packageJson, { spaces: 2 });
      consola.success("Added Docker scripts to package.json");
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

    await writeFile(path.join(dockerDir, "README.md"), readmeContent);

    consola.info("");
    consola.info("📚 Docker setup complete! Next steps:");
    consola.info("   1. Review docker/.env and update passwords if needed");
    consola.info("   2. Start services: npm run docker:up");
    consola.info("   3. View logs: npm run docker:logs");
    consola.info("   4. Stop services: npm run docker:down");
    consola.info("");
    consola.info("📖 See docker/README.md for detailed instructions");
  } catch (error) {
    consola.error("❌ Failed to setup Docker configuration:", error);
    throw error;
  }
}

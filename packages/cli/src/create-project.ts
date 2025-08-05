import path from "path";

import { execa } from "execa";
import { pathExists, ensureDir, writeFile, remove } from "fs-extra";

import { type ProjectConfig } from "../../shared/stack-config.js";

import { createTemplateEngine } from "./core/template-engine.js";
import { generateTemplate } from "./generators/index.js";
import { setupDeploymentConfig } from "./utils/deployment-setup.js";
import { logger } from "./utils/logger.js";
import { writePrecastConfig } from "./utils/precast-config.js";
import { getTemplateRoot } from "./utils/template-path.js";

export async function createProject(config: ProjectConfig) {
  const projectPath = path.resolve(process.cwd(), config.name);
  if (await pathExists(projectPath)) {
    throw new Error(`Directory ${config.name} already exists`);
  }
  await ensureDir(projectPath);
  try {
    // Update config with projectPath
    const configWithPath = { ...config, projectPath };

    await generateTemplate(configWithPath, projectPath);

    // Write Precast configuration file
    await writePrecastConfig(configWithPath);

    // Setup deployment configuration if specified
    if (config.deploymentMethod && config.deploymentMethod !== "none") {
      const templateRoot = getTemplateRoot();
      const templateEngine = createTemplateEngine(templateRoot);
      await setupDeploymentConfig(configWithPath, projectPath, templateEngine);
    }

    if (config.git) {
      logger.debug("Initializing git repository...");
      await execa("git", ["init"], { cwd: projectPath });
      const gitignoreContent = generateGitignore(config);
      await writeFile(path.join(projectPath, ".gitignore"), gitignoreContent);
      await execa("git", ["add", "."], { cwd: projectPath });
      await execa("git", ["commit", "-m", "Initial commit"], {
        cwd: projectPath,
      });
    }
    if (config.docker) {
      await generateDockerFiles(config, projectPath);
    }
  } catch (error) {
    await remove(projectPath);
    throw error;
  }
}
function generateGitignore(config: ProjectConfig): string {
  const lines = [
    "# Dependencies",
    "node_modules/",
    ".pnp",
    ".pnp.js",
    "",
    "# Testing",
    "coverage/",
    ".nyc_output/",
    "",
    "# Production",
    "dist/",
    "build/",
    ".next/",
    ".nuxt/",
    ".output/",
    ".vercel/",
    "",
    "# Misc",
    ".DS_Store",
    "*.log",
    ".env",
    ".env.local",
    ".env.*.local",
    "",
    "# Editor",
    ".vscode/",
    ".idea/",
    "*.swp",
    "*.swo",
    "",
    "# Debug",
    "npm-debug.log*",
    "yarn-debug.log*",
    "yarn-error.log*",
  ];
  if (config.framework === "next") {
    lines.push("", "# Next.js", ".next/", "out/");
  }
  if (config.framework === "nuxt") {
    lines.push("", "# Nuxt.js", ".nuxt/", ".nitro/", ".cache/");
  }
  if (config.orm === "prisma") {
    lines.push("", "# Prisma", "*.db", "*.db-journal");
  }
  return lines.join("\n");
}
async function generateDockerFiles(config: ProjectConfig, projectPath: string) {
  const dockerfile = generateDockerfile(config);
  await writeFile(path.join(projectPath, "Dockerfile"), dockerfile);
  const dockerCompose = generateDockerCompose(config);
  await writeFile(path.join(projectPath, "docker-compose.yml"), dockerCompose);
  const dockerignore = [
    "node_modules",
    "npm-debug.log",
    ".git",
    ".gitignore",
    "README.md",
    ".env",
    ".next",
    ".nuxt",
    "dist",
    "build",
  ].join("\n");
  await writeFile(path.join(projectPath, ".dockerignore"), dockerignore);
}
function generateDockerfile(config: ProjectConfig): string {
  const lines = [
    `FROM node:20-alpine AS base`,
    "",
    "# Install dependencies only when needed",
    "FROM base AS deps",
    "RUN apk add --no-cache libc6-compat",
    "WORKDIR /app",
    "",
    "# Install dependencies",
    "COPY package.json package-lock.json* ./",
    "RUN npm ci",
    "",
    "# Rebuild the source code only when needed",
    "FROM base AS builder",
    "WORKDIR /app",
    "COPY --from=deps /app/node_modules ./node_modules",
    "COPY . .",
    "",
  ];
  if (config.framework === "next") {
    lines.push("ENV NEXT_TELEMETRY_DISABLED 1", "RUN npm run build", "");
  } else {
    lines.push("RUN npm run build", "");
  }
  lines.push(
    "# Production image",
    "FROM base AS runner",
    "WORKDIR /app",
    "",
    "ENV NODE_ENV production",
    "",
    "RUN addgroup --system --gid 1001 nodejs",
    "RUN adduser --system --uid 1001 nodejs",
    ""
  );
  if (config.framework === "next") {
    lines.push(
      "COPY --from=builder /app/public ./public",
      "COPY --from=builder --chown=nodejs:nodejs /app/.next/standalone ./",
      "COPY --from=builder --chown=nodejs:nodejs /app/.next/static ./.next/static",
      "",
      "USER nodejs",
      "",
      "EXPOSE 3000",
      "",
      "ENV PORT 3000",
      "",
      'CMD ["node", "server.js"]'
    );
  } else {
    lines.push(
      "COPY --from=builder --chown=nodejs:nodejs /app/dist ./dist",
      "COPY --from=builder /app/node_modules ./node_modules",
      "COPY --from=builder /app/package.json ./package.json",
      "",
      "USER nodejs",
      "",
      "EXPOSE 3000",
      "",
      'CMD ["npm", "start"]'
    );
  }
  return lines.join("\n");
}
function generateDockerCompose(config: ProjectConfig): string {
  const services: any = {
    app: {
      build: ".",
      ports: ["3000:3000"],
      environment: {
        NODE_ENV: "production",
      },
    },
  };
  if (config.database === "postgres") {
    services.postgres = {
      image: "postgres:16-alpine",
      environment: {
        POSTGRES_USER: "postgres",
        POSTGRES_PASSWORD: "postgres",
        POSTGRES_DB: config.name.replace(/-/g, "_"),
      },
      volumes: ["postgres_data:/var/lib/postgresql/data"],
      ports: ["5432:5432"],
    };
    services.app.depends_on = ["postgres"];
    services.app.environment.DATABASE_URL = `postgresql://postgres:postgres@postgres:5432/${config.name.replace(/-/g, "_")}`;
  } else if (config.database === "mysql") {
    services.mysql = {
      image: "mysql:8",
      environment: {
        MYSQL_ROOT_PASSWORD: "root",
        MYSQL_DATABASE: config.name.replace(/-/g, "_"),
        MYSQL_USER: "user",
        MYSQL_PASSWORD: "password",
      },
      volumes: ["mysql_data:/var/lib/mysql"],
      ports: ["3306:3306"],
    };
    services.app.depends_on = ["mysql"];
    services.app.environment.DATABASE_URL = `mysql://user:password@mysql:3306/${config.name.replace(/-/g, "_")}`;
  } else if (config.database === "mongodb") {
    services.mongodb = {
      image: "mongo:7",
      environment: {
        MONGO_INITDB_ROOT_USERNAME: "root",
        MONGO_INITDB_ROOT_PASSWORD: "password",
        MONGO_INITDB_DATABASE: config.name.replace(/-/g, "_"),
      },
      volumes: ["mongodb_data:/data/db"],
      ports: ["27017:27017"],
    };
    services.app.depends_on = ["mongodb"];
    services.app.environment.DATABASE_URL = `mongodb://root:password@mongodb:27017/${config.name.replace(/-/g, "_")}`;
  }
  const compose = {
    version: "3.8",
    services,
    volumes: {} as Record<string, Record<string, never>>,
  };
  if (config.database === "postgres") {
    compose.volumes.postgres_data = {};
  } else if (config.database === "mysql") {
    compose.volumes.mysql_data = {};
  } else if (config.database === "mongodb") {
    compose.volumes.mongodb_data = {};
  }
  return `version: '3.8'\n\n${JSON.stringify(compose, null, 2).slice(23, -1)}`;
}

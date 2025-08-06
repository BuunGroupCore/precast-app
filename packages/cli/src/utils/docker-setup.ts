import * as crypto from "crypto";
import path from "path";

import { consola } from "consola";
import fsExtra from "fs-extra";

import type { ProjectConfig } from "../../../shared/stack-config.js";

import { getTemplateRoot } from "./template-path.js";

// eslint-disable-next-line import/no-named-as-default-member
const { readFile, writeFile, ensureDir, pathExists } = fsExtra;

interface DockerConfig {
  database: string;
  includeRedis?: boolean;
  includeAdminTools?: boolean;
  customNetwork?: string;
}

/**
 * Generate cryptographically secure random secrets
 */
function generateRandomSecret(length: number = 32): string {
  return crypto.randomBytes(length).toString("base64url").slice(0, length);
}

function generateRandomPassword(length: number = 16): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(crypto.randomInt(0, chars.length));
  }
  return result;
}

function generateJWTSecret(length: number = 64): string {
  return crypto.randomBytes(length).toString("hex");
}

/**
 * Setup Docker Compose files for local database development
 * @param config - Project configuration
 * @param projectPath - Path to the project
 * @param dockerConfig - Docker-specific configuration
 */
export async function setupDockerCompose(
  config: ProjectConfig,
  projectPath: string,
  dockerConfig?: Partial<DockerConfig>
): Promise<void> {
  const database = dockerConfig?.database || config.database;

  if (database === "none" || database === "firebase") {
    consola.info("Skipping Docker setup for cloud-based or no database");
    return;
  }

  consola.info(`🐳 Setting up Docker Compose for ${database}...`);

  const dockerDir = path.join(projectPath, "docker");
  await ensureDir(dockerDir);

  const templateRoot = getTemplateRoot();
  const dockerTemplateDir = path.join(templateRoot, "docker", database);

  if (!(await pathExists(dockerTemplateDir))) {
    consola.warn(`Docker templates not found for ${database}`);
    return;
  }

  // Special handling for Supabase
  if (database === "supabase") {
    await setupSupabaseDocker(dockerTemplateDir, dockerDir, config);
  } else {
    // Copy docker-compose.yml
    const composeTemplate = await readFile(
      path.join(dockerTemplateDir, "docker-compose.yml.hbs"),
      "utf-8"
    );
    const composeContent = processTemplate(composeTemplate, config);
    await writeFile(path.join(dockerDir, "docker-compose.yml"), composeContent);
    consola.success("Created docker-compose.yml");

    // Copy database-specific initialization files
    await copyDatabaseInitFiles(database, dockerTemplateDir, dockerDir, config);

    // Optionally add Redis
    if (dockerConfig?.includeRedis) {
      await addRedisService(dockerDir, config);
    }
  }

  // Create .env.docker file with database connection strings
  await createDockerEnvFile(projectPath, database, config);

  // Create docker scripts in package.json
  await addDockerScripts(projectPath, database);

  // Create README for Docker setup
  await createDockerReadme(dockerDir, database, config);

  consola.success(`✅ Docker Compose setup completed for ${database}!`);
  consola.info(`Run 'npm run docker:up' to start the database`);
}

/**
 * Process Handlebars template with random secret generation
 */
function processTemplate(template: string, config: ProjectConfig): string {
  // Generate random secrets for security-sensitive templates
  const secrets = {
    postgresPassword: generateRandomPassword(24),
    jwtSecret: generateJWTSecret(64),
    dashboardPassword: generateRandomPassword(20),
    secretKeyBase: generateRandomSecret(64),
    vaultEncKey: generateRandomSecret(32),
    logflarePublicToken: generateRandomSecret(32),
    logflarePrivateToken: generateRandomSecret(32),
  };

  return (
    template
      .replace(/\{\{name\}\}/g, config.name)
      .replace(/\{\{config\.name\}\}/g, config.name)
      .replace(/\{\{projectName\}\}/g, config.name)
      // Replace random secrets
      .replace(/\{\{name\}\}-super-secret-postgres-password/g, secrets.postgresPassword)
      .replace(
        /\{\{name\}\}-super-secret-jwt-token-with-at-least-32-characters/g,
        secrets.jwtSecret
      )
      .replace(/\{\{name\}\}-admin-password-change-this/g, secrets.dashboardPassword)
      .replace(
        /\{\{name\}\}-UpNVntn3cDxHJpq99YMc1T1AQgQpc8kfYTuRgBiYa15BLrx8etQoXz3gZv1/g,
        secrets.secretKeyBase
      )
      .replace(/\{\{name\}\}-encryption-key-32-chars-minimum/g, secrets.vaultEncKey)
      .replace(/\{\{name\}\}-logflare-key-public-32-chars-min/g, secrets.logflarePublicToken)
      .replace(/\{\{name\}\}-logflare-key-private-32-chars-min/g, secrets.logflarePrivateToken)
  );
}

/**
 * Copy database-specific initialization files
 */
async function copyDatabaseInitFiles(
  database: string,
  templateDir: string,
  dockerDir: string,
  config: ProjectConfig
): Promise<void> {
  const initFiles: Record<string, string[]> = {
    postgres: ["init.sql.hbs"],
    mysql: ["init.sql.hbs", "my.cnf.hbs"],
    mongodb: ["init-mongo.js.hbs"],
    redis: ["redis.conf.hbs"],
  };

  const files = initFiles[database] || [];

  for (const file of files) {
    const templatePath = path.join(templateDir, file);
    if (await pathExists(templatePath)) {
      const template = await readFile(templatePath, "utf-8");
      const content = processTemplate(template, config);
      const outputFile = file.replace(".hbs", "");
      await writeFile(path.join(dockerDir, outputFile), content);
      consola.success(`Created ${outputFile}`);
    }
  }
}

/**
 * Add Redis service to existing docker-compose.yml
 */
async function addRedisService(dockerDir: string, config: ProjectConfig): Promise<void> {
  const templateRoot = getTemplateRoot();
  const redisTemplate = await readFile(
    path.join(templateRoot, "docker", "redis", "docker-compose.yml.hbs"),
    "utf-8"
  );

  const redisConfig = processTemplate(redisTemplate, config);

  // Extract just the Redis service configuration
  const redisService = redisConfig.split("services:")[1].split("volumes:")[0].trim();

  const composePath = path.join(dockerDir, "docker-compose.yml");
  let composeContent = await readFile(composePath, "utf-8");

  // Add Redis service to existing compose file
  composeContent = composeContent.replace(/services:/, `services:\n  ${redisService}\n`);

  await writeFile(composePath, composeContent);
  consola.success("Added Redis service to docker-compose.yml");
}

/**
 * Create .env.docker file with database connection strings
 */
async function createDockerEnvFile(
  projectPath: string,
  database: string,
  config: ProjectConfig
): Promise<void> {
  const envContent: string[] = [
    "# Docker Database Configuration",
    "# Copy these to your .env file when using Docker",
    "",
  ];

  // Generate random passwords for security
  const randomPassword = generateRandomPassword(20);
  const mysqlUser = `${config.name}_user`;

  switch (database) {
    case "postgres":
      envContent.push(
        `DATABASE_URL=postgresql://postgres:${randomPassword}@localhost:5432/${config.name}`,
        `POSTGRES_USER=postgres`,
        `POSTGRES_PASSWORD=${randomPassword}`,
        `POSTGRES_DB=${config.name}`
      );
      break;
    case "mysql":
      envContent.push(
        `DATABASE_URL=mysql://${mysqlUser}:${randomPassword}@localhost:3306/${config.name}`,
        `MYSQL_HOST=localhost`,
        `MYSQL_PORT=3306`,
        `MYSQL_USER=${mysqlUser}`,
        `MYSQL_PASSWORD=${randomPassword}`,
        `MYSQL_DATABASE=${config.name}`
      );
      break;
    case "mongodb": {
      const mongoUser = `${config.name}_user`;
      envContent.push(
        `DATABASE_URL=mongodb://${mongoUser}:${randomPassword}@localhost:27017/${config.name}`,
        `MONGODB_URI=mongodb://${mongoUser}:${randomPassword}@localhost:27017/${config.name}`,
        `MONGO_HOST=localhost`,
        `MONGO_PORT=27017`,
        `MONGO_USER=${mongoUser}`,
        `MONGO_PASSWORD=${randomPassword}`,
        `MONGO_DATABASE=${config.name}`
      );
      break;
    }
    case "supabase":
      envContent.push(
        `# Supabase Local Development URLs`,
        `SUPABASE_URL=http://localhost:8000`,
        `SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyAgCiAgICAicm9sZSI6ICJhbm9uIiwKICAgICJpc3MiOiAic3VwYWJhc2UtZGVtbyIsCiAgICAiaWF0IjogMTY0MTc2OTIwMCwKICAgICJleHAiOiAxNzk5NTM1NjAwCn0.dc_X5iR_VP_qT0zsiyj_I_OZ2T9FtRU2BBNWN8Bu4GE`,
        `SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyAgCiAgICAicm9sZSI6ICJzZXJ2aWNlX3JvbGUiLAogICAgImlzcyI6ICJzdXBhYmFzZS1kZW1vIiwKICAgICJpYXQiOiAxNjQxNzY5MjAwLAogICAgImV4cCI6IDE3OTk1MzU2MDAKfQ.DaYlNEoUrrEn2Ig7tqibS-PHK5vgusbcbo7X36XVt4Q`,
        ``,
        `# Direct Database Access`,
        `DATABASE_URL=postgresql://postgres:${randomPassword}@localhost:5432/postgres`,
        `POSTGRES_PASSWORD=${randomPassword}`
      );
      break;
  }

  // Add Redis connection if included
  envContent.push(
    "",
    "# Redis Configuration (if using)",
    "REDIS_URL=redis://localhost:6379",
    "REDIS_HOST=localhost",
    "REDIS_PORT=6379"
  );

  await writeFile(path.join(projectPath, ".env.docker"), envContent.join("\n") + "\n");
  consola.success("Created .env.docker with connection strings");
}

/**
 * Add Docker scripts to package.json
 */
async function addDockerScripts(projectPath: string, database: string): Promise<void> {
  const packageJsonPath = path.join(projectPath, "package.json");

  if (!(await pathExists(packageJsonPath))) {
    return;
  }

  const packageJson = JSON.parse(await readFile(packageJsonPath, "utf-8"));

  packageJson.scripts = packageJson.scripts || {};

  // Add Docker scripts
  packageJson.scripts["docker:up"] = "docker-compose -f docker/docker-compose.yml up -d";
  packageJson.scripts["docker:down"] = "docker-compose -f docker/docker-compose.yml down";
  packageJson.scripts["docker:logs"] = "docker-compose -f docker/docker-compose.yml logs -f";
  packageJson.scripts["docker:clean"] = "docker-compose -f docker/docker-compose.yml down -v";

  // Add database-specific scripts
  switch (database) {
    case "postgres":
      packageJson.scripts["docker:psql"] =
        "docker exec -it $(docker ps -qf name=postgres) psql -U postgres";
      break;
    case "mysql":
      packageJson.scripts["docker:mysql"] =
        "docker exec -it $(docker ps -qf name=mysql) mysql -u root -prootpassword";
      break;
    case "mongodb":
      packageJson.scripts["docker:mongo"] =
        "docker exec -it $(docker ps -qf name=mongodb) mongosh -u admin -p password";
      break;
    case "supabase":
      // Special Supabase scripts with environment setup
      packageJson.scripts["docker:up"] = "cd docker && docker-compose --env-file .env up -d";
      packageJson.scripts["docker:down"] = "cd docker && docker-compose --env-file .env down";
      packageJson.scripts["docker:logs"] = "cd docker && docker-compose --env-file .env logs -f";
      packageJson.scripts["docker:clean"] =
        "cd docker && docker-compose --env-file .env down -v --remove-orphans";
      packageJson.scripts["docker:studio"] = "echo 'Supabase Studio: http://localhost:3000'";
      packageJson.scripts["docker:psql"] =
        "docker exec -it $(docker ps -qf name=db) psql -U postgres";
      packageJson.scripts["docker:reset"] = "cd docker && ./reset.sh";
      break;
  }

  await writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2));
  consola.success("Added Docker scripts to package.json");
}

/**
 * Create README for Docker setup
 */
async function createDockerReadme(
  dockerDir: string,
  database: string,
  config: ProjectConfig
): Promise<void> {
  const readme = `# Docker Setup for ${config.name}

## Quick Start

1. Start the database:
   \`\`\`bash
   npm run docker:up
   \`\`\`

2. View logs:
   \`\`\`bash
   npm run docker:logs
   \`\`\`

3. Stop the database:
   \`\`\`bash
   npm run docker:down
   \`\`\`

4. Clean up (removes data):
   \`\`\`bash
   npm run docker:clean
   \`\`\`

## Database Access

### ${database.charAt(0).toUpperCase() + database.slice(1)}

${getDatabaseAccessInfo(database, config)}

## Environment Variables

Copy the values from \`.env.docker\` to your \`.env\` file:

\`\`\`bash
cp .env.docker .env
\`\`\`

## Admin Tools

${getAdminToolsInfo(database)}

## Troubleshooting

- Ensure Docker and Docker Compose are installed
- Check if ports are already in use: \`lsof -i :5432\` (PostgreSQL), \`lsof -i :3306\` (MySQL), \`lsof -i :27017\` (MongoDB)
- View container status: \`docker ps\`
- Check logs: \`npm run docker:logs\`
`;

  await writeFile(path.join(dockerDir, "README.md"), readme);
  consola.success("Created Docker README.md");
}

function getDatabaseAccessInfo(database: string, config: ProjectConfig): string {
  switch (database) {
    case "postgres":
      return `- Host: localhost
- Port: 5432
- Database: ${config.name}
- Username: postgres
- Password: postgres
- Connection: \`npm run docker:psql\``;
    case "mysql":
      return `- Host: localhost
- Port: 3306
- Database: ${config.name}
- Username: ${config.name}_user
- Password: password
- Root Password: rootpassword
- Connection: \`npm run docker:mysql\``;
    case "mongodb":
      return `- Host: localhost
- Port: 27017
- Database: ${config.name}
- Admin Username: admin
- Admin Password: password
- App Username: ${config.name}_user
- App Password: password
- Connection: \`npm run docker:mongo\``;
    case "supabase":
      return `- Supabase Studio: http://localhost:3000
- API Gateway: http://localhost:8000
- Direct DB Host: localhost
- Direct DB Port: 5432
- Database: postgres
- Username: postgres
- Password: ${config.name}-super-secret-postgres-password
- Connection: \`npm run docker:psql\`
- Open Studio: \`npm run docker:studio\``;
    default:
      return "";
  }
}

function getAdminToolsInfo(database: string): string {
  switch (database) {
    case "postgres":
      return "pgAdmin is available at http://localhost:5050\n- Email: admin@[project].local\n- Password: admin";
    case "mysql":
      return "phpMyAdmin is available at http://localhost:8080\n- Username: root\n- Password: rootpassword";
    case "mongodb":
      return "Mongo Express is available at http://localhost:8081\n- Username: admin\n- Password: admin";
    case "supabase":
      return `Supabase Studio is available at http://localhost:3000
- Kong API Gateway: http://localhost:8000
- Database direct connection: localhost:5432
- Analytics: http://localhost:4000`;
    default:
      return "No admin tools configured";
  }
}

/**
 * Special setup for Supabase Docker environment
 */
async function setupSupabaseDocker(
  templateDir: string,
  dockerDir: string,
  config: ProjectConfig
): Promise<void> {
  // Copy docker-compose.yml
  const composeTemplate = await readFile(path.join(templateDir, "docker-compose.yml.hbs"), "utf-8");
  const composeContent = processTemplate(composeTemplate, config);
  await writeFile(path.join(dockerDir, "docker-compose.yml"), composeContent);
  consola.success("Created docker-compose.yml");

  // Copy environment template
  const envTemplate = await readFile(path.join(templateDir, ".env.hbs"), "utf-8");
  const envContent = processTemplate(envTemplate, config);
  await writeFile(path.join(dockerDir, ".env"), envContent);
  consola.success("Created .env");

  // Create volumes directory structure
  const volumesDir = path.join(dockerDir, "volumes");
  await ensureDir(volumesDir);

  // Copy all volume files and directories
  const volumeSubdirs = ["api", "db", "functions", "logs", "pooler", "storage"];
  for (const subdir of volumeSubdirs) {
    const srcDir = path.join(templateDir, "volumes", subdir);
    const destDir = path.join(volumesDir, subdir);

    if (await pathExists(srcDir)) {
      await ensureDir(destDir);
      await copyDirectory(srcDir, destDir, config);
      consola.success(`Created volumes/${subdir}`);
    }
  }
}

/**
 * Recursively copy directory with template processing
 */
async function copyDirectory(
  srcDir: string,
  destDir: string,
  config: ProjectConfig
): Promise<void> {
  // eslint-disable-next-line import/no-named-as-default-member
  const { readdir, stat, copy } = fsExtra;

  const items = await readdir(srcDir);

  for (const item of items) {
    const srcPath = path.join(srcDir, item);
    const destPath = path.join(destDir, item.replace(".hbs", ""));
    const itemStat = await stat(srcPath);

    if (itemStat.isDirectory()) {
      await ensureDir(destPath);
      await copyDirectory(srcPath, destPath, config);
    } else if (item.endsWith(".hbs")) {
      // Process as template
      const template = await readFile(srcPath, "utf-8");
      const content = processTemplate(template, config);
      await writeFile(destPath, content);
    } else {
      // Copy as-is
      await copy(srcPath, destPath);
    }
  }
}

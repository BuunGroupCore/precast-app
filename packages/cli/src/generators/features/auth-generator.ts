import * as crypto from "crypto";
import * as path from "path";

import type { ProjectConfig } from "@shared/stack-config.js";
import fsExtra from "fs-extra";

import { createTemplateEngine } from "@/core/template-engine.js";
import type { DetectedProject } from "@/utils/features/feature-registry.js";
import { LayoutIntegrator } from "@/utils/features/layout-integrator.js";
import { errorCollector } from "@/utils/system/error-collector.js";
import { installDependencies } from "@/utils/system/package-manager.js";
import { getTemplateRoot } from "@/utils/system/template-path.js";
import { logger } from "@/utils/ui/logger.js";

const { writeFile, pathExists, readFile, readdir, ensureDir, readJson, writeJson, rename } =
  fsExtra;

interface AuthProvider {
  id: string;
  name: string;
  packages: Record<string, string[]>;
  devPackages?: Record<string, string[]>;
  envVariables: string[];
  requiresDatabase: boolean;
  supportedFrameworks: string[];
  sessionStrategy?: "jwt" | "database" | "both";
}

const authProviders: Record<string, AuthProvider> = {
  "auth.js": {
    id: "auth.js",
    name: "Auth.js (NextAuth.js v5)",
    packages: {
      next: ["next-auth@beta", "@auth/prisma-adapter"],
      react: ["@auth/core", "@auth/prisma-adapter"],
      remix: ["@auth/core", "@auth/remix", "@auth/prisma-adapter"],
      solid: ["@auth/core", "@auth/solid-start", "@auth/prisma-adapter"],
      svelte: ["@auth/core", "@auth/sveltekit", "@auth/prisma-adapter"],
      // Backend packages for PostgreSQL support
      express: ["@auth/core", "@auth/pg-adapter", "pg", "bcryptjs"],
      hono: ["@auth/core", "@auth/pg-adapter", "pg", "bcryptjs"],
      fastify: ["@auth/core", "@auth/pg-adapter", "pg", "bcryptjs"],
    },
    devPackages: {
      all: ["@types/node"],
      express: ["@types/pg", "@types/bcryptjs"],
      hono: ["@types/pg", "@types/bcryptjs"],
      fastify: ["@types/pg", "@types/bcryptjs"],
    },
    envVariables: [
      "AUTH_SECRET",
      "AUTH_URL",
      "AUTH_TRUST_HOST",
      "DATABASE_URL",
      "GITHUB_ID",
      "GITHUB_SECRET",
      "GOOGLE_CLIENT_ID",
      "GOOGLE_CLIENT_SECRET",
    ],
    requiresDatabase: true,
    supportedFrameworks: [
      "next",
      "react",
      "remix",
      "solid",
      "svelte",
      "express",
      "hono",
      "fastify",
      "tanstack-router",
      "tanstack-start",
      "react-router",
      "vite",
    ],
    sessionStrategy: "both",
  },
  "better-auth": {
    id: "better-auth",
    name: "Better Auth",
    packages: {
      all: ["better-auth"],
    },
    envVariables: [
      "BETTER_AUTH_SECRET",
      "BETTER_AUTH_URL",
      "DATABASE_URL",
      "GITHUB_CLIENT_ID",
      "GITHUB_CLIENT_SECRET",
      "GOOGLE_CLIENT_ID",
      "GOOGLE_CLIENT_SECRET",
    ],
    requiresDatabase: true,
    supportedFrameworks: ["next", "react", "vue", "nuxt", "remix", "solid", "svelte", "astro"],
    sessionStrategy: "both",
  },
  clerk: {
    id: "clerk",
    name: "Clerk",
    packages: {
      next: ["@clerk/nextjs"],
      react: ["@clerk/clerk-react"],
      remix: ["@clerk/remix"],
      express: ["@clerk/express"],
    },
    envVariables: [
      "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY",
      "CLERK_SECRET_KEY",
      "NEXT_PUBLIC_CLERK_SIGN_IN_URL",
      "NEXT_PUBLIC_CLERK_SIGN_UP_URL",
      "NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL",
      "NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL",
    ],
    requiresDatabase: false,
    supportedFrameworks: ["next", "react", "remix"],
    sessionStrategy: "jwt",
  },
  auth0: {
    id: "auth0",
    name: "Auth0",
    packages: {
      next: ["@auth0/nextjs-auth0"],
      react: ["@auth0/auth0-react"],
      vue: ["@auth0/auth0-vue"],
      angular: ["@auth0/auth0-angular"],
      express: ["express-openid-connect"],
    },
    envVariables: [
      "AUTH0_SECRET",
      "AUTH0_BASE_URL",
      "AUTH0_ISSUER_BASE_URL",
      "AUTH0_CLIENT_ID",
      "AUTH0_CLIENT_SECRET",
      "AUTH0_AUDIENCE",
      "AUTH0_SCOPE",
    ],
    requiresDatabase: false,
    supportedFrameworks: ["next", "react", "vue", "angular", "express"],
    sessionStrategy: "jwt",
  },
  "passport.js": {
    id: "passport.js",
    name: "Passport.js",
    packages: {
      express: [
        "passport",
        "passport-local",
        "passport-jwt",
        "express-session",
        "connect-mongo",
        "bcryptjs",
        "jsonwebtoken",
      ],
      node: [
        "passport",
        "passport-local",
        "passport-jwt",
        "express-session",
        "bcryptjs",
        "jsonwebtoken",
      ],
      fastify: ["@fastify/passport", "@fastify/secure-session", "passport-local", "passport-jwt"],
    },
    devPackages: {
      all: ["@types/passport", "@types/passport-local", "@types/passport-jwt", "@types/bcryptjs"],
    },
    envVariables: [
      "JWT_SECRET",
      "JWT_EXPIRES_IN",
      "SESSION_SECRET",
      "DATABASE_URL",
      "GOOGLE_CLIENT_ID",
      "GOOGLE_CLIENT_SECRET",
      "GITHUB_CLIENT_ID",
      "GITHUB_CLIENT_SECRET",
    ],
    requiresDatabase: true,
    supportedFrameworks: ["express", "node", "fastify"],
    sessionStrategy: "jwt",
  },
  "supabase-auth": {
    id: "supabase-auth",
    name: "Supabase Auth",
    packages: {
      all: [
        "@supabase/supabase-js",
        "@supabase/auth-helpers-react",
        "@supabase/auth-helpers-nextjs",
      ],
    },
    envVariables: [
      "NEXT_PUBLIC_SUPABASE_URL",
      "NEXT_PUBLIC_SUPABASE_ANON_KEY",
      "SUPABASE_SERVICE_KEY",
    ],
    requiresDatabase: false,
    supportedFrameworks: ["next", "react", "vue", "nuxt", "remix", "solid", "svelte"],
    sessionStrategy: "jwt",
  },
  "firebase-auth": {
    id: "firebase-auth",
    name: "Firebase Auth",
    packages: {
      all: ["firebase", "firebase-admin"],
    },
    envVariables: [
      "FIREBASE_API_KEY",
      "FIREBASE_AUTH_DOMAIN",
      "FIREBASE_PROJECT_ID",
      "FIREBASE_STORAGE_BUCKET",
      "FIREBASE_MESSAGING_SENDER_ID",
      "FIREBASE_APP_ID",
    ],
    requiresDatabase: false,
    supportedFrameworks: ["next", "react", "vue", "angular", "nuxt", "remix"],
    sessionStrategy: "jwt",
  },
};

/**
 * Integrate AuthProvider into existing layout files
 */
async function integrateAuthProvider(config: ProjectConfig): Promise<void> {
  try {
    const templateRoot = await getTemplateRoot();
    const layoutIntegrator = new LayoutIntegrator(templateRoot);

    const isMonorepo = !!(
      config.backend &&
      config.backend !== "none" &&
      config.backend !== "next-api"
    );

    // Create a DetectedProject object from ProjectConfig
    // For monorepo, we need to point to the web app directory
    const detectedProject: DetectedProject = {
      projectPath: isMonorepo ? path.join(config.projectPath, "apps/web") : config.projectPath,
      framework: config.framework,
      backend: config.backend,
      authProvider: config.authProvider,
      styling: [config.styling || "css"],
      packageManager: config.packageManager || "npm",
      typescript: config.typescript || false,
      monorepo: isMonorepo,
    };

    // Check if AuthProvider is already integrated
    const isIntegrated = await layoutIntegrator.isAuthProviderIntegrated(detectedProject);

    if (isIntegrated) {
      logger.verbose("✓ AuthProvider already integrated in layout");
      return;
    }

    // Validate layout integration requirements
    const validation = await layoutIntegrator.validateLayoutIntegration(detectedProject);

    if (!validation.valid) {
      logger.warn(`⚠️  Layout integration validation failed: ${validation.errors.join(", ")}`);
      logger.info("You may need to manually add AuthProvider to your layout");
      return;
    }

    // Apply the layout integration
    await layoutIntegrator.integrateAuthProvider(detectedProject);
    logger.success("✓ AuthProvider integrated into layout");
  } catch (error) {
    logger.warn(`⚠️  Failed to integrate AuthProvider into layout: ${error}`);
    logger.info("You may need to manually wrap your app with AuthProvider");
  }
}

/**
 * Generate authentication setup for the project using templates
 */
export async function generateAuthTemplate(
  config: ProjectConfig & { authProvider?: string }
): Promise<void> {
  if (!config.authProvider || config.authProvider === "none") {
    return;
  }

  const provider = authProviders[config.authProvider];
  if (!provider) {
    throw new Error(`Unknown auth provider: ${config.authProvider}`);
  }

  if (!provider.supportedFrameworks.includes(config.framework)) {
    throw new Error(
      `${provider.name} is not supported for ${config.framework}. Supported frameworks: ${provider.supportedFrameworks.join(", ")}`
    );
  }

  logger.verbose(`🔐 Setting up ${provider.name} authentication...`);

  if (provider.requiresDatabase && config.database === "none") {
    logger.warn(`⚠️  ${provider.name} requires a database. Please configure a database first.`);
    return;
  }

  if (config.securePasswords !== false) {
    logger.verbose("🔑 Generating cryptographically secure JWT secrets...");
  } else {
    logger.warn("⚠️  Using default secrets. Remember to change them in production!");
  }

  await installAuthPackages(config, provider);
  await copyAuthTemplates(config, provider);
  await updateEnvFile(config, provider);

  if (config.orm === "prisma" && provider.requiresDatabase) {
    await updatePrismaSchema(config, provider);
  }

  // Copy common auth feature templates (AuthProvider, components, etc.)
  await copyCommonAuthFeatures(config, provider);

  // Integrate AuthProvider into existing layouts
  await integrateAuthProvider(config);

  logger.verbose(`✅ ${provider.name} authentication setup complete!`);
  showNextSteps(config, provider);
}

async function installAuthPackages(config: ProjectConfig, provider: AuthProvider): Promise<void> {
  const packages: string[] = [];
  const devPackages: string[] = [];

  const isMonorepo = !!(
    config.backend &&
    config.backend !== "none" &&
    config.backend !== "next-api"
  );
  const packageFramework =
    provider.id === "auth.js" && isMonorepo ? config.backend : config.framework;

  const frameworkPackages = provider.packages[packageFramework] || provider.packages.all || [];
  packages.push(...frameworkPackages);

  const frameworkDevPackages =
    provider.devPackages?.[packageFramework] || provider.devPackages?.all || [];
  devPackages.push(...frameworkDevPackages);

  // Add ORM-specific adapters for auth.js
  if (provider.id === "auth.js" && config.orm === "drizzle") {
    packages.push("@auth/drizzle-adapter");
  }

  // Add database drivers for Better Auth when no ORM is used
  if (provider.id === "better-auth" && config.orm === "none" && config.database !== "none") {
    if (config.database === "postgres") {
      packages.push("pg");
      if (config.typescript) {
        devPackages.push("@types/pg");
      }
    } else if (config.database === "mysql") {
      packages.push("mysql2");
    } else if (config.database === "sqlite") {
      packages.push("better-sqlite3");
      if (config.typescript) {
        devPackages.push("@types/better-sqlite3");
      }
    }
  }

  // Add ORM adapters for Better Auth
  if (provider.id === "better-auth" && config.orm === "prisma") {
    packages.push("@prisma/client");
  } else if (provider.id === "better-auth" && config.orm === "drizzle") {
    // Drizzle should already be installed with the ORM setup
  } else if (provider.id === "better-auth" && config.orm === "typeorm") {
    packages.push("@hedystia/better-auth-typeorm");
  }

  if (config.typescript) {
    if (provider.id === "auth.js" && config.framework === "next") {
      devPackages.push("@types/next-auth");
    }
  }

  if (packages.length > 0 || devPackages.length > 0) {
    logger.verbose(`📦 Installing ${provider.name} packages...`);

    const isMonorepo = !!(
      config.backend &&
      config.backend !== "none" &&
      config.backend !== "next-api"
    );
    const isBackendFramework = ["express", "hono", "fastify", "node"].includes(config.framework);

    let installPath: string;
    if (
      (provider.id === "better-auth" || provider.id === "auth.js") &&
      (isMonorepo || isBackendFramework)
    ) {
      installPath = path.join(config.projectPath, "apps/api");
    } else {
      installPath = isMonorepo ? path.join(config.projectPath, "apps/web") : config.projectPath;
    }

    if (packages.length > 0) {
      await installDependencies(packages, {
        packageManager: config.packageManager,
        projectPath: installPath,
        dev: false,
        context: "auth",
      });
    }

    if (devPackages.length > 0) {
      await installDependencies(devPackages, {
        packageManager: config.packageManager,
        projectPath: installPath,
        dev: true,
        context: "auth_dev",
      });
    }
  }
}

async function copyCommonAuthFeatures(
  config: ProjectConfig,
  provider: AuthProvider
): Promise<void> {
  const templateRoot = await getTemplateRoot();
  const templateEngine = createTemplateEngine(templateRoot);
  const commonAuthPath = path.join(templateRoot, "common/features/auth");

  if (!(await pathExists(commonAuthPath))) {
    return;
  }

  const isMonorepo = !!(
    config.backend &&
    config.backend !== "none" &&
    config.backend !== "next-api"
  );
  const targetPath = isMonorepo
    ? path.join(config.projectPath, "apps/web/src/components/auth")
    : path.join(config.projectPath, "src/components/auth");

  const authContext = {
    ...config,
    authProvider: provider.id,
    backendPort: 3001,
  };

  try {
    // Copy providers (AuthProvider)
    const providersPath = path.join(commonAuthPath, "providers");
    if (await pathExists(providersPath)) {
      await templateEngine.copyTemplateDirectory(
        "common/features/auth/providers",
        targetPath,
        authContext,
        { overwrite: true }
      );
    }

    // Copy components (LoginForm, SignupForm, etc.)
    const componentsPath = path.join(commonAuthPath, "components");
    if (await pathExists(componentsPath)) {
      await templateEngine.copyTemplateDirectory(
        "common/features/auth/components",
        path.join(targetPath, "components"),
        authContext,
        { overwrite: true }
      );
    }

    // Copy hooks (useAuth, etc.)
    const hooksPath = path.join(commonAuthPath, "hooks");
    if (await pathExists(hooksPath)) {
      await templateEngine.copyTemplateDirectory(
        "common/features/auth/hooks",
        path.join(targetPath, "hooks"),
        authContext,
        { overwrite: true }
      );
    }

    // Copy pages (Dashboard, etc.) if they exist
    const pagesPath = path.join(commonAuthPath, "pages");
    if (await pathExists(pagesPath)) {
      // For monorepo, dashboard goes to apps/web/src/app/dashboard
      const dashboardTarget = isMonorepo
        ? path.join(config.projectPath, "apps/web/src/app/dashboard")
        : path.join(config.projectPath, "src/app/dashboard");

      await templateEngine.copyTemplateDirectory(
        "common/features/auth/pages",
        dashboardTarget,
        authContext,
        { overwrite: true }
      );

      // For Next.js, rename Dashboard.tsx to page.tsx for App Router
      if (config.framework === "next") {
        const dashboardFile = path.join(dashboardTarget, "Dashboard.tsx");
        const pageFile = path.join(dashboardTarget, "page.tsx");
        if (await pathExists(dashboardFile)) {
          await rename(dashboardFile, pageFile);
          logger.verbose("✓ Renamed Dashboard.tsx to page.tsx for Next.js App Router");
        }
      }
    }

    logger.verbose("✓ Copied common auth feature templates");
  } catch (error) {
    logger.warn(`Failed to copy common auth features: ${error}`);
  }
}

async function copyAuthTemplates(
  config: ProjectConfig & { authProvider?: string },
  provider: AuthProvider
): Promise<void> {
  const templateRoot = getTemplateRoot();
  const templateEngine = createTemplateEngine(templateRoot);

  // Map provider.id to actual template directory name
  const templateDirName = provider.id === "auth.js" ? "authjs" : provider.id;
  const authTemplateDir = `auth/${templateDirName}`;

  // For auth.js with Next.js + separate backend, we need special handling
  const isMonorepoWithSeparateBackend =
    config.backend && config.backend !== "none" && config.backend !== "next-api";
  const isNextWithSeparateBackend = config.framework === "next" && isMonorepoWithSeparateBackend;

  const genericAuthDir = authTemplateDir;
  // Don't use Next.js specific templates if we have a separate backend
  const frameworkAuthDir =
    provider.id === "auth.js" && isNextWithSeparateBackend
      ? genericAuthDir
      : `${authTemplateDir}/${config.framework}`;

  const templatesExist = await templateEngine
    .getAvailableTemplates(authTemplateDir)
    .then((dirs: string[]) => dirs.includes(config.framework))
    .catch(() => false);

  const sourceDir =
    templatesExist && !isNextWithSeparateBackend ? frameworkAuthDir : genericAuthDir;

  const authDestination = getAuthDestination(config);

  try {
    const useSecureSecrets = config.securePasswords !== false;

    const authContext = {
      ...config,
      authProvider: provider.id,
      authSecret: useSecureSecrets
        ? generateJWTSecret()
        : "your-super-secret-jwt-key-change-this-in-production",
      sessionSecret: useSecureSecrets ? generateSessionSecret() : "your-session-secret-change-this",
      apiKey: useSecureSecrets ? generateAPIKey() : "your-api-key-change-this",
      databaseUrl: generateDatabaseUrl(config),
      requiresDatabase: provider.requiresDatabase,
      orm: config.orm || "none",
      database: config.database || "none",
    };

    // For Next.js with separate backend, skip framework-specific templates
    // We'll handle the auth setup via the backend route instead
    if (templatesExist && !isNextWithSeparateBackend) {
      await templateEngine.copyTemplateDirectory(
        sourceDir,
        path.join(config.projectPath, authDestination),
        authContext
      );
    }

    // Special handling for Next.js middleware in monorepo
    if (provider.id === "auth.js" && config.framework === "next" && isMonorepoWithSeparateBackend) {
      // Copy middleware.ts to the web app root
      const middlewareTemplatePath = path.join(
        templateRoot,
        `${authTemplateDir}/next/middleware.ts.hbs`
      );
      if (await pathExists(middlewareTemplatePath)) {
        const middlewareDestPath = path.join(config.projectPath, "apps/web/src/middleware.ts");
        // Only process if file doesn't exist or overwrite option is set
        if (!(await pathExists(middlewareDestPath))) {
          await templateEngine.processTemplate(
            `${authTemplateDir}/next/middleware.ts.hbs`,
            middlewareDestPath,
            authContext
          );
          logger.verbose("✓ Created Next.js middleware for auth");
        } else {
          logger.verbose("⚠️  Middleware.ts already exists, skipping");
        }
      }
    }
    const genericAuthPath = path.join(templateRoot, genericAuthDir);
    if (await pathExists(genericAuthPath)) {
      const files = await readdir(genericAuthPath, { withFileTypes: true });

      for (const file of files) {
        if (file.isFile() && file.name.endsWith(".hbs")) {
          const fileName = file.name.replace(".hbs", "");

          // Skip auth-client for backend destinations (it's for frontend)
          const isMonorepo = !!(
            config.backend &&
            config.backend !== "none" &&
            config.backend !== "next-api"
          );
          if (fileName.includes("auth-client") && isMonorepo) {
            // Copy auth-client to the web app instead
            const webDestPath = path.join(config.projectPath, "apps/web/src/lib", fileName);
            await templateEngine.processTemplate(
              `${genericAuthDir}/${file.name}`,
              webDestPath,
              authContext
            );
            continue;
          }

          // Skip db-connection.ts if using an ORM (only needed when orm is "none")
          if (fileName.includes("db-connection") && config.orm !== "none") {
            continue;
          }

          const isTypeScriptFile = fileName.endsWith(".ts") || fileName.endsWith(".tsx");

          if (!config.typescript && isTypeScriptFile) {
            continue;
          }

          if (config.typescript && (fileName.endsWith(".js") || fileName.endsWith(".jsx"))) {
            continue;
          }

          await templateEngine.processTemplate(
            `${genericAuthDir}/${file.name}`,
            path.join(config.projectPath, authDestination, fileName),
            authContext
          );
        }
      }
    }

    if (
      (provider.id === "better-auth" || provider.id === "auth.js") &&
      config.backend &&
      config.backend !== "none"
    ) {
      const backendRoutePath = path.join(
        templateRoot,
        `${genericAuthDir}/${config.backend}/routes.ts.hbs`
      );
      if (await pathExists(backendRoutePath)) {
        // Routes go to features/auth/routes.ts for consistency
        const routeDestination = path.join(config.projectPath, "apps/api/src/features/auth");
        await ensureDir(routeDestination);
        await templateEngine.processTemplate(
          `${genericAuthDir}/${config.backend}/routes.ts.hbs`,
          path.join(routeDestination, "routes.ts"),
          authContext
        );
        logger.verbose(`✓ Created ${provider.name} route handler for ${config.backend}`);
      } else {
        logger.warn(`⚠️  No ${provider.name} route template found for ${config.backend}`);
      }
    }

    if (
      provider.id === "auth.js" &&
      config.database &&
      config.database !== "none" &&
      (!config.orm || config.orm === "none")
    ) {
      const isMonorepo = !!(
        config.backend &&
        config.backend !== "none" &&
        config.backend !== "next-api"
      );
      const targetPath = isMonorepo
        ? path.join(config.projectPath, "apps/api")
        : config.projectPath;

      const migrationPath = path.join(
        templateRoot,
        `${genericAuthDir}/migrations/001_auth_tables.sql.hbs`
      );
      if (await pathExists(migrationPath)) {
        const migrationDest = path.join(targetPath, "migrations");
        await ensureDir(migrationDest);
        await templateEngine.processTemplate(
          `${genericAuthDir}/migrations/001_auth_tables.sql.hbs`,
          path.join(migrationDest, "001_auth_tables.sql"),
          authContext
        );
        logger.verbose(`✓ Created Auth.js database migration file`);
      }

      const setupScriptPath = path.join(
        templateRoot,
        `${genericAuthDir}/scripts/setup-auth-db.ts.hbs`
      );
      if (await pathExists(setupScriptPath)) {
        const scriptsDest = path.join(targetPath, "scripts");
        await ensureDir(scriptsDest);
        await templateEngine.processTemplate(
          `${genericAuthDir}/scripts/setup-auth-db.ts.hbs`,
          path.join(scriptsDest, "setup-auth-db.ts"),
          authContext
        );
        logger.verbose(`✓ Created Auth.js database setup script`);

        const packageJsonPath = path.join(targetPath, "package.json");
        if (await pathExists(packageJsonPath)) {
          const packageJson = await readJson(packageJsonPath);
          if (!packageJson.scripts) {
            packageJson.scripts = {};
          }
          packageJson.scripts["db:setup"] = "tsx scripts/setup-auth-db.ts";
          packageJson.scripts["db:setup:bun"] = "bun run scripts/setup-auth-db.ts";
          await writeJson(packageJsonPath, packageJson, { spaces: 2 });
          logger.verbose(`✓ Added db:setup scripts to package.json`);
        }
      }
    }
  } catch (error) {
    logger.warn(`Failed to copy auth templates: ${error}`);
    errorCollector.addError("Auth template copy", error);
  }
}

function getAuthDestination(config: ProjectConfig & { authProvider?: string }): string {
  const isMonorepo = !!(
    config.backend &&
    config.backend !== "none" &&
    config.backend !== "next-api"
  );

  // For auth.js in a monorepo, auth config goes to the API under features/auth
  // Routes will be handled separately
  if ((config.authProvider === "better-auth" || config.authProvider === "auth.js") && isMonorepo) {
    return "apps/api/src/features/auth";
  }

  switch (config.framework) {
    case "next":
      return isMonorepo ? "apps/web/src/lib" : "src/lib";
    case "react":
    case "vue":
    case "solid":
    case "svelte":
    case "react-router":
    case "tanstack-router":
    case "tanstack-start":
    case "vite":
      if (config.authProvider === "better-auth" && isMonorepo) {
        return "apps/api/src/features/auth";
      }
      return isMonorepo ? "apps/web/src/lib" : "src/lib";
    case "express":
    case "fastify":
    case "node":
      // For backend-only projects, use features/auth
      return isMonorepo ? "apps/api/src/features/auth" : "src/features/auth";
    default:
      return isMonorepo ? "apps/web/src/lib" : "src/lib";
  }
}

/**
 * Generate a cryptographically secure JWT secret
 * Uses hex encoding for better compatibility with various auth libraries
 */
function generateJWTSecret(length: number = 64): string {
  return crypto.randomBytes(length).toString("hex");
}

/**
 * Generate a secure random password for session secrets
 * Uses base64url encoding for URL-safe secrets
 */
function generateSessionSecret(length: number = 32): string {
  return crypto.randomBytes(length).toString("base64url");
}

/**
 * Generate a secure random API key
 * Uses a mix of alphanumeric characters for compatibility
 */
function generateAPIKey(length: number = 32): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  const randomBytes = crypto.randomBytes(length);
  for (let i = 0; i < length; i++) {
    result += chars.charAt(randomBytes[i] % chars.length);
  }
  return result;
}

function generateDatabaseUrl(config: ProjectConfig): string {
  const dbName = config.name.replace(/-/g, "_");

  switch (config.database) {
    case "postgres":
      return `postgresql://postgres:postgres@localhost:5432/${dbName}`;
    case "mysql":
      return `mysql://root:password@localhost:3306/${dbName}`;
    case "mongodb":
      return `mongodb://localhost:27017/${dbName}`;
    case "neon":
      return `postgres://user:password@ep-xxx.us-east-1.aws.neon.tech/${dbName}`;
    case "planetscale":
      return `mysql://xxx:pscale_pw_xxx@aws.connect.psdb.cloud/${dbName}?ssl={"rejectUnauthorized":true}`;
    case "turso":
      return `libsql://${dbName}-xxx.turso.io`;
    default:
      return `postgresql://postgres:postgres@localhost:5432/${dbName}`;
  }
}

async function updateEnvFile(
  config: ProjectConfig & { authProvider?: string },
  provider: AuthProvider
): Promise<void> {
  const isMonorepo = !!(
    config.backend &&
    config.backend !== "none" &&
    config.backend !== "next-api"
  );
  let envBasePath: string;

  if (provider.id === "better-auth" && isMonorepo) {
    envBasePath = path.join(config.projectPath, "apps/api");
  } else {
    envBasePath = config.projectPath;
  }

  const envPath = path.join(envBasePath, ".env");
  const envExamplePath = path.join(envBasePath, ".env.example");

  const templateRoot = getTemplateRoot();
  const envTemplateContent = await readFile(
    path.join(templateRoot, "auth", "env-variables.hbs"),
    "utf-8"
  );

  const useSecureSecrets = config.securePasswords !== false;
  const handlebars = (await import("handlebars")).default;
  const template = handlebars.compile(envTemplateContent);
  const envContent = template({
    ...config,
    authProvider: provider.id,
    authSecret: useSecureSecrets
      ? generateJWTSecret()
      : "your-super-secret-jwt-key-change-this-in-production",
    sessionSecret: useSecureSecrets ? generateSessionSecret() : "your-session-secret-change-this",
    apiKey: useSecureSecrets ? generateAPIKey() : "your-api-key-change-this",
    databaseUrl: generateDatabaseUrl(config),
    requiresDatabase: provider.requiresDatabase,
  });

  let existingContent = "";
  if (await pathExists(envPath)) {
    existingContent = await readFile(envPath, "utf-8");
    if (!existingContent.includes("# Authentication Configuration")) {
      existingContent += "\n\n" + envContent;
    }
  } else {
    existingContent = envContent;
  }

  await writeFile(envPath, existingContent);

  const exampleContent = envContent.replace(/=.+$/gm, (match) => {
    if (match.includes("your-") || match.includes("http://localhost")) {
      return match;
    }
    return "=your-value-here";
  });

  let existingExampleContent = "";
  if (await pathExists(envExamplePath)) {
    existingExampleContent = await readFile(envExamplePath, "utf-8");
    if (!existingExampleContent.includes("# Authentication Configuration")) {
      existingExampleContent += "\n\n" + exampleContent;
    }
  } else {
    existingExampleContent = exampleContent;
  }

  await writeFile(envExamplePath, existingExampleContent);
}

async function updatePrismaSchema(
  config: ProjectConfig & { authProvider?: string },
  provider: AuthProvider
): Promise<void> {
  if (provider.id !== "auth.js" && provider.id !== "better-auth") {
    return;
  }
  const isMonorepo = !!(
    config.backend &&
    config.backend !== "none" &&
    config.backend !== "next-api"
  );
  const schemaPath = isMonorepo
    ? path.join(config.projectPath, "apps", "api", "prisma", "schema.prisma")
    : path.join(config.projectPath, "prisma", "schema.prisma");

  if (!(await pathExists(schemaPath))) {
    logger.warn("Prisma schema not found. Skipping schema update.");
    return;
  }

  const schemaContent = await readFile(schemaPath, "utf-8");

  if (schemaContent.includes("model Account") || schemaContent.includes("model Session")) {
    logger.verbose("Auth models already exist in Prisma schema");
    return;
  }

  const hasBasicUserModel =
    schemaContent.includes("model User") && !schemaContent.includes("model Account");

  const authModels =
    provider.id === "auth.js" ? getAuthJsPrismaModels() : getBetterAuthPrismaModels();

  let updatedSchema: string;
  if (hasBasicUserModel) {
    const userModelRegex = /model User\s*\{[^}]*\}/;
    updatedSchema = schemaContent.replace(userModelRegex, "");
    updatedSchema = updatedSchema + "\n\n" + authModels;
    logger.verbose("Replaced basic User model with auth User model");
  } else {
    updatedSchema = schemaContent + "\n\n" + authModels;
  }

  await writeFile(schemaPath, updatedSchema);

  logger.verbose("Updated Prisma schema with auth models");
}

function getAuthJsPrismaModels(): string {
  return `// Auth.js Models
model User {
  id            String    @id @default(cuid())
  email         String?   @unique
  emailVerified DateTime?
  name          String?
  password      String?   // For credentials provider
  image         String?
  accounts      Account[]
  sessions      Session[]
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String? @db.Text
  access_token      String? @db.Text
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? @db.Text
  session_state     String?
  user              User    @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
}`;
}

function getBetterAuthPrismaModels(): string {
  return `// Better Auth Models
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  name          String?
  emailVerified Boolean   @default(false)
  image         String?
  password      String?
  sessions      Session[]
  accounts      Account[]
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

model Session {
  id        String   @id @default(cuid())
  userId    String
  expiresAt DateTime
  token     String   @unique
  ipAddress String?
  userAgent String?
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Account {
  id                String    @id @default(cuid())
  accountId         String
  providerId        String
  userId            String
  accessToken       String?   @db.Text
  refreshToken      String?   @db.Text
  idToken           String?   @db.Text
  accessTokenExpiresAt  DateTime?
  refreshTokenExpiresAt DateTime?
  scope             String?
  password          String?
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt
  user              User      @relation(fields: [userId], references: [id], onDelete: Cascade)
}`;
}

function showNextSteps(config: ProjectConfig, provider: AuthProvider): void {
  logger.info("\n📝 Next steps for authentication setup:");

  const steps: string[] = [];

  if (provider.requiresDatabase) {
    if (config.orm === "prisma") {
      steps.push("1. Run 'npx prisma migrate dev' to create auth tables");
    } else if (config.orm === "drizzle") {
      steps.push("1. Run 'npx drizzle-kit push' to create auth tables");
    } else if (
      config.database &&
      config.database !== "none" &&
      (!config.orm || config.orm === "none")
    ) {
      steps.push("1. Run 'npm run db:setup' or 'bun run db:setup:bun' to create auth tables");
    }
  }

  steps.push(
    `${steps.length + 1}. Update the environment variables in .env.local with your OAuth credentials`
  );

  if (provider.id === "auth.js" && config.framework === "next") {
    steps.push(
      `${steps.length + 1}. Add the auth handlers to your API routes (see app/api/auth/[...nextauth]/route.ts)`
    );
  }

  if (provider.id === "better-auth") {
    steps.push(`${steps.length + 1}. Mount the auth API routes in your application`);
  }

  steps.push(`${steps.length + 1}. Create sign-in and sign-up pages for your application`);
  steps.push(`${steps.length + 1}. Protect your routes using the auth middleware or hooks`);

  steps.forEach((step) => logger.info(`  ${step}`));

  logger.info("\n📚 Documentation:");
  const docs: Record<string, string> = {
    "auth.js": "https://authjs.dev",
    "better-auth": "https://better-auth.com",
    clerk: "https://clerk.com/docs",
    auth0: "https://auth0.com/docs",
    "supabase-auth": "https://supabase.com/docs/guides/auth",
    "firebase-auth": "https://firebase.google.com/docs/auth",
    "passport.js": "https://www.passportjs.org/docs",
  };

  if (docs[provider.id]) {
    logger.info(`  ${provider.name}: ${docs[provider.id]}`);
  }
}

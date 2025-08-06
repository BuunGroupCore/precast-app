import * as crypto from "crypto";
import * as path from "path";

import { consola } from "consola";
import fsExtra from "fs-extra";
// eslint-disable-next-line import/no-named-as-default-member
const { writeFile, ensureDir, pathExists, readFile } = fsExtra;

import type { ProjectConfig } from "../../../shared/stack-config.js";

import { installDependencies } from "./package-manager";

interface AuthProvider {
  id: string;
  name: string;
  packages: Record<string, string[]>; // Framework-specific packages
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
    },
    devPackages: {
      all: ["@types/node"],
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
    supportedFrameworks: ["next", "react", "remix", "solid", "svelte"],
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
      "BETTER_AUTH_DATABASE_URL",
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
 * Setup authentication for the project
 * @param config - Project configuration
 * @param authProviderId - ID of the authentication provider to setup
 */
export async function setupAuthentication(
  config: ProjectConfig,
  authProviderId: string
): Promise<void> {
  const provider = authProviders[authProviderId];
  if (!provider) {
    throw new Error(`Unknown auth provider: ${authProviderId}`);
  }

  if (!provider.supportedFrameworks.includes(config.framework)) {
    throw new Error(
      `${provider.name} is not supported for ${config.framework}. Supported frameworks: ${provider.supportedFrameworks.join(", ")}`
    );
  }

  consola.info(`🔐 Setting up ${provider.name} authentication...`);

  // Check if database is configured
  if (provider.requiresDatabase && config.database === "none") {
    consola.warn(`⚠️  ${provider.name} requires a database. Please configure a database first.`);
    return;
  }

  // Install packages
  await installAuthPackages(config, provider);

  // Create auth configuration files
  await createAuthConfig(config, provider);

  // Update environment variables
  await updateEnvFile(config, provider);

  // Create auth templates
  await createAuthTemplates(config, provider);

  // Update Prisma schema if using Prisma
  if (config.orm === "prisma" && provider.requiresDatabase) {
    await updatePrismaSchema(config, provider);
    await createPrismaClient(config);
  }

  consola.success(`✅ ${provider.name} authentication setup complete!`);

  // Show next steps
  showNextSteps(config, provider);
}

async function installAuthPackages(config: ProjectConfig, provider: AuthProvider): Promise<void> {
  const packages: string[] = [];
  const devPackages: string[] = [];

  // Get framework-specific packages
  const frameworkPackages = provider.packages[config.framework] || provider.packages.all || [];
  packages.push(...frameworkPackages);

  // Get dev packages
  const frameworkDevPackages =
    provider.devPackages?.[config.framework] || provider.devPackages?.all || [];
  devPackages.push(...frameworkDevPackages);

  // Add TypeScript types if using TypeScript
  if (config.language === "typescript") {
    if (provider.id === "auth.js" && config.framework === "next") {
      devPackages.push("@types/next-auth");
    }
  }

  // Install packages
  if (packages.length > 0 || devPackages.length > 0) {
    consola.info(`📦 Installing ${provider.name} packages...`);

    // Install regular dependencies
    if (packages.length > 0) {
      await installDependencies(packages, {
        packageManager: config.packageManager,
        projectPath: config.projectPath,
        dev: false,
      });
    }

    // Install dev dependencies
    if (devPackages.length > 0) {
      await installDependencies(devPackages, {
        packageManager: config.packageManager,
        projectPath: config.projectPath,
        dev: true,
      });
    }
  }
}

async function createAuthConfig(config: ProjectConfig, provider: AuthProvider): Promise<void> {
  if (provider.id === "auth.js") {
    await createAuthJsConfig(config);
  } else if (provider.id === "better-auth") {
    await createBetterAuthConfig(config);
  }
}

async function createAuthJsConfig(config: ProjectConfig): Promise<void> {
  const ext = config.language === "typescript" ? "ts" : "js";

  if (config.framework === "next") {
    // Create auth.config.ts for Next.js
    const authConfigPath = path.join(config.projectPath, `auth.config.${ext}`);
    const authConfigContent = `import type { NextAuthConfig } from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";

export default {
  providers: [
    GitHub({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith("/dashboard");
      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      } else if (isLoggedIn) {
        return Response.redirect(new URL("/dashboard", nextUrl));
      }
      return true;
    },
  },
} satisfies NextAuthConfig;`;

    await writeFile(authConfigPath, authConfigContent);

    // Create auth.ts
    const authPath = path.join(config.projectPath, `auth.${ext}`);
    const authContent = `import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./lib/prisma";
import authConfig from "./auth.config";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  ...authConfig,
});`;

    await writeFile(authPath, authContent);

    // Create middleware.ts
    const middlewarePath = path.join(config.projectPath, `middleware.${ext}`);
    const middlewareContent = `import NextAuth from "next-auth";
import authConfig from "./auth.config";

export const { auth: middleware } = NextAuth(authConfig);

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};`;

    await writeFile(middlewarePath, middlewareContent);
  } else {
    // For other frameworks, create a generic auth config
    const authConfigPath = path.join(config.projectPath, "src", `auth.config.${ext}`);
    const authConfigContent = `import { AuthConfig } from "@auth/core";
import GitHub from "@auth/core/providers/github";
import Google from "@auth/core/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./lib/prisma";

export const authConfig: AuthConfig = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GitHub({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    session: async ({ session, token }) => {
      if (session?.user && token?.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
    jwt: async ({ user, token }) => {
      if (user) {
        token.uid = user.id;
      }
      return token;
    },
  },
  secret: process.env.AUTH_SECRET,
};`;

    await ensureDir(path.dirname(authConfigPath));
    await writeFile(authConfigPath, authConfigContent);
  }
}

async function createBetterAuthConfig(config: ProjectConfig): Promise<void> {
  const ext = config.language === "typescript" ? "ts" : "js";
  const authPath = path.join(config.projectPath, "src", "lib", `auth.${ext}`);

  const authContent = `import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql", // or mysql, sqlite
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    requireEmailVerification: false,
  },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // 5 minutes
    },
  },
});

export type Auth = typeof auth;`;

  await ensureDir(path.dirname(authPath));
  await writeFile(authPath, authContent);

  // Create client auth file
  const clientAuthPath = path.join(config.projectPath, "src", "lib", `auth-client.${ext}`);
  const clientAuthContent = `import { createAuthClient } from "better-auth/client";

export const authClient = createAuthClient({
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
});`;

  await writeFile(clientAuthPath, clientAuthContent);
}

// Generate a cryptographically secure random secret
function generateSecret(length: number = 32): string {
  return crypto.randomBytes(length).toString("base64");
}

// Generate database URL based on config
function generateDatabaseUrl(config: ProjectConfig): string {
  const dbName = config.name.replace(/-/g, "_");

  switch (config.database) {
    case "postgres":
      return `postgresql://postgres:postgres@localhost:5432/${dbName}`;
    case "mysql":
      return `mysql://root:password@localhost:3306/${dbName}`;
    case "mongodb":
      return `mongodb://localhost:27017/${dbName}`;
    default:
      return `postgresql://postgres:postgres@localhost:5432/${dbName}`;
  }
}

async function updateEnvFile(config: ProjectConfig, provider: AuthProvider): Promise<void> {
  const envPath = path.join(config.projectPath, ".env.local");
  const envExamplePath = path.join(config.projectPath, ".env.example");

  let envContent = "";
  if (await pathExists(envPath)) {
    envContent = await readFile(envPath, "utf-8");
  }

  const envVars: string[] = [];
  const exampleEnvVars: string[] = [];

  // Add provider-specific environment variables
  for (const varName of provider.envVariables) {
    if (!envContent.includes(varName)) {
      let value = "";
      let exampleValue = "";

      switch (varName) {
        case "AUTH_SECRET":
        case "BETTER_AUTH_SECRET":
          value = generateSecret();
          exampleValue = "your-secret-key-here";
          break;
        case "AUTH_URL":
        case "BETTER_AUTH_URL":
          value = "http://localhost:3000";
          exampleValue = "http://localhost:3000";
          break;
        case "AUTH_TRUST_HOST":
          value = "true";
          exampleValue = "true";
          break;
        case "BETTER_AUTH_DATABASE_URL":
          value = generateDatabaseUrl(config);
          exampleValue = "postgresql://user:password@localhost:5432/mydb";
          break;
        case "DATABASE_URL":
          if (!envContent.includes("DATABASE_URL")) {
            value = generateDatabaseUrl(config);
            exampleValue = "postgresql://user:password@localhost:5432/mydb";
          }
          break;
        case "GITHUB_ID":
        case "GITHUB_CLIENT_ID":
          value = "";
          exampleValue = "your-github-oauth-app-id";
          break;
        case "GITHUB_SECRET":
        case "GITHUB_CLIENT_SECRET":
          value = "";
          exampleValue = "your-github-oauth-app-secret";
          break;
        case "GOOGLE_CLIENT_ID":
          value = "";
          exampleValue = "your-google-oauth-client-id";
          break;
        case "GOOGLE_CLIENT_SECRET":
          value = "";
          exampleValue = "your-google-oauth-client-secret";
          break;
        default:
          value = "";
          exampleValue = "";
      }

      envVars.push(`${varName}=${value}`);
      exampleEnvVars.push(`${varName}=${exampleValue}`);
    }
  }

  if (envVars.length > 0) {
    // Write actual .env.local with real values
    const newEnvContent =
      envContent +
      (envContent.endsWith("\n") ? "" : "\n") +
      "\n# Authentication\n" +
      envVars.join("\n") +
      "\n";

    await writeFile(envPath, newEnvContent);

    // Write .env.example with example values
    const exampleContent =
      envContent +
      (envContent.endsWith("\n") ? "" : "\n") +
      "\n# Authentication\n" +
      exampleEnvVars.join("\n") +
      "\n";

    await writeFile(envExamplePath, exampleContent);

    // Also create .env if it doesn't exist
    const envMainPath = path.join(config.projectPath, ".env");
    if (!(await pathExists(envMainPath))) {
      await writeFile(envMainPath, newEnvContent);
    }

    consola.success("✅ Generated authentication secrets in .env files");
  }
}

async function createAuthTemplates(config: ProjectConfig, provider: AuthProvider): Promise<void> {
  if (config.framework === "next" && provider.id === "auth.js") {
    // Create sign-in page
    const signInPath = path.join(
      config.projectPath,
      "src",
      "app",
      "auth",
      "signin",
      `page.${config.language === "typescript" ? "tsx" : "jsx"}`
    );

    const signInContent = `import { signIn } from "@/auth";

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-sm space-y-4">
        <h1 className="text-2xl font-bold text-center">Sign In</h1>
        <form
          action={async () => {
            "use server";
            await signIn("github", { redirectTo: "/dashboard" });
          }}
        >
          <button
            type="submit"
            className="w-full rounded bg-gray-900 px-4 py-2 text-white hover:bg-gray-800"
          >
            Sign in with GitHub
          </button>
        </form>
        <form
          action={async () => {
            "use server";
            await signIn("google", { redirectTo: "/dashboard" });
          }}
        >
          <button
            type="submit"
            className="w-full rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Sign in with Google
          </button>
        </form>
      </div>
    </div>
  );
}`;

    await ensureDir(path.dirname(signInPath));
    await writeFile(signInPath, signInContent);

    // Create error page
    const errorPath = path.join(
      config.projectPath,
      "src",
      "app",
      "auth",
      "error",
      `page.${config.language === "typescript" ? "tsx" : "jsx"}`
    );

    const errorContent = `export default function AuthErrorPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  const error = searchParams?.error;

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-sm space-y-4 text-center">
        <h1 className="text-2xl font-bold text-red-600">Authentication Error</h1>
        <p className="text-gray-600">
          {error === "Configuration"
            ? "There is a problem with the server configuration."
            : error === "AccessDenied"
            ? "You do not have permission to sign in."
            : error === "Verification"
            ? "The verification token has expired or has already been used."
            : "An error occurred during authentication."}
        </p>
        <a href="/auth/signin" className="text-blue-600 hover:underline">
          Try again
        </a>
      </div>
    </div>
  );
}`;

    await writeFile(errorPath, errorContent);
  }
}

async function updatePrismaSchema(config: ProjectConfig, provider: AuthProvider): Promise<void> {
  const schemaPath = path.join(config.projectPath, "prisma", "schema.prisma");

  if (!(await pathExists(schemaPath))) {
    // Create basic Prisma schema if it doesn't exist
    await ensureDir(path.dirname(schemaPath));

    const databaseProvider =
      config.database === "postgres"
        ? "postgresql"
        : config.database === "mysql"
          ? "mysql"
          : config.database === "mongodb"
            ? "mongodb"
            : "postgresql"; // default

    const basicSchema = `// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "${databaseProvider}"
  url      = env("DATABASE_URL")
}
`;

    await writeFile(schemaPath, basicSchema);
  }

  // Read existing schema
  let schemaContent = await readFile(schemaPath, "utf-8");

  // Check if auth models already exist
  if (schemaContent.includes("model User") || schemaContent.includes("model Account")) {
    consola.info("Auth models already exist in Prisma schema");
    return;
  }

  // Add auth models based on provider
  let authModels = "";

  if (provider.id === "auth.js") {
    authModels = `
// Auth.js Models
model User {
  id            String    @id @default(cuid())
  email         String?   @unique
  emailVerified DateTime?
  name          String?
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

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

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
  } else if (provider.id === "better-auth") {
    authModels = `
// Better Auth Models
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  emailVerified Boolean   @default(false)
  name          String?
  image         String?
  password      String?   // For email/password auth
  sessions      Session[]
  accounts      Account[]
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

model Session {
  id        String   @id @default(cuid())
  expiresAt DateTime
  token     String   @unique
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Account {
  id                String  @id @default(cuid())
  userId            String
  accountId         String
  providerId        String
  accessToken       String? @db.Text
  refreshToken      String? @db.Text
  expiresAt         DateTime?
  accessTokenExpiresAt DateTime?
  
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@unique([providerId, accountId])
}

model VerificationToken {
  id        String   @id @default(cuid())
  token     String   @unique
  identifier String  // email or phone number
  expiresAt DateTime
  createdAt DateTime @default(now())
}`;
  }

  // Append auth models to schema
  schemaContent += authModels;

  // Write updated schema
  await writeFile(schemaPath, schemaContent);

  consola.success("✅ Updated Prisma schema with authentication models");
  consola.info("Run 'npx prisma migrate dev' to create the database tables");
}

async function createPrismaClient(config: ProjectConfig): Promise<void> {
  const ext = config.language === "typescript" ? "ts" : "js";
  const clientPath = path.join(config.projectPath, "src", "lib", `prisma.${ext}`);

  if (await pathExists(clientPath)) {
    consola.info("Prisma client already exists");
    return;
  }

  await ensureDir(path.dirname(clientPath));

  const clientContent = `import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}

export const prisma = globalThis.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = prisma;
}`;

  await writeFile(clientPath, clientContent);
  consola.success("✅ Created Prisma client");
}

function showNextSteps(config: ProjectConfig, provider: AuthProvider): void {
  consola.box({
    title: "Next Steps",
    message: `
1. ✅ Secret key generated in .env files

2. Configure OAuth providers:
   - Create OAuth apps on GitHub/Google
   - Add client IDs and secrets to .env.local

3. ${provider.requiresDatabase && config.orm === "prisma" ? "Run database migrations:\n   npx prisma migrate dev --name init" : ""}

4. ${config.framework === "next" ? "Your auth is ready! Check /auth/signin" : "Import and use auth in your app"}

Documentation:
- ${provider.id === "auth.js" ? "https://authjs.dev" : "https://better-auth.com"}
    `,
  });
}

// Helper function to add auth option to prompts
export function getAuthPromptOptions() {
  return Object.entries(authProviders).map(([id, provider]) => ({
    value: id,
    label: provider.name,
    hint: `Supports: ${provider.supportedFrameworks.slice(0, 3).join(", ")}${
      provider.supportedFrameworks.length > 3 ? "..." : ""
    }`,
  }));
}

// Check if auth provider is compatible with framework
export function isAuthProviderCompatible(authProviderId: string, framework: string): boolean {
  const provider = authProviders[authProviderId];
  return provider ? provider.supportedFrameworks.includes(framework) : false;
}

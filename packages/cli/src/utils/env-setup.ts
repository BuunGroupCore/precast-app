import path from "path";

import consola from "consola";
import fs from "fs-extra";

import { ProjectConfig } from "../../../shared/stack-config.js";

export interface EnvVariable {
  key: string;
  value?: string; // Make value optional since we might use development/production instead
  description?: string;
  required?: boolean;
  development?: string; // Development-specific value
  production?: string; // Production-specific value
}

export interface EnvConfig {
  variables: EnvVariable[];
  additionalNotes?: string[];
}

/**
 * Generate a secure random password
 */
function generateSecurePassword(length: number = 20): string {
  // Use characters that are safe for database URLs and environment variables
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#%^&*";
  let password = "";
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

/**
 * Get environment variables based on project configuration
 */
export function getEnvironmentVariables(
  config: ProjectConfig,
  dockerPasswords?: Record<string, string>
): EnvConfig {
  const variables: EnvVariable[] = [];
  const notes: string[] = [];

  // Base URLs
  if (config.backend !== "none") {
    variables.push({
      key: "VITE_API_URL",
      description: "Backend API URL",
      value: "", // Will be overridden by development/production values
      development: "http://localhost:3001",
      production: "https://api.yourdomain.com",
      required: true,
    });

    if (config.framework === "next") {
      variables.push({
        key: "NEXT_PUBLIC_API_URL",
        description: "Backend API URL for Next.js",
        value: "", // Will be overridden by development/production values
        development: "http://localhost:3001",
        production: "https://api.yourdomain.com",
        required: true,
      });
    }
  }

  // Database configuration
  if (config.database !== "none") {
    switch (config.database) {
      case "postgres":
        {
          const dbName = config.name.replace(/-/g, "_");
          const password = dockerPasswords?.POSTGRES_PASSWORD || generateSecurePassword();
          // URL-encode the password to handle special characters
          const encodedPassword = encodeURIComponent(password);
          variables.push({
            key: "DATABASE_URL",
            description: "PostgreSQL connection string",
            value: "", // Will be overridden by development/production values
            development: `postgresql://postgres:${encodedPassword}@localhost:5432/${dbName}`,
            production: "postgresql://user:password@host:5432/myapp_prod",
            required: true,
          });
          if (config.orm === "prisma") {
            variables.push({
              key: "DIRECT_URL",
              description: "Direct database URL for migrations (Prisma)",
              value: "", // Will be overridden by development/production values
              development: `postgresql://postgres:${encodedPassword}@localhost:5432/${dbName}`,
              production: "postgresql://user:password@host:5432/myapp_prod",
              required: false,
            });
          }
        }
        break;
      case "mysql":
        {
          const dbName = config.name.replace(/-/g, "_");
          const password = dockerPasswords?.MYSQL_ROOT_PASSWORD || generateSecurePassword();
          // URL-encode the password to handle special characters
          const encodedPassword = encodeURIComponent(password);
          variables.push({
            key: "DATABASE_URL",
            description: "MySQL connection string",
            value: "", // Will be overridden by development/production values
            development: `mysql://root:${encodedPassword}@localhost:3306/${dbName}`,
            production: "mysql://user:password@host:3306/myapp_prod",
            required: true,
          });
        }
        break;
      case "mongodb":
        {
          const dbName = config.name.replace(/-/g, "_");
          const password = dockerPasswords?.MONGO_ROOT_PASSWORD || generateSecurePassword();
          // URL-encode the password to handle special characters
          const encodedPassword = encodeURIComponent(password);
          variables.push({
            key: "MONGODB_URI",
            description: "MongoDB connection string",
            value: "", // Will be overridden by development/production values
            development: `mongodb://root:${encodedPassword}@localhost:27017/${dbName}?authSource=admin`,
            production: "mongodb+srv://user:password@cluster.mongodb.net/myapp_prod",
            required: true,
          });
        }
        break;
      case "supabase":
        variables.push(
          {
            key: "SUPABASE_URL",
            description: "Supabase project URL",
            value: "https://your-project.supabase.co",
            required: true,
          },
          {
            key: "SUPABASE_ANON_KEY",
            description: "Supabase anonymous key",
            value: "your-anon-key",
            required: true,
          },
          {
            key: "SUPABASE_SERVICE_ROLE_KEY",
            description: "Supabase service role key (server-side only)",
            value: "your-service-role-key",
            required: true,
          }
        );
        notes.push("Get your Supabase keys from: https://app.supabase.com/project/_/settings/api");
        break;
      case "firebase":
        variables.push({
          key: "FIREBASE_CONFIG",
          description: "Firebase configuration (JSON string)",
          value:
            '{"apiKey":"","authDomain":"","projectId":"","storageBucket":"","messagingSenderId":"","appId":""}',
          required: true,
        });
        notes.push(
          "Get your Firebase config from: https://console.firebase.google.com/project/_/settings/general/"
        );
        break;
      case "turso":
        variables.push(
          {
            key: "TURSO_DATABASE_URL",
            description: "Turso database URL",
            value: "libsql://your-database.turso.io",
            required: true,
          },
          {
            key: "TURSO_AUTH_TOKEN",
            description: "Turso authentication token",
            value: "your-auth-token",
            required: true,
          }
        );
        break;
      case "neon":
        variables.push({
          key: "DATABASE_URL",
          description: "Neon database connection string",
          value: "postgresql://user:password@host.neon.tech/myapp",
          required: true,
        });
        break;
      case "planetscale":
        variables.push({
          key: "DATABASE_URL",
          description: "PlanetScale database URL",
          value:
            'mysql://user:password@host.connect.psdb.cloud/myapp?ssl={"rejectUnauthorized":true}',
          required: true,
        });
        break;
      case "cloudflare-d1":
        variables.push({
          key: "D1_DATABASE_ID",
          description: "Cloudflare D1 database ID",
          value: "your-d1-database-id",
          required: true,
        });
        notes.push("Configure D1 in wrangler.toml for local development");
        break;
    }
  }

  // Authentication providers
  if (config.authProvider && config.authProvider !== "none") {
    switch (config.authProvider) {
      case "better-auth":
        variables.push(
          {
            key: "BETTER_AUTH_SECRET",
            description: "Better Auth secret key",
            value: generateSecret(),
            required: true,
          },
          {
            key: "BETTER_AUTH_URL",
            description: "Better Auth base URL",
            value: "", // Will be overridden by development/production values
            development: "http://localhost:3000",
            production: "https://yourdomain.com",
            required: true,
          }
        );
        // OAuth providers (optional)
        variables.push(
          {
            key: "GITHUB_CLIENT_ID",
            description: "GitHub OAuth client ID (optional)",
            value: "",
            required: false,
          },
          {
            key: "GITHUB_CLIENT_SECRET",
            description: "GitHub OAuth client secret (optional)",
            value: "",
            required: false,
          },
          {
            key: "GOOGLE_CLIENT_ID",
            description: "Google OAuth client ID (optional)",
            value: "",
            required: false,
          },
          {
            key: "GOOGLE_CLIENT_SECRET",
            description: "Google OAuth client secret (optional)",
            value: "",
            required: false,
          }
        );
        break;
      case "auth.js":
      case "nextauth":
        variables.push(
          {
            key: "NEXTAUTH_SECRET",
            description: "NextAuth.js secret",
            value: generateSecret(),
            required: true,
          },
          {
            key: "NEXTAUTH_URL",
            description: "NextAuth.js URL",
            value: "", // Will be overridden by development/production values
            development: "http://localhost:3000",
            production: "https://yourdomain.com",
            required: true,
          }
        );
        break;
      case "clerk":
        variables.push(
          {
            key: "CLERK_PUBLISHABLE_KEY",
            description: "Clerk publishable key",
            value: "pk_test_",
            required: true,
          },
          {
            key: "CLERK_SECRET_KEY",
            description: "Clerk secret key",
            value: "sk_test_",
            required: true,
          }
        );
        if (config.framework === "next") {
          variables.push({
            key: "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY",
            description: "Clerk publishable key for Next.js",
            value: "pk_test_",
            required: true,
          });
        }
        notes.push("Get your Clerk keys from: https://dashboard.clerk.com");
        break;
      case "auth0":
        variables.push(
          {
            key: "AUTH0_DOMAIN",
            description: "Auth0 domain",
            value: "your-tenant.auth0.com",
            required: true,
          },
          {
            key: "AUTH0_CLIENT_ID",
            description: "Auth0 client ID",
            value: "",
            required: true,
          },
          {
            key: "AUTH0_CLIENT_SECRET",
            description: "Auth0 client secret",
            value: "",
            required: true,
          },
          {
            key: "AUTH0_ISSUER_BASE_URL",
            description: "Auth0 issuer base URL",
            value: "https://your-tenant.auth0.com",
            required: true,
          }
        );
        break;
      case "lucia":
        variables.push({
          key: "SESSION_SECRET",
          description: "Session secret for Lucia",
          value: generateSecret(),
          required: true,
        });
        break;
      case "passport":
        variables.push({
          key: "SESSION_SECRET",
          description: "Express session secret",
          value: generateSecret(),
          required: true,
        });
        break;
    }
  }

  // Plugins (Stripe, Resend, etc.)
  if (config.plugins && config.plugins.length > 0) {
    for (const plugin of config.plugins) {
      switch (plugin) {
        case "stripe":
          variables.push(
            {
              key: "STRIPE_PUBLISHABLE_KEY",
              description: "Stripe publishable key",
              value: "pk_test_",
              required: true,
            },
            {
              key: "STRIPE_SECRET_KEY",
              description: "Stripe secret key",
              value: "sk_test_",
              required: true,
            },
            {
              key: "STRIPE_WEBHOOK_SECRET",
              description: "Stripe webhook endpoint secret",
              value: "whsec_",
              required: false,
            }
          );
          if (config.framework === "next") {
            variables.push({
              key: "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY",
              description: "Stripe publishable key for Next.js",
              value: "pk_test_",
              required: true,
            });
          }
          notes.push("Get your Stripe keys from: https://dashboard.stripe.com/test/apikeys");
          break;
        case "resend":
          variables.push(
            {
              key: "RESEND_API_KEY",
              description: "Resend API key",
              value: "re_",
              required: true,
            },
            {
              key: "RESEND_FROM_EMAIL",
              description: "Default sender email address",
              value: "noreply@yourdomain.com",
              required: true,
            }
          );
          notes.push("Get your Resend API key from: https://resend.com/api-keys");
          notes.push("Configure a verified domain in Resend to use custom sender addresses");
          break;
        case "sendgrid":
          variables.push({
            key: "SENDGRID_API_KEY",
            description: "SendGrid API key",
            value: "SG.",
            required: true,
          });
          notes.push("Get your SendGrid API key from: https://app.sendgrid.com/settings/api_keys");
          break;
        case "twilio":
          variables.push(
            {
              key: "TWILIO_ACCOUNT_SID",
              description: "Twilio Account SID",
              value: "AC",
              required: true,
            },
            {
              key: "TWILIO_AUTH_TOKEN",
              description: "Twilio Auth Token",
              value: "",
              required: true,
            },
            {
              key: "TWILIO_PHONE_NUMBER",
              description: "Twilio phone number",
              value: "+1",
              required: true,
            }
          );
          notes.push("Get your Twilio credentials from: https://console.twilio.com");
          break;
        case "pusher":
          variables.push(
            {
              key: "PUSHER_APP_ID",
              description: "Pusher App ID",
              value: "",
              required: true,
            },
            {
              key: "PUSHER_KEY",
              description: "Pusher Key",
              value: "",
              required: true,
            },
            {
              key: "PUSHER_SECRET",
              description: "Pusher Secret",
              value: "",
              required: true,
            },
            {
              key: "PUSHER_CLUSTER",
              description: "Pusher Cluster",
              value: "us2",
              required: true,
            }
          );
          if (config.framework === "next") {
            variables.push({
              key: "NEXT_PUBLIC_PUSHER_KEY",
              description: "Pusher Key for client-side",
              value: "",
              required: true,
            });
          }
          break;
        case "socket.io":
          variables.push({
            key: "SOCKET_PORT",
            description: "WebSocket server port",
            value: "", // Will be overridden by development/production values
            development: "3002",
            production: "443",
            required: false,
          });
          break;
        case "google-analytics":
          if (config.framework === "next") {
            variables.push({
              key: "NEXT_PUBLIC_GA_MEASUREMENT_ID",
              description: "Google Analytics Measurement ID",
              value: "G-XXXXXXXXXX",
              required: false,
            });
          } else {
            variables.push({
              key: "VITE_GA_MEASUREMENT_ID",
              description: "Google Analytics Measurement ID",
              value: "G-XXXXXXXXXX",
              required: false,
            });
          }
          notes.push("Get your GA Measurement ID from: https://analytics.google.com");
          break;
        case "posthog":
          if (config.framework === "next") {
            variables.push(
              {
                key: "NEXT_PUBLIC_POSTHOG_KEY",
                description: "PostHog Project API Key",
                value: "phc_",
                required: false,
              },
              {
                key: "NEXT_PUBLIC_POSTHOG_HOST",
                description: "PostHog API Host",
                value: "https://app.posthog.com",
                required: false,
              }
            );
          } else {
            variables.push(
              {
                key: "VITE_POSTHOG_KEY",
                description: "PostHog Project API Key",
                value: "phc_",
                required: false,
              },
              {
                key: "VITE_POSTHOG_HOST",
                description: "PostHog API Host",
                value: "https://app.posthog.com",
                required: false,
              }
            );
          }
          notes.push("Get your PostHog API key from: https://app.posthog.com/project/settings");
          break;
        case "sentry":
          variables.push(
            {
              key: "SENTRY_DSN",
              description: "Sentry Data Source Name",
              value: "https://",
              required: false,
            },
            {
              key: "SENTRY_AUTH_TOKEN",
              description: "Sentry Auth Token for source maps",
              value: "",
              required: false,
            }
          );
          if (config.framework === "next") {
            variables.push({
              key: "NEXT_PUBLIC_SENTRY_DSN",
              description: "Sentry DSN for client-side",
              value: "https://",
              required: false,
            });
          }
          notes.push("Get your Sentry DSN from: https://sentry.io/settings/projects/");
          break;
      }
    }
  }

  // AI integrations
  if (config.aiAssistant === "claude") {
    variables.push({
      key: "ANTHROPIC_API_KEY",
      description: "Anthropic API key for Claude",
      value: "sk-ant-",
      required: false,
    });
  }

  // Deployment-specific
  if (config.deploymentMethod) {
    switch (config.deploymentMethod) {
      case "vercel":
        notes.push("Vercel automatically injects environment variables from the dashboard");
        break;
      case "cloudflare-pages":
        notes.push("Configure environment variables in Cloudflare Pages dashboard");
        break;
      case "aws-amplify":
        notes.push("Configure environment variables in AWS Amplify console");
        break;
    }
  }

  // Node/Server configuration
  if (config.backend !== "none") {
    variables.push(
      {
        key: "NODE_ENV",
        description: "Node environment",
        value: "", // Will be overridden by development/production values
        development: "development",
        production: "production",
        required: true,
      },
      {
        key: "PORT",
        description: "Server port",
        value: "", // Will be overridden by development/production values
        development: "3001",
        production: "3001",
        required: false,
      }
    );
  }

  return {
    variables,
    additionalNotes: notes,
  };
}

/**
 * Generate a secure random secret
 */
function generateSecret(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < 32; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Format environment variables for .env file
 */
function formatEnvFile(
  variables: EnvVariable[],
  environment: "development" | "production"
): string {
  const lines: string[] = [];

  // Add header
  lines.push(`# Environment variables for ${environment}`);
  lines.push(`# Generated by Precast CLI`);
  lines.push(`# ${new Date().toISOString()}`);
  lines.push("");

  // Group variables by category
  const grouped: Record<string, EnvVariable[]> = {
    core: [],
    database: [],
    auth: [],
    plugins: [],
    other: [],
  };

  for (const variable of variables) {
    if (
      variable.key.includes("DATABASE") ||
      variable.key.includes("MONGODB") ||
      variable.key.includes("SUPABASE") ||
      variable.key.includes("TURSO") ||
      variable.key.includes("D1")
    ) {
      grouped.database.push(variable);
    } else if (
      variable.key.includes("AUTH") ||
      variable.key.includes("CLERK") ||
      variable.key.includes("SESSION")
    ) {
      grouped.auth.push(variable);
    } else if (
      variable.key.includes("STRIPE") ||
      variable.key.includes("RESEND") ||
      variable.key.includes("SENDGRID") ||
      variable.key.includes("TWILIO") ||
      variable.key.includes("PUSHER")
    ) {
      grouped.plugins.push(variable);
    } else if (
      variable.key === "NODE_ENV" ||
      variable.key === "PORT" ||
      variable.key.includes("API_URL")
    ) {
      grouped.core.push(variable);
    } else {
      grouped.other.push(variable);
    }
  }

  // Write each group
  const groups = [
    { name: "Core Configuration", vars: grouped.core },
    { name: "Database Configuration", vars: grouped.database },
    { name: "Authentication", vars: grouped.auth },
    { name: "Third-party Services", vars: grouped.plugins },
    { name: "Other Configuration", vars: grouped.other },
  ];

  for (const group of groups) {
    if (group.vars.length > 0) {
      lines.push(`# ${group.name}`);
      lines.push("# " + "=".repeat(50));

      for (const variable of group.vars) {
        if (variable.description) {
          lines.push(`# ${variable.description}`);
        }

        let value = variable.value || "";
        if (environment === "development" && variable.development) {
          value = variable.development;
        } else if (environment === "production" && variable.production) {
          value = variable.production;
        }

        if (variable.required && !value) {
          lines.push(`# REQUIRED - Please set this value`);
        }

        lines.push(`${variable.key}=${value}`);
        lines.push("");
      }
    }
  }

  return lines.join("\n");
}

/**
 * Separate variables into frontend and backend scopes
 */
function separateVariablesByScope(variables: EnvVariable[]): {
  frontend: EnvVariable[];
  backend: EnvVariable[];
  shared: EnvVariable[];
} {
  const frontend: EnvVariable[] = [];
  const backend: EnvVariable[] = [];
  const shared: EnvVariable[] = [];

  for (const variable of variables) {
    // Frontend-specific variables
    if (
      variable.key.startsWith("VITE_") ||
      variable.key.startsWith("NEXT_PUBLIC_") ||
      variable.key.startsWith("REACT_APP_") ||
      variable.key === "STRIPE_PUBLISHABLE_KEY" ||
      variable.key === "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY" ||
      variable.key === "CLERK_PUBLISHABLE_KEY" ||
      variable.key === "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY" ||
      variable.key === "NEXT_PUBLIC_PUSHER_KEY"
    ) {
      frontend.push(variable);
    }
    // Backend-specific variables
    else if (
      variable.key.includes("DATABASE") ||
      variable.key.includes("MONGODB") ||
      variable.key.includes("SECRET") ||
      variable.key.includes("_KEY") ||
      variable.key.includes("AUTH") ||
      variable.key === "PORT" ||
      variable.key === "NODE_ENV" ||
      variable.key.includes("TURSO") ||
      variable.key.includes("SUPABASE") ||
      variable.key.includes("FIREBASE") ||
      variable.key.includes("RESEND") ||
      variable.key.includes("SENDGRID") ||
      variable.key.includes("TWILIO") ||
      variable.key.includes("STRIPE_SECRET") ||
      variable.key.includes("STRIPE_WEBHOOK") ||
      variable.key.includes("SESSION") ||
      variable.key.includes("JWT") ||
      variable.key.includes("DIRECT_URL") ||
      variable.key.includes("D1_DATABASE") ||
      variable.key.includes("PUSHER_SECRET") ||
      variable.key.includes("PUSHER_APP_ID") ||
      variable.key.includes("CLERK_SECRET") ||
      variable.key.includes("CLIENT_SECRET") ||
      variable.key.includes("AUTH0") ||
      variable.key.includes("GITHUB_CLIENT") ||
      variable.key.includes("GOOGLE_CLIENT") ||
      variable.key.includes("ANTHROPIC_API_KEY")
    ) {
      backend.push(variable);
    }
    // Variables that might be needed in both
    else {
      shared.push(variable);
    }
  }

  return { frontend, backend, shared };
}

/**
 * Generate .env files for a monorepo project with proper scoping
 */
export async function generateEnvFiles(
  config: ProjectConfig,
  dockerPasswords?: Record<string, string>
): Promise<void> {
  try {
    const envConfig = getEnvironmentVariables(config, dockerPasswords);
    const { frontend, backend, shared } = separateVariablesByScope(envConfig.variables);

    // Determine if this is a monorepo structure
    const isMonorepo = config.backend && config.backend !== "none";

    if (isMonorepo) {
      // For monorepo: generate separate .env.example files for web and api

      // Check for both "web" and "apps/web" patterns
      let webPath = path.join(config.projectPath, "web");
      if (!(await fs.pathExists(webPath))) {
        webPath = path.join(config.projectPath, "apps", "web");
      }

      // Frontend environment files
      if (await fs.pathExists(webPath)) {
        const frontendVars = [...frontend, ...shared];

        // web/.env with development defaults
        const webEnvContent = formatEnvFile(frontendVars, "development").replace(
          "# Environment variables for development",
          "# Frontend development environment\n# Auto-generated by Precast CLI"
        );
        await fs.writeFile(path.join(webPath, ".env"), webEnvContent);

        // web/.env.example as template
        const webExampleVars = frontendVars.map((v) => ({
          ...v,
          value: v.required ? v.development || v.value || "REPLACE_ME" : "",
          development: undefined,
          production: undefined,
        }));
        const webExampleContent = formatEnvFile(webExampleVars, "development").replace(
          "# Environment variables for development",
          "# Frontend environment template\n# Copy values from .env or update as needed"
        );
        await fs.writeFile(path.join(webPath, ".env.example"), webExampleContent);

        // Update web/.gitignore
        await updateGitignore(webPath);
      }

      // Check for both "api" and "apps/api" patterns
      let apiPath = path.join(config.projectPath, "api");
      if (!(await fs.pathExists(apiPath))) {
        apiPath = path.join(config.projectPath, "apps", "api");
      }

      // Backend environment files
      if (await fs.pathExists(apiPath)) {
        const backendVars = [...backend, ...shared];

        // api/.env with development defaults
        const apiEnvContent = formatEnvFile(backendVars, "development").replace(
          "# Environment variables for development",
          "# Backend development environment\n# Auto-generated by Precast CLI"
        );
        await fs.writeFile(path.join(apiPath, ".env"), apiEnvContent);

        // api/.env.example as template
        const apiExampleVars = backendVars.map((v) => ({
          ...v,
          value: v.required ? v.development || v.value || "REPLACE_ME" : "",
          development: undefined,
          production: undefined,
        }));
        const apiExampleContent = formatEnvFile(apiExampleVars, "development").replace(
          "# Environment variables for development",
          "# Backend environment template\n# Copy values from .env or update as needed"
        );
        await fs.writeFile(path.join(apiPath, ".env.example"), apiExampleContent);

        // Update api/.gitignore
        await updateGitignore(apiPath);
      }

      consola.success("Generated environment files:");
      if (await fs.pathExists(webPath)) {
        consola.info("  📁 web/.env (with defaults), web/.env.example (template)");
      }
      if (await fs.pathExists(apiPath)) {
        consola.info("  📁 api/.env (with defaults), api/.env.example (template)");
      }
      consola.info("  💡 Update .env files with your actual API keys and credentials");
    } else {
      // For single package projects: generate both .env and .env.example at root
      const allVars = envConfig.variables;

      // .env with development defaults (for immediate use)
      const envContent = formatEnvFile(allVars, "development").replace(
        "# Environment variables for development",
        "# Development environment variables\n# Auto-generated by Precast CLI"
      );
      await fs.writeFile(path.join(config.projectPath, ".env"), envContent);

      // .env.example as template (with placeholder values)
      const exampleVars = allVars.map((v) => ({
        ...v,
        value: v.required ? v.development || v.value || "REPLACE_ME" : "",
        development: undefined,
        production: undefined,
      }));
      const exampleContent = formatEnvFile(exampleVars, "development").replace(
        "# Environment variables for development",
        "# Environment variables template\n# Copy values from .env or update as needed"
      );
      await fs.writeFile(path.join(config.projectPath, ".env.example"), exampleContent);

      // Update root .gitignore
      await updateGitignore(config.projectPath);

      consola.success("Generated environment files: .env (with defaults), .env.example (template)");
      consola.info("  💡 Update .env with your actual API keys and credentials");
      consola.info("  📝 .env.example serves as a template for team members");
    }

    // Log notes if any
    if (envConfig.additionalNotes && envConfig.additionalNotes.length > 0) {
      consola.info("Environment setup notes:");
      for (const note of envConfig.additionalNotes) {
        consola.info(`  • ${note}`);
      }
    }
  } catch (error) {
    consola.error("Failed to generate environment files:", error);
    throw error;
  }
}

/**
 * Update .gitignore file to exclude environment files
 */
async function updateGitignore(dirPath: string): Promise<void> {
  const gitignorePath = path.join(dirPath, ".gitignore");

  const envEntries = [
    ".env",
    ".env.local",
    ".env.development",
    ".env.development.local",
    ".env.production",
    ".env.production.local",
    "!.env.example",
  ];

  if (await fs.pathExists(gitignorePath)) {
    let gitignoreContent = await fs.readFile(gitignorePath, "utf-8");

    let hasEnvEntries = false;
    for (const entry of envEntries) {
      if (!gitignoreContent.includes(entry)) {
        if (!hasEnvEntries) {
          gitignoreContent += "\n# Environment variables\n";
          hasEnvEntries = true;
        }
        gitignoreContent += `${entry}\n`;
      }
    }

    if (hasEnvEntries) {
      await fs.writeFile(gitignorePath, gitignoreContent);
    }
  } else {
    // Create .gitignore if it doesn't exist
    const gitignoreContent = `# Environment variables\n${envEntries.join("\n")}\n`;
    await fs.writeFile(gitignorePath, gitignoreContent);
  }
}

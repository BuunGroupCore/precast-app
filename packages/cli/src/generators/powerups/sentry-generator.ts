import * as path from "path";

import { consola } from "consola";
import fsExtra from "fs-extra";

// eslint-disable-next-line import/no-named-as-default-member
const { writeFile, pathExists, readFile, ensureDir } = fsExtra;

import type { ProjectConfig } from "../../../../shared/stack-config.js";
import { createTemplateEngine } from "../../core/template-engine.js";
import { getTemplateRoot } from "../../utils/template-path.js";
import { installDependencies } from "../../utils/package-manager.js";

export interface SentryConfig {
  framework: string;
  typescript: boolean;
  projectPath: string;
  packageManager: string;
}

/**
 * Generate Sentry error tracking setup for the project
 */
export async function generateSentryTemplate(config: SentryConfig): Promise<void> {
  consola.info("🛡️ Setting up Sentry error tracking...");

  try {
    const templateRoot = getTemplateRoot();
    const templateEngine = createTemplateEngine(templateRoot);

    // Install Sentry packages
    await installSentryPackages(config);

    // Copy Sentry configuration files
    await copySentryTemplates(config, templateEngine);

    // Update environment variables
    await updateEnvFile(config);

    consola.success("✅ Sentry error tracking setup complete!");

    // Show next steps
    showNextSteps(config);
  } catch (error) {
    consola.warn("Failed to setup Sentry:", error);
  }
}

async function installSentryPackages(config: SentryConfig): Promise<void> {
  const packages: string[] = [];
  const devPackages: string[] = [];

  // Get framework-specific packages
  switch (config.framework) {
    case "react":
      packages.push("@sentry/react");
      break;
    case "next":
      packages.push("@sentry/nextjs");
      devPackages.push("@sentry/cli");
      break;
    case "vue":
      packages.push("@sentry/vue");
      break;
    case "nuxt":
      packages.push("@sentry/nuxt");
      break;
    case "angular":
      packages.push("@sentry/angular");
      break;
    case "svelte":
      packages.push("@sentry/svelte");
      break;
    case "solid":
      packages.push("@sentry/browser");
      break;
    case "remix":
      packages.push("@sentry/remix");
      break;
    case "astro":
      packages.push("@sentry/astro");
      break;
    case "vite":
      packages.push("@sentry/react", "@sentry/vite-plugin");
      devPackages.push("@sentry/vite-plugin");
      break;
    case "vanilla":
      packages.push("@sentry/browser");
      break;
    default:
      packages.push("@sentry/browser");
  }

  // Install packages
  if (packages.length > 0 || devPackages.length > 0) {
    consola.info("📦 Installing Sentry packages...");

    if (packages.length > 0) {
      await installDependencies(packages, {
        packageManager: config.packageManager,
        projectPath: config.projectPath,
        dev: false,
      });
    }

    if (devPackages.length > 0) {
      await installDependencies(devPackages, {
        packageManager: config.packageManager,
        projectPath: config.projectPath,
        dev: true,
      });
    }
  }
}

async function copySentryTemplates(config: SentryConfig, templateEngine: any): Promise<void> {
  const sentryContext = {
    ...config,
    dsn: process.env.SENTRY_DSN || "YOUR_SENTRY_DSN_HERE",
    environment: process.env.SENTRY_ENVIRONMENT || "development",
  };

  // Copy framework-specific Sentry configuration
  switch (config.framework) {
    case "react":
      await templateEngine.processTemplate(
        "powerups/sentry/react/instrument.js.hbs",
        path.join(config.projectPath, "src", "instrument.js"),
        sentryContext
      );
      await templateEngine.processTemplate(
        "powerups/sentry/react/sentry.js.hbs",
        path.join(config.projectPath, "src", "sentry.js"),
        sentryContext
      );
      break;

    case "next":
      await templateEngine.processTemplate(
        "powerups/sentry/next/sentry.base.config.js.hbs",
        path.join(config.projectPath, "sentry.base.config.js"),
        sentryContext
      );
      await templateEngine.processTemplate(
        "powerups/sentry/next/sentry.client.config.js.hbs",
        path.join(config.projectPath, "sentry.client.config.js"),
        sentryContext
      );
      await templateEngine.processTemplate(
        "powerups/sentry/next/sentry.server.config.js.hbs",
        path.join(config.projectPath, "sentry.server.config.js"),
        sentryContext
      );
      await templateEngine.processTemplate(
        "powerups/sentry/next/sentry.edge.config.js.hbs",
        path.join(config.projectPath, "sentry.edge.config.js"),
        sentryContext
      );
      break;

    case "vue":
      await templateEngine.processTemplate(
        "powerups/sentry/vue/sentry.js.hbs",
        path.join(config.projectPath, "src", "sentry.js"),
        sentryContext
      );
      break;

    case "angular":
      await templateEngine.processTemplate(
        "powerups/sentry/angular/sentry.service.ts.hbs",
        path.join(config.projectPath, "src", "app", "sentry.service.ts"),
        sentryContext
      );
      break;

    // Add more framework-specific configurations as needed
  }
}

async function updateEnvFile(config: SentryConfig): Promise<void> {
  const envPath = path.join(config.projectPath, ".env");
  const envExamplePath = path.join(config.projectPath, ".env.example");

  const sentryEnvVars = `
# Sentry Error Tracking
SENTRY_DSN=
SENTRY_ORG=
SENTRY_PROJECT=
SENTRY_AUTH_TOKEN=
SENTRY_ENVIRONMENT=development
`;

  // Append to existing .env or create new one
  for (const filePath of [envPath, envExamplePath]) {
    let content = "";
    if (await pathExists(filePath)) {
      content = await readFile(filePath, "utf-8");
      if (!content.includes("# Sentry Error Tracking")) {
        content += "\n" + sentryEnvVars;
      }
    } else {
      content = sentryEnvVars;
    }
    await writeFile(filePath, content);
  }
}

function showNextSteps(config: SentryConfig): void {
  consola.info("\n📝 Next steps for Sentry setup:");

  const steps: string[] = [];

  steps.push("1. Create a Sentry account at https://sentry.io");
  steps.push("2. Create a new project and get your DSN");
  steps.push("3. Update SENTRY_DSN in your .env file");
  steps.push("4. Configure source maps for production builds");
  steps.push("5. Test error tracking with Sentry.captureException()");

  steps.forEach((step) => consola.info(`  ${step}`));

  consola.info("\n📚 Documentation:");
  consola.info("  Sentry Docs: https://docs.sentry.io");
}

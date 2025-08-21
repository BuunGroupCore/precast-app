import { type ProjectConfig } from "@shared/stack-config.js";

import { createTemplateEngine } from "@/core/template-engine.js";
import { generateConvexTemplate } from "@/generators/backends/convex-template.js";
import { generateFastApiTemplate } from "@/generators/backends/fastapi-template.js";
import { generateNoneTemplate } from "@/generators/backends/none-template.js";
import { generateAngularTemplate } from "@/generators/frameworks/angular-template.js";
import { generateAstroTemplate } from "@/generators/frameworks/astro-template.js";
import { generateNextTemplate } from "@/generators/frameworks/next-template.js";
import { generateNuxtTemplate } from "@/generators/frameworks/nuxt-template.js";
import { generateReactNativeTemplate } from "@/generators/frameworks/react-native-template.js";
import { generateReactTemplate } from "@/generators/frameworks/react-template.js";
import { generateSolidTemplate } from "@/generators/frameworks/solid-template.js";
import { generateSvelteTemplate } from "@/generators/frameworks/svelte-template.js";
import { generateTanStackStartTemplate } from "@/generators/frameworks/tanstack-start-template.js";
import { generateVanillaTemplate } from "@/generators/frameworks/vanilla-template.js";
import { generateViteTemplate } from "@/generators/frameworks/vite-template.js";
import { generateVueTemplate } from "@/generators/frameworks/vue-template.js";
import { setupAIContextFiles } from "@/utils/setup/ai-context-setup.js";
import { setupAuthentication } from "@/utils/setup/auth-setup.js";
import { setupClaudeIntegration } from "@/utils/setup/claude-setup.js";
import { errorCollector } from "@/utils/system/error-collector.js";
import { getTemplateRoot } from "@/utils/system/template-path.js";
import { logger } from "@/utils/ui/logger.js";

/**
 * Generate project template based on the selected framework.
 * Orchestrates the entire project generation process including framework templates,
 * AI integrations, database setup, authentication, and additional features.
 *
 * @param config - Complete project configuration object
 * @param projectPath - Absolute path where the project will be created
 */
export async function generateTemplate(config: ProjectConfig, projectPath: string) {
  logger.debug(`Generating ${config.framework} project...`);
  switch (config.framework) {
    case "react":
      await generateReactTemplate(config, projectPath);
      break;
    case "vue":
      await generateVueTemplate(config, projectPath);
      break;
    case "angular":
      await generateAngularTemplate(config, projectPath);
      break;
    case "next":
      await generateNextTemplate(config, projectPath);
      break;
    case "react-router": {
      const { generateReactRouterTemplate } = await import(
        "@/generators/frameworks/react-router-template.js"
      );
      await generateReactRouterTemplate(config, projectPath);
      break;
    }
    case "tanstack-router": {
      const { generateTanStackRouterTemplate } = await import(
        "@/generators/frameworks/tanstack-router-template.js"
      );
      await generateTanStackRouterTemplate(config, projectPath);
      break;
    }
    case "tanstack-start":
      await generateTanStackStartTemplate(config, projectPath);
      break;
    case "svelte":
      await generateSvelteTemplate(config, projectPath);
      break;
    case "nuxt":
      await generateNuxtTemplate(config, projectPath);
      break;
    case "fastapi":
      await generateFastApiTemplate(config, projectPath);
      break;
    case "convex":
      await generateConvexTemplate(config, projectPath);
      break;
    case "solid":
      await generateSolidTemplate(config, projectPath);
      break;
    case "astro":
      await generateAstroTemplate(config, projectPath);
      break;
    case "vite":
      await generateViteTemplate(config, projectPath);
      break;
    case "vanilla":
      await generateVanillaTemplate(config, projectPath);
      break;
    case "react-native":
      await generateReactNativeTemplate(config, projectPath);
      break;
    case "none":
      await generateNoneTemplate(config, projectPath);
      break;
    default:
      throw new Error(`Unknown framework: ${config.framework}`);
  }
  logger.debug(`${config.framework} project generated successfully`);
  const templateRoot = getTemplateRoot();
  const templateEngine = createTemplateEngine(templateRoot);

  if (config.aiAssistant === "claude") {
    await setupClaudeIntegration(config, projectPath);

    if (config.mcpServers && config.mcpServers.length > 0) {
      try {
        const { setupMCPConfiguration } = await import("@/utils/setup/mcp-setup.js");
        await setupMCPConfiguration(projectPath, config);
      } catch (error) {
        logger.warn(`Failed to setup MCP configuration: ${error}`);
        errorCollector.addError("MCP configuration setup", error);
      }
    }
  }

  if (config.aiAssistant && config.aiAssistant !== "none") {
    await setupAIContextFiles(config, projectPath, templateEngine);
  }

  if (
    config.colorPalette &&
    (config.styling === "css" || config.styling === "tailwind" || config.styling === "scss")
  ) {
    try {
      const { setupColorPalette } = await import("@/utils/setup/color-palette-setup.js");
      await setupColorPalette(config, projectPath);
    } catch (error) {
      logger.warn(`Failed to setup color palette: ${error}`);
      errorCollector.addError("Color palette setup", error);
    }
  }

  if (config.database && config.database !== "none") {
    try {
      const { setupDatabase } = await import("@/utils/setup/database-setup.js");
      await setupDatabase(config, projectPath);
    } catch (error) {
      logger.warn(`Failed to setup database configuration: ${error}`);
      errorCollector.addError("Database configuration setup", error);
    }
  }

  if (config.authProvider) {
    await setupAuthentication(config, config.authProvider);
  }

  if (config.powerups && config.powerups.length > 0) {
    try {
      const { setupPowerUps } = await import("@/utils/setup/powerups-setup.js");
      await setupPowerUps(projectPath, config.framework, config.powerups, config.typescript);
    } catch (error) {
      logger.warn(`Failed to setup powerups: ${error}`);
      errorCollector.addError("Powerups setup", error);
    }
  }

  if (config.plugins && config.plugins.length > 0) {
    try {
      const { setupPlugins } = await import("@/utils/setup/plugins-setup.js");
      await setupPlugins(config, projectPath, config.plugins);
    } catch (error) {
      logger.warn(`Failed to setup plugins: ${error}`);
      errorCollector.addError("Plugins setup", error);
    }
  }

  const shouldSetupAdminPanel =
    (config.plugins && config.plugins.length > 0) ||
    (config.database && config.database !== "none") ||
    (config.authProvider && config.authProvider !== "none");

  if (shouldSetupAdminPanel) {
    try {
      const { setupPrecastWidget } = await import("@/utils/setup/plugins-setup.js");
      await setupPrecastWidget(config, projectPath);
    } catch (error) {
      logger.warn(`Failed to setup admin panel: ${error}`);
      errorCollector.addError("Admin panel setup", error);
    }
  }

  let dockerPasswords: Record<string, string> | undefined;
  if (config.docker && config.database && config.database !== "none") {
    try {
      logger.debug(`Setting up Docker for database: ${config.database}`);
      const { setupDockerCompose } = await import("@/utils/docker/docker-setup.js");
      const result = await setupDockerCompose(config, projectPath);
      dockerPasswords = result.passwords;
      logger.debug(`Docker setup completed for ${config.database}`);
    } catch (error) {
      logger.warn(`Failed to setup Docker configuration: ${error}`);
      errorCollector.addError("Docker configuration setup", error);
    }
  } else {
    logger.debug(`Skipping Docker setup: docker=${config.docker}, database=${config.database}`);
  }

  try {
    const { generateEnvFiles } = await import("@/utils/config/env-setup.js");
    await generateEnvFiles(config, dockerPasswords);
    logger.verbose("✅ Environment files generated (.env, .env.example)");
  } catch (error) {
    logger.warn(`Failed to generate environment files: ${error}`);
    errorCollector.addError("Environment file generation", error);
  }
}

import { type ProjectConfig } from "../../../shared/stack-config.js";
import { createTemplateEngine } from "../core/template-engine.js";
import { setupAIContextFiles } from "../utils/ai-context-setup.js";
import { setupAuthentication } from "../utils/auth-setup.js";
import { setupClaudeIntegration } from "../utils/claude-setup.js";
import { logger } from "../utils/logger.js";
import { getTemplateRoot } from "../utils/template-path.js";
import { errorCollector } from "../utils/error-collector.js";

import { generateAngularTemplate } from "./angular-template.js";
import { generateAstroTemplate } from "./astro-template.js";
import { generateConvexTemplate } from "./convex-template.js";
import { generateFastApiTemplate } from "./fastapi-template.js";
import { generateNextTemplate } from "./next-template.js";
import { generateNoneTemplate } from "./none-template.js";
import { generateNuxtTemplate } from "./nuxt-template.js";
import { generateReactNativeTemplate } from "./react-native-template.js";
import { generateReactTemplate } from "./react-template.js";
import { generateRemixTemplate } from "./remix-template.js";
import { generateSolidTemplate } from "./solid-template.js";
import { generateSvelteTemplate } from "./svelte-template.js";
import { generateTanStackStartTemplate } from "./tanstack-start-template.js";
import { generateVanillaTemplate } from "./vanilla-template.js";
import { generateViteTemplate } from "./vite-template.js";
import { generateVueTemplate } from "./vue-template.js";
/**
 * Generate project template based on the selected framework
 * @param config - Project configuration
 * @param projectPath - Path where the project will be created
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
    case "remix":
      await generateRemixTemplate(config, projectPath);
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
    case "tanstack-start":
      await generateTanStackStartTemplate(config, projectPath);
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

  // Only setup Claude/MCP integration if explicitly selected
  if (config.aiAssistant === "claude") {
    await setupClaudeIntegration(config, projectPath);

    try {
      const { setupMCPConfiguration } = await import("../utils/mcp-setup.js");
      await setupMCPConfiguration(projectPath, config);
    } catch (error) {
      logger.warn(`Failed to setup MCP configuration: ${error}`);
      errorCollector.addError("MCP configuration setup", error);
    }
  }

  // Setup AI context files if any AI assistant is selected
  if (config.aiAssistant && config.aiAssistant !== "none") {
    await setupAIContextFiles(config, projectPath, templateEngine);
  }

  // Setup color palette if selected
  if (
    config.colorPalette &&
    (config.styling === "css" || config.styling === "tailwind" || config.styling === "scss")
  ) {
    try {
      const { setupColorPalette } = await import("../utils/color-palette-setup.js");
      await setupColorPalette(config, projectPath);
    } catch (error) {
      logger.warn(`Failed to setup color palette: ${error}`);
      errorCollector.addError("Color palette setup", error);
    }
  }

  // Setup database-specific files and configurations
  if (config.database && config.database !== "none") {
    try {
      const { setupDatabase } = await import("../utils/database-setup.js");
      await setupDatabase(config, projectPath);
    } catch (error) {
      logger.warn(`Failed to setup database configuration: ${error}`);
      errorCollector.addError("Database configuration setup", error);
    }
  }

  if (config.authProvider) {
    await setupAuthentication(config, config.authProvider);
  }

  // Setup powerups (monitoring, testing, linting tools)
  if (config.powerups && config.powerups.length > 0) {
    try {
      const { setupPowerUps } = await import("../utils/powerups-setup.js");
      await setupPowerUps(projectPath, config.framework, config.powerups, config.typescript);
    } catch (error) {
      logger.warn(`Failed to setup powerups: ${error}`);
      errorCollector.addError("Powerups setup", error);
    }
  }

  // Setup plugins
  if (config.plugins && config.plugins.length > 0) {
    try {
      const { setupPlugins } = await import("../utils/plugins-setup.js");
      await setupPlugins(config, projectPath, config.plugins);
    } catch (error) {
      logger.warn(`Failed to setup plugins: ${error}`);
      errorCollector.addError("Plugins setup", error);
    }
  }

  // Automatically setup admin panel if project has plugins, database, or auth
  const shouldSetupAdminPanel =
    (config.plugins && config.plugins.length > 0) ||
    (config.database && config.database !== "none") ||
    (config.authProvider && config.authProvider !== "none");

  if (shouldSetupAdminPanel) {
    try {
      const { setupPrecastWidget } = await import("../utils/plugins-setup.js");
      await setupPrecastWidget(config, projectPath);
    } catch (error) {
      logger.warn(`Failed to setup admin panel: ${error}`);
      errorCollector.addError("Admin panel setup", error);
    }
  }

  // Setup Docker configuration first if requested (to get generated passwords)
  let dockerPasswords: Record<string, string> | undefined;
  if (config.docker && config.database && config.database !== "none") {
    try {
      const { setupDockerCompose } = await import("../utils/docker-setup.js");
      const result = await setupDockerCompose(config, projectPath);
      dockerPasswords = result.passwords;
    } catch (error) {
      logger.warn(`Failed to setup Docker configuration: ${error}`);
      errorCollector.addError("Docker configuration setup", error);
    }
  }

  // Generate environment files based on all configured features
  try {
    const { generateEnvFiles } = await import("../utils/env-setup.js");
    await generateEnvFiles(config, dockerPasswords);
    logger.verbose("✅ Environment files generated (.env, .env.example)");
  } catch (error) {
    logger.warn(`Failed to generate environment files: ${error}`);
    errorCollector.addError("Environment file generation", error);
  }
}

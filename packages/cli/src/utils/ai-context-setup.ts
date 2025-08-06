import path from "path";

import { consola } from "consola";

import type { ProjectConfig } from "../../../shared/stack-config.js";
import type { TemplateEngine } from "../core/template-engine.js";

/**
 * Setup AI context files for various AI coding assistants
 * @param config - Project configuration
 * @param projectPath - Path to the project directory
 * @param templateEngine - Template engine instance
 */
export async function setupAIContextFiles(
  config: ProjectConfig,
  projectPath: string,
  templateEngine: TemplateEngine
): Promise<void> {
  if (!config.aiAssistant || config.aiAssistant === "none") {
    return;
  }

  consola.info(`🤖 Setting up ${config.aiAssistant} context files...`);

  try {
    switch (config.aiAssistant) {
      case "claude":
        // Handled by setupClaudeIntegration in generators/index.ts
        break;
      case "copilot":
        await templateEngine.processTemplate(
          path.join(
            templateEngine["templateRoot"],
            "ai-context/.github/copilot-instructions.md.hbs"
          ),
          path.join(projectPath, ".github", "copilot-instructions.md"),
          config
        );
        break;
      case "gemini":
        await templateEngine.processTemplate(
          path.join(templateEngine["templateRoot"], "ai-context/GEMINI.md.hbs"),
          path.join(projectPath, "GEMINI.md"),
          config
        );
        break;
      case "cursor":
        await templateEngine.processTemplate(
          path.join(templateEngine["templateRoot"], "ai-context/.cursorrules.hbs"),
          path.join(projectPath, ".cursorrules"),
          config
        );
        break;
      default:
        consola.warn(`Unknown AI assistant: ${config.aiAssistant}`);
    }
  } catch (error) {
    consola.warn(`Failed to create ${config.aiAssistant} context file:`, error);
  }
}

import path from "path";

import { consola } from "consola";

import type { ProjectConfig } from "../../../shared/stack-config.js";
import type { TemplateEngine } from "../core/template-engine.js";
export async function setupAIContextFiles(
  config: ProjectConfig,
  projectPath: string,
  templateEngine: TemplateEngine
): Promise<void> {
  if (!config.aiContext || config.aiContext.length === 0) {
    return;
  }
  consola.info("Setting up AI context files...");
  for (const context of config.aiContext) {
    try {
      switch (context) {
        case "claude":
          await templateEngine.processTemplate(
            "ai-context/CLAUDE.md.hbs",
            path.join(projectPath, "CLAUDE.md"),
            config
          );
          break;
        case "copilot":
          await templateEngine.processTemplate(
            "ai-context/.github/copilot-instructions.md.hbs",
            path.join(projectPath, ".github", "copilot-instructions.md"),
            config
          );
          break;
        case "gemini":
          await templateEngine.processTemplate(
            "ai-context/GEMINI.md.hbs",
            path.join(projectPath, "GEMINI.md"),
            config
          );
          break;
        case "cursor":
          await templateEngine.processTemplate(
            "ai-context/.cursorrules.hbs",
            path.join(projectPath, ".cursorrules"),
            config
          );
          break;
      }
    } catch (error) {
      consola.warn(`Failed to create ${context} context file:`, error);
    }
  }
}

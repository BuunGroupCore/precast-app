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
  consola.info("🤖 Setting up AI context files...");
  for (const context of config.aiContext) {
    try {
      switch (context) {
        case "claude":
          // Claude context is now handled by setupClaudeIntegration
          // which creates both .claude/settings.json and CLAUDE.md
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
      }
    } catch (error) {
      consola.warn(`Failed to create ${context} context file:`, error);
    }
  }
}

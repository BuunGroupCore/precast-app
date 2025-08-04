import path from "path";
import { fileURLToPath } from "url";

import { consola } from "consola";

import { type ProjectConfig } from "../../../shared/stack-config.js";
import { getPluginManager } from "../core/plugin-manager.js";
import { createTemplateEngine } from "../core/template-engine.js";
import { getTemplateRoot } from "../utils/template-path.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function generateVueTemplate(config: ProjectConfig, projectPath: string) {
  // Initialize template engine
  const templateRoot = getTemplateRoot();
  const templateEngine = createTemplateEngine(templateRoot);

  // Get plugin manager
  const pluginManager = getPluginManager();

  // Create plugin context
  const context = {
    config,
    projectPath,
    templateEngine,
    logger: consola,
  };

  try {
    // Run pre-generate hooks
    await pluginManager.runPreGenerate(context);

    // Copy base Vue templates
    await templateEngine.copyTemplateDirectory("frameworks/vue/base", projectPath, config, {
      overwrite: true,
    });

    // Copy src directory templates
    await templateEngine.copyTemplateDirectory(
      "frameworks/vue/src",
      path.join(projectPath, "src"),
      config,
      { overwrite: true }
    );

    // Run generate hooks
    await pluginManager.runGenerate(context);

    // Run post-generate hooks
    await pluginManager.runPostGenerate(context);

    consola.success("Vue project generated successfully!");
  } catch (error) {
    consola.error("Failed to generate Vue project:", error);
    throw error;
  }
}

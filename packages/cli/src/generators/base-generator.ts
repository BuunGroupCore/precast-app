import path from "path";

import { consola } from "consola";

import { type ProjectConfig } from "../../../shared/stack-config.js";
import { getPluginManager } from "../core/plugin-manager.js";
import { createTemplateEngine } from "../core/template-engine.js";
import { getTemplateRoot } from "../utils/template-path.js";

export async function generateBaseTemplate(
  framework: string,
  config: ProjectConfig,
  projectPath: string,
  additionalDirs: { source: string; dest: string }[] = []
) {
  const templateRoot = getTemplateRoot();
  const templateEngine = createTemplateEngine(templateRoot);
  const pluginManager = getPluginManager();

  const context = {
    config,
    projectPath,
    templateEngine,
    logger: consola,
  };

  try {
    await pluginManager.runPreGenerate(context);

    await templateEngine.copyTemplateDirectory(
      `frameworks/${framework}/base`,
      projectPath,
      config,
      {
        overwrite: true,
      }
    );

    const srcDir = `frameworks/${framework}/src`;

    if (
      await templateEngine
        .getAvailableTemplates(`frameworks/${framework}`)
        .then((dirs) => dirs.includes("src"))
    ) {
      await templateEngine.copyTemplateDirectory(srcDir, path.join(projectPath, "src"), config, {
        overwrite: true,
      });
    }

    for (const dir of additionalDirs) {
      await templateEngine.copyTemplateDirectory(
        dir.source,
        path.join(projectPath, dir.dest),
        config,
        { overwrite: true }
      );
    }

    await pluginManager.runGenerate(context);
    await pluginManager.runPostGenerate(context);

    consola.success(
      `${framework.charAt(0).toUpperCase() + framework.slice(1)} project generated successfully!`
    );
  } catch (error) {
    consola.error(`Failed to generate ${framework} project:`, error);
    throw error;
  }
}

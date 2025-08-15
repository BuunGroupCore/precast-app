import path from "path";

import { type ProjectConfig } from "@shared/stack-config.js";

import { createTemplateEngine } from "@/core/template-engine.js";
import { getTemplateRoot } from "@/utils/system/template-path.js";
import { logger } from "@/utils/ui/logger.js";

/**
 * Generate a Convex backend template
 */
export async function generateConvexTemplate(config: ProjectConfig, projectPath: string) {
  const templateRoot = getTemplateRoot();
  const templateEngine = createTemplateEngine(templateRoot);

  try {
    logger.verbose("Generating Convex backend...");

    await templateEngine.copyTemplateDirectory(`backends/convex/base`, projectPath, config, {
      overwrite: true,
    });
    const srcDir = `backends/convex/src`;
    if (
      await templateEngine
        .getAvailableTemplates(`backends/convex`)
        .then((dirs) => dirs.includes("src"))
    ) {
      await templateEngine.copyTemplateDirectory(srcDir, path.join(projectPath, "convex"), config, {
        overwrite: true,
      });
    }

    logger.verbose("Convex backend generated successfully!");
  } catch (error) {
    logger.error(`Failed to generate Convex backend: ${error}`);
    throw error;
  }
}

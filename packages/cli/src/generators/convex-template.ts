import path from "path";

import { type ProjectConfig } from "../../../shared/stack-config.js";
import { createTemplateEngine } from "../core/template-engine.js";
import { logger } from "../utils/logger.js";
import { getTemplateRoot } from "../utils/template-path.js";

/**
 * Generate a Convex backend template
 * @param config - Project configuration
 * @param projectPath - Path where the project will be created
 */
export async function generateConvexTemplate(config: ProjectConfig, projectPath: string) {
  const templateRoot = getTemplateRoot();
  const templateEngine = createTemplateEngine(templateRoot);

  try {
    logger.verbose("Generating Convex backend...");

    // Copy base Convex files
    await templateEngine.copyTemplateDirectory(`backends/convex/base`, projectPath, config, {
      overwrite: true,
    });

    // Copy Convex source files (convex functions)
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

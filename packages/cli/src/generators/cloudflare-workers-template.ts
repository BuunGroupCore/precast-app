import path from "path";

import { logger } from "../utils/logger.js";

import { type ProjectConfig } from "../../../shared/stack-config.js";

import { createTemplateEngine } from "@/core/template-engine.js";
import { getTemplateRoot } from "@/utils/template-path.js";

/**
 * Generate a Cloudflare Workers project template
 * @param config - Project configuration
 * @param projectPath - Path where the project will be created
 */
export async function generateCloudflareWorkersTemplate(
  config: ProjectConfig,
  projectPath: string
) {
  const templateRoot = getTemplateRoot();
  const templateEngine = createTemplateEngine(templateRoot);

  try {
    logger.verbose("Generating Cloudflare Workers backend...");

    await templateEngine.copyTemplateDirectory(
      "backends/cloudflare-workers/base",
      projectPath,
      config,
      {
        overwrite: true,
      }
    );

    const srcDir = "backends/cloudflare-workers/src";
    if (
      await templateEngine
        .getAvailableTemplates("backends/cloudflare-workers")
        .then((dirs) => dirs.includes("src"))
    ) {
      await templateEngine.copyTemplateDirectory(srcDir, path.join(projectPath, "src"), config, {
        overwrite: true,
      });
    }

    logger.verbose("Cloudflare Workers backend generated successfully!");
  } catch (error) {
    logger.error(`Failed to generate Cloudflare Workers backend: ${error}`);
    throw error;
  }
}

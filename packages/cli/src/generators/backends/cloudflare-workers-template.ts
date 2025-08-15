import path from "path";

import { type ProjectConfig } from "@shared/stack-config.js";

import { createTemplateEngine } from "@/core/template-engine.js";
import { getTemplateRoot } from "@/utils/system/template-path.js";
import { logger } from "@/utils/ui/logger.js";

/**
 * Generate a Cloudflare Workers project template
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

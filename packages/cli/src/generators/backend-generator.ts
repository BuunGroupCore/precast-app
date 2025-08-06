import path from "path";

import { consola } from "consola";

import { type ProjectConfig } from "../../../shared/stack-config.js";
import { createTemplateEngine } from "../core/template-engine.js";
import { getTemplateRoot } from "../utils/template-path.js";

/**
 * Generate backend template files for the specified backend framework
 * @param backend - Backend framework name
 * @param config - Project configuration
 * @param projectPath - Path where backend files will be generated
 */
export async function generateBackendTemplate(
  backend: string,
  config: ProjectConfig,
  projectPath: string
) {
  if (backend === "next-api") {
    consola.info("Next.js API routes are integrated into the Next.js framework");
    return;
  }

  const templateRoot = getTemplateRoot();
  const templateEngine = createTemplateEngine(templateRoot);

  try {
    consola.info(`Generating ${backend} backend...`);

    await templateEngine.copyTemplateDirectory(`backends/${backend}/base`, projectPath, config, {
      overwrite: true,
    });

    const srcDir = `backends/${backend}/src`;
    if (
      await templateEngine
        .getAvailableTemplates(`backends/${backend}`)
        .then((dirs) => dirs.includes("src"))
    ) {
      await templateEngine.copyTemplateDirectory(srcDir, path.join(projectPath, "src"), config, {
        overwrite: true,
      });
    }

    consola.success(`${backend} backend generated successfully!`);
  } catch (error) {
    consola.error(`Failed to generate ${backend} backend:`, error);
    throw error;
  }
}

/**
 * Check if a backend framework is supported
 * @param backend - Backend framework name to validate
 * @returns True if the backend is supported
 */
export function isValidBackend(backend: string): boolean {
  const validBackends = ["node", "express", "fastify", "hono", "nestjs", "koa", "next-api"];
  return validBackends.includes(backend);
}

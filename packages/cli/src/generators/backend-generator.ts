import path from "path";

import { consola } from "consola";

import { type ProjectConfig } from "../../../shared/stack-config.js";
import { createTemplateEngine } from "../core/template-engine.js";
import { getTemplateRoot } from "../utils/template-path.js";

export async function generateBackendTemplate(
  backend: string,
  config: ProjectConfig,
  projectPath: string
) {
  // Skip generation for next-api as it's integrated into Next.js
  if (backend === "next-api") {
    consola.info("Next.js API routes are integrated into the Next.js framework");
    return;
  }

  const templateRoot = getTemplateRoot();
  const templateEngine = createTemplateEngine(templateRoot);

  try {
    consola.info(`Generating ${backend} backend...`);

    // Copy backend base files (package.json, tsconfig, etc.)
    await templateEngine.copyTemplateDirectory(`backends/${backend}/base`, projectPath, config, {
      overwrite: true,
    });

    // Copy backend source files
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

    // Environment file will be created from base template

    consola.success(`${backend} backend generated successfully!`);
  } catch (error) {
    consola.error(`Failed to generate ${backend} backend:`, error);
    throw error;
  }
}

export function isValidBackend(backend: string): boolean {
  const validBackends = ["node", "express", "fastify", "hono", "nestjs", "koa", "next-api"];
  return validBackends.includes(backend);
}

import path from "path";

import { type ProjectConfig } from "@shared/stack-config.js";
import { consola } from "consola";

import { createTemplateEngine } from "@/core/template-engine.js";
import { getTemplateRoot } from "@/utils/system/template-path.js";
import { logger } from "@/utils/ui/logger.js";

/**
 * Generate backend template files for the specified backend framework
 */
export async function generateBackendTemplate(
  backend: string,
  config: ProjectConfig,
  projectPath: string
) {
  if (backend === "next-api") {
    logger.verbose("Next.js API routes are integrated into the Next.js framework");
    return;
  }

  if (backend === "cloudflare-workers") {
    const { generateCloudflareWorkersTemplate } = await import(
      "@/generators/backends/cloudflare-workers-template.js"
    );
    await generateCloudflareWorkersTemplate(config, projectPath);
    return;
  }

  if (backend === "fastapi") {
    const { generateFastApiTemplate } = await import("@/generators/backends/fastapi-template.js");
    await generateFastApiTemplate(config, projectPath);
    return;
  }

  if (backend === "convex") {
    const { generateConvexTemplate } = await import("@/generators/backends/convex-template.js");
    await generateConvexTemplate(config, projectPath);
    return;
  }

  const templateRoot = getTemplateRoot();
  const templateEngine = createTemplateEngine(templateRoot);

  try {
    logger.verbose(`Generating ${backend} backend...`);

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

    const sharedDir = `backends/shared`;
    if (
      await templateEngine.getAvailableTemplates("backends").then((dirs) => dirs.includes("shared"))
    ) {
      await templateEngine.copyTemplateDirectory(sharedDir, projectPath, config, {
        overwrite: false,
      });
    }

    logger.verbose(`${backend} backend generated successfully!`);
  } catch (error) {
    consola.error(`Failed to generate ${backend} backend:`, error);
    throw error;
  }
}

/**
 * Check if a backend framework is supported
 */
export function isValidBackend(backend: string): boolean {
  const validBackends = [
    "node",
    "express",
    "fastify",
    "hono",
    "nestjs",
    "koa",
    "next-api",
    "cloudflare-workers",
    "fastapi",
    "convex",
  ];
  return validBackends.includes(backend);
}

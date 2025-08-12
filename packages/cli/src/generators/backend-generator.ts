import path from "path";

import { consola } from "consola";
import { logger } from "../utils/logger.js";

import { type ProjectConfig } from "../../../shared/stack-config.js";

import { createTemplateEngine } from "@/core/template-engine.js";
import { getTemplateRoot } from "@/utils/template-path.js";

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
    logger.verbose("Next.js API routes are integrated into the Next.js framework");
    return;
  }

  if (backend === "cloudflare-workers") {
    const { generateCloudflareWorkersTemplate } = await import(
      "@/generators/cloudflare-workers-template.js"
    );
    await generateCloudflareWorkersTemplate(config, projectPath);
    return;
  }

  if (backend === "fastapi") {
    const { generateFastApiTemplate } = await import("@/generators/fastapi-template.js");
    await generateFastApiTemplate(config, projectPath);
    return;
  }

  if (backend === "convex") {
    const { generateConvexTemplate } = await import("@/generators/convex-template.js");
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

    // Copy shared backend files (README, etc.)
    const sharedDir = `backends/shared`;
    if (
      await templateEngine.getAvailableTemplates("backends").then((dirs) => dirs.includes("shared"))
    ) {
      await templateEngine.copyTemplateDirectory(sharedDir, projectPath, config, {
        overwrite: false, // Don't overwrite existing files
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
 * @param backend - Backend framework name to validate
 * @returns True if the backend is supported
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

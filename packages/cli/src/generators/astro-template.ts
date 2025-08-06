import { type ProjectConfig } from "../../../shared/stack-config.js";

import { generateBaseTemplate } from "./base-generator.js";

/**
 * Generate an Astro project template
 * @param config - Project configuration
 * @param projectPath - Path where the project will be created
 */
export async function generateAstroTemplate(config: ProjectConfig, projectPath: string) {
  await generateBaseTemplate("astro", config, projectPath);
}

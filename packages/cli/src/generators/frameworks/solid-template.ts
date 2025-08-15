import { type ProjectConfig } from "@shared/stack-config.js";

import { generateBaseTemplate } from "@/generators/base-generator.js";

/**
 * Generate a Solid.js project template
 * @param config - Project configuration
 * @param projectPath - Path where the project will be created
 */
export async function generateSolidTemplate(config: ProjectConfig, projectPath: string) {
  await generateBaseTemplate("solid", config, projectPath);
}

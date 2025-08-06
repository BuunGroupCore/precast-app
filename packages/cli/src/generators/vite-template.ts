import { type ProjectConfig } from "../../../shared/stack-config.js";

import { generateBaseTemplate } from "./base-generator.js";

/**
 * Generate a Vite project template
 * @param config - Project configuration
 * @param projectPath - Path where the project will be created
 */
export async function generateViteTemplate(config: ProjectConfig, projectPath: string) {
  await generateBaseTemplate("vite", config, projectPath);
}

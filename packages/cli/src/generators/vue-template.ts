import { type ProjectConfig } from "../../../shared/stack-config.js";

import { generateBaseTemplate } from "./base-generator.js";

/**
 * Generate a Vue project template
 * @param config - Project configuration
 * @param projectPath - Path where the project will be created
 */
export async function generateVueTemplate(config: ProjectConfig, projectPath: string) {
  await generateBaseTemplate("vue", config, projectPath);
}

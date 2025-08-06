import { type ProjectConfig } from "../../../shared/stack-config.js";

import { generateBaseTemplate } from "./base-generator.js";

/**
 * Generate a Remix project template
 * @param config - Project configuration
 * @param projectPath - Path where the project will be created
 */
export async function generateRemixTemplate(config: ProjectConfig, projectPath: string) {
  await generateBaseTemplate("remix", config, projectPath);
}

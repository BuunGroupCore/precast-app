import { type ProjectConfig } from "../../../shared/stack-config.js";

import { generateBaseTemplate } from "./base-generator.js";

/**
 * Generate a Vanilla JavaScript project template
 * @param config - Project configuration
 * @param projectPath - Path where the project will be created
 */
export async function generateVanillaTemplate(config: ProjectConfig, projectPath: string) {
  await generateBaseTemplate("vanilla", config, projectPath);
}

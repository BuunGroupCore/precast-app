import { type ProjectConfig } from "../../../shared/stack-config.js";

import { generateBaseTemplate } from "./base-generator.js";

/**
 * Generate a Next.js project template
 * @param config - Project configuration
 * @param projectPath - Path where the project will be created
 */
export async function generateNextTemplate(config: ProjectConfig, projectPath: string) {
  await generateBaseTemplate("next", config, projectPath);
}

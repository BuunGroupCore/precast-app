import { type ProjectConfig } from "@shared/stack-config.js";

import { generateBaseTemplate } from "@/generators/base-generator.js";

/**
 * Generate a Svelte project template
 * @param config - Project configuration
 * @param projectPath - Path where the project will be created
 */
export async function generateSvelteTemplate(config: ProjectConfig, projectPath: string) {
  await generateBaseTemplate("svelte", config, projectPath);
}

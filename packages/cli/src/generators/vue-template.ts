import { type ProjectConfig } from "../../../shared/stack-config.js";

import { generateBaseTemplate } from "./base-generator.js";

/**
 * Generate a Vue project template
 */
export async function generateVueTemplate(config: ProjectConfig, projectPath: string) {
  await generateBaseTemplate("vue", config, projectPath);
}

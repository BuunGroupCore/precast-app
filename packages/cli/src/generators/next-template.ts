import { type ProjectConfig } from "../../../shared/stack-config.js";

import { generateBaseTemplate } from "./base-generator.js";

/**
 * Generate a Next.js project template
 */
export async function generateNextTemplate(config: ProjectConfig, projectPath: string) {
  await generateBaseTemplate("next", config, projectPath);
}

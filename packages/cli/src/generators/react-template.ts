import { type ProjectConfig } from "../../../shared/stack-config.js";

import { generateBaseTemplate } from "./base-generator.js";

/**
 * Generate a React project template using the base generator
 */
export async function generateReactTemplate(config: ProjectConfig, projectPath: string) {
  await generateBaseTemplate("react", config, projectPath);
}

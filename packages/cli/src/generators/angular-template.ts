import { type ProjectConfig } from "../../../shared/stack-config.js";

import { generateBaseTemplate } from "./base-generator.js";

export async function generateAngularTemplate(config: ProjectConfig, projectPath: string) {
  await generateBaseTemplate("angular", config, projectPath);
}

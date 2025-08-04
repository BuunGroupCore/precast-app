import { type ProjectConfig } from "../../../shared/stack-config.js";

import { generateBaseTemplate } from "./base-generator.js";

export async function generateSolidTemplate(config: ProjectConfig, projectPath: string) {
  await generateBaseTemplate("solid", config, projectPath);
}

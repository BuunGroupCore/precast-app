import { type ProjectConfig } from "../../../shared/stack-config.js";

import { generateBaseTemplate } from "./base-generator.js";

export async function generateRemixTemplate(config: ProjectConfig, projectPath: string) {
  await generateBaseTemplate("remix", config, projectPath);
}

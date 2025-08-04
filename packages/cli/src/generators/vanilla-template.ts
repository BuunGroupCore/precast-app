import { type ProjectConfig } from "../../../shared/stack-config.js";

import { generateBaseTemplate } from "./base-generator.js";

export async function generateVanillaTemplate(config: ProjectConfig, projectPath: string) {
  await generateBaseTemplate("vanilla", config, projectPath);
}

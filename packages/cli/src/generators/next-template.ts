import { type ProjectConfig } from "../../../shared/stack-config.js";

import { generateBaseTemplate } from "./base-generator.js";

export async function generateNextTemplate(config: ProjectConfig, projectPath: string) {
  await generateBaseTemplate("next", config, projectPath);
}

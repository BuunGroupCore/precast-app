import { type ProjectConfig } from "../../../shared/stack-config.js";

import { generateBaseTemplate } from "./base-generator.js";

export async function generateReactTemplate(config: ProjectConfig, projectPath: string) {
  await generateBaseTemplate("react", config, projectPath);
}

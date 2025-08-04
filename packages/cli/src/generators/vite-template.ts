import { type ProjectConfig } from "../../../shared/stack-config.js";

import { generateBaseTemplate } from "./base-generator.js";

export async function generateViteTemplate(config: ProjectConfig, projectPath: string) {
  await generateBaseTemplate("vite", config, projectPath);
}

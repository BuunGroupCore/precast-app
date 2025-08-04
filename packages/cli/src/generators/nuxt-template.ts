import { type ProjectConfig } from "../../../shared/stack-config.js";

import { generateBaseTemplate } from "./base-generator.js";

export async function generateNuxtTemplate(config: ProjectConfig, projectPath: string) {
  await generateBaseTemplate("nuxt", config, projectPath);
}

import { type ProjectConfig } from "../../../shared/stack-config.js";

import { generateBaseTemplate } from "./base-generator.js";

export async function generateSvelteTemplate(config: ProjectConfig, projectPath: string) {
  await generateBaseTemplate("svelte", config, projectPath);
}

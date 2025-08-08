import { type ProjectConfig } from "../../../shared/stack-config.js";

import { generateBaseTemplate } from "./base-generator.js";

/**
 * Generate a Vite project template
 * @param config - Project configuration
 * @param projectPath - Path where the project will be created
 */
export async function generateViteTemplate(config: ProjectConfig, projectPath: string) {
  // Determine which Vite template to use based on UI framework
  let templateName = "vite";

  if (config.uiFramework) {
    // Use specific Vite + UI framework template
    templateName = `vite-${config.uiFramework}`;
  } else {
    // Default to vanilla Vite if no UI framework specified
    templateName = "vite";
  }

  await generateBaseTemplate(templateName, config, projectPath);
}

import { type ProjectConfig } from "../../../shared/stack-config.js";

import { generateBaseTemplate } from "./base-generator.js";

/**
 * Generate a React project template using the base generator.
 * Creates a standard React application with Vite bundling.
 *
 * @param config - Complete project configuration
 * @param projectPath - Absolute path where the project will be created
 */
export async function generateReactTemplate(config: ProjectConfig, projectPath: string) {
  await generateBaseTemplate("react", config, projectPath);
}

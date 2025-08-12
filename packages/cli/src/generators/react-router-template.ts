import { type ProjectConfig } from "../../../shared/stack-config.js";

import { generateBaseTemplate } from "./base-generator.js";

/**
 * Generate a React Router v7 project template
 * React Router v7 is the new version of Remix - a full-stack React framework
 * @param config - Project configuration
 * @param projectPath - Path where the project will be created
 */
export async function generateReactRouterTemplate(config: ProjectConfig, projectPath: string) {
  await generateBaseTemplate("react-router", config, projectPath);
}

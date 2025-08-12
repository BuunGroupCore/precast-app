import { type ProjectConfig } from "../../../shared/stack-config.js";

import { generateBaseTemplate } from "./base-generator.js";

/**
 * Generate a TanStack Router project template
 * TanStack Router is a type-safe SPA router for React with built-in data fetching
 * @param config - Project configuration
 * @param projectPath - Path where the project will be created
 */
export async function generateTanStackRouterTemplate(config: ProjectConfig, projectPath: string) {
  await generateBaseTemplate("tanstack-router", config, projectPath);
}

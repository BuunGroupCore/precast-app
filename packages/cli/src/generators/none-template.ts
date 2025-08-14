import type { ProjectConfig } from "../../../shared/stack-config.js";
import { logger } from "../utils/logger.js";

import { generateBackendTemplate } from "./backend-generator.js";

/**
 * Generate backend-only project template (no frontend framework)
 */
export async function generateNoneTemplate(
  config: ProjectConfig,
  projectPath: string
): Promise<void> {
  logger.verbose("Creating backend-only project structure...");

  if (config.backend && config.backend !== "none") {
    await generateBackendTemplate(config.backend, config, projectPath);
  } else {
    const { generateMinimalNodeTemplate } = await import("./minimal-node-template.js");
    await generateMinimalNodeTemplate(config, projectPath);
  }

  logger.verbose("Backend-only project structure created!");
}

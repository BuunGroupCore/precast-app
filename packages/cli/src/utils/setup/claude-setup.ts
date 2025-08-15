import type { ProjectConfig } from "@shared/stack-config.js";

import { generateClaudeTemplate } from "@/generators/features/claude-generator.js";

/**
 * Setup Claude Code integration for the project
 * @param config - Project configuration
 * @param projectPath - Path to the project directory
 */
export async function setupClaudeIntegration(
  config: ProjectConfig,
  projectPath: string
): Promise<void> {
  await generateClaudeTemplate({
    ...config,
    projectPath,
  });
}

export { generateClaudeTemplate } from "@/generators/features/claude-generator.js";

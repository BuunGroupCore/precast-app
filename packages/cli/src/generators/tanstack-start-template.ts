import { type ProjectConfig } from "../../../shared/stack-config.js";

import { generateBaseTemplate } from "@/generators/base-generator.js";

/**
 * Generate a TanStack Start project template
 */
export async function generateTanStackStartTemplate(
  config: ProjectConfig,
  projectPath: string
): Promise<void> {
  await generateBaseTemplate("tanstack-start", config, projectPath);
}

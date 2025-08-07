import { type ProjectConfig } from "../../../shared/stack-config.js";

import { generateBaseTemplate } from "./base-generator.js";

/**
 * Generate a React Native project template
 * @param config - Project configuration
 * @param projectPath - Path where the project will be created
 */
export async function generateReactNativeTemplate(config: ProjectConfig, projectPath: string) {
  await generateBaseTemplate("react-native", config, projectPath);
}

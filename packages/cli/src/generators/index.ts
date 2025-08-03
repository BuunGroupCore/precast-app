import { type ProjectConfig } from "../../../shared/stack-config.js";
import { generateReactTemplate } from "./react-template.js";
import { logger } from "../utils/logger.js";

export async function generateTemplate(
  config: ProjectConfig,
  projectPath: string,
) {
  logger.debug(`Generating ${config.framework} project...`);

  switch (config.framework) {
    case "react":
      await generateReactTemplate(config, projectPath);
      break;
      
    case "vue":
    case "angular":
    case "next":
    case "nuxt":
    case "svelte":
    case "solid":
    case "astro":
    case "remix":
    case "vite":
    case "vanilla":
      // TODO: Implement template-based generators for these frameworks
      throw new Error(`${config.framework} generator not yet implemented in new template system`);
      
    default:
      throw new Error(`Unknown framework: ${config.framework}`);
  }

  logger.debug(`${config.framework} project generated successfully`);
}
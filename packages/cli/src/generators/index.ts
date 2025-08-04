import { type ProjectConfig } from "../../../shared/stack-config.js";
import { logger } from "../utils/logger.js";

import { generateAngularTemplate } from "./angular-template.js";
import { generateAstroTemplate } from "./astro-template.js";
import { generateNextTemplate } from "./next-template.js";
import { generateNuxtTemplate } from "./nuxt-template.js";
import { generateReactTemplate } from "./react-template.js";
import { generateRemixTemplate } from "./remix-template.js";
import { generateSolidTemplate } from "./solid-template.js";
import { generateSvelteTemplate } from "./svelte-template.js";
import { generateVanillaTemplate } from "./vanilla-template.js";
import { generateViteTemplate } from "./vite-template.js";
import { generateVueTemplate } from "./vue-template.js";

export async function generateTemplate(config: ProjectConfig, projectPath: string) {
  logger.debug(`Generating ${config.framework} project...`);

  switch (config.framework) {
    case "react":
      await generateReactTemplate(config, projectPath);
      break;

    case "vue":
      await generateVueTemplate(config, projectPath);
      break;

    case "angular":
      await generateAngularTemplate(config, projectPath);
      break;

    case "next":
      await generateNextTemplate(config, projectPath);
      break;

    case "svelte":
      await generateSvelteTemplate(config, projectPath);
      break;

    case "nuxt":
      await generateNuxtTemplate(config, projectPath);
      break;

    case "solid":
      await generateSolidTemplate(config, projectPath);
      break;

    case "astro":
      await generateAstroTemplate(config, projectPath);
      break;

    case "remix":
      await generateRemixTemplate(config, projectPath);
      break;

    case "vite":
      await generateViteTemplate(config, projectPath);
      break;

    case "vanilla":
      await generateVanillaTemplate(config, projectPath);
      break;

    default:
      throw new Error(`Unknown framework: ${config.framework}`);
  }

  logger.debug(`${config.framework} project generated successfully`);
}

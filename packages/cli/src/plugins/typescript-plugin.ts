import type { ProjectConfig } from "@shared/stack-config.js";

import { createPlugin } from "@/core/plugin-manager.js";
import type { PluginContext } from "@/core/plugin-manager.js";

/**
 * TypeScript plugin for adding TypeScript support to projects
 */
export const typescriptPlugin = createPlugin({
  name: "typescript",
  version: "1.0.0",
  description: "Adds TypeScript support and configuration",
  validateConfig(config: ProjectConfig) {
    const errors: string[] = [];
    if (config.framework === "angular" && !config.typescript) {
      errors.push("Angular projects require TypeScript");
    }
    return {
      valid: errors.length === 0,
      errors,
    };
  },
  transformConfig(config: ProjectConfig) {
    if (config.framework === "angular") {
      return {
        ...config,
        typescript: true,
      };
    }
    return config;
  },
  async preGenerate(context: PluginContext) {
    if (!context.config.typescript) {
      return;
    }
    context.logger.debug("TypeScript plugin: Preparing TypeScript configuration");
  },
  async generate(context: PluginContext) {
    if (!context.config.typescript) {
      return;
    }
    const { templateEngine, projectPath, config } = context;
    await templateEngine.processConditionalTemplates(
      [
        {
          condition: true,
          sourceDir: "features/typescript/base",
        },
        {
          condition: config.framework === "react",
          sourceDir: "features/typescript/react",
        },
        {
          condition: config.framework === "vue",
          sourceDir: "features/typescript/vue",
        },
      ],
      projectPath,
      config
    );
  },
  async postGenerate(context: PluginContext) {
    if (!context.config.typescript) {
      return;
    }
    context.logger.success("TypeScript configuration added successfully");
  },
});

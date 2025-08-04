import { consola } from "consola";

import type { ProjectConfig } from "../../../shared/stack-config.js";

import type { TemplateEngine } from "./template-engine.js";
export interface PluginContext {
  config: ProjectConfig;
  projectPath: string;
  templateEngine: TemplateEngine;
  logger: typeof consola;
}
export interface Plugin {
  name: string;
  version?: string;
  description?: string;
  preGenerate?: (context: PluginContext) => Promise<void> | void;
  generate?: (context: PluginContext) => Promise<void> | void;
  postGenerate?: (context: PluginContext) => Promise<void> | void;
  beforeInstall?: (context: PluginContext) => Promise<void> | void;
  afterInstall?: (context: PluginContext) => Promise<void> | void;
  validateConfig?: (config: ProjectConfig) => { valid: boolean; errors?: string[] };
  transformConfig?: (config: ProjectConfig) => ProjectConfig;
}
export class PluginManager {
  private plugins: Map<string, Plugin> = new Map();
  private executionOrder: string[] = [];
  register(plugin: Plugin): void {
    if (this.plugins.has(plugin.name)) {
      throw new Error(`Plugin "${plugin.name}" is already registered`);
    }
    this.plugins.set(plugin.name, plugin);
    this.executionOrder.push(plugin.name);
    consola.debug(`Registered plugin: ${plugin.name}`);
  }
  unregister(pluginName: string): boolean {
    const index = this.executionOrder.indexOf(pluginName);
    if (index > -1) {
      this.executionOrder.splice(index, 1);
    }
    return this.plugins.delete(pluginName);
  }
  getPlugin(name: string): Plugin | undefined {
    return this.plugins.get(name);
  }
  getAllPlugins(): Plugin[] {
    return this.executionOrder.map((name) => this.plugins.get(name)!);
  }
  async executeHook<K extends keyof Plugin>(
    hookName: K,
    context: K extends "validateConfig" | "transformConfig" ? ProjectConfig : PluginContext
  ): Promise<any> {
    const results: any[] = [];
    for (const pluginName of this.executionOrder) {
      const plugin = this.plugins.get(pluginName);
      if (!plugin) continue;
      const hook = plugin[hookName];
      if (typeof hook === "function") {
        try {
          consola.debug(`Executing ${hookName} hook for plugin: ${pluginName}`);
          const result = await (hook as any)(context);
          results.push(result);
        } catch (error) {
          consola.error(`Error in plugin "${pluginName}" ${hookName} hook:`, error);
          throw error;
        }
      }
    }
    return results;
  }
  async validateConfig(config: ProjectConfig): Promise<{ valid: boolean; errors: string[] }> {
    const allErrors: string[] = [];
    for (const plugin of this.getAllPlugins()) {
      if (plugin.validateConfig) {
        const result = plugin.validateConfig(config);
        if (!result.valid && result.errors) {
          allErrors.push(...result.errors.map((err) => `[${plugin.name}] ${err}`));
        }
      }
    }
    return {
      valid: allErrors.length === 0,
      errors: allErrors,
    };
  }
  async transformConfig(config: ProjectConfig): Promise<ProjectConfig> {
    let transformedConfig = { ...config };
    for (const plugin of this.getAllPlugins()) {
      if (plugin.transformConfig) {
        transformedConfig = plugin.transformConfig(transformedConfig);
      }
    }
    return transformedConfig;
  }
  async runPreGenerate(context: PluginContext): Promise<void> {
    await this.executeHook("preGenerate", context);
  }
  async runGenerate(context: PluginContext): Promise<void> {
    await this.executeHook("generate", context);
  }
  async runPostGenerate(context: PluginContext): Promise<void> {
    await this.executeHook("postGenerate", context);
  }
  async runBeforeInstall(context: PluginContext): Promise<void> {
    await this.executeHook("beforeInstall", context);
  }
  async runAfterInstall(context: PluginContext): Promise<void> {
    await this.executeHook("afterInstall", context);
  }
}
let pluginManager: PluginManager | null = null;
export function getPluginManager(): PluginManager {
  if (!pluginManager) {
    pluginManager = new PluginManager();
  }
  return pluginManager;
}
export function createPlugin(plugin: Plugin): Plugin {
  return plugin;
}

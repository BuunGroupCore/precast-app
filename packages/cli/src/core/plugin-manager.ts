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

/**
 * Plugin manager for handling project generation plugins
 */
export class PluginManager {
  private plugins: Map<string, Plugin> = new Map();
  private executionOrder: string[] = [];

  /**
   * Register a plugin
   * @param plugin - Plugin to register
   */
  register(plugin: Plugin): void {
    if (this.plugins.has(plugin.name)) {
      throw new Error(`Plugin "${plugin.name}" is already registered`);
    }
    this.plugins.set(plugin.name, plugin);
    this.executionOrder.push(plugin.name);
    consola.debug(`Registered plugin: ${plugin.name}`);
  }

  /**
   * Unregister a plugin
   * @param pluginName - Name of plugin to unregister
   * @returns True if plugin was removed
   */
  unregister(pluginName: string): boolean {
    const index = this.executionOrder.indexOf(pluginName);
    if (index > -1) {
      this.executionOrder.splice(index, 1);
    }
    return this.plugins.delete(pluginName);
  }

  /**
   * Get a specific plugin by name
   * @param name - Plugin name
   * @returns Plugin instance or undefined
   */
  getPlugin(name: string): Plugin | undefined {
    return this.plugins.get(name);
  }

  /**
   * Get all registered plugins in execution order
   * @returns Array of plugins
   */
  getAllPlugins(): Plugin[] {
    return this.executionOrder.map((name) => this.plugins.get(name)!);
  }

  /**
   * Execute a specific hook across all plugins
   * @param hookName - Name of the hook to execute
   * @param context - Context to pass to the hook
   * @returns Array of hook results
   */
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

  /**
   * Validate configuration across all plugins
   * @param config - Project configuration to validate
   * @returns Validation result with errors if any
   */
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

  /**
   * Transform configuration through all plugins
   * @param config - Project configuration to transform
   * @returns Transformed configuration
   */
  async transformConfig(config: ProjectConfig): Promise<ProjectConfig> {
    let transformedConfig = { ...config };
    for (const plugin of this.getAllPlugins()) {
      if (plugin.transformConfig) {
        transformedConfig = plugin.transformConfig(transformedConfig);
      }
    }
    return transformedConfig;
  }

  /**
   * Run pre-generation hooks
   * @param context - Plugin context
   */
  async runPreGenerate(context: PluginContext): Promise<void> {
    await this.executeHook("preGenerate", context);
  }

  /**
   * Run generation hooks
   * @param context - Plugin context
   */
  async runGenerate(context: PluginContext): Promise<void> {
    await this.executeHook("generate", context);
  }

  /**
   * Run post-generation hooks
   * @param context - Plugin context
   */
  async runPostGenerate(context: PluginContext): Promise<void> {
    await this.executeHook("postGenerate", context);
  }

  /**
   * Run before-install hooks
   * @param context - Plugin context
   */
  async runBeforeInstall(context: PluginContext): Promise<void> {
    await this.executeHook("beforeInstall", context);
  }

  /**
   * Run after-install hooks
   * @param context - Plugin context
   */
  async runAfterInstall(context: PluginContext): Promise<void> {
    await this.executeHook("afterInstall", context);
  }
}

let pluginManager: PluginManager | null = null;

/**
 * Get the singleton plugin manager instance
 * @returns Plugin manager instance
 */
export function getPluginManager(): PluginManager {
  if (!pluginManager) {
    pluginManager = new PluginManager();
  }
  return pluginManager;
}

/**
 * Create a plugin object
 * @param plugin - Plugin definition
 * @returns Plugin object
 */
export function createPlugin(plugin: Plugin): Plugin {
  return plugin;
}

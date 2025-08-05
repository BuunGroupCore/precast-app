# API Reference

Complete API documentation for Precast CLI components.

## Core Classes

### ConfigValidator

Validates project configuration and provides compatibility checking.

```typescript
class ConfigValidator {
  constructor();

  /**
   * Adds a validation rule
   */
  addRule(rule: CompatibilityRule): void;

  /**
   * Removes a validation rule by name
   */
  removeRule(ruleName: string): boolean;

  /**
   * Validates a project configuration
   */
  validate(config: ProjectConfig): ValidationResult;

  /**
   * Checks if two configuration values are compatible
   */
  isCompatible(
    field1: keyof ProjectConfig,
    value1: string,
    field2: keyof ProjectConfig,
    value2: string,
    config: Partial<ProjectConfig>
  ): boolean;

  /**
   * Gets recommendations based on current configuration
   */
  getRecommendations(partialConfig: Partial<ProjectConfig>): Map<keyof ProjectConfig, string[]>;
}
```

**Usage:**

```typescript
import { getConfigValidator } from "./core/config-validator.js";

const validator = getConfigValidator();
const result = validator.validate(config);

if (!result.valid) {
  console.error("Validation errors:", result.errors);
}
```

### TemplateEngine

Processes Handlebars templates with conditional logic.

```typescript
class TemplateEngine {
  constructor(templateRoot: string);

  /**
   * Registers a custom Handlebars helper
   */
  registerHelper(name: string, helper: handlebars.HelperDelegate): void;

  /**
   * Processes a single template file
   */
  processTemplate(
    templatePath: string,
    outputPath: string,
    context: TemplateContext,
    options?: TemplateOptions
  ): Promise<void>;

  /**
   * Copies and processes an entire template directory
   */
  copyTemplateDirectory(
    sourceDir: string,
    destDir: string,
    context: TemplateContext,
    options?: TemplateOptions
  ): Promise<void>;

  /**
   * Processes templates based on conditions
   */
  processConditionalTemplates(
    templates: Array<{
      condition: boolean | ((ctx: TemplateContext) => boolean);
      sourceDir: string;
      destDir?: string;
    }>,
    projectDir: string,
    context: TemplateContext,
    options?: TemplateOptions
  ): Promise<void>;

  /**
   * Gets available templates in a category
   */
  getAvailableTemplates(category: string): Promise<string[]>;
}
```

**Usage:**

```typescript
import { createTemplateEngine } from "./core/template-engine.js";

const templateEngine = createTemplateEngine("/path/to/templates");

await templateEngine.copyTemplateDirectory("frameworks/react/base", projectPath, config, {
  overwrite: true,
});
```

### PluginManager

Manages plugin registration and execution.

```typescript
class PluginManager {
  /**
   * Registers a plugin
   */
  register(plugin: Plugin): void;

  /**
   * Unregisters a plugin
   */
  unregister(pluginName: string): boolean;

  /**
   * Gets a plugin by name
   */
  getPlugin(name: string): Plugin | undefined;

  /**
   * Gets all registered plugins in execution order
   */
  getAllPlugins(): Plugin[];

  /**
   * Executes a hook across all registered plugins
   */
  executeHook<K extends keyof Plugin>(
    hookName: K,
    context: K extends "validateConfig" | "transformConfig" ? ProjectConfig : PluginContext
  ): Promise<any>;

  /**
   * Validates configuration using all plugin validators
   */
  validateConfig(config: ProjectConfig): Promise<{ valid: boolean; errors: string[] }>;

  /**
   * Transforms configuration using all plugin transformers
   */
  transformConfig(config: ProjectConfig): Promise<ProjectConfig>;

  // Convenience methods for lifecycle hooks
  runPreGenerate(context: PluginContext): Promise<void>;
  runGenerate(context: PluginContext): Promise<void>;
  runPostGenerate(context: PluginContext): Promise<void>;
  runBeforeInstall(context: PluginContext): Promise<void>;
  runAfterInstall(context: PluginContext): Promise<void>;
}
```

**Usage:**

```typescript
import { getPluginManager, createPlugin } from "./core/plugin-manager.js";

const pluginManager = getPluginManager();

// Register a plugin
const myPlugin = createPlugin({
  name: "my-plugin",
  generate: async (context) => {
    // Plugin logic
  },
});

pluginManager.register(myPlugin);

// Execute hooks
await pluginManager.runPreGenerate(context);
```

## Interfaces

### ProjectConfig

Main configuration interface for generated projects.

```typescript
interface ProjectConfig {
  name: string; // Project name
  framework: string; // Frontend framework
  backend: string; // Backend framework
  database: string; // Database type
  orm: string; // ORM/ODM
  styling: string; // Styling solution
  typescript: boolean; // TypeScript enabled
  git: boolean; // Git initialization
  docker: boolean; // Docker configuration
}
```

### Plugin

Interface for creating plugins.

```typescript
interface Plugin {
  name: string;
  version?: string;
  description?: string;

  // Configuration hooks
  validateConfig?: (config: ProjectConfig) => { valid: boolean; errors?: string[] };
  transformConfig?: (config: ProjectConfig) => ProjectConfig;

  // Generation hooks
  preGenerate?: (context: PluginContext) => Promise<void> | void;
  generate?: (context: PluginContext) => Promise<void> | void;
  postGenerate?: (context: PluginContext) => Promise<void> | void;

  // Installation hooks
  beforeInstall?: (context: PluginContext) => Promise<void> | void;
  afterInstall?: (context: PluginContext) => Promise<void> | void;
}
```

### PluginContext

Context provided to plugin hooks.

```typescript
interface PluginContext {
  config: ProjectConfig;
  projectPath: string;
  templateEngine: TemplateEngine;
  logger: typeof consola;
}
```

### TemplateContext

Context for template processing.

```typescript
interface TemplateContext extends ProjectConfig {
  [key: string]: any;
}
```

### TemplateOptions

Options for template processing.

```typescript
interface TemplateOptions {
  overwrite?: boolean; // Overwrite existing files
  skipIfExists?: boolean; // Skip if file exists
}
```

### ValidationResult

Result of configuration validation.

```typescript
interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}
```

### CompatibilityRule

Rule for validating configuration compatibility.

```typescript
interface CompatibilityRule {
  name: string;
  check: (config: ProjectConfig) => boolean;
  message: string;
  severity: "error" | "warning";
}
```

### InitOptions

Options for the init command.

```typescript
interface InitOptions {
  yes?: boolean; // Skip prompts
  framework?: string; // Framework choice
  backend?: string; // Backend choice
  database?: string; // Database choice
  orm?: string; // ORM choice
  styling?: string; // Styling choice
  typescript?: boolean; // TypeScript flag
  git?: boolean; // Git flag
  docker?: boolean; // Docker flag
  install?: boolean; // Install dependencies
  packageManager?: "npm" | "yarn" | "pnpm" | "bun"; // Package manager
}
```

## Utility Functions

### Configuration Gathering

```typescript
/**
 * Gathers project configuration through interactive prompts or CLI options
 */
function gatherProjectConfig(
  projectName: string | undefined,
  options: InitOptions
): Promise<ProjectConfig>;
```

### Display Utilities

```typescript
/**
 * Displays a formatted summary of the project configuration
 */
function displayConfigSummary(config: ProjectConfig): void;

/**
 * Formats a partial configuration as a string for display
 */
function displayConfig(config: Partial<ProjectConfig>): string;
```

### Template Path Resolution

```typescript
/**
 * Resolves the template root directory based on the current execution context
 */
function getTemplateRoot(): string;
```

### Project Creation

```typescript
/**
 * Creates a new project based on the provided configuration
 */
function createProject(config: ProjectConfig): Promise<void>;
```

### Logger

```typescript
/**
 * Logger utility for consistent console output
 */
const logger = {
  header: (message: string) => void;   // Header with background
  info: (message: string) => void;     // Info message
  success: (message: string) => void;  // Success with checkmark
  error: (message: string) => void;    // Error with X mark
  warn: (message: string) => void;     // Warning with symbol
  debug: (message: string) => void;    // Debug (when DEBUG=1)
}
```

## Generator Functions

Each framework has a dedicated generator function:

```typescript
/**
 * Generates a React project template
 */
function generateReactTemplate(config: ProjectConfig, projectPath: string): Promise<void>;

/**
 * Generates a Vue project template
 */
function generateVueTemplate(config: ProjectConfig, projectPath: string): Promise<void>;

/**
 * Generates an Angular project template
 */
function generateAngularTemplate(config: ProjectConfig, projectPath: string): Promise<void>;

/**
 * Generates a Next.js project template
 */
function generateNextTemplate(config: ProjectConfig, projectPath: string): Promise<void>;

// ... similar functions for other frameworks
```

## Handlebars Helpers

Built-in template helpers:

```typescript
// String manipulation
capitalize(str: string): string           // "hello" -> "Hello"
kebabCase(str: string): string           // "helloWorld" -> "hello-world"
camelCase(str: string): string           // "hello-world" -> "helloWorld"

// Comparisons
eq(a: any, b: any): boolean              // Equality check
and(a: any, b: any): boolean             // Logical AND
or(a: any, b: any): boolean              // Logical OR
not(a: any): boolean                     // Logical NOT

// Arrays
includes(array: any[], value: any): boolean  // Array includes value

// Conditionals
ifAny(...args: any[]): boolean           // True if any argument is truthy
ifAll(...args: any[]): boolean           // True if all arguments are truthy
```

## Error Handling

### Common Error Types

```typescript
// Configuration validation errors
class ValidationError extends Error {
  constructor(public errors: string[]) {
    super(`Validation failed: ${errors.join(", ")}`);
  }
}

// Template processing errors
class TemplateError extends Error {
  constructor(templatePath: string, cause: Error) {
    super(`Failed to process template: ${templatePath}`);
    this.cause = cause;
  }
}

// Plugin execution errors
class PluginError extends Error {
  constructor(pluginName: string, hookName: string, cause: Error) {
    super(`Plugin "${pluginName}" failed in ${hookName} hook`);
    this.cause = cause;
  }
}
```

### Error Recovery

The CLI implements graceful error recovery:

1. **Validation Errors**: Display clear error messages and exit
2. **Template Errors**: Clean up partial generation and report specific failures
3. **Plugin Errors**: Continue with other plugins where possible
4. **File System Errors**: Handle permissions and disk space issues

## Examples

### Creating a Custom Generator

```typescript
import { type ProjectConfig } from "../../../shared/stack-config.js";
import { createTemplateEngine } from "../core/template-engine.js";
import { getPluginManager } from "../core/plugin-manager.js";
import { getTemplateRoot } from "../utils/template-path.js";

export async function generateMyFrameworkTemplate(config: ProjectConfig, projectPath: string) {
  const templateRoot = getTemplateRoot();
  const templateEngine = createTemplateEngine(templateRoot);
  const pluginManager = getPluginManager();

  const context = {
    config,
    projectPath,
    templateEngine,
    logger: consola,
  };

  try {
    await pluginManager.runPreGenerate(context);

    await templateEngine.copyTemplateDirectory(
      "frameworks/my-framework/base",
      projectPath,
      config,
      { overwrite: true }
    );

    await templateEngine.processConditionalTemplates(
      [
        {
          condition: config.typescript,
          sourceDir: "features/typescript/my-framework",
        },
      ],
      projectPath,
      config
    );

    await pluginManager.runPostGenerate(context);
  } catch (error) {
    console.error(`Failed to generate My Framework template:`, error);
    throw error;
  }
}
```

### Creating a Custom Plugin

```typescript
import { createPlugin } from "../core/plugin-manager.js";
import type { ProjectConfig, PluginContext } from "../types.js";

export const myCustomPlugin = createPlugin({
  name: "my-custom-plugin",
  version: "1.0.0",
  description: "Adds custom functionality to generated projects",

  validateConfig(config: ProjectConfig) {
    const errors: string[] = [];

    if (config.myCustomOption && !config.requiredDependency) {
      errors.push("My custom option requires the required dependency");
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  },

  async generate(context: PluginContext) {
    const { config, projectPath, templateEngine } = context;

    if (config.myCustomOption) {
      await templateEngine.processConditionalTemplates(
        [
          {
            condition: true,
            sourceDir: "features/my-custom-feature",
          },
        ],
        projectPath,
        config
      );
    }
  },

  async postGenerate(context: PluginContext) {
    context.logger.success("My custom plugin completed successfully");
  },
});
```

### Using the Template Engine

```typescript
import { createTemplateEngine } from "./core/template-engine.js";
import { getTemplateRoot } from "./utils/template-path.js";

const templateEngine = createTemplateEngine(getTemplateRoot());

// Register custom helper
templateEngine.registerHelper("uppercase", (str) => (str ? str.toUpperCase() : ""));

// Process single template
await templateEngine.processTemplate("/path/to/template.hbs", "/path/to/output.txt", {
  name: "MyProject",
  framework: "react",
});

// Copy template directory
await templateEngine.copyTemplateDirectory("frameworks/react/base", "/path/to/project", config, {
  overwrite: true,
});

// Process conditional templates
await templateEngine.processConditionalTemplates(
  [
    {
      condition: config.typescript,
      sourceDir: "features/typescript/react",
    },
    {
      condition: (ctx) => ctx.styling === "tailwind",
      sourceDir: "features/tailwind",
    },
  ],
  projectPath,
  config
);
```

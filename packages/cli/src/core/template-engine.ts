import path from "node:path";

import { consola } from "consola";
import fsExtra from "fs-extra";
// eslint-disable-next-line import/no-named-as-default-member
const { pathExists, readFile, ensureDir, writeFile, copy, readdir } = fsExtra;
import { globby } from "globby";
import handlebars from "handlebars";

import type { ProjectConfig } from "../../../shared/stack-config.js";
export interface TemplateContext extends ProjectConfig {
  [key: string]: any;
}
export interface TemplateOptions {
  overwrite?: boolean;
  skipIfExists?: boolean;
}

/**
 * Template engine for processing Handlebars templates
 */
export class TemplateEngine {
  private templateRoot: string;
  private helpers: Map<string, handlebars.HelperDelegate> = new Map();
  constructor(templateRoot: string) {
    this.templateRoot = templateRoot;
    this.registerDefaultHelpers();
  }

  /**
   * Register default Handlebars helpers
   */
  private registerDefaultHelpers() {
    this.registerHelper("eq", (a, b) => a === b);
    this.registerHelper("ne", (a, b) => a !== b);
    this.registerHelper("and", (a, b) => a && b);
    this.registerHelper("or", (a, b) => a || b);
    this.registerHelper("not", (a) => !a);
    this.registerHelper(
      "includes",
      (array, value) => Array.isArray(array) && array.includes(value)
    );
    this.registerHelper("capitalize", (str) =>
      str ? str.charAt(0).toUpperCase() + str.slice(1) : ""
    );
    this.registerHelper("kebabCase", (str) =>
      str ? str.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase() : ""
    );
    this.registerHelper("camelCase", (str) =>
      str ? str.replace(/-./g, (x: string) => x[1].toUpperCase()) : ""
    );
    this.registerHelper("ifAny", function (this: any, ...args) {
      const options = args.pop();
      return args.some(Boolean) ? options.fn(this) : options.inverse(this);
    });
    this.registerHelper("ifAll", function (this: any, ...args) {
      const options = args.pop();
      return args.every(Boolean) ? options.fn(this) : options.inverse(this);
    });
    // Helper to strip hash from hex color codes for placeholder images
    this.registerHelper("stripHash", (hexCode: string) =>
      hexCode ? hexCode.replace("#", "") : ""
    );
  }

  /**
   * Register a custom Handlebars helper
   * @param name - Helper name
   * @param helper - Helper function
   */
  registerHelper(name: string, helper: handlebars.HelperDelegate) {
    this.helpers.set(name, helper);
    handlebars.registerHelper(name, helper);
  }

  /**
   * Process a single template file
   * @param templatePath - Path to template file
   * @param outputPath - Path where processed file will be written
   * @param context - Template context data
   * @param options - Processing options
   */
  async processTemplate(
    templatePath: string,
    outputPath: string,
    context: TemplateContext,
    options: TemplateOptions = {}
  ): Promise<void> {
    try {
      if (await pathExists(outputPath)) {
        if (options.skipIfExists) {
          consola.debug(`Skipping existing file: ${outputPath}`);
          return;
        }
        if (!options.overwrite) {
          throw new Error(`File already exists: ${outputPath}`);
        }
      }

      // Resolve template path relative to template root if it's not absolute
      const resolvedTemplatePath = path.isAbsolute(templatePath)
        ? templatePath
        : path.join(this.templateRoot, templatePath);

      if (!(await pathExists(resolvedTemplatePath))) {
        throw new Error(`Template not found: ${resolvedTemplatePath}`);
      }

      const templateContent = await readFile(resolvedTemplatePath, "utf-8");
      const template = handlebars.compile(templateContent);
      const processedContent = template(context);
      await ensureDir(path.dirname(outputPath));
      await writeFile(outputPath, processedContent);
      consola.debug(`Generated: ${outputPath}`);
    } catch (error) {
      consola.error(`Error processing template ${templatePath}:`, error);
      throw new Error(
        `Failed to process template: ${templatePath} (resolved: ${path.isAbsolute(templatePath) ? templatePath : path.join(this.templateRoot, templatePath)})`
      );
    }
  }

  /**
   * Process a template with variant support
   * @param baseTemplatePath - Base template path
   * @param outputPath - Output file path
   * @param context - Template context
   * @param variants - Variant mappings
   * @param options - Processing options
   */
  async processVariantTemplate(
    baseTemplatePath: string,
    outputPath: string,
    context: TemplateContext,
    variants: Record<string, string>,
    options: TemplateOptions = {}
  ): Promise<void> {
    const dir = path.dirname(baseTemplatePath);
    const ext = path.extname(baseTemplatePath);
    const baseName = path.basename(baseTemplatePath, ext);
    let selectedTemplate = baseTemplatePath;
    for (const [contextKey, variantSuffix] of Object.entries(variants)) {
      const contextValue = context[contextKey];
      if (contextValue === variantSuffix) {
        const variantPath = path.join(dir, `${baseName}-${variantSuffix}${ext}`);
        if (await pathExists(variantPath)) {
          selectedTemplate = variantPath;
          break;
        }
      }
    }
    await this.processTemplate(selectedTemplate, outputPath, context, options);
  }

  /**
   * Copy and process an entire template directory
   * @param sourceDir - Source directory relative to template root
   * @param destDir - Destination directory
   * @param context - Template context
   * @param options - Processing options
   */
  async copyTemplateDirectory(
    sourceDir: string,
    destDir: string,
    context: TemplateContext,
    options: TemplateOptions = {}
  ): Promise<void> {
    const templateDir = path.join(this.templateRoot, sourceDir);
    if (!(await pathExists(templateDir))) {
      throw new Error(`Template directory not found: ${templateDir}`);
    }
    const files = await globby("**/*", {
      cwd: templateDir,
      dot: true,
      onlyFiles: true,
    });

    for (const file of files) {
      if (this.shouldSkipFile(file, context)) {
        continue;
      }

      const sourcePath = path.join(templateDir, file);
      let destFile = file;

      if (destFile.endsWith(".hbs")) {
        destFile = destFile.slice(0, -4);
      }

      destFile = destFile.replace(/^_/, ".");

      const destPath = path.join(destDir, destFile);

      if (file.endsWith(".hbs")) {
        await this.processTemplate(sourcePath, destPath, context, options);
      } else {
        await ensureDir(path.dirname(destPath));
        await copy(sourcePath, destPath);
      }
    }
  }

  /**
   * Determine if a file should be skipped based on context
   * @param file - File path
   * @param context - Template context
   * @returns True if file should be skipped
   */
  private shouldSkipFile(file: string, context: TemplateContext): boolean {
    const fileName = path.basename(file);

    const isConfigFile = fileName.match(/\.(config|rc)\.(js|mjs|cjs)\.hbs$/);

    // Skip gitignore if flag is set to false
    if (context.gitignore === false && fileName === "_gitignore") {
      return true;
    }

    // Skip ESLint files if flag is set to false
    if (
      context.eslint === false &&
      (fileName === "_eslintrc.json" ||
        fileName === "_eslintrc.js" ||
        fileName === "_eslintrc.cjs" ||
        fileName === "_eslintrc.json.hbs" ||
        fileName === "_eslintrc.js.hbs" ||
        fileName === "_eslintrc.cjs.hbs" ||
        fileName === "eslint.config.js.hbs" ||
        fileName === "eslint.config.mjs.hbs" ||
        fileName === "_eslintignore" ||
        fileName === "_eslintignore.hbs")
    ) {
      return true;
    }

    // Skip Prettier files if flag is set to false
    if (
      context.prettier === false &&
      (fileName === "_prettierrc" ||
        fileName === "_prettierrc.json" ||
        fileName === "_prettierrc.js" ||
        fileName === "_prettierrc.cjs" ||
        fileName === "_prettierrc.json.hbs" ||
        fileName === "_prettierrc.js.hbs" ||
        fileName === "_prettierrc.cjs.hbs" ||
        fileName === "prettier.config.js.hbs" ||
        fileName === "prettier.config.mjs.hbs" ||
        fileName === "_prettierignore" ||
        fileName === "_prettierignore.hbs")
    ) {
      return true;
    }

    if (!context.typescript && (fileName.endsWith(".ts.hbs") || fileName.endsWith(".tsx.hbs"))) {
      return true;
    }
    if (
      context.typescript &&
      (fileName.endsWith(".js.hbs") || fileName.endsWith(".jsx.hbs")) &&
      !isConfigFile
    ) {
      return true;
    }
    if (context.styling !== "scss" && fileName.endsWith(".scss.hbs")) {
      return true;
    }
    if (fileName === "style.scss.hbs" && context.styling !== "scss") {
      return true;
    }
    if (
      (fileName === "tailwind.config.js.hbs" ||
        fileName === "postcss.config.js.hbs" ||
        fileName === "tailwind.config.mjs.hbs" ||
        fileName === "postcss.config.mjs.hbs") &&
      context.styling !== "tailwind"
    ) {
      return true;
    }

    // Skip PrecastBanner variants based on styling
    if (fileName.startsWith("PrecastBanner-tailwind") && context.styling !== "tailwind") {
      return true;
    }
    if (
      fileName.startsWith("PrecastBanner.") &&
      !fileName.includes("-tailwind") &&
      context.styling === "tailwind" &&
      (fileName.endsWith(".jsx.hbs") || fileName.endsWith(".tsx.hbs"))
    ) {
      return true;
    }
    if (fileName === "PrecastBanner.css.hbs" && context.styling === "tailwind") {
      return true;
    }
    if (
      !context.typescript &&
      (fileName === "tsconfig.json.hbs" ||
        fileName === "tsconfig.app.json.hbs" ||
        fileName === "env.d.ts.hbs" ||
        fileName === "tsconfig.node.json.hbs")
    ) {
      return true;
    }
    return false;
  }

  /**
   * Process templates conditionally based on context
   * @param templates - Array of template configurations
   * @param projectDir - Project directory
   * @param context - Template context
   * @param options - Processing options
   */
  async processConditionalTemplates(
    templates: Array<{
      condition: boolean | ((ctx: TemplateContext) => boolean);
      sourceDir: string;
      destDir?: string;
    }>,
    projectDir: string,
    context: TemplateContext,
    options: TemplateOptions = {}
  ): Promise<void> {
    for (const template of templates) {
      const shouldProcess =
        typeof template.condition === "function" ? template.condition(context) : template.condition;
      if (shouldProcess) {
        const destDir = template.destDir ? path.join(projectDir, template.destDir) : projectDir;
        await this.copyTemplateDirectory(template.sourceDir, destDir, context, options);
      }
    }
  }

  /**
   * Get list of available templates in a category
   * @param category - Template category
   * @returns List of template names
   */
  async getAvailableTemplates(category: string): Promise<string[]> {
    const categoryPath = path.join(this.templateRoot, category);
    if (!(await pathExists(categoryPath))) {
      return [];
    }
    const entries = await readdir(categoryPath, { withFileTypes: true });
    return entries.filter((entry) => entry.isDirectory()).map((entry) => entry.name);
  }
}

let templateEngine: TemplateEngine | null = null;

/**
 * Create or get singleton template engine instance
 * @param templateRoot - Root directory for templates
 * @returns Template engine instance
 */
export function createTemplateEngine(templateRoot: string): TemplateEngine {
  if (!templateEngine) {
    templateEngine = new TemplateEngine(templateRoot);
  }
  return templateEngine;
}

/**
 * Get the current template engine instance
 * @returns Template engine instance
 */
export function getTemplateEngine(): TemplateEngine {
  if (!templateEngine) {
    throw new Error("Template engine not initialized. Call createTemplateEngine first.");
  }
  return templateEngine;
}

import path from "node:path";

import { consola } from "consola";
import fsExtra from "fs-extra";
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
export class TemplateEngine {
  private templateRoot: string;
  private helpers: Map<string, handlebars.HelperDelegate> = new Map();
  constructor(templateRoot: string) {
    this.templateRoot = templateRoot;
    this.registerDefaultHelpers();
  }
  private registerDefaultHelpers() {
    this.registerHelper("eq", (a, b) => a === b);
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
  }
  registerHelper(name: string, helper: handlebars.HelperDelegate) {
    this.helpers.set(name, helper);
    handlebars.registerHelper(name, helper);
  }
  async processTemplate(
    templatePath: string,
    outputPath: string,
    context: TemplateContext,
    options: TemplateOptions = {}
  ): Promise<void> {
    try {
      if (await fsExtra.pathExists(outputPath)) {
        if (options.skipIfExists) {
          consola.debug(`Skipping existing file: ${outputPath}`);
          return;
        }
        if (!options.overwrite) {
          throw new Error(`File already exists: ${outputPath}`);
        }
      }
      const templateContent = await fsExtra.readFile(templatePath, "utf-8");
      const template = handlebars.compile(templateContent);
      const processedContent = template(context);
      await fsExtra.ensureDir(path.dirname(outputPath));
      await fsExtra.writeFile(outputPath, processedContent);
      consola.debug(`Generated: ${outputPath}`);
    } catch (error) {
      consola.error(`Error processing template ${templatePath}:`, error);
      throw new Error(`Failed to process template: ${templatePath}`);
    }
  }
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
        if (await fsExtra.pathExists(variantPath)) {
          selectedTemplate = variantPath;
          break;
        }
      }
    }
    await this.processTemplate(selectedTemplate, outputPath, context, options);
  }
  async copyTemplateDirectory(
    sourceDir: string,
    destDir: string,
    context: TemplateContext,
    options: TemplateOptions = {}
  ): Promise<void> {
    const templateDir = path.join(this.templateRoot, sourceDir);
    if (!(await fsExtra.pathExists(templateDir))) {
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
        await fsExtra.ensureDir(path.dirname(destPath));
        await fsExtra.copy(sourcePath, destPath);
      }
    }
  }
  private shouldSkipFile(file: string, context: TemplateContext): boolean {
    const fileName = path.basename(file);

    // Config files are always .js regardless of TypeScript usage
    const isConfigFile = fileName.match(/\.(config|rc)\.(js|mjs|cjs)\.hbs$/);

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
  async getAvailableTemplates(category: string): Promise<string[]> {
    const categoryPath = path.join(this.templateRoot, category);
    if (!(await fsExtra.pathExists(categoryPath))) {
      return [];
    }
    const entries = await fsExtra.readdir(categoryPath, { withFileTypes: true });
    return entries.filter((entry) => entry.isDirectory()).map((entry) => entry.name);
  }
}
let templateEngine: TemplateEngine | null = null;
export function createTemplateEngine(templateRoot: string): TemplateEngine {
  if (!templateEngine) {
    templateEngine = new TemplateEngine(templateRoot);
  }
  return templateEngine;
}
export function getTemplateEngine(): TemplateEngine {
  if (!templateEngine) {
    throw new Error("Template engine not initialized. Call createTemplateEngine first.");
  }
  return templateEngine;
}

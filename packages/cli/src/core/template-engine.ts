import path from "node:path";

import type { ProjectConfig } from "@shared/stack-config.js";
import { consola } from "consola";
import fsExtra from "fs-extra";
import { globby } from "globby";
import handlebars from "handlebars";

const { pathExists, readFile, ensureDir, writeFile, copy, readdir } = fsExtra;
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
  private partials: Map<string, string> = new Map();
  private partialsRegistered = false;

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
    this.registerHelper("ifEquals", function (this: any, arg1: any, arg2: any, options: any) {
      return arg1 === arg2 ? options.fn(this) : options.inverse(this);
    });
    this.registerHelper("not", (a) => !a);
    this.registerHelper(
      "includes",
      (array, value) => Array.isArray(array) && array.includes(value)
    );

    // Helper to build icon imports based on config
    this.registerHelper("buildIconImports", function (this: any) {
      const imports: string[] = [];

      // Framework icons
      if (
        this.framework === "react" ||
        this.framework === "next" ||
        this.framework === "react-router"
      ) {
        imports.push("SiReact");
      } else if (this.framework === "tanstack-router" || this.framework === "tanstack-start") {
        imports.push("SiReact as SiTanstack");
      } else if (this.framework === "vue") {
        imports.push("SiVuedotjs as SiVue");
      } else if (this.framework === "svelte") {
        imports.push("SiSvelte");
      } else if (this.framework === "solid") {
        imports.push("SiSolid");
      } else if (this.framework === "angular") {
        imports.push("SiAngular");
      } else if (this.framework === "astro") {
        imports.push("SiAstro");
      } else if (this.framework === "vanilla" || this.framework === "vite") {
        imports.push("SiJavascript");
      }

      // Styling icons - only add if Tailwind
      if (this.styling === "tailwind") {
        imports.push("SiTailwindcss");
      }

      // TypeScript
      if (this.typescript) {
        imports.push("SiTypescript");
      }

      // Backend icons
      if (this.backend === "hono") {
        imports.push("SiHono");
      } else if (this.backend === "express") {
        imports.push("SiExpress");
      } else if (this.backend === "fastify") {
        imports.push("SiFastify");
      } else if (this.backend === "nestjs") {
        imports.push("SiNestjs");
      } else if (this.backend === "koa") {
        imports.push("SiNodedotjs as SiKoa");
      } else if (this.backend === "node") {
        imports.push("SiNodedotjs");
      }

      // Database icons
      if (this.database === "postgres") {
        imports.push("SiPostgresql");
      } else if (this.database === "mysql") {
        imports.push("SiMysql");
      } else if (this.database === "mongodb") {
        imports.push("SiMongodb");
      }

      // ORM icons
      if (this.orm === "prisma") {
        imports.push("SiPrisma");
      } else if (this.orm === "drizzle") {
        imports.push("SiNodedotjs as SiDrizzle");
      } else if (this.orm === "typeorm") {
        imports.push("SiNodedotjs as SiTypeorm");
      } else if (this.orm === "mongoose") {
        imports.push("SiMongodb as SiMongoose");
      }

      // Format imports with proper indentation
      if (imports.length === 0) return "";
      if (imports.length === 1) return imports[0];

      return "\n  " + imports.join(",\n  ") + "\n";
    });

    // Helper for TechnologyStack component imports (includes extra icons)
    this.registerHelper("buildTechStackImports", function (this: any) {
      const imports: string[] = [];

      // Framework icons
      if (
        this.framework === "react" ||
        this.framework === "next" ||
        this.framework === "react-router"
      ) {
        imports.push("SiReact");
      } else if (this.framework === "tanstack-router" || this.framework === "tanstack-start") {
        imports.push("SiReact as SiTanstack");
      } else if (this.framework === "vue") {
        imports.push("SiVuedotjs as SiVue");
      } else if (this.framework === "svelte") {
        imports.push("SiSvelte");
      } else if (this.framework === "solid") {
        imports.push("SiSolid");
      } else if (this.framework === "angular") {
        imports.push("SiAngular");
      } else if (this.framework === "astro") {
        imports.push("SiAstro");
      } else if (this.framework === "vanilla" || this.framework === "vite") {
        imports.push("SiJavascript");
      }

      // Vite (for multiple frameworks)
      if (
        [
          "react",
          "vue",
          "svelte",
          "vite-react",
          "vite-vue",
          "vite-svelte",
          "vite-solid",
          "vite-vanilla",
          "vite",
        ].includes(this.framework)
      ) {
        imports.push("SiVite");
      }

      // Styling icons - only add if Tailwind
      if (this.styling === "tailwind") {
        imports.push("SiTailwindcss");
      }

      // TypeScript
      if (this.typescript) {
        imports.push("SiTypescript");
      }

      // Always include Bun for TechnologyStack
      imports.push("SiBun");

      // Backend icons
      if (this.backend === "hono") {
        imports.push("SiHono");
      } else if (this.backend === "express") {
        imports.push("SiExpress");
      } else if (this.backend === "fastify") {
        imports.push("SiFastify");
      } else if (this.backend === "nestjs") {
        imports.push("SiNestjs");
      }

      // Database icons
      if (this.database === "postgres") {
        imports.push("SiPostgresql");
      } else if (this.database === "mysql") {
        imports.push("SiMysql");
      } else if (this.database === "sqlite") {
        imports.push("SiSqlite");
      } else if (this.database === "mongodb") {
        imports.push("SiMongodb");
      }

      // ORM icons
      if (this.orm === "prisma") {
        imports.push("SiPrisma");
      } else if (this.orm === "drizzle") {
        imports.push("SiDrizzle");
      }

      // Docker
      if (this.docker) {
        imports.push("SiDocker");
      }

      // Format imports with proper indentation
      if (imports.length === 0) return "";
      if (imports.length === 1) return imports[0];

      return "\n  " + imports.join(",\n  ") + "\n";
    });
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

    // Framework detection helpers for DuckDB templates
    this.registerHelper("hasServerFramework", function (this: TemplateContext) {
      const hasBackend = this.backend && this.backend !== "none";
      const hasServerFramework = ![
        "vanilla",
        "react",
        "vue",
        "angular",
        "svelte",
        "solid",
      ].includes(this.framework);
      return hasBackend || hasServerFramework;
    });
    this.registerHelper("hasClientFramework", function (this: TemplateContext) {
      return this.framework !== "none";
    });
  }

  /**
   * Register default Handlebars partials
   */
  private async registerDefaultPartials() {
    if (this.partialsRegistered) return;

    try {
      const partialsPath = path.join(this.templateRoot, "common");
      const globalsStylePath = path.join(partialsPath, "styles", "globals.css.hbs");
      if (await pathExists(globalsStylePath)) {
        const content = await readFile(globalsStylePath, "utf-8");
        handlebars.registerPartial("common/styles/globals.css.hbs", content);
        this.partials.set("common/styles/globals.css.hbs", content);
      }

      const globalsScssPath = path.join(partialsPath, "styles", "globals.scss.hbs");
      if (await pathExists(globalsScssPath)) {
        const content = await readFile(globalsScssPath, "utf-8");
        handlebars.registerPartial("common/styles/globals.scss.hbs", content);
        this.partials.set("common/styles/globals.scss.hbs", content);
      }

      this.partialsRegistered = true;
    } catch (error) {
      consola.debug("Error registering partials:", error);
    }
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
      await this.registerDefaultPartials();

      if (await pathExists(outputPath)) {
        if (options.skipIfExists) {
          consola.debug(`Skipping existing file: ${outputPath}`);
          return;
        }
        if (!options.overwrite) {
          throw new Error(`File already exists: ${outputPath}`);
        }
      }

      const resolvedTemplatePath = path.isAbsolute(templatePath)
        ? templatePath
        : path.join(this.templateRoot, templatePath);

      if (!(await pathExists(resolvedTemplatePath))) {
        throw new Error(`Template not found: ${resolvedTemplatePath}`);
      }

      const templateContent = await readFile(resolvedTemplatePath, "utf-8");
      const template = handlebars.compile(templateContent);
      const processedContent = template(context);

      // Skip writing empty files
      if (processedContent.trim().length === 0) {
        consola.debug(`Skipping empty file: ${outputPath}`);
        return;
      }

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
      if (this.shouldSkipFile(file, context, sourceDir)) {
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
   * @param sourceDir - Source directory for template
   * @returns True if file should be skipped
   */
  private shouldSkipFile(file: string, context: TemplateContext, sourceDir?: string): boolean {
    const fileName = path.basename(file);

    const isConfigFile = fileName.match(
      /(\.(config|rc)\.(js|mjs|cjs|ts)\.hbs$|^(tailwind|postcss|vite|vitest|tsconfig|eslint|prettier)\.config\.(js|mjs|cjs|ts)\.hbs$)/
    );

    if (context.gitignore === false && fileName === "_gitignore") {
      return true;
    }

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

    // Skip TypeScript files when TypeScript is disabled
    if (!context.typescript && (fileName.endsWith(".ts.hbs") || fileName.endsWith(".tsx.hbs"))) {
      return true;
    }

    // When TypeScript is enabled:
    // - Skip JS/JSX files (except config files which may need both)
    // - Skip JS config files if a TS version exists
    if (context.typescript) {
      // For config files, check if a TypeScript version exists
      if (isConfigFile && (fileName.endsWith(".js.hbs") || fileName.endsWith(".mjs.hbs"))) {
        const tsConfigName = fileName.replace(/\.(m?js)\.hbs$/, ".ts.hbs");
        const tsConfigPath = path.join(path.dirname(file), tsConfigName);
        if (sourceDir) {
          const fullTsConfigPath = path.join(this.templateRoot, sourceDir, tsConfigPath);
          // Skip JS/MJS config if TS version exists
          if (fsExtra.pathExistsSync(fullTsConfigPath)) {
            return true;
          }
        }
      }
      // Skip non-config JS/JSX files when TypeScript is enabled
      else if ((fileName.endsWith(".js.hbs") || fileName.endsWith(".jsx.hbs")) && !isConfigFile) {
        return true;
      }
    }

    // When TypeScript is disabled:
    // - Use .mjs config files if no .js version exists (for ESM compatibility)
    if (!context.typescript && isConfigFile && fileName.endsWith(".mjs.hbs")) {
      const jsConfigName = fileName.replace(/\.mjs\.hbs$/, ".js.hbs");
      const jsConfigPath = path.join(path.dirname(file), jsConfigName);
      if (sourceDir) {
        const fullJsConfigPath = path.join(this.templateRoot, sourceDir, jsConfigPath);
        // Only use .mjs if no .js version exists
        if (fsExtra.pathExistsSync(fullJsConfigPath)) {
          return true;
        }
      }
    }
    if (context.styling !== "scss" && fileName.endsWith(".scss.hbs")) {
      return true;
    }
    if (fileName === "style.scss.hbs" && context.styling !== "scss") {
      return true;
    }
    // Skip Tailwind/PostCSS configs when not using Tailwind
    if (
      (fileName === "tailwind.config.js.hbs" ||
        fileName === "tailwind.config.ts.hbs" ||
        fileName === "postcss.config.js.hbs" ||
        fileName === "postcss.config.ts.hbs" ||
        fileName === "tailwind.config.mjs.hbs" ||
        fileName === "postcss.config.mjs.hbs") &&
      context.styling !== "tailwind"
    ) {
      return true;
    }

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

  /**
   * Render a template and return the processed content as a string
   * @param templatePath - Path to template file relative to template root
   * @param context - Template context data
   * @returns Processed template content
   */
  async renderTemplate(templatePath: string, context: TemplateContext): Promise<string> {
    try {
      await this.registerDefaultPartials();

      const resolvedTemplatePath = path.isAbsolute(templatePath)
        ? templatePath
        : path.join(this.templateRoot, templatePath);

      if (!(await pathExists(resolvedTemplatePath))) {
        throw new Error(`Template file not found: ${resolvedTemplatePath}`);
      }

      const templateContent = await readFile(resolvedTemplatePath, "utf-8");
      const template = handlebars.compile(templateContent);
      const processedContent = template(context);

      consola.debug(`Rendered template: ${templatePath}`);
      return processedContent;
    } catch (error) {
      consola.error(`Error rendering template ${templatePath}:`, error);
      throw new Error(
        `Failed to render template: ${templatePath} (resolved: ${path.isAbsolute(templatePath) ? templatePath : path.join(this.templateRoot, templatePath)})`
      );
    }
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

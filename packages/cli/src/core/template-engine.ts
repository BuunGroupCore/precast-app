import path from "node:path";
import fs from "fs-extra";
import { globby } from "globby";
import handlebars from "handlebars";
import { consola } from "consola";
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
    // Equality helper
    this.registerHelper("eq", (a, b) => a === b);
    
    // Logical helpers
    this.registerHelper("and", (a, b) => a && b);
    this.registerHelper("or", (a, b) => a || b);
    this.registerHelper("not", (a) => !a);
    
    // Array helpers
    this.registerHelper("includes", (array, value) => 
      Array.isArray(array) && array.includes(value)
    );
    
    // String helpers
    this.registerHelper("capitalize", (str) => 
      str ? str.charAt(0).toUpperCase() + str.slice(1) : ""
    );
    this.registerHelper("kebabCase", (str) => 
      str ? str.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase() : ""
    );
    this.registerHelper("camelCase", (str) => 
      str ? str.replace(/-./g, x => x[1].toUpperCase()) : ""
    );
    
    // Conditional includes
    this.registerHelper("ifAny", function(this: any, ...args) {
      const options = args.pop();
      return args.some(Boolean) ? options.fn(this) : options.inverse(this);
    });
    
    this.registerHelper("ifAll", function(this: any, ...args) {
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
      // Check if output exists and handle accordingly
      if (await fs.pathExists(outputPath)) {
        if (options.skipIfExists) {
          consola.debug(`Skipping existing file: ${outputPath}`);
          return;
        }
        if (!options.overwrite) {
          throw new Error(`File already exists: ${outputPath}`);
        }
      }

      // Read and compile template
      const templateContent = await fs.readFile(templatePath, "utf-8");
      const template = handlebars.compile(templateContent);
      
      // Process template with context
      const processedContent = template(context);
      
      // Ensure directory exists
      await fs.ensureDir(path.dirname(outputPath));
      
      // Write processed content
      await fs.writeFile(outputPath, processedContent);
      
      consola.debug(`Generated: ${outputPath}`);
    } catch (error) {
      consola.error(`Error processing template ${templatePath}:`, error);
      throw new Error(`Failed to process template: ${templatePath}`);
    }
  }

  async copyTemplateDirectory(
    sourceDir: string,
    destDir: string,
    context: TemplateContext,
    options: TemplateOptions = {}
  ): Promise<void> {
    const templateDir = path.join(this.templateRoot, sourceDir);
    
    if (!(await fs.pathExists(templateDir))) {
      throw new Error(`Template directory not found: ${templateDir}`);
    }

    // Find all files in the template directory
    const files = await globby("**/*", {
      cwd: templateDir,
      dot: true,
      onlyFiles: true,
      absolute: false,
    });

    for (const file of files) {
      const sourcePath = path.join(templateDir, file);
      let destFile = file;

      // Handle special file names
      if (destFile.endsWith(".hbs")) {
        destFile = destFile.slice(0, -4); // Remove .hbs extension
      }
      
      // Handle dotfiles (e.g., _gitignore -> .gitignore)
      const basename = path.basename(destFile);
      if (basename.startsWith("_")) {
        destFile = path.join(
          path.dirname(destFile),
          "." + basename.slice(1)
        );
      }

      const destPath = path.join(destDir, destFile);

      // Process template files
      if (file.endsWith(".hbs")) {
        await this.processTemplate(sourcePath, destPath, context, options);
      } else {
        // Copy non-template files directly
        await fs.ensureDir(path.dirname(destPath));
        
        if (await fs.pathExists(destPath)) {
          if (options.skipIfExists) {
            consola.debug(`Skipping existing file: ${destPath}`);
            continue;
          }
          if (!options.overwrite) {
            throw new Error(`File already exists: ${destPath}`);
          }
        }
        
        await fs.copy(sourcePath, destPath, { overwrite: options.overwrite });
        consola.debug(`Copied: ${destPath}`);
      }
    }
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
      const shouldProcess = typeof template.condition === "function"
        ? template.condition(context)
        : template.condition;

      if (shouldProcess) {
        const destDir = template.destDir
          ? path.join(projectDir, template.destDir)
          : projectDir;

        await this.copyTemplateDirectory(
          template.sourceDir,
          destDir,
          context,
          options
        );
      }
    }
  }

  async getAvailableTemplates(category: string): Promise<string[]> {
    const categoryPath = path.join(this.templateRoot, category);
    
    if (!(await fs.pathExists(categoryPath))) {
      return [];
    }

    const entries = await fs.readdir(categoryPath, { withFileTypes: true });
    return entries
      .filter(entry => entry.isDirectory())
      .map(entry => entry.name);
  }
}

// Singleton instance
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
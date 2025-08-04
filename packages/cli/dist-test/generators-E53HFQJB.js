// src/utils/logger.ts
import chalk from "chalk";
var logger = {
  header: (message) => {
    console.log("\n" + chalk.bold.bgYellow.black(` ${message} `) + "\n");
  },
  info: (message) => {
    console.log(message);
  },
  success: (message) => {
    console.log(chalk.green("\u2713") + " " + message);
  },
  error: (message) => {
    console.log(chalk.red("\u2717") + " " + message);
  },
  warn: (message) => {
    console.log(chalk.yellow("\u26A0") + " " + message);
  },
  debug: (message) => {
    if (process.env.DEBUG) {
      console.log(chalk.gray("[DEBUG]") + " " + message);
    }
  }
};

// src/utils/template-path.ts
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs-extra";
var __filename = fileURLToPath(import.meta.url);
var __dirname = path.dirname(__filename);
function getTemplateRoot() {
  const devPath = path.join(__dirname, "..", "templates");
  const distPath = path.join(__dirname, "..", "..", "templates");
  if (__dirname.includes(path.sep + "dist" + path.sep)) {
    return distPath;
  }
  if (fs.existsSync(devPath)) {
    return devPath;
  }
  if (fs.existsSync(distPath)) {
    return distPath;
  }
  const cwd = process.cwd();
  const fallbackPath = path.join(cwd, "dist", "templates");
  if (fs.existsSync(fallbackPath)) {
    return fallbackPath;
  }
  throw new Error(
    `Template directory not found. Tried paths: ${devPath}, ${distPath}, ${fallbackPath}`
  );
}

// src/generators/angular-template.ts
import path3 from "path";
import { fileURLToPath as fileURLToPath2 } from "url";
import { consola as consola3 } from "consola";

// src/core/plugin-manager.ts
import { consola } from "consola";
var PluginManager = class {
  plugins = /* @__PURE__ */ new Map();
  executionOrder = [];
  register(plugin) {
    if (this.plugins.has(plugin.name)) {
      throw new Error(`Plugin "${plugin.name}" is already registered`);
    }
    this.plugins.set(plugin.name, plugin);
    this.executionOrder.push(plugin.name);
    consola.debug(`Registered plugin: ${plugin.name}`);
  }
  unregister(pluginName) {
    const index = this.executionOrder.indexOf(pluginName);
    if (index > -1) {
      this.executionOrder.splice(index, 1);
    }
    return this.plugins.delete(pluginName);
  }
  getPlugin(name) {
    return this.plugins.get(name);
  }
  getAllPlugins() {
    return this.executionOrder.map((name) => this.plugins.get(name));
  }
  async executeHook(hookName, context) {
    const results = [];
    for (const pluginName of this.executionOrder) {
      const plugin = this.plugins.get(pluginName);
      if (!plugin) continue;
      const hook = plugin[hookName];
      if (typeof hook === "function") {
        try {
          consola.debug(`Executing ${hookName} hook for plugin: ${pluginName}`);
          const result = await hook(context);
          results.push(result);
        } catch (error) {
          consola.error(`Error in plugin "${pluginName}" ${hookName} hook:`, error);
          throw error;
        }
      }
    }
    return results;
  }
  async validateConfig(config) {
    const allErrors = [];
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
      errors: allErrors
    };
  }
  async transformConfig(config) {
    let transformedConfig = { ...config };
    for (const plugin of this.getAllPlugins()) {
      if (plugin.transformConfig) {
        transformedConfig = plugin.transformConfig(transformedConfig);
      }
    }
    return transformedConfig;
  }
  // Convenience methods for common hooks
  async runPreGenerate(context) {
    await this.executeHook("preGenerate", context);
  }
  async runGenerate(context) {
    await this.executeHook("generate", context);
  }
  async runPostGenerate(context) {
    await this.executeHook("postGenerate", context);
  }
  async runBeforeInstall(context) {
    await this.executeHook("beforeInstall", context);
  }
  async runAfterInstall(context) {
    await this.executeHook("afterInstall", context);
  }
};
var pluginManager = null;
function getPluginManager() {
  if (!pluginManager) {
    pluginManager = new PluginManager();
  }
  return pluginManager;
}

// src/core/template-engine.ts
import path2 from "path";
import { consola as consola2 } from "consola";
import fs2 from "fs-extra";
import { globby } from "globby";
import handlebars from "handlebars";
var TemplateEngine = class {
  templateRoot;
  helpers = /* @__PURE__ */ new Map();
  constructor(templateRoot) {
    this.templateRoot = templateRoot;
    this.registerDefaultHelpers();
  }
  registerDefaultHelpers() {
    this.registerHelper("eq", (a, b) => a === b);
    this.registerHelper("and", (a, b) => a && b);
    this.registerHelper("or", (a, b) => a || b);
    this.registerHelper("not", (a) => !a);
    this.registerHelper(
      "includes",
      (array, value) => Array.isArray(array) && array.includes(value)
    );
    this.registerHelper(
      "capitalize",
      (str) => str ? str.charAt(0).toUpperCase() + str.slice(1) : ""
    );
    this.registerHelper(
      "kebabCase",
      (str) => str ? str.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase() : ""
    );
    this.registerHelper(
      "camelCase",
      (str) => str ? str.replace(/-./g, (x) => x[1].toUpperCase()) : ""
    );
    this.registerHelper("ifAny", function(...args) {
      const options = args.pop();
      return args.some(Boolean) ? options.fn(this) : options.inverse(this);
    });
    this.registerHelper("ifAll", function(...args) {
      const options = args.pop();
      return args.every(Boolean) ? options.fn(this) : options.inverse(this);
    });
  }
  registerHelper(name, helper) {
    this.helpers.set(name, helper);
    handlebars.registerHelper(name, helper);
  }
  async processTemplate(templatePath, outputPath, context, options = {}) {
    try {
      if (await fs2.pathExists(outputPath)) {
        if (options.skipIfExists) {
          consola2.debug(`Skipping existing file: ${outputPath}`);
          return;
        }
        if (!options.overwrite) {
          throw new Error(`File already exists: ${outputPath}`);
        }
      }
      const templateContent = await fs2.readFile(templatePath, "utf-8");
      const template = handlebars.compile(templateContent);
      const processedContent = template(context);
      await fs2.ensureDir(path2.dirname(outputPath));
      await fs2.writeFile(outputPath, processedContent);
      consola2.debug(`Generated: ${outputPath}`);
    } catch (error) {
      consola2.error(`Error processing template ${templatePath}:`, error);
      throw new Error(`Failed to process template: ${templatePath}`);
    }
  }
  async copyTemplateDirectory(sourceDir, destDir, context, options = {}) {
    const templateDir = path2.join(this.templateRoot, sourceDir);
    if (!await fs2.pathExists(templateDir)) {
      throw new Error(`Template directory not found: ${templateDir}`);
    }
    const files = await globby("**/*", {
      cwd: templateDir,
      dot: true,
      onlyFiles: true,
      absolute: false
    });
    for (const file of files) {
      const sourcePath = path2.join(templateDir, file);
      let destFile = file;
      if (this.shouldSkipFile(file, context)) {
        consola2.debug(`Skipping file based on conditions: ${file}`);
        continue;
      }
      if (destFile.endsWith(".hbs")) {
        destFile = destFile.slice(0, -4);
      }
      const basename = path2.basename(destFile);
      if (basename.startsWith("_")) {
        destFile = path2.join(path2.dirname(destFile), "." + basename.slice(1));
      }
      const destPath = path2.join(destDir, destFile);
      if (file.endsWith(".hbs")) {
        await this.processTemplate(sourcePath, destPath, context, options);
      } else {
        await fs2.ensureDir(path2.dirname(destPath));
        if (await fs2.pathExists(destPath)) {
          if (options.skipIfExists) {
            consola2.debug(`Skipping existing file: ${destPath}`);
            continue;
          }
          if (!options.overwrite) {
            throw new Error(`File already exists: ${destPath}`);
          }
        }
        await fs2.copy(sourcePath, destPath, { overwrite: options.overwrite });
        consola2.debug(`Copied: ${destPath}`);
      }
    }
  }
  shouldSkipFile(file, context) {
    const fileName = path2.basename(file);
    if (!context.typescript && (fileName.endsWith(".ts.hbs") || fileName.endsWith(".tsx.hbs"))) {
      return true;
    }
    if (context.typescript && (fileName.endsWith(".js.hbs") || fileName.endsWith(".jsx.hbs"))) {
      return true;
    }
    if (context.styling !== "scss" && fileName.endsWith(".scss.hbs")) {
      return true;
    }
    if (fileName === "style.scss.hbs" && context.styling !== "scss") {
      return true;
    }
    if ((fileName === "tailwind.config.js.hbs" || fileName === "postcss.config.js.hbs" || fileName === "tailwind.config.mjs.hbs" || fileName === "postcss.config.mjs.hbs") && context.styling !== "tailwind") {
      return true;
    }
    if (!context.typescript && (fileName === "tsconfig.json.hbs" || fileName === "tsconfig.app.json.hbs" || fileName === "env.d.ts.hbs" || fileName === "tsconfig.node.json.hbs")) {
      return true;
    }
    return false;
  }
  async processConditionalTemplates(templates, projectDir, context, options = {}) {
    for (const template of templates) {
      const shouldProcess = typeof template.condition === "function" ? template.condition(context) : template.condition;
      if (shouldProcess) {
        const destDir = template.destDir ? path2.join(projectDir, template.destDir) : projectDir;
        await this.copyTemplateDirectory(template.sourceDir, destDir, context, options);
      }
    }
  }
  async getAvailableTemplates(category) {
    const categoryPath = path2.join(this.templateRoot, category);
    if (!await fs2.pathExists(categoryPath)) {
      return [];
    }
    const entries = await fs2.readdir(categoryPath, { withFileTypes: true });
    return entries.filter((entry) => entry.isDirectory()).map((entry) => entry.name);
  }
};
var templateEngine = null;
function createTemplateEngine(templateRoot) {
  if (!templateEngine) {
    templateEngine = new TemplateEngine(templateRoot);
  }
  return templateEngine;
}

// src/generators/angular-template.ts
var __filename2 = fileURLToPath2(import.meta.url);
var __dirname2 = path3.dirname(__filename2);
async function generateAngularTemplate(config, projectPath) {
  const templateRoot = getTemplateRoot();
  const templateEngine2 = createTemplateEngine(templateRoot);
  const pluginManager2 = getPluginManager();
  const context = {
    config,
    projectPath,
    templateEngine: templateEngine2,
    logger: consola3
  };
  try {
    await pluginManager2.runPreGenerate(context);
    await templateEngine2.copyTemplateDirectory("frameworks/angular/base", projectPath, config, {
      overwrite: true
    });
    await templateEngine2.copyTemplateDirectory(
      "frameworks/angular/src",
      path3.join(projectPath, "src"),
      config,
      { overwrite: true }
    );
    await pluginManager2.runGenerate(context);
    await pluginManager2.runPostGenerate(context);
    consola3.success("Angular project generated successfully!");
  } catch (error) {
    consola3.error("Failed to generate Angular project:", error);
    throw error;
  }
}

// src/generators/astro-template.ts
import path4 from "path";
import { fileURLToPath as fileURLToPath3 } from "url";
import { consola as consola4 } from "consola";
var __filename3 = fileURLToPath3(import.meta.url);
var __dirname3 = path4.dirname(__filename3);
async function generateAstroTemplate(config, projectPath) {
  const templateRoot = getTemplateRoot();
  const templateEngine2 = createTemplateEngine(templateRoot);
  const pluginManager2 = getPluginManager();
  const context = {
    config,
    projectPath,
    templateEngine: templateEngine2,
    logger: consola4
  };
  try {
    await pluginManager2.runPreGenerate(context);
    await templateEngine2.copyTemplateDirectory("frameworks/astro/base", projectPath, config, {
      overwrite: true
    });
    await templateEngine2.copyTemplateDirectory(
      "frameworks/astro/src",
      path4.join(projectPath, "src"),
      config,
      { overwrite: true }
    );
    await pluginManager2.runGenerate(context);
    await pluginManager2.runPostGenerate(context);
    consola4.success("Astro project generated successfully!");
  } catch (error) {
    consola4.error("Failed to generate Astro project:", error);
    throw error;
  }
}

// src/generators/next-template.ts
import path5 from "path";
import { fileURLToPath as fileURLToPath4 } from "url";
import { consola as consola5 } from "consola";
var __filename4 = fileURLToPath4(import.meta.url);
var __dirname4 = path5.dirname(__filename4);
async function generateNextTemplate(config, projectPath) {
  const templateRoot = getTemplateRoot();
  const templateEngine2 = createTemplateEngine(templateRoot);
  const pluginManager2 = getPluginManager();
  const context = {
    config,
    projectPath,
    templateEngine: templateEngine2,
    logger: consola5
  };
  try {
    await pluginManager2.runPreGenerate(context);
    await templateEngine2.copyTemplateDirectory("frameworks/next/base", projectPath, config, {
      overwrite: true
    });
    await templateEngine2.copyTemplateDirectory(
      "frameworks/next/app",
      path5.join(projectPath, "app"),
      config,
      { overwrite: true }
    );
    await templateEngine2.copyTemplateDirectory(
      "frameworks/next/src",
      path5.join(projectPath, "src"),
      config,
      { overwrite: true }
    );
    await pluginManager2.runGenerate(context);
    await pluginManager2.runPostGenerate(context);
    consola5.success("Next.js project generated successfully!");
  } catch (error) {
    consola5.error("Failed to generate Next.js project:", error);
    throw error;
  }
}

// src/generators/nuxt-template.ts
import path6 from "path";
import { fileURLToPath as fileURLToPath5 } from "url";
import { consola as consola6 } from "consola";
var __filename5 = fileURLToPath5(import.meta.url);
var __dirname5 = path6.dirname(__filename5);
async function generateNuxtTemplate(config, projectPath) {
  const templateRoot = getTemplateRoot();
  const templateEngine2 = createTemplateEngine(templateRoot);
  const pluginManager2 = getPluginManager();
  const context = {
    config,
    projectPath,
    templateEngine: templateEngine2,
    logger: consola6
  };
  try {
    await pluginManager2.runPreGenerate(context);
    await templateEngine2.copyTemplateDirectory("frameworks/nuxt/base", projectPath, config, {
      overwrite: true
    });
    await templateEngine2.copyTemplateDirectory(
      "frameworks/nuxt/src",
      path6.join(projectPath, "src"),
      config,
      { overwrite: true }
    );
    await pluginManager2.runGenerate(context);
    await pluginManager2.runPostGenerate(context);
    consola6.success("Nuxt project generated successfully!");
  } catch (error) {
    consola6.error("Failed to generate Nuxt project:", error);
    throw error;
  }
}

// src/generators/react-template.ts
import path7 from "path";
import { consola as consola7 } from "consola";
async function generateReactTemplate(config, projectPath) {
  const templateRoot = getTemplateRoot();
  const templateEngine2 = createTemplateEngine(templateRoot);
  const pluginManager2 = getPluginManager();
  const context = {
    config,
    projectPath,
    templateEngine: templateEngine2,
    logger: consola7
  };
  try {
    await pluginManager2.runPreGenerate(context);
    await templateEngine2.copyTemplateDirectory("frameworks/react/base", projectPath, config, {
      overwrite: true
    });
    await templateEngine2.copyTemplateDirectory(
      "frameworks/react/src",
      path7.join(projectPath, "src"),
      config,
      { overwrite: true }
    );
    await pluginManager2.runGenerate(context);
    await pluginManager2.runPostGenerate(context);
    consola7.success("React project generated successfully!");
  } catch (error) {
    consola7.error("Failed to generate React project:", error);
    throw error;
  }
}

// src/generators/remix-template.ts
import path8 from "path";
import { fileURLToPath as fileURLToPath6 } from "url";
import { consola as consola8 } from "consola";
var __filename6 = fileURLToPath6(import.meta.url);
var __dirname6 = path8.dirname(__filename6);
async function generateRemixTemplate(config, projectPath) {
  const templateRoot = getTemplateRoot();
  const templateEngine2 = createTemplateEngine(templateRoot);
  const pluginManager2 = getPluginManager();
  const context = {
    config,
    projectPath,
    templateEngine: templateEngine2,
    logger: consola8
  };
  try {
    await pluginManager2.runPreGenerate(context);
    await templateEngine2.copyTemplateDirectory("frameworks/remix/base", projectPath, config, {
      overwrite: true
    });
    await templateEngine2.copyTemplateDirectory(
      "frameworks/remix/app",
      path8.join(projectPath, "app"),
      config,
      { overwrite: true }
    );
    await pluginManager2.runGenerate(context);
    await pluginManager2.runPostGenerate(context);
    consola8.success("Remix project generated successfully!");
  } catch (error) {
    consola8.error("Failed to generate Remix project:", error);
    throw error;
  }
}

// src/generators/solid-template.ts
import path9 from "path";
import { fileURLToPath as fileURLToPath7 } from "url";
import { consola as consola9 } from "consola";
var __filename7 = fileURLToPath7(import.meta.url);
var __dirname7 = path9.dirname(__filename7);
async function generateSolidTemplate(config, projectPath) {
  const templateRoot = getTemplateRoot();
  const templateEngine2 = createTemplateEngine(templateRoot);
  const pluginManager2 = getPluginManager();
  const context = {
    config,
    projectPath,
    templateEngine: templateEngine2,
    logger: consola9
  };
  try {
    await pluginManager2.runPreGenerate(context);
    await templateEngine2.copyTemplateDirectory("frameworks/solid/base", projectPath, config, {
      overwrite: true
    });
    await templateEngine2.copyTemplateDirectory(
      "frameworks/solid/src",
      path9.join(projectPath, "src"),
      config,
      { overwrite: true }
    );
    await pluginManager2.runGenerate(context);
    await pluginManager2.runPostGenerate(context);
    consola9.success("Solid project generated successfully!");
  } catch (error) {
    consola9.error("Failed to generate Solid project:", error);
    throw error;
  }
}

// src/generators/svelte-template.ts
import path10 from "path";
import { fileURLToPath as fileURLToPath8 } from "url";
import { consola as consola10 } from "consola";
var __filename8 = fileURLToPath8(import.meta.url);
var __dirname8 = path10.dirname(__filename8);
async function generateSvelteTemplate(config, projectPath) {
  const templateRoot = getTemplateRoot();
  const templateEngine2 = createTemplateEngine(templateRoot);
  const pluginManager2 = getPluginManager();
  const context = {
    config,
    projectPath,
    templateEngine: templateEngine2,
    logger: consola10
  };
  try {
    await pluginManager2.runPreGenerate(context);
    await templateEngine2.copyTemplateDirectory("frameworks/svelte/base", projectPath, config, {
      overwrite: true
    });
    await templateEngine2.copyTemplateDirectory(
      "frameworks/svelte/src",
      path10.join(projectPath, "src"),
      config,
      { overwrite: true }
    );
    await pluginManager2.runGenerate(context);
    await pluginManager2.runPostGenerate(context);
    consola10.success("Svelte project generated successfully!");
  } catch (error) {
    consola10.error("Failed to generate Svelte project:", error);
    throw error;
  }
}

// src/generators/vanilla-template.ts
import path11 from "path";
import { fileURLToPath as fileURLToPath9 } from "url";
import { consola as consola11 } from "consola";
var __filename9 = fileURLToPath9(import.meta.url);
var __dirname9 = path11.dirname(__filename9);
async function generateVanillaTemplate(config, projectPath) {
  const templateRoot = getTemplateRoot();
  const templateEngine2 = createTemplateEngine(templateRoot);
  const pluginManager2 = getPluginManager();
  const context = {
    config,
    projectPath,
    templateEngine: templateEngine2,
    logger: consola11
  };
  try {
    await pluginManager2.runPreGenerate(context);
    await templateEngine2.copyTemplateDirectory("frameworks/vanilla/base", projectPath, config, {
      overwrite: true
    });
    await templateEngine2.copyTemplateDirectory(
      "frameworks/vanilla/src",
      path11.join(projectPath, "src"),
      config,
      { overwrite: true }
    );
    await pluginManager2.runGenerate(context);
    await pluginManager2.runPostGenerate(context);
    consola11.success("Vanilla project generated successfully!");
  } catch (error) {
    consola11.error("Failed to generate Vanilla project:", error);
    throw error;
  }
}

// src/generators/vite-template.ts
import path12 from "path";
import { fileURLToPath as fileURLToPath10 } from "url";
import { consola as consola12 } from "consola";
var __filename10 = fileURLToPath10(import.meta.url);
var __dirname10 = path12.dirname(__filename10);
async function generateViteTemplate(config, projectPath) {
  const templateRoot = getTemplateRoot();
  const templateEngine2 = createTemplateEngine(templateRoot);
  const pluginManager2 = getPluginManager();
  const context = {
    config,
    projectPath,
    templateEngine: templateEngine2,
    logger: consola12
  };
  try {
    await pluginManager2.runPreGenerate(context);
    await templateEngine2.copyTemplateDirectory("frameworks/vite/base", projectPath, config, {
      overwrite: true
    });
    await templateEngine2.copyTemplateDirectory(
      "frameworks/vite/src",
      path12.join(projectPath, "src"),
      config,
      { overwrite: true }
    );
    await pluginManager2.runGenerate(context);
    await pluginManager2.runPostGenerate(context);
    consola12.success("Vite project generated successfully!");
  } catch (error) {
    consola12.error("Failed to generate Vite project:", error);
    throw error;
  }
}

// src/generators/vue-template.ts
import path13 from "path";
import { fileURLToPath as fileURLToPath11 } from "url";
import { consola as consola13 } from "consola";
var __filename11 = fileURLToPath11(import.meta.url);
var __dirname11 = path13.dirname(__filename11);
async function generateVueTemplate(config, projectPath) {
  const templateRoot = getTemplateRoot();
  const templateEngine2 = createTemplateEngine(templateRoot);
  const pluginManager2 = getPluginManager();
  const context = {
    config,
    projectPath,
    templateEngine: templateEngine2,
    logger: consola13
  };
  try {
    await pluginManager2.runPreGenerate(context);
    await templateEngine2.copyTemplateDirectory("frameworks/vue/base", projectPath, config, {
      overwrite: true
    });
    await templateEngine2.copyTemplateDirectory(
      "frameworks/vue/src",
      path13.join(projectPath, "src"),
      config,
      { overwrite: true }
    );
    await pluginManager2.runGenerate(context);
    await pluginManager2.runPostGenerate(context);
    consola13.success("Vue project generated successfully!");
  } catch (error) {
    consola13.error("Failed to generate Vue project:", error);
    throw error;
  }
}

// src/generators/index.ts
async function generateTemplate(config, projectPath) {
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
export {
  generateTemplate
};

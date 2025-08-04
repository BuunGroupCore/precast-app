// src/core/template-engine.ts
import path from "path";
import { consola } from "consola";
import fsExtra from "fs-extra";
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
  async processVariantTemplate(baseTemplatePath, outputPath, context, variants, options = {}) {
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
  async copyTemplateDirectory(sourceDir, destDir, context, options = {}) {
    const templateDir = path.join(this.templateRoot, sourceDir);
    if (!await fsExtra.pathExists(templateDir)) {
      throw new Error(`Template directory not found: ${templateDir}`);
    }
    const files = await globby("**/*", {
      cwd: templateDir,
      dot: true,
      onlyFiles: true
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
  shouldSkipFile(file, context) {
    const fileName = path.basename(file);
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
        const destDir = template.destDir ? path.join(projectDir, template.destDir) : projectDir;
        await this.copyTemplateDirectory(template.sourceDir, destDir, context, options);
      }
    }
  }
  async getAvailableTemplates(category) {
    const categoryPath = path.join(this.templateRoot, category);
    if (!await fsExtra.pathExists(categoryPath)) {
      return [];
    }
    const entries = await fsExtra.readdir(categoryPath, { withFileTypes: true });
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

// src/utils/ai-context-setup.ts
import path2 from "path";
import { consola as consola2 } from "consola";
async function setupAIContextFiles(config, projectPath, templateEngine2) {
  if (!config.aiContext || config.aiContext.length === 0) {
    return;
  }
  consola2.info("Setting up AI context files...");
  for (const context of config.aiContext) {
    try {
      switch (context) {
        case "claude":
          await templateEngine2.processTemplate(
            "ai-context/CLAUDE.md.hbs",
            path2.join(projectPath, "CLAUDE.md"),
            config
          );
          break;
        case "copilot":
          await templateEngine2.processTemplate(
            "ai-context/.github/copilot-instructions.md.hbs",
            path2.join(projectPath, ".github", "copilot-instructions.md"),
            config
          );
          break;
        case "gemini":
          await templateEngine2.processTemplate(
            "ai-context/GEMINI.md.hbs",
            path2.join(projectPath, "GEMINI.md"),
            config
          );
          break;
      }
    } catch (error) {
      consola2.warn(`Failed to create ${context} context file:`, error);
    }
  }
}

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
import path3 from "path";
import { fileURLToPath } from "url";
import fsExtra2 from "fs-extra";
var __filename = fileURLToPath(import.meta.url);
var __dirname = path3.dirname(__filename);
function getTemplateRoot() {
  const prodPath = path3.join(__dirname, "templates");
  const devPath = path3.join(__dirname, "..", "templates");
  const altPath = path3.join(__dirname, "..", "..", "templates");
  if (fsExtra2.existsSync(prodPath)) {
    return prodPath;
  }
  if (fsExtra2.existsSync(devPath)) {
    return devPath;
  }
  if (fsExtra2.existsSync(altPath)) {
    return altPath;
  }
  const cwd = process.cwd();
  const cwdPath = path3.join(cwd, "dist", "templates");
  if (fsExtra2.existsSync(cwdPath)) {
    return cwdPath;
  }
  throw new Error(
    `Template directory not found. Tried paths: ${prodPath}, ${devPath}, ${altPath}, ${cwdPath}. __dirname: ${__dirname}`
  );
}

// src/utils/ui-library-setup.ts
import { consola as consola3 } from "consola";
import { execa } from "execa";

// src/utils/dependency-checker.ts
var UI_LIBRARY_COMPATIBILITY = {
  shadcn: {
    name: "shadcn/ui",
    frameworks: ["react", "next", "remix", "vite"],
    requiredDeps: [
      "tailwindcss",
      "tailwindcss-animate",
      "class-variance-authority",
      "clsx",
      "tailwind-merge"
    ],
    setupCommand: "npx shadcn-ui@latest init",
    postInstallSteps: [
      "Configure components.json",
      "Add CSS variables to globals.css",
      "Configure tailwind.config.js"
    ]
  },
  daisyui: {
    name: "DaisyUI",
    frameworks: ["react", "vue", "svelte", "next", "nuxt", "remix", "vite", "astro", "solid"],
    requiredDeps: ["tailwindcss", "daisyui"],
    incompatibleWith: ["shadcn"],
    postInstallSteps: ["Add daisyui to tailwind.config.js plugins"]
  },
  mui: {
    name: "Material UI",
    frameworks: ["react", "next", "remix", "vite"],
    requiredDeps: ["@mui/material", "@emotion/react", "@emotion/styled"],
    incompatibleWith: ["preact"]
  },
  vuetify: {
    name: "Vuetify",
    frameworks: ["vue", "nuxt"],
    requiredDeps: ["vuetify", "@mdi/font"],
    postInstallSteps: ["Configure vuetify plugin", "Import Vuetify CSS"]
  },
  chakra: {
    name: "Chakra UI",
    frameworks: ["react", "next", "remix", "vite"],
    requiredDeps: ["@chakra-ui/react", "@emotion/react", "@emotion/styled", "framer-motion"]
  },
  antd: {
    name: "Ant Design",
    frameworks: ["react", "next", "remix", "vite"],
    requiredDeps: ["antd"]
  },
  mantine: {
    name: "Mantine",
    frameworks: ["react", "next", "remix", "vite"],
    requiredDeps: ["@mantine/core", "@mantine/hooks"]
  }
};
function getAllRequiredDeps(libraries, compatibilityMap) {
  const deps = /* @__PURE__ */ new Set();
  for (const lib of libraries) {
    const rule = compatibilityMap[lib];
    if (rule?.requiredDeps) {
      rule.requiredDeps.forEach((dep) => deps.add(dep));
    }
  }
  return Array.from(deps);
}

// src/utils/ui-library-setup.ts
async function setupUILibrary(config, projectPath) {
  if (!config.uiLibrary || config.uiLibrary === "none") {
    return;
  }
  consola3.info(`Setting up ${config.uiLibrary}...`);
  const rule = UI_LIBRARY_COMPATIBILITY[config.uiLibrary];
  if (!rule) {
    consola3.warn(`Unknown UI library: ${config.uiLibrary}`);
    return;
  }
  try {
    const deps = getAllRequiredDeps([config.uiLibrary], UI_LIBRARY_COMPATIBILITY);
    if (deps.length > 0) {
      consola3.info(`Installing ${config.uiLibrary} dependencies...`);
      const installCmd = config.packageManager === "yarn" ? "add" : "install";
      const devFlag = config.packageManager === "yarn" ? "--dev" : "--save-dev";
      await execa(config.packageManager, [installCmd, ...deps, devFlag], {
        cwd: projectPath,
        stdio: "inherit"
      });
    }
    switch (config.uiLibrary) {
      case "shadcn":
        await setupShadcn(config, projectPath);
        break;
      case "daisyui":
        await setupDaisyUI(config, projectPath);
        break;
    }
    if (rule.postInstallSteps && rule.postInstallSteps.length > 0) {
      consola3.box({
        title: `${config.uiLibrary} Setup Complete`,
        message: `Next steps:
${rule.postInstallSteps.map((step, i) => `${i + 1}. ${step}`).join("\n")}`
      });
    }
  } catch (error) {
    consola3.error(`Failed to setup ${config.uiLibrary}:`, error);
    throw error;
  }
}
async function setupShadcn(config, projectPath) {
  consola3.info("Initializing shadcn/ui...");
  try {
    await execa("npx", ["shadcn-ui@latest", "init", "--defaults", "--yes"], {
      cwd: projectPath,
      stdio: "inherit"
    });
    const essentialComponents = ["button", "card", "input", "label"];
    consola3.info("Adding essential components...");
    for (const component of essentialComponents) {
      try {
        await execa("npx", ["shadcn-ui@latest", "add", component, "--yes"], {
          cwd: projectPath,
          stdio: "inherit"
        });
      } catch (error) {
        consola3.warn(`Failed to add ${component} component:`, error);
      }
    }
  } catch (error) {
    consola3.warn("Failed to initialize shadcn/ui:", error);
    consola3.info("You can manually initialize it later with: npx shadcn-ui@latest init");
  }
}
async function setupDaisyUI(_config, _projectPath) {
  consola3.info("Configuring DaisyUI...");
  consola3.success(
    "DaisyUI has been installed. Make sure to add it to your tailwind.config.js plugins array."
  );
}

// src/generators/base-generator.ts
import path4 from "path";
import { consola as consola5 } from "consola";

// src/core/plugin-manager.ts
import { consola as consola4 } from "consola";
var PluginManager = class {
  plugins = /* @__PURE__ */ new Map();
  executionOrder = [];
  register(plugin) {
    if (this.plugins.has(plugin.name)) {
      throw new Error(`Plugin "${plugin.name}" is already registered`);
    }
    this.plugins.set(plugin.name, plugin);
    this.executionOrder.push(plugin.name);
    consola4.debug(`Registered plugin: ${plugin.name}`);
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
          consola4.debug(`Executing ${hookName} hook for plugin: ${pluginName}`);
          const result = await hook(context);
          results.push(result);
        } catch (error) {
          consola4.error(`Error in plugin "${pluginName}" ${hookName} hook:`, error);
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

// src/generators/base-generator.ts
async function generateBaseTemplate(framework, config, projectPath, additionalDirs = []) {
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
    await templateEngine2.copyTemplateDirectory(
      `frameworks/${framework}/base`,
      projectPath,
      config,
      {
        overwrite: true
      }
    );
    const srcDir = `frameworks/${framework}/src`;
    if (await templateEngine2.getAvailableTemplates(`frameworks/${framework}`).then((dirs) => dirs.includes("src"))) {
      await templateEngine2.copyTemplateDirectory(srcDir, path4.join(projectPath, "src"), config, {
        overwrite: true
      });
    }
    for (const dir of additionalDirs) {
      await templateEngine2.copyTemplateDirectory(
        dir.source,
        path4.join(projectPath, dir.dest),
        config,
        { overwrite: true }
      );
    }
    await pluginManager2.runGenerate(context);
    await pluginManager2.runPostGenerate(context);
    consola5.success(
      `${framework.charAt(0).toUpperCase() + framework.slice(1)} project generated successfully!`
    );
  } catch (error) {
    consola5.error(`Failed to generate ${framework} project:`, error);
    throw error;
  }
}

// src/generators/angular-template.ts
async function generateAngularTemplate(config, projectPath) {
  await generateBaseTemplate("angular", config, projectPath);
}

// src/generators/astro-template.ts
async function generateAstroTemplate(config, projectPath) {
  await generateBaseTemplate("astro", config, projectPath);
}

// src/generators/next-template.ts
async function generateNextTemplate(config, projectPath) {
  await generateBaseTemplate("next", config, projectPath);
}

// src/generators/nuxt-template.ts
async function generateNuxtTemplate(config, projectPath) {
  await generateBaseTemplate("nuxt", config, projectPath);
}

// src/generators/react-template.ts
async function generateReactTemplate(config, projectPath) {
  await generateBaseTemplate("react", config, projectPath);
}

// src/generators/remix-template.ts
async function generateRemixTemplate(config, projectPath) {
  await generateBaseTemplate("remix", config, projectPath);
}

// src/generators/solid-template.ts
async function generateSolidTemplate(config, projectPath) {
  await generateBaseTemplate("solid", config, projectPath);
}

// src/generators/svelte-template.ts
async function generateSvelteTemplate(config, projectPath) {
  await generateBaseTemplate("svelte", config, projectPath);
}

// src/generators/vanilla-template.ts
async function generateVanillaTemplate(config, projectPath) {
  await generateBaseTemplate("vanilla", config, projectPath);
}

// src/generators/vite-template.ts
async function generateViteTemplate(config, projectPath) {
  await generateBaseTemplate("vite", config, projectPath);
}

// src/generators/vue-template.ts
async function generateVueTemplate(config, projectPath) {
  await generateBaseTemplate("vue", config, projectPath);
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
  const templateRoot = getTemplateRoot();
  const templateEngine2 = createTemplateEngine(templateRoot);
  await setupAIContextFiles(config, projectPath, templateEngine2);
  if (config.uiLibrary && config.framework !== "vanilla") {
    await setupUILibrary(config, projectPath);
  }
}
export {
  generateTemplate
};

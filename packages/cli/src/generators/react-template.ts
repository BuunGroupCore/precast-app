import path from "path";
import { fileURLToPath } from "url";
import { type ProjectConfig } from "../../../shared/stack-config.js";
import { createTemplateEngine } from "../core/template-engine.js";
import { getPluginManager } from "../core/plugin-manager.js";
import { consola } from "consola";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function generateReactTemplate(
  config: ProjectConfig,
  projectPath: string,
) {
  // Initialize template engine
  // Templates are copied to dist/templates during build
  const templateRoot = path.join(__dirname, "templates");
  const templateEngine = createTemplateEngine(templateRoot);
  
  // Get plugin manager
  const pluginManager = getPluginManager();
  
  // Create plugin context
  const context = {
    config,
    projectPath,
    templateEngine,
    logger: consola,
  };
  
  try {
    // Run pre-generate hooks
    await pluginManager.runPreGenerate(context);
    
    // Copy base React templates
    await templateEngine.copyTemplateDirectory(
      "frameworks/react/base",
      projectPath,
      config,
      { overwrite: true }
    );
    
    // Copy src directory templates
    await templateEngine.copyTemplateDirectory(
      "frameworks/react/src",
      path.join(projectPath, "src"),
      config,
      { overwrite: true }
    );
    
    // Conditional template processing
    // TODO: Add these templates when they're created
    // await templateEngine.processConditionalTemplates([
    //   // Backend API setup
    //   {
    //     condition: config.backend !== "none",
    //     sourceDir: "features/api/react",
    //     destDir: "src",
    //   },
    //   // Database setup
    //   {
    //     condition: config.orm === "prisma",
    //     sourceDir: "features/database/prisma",
    //   },
    //   {
    //     condition: config.orm === "drizzle",
    //     sourceDir: "features/database/drizzle",
    //   },
    //   // Authentication
    //   {
    //     condition: (ctx) => ctx.auth === true,
    //     sourceDir: "features/auth/react",
    //     destDir: "src",
    //   },
    //   // Testing setup
    //   {
    //     condition: (ctx) => ctx.testing === true,
    //     sourceDir: "features/testing/react",
    //   },
    // ], projectPath, config);
    
    // Run generate hooks
    await pluginManager.runGenerate(context);
    
    // Run post-generate hooks
    await pluginManager.runPostGenerate(context);
    
    consola.success("React project generated successfully!");
  } catch (error) {
    consola.error("Failed to generate React project:", error);
    throw error;
  }
}
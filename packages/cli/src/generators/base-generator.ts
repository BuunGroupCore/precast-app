import fs from "fs/promises";
import path from "path";

import { consola } from "consola";

import { type ProjectConfig } from "../../../shared/stack-config.js";
import { getPluginManager } from "../core/plugin-manager.js";
import { createTemplateEngine } from "../core/template-engine.js";
import { getTemplateRoot } from "../utils/template-path.js";

import { generateBackendTemplate } from "./backend-generator.js";

export async function generateBaseTemplate(
  framework: string,
  config: ProjectConfig,
  projectPath: string,
  additionalDirs: { source: string; dest: string }[] = []
) {
  const templateRoot = getTemplateRoot();
  const templateEngine = createTemplateEngine(templateRoot);
  const pluginManager = getPluginManager();

  // Check if this should be a monorepo (both frontend and backend)
  // Note: next-api is integrated into Next.js, so it's not a monorepo
  const isMonorepo = config.backend && config.backend !== "none" && config.backend !== "next-api";

  const context = {
    config,
    projectPath,
    templateEngine,
    logger: consola,
  };

  try {
    await pluginManager.runPreGenerate(context);

    if (isMonorepo) {
      // Generate monorepo structure
      await generateMonorepoProject(framework, config, projectPath, templateEngine);
    } else {
      // Generate single app structure (existing behavior)
      await generateSingleAppProject(framework, config, projectPath, templateEngine);
    }

    for (const dir of additionalDirs) {
      await templateEngine.copyTemplateDirectory(
        dir.source,
        path.join(projectPath, dir.dest),
        config,
        { overwrite: true }
      );
    }

    await pluginManager.runGenerate(context);
    await pluginManager.runPostGenerate(context);

    consola.success(
      `${framework.charAt(0).toUpperCase() + framework.slice(1)} project generated successfully!`
    );
  } catch (error) {
    consola.error(`Failed to generate ${framework} project:`, error);
    throw error;
  }
}

async function generateSingleAppProject(
  framework: string,
  config: ProjectConfig,
  projectPath: string,
  templateEngine: any
) {
  // Copy framework base files (existing behavior)
  await templateEngine.copyTemplateDirectory(`frameworks/${framework}/base`, projectPath, config, {
    overwrite: true,
  });

  // Copy framework source files
  const srcDir = `frameworks/${framework}/src`;
  if (
    await templateEngine
      .getAvailableTemplates(`frameworks/${framework}`)
      .then((dirs: string[]) => dirs.includes("src"))
  ) {
    await templateEngine.copyTemplateDirectory(srcDir, path.join(projectPath, "src"), config, {
      overwrite: true,
    });
  }
}

async function generateMonorepoProject(
  framework: string,
  config: ProjectConfig,
  projectPath: string,
  templateEngine: any
) {
  consola.info("Generating monorepo structure...");

  // Create workspace structure
  await templateEngine.copyTemplateDirectory("workspace", projectPath, config, {
    overwrite: true,
  });

  // Create apps and packages directories
  const appsDir = path.join(projectPath, "apps");
  const packagesDir = path.join(projectPath, "packages");

  await fs.mkdir(appsDir, { recursive: true });
  await fs.mkdir(packagesDir, { recursive: true });

  // Generate frontend in apps/web
  const webDir = path.join(appsDir, "web");
  await fs.mkdir(webDir, { recursive: true });

  await templateEngine.copyTemplateDirectory(`frameworks/${framework}/base`, webDir, config, {
    overwrite: true,
  });

  const srcDir = `frameworks/${framework}/src`;
  if (
    await templateEngine
      .getAvailableTemplates(`frameworks/${framework}`)
      .then((dirs: string[]) => dirs.includes("src"))
  ) {
    await templateEngine.copyTemplateDirectory(srcDir, path.join(webDir, "src"), config, {
      overwrite: true,
    });
  }

  // Generate backend in apps/api
  if (config.backend && config.backend !== "none") {
    const apiDir = path.join(appsDir, "api");
    await fs.mkdir(apiDir, { recursive: true });
    await generateBackendTemplate(config.backend, config, apiDir);
  }

  // Generate shared package in packages/shared
  const sharedDir = path.join(packagesDir, "shared");
  await fs.mkdir(sharedDir, { recursive: true });
  await templateEngine.copyTemplateDirectory("shared", sharedDir, config, {
    overwrite: true,
  });

  // Copy shared source files
  const sharedSrcExists = await templateEngine
    .getAvailableTemplates("shared")
    .then((dirs: string[]) => dirs.includes("src"))
    .catch(() => false);

  if (sharedSrcExists) {
    await templateEngine.copyTemplateDirectory("shared/src", path.join(sharedDir, "src"), config, {
      overwrite: true,
    });
  }

  consola.success("Monorepo structure created successfully!");
}

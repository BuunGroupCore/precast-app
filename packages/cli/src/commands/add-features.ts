import path from "node:path";

import { select, multiselect, confirm } from "@clack/prompts";
import { execa } from "execa";
import fsExtra from "fs-extra";
// eslint-disable-next-line import/no-named-as-default-member
const { ensureDir, readFile, writeFile } = fsExtra;

import { UI_LIBRARY_COMPATIBILITY, checkCompatibility } from "../utils/dependency-checker.js";
import { logger } from "../utils/logger.js";
import { detectPrecastProject, updatePrecastConfig } from "../utils/precast-config.js";

export interface AddFeaturesOptions {
  ui?: string;
  ai?: string[];
  addons?: string[];
  yes?: boolean;
}

/**
 * Add features to an existing Precast project
 * @param projectDir - Project directory path
 * @param options - Feature addition options
 */
export async function addFeaturesCommand(
  projectDir: string = process.cwd(),
  options: AddFeaturesOptions = {}
) {
  const projectConfig = await detectPrecastProject(projectDir);

  if (!projectConfig) {
    logger.error("No Precast project found in the current directory.");
    logger.info("Make sure you're in a project created with create-precast-app.");
    process.exit(1);
  }

  logger.info(`Found Precast project: ${projectConfig.name}`);

  const updates: any = {};

  if (!options.ui && !options.yes) {
    const currentUI = projectConfig.uiLibrary;

    if (currentUI) {
      const changeUI = await confirm({
        message: `Project already uses ${currentUI}. Do you want to change it?`,
        initialValue: false,
      });

      if (!changeUI) {
        options.ui = currentUI;
      }
    }

    if (!options.ui) {
      const compatibleLibraries = Object.entries(UI_LIBRARY_COMPATIBILITY)
        .filter(([lib]) => {
          const { compatible } = checkCompatibility(
            projectConfig.framework,
            lib,
            UI_LIBRARY_COMPATIBILITY
          );
          return compatible;
        })
        .map(([id, config]) => ({
          value: id,
          label: config.name || id,
        }));

      if (compatibleLibraries.length > 0) {
        const ui = await select({
          message: "Select a UI component library:",
          options: [{ value: "none", label: "None" }, ...compatibleLibraries],
        });

        if (ui !== "none") {
          options.ui = ui as string;
        }
      }
    }
  }

  if (options.ui && options.ui !== "none" && options.ui !== projectConfig.uiLibrary) {
    const { compatible, reason } = checkCompatibility(
      projectConfig.framework,
      options.ui,
      UI_LIBRARY_COMPATIBILITY
    );

    if (!compatible) {
      logger.error(`Cannot add ${options.ui}: ${reason}`);
      process.exit(1);
    }

    updates.uiLibrary = options.ui;
    logger.info(`Will add ${options.ui} UI library`);

    await installUILibrary(projectDir, options.ui, projectConfig);
  }

  if (!options.ai && !options.yes) {
    const currentAI = projectConfig.aiAssistant ? [projectConfig.aiAssistant] : [];

    const aiOptions = [
      { value: "claude", label: "Claude (.claude/)" },
      { value: "copilot", label: "GitHub Copilot (.github/copilot-instructions.md)" },
      { value: "cursor", label: "Cursor (.cursorrules)" },
      { value: "gemini", label: "Gemini (gemini.md)" },
    ].filter((opt) => !currentAI.includes(opt.value));

    if (aiOptions.length > 0) {
      const selectedAI = await multiselect({
        message: "Select AI assistance tools to add:",
        options: aiOptions,
        required: false,
      });

      if (selectedAI && typeof selectedAI !== "symbol" && selectedAI.length > 0) {
        options.ai = selectedAI as string[];
      }
    }
  }

  if (options.ai && options.ai.length > 0) {
    const currentAiArray = projectConfig.aiAssistant ? [projectConfig.aiAssistant] : [];
    const newAI = [...currentAiArray, ...options.ai];
    updates.aiAssistant = newAI.length > 0 ? newAI[newAI.length - 1] : undefined; // Use latest selection
    logger.info(`Will add AI context files for: ${options.ai.join(", ")}`);

    await generateAIContextFiles(projectDir, options.ai, projectConfig);
  }

  if (Object.keys(updates).length > 0) {
    await updatePrecastConfig(projectDir, updates);
    logger.success("Project configuration updated successfully!");
  } else {
    logger.info("No changes to make.");
  }
}

/**
 * Install UI library dependencies and run setup
 * @param projectDir - Project directory path
 * @param library - UI library name
 * @param config - Project configuration
 */
async function installUILibrary(projectDir: string, library: string, config: any) {
  const libConfig = UI_LIBRARY_COMPATIBILITY[library];

  if (!libConfig) {
    logger.error(`Unknown UI library: ${library}`);
    return;
  }

  logger.info(`Installing ${library} dependencies...`);

  if (libConfig.requiredDeps && libConfig.requiredDeps.length > 0) {
    const pm = config.packageManager || "npm";
    const installCmd = pm === "npm" ? "install" : "add";

    await execa(pm, [installCmd, ...libConfig.requiredDeps], {
      cwd: projectDir,
      stdio: "inherit",
    });
  }

  if (libConfig.setupCommand) {
    logger.info(`Running ${library} setup...`);
    const [cmd, ...args] = libConfig.setupCommand.split(" ");

    try {
      await execa(cmd, args, {
        cwd: projectDir,
        stdio: "inherit",
      });
    } catch {
      logger.warn(
        `Setup command failed. You may need to run it manually: ${libConfig.setupCommand}`
      );
    }
  }

  if (libConfig.postInstallSteps && libConfig.postInstallSteps.length > 0) {
    logger.info("\nPost-installation steps:");
    libConfig.postInstallSteps.forEach((step: string, index: number) => {
      logger.info(`${index + 1}. ${step}`);
    });
  }
}

/**
 * Generate AI context files for the specified tools
 * @param projectDir - Project directory path
 * @param aiTools - List of AI tools to generate context for
 * @param config - Project configuration
 */
async function generateAIContextFiles(projectDir: string, aiTools: string[], config: any) {
  for (const tool of aiTools) {
    logger.info(`Generating ${tool} context files...`);

    switch (tool) {
      case "claude": {
        const claudeDir = path.join(projectDir, ".claude");
        await ensureDir(claudeDir);

        const templatePath = path.join(
          import.meta.dirname,
          "../templates/ai-context/CLAUDE.md.hbs"
        );
        const template = await readFile(templatePath, "utf-8");
        const content = template
          .replace(/{{name}}/g, config.name)
          .replace(/{{framework}}/g, config.framework)
          .replace(/{{language}}/g, config.language)
          .replace(/{{uiLibrary}}/g, config.uiLibrary || "none")
          .replace(/{{packageManager}}/g, config.packageManager)
          .replace(/{{styling}}/g, config.styling || "css");

        await writeFile(path.join(claudeDir, "CLAUDE.md"), content);
        break;
      }

      case "copilot": {
        const githubDir = path.join(projectDir, ".github");
        await ensureDir(githubDir);

        const templatePath = path.join(
          import.meta.dirname,
          "../templates/ai-context/copilot-instructions.md.hbs"
        );
        const template = await readFile(templatePath, "utf-8");
        const content = template
          .replace(/{{name}}/g, config.name)
          .replace(/{{framework}}/g, config.framework)
          .replace(/{{language}}/g, config.language);

        await writeFile(path.join(githubDir, "copilot-instructions.md"), content);
        break;
      }

      case "cursor": {
        const templatePath = path.join(
          import.meta.dirname,
          "../templates/ai-context/.cursorrules.hbs"
        );
        const template = await readFile(templatePath, "utf-8");
        const content = template
          .replace(/{{name}}/g, config.name)
          .replace(/{{framework}}/g, config.framework)
          .replace(/{{language}}/g, config.language);

        await writeFile(path.join(projectDir, ".cursorrules"), content);
        break;
      }

      case "gemini": {
        const templatePath = path.join(
          import.meta.dirname,
          "../templates/ai-context/GEMINI.md.hbs"
        );
        const template = await readFile(templatePath, "utf-8");
        const content = template
          .replace(/{{name}}/g, config.name)
          .replace(/{{framework}}/g, config.framework)
          .replace(/{{language}}/g, config.language);

        await writeFile(path.join(projectDir, "GEMINI.md"), content);
        break;
      }
    }
  }
}

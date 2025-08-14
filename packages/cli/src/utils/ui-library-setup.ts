import path from "path";

import { consola } from "consola";
import { execa } from "execa";
import fs from "fs-extra";

import type { ProjectConfig } from "../../../shared/stack-config.js";

import { getAllRequiredDeps, UI_LIBRARY_COMPATIBILITY } from "./dependency-checker.js";
import { errorCollector } from "./error-collector.js";
import { installDependencies } from "./package-manager.js";

/**
 * Setup UI library for the project
 * @param config - Project configuration
 * @param projectPath - Path to the project directory
 */
export async function setupUILibrary(config: ProjectConfig, projectPath: string): Promise<void> {
  if (!config.uiLibrary || config.uiLibrary === "none") {
    return;
  }
  const uiIcons: Record<string, string> = {
    shadcn: "🎯",
    daisyui: "🌼",
    mui: "Ⓜ️",
    chakra: "⚡",
    antd: "🐜",
    mantine: "🎯",
  };
  const uiIcon = uiIcons[config.uiLibrary] || "🎨";

  consola.info(`${uiIcon} Setting up ${config.uiLibrary}...`);
  const rule = UI_LIBRARY_COMPATIBILITY[config.uiLibrary];
  if (!rule) {
    consola.warn(`Unknown UI library: ${config.uiLibrary}`);
    return;
  }
  try {
    const deps = getAllRequiredDeps([config.uiLibrary], UI_LIBRARY_COMPATIBILITY);
    if (deps.length > 0) {
      consola.info(`Installing ${config.uiLibrary} dependencies...`);
      try {
        await installDependencies(deps, {
          packageManager: config.packageManager,
          projectPath,
          dev: true,
          context: "ui_library",
        });
      } catch (error) {
        consola.error(`Failed to install ${config.uiLibrary} dependencies:`, error);
        errorCollector.addError(`${config.uiLibrary} dependency installation`, error);
      }
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
      consola.box({
        title: `${config.uiLibrary} Setup Complete`,
        message: `Next steps:\n${rule.postInstallSteps.map((step, i) => `${i + 1}. ${step}`).join("\n")}`,
      });
    }
  } catch (error) {
    consola.error(`Failed to setup ${config.uiLibrary}:`, error);
    throw error;
  }
}

/**
 * Setup shadcn/ui components and configuration
 * @param config - Project configuration
 * @param projectPath - Path to the project directory
 */
async function setupShadcn(config: ProjectConfig, projectPath: string): Promise<void> {
  consola.info("🎯 Initializing shadcn/ui...");

  try {
    const tailwindConfigPath = path.join(projectPath, "tailwind.config.js");
    if (!(await fs.pathExists(tailwindConfigPath))) {
      consola.error("tailwind.config.js not found!");
      throw new Error("Tailwind CSS must be configured before initializing shadcn/ui");
    }

    await execa("npx", ["shadcn@latest", "init", "-y"], {
      cwd: projectPath,
      stdio: "pipe",
      timeout: 30000, // 30 second timeout
    });

    const essentialComponents = ["button", "card", "input", "label"];
    consola.info("🧩 Adding essential components...");
    for (const component of essentialComponents) {
      try {
        await execa("npx", ["shadcn@latest", "add", component, "--yes"], {
          cwd: projectPath,
          stdio: "pipe",
          timeout: 30000,
        });
        consola.success(`✅ Added ${component} component`);
      } catch (error) {
        consola.warn(`Failed to add ${component} component:`, error);
        errorCollector.addWarning(`shadcn component ${component} installation`, error);
      }
    }
    consola.success("🎯 shadcn/ui setup completed");
  } catch (error) {
    consola.warn("Failed to initialize shadcn/ui:", error);
    errorCollector.addError("shadcn/ui initialization", error);
    consola.info("You can manually initialize it later with: npx shadcn@latest init");
  }
}

/**
 * Setup DaisyUI configuration
 * @param config - Project configuration
 * @param projectPath - Path to the project directory
 */
async function setupDaisyUI(config: ProjectConfig, projectPath: string): Promise<void> {
  consola.info("🌼 Configuring DaisyUI...");

  try {
    const tailwindConfigPath = path.join(projectPath, "tailwind.config.js");

    if (await fs.pathExists(tailwindConfigPath)) {
      let tailwindConfig = await fs.readFile(tailwindConfigPath, "utf-8");

      if (!tailwindConfig.includes("daisyui")) {
        if (tailwindConfig.includes("plugins: [")) {
          tailwindConfig = tailwindConfig.replace(
            "plugins: [",
            'plugins: [\n    require("daisyui"),'
          );
        } else if (tailwindConfig.includes("plugins:")) {
          tailwindConfig = tailwindConfig.replace(
            /plugins:\s*\[/,
            'plugins: [\n    require("daisyui"),'
          );
        } else {
          tailwindConfig = tailwindConfig.replace(
            "module.exports = {",
            'module.exports = {\n  plugins: [require("daisyui")],'
          );
        }

        if (!tailwindConfig.includes("daisyui:")) {
          const daisyUIConfig = `
  daisyui: {
    themes: ["light", "dark", "cupcake"],
    darkTheme: "dark",
    base: true,
    styled: true,
    utils: true,
    prefix: "",
    logs: true,
    themeRoot: ":root",
  },`;

          tailwindConfig = tailwindConfig.replace(/}\s*;?\s*$/, `${daisyUIConfig}\n};`);
        }

        await fs.writeFile(tailwindConfigPath, tailwindConfig);
        consola.success("✅ DaisyUI has been added to tailwind.config.js");
      } else {
        consola.info("DaisyUI is already configured in tailwind.config.js");
      }
    } else {
      consola.warn(
        "tailwind.config.js not found. Please add DaisyUI manually to your Tailwind configuration."
      );
    }

    consola.success(
      "🎨 DaisyUI setup completed! You can now use DaisyUI classes in your components."
    );
    consola.info("💡 Try using classes like: btn, btn-primary, card, modal, etc.");
  } catch (error) {
    consola.warn("Failed to automatically configure DaisyUI:", error);
    consola.info(
      "Please add 'require(\"daisyui\")' to your tailwind.config.js plugins array manually."
    );
  }
}

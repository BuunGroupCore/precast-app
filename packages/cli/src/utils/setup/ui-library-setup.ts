import path from "path";

import type { ProjectConfig } from "@shared/stack-config.js";
import { consola } from "consola";
import { execa } from "execa";
import fs from "fs-extra";

import { getAllRequiredDeps, UI_LIBRARY_COMPATIBILITY } from "@/utils/system/dependency-checker.js";
import { errorCollector } from "@/utils/system/error-collector.js";
import { installDependencies } from "@/utils/system/package-manager.js";

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
    brutalist: "⚡",
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
      case "brutalist":
        await setupBrutalistUI(config, projectPath);
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
    const tailwindConfigPath = path.join(
      projectPath,
      config.typescript ? "tailwind.config.ts" : "tailwind.config.js"
    );
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
    const tailwindConfigPath = path.join(
      projectPath,
      config.typescript ? "tailwind.config.ts" : "tailwind.config.js"
    );

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

/**
 * Setup Brutalist UI
 * @param config - Project configuration
 * @param projectPath - Path to the project directory
 */
async function setupBrutalistUI(config: ProjectConfig, projectPath: string): Promise<void> {
  consola.info("⚡ Setting up Brutalist UI...");

  try {
    // Create main entry file path based on framework
    let mainFilePath = path.join(projectPath, "src", "main.tsx");
    if (config.framework === "next") {
      mainFilePath = path.join(projectPath, "src", "app", "layout.tsx");
    } else if (config.framework === "vite") {
      mainFilePath = path.join(projectPath, "src", "main.tsx");
    }

    // Add import for Brutalist UI styles
    if (await fs.pathExists(mainFilePath)) {
      let mainContent = await fs.readFile(mainFilePath, "utf-8");

      // Add style import if not present
      if (!mainContent.includes("@buun_group/brutalist-ui/styles")) {
        const importStatement = "import '@buun_group/brutalist-ui/styles';\n";

        // Add after other imports
        const lastImportIndex = mainContent.lastIndexOf("import ");
        if (lastImportIndex !== -1) {
          const endOfLineIndex = mainContent.indexOf("\n", lastImportIndex);
          mainContent =
            mainContent.slice(0, endOfLineIndex + 1) +
            importStatement +
            mainContent.slice(endOfLineIndex + 1);
        } else {
          mainContent = importStatement + mainContent;
        }

        await fs.writeFile(mainFilePath, mainContent);
        consola.success("✅ Added Brutalist UI styles import");
      }
    }

    // Add MCP server configuration if claude is enabled
    if (config.aiAssistant === "claude" || config.mcpServers?.includes("brutalist-ui")) {
      const claudeSettingsPath = path.join(projectPath, ".claude", "settings.json");

      if (await fs.pathExists(claudeSettingsPath)) {
        const settings = await fs.readJSON(claudeSettingsPath);

        if (!settings.mcpServers) {
          settings.mcpServers = {};
        }

        if (!settings.mcpServers["brutalist-ui"]) {
          settings.mcpServers["brutalist-ui"] = {
            command: "npx",
            args: ["@buun_group/brutalist-ui-mcp-server"],
          };

          await fs.writeJSON(claudeSettingsPath, settings, { spaces: 2 });
          consola.success("✅ Added Brutalist UI MCP server to Claude settings");
        }
      }
    }

    consola.success("⚡ Brutalist UI setup completed!");
    consola.info(
      "You can now import components: import { Button, Card, Input } from '@buun_group/brutalist-ui'"
    );
  } catch (error) {
    consola.warn("Failed to setup Brutalist UI:", error);
    errorCollector.addError("Brutalist UI setup", error);
  }
}

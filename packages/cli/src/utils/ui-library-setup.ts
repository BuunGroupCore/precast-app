import path from "path";

import { consola } from "consola";
import { execa } from "execa";

import type { ProjectConfig } from "../../../shared/stack-config.js";

import { getAllRequiredDeps, UI_LIBRARY_COMPATIBILITY } from "./dependency-checker.js";
import { installDependencies } from "./package-manager.js";
export async function setupUILibrary(config: ProjectConfig, projectPath: string): Promise<void> {
  if (!config.uiLibrary || config.uiLibrary === "none") {
    return;
  }
  // Get UI library icon
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
      await installDependencies(deps, {
        packageManager: config.packageManager,
        projectPath,
        dev: true,
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
async function setupShadcn(config: ProjectConfig, projectPath: string): Promise<void> {
  consola.info("🎯 Initializing shadcn/ui...");

  try {
    // First, ensure Tailwind files are properly set up
    const fs = await import("fs-extra");

    // Check if tailwind.config.js exists
    const tailwindConfigPath = path.join(projectPath, "tailwind.config.js");
    if (!(await fs.pathExists(tailwindConfigPath))) {
      consola.error("tailwind.config.js not found!");
      throw new Error("Tailwind CSS must be configured before initializing shadcn/ui");
    }

    // Use npx for shadcn regardless of package manager
    // For now, use defaults which will use New York style
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
          stdio: "pipe", // Use pipe instead of inherit
          timeout: 30000, // 30 second timeout per component
        });
        consola.success(`✅ Added ${component} component`);
      } catch (error) {
        consola.warn(`Failed to add ${component} component:`, error);
      }
    }
    consola.success("🎯 shadcn/ui setup completed");
  } catch (error) {
    consola.warn("Failed to initialize shadcn/ui:", error);
    consola.info("You can manually initialize it later with: npx shadcn@latest init");
  }
}
async function setupDaisyUI(_config: ProjectConfig, _projectPath: string): Promise<void> {
  consola.info("🌼 Configuring DaisyUI...");
  consola.success(
    "🎨 DaisyUI has been installed. Make sure to add it to your tailwind.config.js plugins array."
  );
}

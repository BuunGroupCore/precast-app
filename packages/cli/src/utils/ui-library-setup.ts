import { consola } from "consola";
import { execa } from "execa";

import type { ProjectConfig } from "../../../shared/stack-config.js";

import { getAllRequiredDeps, UI_LIBRARY_COMPATIBILITY } from "./dependency-checker.js";
import { installDependencies, getPackageManagerConfig } from "./package-manager.js";
export async function setupUILibrary(config: ProjectConfig, projectPath: string): Promise<void> {
  if (!config.uiLibrary || config.uiLibrary === "none") {
    return;
  }
  consola.info(`Setting up ${config.uiLibrary}...`);
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
  consola.info("Initializing shadcn/ui...");
  const pmConfig = getPackageManagerConfig(config.packageManager);
  
  try {
    // Use npx for shadcn-ui regardless of package manager
    await execa("npx", ["shadcn-ui@latest", "init", "--defaults", "--yes"], {
      cwd: projectPath,
      stdio: "inherit",
    });
    const essentialComponents = ["button", "card", "input", "label"];
    consola.info("Adding essential components...");
    for (const component of essentialComponents) {
      try {
        await execa("npx", ["shadcn-ui@latest", "add", component, "--yes"], {
          cwd: projectPath,
          stdio: "inherit",
        });
      } catch (error) {
        consola.warn(`Failed to add ${component} component:`, error);
      }
    }
  } catch (error) {
    consola.warn("Failed to initialize shadcn/ui:", error);
    consola.info("You can manually initialize it later with: npx shadcn-ui@latest init");
  }
}
async function setupDaisyUI(_config: ProjectConfig, _projectPath: string): Promise<void> {
  consola.info("Configuring DaisyUI...");
  consola.success(
    "DaisyUI has been installed. Make sure to add it to your tailwind.config.js plugins array."
  );
}

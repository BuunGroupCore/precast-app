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
        // Check if the library specifies devDeps flag
        const isDevDeps = rule.devDeps !== false; // Default to true for backward compatibility
        await installDependencies(deps, {
          packageManager: config.packageManager,
          projectPath,
          dev: isDevDeps,
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
  consola.info("🎯 Initializing shadcn/ui with comprehensive component set...");

  try {
    // Determine the actual target path for shadcn initialization
    // In monorepos, we need to initialize in apps/web instead of root
    let targetPath = projectPath;
    const isMonorepo = config.backend && config.backend !== "none";

    if (isMonorepo) {
      targetPath = path.join(projectPath, "apps", "web");
      consola.info(`📦 Detected monorepo structure, initializing shadcn/ui in apps/web`);
    }

    // Check if tailwind config exists in the target path
    const tailwindConfigPath = path.join(
      targetPath,
      config.typescript ? "tailwind.config.ts" : "tailwind.config.js"
    );

    if (!(await fs.pathExists(tailwindConfigPath))) {
      consola.error(`Tailwind config not found at ${tailwindConfigPath}!`);
      throw new Error("Tailwind CSS must be configured before initializing shadcn/ui");
    }

    // Create components.json configuration for shadcn with enhanced theming
    const componentsJson = {
      $schema: "https://ui.shadcn.com/schema.json",
      style: "new-york", // Using new-york style for more modern look
      rsc: config.framework === "next",
      tsx: config.typescript !== false,
      tailwind: {
        config: config.typescript ? "tailwind.config.ts" : "tailwind.config.js",
        css: "src/styles/globals.css",
        baseColor: "zinc", // Using zinc for better contrast
        cssVariables: true, // Enable CSS variables for theming
        prefix: "",
      },
      aliases: {
        components: "@/components",
        utils: "@/lib/utils",
        lib: "@/lib",
        hooks: "@/hooks",
      },
    };

    // Write components.json to the correct location
    // For monorepos, it should be in apps/web, not root
    const componentsJsonPath = path.join(targetPath, "components.json");
    await fs.writeJSON(componentsJsonPath, componentsJson, { spaces: 2 });
    consola.success(
      `✅ Created components.json configuration in ${isMonorepo ? "apps/web" : "project root"}`
    );

    // Create lib/utils.ts with cn utility
    const libPath = path.join(targetPath, "src", "lib");
    await fs.ensureDir(libPath);

    const utilsContent = `import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
`;

    const utilsPath = path.join(libPath, config.typescript ? "utils.ts" : "utils.js");
    await fs.writeFile(utilsPath, utilsContent);
    consola.success("✅ Created lib/utils with cn() function");

    // Create hooks directory for custom hooks
    const hooksPath = path.join(targetPath, "src", "hooks");
    await fs.ensureDir(hooksPath);

    // Create a placeholder custom hook
    const useToastContent = config.typescript
      ? `import { toast } from "sonner"

export function useToast() {
  return {
    toast,
  }
}
`
      : `import { toast } from "sonner"

export function useToast() {
  return {
    toast,
  }
}
`;

    const toastHookPath = path.join(hooksPath, config.typescript ? "use-toast.ts" : "use-toast.js");
    await fs.writeFile(toastHookPath, useToastContent);

    // Initialize shadcn with the configuration
    try {
      await execa("npx", ["shadcn@latest", "init", "-y", "--defaults"], {
        cwd: targetPath,
        stdio: "pipe",
        timeout: 90000, // Increased timeout for comprehensive setup
      });
      consola.success("✅ Initialized shadcn/ui");
    } catch {
      consola.warn("Failed to run shadcn init, but configuration files were created");
    }

    // Core shadcn/ui components to install initially (reduced for speed)
    // Users can add more components later with: npx shadcn@latest add [component]
    const essentialComponents = [
      // Most commonly used components only
      "button",
      "card",
      "input",
      "label",
      "separator",
      "dialog",
      "dropdown-menu",
      "form",
    ];

    consola.info("🧩 Installing essential shadcn/ui components...");

    // Install components in batches to avoid overwhelming the system
    const batchSize = 3; // Smaller batches for better reliability
    const batches = [];
    for (let i = 0; i < essentialComponents.length; i += batchSize) {
      batches.push(essentialComponents.slice(i, i + batchSize));
    }

    let installedCount = 0;
    let failedComponents = [];

    // Set a maximum time limit for component installation
    const maxInstallTime = 20000; // 20 seconds total
    const startTime = Date.now();

    for (const batch of batches) {
      // Check if we've exceeded our time limit
      if (Date.now() - startTime > maxInstallTime) {
        consola.warn(
          "⏱️ Component installation time limit reached. Some components may not be installed."
        );
        consola.info(
          "💡 You can install additional components later with: npx shadcn@latest add [component]"
        );
        break;
      }

      consola.info(`📦 Installing batch: ${batch.join(", ")}`);

      for (const component of batch) {
        try {
          await execa("npx", ["shadcn@latest", "add", component, "--yes", "--overwrite"], {
            cwd: targetPath,
            stdio: "pipe",
            timeout: 15000, // Reduced timeout per component
          });
          installedCount++;
          consola.success(
            `✅ Added ${component} (${installedCount}/${essentialComponents.length})`
          );
        } catch (error: any) {
          if (error.stderr && error.stderr.includes("already exists")) {
            installedCount++;
            consola.info(`Component ${component} already exists`);
          } else if (
            error.message &&
            (error.message.includes("not found") || error.message.includes("timeout"))
          ) {
            // Skip components that timeout or don't exist
            consola.debug(`⏭️ Skipped ${component} (timeout or not found)`);
          } else {
            failedComponents.push(component);
            consola.debug(`⚠️ Could not add ${component}: ${error.message || "Unknown error"}`);
          }
        }
      }

      // Small delay between batches to avoid rate limiting
      if (batches.indexOf(batch) < batches.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
    }

    // Add theme configuration to globals.css if it doesn't exist
    const globalsCssPath = path.join(targetPath, "src", "styles", "globals.css");
    if (await fs.pathExists(globalsCssPath)) {
      let cssContent = await fs.readFile(globalsCssPath, "utf-8");

      // Check if theme variables are already present
      if (!cssContent.includes("--background:")) {
        const themeVariables = `
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 240 10% 3.9%;
    --card: 0 0% 100%;
    --card-foreground: 240 10% 3.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 240 10% 3.9%;
    --primary: 240 5.9% 10%;
    --primary-foreground: 0 0% 98%;
    --secondary: 240 4.8% 95.9%;
    --secondary-foreground: 240 5.9% 10%;
    --muted: 240 4.8% 95.9%;
    --muted-foreground: 240 3.8% 46.1%;
    --accent: 240 4.8% 95.9%;
    --accent-foreground: 240 5.9% 10%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 0 0% 98%;
    --border: 240 5.9% 90%;
    --input: 240 5.9% 90%;
    --ring: 240 5.9% 10%;
    --radius: 0.5rem;
    --chart-1: 12 76% 61%;
    --chart-2: 173 58% 39%;
    --chart-3: 197 37% 24%;
    --chart-4: 43 74% 66%;
    --chart-5: 27 87% 67%;
  }

  .dark {
    --background: 240 10% 3.9%;
    --foreground: 0 0% 98%;
    --card: 240 10% 3.9%;
    --card-foreground: 0 0% 98%;
    --popover: 240 10% 3.9%;
    --popover-foreground: 0 0% 98%;
    --primary: 0 0% 98%;
    --primary-foreground: 240 5.9% 10%;
    --secondary: 240 3.7% 15.9%;
    --secondary-foreground: 0 0% 98%;
    --muted: 240 3.7% 15.9%;
    --muted-foreground: 240 5% 64.9%;
    --accent: 240 3.7% 15.9%;
    --accent-foreground: 0 0% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 0 0% 98%;
    --border: 240 3.7% 15.9%;
    --input: 240 3.7% 15.9%;
    --ring: 240 4.9% 83.9%;
    --chart-1: 220 70% 50%;
    --chart-2: 160 60% 45%;
    --chart-3: 30 80% 55%;
    --chart-4: 280 65% 60%;
    --chart-5: 340 75% 55%;
  }
}
`;

        // Add theme variables at the beginning of the file, after the tailwind directives
        const tailwindDirectives = [
          "@tailwind base",
          "@tailwind components",
          "@tailwind utilities",
        ];
        let insertIndex = 0;

        for (const directive of tailwindDirectives) {
          const directiveIndex = cssContent.lastIndexOf(directive);
          if (directiveIndex !== -1) {
            insertIndex = Math.max(insertIndex, directiveIndex + directive.length);
          }
        }

        if (insertIndex > 0) {
          cssContent =
            cssContent.slice(0, insertIndex) +
            "\n" +
            themeVariables +
            cssContent.slice(insertIndex);
        } else {
          cssContent = cssContent + "\n" + themeVariables;
        }

        await fs.writeFile(globalsCssPath, cssContent);
        consola.success("✅ Added theme variables to globals.css");
      }
    }

    // Summary
    consola.box({
      title: "🎨 shadcn/ui Setup Complete",
      message: `
✅ Installed ${installedCount} out of ${essentialComponents.length} components
${failedComponents.length > 0 ? `⚠️ Some components could not be installed: ${failedComponents.join(", ")}` : ""}

📁 Components location: ${isMonorepo ? "apps/web/src/components/ui" : "src/components/ui"}
🎨 Style: New York (modern design)
🌈 Base color: Zinc (better contrast)
🌙 Dark mode: Configured with CSS variables
      
💡 You can add more components anytime with:
   npx shadcn@latest add [component-name]
      
📚 Documentation: https://ui.shadcn.com/docs/components`,
    });
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

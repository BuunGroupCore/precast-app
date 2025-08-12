import { text, select, confirm, multiselect } from "@clack/prompts";
import { consola } from "consola";

import { type ProjectConfig } from "../../../shared/stack-config.js";
import {
  frameworkDefs,
  backendDefs,
  databaseDefs,
  ormDefs,
  stylingDefs,
  runtimeDefs,
  uiFrameworkDefs,
} from "../../../shared/stack-config.js";
import { colorPalettes, defaultColorPalette } from "../../../shared/src/color-palettes.js";
import type { InitOptions } from "../commands/init.js";
import { getFilteredAuthOptions, isAuthProviderCompatibleWithStack } from "../utils/auth-setup.js";
import { checkCompatibility, UI_LIBRARY_COMPATIBILITY } from "../utils/dependency-checker.js";
import { DEPLOYMENT_CONFIGS } from "../utils/deployment-setup.js";
import { detectAvailablePackageManager } from "../utils/package-manager.js";

import { promptAIAssistant, isValidAIAssistant } from "./ai-assistant.js";
import { promptApiClient } from "./api-client.js";

/**
 * Gather project configuration through interactive prompts
 * @param projectName - Optional project name
 * @param options - Initial configuration options
 * @returns Complete project configuration
 */
export async function gatherProjectConfig(
  projectName: string | undefined,
  options: InitOptions
): Promise<ProjectConfig> {
  const name =
    projectName ||
    ((await text({
      message: "What is your project name?",
      placeholder: "my-awesome-project",
      defaultValue: "my-awesome-project",
      validate: (value) => {
        if (!value) return "Project name is required";
        if (!/^[a-z0-9-]+$/.test(value)) {
          return "Project name must be lowercase and contain only letters, numbers, and hyphens";
        }
      },
    })) as string);
  const framework =
    options.framework ||
    (options.yes
      ? "react"
      : ((await select({
          message: "Choose your frontend framework:",
          options: frameworkDefs
            .filter((f) => !f.disabled)
            .map((f) => ({
              value: f.id,
              label: f.name,
              hint: f.description,
            })),
        })) as string));

  // If Vite is selected, prompt for UI framework
  let uiFramework: string | undefined = options.uiFramework;
  if (framework === "vite" && !options.uiFramework && !options.yes) {
    uiFramework = (await select({
      message: "Choose your UI framework for Vite:",
      options: uiFrameworkDefs
        .filter((f) => !f.disabled)
        .map((f) => ({
          value: f.id,
          label: f.name,
          hint: f.description,
        })),
    })) as string;
  }

  const backend =
    options.backend ||
    (options.yes
      ? "none"
      : ((await select({
          message: "Choose your backend:",
          options: backendDefs
            .filter((b) => !b.disabled)
            .map((b) => ({
              value: b.id,
              label: b.name,
              hint: b.description,
            })),
        })) as string));
  const database =
    backend === "none"
      ? "none"
      : options.database ||
        (options.yes
          ? "none"
          : ((await select({
              message: "Choose your database:",
              options: databaseDefs
                .filter((d) => !d.disabled)
                .map((d) => ({
                  value: d.id,
                  label: d.name,
                  hint: d.description,
                })),
            })) as string));
  const orm =
    database === "none"
      ? "none"
      : options.orm ||
        (options.yes
          ? "none"
          : ((await select({
              message: "Choose your ORM:",
              options: ormDefs
                .filter((o) => !o.disabled && !o.incompatible?.includes(database))
                .map((o) => ({
                  value: o.id,
                  label: o.name,
                  hint: o.description,
                })),
            })) as string));
  const styling =
    options.styling ||
    (options.yes
      ? "css"
      : ((await select({
          message: "Choose your styling solution:",
          options: stylingDefs.map((s) => ({
            value: s.id,
            label: s.name,
            hint: s.description,
          })),
        })) as string));

  // Color palette selection (only if using CSS or Tailwind)
  let colorPalette: string | undefined = options.colorPalette;
  if (!options.yes && !options.colorPalette && (styling === "css" || styling === "tailwind")) {
    const selectedPalette = (await select({
      message: "Choose a color palette:",
      options: [
        {
          value: "none",
          label: "None",
          hint: "Use default colors",
        },
        ...colorPalettes.map((p) => ({
          value: p.id,
          label: p.name,
          hint: p.description,
        })),
      ],
      initialValue: defaultColorPalette,
    })) as string;

    if (selectedPalette !== "none") {
      colorPalette = selectedPalette;
    }
  } else if (!colorPalette && (styling === "css" || styling === "tailwind")) {
    // Use default color palette if not specified and in --yes mode
    colorPalette = defaultColorPalette;
  }

  const runtime =
    options.runtime ||
    (options.yes
      ? "node"
      : ((await select({
          message: "Choose your runtime environment:",
          options: runtimeDefs.map((r) => ({
            value: r.id,
            label: r.name,
            hint: r.description,
          })),
        })) as string));
  const typescript =
    options.typescript !== undefined
      ? options.typescript
      : options.yes
        ? true
        : ((await confirm({
            message: "Use TypeScript?",
            initialValue: true,
          })) as boolean);
  let git = true; // Default to true
  if (options.git === false) {
    git = false;
  } else if (!options.yes) {
    try {
      git = (await confirm({
        message: "Initialize git repository?",
        initialValue: true,
      })) as boolean;
    } catch (error: any) {
      if (error.code === "EPERM" || error.errno === -1) {
        consola.warn("Unable to read input. Using default value (git: true)");
        consola.info("You can disable git with --no-git flag");
        git = true;
      } else {
        throw error;
      }
    }
  }
  const docker =
    options.docker !== undefined
      ? options.docker
      : options.yes
        ? false
        : ((await confirm({
            message: "Include Docker configuration?",
            initialValue: false,
          })) as boolean);

  // Only prompt for secure passwords if Docker is enabled
  let securePasswords = true; // Default to secure
  if (docker) {
    if (options.securePasswords !== undefined) {
      securePasswords = options.securePasswords;
    } else if (!options.yes) {
      securePasswords = (await confirm({
        message: "Use secure random passwords for Docker databases?",
        initialValue: true,
      })) as boolean;
    }
  }

  let uiLibrary: string | undefined = options.uiLibrary;

  if (styling === "tailwind" && !options.yes && !options.uiLibrary) {
    const compatibleLibraries = Object.entries(UI_LIBRARY_COMPATIBILITY)
      .filter(([lib, rule]) => {
        if (rule.disabled) return false;
        const { compatible } = checkCompatibility(framework, lib, UI_LIBRARY_COMPATIBILITY);
        return compatible;
      })
      .map(([lib]) => ({
        value: lib,
        label: lib === "shadcn" ? "shadcn/ui" : lib === "daisyui" ? "DaisyUI" : lib,
        hint:
          lib === "shadcn"
            ? "Copy-paste components with full control"
            : lib === "daisyui"
              ? "Semantic component classes"
              : undefined,
      }));
    if (compatibleLibraries.length > 0) {
      const selected = (await select({
        message: "Choose a UI component library (optional):",
        options: [
          { value: "none", label: "None", hint: "Just use Tailwind CSS" },
          ...compatibleLibraries,
        ],
      })) as string;
      uiLibrary = selected === "none" ? undefined : selected;
    }
  }
  let aiContext: string[] = [];
  if (!options.yes) {
    const selectedContext = (await multiselect({
      message: "Include AI assistant context files?",
      options: [
        { value: "claude", label: "CLAUDE.md", hint: "Context for Claude AI" },
        {
          value: "copilot",
          label: "GitHub Copilot instructions",
          hint: "Context for GitHub Copilot",
        },
        { value: "gemini", label: "GEMINI.md", hint: "Context for Google Gemini" },
      ],
      initialValues: ["claude"],
      required: false,
    })) as string[];
    aiContext = selectedContext || [];
  }

  if (!options.yes && !aiContext.includes("cursor")) {
    const addCursor = (await confirm({
      message: "Include Cursor AI rules (.cursorrules)?",
      initialValue: false,
    })) as boolean;
    if (addCursor) {
      aiContext.push("cursor");
    }
  }

  let deploymentMethod: string | undefined;
  if (!options.yes) {
    const deploymentOptions = Object.values(DEPLOYMENT_CONFIGS)
      .filter((config) => !config.disabled)
      .map((config) => ({
        value: config.id,
        label: config.name,
        hint: config.description,
      }));

    deploymentMethod = (await select({
      message: "Choose deployment method (optional):",
      options: [
        { value: "none", label: "None", hint: "Set up deployment later" },
        ...deploymentOptions,
      ],
    })) as string;

    if (deploymentMethod === "none") {
      deploymentMethod = undefined;
    }
  }

  let authProvider: string | undefined;

  // Check if auth is even possible with the selected stack
  if (backend === "none" || database === "none") {
    if (options.auth && options.auth !== "none") {
      consola.warn(`⚠️  Authentication requires both a backend server and database for security.`);
      consola.warn(`   Selected backend: ${backend}, database: ${database}`);
      consola.warn(`   Please select a backend framework and database to enable authentication.`);
    }
    authProvider = undefined;
  } else if (options.auth && options.auth !== "none") {
    // User specified auth via CLI flag
    const stackConfig = { framework, backend, database };
    if (isAuthProviderCompatibleWithStack(options.auth, stackConfig)) {
      authProvider = options.auth;
    } else {
      consola.warn(`⚠️  ${options.auth} is not compatible with your selected stack:`);
      consola.warn(`   Framework: ${framework}, Backend: ${backend}, Database: ${database}`);

      // Suggest compatible auth providers
      const compatibleOptions = getFilteredAuthOptions(stackConfig);
      if (compatibleOptions.length > 0) {
        consola.info(`   Compatible auth providers for your stack:`);
        compatibleOptions.forEach((opt) => {
          consola.info(`   - ${opt.label}`);
        });
      }
    }
  } else if (!options.yes && backend !== "none" && database !== "none" && !options.auth) {
    // Interactive mode - show filtered auth options based on stack
    const stackConfig = { framework, backend, database, orm };
    const authOptions = getFilteredAuthOptions(stackConfig);

    if (authOptions.length > 0) {
      authProvider = (await select({
        message: "Choose authentication provider (optional):",
        options: [
          { value: "none", label: "None", hint: "Set up authentication later" },
          ...authOptions,
        ],
      })) as string;

      if (authProvider === "none") {
        authProvider = undefined;
      }
    } else {
      consola.info("ℹ️  No compatible authentication providers for your selected stack.");
    }
  }

  // API Client selection
  let apiClient: string | undefined;
  if (options.apiClient) {
    apiClient = options.apiClient;
  } else if (!options.yes && backend !== "none") {
    apiClient = await promptApiClient({ framework, backend });
  }

  // AI Assistant selection
  let aiAssistant: string | undefined;
  if (options.ai) {
    if (isValidAIAssistant(options.ai)) {
      aiAssistant = options.ai;
    } else {
      consola.warn(`Invalid AI assistant: ${options.ai}. Using 'none' instead.`);
      aiAssistant = "none";
    }
  } else if (!options.yes) {
    aiAssistant = await promptAIAssistant({ framework });
  } else {
    aiAssistant = "none";
  }

  const packageManager = options.packageManager || (await detectAvailablePackageManager());

  let autoInstall = false;
  if (!options.yes) {
    autoInstall = (await confirm({
      message: "Install dependencies automatically?",
      initialValue: true,
    })) as boolean;
  }

  return {
    name,
    framework,
    backend,
    database,
    orm,
    styling,
    runtime,
    typescript,
    git,
    gitignore: options.gitignore !== undefined ? options.gitignore : true,
    eslint: options.eslint !== undefined ? options.eslint : true,
    prettier: options.prettier !== undefined ? options.prettier : true,
    docker,
    securePasswords,
    uiLibrary,
    aiContext,
    aiAssistant,
    packageManager,
    deploymentMethod,
    authProvider,
    apiClient,
    autoInstall,
    projectPath: "",
    language: typescript ? "typescript" : "javascript",
    mcpServers: options.mcpServers,
    powerups: options.powerups,
    plugins: options.plugins,
    uiFramework,
    colorPalette,
  };
}

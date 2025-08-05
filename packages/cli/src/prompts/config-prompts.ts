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
} from "../../../shared/stack-config.js";
import type { InitOptions } from "../commands/init.js";
import { getAuthPromptOptions, isAuthProviderCompatible } from "../utils/auth-setup.js";
import { checkCompatibility, UI_LIBRARY_COMPATIBILITY } from "../utils/dependency-checker.js";
import { DEPLOYMENT_CONFIGS } from "../utils/deployment-setup.js";
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
    ((await select({
      message: "Choose your frontend framework:",
      options: frameworkDefs.map((f) => ({
        value: f.id,
        label: f.name,
        hint: f.description,
      })),
    })) as string);
  const backend =
    options.backend ||
    ((await select({
      message: "Choose your backend:",
      options: backendDefs.map((b) => ({
        value: b.id,
        label: b.name,
        hint: b.description,
      })),
    })) as string);
  const database =
    backend === "none"
      ? "none"
      : options.database ||
        ((await select({
          message: "Choose your database:",
          options: databaseDefs.map((d) => ({
            value: d.id,
            label: d.name,
            hint: d.description,
          })),
        })) as string);
  const orm =
    database === "none"
      ? "none"
      : options.orm ||
        ((await select({
          message: "Choose your ORM:",
          options: ormDefs
            .filter((o) => !o.incompatible?.includes(database))
            .map((o) => ({
              value: o.id,
              label: o.name,
              hint: o.description,
            })),
        })) as string);
  const styling =
    options.styling ||
    ((await select({
      message: "Choose your styling solution:",
      options: stylingDefs.map((s) => ({
        value: s.id,
        label: s.name,
        hint: s.description,
      })),
    })) as string);
  const runtime =
    options.runtime ||
    ((await select({
      message: "Choose your runtime environment:",
      options: runtimeDefs.map((r) => ({
        value: r.id,
        label: r.name,
        hint: r.description,
      })),
    })) as string);
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
      // Handle EPERM or other stdin errors (common with bun create)
      if (error.code === "EPERM" || error.errno === -1) {
        log.warn("Unable to read input. Using default value (git: true)");
        log.info("You can disable git with --no-git flag");
        git = true;
      } else {
        throw error;
      }
    }
  }
  const docker = options.yes
    ? false
    : (options.docker ??
      ((await confirm({
        message: "Include Docker configuration?",
        initialValue: false,
      })) as boolean));
  let uiLibrary: string | undefined = options.uiLibrary;

  if (styling === "tailwind" && !options.yes && !options.uiLibrary) {
    const compatibleLibraries = Object.entries(UI_LIBRARY_COMPATIBILITY)
      .filter(([lib]) => {
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

  // Add Cursor to AI context options if not in --yes mode
  if (!options.yes && !aiContext.includes("cursor")) {
    const addCursor = (await confirm({
      message: "Include Cursor AI rules (.cursorrules)?",
      initialValue: false,
    })) as boolean;
    if (addCursor) {
      aiContext.push("cursor");
    }
  }

  // Deployment method selection
  let deploymentMethod: string | undefined;
  if (!options.yes) {
    const deploymentOptions = Object.values(DEPLOYMENT_CONFIGS).map((config) => ({
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

  // Authentication provider selection
  let authProvider: string | undefined;

  // Use provided auth option if available
  if (options.auth && options.auth !== "none") {
    // Validate the auth provider
    const authOptions = getAuthPromptOptions();
    const validAuth = authOptions.find((opt) => opt.value === options.auth);
    if (validAuth && isAuthProviderCompatible(options.auth, framework)) {
      authProvider = options.auth;
    } else if (validAuth) {
      consola.warn(`⚠️  ${options.auth} is not compatible with ${framework} framework`);
    } else {
      consola.warn(`⚠️  Unknown authentication provider: ${options.auth}`);
    }
  } else if (!options.yes && database !== "none" && !options.auth) {
    const authOptions = getAuthPromptOptions()
      .filter((option) => isAuthProviderCompatible(option.value, framework))
      .map((option) => ({
        value: option.value,
        label: option.label,
        hint: option.hint,
      }));

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
    }
  }

  const packageManager = options.packageManager || "npm";

  // Auto-install dependencies option
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
    docker,
    uiLibrary,
    aiContext,
    packageManager,
    deploymentMethod,
    authProvider,
    autoInstall,
    projectPath: "", // Will be set later
    language: typescript ? "typescript" : "javascript",
  };
}

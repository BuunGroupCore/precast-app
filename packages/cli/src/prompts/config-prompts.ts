import { text, select, confirm, multiselect } from "@clack/prompts";

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
  const git =
    options.git === false
      ? false
      : options.yes
        ? true
        : ((await confirm({
            message: "Initialize git repository?",
            initialValue: true,
          })) as boolean);
  const docker = options.yes
    ? false
    : (options.docker ??
      ((await confirm({
        message: "Include Docker configuration?",
        initialValue: false,
      })) as boolean));
  let uiLibrary: string | undefined;
  if (styling === "tailwind" && !options.yes) {
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
    autoInstall,
    projectPath: "", // Will be set later
    language: typescript ? "typescript" : "javascript",
  };
}

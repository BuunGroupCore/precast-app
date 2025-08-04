import { text, select, confirm } from "@clack/prompts";

import { type ProjectConfig } from "../../../shared/stack-config.js";
import {
  frameworkDefs,
  backendDefs,
  databaseDefs,
  ormDefs,
  stylingDefs,
} from "../../../shared/stack-config.js";
import type { InitOptions } from "../commands/init.js";

export async function gatherProjectConfig(
  projectName: string | undefined,
  options: InitOptions
): Promise<ProjectConfig> {
  // Get project name
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

  // Get framework
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

  // Get backend
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

  // Get database (skip if no backend)
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

  // Get ORM (skip if no database)
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

  // Get styling
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

  // Get TypeScript preference
  const typescript =
    options.typescript !== undefined
      ? options.typescript
      : options.yes
        ? true
        : ((await confirm({
            message: "Use TypeScript?",
            initialValue: true,
          })) as boolean);

  // Get git preference
  const git =
    options.git !== undefined
      ? options.git
      : options.yes
        ? true
        : ((await confirm({
            message: "Initialize git repository?",
            initialValue: true,
          })) as boolean);

  // Get Docker preference
  const docker = options.yes
    ? false
    : (options.docker ??
      ((await confirm({
        message: "Include Docker configuration?",
        initialValue: false,
      })) as boolean));

  return {
    name,
    framework,
    backend,
    database,
    orm,
    styling,
    typescript,
    git,
    docker,
  };
}

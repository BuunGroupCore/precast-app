import path from "node:path";

import fsExtra from "fs-extra";
import * as JSONC from "jsonc-parser";

import type { ProjectConfig } from "../types";

import { getPackageVersion } from "./package-utils";

const PRECAST_CONFIG_FILE = "precast.jsonc";

export interface PrecastConfig {
  $schema?: string;
  version: string;
  createdAt: string;
  framework: string;
  language: string;
  backend?: string;
  database?: string;
  orm?: string;
  styling?: string;
  uiLibrary?: string;
  typescript: boolean;
  git: boolean;
  docker?: boolean;
  packageManager: string;
  aiAssistance?: string[];
  addons?: string[];
}

export async function writePrecastConfig(projectConfig: ProjectConfig) {
  const precastConfig: PrecastConfig = {
    version: await getPackageVersion(),
    createdAt: new Date().toISOString(),
    framework: projectConfig.framework,
    language: projectConfig.language,
    backend: projectConfig.backend,
    database: projectConfig.database,
    orm: projectConfig.orm,
    styling: projectConfig.styling,
    uiLibrary: projectConfig.uiLibrary,
    typescript: projectConfig.typescript,
    git: projectConfig.git,
    docker: projectConfig.docker,
    packageManager: projectConfig.packageManager,
    aiAssistance: projectConfig.aiAssistance,
    addons: projectConfig.addons,
  };

  const baseContent = {
    $schema: "https://precast.dev/schema.json",
    ...precastConfig,
  };

  let configContent = JSON.stringify(baseContent);

  const formatResult = JSONC.format(configContent, undefined, {
    tabSize: 2,
    insertSpaces: true,
    eol: "\n",
  });

  configContent = JSONC.applyEdits(configContent, formatResult);

  const finalContent = `// Precast configuration file
// This file tracks your project configuration
// Safe to modify or delete

${configContent}`;

  const configPath = path.join(projectConfig.projectPath, PRECAST_CONFIG_FILE);
  await fsExtra.writeFile(configPath, finalContent, "utf-8");
}

export async function readPrecastConfig(projectDir: string): Promise<PrecastConfig | null> {
  try {
    const configPath = path.join(projectDir, PRECAST_CONFIG_FILE);

    if (!(await fsExtra.pathExists(configPath))) {
      return null;
    }

    const configContent = await fsExtra.readFile(configPath, "utf-8");

    const errors: JSONC.ParseError[] = [];
    const config = JSONC.parse(configContent, errors, {
      allowTrailingComma: true,
      disallowComments: false,
    }) as PrecastConfig;

    if (errors.length > 0) {
      console.warn("Warning: Found errors parsing precast.jsonc:", errors);
      return null;
    }

    return config;
  } catch {
    return null;
  }
}

export async function updatePrecastConfig(
  projectDir: string,
  updates: Partial<Pick<PrecastConfig, "uiLibrary" | "aiAssistance" | "addons">>
) {
  try {
    const configPath = path.join(projectDir, PRECAST_CONFIG_FILE);

    if (!(await fsExtra.pathExists(configPath))) {
      return;
    }

    const configContent = await fsExtra.readFile(configPath, "utf-8");

    let modifiedContent = configContent;

    for (const [key, value] of Object.entries(updates)) {
      const editResult = JSONC.modify(modifiedContent, [key], value, {
        formattingOptions: {
          tabSize: 2,
          insertSpaces: true,
          eol: "\n",
        },
      });
      modifiedContent = JSONC.applyEdits(modifiedContent, editResult);
    }

    await fsExtra.writeFile(configPath, modifiedContent, "utf-8");
  } catch {
    // Silently fail if config update fails
  }
}

export async function detectPrecastProject(projectDir: string): Promise<ProjectConfig | null> {
  const config = await readPrecastConfig(projectDir);

  if (!config) {
    return null;
  }

  // Convert PrecastConfig to ProjectConfig format
  return {
    name: path.basename(projectDir),
    framework: config.framework,
    language: config.language,
    backend: config.backend,
    database: config.database,
    orm: config.orm,
    styling: config.styling,
    uiLibrary: config.uiLibrary,
    typescript: config.typescript,
    git: config.git,
    docker: config.docker,
    packageManager: config.packageManager,
    projectPath: projectDir,
    aiAssistance: config.aiAssistance,
    addons: config.addons,
  };
}

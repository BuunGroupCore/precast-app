import path from "node:path";

import fsExtra from "fs-extra";
import * as JSONC from "jsonc-parser";

import type { ProjectConfig } from "../../../shared/stack-config.js";

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

/**
 * Write the precast configuration file to the project directory
 * @param projectConfig - The project configuration to write
 */
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
    $schema: "https://precast.dev/precast.schema.json",
    ...precastConfig,
  };

  let configContent = JSON.stringify(baseContent);

  const formatResult = JSONC.format(configContent, undefined, {
    tabSize: 2,
    insertSpaces: true,
    eol: "\n",
  });

  configContent = JSONC.applyEdits(configContent, formatResult);

  const finalContent = `${configContent}`;

  const configPath = path.join(projectConfig.projectPath, PRECAST_CONFIG_FILE);
  await fsExtra.writeFile(configPath, finalContent, "utf-8");
}

/**
 * Read the precast configuration file from a project directory
 * @param projectDir - The directory to read the configuration from
 * @returns The precast configuration or null if not found
 */
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

/**
 * Update the precast configuration file with partial updates
 * @param projectDir - The directory containing the configuration file
 * @param updates - Partial configuration updates to apply
 */
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

/**
 * Detect if a directory is a precast project and return its configuration
 * @param projectDir - The directory to check
 * @returns The project configuration or null if not a precast project
 */
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
    backend: config.backend || "none",
    database: config.database || "none",
    orm: config.orm || "none",
    styling: config.styling || "css",
    uiLibrary: config.uiLibrary,
    typescript: config.typescript,
    git: config.git,
    docker: config.docker ?? false,
    packageManager: config.packageManager,
    projectPath: projectDir,
    aiAssistance: config.aiAssistance,
    addons: config.addons,
  };
}

import path from "node:path";

import fsExtra from "fs-extra";
import * as JSONC from "jsonc-parser";

const { writeFile, pathExists, readFile } = fsExtra;

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
  uiFramework?: string; // For Vite projects
  apiClient?: string;
  aiAssistant?: string;
  authProvider?: string;
  typescript: boolean;
  git: boolean;
  gitignore?: boolean;
  eslint?: boolean;
  prettier?: boolean;
  docker?: boolean;
  securePasswords?: boolean;
  packageManager: string;
  packageManagerVersion?: string;
  runtime?: string;
  deploymentMethod?: string;
  deploymentType?: "static" | "fullstack" | "api" | "hybrid";
  colorPalette?: string;
  aiContext?: string[];
  mcpServers?: string[];
  powerups?: string[];
  plugins?: string[];
  addons?: string[];
  autoInstall?: boolean;
  includeAdminTools?: boolean;
  includeRedis?: boolean;
  dbUser?: string;
}

/**
 * Writes the Precast configuration file (precast.jsonc) to the project directory.
 *
 * This function creates a comprehensive configuration file that records:
 * - Project metadata (version, creation date, framework, language)
 * - Technology stack choices (backend, database, ORM, styling, etc.)
 * - Development tools (ESLint, Prettier, Docker, etc.)
 * - Deployment configuration and type classification
 * - Package manager and version information
 * - Optional features like AI assistance, powerups, and plugins
 *
 * The configuration file serves multiple purposes:
 * - Enables the CLI to understand existing project structure
 * - Supports incremental feature additions via `precast add`
 * - Provides context for AI assistants and development tools
 * - Documents the project setup for team collaboration
 *
 * @param {ProjectConfig} projectConfig The complete project configuration to persist
 * @param {string} projectConfig.projectPath - Directory where the config file will be written
 * @param {string} projectConfig.framework - Frontend framework used
 * @param {string} projectConfig.language - Programming language (TypeScript/JavaScript)
 * @param {boolean} projectConfig.typescript - Whether TypeScript is enabled
 * @param {string} projectConfig.packageManager - Package manager being used
 * @returns {Promise<void>} Resolves when the configuration file has been written
 * @throws {Error} If the file cannot be written to the specified directory
 */
export async function writePrecastConfig(projectConfig: ProjectConfig) {
  // Determine deployment type based on the stack
  let deploymentType: PrecastConfig["deploymentType"] = "fullstack";
  if (projectConfig.backend === "none" && projectConfig.database === "none") {
    deploymentType = "static";
  } else if (projectConfig.backend !== "none" && projectConfig.database === "none") {
    deploymentType = "api";
  } else if (
    projectConfig.framework === "next" ||
    projectConfig.framework === "nuxt" ||
    projectConfig.framework === "react-router"
  ) {
    deploymentType = "hybrid";
  }

  // Build config object, only including defined values
  const precastConfig: any = {
    version: await getPackageVersion(),
    createdAt: new Date().toISOString(),
    framework: projectConfig.framework,
    language: projectConfig.language,
    typescript: projectConfig.typescript,
    git: projectConfig.git,
    packageManager: projectConfig.packageManager,
  };

  // Add optional fields only if they're defined
  if (projectConfig.backend) precastConfig.backend = projectConfig.backend;
  if (projectConfig.database) precastConfig.database = projectConfig.database;
  if (projectConfig.orm) precastConfig.orm = projectConfig.orm;
  if (projectConfig.styling) precastConfig.styling = projectConfig.styling;
  if (projectConfig.uiLibrary) precastConfig.uiLibrary = projectConfig.uiLibrary;
  if (projectConfig.uiFramework) precastConfig.uiFramework = projectConfig.uiFramework;
  if (projectConfig.apiClient) precastConfig.apiClient = projectConfig.apiClient;
  if (projectConfig.aiAssistant) precastConfig.aiAssistant = projectConfig.aiAssistant;
  if (projectConfig.authProvider) precastConfig.authProvider = projectConfig.authProvider;
  if (projectConfig.gitignore !== undefined) precastConfig.gitignore = projectConfig.gitignore;
  if (projectConfig.eslint !== undefined) precastConfig.eslint = projectConfig.eslint;
  if (projectConfig.prettier !== undefined) precastConfig.prettier = projectConfig.prettier;
  if (projectConfig.docker !== undefined) precastConfig.docker = projectConfig.docker;
  if (projectConfig.securePasswords !== undefined)
    precastConfig.securePasswords = projectConfig.securePasswords;
  if (projectConfig.packageManagerVersion)
    precastConfig.packageManagerVersion = projectConfig.packageManagerVersion;
  if (projectConfig.runtime) precastConfig.runtime = projectConfig.runtime;
  if (projectConfig.deploymentMethod)
    precastConfig.deploymentMethod = projectConfig.deploymentMethod;
  if (deploymentType) precastConfig.deploymentType = deploymentType;
  if (projectConfig.colorPalette) precastConfig.colorPalette = projectConfig.colorPalette;
  if (projectConfig.aiContext && projectConfig.aiContext.length > 0)
    precastConfig.aiContext = projectConfig.aiContext;
  if (projectConfig.mcpServers && projectConfig.mcpServers.length > 0)
    precastConfig.mcpServers = projectConfig.mcpServers;
  if (projectConfig.powerups && projectConfig.powerups.length > 0)
    precastConfig.powerups = projectConfig.powerups;
  if (projectConfig.plugins && projectConfig.plugins.length > 0)
    precastConfig.plugins = projectConfig.plugins;
  if (projectConfig.addons && projectConfig.addons.length > 0)
    precastConfig.addons = projectConfig.addons;
  if (projectConfig.autoInstall !== undefined)
    precastConfig.autoInstall = projectConfig.autoInstall;
  if (projectConfig.includeAdminTools !== undefined)
    precastConfig.includeAdminTools = projectConfig.includeAdminTools;
  if (projectConfig.includeRedis !== undefined)
    precastConfig.includeRedis = projectConfig.includeRedis;
  if (projectConfig.dbUser) precastConfig.dbUser = projectConfig.dbUser;

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
  await writeFile(configPath, finalContent, "utf-8");
}

/**
 * Reads and parses the Precast configuration file from a project directory.
 *
 * This function:
 * - Locates the precast.jsonc file in the specified directory
 * - Parses the JSONC content (JSON with comments and trailing commas)
 * - Validates the configuration structure
 * - Returns null for missing or invalid configurations
 *
 * Used by the CLI to understand existing project configurations when adding
 * features or performing operations on previously generated projects.
 *
 * @param {string} projectDir The absolute path to the project directory containing precast.jsonc
 * @returns {Promise<PrecastConfig | null>} The parsed configuration object, or null if not found/invalid
 * @throws {never} Does not throw - returns null on any parsing or file system errors
 */
export async function readPrecastConfig(projectDir: string): Promise<PrecastConfig | null> {
  try {
    const configPath = path.join(projectDir, PRECAST_CONFIG_FILE);

    if (!(await pathExists(configPath))) {
      return null;
    }

    const configContent = await readFile(configPath, "utf-8");

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
  updates: Partial<Omit<PrecastConfig, "$schema" | "version" | "createdAt">>
) {
  try {
    const configPath = path.join(projectDir, PRECAST_CONFIG_FILE);

    if (!(await pathExists(configPath))) {
      return;
    }

    const configContent = await readFile(configPath, "utf-8");

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

    await writeFile(configPath, modifiedContent, "utf-8");
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
    uiFramework: config.uiFramework,
    apiClient: config.apiClient,
    aiAssistant: config.aiAssistant,
    authProvider: config.authProvider,
    typescript: config.typescript,
    git: config.git,
    gitignore: config.gitignore ?? true,
    eslint: config.eslint ?? true,
    prettier: config.prettier ?? true,
    docker: config.docker ?? false,
    securePasswords: config.securePasswords,
    packageManager: config.packageManager,
    packageManagerVersion: config.packageManagerVersion,
    projectPath: projectDir,
    runtime: config.runtime || "node",
    deploymentMethod: config.deploymentMethod,
    colorPalette: config.colorPalette,
    aiContext: config.aiContext,
    mcpServers: config.mcpServers,
    powerups: config.powerups,
    plugins: config.plugins,
    addons: config.addons,
    autoInstall: config.autoInstall,
    includeAdminTools: config.includeAdminTools,
    includeRedis: config.includeRedis,
    dbUser: config.dbUser,
  };
}

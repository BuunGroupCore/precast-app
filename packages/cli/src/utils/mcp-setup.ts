import path from "path";
import { fileURLToPath } from "url";

import { consola } from "consola";
import fsExtra from "fs-extra";
import Handlebars from "handlebars";

const { ensureDir, writeFile, pathExists, readFile, readJson, readdir } = fsExtra;

import type { ProjectConfig } from "../../../shared/stack-config.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Configuration for a Model Context Protocol (MCP) server
 */
interface MCPServer {
  id: string;
  name: string;
  description: string;
  category:
    | "database"
    | "deployment"
    | "auth"
    | "ai"
    | "productivity"
    | "monitoring"
    | "storage"
    | "communication";
  triggers: {
    frameworks?: string[];
    databases?: string[];
    deployments?: string[];
    auth?: string[];
    any?: boolean;
  };
  config: {
    server_name: string;
    command: string;
    args?: string[];
    env?: Record<string, string>;
  };
  repository?: string;
}

/**
 * Load all MCP server configurations from template directory
 */
async function loadMCPServers(): Promise<MCPServer[]> {
  const servers: MCPServer[] = [];
  const serversDir = path.join(__dirname, "..", "..", "src", "templates", "mcp", "servers");

  try {
    // Try to load from the servers directory
    if (await pathExists(serversDir)) {
      const files = await readdir(serversDir);
      const jsonFiles = files.filter((f) => f.endsWith(".json") && f !== "servers-index.json");

      for (const file of jsonFiles) {
        try {
          const serverConfig = await readJson(path.join(serversDir, file));
          servers.push(serverConfig as MCPServer);
        } catch (error) {
          consola.warn(`Failed to load MCP server config: ${file}`, error);
        }
      }
    }

    // If no servers loaded from files, fall back to built-in configs
    if (servers.length === 0) {
      servers.push(...getBuiltInMCPServers());
    }
  } catch (error) {
    consola.warn("Failed to load MCP server configs, using built-in:", error);
    servers.push(...getBuiltInMCPServers());
  }

  return servers;
}

/**
 * Get built-in MCP server configurations as fallback
 */
function getBuiltInMCPServers(): MCPServer[] {
  return [
    {
      id: "filesystem",
      name: "Filesystem MCP Server",
      description: "Secure file operations with configurable access controls",
      category: "productivity",
      triggers: { any: true },
      config: {
        server_name: "filesystem",
        command: "npx",
        args: ["-y", "@modelcontextprotocol/server-filesystem"],
        env: {
          ALLOWED_DIRECTORIES: "${ALLOWED_DIRECTORIES:-/path/to/your/project}",
        },
      },
      repository: "https://github.com/modelcontextprotocol/servers/tree/main/src/filesystem",
    },
    {
      id: "github-official",
      name: "GitHub MCP Server (Official)",
      description: "Official GitHub MCP server for repository management",
      category: "productivity",
      triggers: { any: true },
      config: {
        server_name: "github",
        command: "docker",
        args: [
          "run",
          "-i",
          "--rm",
          "-e",
          "GITHUB_PERSONAL_ACCESS_TOKEN=${GITHUB_PERSONAL_ACCESS_TOKEN}",
          "ghcr.io/github/github-mcp-server",
        ],
      },
      repository: "https://github.com/github/github-mcp-server",
    },
    {
      id: "postgresql",
      name: "PostgreSQL MCP Server",
      description: "Connect and query PostgreSQL databases",
      category: "database",
      triggers: {
        databases: ["postgres", "postgresql"],
      },
      config: {
        server_name: "postgresql",
        command: "npx",
        args: ["-y", "@modelcontextprotocol/server-postgres"],
        env: {
          POSTGRES_CONNECTION_STRING: "postgresql://user:password@localhost:5432/database",
        },
      },
      repository: "https://github.com/modelcontextprotocol/servers/tree/main/src/postgres",
    },
  ];
}

/**
 * Get MCP servers by their unique identifiers
 */
export async function getSpecifiedMCPServers(serverIds: string[]): Promise<MCPServer[]> {
  const allServers = await loadMCPServers();
  return allServers.filter((server) => serverIds.includes(server.id));
}

/**
 * Get all available MCP servers (exported for compatibility)
 */
export async function getMCPServers(): Promise<MCPServer[]> {
  return loadMCPServers();
}

/**
 * Export mcpServers for backward compatibility
 * This is a promise-based export that loads servers dynamically
 */
export const mcpServers = getMCPServers();

/**
 * Exported for backward compatibility
 */
export async function getRelevantMCPServers(config: ProjectConfig): Promise<MCPServer[]> {
  const allServers = await loadMCPServers();

  return allServers.filter((server) => {
    const { triggers } = server;

    if (triggers.any === true) {
      return true;
    }

    if (triggers.frameworks?.includes(config.framework)) {
      return true;
    }

    if (config.database && triggers.databases?.includes(config.database)) {
      return true;
    }

    if (config.deploymentMethod && triggers.deployments?.includes(config.deploymentMethod)) {
      return true;
    }

    if (config.authProvider && triggers.auth?.includes(config.authProvider)) {
      return true;
    }

    return false;
  });
}

/**
 * Setup Model Context Protocol (MCP) configuration using templates
 */
export async function setupMCPConfiguration(
  projectPath: string,
  config: ProjectConfig
): Promise<void> {
  consola.info("🔌 Setting up MCP (Model Context Protocol) configuration...");

  try {
    let relevantServers: MCPServer[];

    if (config.mcpServers && config.mcpServers.length > 0) {
      // Use user-specified MCP servers
      relevantServers = await getSpecifiedMCPServers(config.mcpServers);

      if (relevantServers.length === 0) {
        const allServers = await loadMCPServers();
        consola.warn("⚠️  None of the specified MCP servers were found. Available servers:");
        allServers.forEach((server) => {
          consola.info(`  - ${server.id}: ${server.name}`);
        });
        return;
      }

      const allServers = await loadMCPServers();
      const invalidServers = config.mcpServers.filter(
        (serverId) => !allServers.find((server) => server.id === serverId)
      );

      if (invalidServers.length > 0) {
        consola.warn(`⚠️  Invalid MCP server IDs: ${invalidServers.join(", ")}`);
      }
    } else {
      // Use auto-detection based on project configuration
      relevantServers = await getRelevantMCPServers(config);
    }

    if (relevantServers.length === 0) {
      consola.info("📝 No MCP servers configured for this project setup");
      return;
    }

    // Register Handlebars helpers
    Handlebars.registerHelper("ifEquals", function (this: any, arg1: any, arg2: any, options: any) {
      return arg1 === arg2 ? options.fn(this) : options.inverse(this);
    });

    // Create MCP configuration using template
    await createMCPConfigFromTemplate(projectPath, relevantServers);

    // Create environment variables template
    await createMCPEnvTemplate(projectPath, relevantServers);

    consola.success(`✅ MCP configuration created with ${relevantServers.length} servers:`);
    relevantServers.forEach((server) => {
      consola.info(`  🔌 ${server.name}`);
    });

    consola.info("💡 Configure your environment variables in .env to use MCP servers");
  } catch (error) {
    consola.error("Failed to setup MCP configuration:", error);
  }
}

/**
 * Create MCP configuration from template
 */
async function createMCPConfigFromTemplate(
  projectPath: string,
  servers: MCPServer[]
): Promise<void> {
  const claudeDir = path.join(projectPath, ".claude");
  await ensureDir(claudeDir);

  // Load and process the MCP template
  const templatePaths = [
    path.join(__dirname, "templates", "mcp", "mcp.json.hbs"),
    path.join(__dirname, "..", "..", "src", "templates", "mcp", "mcp.json.hbs"),
  ];

  let templateContent: string | null = null;
  for (const templatePath of templatePaths) {
    if (await pathExists(templatePath)) {
      templateContent = await readFile(templatePath, "utf-8");
      break;
    }
  }

  if (!templateContent) {
    // Fallback to inline template
    templateContent = `{
  "mcpServers": {
{{#each servers}}
    "{{this.config.server_name}}": {
      "command": "{{this.config.command}}"{{#if this.config.args}},
      "args": [{{#each this.config.args}}"{{this}}"{{#unless @last}}, {{/unless}}{{/each}}]{{/if}}{{#if this.config.env}},
      "env": {
{{#each this.config.env}}
        "{{@key}}": "{{this}}"{{#unless @last}},{{/unless}}
{{/each}}
      }{{/if}}
    }{{#unless @last}},{{/unless}}
{{/each}}
  }
}`;
  }

  const template = Handlebars.compile(templateContent);
  const mcpConfig = template({ servers });

  const mcpConfigPath = path.join(claudeDir, "mcp.json");
  await writeFile(mcpConfigPath, mcpConfig);
}

/**
 * Create environment variable template file for MCP servers
 */
async function createMCPEnvTemplate(projectPath: string, servers: MCPServer[]): Promise<void> {
  const envExamplePath = path.join(projectPath, ".env.example");

  const envVars: Array<{ key: string; comment: string; defaultValue: string }> = [];
  const processedKeys = new Set<string>();

  for (const server of servers) {
    if (server.config.env) {
      for (const [key, value] of Object.entries(server.config.env)) {
        if (!processedKeys.has(key)) {
          processedKeys.add(key);
          envVars.push({
            key,
            comment: `${server.name} - ${server.description}`,
            defaultValue: value.replace(/\$\{[^}]+\}/g, "") || "",
          });
        }
      }
    }
  }

  if (envVars.length === 0) {
    return;
  }

  let existingContent = "";
  if (await pathExists(envExamplePath)) {
    existingContent = await readFile(envExamplePath, "utf-8");
    if (existingContent.includes("# MCP (Model Context Protocol) Configuration")) {
      return;
    }
  }

  // Load and process the environment template
  const templatePaths = [
    path.join(__dirname, "templates", "mcp", "env-section.hbs"),
    path.join(__dirname, "..", "..", "src", "templates", "mcp", "env-section.hbs"),
  ];

  let templateContent: string | null = null;
  for (const templatePath of templatePaths) {
    if (await pathExists(templatePath)) {
      templateContent = await readFile(templatePath, "utf-8");
      break;
    }
  }

  if (!templateContent) {
    // Fallback to inline template
    templateContent = `
# =============================================================================
# MCP (Model Context Protocol) Configuration
# =============================================================================
# Configure these environment variables to use MCP servers with Claude Code

{{#each envVars}}
# {{this.comment}}
{{this.key}}={{this.defaultValue}}
{{/each}}`;
  }

  const template = Handlebars.compile(templateContent);
  const mcpSection = template({ envVars });

  const updatedContent = existingContent + "\n" + mcpSection + "\n";
  await writeFile(envExamplePath, updatedContent);
}

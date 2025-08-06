import path from "path";

import { consola } from "consola";
import fsExtra from "fs-extra";
// eslint-disable-next-line import/no-named-as-default-member
const { ensureDir, writeFile, pathExists, readFile } = fsExtra;

import type { ProjectConfig } from "../../../shared/stack-config.js";

interface MCPServerConfig {
  command: string;
  args?: string[];
  env?: Record<string, string>;
}

interface MCPConfig {
  mcpServers: Record<string, MCPServerConfig>;
}

/**
 * Configuration for a Model Context Protocol (MCP) server
 */
interface MCPServer {
  /** Unique identifier for the MCP server */
  id: string;
  /** Human-readable name of the MCP server */
  name: string;
  /** Description of what the MCP server provides */
  description: string;
  /** Category classification for organizational purposes */
  category:
    | "database"
    | "deployment"
    | "auth"
    | "ai"
    | "productivity"
    | "monitoring"
    | "storage"
    | "communication";
  /** Conditions that trigger this MCP server to be included */
  triggers: {
    /** Framework names that trigger inclusion */
    frameworks?: string[];
    /** Database names that trigger inclusion */
    databases?: string[];
    /** Deployment method names that trigger inclusion */
    deployments?: string[];
    /** Authentication provider names that trigger inclusion */
    auth?: string[];
    /** Whether to always include regardless of other selections */
    any?: boolean;
  };
  /** MCP server execution configuration */
  config: {
    /** Name used in the MCP configuration file */
    server_name: string;
    /** Command to execute the MCP server */
    command: string;
    /** Command line arguments */
    args?: string[];
    /** Environment variables required by the server */
    env?: Record<string, string>;
  };
  /** URL to the server's source code repository */
  repository?: string;
}

/**
 * List of available MCP servers and their configurations.
 * ONLY includes verified real, existing MCP servers as of August 2025.
 * All repositories and npm packages have been verified to exist.
 */
export const mcpServers: MCPServer[] = [
  {
    id: "filesystem",
    name: "Filesystem MCP Server",
    description: "Secure file operations with configurable access controls",
    category: "productivity",
    triggers: {
      any: true,
    },
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
    id: "memory",
    name: "Memory MCP Server",
    description: "Knowledge graph-based persistent memory system",
    category: "ai",
    triggers: {
      any: false,
    },
    config: {
      server_name: "memory",
      command: "npx",
      args: ["-y", "@modelcontextprotocol/server-memory"],
    },
    repository: "https://github.com/modelcontextprotocol/servers/tree/main/src/memory",
  },
  {
    id: "sequential-thinking",
    name: "Sequential Thinking MCP Server",
    description: "Dynamic problem-solving through thought sequences",
    category: "ai",
    triggers: {
      any: false,
    },
    config: {
      server_name: "sequential-thinking",
      command: "npx",
      args: ["-y", "@modelcontextprotocol/server-sequential-thinking"],
    },
    repository: "https://github.com/modelcontextprotocol/servers/tree/main/src/sequential-thinking",
  },
  {
    id: "puppeteer",
    name: "Puppeteer MCP Server",
    description: "Browser automation using Puppeteer for web scraping and testing",
    category: "productivity",
    triggers: {
      any: false,
    },
    config: {
      server_name: "puppeteer",
      command: "npx",
      args: ["-y", "@modelcontextprotocol/server-puppeteer"],
    },
    repository: "https://github.com/modelcontextprotocol/servers/tree/main/src/puppeteer",
  },
  {
    id: "brave-search",
    name: "Brave Search MCP Server",
    description: "Search the web using Brave Search API",
    category: "productivity",
    triggers: {
      any: false,
    },
    config: {
      server_name: "brave-search",
      command: "npx",
      args: ["-y", "@modelcontextprotocol/server-brave-search"],
      env: {
        BRAVE_API_KEY: "your-brave-api-key",
      },
    },
    repository: "https://github.com/modelcontextprotocol/servers/tree/main/src/brave-search",
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

  {
    id: "github-official",
    name: "GitHub MCP Server (Official)",
    description: "Official GitHub MCP server for repository management",
    category: "productivity",
    triggers: {
      any: true,
    },
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
    id: "github-api",
    name: "GitHub API MCP Server",
    description: "GitHub API integration from @modelcontextprotocol",
    category: "productivity",
    triggers: {
      any: false,
    },
    config: {
      server_name: "github-api",
      command: "npx",
      args: ["-y", "@modelcontextprotocol/server-github"],
      env: {
        GITHUB_PERSONAL_ACCESS_TOKEN: "${GITHUB_PERSONAL_ACCESS_TOKEN}",
      },
    },
    repository: "https://github.com/modelcontextprotocol/servers/tree/main/src/github",
  },
  {
    id: "gitlab",
    name: "GitLab MCP Server",
    description: "GitLab API integration",
    category: "productivity",
    triggers: {
      any: false,
    },
    config: {
      server_name: "gitlab",
      command: "npx",
      args: ["-y", "@modelcontextprotocol/server-gitlab"],
      env: {
        GITLAB_PERSONAL_ACCESS_TOKEN: "${GITLAB_PERSONAL_ACCESS_TOKEN}",
        GITLAB_API_URL: "https://gitlab.com/api/v4",
      },
    },
    repository: "https://github.com/modelcontextprotocol/servers/tree/main/src/gitlab",
  },

  {
    id: "aws-mcp",
    name: "AWS MCP Servers",
    description: "AWS services including EKS, ECS, Lambda, DynamoDB, Bedrock",
    category: "storage",
    triggers: {
      any: false,
    },
    config: {
      server_name: "aws",
      command: "git",
      args: ["clone", "https://github.com/awslabs/mcp.git"],
      env: {
        AWS_ACCESS_KEY_ID: "your-access-key-id",
        AWS_SECRET_ACCESS_KEY: "your-secret-access-key",
        AWS_REGION: "us-east-1",
      },
    },
    repository: "https://github.com/awslabs/mcp",
  },
  {
    id: "azure-mcp",
    name: "Azure MCP Server",
    description: "Official Azure MCP server for Azure Storage, Cosmos DB, Kubernetes",
    category: "storage",
    triggers: {
      any: false,
    },
    config: {
      server_name: "azure",
      command: "git",
      args: ["clone", "https://github.com/Azure/azure-mcp.git"],
      env: {
        AZURE_CLIENT_ID: "your-azure-client-id",
        AZURE_CLIENT_SECRET: "your-azure-client-secret",
        AZURE_TENANT_ID: "your-azure-tenant-id",
      },
    },
    repository: "https://github.com/Azure/azure-mcp",
  },
  {
    id: "azure-devops",
    name: "Azure DevOps MCP Server",
    description: "Microsoft Azure DevOps integration",
    category: "productivity",
    triggers: {
      any: false,
    },
    config: {
      server_name: "azure-devops",
      command: "git",
      args: ["clone", "https://github.com/microsoft/azure-devops-mcp.git"],
      env: {
        AZURE_DEVOPS_PAT: "your-azure-devops-personal-access-token",
        AZURE_DEVOPS_ORGANIZATION: "your-organization",
      },
    },
    repository: "https://github.com/microsoft/azure-devops-mcp",
  },

  {
    id: "postgresql-community",
    name: "PostgreSQL MCP Server (Community)",
    description: "Powerful PostgreSQL MCP server with advanced features",
    category: "database",
    triggers: {
      databases: ["postgres", "postgresql"],
    },
    config: {
      server_name: "postgresql-community",
      command: "git",
      args: ["clone", "https://github.com/HenkDz/postgresql-mcp-server.git"],
      env: {
        DATABASE_URL: "postgresql://user:password@localhost:5432/database",
      },
    },
    repository: "https://github.com/HenkDz/postgresql-mcp-server",
  },
  {
    id: "multi-database",
    name: "Multi-Database MCP Server",
    description: "Support for SQLite, SQL Server, PostgreSQL in one server",
    category: "database",
    triggers: {
      databases: ["sqlite", "postgres", "mssql"],
    },
    config: {
      server_name: "multi-database",
      command: "git",
      args: ["clone", "https://github.com/executeautomation/mcp-database-server.git"],
    },
    repository: "https://github.com/executeautomation/mcp-database-server",
  },
  {
    id: "universal-database",
    name: "Universal Database MCP Server",
    description: "MySQL, PostgreSQL, SQL Server, MariaDB support",
    category: "database",
    triggers: {
      databases: ["mysql", "postgres", "mariadb"],
    },
    config: {
      server_name: "universal-database",
      command: "git",
      args: ["clone", "https://github.com/bytebase/dbhub.git"],
    },
    repository: "https://github.com/bytebase/dbhub",
  },
  {
    id: "postgres-ssl",
    name: "PostgreSQL with SSL MCP Server",
    description: "PostgreSQL MCP server with SSL support",
    category: "database",
    triggers: {
      databases: ["postgres", "postgresql"],
    },
    config: {
      server_name: "postgres-ssl",
      command: "npx",
      args: ["-y", "@monsoft/mcp-postgres"],
      env: {
        DATABASE_URL: "postgresql://user:password@localhost:5432/database?sslmode=require",
      },
    },
    repository: "https://www.npmjs.com/package/@monsoft/mcp-postgres",
  },

  {
    id: "filesystem-go",
    name: "Filesystem MCP Server (Go)",
    description: "Go-based filesystem operations server",
    category: "productivity",
    triggers: {
      any: false,
    },
    config: {
      server_name: "filesystem-go",
      command: "git",
      args: ["clone", "https://github.com/mark3labs/mcp-filesystem-server.git"],
    },
    repository: "https://github.com/mark3labs/mcp-filesystem-server",
  },
  {
    id: "filesystem-secure",
    name: "Secure Filesystem MCP Server",
    description: "Node.js filesystem server with enhanced security controls",
    category: "productivity",
    triggers: {
      any: false,
    },
    config: {
      server_name: "filesystem-secure",
      command: "git",
      args: ["clone", "https://github.com/sylphxltd/filesystem-mcp.git"],
    },
    repository: "https://github.com/sylphxltd/filesystem-mcp",
  },

  {
    id: "git-remote",
    name: "Git Remote MCP Server",
    description: "Remote MCP server for any GitHub project",
    category: "productivity",
    triggers: {
      any: false,
    },
    config: {
      server_name: "git-remote",
      command: "git",
      args: ["clone", "https://github.com/idosal/git-mcp.git"],
    },
    repository: "https://github.com/idosal/git-mcp",
  },

  {
    id: "supabase",
    name: "Supabase MCP Server",
    description: "Official Supabase community MCP server for database and edge functions",
    category: "database",
    triggers: {
      databases: ["supabase"],
    },
    config: {
      server_name: "supabase",
      command: "npx",
      args: ["-y", "@supabase/mcp-server-supabase@latest"],
      env: {
        SUPABASE_ACCESS_TOKEN: "${SUPABASE_ACCESS_TOKEN}",
      },
    },
    repository: "https://github.com/supabase-community/supabase-mcp",
  },
  {
    id: "mongodb",
    name: "MongoDB MCP Server",
    description: "Official MongoDB MCP server for database and Atlas management",
    category: "database",
    triggers: {
      databases: ["mongodb", "mongo"],
    },
    config: {
      server_name: "mongodb",
      command: "npx",
      args: ["-y", "mongodb-mcp-server@latest"],
      env: {
        MDB_MCP_CONNECTION_STRING: "${MDB_MCP_CONNECTION_STRING}",
        MDB_MCP_API_CLIENT_ID: "${MDB_MCP_API_CLIENT_ID}",
        MDB_MCP_API_CLIENT_SECRET: "${MDB_MCP_API_CLIENT_SECRET}",
      },
    },
    repository: "https://github.com/mongodb-js/mongodb-mcp-server",
  },
  {
    id: "cloudflare",
    name: "Cloudflare MCP Server",
    description: "Official Cloudflare MCP servers for Workers, DNS, AI Gateway, and more",
    category: "deployment",
    triggers: {
      deployments: ["cloudflare"],
    },
    config: {
      server_name: "cloudflare",
      command: "git",
      args: ["clone", "https://github.com/cloudflare/mcp-server-cloudflare.git"],
      env: {
        CLOUDFLARE_API_TOKEN: "${CLOUDFLARE_API_TOKEN}",
      },
    },
    repository: "https://github.com/cloudflare/mcp-server-cloudflare",
  },
];

/**
 * Get MCP servers relevant to the project configuration based on triggers.
 * Filters the available MCP servers based on project framework, database,
 * deployment method, and authentication provider.
 *
 * @param config - Project configuration containing framework, database, etc.
 * @returns Array of MCP servers that match the project configuration
 */
export function getRelevantMCPServers(config: ProjectConfig): MCPServer[] {
  return mcpServers.filter((server) => {
    const { triggers } = server;

    if (triggers.any === true) {
      return true;
    }

    if (triggers.frameworks?.includes(config.framework)) {
      return true;
    }

    if (triggers.databases?.includes(config.database)) {
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
 * Get MCP servers by their unique identifiers.
 * Filters the available MCP servers to only include those with IDs
 * specified in the provided array.
 *
 * @param serverIds - Array of MCP server IDs to include
 * @returns Array of MCP servers matching the provided IDs
 */
export function getSpecifiedMCPServers(serverIds: string[]): MCPServer[] {
  return mcpServers.filter((server) => serverIds.includes(server.id));
}

/**
 * Setup Model Context Protocol (MCP) configuration for a project.
 * Creates the .claude directory, generates mcp.json configuration file,
 * and creates environment variable templates.
 *
 * @param projectPath - Absolute path to the project directory
 * @param config - Project configuration including MCP server preferences
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
      relevantServers = getSpecifiedMCPServers(config.mcpServers);

      if (relevantServers.length === 0) {
        consola.warn("⚠️  None of the specified MCP servers were found. Available servers:");
        mcpServers.forEach((server) => {
          consola.info(`  - ${server.id}: ${server.name}`);
        });
        return;
      }

      const invalidServers = config.mcpServers.filter(
        (serverId) => !mcpServers.find((server) => server.id === serverId)
      );

      if (invalidServers.length > 0) {
        consola.warn(`⚠️  Invalid MCP server IDs: ${invalidServers.join(", ")}`);
      }
    } else {
      // Use auto-detection based on project configuration
      relevantServers = getRelevantMCPServers(config);
    }

    if (relevantServers.length === 0) {
      consola.info("📝 No MCP servers configured for this project setup");
      return;
    }

    const mcpConfig: MCPConfig = {
      mcpServers: {},
    };

    for (const server of relevantServers) {
      mcpConfig.mcpServers[server.config.server_name] = {
        command: server.config.command,
        args: server.config.args,
        env: server.config.env,
      };
    }

    const claudeDir = path.join(projectPath, ".claude");
    await ensureDir(claudeDir);

    const mcpConfigPath = path.join(claudeDir, "mcp.json");
    await writeFile(mcpConfigPath, JSON.stringify(mcpConfig, null, 2) + "\n");

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
 * Create environment variable template file for MCP servers.
 * Generates a .env.example file with all required environment variables
 * for the selected MCP servers, including descriptive comments.
 *
 * @param projectPath - Absolute path to the project directory
 * @param servers - Array of MCP servers to generate environment variables for
 */
async function createMCPEnvTemplate(projectPath: string, servers: MCPServer[]): Promise<void> {
  const envExamplePath = path.join(projectPath, ".env.example");

  const envVars = new Set<string>();
  const envComments: Record<string, string> = {};

  for (const server of servers) {
    if (server.config.env) {
      for (const [key] of Object.entries(server.config.env)) {
        envVars.add(key);
        envComments[key] = `# ${server.name} - ${server.description}`;
      }
    }
  }

  if (envVars.size === 0) {
    return;
  }

  let existingContent = "";
  if (await pathExists(envExamplePath)) {
    existingContent = await readFile(envExamplePath, "utf-8");
    if (existingContent.includes("# MCP (Model Context Protocol) Configuration")) {
      return;
    }
  }

  const mcpSection = [
    "",
    "# =============================================================================",
    "# MCP (Model Context Protocol) Configuration",
    "# =============================================================================",
    "# Configure these environment variables to use MCP servers with Claude Code",
    "",
    ...Array.from(envVars).map((key) => {
      const comment = envComments[key];
      return `${comment}\n${key}=`;
    }),
    "",
  ].join("\n");

  const updatedContent = existingContent + mcpSection;
  await writeFile(envExamplePath, updatedContent);
}

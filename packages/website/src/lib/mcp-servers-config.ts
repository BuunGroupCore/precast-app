import { IconType } from "react-icons";
import { FaGithub, FaFileCode, FaSearch } from "react-icons/fa";
import { SiPostgresql, SiMongodb, SiSupabase } from "react-icons/si";

import { CloudflareIcon } from "@/components/icons/CloudflareIcon";
import { MCPIcon } from "@/components/icons/MCPIcon";

export interface MCPServer {
  id: string;
  name: string;
  description: string;
  icon: IconType | React.FC<{ className?: string }>;
  category: "database" | "deployment" | "productivity" | "ai" | "storage";
  /** Technologies that trigger this MCP server to be included */
  triggers: {
    frameworks?: string[];
    databases?: string[];
    deployments?: string[];
    auth?: string[];
    /** Always include regardless of selection */
    any?: boolean;
  };
  /** MCP server configuration */
  config: {
    server_name: string;
    command: string;
    args?: string[];
    env?: { [key: string]: string };
  };
  /** Repository URL */
  repository?: string;
}

/**
 * Available MCP (Model Context Protocol) servers for AI-assisted development.
 * Each server provides specific functionality for interacting with various services.
 */
export const mcpServers: MCPServer[] = [
  {
    id: "filesystem",
    name: "Filesystem",
    description: "Secure file operations with configurable access controls",
    icon: FaFileCode,
    category: "productivity",
    triggers: {
      any: true, // Always useful for development
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
    id: "postgres",
    name: "PostgreSQL",
    description: "Connect and query PostgreSQL databases",
    icon: SiPostgresql,
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
    id: "supabase",
    name: "Supabase",
    description: "Supabase database and edge functions management",
    icon: SiSupabase,
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
    name: "MongoDB",
    description: "MongoDB database and Atlas management",
    icon: SiMongodb,
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
      },
    },
    repository: "https://github.com/mongodb-js/mongodb-mcp-server",
  },

  {
    id: "github",
    name: "GitHub",
    description: "Official GitHub repository management and API access",
    icon: FaGithub,
    category: "productivity",
    triggers: {
      any: true, // Always useful for development
    },
    config: {
      server_name: "github",
      command: "npx",
      args: ["-y", "@modelcontextprotocol/server-github"],
      env: {
        GITHUB_PERSONAL_ACCESS_TOKEN: "${GITHUB_PERSONAL_ACCESS_TOKEN}",
      },
    },
    repository: "https://github.com/modelcontextprotocol/servers/tree/main/src/github",
  },
  {
    id: "brave-search",
    name: "Brave Search",
    description: "Search the web using Brave Search API",
    icon: FaSearch,
    category: "productivity",
    triggers: {
      any: false,
    },
    config: {
      server_name: "brave-search",
      command: "npx",
      args: ["-y", "@modelcontextprotocol/server-brave-search"],
      env: {
        BRAVE_API_KEY: "${BRAVE_API_KEY}",
      },
    },
    repository: "https://github.com/modelcontextprotocol/servers/tree/main/src/brave-search",
  },

  {
    id: "cloudflare",
    name: "Cloudflare",
    description: "Cloudflare Workers, DNS, and AI Gateway management",
    icon: CloudflareIcon,
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

  {
    id: "memory",
    name: "Memory",
    description: "Knowledge graph-based persistent memory system",
    icon: MCPIcon,
    category: "ai",
    triggers: {
      any: false, // Optional enhancement
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
    name: "Sequential Thinking",
    description: "Dynamic problem-solving through thought sequences",
    icon: MCPIcon,
    category: "ai",
    triggers: {
      any: false, // Optional AI enhancement
    },
    config: {
      server_name: "sequential-thinking",
      command: "npx",
      args: ["-y", "@modelcontextprotocol/server-sequential-thinking"],
    },
    repository: "https://github.com/modelcontextprotocol/servers/tree/main/src/sequential-thinking",
  },
];

/**
 * Filters MCP servers based on project configuration.
 * Returns servers that match the selected technologies or have 'any' trigger.
 *
 * @param config - Project configuration with framework, database, deployment options
 * @returns Array of relevant MCP servers
 */
export function getRelevantMCPServers(config: {
  framework?: string;
  database?: string;
  deploymentMethod?: string;
  auth?: string;
  backend?: string;
}): MCPServer[] {
  return mcpServers.filter((server) => {
    const { triggers } = server;

    if (triggers.any) {
      return true;
    }

    if (triggers.databases && config.database && config.database !== "none") {
      if (triggers.databases.includes(config.database)) {
        return true;
      }
    }

    if (triggers.deployments && config.deploymentMethod && config.deploymentMethod !== "none") {
      if (triggers.deployments.includes(config.deploymentMethod)) {
        return true;
      }
    }

    return false;
  });
}

/**
 * Generates MCP configuration object for Claude Code settings.
 * Formats the servers into the expected configuration structure.
 *
 * @param servers - Array of MCP servers to include
 * @returns Configuration object for mcpServers section
 */
export function generateMCPConfig(servers: MCPServer[]): object {
  const mcpConfig = {
    mcpServers: {} as Record<
      string,
      {
        command: string;
        args?: string[];
        env?: Record<string, string>;
      }
    >,
  };

  servers.forEach((server) => {
    mcpConfig.mcpServers[server.config.server_name] = {
      command: server.config.command,
      args: server.config.args || [],
      env: server.config.env || {},
    };
  });

  return mcpConfig;
}

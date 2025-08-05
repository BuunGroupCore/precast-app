import { IconType } from "react-icons";
import { FaGithub, FaCodeBranch, FaChartBar, FaFileCode } from "react-icons/fa";
import {
  SiMongodb,
  SiPostgresql,
  SiMysql,
  SiSqlite,
  SiSupabase,
  SiFirebase,
  SiNetlify,
  SiVercel,
  SiRedis,
  SiNotion,
  SiSlack,
  SiDiscord,
  SiAuth0,
} from "react-icons/si";

export interface MCPServer {
  id: string;
  name: string;
  description: string;
  icon: IconType;
  category:
    | "database"
    | "deployment"
    | "auth"
    | "ai"
    | "productivity"
    | "monitoring"
    | "storage"
    | "communication";
  // Technologies that trigger this MCP server to be included
  triggers: {
    frameworks?: string[];
    databases?: string[];
    deployments?: string[];
    auth?: string[];
    any?: boolean; // Always include regardless of selection
  };
  // MCP server configuration
  config: {
    server_name: string;
    command: string;
    args?: string[];
    env?: { [key: string]: string };
  };
  // Optional documentation links
  docs?: string;
  // Repository URL
  repository?: string;
}

export const mcpServers: MCPServer[] = [
  // Database MCP Servers
  {
    id: "mongodb",
    name: "MongoDB MCP Server",
    description: "Connect and query MongoDB databases with natural language",
    icon: SiMongodb,
    category: "database",
    triggers: {
      databases: ["mongodb"],
    },
    config: {
      server_name: "mongodb",
      command: "npx",
      args: ["-y", "@modelcontextprotocol/server-mongodb"],
      env: {
        MONGODB_URI: "mongodb://localhost:27017",
      },
    },
    repository: "https://github.com/modelcontextprotocol/servers/tree/main/src/mongodb",
    docs: "https://modelcontextprotocol.io/servers/mongodb",
  },
  {
    id: "postgresql",
    name: "PostgreSQL MCP Server",
    description: "Execute SQL queries and manage PostgreSQL databases",
    icon: SiPostgresql,
    category: "database",
    triggers: {
      databases: ["postgres"],
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
    docs: "https://modelcontextprotocol.io/servers/postgres",
  },
  {
    id: "mysql",
    name: "MySQL MCP Server",
    description: "Query and manage MySQL databases with AI assistance",
    icon: SiMysql,
    category: "database",
    triggers: {
      databases: ["mysql"],
    },
    config: {
      server_name: "mysql",
      command: "npx",
      args: ["-y", "@modelcontextprotocol/server-mysql"],
      env: {
        MYSQL_CONNECTION_STRING: "mysql://user:password@localhost:3306/database",
      },
    },
    repository: "https://github.com/modelcontextprotocol/servers/tree/main/src/mysql",
  },
  {
    id: "sqlite",
    name: "SQLite MCP Server",
    description: "Work with SQLite databases through natural language queries",
    icon: SiSqlite,
    category: "database",
    triggers: {
      databases: ["sqlite"],
    },
    config: {
      server_name: "sqlite",
      command: "npx",
      args: ["-y", "@modelcontextprotocol/server-sqlite"],
      env: {
        SQLITE_DB_PATH: "./database.sqlite",
      },
    },
    repository: "https://github.com/modelcontextprotocol/servers/tree/main/src/sqlite",
    docs: "https://modelcontextprotocol.io/servers/sqlite",
  },
  {
    id: "supabase",
    name: "Supabase MCP Server",
    description: "Manage Supabase projects, databases, and authentication",
    icon: SiSupabase,
    category: "database",
    triggers: {
      databases: ["supabase"],
    },
    config: {
      server_name: "supabase",
      command: "npx",
      args: ["-y", "@modelcontextprotocol/server-supabase"],
      env: {
        SUPABASE_URL: "https://your-project.supabase.co",
        SUPABASE_ANON_KEY: "your-anon-key",
      },
    },
    repository: "https://github.com/modelcontextprotocol/servers/tree/main/src/supabase",
  },
  {
    id: "firebase",
    name: "Firebase MCP Server",
    description: "Interact with Firebase services including Firestore and Auth",
    icon: SiFirebase,
    category: "database",
    triggers: {
      databases: ["firebase"],
    },
    config: {
      server_name: "firebase",
      command: "npx",
      args: ["-y", "@modelcontextprotocol/server-firebase"],
      env: {
        FIREBASE_PROJECT_ID: "your-project-id",
        GOOGLE_APPLICATION_CREDENTIALS: "./firebase-service-account.json",
      },
    },
    repository: "https://github.com/modelcontextprotocol/servers/tree/main/src/firebase",
  },
  {
    id: "redis",
    name: "Redis MCP Server",
    description: "Manage Redis cache and data structures",
    icon: SiRedis,
    category: "database",
    triggers: {
      databases: ["redis"],
    },
    config: {
      server_name: "redis",
      command: "npx",
      args: ["-y", "@modelcontextprotocol/server-redis"],
      env: {
        REDIS_URL: "redis://localhost:6379",
      },
    },
    repository: "https://github.com/modelcontextprotocol/servers/tree/main/src/redis",
  },

  // Deployment and Cloud MCP Servers
  {
    id: "github",
    name: "GitHub MCP Server",
    description: "Manage GitHub repositories, issues, and pull requests",
    icon: FaGithub,
    category: "deployment",
    triggers: {
      any: true, // Always useful for development
    },
    config: {
      server_name: "github",
      command: "npx",
      args: ["-y", "@modelcontextprotocol/server-github"],
      env: {
        GITHUB_PERSONAL_ACCESS_TOKEN: "your-github-token",
      },
    },
    repository: "https://github.com/modelcontextprotocol/servers/tree/main/src/github",
    docs: "https://modelcontextprotocol.io/servers/github",
  },
  {
    id: "netlify",
    name: "Netlify MCP Server",
    description: "Deploy and manage sites on Netlify platform",
    icon: SiNetlify,
    category: "deployment",
    triggers: {
      deployments: ["netlify"],
    },
    config: {
      server_name: "netlify",
      command: "npx",
      args: ["-y", "@punkpeye/mcp-server-netlify"],
      env: {
        NETLIFY_ACCESS_TOKEN: "your-netlify-token",
      },
    },
    repository: "https://github.com/punkpeye/mcp-server-netlify",
  },
  {
    id: "vercel",
    name: "Vercel MCP Server",
    description: "Deploy and manage projects on Vercel platform",
    icon: SiVercel,
    category: "deployment",
    triggers: {
      deployments: ["vercel"],
    },
    config: {
      server_name: "vercel",
      command: "npx",
      args: ["-y", "@modelcontextprotocol/server-vercel"],
      env: {
        VERCEL_TOKEN: "your-vercel-token",
      },
    },
    repository: "https://github.com/modelcontextprotocol/servers/tree/main/src/vercel",
  },

  // Authentication MCP Servers
  {
    id: "auth0",
    name: "Auth0 MCP Server",
    description: "Manage Auth0 applications, users, and authentication flows",
    icon: SiAuth0,
    category: "auth",
    triggers: {
      auth: ["auth0"],
    },
    config: {
      server_name: "auth0",
      command: "npx",
      args: ["-y", "@modelcontextprotocol/server-auth0"],
      env: {
        AUTH0_DOMAIN: "your-auth0-domain.auth0.com",
        AUTH0_CLIENT_ID: "your-client-id",
        AUTH0_CLIENT_SECRET: "your-client-secret",
      },
    },
    repository: "https://github.com/modelcontextprotocol/servers/tree/main/src/auth0",
  },

  // Productivity and Communication MCP Servers
  {
    id: "notion",
    name: "Notion MCP Server",
    description: "Create and manage Notion pages, databases, and content",
    icon: SiNotion,
    category: "productivity",
    triggers: {
      any: false, // Only show when explicitly needed
    },
    config: {
      server_name: "notion",
      command: "npx",
      args: ["-y", "@modelcontextprotocol/server-notion"],
      env: {
        NOTION_API_KEY: "your-notion-integration-token",
      },
    },
    repository: "https://github.com/modelcontextprotocol/servers/tree/main/src/notion",
    docs: "https://modelcontextprotocol.io/servers/notion",
  },
  {
    id: "slack",
    name: "Slack MCP Server",
    description: "Send messages and interact with Slack workspaces",
    icon: SiSlack,
    category: "communication",
    triggers: {
      any: false, // Only show when explicitly needed
    },
    config: {
      server_name: "slack",
      command: "npx",
      args: ["-y", "@modelcontextprotocol/server-slack"],
      env: {
        SLACK_BOT_TOKEN: "xoxb-your-bot-token",
      },
    },
    repository: "https://github.com/modelcontextprotocol/servers/tree/main/src/slack",
  },
  {
    id: "discord",
    name: "Discord MCP Server",
    description: "Interact with Discord servers and channels",
    icon: SiDiscord,
    category: "communication",
    triggers: {
      any: false, // Only show when explicitly needed
    },
    config: {
      server_name: "discord",
      command: "npx",
      args: ["-y", "@modelcontextprotocol/server-discord"],
      env: {
        DISCORD_BOT_TOKEN: "your-discord-bot-token",
      },
    },
    repository: "https://github.com/modelcontextprotocol/servers/tree/main/src/discord",
  },

  // Development Tools - Always useful
  {
    id: "git",
    name: "Git MCP Server",
    description: "Execute Git commands and manage version control",
    icon: FaCodeBranch,
    category: "productivity",
    triggers: {
      any: true, // Git is used in most projects
    },
    config: {
      server_name: "git",
      command: "npx",
      args: ["-y", "@modelcontextprotocol/server-git"],
    },
    repository: "https://github.com/modelcontextprotocol/servers/tree/main/src/git",
  },
  {
    id: "filesystem",
    name: "Filesystem MCP Server",
    description: "Read and write files in your project directory",
    icon: FaFileCode,
    category: "productivity",
    triggers: {
      any: true, // Always useful
    },
    config: {
      server_name: "filesystem",
      command: "npx",
      args: ["-y", "@modelcontextprotocol/server-filesystem"],
      env: {
        MCP_FILESYSTEM_ALLOWED_DIRECTORIES: "./src,./docs,./tests",
      },
    },
    repository: "https://github.com/modelcontextprotocol/servers/tree/main/src/filesystem",
    docs: "https://modelcontextprotocol.io/servers/filesystem",
  },

  // Monitoring and Analytics
  {
    id: "google-analytics",
    name: "Google Analytics MCP Server",
    description: "Query Google Analytics data and generate reports",
    icon: FaChartBar,
    category: "monitoring",
    triggers: {
      any: false, // Only show when explicitly needed
    },
    config: {
      server_name: "google-analytics",
      command: "npx",
      args: ["-y", "@modelcontextprotocol/server-google-analytics"],
      env: {
        GOOGLE_ANALYTICS_PROPERTY_ID: "your-ga4-property-id",
        GOOGLE_APPLICATION_CREDENTIALS: "./google-analytics-service-account.json",
      },
    },
    repository: "https://github.com/modelcontextprotocol/servers/tree/main/src/google-analytics",
  },
];

/**
 * Get MCP servers that should be included based on the project configuration
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

    // Always include servers with any: true
    if (triggers.any) {
      return true;
    }

    // Check database triggers
    if (triggers.databases && config.database && config.database !== "none") {
      if (triggers.databases.includes(config.database)) {
        return true;
      }
    }

    // Check deployment triggers
    if (triggers.deployments && config.deploymentMethod && config.deploymentMethod !== "none") {
      if (triggers.deployments.includes(config.deploymentMethod)) {
        return true;
      }
    }

    // Check auth triggers
    if (triggers.auth && config.auth && config.auth !== "none") {
      if (triggers.auth.includes(config.auth)) {
        return true;
      }
    }

    // Check framework triggers
    if (triggers.frameworks && config.framework) {
      if (triggers.frameworks.includes(config.framework)) {
        return true;
      }
    }

    return false;
  });
}

/**
 * Generate Claude Code MCP configuration
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

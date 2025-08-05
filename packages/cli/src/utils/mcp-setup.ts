import path from "path";

import { consola } from "consola";
import { ensureDir, writeFile, pathExists, readFile } from "fs-extra";

import type { ProjectConfig } from "../../../shared/stack-config.js";

interface MCPServerConfig {
  command: string;
  args?: string[];
  env?: Record<string, string>;
}

interface MCPConfig {
  mcpServers: Record<string, MCPServerConfig>;
}

interface MCPServer {
  id: string;
  name: string;
  description: string;
  category:
    | "database"
    | "deployment"
    | "auth"
    | "productivity"
    | "communication"
    | "development"
    | "monitoring"
    | "storage";
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

export const mcpServers: MCPServer[] = [
  // Database MCP Servers
  {
    id: "mongodb",
    name: "MongoDB MCP Server",
    description: "Connect and query MongoDB databases with natural language",
    category: "database",
    triggers: {
      databases: ["mongodb"],
    },
    config: {
      server_name: "mongodb",
      command: "npx",
      args: ["-y", "@modelcontextprotocol/server-mongodb"],
      env: {
        MONGODB_URI: "${MONGODB_URI:-mongodb://localhost:27017/myapp}",
      },
    },
    repository: "https://github.com/modelcontextprotocol/servers/tree/main/src/mongodb",
  },
  {
    id: "postgresql",
    name: "PostgreSQL MCP Server",
    description: "Execute SQL queries and manage PostgreSQL databases",
    category: "database",
    triggers: {
      databases: ["postgres"],
    },
    config: {
      server_name: "postgresql",
      command: "npx",
      args: ["-y", "@modelcontextprotocol/server-postgres"],
      env: {
        DATABASE_URL: "${DATABASE_URL:-postgresql://localhost:5432/myapp}",
      },
    },
    repository: "https://github.com/modelcontextprotocol/servers/tree/main/src/postgres",
  },
  {
    id: "mysql",
    name: "MySQL MCP Server",
    description: "Query and manage MySQL databases with AI assistance",
    category: "database",
    triggers: {
      databases: ["mysql"],
    },
    config: {
      server_name: "mysql",
      command: "npx",
      args: ["-y", "@modelcontextprotocol/server-mysql"],
      env: {
        MYSQL_HOST: "${MYSQL_HOST:-localhost}",
        MYSQL_PORT: "${MYSQL_PORT:-3306}",
        MYSQL_USER: "${MYSQL_USER:-root}",
        MYSQL_PASSWORD: "${MYSQL_PASSWORD}",
        MYSQL_DATABASE: "${MYSQL_DATABASE:-myapp}",
      },
    },
    repository: "https://github.com/modelcontextprotocol/servers/tree/main/src/mysql",
  },
  {
    id: "sqlite",
    name: "SQLite MCP Server",
    description: "Work with SQLite databases through natural language queries",
    category: "database",
    triggers: {
      databases: ["sqlite"],
    },
    config: {
      server_name: "sqlite",
      command: "npx",
      args: ["-y", "@modelcontextprotocol/server-sqlite"],
      env: {
        SQLITE_DB: "${SQLITE_DB:-./database.sqlite}",
      },
    },
    repository: "https://github.com/modelcontextprotocol/servers/tree/main/src/sqlite",
  },
  {
    id: "supabase",
    name: "Supabase MCP Server",
    description: "Manage Supabase projects, databases, and authentication",
    category: "database",
    triggers: {
      databases: ["supabase"],
    },
    config: {
      server_name: "supabase",
      command: "npx",
      args: ["-y", "@modelcontextprotocol/server-supabase"],
      env: {
        SUPABASE_PROJECT_URL: "${SUPABASE_PROJECT_URL}",
        SUPABASE_ANON_KEY: "${SUPABASE_ANON_KEY}",
        SUPABASE_SERVICE_ROLE_KEY: "${SUPABASE_SERVICE_ROLE_KEY}",
      },
    },
    repository: "https://github.com/modelcontextprotocol/servers/tree/main/src/supabase",
  },
  {
    id: "firebase",
    name: "Firebase MCP Server",
    description: "Interact with Firebase services including Firestore and Auth",
    category: "database",
    triggers: {
      databases: ["firebase"],
    },
    config: {
      server_name: "firebase",
      command: "npx",
      args: ["-y", "@modelcontextprotocol/server-firebase"],
      env: {
        FIREBASE_PROJECT_ID: "${FIREBASE_PROJECT_ID}",
        FIREBASE_PRIVATE_KEY: "${FIREBASE_PRIVATE_KEY}",
        FIREBASE_CLIENT_EMAIL: "${FIREBASE_CLIENT_EMAIL}",
      },
    },
    repository: "https://github.com/modelcontextprotocol/servers/tree/main/src/firebase",
  },

  // Development and Deployment MCP Servers
  {
    id: "github",
    name: "GitHub MCP Server",
    description: "Manage GitHub repositories, issues, and pull requests",
    category: "development",
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
    id: "netlify",
    name: "Netlify MCP Server",
    description: "Deploy and manage sites on Netlify platform",
    category: "deployment",
    triggers: {
      deployments: ["netlify"],
    },
    config: {
      server_name: "netlify",
      command: "npx",
      args: ["-y", "@punkpeye/mcp-server-netlify"],
      env: {
        NETLIFY_ACCESS_TOKEN: "${NETLIFY_ACCESS_TOKEN}",
      },
    },
    repository: "https://github.com/punkpeye/mcp-server-netlify",
  },
  {
    id: "vercel",
    name: "Vercel MCP Server",
    description: "Deploy and manage projects on Vercel platform",
    category: "deployment",
    triggers: {
      deployments: ["vercel"],
    },
    config: {
      server_name: "vercel",
      command: "npx",
      args: ["-y", "@modelcontextprotocol/server-vercel"],
      env: {
        VERCEL_API_TOKEN: "${VERCEL_API_TOKEN}",
      },
    },
    repository: "https://github.com/modelcontextprotocol/servers/tree/main/src/vercel",
  },

  // Authentication MCP Servers
  {
    id: "auth0",
    name: "Auth0 MCP Server",
    description: "Manage Auth0 applications, users, and authentication flows",
    category: "auth",
    triggers: {
      auth: ["auth0"],
    },
    config: {
      server_name: "auth0",
      command: "npx",
      args: ["-y", "@modelcontextprotocol/server-auth0"],
      env: {
        AUTH0_DOMAIN: "${AUTH0_DOMAIN}",
        AUTH0_CLIENT_ID: "${AUTH0_CLIENT_ID}",
        AUTH0_CLIENT_SECRET: "${AUTH0_CLIENT_SECRET}",
      },
    },
    repository: "https://github.com/modelcontextprotocol/servers/tree/main/src/auth0",
  },

  // Development Tools - Always useful
  {
    id: "git",
    name: "Git MCP Server",
    description: "Execute Git commands and manage version control",
    category: "development",
    triggers: {
      any: true, // Always useful for development
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
    description: "Read, write, and manage project files and directories",
    category: "development",
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

  // Real Community MCP Servers that exist
  {
    id: "docker",
    name: "Docker MCP Server",
    description: "Manage Docker containers, images, and compose services",
    category: "productivity",
    triggers: {
      any: false, // Only show when docker is used
    },
    config: {
      server_name: "docker",
      command: "npx",
      args: ["-y", "docker-mcp"],
    },
    repository: "https://github.com/QuantGeekDev/docker-mcp",
  },
];

export function getRelevantMCPServers(config: ProjectConfig): MCPServer[] {
  return mcpServers.filter((server) => {
    const { triggers } = server;

    // Always include servers with any: true
    if (triggers.any === true) {
      return true;
    }

    // Check framework triggers
    if (triggers.frameworks?.includes(config.framework)) {
      return true;
    }

    // Check database triggers
    if (triggers.databases?.includes(config.database)) {
      return true;
    }

    // Check deployment triggers (if deployment is configured)
    if (config.deploymentMethod && triggers.deployments?.includes(config.deploymentMethod)) {
      return true;
    }

    // Check auth triggers (if auth is configured)
    if (config.authProvider && triggers.auth?.includes(config.authProvider)) {
      return true;
    }

    return false;
  });
}

export async function setupMCPConfiguration(
  projectPath: string,
  config: ProjectConfig
): Promise<void> {
  consola.info("🔌 Setting up MCP (Model Context Protocol) configuration...");

  try {
    const relevantServers = getRelevantMCPServers(config);

    if (relevantServers.length === 0) {
      consola.info("📝 No MCP servers configured for this project setup");
      return;
    }

    // Create MCP configuration
    const mcpConfig: MCPConfig = {
      mcpServers: {},
    };

    // Add each relevant server to the configuration
    for (const server of relevantServers) {
      mcpConfig.mcpServers[server.config.server_name] = {
        command: server.config.command,
        args: server.config.args,
        env: server.config.env,
      };
    }

    // Ensure .claude directory exists
    const claudeDir = path.join(projectPath, ".claude");
    await ensureDir(claudeDir);

    // Write MCP configuration
    const mcpConfigPath = path.join(claudeDir, "mcp.json");
    await writeFile(mcpConfigPath, JSON.stringify(mcpConfig, null, 2) + "\n");

    // Create environment template with MCP variables
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

async function createMCPEnvTemplate(projectPath: string, servers: MCPServer[]): Promise<void> {
  const envExamplePath = path.join(projectPath, ".env.example");

  // Collect all unique environment variables
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

  // Check if .env.example already exists
  let existingContent = "";
  if (await pathExists(envExamplePath)) {
    existingContent = await readFile(envExamplePath, "utf-8");
    // Skip if MCP section already exists
    if (existingContent.includes("# MCP (Model Context Protocol) Configuration")) {
      return;
    }
  }

  // Add MCP section to .env.example
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

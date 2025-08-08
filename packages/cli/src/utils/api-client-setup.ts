import path from "path";
import { consola } from "consola";
import fsExtra from "fs-extra";

// eslint-disable-next-line import/no-named-as-default-member
const { pathExists, ensureDir, writeFile } = fsExtra;

import type { ProjectConfig } from "../../../shared/stack-config.js";
import { createTemplateEngine, type TemplateEngine } from "../core/template-engine.js";
import { getTemplateRoot } from "./template-path.js";
import { installDependencies } from "./package-manager.js";

/**
 * API client configuration
 */
interface ApiClientConfig {
  id: string;
  name: string;
  packages: string[];
  devPackages?: string[];
  templates: {
    path: string;
    outputPath: string;
    frameworks?: string[]; // Only include for specific frameworks
  }[];
}

/**
 * Get API client configuration
 */
function getApiClientConfig(apiClient: string): ApiClientConfig | null {
  const configs: Record<string, ApiClientConfig> = {
    "hono-rpc": {
      id: "hono-rpc",
      name: "Hono RPC",
      packages: ["hono", "@hono/zod-validator", "zod"],
      devPackages: ["@types/node"],
      templates: [
        {
          path: "hono-rpc/client.ts.hbs",
          outputPath: "src/lib/api-client",
        },
        {
          path: "hono-rpc/validations.ts.hbs",
          outputPath: "src/lib/validations",
        },
        {
          path: "hono-rpc/react/use-api.ts.hbs",
          outputPath: "src/hooks/use-api",
          frameworks: ["react", "next"],
        },
      ],
    },
    "tanstack-query": {
      id: "tanstack-query",
      name: "TanStack Query",
      packages: [], // Will be set dynamically based on framework
      templates: [
        {
          path: "tanstack-query/react/query-provider.tsx.hbs",
          outputPath: "src/providers/query-provider",
          frameworks: ["react", "next", "remix"],
        },
        {
          path: "tanstack-query/react/api-hooks.ts.hbs",
          outputPath: "src/hooks/api",
          frameworks: ["react", "next", "remix"],
        },
      ],
    },
    swr: {
      id: "swr",
      name: "SWR",
      packages: ["swr"],
      templates: [
        {
          path: "swr/api-hooks.ts.hbs",
          outputPath: "src/hooks/api",
          frameworks: ["react", "next"],
        },
        {
          path: "swr/fetcher.ts.hbs",
          outputPath: "src/lib/fetcher",
        },
      ],
    },
    axios: {
      id: "axios",
      name: "Axios",
      packages: ["axios"],
      templates: [
        {
          path: "axios/api-client.ts.hbs",
          outputPath: "src/lib/api",
        },
      ],
    },
    trpc: {
      id: "trpc",
      name: "tRPC",
      packages: [
        "@trpc/client",
        "@trpc/server",
        "@trpc/react-query",
        "@tanstack/react-query",
        "zod",
        "superjson",
      ],
      devPackages: ["@types/node"],
      templates: [
        {
          path: "trpc/client.ts.hbs",
          outputPath: "src/lib/trpc",
        },
        {
          path: "trpc/server.ts.hbs",
          outputPath: "src/server/trpc",
        },
        {
          path: "trpc/react/provider.tsx.hbs",
          outputPath: "src/providers/trpc-provider",
          frameworks: ["react", "next"],
        },
      ],
    },
    "apollo-client": {
      id: "apollo-client",
      name: "Apollo Client",
      packages: ["@apollo/client", "graphql"],
      templates: [
        {
          path: "apollo-client/client.ts.hbs",
          outputPath: "src/lib/apollo",
        },
        {
          path: "apollo-client/react/provider.tsx.hbs",
          outputPath: "src/providers/apollo-provider",
          frameworks: ["react", "next"],
        },
        {
          path: "apollo-client/queries.ts.hbs",
          outputPath: "src/graphql/queries",
        },
      ],
    },
  };

  // Note: TanStack Query packages will be set dynamically based on framework
  // when setupApiClient is called

  return configs[apiClient] || null;
}

/**
 * Get TanStack Query packages based on framework
 */
function getTanStackQueryPackages(framework: string): string[] {
  switch (framework) {
    case "react":
    case "next":
    case "remix":
      return ["@tanstack/react-query", "@tanstack/react-query-devtools"];
    case "vue":
    case "nuxt":
      return ["@tanstack/vue-query"];
    case "solid":
      return ["@tanstack/solid-query"];
    case "svelte":
      return ["@tanstack/svelte-query"];
    case "angular":
      return ["@tanstack/angular-query-experimental"];
    default:
      return ["@tanstack/react-query"];
  }
}

/**
 * Setup API client for the project
 * @param config - Project configuration
 * @param projectPath - Path to the project
 */
export async function setupApiClient(config: ProjectConfig, projectPath: string): Promise<void> {
  if (!config.apiClient || config.apiClient === "none") {
    return;
  }

  const apiClientConfig = getApiClientConfig(config.apiClient);
  if (!apiClientConfig) {
    consola.warn(`Unknown API client: ${config.apiClient}`);
    return;
  }

  consola.info(`📡 Setting up ${apiClientConfig.name}...`);

  // Determine target path based on project structure
  const targetPath =
    config.backend && config.backend !== "none"
      ? path.join(projectPath, "apps", "web")
      : projectPath;

  // Get packages (handle framework-specific for TanStack Query)
  let packages = apiClientConfig.packages;
  if (config.apiClient === "tanstack-query") {
    packages = getTanStackQueryPackages(config.framework);
  }

  // Install packages
  if (packages.length > 0) {
    await installDependencies(packages, {
      packageManager: config.packageManager,
      projectPath: targetPath,
      dev: false,
    });
  }

  if (apiClientConfig.devPackages && apiClientConfig.devPackages.length > 0) {
    await installDependencies(apiClientConfig.devPackages, {
      packageManager: config.packageManager,
      projectPath: targetPath,
      dev: true,
    });
  }

  // Process templates
  const templateRoot = getTemplateRoot();
  const templateEngine = createTemplateEngine(templateRoot);
  const apiTemplateRoot = path.join(templateRoot, "api-clients");

  for (const template of apiClientConfig.templates) {
    // Skip if template is framework-specific and doesn't match
    if (template.frameworks && !template.frameworks.includes(config.framework)) {
      continue;
    }

    const templatePath = path.join(apiTemplateRoot, template.path);
    if (!(await pathExists(templatePath))) {
      consola.warn(`Template not found: ${templatePath}`);
      continue;
    }

    // Determine file extension based on TypeScript setting
    const ext = config.typescript
      ? template.outputPath.endsWith("provider")
        ? ".tsx"
        : ".ts"
      : ".js";

    const outputPath = path.join(targetPath, `${template.outputPath}${ext}`);

    // Ensure directory exists
    await ensureDir(path.dirname(outputPath));

    // Process template
    await templateEngine.processTemplate(templatePath, outputPath, config);
    consola.success(`Created ${path.relative(targetPath, outputPath)}`);
  }

  // If backend is also using Hono and we're setting up Hono RPC, create RPC routes
  if (config.apiClient === "hono-rpc" && config.backend === "hono") {
    const backendPath = path.join(projectPath, "apps", "api");

    // Create the RPC routes file
    const rpcRoutesTemplatePath = path.join(apiTemplateRoot, "hono-rpc/routes/rpc.ts.hbs");
    const rpcRoutesOutputPath = path.join(
      backendPath,
      "src",
      "routes",
      `rpc.${config.typescript ? "ts" : "js"}`
    );

    // Ensure routes directory exists
    await ensureDir(path.dirname(rpcRoutesOutputPath));

    // Process the RPC routes template
    await templateEngine.processTemplate(rpcRoutesTemplatePath, rpcRoutesOutputPath, config);
    consola.success("Created Hono RPC routes");

    // Update the main server index.ts to include RPC routes import and mounting
    const serverIndexPath = path.join(
      backendPath,
      "src",
      `index.${config.typescript ? "ts" : "js"}`
    );

    if (await pathExists(serverIndexPath)) {
      let serverContent = await fsExtra.readFile(serverIndexPath, "utf-8");

      // Add import for RPC routes
      const importStatement = config.typescript
        ? "import rpcApp from './routes/rpc';"
        : "import rpcApp from './routes/rpc.js';";

      // Check if import already exists
      if (!serverContent.includes("import rpcApp")) {
        // Find the right place to insert the import (after other imports)
        const importInsertIndex = serverContent.lastIndexOf("import ");
        if (importInsertIndex !== -1) {
          const nextLineIndex = serverContent.indexOf("\n", importInsertIndex) + 1;
          serverContent =
            serverContent.slice(0, nextLineIndex) +
            importStatement +
            "\n" +
            serverContent.slice(nextLineIndex);
        }
      }

      // Add route mounting
      const routeMount = "\n// Mount RPC routes\napp.route('/api', rpcApp);\n";

      // Check if route mounting already exists
      if (!serverContent.includes("app.route('/api', rpcApp)")) {
        // Find the place to insert route mounting (before 404 handler)
        const notFoundIndex = serverContent.indexOf("// 404 handler");
        if (notFoundIndex !== -1) {
          serverContent =
            serverContent.slice(0, notFoundIndex) + routeMount + serverContent.slice(notFoundIndex);
        }
      }

      await writeFile(serverIndexPath, serverContent);
      consola.success("Updated Hono server to include RPC routes");
    }
  }

  // For Express/Fastify backends with Hono RPC, create a separate Hono RPC server
  if (
    config.apiClient === "hono-rpc" &&
    config.backend &&
    config.backend !== "hono" &&
    config.backend !== "none"
  ) {
    const backendPath = path.join(projectPath, "apps", "api");

    // Create RPC routes
    const rpcRoutesTemplatePath = path.join(apiTemplateRoot, "hono-rpc/routes/rpc.ts.hbs");
    const rpcRoutesOutputPath = path.join(
      backendPath,
      "src",
      "routes",
      `rpc.${config.typescript ? "ts" : "js"}`
    );

    await ensureDir(path.dirname(rpcRoutesOutputPath));
    await templateEngine.processTemplate(rpcRoutesTemplatePath, rpcRoutesOutputPath, config);

    // Create a separate Hono app for RPC that can be mounted
    const rpcServerPath = path.join(
      backendPath,
      "src",
      "routes",
      `rpc-server.${config.typescript ? "ts" : "js"}`
    );
    const rpcServerContent = `import { Hono } from 'hono';
import { cors } from 'hono/cors';
import rpcApp from './rpc';

const honoRpc = new Hono()
  .use('*', cors())
  .route('/', rpcApp);

export type AppType = typeof honoRpc;
export default honoRpc;`;

    await writeFile(rpcServerPath, rpcServerContent);
    consola.success("Created Hono RPC server for integration");
  }

  consola.success(`✅ ${apiClientConfig.name} setup completed!`);
}

/**
 * Get API client dependencies
 * @param apiClient - API client type
 * @param framework - Framework type
 * @returns Object with regular and dev dependencies
 */
export function getApiClientDependencies(
  apiClient: string,
  framework: string
): { dependencies: string[]; devDependencies: string[] } {
  if (!apiClient || apiClient === "none") {
    return { dependencies: [], devDependencies: [] };
  }

  const config = getApiClientConfig(apiClient);
  if (!config) {
    return { dependencies: [], devDependencies: [] };
  }

  // Handle framework-specific packages for TanStack Query
  let packages = config.packages;
  if (apiClient === "tanstack-query") {
    packages = getTanStackQueryPackages(framework);
  }

  return {
    dependencies: packages,
    devDependencies: config.devPackages || [],
  };
}

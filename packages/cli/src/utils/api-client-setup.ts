import path from "path";

import { consola } from "consola";
import fsExtra from "fs-extra";

// eslint-disable-next-line import/no-named-as-default-member
const { writeFile, pathExists, readFile, ensureDir } = fsExtra;

import type { ProjectConfig } from "../../../shared/stack-config.js";

import { installDependencies } from "./package-manager.js";

/**
 * API client configuration options
 */
interface ApiClientOption {
  id: string;
  name: string;
  packages: string[];
  devPackages?: string[];
  setupFiles?: Array<{
    path: string;
    content: string;
  }>;
  envVars?: Record<string, string>;
  imports?: {
    path: string;
    imports: string[];
  }[];
}

/**
 * Get API client packages based on framework
 */
function getApiClientPackages(apiClient: string, framework: string): ApiClientOption | null {
  const apiClients: Record<string, ApiClientOption> = {
    "tanstack-query": {
      id: "tanstack-query",
      name: "TanStack Query",
      packages: getFrameworkSpecificPackages("tanstack-query", framework),
      setupFiles: getTanStackQuerySetupFiles(framework),
    },
    swr: {
      id: "swr",
      name: "SWR",
      packages: ["swr"],
      setupFiles: getSWRSetupFiles(framework),
    },
    axios: {
      id: "axios",
      name: "Axios",
      packages: ["axios"],
      setupFiles: getAxiosSetupFiles(framework),
    },
    trpc: {
      id: "trpc",
      name: "tRPC",
      packages: ["@trpc/client", "@trpc/server", "@trpc/react-query", "zod", "superjson"],
      devPackages: ["@types/node"],
      setupFiles: getTRPCSetupFiles(framework),
    },
    "apollo-client": {
      id: "apollo-client",
      name: "Apollo Client",
      packages: ["@apollo/client", "graphql"],
      setupFiles: getApolloSetupFiles(framework),
    },
  };

  return apiClients[apiClient] || null;
}

/**
 * Get framework-specific packages for TanStack Query
 */
function getFrameworkSpecificPackages(apiClient: string, framework: string): string[] {
  if (apiClient === "tanstack-query") {
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
        return ["@tanstack/query-core"];
    }
  }
  return [];
}

/**
 * Generate TanStack Query setup files
 */
function getTanStackQuerySetupFiles(framework: string): ApiClientOption["setupFiles"] {
  const files: ApiClientOption["setupFiles"] = [];

  if (["react", "next", "remix"].includes(framework)) {
    files.push({
      path: "src/lib/query-client.ts",
      content: `import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, /** 1 minute */
      refetchOnWindowFocus: false,
    },
  },
});
`,
    });

    files.push({
      path: "src/providers/query-provider.tsx",
      content: `"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ReactNode } from "react";

import { queryClient } from "@/lib/query-client";

export function QueryProvider({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
`,
    });

    files.push({
      path: "src/hooks/use-api.ts",
      content: `import { useQuery, useMutation, UseQueryOptions, UseMutationOptions } from "@tanstack/react-query";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

async function fetcher<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(\`\${API_URL}\${endpoint}\`, {
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(\`API error: \${response.statusText}\`);
  }

  return response.json();
}

export function useApiQuery<T>(
  endpoint: string,
  options?: Omit<UseQueryOptions<T>, "queryKey" | "queryFn">
) {
  return useQuery<T>({
    queryKey: [endpoint],
    queryFn: () => fetcher<T>(endpoint),
    ...options,
  });
}

export function useApiMutation<TData, TVariables>(
  endpoint: string,
  method: "POST" | "PUT" | "PATCH" | "DELETE" = "POST",
  options?: UseMutationOptions<TData, Error, TVariables>
) {
  return useMutation<TData, Error, TVariables>({
    mutationFn: (variables) =>
      fetcher<TData>(endpoint, {
        method,
        body: JSON.stringify(variables),
      }),
    ...options,
  });
}
`,
    });
  }

  /** Add Vue-specific setup files */
  if (["vue", "nuxt"].includes(framework)) {
    files.push({
      path: "src/lib/query-client.ts",
      content: `import { QueryClient } from "@tanstack/vue-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, /** 1 minute */
      refetchOnWindowFocus: false,
    },
  },
});
`,
    });
  }

  return files;
}

/**
 * Generate SWR setup files
 */
function getSWRSetupFiles(framework: string): ApiClientOption["setupFiles"] {
  const files: ApiClientOption["setupFiles"] = [];

  if (["react", "next", "remix"].includes(framework)) {
    files.push({
      path: "src/lib/fetcher.ts",
      content: `const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export async function fetcher<T>(endpoint: string): Promise<T> {
  const response = await fetch(\`\${API_URL}\${endpoint}\`, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const error = new Error("An error occurred while fetching the data.");
    throw error;
  }

  return response.json();
}

export async function postFetcher<T>(endpoint: string, data: any): Promise<T> {
  const response = await fetch(\`\${API_URL}\${endpoint}\`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = new Error("An error occurred while posting the data.");
    throw error;
  }

  return response.json();
}
`,
    });

    files.push({
      path: "src/hooks/use-api.ts",
      content: `import useSWR from "swr";
import useSWRMutation from "swr/mutation";

import { fetcher, postFetcher } from "@/lib/fetcher";

export function useApi<T>(endpoint: string | null) {
  return useSWR<T>(endpoint, fetcher);
}

export function useApiMutation<T>(endpoint: string) {
  return useSWRMutation<T, Error, string, any>(endpoint, postFetcher);
}
`,
    });

    files.push({
      path: "src/providers/swr-provider.tsx",
      content: `"use client";

import { SWRConfig } from "swr";
import { ReactNode } from "react";

import { fetcher } from "@/lib/fetcher";

export function SWRProvider({ children }: { children: ReactNode }) {
  return (
    <SWRConfig
      value={{
        fetcher,
        revalidateOnFocus: false,
      }}
    >
      {children}
    </SWRConfig>
  );
}
`,
    });
  }

  return files;
}

/**
 * Generate Axios setup files
 */
function getAxiosSetupFiles(framework: string): ApiClientOption["setupFiles"] {
  const files: ApiClientOption["setupFiles"] = [];

  files.push({
    path: "src/lib/axios.ts",
    content: `import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Request interceptor for adding authentication token
 */
api.interceptors.request.use(
  (config) => {
    /** Add auth token if available */
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = \`Bearer \${token}\`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response interceptor for handling errors globally
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      /** Handle unauthorized access */
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);
`,
  });

  if (["react", "next", "remix"].includes(framework)) {
    files.push({
      path: "src/hooks/use-api.ts",
      content: `import { useState, useEffect } from "react";
import { AxiosError } from "axios";

import { api } from "@/lib/axios";

interface UseApiOptions {
  immediate?: boolean;
}

export function useApi<T>(endpoint: string, options?: UseApiOptions) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<AxiosError | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get<T>(endpoint);
      setData(response.data);
    } catch (err) {
      setError(err as AxiosError);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (options?.immediate !== false) {
      fetchData();
    }
  }, [endpoint]);

  return { data, loading, error, refetch: fetchData };
}

export function useApiMutation<TData, TVariables = any>(
  endpoint: string,
  method: "post" | "put" | "patch" | "delete" = "post"
) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<AxiosError | null>(null);

  const mutate = async (variables?: TVariables): Promise<TData | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await api[method]<TData>(endpoint, variables);
      return response.data;
    } catch (err) {
      setError(err as AxiosError);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { mutate, loading, error };
}
`,
    });
  }

  return files;
}

/**
 * Generate tRPC setup files
 */
function getTRPCSetupFiles(framework: string): ApiClientOption["setupFiles"] {
  const files: ApiClientOption["setupFiles"] = [];

  if (["react", "next", "remix"].includes(framework)) {
    files.push({
      path: "src/lib/trpc.ts",
      content: `import { createTRPCReact } from "@trpc/react-query";
import type { AppRouter } from "@/server/routers/_app";

export const trpc = createTRPCReact<AppRouter>();
`,
    });

    files.push({
      path: "src/providers/trpc-provider.tsx",
      content: `"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import { useState } from "react";
import superjson from "superjson";

import { trpc } from "@/lib/trpc";

export function TRPCProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: \`\${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/api/trpc\`,
          transformer: superjson,
        }),
      ],
    })
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </trpc.Provider>
  );
}
`,
    });
  }

  return files;
}

/**
 * Generate Apollo Client setup files
 */
function getApolloSetupFiles(framework: string): ApiClientOption["setupFiles"] {
  const files: ApiClientOption["setupFiles"] = [];

  if (["react", "next", "remix"].includes(framework)) {
    files.push({
      path: "src/lib/apollo-client.ts",
      content: `import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

const httpLink = createHttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_URL || "http://localhost:3001/graphql",
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      ...headers,
      authorization: token ? \`Bearer \${token}\` : "",
    },
  };
});

export const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});
`,
    });

    files.push({
      path: "src/providers/apollo-provider.tsx",
      content: `"use client";

import { ApolloProvider as Provider } from "@apollo/client";
import { ReactNode } from "react";

import { apolloClient } from "@/lib/apollo-client";

export function ApolloProvider({ children }: { children: ReactNode }) {
  return <Provider client={apolloClient}>{children}</Provider>;
}
`,
    });
  }

  return files;
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

  if (!config.backend || config.backend === "none") {
    consola.info("Skipping API client setup - no backend specified");
    return;
  }

  const apiClient = getApiClientPackages(config.apiClient, config.framework);
  if (!apiClient) {
    consola.warn(`Unknown API client: ${config.apiClient}`);
    return;
  }

  consola.info(`Setting up ${apiClient.name} for API communication...`);

  /** Determine the correct path for the web app in monorepo or single app */
  let targetPath = projectPath;
  if (config.backend && config.backend !== "none") {
    /** Monorepo structure - API client goes in apps/web */
    targetPath = path.join(projectPath, "apps", "web");
  }

  /** Install dependencies */
  if (apiClient.packages.length > 0) {
    consola.info(`Installing ${apiClient.name} dependencies...`);
    await installDependencies(apiClient.packages, {
      packageManager: config.packageManager,
      projectPath: targetPath,
      dev: false,
    });
  }

  /** Install dev dependencies */
  if (apiClient.devPackages && apiClient.devPackages.length > 0) {
    await installDependencies(apiClient.devPackages, {
      packageManager: config.packageManager,
      projectPath: targetPath,
      dev: true,
    });
  }

  /** Create setup files */
  if (apiClient.setupFiles) {
    for (const file of apiClient.setupFiles) {
      const filePath = path.join(targetPath, file.path);
      const dir = path.dirname(filePath);

      /** Ensure directory exists */
      await ensureDir(dir);

      /** Write file */
      await writeFile(filePath, file.content);
      consola.success(`Created ${file.path}`);
    }
  }

  /** Add environment variables to .env.example if needed */
  if (apiClient.envVars) {
    const envPath = path.join(targetPath, ".env.example");
    let envContent = "";

    if (await pathExists(envPath)) {
      envContent = await readFile(envPath, "utf-8");
    }

    for (const [key, value] of Object.entries(apiClient.envVars)) {
      if (!envContent.includes(key)) {
        envContent += `\n${key}=${value}`;
      }
    }

    await writeFile(envPath, envContent.trim() + "\n");
  }

  consola.success(`${apiClient.name} setup completed!`);
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

  const client = getApiClientPackages(apiClient, framework);
  if (!client) {
    return { dependencies: [], devDependencies: [] };
  }

  return {
    dependencies: client.packages,
    devDependencies: client.devPackages || [],
  };
}

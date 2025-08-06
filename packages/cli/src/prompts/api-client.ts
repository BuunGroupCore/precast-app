import { select } from "@clack/prompts";
import pc from "picocolors";

import type { ProjectConfig } from "../../../shared/stack-config.js";

interface ApiClientOption {
  value: string;
  label: string;
  hint?: string;
}

/**
 * Get available API client options based on framework and backend
 * @param framework - Selected framework
 * @param backend - Selected backend
 * @returns Array of API client options
 */
function getApiClientOptions(framework: string, backend: string): ApiClientOption[] {
  const options: ApiClientOption[] = [
    {
      value: "none",
      label: "None",
      hint: "Use native fetch API",
    },
  ];

  // TanStack Query - supports most frameworks
  if (["react", "next", "remix", "vue", "nuxt", "solid", "svelte", "angular"].includes(framework)) {
    options.push({
      value: "tanstack-query",
      label: "TanStack Query",
      hint: "Powerful data fetching & caching",
    });
  }

  // SWR - React only
  if (["react", "next", "remix"].includes(framework)) {
    options.push({
      value: "swr",
      label: "SWR",
      hint: "Data fetching by Vercel",
    });
  }

  // Axios - universal
  options.push({
    value: "axios",
    label: "Axios",
    hint: "Promise-based HTTP client",
  });

  // tRPC - for compatible backends
  if (
    ["hono", "express", "fastify"].includes(backend) &&
    ["react", "next", "vue", "svelte", "solid"].includes(framework)
  ) {
    options.push({
      value: "trpc",
      label: "tRPC",
      hint: "End-to-end typesafe APIs",
    });
  }

  // Apollo Client - for GraphQL
  if (["react", "vue", "angular", "svelte"].includes(framework)) {
    options.push({
      value: "apollo-client",
      label: "Apollo Client",
      hint: "GraphQL client with caching",
    });
  }

  return options;
}

/**
 * Prompt for API client selection
 * @param config - Current project configuration
 * @returns Selected API client
 */
export async function promptApiClient(config: Partial<ProjectConfig>): Promise<string> {
  // Only show if backend is selected and not "none"
  if (!config.backend || config.backend === "none") {
    return "none";
  }

  const options = getApiClientOptions(config.framework || "react", config.backend);

  // If only "none" is available, return it without prompting
  if (options.length === 1) {
    return "none";
  }

  const apiClient = await select({
    message: `How would you like to communicate with your ${pc.cyan(config.backend)} backend?`,
    options: options.map((opt) => ({
      value: opt.value,
      label: opt.label,
      hint: opt.hint,
    })),
    initialValue: "none",
  });

  return apiClient as string;
}

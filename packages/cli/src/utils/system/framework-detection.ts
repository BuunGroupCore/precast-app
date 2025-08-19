/**
 * Framework Detection and Environment Variable Mapping
 * Detects frontend frameworks and their specific environment variable patterns
 */

import path from "path";

import fs from "fs-extra";

export interface FrameworkConfig {
  framework: string;
  router?: string;
  envVars: string[];
  specialHandling?: string;
}

export interface ProjectStructure {
  isMonorepo: boolean;
  envFiles: EnvFile[];
  framework: FrameworkConfig;
  frontendPath: string;
}

export interface EnvFile {
  path: string;
  fullPath: string;
  type: "frontend" | "root" | "backend";
}

export interface EnvUpdate {
  file: string;
  var: string;
  value: string;
  added?: boolean;
}

// Framework to environment variable mapping
const FRAMEWORK_ENV_MAPPING: Record<string, string[]> = {
  // Vite-based frameworks
  react: ["VITE_API_URL"],
  vue: ["VITE_API_URL"],
  svelte: ["VITE_API_URL"],
  solid: ["VITE_API_URL"],
  vanilla: ["VITE_API_URL"],
  vite: ["VITE_API_URL"],

  // Next.js variants
  next: ["NEXT_PUBLIC_API_URL"],

  // Nuxt
  nuxt: ["NUXT_PUBLIC_API_URL"],

  // React Router v7 (Vite-based)
  "react-router": ["VITE_API_URL"],

  // TanStack Router (Vite-based)
  "tanstack-router": ["VITE_API_URL"],

  // TanStack Start (has both server and client vars)
  "tanstack-start": ["VITE_API_URL", "API_URL"],

  // Remix (can be Vite or custom)
  remix: ["VITE_API_URL"],

  // Astro
  astro: ["PUBLIC_API_URL"],

  // Angular
  angular: ["NG_APP_API_URL"],
};

/**
 * Read and parse precast.jsonc configuration
 */
export const readPrecastConfig = async (projectPath: string): Promise<any> => {
  try {
    const configPath = path.join(projectPath, "precast.jsonc");
    if (!(await fs.pathExists(configPath))) {
      return null;
    }

    const content = await fs.readFile(configPath, "utf8");

    const cleanJson = content
      .replace(/\/\*[\s\S]*?\*\//g, "")
      .replace(/^\s*\/\/.*$/gm, "")
      .replace(/,\s*([}\]])/g, "$1");

    return JSON.parse(cleanJson);
  } catch (error) {
    console.warn("Failed to read precast.jsonc:", error);
    return null;
  }
};

/**
 * Read package.json for dependency-based detection
 */
export const readPackageJson = async (projectPath: string): Promise<any> => {
  try {
    const packagePath = path.join(projectPath, "package.json");
    if (!(await fs.pathExists(packagePath))) {
      return null;
    }

    const content = await fs.readFile(packagePath, "utf8");
    return JSON.parse(content);
  } catch (error) {
    console.warn("Failed to read package.json:", error);
    return null;
  }
};

/**
 * Detect framework from dependencies as fallback
 */
export const detectFromDependencies = (
  dependencies: Record<string, string> = {}
): FrameworkConfig => {
  const deps = Object.keys(dependencies);

  if (deps.includes("next")) {
    return { framework: "next", envVars: ["NEXT_PUBLIC_API_URL"] };
  }

  if (deps.includes("nuxt") || deps.includes("@nuxt/kit")) {
    return { framework: "nuxt", envVars: ["NUXT_PUBLIC_API_URL"] };
  }

  if (deps.includes("@tanstack/start")) {
    return { framework: "tanstack-start", envVars: ["VITE_API_URL", "API_URL"] };
  }

  if (deps.includes("@tanstack/react-router")) {
    return { framework: "react", router: "tanstack-router", envVars: ["VITE_API_URL"] };
  }

  if (deps.includes("react-router") || deps.includes("@remix-run/react-router")) {
    return { framework: "react", router: "react-router", envVars: ["VITE_API_URL"] };
  }

  if (deps.includes("@remix-run/node") || deps.includes("@remix-run/react")) {
    return { framework: "remix", envVars: ["VITE_API_URL"] };
  }

  if (deps.includes("astro")) {
    return { framework: "astro", envVars: ["PUBLIC_API_URL"] };
  }

  if (deps.includes("@angular/core")) {
    return { framework: "angular", envVars: ["NG_APP_API_URL"], specialHandling: "angular" };
  }

  if (deps.includes("vue")) {
    return { framework: "vue", envVars: ["VITE_API_URL"] };
  }

  if (deps.includes("svelte")) {
    return { framework: "svelte", envVars: ["VITE_API_URL"] };
  }

  if (deps.includes("solid-js")) {
    return { framework: "solid", envVars: ["VITE_API_URL"] };
  }

  if (deps.includes("react")) {
    return { framework: "react", envVars: ["VITE_API_URL"] };
  }

  if (deps.includes("vite")) {
    return { framework: "vite", envVars: ["VITE_API_URL"] };
  }

  return { framework: "unknown", envVars: ["VITE_API_URL"] };
};

/**
 * Get environment variables for a specific framework and router combination
 */
export const getEnvVarsForFramework = (framework: string, router?: string): string[] => {
  if (framework === "react") {
    switch (router) {
      case "tanstack-router":
        return ["VITE_API_URL"];
      case "tanstack-start":
        return ["VITE_API_URL", "API_URL"];
      case "react-router":
        return ["VITE_API_URL"];
      default:
        return ["VITE_API_URL"];
    }
  }

  return FRAMEWORK_ENV_MAPPING[framework] || ["VITE_API_URL"];
};

/**
 * Detect framework and environment pattern
 */
export const detectFrameworkAndEnvPattern = async (
  projectPath: string
): Promise<FrameworkConfig> => {
  const precastConfig = await readPrecastConfig(projectPath);
  if (precastConfig?.framework) {
    const envVars = getEnvVarsForFramework(precastConfig.framework, precastConfig.router);
    return {
      framework: precastConfig.framework,
      router: precastConfig.router,
      envVars,
      specialHandling: precastConfig.framework === "angular" ? "angular" : undefined,
    };
  }

  const packageJson = await readPackageJson(projectPath);
  return detectFromDependencies(packageJson?.dependencies);
};

/**
 * Detect project environment structure
 */
export const detectEnvironmentStructure = async (
  projectPath: string
): Promise<ProjectStructure> => {
  const structure: ProjectStructure = {
    isMonorepo: false,
    envFiles: [],
    framework: { framework: "unknown", envVars: ["VITE_API_URL"] },
    frontendPath: ".",
  };

  const possibleEnvPaths = [
    // Frontend env files
    "apps/web/.env",
    "apps/frontend/.env",
    "packages/web/.env",
    "packages/frontend/.env",
    // Backend env files
    "apps/api/.env",
    "apps/backend/.env",
    "apps/server/.env",
    "packages/api/.env",
    "packages/backend/.env",
    "packages/server/.env",
    // Root env files
    ".env",
    ".env.local",
    ".env.development",
  ];

  for (const envPath of possibleEnvPaths) {
    const fullPath = path.join(projectPath, envPath);
    if (await fs.pathExists(fullPath)) {
      let type: "frontend" | "backend" | "root" = "root";

      // Determine the type based on path
      if (envPath.includes("apps/") || envPath.includes("packages/")) {
        if (
          envPath.includes("/api/") ||
          envPath.includes("/backend/") ||
          envPath.includes("/server/")
        ) {
          type = "backend";
        } else if (envPath.includes("/web/") || envPath.includes("/frontend/")) {
          type = "frontend";
        }
      }

      structure.envFiles.push({
        path: envPath,
        fullPath,
        type,
      });

      if (type === "frontend") {
        structure.isMonorepo = true;
        structure.frontendPath = envPath.replace("/.env", "");
      }
    }
  }

  const frontendFullPath = path.join(projectPath, structure.frontendPath);
  structure.framework = await detectFrameworkAndEnvPattern(frontendFullPath);

  return structure;
};

import type { ProjectConfig } from "../../../shared/stack-config.js";
import { generateAuthTemplate } from "../generators/auth-generator.js";

// Re-export auth providers configuration for backward compatibility
const authProviders: Record<string, any> = {
  "auth.js": {
    id: "auth.js",
    name: "Auth.js (NextAuth.js v5)",
    requiresDatabase: true,
    supportedFrameworks: ["next", "react", "remix", "solid", "svelte"],
  },
  "better-auth": {
    id: "better-auth",
    name: "Better Auth",
    requiresDatabase: true,
    supportedFrameworks: ["next", "react", "vue", "nuxt", "remix", "solid", "svelte", "astro"],
  },
  clerk: {
    id: "clerk",
    name: "Clerk",
    requiresDatabase: false,
    supportedFrameworks: ["next", "react", "remix"],
  },
  auth0: {
    id: "auth0",
    name: "Auth0",
    requiresDatabase: false,
    supportedFrameworks: ["next", "react", "vue", "angular", "express"],
  },
  "passport.js": {
    id: "passport.js",
    name: "Passport.js",
    requiresDatabase: true,
    supportedFrameworks: ["express", "node", "fastify"],
  },
  "supabase-auth": {
    id: "supabase-auth",
    name: "Supabase Auth",
    requiresDatabase: false,
    supportedFrameworks: ["next", "react", "vue", "nuxt", "remix", "solid", "svelte"],
  },
  "firebase-auth": {
    id: "firebase-auth",
    name: "Firebase Auth",
    requiresDatabase: false,
    supportedFrameworks: ["next", "react", "vue", "angular", "nuxt", "remix"],
  },
};

/**
 * Setup authentication for the project using the template-based generator
 * @param config - Project configuration
 * @param authProviderId - ID of the authentication provider to setup
 */
export async function setupAuthentication(
  config: ProjectConfig,
  authProviderId: string
): Promise<void> {
  // Delegate to the new template-based auth generator
  await generateAuthTemplate({
    ...config,
    authProvider: authProviderId,
  });
}

/**
 * Get filtered auth options based on project configuration
 * @param config - Project configuration
 * @returns Filtered auth provider options
 */
export function getFilteredAuthOptions(config: {
  framework: string;
  backend: string;
  database: string;
  orm?: string;
}) {
  // No auth if no backend
  if (!config.backend || config.backend === "none") {
    return [];
  }

  // No auth if no database
  if (!config.database || config.database === "none") {
    return [];
  }

  return Object.entries(authProviders)
    .filter(([_id, provider]) => {
      // Check framework compatibility
      if (!provider.supportedFrameworks.includes(config.framework)) {
        return false;
      }

      // Check database requirement
      if (provider.requiresDatabase && (!config.database || config.database === "none")) {
        return false;
      }

      return true;
    })
    .map(([id, provider]) => ({
      value: id,
      label: provider.name,
      hint: provider.requiresDatabase ? "Requires database" : "No database required",
    }));
}

/**
 * Check if an auth provider is compatible with the project stack
 * @param authProviderId - Auth provider ID
 * @param config - Project configuration
 * @returns True if compatible, false otherwise
 */
export function isAuthProviderCompatibleWithStack(
  authProviderId: string,
  config: {
    framework: string;
    backend: string;
    database: string;
  }
): boolean {
  const provider = authProviders[authProviderId];
  if (!provider) return false;

  // Check basic framework compatibility
  if (!provider.supportedFrameworks.includes(config.framework)) {
    return false;
  }

  // Check backend requirement
  if (!config.backend || config.backend === "none") {
    return false; // No auth without backend for security
  }

  // Check database requirement
  if (provider.requiresDatabase && (!config.database || config.database === "none")) {
    return false;
  }

  return true;
}

// Export for backward compatibility
export { setupAuthentication as default };

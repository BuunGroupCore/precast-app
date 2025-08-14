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
    disabled: true,
  },
  auth0: {
    id: "auth0",
    name: "Auth0",
    requiresDatabase: false,
    supportedFrameworks: ["next", "react", "vue", "angular", "express"],
    disabled: true,
  },
  "passport.js": {
    id: "passport.js",
    name: "Passport.js",
    requiresDatabase: true,
    supportedFrameworks: ["express", "node", "fastify"],
    disabled: true,
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
  if (!config.backend || config.backend === "none") {
    return [];
  }

  if (!config.database || config.database === "none") {
    return [];
  }

  return Object.entries(authProviders)
    .filter(([_id, provider]) => {
      if (provider.disabled) {
        return false;
      }

      if (!provider.supportedFrameworks.includes(config.framework)) {
        return false;
      }

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

  if (!provider.supportedFrameworks.includes(config.framework)) {
    return false;
  }

  if (!config.backend || config.backend === "none") {
    return false;
  }

  if (provider.requiresDatabase && (!config.database || config.database === "none")) {
    return false;
  }

  return true;
}

// Export for backward compatibility
export { setupAuthentication as default };

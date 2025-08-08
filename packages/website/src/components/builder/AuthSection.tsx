import { motion } from "framer-motion";
import React from "react";
import { FaUserShield } from "react-icons/fa";

import { authProviders } from "@/lib/stack-config";

import { CollapsibleSection } from "./CollapsibleSection";
import type { ExtendedProjectConfig } from "./types";

interface AuthSectionProps {
  config: ExtendedProjectConfig;
  setConfig: React.Dispatch<React.SetStateAction<ExtendedProjectConfig>>;
}

/**
 * Authentication providers selection with dependency validation.
 */
export const AuthSection: React.FC<AuthSectionProps> = ({ config, setConfig }) => {
  const availableAuthProviders = authProviders.filter((auth) => {
    // Special handling for Cloudflare Workers
    if (config.backend === "cloudflare-workers") {
      // Better Auth has known compatibility issues with Workers
      if (auth.id === "better-auth") return false;

      // Passport.js doesn't work well with edge runtime
      if (auth.id === "passport") return false;
    }

    // Check if auth provider requires a database (self-hosted auth solutions)
    const requiresDatabase = ["auth.js", "better-auth", "passport", "lucia"].includes(auth.id);
    if (requiresDatabase && (!config.database || config.database === "none")) {
      return false;
    }

    if (auth.dependencies?.includes("react")) {
      // When using Vite, check the UI framework instead of the build tool
      const frameworkToCheck =
        config.framework === "vite" && config.uiFramework ? config.uiFramework : config.framework;

      if (!["react", "next", "remix"].includes(frameworkToCheck)) {
        return false;
      }
    }
    if (
      auth.dependencies?.includes("node") &&
      !["node", "express", "fastify", "hono"].includes(config.backend || "")
    ) {
      return false;
    }
    if (auth.dependencies?.includes("supabase") && config.database !== "supabase") {
      return false;
    }
    if (auth.dependencies?.includes("firebase") && config.database !== "firebase") {
      return false;
    }
    return true;
  });

  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.5 }}
    >
      <CollapsibleSection
        icon={<FaUserShield className="text-3xl" />}
        title={<h3 className="font-display text-2xl">AUTHENTICATION</h3>}
        className="bg-comic-purple text-comic-white"
      >
        <p className="font-comic text-sm mb-4 text-comic-white/90">
          Secure your app - add user authentication with popular auth providers
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {availableAuthProviders.map((auth) => {
            const isRecommended =
              auth.recommendedFor &&
              (auth.recommendedFor.frameworks?.includes(config.framework) ||
                auth.recommendedFor.backends?.includes(config.backend || ""));

            // Special recommendations for Cloudflare Workers
            const isWorkersRecommended =
              config.backend === "cloudflare-workers" &&
              config.database === "cloudflare-d1" &&
              ["auth.js", "lucia", "clerk"].includes(auth.id);

            const isWorkersManaged =
              config.backend === "cloudflare-workers" && ["clerk", "auth0"].includes(auth.id);

            // Warnings for Workers
            const hasWorkersWarning =
              config.backend === "cloudflare-workers" && auth.id === "lucia"; // Needs Rust worker for password hashing

            return (
              <button
                key={auth.id}
                onClick={() => setConfig({ ...config, auth: auth.id })}
                data-active={config.auth === auth.id}
                className={`filter-btn-comic flex flex-col items-center justify-center gap-2 py-3 h-20 w-full relative ${
                  isWorkersRecommended ? "ring-2 ring-comic-yellow ring-offset-1" : ""
                }`}
                title={
                  hasWorkersWarning
                    ? `${auth.description} (Requires Rust worker for password hashing on Workers)`
                    : auth.description
                }
              >
                {/* Badges */}
                <div className="absolute -top-2 -right-2 flex gap-2">
                  {auth.beta && (
                    <span className="bg-comic-purple text-comic-white text-[10px] font-comic font-bold px-2 py-0.5 rounded-full border-2 border-comic-black">
                      BETA
                    </span>
                  )}
                  {(isRecommended || isWorkersRecommended) && (
                    <span className="bg-comic-green text-comic-white text-[10px] font-comic font-bold px-2 py-0.5 rounded-full border-2 border-comic-black">
                      RECOMMENDED
                    </span>
                  )}
                  {isWorkersManaged && !isWorkersRecommended && (
                    <span className="bg-comic-blue text-comic-white text-[10px] font-comic font-bold px-2 py-0.5 rounded-full border-2 border-comic-black">
                      NO DB NEEDED
                    </span>
                  )}
                  {hasWorkersWarning && (
                    <span className="bg-comic-orange text-comic-white text-[10px] font-comic font-bold px-2 py-0.5 rounded-full border-2 border-comic-black">
                      ⚠️
                    </span>
                  )}
                </div>

                {auth.icon && <auth.icon className="text-2xl" />}
                <span className="text-xs text-center">{auth.name}</span>
              </button>
            );
          })}
        </div>
      </CollapsibleSection>
    </motion.div>
  );
};

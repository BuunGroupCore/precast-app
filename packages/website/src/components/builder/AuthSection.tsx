import { motion } from "framer-motion";
import React from "react";
import { FaUserShield } from "react-icons/fa";

import { authProviders } from "../../lib/stack-config";

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
    if (
      auth.dependencies?.includes("react") &&
      !["react", "next", "remix"].includes(config.framework)
    ) {
      return false;
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

            return (
              <button
                key={auth.id}
                onClick={() => setConfig({ ...config, auth: auth.id })}
                data-active={config.auth === auth.id}
                className="filter-btn-comic flex flex-col items-center justify-center gap-2 py-3 h-20 w-full relative"
                title={auth.description}
              >
                {/* Badges */}
                <div className="absolute -top-2 -right-2 flex gap-2">
                  {auth.beta && (
                    <span className="bg-comic-purple text-comic-white text-[10px] font-comic font-bold px-2 py-0.5 rounded-full border-2 border-comic-black">
                      BETA
                    </span>
                  )}
                  {isRecommended && (
                    <span className="bg-comic-green text-comic-white text-[10px] font-comic font-bold px-2 py-0.5 rounded-full border-2 border-comic-black">
                      RECOMMENDED
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

import { motion, AnimatePresence } from "framer-motion";
import React, { useState, useEffect } from "react";
import { FaPlug, FaChevronDown, FaChevronUp, FaTimes } from "react-icons/fa";
import { SiTrpc, SiGraphql, SiAxios, SiApollographql, SiReactquery } from "react-icons/si";

import { HonoIconBlack } from "@/components/icons/HonoIconBlack";
import { backends } from "@/lib/stack-config";

import type { ExtendedProjectConfig } from "./types";

interface ApiSectionProps {
  config: ExtendedProjectConfig;
  setConfig: React.Dispatch<React.SetStateAction<ExtendedProjectConfig>>;
}

interface ApiOption {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  compatibleBackends: string[];
  compatibleFrameworks?: string[];
  dependencies?: string[];
}

const apiOptions: ApiOption[] = [
  {
    id: "hono-rpc",
    name: "Hono RPC",
    description: "Type-safe RPC client for Hono (recommended for Workers)",
    icon: HonoIconBlack,
    compatibleBackends: ["hono", "cloudflare-workers"],
    compatibleFrameworks: ["react", "next", "vue", "svelte", "solid"],
    dependencies: ["typescript"],
  },
  {
    id: "trpc",
    name: "tRPC",
    description: "End-to-end typesafe APIs made easy",
    icon: SiTrpc,
    compatibleBackends: ["hono", "express", "fastify", "cloudflare-workers"],
    compatibleFrameworks: ["react", "next", "vue", "svelte", "solid"],
    dependencies: ["typescript"],
  },
  {
    id: "apollo-client",
    name: "Apollo Client",
    description: "Industry standard GraphQL client with caching",
    icon: SiApollographql,
    compatibleBackends: ["hono", "express", "fastify", "nest"],
    compatibleFrameworks: ["react", "vue", "angular", "svelte"],
    dependencies: ["graphql"],
  },
  {
    id: "tanstack-query",
    name: "TanStack Query",
    description: "Powerful data fetching & caching for modern apps",
    icon: SiReactquery,
    compatibleBackends: ["*"],
    compatibleFrameworks: ["react", "vue", "solid", "svelte", "angular"],
  },
  {
    id: "swr",
    name: "SWR",
    description: "Data fetching with focus on simplicity (by Vercel)",
    icon: SiGraphql,
    compatibleBackends: ["*"],
    compatibleFrameworks: ["react", "next"],
  },
  {
    id: "axios",
    name: "Axios",
    description: "Promise-based HTTP client for REST APIs",
    icon: SiAxios,
    compatibleBackends: ["*"],
    compatibleFrameworks: ["*"],
  },
];

/**
 * API client selection component that appears when a backend is configured
 */
export const ApiSection: React.FC<ApiSectionProps> = ({ config, setConfig }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  /**
   * Initialize with "none" if not set
   */
  useEffect(() => {
    if (!config.apiClient && config.backend && config.backend !== "none") {
      setConfig((prev) => ({ ...prev, apiClient: "none" }));
    }
  }, [config.apiClient, config.backend, setConfig]);

  if (!config.backend || config.backend === "none") {
    return null;
  }

  const compatibleOptions = apiOptions.filter((option) => {
    const selectedBackend = backends.find((b) => b.id === config.backend);

    if (selectedBackend?.apiClientCompatibility) {
      const {
        recommended = [],
        compatible = [],
        incompatible = [],
      } = selectedBackend.apiClientCompatibility;

      if (incompatible.includes(option.id)) {
        return false;
      }

      if (recommended.includes(option.id) || compatible.includes(option.id)) {
        return true;
      }

      if (incompatible.length > 0 || recommended.length > 0 || compatible.length > 0) {
        return false;
      }
    }

    const backendMatch =
      option.compatibleBackends.includes("*") || option.compatibleBackends.includes(config.backend);
    const frameworkToCheck =
      config.framework === "vite" && config.uiFramework ? config.uiFramework : config.framework;

    const frameworkMatch =
      !option.compatibleFrameworks ||
      option.compatibleFrameworks.includes("*") ||
      option.compatibleFrameworks.includes(frameworkToCheck);
    return backendMatch && frameworkMatch;
  });

  const handleApiSelection = (apiId: string) => {
    setConfig({ ...config, apiClient: apiId });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.5 }}
      className="comic-card relative overflow-hidden"
    >
      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 w-0.5 h-8 bg-comic-darkBlue" />
      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-comic-darkBlue rounded-full" />
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <FaPlug className="text-3xl text-comic-darkBlue" />
          <h3 className="font-display text-2xl text-comic-darkBlue">API COMMUNICATION</h3>
        </div>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-full hover:bg-comic-gray/20 transition-colors"
          aria-label={isCollapsed ? "Expand" : "Collapse"}
        >
          {isCollapsed ? (
            <FaChevronDown className="text-xl" />
          ) : (
            <FaChevronUp className="text-xl" />
          )}
        </button>
      </div>
      <div className="border-t-3 border-comic-gray mb-3"></div>

      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <p className="font-comic text-sm mb-4 text-comic-gray">
              Choose how your frontend will communicate with the {config.backend} backend
            </p>

            <button
              onClick={() => handleApiSelection("none")}
              className={`w-full p-3 mb-3 border-3 border-comic-black rounded-lg transition-all duration-200 transform hover:scale-105 h-[80px] flex flex-col items-center justify-center ${
                !config.apiClient || config.apiClient === "none"
                  ? "bg-comic-yellow text-comic-black"
                  : "bg-comic-white text-comic-black hover:bg-comic-gray/10"
              }`}
              style={{ boxShadow: "2px 2px 0 var(--comic-black)" }}
            >
              <div className="flex items-center gap-2 mb-1">
                <FaTimes className="text-lg" />
                <span className="font-display text-sm">None</span>
              </div>
              <p className="font-comic text-xs text-center">
                Use native fetch API or manual implementation
              </p>
            </button>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {compatibleOptions.map((option) => {
                const Icon = option.icon;
                const isSelected = config.apiClient === option.id;
                const hasRequiredDependencies =
                  !option.dependencies ||
                  option.dependencies.every((dep) => {
                    if (dep === "typescript") return config.typescript;
                    if (dep === "graphql") return true;
                    return true;
                  });

                const selectedBackend = backends.find((b) => b.id === config.backend);
                const isRecommended =
                  selectedBackend?.apiClientCompatibility?.recommended?.includes(option.id) ||
                  false;
                const isCompatible =
                  selectedBackend?.apiClientCompatibility?.compatible?.includes(option.id) || false;

                const hasCompatibilityWarning = isCompatible && !isRecommended;

                return (
                  <button
                    key={option.id}
                    onClick={() => hasRequiredDependencies && handleApiSelection(option.id)}
                    disabled={!hasRequiredDependencies}
                    className={`p-3 border-3 border-comic-black rounded-lg transition-all duration-200 transform hover:scale-105 h-[80px] flex flex-col relative ${
                      !hasRequiredDependencies ? "opacity-50 cursor-not-allowed" : ""
                    } ${
                      isSelected
                        ? "bg-comic-yellow text-comic-black"
                        : isRecommended
                          ? "bg-comic-green/20 text-comic-black hover:bg-comic-green/30"
                          : hasCompatibilityWarning
                            ? "bg-comic-orange/10 text-comic-black hover:bg-comic-orange/20"
                            : hasRequiredDependencies
                              ? "bg-comic-white text-comic-black hover:bg-comic-gray/10"
                              : "bg-comic-gray/20 text-comic-gray"
                    }`}
                    style={{
                      boxShadow: hasRequiredDependencies
                        ? "2px 2px 0 var(--comic-black)"
                        : "1px 1px 0 var(--comic-gray)",
                    }}
                    title={
                      !hasRequiredDependencies
                        ? `Requires: ${option.dependencies?.join(", ")}`
                        : hasCompatibilityWarning
                          ? `${option.description} (May have edge runtime compatibility issues)`
                          : option.description
                    }
                  >
                    {isRecommended && (
                      <span className="absolute -top-2 -right-2 bg-comic-green text-comic-white text-[10px] font-comic font-bold px-2 py-0.5 rounded-full border-2 border-comic-black">
                        RECOMMENDED
                      </span>
                    )}
                    {hasCompatibilityWarning && (
                      <span className="absolute -top-2 -right-2 bg-comic-orange text-comic-white text-[10px] font-comic font-bold px-2 py-0.5 rounded-full border-2 border-comic-black">
                        ⚠️ WORKS
                      </span>
                    )}
                    <div className="flex items-center gap-2 mb-1">
                      <Icon className="text-lg" />
                      <span className="font-display text-sm">{option.name}</span>
                    </div>
                    <p className="font-comic text-xs text-left line-clamp-2">
                      {hasRequiredDependencies
                        ? option.description
                        : `Requires ${option.dependencies?.join(", ")}`}
                    </p>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

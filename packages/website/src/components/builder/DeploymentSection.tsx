import { motion } from "framer-motion";
import React, { useState, useMemo, useEffect } from "react";
import { FaRocket, FaServer, FaHtml5, FaLightbulb, FaGlobe, FaCloud } from "react-icons/fa";

import { CollapsibleSection } from "./CollapsibleSection";
import { deploymentMethods } from "./constants";
import { PublicIcon } from "./PublicIcon";
import type { ExtendedProjectConfig } from "./types";

interface DeploymentSectionProps {
  config: ExtendedProjectConfig;
  setConfig: React.Dispatch<React.SetStateAction<ExtendedProjectConfig>>;
}

export const DeploymentSection: React.FC<DeploymentSectionProps> = ({ config, setConfig }) => {
  const [isStatic, setIsStatic] = useState(true);

  // Determine if the app is likely static based on configuration
  const isLikelyStatic = useMemo(() => {
    // If no backend or only serverless/edge backends, likely static
    if (!config.backend || config.backend === "none") return true;
    if (config.backend === "cloudflare-workers") return true; // Can deploy to Pages
    // Traditional backends are likely dynamic
    if (["express", "fastify", "hono", "nestjs"].includes(config.backend)) return false;
    // Next.js, Nuxt, etc. can be either
    return true;
  }, [config.backend]);

  // Filter deployment methods based on static/dynamic toggle and framework
  const filteredMethods = useMemo(() => {
    return deploymentMethods.filter((method) => {
      // Filter out disabled methods
      if (method.disabled) {
        return false;
      }

      // Show Vercel only for Next.js
      if (method.frameworkOnly && config.framework !== method.frameworkOnly) {
        return false;
      }

      if (isStatic) {
        // For static, show: None, Cloudflare, Azure, GitHub Pages, Vercel (if Next.js)
        return ["none", "cloudflare-pages", "azure-static", "github-pages", "vercel"].includes(
          method.id
        );
      } else {
        // For dynamic, show: None, Cloudflare, AWS Amplify, Vercel (if Next.js)
        return ["none", "cloudflare-pages", "aws-amplify", "vercel"].includes(method.id);
      }
    });
  }, [isStatic, config.framework]);

  // Auto-adjust toggle based on backend selection
  useEffect(() => {
    setIsStatic(isLikelyStatic);
  }, [isLikelyStatic]);

  // Auto-adjust deployment selection when backend/framework changes
  useEffect(() => {
    // If current deployment is incompatible with new selection, reset it
    if (config.deploymentMethod && config.deploymentMethod !== "none") {
      const currentDeployment = deploymentMethods.find((d) => d.id === config.deploymentMethod);

      // Check if current deployment supports the app type
      if (currentDeployment) {
        const needsDynamic = ["express", "fastify", "hono", "nestjs"].includes(config.backend);

        // If app needs dynamic but deployment doesn't support it
        if (needsDynamic && !currentDeployment.supportsDynamic) {
          // Auto-select AWS Amplify for dynamic apps
          setConfig((prev) => ({ ...prev, deploymentMethod: "aws-amplify" }));
        }
        // If app is static but deployment doesn't support static
        else if (!needsDynamic && !currentDeployment.supportsStatic) {
          // Auto-select GitHub Pages for static apps
          setConfig((prev) => ({ ...prev, deploymentMethod: "github-pages" }));
        }

        // Special case: Vercel for Next.js
        if (config.framework === "next" && !config.deploymentMethod) {
          setConfig((prev) => ({ ...prev, deploymentMethod: "vercel" }));
        }
      }
    }
  }, [config.backend, config.framework, config.deploymentMethod, setConfig]);

  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.8 }}
    >
      <CollapsibleSection
        icon={<FaRocket className="text-3xl text-comic-red" />}
        title={<h3 className="font-display text-2xl">DEPLOYMENT</h3>}
      >
        <p className="font-comic text-sm mb-4 text-comic-gray">
          Launch your app to the world - choose your deployment platform
        </p>

        {/* Static/Dynamic Toggle */}
        <div className="mb-4 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 p-3 bg-comic-gray/10 rounded-lg border-2 border-comic-gray">
          <button
            onClick={() => setIsStatic(true)}
            className={`flex items-center justify-center gap-2 px-3 sm:px-4 py-2 rounded-lg font-comic text-xs sm:text-sm transition-all w-full sm:w-auto ${
              isStatic
                ? "bg-comic-yellow text-comic-black border-2 border-comic-black"
                : "bg-comic-white text-comic-gray border-2 border-comic-gray hover:border-comic-black"
            }`}
          >
            <FaHtml5 className="text-base sm:text-lg" />
            <span>Static Sites</span>
          </button>

          <span className="font-display text-comic-gray hidden sm:inline">OR</span>

          <button
            onClick={() => setIsStatic(false)}
            className={`flex items-center justify-center gap-2 px-3 sm:px-4 py-2 rounded-lg font-comic text-xs sm:text-sm transition-all w-full sm:w-auto ${
              !isStatic
                ? "bg-comic-blue text-comic-white border-2 border-comic-black"
                : "bg-comic-white text-comic-gray border-2 border-comic-gray hover:border-comic-black"
            }`}
          >
            <FaServer className="text-base sm:text-lg" />
            <span>Full-Stack Apps</span>
          </button>
        </div>

        {/* Deployment platform grid */}
        <div className="grid grid-cols-2 gap-3">
          {filteredMethods.map((deploy) => (
            <button
              key={deploy.id}
              onClick={() => setConfig({ ...config, deploymentMethod: deploy.id })}
              data-active={config.deploymentMethod === deploy.id}
              className={`filter-btn-comic flex flex-col items-center justify-center gap-2 py-3 min-h-[80px] relative overflow-hidden ${
                config.deploymentMethod === deploy.id
                  ? "bg-comic-yellow text-comic-black"
                  : "bg-comic-white text-comic-black hover:bg-comic-yellow"
              }`}
            >
              {/* Badge for platform type - positioned inside to prevent overflow */}
              {deploy.id !== "none" && (
                <div className="absolute top-1 right-1">
                  {deploy.supportsStatic && deploy.supportsDynamic && (
                    <span className="bg-comic-purple text-comic-white text-[9px] font-comic font-bold px-1.5 py-0.5 rounded-full border border-comic-black">
                      BOTH
                    </span>
                  )}
                  {deploy.supportsStatic && !deploy.supportsDynamic && (
                    <span className="bg-comic-green text-comic-white text-[9px] font-comic font-bold px-1.5 py-0.5 rounded-full border border-comic-black">
                      STATIC
                    </span>
                  )}
                  {!deploy.supportsStatic && deploy.supportsDynamic && (
                    <span className="bg-comic-blue text-comic-white text-[9px] font-comic font-bold px-1.5 py-0.5 rounded-full border border-comic-black">
                      DYNAMIC
                    </span>
                  )}
                </div>
              )}

              {deploy.icon &&
                (typeof deploy.icon === "string" ? (
                  <PublicIcon name={deploy.icon} className={`text-2xl ${deploy.color}`} />
                ) : (
                  <deploy.icon className={`text-2xl ${deploy.color}`} />
                ))}
              <span className="text-xs text-center">{deploy.name}</span>
            </button>
          ))}
        </div>

        {config.deploymentMethod && config.deploymentMethod !== "none" && (
          <div className="mt-3 p-3 bg-comic-purple/10 rounded-lg border border-comic-purple/20">
            <p className="text-xs font-comic text-comic-purple flex items-start gap-2">
              <FaLightbulb className="text-sm flex-shrink-0 mt-0.5" />
              <span>
                {deploymentMethods.find((d) => d.id === config.deploymentMethod)?.description}
              </span>
            </p>
          </div>
        )}

        {/* Info message based on toggle */}
        <div className="mt-3 text-xs font-comic text-comic-gray">
          {isStatic ? (
            <p className="flex items-center gap-2">
              <FaGlobe className="text-sm" />
              <span>Showing platforms optimized for static sites and SPAs</span>
            </p>
          ) : (
            <p className="flex items-center gap-2">
              <FaCloud className="text-sm" />
              <span>Showing platforms that support server-side rendering and APIs</span>
            </p>
          )}
        </div>
      </CollapsibleSection>
    </motion.div>
  );
};

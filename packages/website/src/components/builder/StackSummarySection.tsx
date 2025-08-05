import { motion } from "framer-motion";
import React from "react";
import { FaDocker, FaGitAlt, FaPaintBrush } from "react-icons/fa";
import { SiTypescript } from "react-icons/si";

import { powerUps } from "../../lib/powerups-config";
import {
  backends,
  databases,
  frameworks,
  orms,
  stylings,
  authProviders,
  runtimes,
} from "../../lib/stack-config";

import { aiAssistants, deploymentMethods, uiLibraries } from "./constants";
import { PublicIcon } from "./PublicIcon";
import type { ExtendedProjectConfig } from "./types";

interface StackSummarySectionProps {
  config: ExtendedProjectConfig;
}

export const StackSummarySection: React.FC<StackSummarySectionProps> = ({ config }) => {
  const getIcon = (type: string, id: string) => {
    switch (type) {
      case "framework":
        return frameworks.find((f) => f.id === id);
      case "backend":
        return backends.find((b) => b.id === id);
      case "database":
        return databases.find((d) => d.id === id);
      case "orm":
        return orms.find((o) => o.id === id);
      case "styling":
        return stylings.find((s) => s.id === id);
      case "runtime":
        return runtimes.find((r) => r.id === id);
      default:
        return null;
    }
  };

  const renderStackItem = (type: string, id: string, label?: string) => {
    const item = getIcon(type, id);
    if (!item || id === "none") return null;

    const Icon = item.icon;
    const displayName = label || item.name;

    // Category labels
    const categoryLabels: { [key: string]: string } = {
      framework: "Frontend",
      backend: "Backend",
      database: "Database",
      orm: "ORM",
      styling: "Styling",
      runtime: "Runtime",
    };

    // Don't use ServiceTooltip to avoid layout issues
    return (
      <div
        key={`${type}-${id}`}
        className="comic-panel p-2 bg-comic-white/10 hover:bg-comic-white/20 transition-colors cursor-pointer flex flex-col items-center gap-1 relative"
        title={item.description || displayName}
      >
        {/* Category label */}
        <span className="absolute -top-1 -right-1 text-[8px] font-comic bg-comic-yellow text-comic-black px-1 rounded-full">
          {categoryLabels[type]}
        </span>
        {Icon && <Icon className="text-2xl text-white" />}
        <span className="text-xs font-comic text-center">{displayName}</span>
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.2 }}
      className="comic-card bg-comic-darkBlue text-comic-white"
    >
      <h3 className="font-display text-2xl mb-4 text-center">YOUR EPIC STACK</h3>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[240px] overflow-y-auto pb-2">
        {/* Framework */}
        {renderStackItem("framework", config.framework)}

        {/* Backend */}
        {config.backend !== "none" && renderStackItem("backend", config.backend)}

        {/* Database */}
        {config.database !== "none" && renderStackItem("database", config.database)}

        {/* ORM */}
        {config.orm !== "none" && config.database !== "none" && renderStackItem("orm", config.orm)}

        {/* Styling */}
        {renderStackItem("styling", config.styling)}

        {/* Runtime */}
        {renderStackItem("runtime", config.runtime || "node")}

        {/* UI Library */}
        {config.uiLibrary &&
          config.uiLibrary !== "none" &&
          (() => {
            const uiLib = uiLibraries.find((lib) => lib.id === config.uiLibrary);
            return (
              <div className="comic-panel p-2 bg-comic-white/10 flex flex-col items-center gap-1 relative">
                <span className="absolute -top-1 -right-1 text-[8px] font-comic bg-comic-yellow text-comic-black px-1 rounded-full">
                  UI Lib
                </span>
                {uiLib?.icon ? (
                  typeof uiLib.icon === "string" ? (
                    <PublicIcon name={uiLib.icon} className="w-5 h-5 brightness-0 invert" />
                  ) : (
                    <uiLib.icon className="text-2xl text-white" />
                  )
                ) : (
                  <FaPaintBrush className="text-2xl text-white" />
                )}
                <span className="text-xs font-comic text-center">
                  {uiLib?.name || config.uiLibrary}
                </span>
              </div>
            );
          })()}

        {/* AI Assistant */}
        {config.aiAssistant &&
          config.aiAssistant !== "none" &&
          (() => {
            const aiAssistant = aiAssistants.find((ai) => ai.id === config.aiAssistant);
            return (
              <div className="comic-panel p-2 bg-comic-white/10 flex flex-col items-center gap-1 relative">
                <span className="absolute -top-1 -right-1 text-[8px] font-comic bg-comic-yellow text-comic-black px-1 rounded-full">
                  AI
                </span>
                {aiAssistant?.icon ? (
                  typeof aiAssistant.icon === "string" ? (
                    <PublicIcon name={aiAssistant.icon} className="w-5 h-5 brightness-0 invert" />
                  ) : (
                    <aiAssistant.icon className="text-2xl text-white" />
                  )
                ) : (
                  <span className="text-2xl">🤖</span>
                )}
                <span className="text-xs font-comic text-center">
                  {aiAssistant?.name || config.aiAssistant}
                </span>
              </div>
            );
          })()}

        {/* Deployment */}
        {config.deploymentMethod &&
          config.deploymentMethod !== "none" &&
          (() => {
            const deployment = deploymentMethods.find((dep) => dep.id === config.deploymentMethod);
            return (
              <div className="comic-panel p-2 bg-comic-white/10 flex flex-col items-center gap-1 relative">
                <span className="absolute -top-1 -right-1 text-[8px] font-comic bg-comic-yellow text-comic-black px-1 rounded-full">
                  Deploy
                </span>
                {deployment?.icon ? (
                  typeof deployment.icon === "string" ? (
                    <PublicIcon name={deployment.icon} className="w-5 h-5 brightness-0 invert" />
                  ) : (
                    <deployment.icon className="text-2xl text-white" />
                  )
                ) : (
                  <span className="text-2xl">🚀</span>
                )}
                <span className="text-xs font-comic text-center">
                  {deployment?.name || config.deploymentMethod}
                </span>
              </div>
            );
          })()}

        {/* Authentication */}
        {config.auth &&
          config.auth !== "none" &&
          (() => {
            const auth = authProviders.find((a) => a.id === config.auth);
            return (
              <div className="comic-panel p-2 bg-comic-white/10 flex flex-col items-center gap-1 relative">
                <span className="absolute -top-1 -right-1 text-[8px] font-comic bg-comic-yellow text-comic-black px-1 rounded-full">
                  Auth
                </span>
                {auth?.icon ? (
                  typeof auth.icon === "string" ? (
                    <PublicIcon name={auth.icon} className="w-5 h-5 brightness-0 invert" />
                  ) : (
                    <auth.icon className="text-2xl text-white" />
                  )
                ) : (
                  <span className="text-2xl">🔐</span>
                )}
                <span className="text-xs font-comic text-center">{auth?.name || config.auth}</span>
              </div>
            );
          })()}
      </div>

      {/* Power-ups */}
      {(config.typescript ||
        config.git ||
        config.docker ||
        (config.powerups && config.powerups.length > 0)) && (
        <div className="mt-4 pt-4 border-t border-comic-white/20">
          <h4 className="font-comic text-sm mb-2 text-comic-yellow text-center">POWER-UPS</h4>
          <div className="flex flex-wrap justify-center gap-3 max-h-20 overflow-y-auto pb-2">
            {config.typescript && (
              <div
                className="comic-panel p-2 bg-comic-white/10 hover:bg-comic-white/20 transition-colors cursor-pointer"
                title="TypeScript"
              >
                <SiTypescript className="text-2xl text-white" />
              </div>
            )}
            {config.git && (
              <div
                className="comic-panel p-2 bg-comic-white/10 hover:bg-comic-white/20 transition-colors cursor-pointer"
                title="Git"
              >
                <FaGitAlt className="text-2xl text-white" />
              </div>
            )}
            {config.docker && (
              <div
                className="comic-panel p-2 bg-comic-white/10 hover:bg-comic-white/20 transition-colors cursor-pointer"
                title="Docker"
              >
                <FaDocker className="text-2xl text-white" />
              </div>
            )}
            {/* Additional Power-ups */}
            {config.powerups?.map((powerupId) => {
              const powerup = powerUps.find((p) => p.id === powerupId);
              if (!powerup) return null;
              const Icon = powerup.icon;
              return (
                <div
                  key={powerupId}
                  className="comic-panel p-2 bg-comic-white/10 hover:bg-comic-white/20 transition-colors cursor-pointer flex flex-col items-center gap-1"
                  title={powerup.description}
                >
                  <Icon className="text-2xl text-white" />
                  <span className="text-xs font-comic text-center">{powerup.name}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </motion.div>
  );
};

import { motion } from "framer-motion";
import React from "react";
import { FaDocker, FaGitAlt, FaPaintBrush } from "react-icons/fa";
import { SiTypescript } from "react-icons/si";

import { backends, databases, frameworks, orms, stylings } from "../../lib/stack-config";

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
      default:
        return null;
    }
  };

  const renderStackItem = (type: string, id: string, label?: string) => {
    const item = getIcon(type, id);
    if (!item || id === "none") return null;

    const Icon = item.icon;
    const displayName = label || item.name;

    // Don't use ServiceTooltip to avoid layout issues
    return (
      <div
        key={`${type}-${id}`}
        className="comic-panel p-2 bg-comic-white/10 hover:bg-comic-white/20 transition-colors cursor-pointer flex flex-col items-center gap-1"
        title={item.description || displayName}
      >
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

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[240px] overflow-y-auto">
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

        {/* UI Library */}
        {config.uiLibrary &&
          config.uiLibrary !== "none" &&
          (() => {
            const uiLib = uiLibraries.find((lib) => lib.id === config.uiLibrary);
            return (
              <div className="comic-panel p-2 bg-comic-white/10 flex flex-col items-center gap-1">
                {uiLib?.icon ? (
                  typeof uiLib.icon === "string" ? (
                    <PublicIcon
                      name={uiLib.icon}
                      className="w-5 h-5"
                      style={{ filter: "brightness(0) invert(1)" }}
                    />
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
              <div className="comic-panel p-2 bg-comic-white/10 flex flex-col items-center gap-1">
                {aiAssistant?.icon ? (
                  typeof aiAssistant.icon === "string" ? (
                    <PublicIcon
                      name={aiAssistant.icon}
                      className="w-5 h-5"
                      style={{ filter: "brightness(0) invert(1)" }}
                    />
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
              <div className="comic-panel p-2 bg-comic-white/10 flex flex-col items-center gap-1">
                {deployment?.icon ? (
                  typeof deployment.icon === "string" ? (
                    <PublicIcon
                      name={deployment.icon}
                      className="w-5 h-5"
                      style={{ filter: "brightness(0) invert(1)" }}
                    />
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
      </div>

      {/* Power-ups */}
      {(config.typescript || config.git || config.docker) && (
        <div className="mt-4 pt-4 border-t border-comic-white/20">
          <h4 className="font-comic text-sm mb-2 text-comic-yellow text-center">POWER-UPS</h4>
          <div className="flex justify-center gap-3">
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
          </div>
        </div>
      )}
    </motion.div>
  );
};

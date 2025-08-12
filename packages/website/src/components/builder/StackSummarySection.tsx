import { motion } from "framer-motion";
import React from "react";
import { FaDocker, FaGitAlt, FaPaintBrush } from "react-icons/fa";
import { SiTypescript } from "react-icons/si";

import { plugins } from "@/lib/plugins-config";
import { powerUps } from "@/lib/powerups-config";
import {
  backends,
  databases,
  frameworks,
  orms,
  stylings,
  authProviders,
  runtimes,
} from "@/lib/stack-config";

import { BuilderIcon } from "./BuilderIcon";
import { aiAssistants, deploymentMethods, uiLibraries } from "./constants";
import { PublicIcon } from "./PublicIcon";
import type { ExtendedProjectConfig } from "./types";

interface StackSummarySectionProps {
  config: ExtendedProjectConfig;
}

export const StackSummarySection: React.FC<StackSummarySectionProps> = ({ config }) => {
  /** Calculate total count of activated powers */
  const totalCount = [
    config.framework !== "vanilla" ? 1 : 0,
    config.backend !== "none" ? 1 : 0,
    config.database !== "none" ? 1 : 0,
    config.orm !== "none" ? 1 : 0,
    config.styling !== "css" ? 1 : 0,
    config.runtime !== "node" ? 1 : 0,
    config.uiLibrary && config.uiLibrary !== "none" ? 1 : 0,
    config.uiFramework ? 1 : 0,
    config.aiAssistant && config.aiAssistant !== "none" ? 1 : 0,
    config.deploymentMethod && config.deploymentMethod !== "none" ? 1 : 0,
    config.auth && config.auth !== "none" ? 1 : 0,
    config.typescript ? 1 : 0,
    config.git ? 1 : 0,
    config.docker ? 1 : 0,
    ...(config.powerups || []).map(() => 1),
    ...(config.plugins || []).map(() => 1),
  ].reduce((acc, val) => acc + val, 0);
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

    /** Category labels */
    const categoryLabels: { [key: string]: string } = {
      framework: "Frontend",
      backend: "Backend",
      database: "Database",
      orm: "ORM",
      styling: "Styling",
      runtime: "Runtime",
    };

    /** Don't use ServiceTooltip to avoid layout issues */
    return (
      <div
        key={`${type}-${id}`}
        className="comic-panel p-2 bg-comic-white/10 hover:bg-comic-white/20 transition-colors cursor-pointer flex flex-row min-[320px]:flex-col items-center justify-start min-[320px]:justify-center gap-2 min-[320px]:gap-1 relative overflow-hidden"
        title={item.description || displayName}
      >
        {/* Category label - positioned inside to prevent overflow */}
        <span className="absolute top-0.5 right-0.5 text-[7px] min-[320px]:text-[8px] font-comic bg-comic-yellow text-comic-black px-1 rounded-full z-10">
          {categoryLabels[type]}
        </span>
        {Icon && (
          <BuilderIcon
            icon={Icon}
            className="text-xl min-[320px]:text-2xl text-white flex-shrink-0"
          />
        )}
        <span className="text-[10px] min-[320px]:text-xs font-comic text-left min-[320px]:text-center truncate min-[320px]:break-normal text-white">
          {displayName}
        </span>
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.2 }}
      className="comic-card bg-comic-darkBlue text-comic-white overflow-hidden"
    >
      {/* Header Section */}
      <div className="relative mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-display text-xl sm:text-2xl">YOUR EPIC STACK</h3>
          {/* Power count badge - moved to inline */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            className="bg-comic-red text-comic-white px-2 sm:px-3 py-1 rounded-full shadow-lg"
          >
            <span className="font-comic font-bold text-[10px] sm:text-xs">
              {totalCount} POWERS!
            </span>
          </motion.div>
        </div>
        {/* Comic Style Separator */}
        <div className="relative flex items-center">
          <div className="w-full border-t-2 border-dashed border-comic-yellow opacity-50"></div>
        </div>
      </div>

      <div className="grid grid-cols-1 min-[320px]:grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 max-h-[300px] sm:max-h-[240px] overflow-y-auto pb-2">
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

        {/* Color Palette */}
        {config.colorPalette && (
          <div className="comic-panel p-2 bg-comic-white/10 hover:bg-comic-white/20 transition-colors cursor-pointer flex flex-row min-[320px]:flex-col items-center justify-start min-[320px]:justify-center gap-2 min-[320px]:gap-1 relative overflow-hidden">
            <span className="absolute top-0.5 right-0.5 text-[7px] min-[320px]:text-[8px] font-comic bg-comic-yellow text-comic-black px-1 rounded-full z-10">
              Colors
            </span>
            <div className="flex gap-0.5">
              {config.colorPalette.preview?.slice(0, 4).map((color, i) => (
                <div
                  key={i}
                  className="w-3 h-3 min-[320px]:w-4 min-[320px]:h-4 rounded-sm border border-white/50"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
            <span className="text-[10px] min-[320px]:text-xs font-comic text-left min-[320px]:text-center truncate min-[320px]:break-normal text-white">
              {config.colorPalette.name}
            </span>
          </div>
        )}

        {/* Runtime */}
        {renderStackItem("runtime", config.runtime || "node")}

        {/* UI Library */}
        {config.uiLibrary &&
          config.uiLibrary !== "none" &&
          (() => {
            const uiLib = uiLibraries.find((lib) => lib.id === config.uiLibrary);
            return (
              <div className="comic-panel p-2 bg-comic-white/10 flex flex-col items-center gap-1 relative overflow-hidden">
                <span className="absolute top-0.5 right-0.5 text-[8px] font-comic bg-comic-yellow text-comic-black px-1 rounded-full">
                  UI Lib
                </span>
                {uiLib?.icon ? (
                  typeof uiLib.icon === "string" ? (
                    <PublicIcon name={uiLib.icon} className="w-5 h-5 brightness-0 invert" />
                  ) : (
                    <BuilderIcon icon={uiLib.icon} className="text-2xl text-white" />
                  )
                ) : (
                  <BuilderIcon icon={FaPaintBrush} className="text-2xl text-white" />
                )}
                <span className="text-xs font-comic text-center text-white">
                  {uiLib?.name || config.uiLibrary}
                </span>
              </div>
            );
          })()}

        {/* UI Framework (for Vite builds) */}
        {config.uiFramework &&
          (() => {
            const uiFramework = frameworks.find((f) => f.id === config.uiFramework);
            return (
              <div className="comic-panel p-2 bg-comic-white/10 flex flex-col items-center gap-1 relative overflow-hidden">
                <span className="absolute top-0.5 right-0.5 text-[8px] font-comic bg-comic-yellow text-comic-black px-1 rounded-full">
                  UI Framework
                </span>
                {uiFramework?.icon && (
                  <BuilderIcon icon={uiFramework.icon} className="text-2xl text-white" />
                )}
                <span className="text-xs font-comic text-center text-white">
                  {uiFramework?.name || config.uiFramework}
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
              <div className="comic-panel p-2 bg-comic-white/10 flex flex-col items-center gap-1 relative overflow-hidden">
                <span className="absolute top-0.5 right-0.5 text-[8px] font-comic bg-comic-yellow text-comic-black px-1 rounded-full">
                  AI
                </span>
                {aiAssistant?.icon ? (
                  typeof aiAssistant.icon === "string" ? (
                    <PublicIcon name={aiAssistant.icon} className="w-5 h-5 brightness-0 invert" />
                  ) : (
                    <BuilderIcon icon={aiAssistant.icon} className="text-2xl text-white" />
                  )
                ) : (
                  <span className="text-2xl">🤖</span>
                )}
                <span className="text-xs font-comic text-center text-white">
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
              <div className="comic-panel p-2 bg-comic-white/10 flex flex-col items-center gap-1 relative overflow-hidden">
                <span className="absolute top-0.5 right-0.5 text-[8px] font-comic bg-comic-yellow text-comic-black px-1 rounded-full">
                  Deploy
                </span>
                {deployment?.icon ? (
                  typeof deployment.icon === "string" ? (
                    <PublicIcon name={deployment.icon} className="w-5 h-5 brightness-0 invert" />
                  ) : (
                    <BuilderIcon icon={deployment.icon} className="text-2xl text-white" />
                  )
                ) : (
                  <span className="text-2xl">🚀</span>
                )}
                <span className="text-xs font-comic text-center text-white">
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
              <div className="comic-panel p-2 bg-comic-white/10 flex flex-col items-center gap-1 relative overflow-hidden">
                <span className="absolute top-0.5 right-0.5 text-[8px] font-comic bg-comic-yellow text-comic-black px-1 rounded-full">
                  Auth
                </span>
                {auth?.icon ? (
                  typeof auth.icon === "string" ? (
                    <PublicIcon name={auth.icon} className="w-5 h-5 brightness-0 invert" />
                  ) : (
                    <BuilderIcon icon={auth.icon} className="text-2xl text-white" />
                  )
                ) : (
                  <span className="text-2xl">🔐</span>
                )}
                <span className="text-xs font-comic text-center text-white">
                  {auth?.name || config.auth}
                </span>
              </div>
            );
          })()}
      </div>

      {/* Plugins */}
      {config.plugins && config.plugins.length > 0 && (
        <div className="mt-4 pt-4 border-t border-comic-white/20">
          <h4 className="font-comic text-sm mb-2 text-comic-purple text-center">
            BUSINESS PLUGINS
          </h4>
          <div className="flex flex-wrap justify-center gap-3 max-h-20 overflow-y-auto pb-2">
            {config.plugins.map((pluginId) => {
              const plugin = plugins.find((p) => p.id === pluginId);
              if (!plugin) return null;
              const Icon = plugin.icon;
              return (
                <div
                  key={pluginId}
                  className="comic-panel p-2 bg-comic-purple/20 hover:bg-comic-purple/30 transition-colors cursor-pointer flex flex-col items-center gap-1"
                  title={plugin.description}
                >
                  <BuilderIcon icon={Icon} className="text-2xl text-white" />
                  <span className="text-xs font-comic text-center text-white">{plugin.name}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Power-ups */}
      {(config.typescript ||
        config.git ||
        config.docker ||
        (config.powerups && config.powerups.length > 0)) && (
        <div className="mt-4 pt-4 border-t border-comic-white/20">
          <h4 className="font-comic text-sm mb-2 text-comic-yellow text-center">POWER-UPS</h4>
          <div className="flex flex-wrap justify-center gap-3 max-h-20 overflow-y-auto pb-2">
            {config.typescript && (
              <div className="comic-panel p-2 bg-comic-white/10 hover:bg-comic-white/20 transition-colors cursor-pointer flex flex-col items-center gap-1">
                <BuilderIcon icon={SiTypescript} className="text-2xl text-white" />
                <span className="text-xs font-comic text-center text-white">TypeScript</span>
              </div>
            )}
            {config.git && (
              <div className="comic-panel p-2 bg-comic-white/10 hover:bg-comic-white/20 transition-colors cursor-pointer flex flex-col items-center gap-1">
                <BuilderIcon icon={FaGitAlt} className="text-2xl text-white" />
                <span className="text-xs font-comic text-center text-white">Git</span>
              </div>
            )}
            {config.docker && (
              <div className="comic-panel p-2 bg-comic-white/10 hover:bg-comic-white/20 transition-colors cursor-pointer flex flex-col items-center gap-1">
                <BuilderIcon icon={FaDocker} className="text-2xl text-white" />
                <span className="text-xs font-comic text-center text-white">Docker</span>
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
                  <BuilderIcon icon={Icon} className="text-2xl text-white" />
                  <span className="text-xs font-comic text-center text-white">{powerup.name}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </motion.div>
  );
};

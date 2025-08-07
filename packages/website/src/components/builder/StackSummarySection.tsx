import { motion } from "framer-motion";
import React, { useState } from "react";
import { FaDocker, FaGitAlt, FaPaintBrush, FaFolderOpen } from "react-icons/fa";
import { SiTypescript } from "react-icons/si";

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

import { aiAssistants, deploymentMethods, uiLibraries } from "./constants";
import { FolderStructureDialog } from "./FolderStructureDialog";
import { PublicIcon } from "./PublicIcon";
import type { ExtendedProjectConfig } from "./types";

interface StackSummarySectionProps {
  config: ExtendedProjectConfig;
}

export const StackSummarySection: React.FC<StackSummarySectionProps> = ({ config }) => {
  const [showFolderStructure, setShowFolderStructure] = useState(false);

  /** Calculate total count of activated powers */
  const totalCount = [
    config.framework !== "vanilla" ? 1 : 0,
    config.backend !== "none" ? 1 : 0,
    config.database !== "none" ? 1 : 0,
    config.orm !== "none" ? 1 : 0,
    config.styling !== "css" ? 1 : 0,
    config.runtime !== "node" ? 1 : 0,
    config.uiLibrary && config.uiLibrary !== "none" ? 1 : 0,
    config.aiAssistant && config.aiAssistant !== "none" ? 1 : 0,
    config.deploymentMethod && config.deploymentMethod !== "none" ? 1 : 0,
    config.auth && config.auth !== "none" ? 1 : 0,
    config.typescript ? 1 : 0,
    config.git ? 1 : 0,
    config.docker ? 1 : 0,
    ...(config.powerups || []).map(() => 1),
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
    <>
      <FolderStructureDialog
        isOpen={showFolderStructure}
        onClose={() => setShowFolderStructure(false)}
        config={config}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="comic-card bg-comic-darkBlue text-comic-white"
      >
        {/* Header Section */}
        <div className="relative mb-6">
          <h3 className="font-display text-2xl text-center mb-3">YOUR EPIC STACK</h3>
          {/* Comic Style Separator with Preview Button */}
          <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t-2 border-dashed border-comic-yellow opacity-50"></div>
            </div>
            <motion.button
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowFolderStructure(true)}
              className="relative bg-comic-yellow text-comic-black px-4 py-2 comic-button transform -rotate-2 hover:rotate-0 transition-all duration-200 shadow-lg"
              title="Preview folder structure"
            >
              <div className="flex items-center gap-2">
                <FaFolderOpen className="text-lg" />
                <span className="font-comic font-bold text-sm">VIEW STRUCTURE</span>
              </div>
              {/* Comic burst effect */}
              <div className="absolute -top-1 -right-1 w-4 h-4">
                <div className="action-burst bg-comic-red w-full h-full"></div>
              </div>
            </motion.button>
          </div>
          {/* Power count badge */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            className="absolute -top-2 -right-2 bg-comic-red text-comic-white px-3 py-1 rounded-full transform rotate-12 shadow-lg"
          >
            <span className="font-comic font-bold text-xs">{totalCount} POWERS!</span>
          </motion.div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[240px] overflow-y-auto pb-2">
          {/* Framework */}
          {renderStackItem("framework", config.framework)}

          {/* Backend */}
          {config.backend !== "none" && renderStackItem("backend", config.backend)}

          {/* Database */}
          {config.database !== "none" && renderStackItem("database", config.database)}

          {/* ORM */}
          {config.orm !== "none" &&
            config.database !== "none" &&
            renderStackItem("orm", config.orm)}

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
              const deployment = deploymentMethods.find(
                (dep) => dep.id === config.deploymentMethod
              );
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
                  <span className="text-xs font-comic text-center">
                    {auth?.name || config.auth}
                  </span>
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
                <div className="comic-panel p-2 bg-comic-white/10 hover:bg-comic-white/20 transition-colors cursor-pointer flex flex-col items-center gap-1">
                  <SiTypescript className="text-2xl text-white" />
                  <span className="text-xs font-comic text-center">TypeScript</span>
                </div>
              )}
              {config.git && (
                <div className="comic-panel p-2 bg-comic-white/10 hover:bg-comic-white/20 transition-colors cursor-pointer flex flex-col items-center gap-1">
                  <FaGitAlt className="text-2xl text-white" />
                  <span className="text-xs font-comic text-center">Git</span>
                </div>
              )}
              {config.docker && (
                <div className="comic-panel p-2 bg-comic-white/10 hover:bg-comic-white/20 transition-colors cursor-pointer flex flex-col items-center gap-1">
                  <FaDocker className="text-2xl text-white" />
                  <span className="text-xs font-comic text-center">Docker</span>
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
    </>
  );
};

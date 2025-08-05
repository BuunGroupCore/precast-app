import { motion } from "framer-motion";
import React, { useState } from "react";
import { FaChevronDown, FaChevronUp, FaLightbulb } from "react-icons/fa";

import { preferredStacks } from "../../lib/preferred-stacks";

import type { ExtendedProjectConfig } from "./types";

interface PresetTemplatesSectionProps {
  config: ExtendedProjectConfig;
  setConfig: React.Dispatch<React.SetStateAction<ExtendedProjectConfig>>;
}

export const PresetTemplatesSection: React.FC<PresetTemplatesSectionProps> = ({
  config,
  setConfig,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const applyPreferredStack = (stackId: string) => {
    const stack = preferredStacks.find((s) => s.id === stackId);
    if (stack) {
      setConfig({
        ...config,
        name: `my-${stackId}-app`,
        framework: stack.config.framework,
        backend: stack.config.backend,
        database: stack.config.database,
        orm: stack.config.orm || "none",
        styling: stack.config.styling || "tailwind",
        runtime: stack.config.runtime || "node",
        auth: stack.config.auth || "none",
        typescript: stack.config.typescript ?? true,
        git: true,
        docker: false,
        aiAssistant: "none",
        uiLibrary: "none",
        autoInstall: true,
        packageManager: "bun",
        deploymentMethod: "none",
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      className="comic-card bg-comic-purple text-comic-white"
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <FaLightbulb className="text-3xl" />
          <h3 className="font-display text-2xl">PREFERRED STACKS</h3>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-2 rounded-full hover:bg-comic-white/20 transition-colors"
          aria-label={isExpanded ? "Collapse" : "Expand"}
        >
          {isExpanded ? <FaChevronUp className="text-xl" /> : <FaChevronDown className="text-xl" />}
        </button>
      </div>
      <div className="border-t-3 border-comic-darkPurple mb-3"></div>
      <p className="font-comic text-sm mb-4 text-comic-white/90">
        Quick start with popular stack combinations - one-click setup for common architectures
      </p>

      {isExpanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-2 sm:grid-cols-3 gap-3"
        >
          {preferredStacks.map((stack) => (
            <button
              key={stack.id}
              onClick={() => applyPreferredStack(stack.id)}
              className="p-3 border-3 border-comic-black rounded-lg bg-comic-white text-comic-black hover:bg-comic-yellow transition-all duration-200 transform hover:scale-105"
              style={{ boxShadow: "2px 2px 0 var(--comic-black)" }}
            >
              <div className="flex items-center gap-2 mb-1">
                {stack.icon && <stack.icon className={`text-lg ${stack.color}`} />}
                <span className="font-display text-sm">{stack.name}</span>
              </div>
              <p className="font-comic text-xs text-left">{stack.description}</p>
            </button>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
};

import { motion } from "framer-motion";
import React from "react";

import { frameworks } from "../../lib/stack-config";

import type { ExtendedProjectConfig } from "./types";

interface FrameworkSectionProps {
  config: ExtendedProjectConfig;
  setConfig: React.Dispatch<React.SetStateAction<ExtendedProjectConfig>>;
}

export const FrameworkSection: React.FC<FrameworkSectionProps> = ({ config, setConfig }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2 }}
      className="comic-card bg-comic-red text-comic-white"
    >
      <h3 className="font-display text-2xl mb-4">CHOOSE FRAMEWORK</h3>
      <div className="grid grid-cols-3 gap-3">
        {frameworks.map((fw) => (
          <button
            key={fw.id}
            onClick={() => setConfig({ ...config, framework: fw.id })}
            data-active={config.framework === fw.id}
            className="filter-btn-comic flex flex-col items-center justify-center gap-2 py-3 h-20 w-full"
          >
            {fw.icon && <fw.icon className="text-2xl" />}
            <span className="text-xs">{fw.name}</span>
          </button>
        ))}
      </div>
    </motion.div>
  );
};

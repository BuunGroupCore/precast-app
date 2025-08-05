import { motion } from "framer-motion";
import React from "react";
import { FaCogs } from "react-icons/fa";

import { runtimes } from "../../lib/stack-config";

import type { ExtendedProjectConfig } from "./types";

interface RuntimeSectionProps {
  config: ExtendedProjectConfig;
  setConfig: React.Dispatch<React.SetStateAction<ExtendedProjectConfig>>;
}

export const RuntimeSection: React.FC<RuntimeSectionProps> = ({ config, setConfig }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.45 }}
      className="comic-card bg-comic-yellow text-comic-black"
    >
      <div className="flex items-center gap-3 mb-2">
        <FaCogs className="text-3xl" />
        <h3 className="font-display text-2xl">RUNTIME</h3>
      </div>
      <div className="border-t-3 border-comic-black mb-3"></div>
      <p className="font-comic text-sm mb-4 text-comic-black/90">
        Choose your JavaScript runtime - from classic Node.js to modern edge runtimes
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {runtimes.map((runtime) => (
          <button
            key={runtime.id}
            onClick={() => setConfig({ ...config, runtime: runtime.id })}
            data-active={config.runtime === runtime.id}
            className="filter-btn-comic flex flex-col items-center justify-center gap-2 py-3 h-20 w-full"
            title={runtime.description}
          >
            {runtime.icon && <runtime.icon className="text-2xl" />}
            <span className="text-xs">{runtime.name}</span>
          </button>
        ))}
      </div>
    </motion.div>
  );
};

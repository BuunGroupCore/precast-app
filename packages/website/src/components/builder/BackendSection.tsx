import { motion } from "framer-motion";
import React from "react";
import { FaServer } from "react-icons/fa";

import { backends } from "../../lib/stack-config";

import type { ExtendedProjectConfig } from "./types";

interface BackendSectionProps {
  config: ExtendedProjectConfig;
  setConfig: React.Dispatch<React.SetStateAction<ExtendedProjectConfig>>;
}

export const BackendSection: React.FC<BackendSectionProps> = ({ config, setConfig }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3 }}
      className="comic-card bg-comic-blue text-comic-white"
    >
      <div className="flex items-center gap-3 mb-2">
        <FaServer className="text-3xl" />
        <h3 className="font-display text-2xl">BACKEND POWER</h3>
      </div>
      <div className="border-t-3 border-comic-darkBlue mb-3"></div>
      <p className="font-comic text-sm mb-4 text-comic-white/90">
        The server-side engine - choose your backend framework or go serverless
      </p>
      <div className="grid grid-cols-3 gap-3">
        {backends.map((be) => (
          <button
            key={be.id}
            onClick={() => setConfig({ ...config, backend: be.id })}
            data-active={config.backend === be.id}
            className="filter-btn-comic flex flex-col items-center justify-center gap-2 py-3 h-20 w-full"
          >
            {be.icon && <be.icon className="text-2xl" />}
            <span className="text-xs">{be.name}</span>
          </button>
        ))}
      </div>
    </motion.div>
  );
};

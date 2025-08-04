import { motion } from "framer-motion";
import React from "react";

import { stylings } from "../../lib/stack-config";

import type { ExtendedProjectConfig } from "./types";

interface StylingSectionProps {
  config: ExtendedProjectConfig;
  setConfig: React.Dispatch<React.SetStateAction<ExtendedProjectConfig>>;
}

export const StylingSection: React.FC<StylingSectionProps> = ({ config, setConfig }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.5 }}
      className="comic-card bg-comic-yellow"
    >
      <h3 className="font-display text-2xl mb-4">STYLING POWERS</h3>
      <div className="grid grid-cols-3 gap-3">
        {stylings.map((style) => (
          <button
            key={style.id}
            onClick={() => setConfig({ ...config, styling: style.id })}
            data-active={config.styling === style.id}
            className="filter-btn-comic flex flex-col items-center justify-center gap-2 py-3 h-20"
          >
            {style.icon && <style.icon className="text-xl" />}
            <span className="text-xs">{style.name}</span>
          </button>
        ))}
      </div>
    </motion.div>
  );
};

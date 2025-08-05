import { motion } from "framer-motion";
import React from "react";
import { FaPaintBrush } from "react-icons/fa";

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
      <div className="flex items-center gap-3 mb-2">
        <FaPaintBrush className="text-3xl" />
        <h3 className="font-display text-2xl">STYLING POWERS</h3>
      </div>
      <div className="border-t-3 border-comic-black mb-3"></div>
      <p className="font-comic text-sm mb-4 text-comic-black/90">
        Choose your styling approach - from utility-first CSS to component libraries
      </p>
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

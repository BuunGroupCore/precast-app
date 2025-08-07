import { motion } from "framer-motion";
import React from "react";
import { FaPaintBrush } from "react-icons/fa";

import { Tooltip } from "@/components/ui/Tooltip";
import { stylings } from "@/lib/stack-config";

import { CollapsibleSection } from "./CollapsibleSection";
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
    >
      <CollapsibleSection
        icon={<FaPaintBrush className="text-3xl" />}
        title={<h3 className="font-display text-2xl">STYLING POWERS</h3>}
        className="bg-comic-yellow"
      >
        <p className="font-comic text-sm mb-4 text-comic-black/90">
          Choose your styling approach - from utility-first CSS to component libraries
        </p>
        <div className="grid grid-cols-3 gap-3">
          {stylings.map((style) => (
            <Tooltip key={style.id} content={style.description || ""}>
              <button
                onClick={() => setConfig({ ...config, styling: style.id })}
                data-active={config.styling === style.id}
                className="filter-btn-comic flex flex-col items-center justify-center gap-2 py-3 h-20 w-full"
              >
                {style.icon && <style.icon className="text-2xl" />}
                <span className="text-xs">{style.name}</span>
              </button>
            </Tooltip>
          ))}
        </div>
      </CollapsibleSection>
    </motion.div>
  );
};

import { motion } from "framer-motion";
import React from "react";
import { FaCode } from "react-icons/fa";

import { frameworks } from "../../lib/stack-config";
import { ServiceTooltip } from "../ServiceTooltip";

import { CollapsibleSection } from "./CollapsibleSection";
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
      transition={{ delay: 0.45 }}
    >
      <CollapsibleSection
        icon={<FaCode className="text-3xl text-comic-orange" />}
        title={<h3 className="font-display text-2xl text-comic-orange">FRONTEND FRAMEWORK</h3>}
        className="bg-comic-green"
      >
        <p className="font-comic text-sm mb-4 text-comic-black/90">
          Choose your weapon of choice for building amazing user interfaces
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {frameworks.map((framework) => (
            <ServiceTooltip
              serviceId={framework.id as keyof typeof import("../ServiceTooltip").serviceInfo}
              key={framework.id}
            >
              <button
                onClick={() => setConfig({ ...config, framework: framework.id })}
                data-active={config.framework === framework.id}
                className="filter-btn-comic flex flex-col items-center justify-center gap-2 py-3 h-20 w-full"
              >
                {framework.icon && <framework.icon className="text-2xl" />}
                <span className="text-xs">{framework.name}</span>
              </button>
            </ServiceTooltip>
          ))}
        </div>
      </CollapsibleSection>
    </motion.div>
  );
};

import { motion } from "framer-motion";
import React from "react";
import { FaPaintBrush } from "react-icons/fa";

import { CollapsibleSection } from "./CollapsibleSection";
import { uiLibraries } from "./constants";
import { PublicIcon } from "./PublicIcon";
import type { ExtendedProjectConfig } from "./types";

interface UILibrariesSectionProps {
  config: ExtendedProjectConfig;
  setConfig: React.Dispatch<React.SetStateAction<ExtendedProjectConfig>>;
}

export const UILibrariesSection: React.FC<UILibrariesSectionProps> = ({ config, setConfig }) => {
  // Filter UI libraries based on selected framework
  const getAvailableUILibraries = () => {
    return uiLibraries.filter((lib) => {
      if (lib.frameworks.includes("*")) return true;
      return lib.frameworks.includes(config.framework);
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.55 }}
    >
      <CollapsibleSection
        icon={<FaPaintBrush className="text-3xl text-comic-blue" />}
        title={<h3 className="font-display text-2xl text-comic-blue">UI COMPONENTS</h3>}
      >
        <p className="font-comic text-sm mb-4 text-comic-gray">
          Pre-built component libraries - speed up development with ready-made UI components
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {getAvailableUILibraries().map((lib) => (
            <button
              key={lib.id}
              onClick={() => setConfig({ ...config, uiLibrary: lib.id })}
              data-active={config.uiLibrary === lib.id}
              className="filter-btn-comic flex flex-col items-center justify-center gap-2 py-3 h-20 w-full"
              title={lib.description}
            >
              {lib.icon &&
                (typeof lib.icon === "string" ? (
                  <PublicIcon name={lib.icon} className={`text-2xl ${lib.color}`} />
                ) : (
                  <lib.icon className={`text-2xl ${lib.color}`} />
                ))}
              <span className="text-xs">{lib.name}</span>
            </button>
          ))}
        </div>
        {config.styling !== "tailwind" &&
          config.uiLibrary &&
          ["daisyui", "shadcn", "brutalist"].includes(config.uiLibrary) && (
            <p className="text-xs text-comic-red mt-2 font-comic">
              ⚠️ This UI library works best with Tailwind CSS
            </p>
          )}
      </CollapsibleSection>
    </motion.div>
  );
};

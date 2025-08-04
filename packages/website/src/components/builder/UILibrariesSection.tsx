import { motion } from "framer-motion";
import React from "react";
import { FaPaintBrush } from "react-icons/fa";

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
      className="comic-card"
    >
      <h3 className="font-display text-2xl mb-4 text-comic-blue flex items-center gap-2">
        <FaPaintBrush />
        UI COMPONENTS
      </h3>
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
                <PublicIcon name={lib.icon} className={lib.color} />
              ) : (
                <lib.icon className={lib.color} />
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
    </motion.div>
  );
};

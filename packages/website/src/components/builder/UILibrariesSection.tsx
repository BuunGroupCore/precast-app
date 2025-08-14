import { motion } from "framer-motion";
import React, { useEffect, useCallback } from "react";
import { FaPaintBrush } from "react-icons/fa";

import { ComicTooltip } from "@/components/ui/ComicTooltip";

import { BuilderIcon } from "./BuilderIcon";
import { CollapsibleSection } from "./CollapsibleSection";
import { uiLibraries } from "./constants";
import { PublicIcon } from "./PublicIcon";
import type { ExtendedProjectConfig } from "./types";

interface UILibrariesSectionProps {
  config: ExtendedProjectConfig;
  setConfig: React.Dispatch<React.SetStateAction<ExtendedProjectConfig>>;
}

/**
 * UI Libraries selection component with framework compatibility validation.
 */
export const UILibrariesSection: React.FC<UILibrariesSectionProps> = ({ config, setConfig }) => {
  const isUILibraryCompatible = useCallback(
    (lib: (typeof uiLibraries)[0]) => {
      if (lib.frameworks.includes("*")) return true;

      const frameworkToCheck =
        config.framework === "vite" && config.uiFramework ? config.uiFramework : config.framework;

      return lib.frameworks.includes(frameworkToCheck);
    },
    [config.framework, config.uiFramework]
  );

  const isUILibraryStyleCompatible = useCallback(
    (lib: (typeof uiLibraries)[0]) => {
      if (lib.incompatible && lib.incompatible.includes(config.styling)) {
        return false;
      }

      if (!lib.requires) return true;
      return lib.requires.every((req) => {
        if (req === "tailwind") return config.styling === "tailwind";
        if (req === "css") return config.styling === "css";
        if (req === "scss") return config.styling === "scss";
        if (req === "styled-components") return config.styling === "styled-components";
        return true;
      });
    },
    [config.styling]
  );

  /**
   * Automatically resets UI library selection when it becomes incompatible with framework or styling changes
   */
  useEffect(() => {
    if (config.uiLibrary && config.uiLibrary !== "none") {
      const selectedLib = uiLibraries.find((lib) => lib.id === config.uiLibrary);
      if (selectedLib) {
        const isCompatible = isUILibraryCompatible(selectedLib);
        const isStyleCompatible = isUILibraryStyleCompatible(selectedLib);

        if (!isCompatible || !isStyleCompatible) {
          setConfig((prev) => ({
            ...prev,
            uiLibrary: "none",
          }));
        }
      }
    }
  }, [
    config.framework,
    config.uiFramework,
    config.styling,
    config.uiLibrary,
    isUILibraryCompatible,
    isUILibraryStyleCompatible,
    setConfig,
  ]);

  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.55 }}
    >
      <CollapsibleSection
        icon={<BuilderIcon icon={FaPaintBrush} className="text-3xl text-comic-blue" />}
        title={<h3 className="font-display text-2xl text-comic-blue">UI COMPONENTS</h3>}
      >
        <p className="font-comic text-sm mb-4 text-comic-gray">
          Pre-built component libraries - speed up development with ready-made UI components
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {uiLibraries
            .filter((lib) => !lib.disabled)
            .map((lib) => {
              const isCompatible = isUILibraryCompatible(lib);
              const isStyleCompatible = isUILibraryStyleCompatible(lib);
              const isFullyCompatible = isCompatible && isStyleCompatible;

              let tooltipContent = lib.description || "";
              if (!isCompatible) {
                tooltipContent += ` (Requires: ${lib.frameworks.join(", ")})`;
              } else if (!isStyleCompatible) {
                if (lib.incompatible && lib.incompatible.includes(config.styling)) {
                  tooltipContent += ` (Incompatible with ${config.styling})`;
                } else if (lib.requires) {
                  tooltipContent += ` (Requires: ${lib.requires.join(", ")})`;
                }
              }

              return (
                <ComicTooltip key={lib.id} content={tooltipContent}>
                  <button
                    onClick={() => isFullyCompatible && setConfig({ ...config, uiLibrary: lib.id })}
                    data-active={config.uiLibrary === lib.id}
                    disabled={!isFullyCompatible}
                    className={`filter-btn-comic flex flex-col items-center justify-center gap-2 py-3 h-20 w-full ${
                      !isFullyCompatible ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    {lib.icon &&
                      (typeof lib.icon === "string" ? (
                        <PublicIcon name={lib.icon} className="text-2xl" />
                      ) : (
                        <BuilderIcon icon={lib.icon} className="text-2xl" />
                      ))}
                    <span className="text-xs">{lib.name}</span>
                  </button>
                </ComicTooltip>
              );
            })}
        </div>
      </CollapsibleSection>
    </motion.div>
  );
};

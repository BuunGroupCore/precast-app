import { motion } from "framer-motion";
import React from "react";
import { FaPaintBrush } from "react-icons/fa";

import { Tooltip } from "@/components/ui/Tooltip";
import { stylings } from "@/lib/stack-config";

import { CollapsibleSection } from "./CollapsibleSection";
import { PublicIcon } from "./PublicIcon";
import type { ExtendedProjectConfig } from "./types";

interface StylingSectionProps {
  config: ExtendedProjectConfig;
  setConfig: React.Dispatch<React.SetStateAction<ExtendedProjectConfig>>;
}

export const StylingSection: React.FC<StylingSectionProps> = ({ config, setConfig }) => {
  const isStylingCompatible = (style: (typeof stylings)[0]) => {
    const frameworkToCheck =
      config.framework === "vite" && config.uiFramework ? config.uiFramework : config.framework;

    if (style.incompatible && style.incompatible.includes(frameworkToCheck)) {
      return false;
    }

    if (style.dependencies) {
      return style.dependencies.every((dep) => {
        if (dep === "react") {
          return ["react", "next", "remix", "react-native"].includes(frameworkToCheck);
        }
        return true;
      });
    }

    return true;
  };

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
          {stylings.map((style) => {
            const frameworkToCheck =
              config.framework === "vite" && config.uiFramework
                ? config.uiFramework
                : config.framework;

            const isCompatible = isStylingCompatible(style);
            const isRecommended = style.recommended && style.recommended.includes(frameworkToCheck);

            let tooltipContent = style.description || "";
            if (!isCompatible) {
              if (style.incompatible && style.incompatible.includes(frameworkToCheck)) {
                tooltipContent += ` (Not compatible with ${frameworkToCheck})`;
              } else if (style.dependencies) {
                tooltipContent += ` (Requires: ${style.dependencies.join(", ")})`;
              }
            } else if (isRecommended) {
              tooltipContent += ` (Recommended for ${frameworkToCheck})`;
            }

            return (
              <Tooltip key={style.id} content={tooltipContent}>
                <button
                  onClick={() => isCompatible && setConfig({ ...config, styling: style.id })}
                  data-active={config.styling === style.id}
                  disabled={!isCompatible}
                  className={`filter-btn-comic flex flex-col items-center justify-center gap-2 py-3 h-20 w-full relative ${
                    !isCompatible ? "opacity-50 cursor-not-allowed" : ""
                  } ${
                    isRecommended && isCompatible ? "ring-2 ring-comic-green ring-offset-2" : ""
                  }`}
                >
                  {isRecommended && isCompatible && (
                    <span className="absolute -top-2 -right-2 bg-comic-green text-comic-white text-[10px] font-comic font-bold px-2 py-0.5 rounded-full border-2 border-comic-black">
                      RECOMMENDED
                    </span>
                  )}
                  {style.icon &&
                    (typeof style.icon === "string" ? (
                      <PublicIcon name={style.icon} className="text-2xl" />
                    ) : (
                      <style.icon className="text-2xl" />
                    ))}
                  <span className="text-xs">{style.name}</span>
                </button>
              </Tooltip>
            );
          })}
        </div>
      </CollapsibleSection>
    </motion.div>
  );
};

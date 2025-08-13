import { motion } from "framer-motion";
import React from "react";
import { FaBrush } from "react-icons/fa";

import { CollapsibleSection } from "./CollapsibleSection";
import { ColorPaletteSection } from "./ColorPaletteSection";
import { DesignSystemSelector, type DesignSystemConfig } from "./DesignSystemSelector";
import type { ExtendedProjectConfig } from "./types";

interface DesignSectionProps {
  config: ExtendedProjectConfig;
  setConfig: React.Dispatch<React.SetStateAction<ExtendedProjectConfig>>;
}

/**
 * Design customization section - centralized location for all visual and styling options.
 * This section will expand to include component styling, theme customization, and more design features.
 */
export const DesignSection: React.FC<DesignSectionProps> = ({ config, setConfig }) => {
  // Initialize design system config with defaults if not present
  const designSystemConfig: DesignSystemConfig = config.designSystem || {
    borders: "subtle",
    shadows: "md",
    radius: "md",
    spacing: "comfortable",
    typography: "sans",
    animations: "smooth",
    stylingLibrary:
      config.styling === "tailwind"
        ? "tailwind"
        : config.styling === "scss"
          ? "scss"
          : config.styling === "styled-components"
            ? "styled-components"
            : "css",
  };

  const handleDesignSystemChange = (newConfig: DesignSystemConfig) => {
    setConfig((prev) => ({
      ...prev,
      designSystem: newConfig,
    }));
  };

  // Generate summary text for collapsed view
  const getDesignSummary = () => {
    if (config.colorPalette || config.designSystem) {
      const items = [];
      if (config.colorPalette) {
        items.push(config.colorPalette.name);
      }
      if (config.designSystem) {
        items.push(`${config.designSystem.borders} borders`);
        items.push(`${config.designSystem.shadows} shadows`);
      }
      return items.join(" • ");
    }
    return undefined;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <CollapsibleSection
        title={
          <div>
            <h3 className="action-text text-2xl">DESIGN SYSTEM</h3>
            <p className="font-comic text-sm text-comic-gray">
              Customize your app&apos;s visual identity and design tokens
            </p>
          </div>
        }
        icon={<FaBrush className="text-2xl text-comic-purple" />}
        defaultCollapsed={false}
        summary={
          config.colorPalette || config.designSystem ? (
            <div className="flex items-center gap-2">
              {config.colorPalette && (
                <div className="flex gap-1">
                  {Object.values(config.colorPalette.colors)
                    .slice(0, 4)
                    .map((color, idx) => (
                      <div
                        key={idx}
                        className="w-4 h-4 rounded-full border-2 border-comic-black"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                </div>
              )}
              <span className="font-comic text-xs">{getDesignSummary()}</span>
            </div>
          ) : undefined
        }
      >
        <div className="space-y-6">
          {/* Color Palette Section - directly integrated */}
          <ColorPaletteSection config={config} setConfig={setConfig} />

          {/* Design System Selector - new addition */}
          <DesignSystemSelector
            value={designSystemConfig}
            onChange={handleDesignSystemChange}
            colorPalette={config.colorPalette}
          />
        </div>
      </CollapsibleSection>
    </motion.div>
  );
};

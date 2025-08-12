import { motion } from "framer-motion";
import React from "react";
import { FaBrush } from "react-icons/fa";

import { CollapsibleSection } from "./CollapsibleSection";
import { ColorPaletteSection } from "./ColorPaletteSection";
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
          config.colorPalette ? (
            <div className="flex items-center gap-2">
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
              <span className="font-comic text-xs">{config.colorPalette.name}</span>
            </div>
          ) : undefined
        }
      >
        <div className="space-y-6">
          {/* Color Palette Section - directly integrated */}
          <ColorPaletteSection config={config} setConfig={setConfig} />

          {/* Future Design Options - Minimal comic-style placeholder */}
          <div className="text-center py-6">
            <div className="action-text text-xl text-comic-purple mb-2 transform -rotate-1">
              MORE COMING SOON!
            </div>
            <div className="font-comic text-xs text-comic-gray">
              Typography • Components • Animations • Themes
            </div>
          </div>
        </div>
      </CollapsibleSection>
    </motion.div>
  );
};

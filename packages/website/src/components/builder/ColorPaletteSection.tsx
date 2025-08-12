import { motion, AnimatePresence } from "framer-motion";
import React, { useState } from "react";
import { HexColorPicker } from "react-colorful";
import { FaPalette, FaEdit, FaTimes, FaCheck } from "react-icons/fa";

import { colorPalettes, type ColorPalette } from "@/lib/color-palettes";

import { CollapsibleSection } from "./CollapsibleSection";
import type { ExtendedProjectConfig } from "./types";

interface ColorPaletteSectionProps {
  config: ExtendedProjectConfig;
  setConfig: React.Dispatch<React.SetStateAction<ExtendedProjectConfig>>;
}

type PaletteCategory = "all" | ColorPalette["category"];

const categories: { id: PaletteCategory; name: string; color: string }[] = [
  { id: "all", name: "All", color: "comic-purple" },
  { id: "modern", name: "Modern", color: "comic-blue" },
  { id: "professional", name: "Pro", color: "comic-darkBlue" },
  { id: "playful", name: "Fun", color: "comic-yellow" },
  { id: "dark", name: "Dark", color: "comic-black" },
  { id: "light", name: "Light", color: "comic-white" },
  { id: "retro", name: "Retro", color: "comic-orange" },
];

export const ColorPaletteSection: React.FC<ColorPaletteSectionProps> = ({ config, setConfig }) => {
  const [selectedCategory, setSelectedCategory] = useState<PaletteCategory>("all");
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [editingColor, setEditingColor] = useState<keyof ColorPalette["colors"] | null>(null);
  const [customColors, setCustomColors] = useState<ColorPalette["colors"]>(
    config.colorPalette?.colors || colorPalettes.find((p) => p.id === "shadcn")!.colors
  );

  const filteredPalettes =
    selectedCategory === "all"
      ? colorPalettes.filter((p) => p.id !== "custom")
      : colorPalettes.filter((p) => p.category === selectedCategory && p.id !== "custom");

  const handlePaletteSelect = (palette: ColorPalette) => {
    setConfig({
      ...config,
      colorPalette: palette,
    });
    setCustomColors(palette.colors);
    setIsCustomizing(false);
  };

  const handleCustomize = () => {
    const customPalette: ColorPalette = {
      id: "custom",
      name: "Custom",
      description: "Your custom color palette",
      category: "modern",
      colors: customColors,
      preview: [
        customColors.primary,
        customColors.secondary,
        customColors.accent,
        customColors.success,
      ],
    };
    setConfig({
      ...config,
      colorPalette: customPalette,
    });
    setIsCustomizing(true);
  };

  const handleColorChange = (colorKey: keyof ColorPalette["colors"], value: string) => {
    const newColors = { ...customColors, [colorKey]: value };
    setCustomColors(newColors);

    if (config.colorPalette?.id === "custom") {
      const customPalette: ColorPalette = {
        ...config.colorPalette,
        colors: newColors,
        preview: [newColors.primary, newColors.secondary, newColors.accent, newColors.success],
      };
      setConfig({
        ...config,
        colorPalette: customPalette,
      });
    }
  };

  const ColorPreview: React.FC<{ colors: string[]; size?: "sm" | "md" }> = ({
    colors,
    size = "md",
  }) => (
    <div className="flex gap-0.5 sm:gap-1">
      {colors.map((color, index) => (
        <div
          key={index}
          className={`${
            size === "sm" ? "w-4 h-4" : "w-5 h-5 sm:w-6 sm:h-6"
          } rounded border-2 border-comic-black shadow-sm`}
          style={{ backgroundColor: color }}
        />
      ))}
    </div>
  );

  const PaletteSummary = () => {
    const currentPalette = config.colorPalette || colorPalettes.find((p) => p.id === "shadcn");
    return (
      <div className="flex items-center gap-2">
        <span className="font-comic text-xs text-comic-black/70">{currentPalette?.name}</span>
        <ColorPreview colors={currentPalette?.preview || []} size="sm" />
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.55 }}
      className="mt-6"
    >
      <CollapsibleSection
        icon={<FaPalette className="text-3xl text-comic-purple" />}
        defaultCollapsed={true}
        summary={<PaletteSummary />}
        title={
          <div className="flex items-center gap-3 flex-1">
            <h3 className="font-display text-2xl">COLOR PALETTE</h3>
            <div className="flex-1" />
            {!isCustomizing && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleCustomize();
                }}
                className="px-2 sm:px-3 py-1 bg-comic-purple text-comic-white font-comic text-xs sm:text-sm rounded-lg border-2 border-comic-black hover:bg-comic-darkPurple transition-colors flex items-center gap-1 sm:gap-2 mr-4"
              >
                <FaEdit className="text-xs" />
                <span className="hidden sm:inline">Customize</span>
                <span className="sm:hidden">Edit</span>
              </button>
            )}
          </div>
        }
        className="bg-gradient-to-br from-comic-purple/10 to-comic-pink/10"
      >
        <p className="font-comic text-sm mb-4 text-comic-black/90">
          Choose a color scheme that matches your project&apos;s vibe
        </p>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-1 sm:gap-2 mb-4">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-2 sm:px-3 py-1 font-comic text-[10px] sm:text-xs uppercase border-2 border-comic-black rounded-lg transition-all ${
                selectedCategory === category.id
                  ? `bg-comic-purple text-comic-white transform -rotate-1 shadow-md`
                  : "bg-comic-white hover:bg-comic-gray/20"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Palette Grid or Custom Editor */}
        {!isCustomizing ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3">
            {filteredPalettes.map((palette) => {
              const isSelected = config.colorPalette?.id === palette.id;
              return (
                <div key={palette.id} className="relative group">
                  <button
                    onClick={() => handlePaletteSelect(palette)}
                    className={`w-full p-2 sm:p-3 rounded-lg border-3 border-comic-black transition-all hover:transform hover:-rotate-0.5 ${
                      isSelected
                        ? "bg-comic-yellow transform -rotate-1 shadow-lg ring-2 ring-comic-purple ring-offset-2"
                        : "bg-comic-white hover:bg-comic-gray/10"
                    }`}
                  >
                    <div className="flex flex-col items-center gap-1 sm:gap-2">
                      <span className="font-comic font-bold text-xs sm:text-sm truncate w-full text-center">
                        {palette.name}
                      </span>
                      <ColorPreview colors={palette.preview || []} size="md" />
                      {isSelected && (
                        <FaCheck className="text-comic-green text-sm sm:text-lg mt-1" />
                      )}
                    </div>
                  </button>
                  {/* Custom Tooltip */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-comic-black text-comic-white font-comic text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 pointer-events-none">
                    {palette.description}
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
                      <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-comic-black"></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Custom Color Editor */
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between mb-4">
              <h5 className="font-display text-lg text-comic-purple">CUSTOMIZE YOUR PALETTE</h5>
              <button
                onClick={() => setIsCustomizing(false)}
                className="p-2 rounded-full hover:bg-comic-gray/20 transition-colors"
              >
                <FaTimes className="text-xl" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-2 sm:gap-3">
              {Object.entries(customColors).map(([key, value]) => (
                <div key={key} className="relative">
                  <button
                    onClick={() =>
                      setEditingColor(
                        editingColor === key ? null : (key as keyof ColorPalette["colors"])
                      )
                    }
                    className="w-full p-2 rounded-lg border-2 border-comic-black bg-comic-white hover:bg-comic-gray/10 transition-colors"
                  >
                    <div className="flex flex-col items-center gap-1">
                      <div
                        className="w-full h-8 sm:h-10 rounded border-2 border-comic-black shadow-sm"
                        style={{ backgroundColor: value }}
                      />
                      <span className="font-comic text-[10px] sm:text-xs capitalize truncate w-full text-center">
                        {key.replace(/([A-Z])/g, " $1").trim()}
                      </span>
                      <span className="font-mono text-[8px] sm:text-[10px] text-comic-gray">
                        {value.toUpperCase()}
                      </span>
                    </div>
                  </button>

                  <AnimatePresence>
                    {editingColor === key && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="absolute top-full left-0 mt-2 z-50 p-3 bg-comic-white rounded-lg border-3 border-comic-black shadow-xl"
                        style={{ minWidth: "200px" }}
                      >
                        <HexColorPicker
                          color={value}
                          onChange={(newColor) =>
                            handleColorChange(key as keyof ColorPalette["colors"], newColor)
                          }
                        />
                        <div className="mt-2 flex items-center gap-2">
                          <input
                            type="text"
                            value={value}
                            onChange={(e) =>
                              handleColorChange(key as keyof ColorPalette["colors"], e.target.value)
                            }
                            className="flex-1 px-2 py-1 font-mono text-xs border-2 border-comic-black rounded"
                          />
                          <button
                            onClick={() => setEditingColor(null)}
                            className="p-1 bg-comic-green text-comic-white rounded border-2 border-comic-black hover:bg-comic-darkGreen"
                          >
                            <FaCheck className="text-xs" />
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-2 mt-4 pt-4 border-t-2 border-comic-black/10">
              <button
                onClick={() => {
                  const defaultPalette = colorPalettes.find((p) => p.id === "shadcn")!;
                  setCustomColors(defaultPalette.colors);
                  handleColorChange("primary", defaultPalette.colors.primary);
                }}
                className="px-3 sm:px-4 py-2 bg-comic-gray text-comic-black font-comic text-sm rounded-lg border-2 border-comic-black hover:bg-comic-darkGray transition-colors"
              >
                Reset
              </button>
              <button
                onClick={() => {
                  const customPalette: ColorPalette = {
                    id: "custom",
                    name: "Custom",
                    description: "Your custom color palette",
                    category: "modern",
                    colors: customColors,
                    preview: [
                      customColors.primary,
                      customColors.secondary,
                      customColors.accent,
                      customColors.success,
                    ],
                  };
                  handlePaletteSelect(customPalette);
                  setIsCustomizing(false);
                }}
                className="px-3 sm:px-4 py-2 bg-comic-green text-comic-white font-comic text-sm rounded-lg border-2 border-comic-black hover:bg-comic-darkGreen transition-colors flex items-center justify-center gap-2"
              >
                <FaCheck />
                Apply
              </button>
            </div>
          </motion.div>
        )}
      </CollapsibleSection>
    </motion.div>
  );
};

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
  FaBorderStyle,
  FaAdjust,
  FaSquare,
  FaLayerGroup,
  FaFont,
  FaMagic,
  FaChevronDown,
} from "react-icons/fa";

import type { ColorPalette } from "@/lib/color-palettes";

import { CollapsibleSection } from "./CollapsibleSection";

// Simple className utility
const cn = (...classes: (string | boolean | undefined)[]) => {
  return classes.filter(Boolean).join(" ");
};

export interface DesignSystemConfig {
  borders: BorderStyle;
  shadows: ShadowStyle;
  radius: RadiusStyle;
  spacing: SpacingStyle;
  typography: TypographyStyle;
  animations: AnimationStyle;
  stylingLibrary: "tailwind" | "css" | "scss" | "styled-components";
}

type BorderStyle = "none" | "subtle" | "normal" | "bold" | "double" | "dashed";
type ShadowStyle = "none" | "sm" | "md" | "lg" | "xl" | "inner" | "brutal";
type RadiusStyle = "none" | "sm" | "md" | "lg" | "xl" | "full" | "sharp";
type SpacingStyle = "compact" | "comfortable" | "spacious" | "relaxed";
type TypographyStyle = "sans" | "serif" | "mono" | "display" | "modern";
type AnimationStyle = "none" | "subtle" | "smooth" | "bouncy" | "energetic";

const borderStyles: Record<BorderStyle, { name: string; preview: string; css: string }> = {
  none: {
    name: "None",
    preview: "border-0",
    css: "border: none;",
  },
  subtle: {
    name: "Subtle",
    preview: "border border-gray-200",
    css: "border: 1px solid #e5e7eb;",
  },
  normal: {
    name: "Normal",
    preview: "border-2 border-gray-400",
    css: "border: 2px solid #9ca3af;",
  },
  bold: {
    name: "Bold",
    preview: "border-4 border-gray-600",
    css: "border: 4px solid #4b5563;",
  },
  double: {
    name: "Double",
    preview: "border-4 border-double border-gray-600",
    css: "border: 4px double #4b5563;",
  },
  dashed: {
    name: "Dashed",
    preview: "border-2 border-dashed border-gray-500",
    css: "border: 2px dashed #6b7280;",
  },
};

const shadowStyles: Record<ShadowStyle, { name: string; preview: string; css: string }> = {
  none: {
    name: "None",
    preview: "shadow-none",
    css: "box-shadow: none;",
  },
  sm: {
    name: "Small",
    preview: "shadow-sm",
    css: "box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);",
  },
  md: {
    name: "Medium",
    preview: "shadow-md",
    css: "box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);",
  },
  lg: {
    name: "Large",
    preview: "shadow-lg",
    css: "box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);",
  },
  xl: {
    name: "Extra Large",
    preview: "shadow-xl",
    css: "box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);",
  },
  inner: {
    name: "Inner",
    preview: "shadow-inner",
    css: "box-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.06);",
  },
  brutal: {
    name: "Brutal",
    preview: "shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]",
    css: "box-shadow: 4px 4px 0px 0px rgba(0,0,0,1);",
  },
};

const radiusStyles: Record<RadiusStyle, { name: string; preview: string; css: string }> = {
  none: {
    name: "Sharp",
    preview: "rounded-none",
    css: "border-radius: 0;",
  },
  sm: {
    name: "Small",
    preview: "rounded-sm",
    css: "border-radius: 0.125rem;",
  },
  md: {
    name: "Medium",
    preview: "rounded-md",
    css: "border-radius: 0.375rem;",
  },
  lg: {
    name: "Large",
    preview: "rounded-lg",
    css: "border-radius: 0.5rem;",
  },
  xl: {
    name: "Extra Large",
    preview: "rounded-xl",
    css: "border-radius: 0.75rem;",
  },
  full: {
    name: "Full",
    preview: "rounded-full",
    css: "border-radius: 9999px;",
  },
  sharp: {
    name: "Sharp Corners",
    preview: "rounded-none",
    css: "border-radius: 0;",
  },
};

const spacingStyles: Record<SpacingStyle, { name: string; padding: string; gap: string }> = {
  compact: {
    name: "Compact",
    padding: "p-2",
    gap: "gap-2",
  },
  comfortable: {
    name: "Comfortable",
    padding: "p-4",
    gap: "gap-4",
  },
  spacious: {
    name: "Spacious",
    padding: "p-6",
    gap: "gap-6",
  },
  relaxed: {
    name: "Relaxed",
    padding: "p-8",
    gap: "gap-8",
  },
};

const typographyStyles: Record<TypographyStyle, { name: string; className: string; css: string }> =
  {
    sans: {
      name: "Sans Serif",
      className: "font-sans",
      css: "font-family: system-ui, -apple-system, sans-serif;",
    },
    serif: {
      name: "Serif",
      className: "font-serif",
      css: "font-family: Georgia, serif;",
    },
    mono: {
      name: "Monospace",
      className: "font-mono",
      css: "font-family: 'Courier New', monospace;",
    },
    display: {
      name: "Display",
      className: "font-display",
      css: "font-family: 'Bebas Neue', sans-serif;",
    },
    modern: {
      name: "Modern",
      className: "font-['Inter']",
      css: "font-family: 'Inter', sans-serif;",
    },
  };

const animationStyles: Record<AnimationStyle, { name: string; description: string }> = {
  none: {
    name: "None",
    description: "No animations",
  },
  subtle: {
    name: "Subtle",
    description: "150ms ease-in-out",
  },
  smooth: {
    name: "Smooth",
    description: "300ms ease-in-out",
  },
  bouncy: {
    name: "Bouncy",
    description: "Spring animations",
  },
  energetic: {
    name: "Energetic",
    description: "Fast, snappy animations",
  },
};

type TabId = "borders" | "shadows" | "radius" | "spacing" | "typography" | "animations";

const tabs: Array<{ id: TabId; label: string; icon: React.ElementType }> = [
  { id: "borders", label: "Borders", icon: FaBorderStyle },
  { id: "shadows", label: "Shadows", icon: FaLayerGroup },
  { id: "radius", label: "Radius", icon: FaAdjust },
  { id: "spacing", label: "Spacing", icon: FaSquare },
  { id: "typography", label: "Typography", icon: FaFont },
  { id: "animations", label: "Animations", icon: FaMagic },
];

interface DesignSystemSelectorProps {
  value: DesignSystemConfig;
  onChange: (config: DesignSystemConfig) => void;
  colorPalette?: ColorPalette;
}

export function DesignSystemSelector({ value, onChange, colorPalette }: DesignSystemSelectorProps) {
  const [previewHover, setPreviewHover] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>("borders");
  const [showMobileDropdown, setShowMobileDropdown] = useState(false);

  const updateConfig = <K extends keyof DesignSystemConfig>(
    key: K,
    newValue: DesignSystemConfig[K]
  ) => {
    onChange({ ...value, [key]: newValue });
  };

  const activeTabData = tabs.find((t) => t.id === activeTab);

  // Generate summary of selected options
  const getDesignSummary = () => {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs font-comic">
        <div>
          <span className="text-comic-gray">Border:</span>{" "}
          <span className="font-bold">{borderStyles[value.borders].name}</span>
        </div>
        <div>
          <span className="text-comic-gray">Shadow:</span>{" "}
          <span className="font-bold">{shadowStyles[value.shadows].name}</span>
        </div>
        <div>
          <span className="text-comic-gray">Radius:</span>{" "}
          <span className="font-bold">{radiusStyles[value.radius].name}</span>
        </div>
        <div>
          <span className="text-comic-gray">Spacing:</span>{" "}
          <span className="font-bold">{spacingStyles[value.spacing].name}</span>
        </div>
        <div>
          <span className="text-comic-gray">Font:</span>{" "}
          <span className="font-bold">{typographyStyles[value.typography].name}</span>
        </div>
        <div>
          <span className="text-comic-gray">Animation:</span>{" "}
          <span className="font-bold">{animationStyles[value.animations].name}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Live Preview Section - TODO: Enable after backend implementation for STYLING.md generation */}
      <div className="relative">
        <div className="absolute -top-2 right-0 sm:-right-2 z-10">
          <span className="px-1 sm:px-2 py-0.5 sm:py-1 text-[9px] sm:text-xs font-comic font-bold bg-comic-yellow text-comic-black rounded-full border sm:border-2 border-comic-black shadow-sm">
            UNDER DEVELOPMENT
          </span>
        </div>
        <div className="opacity-50 pointer-events-none">
          <CollapsibleSection
            title={
              <div>
                <h4 className="font-comic font-bold text-lg">LIVE PREVIEW</h4>
                <p className="font-comic text-xs text-comic-gray">
                  See your design choices in action
                </p>
              </div>
            }
            icon={<FaMagic className="text-lg text-comic-purple" />}
            defaultCollapsed={true}
          >
            <div className="space-y-4">
              {/* Summary of selected options */}
              <div className="p-3 bg-comic-white/50 rounded-lg border border-comic-gray/20">
                <h5 className="font-comic font-bold text-sm mb-2 text-comic-black">
                  Current Settings
                </h5>
                {getDesignSummary()}
                {colorPalette && (
                  <div className="mt-3 pt-3 border-t border-comic-gray/20">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-comic text-comic-gray">Color Palette:</span>
                      <span className="font-comic font-bold text-xs">{colorPalette.name}</span>
                      <div className="flex gap-1 ml-auto">
                        <div
                          className="w-4 h-4 rounded-full border border-comic-black"
                          style={{ backgroundColor: colorPalette.colors.primary }}
                          title="Primary"
                        />
                        <div
                          className="w-4 h-4 rounded-full border border-comic-black"
                          style={{ backgroundColor: colorPalette.colors.secondary }}
                          title="Secondary"
                        />
                        <div
                          className="w-4 h-4 rounded-full border border-comic-black"
                          style={{ backgroundColor: colorPalette.colors.accent }}
                          title="Accent"
                        />
                        <div
                          className="w-4 h-4 rounded-full border border-comic-black"
                          style={{ backgroundColor: colorPalette.colors.surface }}
                          title="Surface"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Preview Components */}
              <div className="grid md:grid-cols-2 gap-6 p-4 bg-gradient-to-br from-comic-white/30 to-transparent rounded-lg">
                {/* Card Preview */}
                <div>
                  <label className="text-sm font-comic font-bold mb-2 block">Card Component</label>
                  <div
                    className={cn(
                      "p-6 transition-all duration-300",
                      borderStyles[value.borders].preview,
                      shadowStyles[value.shadows].preview,
                      radiusStyles[value.radius].preview,
                      spacingStyles[value.spacing].padding
                    )}
                    onMouseEnter={() => setPreviewHover(true)}
                    onMouseLeave={() => setPreviewHover(false)}
                    style={{
                      backgroundColor: colorPalette?.colors.surface || "#FFFFFF",
                      borderColor: colorPalette?.colors.primary || undefined,
                      transform:
                        previewHover && value.animations !== "none" ? "translateY(-2px)" : "none",
                    }}
                  >
                    <h4
                      className={cn(
                        "text-lg font-bold mb-2",
                        typographyStyles[value.typography].className
                      )}
                      style={{
                        color: colorPalette?.colors.text || "#000000",
                      }}
                    >
                      Sample Card
                    </h4>
                    <p
                      className={cn(typographyStyles[value.typography].className)}
                      style={{
                        color: colorPalette?.colors.textSecondary || "#666666",
                      }}
                    >
                      This is how your cards will look with the selected design system.
                    </p>
                  </div>
                </div>

                {/* Button Preview */}
                <div>
                  <label className="text-sm font-comic font-bold mb-2 block">
                    Button Components
                  </label>
                  <div className={cn("flex flex-wrap gap-3", spacingStyles[value.spacing].gap)}>
                    <button
                      className={cn(
                        "text-white font-bold transition-all",
                        radiusStyles[value.radius].preview,
                        spacingStyles[value.spacing].padding,
                        shadowStyles[value.shadows].preview,
                        value.animations !== "none" && "hover:scale-105"
                      )}
                      style={{
                        backgroundColor: colorPalette?.colors.primary || "#FF1744",
                      }}
                    >
                      Primary
                    </button>
                    <button
                      className={cn(
                        "text-white font-bold transition-all",
                        radiusStyles[value.radius].preview,
                        spacingStyles[value.spacing].padding,
                        shadowStyles[value.shadows].preview,
                        value.animations !== "none" && "hover:scale-105"
                      )}
                      style={{
                        backgroundColor: colorPalette?.colors.secondary || "#2962FF",
                      }}
                    >
                      Secondary
                    </button>
                    <button
                      className={cn(
                        "font-bold transition-all",
                        borderStyles[value.borders].preview,
                        radiusStyles[value.radius].preview,
                        spacingStyles[value.spacing].padding,
                        shadowStyles[value.shadows].preview,
                        value.animations !== "none" && "hover:scale-105"
                      )}
                      style={{
                        backgroundColor: colorPalette?.colors.background || "#FFFFFF",
                        color: colorPalette?.colors.primary || "#000000",
                        borderColor: colorPalette?.colors.primary || "#000000",
                      }}
                    >
                      Outline
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </CollapsibleSection>
        </div>
      </div>

      {/* Design Elements Section - TODO: Backend implementation needed for STYLING.md generation */}
      <div className="relative">
        <div className="absolute -top-2 right-0 sm:-right-2 z-10">
          <span className="px-1 sm:px-2 py-0.5 sm:py-1 text-[9px] sm:text-xs font-comic font-bold bg-comic-yellow text-comic-black rounded-full border sm:border-2 border-comic-black shadow-sm">
            UNDER DEVELOPMENT
          </span>
        </div>
        <div className="opacity-50 pointer-events-none">
          <CollapsibleSection
            title={
              <div>
                <h4 className="font-comic font-bold text-lg">DESIGN ELEMENTS</h4>
                <p className="font-comic text-xs text-comic-gray">
                  Fine-tune borders, shadows, spacing & more
                </p>
              </div>
            }
            icon={<FaLayerGroup className="text-lg text-comic-blue" />}
            defaultCollapsed={true}
            summary={
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-comic">
                <span className="font-bold">{borderStyles[value.borders].name}</span>
                <span className="text-comic-gray">•</span>
                <span className="font-bold">{shadowStyles[value.shadows].name}</span>
                <span className="text-comic-gray">•</span>
                <span className="font-bold">{radiusStyles[value.radius].name}</span>
                <span className="text-comic-gray hidden sm:inline">•</span>
                <span className="font-bold hidden sm:inline">
                  {spacingStyles[value.spacing].name}
                </span>
              </div>
            }
          >
            <div className="space-y-4">
              {/* Tab Navigation - Desktop */}
              <div className="hidden md:flex gap-2 border-b-2 border-comic-gray/20">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={cn(
                        "flex items-center gap-2 px-4 py-2 font-comic font-bold text-sm transition-all",
                        "border-b-4 -mb-[2px]",
                        activeTab === tab.id
                          ? "border-comic-red text-comic-red"
                          : "border-transparent text-comic-gray hover:text-comic-black"
                      )}
                    >
                      <Icon className="text-xs" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Dropdown Navigation - Mobile */}
              <div className="md:hidden">
                <button
                  onClick={() => setShowMobileDropdown(!showMobileDropdown)}
                  className="w-full filter-btn-comic flex items-center justify-between px-4 py-3"
                >
                  <div className="flex items-center gap-2">
                    {activeTabData && <activeTabData.icon className="text-sm" />}
                    <span className="font-comic font-bold">{activeTabData?.label}</span>
                  </div>
                  <FaChevronDown
                    className={cn(
                      "text-sm transition-transform",
                      showMobileDropdown && "rotate-180"
                    )}
                  />
                </button>

                <AnimatePresence>
                  {showMobileDropdown && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-2 comic-panel p-2 space-y-1"
                    >
                      {tabs.map((tab) => {
                        const Icon = tab.icon;
                        return (
                          <button
                            key={tab.id}
                            onClick={() => {
                              setActiveTab(tab.id);
                              setShowMobileDropdown(false);
                            }}
                            className={cn(
                              "w-full flex items-center gap-2 px-3 py-2 rounded transition-all",
                              "font-comic font-bold text-sm",
                              activeTab === tab.id
                                ? "bg-comic-red/10 text-comic-red"
                                : "hover:bg-comic-gray/10 text-comic-black"
                            )}
                          >
                            <Icon className="text-xs" />
                            <span>{tab.label}</span>
                          </button>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Tab Content */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="p-4 comic-panel"
                >
                  {/* Borders Tab */}
                  {activeTab === "borders" && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {Object.entries(borderStyles).map(([key, style]) => (
                        <button
                          key={key}
                          onClick={() => updateConfig("borders", key as BorderStyle)}
                          className={cn(
                            "p-4 transition-all rounded-lg",
                            "border-2 hover:border-comic-blue",
                            value.borders === key
                              ? "border-comic-red bg-comic-red/10"
                              : "border-gray-300"
                          )}
                        >
                          <div className={cn("w-full h-12 bg-white mb-2 rounded", style.preview)} />
                          <span className="font-comic font-bold text-xs">{style.name}</span>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Shadows Tab */}
                  {activeTab === "shadows" && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {Object.entries(shadowStyles).map(([key, style]) => (
                        <button
                          key={key}
                          onClick={() => updateConfig("shadows", key as ShadowStyle)}
                          className={cn(
                            "p-4 transition-all rounded-lg",
                            "border-2 hover:border-comic-blue",
                            value.shadows === key
                              ? "border-comic-red bg-comic-red/10"
                              : "border-gray-300"
                          )}
                        >
                          <div className={cn("w-full h-12 bg-white mb-2 rounded", style.preview)} />
                          <span className="font-comic font-bold text-xs">{style.name}</span>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Radius Tab */}
                  {activeTab === "radius" && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {Object.entries(radiusStyles).map(([key, style]) => (
                        <button
                          key={key}
                          onClick={() => updateConfig("radius", key as RadiusStyle)}
                          className={cn(
                            "p-4 transition-all rounded-lg",
                            "border-2 hover:border-comic-blue",
                            value.radius === key
                              ? "border-comic-red bg-comic-red/10"
                              : "border-gray-300"
                          )}
                        >
                          <div className={cn("w-full h-12 bg-comic-blue mb-2", style.preview)} />
                          <span className="font-comic font-bold text-xs">{style.name}</span>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Spacing Tab */}
                  {activeTab === "spacing" && (
                    <div className="grid grid-cols-2 gap-3">
                      {Object.entries(spacingStyles).map(([key, style]) => (
                        <button
                          key={key}
                          onClick={() => updateConfig("spacing", key as SpacingStyle)}
                          className={cn(
                            "transition-all rounded-lg",
                            "border-2 hover:border-comic-blue",
                            value.spacing === key
                              ? "border-comic-red bg-comic-red/10"
                              : "border-gray-300",
                            style.padding
                          )}
                        >
                          <div className="bg-comic-blue/20 rounded p-2">
                            <div className="bg-white rounded p-2">
                              <span className="font-comic font-bold text-sm">{style.name}</span>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Typography Tab */}
                  {activeTab === "typography" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {Object.entries(typographyStyles).map(([key, style]) => (
                        <button
                          key={key}
                          onClick={() => updateConfig("typography", key as TypographyStyle)}
                          className={cn(
                            "p-4 text-left transition-all rounded-lg",
                            "border-2 hover:border-comic-blue",
                            value.typography === key
                              ? "border-comic-red bg-comic-red/10"
                              : "border-gray-300"
                          )}
                        >
                          <h4 className={cn("text-lg mb-1", style.className)}>{style.name}</h4>
                          <p className={cn("text-sm text-gray-600", style.className)}>
                            The quick brown fox jumps over the lazy dog
                          </p>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Animations Tab */}
                  {activeTab === "animations" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {Object.entries(animationStyles).map(([key, style]) => (
                        <button
                          key={key}
                          onClick={() => updateConfig("animations", key as AnimationStyle)}
                          className={cn(
                            "p-4 text-left transition-all rounded-lg",
                            "border-2 hover:border-comic-blue",
                            value.animations === key
                              ? "border-comic-red bg-comic-red/10"
                              : "border-gray-300"
                          )}
                        >
                          <h4 className="font-comic font-bold text-sm mb-1">{style.name}</h4>
                          <p className="text-xs text-gray-600">{style.description}</p>
                        </button>
                      ))}
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </CollapsibleSection>
        </div>
      </div>
    </div>
  );
}

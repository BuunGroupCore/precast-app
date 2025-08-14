import { motion } from "framer-motion";
import React, { useState } from "react";
import { FaCode, FaCube, FaWrench, FaJsSquare } from "react-icons/fa";

import { ComicTooltip } from "@/components/ui/ComicTooltip";
import {
  uiLibraries_frontend,
  metaFrameworks,
  buildTools,
  specialFrameworks,
} from "@/lib/stack-config";

import { BuilderIcon } from "./BuilderIcon";
import { CollapsibleSection } from "./CollapsibleSection";
import type { ExtendedProjectConfig } from "./types";

interface FrameworkSectionProps {
  config: ExtendedProjectConfig;
  setConfig: React.Dispatch<React.SetStateAction<ExtendedProjectConfig>>;
}

type FrameworkCategory = "all" | "ui-library" | "meta-framework" | "build-tool" | "special";

interface CategoryInfo {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  items: Array<{
    id: string;
    name: string;
    icon?: React.ComponentType<{ className?: string }> | string | null;
    description?: string;
    category?: string;
  }>;
}

const categories: Record<FrameworkCategory, CategoryInfo> = {
  all: {
    name: "All Options",
    icon: FaCode,
    description: "All available frontend options - frameworks, libraries, and tools",
    items: [...uiLibraries_frontend, ...metaFrameworks, ...buildTools, ...specialFrameworks].filter(
      (item) => !item.disabled
    ),
  },
  "ui-library": {
    name: "UI Libraries",
    icon: FaCube,
    description: "Core libraries for building user interfaces",
    items: uiLibraries_frontend.filter((item) => !item.disabled),
  },
  "meta-framework": {
    name: "Meta-Frameworks",
    icon: FaCode,
    description: "Full-stack frameworks with routing, SSR, and more",
    items: metaFrameworks.filter((item) => !item.disabled),
  },
  "build-tool": {
    name: "Build Tools",
    icon: FaWrench,
    description: "Development and build tooling",
    items: buildTools.filter((item) => !item.disabled),
  },
  special: {
    name: "Other Options",
    icon: FaJsSquare,
    description: "Mobile, vanilla, and custom options",
    items: specialFrameworks.filter((item) => !item.disabled),
  },
};

/**
 * Framework selection section for choosing frontend frameworks and build tools.
 * Organizes options into categories for better discovery.
 */
export const FrameworkSection: React.FC<FrameworkSectionProps> = ({ config, setConfig }) => {
  const [selectedCategory, setSelectedCategory] = useState<FrameworkCategory>("all");
  const [showViteLibraries, setShowViteLibraries] = useState(false);

  const handleFrameworkSelect = (frameworkId: string) => {
    setConfig({ ...config, framework: frameworkId });

    if (frameworkId === "vite") {
      setShowViteLibraries(true);
    } else {
      setShowViteLibraries(false);
    }
  };

  const handleViteLibrarySelect = (libraryId: string) => {
    setConfig({ ...config, framework: "vite", uiFramework: libraryId });
  };

  const viteCompatibleLibraries = uiLibraries_frontend.filter((lib) =>
    ["react", "vue", "svelte", "solid"].includes(lib.id)
  );

  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.45 }}
    >
      <CollapsibleSection
        icon={<FaCode className="text-3xl text-comic-orange" />}
        title={<h3 className="font-display text-2xl text-comic-orange">FRONTEND STACK</h3>}
        className="bg-comic-green"
      >
        <p className="font-comic text-sm mb-4 text-comic-black/90">
          Choose your frontend architecture - from UI libraries to full-stack frameworks
        </p>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 mb-4">
          {Object.entries(categories).map(([categoryKey, category]) => (
            <button
              key={categoryKey}
              onClick={() => setSelectedCategory(categoryKey as FrameworkCategory)}
              className={`px-3 py-1.5 text-xs font-comic rounded border-2 border-comic-black transition-colors ${
                selectedCategory === categoryKey
                  ? "bg-comic-yellow text-comic-black"
                  : "bg-comic-white text-comic-black hover:bg-comic-gray/10"
              }`}
              style={{ boxShadow: "1px 1px 0 var(--comic-black)" }}
            >
              <category.icon className="inline mr-1" />
              {category.name}
            </button>
          ))}
        </div>

        {/* Selected Category Description */}
        <p className="font-comic text-xs text-comic-black/70 mb-3">
          {categories[selectedCategory].description}
        </p>

        {/* Framework Grid */}
        <div className="grid grid-cols-1 min-[320px]:grid-cols-2 sm:grid-cols-3 gap-2">
          {categories[selectedCategory].items.map((framework) => {
            const frameworkCategory = Object.entries(categories).find(
              ([key, category]) =>
                key !== "all" && category.items.some((item) => item.id === framework.id)
            );
            const CategoryIcon = frameworkCategory
              ? categories[frameworkCategory[0] as FrameworkCategory].icon
              : null;

            return (
              <ComicTooltip
                key={framework.id}
                content={
                  framework.description ||
                  `${framework.name} - ${framework.category || "Framework"}`
                }
                disabled={!framework.description}
              >
                <button
                  onClick={() => handleFrameworkSelect(framework.id)}
                  data-active={config.framework === framework.id}
                  className="filter-btn-comic flex flex-col items-center justify-center gap-1 sm:gap-2 py-2 sm:py-3 h-16 sm:h-20 w-full relative"
                >
                  {selectedCategory === "all" && CategoryIcon && (
                    <div
                      className={`absolute top-1 right-1 w-5 h-5 rounded border border-comic-black flex items-center justify-center p-0.5 ${
                        config.framework === framework.id
                          ? "bg-comic-black text-comic-white"
                          : "bg-comic-white text-comic-black"
                      }`}
                    >
                      <CategoryIcon className="text-[10px]" />
                    </div>
                  )}

                  {framework.icon && (
                    <BuilderIcon icon={framework.icon} className="text-lg sm:text-2xl" />
                  )}
                  <span className="text-[10px] sm:text-xs">{framework.name}</span>
                </button>
              </ComicTooltip>
            );
          })}
        </div>

        {/* Nested UI Libraries for Vite */}
        {showViteLibraries && config.framework === "vite" && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            transition={{ duration: 0.3 }}
            className="mt-6"
          >
            <div className="border-t-3 border-comic-black/20 pt-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-4 h-0.5 bg-comic-black/30"></div>
                <h4 className="font-display text-lg text-comic-black">
                  Choose UI Library for Vite
                </h4>
                <div className="flex-1 h-0.5 bg-comic-black/30"></div>
              </div>
              <p className="font-comic text-xs text-comic-black/70 mb-4">
                Select which UI library you want to use with Vite
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {viteCompatibleLibraries.map((library) => (
                  <ComicTooltip
                    key={`vite-${library.id}`}
                    content={library.description || `${library.name} - UI Library for Vite`}
                    disabled={!library.description}
                  >
                    <button
                      onClick={() => handleViteLibrarySelect(library.id)}
                      data-active={config.framework === "vite" && config.uiFramework === library.id}
                      className="filter-btn-comic flex flex-col items-center justify-center gap-1 py-2 h-16 w-full text-xs"
                      style={{
                        backgroundColor:
                          config.framework === "vite" && config.uiFramework === library.id
                            ? "var(--comic-yellow)"
                            : "var(--comic-white)",
                      }}
                    >
                      {library.icon && <BuilderIcon icon={library.icon} className="text-lg" />}
                      <span className="text-[10px]">{library.name}</span>
                    </button>
                  </ComicTooltip>
                ))}
              </div>

              <p className="font-comic text-[10px] text-comic-black/50 mt-3 text-center">
                💡 This creates a Vite project using {config.uiFramework} as the UI library
              </p>
            </div>
          </motion.div>
        )}
      </CollapsibleSection>
    </motion.div>
  );
};

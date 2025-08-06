import { motion } from "framer-motion";
import React, { useState } from "react";
import { FaChevronDown, FaChevronUp, FaTools, FaGitAlt, FaDocker } from "react-icons/fa";
import { SiTypescript } from "react-icons/si";

import { powerUps, powerUpCategories } from "../../lib/powerups-config";
import { Tooltip } from "../ui/Tooltip";

import type { ExtendedProjectConfig } from "./types";

interface PowerUpsSectionProps {
  config: ExtendedProjectConfig;
  setConfig: React.Dispatch<React.SetStateAction<ExtendedProjectConfig>>;
}

export const PowerUpsSection: React.FC<PowerUpsSectionProps> = ({ config, setConfig }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [isExpanded, setIsExpanded] = useState(false);

  // Check if a power-up's dependencies are satisfied and get missing requirements
  const getPowerUpStatus = (powerup: (typeof powerUps)[0]) => {
    const missingRequirements: string[] = [];

    // Check framework compatibility
    if (powerup.frameworks && !powerup.frameworks.includes("*")) {
      if (!powerup.frameworks.includes(config.framework)) {
        // Format framework names nicely
        const requiredFrameworks = powerup.frameworks.map((f) => {
          switch (f) {
            case "react":
              return "React";
            case "vue":
              return "Vue";
            case "angular":
              return "Angular";
            case "next":
              return "Next.js";
            case "nuxt":
              return "Nuxt";
            case "svelte":
              return "Svelte";
            case "solid":
              return "Solid";
            case "remix":
              return "Remix";
            case "astro":
              return "Astro";
            case "vite":
              return "Vite";
            default:
              return f;
          }
        });
        missingRequirements.push(`${requiredFrameworks.join(" or ")} framework`);
      }
    }

    // Check dependencies
    if (powerup.dependencies) {
      for (const dep of powerup.dependencies) {
        // Check if dependency is satisfied based on current config
        if (dep === "vite" && config.framework !== "vite") {
          missingRequirements.push("Vite framework");
        } else if (dep === "typescript" && !config.typescript) {
          missingRequirements.push("TypeScript");
        } else if (dep === "react" && !["react", "next", "remix"].includes(config.framework)) {
          missingRequirements.push("React-based framework");
        } else if (dep === "vue" && !["vue", "nuxt"].includes(config.framework)) {
          missingRequirements.push("Vue-based framework");
        }
        // Add more dependency checks as needed
      }
    }

    // Check if power-up is recommended for current stack
    let isRecommended = false;
    if (powerup.recommended) {
      const rec = powerup.recommended;
      isRecommended =
        rec.frameworks?.includes(config.framework) ||
        false ||
        rec.backends?.includes(config.backend) ||
        false ||
        rec.databases?.includes(config.database) ||
        false ||
        rec.styling?.includes(config.styling) ||
        false;
    }

    return {
      isAvailable: missingRequirements.length === 0,
      missingRequirements,
      isRecommended,
      recommendationReason: isRecommended ? powerup.recommended?.reason : undefined,
    };
  };

  // Get all power-ups with availability status
  const allPowerUpsWithStatus = powerUps.map((powerup) => {
    const status = getPowerUpStatus(powerup);
    return {
      ...powerup,
      ...status,
    };
  });

  // Filter available power-ups
  const availablePowerUps = allPowerUpsWithStatus.filter((p) => p.isAvailable);

  // Filter by category (show all power-ups including disabled ones when expanded)
  const filteredPowerUps = isExpanded
    ? allPowerUpsWithStatus.filter((powerup) => {
        if (selectedCategory === "all") return true;
        return powerup.category === selectedCategory;
      })
    : availablePowerUps;

  // Get count of additional power-ups beyond the basic 3
  const additionalPowerUpsCount = availablePowerUps.length;

  const togglePowerUp = (powerupId: string) => {
    const currentPowerups = config.powerups || [];
    if (currentPowerups.includes(powerupId)) {
      setConfig({
        ...config,
        powerups: currentPowerups.filter((id) => id !== powerupId),
      });
    } else {
      setConfig({
        ...config,
        powerups: [...currentPowerups, powerupId],
      });
    }
  };

  const isPowerUpSelected = (powerupId: string) => {
    return config.powerups?.includes(powerupId) || false;
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.7 }}
      className="comic-card"
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <FaTools className="text-3xl text-comic-darkBlue" />
          <h3 className="font-display text-2xl text-comic-darkBlue">POWER-UPS</h3>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-2 rounded-full hover:bg-comic-gray/20 transition-colors"
          aria-label={isExpanded ? "Collapse" : "Expand"}
        >
          {isExpanded ? <FaChevronUp className="text-xl" /> : <FaChevronDown className="text-xl" />}
        </button>
      </div>
      <div className="border-t-3 border-comic-gray mb-3"></div>
      <p className="font-comic text-sm mb-4 text-comic-gray">
        Supercharge your project with plugins and extensions - add development tools, testing,
        monitoring, and more
      </p>

      {/* Basic Power-ups (always visible) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
        <button
          onClick={() => setConfig({ ...config, typescript: !config.typescript })}
          className={`p-3 border-3 border-comic-black rounded-lg transition-all duration-200 transform hover:scale-105 h-[80px] flex flex-col ${
            config.typescript
              ? "bg-comic-yellow text-comic-black"
              : "bg-comic-white text-comic-black hover:bg-comic-gray/10"
          }`}
          style={{ boxShadow: "2px 2px 0 var(--comic-black)" }}
          title="Add type safety and better developer experience"
        >
          <div className="flex items-center gap-2 mb-1">
            <SiTypescript className="text-lg" />
            <span className="font-display text-sm">TypeScript</span>
          </div>
          <p className="font-comic text-xs text-left line-clamp-2">
            Add type safety and better developer experience
          </p>
        </button>

        <button
          onClick={() => setConfig({ ...config, git: !config.git })}
          className={`p-3 border-3 border-comic-black rounded-lg transition-all duration-200 transform hover:scale-105 h-[80px] flex flex-col ${
            config.git
              ? "bg-comic-yellow text-comic-black"
              : "bg-comic-white text-comic-black hover:bg-comic-gray/10"
          }`}
          style={{ boxShadow: "2px 2px 0 var(--comic-black)" }}
          title="Initialize version control with Git repository"
        >
          <div className="flex items-center gap-2 mb-1">
            <FaGitAlt className="text-lg" />
            <span className="font-display text-sm">Git</span>
          </div>
          <p className="font-comic text-xs text-left line-clamp-2">
            Initialize version control with Git repository
          </p>
        </button>

        <button
          onClick={() => setConfig({ ...config, docker: !config.docker })}
          className={`p-3 border-3 border-comic-black rounded-lg transition-all duration-200 transform hover:scale-105 h-[80px] flex flex-col ${
            config.docker
              ? "bg-comic-yellow text-comic-black"
              : "bg-comic-white text-comic-black hover:bg-comic-gray/10"
          }`}
          style={{ boxShadow: "2px 2px 0 var(--comic-black)" }}
          title="Add containerization support with Dockerfile"
        >
          <div className="flex items-center gap-2 mb-1">
            <FaDocker className="text-lg" />
            <span className="font-display text-sm">Docker</span>
          </div>
          <p className="font-comic text-xs text-left line-clamp-2">
            Add containerization support with Dockerfile
          </p>
        </button>
      </div>

      {/* Expand/Collapse button */}
      {additionalPowerUpsCount > 0 && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-comic-gray/10 hover:bg-comic-gray/20 rounded-lg transition-colors font-comic font-bold text-sm"
        >
          {isExpanded ? (
            <>
              <FaChevronUp className="text-sm" />
              Show Less
            </>
          ) : (
            <>
              <FaChevronDown className="text-sm" />
              Show {additionalPowerUpsCount} More Power-ups
            </>
          )}
        </button>
      )}

      {isExpanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Category Filter */}
          <div className="mb-4">
            <div className="flex flex-wrap gap-2 justify-center">
              <button
                onClick={() => setSelectedCategory("all")}
                className={`px-3 py-1 rounded-full text-xs font-comic font-bold transition-colors ${
                  selectedCategory === "all"
                    ? "bg-comic-yellow text-comic-black"
                    : "bg-comic-gray/20 hover:bg-comic-gray/30"
                }`}
              >
                All
              </button>
              {powerUpCategories.map((category) => {
                const Icon = category.icon;
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`px-3 py-1 rounded-full text-xs font-comic font-bold transition-colors flex items-center gap-1 ${
                      selectedCategory === category.id
                        ? "bg-comic-yellow text-comic-black"
                        : "bg-comic-gray/20 hover:bg-comic-gray/30"
                    }`}
                  >
                    <Icon className="text-sm" />
                    {category.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Power-ups Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {filteredPowerUps.map((powerup) => {
              const Icon = powerup.icon;
              const isSelected = isPowerUpSelected(powerup.id);
              const isAvailable = powerup.isAvailable;

              return (
                <Tooltip
                  key={powerup.id}
                  content={
                    isAvailable
                      ? powerup.isRecommended
                        ? `⭐ Recommended: ${powerup.recommendationReason}`
                        : powerup.description
                      : `🔒 Requires: ${powerup.missingRequirements?.join(", ")}`
                  }
                >
                  <button
                    onClick={() => isAvailable && togglePowerUp(powerup.id)}
                    disabled={!isAvailable}
                    className={`p-3 border-3 border-comic-black rounded-lg transition-all duration-200 transform relative w-full h-full min-h-[80px] flex flex-col ${
                      isAvailable ? "hover:scale-105" : "opacity-50 cursor-not-allowed"
                    } ${
                      isSelected
                        ? "bg-comic-yellow text-comic-black"
                        : isAvailable
                          ? "bg-comic-white text-comic-black hover:bg-comic-gray/10"
                          : "bg-comic-gray/20 text-comic-gray"
                    }`}
                    style={{
                      boxShadow: isAvailable
                        ? "2px 2px 0 var(--comic-black)"
                        : "1px 1px 0 var(--comic-gray)",
                    }}
                  >
                    {/* Recommended Badge */}
                    {isAvailable && powerup.isRecommended && (
                      <span className="absolute -top-2 -right-2 bg-comic-green text-comic-white text-[10px] font-comic font-bold px-2 py-0.5 rounded-full border-2 border-comic-black">
                        RECOMMENDED
                      </span>
                    )}
                    <div className="flex items-center gap-2 mb-1">
                      <Icon className={`text-lg ${!isAvailable ? "opacity-50" : ""}`} />
                      <span className="font-display text-sm">{powerup.name}</span>
                    </div>
                    <p className="font-comic text-xs text-left line-clamp-2">
                      {isAvailable
                        ? powerup.description
                        : `Requires ${powerup.missingRequirements?.join(" and ")}`}
                    </p>
                  </button>
                </Tooltip>
              );
            })}
          </div>

          {/* Selected Power-ups Summary */}
          {config.powerups && config.powerups.length > 0 && (
            <div className="mt-4 p-3 bg-comic-yellow/20 rounded-lg border-2 border-comic-yellow">
              <p className="font-comic text-sm font-bold mb-1">
                Selected: {config.powerups.length} power-ups
              </p>
              <p className="font-comic text-xs">
                {config.powerups
                  .map((id) => powerUps.find((p) => p.id === id)?.name)
                  .filter(Boolean)
                  .join(", ")}
              </p>
            </div>
          )}
        </motion.div>
      )}
    </motion.div>
  );
};

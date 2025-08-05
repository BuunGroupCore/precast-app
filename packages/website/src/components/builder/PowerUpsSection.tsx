import { motion } from "framer-motion";
import React, { useState } from "react";
import { FaChevronDown, FaChevronUp, FaTools } from "react-icons/fa";

import { powerUps, powerUpCategories } from "../../lib/powerups-config";

import type { ExtendedProjectConfig } from "./types";

interface PowerUpsSectionProps {
  config: ExtendedProjectConfig;
  setConfig: React.Dispatch<React.SetStateAction<ExtendedProjectConfig>>;
}

export const PowerUpsSection: React.FC<PowerUpsSectionProps> = ({ config, setConfig }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [isExpanded, setIsExpanded] = useState(false);

  // Filter power-ups by framework compatibility
  const availablePowerUps = powerUps.filter((powerup) => {
    if (!powerup.frameworks) return true;
    if (powerup.frameworks.includes("*")) return true;
    return powerup.frameworks.includes(config.framework);
  });

  // Filter by category
  const filteredPowerUps = availablePowerUps.filter((powerup) => {
    if (selectedCategory === "all") return true;
    return powerup.category === selectedCategory;
  });

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
      <div className="space-y-4 mb-4">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={config.typescript}
            onChange={(e) => setConfig({ ...config, typescript: e.target.checked })}
            className="w-6 h-6 rounded border-3 border-comic-black accent-comic-red"
          />
          <div className="flex items-center gap-2">
            <span className="font-comic font-bold">TypeScript</span>
          </div>
        </label>
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={config.git}
            onChange={(e) => setConfig({ ...config, git: e.target.checked })}
            className="w-6 h-6 rounded border-3 border-comic-black accent-comic-red"
          />
          <div className="flex items-center gap-2">
            <span className="font-comic font-bold">Git</span>
          </div>
        </label>
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={config.docker}
            onChange={(e) => setConfig({ ...config, docker: e.target.checked })}
            className="w-6 h-6 rounded border-3 border-comic-black accent-comic-red"
          />
          <div className="flex items-center gap-2">
            <span className="font-comic font-bold">Docker</span>
          </div>
        </label>
      </div>

      {isExpanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Category Filter */}
          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
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
              return (
                <button
                  key={powerup.id}
                  onClick={() => togglePowerUp(powerup.id)}
                  className={`p-3 border-3 border-comic-black rounded-lg transition-all duration-200 transform hover:scale-105 ${
                    isSelected
                      ? "bg-comic-yellow text-comic-black"
                      : "bg-comic-white text-comic-black hover:bg-comic-gray/10"
                  }`}
                  style={{ boxShadow: "2px 2px 0 var(--comic-black)" }}
                  title={powerup.description}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Icon className="text-lg" />
                    <span className="font-display text-sm">{powerup.name}</span>
                  </div>
                  <p className="font-comic text-xs text-left line-clamp-2">{powerup.description}</p>
                </button>
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

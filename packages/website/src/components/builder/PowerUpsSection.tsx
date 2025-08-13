import { motion } from "framer-motion";
import React, { useState } from "react";
import {
  FaChevronDown,
  FaChevronUp,
  FaTools,
  FaGitAlt,
  FaDocker,
  FaStar,
  FaInfoCircle,
} from "react-icons/fa";
import { SiTypescript } from "react-icons/si";

import { ComicTooltip } from "@/components/ui/ComicTooltip";
import { powerUps, powerUpCategories } from "@/lib/powerups-config";

import { BuilderIcon } from "./BuilderIcon";
import type { ExtendedProjectConfig } from "./types";

interface PowerUpsSectionProps {
  config: ExtendedProjectConfig;
  setConfig: React.Dispatch<React.SetStateAction<ExtendedProjectConfig>>;
  handleDockerToggle?: () => void;
}

/**
 * Power-ups selection component with dependency validation and categorization.
 * Shows available extensions and tools based on current stack configuration.
 */
export const PowerUpsSection: React.FC<PowerUpsSectionProps> = ({
  config,
  setConfig,
  handleDockerToggle,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [isExpanded, setIsExpanded] = useState(false);
  const [showTunnelingSuggestion, setShowTunnelingSuggestion] = useState(false);
  const [suggestedPowerUps, setSuggestedPowerUps] = useState<string[]>([]);

  const getPowerUpStatus = (powerup: (typeof powerUps)[0]) => {
    const missingRequirements: string[] = [];

    if (powerup.frameworks && !powerup.frameworks.includes("*")) {
      if (!powerup.frameworks.includes(config.framework)) {
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

    if (powerup.dependencies) {
      for (const dep of powerup.dependencies) {
        if (dep === "vite" && config.framework !== "vite") {
          missingRequirements.push("Vite framework");
        } else if (dep === "typescript" && !config.typescript) {
          missingRequirements.push("TypeScript");
        } else if (dep === "react" && !["react", "next", "remix"].includes(config.framework)) {
          missingRequirements.push("React-based framework");
        } else if (dep === "vue" && !["vue", "nuxt"].includes(config.framework)) {
          missingRequirements.push("Vue-based framework");
        }
      }
    }

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

  const allPowerUpsWithStatus = powerUps.map((powerup) => {
    const status = getPowerUpStatus(powerup);
    return {
      ...powerup,
      ...status,
    };
  });

  const availablePowerUps = allPowerUpsWithStatus.filter((p) => p.isAvailable);

  const filteredPowerUps = isExpanded
    ? allPowerUpsWithStatus.filter((powerup) => {
        if (selectedCategory === "all") return true;
        return powerup.category === selectedCategory;
      })
    : availablePowerUps;

  const additionalPowerUpsCount = availablePowerUps.length;

  const togglePowerUp = (powerupId: string) => {
    const currentPowerups = config.powerups || [];

    // Check if user is selecting ngrok or cloudflare-tunnel
    if (!currentPowerups.includes(powerupId)) {
      if (powerupId === "ngrok" || powerupId === "cloudflare-tunnel") {
        const hasTraefik = currentPowerups.includes("traefik");
        const hasOtherTunnel =
          powerupId === "ngrok"
            ? currentPowerups.includes("cloudflare-tunnel")
            : currentPowerups.includes("ngrok");

        // If they don't have Traefik or another tunnel, suggest them
        if (!hasTraefik && !hasOtherTunnel && config.backend !== "none") {
          setSuggestedPowerUps(["traefik"]);
          setShowTunnelingSuggestion(true);
        }

        // Enable Docker automatically for tunneling solutions
        if (!config.docker) {
          if (handleDockerToggle) {
            handleDockerToggle();
          } else {
            setConfig((prev) => ({ ...prev, docker: true }));
          }
        }
      }

      setConfig({
        ...config,
        powerups: [...currentPowerups, powerupId],
      });
    } else {
      setConfig({
        ...config,
        powerups: currentPowerups.filter((id) => id !== powerupId),
      });
    }
  };

  const isPowerUpSelected = (powerupId: string) => {
    return config.powerups?.includes(powerupId) || false;
  };

  // Highlight suggested PowerUps
  const isSuggested = (powerupId: string) => {
    return suggestedPowerUps.includes(powerupId);
  };

  // Check if PowerUp enhances tunneling
  const enhancesTunneling = (powerupId: string) => {
    const currentPowerups = config.powerups || [];
    const hasTunnel =
      currentPowerups.includes("ngrok") || currentPowerups.includes("cloudflare-tunnel");

    if (hasTunnel) {
      // Traefik enhances tunneling for routing
      if (powerupId === "traefik") return true;
      // If ngrok is selected, cloudflare-tunnel is an alternative
      if (currentPowerups.includes("ngrok") && powerupId === "cloudflare-tunnel") return false;
      // If cloudflare-tunnel is selected, ngrok is an alternative
      if (currentPowerups.includes("cloudflare-tunnel") && powerupId === "ngrok") return false;
    }

    return false;
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
          <BuilderIcon icon={FaTools} className="text-3xl text-comic-darkBlue" />
          <h3 className="font-display text-2xl text-comic-darkBlue">POWER-UPS</h3>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-2 rounded-full hover:bg-comic-gray/20 transition-colors"
          aria-label={isExpanded ? "Collapse" : "Expand"}
        >
          {isExpanded ? (
            <BuilderIcon icon={FaChevronUp} className="text-xl" />
          ) : (
            <BuilderIcon icon={FaChevronDown} className="text-xl" />
          )}
        </button>
      </div>
      <div className="border-t-3 border-comic-gray mb-3"></div>
      <p className="font-comic text-sm mb-4 text-comic-gray">
        Supercharge your project with plugins and extensions - add development tools, testing,
        monitoring, and more
      </p>

      {/* Tunneling Suggestion Notification */}
      {showTunnelingSuggestion && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-3 bg-comic-yellow/20 border-2 border-comic-yellow rounded-lg"
        >
          <div className="flex items-start gap-2">
            <BuilderIcon icon={FaInfoCircle} className="text-comic-darkBlue mt-1" />
            <div className="flex-1">
              <p className="font-comic text-sm text-comic-darkBlue mb-2">
                <strong>Pro Tip:</strong> For the best tunneling experience with your backend, we
                recommend adding <strong>Traefik</strong> for advanced routing and load balancing.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setConfig({
                      ...config,
                      powerups: [...(config.powerups || []), "traefik"],
                    });
                    setShowTunnelingSuggestion(false);
                    setSuggestedPowerUps([]);
                  }}
                  className="px-3 py-1 bg-comic-green text-comic-white rounded font-comic text-xs font-bold hover:bg-comic-darkGreen transition-colors"
                >
                  Add Traefik
                </button>
                <button
                  onClick={() => {
                    setShowTunnelingSuggestion(false);
                    setSuggestedPowerUps([]);
                  }}
                  className="px-3 py-1 bg-comic-gray/30 text-comic-darkBlue rounded font-comic text-xs font-bold hover:bg-comic-gray/40 transition-colors"
                >
                  Continue Without
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}

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
          <div className="flex items-center gap-2 mb-1 pr-1">
            <BuilderIcon icon={SiTypescript} className="text-lg" />
            <span className="font-display text-sm">TypeScript</span>
          </div>
          <p className="font-comic text-xs text-left line-clamp-2 pr-1">
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
          <div className="flex items-center gap-2 mb-1 pr-1">
            <BuilderIcon icon={FaGitAlt} className="text-lg" />
            <span className="font-display text-sm">Git</span>
          </div>
          <p className="font-comic text-xs text-left line-clamp-2 pr-1">
            Initialize version control with Git repository
          </p>
        </button>

        <button
          onClick={() => {
            if (handleDockerToggle) {
              handleDockerToggle();
            } else {
              setConfig({ ...config, docker: !config.docker });
            }
          }}
          className={`p-3 border-3 border-comic-black rounded-lg transition-all duration-200 transform hover:scale-105 h-[80px] flex flex-col ${
            config.docker
              ? "bg-comic-yellow text-comic-black"
              : "bg-comic-white text-comic-black hover:bg-comic-gray/10"
          }`}
          style={{ boxShadow: "2px 2px 0 var(--comic-black)" }}
          title="Add containerization support with Dockerfile"
        >
          <div className="flex items-center gap-2 mb-1 pr-1">
            <BuilderIcon icon={FaDocker} className="text-lg" />
            <span className="font-display text-sm">Docker</span>
          </div>
          <p className="font-comic text-xs text-left line-clamp-2 pr-1">
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
              <BuilderIcon icon={FaChevronUp} className="text-sm" />
              Show Less
            </>
          ) : (
            <>
              <BuilderIcon icon={FaChevronDown} className="text-sm" />
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
                    <BuilderIcon icon={Icon} className="text-sm" />
                    {category.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Power-ups Grid */}
          <div className="grid grid-cols-1 min-[320px]:grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
            {filteredPowerUps.map((powerup) => {
              const Icon = powerup.icon;
              const isSelected = isPowerUpSelected(powerup.id);
              const isAvailable = powerup.isAvailable;
              const isPowerUpSuggested = isSuggested(powerup.id);
              const enhances = enhancesTunneling(powerup.id);

              return (
                <ComicTooltip
                  key={powerup.id}
                  content={
                    isAvailable
                      ? enhances
                        ? `⭐ Works great with tunneling solutions for better routing!`
                        : powerup.isRecommended
                          ? `⭐ Recommended: ${powerup.recommendationReason}`
                          : powerup.description
                      : `🔒 Requires: ${powerup.missingRequirements?.join(", ")}`
                  }
                >
                  <button
                    onClick={() => isAvailable && togglePowerUp(powerup.id)}
                    disabled={!isAvailable}
                    className={`p-3 border-3 rounded-lg transition-all duration-200 transform relative w-full h-full min-h-[80px] flex flex-col overflow-hidden ${
                      isAvailable ? "hover:scale-105" : "opacity-50 cursor-not-allowed"
                    } ${
                      isSelected
                        ? "bg-comic-yellow text-comic-black"
                        : isPowerUpSuggested || enhances
                          ? "bg-comic-green/20 text-comic-black hover:bg-comic-green/30"
                          : isAvailable
                            ? "bg-comic-white text-comic-black hover:bg-comic-gray/10"
                            : "bg-comic-gray/20 text-comic-gray"
                    } ${
                      isPowerUpSuggested || enhances
                        ? "border-comic-green animate-pulse"
                        : "border-comic-black"
                    }`}
                    style={{
                      boxShadow: isAvailable
                        ? isPowerUpSuggested || enhances
                          ? "3px 3px 0 var(--comic-green)"
                          : "2px 2px 0 var(--comic-black)"
                        : "1px 1px 0 var(--comic-gray)",
                    }}
                  >
                    {/* Badges - positioned inside to prevent overflow */}
                    <div className="absolute top-1 right-1 flex gap-1 flex-wrap justify-end">
                      {(isPowerUpSuggested || enhances) && (
                        <span className="text-comic-yellow text-lg animate-pulse">
                          <BuilderIcon icon={FaStar} />
                        </span>
                      )}
                      {powerup.beta && (
                        <span className="bg-comic-purple text-comic-white text-[9px] font-comic font-bold px-1.5 py-0.5 rounded-full border border-comic-black">
                          BETA
                        </span>
                      )}
                      {isAvailable && powerup.isRecommended && !enhances && (
                        <span className="bg-comic-green text-comic-white text-[9px] font-comic font-bold px-1.5 py-0.5 rounded-full border border-comic-black hidden min-[320px]:inline">
                          REC
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mb-1 flex-shrink-0 pr-1">
                      <BuilderIcon
                        icon={Icon}
                        className={`text-lg flex-shrink-0 ${!isAvailable ? "opacity-50" : ""}`}
                      />
                      <span className="font-display text-sm truncate pr-1">{powerup.name}</span>
                    </div>
                    <p className="font-comic text-xs text-left line-clamp-2 pr-1">
                      {isAvailable
                        ? powerup.description
                        : `Requires ${powerup.missingRequirements?.join(" and ")}`}
                    </p>
                  </button>
                </ComicTooltip>
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

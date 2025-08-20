import { motion, AnimatePresence } from "framer-motion";
import React, { useState } from "react";
import {
  FaPlug,
  FaCheck,
  FaExternalLinkAlt,
  FaChevronDown,
  FaChevronUp,
  FaStar,
  FaLock,
  FaKey,
  FaBolt,
} from "react-icons/fa";

import {
  plugins,
  pluginCategories,
  getPluginsByCategory,
  isPluginCompatible,
  getRecommendedPlugins,
} from "@/lib/plugins-config";

import { BuilderIcon } from "./BuilderIcon";
import { CollapsibleSection } from "./CollapsibleSection";
import type { ExtendedProjectConfig } from "./types";

interface PluginsSectionProps {
  config: ExtendedProjectConfig;
  setConfig: React.Dispatch<React.SetStateAction<ExtendedProjectConfig>>;
}

/**
 * Business plugins selection component with comic book styling.
 * Shows production-ready integrations for payments, email, real-time, and more.
 */
export function PluginsSection({ config, setConfig }: PluginsSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [expandedPlugin, setExpandedPlugin] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const selectedPlugins = config.plugins || [];
  const recommendedPlugins = getRecommendedPlugins(config.framework, config.backend);

  const handlePluginToggle = (pluginId: string) => {
    const newPlugins = selectedPlugins.includes(pluginId)
      ? selectedPlugins.filter((id) => id !== pluginId)
      : [...selectedPlugins, pluginId];

    // Only update the plugins field, preserve everything else
    setConfig((prevConfig) => ({
      ...prevConfig,
      plugins: newPlugins,
    }));
  };

  const allPlugins = selectedCategory === "all" ? plugins : getPluginsByCategory(selectedCategory);

  const compatiblePlugins = allPlugins.filter((plugin) =>
    isPluginCompatible(plugin, config.framework, config.backend)
  );

  const incompatibleCount = allPlugins.length - compatiblePlugins.length;

  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.7 }}
    >
      <CollapsibleSection
        icon={
          <div className="p-2 bg-comic-purple rounded-lg transform -rotate-3">
            <BuilderIcon icon={FaPlug} className="text-3xl text-white" />
          </div>
        }
        title={
          <div>
            <h3 className="font-display text-2xl text-comic-darkBlue">BUSINESS PLUGINS</h3>
            {selectedPlugins.length > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="ml-3 px-3 py-1 bg-comic-purple text-white rounded-full font-comic font-bold text-sm transform rotate-3 inline-block"
              >
                {selectedPlugins.length} ACTIVE!
              </motion.span>
            )}
          </div>
        }
      >
        {/* Description */}
        <p className="font-comic text-sm mb-4 text-comic-gray">
          Level up your app with payment processing, email services, real-time features, and more!
        </p>

        {/* Recommended Plugins - Comic Style Banner */}
        {recommendedPlugins.length > 0 && !isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="comic-panel bg-comic-yellow/20 border-3 border-comic-yellow mb-4 p-3 transform -rotate-1"
          >
            <div className="flex items-center gap-2 mb-2">
              <BuilderIcon icon={FaStar} className="text-comic-yellow text-xl" />
              <h4 className="font-display text-sm text-comic-darkBlue">
                RECOMMENDED FOR YOUR STACK!
              </h4>
            </div>
            <div className="flex flex-wrap gap-2">
              {recommendedPlugins.map((plugin) => {
                const Icon = plugin.icon;
                const isSelected = selectedPlugins.includes(plugin.id);
                return (
                  <motion.button
                    key={plugin.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handlePluginToggle(plugin.id)}
                    className={`px-3 py-2 rounded-lg border-2 border-comic-black transition-all flex items-center gap-2 ${
                      isSelected
                        ? "bg-comic-purple text-white"
                        : "bg-white hover:bg-comic-yellow/30"
                    }`}
                    style={{ boxShadow: "2px 2px 0 var(--comic-black)" }}
                  >
                    <BuilderIcon icon={Icon} className="text-lg" />
                    <span className="font-comic font-bold text-xs">{plugin.name}</span>
                    {isSelected && <BuilderIcon icon={FaCheck} className="text-sm" />}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Show More Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-comic-purple/10 hover:bg-comic-purple/20 rounded-lg transition-colors font-comic font-bold text-sm mb-4"
        >
          {isExpanded ? (
            <>
              <BuilderIcon icon={FaChevronUp} className="text-sm" />
              Hide Plugins
            </>
          ) : (
            <>
              <BuilderIcon icon={FaChevronDown} className="text-sm" />
              Show All {plugins.length} Plugins
            </>
          )}
        </button>

        {/* Expanded Content */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Category Filter - Comic Style Pills */}
              <div className="mb-4">
                <div className="flex flex-wrap gap-2 justify-center">
                  <button
                    onClick={() => setSelectedCategory("all")}
                    className={`px-4 py-2 rounded-full font-comic font-bold text-xs transition-all transform hover:scale-105 ${
                      selectedCategory === "all"
                        ? "bg-comic-purple text-white"
                        : "bg-comic-gray/20 hover:bg-comic-gray/30"
                    }`}
                    style={
                      selectedCategory === "all"
                        ? { boxShadow: "2px 2px 0 var(--comic-black)" }
                        : {}
                    }
                  >
                    ALL
                  </button>
                  {pluginCategories.map((category) => {
                    const Icon = category.icon;
                    return (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        className={`px-4 py-2 rounded-full font-comic font-bold text-xs transition-all transform hover:scale-105 flex items-center gap-1 ${
                          selectedCategory === category.id
                            ? "bg-comic-purple text-white"
                            : "bg-comic-gray/20 hover:bg-comic-gray/30"
                        }`}
                        style={
                          selectedCategory === category.id
                            ? { boxShadow: "2px 2px 0 var(--comic-black)" }
                            : {}
                        }
                      >
                        <Icon className="text-sm" />
                        {category.name.toUpperCase()}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Plugin Cards Grid - Comic Style */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pr-4">
                {compatiblePlugins.map((plugin) => {
                  const isSelected = selectedPlugins.includes(plugin.id);
                  const isExpanded = expandedPlugin === plugin.id;
                  const Icon = plugin.icon;
                  const isRecommended = recommendedPlugins.some((p) => p.id === plugin.id);

                  return (
                    <motion.div
                      key={plugin.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      whileHover={{ scale: 1.02, rotate: 0.5 }}
                      className={`comic-panel p-4 pb-6 border-3 border-comic-black rounded-lg transition-all cursor-pointer relative ${
                        isSelected
                          ? "bg-gradient-to-br from-comic-purple/20 to-comic-purple/10"
                          : "bg-white hover:bg-comic-gray/5"
                      }`}
                      style={{
                        boxShadow: isSelected
                          ? "4px 4px 0 var(--comic-purple)"
                          : "3px 3px 0 var(--comic-black)",
                      }}
                      onClick={() => handlePluginToggle(plugin.id)}
                    >
                      {/* Selected Badge */}
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 12 }}
                          className="absolute -top-2 -right-2 z-10"
                        >
                          <div className="w-8 h-8 bg-comic-green rounded-full flex items-center justify-center border-2 border-comic-black">
                            <BuilderIcon icon={FaCheck} className="text-white text-sm" />
                          </div>
                        </motion.div>
                      )}

                      {/* Recommended Badge */}
                      {isRecommended && (
                        <motion.div
                          initial={{ rotate: 0 }}
                          animate={{ rotate: [-5, 5, -5] }}
                          transition={{ repeat: Infinity, duration: 2 }}
                          className="absolute -top-2 -left-2"
                        >
                          <div className="bg-comic-yellow px-2 py-1 rounded-full border-2 border-comic-black transform -rotate-12">
                            <BuilderIcon icon={FaStar} className="text-comic-black text-xs" />
                          </div>
                        </motion.div>
                      )}

                      {/* Plugin Content */}
                      <div className="flex items-start gap-3">
                        <motion.div
                          whileHover={{ rotate: 360 }}
                          transition={{ duration: 0.5 }}
                          className={`p-3 rounded-lg ${
                            isSelected ? "bg-comic-purple/30" : "bg-comic-gray/10"
                          }`}
                        >
                          <BuilderIcon icon={Icon} className="text-2xl text-comic-purple" />
                        </motion.div>

                        <div className="flex-1 min-w-0 pr-2">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-display text-lg">{plugin.name}</h4>
                            <span
                              className={`px-2 py-0.5 rounded-full text-xs font-comic font-bold ${
                                plugin.pricing === "free"
                                  ? "bg-comic-green text-white"
                                  : plugin.pricing === "freemium"
                                    ? "bg-comic-blue text-white"
                                    : "bg-comic-orange text-white"
                              }`}
                            >
                              {plugin.pricing.toUpperCase()}
                            </span>
                          </div>

                          <p className="font-comic text-xs text-comic-gray mb-3">
                            {plugin.description}
                          </p>

                          <div className="flex items-center justify-between gap-2 mb-2">
                            {/* Environment Variables Badge */}
                            {plugin.envVariables.length > 0 && (
                              <div className="inline-flex items-center gap-1 px-2 py-1 bg-comic-gray/10 rounded">
                                <BuilderIcon icon={FaKey} className="text-xs text-comic-darkBlue" />
                                <p className="font-comic text-xs text-comic-darkBlue">
                                  {plugin.envVariables.length} ENV VAR
                                  {plugin.envVariables.length > 1 ? "S" : ""}
                                </p>
                              </div>
                            )}

                            {/* Expand Button */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setExpandedPlugin(isExpanded ? null : plugin.id);
                              }}
                              className="text-xs text-comic-purple hover:text-comic-darkBlue font-comic font-bold flex-shrink-0"
                            >
                              {isExpanded ? "HIDE DETAILS ▲" : "SHOW DETAILS ▼"}
                            </button>
                          </div>

                          {/* Expanded Details */}
                          <AnimatePresence>
                            {isExpanded && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="mt-3 space-y-3 overflow-hidden pr-2 pb-2"
                                onClick={(e) => e.stopPropagation()}
                              >
                                {/* Quick Start Steps */}
                                {plugin.quickstartSteps && (
                                  <div className="comic-panel bg-comic-yellow/10 p-2 rounded border-2 border-dashed border-comic-yellow">
                                    <div className="flex items-center gap-1 mb-2">
                                      <FaBolt className="text-xs text-comic-darkBlue" />
                                      <p className="font-display text-xs text-comic-darkBlue">
                                        QUICK START:
                                      </p>
                                    </div>
                                    <ol className="font-comic text-xs space-y-1">
                                      {plugin.quickstartSteps.map((step: string, index: number) => (
                                        <li key={index} className="flex gap-2">
                                          <span className="font-bold text-comic-purple">
                                            {index + 1}.
                                          </span>
                                          <span>{step}</span>
                                        </li>
                                      ))}
                                    </ol>
                                  </div>
                                )}

                                {/* Links */}
                                <div className="flex flex-wrap gap-2 pt-1">
                                  {plugin.documentationUrl && (
                                    <a
                                      href={plugin.documentationUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="flex items-center gap-1 px-3 py-2 bg-comic-blue text-white rounded-full font-comic font-bold text-xs hover:bg-comic-darkBlue transition-colors"
                                      style={{ boxShadow: "2px 2px 0 var(--comic-black)" }}
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      DOCS
                                      <FaExternalLinkAlt className="text-xs" />
                                    </a>
                                  )}
                                  {plugin.setupUrl && (
                                    <a
                                      href={plugin.setupUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="flex items-center gap-1 px-3 py-2 bg-comic-purple text-white rounded-full font-comic font-bold text-xs hover:bg-comic-darkPurple transition-colors"
                                      style={{ boxShadow: "2px 2px 0 var(--comic-black)" }}
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      SETUP
                                      <FaExternalLinkAlt className="text-xs" />
                                    </a>
                                  )}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Incompatible Plugins Notice - Comic Style Alert */}
              {incompatibleCount > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 comic-panel bg-comic-orange/10 border-3 border-comic-orange p-3 rounded-lg transform rotate-1"
                >
                  <div className="flex items-start gap-2">
                    <FaLock className="text-comic-orange text-xl mt-1" />
                    <div>
                      <p className="font-display text-sm text-comic-darkBlue">
                        {incompatibleCount} PLUGIN{incompatibleCount > 1 ? "S" : ""} LOCKED!
                      </p>
                      <p className="font-comic text-xs text-comic-gray mt-1">
                        {!config.backend || config.backend === "none"
                          ? "Some plugins need a backend to work their magic!"
                          : "These plugins aren't compatible with your current stack."}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Bottom Collapse Button */}
              <button
                onClick={() => setIsExpanded(false)}
                className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-comic-gray/10 hover:bg-comic-gray/20 rounded-lg transition-colors font-comic font-bold text-sm mt-4"
              >
                <FaChevronUp className="text-sm" />
                Collapse Plugins
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </CollapsibleSection>
    </motion.div>
  );
}

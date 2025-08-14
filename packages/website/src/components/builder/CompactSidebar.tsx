import { motion, AnimatePresence } from "framer-motion";
import React, { useState } from "react";
import {
  FaTerminal,
  FaLayerGroup,
  FaRocket,
  FaCopy,
  FaCheck,
  FaMagic,
  FaHistory,
  FaSave,
  FaDocker,
  FaSearch,
} from "react-icons/fa";
import { SiTypescript } from "react-icons/si";

import { CommandSyntaxHighlight } from "./CommandSyntaxHighlight";
import { StackSummarySection } from "./StackSummarySection";
import type { ExtendedProjectConfig } from "./types";

interface CompactSidebarProps {
  config: ExtendedProjectConfig;
  setConfig: React.Dispatch<React.SetStateAction<ExtendedProjectConfig>>;
  generateCommand: () => string;
  copyToClipboard: () => void;
  terminalCopied: boolean;
  packageManager: string;
  setPackageManager: (pm: string) => void;
  saveProject?: () => void;
  resetToDefaults?: () => void;
  showPreferredStacks?: () => void;
  saved?: boolean;
  handleDockerToggle?: () => void;
}

type TabType = "command" | "stack" | "actions";

/**
 * Compact sidebar component that displays command generation, stack summary, and quick actions.
 * Features tabbed interface for better organization of project configuration options.
 */
export const CompactSidebar: React.FC<CompactSidebarProps> = ({
  config,
  setConfig,
  generateCommand,
  copyToClipboard,
  terminalCopied,
  packageManager,
  setPackageManager,
  saveProject,
  resetToDefaults,
  showPreferredStacks,
  saved = false,
  handleDockerToggle,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>("command");
  const [searchTerm, setSearchTerm] = useState("");

  const techSearchMap: Record<string, string> = {
    react: "framework",
    vue: "framework",
    svelte: "framework",
    next: "framework",
    remix: "framework",
    astro: "framework",
    vite: "framework",
    vanilla: "framework",
    "tanstack-start": "framework",
    "react-router": "framework",
    "tanstack-router": "framework",

    express: "backend",
    hono: "backend",
    nodejs: "backend",
    fastapi: "backend",
    nextjs: "backend",
    "cloudflare-workers": "backend",
    workers: "backend",

    postgres: "database",
    postgresql: "database",
    mysql: "database",
    mongodb: "database",
    "cloudflare-d1": "database",
    d1: "database",

    // ORMs (available - route to database section since ORM is selected there)
    prisma: "database",
    drizzle: "database",
    typeorm: "database",
    mongoose: "database",

    // Styling (all available)
    tailwind: "styling",
    css: "styling",
    scss: "styling",
    sass: "styling",
    "styled-components": "styling",

    // Design (color palettes, themes, visual customization)
    design: "design",
    color: "design",
    palette: "design",
    theme: "design",
    colors: "design",
    branding: "design",
    visual: "design",

    // Auth (available)
    authentication: "auth",
    "better-auth": "auth",
    "auth.js": "auth",
    authjs: "auth",
    nextauth: "auth",
    passport: "auth",
    lucia: "auth",

    // Runtimes
    runtime: "runtime",
    node: "runtime",
    bun: "runtime",
    deno: "runtime",

    // Other features
    docker: "feature",
    git: "feature",
    typescript: "feature",
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);

    if (term.length < 2) return;

    const lowerTerm = term.toLowerCase();
    const matchedKey = Object.keys(techSearchMap).find(
      (key) => key === lowerTerm || key.includes(lowerTerm) || lowerTerm.includes(key)
    );

    if (matchedKey) {
      const sectionType = techSearchMap[matchedKey];
      // Scroll to the matching section
      const sectionElement = document.querySelector(`[data-section="${sectionType}"]`);
      if (sectionElement) {
        sectionElement.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });

        // Add highlight effect
        sectionElement.classList.add("ring-4", "ring-comic-yellow", "ring-opacity-50");
        setTimeout(() => {
          sectionElement.classList.remove("ring-4", "ring-comic-yellow", "ring-opacity-50");
        }, 2000);
      }
    }
  };

  const getSearchSuggestions = () => {
    if (searchTerm.length < 1) return [];

    const lowerTerm = searchTerm.toLowerCase();
    return Object.keys(techSearchMap)
      .filter((key) => key.includes(lowerTerm))
      .slice(0, 5);
  };

  const tabs = [
    { id: "command" as TabType, label: "COMMAND", icon: FaTerminal },
    { id: "stack" as TabType, label: "STACK", icon: FaLayerGroup },
    { id: "actions" as TabType, label: "QUICK", icon: FaRocket },
  ];

  return (
    <div
      className="comic-panel bg-comic-darkBlue border-4 border-comic-black overflow-hidden"
      role="tabpanel"
    >
      {/* Tab Navigation */}
      <nav
        className="flex border-b-2 border-comic-black bg-comic-black"
        role="tablist"
        aria-label="Sidebar navigation"
      >
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex-1 py-3 px-2 font-display text-xs sm:text-sm
                transition-all duration-200 relative focus:ring-2 focus:ring-comic-yellow focus:ring-offset-2
                ${
                  activeTab === tab.id
                    ? "bg-comic-darkBlue text-comic-white"
                    : "bg-comic-darkGray text-comic-white/60 hover:bg-comic-darkBlue/50"
                }
              `}
              role="tab"
              aria-selected={activeTab === tab.id}
              aria-controls={`panel-${tab.id}`}
              id={`tab-${tab.id}`}
            >
              <div className="flex items-center justify-center gap-1 sm:gap-2">
                <Icon className="text-xs sm:text-base" aria-hidden="true" />
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sr-only sm:hidden">{tab.label} tab</span>
              </div>
              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-1 bg-comic-yellow"
                  aria-hidden="true"
                />
              )}
            </button>
          );
        })}
      </nav>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === "command" && (
          <motion.div
            key="command"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="p-4"
            role="tabpanel"
            id="panel-command"
            aria-labelledby="tab-command"
          >
            {/* Quick Search */}
            <div className="mb-4">
              <label htmlFor="tech-search" className="sr-only">
                Search technologies
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="h-3 w-3 text-comic-white/60" aria-hidden="true" />
                </div>
                <input
                  id="tech-search"
                  type="text"
                  placeholder="Search tech (react, postgres, etc.)"
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 bg-comic-white/10 border-2 border-comic-white/20 rounded text-comic-white placeholder-comic-white/60 font-comic text-xs focus:border-comic-yellow focus:ring-1 focus:ring-comic-yellow focus:outline-none transition-colors"
                  aria-describedby="search-help"
                />
              </div>
              <div id="search-help" className="sr-only">
                Search for technologies like React, PostgreSQL, Tailwind CSS to quickly navigate to
                their configuration section
              </div>

              {/* Search Suggestions */}
              {searchTerm.length > 0 && getSearchSuggestions().length > 0 && (
                <div
                  className="mt-2 bg-comic-black/80 border border-comic-white/20 rounded p-2"
                  role="list"
                  aria-label="Search suggestions"
                >
                  <div className="flex flex-wrap gap-1">
                    {getSearchSuggestions().map((suggestion) => (
                      <button
                        key={suggestion}
                        onClick={() => handleSearch(suggestion)}
                        className="px-2 py-1 text-xs font-comic bg-comic-white/10 text-comic-white rounded hover:bg-comic-yellow hover:text-comic-black focus:ring-2 focus:ring-comic-yellow focus:ring-offset-2 transition-colors"
                        role="listitem"
                        aria-label={`Search for ${suggestion}`}
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Package Manager Quick Select */}
            <fieldset className="mb-4">
              <legend className="sr-only">Select package manager</legend>
              <div className="flex gap-1" role="radiogroup" aria-labelledby="pm-heading">
                <div id="pm-heading" className="sr-only">
                  Package Manager
                </div>
                {["npx", "npm", "yarn", "pnpm", "bun"].map((pm) => (
                  <button
                    key={pm}
                    onClick={() => setPackageManager(pm)}
                    className={`
                      px-2 py-1 text-xs font-comic rounded
                      transition-all duration-200 focus:ring-2 focus:ring-comic-yellow focus:ring-offset-2
                      ${
                        packageManager === pm
                          ? "bg-comic-yellow text-comic-black border-2 border-comic-black"
                          : "bg-comic-white/10 text-comic-white border-2 border-comic-white/20 hover:bg-comic-white/20"
                      }
                    `}
                    role="radio"
                    aria-checked={packageManager === pm}
                    aria-label={`Use ${pm} package manager`}
                  >
                    {pm}
                  </button>
                ))}
              </div>
            </fieldset>

            {/* Command Display */}
            <div
              className="bg-comic-black p-4 rounded cursor-pointer hover:bg-gray-900 transition-colors focus:ring-2 focus:ring-comic-yellow focus:ring-offset-2"
              onClick={copyToClipboard}
              role="button"
              tabIndex={0}
              aria-label="Click to copy command to clipboard"
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  copyToClipboard();
                }
              }}
            >
              <div className="flex items-start gap-2">
                <span className="text-comic-green font-bold" aria-hidden="true">
                  $
                </span>
                <div className="font-comic text-xs sm:text-sm break-all leading-relaxed flex-1">
                  <CommandSyntaxHighlight command={generateCommand()} />
                </div>
              </div>
            </div>

            {/* Copy Button */}
            <button
              onClick={copyToClipboard}
              className="w-full mt-3 py-2 bg-comic-red text-comic-white font-display text-sm rounded border-2 border-comic-black hover:bg-comic-yellow hover:text-comic-black focus:ring-2 focus:ring-comic-yellow focus:ring-offset-2 transition-colors flex items-center justify-center gap-2"
              aria-label={
                terminalCopied ? "Command copied to clipboard" : "Copy command to clipboard"
              }
            >
              {terminalCopied ? (
                <>
                  <FaCheck aria-hidden="true" /> COPIED!
                </>
              ) : (
                <>
                  <FaCopy aria-hidden="true" /> COPY COMMAND
                </>
              )}
            </button>

            {/* Stats Mini Bar */}
            <div className="mt-4 grid grid-cols-3 gap-2 text-center">
              <div className="bg-comic-white/10 p-2 rounded">
                <div className="font-display text-lg text-comic-yellow">
                  {config.framework !== "vanilla" ? 1 : 0}
                </div>
                <div className="font-comic text-[10px] text-comic-white/60">FRONTEND</div>
              </div>
              <div className="bg-comic-white/10 p-2 rounded">
                <div className="font-display text-lg text-comic-green">
                  {config.backend !== "none" ? 1 : 0}
                </div>
                <div className="font-comic text-[10px] text-comic-white/60">BACKEND</div>
              </div>
              <div className="bg-comic-white/10 p-2 rounded">
                <div className="font-display text-lg text-comic-blue">
                  {(config.plugins?.length || 0) + (config.powerups?.length || 0)}
                </div>
                <div className="font-comic text-[10px] text-comic-white/60">EXTRAS</div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === "stack" && (
          <motion.div
            key="stack"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="p-4"
            role="tabpanel"
            id="panel-stack"
            aria-labelledby="tab-stack"
          >
            <StackSummarySection config={config} />
          </motion.div>
        )}

        {activeTab === "actions" && (
          <motion.div
            key="actions"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="p-3 space-y-3"
            role="tabpanel"
            id="panel-actions"
            aria-labelledby="tab-actions"
          >
            {/* Quick Actions Header */}
            <div className="text-center mb-3">
              <div className="font-display text-sm text-comic-yellow transform -rotate-1">
                QUICK ACTIONS!
              </div>
              <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-comic-yellow to-transparent opacity-50 mt-1"></div>
            </div>

            {/* Power Toggles */}
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                {/* TypeScript Toggle */}
                <button
                  onClick={() => setConfig((prev) => ({ ...prev, typescript: !prev.typescript }))}
                  className={`
                    comic-panel p-2 border-2 transition-all duration-200 transform hover:scale-105
                    ${
                      config.typescript
                        ? "bg-comic-blue border-comic-blue text-comic-white shadow-lg"
                        : "bg-comic-white/10 border-comic-white/30 text-comic-white/60 hover:bg-comic-white/20"
                    }
                  `}
                  title="Toggle TypeScript"
                >
                  <div className="flex flex-col items-center gap-1">
                    <SiTypescript className="text-base" />
                    <span className="font-comic text-[10px] font-bold">TS</span>
                  </div>
                </button>

                {/* Git Toggle */}
                <button
                  onClick={() => setConfig((prev) => ({ ...prev, git: !prev.git }))}
                  className={`
                    comic-panel p-2 border-2 transition-all duration-200 transform hover:scale-105
                    ${
                      config.git
                        ? "bg-comic-orange border-comic-orange text-comic-white shadow-lg"
                        : "bg-comic-white/10 border-comic-white/30 text-comic-white/60 hover:bg-comic-white/20"
                    }
                  `}
                  title="Toggle Git"
                >
                  <div className="flex flex-col items-center gap-1">
                    <FaHistory className="text-base" />
                    <span className="font-comic text-[10px] font-bold">GIT</span>
                  </div>
                </button>

                {/* Docker Toggle */}
                <button
                  onClick={() => {
                    if (handleDockerToggle) {
                      handleDockerToggle();
                    } else {
                      setConfig((prev) => ({ ...prev, docker: !prev.docker }));
                    }
                  }}
                  className={`
                    comic-panel p-2 border-2 transition-all duration-200 transform hover:scale-105
                    ${
                      config.docker
                        ? "bg-comic-blue border-comic-blue text-comic-white shadow-lg"
                        : "bg-comic-white/10 border-comic-white/30 text-comic-white/60 hover:bg-comic-white/20"
                    }
                  `}
                  title="Toggle Docker"
                >
                  <div className="flex flex-col items-center gap-1">
                    <FaDocker className="text-base" />
                    <span className="font-comic text-[10px] font-bold">DOCKER</span>
                  </div>
                </button>

                {/* Auto Install Toggle */}
                <button
                  onClick={() => setConfig((prev) => ({ ...prev, autoInstall: !prev.autoInstall }))}
                  className={`
                    comic-panel p-2 border-2 transition-all duration-200 transform hover:scale-105
                    ${
                      config.autoInstall
                        ? "bg-comic-green border-comic-green text-comic-white shadow-lg"
                        : "bg-comic-white/10 border-comic-white/30 text-comic-white/60 hover:bg-comic-white/20"
                    }
                  `}
                  title="Toggle Auto Install"
                >
                  <div className="flex flex-col items-center gap-1">
                    <FaMagic className="text-base" />
                    <span className="font-comic text-[10px] font-bold">AUTO</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2">
              {/* Save Project */}
              {saveProject && (
                <button
                  onClick={saveProject}
                  className={`
                    w-full py-2 px-3 font-comic text-xs rounded-lg border-2 transition-all duration-200 
                    transform hover:scale-105 flex items-center justify-center gap-2
                    ${
                      saved
                        ? "bg-comic-green border-comic-green text-comic-white"
                        : "bg-comic-yellow border-comic-black text-comic-black hover:bg-comic-orange"
                    }
                  `}
                >
                  <FaSave className="text-xs" />
                  <span className="font-bold">{saved ? "SAVED!" : "SAVE PROJECT"}</span>
                </button>
              )}

              {/* Preferred Stacks */}
              {showPreferredStacks && (
                <button
                  onClick={showPreferredStacks}
                  className="w-full py-2 px-3 bg-comic-blue border-2 border-comic-black text-comic-white font-comic text-xs rounded-lg transition-all duration-200 transform hover:scale-105 hover:bg-comic-darkBlue flex items-center justify-center gap-2"
                >
                  <FaHistory className="text-xs" />
                  <span className="font-bold">POPULAR STACKS</span>
                </button>
              )}

              {/* Reset */}
              {resetToDefaults && (
                <button
                  onClick={resetToDefaults}
                  className="w-full py-2 px-3 bg-comic-red border-2 border-comic-black text-comic-white font-comic text-xs rounded-lg transition-all duration-200 transform hover:scale-105 hover:bg-comic-darkRed flex items-center justify-center gap-2"
                >
                  <FaMagic className="text-xs" />
                  <span className="font-bold">RESET ALL</span>
                </button>
              )}
            </div>

            {/* Project Status Badge */}
            <div className="bg-comic-black/50 border-2 border-comic-yellow p-2 rounded-lg">
              <div className="text-center">
                <div className="font-display text-xs text-comic-yellow mb-1">PROJECT STATUS</div>
                <div className="flex justify-center items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      config.framework !== "vanilla" && config.backend !== "none"
                        ? "bg-comic-green"
                        : "bg-comic-orange"
                    }`}
                  ></div>
                  <span className="font-comic text-[10px] text-comic-white">
                    {config.framework !== "vanilla" && config.backend !== "none"
                      ? "FULL-STACK READY"
                      : config.framework !== "vanilla"
                        ? "FRONTEND ONLY"
                        : "BASIC PROJECT"}
                  </span>
                </div>
              </div>
            </div>

            {/* Deployment Ready Badge */}
            {config.deploymentMethod && config.deploymentMethod !== "none" && (
              <div className="bg-comic-green/20 border-2 border-comic-green p-2 rounded-lg transform rotate-1">
                <div className="font-comic text-xs text-comic-green text-center font-bold">
                  🚀 DEPLOY TO {config.deploymentMethod.toUpperCase()}!
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

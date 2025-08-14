import { motion, AnimatePresence } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import {
  FaMicrochip,
  FaSearch,
  FaDatabase,
  FaCloud,
  FaBrain,
  FaFolder,
  FaCog,
  FaKey,
  FaChevronDown,
  FaChevronUp,
  FaExclamationTriangle,
} from "react-icons/fa";

import { mcpServers, getRelevantMCPServers } from "@/lib/mcp-servers-config";

import { CollapsibleSection } from "./CollapsibleSection";
import type { ExtendedProjectConfig } from "./types";

interface MCPServersSectionProps {
  config: ExtendedProjectConfig;
  setConfig: React.Dispatch<React.SetStateAction<ExtendedProjectConfig>>;
}

/**
 * MCP (Model Context Protocol) servers selection with automatic relevance detection.
 * Auto-selects relevant servers based on stack configuration while respecting manual deselections.
 */
export const MCPServersSection: React.FC<MCPServersSectionProps> = ({ config, setConfig }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [expandedServers, setExpandedServers] = useState<Set<string>>(new Set());

  const relevantServers = getRelevantMCPServers({
    framework: config.framework,
    database: config.database,
    deploymentMethod: config.deploymentMethod,
    auth: config.auth,
    backend: config.backend,
  });

  const manuallyDeselectedRef = useRef<Set<string>>(new Set());

  const categories = [
    { id: "all", name: "All", icon: FaCog },
    { id: "database", name: "Database", icon: FaDatabase },
    { id: "deployment", name: "Deploy", icon: FaCloud },
    { id: "productivity", name: "Files", icon: FaFolder },
    { id: "ai", name: "AI", icon: FaBrain },
  ];
  useEffect(() => {
    const currentServers = config.mcpServers || [];
    const relevantServerIds = relevantServers.map((server) => server.id);

    const serversToAdd = relevantServerIds.filter(
      (id) => !currentServers.includes(id) && !manuallyDeselectedRef.current.has(id)
    );

    if (serversToAdd.length > 0) {
      setConfig((prevConfig) => ({
        ...prevConfig,
        mcpServers: [...currentServers, ...serversToAdd],
      }));
    }
  }, [
    config.framework,
    config.database,
    config.deploymentMethod,
    config.auth,
    config.backend,
    config.mcpServers,
    relevantServers,
    setConfig,
  ]);

  const toggleExpanded = (serverId: string) => {
    setExpandedServers((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(serverId)) {
        newSet.delete(serverId);
      } else {
        newSet.add(serverId);
      }
      return newSet;
    });
  };

  const hasEnvVars = (server: (typeof mcpServers)[0]) => {
    return server.config.env && Object.keys(server.config.env).length > 0;
  };

  const getEnvVarsList = (server: (typeof mcpServers)[0]) => {
    if (!server.config.env) return [];
    return Object.entries(server.config.env).map(([key, value]) => ({
      key,
      value,
      isPlaceholder: value.includes("${"),
    }));
  };

  const toggleMCPServer = (serverId: string) => {
    const currentServers = config.mcpServers || [];
    const isSelected = currentServers.includes(serverId);
    const isRecommended = relevantServers.some((rs) => rs.id === serverId);

    if (isSelected) {
      /** If deselecting a recommended server, mark it as manually deselected */
      if (isRecommended) {
        manuallyDeselectedRef.current.add(serverId);
      }
      setConfig({
        ...config,
        mcpServers: currentServers.filter((id) => id !== serverId),
      });
    } else {
      /** If selecting a server, remove it from manually deselected list */
      manuallyDeselectedRef.current.delete(serverId);
      setConfig({
        ...config,
        mcpServers: [...currentServers, serverId],
      });
    }
  };

  // Filter servers based on search and category
  const filteredServers = mcpServers.filter((server) => {
    // Category filter
    if (selectedCategory !== "all" && server.category !== selectedCategory) {
      return false;
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        server.name.toLowerCase().includes(query) ||
        server.description.toLowerCase().includes(query) ||
        server.id.toLowerCase().includes(query)
      );
    }

    return true;
  });

  // Show recommended servers first, then relevant servers, then others
  const recommendedServers = filteredServers.filter((s) => s.recommended);
  const otherServers = filteredServers.filter(
    (s) => !s.recommended && !relevantServers.some((rs) => rs.id === s.id)
  );

  const availableServers = [
    ...recommendedServers,
    ...relevantServers.filter(
      (rs) =>
        !recommendedServers.some((rec) => rec.id === rs.id) &&
        filteredServers.some((fs) => fs.id === rs.id)
    ),
    ...otherServers,
  ];

  // Don't hide the section completely, show it with empty state instead
  if (mcpServers.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.75 }}
    >
      <CollapsibleSection
        icon={<FaMicrochip className="text-3xl" />}
        title={<h3 className="font-display text-2xl">MCP SERVERS</h3>}
        className="bg-comic-purple text-comic-white"
      >
        <p className="font-comic text-sm mb-4 text-comic-white/90">
          Choose AI-powered integrations for enhanced Claude Code development
        </p>

        {/* Search Bar */}
        <div className="relative mb-4">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-comic-white/50 text-sm" />
          <input
            type="text"
            placeholder="Search MCP servers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-comic-white/10 border-2 border-comic-white/20 rounded-lg text-comic-white placeholder-comic-white/50 font-comic text-sm focus:outline-none focus:border-comic-white/40 focus:bg-comic-white/15"
          />
        </div>

        {/* Category Filter Buttons */}
        <div className="flex flex-wrap gap-2 mb-4">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-1 px-2 sm:px-3 py-1 font-comic text-xs rounded-lg border-2 transition-all ${
                  selectedCategory === category.id
                    ? "bg-comic-white text-comic-purple border-comic-white"
                    : "bg-comic-white/10 text-comic-white border-comic-white/20 hover:bg-comic-white/20"
                }`}
              >
                <Icon className="text-xs" />
                <span className="hidden sm:inline">{category.name}</span>
                <span className="sm:hidden">{category.name.slice(0, 3)}</span>
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[400px] overflow-y-auto pt-2 pr-2 pb-2 scrollbar-thin scrollbar-thumb-comic-white/20 scrollbar-track-transparent">
          {availableServers.length === 0 ? (
            <div className="col-span-2 text-center py-8 text-comic-white/50 font-comic">
              <p className="text-sm mb-2">No MCP servers found</p>
              <p className="text-xs">Try adjusting your search or filters</p>
            </div>
          ) : (
            availableServers.map((server) => {
              const Icon = server.icon;
              const isSelected = config.mcpServers?.includes(server.id) || false;
              const isAutoRelevant = relevantServers.some((rs) => rs.id === server.id);
              const isExpanded = expandedServers.has(server.id);
              const needsEnvVars = hasEnvVars(server);
              const envVars = getEnvVarsList(server);

              return (
                <div key={server.id} className="relative">
                  <div className="flex flex-col gap-1">
                    <button
                      onClick={() => toggleMCPServer(server.id)}
                      data-active={isSelected}
                      className="filter-btn-comic flex flex-col items-center justify-center gap-1 py-2 h-16 w-full relative"
                      title={server.recommendedReason || server.description}
                    >
                      <div className="absolute -top-1 -right-1 flex gap-1 z-10">
                        {needsEnvVars && (
                          <span className="text-[8px] font-comic bg-comic-orange text-comic-white px-1 rounded-full whitespace-nowrap flex items-center gap-0.5">
                            <FaKey className="text-[6px]" />
                            ENV
                          </span>
                        )}
                        {isAutoRelevant && (
                          <span className="text-[8px] font-comic bg-comic-yellow text-comic-black px-1 rounded-full whitespace-nowrap">
                            Auto
                          </span>
                        )}
                      </div>
                      <Icon className="text-lg" />
                      <span className="text-[10px] text-center leading-tight">
                        {server.name.replace(" MCP Server", "")}
                      </span>
                    </button>

                    {/* Expand/Collapse button for selected servers with env vars */}
                    {isSelected && needsEnvVars && (
                      <button
                        onClick={() => toggleExpanded(server.id)}
                        className="w-full py-1 bg-comic-white/10 hover:bg-comic-white/20 rounded-b-lg border-2 border-t-0 border-comic-white/20 transition-all flex items-center justify-center gap-1"
                      >
                        {isExpanded ? (
                          <FaChevronUp className="text-[10px]" />
                        ) : (
                          <FaChevronDown className="text-[10px]" />
                        )}
                        <span className="text-[9px] font-comic">
                          {envVars.length} env var{envVars.length !== 1 ? "s" : ""}
                        </span>
                      </button>
                    )}
                  </div>

                  {/* Expandable Environment Variables Details */}
                  <AnimatePresence>
                    {isSelected && needsEnvVars && isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-2 p-3 bg-comic-white rounded-lg border-2 border-comic-black shadow-sm"
                        style={{ boxShadow: "2px 2px 0 var(--comic-black)" }}
                      >
                        <div className="flex items-center gap-2 mb-3">
                          <FaExclamationTriangle className="text-comic-orange text-sm" />
                          <span className="text-xs font-comic font-bold text-comic-black">
                            Required Environment Variables
                          </span>
                        </div>
                        <div className="space-y-2">
                          {envVars.map(({ key, value }) => (
                            <div
                              key={key}
                              className="bg-comic-gray/20 p-2 rounded-lg border border-comic-black/10"
                            >
                              <div className="font-mono text-[10px]">
                                <span className="text-comic-purple font-bold">{key}</span>
                                <span className="text-comic-black mx-1">=</span>
                                <span className="text-comic-blue">
                                  {value.replace(/\$\{([^}]+)\}/g, "$1")}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                        {server.repository && (
                          <a
                            href={server.repository}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 mt-3 px-2 py-1 bg-comic-blue text-comic-white text-[10px] font-comic rounded-lg border-2 border-comic-black hover:bg-comic-darkBlue transition-colors"
                            onClick={(e) => e.stopPropagation()}
                            style={{ boxShadow: "1px 1px 0 var(--comic-black)" }}
                          >
                            View Documentation →
                          </a>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })
          )}
        </div>

        <div className="mt-4 pt-3 border-t border-comic-white/20">
          <div className="text-xs text-comic-white/70 text-center font-comic">
            {config.mcpServers?.length || 0} of {availableServers.length} MCP server
            {availableServers.length !== 1 ? "s" : ""} selected
          </div>

          {/* Help text for env vars */}
          {config.mcpServers &&
            config.mcpServers.length > 0 &&
            config.mcpServers.some((id) => {
              const server = mcpServers.find((s) => s.id === id);
              return server && hasEnvVars(server);
            }) && (
              <div className="mt-3 p-2 bg-comic-orange/20 rounded-lg border border-comic-orange/30">
                <div className="flex items-start gap-2">
                  <FaKey className="text-comic-orange text-xs mt-0.5" />
                  <div className="text-[10px] text-comic-white/80 font-comic">
                    <p className="font-bold mb-1">Environment Variables Required</p>
                    <p>
                      Some selected servers need API keys or tokens. These will be configured in
                      your <span className="font-mono bg-comic-black/30 px-1 rounded">.env</span>{" "}
                      file after generation.
                    </p>
                  </div>
                </div>
              </div>
            )}
        </div>
      </CollapsibleSection>
    </motion.div>
  );
};

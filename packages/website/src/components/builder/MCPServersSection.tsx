import { motion } from "framer-motion";
import React, { useEffect, useRef } from "react";
import { FaMicrochip } from "react-icons/fa";

import { mcpServers, getRelevantMCPServers } from "../../lib/mcp-servers-config";

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
  const relevantServers = getRelevantMCPServers({
    framework: config.framework,
    database: config.database,
    deploymentMethod: config.deploymentMethod,
    auth: config.auth,
    backend: config.backend,
  });

  const manuallyDeselectedRef = useRef<Set<string>>(new Set());
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

  const availableServers = [
    ...relevantServers,
    ...mcpServers.filter((server) => !relevantServers.some((rs) => rs.id === server.id)),
  ];

  if (availableServers.length === 0) {
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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pt-4 pr-6 pb-2 scrollbar-thin scrollbar-thumb-comic-white/20 scrollbar-track-transparent">
          {availableServers.map((server) => {
            const Icon = server.icon;
            const isSelected = config.mcpServers?.includes(server.id) || false;
            const isRecommended = relevantServers.some((rs) => rs.id === server.id);

            return (
              <button
                key={server.id}
                onClick={() => toggleMCPServer(server.id)}
                data-active={isSelected}
                className="filter-btn-comic flex flex-col items-center justify-center gap-1 py-2 h-16 w-full relative"
                title={server.description}
              >
                {isRecommended && (
                  <span className="absolute -top-1 -right-1 text-[8px] font-comic bg-comic-yellow text-comic-black px-1 rounded-full whitespace-nowrap">
                    Recommended
                  </span>
                )}
                <Icon className="text-lg" />
                <span className="text-[10px] text-center leading-tight">
                  {server.name.replace(" MCP Server", "")}
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-4 pt-3 border-t border-comic-white/20">
          <div className="text-xs text-comic-white/70 text-center font-comic">
            {config.mcpServers?.length || 0} of {availableServers.length} MCP server
            {availableServers.length !== 1 ? "s" : ""} selected
          </div>
        </div>
      </CollapsibleSection>
    </motion.div>
  );
};

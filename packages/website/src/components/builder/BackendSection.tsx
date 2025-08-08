import { motion } from "framer-motion";
import React from "react";
import { FaServer, FaCloud } from "react-icons/fa";

import { Tooltip } from "@/components/ui/Tooltip";
import { backends } from "@/lib/stack-config";

import { CollapsibleSection } from "./CollapsibleSection";
import { PublicIcon } from "./PublicIcon";
import type { ExtendedProjectConfig } from "./types";

interface BackendSectionProps {
  config: ExtendedProjectConfig;
  setConfig: React.Dispatch<React.SetStateAction<ExtendedProjectConfig>>;
}

export const BackendSection: React.FC<BackendSectionProps> = ({ config, setConfig }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3 }}
    >
      <CollapsibleSection
        icon={<FaServer className="text-3xl" />}
        title={<h3 className="font-display text-2xl">BACKEND POWER</h3>}
        className="bg-comic-blue text-comic-white"
      >
        <p className="font-comic text-sm mb-4 text-comic-white/90">
          Choose your backend - traditional server, serverless functions, or edge computing
        </p>
        <div className="grid grid-cols-3 gap-3">
          {backends.map((be) => {
            let tooltipContent = be.description || "";
            if (be.serverless) {
              tooltipContent += " (Serverless - scales automatically without managing servers)";
            }

            return (
              <Tooltip key={be.id} content={tooltipContent}>
                <button
                  onClick={() => {
                    const updates: Partial<ExtendedProjectConfig> = { backend: be.id };
                    if (be.id === "none") {
                      updates.database = "none";
                      updates.orm = "none";
                      updates.auth = "none";
                    } else if (
                      be.id === "cloudflare-workers" &&
                      (!config.database || config.database === "none")
                    ) {
                      updates.database = "cloudflare-d1";
                      updates.orm = "drizzle";
                    }
                    setConfig({ ...config, ...updates });
                  }}
                  data-active={config.backend === be.id}
                  className="filter-btn-comic flex flex-col items-center justify-center gap-2 py-3 h-20 w-full relative"
                >
                  {be.serverless && (
                    <div className="absolute top-1 right-7 w-5 h-5 bg-comic-purple text-comic-white rounded border border-comic-black flex items-center justify-center p-0.5">
                      <FaCloud className="text-[10px]" />
                    </div>
                  )}
                  {be.languageIcon && be.id !== "none" && (
                    <div className="absolute top-1 right-1 w-5 h-5 bg-comic-white rounded border border-comic-black flex items-center justify-center p-0.5">
                      <PublicIcon name={be.languageIcon} className="w-full h-full object-contain" />
                    </div>
                  )}
                  {be.icon && <be.icon className="text-2xl" />}
                  <span className="text-xs">{be.name}</span>
                </button>
              </Tooltip>
            );
          })}
        </div>
      </CollapsibleSection>
    </motion.div>
  );
};

import { motion } from "framer-motion";
import React from "react";
import { FaLightbulb } from "react-icons/fa";

import type { ExtendedProjectConfig } from "./types";

interface PresetTemplatesSectionProps {
  config: ExtendedProjectConfig;
  setConfig: React.Dispatch<React.SetStateAction<ExtendedProjectConfig>>;
}

export const PresetTemplatesSection: React.FC<PresetTemplatesSectionProps> = ({
  config,
  setConfig,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      className="comic-card bg-comic-purple text-comic-white"
    >
      <h3 className="font-display text-2xl mb-4 flex items-center gap-2">
        <FaLightbulb />
        QUICK STARTS
      </h3>
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() =>
            setConfig({
              ...config,
              name: "landing-page-hero",
              framework: "next",
              backend: "none",
              database: "none",
              orm: "none",
              styling: "tailwind",
              typescript: true,
              git: true,
              docker: false,
              aiAssistant: "none",
              uiLibrary: "shadcn",
            })
          }
          className="filter-btn-comic bg-comic-white text-comic-black hover:bg-comic-yellow text-xs h-16"
        >
          LANDING PAGE
        </button>
        <button
          onClick={() =>
            setConfig({
              ...config,
              name: "saas-starter-kit",
              framework: "next",
              backend: "node",
              database: "postgres",
              orm: "prisma",
              styling: "tailwind",
              typescript: true,
              git: true,
              docker: true,
              aiAssistant: "claude",
              uiLibrary: "shadcn",
            })
          }
          className="filter-btn-comic bg-comic-white text-comic-black hover:bg-comic-yellow text-xs h-16"
        >
          SAAS STARTER
        </button>
        <button
          onClick={() =>
            setConfig({
              ...config,
              name: "api-server-pro",
              framework: "vanilla",
              backend: "express",
              database: "mongodb",
              orm: "none",
              styling: "css",
              typescript: true,
              git: true,
              docker: true,
              aiAssistant: "cursor",
              uiLibrary: "none",
            })
          }
          className="filter-btn-comic bg-comic-white text-comic-black hover:bg-comic-yellow text-xs h-16"
        >
          API SERVER
        </button>
        <button
          onClick={() =>
            setConfig({
              ...config,
              name: "blog-platform",
              framework: "astro",
              backend: "none",
              database: "none",
              orm: "none",
              styling: "tailwind",
              typescript: true,
              git: true,
              docker: false,
              aiAssistant: "gemini",
              uiLibrary: "daisyui",
            })
          }
          className="filter-btn-comic bg-comic-white text-comic-black hover:bg-comic-yellow text-xs h-16"
        >
          BLOG PLATFORM
        </button>
      </div>
    </motion.div>
  );
};

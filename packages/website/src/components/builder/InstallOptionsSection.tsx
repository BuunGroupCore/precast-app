import React from "react";
import { motion } from "framer-motion";
import { BiPackage } from "react-icons/bi";
import { packageManagers } from "./constants";
import type { ExtendedProjectConfig } from "./types";

interface InstallOptionsSectionProps {
  config: ExtendedProjectConfig;
  setConfig: React.Dispatch<React.SetStateAction<ExtendedProjectConfig>>;
}

export const InstallOptionsSection: React.FC<InstallOptionsSectionProps> = ({
  config,
  setConfig,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.75 }}
      className="comic-card bg-comic-green text-comic-white"
    >
      <h3 className="font-display text-2xl mb-4 flex items-center gap-2">
        <BiPackage />
        INSTALL OPTIONS
      </h3>

      {/* Auto Install Toggle */}
      <div className="mb-4">
        <label className="flex items-center gap-3 cursor-pointer">
          <div className="relative">
            <input
              type="checkbox"
              checked={config.autoInstall}
              onChange={(e) => setConfig({ ...config, autoInstall: e.target.checked })}
              className="sr-only"
            />
            <div
              className={`w-14 h-8 rounded-full border-3 border-comic-black transition-colors ${
                config.autoInstall ? "bg-comic-yellow" : "bg-comic-white"
              }`}
            >
              <div
                className={`absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-comic-black transition-transform ${
                  config.autoInstall ? "translate-x-6" : "translate-x-0"
                }`}
              />
            </div>
          </div>
          <span className="font-comic font-bold">Auto-install dependencies</span>
        </label>
      </div>

      {/* Package Manager Selection */}
      <div className="grid grid-cols-3 gap-3">
        {packageManagers.map((pm) => (
          <button
            key={pm.id}
            onClick={() => setConfig({ ...config, packageManager: pm.id })}
            data-active={config.packageManager === pm.id}
            className={`filter-btn-comic flex flex-col items-center justify-center gap-1 py-3 ${
              config.packageManager === pm.id
                ? "bg-comic-yellow text-comic-black"
                : "bg-comic-white text-comic-black hover:bg-comic-yellow"
            }`}
            title={pm.description}
          >
            <pm.icon className={`text-2xl ${pm.color}`} />
            <span className="text-xs font-bold">{pm.name}</span>
          </button>
        ))}
      </div>
    </motion.div>
  );
};

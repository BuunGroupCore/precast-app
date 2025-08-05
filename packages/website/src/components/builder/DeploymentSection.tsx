import { motion } from "framer-motion";
import React from "react";
import { FaRocket } from "react-icons/fa";

import { deploymentMethods } from "./constants";
import { PublicIcon } from "./PublicIcon";
import type { ExtendedProjectConfig } from "./types";

interface DeploymentSectionProps {
  config: ExtendedProjectConfig;
  setConfig: React.Dispatch<React.SetStateAction<ExtendedProjectConfig>>;
}

export const DeploymentSection: React.FC<DeploymentSectionProps> = ({ config, setConfig }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.8 }}
      className="comic-card"
    >
      <div className="flex items-center gap-3 mb-2">
        <FaRocket className="text-3xl text-comic-red" />
        <h3 className="font-display text-2xl">DEPLOYMENT</h3>
      </div>
      <div className="border-t-3 border-comic-gray mb-3"></div>
      <p className="font-comic text-sm mb-4 text-comic-gray">
        Launch your app to the world - choose your deployment platform
      </p>
      <div className="grid grid-cols-2 gap-3">
        {deploymentMethods.map((deploy) => (
          <button
            key={deploy.id}
            onClick={() => setConfig({ ...config, deploymentMethod: deploy.id })}
            data-active={config.deploymentMethod === deploy.id}
            className={`filter-btn-comic flex items-center justify-center gap-2 ${
              config.deploymentMethod === deploy.id
                ? "bg-comic-yellow text-comic-black"
                : "bg-comic-white text-comic-black hover:bg-comic-yellow"
            }`}
            title={deploy.description}
          >
            {deploy.icon &&
              (typeof deploy.icon === "string" ? (
                <PublicIcon name={deploy.icon} className={deploy.color} />
              ) : (
                <deploy.icon className={deploy.color} />
              ))}
            <span className="text-xs">{deploy.name}</span>
          </button>
        ))}
      </div>
      {config.deploymentMethod && config.deploymentMethod !== "none" && (
        <p className="text-xs font-comic mt-3 text-comic-purple">
          💡 {deploymentMethods.find((d) => d.id === config.deploymentMethod)?.description}
        </p>
      )}
    </motion.div>
  );
};

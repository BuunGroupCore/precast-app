import React from "react";
import { motion } from "framer-motion";
import { FaRocket } from "react-icons/fa";
import { PublicIcon } from "./PublicIcon";
import { deploymentMethods } from "./constants";
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
      <h3 className="font-display text-2xl mb-4 flex items-center gap-2">
        <FaRocket className="text-comic-red" />
        DEPLOYMENT
      </h3>
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

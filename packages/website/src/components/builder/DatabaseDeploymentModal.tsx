import { motion, AnimatePresence } from "framer-motion";
import React from "react";
import { FaDocker, FaCloud, FaTimes } from "react-icons/fa";

import type { StackOption } from "@/lib/stack-config";

interface DatabaseDeploymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  database: StackOption;
  onSelect: (deployment: "local" | "cloud") => void;
}

export const DatabaseDeploymentModal: React.FC<DatabaseDeploymentModalProps> = ({
  isOpen,
  onClose,
  database,
  onSelect,
}) => {
  if (!database || !database.deploymentOptions) return null;

  const handleSelect = (deployment: "local" | "cloud") => {
    onSelect(deployment);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.2 }}
            className="bg-comic-white border-4 border-comic-black rounded-lg p-6 max-w-md w-full mx-4 relative shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-comic-gray hover:text-comic-black transition-colors"
            >
              <FaTimes className="text-xl" />
            </button>

            <div className="text-center mb-6">
              <h3 className="font-display text-xl text-comic-black mb-2">{database.name} Setup</h3>
              <p className="font-comic text-sm text-comic-gray">
                Choose how you want to deploy your database
              </p>
            </div>

            <div className="space-y-4">
              {database.deploymentOptions.local && (
                <button
                  onClick={() => handleSelect("local")}
                  className="w-full bg-comic-blue text-comic-white border-2 border-comic-black rounded-lg p-4 hover:bg-comic-darkBlue transition-colors text-left"
                >
                  <div className="flex items-start gap-3">
                    <FaDocker className="text-2xl mt-1" />
                    <div>
                      <h4 className="font-comic font-bold text-sm mb-1">
                        {database.deploymentOptions.local.name}
                      </h4>
                      <p className="font-comic text-xs opacity-90">
                        {database.deploymentOptions.local.description}
                      </p>
                      {database.deploymentOptions.local.dockerCompose && (
                        <div className="mt-2 inline-block bg-comic-yellow text-comic-black text-[10px] font-comic font-bold px-2 py-1 rounded-full">
                          Docker Compose
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              )}

              {database.deploymentOptions.cloud && (
                <button
                  onClick={() => handleSelect("cloud")}
                  className="w-full bg-comic-green text-comic-white border-2 border-comic-black rounded-lg p-4 hover:bg-opacity-80 transition-colors text-left"
                >
                  <div className="flex items-start gap-3">
                    <FaCloud className="text-2xl mt-1" />
                    <div>
                      <h4 className="font-comic font-bold text-sm mb-1">
                        {database.deploymentOptions.cloud.name}
                      </h4>
                      <p className="font-comic text-xs opacity-90 mb-2">
                        {database.deploymentOptions.cloud.description}
                      </p>
                      {database.deploymentOptions.cloud.providers && (
                        <div className="flex flex-wrap gap-1">
                          {database.deploymentOptions.cloud.providers.map((provider) => (
                            <span
                              key={provider}
                              className="bg-comic-white text-comic-black text-[9px] font-comic px-1.5 py-0.5 rounded-full"
                            >
                              {provider}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              )}
            </div>

            <div className="mt-6 text-center">
              <p className="font-comic text-xs text-comic-gray">
                💡 You can change this later in your project configuration
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

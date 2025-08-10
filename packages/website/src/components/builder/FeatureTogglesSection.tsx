import { motion } from "framer-motion";
import React from "react";
import { FaToggleOff, FaToggleOn, FaCog, FaGitAlt, FaDocker, FaLightbulb } from "react-icons/fa";
import { SiPrettier, SiEslint } from "react-icons/si";

import { CollapsibleSection } from "./CollapsibleSection";
import type { ExtendedProjectConfig } from "./types";

interface FeatureTogglesSectionProps {
  config: ExtendedProjectConfig;
  setConfig: React.Dispatch<React.SetStateAction<ExtendedProjectConfig>>;
}

interface FeatureToggle {
  id: keyof ExtendedProjectConfig;
  name: string;
  description: string;
  defaultEnabled: boolean;
  cliFlag: string;
  icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
}

const featureToggles: FeatureToggle[] = [
  {
    id: "prettier",
    name: "Auto Format with Prettier",
    description: "Automatically format generated code files using Prettier",
    defaultEnabled: true,
    cliFlag: "--no-prettier",
    icon: SiPrettier,
    iconColor: "text-[#F7B93E]",
  },
  {
    id: "eslint",
    name: "ESLint Configuration",
    description: "Add ESLint configuration files and rules to the project",
    defaultEnabled: true,
    cliFlag: "--no-eslint",
    icon: SiEslint,
    iconColor: "text-[#4B32C3]",
  },
  {
    id: "dockerCompose",
    name: "Secure Docker Compose",
    description:
      "Generate docker-compose.yml with dynamic secure passwords unique to each instance",
    defaultEnabled: true,
    cliFlag: "--no-secure-passwords",
    icon: FaDocker,
    iconColor: "text-[#2496ED]",
  },
  {
    id: "gitignore",
    name: "Generate .gitignore",
    description: "Create comprehensive .gitignore file for the selected stack",
    defaultEnabled: true,
    cliFlag: "--no-gitignore",
    icon: FaGitAlt,
    iconColor: "text-[#F05032]",
  },
];

/**
 * CLI Features configuration section for controlling project generation options
 */
export const FeatureTogglesSection: React.FC<FeatureTogglesSectionProps> = ({
  config,
  setConfig,
}) => {
  const handleToggle = (toggleId: keyof ExtendedProjectConfig, enabled: boolean) => {
    setConfig({ ...config, [toggleId]: enabled });
  };

  const isFeatureEnabled = (toggleId: keyof ExtendedProjectConfig) => {
    const toggle = featureToggles.find((t) => t.id === toggleId);
    return config[toggleId] ?? toggle?.defaultEnabled ?? true;
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.65 }}
    >
      <CollapsibleSection
        icon={<FaCog className="text-3xl text-comic-purple" />}
        title={<h3 className="font-display text-2xl text-comic-purple">CLI FEATURES</h3>}
        className="bg-comic-gray"
      >
        <p className="font-comic text-sm mb-4 text-comic-black/90">
          Control which features the CLI includes when generating your project
        </p>

        <div className="space-y-3">
          {featureToggles.map((toggle) => {
            if (toggle.id === "dockerCompose" && !config.docker) {
              return null;
            }

            const isEnabled = isFeatureEnabled(toggle.id);

            return (
              <div
                key={toggle.id}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 bg-comic-white rounded-lg border-2 border-comic-black gap-3"
                style={{ boxShadow: "2px 2px 0 var(--comic-black)" }}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <toggle.icon className={`text-lg ${toggle.iconColor} flex-shrink-0`} />
                    <h4 className="font-comic font-bold text-sm text-comic-black">{toggle.name}</h4>
                  </div>
                  <p className="font-comic text-xs text-comic-black/70 sm:ml-6">
                    {toggle.description}
                  </p>
                </div>

                <div className="flex items-center gap-2 justify-between sm:justify-end">
                  <code className="text-[10px] sm:text-xs bg-comic-gray px-2 sm:px-3 py-2 sm:py-2.5 rounded border border-comic-black h-8 sm:h-10 flex items-center">
                    {toggle.cliFlag}
                  </code>
                  <button
                    onClick={() => handleToggle(toggle.id, !isEnabled)}
                    className={`p-1.5 sm:p-2 rounded-lg border-2 border-comic-black transition-colors h-8 sm:h-10 ${
                      isEnabled
                        ? "bg-comic-green hover:bg-comic-blue"
                        : "bg-comic-red hover:bg-comic-orange"
                    }`}
                    title={`${isEnabled ? "Disable" : "Enable"} ${toggle.name}`}
                  >
                    {isEnabled ? (
                      <FaToggleOn className="text-lg sm:text-2xl text-comic-white" />
                    ) : (
                      <FaToggleOff className="text-lg sm:text-2xl text-comic-white" />
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-4 p-3 bg-comic-yellow/20 rounded-lg border-2 border-comic-yellow">
          <p className="font-comic text-xs text-comic-black flex items-center gap-2">
            <FaLightbulb className="text-sm text-comic-yellow" />
            <span>
              Disabled features will add corresponding CLI flags to skip them during project
              generation
            </span>
          </p>
        </div>
      </CollapsibleSection>
    </motion.div>
  );
};

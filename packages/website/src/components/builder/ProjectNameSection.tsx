import { motion } from "framer-motion";
import React from "react";
import { FaDice } from "react-icons/fa";

import type { ExtendedProjectConfig } from "./types";

interface ProjectNameSectionProps {
  config: ExtendedProjectConfig;
  setConfig: React.Dispatch<React.SetStateAction<ExtendedProjectConfig>>;
}

export const ProjectNameSection: React.FC<ProjectNameSectionProps> = ({ config, setConfig }) => {
  /** Name generation arrays for random project names */
  const heroAdjectives = [
    "awesome",
    "blazing",
    "cosmic",
    "dynamic",
    "epic",
    "fantastic",
    "galactic",
    "heroic",
    "incredible",
    "legendary",
    "mighty",
    "powerful",
    "quantum",
    "radical",
    "stellar",
    "turbo",
    "ultra",
    "velocity",
    "warp",
    "xtra",
  ];

  const heroNouns = [
    "app",
    "project",
    "venture",
    "mission",
    "quest",
    "journey",
    "odyssey",
    "expedition",
    "crusade",
    "voyage",
    "adventure",
    "enterprise",
    "endeavor",
    "pursuit",
    "campaign",
  ];

  const techWords = ["next", "super", "hyper", "mega", "neo", "cyber", "tech", "digital"];

  const generateRandomName = () => {
    const templates = [
      () =>
        `${heroAdjectives[Math.floor(Math.random() * heroAdjectives.length)]}-${heroNouns[Math.floor(Math.random() * heroNouns.length)]}-${Math.floor(Math.random() * 999)}`,
      () =>
        `${techWords[Math.floor(Math.random() * techWords.length)]}-${heroNouns[Math.floor(Math.random() * heroNouns.length)]}`,
      () =>
        `project-${heroAdjectives[Math.floor(Math.random() * heroAdjectives.length)]}-${Math.floor(Math.random() * 9999)}`,
    ];

    const template = templates[Math.floor(Math.random() * templates.length)];
    setConfig({ ...config, name: template() });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.1 }}
      className="comic-card"
    >
      <h3 className="font-display text-2xl mb-4 text-comic-blue">PROJECT NAME</h3>
      <div className="flex gap-2">
        <input
          type="text"
          value={config.name}
          onChange={(e) => setConfig({ ...config, name: e.target.value })}
          className="flex-1 px-4 py-3 border-3 border-comic-black rounded-lg font-comic text-lg focus:outline-none focus:border-comic-red bg-comic-white"
          placeholder="my-awesome-project"
        />
        <button
          onClick={generateRandomName}
          className="px-4 py-3 bg-comic-yellow border-3 border-comic-black rounded-lg hover:bg-comic-red hover:text-comic-white transition-colors"
          title="Generate random name"
        >
          <FaDice className="text-xl" />
        </button>
      </div>
    </motion.div>
  );
};

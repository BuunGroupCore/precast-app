import React, { useState, useEffect } from "react";
import { db } from "../lib/db";
import { motion } from "framer-motion";
import { ComicDialog } from "../components/ComicDialog";
import { ThemeSwitcher } from "../components/ThemeSwitcher";
import { ServiceTooltip } from "../components/ServiceTooltip";
import {
  FaCopy,
  FaCheck,
  FaRocket,
  FaDice,
  FaHistory,
  FaMagic,
  FaLightbulb,
  FaBolt,
  FaDocker,
  FaDatabase,
  FaGitAlt,
} from "react-icons/fa";
import { SiTypescript } from "react-icons/si";
import {
  frameworks,
  backends,
  databases,
  orms,
  stylings,
  validateConfiguration,
  type ProjectConfig,
} from "../lib/stack-config";

// Types are now imported from stack-config

export function BuilderPage() {
  const [config, setConfig] = useState<ProjectConfig>({
    name: "my-awesome-project",
    framework: "react",
    backend: "node",
    database: "postgres",
    orm: "prisma",
    styling: "tailwind",
    typescript: true,
    git: true,
    docker: false,
  });

  const [copied, setCopied] = useState(false);
  const [savedProjects, setSavedProjects] = useState<any[]>([]);
  const [showSaved, setShowSaved] = useState(false);
  const [showTooltip, setShowTooltip] = useState("");
  const [dialog, setDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: "success" | "error" | "info";
  }>({
    isOpen: false,
    title: "",
    message: "",
    type: "info",
  });

  // Cool project name generator
  const heroAdjectives = [
    "super",
    "mighty",
    "epic",
    "ultra",
    "mega",
    "turbo",
    "hyper",
    "quantum",
    "cosmic",
    "atomic",
  ];
  const heroNouns = [
    "hero",
    "builder",
    "creator",
    "forge",
    "craft",
    "labs",
    "studio",
    "workshop",
    "factory",
    "engine",
  ];
  const techWords = [
    "next",
    "react",
    "node",
    "web",
    "app",
    "stack",
    "dev",
    "code",
    "tech",
    "digital",
  ];

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

  // Load saved projects on mount
  useEffect(() => {
    const loadSavedProjects = async () => {
      const projects = await db.savedProjects.toArray();
      setSavedProjects(projects);
    };
    loadSavedProjects();
  }, []);

  const generateCommand = () => {
    const parts = ["npx create-precast-app"];

    parts.push(config.name);
    parts.push(`--framework=${config.framework}`);

    if (config.backend !== "none") {
      parts.push(`--backend=${config.backend}`);
    }

    if (config.database !== "none") {
      parts.push(`--database=${config.database}`);
    }

    if (config.orm !== "none" && config.database !== "none") {
      parts.push(`--orm=${config.orm}`);
    }

    parts.push(`--styling=${config.styling}`);

    if (!config.typescript) {
      parts.push("--no-typescript");
    }

    if (!config.git) {
      parts.push("--no-git");
    }

    if (config.docker) {
      parts.push("--docker");
    }

    return parts.join(" ");
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(generateCommand());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Stack options are now imported from stack-config

  return (
    <div className="min-h-screen comic-cursor">
      {/* Comic Book Header */}
      <header className="border-b-4 border-comic-black bg-comic-yellow sticky top-0 z-50">
        <div className="burst-bg text-comic-yellow" />
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            <a href="/" className="flex items-center">
              <img
                src="https://brutalist.precast.dev/logo.png"
                alt="Precast Logo"
                className="h-12 cursor-pointer"
                style={{
                  filter: "hue-rotate(340deg) saturate(2) brightness(1.2)",
                }}
              />
            </a>

            <nav className="absolute left-1/2 -translate-x-1/2">
              <a href="/" className="action-text text-2xl text-comic-red">
                HOME
              </a>
            </nav>

            <div>
              <ThemeSwitcher />
            </div>
          </div>
        </div>
      </header>

      <main className="py-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Action Title */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center mb-8"
          >
            <h2 className="action-text text-6xl text-comic-red mb-4">
              CHOOSE YOUR POWERS!
            </h2>
            <p className="font-comic text-xl">
              Build your super project with style!
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left Column - Configuration */}
            <div className="space-y-6">
              {/* Preset Templates */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                className="comic-card bg-comic-purple text-comic-white"
              >
                <h3 className="font-display text-2xl mb-4 flex items-center gap-2">
                  <FaMagic />
                  QUICK START TEMPLATES
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <button
                    onClick={() =>
                      setConfig({
                        name: "next-fullstack-app",
                        framework: "next",
                        backend: "node",
                        database: "postgres",
                        orm: "prisma",
                        styling: "tailwind",
                        typescript: true,
                        git: true,
                        docker: true,
                      })
                    }
                    className="filter-btn-comic bg-comic-white text-comic-black hover:bg-comic-yellow text-xs"
                  >
                    NEXT.JS FULL
                  </button>
                  <button
                    onClick={() =>
                      setConfig({
                        name: "react-spa",
                        framework: "react",
                        backend: "none",
                        database: "none",
                        orm: "none",
                        styling: "tailwind",
                        typescript: true,
                        git: true,
                        docker: false,
                      })
                    }
                    className="filter-btn-comic bg-comic-white text-comic-black hover:bg-comic-yellow text-xs"
                  >
                    REACT SPA
                  </button>
                  <button
                    onClick={() =>
                      setConfig({
                        name: "api-server",
                        framework: "vanilla",
                        backend: "express",
                        database: "mongodb",
                        orm: "none",
                        styling: "css",
                        typescript: true,
                        git: true,
                        docker: true,
                      })
                    }
                    className="filter-btn-comic bg-comic-white text-comic-black hover:bg-comic-yellow text-xs"
                  >
                    API SERVER
                  </button>
                </div>
              </motion.div>

              {/* Project Name */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                className="comic-card"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-display text-2xl text-comic-red">
                    PROJECT NAME
                  </h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowSaved(!showSaved)}
                      onMouseEnter={() => setShowTooltip("history")}
                      onMouseLeave={() => setShowTooltip("")}
                      className="filter-btn-comic flex items-center gap-2 text-xs relative"
                    >
                      <FaHistory />
                      {savedProjects.length > 0 && (
                        <span className="badge-comic bg-comic-red text-comic-white">
                          {savedProjects.length}
                        </span>
                      )}
                      {showTooltip === "history" && (
                        <div className="comic-tooltip -top-12 left-1/2 -translate-x-1/2">
                          LOAD SAVED PROJECTS
                        </div>
                      )}
                    </button>
                  </div>
                </div>

                {showSaved && savedProjects.length > 0 && (
                  <div className="mb-4 bg-comic-white border-2 border-comic-black rounded-lg p-2 max-h-40 overflow-y-auto">
                    {savedProjects.map((project) => (
                      <button
                        key={project.id}
                        onClick={() => {
                          const { id, createdAt, updatedAt, ...projectConfig } =
                            project;
                          setConfig(projectConfig);
                          setShowSaved(false);
                        }}
                        className="w-full text-left p-2 hover:bg-comic-yellow/20 rounded font-comic text-sm"
                      >
                        <div className="font-bold">{project.name}</div>
                        <div className="text-xs text-gray-600">
                          {new Date(project.createdAt).toLocaleDateString()}
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                <div className="relative">
                  <input
                    type="text"
                    className="input-comic w-full pr-24"
                    value={config.name}
                    onChange={(e) =>
                      setConfig({ ...config, name: e.target.value })
                    }
                    placeholder="my-super-project"
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2">
                    <button
                      onClick={generateRandomName}
                      onMouseEnter={() => setShowTooltip("random")}
                      onMouseLeave={() => setShowTooltip("")}
                      className="filter-btn-comic flex items-center gap-1 py-1 px-2 text-sm relative"
                    >
                      <FaDice />
                      <span className="hidden sm:inline">RANDOM</span>
                      {showTooltip === "random" && (
                        <div className="comic-tooltip -top-12 left-1/2 -translate-x-1/2">
                          GENERATE HERO NAME!
                        </div>
                      )}
                    </button>
                  </div>
                </div>

                {config.name && (
                  <div className="mt-2 flex gap-2 flex-wrap">
                    <span className="badge-comic bg-comic-green text-comic-black text-xs">
                      {config.name.length} chars
                    </span>
                    {config.name.includes("-") && (
                      <span className="badge-comic bg-comic-blue text-comic-white text-xs">
                        kebab-case ✓
                      </span>
                    )}
                    {/^[a-z0-9-]+$/.test(config.name) && (
                      <span className="badge-comic bg-comic-purple text-comic-white text-xs">
                        valid ✓
                      </span>
                    )}
                  </div>
                )}
              </motion.div>

              {/* Framework */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="comic-card"
              >
                <h3 className="font-display text-2xl mb-4 text-comic-blue">
                  FRONTEND POWER
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {frameworks.map((fw) => (
                    <ServiceTooltip key={fw.id} serviceId={fw.id}>
                      <button
                        onClick={() =>
                          setConfig({ ...config, framework: fw.id })
                        }
                        data-active={config.framework === fw.id}
                        className="filter-btn-comic flex items-center justify-center gap-2"
                      >
                        {fw.icon && <fw.icon className={fw.color} />}
                        <span>{fw.name}</span>
                      </button>
                    </ServiceTooltip>
                  ))}
                </div>
              </motion.div>

              {/* Backend */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="comic-card"
              >
                <h3 className="font-display text-2xl mb-4 text-comic-green">
                  BACKEND STRENGTH
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {backends.map((backend) => (
                    <ServiceTooltip key={backend.id} serviceId={backend.id}>
                      <button
                        onClick={() =>
                          setConfig({ ...config, backend: backend.id })
                        }
                        data-active={config.backend === backend.id}
                        className="filter-btn-comic flex items-center justify-center gap-2"
                      >
                        {backend.icon && (
                          <backend.icon className={backend.color} />
                        )}
                        <span>{backend.name}</span>
                      </button>
                    </ServiceTooltip>
                  ))}
                </div>
              </motion.div>

              {/* Database */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="comic-card"
              >
                <h3 className="font-display text-2xl mb-4 text-comic-purple">
                  DATA STORAGE
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {databases.map((db) => (
                    <ServiceTooltip key={db.id} serviceId={db.id}>
                      <button
                        onClick={() =>
                          setConfig({ ...config, database: db.id })
                        }
                        data-active={config.database === db.id}
                        className="filter-btn-comic flex items-center justify-center gap-2"
                      >
                        {db.icon && <db.icon className={db.color} />}
                        <span>{db.name}</span>
                      </button>
                    </ServiceTooltip>
                  ))}
                </div>
              </motion.div>

              {/* ORM */}
              {config.database !== "none" && (
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="comic-card"
                >
                  <h3 className="font-display text-2xl mb-4 text-comic-orange">
                    ORM MAGIC
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {orms.map((orm) => (
                      <ServiceTooltip key={orm.id} serviceId={orm.id}>
                        <button
                          onClick={() => setConfig({ ...config, orm: orm.id })}
                          data-active={config.orm === orm.id}
                          className="filter-btn-comic flex items-center justify-center gap-2"
                        >
                          {orm.icon && <orm.icon className={orm.color} />}
                          <span>{orm.name}</span>
                        </button>
                      </ServiceTooltip>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Styling */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="comic-card"
              >
                <h3 className="font-display text-2xl mb-4 text-comic-pink">
                  STYLE POWER
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {stylings.map((style) => (
                    <ServiceTooltip key={style.id} serviceId={style.id}>
                      <button
                        onClick={() =>
                          setConfig({ ...config, styling: style.id })
                        }
                        data-active={config.styling === style.id}
                        className="filter-btn-comic flex items-center justify-center gap-2"
                      >
                        {style.icon && <style.icon className={style.color} />}
                        <span>{style.name}</span>
                      </button>
                    </ServiceTooltip>
                  ))}
                </div>
              </motion.div>

              {/* Additional Options */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
                className="comic-card"
              >
                <h3 className="font-display text-2xl mb-4 text-comic-darkBlue">
                  POWER-UPS
                </h3>
                <div className="space-y-4">
                  <ServiceTooltip serviceId="typescript">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={config.typescript}
                        onChange={(e) =>
                          setConfig({ ...config, typescript: e.target.checked })
                        }
                        className="w-6 h-6 rounded border-3 border-comic-black accent-comic-red"
                      />
                      <div className="flex items-center gap-2">
                        <SiTypescript className="text-comic-blue text-xl" />
                        <span className="font-comic font-bold">TypeScript</span>
                      </div>
                    </label>
                  </ServiceTooltip>

                  <ServiceTooltip serviceId="git">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={config.git}
                        onChange={(e) =>
                          setConfig({ ...config, git: e.target.checked })
                        }
                        className="w-6 h-6 rounded border-3 border-comic-black accent-comic-red"
                      />
                      <div className="flex items-center gap-2">
                        <FaGitAlt className="text-comic-orange text-xl" />
                        <span className="font-comic font-bold">
                          Git Repository
                        </span>
                      </div>
                    </label>
                  </ServiceTooltip>

                  <ServiceTooltip serviceId="docker">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={config.docker}
                        onChange={(e) =>
                          setConfig({ ...config, docker: e.target.checked })
                        }
                        className="w-6 h-6 rounded border-3 border-comic-black accent-comic-red"
                      />
                      <div className="flex items-center gap-2">
                        <FaDocker className="text-comic-blue text-xl" />
                        <span className="font-comic font-bold">Docker</span>
                      </div>
                    </label>
                  </ServiceTooltip>
                </div>
              </motion.div>
            </div>

            {/* Right Column - Terminal & Actions */}
            <div className="lg:sticky lg:top-28 h-fit space-y-6">
              {/* Stack Summary */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="comic-panel p-6"
                style={{
                  backgroundColor: "var(--comic-yellow)",
                  transform: "rotate(0deg)",
                }}
              >
                <h3
                  className="font-display text-2xl mb-4 flex items-center justify-center gap-3"
                  style={{ color: "var(--comic-black)" }}
                >
                  <FaLightbulb
                    className="text-3xl"
                    style={{ color: "var(--comic-orange)" }}
                  />
                  YOUR SUPER STACK
                </h3>

                <div className="space-y-4">
                  {/* Project Name */}
                  <div
                    className="bg-comic-white border-3 border-comic-black rounded-lg p-3"
                    style={{
                      backgroundColor: "var(--comic-white)",
                      borderColor: "var(--comic-black)",
                    }}
                  >
                    <div
                      className="font-comic text-xs uppercase mb-1"
                      style={{ color: "var(--comic-gray)" }}
                    >
                      PROJECT NAME
                    </div>
                    <div
                      className="font-display text-lg"
                      style={{ color: "var(--comic-red)" }}
                    >
                      {config.name}
                    </div>
                  </div>

                  {/* Tech Stack */}
                  <div className="space-y-2">
                    <div
                      className="font-comic text-xs uppercase"
                      style={{ color: "var(--comic-black)" }}
                    >
                      TECH STACK
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div
                        className="flex items-center gap-2 p-2 bg-comic-white border-2 border-comic-black rounded"
                        style={{
                          backgroundColor: "var(--comic-white)",
                          borderColor: "var(--comic-black)",
                          transform: "rotate(0deg)",
                        }}
                      >
                        {frameworks.find((f) => f.id === config.framework)
                          ?.icon && (
                          <>
                            {React.createElement(
                              frameworks.find((f) => f.id === config.framework)!
                                .icon,
                              {
                                size: 18,
                                className: frameworks.find(
                                  (f) => f.id === config.framework,
                                )!.color,
                              },
                            )}
                          </>
                        )}
                        <span className="font-comic font-bold text-xs">
                          {config.framework.toUpperCase()}
                        </span>
                      </div>

                      {config.backend !== "none" && (
                        <div
                          className="flex items-center gap-2 p-2 bg-comic-white border-2 border-comic-black rounded"
                          style={{
                            backgroundColor: "var(--comic-white)",
                            borderColor: "var(--comic-black)",
                            transform: "rotate(0deg)",
                          }}
                        >
                          {backends.find((b) => b.id === config.backend)
                            ?.icon && (
                            <>
                              {React.createElement(
                                backends.find((b) => b.id === config.backend)!
                                  .icon,
                                {
                                  size: 18,
                                  className: backends.find(
                                    (b) => b.id === config.backend,
                                  )!.color,
                                },
                              )}
                            </>
                          )}
                          <span className="font-comic font-bold text-xs">
                            {config.backend.toUpperCase()}
                          </span>
                        </div>
                      )}

                      {config.database !== "none" && (
                        <div
                          className="flex items-center gap-2 p-2 bg-comic-white border-2 border-comic-black rounded"
                          style={{
                            backgroundColor: "var(--comic-white)",
                            borderColor: "var(--comic-black)",
                            transform: "rotate(0deg)",
                          }}
                        >
                          {databases.find((d) => d.id === config.database)
                            ?.icon && (
                            <>
                              {React.createElement(
                                databases.find((d) => d.id === config.database)!
                                  .icon,
                                {
                                  size: 18,
                                  className: databases.find(
                                    (d) => d.id === config.database,
                                  )!.color,
                                },
                              )}
                            </>
                          )}
                          <span className="font-comic font-bold text-xs">
                            {config.database.toUpperCase()}
                          </span>
                        </div>
                      )}

                      <div
                        className="flex items-center gap-2 p-2 bg-comic-white border-2 border-comic-black rounded"
                        style={{
                          backgroundColor: "var(--comic-white)",
                          borderColor: "var(--comic-black)",
                          transform: "rotate(0deg)",
                        }}
                      >
                        {stylings.find((s) => s.id === config.styling)
                          ?.icon && (
                          <>
                            {React.createElement(
                              stylings.find((s) => s.id === config.styling)!
                                .icon,
                              {
                                size: 18,
                                className: stylings.find(
                                  (s) => s.id === config.styling,
                                )!.color,
                              },
                            )}
                          </>
                        )}
                        <span className="font-comic font-bold text-xs">
                          {config.styling.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Power-ups Status */}
                  {(config.typescript || config.git || config.docker) && (
                    <div className="space-y-2">
                      <div
                        className="font-comic text-xs uppercase"
                        style={{ color: "var(--comic-black)" }}
                      >
                        POWER-UPS
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {config.typescript && (
                          <div
                            className="flex items-center gap-1 px-2 py-1 bg-comic-white border-2 border-comic-black rounded"
                            style={{
                              backgroundColor: "var(--comic-white)",
                              borderColor: "var(--comic-black)",
                            }}
                          >
                            <SiTypescript
                              size={16}
                              className="text-comic-blue"
                            />
                            <span className="font-comic font-bold text-xs">
                              TS
                            </span>
                          </div>
                        )}
                        {config.git && (
                          <div
                            className="flex items-center gap-1 px-2 py-1 bg-comic-white border-2 border-comic-black rounded"
                            style={{
                              backgroundColor: "var(--comic-white)",
                              borderColor: "var(--comic-black)",
                            }}
                          >
                            <FaGitAlt size={16} className="text-comic-orange" />
                            <span className="font-comic font-bold text-xs">
                              GIT
                            </span>
                          </div>
                        )}
                        {config.docker && (
                          <div
                            className="flex items-center gap-1 px-2 py-1 bg-comic-white border-2 border-comic-black rounded"
                            style={{
                              backgroundColor: "var(--comic-white)",
                              borderColor: "var(--comic-black)",
                            }}
                          >
                            <FaDocker size={16} className="text-comic-blue" />
                            <span className="font-comic font-bold text-xs">
                              DOCKER
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Fun Stats */}
                  <div
                    className="bg-comic-red text-comic-white rounded-lg p-3 text-center"
                    style={{
                      backgroundColor: "var(--comic-red)",
                      color: "var(--comic-white)",
                    }}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <FaBolt className="text-2xl" />
                      <div className="font-display text-2xl">
                        {
                          Object.values(config).filter(
                            (v) =>
                              v === true ||
                              (typeof v === "string" && v !== "none"),
                          ).length
                        }
                      </div>
                    </div>
                    <div className="font-comic text-xs uppercase mt-1">
                      POWERS ACTIVATED
                    </div>
                  </div>
                </div>
              </motion.div>
              {/* Terminal */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="terminal-comic"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-display text-xl text-comic-yellow">
                    COMMAND GENERATOR
                  </h3>
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-comic-red border border-comic-black" />
                    <div className="w-3 h-3 rounded-full bg-comic-yellow border border-comic-black" />
                    <div className="w-3 h-3 rounded-full bg-comic-green border border-comic-black" />
                  </div>
                </div>

                <div className="bg-black/20 rounded p-4 font-mono text-sm">
                  <div className="mb-2 text-xs text-comic-yellow font-comic flex items-center gap-2">
                    <FaLightbulb /> TIP: Click individual flags to copy them!
                  </div>
                  <pre className="whitespace-pre-wrap break-all text-comic-green">
                    <span className="text-comic-yellow">$</span> npx
                    create-precast-app{" "}
                    <span className="text-comic-blue">{config.name}</span>
                    {config.framework && (
                      <>
                        {" "}
                        <span className="text-comic-purple">--framework=</span>
                        <span className="text-comic-orange">
                          {config.framework}
                        </span>
                      </>
                    )}
                    {config.backend !== "none" && (
                      <>
                        {" "}
                        <span className="text-comic-purple">--backend=</span>
                        <span className="text-comic-orange">
                          {config.backend}
                        </span>
                      </>
                    )}
                    {config.database !== "none" && (
                      <>
                        {" "}
                        <span className="text-comic-purple">--database=</span>
                        <span className="text-comic-orange">
                          {config.database}
                        </span>
                      </>
                    )}
                    {config.orm !== "none" && config.database !== "none" && (
                      <>
                        {" "}
                        <span className="text-comic-purple">--orm=</span>
                        <span className="text-comic-orange">{config.orm}</span>
                      </>
                    )}{" "}
                    <span className="text-comic-purple">--styling=</span>
                    <span className="text-comic-orange">{config.styling}</span>
                    {!config.typescript && (
                      <>
                        {" "}
                        <span className="text-comic-red">--no-typescript</span>
                      </>
                    )}
                    {!config.git && (
                      <>
                        {" "}
                        <span className="text-comic-red">--no-git</span>
                      </>
                    )}
                    {config.docker && (
                      <>
                        {" "}
                        <span className="text-comic-green">--docker</span>
                      </>
                    )}
                  </pre>
                </div>

                <button
                  onClick={copyToClipboard}
                  onMouseEnter={() => !copied && setShowTooltip("copy")}
                  onMouseLeave={() => setShowTooltip("")}
                  className="btn-pow w-full mt-4 flex items-center justify-center gap-2 relative"
                >
                  {copied ? (
                    <>
                      <FaCheck />
                      COPIED!
                    </>
                  ) : (
                    <>
                      <FaCopy />
                      COPY COMMAND
                    </>
                  )}
                  {showTooltip === "copy" && !copied && (
                    <div className="comic-tooltip -top-12 left-1/2 -translate-x-1/2">
                      COPY TO CLIPBOARD!
                    </div>
                  )}
                </button>
              </motion.div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-4">
                <div
                  className="comic-panel p-6 text-center cursor-pointer relative"
                  onMouseEnter={() => setShowTooltip("launch")}
                  onMouseLeave={() => setShowTooltip("")}
                  onClick={() => {
                    navigator.clipboard.writeText(generateCommand());
                    setDialog({
                      isOpen: true,
                      title: "READY TO LAUNCH!",
                      message:
                        "Command copied! Open your terminal and paste to start building your super project!",
                      type: "success",
                    });
                  }}
                >
                  <FaRocket className="text-4xl text-comic-red mx-auto mb-2" />
                  <h4 className="font-display text-xl">LAUNCH</h4>
                  <p className="font-comic text-sm">Start Building</p>
                  {showTooltip === "launch" && (
                    <div className="comic-tooltip -top-12 left-1/2 -translate-x-1/2">
                      COPY & START PROJECT!
                    </div>
                  )}
                </div>

                <motion.div
                  whileTap={{ scale: 0.95 }}
                  onMouseEnter={() => setShowTooltip("save")}
                  onMouseLeave={() => setShowTooltip("")}
                  onClick={async () => {
                    try {
                      await db.savedProjects.add({
                        ...config,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                      });
                      // Reload saved projects
                      const projects = await db.savedProjects.toArray();
                      setSavedProjects(projects);
                      setDialog({
                        isOpen: true,
                        title: "PROJECT SAVED!",
                        message: `Your configuration "${config.name}" has been saved to your hero vault!`,
                        type: "success",
                      });
                    } catch (error) {
                      console.error("Failed to save project:", error);
                      setDialog({
                        isOpen: true,
                        title: "SAVE FAILED!",
                        message:
                          "Failed to save your project configuration. Please try again!",
                        type: "error",
                      });
                    }
                  }}
                  className="comic-panel p-6 text-center cursor-pointer relative"
                >
                  <FaDatabase className="text-4xl text-comic-blue mx-auto mb-2" />
                  <h4 className="font-display text-xl">SAVE</h4>
                  <p className="font-comic text-sm">For Later</p>
                  {showTooltip === "save" && (
                    <div className="comic-tooltip -top-12 left-1/2 -translate-x-1/2">
                      SAVE TO HERO VAULT!
                    </div>
                  )}
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Comic Dialog */}
      <ComicDialog
        isOpen={dialog.isOpen}
        onClose={() => setDialog({ ...dialog, isOpen: false })}
        title={dialog.title}
        message={dialog.message}
        type={dialog.type}
      />
    </div>
  );
}

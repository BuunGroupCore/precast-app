import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FaCheck, FaCopy, FaHistory, FaMagic, FaNpm, FaYarn } from "react-icons/fa";
import { SiBun, SiPnpm } from "react-icons/si";

import {
  AIAssistanceSection,
  ApiSection,
  AuthSection,
  BackendSection,
  DatabaseSection,
  DeploymentSection,
  ExtendedProjectConfig,
  FrameworkSection,
  InstallOptionsSection,
  MCPServersSection,
  PowerUpsSection,
  PreferredStacksDialog,
  PresetTemplatesSection,
  ProjectNameSection,
  RuntimeSection,
  StackSummarySection,
  StylingSection,
  UILibrariesSection,
} from "../components/builder";
import { GenericComicDialog } from "../components/GenericComicDialog";
import { BuilderPageSEO } from "../components/SEO";
import { db, type SavedProject } from "../lib/db";
import { backends, databases, frameworks, orms, stylings } from "../lib/stack-config";

export function BuilderPage() {
  const [config, setConfig] = useState<ExtendedProjectConfig>({
    name: "my-awesome-project",
    framework: "react",
    backend: "node",
    database: "postgres",
    orm: "prisma",
    styling: "tailwind",
    typescript: true,
    git: true,
    docker: false,
    aiAssistant: "none",
    uiLibrary: "none",
    autoInstall: true,
    packageManager: "bun",
    deploymentMethod: "none",
    runtime: "bun",
    auth: "none",
    mcpServers: [],
  });
  const [copied, setCopied] = useState(false);
  const [savedProjects, setSavedProjects] = useState<SavedProject[]>([]);
  const [showSaved, setShowSaved] = useState(false);
  const [packageManager, setPackageManager] = useState("bun");
  const [terminalCopied, setTerminalCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showPreferredStacks, setShowPreferredStacks] = useState(false);

  // Default configuration
  const defaultConfig: ExtendedProjectConfig = {
    name: "my-awesome-project",
    framework: "react",
    backend: "node",
    database: "postgres",
    orm: "prisma",
    styling: "tailwind",
    typescript: true,
    git: true,
    docker: false,
    aiAssistant: "none",
    uiLibrary: "none",
    autoInstall: true,
    packageManager: "bun",
    deploymentMethod: "none",
    runtime: "bun",
    auth: "none",
    mcpServers: [],
  };

  const resetToDefaults = () => {
    setConfig(defaultConfig);
    setPackageManager("bun");
  };

  const handleSelectPreferredStack = (stackConfig: Partial<ExtendedProjectConfig>) => {
    setConfig((prevConfig) => ({
      ...prevConfig,
      ...stackConfig,
    }));
  };

  // Load saved projects and user settings on mount
  useEffect(() => {
    loadSavedProjects();
    loadUserSettings();
  }, []);

  const loadUserSettings = async () => {
    try {
      const userSettings = await db.userSettings.orderBy("updatedAt").last();
      if (userSettings) {
        // Apply user settings as new defaults
        const newDefaults: ExtendedProjectConfig = {
          name: "my-awesome-project",
          framework: userSettings.preferredFramework || "react",
          backend: userSettings.preferredBackend || "node",
          database: userSettings.preferredDatabase || "postgres",
          orm: userSettings.preferredOrm || "prisma",
          styling: userSettings.preferredStyling || "tailwind",
          runtime: userSettings.preferredRuntime || "bun",
          auth: userSettings.preferredAuth || "none",
          uiLibrary: userSettings.preferredUILibrary || "none",
          packageManager: userSettings.preferredPackageManager || "bun",
          deploymentMethod: userSettings.preferredDeployment || "none",
          typescript: userSettings.defaultTypescript ?? true,
          git: userSettings.defaultGit ?? true,
          docker: userSettings.defaultDocker ?? false,
          autoInstall: userSettings.defaultAutoInstall ?? true,
          aiAssistant: "none",
          mcpServers: [],
        };

        setConfig(newDefaults);
        setPackageManager(userSettings.preferredPackageManager || "bun");
      }
    } catch (error) {
      console.error("Failed to load user settings:", error);
    }
  };

  const loadSavedProjects = async () => {
    const projects = await db.savedProjects.toArray();
    setSavedProjects(projects.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()));
  };

  const saveProject = async () => {
    // Check if project with same name already exists
    const existingProject = savedProjects.find((p) => p.name === config.name);

    if (existingProject) {
      // Update existing project
      const updatedProject: SavedProject = {
        ...config,
        id: existingProject.id,
        createdAt: existingProject.createdAt,
        updatedAt: new Date(),
      };
      await db.savedProjects.put(updatedProject);
    } else {
      // Create new project
      const project: SavedProject = {
        ...config,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      await db.savedProjects.add(project);
    }

    await loadSavedProjects();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const loadProject = (project: SavedProject) => {
    const { id: _id, createdAt: _createdAt, updatedAt: _updatedAt, ...projectConfig } = project;
    setConfig(projectConfig as ExtendedProjectConfig);
    setShowSaved(false);
  };

  const deleteProject = async (id: number) => {
    await db.savedProjects.delete(id);
    await loadSavedProjects();
  };

  const generateCommand = () => {
    let prefix = "";
    switch (packageManager) {
      case "npx":
        prefix = "npx create-precast-app@latest";
        break;
      case "npm":
        prefix = "npm create precast-app@latest";
        break;
      case "yarn":
        prefix = "yarn create precast-app";
        break;
      case "pnpm":
        prefix = "pnpm create precast-app";
        break;
      case "bun":
        prefix = "bun create precast-app";
        break;
    }
    const parts = [prefix];
    parts.push(config.name);

    // Required options
    parts.push(`--framework=${config.framework}`);
    parts.push(`--backend=${config.backend || "none"}`);
    parts.push(`--database=${config.database || "none"}`);
    parts.push(`--orm=${config.orm || "none"}`);
    parts.push(`--styling=${config.styling}`);
    parts.push(`--runtime=${config.runtime || "node"}`);

    // Auth option (CLI supports this)
    if (config.auth && config.auth !== "none") {
      parts.push(`--auth=${config.auth}`);
    }

    // AI Assistant option
    if (config.aiAssistant && config.aiAssistant !== "none") {
      parts.push(`--ai=${config.aiAssistant}`);
    }

    // Package manager
    if (config.packageManager && config.packageManager !== "bun") {
      parts.push(`--pm=${config.packageManager}`);
    }

    // Boolean flags
    if (!config.typescript) {
      parts.push("--no-typescript");
    }

    if (!config.git) {
      parts.push("--no-git");
    }

    if (config.docker) {
      parts.push("--docker");
    }

    if (config.autoInstall) {
      parts.push("--install");
    }

    // MCP Servers (only if AI assistant is selected)
    if (
      config.aiAssistant &&
      config.aiAssistant !== "none" &&
      config.mcpServers &&
      config.mcpServers.length > 0
    ) {
      parts.push(`--mcp-servers=${config.mcpServers.join(",")}`);
    }

    // Add --yes flag to skip all prompts
    parts.push("--yes");

    // These options are not supported by the CLI yet, so we'll comment them out
    // TODO: Add these to the CLI
    // --ui (uiLibrary)
    // --deploy (deploymentMethod)
    // --powerups

    return parts.join(" ");
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(generateCommand());
    setCopied(true);
    setTerminalCopied(true);
    setTimeout(() => {
      setCopied(false);
      setTerminalCopied(false);
    }, 2000);
  };

  return (
    <div>
      <BuilderPageSEO />
      <main className="pb-8">
        <div className="w-full">
          {/* Action Title */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center mb-6 sm:mb-8"
          >
            <h2 className="action-text text-4xl sm:text-6xl text-comic-red mb-4">
              CHOOSE YOUR POWERS!
            </h2>
            <p className="font-comic text-xl">Build your super project with style!</p>
          </motion.div>

          <div className="grid lg:grid-cols-[1fr_400px] gap-8 px-4 max-w-[1600px] mx-auto">
            {/* Left Column - Configuration */}
            <div className="space-y-6">
              {/* Preset Templates - First to offer quick starts */}
              <PresetTemplatesSection config={config} setConfig={setConfig} />

              {/* 1. Framework Selection - The foundation */}
              <FrameworkSection config={config} setConfig={setConfig} />

              {/* 2. Styling Selection - Visual foundation */}
              <StylingSection config={config} setConfig={setConfig} />

              {/* 3. UI Components Section - Component libraries */}
              <UILibrariesSection config={config} setConfig={setConfig} />

              {/* 4. Backend Selection - If needed */}
              <BackendSection config={config} setConfig={setConfig} />

              {/* 4.5. API Communication - If backend is selected */}
              <ApiSection config={config} setConfig={setConfig} />

              {/* 5. Runtime Selection - Execution environment */}
              <RuntimeSection config={config} setConfig={setConfig} />

              {/* 6. Database Selection - If backend exists */}
              <DatabaseSection config={config} setConfig={setConfig} />

              {/* 7. Authentication Section - User management */}
              <AuthSection config={config} setConfig={setConfig} />

              {/* 8. Power-ups - Development tools and extensions */}
              <PowerUpsSection config={config} setConfig={setConfig} />

              {/* 9. AI Assistance Section - Development assistance */}
              <AIAssistanceSection config={config} setConfig={setConfig} />

              {/* 10. MCP Servers Section - AI-powered integrations (only for Claude Code) */}
              {config.aiAssistant === "claude" && (
                <MCPServersSection config={config} setConfig={setConfig} />
              )}

              {/* 11. Install Options Section - Package management */}
              <InstallOptionsSection config={config} setConfig={setConfig} />

              {/* 12. Deployment Options Section - Where to deploy */}
              <DeploymentSection config={config} setConfig={setConfig} />
            </div>

            {/* Right Column - Terminal & Actions */}
            <div className="lg:sticky lg:top-28 h-fit space-y-4">
              {/* Project Name */}
              <ProjectNameSection config={config} setConfig={setConfig} />

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="grid grid-cols-2 gap-3"
              >
                {/* Preferred Stacks Button */}
                <button
                  onClick={() => setShowPreferredStacks(true)}
                  className="py-3 bg-comic-blue text-comic-white font-display text-sm rounded-lg border-3 border-comic-black hover:bg-comic-darkBlue transition-colors flex items-center justify-center gap-2"
                  title="Choose from pre-configured popular stacks"
                >
                  <FaHistory className="text-lg" />
                  PREFERRED STACKS
                </button>

                {/* Reset Button */}
                <button
                  onClick={resetToDefaults}
                  className="py-3 bg-comic-orange text-comic-white font-display text-sm rounded-lg border-3 border-comic-black hover:bg-comic-red transition-colors flex items-center justify-center gap-2"
                  title="Reset all options to default values"
                >
                  <FaMagic className="text-lg" />
                  RESET TO DEFAULTS
                </button>
              </motion.div>

              {/* Stack Summary */}
              <StackSummarySection config={config} />

              {/* Terminal with Integrated Package Manager */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="relative"
              >
                <div
                  className="comic-panel bg-comic-black border-4 border-comic-black overflow-hidden"
                  style={{ boxShadow: "6px 6px 0 rgba(0,0,0,0.4)" }}
                >
                  {/* Terminal Header */}
                  <div className="bg-comic-darkGray px-4 py-2 flex items-center justify-between border-b-2 border-comic-black">
                    <div className="flex gap-2">
                      <div className="w-3 h-3 rounded-full bg-comic-red border border-comic-black"></div>
                      <div className="w-3 h-3 rounded-full bg-comic-yellow border border-comic-black"></div>
                      <div className="w-3 h-3 rounded-full bg-comic-green border border-comic-black"></div>
                    </div>
                    <div className="font-comic text-xs text-comic-white/60">TERMINAL</div>
                  </div>

                  {/* Package Manager Tabs */}
                  <div className="flex bg-gradient-to-r from-comic-darkGray to-comic-black border-b-2 border-comic-black">
                    {[
                      { id: "npx", icon: FaNpm, name: "npx", color: "bg-red-600" },
                      { id: "npm", icon: FaNpm, name: "npm", color: "bg-red-600" },
                      { id: "yarn", icon: FaYarn, name: "yarn", color: "bg-blue-600" },
                      { id: "pnpm", icon: SiPnpm, name: "pnpm", color: "bg-yellow-600" },
                      { id: "bun", icon: SiBun, name: "bun", color: "bg-pink-600" },
                    ].map((pm, index) => (
                      <button
                        key={pm.id}
                        onClick={() => setPackageManager(pm.id)}
                        className={`flex-1 px-3 py-2 font-comic text-xs transition-all relative ${
                          index < 4 ? "border-r-2 border-comic-black" : ""
                        } ${
                          packageManager === pm.id
                            ? `${pm.color} text-white font-bold shadow-inner`
                            : "bg-comic-darkGray/70 text-comic-white/70 hover:text-comic-white hover:bg-comic-darkGray"
                        }`}
                      >
                        {packageManager === pm.id && (
                          <div className="absolute inset-x-0 bottom-0 h-0.5 bg-comic-yellow"></div>
                        )}
                        <pm.icon className="inline mr-1" />
                        {pm.name}
                      </button>
                    ))}
                  </div>

                  {/* Command Display */}
                  <div
                    className="p-6 cursor-pointer hover:bg-gray-900 transition-colors"
                    onClick={copyToClipboard}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-comic-green text-lg font-bold">$</span>
                      <span className="text-comic-white font-comic text-sm sm:text-base break-all leading-relaxed">
                        {generateCommand()}
                      </span>
                    </div>

                    {/* Copy Hint */}
                    {!terminalCopied && (
                      <div className="mt-6 flex items-center justify-center gap-2">
                        <span className="text-comic-yellow text-sm font-comic font-bold">
                          CLICK TO COPY COMMAND
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Copied Overlay */}
                  {terminalCopied && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="absolute inset-0 flex items-center justify-center bg-comic-black/95 z-20"
                    >
                      <div className="text-center">
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: [0, 1.2, 1] }}
                          transition={{ duration: 0.3 }}
                        >
                          <FaCheck className="text-6xl text-comic-green mx-auto mb-2" />
                        </motion.div>
                        <span className="action-text text-4xl text-comic-yellow">COPIED!</span>
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="space-y-3"
              >
                <button
                  onClick={copyToClipboard}
                  className="w-full py-4 bg-comic-red text-comic-white font-display text-xl rounded-lg border-3 border-comic-black hover:bg-comic-yellow hover:text-comic-black transition-colors flex items-center justify-center gap-3"
                >
                  {copied ? (
                    <>
                      <FaCheck /> COPIED!
                    </>
                  ) : (
                    <>
                      <FaCopy /> COPY COMMAND
                    </>
                  )}
                </button>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={saveProject}
                    className="py-3 bg-comic-green text-comic-white font-comic rounded-lg border-3 border-comic-black hover:bg-comic-blue transition-colors flex items-center justify-center gap-2"
                  >
                    {saved ? (
                      <>
                        <FaCheck /> Saved!
                      </>
                    ) : (
                      <>
                        <FaMagic /> Save
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => setShowSaved(true)}
                    className="py-3 bg-comic-purple text-comic-white font-comic rounded-lg border-3 border-comic-black hover:bg-comic-blue transition-colors flex items-center justify-center gap-2"
                  >
                    <FaHistory /> Load
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </main>

      {/* Saved Projects Dialog */}
      <GenericComicDialog
        isOpen={showSaved}
        onClose={() => setShowSaved(false)}
        title="SAVED PROJECTS"
      >
        <div className="space-y-3">
          {savedProjects.length === 0 ? (
            <p className="text-center font-comic text-comic-gray py-8">
              No saved projects yet! Create and save your first one.
            </p>
          ) : (
            savedProjects.map((project) => (
              <div key={project.id} className="comic-panel p-4 flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="font-display text-lg">{project.name}</h4>
                  <div className="flex items-center gap-2 mt-2">
                    {/* Framework Icon */}
                    {(() => {
                      const framework = frameworks.find((f) => f.id === project.framework);
                      return framework?.icon ? <framework.icon className="text-lg" /> : null;
                    })()}
                    {/* Backend Icon */}
                    {project.backend !== "none" &&
                      (() => {
                        const backend = backends.find((b) => b.id === project.backend);
                        return backend?.icon ? <backend.icon className="text-lg" /> : null;
                      })()}
                    {/* Database Icon */}
                    {project.database !== "none" &&
                      (() => {
                        const database = databases.find((d) => d.id === project.database);
                        return database?.icon ? <database.icon className="text-lg" /> : null;
                      })()}
                    {/* ORM Icon */}
                    {project.orm !== "none" &&
                      (() => {
                        const orm = orms.find((o) => o.id === project.orm);
                        return orm?.icon ? <orm.icon className="text-lg" /> : null;
                      })()}
                    {/* Styling Icon */}
                    {(() => {
                      const styling = stylings.find((s) => s.id === project.styling);
                      return styling?.icon ? <styling.icon className="text-lg" /> : null;
                    })()}
                  </div>
                  <p className="text-xs font-comic text-comic-gray mt-1">
                    {new Date(project.updatedAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => loadProject(project)}
                    className="px-3 py-1 bg-comic-green text-comic-white font-comic text-sm rounded border-2 border-comic-black hover:bg-comic-blue"
                  >
                    Load
                  </button>
                  <button
                    onClick={() => project.id && deleteProject(project.id)}
                    className="px-3 py-1 bg-comic-red text-comic-white font-comic text-sm rounded border-2 border-comic-black hover:bg-comic-orange"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </GenericComicDialog>

      {/* Preferred Stacks Dialog */}
      <PreferredStacksDialog
        isOpen={showPreferredStacks}
        onClose={() => setShowPreferredStacks(false)}
        onSelectStack={handleSelectPreferredStack}
      />
    </div>
  );
}

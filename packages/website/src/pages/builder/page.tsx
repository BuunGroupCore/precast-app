import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FaHistory, FaMagic, FaDocker } from "react-icons/fa";
import { useLocation } from "react-router-dom";

import {
  AIAssistanceSection,
  ApiSection,
  AuthSection,
  BackendSection,
  CompactSidebar,
  DatabaseSection,
  DeploymentSection,
  DesignSection,
  ExtendedProjectConfig,
  FeatureTogglesSection,
  FrameworkSection,
  InstallOptionsSection,
  MCPServersSection,
  PluginsSection,
  PowerUpsSection,
  PreferredStacksDialog,
  ProjectNameSection,
  RuntimeSection,
  StylingSection,
  UILibrariesSection,
} from "@/components/builder";
import { BuilderPageSEO, GenericComicDialog } from "@/features/common";
import { colorPalettes } from "@/lib/color-palettes";
import { db, type SavedProject } from "@/lib/db";
import { backends, databases, frameworks, orms, stylings } from "@/lib/stack-config";
import { trackBuilderAction, trackConversion } from "@/utils/analytics";

/**
 * Interactive project builder page for creating full-stack applications.
 * Provides a visual interface for selecting frameworks, databases, styling, and more.
 */
export function BuilderPage() {
  const location = useLocation();
  const defaultPalette = colorPalettes.find((p) => p.id === "shadcn");

  // Get recommended stack from survey if available
  const recommendedStack = location.state?.recommendedStack;

  const [config, setConfig] = useState<ExtendedProjectConfig>({
    name: "my-awesome-project",
    framework: recommendedStack?.framework || "react",
    backend: recommendedStack?.backend || "node",
    database: recommendedStack?.database || "postgres",
    databaseDeployment: "local",
    orm: recommendedStack?.orm || "drizzle",
    styling: recommendedStack?.styling || "tailwind",
    typescript: recommendedStack?.typescript ?? true,
    git: recommendedStack?.git ?? true,
    docker: recommendedStack?.docker ?? false,
    aiAssistant: recommendedStack?.aiAssistant || "none",
    uiLibrary: recommendedStack?.uiLibrary || "none",
    autoInstall: recommendedStack?.autoInstall ?? true,
    packageManager: recommendedStack?.packageManager || "bun",
    deploymentMethod: recommendedStack?.deploymentMethod || "none",
    runtime: recommendedStack?.runtime || "bun",
    auth: recommendedStack?.auth || "none",
    mcpServers: recommendedStack?.mcpServers || [],
    colorPalette: defaultPalette,
    plugins: recommendedStack?.plugins || [],
  });
  const [savedProjects, setSavedProjects] = useState<SavedProject[]>([]);
  const [showSaved, setShowSaved] = useState(false);
  const [packageManager, setPackageManager] = useState("npx");
  const [terminalCopied, setTerminalCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showPreferredStacks, setShowPreferredStacks] = useState(false);
  const [showDockerRequiredDialog, setShowDockerRequiredDialog] = useState(false);

  const defaultConfig: ExtendedProjectConfig = {
    name: "my-awesome-project",
    framework: "react",
    backend: "node",
    database: "postgres",
    databaseDeployment: "local",
    orm: "drizzle",
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

  const resetToDefaults = async () => {
    try {
      const userSettings = await db.userSettings.orderBy("updatedAt").last();
      if (userSettings) {
        /** Use user's preferred settings as reset defaults */
        const resetConfig: ExtendedProjectConfig = {
          name: "my-awesome-project",
          framework: userSettings.preferredFramework || "react",
          uiFramework: userSettings.preferredUIFramework,
          backend: userSettings.preferredBackend || "node",
          database: userSettings.preferredDatabase || "postgres",
          databaseDeployment: "local",
          orm: userSettings.preferredOrm || "drizzle",
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
        setConfig(resetConfig);
        setPackageManager(userSettings.preferredPackageManager || "npx");
      } else {
        /** Fallback to hardcoded defaults if no user settings */
        setConfig(defaultConfig);
        setPackageManager("npx");
      }
    } catch (error) {
      console.error("Failed to load user settings for reset:", error);
      /** Fallback to hardcoded defaults on error */
      setConfig(defaultConfig);
      setPackageManager("bun");
    }
  };

  const handleSelectPreferredStack = (stackConfig: Partial<ExtendedProjectConfig>) => {
    setConfig((prevConfig) => ({
      ...prevConfig,
      ...stackConfig,
    }));
  };

  useEffect(() => {
    loadSavedProjects();
    loadUserSettings();
  }, []);

  // Auto-select Turborepo when both frontend and backend are selected
  useEffect(() => {
    const hasBackend = config.backend && config.backend !== "none";
    const hasFrontend = config.framework && config.framework !== "vanilla";

    if (hasBackend && hasFrontend) {
      // Auto-add turborepo if not already present
      setConfig((prev) => {
        if (!prev.powerups?.includes("turborepo")) {
          return {
            ...prev,
            powerups: [...(prev.powerups || []), "turborepo"],
          };
        }
        return prev;
      });
    } else {
      // Remove turborepo if frontend or backend is removed
      setConfig((prev) => {
        if (prev.powerups?.includes("turborepo")) {
          return {
            ...prev,
            powerups: prev.powerups?.filter((id) => id !== "turborepo") || [],
          };
        }
        return prev;
      });
    }
  }, [config.backend, config.framework]);

  // Auto-enable Docker when local database deployment is selected
  useEffect(() => {
    if (config.databaseDeployment === "local" && !config.docker) {
      setConfig((prev) => ({
        ...prev,
        docker: true,
      }));
    }
  }, [config.databaseDeployment, config.docker]);

  const handleDockerToggle = () => {
    // If trying to disable Docker but have local database, show warning
    if (config.docker && config.databaseDeployment === "local") {
      setShowDockerRequiredDialog(true);
      return;
    }

    // Otherwise, toggle normally
    setConfig((prev) => ({
      ...prev,
      docker: !prev.docker,
    }));
  };

  const loadUserSettings = async () => {
    try {
      const userSettings = await db.userSettings.orderBy("updatedAt").last();
      if (userSettings) {
        /** Apply user settings as new defaults */
        const newDefaults: ExtendedProjectConfig = {
          name: "my-awesome-project",
          framework: userSettings.preferredFramework || "react",
          uiFramework: userSettings.preferredUIFramework,
          backend: userSettings.preferredBackend || "node",
          database: userSettings.preferredDatabase || "postgres",
          databaseDeployment: "local",
          orm: userSettings.preferredOrm || "drizzle",
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
        setPackageManager(userSettings.preferredPackageManager || "npx");
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
    const existingProject = savedProjects.find((p) => p.name === config.name);

    if (existingProject) {
      const updatedProject: SavedProject = {
        ...config,
        id: existingProject.id,
        createdAt: existingProject.createdAt,
        updatedAt: new Date(),
      };
      await db.savedProjects.put(updatedProject);
    } else {
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, createdAt, updatedAt, ...projectConfig } = project;
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

    /** Required options */
    parts.push(`--framework=${config.framework}`);
    parts.push(`--backend=${config.backend || "none"}`);
    parts.push(`--database=${config.database || "none"}`);
    parts.push(`--orm=${config.orm || "none"}`);
    parts.push(`--styling=${config.styling}`);
    parts.push(`--runtime=${config.runtime || "node"}`);

    /** UI Framework (when using Vite) */
    if (config.framework === "vite" && config.uiFramework) {
      parts.push(`--ui-framework=${config.uiFramework}`);
    }

    /** Auth option (CLI supports this) */
    if (config.auth && config.auth !== "none") {
      parts.push(`--auth=${config.auth}`);
    }

    /** UI Library (CLI supports this) */
    if (config.uiLibrary && config.uiLibrary !== "none") {
      parts.push(`--ui-library=${config.uiLibrary}`);
    }

    /** API Client (CLI supports this) */
    if (config.apiClient && config.apiClient !== "none") {
      parts.push(`--api-client=${config.apiClient}`);
    }

    if (config.aiAssistant && config.aiAssistant !== "none") {
      parts.push(`--ai=${config.aiAssistant}`);
    }

    /** Package manager */
    if (config.packageManager && config.packageManager !== "bun") {
      parts.push(`--pm=${config.packageManager}`);
    }

    /** Boolean flags */
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

    /** MCP Servers (only if AI assistant is selected) */
    if (
      config.aiAssistant &&
      config.aiAssistant !== "none" &&
      config.mcpServers &&
      config.mcpServers.length > 0
    ) {
      parts.push(`--mcp-servers ${config.mcpServers.join(" ")}`);
    }

    /** Powerups */
    if (config.powerups && config.powerups.length > 0) {
      parts.push(`--powerups=${config.powerups.join(",")}`);
    }

    /** Plugins */
    if (config.plugins && config.plugins.length > 0) {
      parts.push(`--plugins=${config.plugins.join(",")}`);
    }

    /** Color Palette */
    if (config.colorPalette && config.colorPalette.id !== "default") {
      // Only include predefined palette IDs that the CLI supports
      // Custom palettes are not yet supported by the CLI
      if (config.colorPalette.id !== "custom") {
        parts.push(`--color-palette ${config.colorPalette.id}`);
      }
    }

    /** CLI Feature Toggles (add flags for disabled features) */
    if (config.prettier === false) {
      parts.push("--no-prettier");
    }
    if (config.eslint === false) {
      parts.push("--no-eslint");
    }
    if (config.dockerCompose === false) {
      parts.push("--no-secure-passwords");
    }
    if (config.gitignore === false) {
      parts.push("--no-gitignore");
    }
    if (config.generate === false) {
      parts.push("--no-generate");
    }

    /** AI Documentation Generation */
    if (config.aiAssistant && config.aiAssistant !== "none") {
      if (config.generateSpec || config.generatePrd) {
        parts.push("--ai-docs");
      }
    }

    /** Deployment method */
    if (config.deploymentMethod && config.deploymentMethod !== "none") {
      parts.push(`--deployment=${config.deploymentMethod}`);
    }

    parts.push("--yes");

    return parts.join(" ");
  };

  const copyToClipboard = async () => {
    const command = generateCommand();
    await navigator.clipboard.writeText(command);
    setTerminalCopied(true);

    // Track analytics
    trackBuilderAction(
      "command_copied",
      `${config.framework}-${config.backend}-${config.database}`
    );
    trackConversion("project_command_generated");

    setTimeout(() => {
      setTerminalCopied(false);
    }, 2000);
  };

  return (
    <div>
      <BuilderPageSEO />
      {/* Skip Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 bg-comic-blue text-comic-white px-4 py-2 rounded border-2 border-comic-black"
        tabIndex={0}
      >
        Skip to main content
      </a>
      <main
        id="main-content"
        className="pb-8"
        role="main"
        aria-label="Project configuration builder"
      >
        <div className="w-full">
          {/* Action Title */}
          <header className="text-center mb-6 sm:mb-8">
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}>
              <h1 className="action-text text-4xl sm:text-6xl text-comic-red mb-4">
                CHOOSE YOUR POWERS!
              </h1>
              <p className="font-comic text-xl" id="builder-description">
                Build your super project with style!
              </p>
            </motion.div>
          </header>

          <div className="flex flex-col lg:grid lg:grid-cols-[1fr_minmax(300px,400px)] gap-4 sm:gap-6 lg:gap-8 px-2 sm:px-4 max-w-[1600px] mx-auto">
            {/* Left Column - Configuration */}
            <section className="space-y-6" aria-labelledby="configuration-heading" role="region">
              <h2 id="configuration-heading" className="sr-only">
                Project Configuration Options
              </h2>
              {/* Preset Templates - First to offer quick starts
              <PresetTemplatesSection config={config} setConfig={setConfig} /> */}

              {/* 1. Framework Selection - The foundation */}
              <div data-section="framework">
                <FrameworkSection config={config} setConfig={setConfig} />
              </div>

              {/* 2. Styling Selection - Visual foundation */}
              <div data-section="styling">
                <StylingSection config={config} setConfig={setConfig} />
              </div>

              {/* 2.5. Design System - Visual styling and theme customization */}
              <div data-section="design">
                <DesignSection config={config} setConfig={setConfig} />
              </div>

              {/* 3. UI Components Section - Component libraries */}
              <UILibrariesSection config={config} setConfig={setConfig} />

              {/* 4. Backend Selection - If needed */}
              <div data-section="backend">
                <BackendSection config={config} setConfig={setConfig} />
              </div>

              {/* 4.5. API Communication - If backend is selected */}
              <ApiSection config={config} setConfig={setConfig} />

              {/* 5. Runtime Selection - Execution environment */}
              <RuntimeSection config={config} setConfig={setConfig} />

              {/* 6. Database Selection - If backend exists */}
              {config.backend && config.backend !== "none" && (
                <div data-section="database">
                  <DatabaseSection config={config} setConfig={setConfig} />
                </div>
              )}

              {/* 7. Authentication Section - User management (requires backend AND database) */}
              {config.backend &&
                config.backend !== "none" &&
                config.database &&
                config.database !== "none" && (
                  <div data-section="auth">
                    <AuthSection config={config} setConfig={setConfig} />
                  </div>
                )}

              {/* Show warning when backend is none but trying to use auth */}
              {config.backend === "none" && (
                <div className="comic-panel p-4 bg-comic-yellow/20 border-3 border-comic-yellow">
                  <h3 className="font-display text-lg text-comic-black mb-2 flex items-center gap-2">
                    ⚠️ AUTHENTICATION REQUIRES BACKEND
                  </h3>
                  <p className="font-comic text-sm text-comic-black/80">
                    Authentication requires a backend server to securely handle credentials and
                    tokens. Client-side only applications cannot safely store API keys or secrets.
                    Please select a backend framework to enable authentication options.
                  </p>
                </div>
              )}

              {/* 8. Power-ups - Development tools and extensions */}
              <PowerUpsSection
                config={config}
                setConfig={setConfig}
                handleDockerToggle={handleDockerToggle}
              />

              {/* 9. Plugins - Business integrations */}
              <PluginsSection config={config} setConfig={setConfig} />

              {/* 10. AI Assistance Section - Development assistance */}
              <AIAssistanceSection config={config} setConfig={setConfig} />

              {/* 10. MCP Servers Section - AI-powered integrations (only for Claude Code) */}
              {config.aiAssistant === "claude" && (
                <MCPServersSection config={config} setConfig={setConfig} />
              )}

              {/* 11. Install Options Section - Package management */}
              <div data-section="feature">
                <InstallOptionsSection config={config} setConfig={setConfig} />
              </div>

              {/* 12. CLI Feature Toggles - Control what gets generated */}
              <div data-section="feature">
                <FeatureTogglesSection config={config} setConfig={setConfig} />
              </div>

              {/* 13. Deployment Options Section - Where to deploy */}
              <DeploymentSection config={config} setConfig={setConfig} />
            </section>

            {/* Right Column - Compact Sidebar */}
            <aside
              className="w-full lg:sticky lg:top-28 h-fit space-y-4"
              aria-labelledby="sidebar-heading"
              role="complementary"
            >
              <h2 id="sidebar-heading" className="sr-only">
                Project Summary and Actions
              </h2>
              {/* Project Name */}
              <ProjectNameSection config={config} setConfig={setConfig} />

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="grid grid-cols-3 gap-2"
                role="group"
                aria-labelledby="quick-actions-heading"
              >
                <h3 id="quick-actions-heading" className="sr-only">
                  Quick Actions
                </h3>

                {/* Preferred Stacks Button */}
                <button
                  onClick={() => setShowPreferredStacks(true)}
                  className="py-2 bg-comic-blue text-comic-white font-display text-[10px] sm:text-xs rounded-lg border-2 border-comic-black hover:bg-comic-darkBlue focus:ring-2 focus:ring-comic-blue focus:ring-offset-2 transition-colors flex flex-col items-center justify-center gap-1"
                  aria-label="Choose from pre-configured popular technology stacks"
                  tabIndex={0}
                >
                  <FaHistory className="text-sm sm:text-base" aria-hidden="true" />
                  <span className="hidden sm:inline">STACKS</span>
                  <span className="sr-only sm:hidden">Popular Stacks</span>
                </button>

                {/* Save Button */}
                <button
                  onClick={saveProject}
                  className="py-2 bg-comic-green text-comic-white font-display text-[10px] sm:text-xs rounded-lg border-2 border-comic-black hover:bg-comic-darkGreen focus:ring-2 focus:ring-comic-green focus:ring-offset-2 transition-colors flex flex-col items-center justify-center gap-1"
                  aria-label="Save current project configuration"
                  tabIndex={0}
                >
                  <FaMagic className="text-sm sm:text-base" aria-hidden="true" />
                  <span className="hidden sm:inline">{saved ? "SAVED!" : "SAVE"}</span>
                  <span className="sr-only sm:hidden">
                    {saved ? "Configuration Saved" : "Save Configuration"}
                  </span>
                </button>

                {/* Load Button */}
                <button
                  onClick={() => setShowSaved(true)}
                  className="py-2 bg-comic-purple text-comic-white font-display text-[10px] sm:text-xs rounded-lg border-2 border-comic-black hover:bg-comic-darkPurple focus:ring-2 focus:ring-comic-purple focus:ring-offset-2 transition-colors flex flex-col items-center justify-center gap-1"
                  aria-label="Load previously saved project configuration"
                  tabIndex={0}
                >
                  <FaHistory className="text-sm sm:text-base" aria-hidden="true" />
                  <span className="hidden sm:inline">LOAD</span>
                  <span className="sr-only sm:hidden">Load Configuration</span>
                </button>
              </motion.div>

              {/* Compact Sidebar with Tabs */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <CompactSidebar
                  config={config}
                  setConfig={setConfig}
                  generateCommand={generateCommand}
                  copyToClipboard={copyToClipboard}
                  terminalCopied={terminalCopied}
                  packageManager={packageManager}
                  setPackageManager={setPackageManager}
                  saveProject={saveProject}
                  resetToDefaults={resetToDefaults}
                  showPreferredStacks={() => setShowPreferredStacks(true)}
                  saved={saved}
                  handleDockerToggle={handleDockerToggle}
                />
              </motion.div>
            </aside>
          </div>
        </div>
      </main>

      {/* Saved Projects Dialog */}
      <GenericComicDialog
        isOpen={showSaved}
        onClose={() => setShowSaved(false)}
        title="SAVED PROJECTS"
        aria-describedby="saved-projects-description"
      >
        <div id="saved-projects-description" className="sr-only">
          Dialog to view, load, or delete previously saved project configurations
        </div>
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
                    className="px-3 py-1 bg-comic-green text-comic-white font-comic text-sm rounded border-2 border-comic-black hover:bg-comic-blue focus:ring-2 focus:ring-comic-green focus:ring-offset-2"
                    aria-label={`Load project ${project.name}`}
                  >
                    Load
                  </button>
                  <button
                    onClick={() => project.id && deleteProject(project.id)}
                    className="px-3 py-1 bg-comic-red text-comic-white font-comic text-sm rounded border-2 border-comic-black hover:bg-comic-orange focus:ring-2 focus:ring-comic-red focus:ring-offset-2"
                    aria-label={`Delete project ${project.name}`}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </GenericComicDialog>

      {/* Docker Required Dialog */}
      <GenericComicDialog
        isOpen={showDockerRequiredDialog}
        onClose={() => setShowDockerRequiredDialog(false)}
        title="DOCKER REQUIRED!"
        size="sm"
        aria-describedby="docker-required-description"
        role="alertdialog"
      >
        <div id="docker-required-description" className="sr-only">
          Information dialog explaining that Docker is required for local database deployment
        </div>
        <div className="text-center">
          <div className="flex justify-center text-5xl mb-4 text-comic-blue">
            <FaDocker />
          </div>
          <div className="font-comic text-lg text-comic-black mb-4">
            Docker is required to generate the docker-compose file for your local database!
          </div>
          <div className="font-comic text-sm text-comic-gray mb-6">
            When you select local database deployment, Docker automatically sets up containerized
            databases for development.
          </div>
          <button
            onClick={() => setShowDockerRequiredDialog(false)}
            className="px-6 py-2 bg-comic-blue text-comic-white font-display text-sm rounded-lg border-2 border-comic-black hover:bg-comic-darkBlue focus:ring-2 focus:ring-comic-blue focus:ring-offset-2 transition-colors"
            aria-label="Acknowledge Docker requirement and close dialog"
          >
            GOT IT!
          </button>
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

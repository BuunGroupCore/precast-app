import * as path from "path";

import chalk from "chalk";
import fsExtra from "fs-extra";

import {
  theme,
  createHeroBanner,
  createFancyBox,
  divider,
  bulletList,
  techBadge,
  getFrameworkIcon,
  createLink,
  statusSymbols,
  actionSymbols,
} from "../utils/cli-theme.js";

const { pathExists, readFile } = fsExtra;

interface PrecastConfig {
  name: string;
  version: string;
  framework: string;
  backend?: string;
  database?: string;
  orm?: string;
  authProvider?: string;
  styling?: string;
  uiLibrary?: string;
  packageManager?: string;
  apiClient?: string;
  testing?: string;
  aiAssistant?: string;
  deployment?: string;
  deploymentType?: string;
  colorPalette?: string;
  plugins?: string[];
  powerups?: string[];
  mcpServers?: string[];
  docker?: boolean;
  typescript?: boolean;
  git?: boolean;
  createdAt?: string;
  lastModified?: string;
  [key: string]: any;
}

/**
 * Get color palette display with colored circles showing the theme colors
 *
 * @param paletteId - ID of the color palette to display
 * @returns Formatted string with color circles and palette name, or null if not found
 */
async function getColorPaletteDisplay(paletteId: string): Promise<string | null> {
  try {
    // Dynamically import the color palette module
    const { getColorPaletteById } = await import("../../../shared/src/color-palettes.js");
    const palette = getColorPaletteById(paletteId);

    if (!palette) return null;

    const previewColors = palette.preview || [
      palette.colors.primary,
      palette.colors.secondary,
      palette.colors.accent,
      palette.colors.background,
    ];

    const colorDisplay = previewColors
      .map((color) => {
        const coloredCircle = chalk.hex(color)("●");
        return `${coloredCircle} ${theme.dim(color)}`;
      })
      .join("  ");

    return `${theme.accent("◇")} ${palette.name} palette\n     ${colorDisplay}`;
  } catch {
    return null;
  }
}

/**
 * Create a formatted tech stack display organized by categories
 *
 * @param config - Project configuration containing tech stack information
 * @returns Formatted string with organized tech stack sections
 */
function createTechStackDisplay(config: PrecastConfig): string {
  const sections: string[] = [];

  const coreItems = [
    `${getFrameworkIcon(config.framework)} ${techBadge(config.framework)}`,
    config.backend && config.backend !== "none" ? `${techBadge(config.backend)}` : null,
    config.packageManager ? `${theme.accent("◆")} ${config.packageManager}` : null,
  ].filter(Boolean) as string[];

  if (coreItems.length > 0) {
    sections.push(`${theme.bold("Core Stack")}\n${bulletList(coreItems)}`);
  }

  const dataItems: string[] = [];
  if (config.database && config.database !== "none") {
    dataItems.push(`${techBadge(config.database)}`);
    if (config.orm && config.orm !== "none") {
      dataItems.push(`${techBadge(config.orm)}`);
    }
  }

  if (dataItems.length > 0) {
    sections.push(`${theme.bold("Data Layer")}\n${bulletList(dataItems)}`);
  }

  const uiItems: string[] = [];
  if (config.styling && config.styling !== "none") {
    uiItems.push(`${techBadge(config.styling)}`);
  }
  if (config.uiLibrary && config.uiLibrary !== "none") {
    uiItems.push(`${techBadge(config.uiLibrary)}`);
  }

  if (uiItems.length > 0) {
    sections.push(`${theme.bold("UI & Styling")}\n${bulletList(uiItems)}`);
  }

  const featureItems: string[] = [];
  if (config.authProvider && config.authProvider !== "none") {
    featureItems.push(`${techBadge(config.authProvider)}`);
  }
  if (config.apiClient && config.apiClient !== "none") {
    featureItems.push(`${techBadge(config.apiClient)}`);
  }
  if (config.aiAssistant && config.aiAssistant !== "none") {
    featureItems.push(`${theme.accent("◉")} ${config.aiAssistant}`);
  }
  if (config.plugins && config.plugins.length > 0) {
    config.plugins.forEach((plugin) => {
      featureItems.push(`${theme.accent("▶")} ${plugin}`);
    });
  }

  if (featureItems.length > 0) {
    sections.push(`${theme.bold("Features & Integrations")}\n${bulletList(featureItems)}`);
  }

  return sections.join("\n\n");
}

/**
 * Create health status display by checking project files and configuration
 *
 * @param targetPath - Path to the project directory
 * @param config - Project configuration for health checks
 * @returns Formatted string with health check results
 */
async function createHealthDisplay(targetPath: string, config: PrecastConfig): Promise<string> {
  const checks: string[] = [];

  const nodeModulesPath = path.join(targetPath, "node_modules");
  const hasNodeModules = await pathExists(nodeModulesPath);
  checks.push(
    hasNodeModules
      ? theme.success(`${statusSymbols.success} Dependencies installed`)
      : theme.error(`${statusSymbols.error} Dependencies missing - run install`)
  );

  const dockerComposePath = path.join(targetPath, "docker", "docker-compose.yml");
  const hasDocker = await pathExists(dockerComposePath);
  if (config.docker || hasDocker) {
    checks.push(
      hasDocker
        ? theme.success(`${statusSymbols.success} Docker configured`)
        : theme.warning(`${statusSymbols.warning} Docker configuration missing`)
    );
  }

  const envPath = path.join(targetPath, ".env");
  const envLocalPath = path.join(targetPath, ".env.local");
  const hasEnv = (await pathExists(envPath)) || (await pathExists(envLocalPath));
  checks.push(
    hasEnv
      ? theme.success(`${statusSymbols.success} Environment configured`)
      : theme.warning(`${statusSymbols.warning} Environment variables not set`)
  );

  const gitPath = path.join(targetPath, ".git");
  const hasGit = await pathExists(gitPath);
  checks.push(
    hasGit
      ? theme.success(`${statusSymbols.success} Git repository`)
      : theme.warning(`${statusSymbols.warning} Git not initialized`)
  );

  if (config.typescript) {
    const tsconfigPath = path.join(targetPath, "tsconfig.json");
    const hasTsConfig = await pathExists(tsconfigPath);
    checks.push(
      hasTsConfig
        ? theme.success(`${statusSymbols.success} TypeScript configured`)
        : theme.error(`${statusSymbols.error} tsconfig.json missing`)
    );
  }

  return checks.join("\n");
}

/**
 * Create quick commands display with common development commands
 *
 * @param config - Project configuration to determine available commands
 * @param hasNodeModules - Whether dependencies are installed
 * @param hasDocker - Whether Docker configuration exists
 * @returns Formatted string with quick command options
 */
function createQuickCommands(
  config: PrecastConfig,
  hasNodeModules: boolean,
  hasDocker: boolean
): string {
  const pm = config.packageManager || "npm";
  const runCmd = pm === "npm" ? "npm run" : pm;

  const commands: string[] = [];

  if (!hasNodeModules) {
    commands.push(
      `${theme.accent(actionSymbols.deploy)} ${theme.bold(`${pm} install`)} ${theme.muted("- Install dependencies")}`
    );
  }

  if (hasDocker && config.database && config.database !== "none") {
    commands.push(
      `${theme.accent(actionSymbols.deploy)} ${theme.bold(`${runCmd} docker:up`)} ${theme.muted("- Start services")}`
    );
  }

  commands.push(
    `${theme.accent(actionSymbols.deploy)} ${theme.bold(`${runCmd} dev`)} ${theme.muted("- Development server")}`
  );
  commands.push(
    `${theme.accent(actionSymbols.build)} ${theme.bold(`${runCmd} build`)} ${theme.muted("- Production build")}`
  );

  if (config.testing && config.testing !== "none") {
    commands.push(
      `${theme.accent(actionSymbols.test)} ${theme.bold(`${runCmd} test`)} ${theme.muted("- Run tests")}`
    );
  }

  return commands.join("\n");
}

/**
 * Display the status and configuration of a Precast project.
 * Reads the precast.jsonc file and presents project information in a formatted display.
 * @param projectPath - Optional path to the project directory (defaults to current directory)
 * @param options - Command options including debug mode
 */
export async function statusCommand(
  projectPath?: string,
  options?: { debug?: boolean }
): Promise<void> {
  const debug = options?.debug || process.env.DEBUG === "true";

  try {
    const targetPath = projectPath ? path.resolve(projectPath) : process.cwd();
    const precastConfigPath = path.join(targetPath, "precast.jsonc");

    if (!(await pathExists(precastConfigPath))) {
      console.log();
      const errorBox = createFancyBox(
        `${theme.error(`${statusSymbols.error} No precast.jsonc found`)}\n\n` +
          `This doesn't appear to be a Precast project.\n\n` +
          `${theme.info(`${statusSymbols.info} Run:`)} ${theme.bold("create-precast-app init")}\n` +
          `${theme.muted("   to create a new project")}\n\n` +
          `${theme.info("◆ Searched in:")} ${theme.dim(targetPath)}`,
        "● Project Not Found"
      );
      console.log(errorBox);
      console.log();
      process.exit(1);
    }

    const configContent = await readFile(precastConfigPath, "utf-8");

    let jsonContent = configContent;
    jsonContent = jsonContent.replace(/(?:^|\s)\/\/.*$/gm, ""); // Preserve URLs in comments
    jsonContent = jsonContent.replace(/\/\*[\s\S]*?\*\//g, "");
    jsonContent = jsonContent.replace(/,\s*([}\]])/g, "$1");

    const config: PrecastConfig = JSON.parse(jsonContent);

    if (debug) {
      console.log(theme.dim("[DEBUG] Loaded config from:"), theme.dim(precastConfigPath));
      console.log(theme.dim("[DEBUG] Config keys:"), theme.dim(Object.keys(config).join(", ")));
    }

    console.log();
    const heroBanner = await createHeroBanner("STATUS", `◉ Project health & configuration`);
    console.log(heroBanner);
    console.log();

    const projectName = config.name || path.basename(targetPath);
    const projectInfo = [
      `${theme.primary("▶")} ${theme.bold.white(projectName)}`,
      config.version ? `${theme.muted("   Version:")} ${theme.info(config.version)}` : "",
      config.deploymentType
        ? `${theme.muted("   Type:")} ${theme.accent(config.deploymentType)}`
        : "",
      config.createdAt
        ? `${theme.muted("   Created:")} ${theme.dim(new Date(config.createdAt).toLocaleDateString())}`
        : "",
    ]
      .filter(Boolean)
      .join("\n");

    const infoBox = createFancyBox(projectInfo, "◆ Project Info");
    console.log(infoBox);
    console.log();

    const techStackDisplay = createTechStackDisplay(config);
    if (techStackDisplay) {
      const stackBox = createFancyBox(techStackDisplay, "⚙ Tech Stack");
      console.log(stackBox);
      console.log();
    }

    if (config.colorPalette) {
      const paletteDisplay = await getColorPaletteDisplay(config.colorPalette);
      if (paletteDisplay) {
        const paletteBox = createFancyBox(paletteDisplay, "🎨 Color Theme");
        console.log(paletteBox);
        console.log();
      }
    }

    const nodeModulesPath = path.join(targetPath, "node_modules");
    const hasNodeModules = await pathExists(nodeModulesPath);
    const dockerComposePath = path.join(targetPath, "docker", "docker-compose.yml");
    const hasDocker = await pathExists(dockerComposePath);

    const healthDisplay = await createHealthDisplay(targetPath, config);
    const healthBox = createFancyBox(healthDisplay, "◉ Health Check");
    console.log(healthBox);
    console.log();

    const commandsDisplay = createQuickCommands(config, hasNodeModules, hasDocker);
    const commandsBox = createFancyBox(commandsDisplay, `${actionSymbols.deploy} Quick Commands`);
    console.log(commandsBox);
    console.log();

    console.log(theme.muted(divider()));
    console.log(
      theme.muted(
        `  Generated by ${theme.bold("Precast CLI")} • ${createLink("precast.dev", "https://precast.dev")}`
      )
    );
    console.log();
  } catch (error) {
    console.log();
    let errorMessage = "An unknown error occurred";
    let errorDetails = "";

    if (error instanceof SyntaxError) {
      errorMessage = "Failed to parse precast.jsonc file";
      errorDetails = "Make sure the file contains valid JSON with proper syntax";
    } else if (error instanceof Error) {
      errorMessage = error.message;
      errorDetails = "Check the file permissions and project structure";
    }

    const errorBox = createFancyBox(
      `${theme.error(`${statusSymbols.error} Error`)}\n\n` +
        `${errorMessage}\n\n` +
        `${theme.info(`${statusSymbols.info} Suggestion:`)}\n${errorDetails}`,
      `${statusSymbols.warning} Status Command Failed`
    );
    console.log(errorBox);
    console.log();
    process.exit(1);
  }
}

export default statusCommand;

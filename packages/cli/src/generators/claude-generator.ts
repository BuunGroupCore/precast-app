import * as path from "path";

import { logger } from "../utils/logger.js";
// eslint-disable-next-line import/default
import fsExtra from "fs-extra";

// eslint-disable-next-line import/no-named-as-default-member
const { writeFile, ensureDir, pathExists, readFile } = fsExtra;

import type { ProjectConfig } from "../../../shared/stack-config.js";
import { createTemplateEngine } from "../core/template-engine.js";
import { getTemplateRoot } from "../utils/template-path.js";

/**
 * Generate Claude Code integration for the project using templates
 */
export async function generateClaudeTemplate(
  config: ProjectConfig & { mcpServers?: string[] }
): Promise<void> {
  // Check for both ai and aiAssistant for backward compatibility
  const aiAssistant = (config as any).aiAssistant || (config as any).ai;
  if (!aiAssistant || (aiAssistant !== "claude" && aiAssistant !== "cursor")) {
    return;
  }

  logger.verbose("🤖 Setting up Claude Code integration...");

  try {
    const templateRoot = getTemplateRoot();
    const templateEngine = createTemplateEngine(templateRoot);

    // Create .claude directory
    const claudeDir = path.join(config.projectPath, ".claude");
    await ensureDir(claudeDir);

    // Generate and copy Claude settings
    await generateClaudeSettings(config, templateEngine);

    // Generate and copy CLAUDE.md
    await generateClaudeMd(config, templateEngine);

    // Generate agents
    await generateClaudeAgents(config, templateEngine);

    // Generate commands
    await generateClaudeCommands(config, templateEngine);

    // Add to .gitignore
    await addToGitignore(config.projectPath, ".claude/settings.local.json");

    logger.verbose("✅ Claude Code integration configured successfully");

    // Show next steps
    showNextSteps(config);
  } catch (error) {
    logger.warn(`Failed to setup Claude Code integration: ${error}`);
  }
}

async function generateClaudeSettings(
  config: ProjectConfig & { mcpServers?: string[] },
  templateEngine: any
): Promise<void> {
  const claudeDir = path.join(config.projectPath, ".claude");

  // Determine which tools are permitted based on project configuration
  const allowedTools = getClaudePermissions(config);

  const claudeContext = {
    ...config,
    allowedTools,
    hasMcpServers: config.mcpServers && config.mcpServers.length > 0,
    mcpServers: config.mcpServers && config.mcpServers.length > 0 ? config.mcpServers : undefined,
  };

  // Process the settings template
  await templateEngine.processTemplate(
    "ai-context/claude/settings.json.hbs",
    path.join(claudeDir, "settings.json"),
    claudeContext
  );
}

async function generateClaudeMd(
  config: ProjectConfig & { mcpServers?: string[] },
  templateEngine: any
): Promise<void> {
  // Prepare context for CLAUDE.md template
  const claudeContext = {
    ...config,
    projectName: config.name,
    isFullstack: config.backend && config.backend !== "none",
    isMonorepo: config.backend && config.backend !== "none" && config.backend !== "next-api",
    hasDatabase: config.database && config.database !== "none",
    hasAuth: config.authProvider && config.authProvider !== "none",
    hasDocker: config.docker === true,
    hasMcpServers: config.mcpServers && config.mcpServers.length > 0,
    mcpServers: config.mcpServers && config.mcpServers.length > 0 ? config.mcpServers : undefined,
    techStack: getTechStackDescription(config),
    projectStructure: getProjectStructureDescription(config),
    keyCommands: getKeyCommands(config),
  };

  // Process the CLAUDE.md template
  await templateEngine.processTemplate(
    "ai-context/claude/CLAUDE.md.hbs",
    path.join(config.projectPath, "CLAUDE.md"),
    claudeContext
  );
}

function getClaudePermissions(config: ProjectConfig): string[] {
  const permissions: string[] = [
    "Read",
    "Write",
    "Edit",
    "MultiEdit",
    "NotebookEdit",
    "Glob",
    "Grep",
    "LS",
    "WebSearch",
    "WebFetch",
    "TodoWrite",
  ];

  // Add Bash permission for most projects
  if (config.framework !== "vanilla" || config.backend !== "none") {
    permissions.push("Bash");
  }

  // Add Task permission for complex projects
  if (config.backend && config.backend !== "none") {
    permissions.push("Task");
  }

  // Add ExitPlanMode for complex planning scenarios
  if (config.backend && config.backend !== "none" && config.database !== "none") {
    permissions.push("ExitPlanMode");
  }

  return permissions;
}

function getTechStackDescription(config: ProjectConfig): string {
  const stack: string[] = [];

  if (config.framework && config.framework !== "none") {
    stack.push(`Frontend: ${config.framework}`);
  }

  if (config.backend && config.backend !== "none") {
    stack.push(`Backend: ${config.backend}`);
  }

  if (config.database && config.database !== "none") {
    stack.push(`Database: ${config.database}`);
  }

  if (config.orm && config.orm !== "none") {
    stack.push(`ORM: ${config.orm}`);
  }

  if (config.styling) {
    stack.push(`Styling: ${config.styling}`);
  }

  if (config.authProvider && config.authProvider !== "none") {
    stack.push(`Auth: ${config.authProvider}`);
  }

  return stack.join(", ");
}

function getProjectStructureDescription(config: ProjectConfig): string {
  const isMonorepo = config.backend && config.backend !== "none" && config.backend !== "next-api";

  if (isMonorepo) {
    return `Monorepo structure with:
- apps/web: ${config.framework} frontend application
- apps/api: ${config.backend} backend application
- packages/shared: Shared types and utilities`;
  }

  if (config.framework === "next" && config.backend === "next-api") {
    return "Next.js full-stack application with API routes";
  }

  if (config.backend === "none") {
    return `Single ${config.framework} frontend application`;
  }

  return "Single application structure";
}

function getKeyCommands(config: ProjectConfig): Record<string, string> {
  const commands: Record<string, string> = {
    dev: `${config.packageManager} run dev`,
    build: `${config.packageManager} run build`,
  };

  if (config.orm === "prisma") {
    commands["db:migrate"] = "npx prisma migrate dev";
    commands["db:studio"] = "npx prisma studio";
  }

  if (config.orm === "drizzle") {
    commands["db:migrate"] = "npx drizzle-kit migrate";
    commands["db:studio"] = "npx drizzle-kit studio";
  }

  if (config.docker) {
    commands["docker:up"] = `${config.packageManager} run docker:up`;
    commands["docker:down"] = `${config.packageManager} run docker:down`;
  }

  return commands;
}

async function generateClaudeAgents(
  config: ProjectConfig & { mcpServers?: string[] },
  templateEngine: any
): Promise<void> {
  const agentsDir = path.join(config.projectPath, ".claude/agents");
  await ensureDir(agentsDir);

  const isMonorepo = config.backend && config.backend !== "none" && config.backend !== "next-api";

  // Generate core agents that are always included
  const coreAgents = ["web-research", "code-reviewer", "architecture-guide", "standards-enforcer"];

  for (const agent of coreAgents) {
    await templateEngine.processTemplate(
      `ai-context/claude/agents/${agent}.md.hbs`,
      path.join(agentsDir, `${agent}.md`),
      config
    );
  }

  if (isMonorepo) {
    // Generate monorepo-specific agents
    const monorepoAgents = ["web-context", "api-context", "monorepo-guide"];

    for (const agent of monorepoAgents) {
      await templateEngine.processTemplate(
        `ai-context/claude/agents/${agent}.md.hbs`,
        path.join(agentsDir, `${agent}.md`),
        config
      );
    }
  }

  logger.verbose("✅ Claude agents generated");
}

async function generateClaudeCommands(
  config: ProjectConfig & { mcpServers?: string[] },
  templateEngine: any
): Promise<void> {
  const commandsDir = path.join(config.projectPath, ".claude/commands");
  await ensureDir(commandsDir);

  const isMonorepo = config.backend && config.backend !== "none" && config.backend !== "next-api";

  // Generate core commands that are always included
  const coreCommands = ["orchestrate", "optimize", "review", "implement", "refactor"];

  for (const command of coreCommands) {
    await templateEngine.processTemplate(
      `ai-context/claude/commands/${command}.md.hbs`,
      path.join(commandsDir, `${command}.md`),
      config
    );
  }

  // Generate specialized command directories
  const monorepoCommandsDir = path.join(commandsDir, "monorepo");
  const securityCommandsDir = path.join(commandsDir, "security");
  await ensureDir(monorepoCommandsDir);
  await ensureDir(securityCommandsDir);

  // Generate monorepo-specific commands (useful for all projects, but especially monorepos)
  const monorepoCommands = ["optimize", "migrate"];
  for (const command of monorepoCommands) {
    await templateEngine.processTemplate(
      `ai-context/claude/commands/monorepo/${command}.md.hbs`,
      path.join(monorepoCommandsDir, `${command}.md`),
      config
    );
  }

  // Generate security commands (useful for all projects)
  const securityCommands = ["audit"];
  for (const command of securityCommands) {
    await templateEngine.processTemplate(
      `ai-context/claude/commands/security/${command}.md.hbs`,
      path.join(securityCommandsDir, `${command}.md`),
      config
    );
  }

  if (isMonorepo) {
    // Create subdirectories for monorepo-specific commands
    const webCommandsDir = path.join(commandsDir, "web");
    const apiCommandsDir = path.join(commandsDir, "api");
    await ensureDir(webCommandsDir);
    await ensureDir(apiCommandsDir);

    // Generate web commands
    const webCommands = ["component", "feature"];
    for (const command of webCommands) {
      await templateEngine.processTemplate(
        `ai-context/claude/commands/web/${command}.md.hbs`,
        path.join(webCommandsDir, `${command}.md`),
        config
      );
    }

    // Generate API commands
    const apiCommands = ["endpoint", "service"];
    for (const command of apiCommands) {
      await templateEngine.processTemplate(
        `ai-context/claude/commands/api/${command}.md.hbs`,
        path.join(apiCommandsDir, `${command}.md`),
        config
      );
    }
  }

  logger.verbose("✅ Claude commands generated");
}

async function addToGitignore(projectPath: string, pattern: string): Promise<void> {
  const gitignorePath = path.join(projectPath, ".gitignore");
  if (await pathExists(gitignorePath)) {
    const content = await readFile(gitignorePath, "utf-8");
    if (!content.includes(pattern)) {
      await writeFile(gitignorePath, `${content}\n${pattern}\n`);
    }
  }
}

function showNextSteps(config: ProjectConfig & { mcpServers?: string[] }): void {
  logger.info("\n📝 Next steps for Claude Code integration:");

  const steps: string[] = [];
  const isMonorepo = config.backend && config.backend !== "none" && config.backend !== "next-api";

  steps.push("1. Open your project in Claude Code");
  steps.push("2. Claude will automatically detect the .claude/settings.json file");

  steps.push("3. Use intelligent agents:");
  steps.push("   - web-research: Research best practices and current patterns");
  steps.push("   - code-reviewer: Review code against standards");
  steps.push("   - architecture-guide: Architectural guidance");
  steps.push("   - standards-enforcer: Enforce coding standards");

  if (isMonorepo) {
    steps.push("   - web-context: Frontend development assistance");
    steps.push("   - api-context: Backend development assistance");
    steps.push("   - monorepo-guide: Cross-package coordination");
  }

  steps.push("4. Use intelligent orchestrators (recommended):");
  steps.push("   - /orchestrate: Smart command that analyzes any request and");
  steps.push("     automatically delegates to the right agents and workflows");
  steps.push("   - /optimize: Specialized performance optimization orchestrator");
  steps.push("   - Example: '/orchestrate implement secure user auth'");
  steps.push("   - Example: '/optimize bundle size and performance'");
  steps.push("");
  steps.push("5. Or use specific commands directly:");
  steps.push("   - /review: Research-driven code review");
  steps.push("   - /implement: Best-practice implementation");
  steps.push("   - /refactor: Modern refactoring patterns");
  steps.push("   - /monorepo/optimize: Performance optimization");
  steps.push("   - /monorepo/migrate: Safe migration strategies");
  steps.push("   - /security/audit: Comprehensive security analysis");

  if (isMonorepo) {
    steps.push("   - /web/component: Create web components");
    steps.push("   - /web/feature: Implement web features");
    steps.push("   - /api/endpoint: Create API endpoints");
    steps.push("   - /api/service: Implement services");
  }

  if (config.mcpServers && config.mcpServers.length > 0) {
    steps.push("5. Configure MCP server environment variables in .env");
    steps.push("6. Restart Claude Code to enable MCP servers");
  }

  steps.push(`${steps.length + 1}. Start coding with context-aware AI assistance!`);

  steps.forEach((step) => logger.info(`  ${step}`));

  logger.info("\n📚 Documentation:");
  logger.info("  Claude Code: https://claude.ai/code");
  logger.info("  Custom Commands: https://docs.anthropic.com/claude-code/slash-commands");
  logger.info("  Sub-Agents: https://docs.anthropic.com/claude-code/sub-agents");

  if (config.mcpServers && config.mcpServers.length > 0) {
    logger.info("  MCP Servers: https://modelcontextprotocol.io");
  }
}

// Export for backward compatibility
export { generateClaudeTemplate as setupClaudeIntegration };

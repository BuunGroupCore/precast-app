import * as path from "path";

import type { ProjectConfig } from "@shared/stack-config.js";
import fsExtra from "fs-extra";

import { createTemplateEngine } from "@/core/template-engine.js";
import { getTemplateRoot } from "@/utils/system/template-path.js";
import { logger } from "@/utils/ui/logger.js";

const { writeFile, ensureDir, pathExists, readFile } = fsExtra;

/**
 * Generate Claude Code integration for the project using templates
 */
export async function generateClaudeTemplate(
  config: ProjectConfig & { mcpServers?: string[]; aiDocs?: boolean }
): Promise<void> {
  const aiAssistant = (config as any).aiAssistant || (config as any).ai;
  if (!aiAssistant || (aiAssistant !== "claude" && aiAssistant !== "cursor")) {
    return;
  }

  logger.verbose("🤖 Setting up Claude Code integration...");

  try {
    const templateRoot = getTemplateRoot();
    const templateEngine = createTemplateEngine(templateRoot);

    const claudeDir = path.join(config.projectPath, ".claude");
    await ensureDir(claudeDir);

    await generateClaudeSettings(config, templateEngine);

    await generateClaudeMd(config, templateEngine);

    await generateClaudeAgents(config, templateEngine);

    await generateClaudeCommands(config, templateEngine);

    await generateClaudeHooks(config, templateEngine);

    if (config.aiDocs) {
      await generateAiDocumentation(config, templateEngine);
    }

    await addToGitignore(config.projectPath, ".claude/settings.local.json");

    logger.verbose("✅ Claude Code integration configured successfully");

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

  const allowedTools = getClaudePermissions(config);

  const hasLintHook = config.eslint || config.prettier;

  const hasPackageManagerHook = true;

  const hasSecurityHook = true;

  const claudeContext = {
    ...config,
    allowedTools,
    hasLintHook,
    hasPackageManagerHook,
    hasSecurityHook,
    hasMcpServers: config.mcpServers && config.mcpServers.length > 0,
    mcpServers: config.mcpServers && config.mcpServers.length > 0 ? config.mcpServers : undefined,
  };

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

  if (config.framework !== "vanilla" || config.backend !== "none") {
    permissions.push("Bash");
  }

  if (config.backend && config.backend !== "none") {
    permissions.push("Task");
  }

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

  const coreAgents = ["web-research", "code-reviewer", "architecture-guide", "standards-enforcer"];

  for (const agent of coreAgents) {
    await templateEngine.processTemplate(
      `ai-context/claude/agents/${agent}.md.hbs`,
      path.join(agentsDir, `${agent}.md`),
      config
    );
  }

  if (isMonorepo) {
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

  const coreCommands = ["orchestrate", "optimize", "review", "implement", "refactor"];

  for (const command of coreCommands) {
    await templateEngine.processTemplate(
      `ai-context/claude/commands/${command}.md.hbs`,
      path.join(commandsDir, `${command}.md`),
      config
    );
  }

  const monorepoCommandsDir = path.join(commandsDir, "monorepo");
  const securityCommandsDir = path.join(commandsDir, "security");
  await ensureDir(monorepoCommandsDir);
  await ensureDir(securityCommandsDir);

  const monorepoCommands = ["optimize", "migrate"];
  for (const command of monorepoCommands) {
    await templateEngine.processTemplate(
      `ai-context/claude/commands/monorepo/${command}.md.hbs`,
      path.join(monorepoCommandsDir, `${command}.md`),
      config
    );
  }

  const securityCommands = ["audit"];
  for (const command of securityCommands) {
    await templateEngine.processTemplate(
      `ai-context/claude/commands/security/${command}.md.hbs`,
      path.join(securityCommandsDir, `${command}.md`),
      config
    );
  }

  if (isMonorepo) {
    const webCommandsDir = path.join(commandsDir, "web");
    const apiCommandsDir = path.join(commandsDir, "api");
    await ensureDir(webCommandsDir);
    await ensureDir(apiCommandsDir);

    const webCommands = ["component", "feature"];
    for (const command of webCommands) {
      await templateEngine.processTemplate(
        `ai-context/claude/commands/web/${command}.md.hbs`,
        path.join(webCommandsDir, `${command}.md`),
        config
      );
    }

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

async function generateClaudeHooks(
  config: ProjectConfig & { mcpServers?: string[] },
  templateEngine: any
): Promise<void> {
  const hooksDir = path.join(config.projectPath, ".claude/hooks");
  await ensureDir(hooksDir);

  const pmHookPath = path.join(hooksDir, "enforce-package-manager.sh");
  await templateEngine.processTemplate(
    "ai-context/claude/hooks/enforce-package-manager.sh.hbs",
    pmHookPath,
    config
  );

  try {
    await fsExtra.chmod(pmHookPath, 0o755);
  } catch (error) {
    logger.verbose(`Could not set package manager hook permissions: ${error}`);
  }

  const securityHookPath = path.join(hooksDir, "security-scanner.sh");
  await templateEngine.processTemplate(
    "ai-context/claude/hooks/security-scanner.sh.hbs",
    securityHookPath,
    config
  );

  try {
    await fsExtra.chmod(securityHookPath, 0o755);
  } catch (error) {
    logger.verbose(`Could not set security hook permissions: ${error}`);
  }

  if (config.eslint || config.prettier) {
    const lintHookPath = path.join(hooksDir, "lint-check.sh");
    await templateEngine.processTemplate(
      "ai-context/claude/hooks/lint-check.sh.hbs",
      lintHookPath,
      config
    );

    try {
      await fsExtra.chmod(lintHookPath, 0o755);
    } catch (error) {
      logger.verbose(`Could not set lint hook permissions: ${error}`);
    }
  }

  logger.verbose("✅ Claude hooks generated");
}

async function generateAiDocumentation(
  config: ProjectConfig & { mcpServers?: string[]; aiDocs?: boolean },
  templateEngine: any
): Promise<void> {
  const docsDir = path.join(config.projectPath, "docs/ai");
  await ensureDir(docsDir);

  const isMonorepo = config.backend && config.backend !== "none" && config.backend !== "next-api";

  const docContext = {
    ...config,
    projectName: config.name,
    isFullstack: config.backend && config.backend !== "none",
    isMonorepo,
    hasDatabase: config.database && config.database !== "none",
    hasAuth: config.authProvider && config.authProvider !== "none",
    hasDocker: config.docker === true,
    hasMcpServers: config.mcpServers && config.mcpServers.length > 0,
    mcpServers: config.mcpServers && config.mcpServers.length > 0 ? config.mcpServers : undefined,
    techStack: getTechStackDescription(config),
    projectStructure: getProjectStructureDescription(config),
    keyCommands: getKeyCommands(config),
  };

  await templateEngine.processTemplate(
    "docs/ai/SPEC.md.hbs",
    path.join(docsDir, "SPEC.md"),
    docContext
  );

  await templateEngine.processTemplate(
    "docs/ai/PRD.md.hbs",
    path.join(docsDir, "PRD.md"),
    docContext
  );

  logger.verbose("✅ AI documentation generated");
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

function showNextSteps(config: ProjectConfig & { mcpServers?: string[]; aiDocs?: boolean }): void {
  logger.info("\n📝 Next steps for Claude Code integration:");

  const steps: string[] = [];
  const isMonorepo = config.backend && config.backend !== "none" && config.backend !== "next-api";

  steps.push("1. Open your project in Claude Code");
  steps.push("2. Claude will automatically detect the .claude/settings.json file");

  if (config.aiDocs) {
    steps.push("3. Review the generated AI documentation:");
    steps.push("   - docs/ai/SPEC.md: Technical specification and architecture");
    steps.push("   - docs/ai/PRD.md: Product requirements and user stories");
  }

  const nextStepNum = config.aiDocs ? "4" : "3";
  steps.push(`${nextStepNum}. Use intelligent agents:`);
  steps.push("   - web-research: Research best practices and current patterns");
  steps.push("   - code-reviewer: Review code against standards");
  steps.push("   - architecture-guide: Architectural guidance");
  steps.push("   - standards-enforcer: Enforce coding standards");

  if (isMonorepo) {
    steps.push("   - web-context: Frontend development assistance");
    steps.push("   - api-context: Backend development assistance");
    steps.push("   - monorepo-guide: Cross-package coordination");
  }

  const orchestratorStepNum = config.aiDocs ? "5" : "4";
  const commandStepNum = config.aiDocs ? "6" : "5";

  steps.push(`${orchestratorStepNum}. Use intelligent orchestrators (recommended):`);
  steps.push("   - /orchestrate: Smart command that analyzes any request and");
  steps.push("     automatically delegates to the right agents and workflows");
  steps.push("   - /optimize: Specialized performance optimization orchestrator");
  steps.push("   - Example: '/orchestrate implement secure user auth'");
  steps.push("   - Example: '/optimize bundle size and performance'");
  steps.push("");
  steps.push(`${commandStepNum}. Or use specific commands directly:`);
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
    const mcpStepNum1 = config.aiDocs ? "7" : "6";
    const mcpStepNum2 = config.aiDocs ? "8" : "7";
    steps.push(`${mcpStepNum1}. Configure MCP server environment variables in .env`);
    steps.push(`${mcpStepNum2}. Restart Claude Code to enable MCP servers`);
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

export { generateClaudeTemplate as setupClaudeIntegration };

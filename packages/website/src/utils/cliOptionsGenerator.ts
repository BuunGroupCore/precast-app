import { getStackConfig, formatStackOptions } from "./stackConfigReader";

/**
 * Represents a CLI option with its flag, values, and description
 */
export interface CliOption {
  flag: string;
  values: string;
  description: string;
}

/**
 * Generate CLI options dynamically from stack config
 * @returns Array of CLI options with flags, values, and descriptions
 */
export function generateCliOptions(): CliOption[] {
  const config = getStackConfig();

  return [
    {
      flag: "-f, --framework",
      values: formatStackOptions(config.frameworks),
      description: "Choose your frontend framework",
    },
    {
      flag: "-b, --backend",
      values: formatStackOptions(config.backends),
      description: "Choose your backend framework",
    },
    {
      flag: "-d, --database",
      values: formatStackOptions(config.databases),
      description: "Choose your database",
    },
    {
      flag: "-o, --orm",
      values: formatStackOptions(config.orms),
      description: "Choose your ORM/Database client",
    },
    {
      flag: "-s, --styling",
      values: formatStackOptions(config.styling),
      description: "Choose your styling solution",
    },
    {
      flag: "-r, --runtime",
      values: formatStackOptions(config.runtimes),
      description: "Choose your JavaScript runtime",
    },
    {
      flag: "--ui-framework",
      values: "react, vue, svelte, solid",
      description: "Choose UI framework when using Vite",
    },
    {
      flag: "-u, --ui-library",
      values: "shadcn, daisyui, mui, chakra, antd, mantine, brutalist",
      description: "Choose a UI component library",
    },
    {
      flag: "-a, --auth",
      values: "better-auth, auth.js, clerk, lucia, passport",
      description: "Add authentication to your project",
    },
    {
      flag: "--typescript",
      values: "-",
      description: "Enable TypeScript (default: true)",
    },
    {
      flag: "--no-typescript",
      values: "-",
      description: "Disable TypeScript",
    },
    {
      flag: "--git",
      values: "-",
      description: "Initialize Git repository (default: true)",
    },
    {
      flag: "--no-git",
      values: "-",
      description: "Skip Git initialization",
    },
    {
      flag: "--docker",
      values: "-",
      description: "Add Docker configuration",
    },
    {
      flag: "--install",
      values: "-",
      description: "Automatically install dependencies",
    },
    {
      flag: "--no-install",
      values: "-",
      description: "Skip dependency installation",
    },
    {
      flag: "--generate",
      values: "-",
      description: "Auto-generate ORM schemas and types (enabled by default)",
    },
    {
      flag: "--no-generate",
      values: "-",
      description: "Skip ORM generation during project setup",
    },
    {
      flag: "-p, --package-manager",
      values: "npm, yarn, pnpm, bun",
      description: "Package manager to use",
    },
    {
      flag: "-y, --yes",
      values: "-",
      description: "Skip all prompts and use defaults",
    },
    {
      flag: "--no-prettier",
      values: "-",
      description: "Skip Prettier formatting during generation",
    },
    {
      flag: "--no-eslint",
      values: "-",
      description: "Skip ESLint configuration setup",
    },
    {
      flag: "--no-secure-passwords",
      values: "-",
      description: "Skip secure password generation for Docker services",
    },
    {
      flag: "--no-gitignore",
      values: "-",
      description: "Skip .gitignore file generation",
    },
    {
      flag: "--api-client",
      values: "tanstack-query, swr, axios, trpc, apollo-client",
      description: "API client library",
    },
    {
      flag: "--ai",
      values: "claude, cursor, copilot, gemini",
      description: "AI assistant integration",
    },
    {
      flag: "--ai-docs",
      values: "-",
      description: "Generate AI documentation files (SPEC.md, PRD.md) in docs/ai/ folder",
    },
    {
      flag: "--mcp-servers",
      values:
        "filesystem, memory, github-official, github-api, gitlab, postgresql, supabase, mongodb, cloudflare, aws-mcp, azure-mcp",
      description: "MCP servers to include when using Claude AI",
    },
    {
      flag: "--powerups",
      values: "sentry, posthog, storybook, prettier, eslint, husky, vitest, playwright",
      description: "Comma-separated list of powerups",
    },
    {
      flag: "--plugins",
      values: "stripe, resend, sendgrid, socketio",
      description: "Comma-separated list of plugins",
    },
  ];
}

/**
 * Generate init command options specifically
 * @returns Array of CLI options for the init command
 */
export function generateInitOptions(): CliOption[] {
  return generateCliOptions();
}

/**
 * Generate add-features command options
 * @returns Array of CLI options for the add-features command
 */
export function generateAddFeaturesOptions(): CliOption[] {
  return [
    {
      flag: "--ui",
      values: "shadcn, daisyui, mui, chakra, antd, mantine, brutalist",
      description: "Add a UI component library",
    },
    {
      flag: "--ai",
      values: "claude, copilot, cursor, gemini, codeium, tabnine",
      description: "Add AI assistant context files (can specify multiple)",
    },
    {
      flag: "-y, --yes",
      values: "-",
      description: "Skip all prompts and use defaults",
    },
  ];
}

/**
 * Generate add command options
 * @returns Array of CLI options for the add command
 */
export function generateAddOptions(): CliOption[] {
  return [
    {
      flag: "-n, --name",
      values: "string",
      description: "Name for the resource",
    },
    {
      flag: "--no-typescript",
      values: "-",
      description: "Generate JavaScript instead of TypeScript",
    },
  ];
}

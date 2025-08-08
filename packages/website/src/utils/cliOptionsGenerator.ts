import { getStackConfig, formatStackOptions } from "./stackConfigReader";

export interface CliOption {
  flag: string;
  values: string;
  description: string;
}

/**
 * Generate CLI options dynamically from stack config
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
  ];
}

/**
 * Generate init command options specifically
 */
export function generateInitOptions(): CliOption[] {
  return generateCliOptions();
}

/**
 * Generate add-features command options
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

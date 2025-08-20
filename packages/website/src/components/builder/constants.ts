import { FaNpm, FaGithub } from "react-icons/fa";
import {
  SiBun,
  SiPnpm,
  SiShadcnui,
  SiChakraui,
  SiMui,
  SiAntdesign,
  SiMantine,
} from "react-icons/si";

import { DaisyUIIcon } from "@/components/icons/DaisyUIIcon";

import type { AIAssistant, UILibrary, PackageManager, DeploymentMethod } from "./types";

/**
 * Available AI assistant integrations with their configurations and file templates.
 */
export const aiAssistants: AIAssistant[] = [
  {
    id: "none",
    name: "None",
    icon: null,
    color: "text-gray-500",
    description: "No AI assistance",
  },
  {
    id: "claude",
    name: "Claude Code",
    icon: "claude-color",
    color: "text-purple-600",
    description:
      "AI pair programming with Claude - creates project-specific configuration, context-aware agents, and intelligent commands for enhanced code assistance",
    files: [
      ".claude/settings.json",
      ".claude/mcp.json",
      "CLAUDE.md",
      ".claude/hooks/enforce-package-manager.sh",
      ".claude/hooks/security-scanner.sh",
      ".claude/hooks/lint-check.sh",
      ".claude/agents/code-reviewer.md",
      ".claude/agents/architecture-guide.md",
      ".claude/agents/standards-enforcer.md",
      ".claude/commands/review.md",
      ".claude/commands/implement.md",
      ".claude/commands/refactor.md",
      ".claude/commands/explain.md",
    ],
  },
  {
    id: "copilot",
    name: "GitHub Copilot",
    icon: "githubcopilot",
    color: "text-gray-800",
    description: "AI-powered code suggestions from GitHub and OpenAI",
    files: [".github/copilot-instructions.md"],
  },
  {
    id: "cursor",
    name: "Cursor",
    icon: "cursor",
    color: "text-blue-600",
    description: "AI-first code editor with deep codebase understanding",
    files: [".cursorrules"],
  },
  {
    id: "gemini",
    name: "Gemini CLI",
    icon: "gemini-color",
    color: "text-blue-500",
    description: "Google's AI assistant for code generation and analysis",
    files: ["gemini.md"],
  },
];

/**
 * Supported package managers for dependency installation.
 */
export const packageManagers: PackageManager[] = [
  {
    id: "npm",
    name: "npm",
    icon: FaNpm,
    color: "text-red-600",
    description: "The default Node.js package manager with the largest ecosystem",
  },
  {
    id: "pnpm",
    name: "pnpm",
    icon: SiPnpm,
    color: "text-orange-500",
    description: "Fast, disk space efficient package manager using hard links",
  },
  {
    id: "bun",
    name: "Bun",
    icon: SiBun,
    color: "text-gray-800",
    description: "All-in-one JavaScript runtime & toolkit designed for speed",
  },
];

/**
 * Available deployment platforms and hosting services.
 */
export const deploymentMethods: DeploymentMethod[] = [
  {
    id: "none",
    name: "None",
    icon: null,
    color: "text-gray-500",
    description: "No deployment configuration",
  },
  {
    id: "cloudflare-pages",
    name: "Cloudflare Pages",
    icon: "cloudflare-color",
    color: "text-orange-500",
    description: "JAMstack platform with unlimited bandwidth",
    supportsStatic: true,
    supportsDynamic: true,
  },
  {
    id: "azure-static",
    name: "Azure Static Web Apps",
    icon: "microsoft-color",
    color: "text-blue-600",
    description: "Free SSL, custom domains, and serverless APIs",
    supportsStatic: true,
    supportsDynamic: false,
    disabled: true,
  },
  {
    id: "aws-amplify",
    name: "AWS Amplify",
    icon: "aws-color",
    color: "text-orange-600",
    description: "Full-stack development platform with CI/CD",
    supportsStatic: true,
    supportsDynamic: true,
    disabled: true,
  },
  {
    id: "github-pages",
    name: "GitHub Pages",
    icon: FaGithub,
    color: "text-gray-800",
    description: "Free static site hosting from GitHub",
    supportsStatic: true,
    supportsDynamic: false,
    disabled: true,
  },
  {
    id: "vercel",
    name: "Vercel",
    icon: "vercel",
    color: "text-black",
    description: "Optimized for Next.js deployments",
    frameworkOnly: "next",
    supportsStatic: true,
    supportsDynamic: true,
  },
];

/**
 * UI component libraries with their framework compatibility and requirements.
 */
export const uiLibraries: UILibrary[] = [
  {
    id: "none",
    name: "None",
    icon: null,
    color: "text-gray-500",
    description: "No UI library",
    frameworks: ["*"], // Available for all
  },
  {
    id: "daisyui",
    name: "DaisyUI",
    icon: DaisyUIIcon,
    color: "text-pink-500",
    description: "Beautiful Tailwind CSS components with semantic class names",
    frameworks: ["*"], // Available for all frameworks
    requires: ["tailwind"], // Requires Tailwind CSS
  },
  {
    id: "shadcn",
    name: "shadcn/ui",
    icon: SiShadcnui,
    color: "text-gray-800",
    description: "Beautifully designed components that you can copy and paste into your apps",
    frameworks: ["react", "next", "react-router", "vite"],
    requires: ["tailwind"],
  },
  {
    id: "brutalist",
    name: "Brutalist UI",
    icon: "precast",
    color: "text-black",
    description: "Bold, raw, and unapologetic design components with comic book aesthetics",
    frameworks: ["react", "next", "react-router"],
    requires: ["css"], // Uses plain CSS, not Tailwind
  },
  {
    id: "mui",
    name: "Material UI",
    icon: SiMui,
    color: "text-blue-600",
    description: "React components implementing Google's Material Design system",
    frameworks: ["react", "next", "react-router"],
    incompatible: ["tailwind"], // Uses CSS-in-JS, not compatible with Tailwind
    disabled: true,
  },
  {
    id: "chakra",
    name: "Chakra UI",
    icon: SiChakraui,
    color: "text-teal-500",
    description: "Simple, modular and accessible component library for React",
    frameworks: ["react", "next", "react-router"],
    incompatible: ["tailwind"], // Uses CSS-in-JS, not compatible with Tailwind
    disabled: true,
  },
  {
    id: "antd",
    name: "Ant Design",
    icon: SiAntdesign,
    color: "text-blue-500",
    description: "Enterprise-class UI design language and React components",
    frameworks: ["react", "next", "react-router"],
    incompatible: ["tailwind"], // Has its own design system, not compatible with Tailwind
    disabled: true,
  },
  {
    id: "mantine",
    name: "Mantine",
    icon: SiMantine,
    color: "text-blue-600",
    description: "Full-featured React components and hooks library with dark mode support",
    frameworks: ["react", "next", "react-router"],
    incompatible: ["tailwind"], // Uses CSS-in-JS, not compatible with Tailwind
    disabled: true,
  },
];

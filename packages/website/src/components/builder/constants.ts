import { FaNpm, FaGithub } from "react-icons/fa";
import {
  SiBun,
  SiPnpm,
  SiDaisyui,
  SiShadcnui,
  SiChakraui,
  SiMui,
  SiAntdesign,
  SiMantine,
} from "react-icons/si";
import type { AIAssistant, UILibrary, PackageManager, DeploymentMethod } from "./types";

// AI Assistant options
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
    description: "Claude project settings (.claude folder)",
    files: [".claude/project.json", ".claude/instructions.md"],
  },
  {
    id: "copilot",
    name: "GitHub Copilot",
    icon: "githubcopilot",
    color: "text-gray-800",
    description: "Copilot instructions (.github/copilot-instructions.md)",
    files: [".github/copilot-instructions.md"],
  },
  {
    id: "cursor",
    name: "Cursor",
    icon: "cursor",
    color: "text-blue-600",
    description: "Cursor AI configuration (.cursorrules)",
    files: [".cursorrules"],
  },
  {
    id: "gemini",
    name: "Gemini CLI",
    icon: "gemini-color",
    color: "text-blue-500",
    description: "Gemini project instructions (gemini.md)",
    files: ["gemini.md"],
  },
];

// Package manager options
export const packageManagers: PackageManager[] = [
  {
    id: "npm",
    name: "npm",
    icon: FaNpm,
    color: "text-red-600",
    description: "Node Package Manager",
  },
  {
    id: "pnpm",
    name: "pnpm",
    icon: SiPnpm,
    color: "text-orange-500",
    description: "Fast, disk space efficient package manager",
  },
  {
    id: "bun",
    name: "Bun",
    icon: SiBun,
    color: "text-gray-800",
    description: "All-in-one JavaScript runtime & toolkit",
  },
];

// Deployment method options
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
    description: "Fast, secure sites on Cloudflare's edge network",
  },
  {
    id: "azure-static",
    name: "Azure Static Web Apps",
    icon: "microsoft-color",
    color: "text-blue-600",
    description: "Full-stack web apps with serverless APIs",
  },
  {
    id: "vercel",
    name: "Vercel",
    icon: "vercel",
    color: "text-black",
    description: "The platform for frontend developers",
  },
  {
    id: "netlify",
    name: "Netlify",
    icon: "netlify",
    color: "text-teal-500",
    description: "Build and deploy modern web projects",
  },
  {
    id: "github-pages",
    name: "GitHub Pages",
    icon: FaGithub,
    color: "text-gray-800",
    description: "Host directly from your GitHub repository",
  },
];

// UI Component Libraries with framework dependencies
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
    icon: SiDaisyui,
    color: "text-pink-500",
    description: "Tailwind CSS component library",
    frameworks: ["*"], // Available for all frameworks
    requires: ["tailwind"], // Requires Tailwind CSS
  },
  {
    id: "shadcn",
    name: "shadcn/ui",
    icon: SiShadcnui,
    color: "text-gray-800",
    description: "Copy-paste React components",
    frameworks: ["react", "next", "remix", "vite"],
    requires: ["tailwind"],
  },
  {
    id: "brutalist",
    name: "Brutalist UI",
    icon: null,
    color: "text-black",
    description: "Bold, raw design components",
    frameworks: ["react", "next", "remix"],
    requires: ["tailwind"], // Best with Tailwind
  },
  {
    id: "mui",
    name: "Material UI",
    icon: SiMui,
    color: "text-blue-600",
    description: "React components for faster development",
    frameworks: ["react", "next", "remix"],
  },
  {
    id: "chakra",
    name: "Chakra UI",
    icon: SiChakraui,
    color: "text-teal-500",
    description: "Simple, modular React component library",
    frameworks: ["react", "next", "remix"],
  },
  {
    id: "antd",
    name: "Ant Design",
    icon: SiAntdesign,
    color: "text-blue-500",
    description: "Enterprise-class UI design language",
    frameworks: ["react", "next", "remix"],
  },
  {
    id: "mantine",
    name: "Mantine",
    icon: SiMantine,
    color: "text-blue-600",
    description: "Full-featured React components library",
    frameworks: ["react", "next", "remix"],
  },
];

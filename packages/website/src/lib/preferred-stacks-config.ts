import { IconType } from "react-icons";
import { FaReact, FaVuejs, FaServer, FaCloud, FaBolt, FaBuilding } from "react-icons/fa";
import { SiNextdotjs, SiRemix } from "react-icons/si";

import type { ExtendedProjectConfig } from "@/components/builder/types";

export interface PreferredStack {
  id: string;
  name: string;
  description: string;
  category: "fullstack" | "frontend" | "backend" | "enterprise" | "rapid";
  icon: IconType;
  config: Partial<ExtendedProjectConfig>;
  tags: string[];
}

/**
 * Pre-configured project templates with complete technology stacks.
 * Each stack includes framework, styling, backend, database, and tooling configurations.
 */
export const preferredStacks: PreferredStack[] = [
  {
    id: "t3-stack",
    name: "T3 Stack",
    description:
      "The best way to start a full-stack, typesafe Next.js app with tRPC, Prisma, and Auth.js",
    category: "fullstack",
    icon: SiNextdotjs,
    config: {
      framework: "next",
      styling: "tailwind",
      uiLibrary: "shadcn",
      backend: "none",
      database: "postgres",
      orm: "prisma",
      auth: "auth.js",
      runtime: "node",
      typescript: true,
      git: true,
      docker: false,
      autoInstall: true,
      aiAssistant: "claude",
      powerups: ["vitest", "playwright", "eslint", "prettier"],
      mcpServers: ["filesystem", "postgres"],
    },
    tags: ["TypeScript", "Full-stack", "Popular", "Recommended"],
  },
  {
    id: "modern-react",
    name: "Modern React SPA",
    description: "React with Vite, TypeScript, TanStack Query, and modern tooling for fast SPAs",
    category: "frontend",
    icon: FaReact,
    config: {
      framework: "react",
      styling: "tailwind",
      uiLibrary: "shadcn",
      backend: "none",
      database: "none",
      orm: "none",
      auth: "none",
      runtime: "node",
      typescript: true,
      git: true,
      docker: false,
      autoInstall: true,
      aiAssistant: "claude",
      powerups: ["tanstack-query", "react-router", "vitest", "eslint", "prettier"],
      mcpServers: ["filesystem"],
    },
    tags: ["React", "SPA", "Modern", "Fast"],
  },
  {
    id: "vue-nuxt",
    name: "Vue Nuxt Stack",
    description: "Full-stack Vue.js with Nuxt, Tailwind, and modern development experience",
    category: "fullstack",
    icon: FaVuejs,
    config: {
      framework: "vue",
      styling: "tailwind",
      uiLibrary: "none",
      backend: "none",
      database: "postgres",
      orm: "prisma",
      auth: "none",
      runtime: "node",
      typescript: true,
      git: true,
      docker: false,
      autoInstall: true,
      aiAssistant: "claude",
      powerups: ["vitest", "eslint", "prettier"],
      mcpServers: ["filesystem", "postgres"],
    },
    tags: ["Vue", "Nuxt", "Full-stack"],
  },
  {
    id: "enterprise-next",
    name: "Enterprise Next.js",
    description:
      "Production-ready Next.js with comprehensive testing, monitoring, and enterprise features",
    category: "enterprise",
    icon: FaBuilding,
    config: {
      framework: "next",
      styling: "tailwind",
      uiLibrary: "shadcn",
      backend: "none",
      database: "postgres",
      orm: "prisma",
      auth: "auth.js",
      runtime: "node",
      typescript: true,
      git: true,
      docker: true,
      autoInstall: true,
      aiAssistant: "claude",
      powerups: ["vitest", "playwright", "storybook", "eslint", "prettier", "husky", "commitlint"],
      mcpServers: ["filesystem", "postgres", "docker"],
    },
    tags: ["Enterprise", "Production", "Testing", "Docker"],
  },
  {
    id: "rapid-prototype",
    name: "Rapid Prototype",
    description: "Quick prototyping with Vite, minimal setup, and instant deployment",
    category: "rapid",
    icon: FaBolt,
    config: {
      framework: "vite",
      styling: "tailwind",
      uiLibrary: "daisyui",
      backend: "none",
      database: "none",
      orm: "none",
      auth: "none",
      runtime: "node",
      typescript: false,
      git: true,
      docker: false,
      autoInstall: true,
      aiAssistant: "claude",
      powerups: ["eslint"],
      mcpServers: ["filesystem"],
    },
    tags: ["Rapid", "Prototype", "Simple", "Fast"],
  },
  {
    id: "full-stack-express",
    name: "Full-Stack Express",
    description: "Complete full-stack setup with Express backend, React frontend, and PostgreSQL",
    category: "fullstack",
    icon: FaServer,
    config: {
      framework: "react",
      styling: "tailwind",
      uiLibrary: "shadcn",
      backend: "express",
      database: "postgres",
      orm: "prisma",
      auth: "passport",
      runtime: "node",
      typescript: true,
      git: true,
      docker: true,
      autoInstall: true,
      aiAssistant: "claude",
      powerups: ["vitest", "eslint", "prettier"],
      mcpServers: ["filesystem", "postgres", "docker"],
    },
    tags: ["Express", "Full-stack", "REST API", "Docker"],
  },
  {
    id: "serverless-stack",
    name: "Serverless Stack",
    description: "Modern serverless architecture with Vercel, Supabase, and edge functions",
    category: "fullstack",
    icon: FaCloud,
    config: {
      framework: "next",
      styling: "tailwind",
      uiLibrary: "shadcn",
      backend: "none",
      database: "supabase",
      orm: "none",
      auth: "supabase-auth",
      runtime: "node",
      typescript: true,
      git: true,
      docker: false,
      autoInstall: true,
      aiAssistant: "claude",
      deploymentMethod: "vercel",
      powerups: ["vitest", "eslint", "prettier"],
      mcpServers: ["filesystem", "supabase"],
    },
    tags: ["Serverless", "Edge", "Supabase", "Vercel"],
  },
  {
    id: "remix-stack",
    name: "Remix Full-Stack",
    description: "Modern Remix stack with PostgreSQL, Prisma, and comprehensive tooling",
    category: "fullstack",
    icon: SiRemix,
    config: {
      framework: "remix",
      styling: "tailwind",
      uiLibrary: "shadcn",
      backend: "none",
      database: "postgres",
      orm: "prisma",
      auth: "better-auth",
      runtime: "node",
      typescript: true,
      git: true,
      docker: false,
      autoInstall: true,
      aiAssistant: "claude",
      powerups: ["vitest", "playwright", "eslint", "prettier"],
      mcpServers: ["filesystem", "postgres"],
    },
    tags: ["Remix", "Full-stack", "SSR"],
  },
  {
    id: "tanstack-start",
    name: "TanStack Start Stack",
    description: "Full-stack React with TanStack Router, Query, and modern tooling",
    category: "fullstack",
    icon: FaReact,
    config: {
      framework: "tanstack-start",
      styling: "tailwind",
      uiLibrary: "shadcn",
      backend: "none",
      database: "postgres",
      orm: "prisma",
      auth: "better-auth",
      runtime: "node",
      typescript: true,
      git: true,
      docker: false,
      autoInstall: true,
      aiAssistant: "claude",
      powerups: ["vitest", "playwright", "eslint", "prettier"],
      mcpServers: ["filesystem", "postgres"],
    },
    tags: ["TanStack", "Full-stack", "Modern", "TypeScript"],
  },
  {
    id: "react-native-stack",
    name: "React Native Stack",
    description: "Mobile app development with React Native, Expo, and modern tooling",
    category: "frontend",
    icon: FaReact,
    config: {
      framework: "react-native",
      styling: "tailwind",
      uiLibrary: "none",
      backend: "none",
      database: "none",
      orm: "none",
      auth: "none",
      runtime: "node",
      typescript: true,
      git: true,
      docker: false,
      autoInstall: true,
      aiAssistant: "claude",
      powerups: ["eslint", "prettier"],
      mcpServers: ["filesystem"],
    },
    tags: ["React Native", "Mobile", "Cross-platform", "Expo"],
  },
];

/**
 * Filters stacks by category.
 *
 * @param category - Stack category to filter by
 * @returns Array of stacks matching the category, or all stacks if no category provided
 */
export const getStacksByCategory = (category?: string) => {
  if (!category) return preferredStacks;
  return preferredStacks.filter((stack) => stack.category === category);
};

/**
 * Finds a stack by its ID.
 *
 * @param id - Stack identifier
 * @returns Stack matching the ID, or undefined if not found
 */
export const getStackById = (id: string) => {
  return preferredStacks.find((stack) => stack.id === id);
};

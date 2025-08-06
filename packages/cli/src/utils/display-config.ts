import { log } from "@clack/prompts";
import pc from "picocolors";

import type { ProjectConfig } from "../../../shared/stack-config.js";

// Icon mappings for different technologies
const TECH_ICONS: Record<string, string> = {
  // Frameworks
  react: "⚛️",
  vue: "💚",
  angular: "🅰️",
  next: "▲",
  nuxt: "💚",
  astro: "🚀",
  vite: "⚡",
  remix: "💿",
  solid: "🔷",
  svelte: "🧡",
  vanilla: "🍦",

  // Backends
  node: "🟢",
  express: "🚂",
  fastapi: "🐍",
  hono: "🔥",
  fastify: "⚡",
  elysia: "🦋",
  convex: "🔄",
  none: "❌",

  // Databases
  postgres: "🐘",
  mongodb: "🍃",
  mysql: "🐬",
  supabase: "⚡",
  firebase: "🔥",

  // ORMs
  prisma: "🔺",
  drizzle: "💧",
  typeorm: "🏗️",

  // Styling
  tailwind: "💨",
  css: "🎨",
  scss: "💄",
  "styled-components": "💅",

  // Runtimes
  bun: "🥟",
  deno: "🦕",
  "cloudflare-workers": "☁️",
  "vercel-edge": "▲",
  "aws-lambda": "λ",

  // UI Libraries
  shadcn: "🎯",
  daisyui: "🌼",
  mui: "Ⓜ️",
  chakra: "⚡",
  antd: "🐜",
  mantine: "🎯",

  // Auth Providers
  "auth.js": "🔐",
  "better-auth": "🔒",

  // API Clients
  "tanstack-query": "⚡",
  swr: "🔄",
  axios: "📡",
  trpc: "🔗",
  "apollo-client": "🚀",

  // AI Assistants
  claude: "🧠",
  cursor: "📝",
  copilot: "🤖",
  gemini: "⭐",

  // General
  typescript: "📘",
  javascript: "📜",
  git: "📚",
  docker: "🐳",
};

function getTechIcon(tech: string): string {
  return TECH_ICONS[tech.toLowerCase()] || "📦";
}
export function displayConfigSummary(config: ProjectConfig): void {
  log.message("");
  log.message(pc.bold("📋 Configuration Summary:"));
  log.message("");
  const items = [
    {
      label: "Project",
      value: config.name,
      color: pc.cyan,
      icon: "📁",
    },
    {
      label: "Framework",
      value: config.framework,
      color: pc.green,
      icon: getTechIcon(config.framework),
    },
    {
      label: "Backend",
      value: config.backend,
      color: pc.yellow,
      icon: getTechIcon(config.backend),
    },
    {
      label: "Database",
      value: config.database,
      color: pc.blue,
      icon: getTechIcon(config.database),
    },
    {
      label: "ORM",
      value: config.orm,
      color: pc.magenta,
      icon: getTechIcon(config.orm),
    },
    {
      label: "Styling",
      value: config.styling,
      color: pc.cyan,
      icon: getTechIcon(config.styling),
    },
    {
      label: "Runtime",
      value: config.runtime || "node",
      color: pc.yellow,
      icon: getTechIcon(config.runtime || "node"),
    },
    {
      label: "TypeScript",
      value: config.typescript ? "✓" : "✗",
      color: config.typescript ? pc.green : pc.red,
      icon: config.typescript ? getTechIcon("typescript") : getTechIcon("javascript"),
    },
    {
      label: "Git",
      value: config.git ? "✓" : "✗",
      color: config.git ? pc.green : pc.red,
      icon: config.git ? getTechIcon("git") : "❌",
    },
    {
      label: "Docker",
      value: config.docker ? "✓" : "✗",
      color: config.docker ? pc.green : pc.red,
      icon: config.docker ? getTechIcon("docker") : "❌",
    },
  ];

  // Add UI Library if present
  if (config.uiLibrary) {
    items.splice(6, 0, {
      label: "UI Library",
      value: config.uiLibrary,
      color: pc.magenta,
      icon: getTechIcon(config.uiLibrary),
    });
  }

  // Add Auth Provider if present
  if (config.authProvider) {
    items.splice(config.uiLibrary ? 7 : 6, 0, {
      label: "Auth",
      value: config.authProvider,
      color: pc.green,
      icon: getTechIcon(config.authProvider),
    });
  }

  // Add API Client if present
  if (config.apiClient && config.apiClient !== "none") {
    const insertIndex = 6 + (config.uiLibrary ? 1 : 0) + (config.authProvider ? 1 : 0);
    items.splice(insertIndex, 0, {
      label: "API Client",
      value: config.apiClient,
      color: pc.blue,
      icon: getTechIcon(config.apiClient),
    });
  }

  // Add AI Assistant if present
  if (config.aiAssistant && config.aiAssistant !== "none") {
    const insertIndex =
      6 +
      (config.uiLibrary ? 1 : 0) +
      (config.authProvider ? 1 : 0) +
      (config.apiClient && config.apiClient !== "none" ? 1 : 0);
    items.splice(insertIndex, 0, {
      label: "AI Assistant",
      value: config.aiAssistant,
      color: pc.magenta,
      icon: getTechIcon(config.aiAssistant),
    });
  }

  const maxLabelLength = Math.max(...items.map((item) => item.label.length));
  items.forEach(({ label, value, color, icon }) => {
    const paddedLabel = label.padEnd(maxLabelLength);
    log.message(`  ${icon} ${pc.gray(paddedLabel)} ${color(value)}`);
  });
  log.message("");
}
export function displayConfig(config: Partial<ProjectConfig>): string {
  const entries = Object.entries(config)
    .filter(([_, value]) => value !== undefined)
    .map(([key, value]) => {
      const displayValue =
        typeof value === "boolean" ? (value ? pc.green("✓") : pc.red("✗")) : pc.cyan(String(value));
      return `${pc.gray(key)}: ${displayValue}`;
    });
  return entries.join(", ");
}

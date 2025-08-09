/**
 * Application-wide constants.
 * Centralized location for all constant values used throughout the app.
 */

export const APP_NAME = "Precast";
export const APP_TAGLINE = "The superhero CLI builder for modern web projects";
export const APP_DESCRIPTION =
  "Build TypeScript projects with superhuman speed! Precast is a powerful CLI tool that helps you scaffold modern web applications with your preferred technology stack.";

export const GITHUB_REPO = "BuunGroupCore/precast-app";
export const NPM_PACKAGE = "create-precast-app";

export const API_ENDPOINTS = {
  GITHUB_REPO: `https://api.github.com/repos/${GITHUB_REPO}`,
  GITHUB_CONTRIBUTORS: `https://api.github.com/repos/${GITHUB_REPO}/contributors`,
  NPM_PACKAGE: `https://registry.npmjs.org/${NPM_PACKAGE}`,
  NPM_DOWNLOADS: `https://api.npmjs.org/downloads`,
};

export const EXTERNAL_LINKS = {
  GITHUB: `https://github.com/${GITHUB_REPO}`,
  NPM: `https://www.npmjs.com/package/${NPM_PACKAGE}`,
  DISCORD: "https://discord.gg/4Wen9Pg3rG",
  TWITTER: "https://x.com/buungroup",
  LINKEDIN: "https://www.linkedin.com/company/buun-group",
  BRUTALIST_UI: "https://brutalist.precast.dev",
  BUUN_GROUP: "https://buungroup.com",
};

export const INTERNAL_LINKS = {
  PRECAST_DOCS: "https://precast.dev/docs",
  PRECAST_URL: "https://precast.dev",
  PRECAST_TESTIMONIALS: "https://precast.dev/testimonials",
  PRECAST_SUBMIT_TESTIMONIAL: "https://precast.dev/submit-testimonial",
};

export const EMAILS = {
  SUPPORT: "support@precast.dev",
  SALES: "sales@precast.dev",
  PARTNERSHIPS: "partners@precast.dev",
  LEGAL: "legal@precast.dev",
  PRESS: "press@precast.dev",
};

export const PACKAGE_MANAGERS = [
  { id: "npx", command: "npx create-precast-app" },
  { id: "npm", command: "npm create precast-app" },
  { id: "yarn", command: "yarn create precast-app" },
  { id: "pnpm", command: "pnpm create precast-app" },
  { id: "bun", command: "bun create precast-app" },
] as const;

export const CACHE_DURATIONS = {
  GITHUB_STATS: 5 * 60 * 1000, // 5 minutes
  NPM_STATS: 10 * 60 * 1000, // 10 minutes
  SPONSORS: 30 * 60 * 1000, // 30 minutes
};

export const ANIMATION_DURATIONS = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
};

export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  "2XL": 1536,
} as const;

export const Z_INDEX = {
  DROPDOWN: 10,
  DIALOG_BACKDROP: 40,
  DIALOG: 50,
  TOOLTIP: 60,
  NOTIFICATION: 70,
} as const;

export const SOCIAL_MEDIA = {
  TWITTER_HANDLE: "@buungroup",
  TWITTER_PRECAST: "@PrecastDev",
} as const;

export const ORGANIZATIONS = {
  BUUN_GROUP: "Buun Group",
  PRECAST_TEAM: "PRECAST Team",
} as const;

export const THIRD_PARTY_APIS = {
  DICEBEAR_BASE: "https://api.dicebear.com/9.x",
  DICEBEAR_NOTIONISTS: "https://api.dicebear.com/9.x/notionists/svg",
  RAW_GITHUB_CONTENT: `https://raw.githubusercontent.com/${GITHUB_REPO}/main`,
} as const;

export const DATA_URLS = {
  TESTIMONIALS_JSON: `https://raw.githubusercontent.com/${GITHUB_REPO}/main/packages/website/public/testimonials.json`,
  ANALYTICS_JSON: `https://raw.githubusercontent.com/${GITHUB_REPO}/main/data/analytics.json`,
} as const;

export const ANALYTICS = {
  POSTHOG_API_KEY: import.meta.env.VITE_PUBLIC_POSTHOG_KEY || "",
  POSTHOG_HOST: import.meta.env.VITE_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com",
  GOOGLE_ANALYTICS_ID: import.meta.env.VITE_GA_MEASUREMENT_ID || "",
} as const;

export const FEATURES = {
  // Set to true to show the beta disclaimer, false to hide it
  SHOW_BETA_DISCLAIMER: true,
} as const;

// Keyboard shortcuts
export const KEYBOARD_SHORTCUTS = {
  // Press Ctrl/Cmd + Shift + B to reset beta disclaimer
  RESET_BETA_DISCLAIMER: "ctrl+shift+b",
} as const;

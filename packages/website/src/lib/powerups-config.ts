import { IconType } from "react-icons";
import {
  FaBook,
  FaCode,
  FaFileAlt,
  FaGitAlt,
  FaRocket,
  FaCogs,
  FaChartLine,
  FaCheckCircle,
  FaLanguage,
  FaSearch,
  FaAccessibleIcon,
  FaImages,
  FaMobileAlt,
  FaBolt,
  FaRoute,
} from "react-icons/fa";
import {
  SiTurborepo,
  SiPrettier,
  SiEslint,
  SiStorybook,
  SiSentry,
  SiCypress,
  SiReactrouter,
} from "react-icons/si";

/**
 * Configuration for additional development tools and extensions.
 * Includes dependencies, framework compatibility, and categorization.
 */
export interface PowerUp {
  id: string;
  name: string;
  description: string;
  icon: IconType;
  category:
    | "docs"
    | "build"
    | "testing"
    | "linting"
    | "monitoring"
    | "accessibility"
    | "optimization"
    | "workflow"
    | "api"
    | "routing";
  /** Compatible frameworks, * for all */
  frameworks?: string[];
  /** Required dependencies */
  dependencies?: string[];
  /** Only show when backend is selected */
  requiresBackend?: boolean;
  /** Is this power-up in beta? */
  beta?: boolean;
  /** Recommendation configuration */
  recommended?: {
    /** Recommended for these frameworks */
    frameworks?: string[];
    /** Recommended for these backends */
    backends?: string[];
    /** Recommended for these databases */
    databases?: string[];
    /** Recommended for these styling solutions */
    styling?: string[];
    /** Why it's recommended */
    reason?: string;
  };
}

/**
 * Available power-ups (extensions) for enhancing project capabilities.
 * Organized by category with dependency validation and framework compatibility.
 */
export const powerUps: PowerUp[] = [
  {
    id: "fumadocs",
    name: "Fumadocs",
    description: "Beautiful documentation site generator for Next.js App Router",
    icon: FaBook,
    category: "docs",
    frameworks: ["next"],
    recommended: {
      frameworks: ["next"],
      reason: "Modern docs solution for App Router",
    },
  },
  {
    id: "docusaurus",
    name: "Docusaurus",
    description: "Easy to maintain open source documentation websites (React SPA)",
    icon: FaFileAlt,
    category: "docs",
    frameworks: ["react"],
  },
  {
    id: "storybook",
    name: "Storybook",
    description: "Build UI components and pages in isolation",
    icon: SiStorybook,
    category: "docs",
    frameworks: ["react", "vue", "angular", "svelte", "solid", "next", "nuxt", "remix"],
    recommended: {
      frameworks: ["react", "vue", "angular"],
      styling: ["tailwind", "css"],
      reason: "Perfect for component library development",
    },
  },

  /** Build Tools */
  {
    id: "turborepo",
    name: "Turborepo",
    description: "High-performance build system for JavaScript and TypeScript monorepos",
    icon: SiTurborepo,
    category: "build",
    frameworks: ["*"],
    recommended: {
      frameworks: ["next"],
      backends: ["hono", "express", "fastify"],
      reason: "Vercel's official monorepo solution",
    },
  },
  {
    id: "nx",
    name: "Nx",
    description: "Smart, fast and extensible build system",
    icon: FaCogs,
    category: "build",
    frameworks: ["*"],
  },
  {
    id: "vite-pwa",
    name: "Vite PWA",
    description: "Zero-config PWA plugin for Vite",
    icon: FaMobileAlt,
    category: "build",
    frameworks: ["*"],
    dependencies: ["vite"],
    recommended: {
      frameworks: ["vite", "vue", "svelte", "solid"],
      reason: "Seamless PWA integration for Vite apps",
    },
  },

  /** Git Workflow */
  {
    id: "husky",
    name: "Husky",
    description: "Git hooks made easy - run linters on commit",
    icon: FaGitAlt,
    category: "workflow",
    frameworks: ["*"],
  },
  {
    id: "commitizen",
    name: "Commitizen",
    description: "Conventional commit messages made easy",
    icon: FaCheckCircle,
    category: "workflow",
    frameworks: ["*"],
  },
  {
    id: "semantic-release",
    name: "Semantic Release",
    description: "Fully automated version management and package publishing",
    icon: FaRocket,
    category: "workflow",
    frameworks: ["*"],
  },

  /** Linting & Formatting */
  {
    id: "biome",
    name: "Biome",
    description: "Fast formatter and linter for JavaScript, TypeScript, JSON",
    icon: FaBolt,
    category: "linting",
    frameworks: ["*"],
    recommended: {
      frameworks: ["vite", "solid", "svelte"],
      reason: "Faster alternative to ESLint + Prettier",
    },
  },
  {
    id: "prettier",
    name: "Prettier",
    description: "Opinionated code formatter",
    icon: SiPrettier,
    category: "linting",
    frameworks: ["*"],
  },
  {
    id: "eslint",
    name: "ESLint",
    description: "Find and fix problems in JavaScript code",
    icon: SiEslint,
    category: "linting",
    frameworks: ["*"],
  },

  /** Testing */
  {
    id: "vitest",
    name: "Vitest",
    description: "Blazing fast unit testing framework",
    icon: FaCheckCircle,
    category: "testing",
    frameworks: ["*"],
    recommended: {
      frameworks: ["vite", "vue", "svelte", "solid", "react"],
      reason: "Native Vite integration for blazing fast tests",
    },
  },
  {
    id: "playwright",
    name: "Playwright",
    description: "Reliable end-to-end testing for modern web apps",
    icon: FaCheckCircle,
    category: "testing",
    frameworks: ["*"],
    recommended: {
      frameworks: ["next", "nuxt", "remix", "astro"],
      reason: "Best for server-side rendered apps",
    },
  },
  {
    id: "cypress",
    name: "Cypress",
    description: "Fast, easy and reliable testing for anything that runs in a browser",
    icon: SiCypress,
    category: "testing",
    frameworks: ["*"],
  },

  /** Monitoring & Analytics */
  {
    id: "sentry",
    name: "Sentry",
    description: "Application monitoring and error tracking",
    icon: SiSentry,
    category: "monitoring",
    frameworks: ["*"],
    recommended: {
      frameworks: ["next", "remix", "nuxt"],
      backends: ["hono", "express", "fastify"],
      databases: ["postgres", "mysql"],
      reason: "Essential for production error tracking",
    },
  },
  {
    id: "posthog",
    name: "PostHog",
    description: "Open-source product analytics",
    icon: FaChartLine,
    category: "monitoring",
    frameworks: ["*"],
    recommended: {
      frameworks: ["next", "react", "vue", "nuxt"],
      backends: ["hono", "express", "fastify"],
      reason: "Privacy-focused analytics with full control",
    },
  },
  {
    id: "vercel-analytics",
    name: "Vercel Analytics",
    description: "Privacy-friendly analytics (best with Next.js)",
    icon: FaChartLine,
    category: "monitoring",
    frameworks: ["next", "nuxt", "react", "svelte"],
  },

  /** Optimization */
  {
    id: "million",
    name: "Million.js",
    description: "Make React 70% faster with a compiler",
    icon: FaBolt,
    category: "optimization",
    frameworks: ["react", "next", "remix", "astro"],
    dependencies: ["react"],
  },
  {
    id: "partytown",
    name: "Partytown",
    description: "Run third-party scripts in a web worker",
    icon: FaRocket,
    category: "optimization",
    frameworks: ["*"],
  },
  {
    id: "bundle-analyzer",
    name: "Bundle Analyzer",
    description: "Visualize size of webpack output files",
    icon: FaChartLine,
    category: "optimization",
    frameworks: ["react", "next", "vue", "nuxt", "angular"],
  },

  /** Accessibility */
  {
    id: "axe-core",
    name: "Axe DevTools",
    description: "Accessibility testing tools",
    icon: FaAccessibleIcon,
    category: "accessibility",
    frameworks: ["*"],
  },
  {
    id: "react-aria",
    name: "React Aria",
    description: "Library of React Hooks for accessible UI primitives",
    icon: FaAccessibleIcon,
    category: "accessibility",
    frameworks: ["react", "next", "remix"],
    dependencies: ["react"],
  },

  /** SEO & Meta */
  {
    id: "next-seo",
    name: "Next SEO",
    description: "SEO made easy for Next.js projects",
    icon: FaSearch,
    category: "optimization",
    frameworks: ["next"],
    recommended: {
      frameworks: ["next"],
      reason: "De facto SEO solution for Next.js",
    },
  },
  {
    id: "react-helmet",
    name: "React Helmet",
    description: "Document head management for React (use native solutions for Next.js/Remix)",
    icon: FaSearch,
    category: "optimization",
    frameworks: ["react"],
    dependencies: ["react"],
  },

  /** Internationalization */
  {
    id: "next-intl",
    name: "Next-intl",
    description: "Internationalization for Next.js that gets out of your way",
    icon: FaLanguage,
    category: "workflow",
    frameworks: ["next"],
  },
  {
    id: "react-i18next",
    name: "react-i18next",
    description: "Most popular internationalization for React (2M+ weekly downloads)",
    icon: FaLanguage,
    category: "workflow",
    frameworks: ["react", "remix"],
    dependencies: ["react"],
  },
  {
    id: "vue-i18n",
    name: "vue-i18n",
    description: "Official internationalization plugin for Vue.js",
    icon: FaLanguage,
    category: "workflow",
    frameworks: ["vue", "nuxt"],
    dependencies: ["vue"],
  },
  {
    id: "angular-localize",
    name: "@angular/localize",
    description: "Built-in internationalization support for Angular",
    icon: FaLanguage,
    category: "workflow",
    frameworks: ["angular"],
  },
  {
    id: "solid-i18n",
    name: "@solid-primitives/i18n",
    description: "Internationalization primitives for SolidJS",
    icon: FaLanguage,
    category: "workflow",
    frameworks: ["solid"],
    beta: true,
  },

  /** Image Optimization */
  {
    id: "sharp",
    name: "Sharp",
    description: "High performance image processing",
    icon: FaImages,
    category: "optimization",
    frameworks: ["*"],
  },
  {
    id: "imagemin",
    name: "Imagemin",
    description: "Minify images seamlessly",
    icon: FaImages,
    category: "optimization",
    frameworks: ["*"],
  },

  /** Routing */
  {
    id: "tanstack-router",
    name: "TanStack Router",
    description: "Type-safe routing with search params validation",
    icon: FaRoute,
    category: "routing",
    frameworks: ["react", "solid"],
    dependencies: ["typescript"],
    beta: true,
    recommended: {
      frameworks: ["react", "solid"],
      reason: "Modern type-safe routing solution",
    },
  },
  {
    id: "react-router",
    name: "React Router",
    description: "Declarative routing for React applications",
    icon: SiReactrouter,
    category: "routing",
    frameworks: ["react"],
    dependencies: ["react"],
  },
  {
    id: "vue-router",
    name: "Vue Router",
    description: "Official router for Vue.js applications",
    icon: FaRoute,
    category: "routing",
    frameworks: ["vue"],
    dependencies: ["vue"],
    recommended: {
      frameworks: ["vue"],
      reason: "Official Vue.js routing solution",
    },
  },
  {
    id: "svelte-routing",
    name: "Svelte Routing",
    description: "Declarative routing for Svelte applications",
    icon: FaRoute,
    category: "routing",
    frameworks: ["svelte"],
  },
  {
    id: "solid-router",
    name: "Solid Router",
    description: "Official routing library for SolidJS",
    icon: FaRoute,
    category: "routing",
    frameworks: ["solid"],
    recommended: {
      frameworks: ["solid"],
      reason: "Official SolidJS routing solution",
    },
  },
];

export const powerUpCategories = [
  { id: "docs", name: "Documentation", icon: FaBook },
  { id: "build", name: "Build Tools", icon: FaCogs },
  { id: "testing", name: "Testing", icon: FaCheckCircle },
  { id: "linting", name: "Linting", icon: FaCode },
  { id: "monitoring", name: "Monitoring", icon: FaChartLine },
  { id: "accessibility", name: "Accessibility", icon: FaAccessibleIcon },
  { id: "optimization", name: "Optimization", icon: FaBolt },
  { id: "workflow", name: "Workflow", icon: FaGitAlt },
  { id: "routing", name: "Routing", icon: FaRoute },
];

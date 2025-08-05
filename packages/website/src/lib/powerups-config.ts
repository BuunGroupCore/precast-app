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
} from "react-icons/fa";
import {
  SiTurborepo,
  SiPrettier,
  SiEslint,
  SiStorybook,
  SiSentry,
  SiCypress,
} from "react-icons/si";

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
    | "workflow";
  frameworks?: string[]; // Compatible frameworks, * for all
  dependencies?: string[]; // Required dependencies
}

export const powerUps: PowerUp[] = [
  // Documentation
  {
    id: "fumadocs",
    name: "Fumadocs",
    description: "Beautiful documentation site generator for Next.js",
    icon: FaBook,
    category: "docs",
    frameworks: ["next"],
  },
  {
    id: "docusaurus",
    name: "Docusaurus",
    description: "Easy to maintain open source documentation websites",
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
    frameworks: ["react", "vue", "angular", "svelte"],
  },

  // Build Tools
  {
    id: "turborepo",
    name: "Turborepo",
    description: "High-performance build system for JavaScript and TypeScript monorepos",
    icon: SiTurborepo,
    category: "build",
    frameworks: ["*"],
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
    frameworks: ["react", "vue", "svelte"],
    dependencies: ["vite"],
  },

  // Git Workflow
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

  // Linting & Formatting
  {
    id: "biome",
    name: "Biome",
    description: "Fast formatter and linter for JavaScript, TypeScript, JSON",
    icon: FaBolt,
    category: "linting",
    frameworks: ["*"],
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

  // Testing
  {
    id: "vitest",
    name: "Vitest",
    description: "Blazing fast unit testing framework",
    icon: FaCheckCircle,
    category: "testing",
    frameworks: ["*"],
  },
  {
    id: "playwright",
    name: "Playwright",
    description: "Reliable end-to-end testing for modern web apps",
    icon: FaCheckCircle,
    category: "testing",
    frameworks: ["*"],
  },
  {
    id: "cypress",
    name: "Cypress",
    description: "Fast, easy and reliable testing for anything that runs in a browser",
    icon: SiCypress,
    category: "testing",
    frameworks: ["*"],
  },

  // Monitoring & Analytics
  {
    id: "sentry",
    name: "Sentry",
    description: "Application monitoring and error tracking",
    icon: SiSentry,
    category: "monitoring",
    frameworks: ["*"],
  },
  {
    id: "posthog",
    name: "PostHog",
    description: "Open-source product analytics",
    icon: FaChartLine,
    category: "monitoring",
    frameworks: ["*"],
  },
  {
    id: "vercel-analytics",
    name: "Vercel Analytics",
    description: "Privacy-friendly analytics for your website",
    icon: FaChartLine,
    category: "monitoring",
    frameworks: ["next", "react", "vue", "svelte"],
  },

  // Optimization
  {
    id: "million",
    name: "Million.js",
    description: "Make React 70% faster with a compiler",
    icon: FaBolt,
    category: "optimization",
    frameworks: ["react", "next"],
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
    frameworks: ["*"],
  },

  // Accessibility
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
    frameworks: ["react", "next"],
  },

  // SEO & Meta
  {
    id: "next-seo",
    name: "Next SEO",
    description: "SEO made easy for Next.js projects",
    icon: FaSearch,
    category: "optimization",
    frameworks: ["next"],
  },
  {
    id: "react-helmet",
    name: "React Helmet",
    description: "Document head management for React",
    icon: FaSearch,
    category: "optimization",
    frameworks: ["react"],
  },

  // Internationalization
  {
    id: "next-intl",
    name: "Next-intl",
    description: "Internationalization for Next.js that gets out of your way",
    icon: FaLanguage,
    category: "workflow",
    frameworks: ["next"],
  },
  {
    id: "i18next",
    name: "i18next",
    description: "Internationalization framework for JavaScript",
    icon: FaLanguage,
    category: "workflow",
    frameworks: ["*"],
  },

  // Image Optimization
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
];

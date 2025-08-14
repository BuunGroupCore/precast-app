import { IconType } from "react-icons";
import { FaReact, FaVuejs, FaAngular, FaNodeJs, FaDocker, FaGitAlt } from "react-icons/fa";
import {
  SiTypescript,
  SiJavascript,
  SiNextdotjs,
  SiExpress,
  SiFastapi,
  SiPostgresql,
  SiMongodb,
  SiMysql,
  SiPrisma,
  SiSupabase,
  SiTailwindcss,
  SiFirebase,
  SiAstro,
  SiVite,
  SiReactrouter,
  SiSolid,
  SiSvelte,
  SiNuxtdotjs,
  SiDrizzle,
  SiFastify,
  SiBun,
  SiDeno,
  SiAuth0,
} from "react-icons/si";

import { AuthJSIcon } from "@/components/icons/AuthJSIcon";
import { BetterAuthIcon } from "@/components/icons/BetterAuthIcon";
import { ClerkIcon } from "@/components/icons/ClerkIcon";
import { CloudflareIcon } from "@/components/icons/CloudflareIcon";
import { ConvexIcon } from "@/components/icons/ConvexIcon";
import { CssIcon } from "@/components/icons/CssIcon";
import { HonoIconBlack } from "@/components/icons/HonoIconBlack";
import { LuciaIcon } from "@/components/icons/LuciaIcon";
import { PassportIcon } from "@/components/icons/PassportIcon";
import { SassIcon } from "@/components/icons/SassIcon";
import { TanStackIcon } from "@/components/icons/TanStackIcon";

/**
 * Configuration interface for technology stack options used in the builder.
 * Defines properties for frameworks, backends, databases, and other stack components.
 */
export interface StackOption {
  id: string;
  name: string;
  icon: IconType | React.FC<{ className?: string }> | string | null;
  color: string;
  description?: string;
  dependencies?: string[];
  incompatible?: string[];
  recommended?: string[];
  beta?: boolean;
  disabled?: boolean; // Hide from web builder until fully tested
  serverless?: boolean;
  uvBadge?: boolean;
  language?: string;
  languageIcon?: string;
  category?: "ui-library" | "meta-framework" | "build-tool" | "mobile" | "vanilla" | "none";
  badges?: Array<{
    icon: string;
    tooltip: string;
    link?: string;
    color: string;
  }>;
  apiClientCompatibility?: {
    recommended?: string[];
    compatible?: string[];
    incompatible?: string[];
  };
  recommendedFor?: {
    frameworks?: string[];
    backends?: string[];
    databases?: string[];
    uiLibraries?: string[];
    buildTools?: string[];
    reason?: string;
  };
  deploymentOptions?: {
    local?: {
      name: string;
      description: string;
      dockerCompose?: boolean;
    };
    cloud?: {
      name: string;
      description: string;
      providers?: string[];
    };
  };
}

export interface StackCategory {
  id: string;
  name: string;
  options: StackOption[];
}

/**
 * UI Library definitions - core libraries for building user interfaces.
 */
export const uiLibraries_frontend: StackOption[] = [
  {
    id: "react",
    name: "React",
    icon: FaReact,
    color: "text-comic-blue",
    description: "A JavaScript library for building user interfaces",
    category: "ui-library",
    recommended: ["typescript", "tailwind"],
  },
  {
    id: "vue",
    name: "Vue",
    icon: FaVuejs,
    color: "text-comic-green",
    description: "The Progressive JavaScript Framework",
    category: "ui-library",
    recommended: ["typescript", "tailwind"],
  },
  {
    id: "angular",
    name: "Angular",
    icon: FaAngular,
    color: "text-comic-red",
    description: "Platform for building mobile and desktop web applications",
    category: "ui-library",
    dependencies: ["typescript"], // Angular requires TypeScript
    recommended: ["scss"],
    disabled: true,
  },
  {
    id: "solid",
    name: "Solid",
    icon: SiSolid,
    color: "text-comic-blue",
    description: "Simple and performant reactivity for building user interfaces",
    category: "ui-library",
    recommended: ["typescript", "tailwind"],
    disabled: true,
  },
  {
    id: "svelte",
    name: "Svelte",
    icon: SiSvelte,
    color: "text-comic-orange",
    description: "Cybernetically enhanced web apps",
    category: "ui-library",
    recommended: ["typescript", "tailwind"],
  },
];

/**
 * Meta-framework definitions - full-stack frameworks that include UI, routing, and more.
 */
export const metaFrameworks: StackOption[] = [
  {
    id: "next",
    name: "Next.js",
    icon: SiNextdotjs,
    color: "text-comic-black",
    description: "The React Framework for Production",
    category: "meta-framework",
    dependencies: ["react"], // Next.js is built on React
    recommended: ["typescript", "tailwind", "prisma"],
  },
  {
    id: "nuxt",
    name: "Nuxt",
    icon: SiNuxtdotjs,
    color: "text-comic-green",
    description: "The Intuitive Vue Framework",
    category: "meta-framework",
    dependencies: ["vue"], // Nuxt is built on Vue
    recommended: ["typescript", "tailwind"],
    disabled: true,
  },
  {
    id: "astro",
    name: "Astro",
    icon: SiAstro,
    color: "text-comic-orange",
    description: "Build faster websites with Astro's next-gen island architecture",
    category: "meta-framework",
    recommended: ["typescript", "tailwind"],
    disabled: true, // Disabled for future support
  },
  {
    id: "react-router",
    name: "React Router v7",
    icon: SiReactrouter,
    color: "text-comic-red",
    description:
      "Full-stack React framework (formerly Remix) with nested routing and server-side rendering",
    category: "meta-framework",
    dependencies: ["react"],
    recommended: ["typescript", "tailwind", "prisma"],
  },
  {
    id: "tanstack-start",
    name: "TanStack Start",
    icon: TanStackIcon,
    color: "text-comic-orange",
    description: "Full-stack React framework powered by TanStack Router",
    category: "meta-framework",
    dependencies: ["react"],
    recommended: ["typescript", "tailwind"],
  },
];

/**
 * Build tool definitions - development and build tooling.
 */
export const buildTools: StackOption[] = [
  {
    id: "vite",
    name: "Vite",
    icon: SiVite,
    color: "text-comic-purple",
    description: "Next Generation Frontend Tooling",
    category: "build-tool",
    recommended: ["typescript"],
    recommendedFor: {
      uiLibraries: ["react", "vue", "solid", "svelte"],
      reason:
        "Vite provides excellent development experience with fast HMR for modern UI libraries",
    },
  },
  {
    id: "tanstack-router",
    name: "TanStack Router",
    icon: TanStackIcon,
    color: "text-comic-orange",
    description: "Type-safe React router for building SPAs with powerful routing capabilities",
    category: "build-tool",
    dependencies: ["react"],
    recommended: ["typescript", "tailwind"],
    recommendedFor: {
      uiLibraries: ["react"],
      reason: "TanStack Router provides type-safe routing for React SPAs",
    },
  },
];

/**
 * Special framework categories.
 */
export const specialFrameworks: StackOption[] = [
  {
    id: "react-native",
    name: "React Native",
    icon: FaReact,
    color: "text-comic-blue",
    description: "Build native mobile apps using React",
    category: "mobile",
    dependencies: ["react"],
    recommended: ["typescript"],
  },
  {
    id: "vanilla",
    name: "Vanilla",
    icon: SiJavascript,
    color: "text-comic-yellow",
    description: "Plain JavaScript, no framework",
    category: "vanilla",
    disabled: true, // Disabled for future support
  },
  {
    id: "none",
    name: "None",
    icon: null,
    color: "text-comic-gray",
    description: "No frontend framework - backend only or custom setup",
    category: "none",
  },
];

/**
 * Combined frameworks array for backward compatibility.
 * TODO: Replace usage with category-specific arrays.
 */
export const frameworks: StackOption[] = [
  ...uiLibraries_frontend,
  ...metaFrameworks,
  ...buildTools,
  ...specialFrameworks,
];

/**
 * Backend framework definitions with dependencies.
 * Includes Node.js frameworks, serverless options, and BaaS solutions.
 */
export const backends: StackOption[] = [
  {
    id: "node",
    name: "Node.js",
    icon: FaNodeJs,
    color: "text-comic-green",
    description: "JavaScript runtime built on Chrome's V8 JavaScript engine",
    language: "JavaScript",
    languageIcon: "js",
    recommended: ["typescript", "express"],
    apiClientCompatibility: {
      recommended: ["axios", "tanstack-query"],
      compatible: ["swr", "trpc"],
    },
  },
  {
    id: "express",
    name: "Express",
    icon: SiExpress,
    color: "text-comic-black",
    description: "Fast, unopinionated, minimalist web framework for Node.js",
    language: "JavaScript",
    languageIcon: "js",
    dependencies: ["node"],
    recommended: ["typescript"],
    apiClientCompatibility: {
      recommended: ["axios", "tanstack-query"],
      compatible: ["swr", "trpc"],
    },
  },
  {
    id: "fastapi",
    name: "FastAPI",
    icon: SiFastapi,
    color: "text-comic-green",
    description:
      "Modern, fast web framework for building APIs with Python. Uses UV for blazing-fast package management, dependency resolution, and Python environment management",
    language: "Python",
    languageIcon: "python",
    incompatible: ["typescript"],
    recommended: ["postgres", "mysql"],
    uvBadge: true,
    apiClientCompatibility: {
      recommended: ["axios", "tanstack-query", "swr"],
      compatible: [],
      incompatible: ["trpc"],
    },
  },
  {
    id: "hono",
    name: "Hono",
    icon: HonoIconBlack,
    color: "text-comic-orange",
    description: "Ultrafast web framework for the Edges",
    language: "TypeScript",
    languageIcon: "ts",
    dependencies: ["node"],
    recommended: ["typescript"],
    apiClientCompatibility: {
      recommended: ["hono-rpc", "trpc"],
      compatible: ["axios", "tanstack-query", "swr"],
    },
  },
  {
    id: "nextjs",
    name: "Next.js API",
    icon: SiNextdotjs,
    color: "text-comic-black",
    description: "Full-stack React framework with API routes",
    language: "JavaScript",
    languageIcon: "js",
    dependencies: ["react"],
    recommended: ["typescript", "prisma"],
    apiClientCompatibility: {
      recommended: ["axios", "tanstack-query"],
      compatible: ["swr", "trpc"],
    },
  },
  {
    id: "fastify",
    name: "Fastify",
    icon: SiFastify,
    color: "text-comic-black",
    description: "Fast and low overhead web framework for Node.js",
    language: "JavaScript",
    languageIcon: "js",
    dependencies: ["node"],
    recommended: ["typescript"],
    disabled: true,
    apiClientCompatibility: {
      recommended: ["axios", "tanstack-query"],
      compatible: ["swr", "trpc"],
    },
  },
  {
    id: "convex",
    name: "Convex",
    icon: ConvexIcon,
    color: "text-comic-orange",
    description: "Backend-as-a-Service with real-time sync",
    language: "TypeScript",
    languageIcon: "ts",
    serverless: true,
    recommended: ["typescript"],
    disabled: true,
    apiClientCompatibility: {
      recommended: ["convex-client"],
      incompatible: ["axios", "tanstack-query", "swr", "trpc"],
    },
  },
  {
    id: "cloudflare-workers",
    name: "Cloudflare Workers",
    icon: CloudflareIcon,
    color: "text-comic-orange",
    description: "Serverless execution environment at the edge",
    language: "JavaScript",
    languageIcon: "js",
    serverless: true,
    recommended: ["typescript"],
    recommendedFor: {
      databases: ["cloudflare-d1", "cloudflare-r2", "postgres", "mongodb"],
      reason: "Edge computing with global distribution and built-in KV/D1/R2 storage",
    },
    apiClientCompatibility: {
      recommended: ["hono-rpc", "trpc"],
      compatible: ["tanstack-query", "swr"],
      incompatible: ["axios"],
    },
  },
  {
    id: "none",
    name: "None",
    icon: null,
    color: "text-gray-500",
    description: "Frontend only, no backend",
  },
];

/**
 * Database system definitions with dependencies.
 * Includes SQL, NoSQL, and cloud database services.
 */
export const databases: StackOption[] = [
  {
    id: "postgres",
    name: "PostgreSQL",
    icon: SiPostgresql,
    color: "text-comic-blue",
    description: "The World's Most Advanced Open Source Relational Database",
    recommended: ["prisma", "drizzle"],
    deploymentOptions: {
      local: {
        name: "Local Development",
        description: "PostgreSQL running in Docker container for development",
        dockerCompose: true,
      },
      cloud: {
        name: "Managed Service",
        description: "Use a managed PostgreSQL service",
        providers: ["Neon", "Supabase", "AWS RDS", "Google Cloud SQL"],
      },
    },
  },
  {
    id: "mongodb",
    name: "MongoDB",
    icon: SiMongodb,
    color: "text-comic-green",
    description: "The most popular NoSQL database",
    recommended: ["prisma"],
    incompatible: ["drizzle"],
    deploymentOptions: {
      local: {
        name: "Local Development",
        description: "MongoDB running in Docker container for development",
        dockerCompose: true,
      },
      cloud: {
        name: "MongoDB Atlas",
        description: "Use MongoDB's cloud service",
        providers: ["MongoDB Atlas"],
      },
    },
  },
  {
    id: "mysql",
    name: "MySQL",
    icon: SiMysql,
    color: "text-comic-blue",
    description: "The world's most popular open source database",
    recommended: ["prisma", "drizzle"],
    deploymentOptions: {
      local: {
        name: "Local Development",
        description: "MySQL running in Docker container for development",
        dockerCompose: true,
      },
      cloud: {
        name: "Managed Service",
        description: "Use a managed MySQL service",
        providers: ["PlanetScale", "AWS RDS", "Google Cloud SQL"],
      },
    },
  },
  {
    id: "supabase",
    name: "Supabase",
    icon: SiSupabase,
    color: "text-comic-green",
    description: "The open source Firebase alternative",
    dependencies: ["postgres"],
    incompatible: ["prisma", "drizzle", "typeorm"],
    disabled: true,
    deploymentOptions: {
      local: {
        name: "Local Development",
        description: "Supabase local development with Docker and CLI",
        dockerCompose: true,
      },
      cloud: {
        name: "Supabase Cloud",
        description: "Fully managed Supabase hosting",
        providers: ["Supabase"],
      },
    },
  },
  {
    id: "firebase",
    name: "Firebase",
    icon: SiFirebase,
    color: "text-comic-orange",
    description: "Google's mobile and web app development platform",
    incompatible: ["prisma", "drizzle", "typeorm"], // Has its own SDK
    disabled: true,
  },
  {
    id: "cloudflare-d1",
    name: "Cloudflare D1",
    icon: CloudflareIcon,
    color: "text-comic-orange",
    description: "SQLite at the edge - serverless SQL database",
    recommended: ["drizzle"],
    recommendedFor: {
      backends: ["cloudflare-workers"],
      reason: "Native integration with Cloudflare Workers for edge computing",
    },
  },
  {
    id: "planetscale",
    name: "PlanetScale",
    icon: "planetscale",
    color: "text-comic-black",
    description: "Serverless MySQL platform with branching",
    recommended: ["prisma", "drizzle"],
    disabled: true,
    recommendedFor: {
      backends: ["cloudflare-workers"],
      reason: "Serverless MySQL with edge connections and branching",
    },
  },
  {
    id: "neon",
    name: "Neon",
    icon: "neon",
    color: "text-comic-green",
    description: "Serverless Postgres with branching and autoscaling",
    recommended: ["prisma", "drizzle"],
    disabled: true,
    recommendedFor: {
      backends: ["cloudflare-workers"],
      reason: "Serverless Postgres optimized for edge functions",
    },
  },
  {
    id: "turso",
    name: "Turso",
    icon: "turso",
    color: "text-comic-teal",
    description: "Edge-hosted distributed SQLite database",
    recommended: ["drizzle"],
    disabled: true,
    recommendedFor: {
      backends: ["cloudflare-workers"],
      reason: "SQLite at the edge with global replication",
    },
  },
  {
    id: "none",
    name: "None",
    icon: null,
    color: "text-gray-500",
    description: "No database",
  },
];

/**
 * ORM (Object-Relational Mapping) definitions with dependencies.
 * Provides database abstraction layers for different technologies.
 */
export const orms: StackOption[] = [
  {
    id: "prisma",
    name: "Prisma",
    icon: SiPrisma,
    color: "text-comic-purple",
    description: "Next-generation Node.js and TypeScript ORM",
    dependencies: ["node", "typescript"], // Prisma requires Node.js and works best with TypeScript
    incompatible: ["supabase", "firebase", "none"], // These have their own clients
  },
  {
    id: "drizzle",
    name: "Drizzle",
    icon: SiDrizzle,
    color: "text-comic-green",
    description: "TypeScript ORM that feels like writing SQL",
    dependencies: ["typescript"], // Drizzle is TypeScript-first
    incompatible: ["mongodb", "supabase", "firebase", "none"],
  },
  {
    id: "typeorm",
    name: "TypeORM",
    icon: "typeorm",
    color: "text-comic-orange",
    description: "ORM for TypeScript and JavaScript",
    dependencies: ["node"],
    incompatible: ["supabase", "firebase", "none"],
  },
  {
    id: "mongoose",
    name: "Mongoose",
    icon: SiMongodb,
    color: "text-comic-green",
    description: "Elegant MongoDB object modeling for Node.js",
    dependencies: ["node"],
    incompatible: ["postgres", "mysql", "supabase", "firebase", "none"],
  },
  {
    id: "none",
    name: "None",
    icon: null,
    color: "text-gray-500",
    description: "No ORM",
  },
];

/**
 * Styling solution definitions.
 * Includes CSS frameworks, preprocessors, and CSS-in-JS libraries.
 */
export const stylings: StackOption[] = [
  {
    id: "tailwind",
    name: "Tailwind CSS",
    icon: SiTailwindcss,
    color: "text-comic-blue",
    description: "A utility-first CSS framework",
    // Compatible with all frameworks except React Native (needs NativeWind)
    incompatible: ["react-native"],
    recommended: ["react", "vue", "next", "nuxt", "astro", "remix", "svelte", "solid"],
  },
  {
    id: "css",
    name: "CSS",
    icon: CssIcon,
    color: "text-comic-blue",
    description: "Plain CSS",
    // Compatible with all web frameworks
    incompatible: ["react-native"], // React Native uses StyleSheet
  },
  {
    id: "scss",
    name: "SCSS",
    icon: SassIcon,
    color: "text-comic-pink",
    description: "Sass CSS preprocessor",
    // Compatible with all web frameworks, excellent for Angular
    incompatible: ["react-native"], // React Native doesn't support CSS preprocessors
    recommended: ["angular", "vue", "nuxt", "svelte"],
  },
  {
    id: "styled-components",
    name: "Styled Components",
    icon: "styledcomponents",
    color: "text-comic-purple",
    description: "CSS-in-JS styling",
    dependencies: ["react"], // Styled Components requires React ecosystem
    // Only compatible with React-based frameworks and React Native
    incompatible: ["vue", "angular", "nuxt", "astro", "svelte", "solid", "vanilla"],
    recommended: ["react", "next", "remix", "react-native"],
  },
];

/**
 * JavaScript runtime environment definitions.
 * Different execution environments for JavaScript/TypeScript code.
 */
export const runtimes: StackOption[] = [
  {
    id: "node",
    name: "Node.js",
    icon: FaNodeJs,
    color: "text-comic-green",
    description: "JavaScript runtime built on Chrome's V8 JavaScript engine",
    recommended: ["typescript"],
    // Node.js supports all frameworks
  },
  {
    id: "bun",
    name: "Bun",
    icon: SiBun,
    color: "text-comic-yellow",
    description: "Fast all-in-one JavaScript runtime",
    recommended: ["typescript"],
    // Bun supports most frameworks with high Node.js compatibility
    incompatible: ["react-native"], // Mobile framework not applicable
  },
  {
    id: "deno",
    name: "Deno",
    icon: SiDeno,
    color: "text-comic-black",
    description: "Secure runtime for JavaScript and TypeScript with npm compatibility",
    recommended: ["typescript"],
    // Deno 2.0 has good framework support but some limitations
    incompatible: ["react-native", "angular", "vite", "tanstack-start"], // Limited or no support
    recommendedFor: {
      frameworks: ["react", "vue", "next", "nuxt", "astro", "remix", "solid", "svelte", "vanilla"],
      reason:
        "Deno 2.0 provides excellent npm compatibility and native TypeScript support for most modern frameworks",
    },
  },
];

/**
 * Authentication provider definitions.
 * Complete authentication solutions with various integration options.
 */
export const authProviders: StackOption[] = [
  {
    id: "auth.js",
    name: "Auth.js",
    icon: AuthJSIcon,
    color: "text-comic-purple",
    description: "Complete open-source authentication solution (formerly NextAuth.js)",
    dependencies: ["react"],
    recommended: ["next", "database"],
    beta: true,
    recommendedFor: {
      frameworks: ["next", "react"],
      backends: ["express", "node"],
      reason:
        "Officially maintained by the Next.js team and works seamlessly with React-based frameworks",
    },
  },
  {
    id: "better-auth",
    name: "Better Auth",
    icon: BetterAuthIcon,
    color: "text-comic-green",
    description: "Type-safe, framework-agnostic authentication library",
    recommended: ["typescript", "database"],
    recommendedFor: {
      frameworks: ["react", "next", "vue", "svelte", "remix"],
      backends: ["node", "express", "hono", "fastify"],
      reason: "Framework-agnostic with excellent TypeScript support",
    },
  },
  {
    id: "passport",
    name: "Passport.js",
    icon: PassportIcon,
    color: "text-comic-blue",
    description: "Simple, unobtrusive authentication middleware for Node.js",
    dependencies: ["node"],
    recommended: ["express", "typescript"],
    recommendedFor: {
      backends: ["express", "node"],
      reason: "The de facto standard for Node.js authentication middleware",
    },
    disabled: true,
  },
  {
    id: "clerk",
    name: "Clerk",
    icon: ClerkIcon,
    color: "text-comic-purple",
    description: "Complete user management platform with built-in auth",
    dependencies: ["react"],
    recommended: ["next", "typescript"],
    recommendedFor: {
      frameworks: ["next", "react", "remix"],
      reason: "Provides complete user management with excellent React integration",
    },
    disabled: true,
  },
  {
    id: "auth0",
    name: "Auth0",
    icon: SiAuth0,
    color: "text-comic-orange",
    description: "Universal authentication & authorization platform",
    recommended: ["typescript"],
    disabled: true,
  },
  {
    id: "supabase-auth",
    name: "Supabase Auth",
    icon: SiSupabase,
    color: "text-comic-green",
    description: "Built-in authentication with Supabase",
    dependencies: ["supabase"],
    recommended: ["typescript"],
  },
  {
    id: "firebase-auth",
    name: "Firebase Auth",
    icon: SiFirebase,
    color: "text-comic-orange",
    description: "Firebase Authentication service",
    dependencies: ["firebase"],
    recommended: ["typescript"],
  },
  {
    id: "lucia",
    name: "Lucia",
    icon: LuciaIcon,
    color: "text-comic-yellow",
    description: "Modern authentication library with edge support",
    recommended: ["typescript", "database"],
    recommendedFor: {
      frameworks: ["react", "next", "vue", "svelte", "solid", "astro"],
      backends: ["node", "express", "hono", "cloudflare-workers"],
      databases: ["cloudflare-d1", "postgres", "mysql"],
      reason: "Type-safe authentication with D1 adapter and edge runtime support",
    },
    disabled: true,
  },
  {
    id: "none",
    name: "None",
    icon: null,
    color: "text-gray-500",
    description: "No authentication",
  },
];

export const additionalOptions: StackOption[] = [
  {
    id: "typescript",
    name: "TypeScript",
    icon: SiTypescript,
    color: "text-comic-blue",
    description: "TypeScript is JavaScript with syntax for types",
  },
  {
    id: "git",
    name: "Git",
    icon: FaGitAlt,
    color: "text-comic-orange",
    description: "Version control system",
  },
  {
    id: "docker",
    name: "Docker",
    icon: FaDocker,
    color: "text-comic-blue",
    description: "Containerization platform",
  },
];

/**
 * Validates a project configuration for compatibility and dependencies.
 * @param config The project configuration to validate
 * @returns Object containing validation status and any error messages
 */
export function validateConfiguration(config: {
  framework: string;
  backend: string;
  database: string;
  orm: string;
  styling: string;
  typescript: boolean;
  git: boolean;
  docker: boolean;
}): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  const framework = frameworks.find((f) => f.id === config.framework);
  if (framework?.dependencies) {
    for (const dep of framework.dependencies) {
      if (dep === "typescript" && !config.typescript) {
        errors.push(`${framework.name} requires TypeScript`);
      }
    }
  }

  const backend = backends.find((b) => b.id === config.backend);
  if (backend?.dependencies) {
    for (const dep of backend.dependencies) {
      if (dep === "node" && config.backend !== "node") {
        config.backend = "node";
      }
    }
  }
  if (backend?.incompatible?.includes("typescript") && config.typescript) {
    errors.push(`${backend.name} is incompatible with TypeScript`);
  }

  const database = databases.find((d) => d.id === config.database);
  if (database?.incompatible?.includes(config.orm) && config.orm !== "none") {
    errors.push(`${database.name} is incompatible with ${config.orm}`);
  }

  const orm = orms.find((o) => o.id === config.orm);
  if (orm?.dependencies) {
    for (const dep of orm.dependencies) {
      if (dep === "typescript" && !config.typescript) {
        errors.push(`${orm.name} requires TypeScript`);
      }
      if (dep === "node" && config.backend === "none") {
        errors.push(`${orm.name} requires a Node.js backend`);
      }
    }
  }
  if (orm?.incompatible?.includes(config.database)) {
    errors.push(`${orm.name} is incompatible with ${config.database}`);
  }

  const styling = stylings.find((s) => s.id === config.styling);
  if (
    styling?.dependencies?.includes("react") &&
    !["react", "next", "remix"].includes(config.framework)
  ) {
    errors.push(`${styling.name} requires React`);
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Generates technology recommendations based on current stack selections.
 * @param config Partial project configuration
 * @returns Object containing recommended technologies for each category
 */
export function getRecommendations(
  config: Partial<{
    framework: string;
    backend: string;
    database: string;
    orm: string;
    styling: string;
  }>
): {
  typescript?: boolean;
  backend?: string[];
  database?: string[];
  orm?: string[];
  styling?: string[];
} {
  const recommendations: {
    typescript?: boolean;
    backend?: string[];
    database?: string[];
    orm?: string[];
    styling?: string[];
  } = {};

  const framework = frameworks.find((f) => f.id === config.framework);
  if (framework?.recommended) {
    if (framework.recommended.includes("typescript")) {
      recommendations.typescript = true;
    }
    recommendations.styling = framework.recommended.filter((r) => stylings.some((s) => s.id === r));
  }

  const backend = backends.find((b) => b.id === config.backend);
  if (backend?.recommended) {
    recommendations.database = backend.recommended.filter((r) => databases.some((d) => d.id === r));
  }

  const database = databases.find((d) => d.id === config.database);
  if (database?.recommended) {
    recommendations.orm = database.recommended.filter((r) => orms.some((o) => o.id === r));
  }

  return recommendations;
}

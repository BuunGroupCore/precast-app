import { IconType } from "react-icons";
import { BiSolidBoltCircle, BiSolidData, BiSolidCloud, BiSolidKey } from "react-icons/bi";
import {
  FaReact,
  FaVuejs,
  FaAngular,
  FaNodeJs,
  FaDocker,
  FaGitAlt,
  FaUserShield,
} from "react-icons/fa";
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
  SiRemix,
  SiSolid,
  SiSvelte,
  SiNuxtdotjs,
  SiDrizzle,
  SiFastify,
  SiBun,
  SiCloudflare,
  SiDeno,
  SiVercel,
  SiAuth0,
} from "react-icons/si";

import { BetterAuthIcon } from "../components/icons/BetterAuthIcon";
import { ClerkIcon } from "../components/icons/ClerkIcon";
import { CssIcon } from "../components/icons/CssIcon";
import { LuciaIcon } from "../components/icons/LuciaIcon";
import { PassportIcon } from "../components/icons/PassportIcon";
import { SassIcon } from "../components/icons/SassIcon";

export interface StackOption {
  id: string;
  name: string;
  icon: IconType | React.FC<{ className?: string }> | null;
  color: string;
  description?: string;
  dependencies?: string[];
  incompatible?: string[];
  recommended?: string[];
}

export interface StackCategory {
  id: string;
  name: string;
  options: StackOption[];
}

// Framework definitions with dependencies
export const frameworks: StackOption[] = [
  {
    id: "react",
    name: "React",
    icon: FaReact,
    color: "text-comic-blue",
    description: "A JavaScript library for building user interfaces",
    recommended: ["typescript", "tailwind"],
  },
  {
    id: "vue",
    name: "Vue",
    icon: FaVuejs,
    color: "text-comic-green",
    description: "The Progressive JavaScript Framework",
    recommended: ["typescript", "tailwind"],
  },
  {
    id: "angular",
    name: "Angular",
    icon: FaAngular,
    color: "text-comic-red",
    description: "Platform for building mobile and desktop web applications",
    dependencies: ["typescript"], // Angular requires TypeScript
    recommended: ["scss"],
  },
  {
    id: "next",
    name: "Next.js",
    icon: SiNextdotjs,
    color: "text-comic-black",
    description: "The React Framework for Production",
    dependencies: ["react"], // Next.js is built on React
    recommended: ["typescript", "tailwind", "prisma"],
  },
  {
    id: "nuxt",
    name: "Nuxt",
    icon: SiNuxtdotjs,
    color: "text-comic-green",
    description: "The Intuitive Vue Framework",
    dependencies: ["vue"], // Nuxt is built on Vue
    recommended: ["typescript", "tailwind"],
  },
  {
    id: "astro",
    name: "Astro",
    icon: SiAstro,
    color: "text-comic-orange",
    description: "Build faster websites with Astro's next-gen island architecture",
    recommended: ["typescript", "tailwind"],
  },
  {
    id: "vite",
    name: "Vite",
    icon: SiVite,
    color: "text-comic-purple",
    description: "Next Generation Frontend Tooling",
    recommended: ["typescript"],
  },
  {
    id: "remix",
    name: "Remix",
    icon: SiRemix,
    color: "text-comic-black",
    description: "Build better websites with Remix",
    dependencies: ["react"],
    recommended: ["typescript", "tailwind", "prisma"],
  },
  {
    id: "solid",
    name: "Solid",
    icon: SiSolid,
    color: "text-comic-blue",
    description: "Simple and performant reactivity for building user interfaces",
    recommended: ["typescript", "tailwind"],
  },
  {
    id: "svelte",
    name: "Svelte",
    icon: SiSvelte,
    color: "text-comic-orange",
    description: "Cybernetically enhanced web apps",
    recommended: ["typescript", "tailwind"],
  },
  {
    id: "vanilla",
    name: "Vanilla",
    icon: SiJavascript,
    color: "text-comic-yellow",
    description: "Plain JavaScript, no framework",
  },
];

// Backend definitions with dependencies
export const backends: StackOption[] = [
  {
    id: "node",
    name: "Node.js",
    icon: FaNodeJs,
    color: "text-comic-green",
    description: "JavaScript runtime built on Chrome's V8 JavaScript engine",
    recommended: ["typescript", "express"],
  },
  {
    id: "express",
    name: "Express",
    icon: SiExpress,
    color: "text-comic-black",
    description: "Fast, unopinionated, minimalist web framework for Node.js",
    dependencies: ["node"], // Express requires Node.js
    recommended: ["typescript"],
  },
  {
    id: "fastapi",
    name: "FastAPI",
    icon: SiFastapi,
    color: "text-comic-green",
    description: "Modern, fast web framework for building APIs with Python",
    incompatible: ["typescript"], // Python backend incompatible with TypeScript
    recommended: ["postgres", "mysql"],
  },
  {
    id: "hono",
    name: "Hono",
    icon: BiSolidBoltCircle,
    color: "text-comic-orange",
    description: "Ultrafast web framework for the Edges",
    dependencies: ["node"],
    recommended: ["typescript"],
  },
  {
    id: "nextjs",
    name: "Next.js API",
    icon: SiNextdotjs,
    color: "text-comic-black",
    description: "Full-stack React framework with API routes",
    dependencies: ["react"],
    recommended: ["typescript", "prisma"],
  },
  {
    id: "elysia",
    name: "Elysia",
    icon: BiSolidBoltCircle,
    color: "text-comic-blue",
    description: "Fast and friendly Bun web framework",
    dependencies: ["node"],
    recommended: ["typescript"],
  },
  {
    id: "fastify",
    name: "Fastify",
    icon: SiFastify,
    color: "text-comic-black",
    description: "Fast and low overhead web framework for Node.js",
    dependencies: ["node"],
    recommended: ["typescript"],
  },
  {
    id: "convex",
    name: "Convex",
    icon: BiSolidData,
    color: "text-comic-orange",
    description: "Backend-as-a-Service with real-time sync",
    recommended: ["typescript"],
  },
  {
    id: "none",
    name: "None",
    icon: null,
    color: "text-gray-500",
    description: "Frontend only, no backend",
  },
];

// Database definitions with dependencies
export const databases: StackOption[] = [
  {
    id: "postgres",
    name: "PostgreSQL",
    icon: SiPostgresql,
    color: "text-comic-blue",
    description: "The World's Most Advanced Open Source Relational Database",
    recommended: ["prisma", "drizzle"],
  },
  {
    id: "mongodb",
    name: "MongoDB",
    icon: SiMongodb,
    color: "text-comic-green",
    description: "The most popular NoSQL database",
    recommended: ["prisma"],
    incompatible: ["drizzle"], // Drizzle doesn't support MongoDB
  },
  {
    id: "mysql",
    name: "MySQL",
    icon: SiMysql,
    color: "text-comic-blue",
    description: "The world's most popular open source database",
    recommended: ["prisma", "drizzle"],
  },
  {
    id: "supabase",
    name: "Supabase",
    icon: SiSupabase,
    color: "text-comic-green",
    description: "The open source Firebase alternative",
    dependencies: ["postgres"], // Supabase is built on PostgreSQL
    incompatible: ["prisma", "drizzle", "typeorm"], // Has its own client
  },
  {
    id: "firebase",
    name: "Firebase",
    icon: SiFirebase,
    color: "text-comic-orange",
    description: "Google's mobile and web app development platform",
    incompatible: ["prisma", "drizzle", "typeorm"], // Has its own SDK
  },
  {
    id: "none",
    name: "None",
    icon: null,
    color: "text-gray-500",
    description: "No database",
  },
];

// ORM definitions with dependencies
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
    icon: BiSolidData,
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

// Styling definitions
export const stylings: StackOption[] = [
  {
    id: "tailwind",
    name: "Tailwind CSS",
    icon: SiTailwindcss,
    color: "text-comic-blue",
    description: "A utility-first CSS framework",
  },
  {
    id: "css",
    name: "CSS",
    icon: CssIcon as any,
    color: "text-comic-blue",
    description: "Plain CSS",
  },
  {
    id: "scss",
    name: "SCSS",
    icon: SassIcon as any,
    color: "text-comic-pink",
    description: "Sass CSS preprocessor",
  },
  {
    id: "styled-components",
    name: "Styled Components",
    icon: null,
    color: "text-comic-purple",
    description: "CSS-in-JS styling",
    dependencies: ["react"], // Styled Components is React-specific
  },
];

// Runtime definitions
export const runtimes: StackOption[] = [
  {
    id: "node",
    name: "Node.js",
    icon: FaNodeJs,
    color: "text-comic-green",
    description: "JavaScript runtime built on Chrome's V8 JavaScript engine",
    recommended: ["typescript"],
  },
  {
    id: "bun",
    name: "Bun",
    icon: SiBun,
    color: "text-comic-yellow",
    description: "Fast all-in-one JavaScript runtime",
    recommended: ["typescript"],
  },
  {
    id: "deno",
    name: "Deno",
    icon: SiDeno,
    color: "text-comic-black",
    description: "Secure runtime for JavaScript and TypeScript",
    recommended: ["typescript"],
  },
  {
    id: "cloudflare-workers",
    name: "Cloudflare Workers",
    icon: SiCloudflare,
    color: "text-comic-orange",
    description: "Serverless execution environment",
    recommended: ["typescript"],
  },
  {
    id: "vercel-edge",
    name: "Vercel Edge Runtime",
    icon: SiVercel,
    color: "text-comic-black",
    description: "Edge runtime for serverless functions",
    recommended: ["typescript"],
  },
  {
    id: "aws-lambda",
    name: "AWS Lambda",
    icon: BiSolidCloud,
    color: "text-comic-orange",
    description: "Serverless compute service",
    recommended: ["typescript"],
  },
];

// Authentication providers
export const authProviders: StackOption[] = [
  {
    id: "auth.js",
    name: "Auth.js",
    icon: FaUserShield,
    color: "text-comic-purple",
    description: "Complete open-source authentication solution (formerly NextAuth.js)",
    dependencies: ["react"],
    recommended: ["next", "database"],
  },
  {
    id: "better-auth",
    name: "Better Auth",
    icon: BetterAuthIcon as any,
    color: "text-comic-green",
    description: "Type-safe, framework-agnostic authentication library",
    recommended: ["typescript", "database"],
  },
  {
    id: "passport",
    name: "Passport.js",
    icon: PassportIcon as any,
    color: "text-comic-blue",
    description: "Simple, unobtrusive authentication middleware for Node.js",
    dependencies: ["node"],
    recommended: ["express", "typescript"],
  },
  {
    id: "clerk",
    name: "Clerk",
    icon: ClerkIcon as any,
    color: "text-comic-purple",
    description: "Complete user management platform with built-in auth",
    dependencies: ["react"],
    recommended: ["next", "typescript"],
  },
  {
    id: "auth0",
    name: "Auth0",
    icon: SiAuth0,
    color: "text-comic-orange",
    description: "Universal authentication & authorization platform",
    recommended: ["typescript"],
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
    icon: LuciaIcon as any,
    color: "text-comic-yellow",
    description: "Simple and flexible authentication library",
    recommended: ["typescript", "database"],
  },
  {
    id: "iron-session",
    name: "Iron Session",
    icon: BiSolidKey,
    color: "text-comic-red",
    description: "Stateless session utility using signed and encrypted cookies",
    dependencies: ["node"],
    recommended: ["next", "typescript"],
  },
  {
    id: "none",
    name: "None",
    icon: null,
    color: "text-gray-500",
    description: "No authentication",
  },
];

// Additional options
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

// Validation function to check if a configuration is valid
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

  // Check framework dependencies
  const framework = frameworks.find((f) => f.id === config.framework);
  if (framework?.dependencies) {
    for (const dep of framework.dependencies) {
      if (dep === "typescript" && !config.typescript) {
        errors.push(`${framework.name} requires TypeScript`);
      }
    }
  }

  // Check backend dependencies and incompatibilities
  const backend = backends.find((b) => b.id === config.backend);
  if (backend?.dependencies) {
    for (const dep of backend.dependencies) {
      if (dep === "node" && config.backend !== "node") {
        // Express, Hono require Node.js
        config.backend = "node"; // Auto-fix
      }
    }
  }
  if (backend?.incompatible?.includes("typescript") && config.typescript) {
    errors.push(`${backend.name} is incompatible with TypeScript`);
  }

  // Check database dependencies and incompatibilities
  const database = databases.find((d) => d.id === config.database);
  if (database?.incompatible?.includes(config.orm) && config.orm !== "none") {
    errors.push(`${database.name} is incompatible with ${config.orm}`);
  }

  // Check ORM dependencies and incompatibilities
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

  // Check styling dependencies
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

// Get recommendations based on current selection
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
  const recommendations: any = {};

  // Get framework recommendations
  const framework = frameworks.find((f) => f.id === config.framework);
  if (framework?.recommended) {
    if (framework.recommended.includes("typescript")) {
      recommendations.typescript = true;
    }
    recommendations.styling = framework.recommended.filter((r) => stylings.some((s) => s.id === r));
  }

  // Get backend recommendations
  const backend = backends.find((b) => b.id === config.backend);
  if (backend?.recommended) {
    recommendations.database = backend.recommended.filter((r) => databases.some((d) => d.id === r));
  }

  // Get database recommendations
  const database = databases.find((d) => d.id === config.database);
  if (database?.recommended) {
    recommendations.orm = database.recommended.filter((r) => orms.some((o) => o.id === r));
  }

  return recommendations;
}

import { IconType } from "react-icons";
import { FaReact, FaVuejs, FaAngular } from "react-icons/fa";
import {
  SiNextdotjs,
  SiNuxtdotjs,
  SiBun,
  SiRemix,
  SiAstro,
  SiSvelte,
  SiSupabase,
  SiFastapi,
} from "react-icons/si";

/**
 * Pre-configured technology stack definition
 */
export interface PreferredStack {
  id: string;
  name: string;
  description: string;
  icon?: IconType;
  color: string;
  config: {
    framework: string;
    backend: string;
    database: string;
    orm?: string;
    styling?: string;
    runtime?: string;
    auth?: string;
    typescript?: boolean;
  };
}

/**
 * Pre-configured technology stacks for quick project setup.
 * Each stack represents a complete combination of framework, backend, database, and tooling.
 */
export const preferredStacks: PreferredStack[] = [
  {
    id: "mern",
    name: "MERN Stack",
    description: "MongoDB, Express, React, Node.js",
    icon: FaReact,
    color: "text-comic-blue",
    config: {
      framework: "react",
      backend: "express",
      database: "mongodb",
      orm: "none",
      styling: "tailwind",
      runtime: "node",
      auth: "passport",
      typescript: false,
    },
  },
  {
    id: "mean",
    name: "MEAN Stack",
    description: "MongoDB, Express, Angular, Node.js",
    icon: FaAngular,
    color: "text-comic-red",
    config: {
      framework: "angular",
      backend: "express",
      database: "mongodb",
      orm: "none",
      styling: "scss",
      runtime: "node",
      auth: "passport",
      typescript: true,
    },
  },
  {
    id: "mevn",
    name: "MEVN Stack",
    description: "MongoDB, Express, Vue, Node.js",
    icon: FaVuejs,
    color: "text-comic-green",
    config: {
      framework: "vue",
      backend: "express",
      database: "mongodb",
      orm: "none",
      styling: "tailwind",
      runtime: "node",
      auth: "passport",
      typescript: false,
    },
  },
  {
    id: "t3",
    name: "T3 Stack",
    description: "Next.js, TypeScript, Tailwind, tRPC, Prisma",
    icon: SiNextdotjs,
    color: "text-comic-black",
    config: {
      framework: "next",
      backend: "nextjs",
      database: "postgres",
      orm: "prisma",
      styling: "tailwind",
      runtime: "node",
      auth: "auth.js",
      typescript: true,
    },
  },
  {
    id: "modern-bun",
    name: "Modern Bun Stack",
    description: "Next.js, Bun, Prisma, PostgreSQL",
    icon: SiBun,
    color: "text-comic-yellow",
    config: {
      framework: "next",
      backend: "hono",
      database: "postgres",
      orm: "prisma",
      styling: "tailwind",
      runtime: "bun",
      auth: "better-auth",
      typescript: true,
    },
  },
  {
    id: "remix-stack",
    name: "Remix Full Stack",
    description: "Remix, Prisma, PostgreSQL, Tailwind",
    icon: SiRemix,
    color: "text-comic-black",
    config: {
      framework: "remix",
      backend: "node",
      database: "postgres",
      orm: "prisma",
      styling: "tailwind",
      runtime: "node",
      auth: "auth.js",
      typescript: true,
    },
  },
  {
    id: "nuxt-full",
    name: "Nuxt Full Stack",
    description: "Nuxt 3, Nitro, PostgreSQL, Prisma",
    icon: SiNuxtdotjs,
    color: "text-comic-green",
    config: {
      framework: "nuxt",
      backend: "node",
      database: "postgres",
      orm: "prisma",
      styling: "tailwind",
      runtime: "node",
      auth: "auth.js",
      typescript: true,
    },
  },
  {
    id: "astro-ssg",
    name: "Astro Static Site",
    description: "Astro, Tailwind, TypeScript",
    icon: SiAstro,
    color: "text-comic-orange",
    config: {
      framework: "astro",
      backend: "none",
      database: "none",
      orm: "none",
      styling: "tailwind",
      runtime: "node",
      auth: "none",
      typescript: true,
    },
  },
  {
    id: "sveltekit-full",
    name: "SvelteKit Stack",
    description: "SvelteKit, Prisma, PostgreSQL",
    icon: SiSvelte,
    color: "text-comic-orange",
    config: {
      framework: "svelte",
      backend: "node",
      database: "postgres",
      orm: "prisma",
      styling: "tailwind",
      runtime: "node",
      auth: "lucia",
      typescript: true,
    },
  },
  {
    id: "supabase-stack",
    name: "Supabase Stack",
    description: "Next.js, Supabase, TypeScript",
    icon: SiSupabase,
    color: "text-comic-green",
    config: {
      framework: "next",
      backend: "nextjs",
      database: "supabase",
      orm: "none",
      styling: "tailwind",
      runtime: "node",
      auth: "supabase-auth",
      typescript: true,
    },
  },
  {
    id: "fastapi-react",
    name: "FastAPI + React",
    description: "React, FastAPI, PostgreSQL, SQLAlchemy",
    icon: SiFastapi,
    color: "text-comic-green",
    config: {
      framework: "react",
      backend: "fastapi",
      database: "postgres",
      orm: "none",
      styling: "tailwind",
      runtime: "node",
      auth: "none",
      typescript: false,
    },
  },
  {
    id: "jamstack",
    name: "JAMstack",
    description: "JavaScript, APIs, Markup - Static Site",
    icon: FaReact,
    color: "text-comic-purple",
    config: {
      framework: "react",
      backend: "none",
      database: "none",
      orm: "none",
      styling: "tailwind",
      runtime: "node",
      auth: "none",
      typescript: true,
    },
  },
];

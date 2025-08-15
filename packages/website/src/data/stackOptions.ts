// This file is auto-generated from the shared stack-config.ts
// To update this file, run: bun run sync:stack-config

export interface StackOption {
  id: string;
  name: string;
  description?: string;
  dependencies?: string[];
  incompatible?: string[];
  recommended?: string[];
  disabled?: boolean; // Hide from web builder and CLI until fully tested
}

export const frameworkDefs: StackOption[] = [
  // SPA Frameworks
  {
    id: "react",
    name: "React",
    description: "A JavaScript library for building user interfaces",
    recommended: ["typescript", "tailwind"],
  },
  {
    id: "vue",
    name: "Vue",
    description: "The Progressive JavaScript Framework",
    recommended: ["typescript", "tailwind"],
  },
  {
    id: "angular",
    name: "Angular",
    description: "Platform for building mobile and desktop web applications",
    dependencies: ["typescript"],
    recommended: ["scss"],
    disabled: true,
  },
  {
    id: "solid",
    name: "Solid",
    description: "Simple and performant reactivity for building user interfaces",
    recommended: ["typescript", "tailwind"],
    disabled: true,
  },
  {
    id: "svelte",
    name: "Svelte",
    description: "Cybernetically enhanced web apps",
    recommended: ["typescript", "tailwind"],
  },
  {
    id: "tanstack-router",
    name: "TanStack Router",
    description: "Type-safe React router with built-in caching and data fetching",
    dependencies: ["react"],
    recommended: ["typescript", "tailwind"],
  },
  // Full-Stack Frameworks
  {
    id: "next",
    name: "Next.js",
    description: "The React Framework for Production",
    dependencies: ["react"],
    recommended: ["typescript", "tailwind", "prisma"],
  },
  {
    id: "react-router",
    name: "React Router v7",
    description: "Full-stack React framework with modern data loading",
    dependencies: ["react"],
    recommended: ["typescript", "tailwind", "prisma"],
  },
  {
    id: "tanstack-start",
    name: "TanStack Start",
    description: "Full-stack React framework powered by TanStack Router",
    dependencies: ["react"],
    recommended: ["typescript", "tailwind"],
  },
  {
    id: "nuxt",
    name: "Nuxt",
    description: "The Intuitive Vue Framework",
    dependencies: ["vue"],
    recommended: ["typescript", "tailwind"],
    disabled: true,
  },
  {
    id: "astro",
    name: "Astro",
    description: "Build faster websites with Astro's next-gen island architecture",
    recommended: ["typescript", "tailwind"],
    disabled: true, // Disabled for future support
  },
  // Other
  {
    id: "vanilla",
    name: "Vanilla",
    description: "Plain JavaScript, no framework",
    disabled: true, // Disabled for future support
  },
  {
    id: "react-native",
    name: "React Native",
    description: "Build native mobile apps using React",
    dependencies: ["react"],
    recommended: ["typescript"],
  },
  {
    id: "vite",
    name: "Vite",
    description: "Next Generation Frontend Tooling",
    recommended: ["typescript"],
  },
  {
    id: "none",
    name: "None",
    description: "No frontend framework - backend only or custom setup",
  },
];

export const backendDefs: StackOption[] = [
  {
    id: "node",
    name: "Node.js",
    description: "JavaScript runtime with Express.js framework",
    recommended: ["typescript"],
  },
  {
    id: "express",
    name: "Express",
    description: "Fast, unopinionated, minimalist web framework for Node.js",
    recommended: ["typescript"],
  },
  {
    id: "fastify",
    name: "Fastify",
    description: "Fast and low overhead web framework for Node.js",
    recommended: ["typescript"],
    disabled: true,
  },
  {
    id: "hono",
    name: "Hono",
    description: "Ultrafast web framework for the Edges",
    recommended: ["typescript"],
  },
  {
    id: "nestjs",
    name: "NestJS",
    description: "Progressive Node.js framework for building scalable server-side applications",
    recommended: ["typescript"],
    dependencies: ["typescript"],
  },
  {
    id: "koa",
    name: "Koa",
    description: "Modern, lightweight web framework created by the Express team",
    recommended: ["typescript"],
  },
  {
    id: "next-api",
    name: "Next.js API Routes",
    description: "API routes with Next.js",
    dependencies: ["next"],
    recommended: ["typescript"],
  },
  {
    id: "cloudflare-workers",
    name: "Cloudflare Workers",
    description: "Edge-first serverless functions with global deployment",
    recommended: ["typescript", "cloudflare-d1", "drizzle"],
  },
  {
    id: "fastapi",
    name: "FastAPI",
    description: "Modern, fast web framework for building APIs with Python",
    dependencies: ["python"],
    recommended: ["postgres", "mysql"],
    incompatible: ["typescript"],
  },
  {
    id: "convex",
    name: "Convex",
    description: "Backend-as-a-Service with real-time sync",
    dependencies: ["typescript"],
    recommended: ["typescript"],
    incompatible: ["database", "orm"],
    disabled: true,
  },
  {
    id: "none",
    name: "None",
    description: "Frontend only, no backend",
  },
];

export const databaseDefs: StackOption[] = [
  {
    id: "postgres",
    name: "PostgreSQL",
    description: "The World's Most Advanced Open Source Relational Database",
    recommended: ["prisma", "drizzle"],
  },
  {
    id: "mongodb",
    name: "MongoDB",
    description: "The most popular NoSQL database",
    recommended: ["prisma"],
    incompatible: ["drizzle"],
  },
  {
    id: "mysql",
    name: "MySQL",
    description: "The world's most popular open source database",
    recommended: ["prisma", "drizzle"],
  },
  {
    id: "supabase",
    name: "Supabase",
    description: "The open source Firebase alternative",
    dependencies: ["postgres"],
    incompatible: ["prisma", "drizzle", "typeorm"],
    disabled: true,
  },
  {
    id: "firebase",
    name: "Firebase",
    description: "Google's mobile and web app development platform",
    incompatible: ["prisma", "drizzle", "typeorm"],
    disabled: true,
  },
  {
    id: "neon",
    name: "Neon",
    description: "Serverless Postgres with branching and autoscaling",
    recommended: ["prisma", "drizzle"],
    disabled: true,
  },
  {
    id: "turso",
    name: "Turso",
    description: "Edge-hosted distributed SQLite database",
    recommended: ["drizzle"],
    disabled: true,
  },
  {
    id: "planetscale",
    name: "PlanetScale",
    description: "Serverless MySQL platform with branching",
    recommended: ["prisma", "drizzle"],
    disabled: true,
  },
  {
    id: "cloudflare-d1",
    name: "Cloudflare D1",
    description: "Serverless SQLite database at the edge",
    recommended: ["drizzle"],
    incompatible: ["prisma", "typeorm", "mongoose"],
  },
  {
    id: "duckdb",
    name: "DuckDB",
    description: "In-process analytical database for static sites and data apps",
    recommended: ["typescript"],
    incompatible: ["mongoose"], // MongoDB ORM incompatible with SQL
  },
  {
    id: "none",
    name: "None",
    description: "No database",
  },
];

export const ormDefs: StackOption[] = [
  {
    id: "prisma",
    name: "Prisma",
    description: "Next-generation Node.js and TypeScript ORM",
    dependencies: ["node", "typescript"],
    incompatible: ["supabase", "firebase", "cloudflare-d1", "none"],
  },
  {
    id: "drizzle",
    name: "Drizzle",
    description: "TypeScript ORM that feels like writing SQL",
    dependencies: ["typescript"],
    incompatible: ["mongodb", "supabase", "firebase", "none"],
  },
  {
    id: "typeorm",
    name: "TypeORM",
    description: "ORM for TypeScript and JavaScript",
    dependencies: ["node"],
    incompatible: ["supabase", "firebase", "cloudflare-d1", "none"],
  },
  {
    id: "mongoose",
    name: "Mongoose",
    description: "Elegant MongoDB object modeling for Node.js",
    dependencies: ["node"],
    incompatible: [
      "postgres",
      "mysql",
      "supabase",
      "firebase",
      "cloudflare-d1",
      "duckdb",
      "turso",
      "neon",
      "planetscale",
      "none",
    ],
  },
  {
    id: "none",
    name: "None",
    description: "No ORM",
  },
];

export const stylingDefs: StackOption[] = [
  {
    id: "tailwind",
    name: "Tailwind CSS",
    description: "A utility-first CSS framework",
  },
  {
    id: "css",
    name: "CSS",
    description: "Plain CSS",
  },
  {
    id: "scss",
    name: "SCSS",
    description: "Sass CSS preprocessor",
  },
  {
    id: "styled-components",
    name: "Styled Components",
    description: "CSS-in-JS styling",
    dependencies: ["react"],
  },
];

export const runtimeDefs: StackOption[] = [
  {
    id: "node",
    name: "Node.js",
    description: "JavaScript runtime built on Chrome's V8 JavaScript engine",
    recommended: ["typescript"],
  },
  {
    id: "bun",
    name: "Bun",
    description: "Fast all-in-one JavaScript runtime",
    recommended: ["typescript"],
  },
  {
    id: "deno",
    name: "Deno",
    description: "Secure runtime for JavaScript and TypeScript",
    recommended: ["typescript"],
  },
];

// Validation function

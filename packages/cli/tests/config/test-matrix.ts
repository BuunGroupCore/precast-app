export interface TestCombination {
  name: string;
  framework: string;
  backend: string;
  database: string;
  orm: string;
  styling: string;
  runtime: string;
  typescript: boolean;
  category: "critical" | "common" | "edge" | "experimental";
  expectedDuration: number;
  // Optional fields for extended tests
  docker?: boolean;
  authProvider?: string;
  uiLibrary?: string;
  aiAssistant?: string;
  plugins?: string[];
  powerups?: string[];
  deployment?: string;
  includeRedis?: boolean;
  includeAdminTools?: boolean;
  securePasswords?: boolean;
  autoDeploy?: boolean;
  [key: string]: any; // Allow additional properties for flexibility
}

export const TEST_MATRIX: Record<string, TestCombination[]> = {
  critical: [
    {
      name: "react-express-postgres",
      framework: "react",
      backend: "express",
      database: "postgres",
      orm: "prisma",
      styling: "tailwind",
      runtime: "node",
      typescript: true,
      category: "critical",
      expectedDuration: 8000,
    },
    {
      name: "next-frontend-only",
      framework: "next",
      backend: "none",
      database: "none",
      orm: "none",
      styling: "tailwind",
      runtime: "node",
      typescript: true,
      category: "critical",
      expectedDuration: 6000,
    },
    {
      name: "vue-fastify-mysql",
      framework: "vue",
      backend: "fastify",
      database: "mysql",
      orm: "prisma",
      styling: "css",
      runtime: "node",
      typescript: true,
      category: "critical",
      expectedDuration: 8000,
    },
  ],
  common: [
    {
      name: "react-frontend-only",
      framework: "react",
      backend: "none",
      database: "none",
      orm: "none",
      styling: "tailwind",
      runtime: "node",
      typescript: true,
      category: "common",
      expectedDuration: 5000,
    },
    {
      name: "next-fullstack",
      framework: "next",
      backend: "next-api",
      database: "postgres",
      orm: "prisma",
      styling: "tailwind",
      runtime: "node",
      typescript: true,
      category: "common",
      expectedDuration: 10000,
    },
  ],
  edge: [
    {
      name: "vanilla-minimal",
      framework: "vanilla",
      backend: "none",
      database: "none",
      orm: "none",
      styling: "css",
      runtime: "node",
      typescript: false,
      category: "edge",
      expectedDuration: 3000,
    },
    {
      name: "svelte-hono-sqlite",
      framework: "svelte",
      backend: "hono",
      database: "sqlite",
      orm: "drizzle",
      styling: "tailwind",
      runtime: "node",
      typescript: true,
      category: "edge",
      expectedDuration: 7000,
    },
  ],
};

export interface StackOption {
  id: string;
  name: string;
  description?: string;
  dependencies?: string[];
  incompatible?: string[];
  recommended?: string[];
}

export interface ProjectConfig {
  name: string;
  framework: string;
  backend: string;
  database: string;
  orm: string;
  styling: string;
  typescript: boolean;
  git: boolean;
  docker: boolean;
  uiLibrary?: string;
  aiContext?: string[];
  packageManager: string;
  projectPath: string;
  language: string;
  aiAssistance?: string[];
  addons?: string[];
  deploymentMethod?: string;
  autoInstall?: boolean;
  runtime?: string;
  authProvider?: string;
}

// Stack definitions without React Icons (for CLI usage)
export const frameworkDefs: StackOption[] = [
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
  },
  {
    id: "next",
    name: "Next.js",
    description: "The React Framework for Production",
    dependencies: ["react"],
    recommended: ["typescript", "tailwind", "prisma"],
  },
  {
    id: "nuxt",
    name: "Nuxt",
    description: "The Intuitive Vue Framework",
    dependencies: ["vue"],
    recommended: ["typescript", "tailwind"],
  },
  {
    id: "astro",
    name: "Astro",
    description: "Build faster websites with Astro's next-gen island architecture",
    recommended: ["typescript", "tailwind"],
  },
  {
    id: "vite",
    name: "Vite",
    description: "Next Generation Frontend Tooling",
    recommended: ["typescript"],
  },
  {
    id: "remix",
    name: "Remix",
    description: "Build better websites with Remix",
    dependencies: ["react"],
    recommended: ["typescript", "tailwind", "prisma"],
  },
  {
    id: "solid",
    name: "Solid",
    description: "Simple and performant reactivity for building user interfaces",
    recommended: ["typescript", "tailwind"],
  },
  {
    id: "svelte",
    name: "Svelte",
    description: "Cybernetically enhanced web apps",
    recommended: ["typescript", "tailwind"],
  },
  {
    id: "vanilla",
    name: "Vanilla",
    description: "Plain JavaScript, no framework",
  },
];

export const backendDefs: StackOption[] = [
  {
    id: "node",
    name: "Node.js",
    description: "JavaScript runtime built on Chrome's V8 JavaScript engine",
    recommended: ["typescript", "express"],
  },
  {
    id: "express",
    name: "Express",
    description: "Fast, unopinionated, minimalist web framework for Node.js",
    dependencies: ["node"],
    recommended: ["typescript"],
  },
  {
    id: "fastapi",
    name: "FastAPI",
    description: "Modern, fast web framework for building APIs with Python",
    incompatible: ["typescript"],
    recommended: ["postgres", "mysql"],
  },
  {
    id: "hono",
    name: "Hono",
    description: "Ultrafast web framework for the Edges",
    dependencies: ["node"],
    recommended: ["typescript"],
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
  },
  {
    id: "firebase",
    name: "Firebase",
    description: "Google's mobile and web app development platform",
    incompatible: ["prisma", "drizzle", "typeorm"],
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
    incompatible: ["supabase", "firebase", "none"],
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
    incompatible: ["supabase", "firebase", "none"],
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
  {
    id: "cloudflare-workers",
    name: "Cloudflare Workers",
    description: "Serverless execution environment",
    recommended: ["typescript"],
  },
  {
    id: "vercel-edge",
    name: "Vercel Edge Runtime",
    description: "Edge runtime for serverless functions",
    recommended: ["typescript"],
  },
  {
    id: "aws-lambda",
    name: "AWS Lambda",
    description: "Serverless compute service",
    recommended: ["typescript"],
  },
];

// Validation function
export function validateConfiguration(config: ProjectConfig): {
  valid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check framework dependencies
  const framework = frameworkDefs.find((f) => f.id === config.framework);
  if (framework?.dependencies) {
    for (const dep of framework.dependencies) {
      if (dep === "typescript" && !config.typescript) {
        errors.push(`${framework.name} requires TypeScript`);
      }
    }
  }

  // Check backend dependencies and incompatibilities
  const backend = backendDefs.find((b) => b.id === config.backend);
  if (backend?.dependencies) {
    for (const dep of backend.dependencies) {
      if (
        dep === "node" &&
        config.backend !== "node" &&
        !config.backend.includes("express") &&
        !config.backend.includes("hono")
      ) {
        warnings.push(`${backend.name} is typically used with Node.js`);
      }
    }
  }
  if (backend?.incompatible?.includes("typescript") && config.typescript) {
    errors.push(`${backend.name} is incompatible with TypeScript`);
  }

  // Check database dependencies and incompatibilities
  const database = databaseDefs.find((d) => d.id === config.database);
  if (database?.dependencies) {
    for (const dep of database.dependencies) {
      if (dep === "postgres" && !config.database.includes("postgres")) {
        warnings.push(`${database.name} is built on PostgreSQL`);
      }
    }
  }
  if (database?.incompatible?.includes(config.orm) && config.orm !== "none") {
    errors.push(`${database.name} is incompatible with ${config.orm}`);
  }

  // Check ORM dependencies and incompatibilities
  const orm = ormDefs.find((o) => o.id === config.orm);
  if (orm && orm.id !== "none") {
    if (orm.dependencies) {
      for (const dep of orm.dependencies) {
        if (dep === "typescript" && !config.typescript) {
          errors.push(`${orm.name} requires TypeScript`);
        }
        if (dep === "node" && config.backend === "none") {
          errors.push(`${orm.name} requires a Node.js backend`);
        }
      }
    }
    if (orm.incompatible?.includes(config.database)) {
      errors.push(`${orm.name} is incompatible with ${config.database}`);
    }
    if (config.database === "none") {
      errors.push(`${orm.name} requires a database`);
    }
  }

  // Check styling dependencies
  const styling = stylingDefs.find((s) => s.id === config.styling);
  if (
    styling?.dependencies?.includes("react") &&
    !["react", "next", "remix"].includes(config.framework)
  ) {
    errors.push(`${styling.name} requires React`);
  }

  // Auto-fix logic
  if (config.backend === "express" || config.backend === "hono") {
    config.backend = "node";
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

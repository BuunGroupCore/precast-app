export interface StackOption {
  id: string;
  name: string;
  description?: string;
  dependencies?: string[];
  incompatible?: string[];
  recommended?: string[];
  disabled?: boolean; // Hide from web builder and CLI until fully tested
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
  gitignore: boolean;
  eslint: boolean;
  prettier: boolean;
  docker: boolean;
  securePasswords?: boolean;
  uiLibrary?: string;
  aiContext?: string[];
  packageManager: string;
  packageManagerVersion?: string;
  projectPath: string;
  language: string;
  aiAssistant?: string;
  addons?: string[];
  deploymentMethod?: string;
  autoInstall?: boolean;
  generate?: boolean;
  runtime?: string;
  authProvider?: string;
  apiClient?: string;
  mcpServers?: string[];
  powerups?: string[];
  plugins?: string[]; // Business feature plugins (stripe, resend, etc.)
  uiFramework?: string; // UI framework when using Vite
  includeAdminTools?: boolean; // Include admin tools like pgAdmin, phpMyAdmin, etc.
  dbUser?: string; // Database user name
  includeRedis?: boolean; // Include Redis in Docker setup
  colorPalette?: string; // Color palette theme
}

export interface PowerUpOption {
  id: string;
  name: string;
  description: string;
  frameworks?: string[];
  requires?: string[];
  conflicts?: string[];
  incompatible?: string[];
}

// Stack definitions without React Icons (for CLI usage)
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

export const uiFrameworkDefs: StackOption[] = [
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
    id: "vanilla",
    name: "Vanilla",
    description: "Plain JavaScript, no framework",
    disabled: true, // Disabled for future support
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
      if (dep === "next" && config.framework !== "next") {
        errors.push(`${backend.name} requires Next.js framework`);
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
          errors.push(`${orm.name} requires a backend`);
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
    !["react", "next", "react-router"].includes(config.framework)
  ) {
    errors.push(`${styling.name} requires React`);
  }

  // Auto-fix logic - no longer needed as backends are now direct options

  // Check powerup conflicts and requirements
  if (config.powerups && config.powerups.length > 0) {
    const powerupErrors = validatePowerups(config.powerups, config.framework);
    errors.push(...powerupErrors);
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

// PowerUp definitions with conflict checking
export const powerUpDefs: PowerUpOption[] = [
  {
    id: "million",
    name: "Million.js",
    description: "Make React 70% faster with a compiler",
    frameworks: ["react", "next", "remix", "react-router", "tanstack-router", "tanstack-start"],
    requires: ["react"],
    conflicts: [],
    incompatible: [],
  },
  {
    id: "next-seo",
    name: "Next SEO",
    description: "SEO made easy for Next.js projects",
    frameworks: ["next"],
    requires: ["next"],
    conflicts: ["react-helmet"],
    incompatible: [],
  },
  {
    id: "react-helmet",
    name: "React Helmet",
    description: "Document head management for React",
    frameworks: ["react", "remix"],
    requires: ["react"],
    conflicts: ["next-seo"],
    incompatible: ["next"],
  },
  {
    id: "react-aria",
    name: "React Aria",
    description: "Library of React Hooks for accessible UI primitives",
    frameworks: ["react", "next", "remix", "react-router", "tanstack-router", "tanstack-start"],
    requires: ["react"],
    conflicts: ["axe-core"],
    incompatible: [],
  },
  {
    id: "axe-core",
    name: "Axe DevTools",
    description: "Accessibility testing tools",
    frameworks: ["*"],
    requires: [],
    conflicts: ["react-aria"],
    incompatible: [],
  },
  {
    id: "vue-router",
    name: "Vue Router",
    description: "Official router for Vue.js applications",
    frameworks: ["vue"],
    requires: ["vue"],
    conflicts: [],
    incompatible: [],
  },
  {
    id: "svelte-routing",
    name: "Svelte Routing",
    description: "Declarative routing for Svelte applications",
    frameworks: ["svelte"],
    requires: ["svelte"],
    conflicts: [],
    incompatible: [],
  },
  {
    id: "solid-router",
    name: "Solid Router",
    description: "Official routing library for SolidJS",
    frameworks: ["solid"],
    requires: ["solid"],
    conflicts: [],
    incompatible: [],
  },
  {
    id: "partytown",
    name: "Partytown",
    description: "Run third-party scripts in a web worker",
    frameworks: ["*"],
    requires: [],
    conflicts: [],
    incompatible: [],
  },
  {
    id: "next-intl",
    name: "Next-intl",
    description: "Internationalization for Next.js that gets out of your way",
    frameworks: ["next"],
    requires: ["next"],
    conflicts: ["react-i18next", "vue-i18n", "angular-localize", "solid-i18n"],
    incompatible: [],
  },
  {
    id: "angular-localize",
    name: "@angular/localize",
    description: "Built-in internationalization support for Angular",
    frameworks: ["angular"],
    requires: ["angular"],
    conflicts: ["react-i18next", "vue-i18n", "next-intl", "solid-i18n"],
    incompatible: [],
  },
  {
    id: "solid-i18n",
    name: "@solid-primitives/i18n",
    description: "Internationalization primitives for SolidJS",
    frameworks: ["solid"],
    requires: ["solid"],
    conflicts: ["react-i18next", "vue-i18n", "angular-localize", "next-intl"],
    incompatible: [],
  },
  {
    id: "sharp",
    name: "Sharp",
    description: "High performance image processing",
    frameworks: ["*"],
    requires: [],
    conflicts: ["imagemin"],
    incompatible: [],
  },
  {
    id: "imagemin",
    name: "Imagemin",
    description: "Minify images seamlessly",
    frameworks: ["*"],
    requires: [],
    conflicts: ["sharp"],
    incompatible: [],
  },
];

function validatePowerups(powerups: string[], framework: string): string[] {
  const errors: string[] = [];

  for (const powerupId of powerups) {
    const powerup = powerUpDefs.find((p) => p.id === powerupId);
    if (!powerup) {
      errors.push(`Unknown powerup: ${powerupId}`);
      continue;
    }

    // Check framework compatibility
    if (
      powerup.frameworks &&
      !powerup.frameworks.includes("*") &&
      !powerup.frameworks.includes(framework)
    ) {
      errors.push(`${powerup.name} is not compatible with ${framework}`);
    }

    // Check requirements
    if (powerup.requires) {
      for (const requirement of powerup.requires) {
        if (requirement === framework) continue; // Framework requirement satisfied
        if (
          requirement === "react" &&
          ["react", "next", "remix", "react-router", "tanstack-router", "tanstack-start"].includes(
            framework
          )
        )
          continue;
        if (requirement === "vue" && ["vue", "nuxt"].includes(framework)) continue;
        if (requirement === "solid" && framework === "solid") continue;
        if (requirement === "svelte" && framework === "svelte") continue;
        if (requirement === "next" && framework === "next") continue;

        errors.push(`${powerup.name} requires ${requirement}`);
      }
    }

    // Check incompatibilities
    if (powerup.incompatible?.includes(framework)) {
      errors.push(`${powerup.name} is incompatible with ${framework}`);
    }

    // Check conflicts with other selected powerups
    for (const otherPowerupId of powerups) {
      if (otherPowerupId !== powerupId && powerup.conflicts?.includes(otherPowerupId)) {
        const otherPowerup = powerUpDefs.find((p) => p.id === otherPowerupId);
        errors.push(`${powerup.name} conflicts with ${otherPowerup?.name || otherPowerupId}`);
      }
    }
  }

  return errors;
}

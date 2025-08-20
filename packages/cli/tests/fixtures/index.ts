import type { TestCombination } from "../config/test-matrix";

export interface ValidationRule {
  type: "file-exists" | "dependency-present" | "script-exists" | "config-valid";
  path?: string;
  package?: string;
  script?: string;
  description: string;
}

export interface ProjectFixture {
  name: string;
  config: TestCombination;
  expectedFiles: string[];
  expectedDependencies: string[];
  expectedDevDependencies: string[];
  validationRules: ValidationRule[];
  skipInstall?: boolean;
}

export const FIXTURES: ProjectFixture[] = [
  {
    name: "react-express-postgres",
    config: {
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
    expectedFiles: [
      "package.json",
      "apps/web/package.json",
      "apps/api/package.json",
      "apps/web/src/App.tsx",
      "apps/api/src/index.ts",
      "apps/api/prisma/schema.prisma",
    ],
    expectedDependencies: ["react", "express", "@prisma/client"],
    expectedDevDependencies: ["typescript", "@types/react", "@types/express", "prisma"],
    validationRules: [
      { type: "file-exists", path: "apps/web/src/App.tsx", description: "React App component" },
      { type: "file-exists", path: "apps/api/src/index.ts", description: "Express server entry" },
      { type: "script-exists", script: "dev", description: "Development script" },
    ],
    skipInstall: true,
  },
  {
    name: "next-frontend-only",
    config: {
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
    expectedFiles: ["package.json", "src/app/page.tsx"],
    expectedDependencies: ["next", "react", "react-dom"],
    expectedDevDependencies: ["typescript", "@types/react", "tailwindcss"],
    validationRules: [
      { type: "file-exists", path: "src/app/page.tsx", description: "Next.js app router page" },
      { type: "script-exists", script: "dev", description: "Development script" },
      { type: "script-exists", script: "build", description: "Build script" },
    ],
    skipInstall: true,
  },
  {
    name: "vanilla-minimal",
    config: {
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
    expectedFiles: ["package.json", "index.html", "src/main.js", "style.css"],
    expectedDependencies: [],
    expectedDevDependencies: ["vite"],
    validationRules: [
      { type: "file-exists", path: "index.html", description: "HTML entry point" },
      { type: "file-exists", path: "src/main.js", description: "JavaScript entry" },
      { type: "script-exists", script: "dev", description: "Development script" },
      { type: "script-exists", script: "build", description: "Build script" },
    ],
    skipInstall: true,
  },
];

export function getFixtureByName(name: string): ProjectFixture | undefined {
  return FIXTURES.find((fixture) => fixture.name === name);
}

export function getFixturesByCategory(category: "critical" | "common" | "edge"): ProjectFixture[] {
  return FIXTURES.filter((fixture) => fixture.config.category === category);
}

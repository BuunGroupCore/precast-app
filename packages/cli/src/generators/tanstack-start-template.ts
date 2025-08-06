import path from "path";

import { consola } from "consola";
import fsExtra from "fs-extra";

import type { ProjectConfig } from "../../../shared/stack-config.js";

import { generatePackageJson } from "./base-generator.js";

// eslint-disable-next-line import/no-named-as-default-member
const { writeFile, ensureDir } = fsExtra;

/**
 * Generate TanStack Start project template
 */
export async function generateTanStackStartTemplate(
  config: ProjectConfig,
  projectPath: string
): Promise<void> {
  consola.info("Creating TanStack Start project structure...");

  /** Create directory structure */
  const directories = [
    "app",
    "app/routes",
    "app/components",
    "app/utils",
    "app/hooks",
    "public",
    "public/assets",
  ];

  for (const dir of directories) {
    await ensureDir(path.join(projectPath, dir));
  }

  /** Generate package.json with TanStack Start dependencies */
  const dependencies = [
    "react",
    "react-dom",
    "@tanstack/start",
    "@tanstack/router",
    "@tanstack/react-router",
    "@tanstack/router-devtools",
    "@tanstack/router-vite-plugin",
    "vite",
  ];

  const devDependencies = [
    "@types/react",
    "@types/react-dom",
    "@types/node",
    "@vitejs/plugin-react",
    "vinxi",
  ];

  if (config.typescript) {
    devDependencies.push("typescript");
  }

  if (config.styling === "tailwind") {
    dependencies.push("tailwindcss", "autoprefixer", "postcss");
  }

  await generatePackageJson(config, projectPath, dependencies, devDependencies, {
    type: "module",
    scripts: {
      dev: "vinxi dev",
      build: "vinxi build",
      start: "vinxi start",
      lint: "eslint . --ext .js,.jsx,.ts,.tsx",
    },
  });

  /** Generate app.config.ts */
  const appConfigContent = `import { defineConfig } from '@tanstack/start/config';
import { vitePlugin as remix } from '@tanstack/start/vite';

export default defineConfig({
  vite: {
    plugins: [remix()],
  },
});
`;

  await writeFile(path.join(projectPath, "app.config.ts"), appConfigContent);

  /** Generate main route */
  const routeContent = config.typescript
    ? `import { createFileRoute } from '@tanstack/react-router';
import { Welcome } from '../components/Welcome';

export const Route = createFileRoute('/')({
  component: Home,
});

/**
 * Home page component
 */
function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <Welcome projectName="${config.name}" />
    </div>
  );
}
`
    : `import { createFileRoute } from '@tanstack/react-router';
import { Welcome } from '../components/Welcome';

export const Route = createFileRoute('/')({
  component: Home,
});

/**
 * Home page component
 */
function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <Welcome projectName="${config.name}" />
    </div>
  );
}
`;

  await writeFile(
    path.join(projectPath, "app/routes", config.typescript ? "index.tsx" : "index.jsx"),
    routeContent
  );

  /** Generate root route */
  const rootRouteContent = config.typescript
    ? `import { createRootRoute, Link, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';

export const Route = createRootRoute({
  component: () => (
    <>
      <div className="p-2 flex gap-2">
        <Link to="/" className="[&.active]:font-bold">
          Home
        </Link>
      </div>
      <hr />
      <Outlet />
      <TanStackRouterDevtools />
    </>
  ),
});
`
    : `import { createRootRoute, Link, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';

export const Route = createRootRoute({
  component: () => (
    <>
      <div className="p-2 flex gap-2">
        <Link to="/" className="[&.active]:font-bold">
          Home
        </Link>
      </div>
      <hr />
      <Outlet />
      <TanStackRouterDevtools />
    </>
  ),
});
`;

  await writeFile(
    path.join(projectPath, "app/routes", config.typescript ? "__root.tsx" : "__root.jsx"),
    rootRouteContent
  );

  /** Generate Welcome component */
  const welcomeContent = config.typescript
    ? `import React from 'react';

interface WelcomeProps {
  projectName: string;
}

/**
 * Welcome component
 */
export const Welcome: React.FC<WelcomeProps> = ({ projectName }) => {
  return (
    <div className="max-w-2xl mx-auto text-center">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">
        Welcome to {projectName}!
      </h1>
      <p className="text-lg text-gray-600 mb-8">
        Your TanStack Start application is ready to go.
      </p>
      <div className="space-y-4">
        <p className="text-sm text-gray-500">
          Built with TanStack Start - Type-safe, full-stack React framework
        </p>
        <div className="flex justify-center space-x-4">
          <a
            href="https://tanstack.com/start"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:text-blue-700"
          >
            Documentation
          </a>
          <a
            href="https://github.com/TanStack/start"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:text-blue-700"
          >
            GitHub
          </a>
        </div>
      </div>
    </div>
  );
};
`
    : `import React from 'react';

/**
 * Welcome component
 */
export const Welcome = ({ projectName }) => {
  return (
    <div className="max-w-2xl mx-auto text-center">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">
        Welcome to {projectName}!
      </h1>
      <p className="text-lg text-gray-600 mb-8">
        Your TanStack Start application is ready to go.
      </p>
      <div className="space-y-4">
        <p className="text-sm text-gray-500">
          Built with TanStack Start - Type-safe, full-stack React framework
        </p>
        <div className="flex justify-center space-x-4">
          <a
            href="https://tanstack.com/start"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:text-blue-700"
          >
            Documentation
          </a>
          <a
            href="https://github.com/TanStack/start"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:text-blue-700"
          >
            GitHub
          </a>
        </div>
      </div>
    </div>
  );
};
`;

  await writeFile(
    path.join(projectPath, "app/components", config.typescript ? "Welcome.tsx" : "Welcome.jsx"),
    welcomeContent
  );

  if (config.typescript) {
    /** Generate tsconfig.json */
    const tsConfig = {
      compilerOptions: {
        target: "ES2022",
        useDefineForClassFields: true,
        lib: ["ES2022", "DOM", "DOM.Iterable"],
        allowJs: false,
        skipLibCheck: true,
        esModuleInterop: false,
        allowSyntheticDefaultImports: true,
        strict: true,
        forceConsistentCasingInFileNames: true,
        module: "ESNext",
        moduleResolution: "bundler",
        resolveJsonModule: true,
        isolatedModules: true,
        noEmit: true,
        jsx: "react-jsx",
        baseUrl: ".",
        paths: {
          "@/*": ["./app/*"],
        },
      },
      include: ["app"],
      exclude: ["node_modules", "dist", ".vinxi"],
    };

    await writeFile(path.join(projectPath, "tsconfig.json"), JSON.stringify(tsConfig, null, 2));
  }

  if (config.styling === "tailwind") {
    /** Generate Tailwind config */
    const tailwindConfig = `/** @type {import('tailwindcss').Config} */
export default {
  content: ['./app/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
};
`;

    await writeFile(path.join(projectPath, "tailwind.config.js"), tailwindConfig);

    /** Generate PostCSS config */
    const postcssConfig = `export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
`;

    await writeFile(path.join(projectPath, "postcss.config.js"), postcssConfig);

    /** Generate main CSS file */
    const cssContent = `@tailwind base;
@tailwind components;
@tailwind utilities;
`;

    await writeFile(path.join(projectPath, "app/globals.css"), cssContent);
  }

  consola.success("TanStack Start project structure created!");
}

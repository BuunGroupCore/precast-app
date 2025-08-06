import path from "path";

import fsExtra from "fs-extra";

import { logger } from "./logger.js";
import { getTemplateRoot } from "./template-path.js";

// eslint-disable-next-line import/no-named-as-default-member
const { readFile, writeFile, pathExists, ensureDir } = fsExtra;

function getTemplatePath(template: string): string {
  return path.join(getTemplateRoot(), template);
}

export interface PowerUpConfig {
  id: string;
  name: string;
  dependencies: Record<string, string[]>;
  devDependencies: Record<string, string[]>;
  envVariables: string[];
  setupFiles: {
    framework: string;
    files: Array<{
      path: string;
      template: string;
    }>;
  }[];
}

export const powerUpConfigs: Record<string, PowerUpConfig> = {
  sentry: {
    id: "sentry",
    name: "Sentry",
    dependencies: {
      react: ["@sentry/react"],
      next: ["@sentry/nextjs"],
      vue: ["@sentry/vue"],
      nuxt: ["@sentry/nuxt"],
      angular: ["@sentry/angular"],
      svelte: ["@sentry/svelte"],
      solid: ["@sentry/browser"],
      remix: ["@sentry/remix"],
      astro: ["@sentry/astro"],
      vite: ["@sentry/react", "@sentry/vite-plugin"],
      vanilla: ["@sentry/browser"],
    },
    devDependencies: {
      next: ["@sentry/cli"],
      vite: ["@sentry/vite-plugin"],
    },
    envVariables: [
      "# Sentry Error Tracking",
      "SENTRY_DSN=",
      "SENTRY_ORG=",
      "SENTRY_PROJECT=",
      "SENTRY_AUTH_TOKEN=",
      "SENTRY_ENVIRONMENT=development",
    ],
    setupFiles: [
      {
        framework: "react",
        files: [
          { path: "src/instrument.js", template: "powerups/sentry/react/instrument.js.hbs" },
          { path: "src/sentry.js", template: "powerups/sentry/react/sentry.js.hbs" },
        ],
      },
      {
        framework: "next",
        files: [
          {
            path: "sentry.base.config.js",
            template: "powerups/sentry/next/sentry.base.config.js.hbs",
          },
          {
            path: "sentry.client.config.js",
            template: "powerups/sentry/next/sentry.client.config.js.hbs",
          },
          {
            path: "sentry.server.config.js",
            template: "powerups/sentry/next/sentry.server.config.js.hbs",
          },
          {
            path: "sentry.edge.config.js",
            template: "powerups/sentry/next/sentry.edge.config.js.hbs",
          },
        ],
      },
      {
        framework: "vue",
        files: [{ path: "src/sentry.js", template: "powerups/sentry/vue/sentry.js.hbs" }],
      },
      {
        framework: "nuxt",
        files: [], // Configured via nuxt.config.ts module
      },
      {
        framework: "angular",
        files: [
          {
            path: "src/app/sentry.service.ts",
            template: "powerups/sentry/angular/sentry.service.ts.hbs",
          },
        ],
      },
      {
        framework: "svelte",
        files: [
          { path: "src/instrument.js", template: "powerups/sentry/svelte/instrument.js.hbs" },
        ],
      },
      {
        framework: "solid",
        files: [{ path: "src/sentry.js", template: "powerups/sentry/solid/sentry.js.hbs" }],
      },
      {
        framework: "remix",
        files: [
          {
            path: "instrument.server.js",
            template: "powerups/sentry/remix/instrument.server.js.hbs",
          },
          { path: "app/entry.client.tsx", template: "powerups/sentry/remix/entry.client.tsx.hbs" },
        ],
      },
      {
        framework: "astro",
        files: [], // Configured via astro.config.mjs
      },
      {
        framework: "vite",
        files: [{ path: "src/instrument.js", template: "powerups/sentry/vite/instrument.js.hbs" }],
      },
    ],
  },
  posthog: {
    id: "posthog",
    name: "PostHog",
    dependencies: {
      react: ["posthog-js"],
      next: ["posthog-js"],
      vue: ["posthog-js"],
      nuxt: ["posthog-js"],
      angular: ["posthog-js"],
      svelte: ["posthog-js"],
      solid: ["posthog-js"],
      remix: ["posthog-js"],
      astro: ["posthog-js"],
      vite: ["posthog-js"],
      vanilla: ["posthog-js"],
    },
    devDependencies: {},
    envVariables: [
      "# PostHog Analytics",
      "NEXT_PUBLIC_POSTHOG_KEY=",
      "NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com",
      "VITE_POSTHOG_KEY=",
      "VITE_POSTHOG_HOST=https://app.posthog.com",
      "POSTHOG_PERSONAL_API_KEY=",
    ],
    setupFiles: [
      {
        framework: "react",
        files: [{ path: "src/posthog.js", template: "powerups/posthog/react/posthog.js.hbs" }],
      },
      {
        framework: "next",
        files: [
          { path: "lib/posthog.js", template: "powerups/posthog/next/posthog.js.hbs" },
          { path: "app/providers.js", template: "powerups/posthog/next/providers.js.hbs" },
        ],
      },
      {
        framework: "vue",
        files: [{ path: "src/posthog.js", template: "powerups/posthog/vue/posthog.js.hbs" }],
      },
      {
        framework: "angular",
        files: [
          {
            path: "src/app/posthog.service.ts",
            template: "powerups/posthog/angular/posthog.service.ts.hbs",
          },
        ],
      },
      {
        framework: "svelte",
        files: [{ path: "src/lib/posthog.js", template: "powerups/posthog/svelte/posthog.js.hbs" }],
      },
      {
        framework: "solid",
        files: [{ path: "src/posthog.js", template: "powerups/posthog/solid/posthog.js.hbs" }],
      },
      {
        framework: "remix",
        files: [{ path: "app/posthog.js", template: "powerups/posthog/remix/posthog.js.hbs" }],
      },
      {
        framework: "astro",
        files: [{ path: "src/lib/posthog.js", template: "powerups/posthog/astro/posthog.js.hbs" }],
      },
      {
        framework: "vite",
        files: [{ path: "src/posthog.js", template: "powerups/posthog/vite/posthog.js.hbs" }],
      },
      {
        framework: "vanilla",
        files: [{ path: "src/posthog.js", template: "powerups/posthog/vanilla/posthog.js.hbs" }],
      },
    ],
  },
  storybook: {
    id: "storybook",
    name: "Storybook",
    dependencies: {},
    devDependencies: {
      react: ["@storybook/react", "@storybook/react-vite", "@storybook/addon-essentials"],
      next: ["@storybook/nextjs", "@storybook/addon-essentials"],
      vue: ["@storybook/vue3-vite", "@storybook/addon-essentials"],
      angular: ["@storybook/angular", "@storybook/addon-essentials"],
      svelte: ["@storybook/svelte-vite", "@storybook/addon-essentials"],
      solid: ["@storybook/html-vite", "@storybook/addon-essentials"],
    },
    envVariables: [],
    setupFiles: [
      {
        framework: "*",
        files: [
          { path: ".storybook/main.js", template: "powerups/storybook/main.js.hbs" },
          { path: ".storybook/preview.js", template: "powerups/storybook/preview.js.hbs" },
        ],
      },
    ],
  },
  prettier: {
    id: "prettier",
    name: "Prettier",
    dependencies: {},
    devDependencies: {
      "*": ["prettier"],
    },
    envVariables: [],
    setupFiles: [
      {
        framework: "*",
        files: [
          { path: ".prettierrc", template: "powerups/prettier/.prettierrc.hbs" },
          { path: ".prettierignore", template: "powerups/prettier/.prettierignore.hbs" },
        ],
      },
    ],
  },
  eslint: {
    id: "eslint",
    name: "ESLint",
    dependencies: {},
    devDependencies: {
      react: ["eslint", "eslint-config-prettier", "eslint-plugin-prettier", "eslint-plugin-react"],
      next: ["eslint", "eslint-config-next", "eslint-config-prettier"],
      vue: ["eslint", "eslint-plugin-vue", "eslint-config-prettier"],
      angular: [
        "@angular-eslint/eslint-plugin",
        "@angular-eslint/template-parser",
        "eslint-config-prettier",
      ],
      svelte: ["eslint", "eslint-plugin-svelte", "eslint-config-prettier"],
      solid: ["eslint", "eslint-config-prettier"],
      "*": ["eslint", "eslint-config-prettier", "eslint-plugin-prettier"],
    },
    envVariables: [],
    setupFiles: [
      {
        framework: "*",
        files: [
          { path: ".eslintrc.js", template: "powerups/eslint/.eslintrc.js.hbs" },
          { path: ".eslintignore", template: "powerups/eslint/.eslintignore.hbs" },
        ],
      },
    ],
  },
  husky: {
    id: "husky",
    name: "Husky",
    dependencies: {},
    devDependencies: {
      "*": ["husky", "lint-staged"],
    },
    envVariables: [],
    setupFiles: [
      {
        framework: "*",
        files: [{ path: ".husky/pre-commit", template: "powerups/husky/pre-commit.hbs" }],
      },
    ],
  },
  vitest: {
    id: "vitest",
    name: "Vitest",
    dependencies: {},
    devDependencies: {
      react: [
        "vitest",
        "@vitest/ui",
        "jsdom",
        "@testing-library/react",
        "@testing-library/jest-dom",
      ],
      vue: ["vitest", "@vitest/ui", "jsdom", "@vue/test-utils", "@testing-library/jest-dom"],
      svelte: [
        "vitest",
        "@vitest/ui",
        "jsdom",
        "@testing-library/svelte",
        "@testing-library/jest-dom",
      ],
      solid: ["vitest", "@vitest/ui", "jsdom", "@testing-library/jest-dom"],
      "*": ["vitest", "@vitest/ui", "jsdom", "@testing-library/jest-dom"],
    },
    envVariables: [],
    setupFiles: [
      {
        framework: "*",
        files: [
          { path: "vitest.config.js", template: "powerups/vitest/vitest.config.js.hbs" },
          { path: "src/test/setup.ts", template: "powerups/vitest/setup.ts.hbs" },
        ],
      },
    ],
  },
  playwright: {
    id: "playwright",
    name: "Playwright",
    dependencies: {},
    devDependencies: {
      "*": ["@playwright/test"],
    },
    envVariables: [],
    setupFiles: [
      {
        framework: "*",
        files: [
          {
            path: "playwright.config.ts",
            template: "powerups/playwright/playwright.config.ts.hbs",
          },
          { path: "e2e/example.spec.ts", template: "powerups/playwright/example.spec.ts.hbs" },
        ],
      },
    ],
  },
  biome: {
    id: "biome",
    name: "Biome",
    dependencies: {},
    devDependencies: {
      "*": ["@biomejs/biome"],
    },
    envVariables: [],
    setupFiles: [
      {
        framework: "*",
        files: [{ path: "biome.json", template: "powerups/biome/biome.json.hbs" }],
      },
    ],
  },
  commitizen: {
    id: "commitizen",
    name: "Commitizen",
    dependencies: {},
    devDependencies: {
      "*": ["commitizen", "cz-conventional-changelog"],
    },
    envVariables: [],
    setupFiles: [
      {
        framework: "*",
        files: [{ path: ".czrc", template: "powerups/commitizen/.czrc.hbs" }],
      },
    ],
  },
  "semantic-release": {
    id: "semantic-release",
    name: "Semantic Release",
    dependencies: {},
    devDependencies: {
      "*": [
        "semantic-release",
        "@semantic-release/changelog",
        "@semantic-release/git",
        "@semantic-release/github",
        "@semantic-release/npm",
      ],
    },
    envVariables: ["# Semantic Release", "GITHUB_TOKEN=", "NPM_TOKEN="],
    setupFiles: [
      {
        framework: "*",
        files: [{ path: ".releaserc", template: "powerups/semantic-release/.releaserc.hbs" }],
      },
    ],
  },
  "bundle-analyzer": {
    id: "bundle-analyzer",
    name: "Bundle Analyzer",
    dependencies: {},
    devDependencies: {
      react: ["webpack-bundle-analyzer", "@next/bundle-analyzer"],
      next: ["@next/bundle-analyzer"],
      vue: ["webpack-bundle-analyzer"],
      nuxt: ["@nuxt/webpack-builder"],
      angular: ["webpack-bundle-analyzer"],
      "*": ["vite-bundle-visualizer"],
    },
    envVariables: [],
    setupFiles: [],
  },
  cypress: {
    id: "cypress",
    name: "Cypress",
    dependencies: {},
    devDependencies: {
      "*": ["cypress"],
    },
    envVariables: [],
    setupFiles: [
      {
        framework: "*",
        files: [
          { path: "cypress.config.js", template: "powerups/cypress/cypress.config.js.hbs" },
          {
            path: "cypress/support/e2e.js",
            template: "powerups/cypress/cypress/support/e2e.js.hbs",
          },
          {
            path: "cypress/support/commands.js",
            template: "powerups/cypress/cypress/support/commands.js.hbs",
          },
        ],
      },
    ],
  },
  // Documentation Tools
  fumadocs: {
    id: "fumadocs",
    name: "Fumadocs",
    dependencies: {
      next: ["fumadocs-core", "fumadocs-ui", "fumadocs-mdx"],
    },
    devDependencies: {},
    envVariables: [],
    setupFiles: [
      {
        framework: "next",
        files: [{ path: "source.config.ts", template: "powerups/fumadocs/source.config.ts.hbs" }],
      },
    ],
  },
  docusaurus: {
    id: "docusaurus",
    name: "Docusaurus",
    dependencies: {
      react: ["@docusaurus/core", "@docusaurus/preset-classic"],
    },
    devDependencies: {
      react: ["prism-react-renderer"],
    },
    envVariables: [],
    setupFiles: [
      {
        framework: "react",
        files: [
          {
            path: "docusaurus.config.js",
            template: "powerups/docusaurus/docusaurus.config.js.hbs",
          },
        ],
      },
    ],
  },
  // Build Tools
  turborepo: {
    id: "turborepo",
    name: "Turborepo",
    dependencies: {},
    devDependencies: {
      "*": ["turbo"],
    },
    envVariables: [],
    setupFiles: [
      {
        framework: "*",
        files: [{ path: "turbo.json", template: "powerups/turborepo/turbo.json.hbs" }],
      },
    ],
  },
  nx: {
    id: "nx",
    name: "NX",
    dependencies: {},
    devDependencies: {
      "*": ["nx", "@nx/js"],
      react: ["@nx/react"],
      vue: ["@nx/vue"],
      angular: ["@nx/angular"],
      next: ["@nx/next"],
    },
    envVariables: [],
    setupFiles: [
      {
        framework: "*",
        files: [{ path: "nx.json", template: "powerups/nx/nx.json.hbs" }],
      },
    ],
  },
  "vite-pwa": {
    id: "vite-pwa",
    name: "Vite PWA",
    dependencies: {},
    devDependencies: {
      vite: ["vite-plugin-pwa", "workbox-window"],
      react: ["vite-plugin-pwa", "workbox-window"],
      vue: ["vite-plugin-pwa", "workbox-window"],
      svelte: ["vite-plugin-pwa", "workbox-window"],
      solid: ["vite-plugin-pwa", "workbox-window"],
    },
    envVariables: [],
    setupFiles: [
      {
        framework: "*",
        files: [
          { path: "vite-pwa.config.js", template: "powerups/vite-pwa/vite-pwa.config.js.hbs" },
        ],
      },
    ],
  },
  // Analytics
  "vercel-analytics": {
    id: "vercel-analytics",
    name: "Vercel Analytics",
    dependencies: {
      react: ["@vercel/analytics"],
      next: ["@vercel/analytics"],
      vue: ["@vercel/analytics"],
      svelte: ["@vercel/analytics"],
    },
    devDependencies: {},
    envVariables: [],
    setupFiles: [],
  },
  // Optimization
  million: {
    id: "million",
    name: "Million.js",
    dependencies: {},
    devDependencies: {
      react: ["million"],
      next: ["million"],
    },
    envVariables: [],
    setupFiles: [],
  },
  partytown: {
    id: "partytown",
    name: "Partytown",
    dependencies: {
      "*": ["@builder.io/partytown"],
    },
    devDependencies: {},
    envVariables: [],
    setupFiles: [],
  },
  // Accessibility
  "axe-core": {
    id: "axe-core",
    name: "Axe Core",
    dependencies: {},
    devDependencies: {
      "*": ["axe-core"],
      react: ["@axe-core/react"],
    },
    envVariables: [],
    setupFiles: [],
  },
  "react-aria": {
    id: "react-aria",
    name: "React Aria",
    dependencies: {
      react: ["react-aria", "@react-aria/components"],
    },
    devDependencies: {},
    envVariables: [],
    setupFiles: [],
  },
  // SEO
  "next-seo": {
    id: "next-seo",
    name: "Next SEO",
    dependencies: {
      next: ["next-seo"],
    },
    devDependencies: {},
    envVariables: [],
    setupFiles: [],
  },
  "react-helmet": {
    id: "react-helmet",
    name: "React Helmet",
    dependencies: {
      react: ["react-helmet-async"],
    },
    devDependencies: {},
    envVariables: [],
    setupFiles: [],
  },
  // Internationalization
  "next-intl": {
    id: "next-intl",
    name: "Next Intl",
    dependencies: {
      next: ["next-intl"],
    },
    devDependencies: {},
    envVariables: [],
    setupFiles: [],
  },
  "react-i18next": {
    id: "react-i18next",
    name: "React i18next",
    dependencies: {
      react: ["react-i18next", "i18next", "i18next-browser-languagedetector"],
    },
    devDependencies: {},
    envVariables: [],
    setupFiles: [
      {
        framework: "react",
        files: [{ path: "src/i18n.js", template: "powerups/react-i18next/i18n.js.hbs" }],
      },
    ],
  },
  "vue-i18n": {
    id: "vue-i18n",
    name: "Vue i18n",
    dependencies: {
      vue: ["vue-i18n"],
    },
    devDependencies: {},
    envVariables: [],
    setupFiles: [
      {
        framework: "vue",
        files: [{ path: "src/i18n.js", template: "powerups/vue-i18n/i18n.js.hbs" }],
      },
    ],
  },
  "angular-localize": {
    id: "angular-localize",
    name: "Angular Localize",
    dependencies: {
      angular: ["@angular/localize"],
    },
    devDependencies: {},
    envVariables: [],
    setupFiles: [],
  },
  "solid-i18n": {
    id: "solid-i18n",
    name: "Solid i18n",
    dependencies: {
      solid: ["@solid-primitives/i18n"],
    },
    devDependencies: {},
    envVariables: [],
    setupFiles: [],
  },
  // Image Optimization
  sharp: {
    id: "sharp",
    name: "Sharp",
    dependencies: {
      "*": ["sharp"],
    },
    devDependencies: {},
    envVariables: [],
    setupFiles: [],
  },
  imagemin: {
    id: "imagemin",
    name: "Imagemin",
    dependencies: {},
    devDependencies: {
      "*": ["imagemin", "imagemin-mozjpeg", "imagemin-pngquant", "imagemin-svgo"],
    },
    envVariables: [],
    setupFiles: [],
  },
  // Routing
  "tanstack-router": {
    id: "tanstack-router",
    name: "TanStack Router",
    dependencies: {
      react: ["@tanstack/react-router"],
      solid: ["@tanstack/solid-router"],
    },
    devDependencies: {
      react: ["@tanstack/react-router-devtools"],
    },
    envVariables: [],
    setupFiles: [
      {
        framework: "react",
        files: [
          {
            path: "src/routes.tsx",
            template: "powerups/tanstack-router/routes.tsx.hbs",
          },
        ],
      },
    ],
  },
  "react-router": {
    id: "react-router",
    name: "React Router",
    dependencies: {
      react: ["react-router-dom"],
    },
    devDependencies: {},
    envVariables: [],
    setupFiles: [
      {
        framework: "react",
        files: [
          {
            path: "src/router.tsx",
            template: "powerups/react-router/router.tsx.hbs",
          },
        ],
      },
    ],
  },
  "vue-router": {
    id: "vue-router",
    name: "Vue Router",
    dependencies: {
      vue: ["vue-router"],
    },
    devDependencies: {},
    envVariables: [],
    setupFiles: [],
  },
  "svelte-routing": {
    id: "svelte-routing",
    name: "Svelte Routing",
    dependencies: {
      svelte: ["svelte-routing"],
    },
    devDependencies: {},
    envVariables: [],
    setupFiles: [],
  },
  "solid-router": {
    id: "solid-router",
    name: "Solid Router",
    dependencies: {
      solid: ["@solidjs/router"],
    },
    devDependencies: {},
    envVariables: [],
    setupFiles: [],
  },
};

export async function setupPowerUps(
  projectPath: string,
  framework: string,
  powerUpIds: string[],
  typescript: boolean = true
): Promise<void> {
  logger.info(`Setting up power-ups: ${powerUpIds.join(", ")}`);

  const dependencies: Set<string> = new Set();
  const devDependencies: Set<string> = new Set();
  const envVariables: string[] = [];

  for (const powerUpId of powerUpIds) {
    const config = powerUpConfigs[powerUpId];
    if (!config) {
      logger.warn(`Unknown power-up: ${powerUpId}`);
      continue;
    }

    // Collect dependencies
    const frameworkDeps = config.dependencies[framework] || config.dependencies["*"] || [];
    const frameworkDevDeps = config.devDependencies[framework] || config.devDependencies["*"] || [];

    frameworkDeps.forEach((dep) => dependencies.add(dep));
    frameworkDevDeps.forEach((dep) => devDependencies.add(dep));

    // Collect env variables
    envVariables.push(...config.envVariables);

    // Setup files
    await setupPowerUpFiles(projectPath, framework, config, typescript);
  }

  // Update package.json
  await updatePackageJsonWithPowerUps(
    projectPath,
    Array.from(dependencies),
    Array.from(devDependencies)
  );

  // Update .env
  await updateEnvFile(projectPath, envVariables);

  // Special setup for certain powerups
  if (powerUpIds.includes("husky")) {
    await setupHusky(projectPath);
  }

  if (powerUpIds.includes("storybook")) {
    await updatePackageJsonScripts(projectPath, {
      storybook: "storybook dev -p 6006",
      "build-storybook": "storybook build",
    });
  }

  if (powerUpIds.includes("vitest")) {
    await updatePackageJsonScripts(projectPath, {
      test: "vitest",
      "test:ui": "vitest --ui",
      "test:coverage": "vitest --coverage",
    });
  }

  if (powerUpIds.includes("playwright")) {
    await updatePackageJsonScripts(projectPath, {
      "test:e2e": "playwright test",
      "test:e2e:ui": "playwright test --ui",
    });
  }

  if (powerUpIds.includes("cypress")) {
    await updatePackageJsonScripts(projectPath, {
      "cy:open": "cypress open",
      "cy:run": "cypress run",
      "cy:test": "cypress run --component",
    });
  }

  if (powerUpIds.includes("biome")) {
    await updatePackageJsonScripts(projectPath, {
      "lint:biome": "biome check .",
      "format:biome": "biome format --write .",
      "check:biome": "biome check --apply .",
    });
  }

  if (powerUpIds.includes("commitizen")) {
    await updatePackageJsonScripts(projectPath, {
      commit: "cz",
    });
  }

  if (powerUpIds.includes("semantic-release")) {
    await updatePackageJsonScripts(projectPath, {
      release: "semantic-release",
      "release:dry": "semantic-release --dry-run",
    });
  }

  if (powerUpIds.includes("bundle-analyzer")) {
    const analyzeScript =
      framework === "next"
        ? "ANALYZE=true next build"
        : framework === "vite" ||
            framework === "react" ||
            framework === "vue" ||
            framework === "svelte" ||
            framework === "solid"
          ? "vite-bundle-visualizer"
          : "webpack-bundle-analyzer dist/stats.json";

    await updatePackageJsonScripts(projectPath, {
      analyze: analyzeScript,
    });
  }

  // Documentation tools scripts
  if (powerUpIds.includes("fumadocs")) {
    await updatePackageJsonScripts(projectPath, {
      "docs:dev": "next dev",
      "docs:build": "next build",
      "docs:start": "next start",
    });
  }

  if (powerUpIds.includes("docusaurus")) {
    await updatePackageJsonScripts(projectPath, {
      "docs:start": "docusaurus start",
      "docs:build": "docusaurus build",
      "docs:swizzle": "docusaurus swizzle",
      "docs:deploy": "docusaurus deploy",
      "docs:clear": "docusaurus clear",
      "docs:serve": "docusaurus serve",
    });
  }

  // Build tools scripts
  if (powerUpIds.includes("turborepo")) {
    await updatePackageJsonScripts(projectPath, {
      "build:turbo": "turbo build",
      "dev:turbo": "turbo dev",
      "lint:turbo": "turbo lint",
      "test:turbo": "turbo test",
    });
  }

  if (powerUpIds.includes("nx")) {
    await updatePackageJsonScripts(projectPath, {
      "nx:graph": "nx graph",
      "nx:affected": "nx affected",
      "nx:format": "nx format:write",
    });
  }

  if (powerUpIds.includes("vite-pwa")) {
    await updatePackageJsonScripts(projectPath, {
      "generate-pwa-assets": "pwa-assets-generator",
    });
  }

  // Optimization tools
  if (powerUpIds.includes("partytown")) {
    await updatePackageJsonScripts(projectPath, {
      "partytown:copy": "cp -r node_modules/@builder.io/partytown/lib public/~partytown",
    });
  }

  // Image optimization
  if (powerUpIds.includes("imagemin")) {
    await updatePackageJsonScripts(projectPath, {
      "optimize:images": "imagemin src/images/* --out-dir=dist/images",
    });
  }

  logger.success("Power-ups setup completed!");
}

async function setupPowerUpFiles(
  projectPath: string,
  framework: string,
  config: PowerUpConfig,
  typescript: boolean
): Promise<void> {
  const setupFiles = config.setupFiles.find(
    (sf) => sf.framework === framework || sf.framework === "*"
  );

  if (!setupFiles) return;

  // Import Handlebars for template processing
  const Handlebars = (await import("handlebars")).default;

  // Register helpers
  Handlebars.registerHelper("ifEquals", function (this: any, arg1: any, arg2: any, options: any) {
    return arg1 == arg2 ? options.fn(this) : options.inverse(this);
  });

  for (const file of setupFiles.files) {
    const filePath = path.join(projectPath, file.path);
    const templatePath = getTemplatePath(file.template);

    if (await pathExists(templatePath)) {
      await ensureDir(path.dirname(filePath));

      const templateContent = await readFile(templatePath, "utf-8");

      // Compile and process the Handlebars template
      const template = Handlebars.compile(templateContent);
      const content = template({
        typescript,
        framework,
      });

      // Adjust file extension for TypeScript
      let finalPath = filePath;
      if (!typescript && filePath.endsWith(".ts")) {
        finalPath = filePath.replace(".ts", ".js");
      }

      await writeFile(finalPath, content);
      logger.info(`Created ${path.relative(projectPath, finalPath)}`);
    }
  }
}

async function updatePackageJsonWithPowerUps(
  projectPath: string,
  dependencies: string[],
  devDependencies: string[]
): Promise<void> {
  const packageJsonPath = path.join(projectPath, "package.json");

  if (!(await pathExists(packageJsonPath))) return;

  const packageJson = JSON.parse(await readFile(packageJsonPath, "utf-8"));

  // Add dependencies
  if (dependencies.length > 0) {
    packageJson.dependencies = packageJson.dependencies || {};
    dependencies.forEach((dep) => {
      if (!packageJson.dependencies[dep]) {
        packageJson.dependencies[dep] = "latest";
      }
    });
  }

  // Add devDependencies
  if (devDependencies.length > 0) {
    packageJson.devDependencies = packageJson.devDependencies || {};
    devDependencies.forEach((dep) => {
      if (!packageJson.devDependencies[dep]) {
        packageJson.devDependencies[dep] = "latest";
      }
    });
  }

  await writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2));
}

async function updatePackageJsonScripts(
  projectPath: string,
  scripts: Record<string, string>
): Promise<void> {
  const packageJsonPath = path.join(projectPath, "package.json");

  if (!(await pathExists(packageJsonPath))) return;

  const packageJson = JSON.parse(await readFile(packageJsonPath, "utf-8"));
  packageJson.scripts = packageJson.scripts || {};

  Object.entries(scripts).forEach(([key, value]) => {
    if (!packageJson.scripts[key]) {
      packageJson.scripts[key] = value;
    }
  });

  await writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2));
}

async function updateEnvFile(projectPath: string, envVariables: string[]): Promise<void> {
  if (envVariables.length === 0) return;

  const envPath = path.join(projectPath, ".env");
  const envExamplePath = path.join(projectPath, ".env.example");

  let envContent = "";
  if (await pathExists(envPath)) {
    envContent = await readFile(envPath, "utf-8");
  }

  // Add new variables if they don't exist
  const newVars: string[] = [];
  for (const variable of envVariables) {
    if (!variable.startsWith("#") && !envContent.includes(variable.split("=")[0])) {
      newVars.push(variable);
    } else if (variable.startsWith("#")) {
      newVars.push(variable);
    }
  }

  if (newVars.length > 0) {
    const newContent =
      envContent + (envContent.endsWith("\n") ? "" : "\n") + "\n" + newVars.join("\n");
    await writeFile(envPath, newContent);
    await writeFile(envExamplePath, newContent);
    logger.info("Updated .env file with power-up variables");
  }
}

async function setupHusky(projectPath: string): Promise<void> {
  const packageJsonPath = path.join(projectPath, "package.json");

  if (!(await pathExists(packageJsonPath))) return;

  const packageJson = JSON.parse(await readFile(packageJsonPath, "utf-8"));

  // Add prepare script
  packageJson.scripts = packageJson.scripts || {};
  packageJson.scripts.prepare = "husky install";

  // Add lint-staged configuration
  packageJson["lint-staged"] = {
    "*.{js,jsx,ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.{json,css,md}": ["prettier --write"],
  };

  await writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2));
  logger.info("Configured Husky and lint-staged");
}

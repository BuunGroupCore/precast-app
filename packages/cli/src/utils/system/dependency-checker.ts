export interface CompatibilityRule {
  name?: string;
  frameworks: string[];
  requiredDeps?: string[];
  incompatibleWith?: string[];
  setupCommand?: string;
  postInstallSteps?: string[];
  disabled?: boolean;
}

/**
 * UI library compatibility rules mapping
 */
export const UI_LIBRARY_COMPATIBILITY: Record<string, CompatibilityRule> = {
  shadcn: {
    name: "shadcn/ui",
    frameworks: ["react", "next", "react-router", "tanstack-router", "tanstack-start", "vite"],
    requiredDeps: ["tailwindcss-animate", "class-variance-authority", "clsx", "tailwind-merge"],
    setupCommand: "npx shadcn@latest init",
    postInstallSteps: [
      "Configure components.json",
      "Add CSS variables to globals.css",
      "Configure tailwind.config.js",
    ],
  },
  daisyui: {
    name: "DaisyUI",
    frameworks: [
      "react",
      "vue",
      "svelte",
      "next",
      "nuxt",
      "react-router",
      "tanstack-router",
      "tanstack-start",
      "vite",
      "astro",
      "solid",
      "angular",
      "vanilla",
    ],
    requiredDeps: ["daisyui"],
    incompatibleWith: ["shadcn"],
    postInstallSteps: ["DaisyUI has been automatically configured in your tailwind.config.js"],
  },
  mui: {
    name: "Material UI",
    frameworks: ["react", "next", "react-router", "tanstack-router", "tanstack-start", "vite"],
    requiredDeps: ["@mui/material", "@emotion/react", "@emotion/styled"],
    incompatibleWith: ["preact"],
    disabled: true,
  },
  vuetify: {
    name: "Vuetify",
    frameworks: ["vue", "nuxt"],
    requiredDeps: ["vuetify", "@mdi/font"],
    postInstallSteps: ["Configure vuetify plugin", "Import Vuetify CSS"],
  },
  chakra: {
    name: "Chakra UI",
    frameworks: ["react", "next", "react-router", "tanstack-router", "tanstack-start", "vite"],
    requiredDeps: ["@chakra-ui/react", "@emotion/react", "@emotion/styled", "framer-motion"],
    disabled: true,
  },
  antd: {
    name: "Ant Design",
    frameworks: ["react", "next", "react-router", "tanstack-router", "tanstack-start", "vite"],
    requiredDeps: ["antd"],
    disabled: true,
  },
  mantine: {
    name: "Mantine",
    frameworks: ["react", "next", "react-router", "tanstack-router", "tanstack-start", "vite"],
    requiredDeps: ["@mantine/core", "@mantine/hooks"],
    disabled: true,
  },
  brutalist: {
    name: "Brutalist UI",
    frameworks: ["react", "next", "react-router", "tanstack-router", "tanstack-start", "vite"],
    requiredDeps: ["@buun_group/brutalist-ui"],
    postInstallSteps: [
      "Import styles: import '@buun_group/brutalist-ui/styles'",
      "Wrap app with ThemeProvider for theming support",
    ],
  },
};

/**
 * AI assistance compatibility rules mapping
 */
export const AI_ASSISTANCE_COMPATIBILITY: Record<string, CompatibilityRule> = {
  "claude-sdk": {
    frameworks: [
      "react",
      "vue",
      "svelte",
      "next",
      "nuxt",
      "react-router",
      "tanstack-router",
      "tanstack-start",
      "vite",
      "astro",
      "solid",
      "vanilla",
    ],
    requiredDeps: ["@anthropic-ai/sdk"],
    postInstallSteps: ["Add ANTHROPIC_API_KEY to .env", "Configure AI provider in config"],
  },
  openai: {
    frameworks: [
      "react",
      "vue",
      "svelte",
      "next",
      "nuxt",
      "react-router",
      "tanstack-router",
      "tanstack-start",
      "vite",
      "astro",
      "solid",
      "vanilla",
    ],
    requiredDeps: ["openai"],
    postInstallSteps: ["Add OPENAI_API_KEY to .env", "Configure AI provider in config"],
  },
  "vercel-ai": {
    frameworks: [
      "react",
      "vue",
      "svelte",
      "next",
      "nuxt",
      "react-router",
      "tanstack-router",
      "tanstack-start",
      "vite",
      "solid",
    ],
    requiredDeps: ["ai", "@ai-sdk/openai"],
    postInstallSteps: ["Configure AI provider", "Set up streaming endpoints"],
  },
  langchain: {
    frameworks: [
      "react",
      "vue",
      "next",
      "nuxt",
      "react-router",
      "tanstack-router",
      "tanstack-start",
      "vite",
      "vanilla",
    ],
    requiredDeps: ["langchain", "@langchain/core"],
    postInstallSteps: ["Configure LLM provider", "Set up vector store if needed"],
  },
};

/**
 * Check if a library is compatible with a framework
 * @param framework - Framework name
 * @param library - Library name
 * @param compatibilityMap - Compatibility rules map
 * @returns Compatibility check result
 */
export function checkCompatibility(
  framework: string,
  library: string,
  compatibilityMap: Record<string, CompatibilityRule>
): { compatible: boolean; reason?: string; rule?: CompatibilityRule } {
  const rule = compatibilityMap[library];
  if (!rule) {
    return { compatible: false, reason: `Unknown library: ${library}` };
  }
  if (!rule.frameworks.includes(framework)) {
    return {
      compatible: false,
      reason: `${library} is not compatible with ${framework}. Supported frameworks: ${rule.frameworks.join(", ")}`,
    };
  }
  return { compatible: true, rule };
}

/**
 * Get list of incompatible library combinations
 * @param selectedLibraries - List of selected libraries
 * @param compatibilityMap - Compatibility rules map
 * @returns List of incompatibility messages
 */
export function getIncompatibleLibraries(
  selectedLibraries: string[],
  compatibilityMap: Record<string, CompatibilityRule>
): string[] {
  const incompatible: string[] = [];
  for (const lib of selectedLibraries) {
    const rule = compatibilityMap[lib];
    if (rule?.incompatibleWith) {
      for (const incompatLib of rule.incompatibleWith) {
        if (selectedLibraries.includes(incompatLib)) {
          incompatible.push(`${lib} is incompatible with ${incompatLib}`);
        }
      }
    }
  }
  return incompatible;
}

/**
 * Get all required dependencies for selected libraries
 * @param libraries - List of library names
 * @param compatibilityMap - Compatibility rules map
 * @returns List of required dependency packages
 */
export function getAllRequiredDeps(
  libraries: string[],
  compatibilityMap: Record<string, CompatibilityRule>
): string[] {
  const deps = new Set<string>();
  for (const lib of libraries) {
    const rule = compatibilityMap[lib];
    if (rule?.requiredDeps) {
      rule.requiredDeps.forEach((dep) => deps.add(dep));
    }
  }
  return Array.from(deps);
}

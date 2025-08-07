import {
  frameworkDefs,
  backendDefs,
  databaseDefs,
  ormDefs,
  stylingDefs,
  runtimeDefs,
  type StackOption,
} from "@/data/stackOptions";

export interface StackConfigData {
  frameworks: StackOption[];
  backends: StackOption[];
  databases: StackOption[];
  orms: StackOption[];
  styling: StackOption[];
  runtimes: StackOption[];
}

/**
 * Get all stack configuration options from the shared config
 */
export function getStackConfig(): StackConfigData {
  return {
    frameworks: frameworkDefs,
    backends: backendDefs,
    databases: databaseDefs,
    orms: ormDefs,
    styling: stylingDefs,
    runtimes: runtimeDefs,
  };
}

/**
 * Format a list of stack options as a readable string
 */
export function formatStackOptions(options: StackOption[], includeNone = true): string {
  const filtered = includeNone ? options : options.filter((opt) => opt.id !== "none");
  return filtered.map((opt) => opt.name).join(", ");
}

/**
 * Generate FAQ data dynamically from stack config
 */
export function generateFAQFromStackConfig(): Array<{ question: string; answer: string }> {
  const config = getStackConfig();

  return [
    {
      question: "What is Precast?",
      answer:
        "Precast is a CLI tool that helps you quickly scaffold modern full-stack web applications with your preferred technology stack. It sets up everything you need including framework, database, styling, authentication, and more.",
    },
    {
      question: "What are the system requirements?",
      answer: "Precast requires Node.js version 18 or higher to be installed on your system.",
    },
    {
      question: "Which frameworks are supported?",
      answer: `Precast supports ${formatStackOptions(config.frameworks)}.`,
    },
    {
      question: "What backends are supported?",
      answer: `Precast supports ${formatStackOptions(config.backends)}. Use the --backend flag to specify one.`,
    },
    {
      question: "Which JavaScript runtimes are supported?",
      answer: `Precast supports ${formatStackOptions(config.runtimes)} runtimes. Use the --runtime flag to specify which one to use for your project.`,
    },
    {
      question: "Can I use TypeScript?",
      answer:
        "Yes! TypeScript is enabled by default in all projects. You can disable it by using the --no-typescript flag.",
    },
    {
      question: "How do I add a database?",
      answer: `Use the --database flag with ${formatStackOptions(config.databases, false).toLowerCase()}. Then choose an ORM with --orm (${formatStackOptions(config.orms, false).toLowerCase()}).`,
    },
    {
      question: "Which UI component libraries are available?",
      answer:
        "Precast supports shadcn/ui, DaisyUI, Material UI, Chakra UI, Ant Design, Mantine, and Brutalist UI. Use the --ui-library flag to specify one.",
    },
    {
      question: "Can I use Docker?",
      answer: "Yes, add the --docker flag to include Docker configuration files in your project.",
    },
    {
      question: "How do I skip all prompts?",
      answer:
        "Use the --yes flag to skip all prompts and use default values. This is useful for automation or when you know exactly what you want.",
    },
    {
      question: "What if my package manager fails?",
      answer:
        "Precast automatically falls back to npm if your chosen package manager encounters issues with certain packages.",
    },
    {
      question: "Is authentication included?",
      answer:
        "You can add authentication using the --auth flag with options like better-auth, auth.js, clerk, lucia, or passport.",
    },
  ];
}

import { ExtendedProjectConfig } from "@/components/builder";

export function analyzeAnswers(
  answers: Record<string, string | string[]>
): Partial<ExtendedProjectConfig> {
  const config: Partial<ExtendedProjectConfig> = {
    typescript: true,
    git: true,
    docker: false,
    autoInstall: true,
  };

  // Experience level affects complexity choices
  const experience = answers.experience as string;

  // Project type determines framework
  const projectTypes = answers.projectType as string[];
  if (projectTypes?.includes("mobile")) {
    config.framework = "react-native";
  } else if (projectTypes?.includes("ecommerce") || projectTypes?.includes("dashboard")) {
    config.framework = "next";
    config.backend = "next-api";
  } else if (projectTypes?.includes("blog")) {
    // Astro is disabled, use Next.js for blogs
    config.framework = "next";
  } else if (projectTypes?.includes("api")) {
    config.framework = "none";
    config.backend = experience === "beginner" ? "express" : "fastify";
  } else {
    config.framework = experience === "beginner" ? "react" : "next";
  }

  // Team size affects tooling
  const teamSize = answers.teamSize as string;
  if (teamSize === "large" || teamSize === "medium") {
    config.typescript = true;
    config.docker = true;
  }

  // Timeline affects choices
  const timeline = answers.timeline as string;
  if (timeline === "prototype") {
    config.database = "none";
    config.orm = "none";
  } else {
    config.database = "postgres";
    config.orm = experience === "beginner" ? "prisma" : "drizzle";
  }

  // Priorities shape the stack
  const priorities = answers.priorities as string[];
  if (priorities?.includes("performance")) {
    config.runtime = "bun";
    // Solid is disabled, don't recommend it
    // config.framework = projectTypes?.includes("webapp") ? "solid" : config.framework;
  }
  if (priorities?.includes("seo")) {
    config.framework = "next";
  }
  if (priorities?.includes("ui")) {
    config.styling = "tailwind";
    config.uiLibrary = "shadcn";
  } else {
    config.styling = "tailwind";
  }
  if (priorities?.includes("cost")) {
    config.database = "none";
    config.deploymentMethod = "vercel";
  }
  if (priorities?.includes("security")) {
    config.auth = "better-auth";
  }

  // Features needed
  const features = answers.features as string[];
  if (features?.includes("auth")) {
    config.auth = experience === "beginner" ? "clerk" : "better-auth";
  }
  if (features?.includes("database")) {
    config.database = config.database || "postgres";
    config.orm = config.orm || "prisma";
  }
  if (features?.includes("payments")) {
    config.plugins = ["stripe"];
  }
  if (features?.includes("ai")) {
    config.aiAssistant = "claude";
    config.mcpServers = ["filesystem", "github-official"];
  }
  if (features?.includes("realtime")) {
    config.plugins = [...(config.plugins || []), "pusher"];
  }
  if (features?.includes("email")) {
    config.plugins = [...(config.plugins || []), "resend"];
  }

  // Deployment preference
  const deployment = answers.deployment as string;
  if (deployment === "vercel") {
    config.deploymentMethod = "vercel";
    config.framework = config.framework === "react" ? "next" : config.framework;
  } else if (deployment === "aws") {
    config.deploymentMethod = "aws";
    config.docker = true;
  } else if (deployment === "selfhosted") {
    config.docker = true;
  }

  // Design preference
  const design = answers.designPreference as string;
  if (design === "minimal") {
    config.uiLibrary = "shadcn";
  } else if (design === "modern") {
    config.uiLibrary = "brutalist";
  } else if (design === "playful") {
    config.uiLibrary = "daisyui";
  } else if (design === "professional") {
    // MUI is disabled, use shadcn for professional look
    config.uiLibrary = "shadcn";
  }

  // Set backend if not set
  if (!config.backend) {
    config.backend = config.framework === "next" ? "next-api" : "express";
  }

  // Package manager based on experience
  config.packageManager = experience === "advanced" ? "bun" : "npm";

  return config;
}

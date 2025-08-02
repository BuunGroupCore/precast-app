import path from "path";
import fs from "fs-extra";
import { type ProjectConfig } from "../../../shared/stack-config.js";
import { generateReactTemplate } from "./react.js";
import { generateVueTemplate } from "./vue.js";
import { generateAngularTemplate } from "./angular.js";
import { generateNextTemplate } from "./next.js";
import { generateNuxtTemplate } from "./nuxt.js";
import { generateAstroTemplate } from "./astro.js";
import { generateViteTemplate } from "./vite.js";
import { generateRemixTemplate } from "./remix.js";
import { generateSolidTemplate } from "./solid.js";
import { generateSvelteTemplate } from "./svelte.js";
import { generateVanillaTemplate } from "./vanilla.js";

export async function generateTemplate(
  config: ProjectConfig,
  projectPath: string,
) {
  // Generate base files
  await generateBaseFiles(config, projectPath);

  // Generate framework-specific template
  switch (config.framework) {
    case "react":
      await generateReactTemplate(config, projectPath);
      break;
    case "vue":
      await generateVueTemplate(config, projectPath);
      break;
    case "angular":
      await generateAngularTemplate(config, projectPath);
      break;
    case "next":
      await generateNextTemplate(config, projectPath);
      break;
    case "nuxt":
      await generateNuxtTemplate(config, projectPath);
      break;
    case "astro":
      await generateAstroTemplate(config, projectPath);
      break;
    case "vite":
      await generateViteTemplate(config, projectPath);
      break;
    case "remix":
      await generateRemixTemplate(config, projectPath);
      break;
    case "solid":
      await generateSolidTemplate(config, projectPath);
      break;
    case "svelte":
      await generateSvelteTemplate(config, projectPath);
      break;
    case "vanilla":
      await generateVanillaTemplate(config, projectPath);
      break;
    default:
      throw new Error(`Unknown framework: ${config.framework}`);
  }
}

async function generateBaseFiles(config: ProjectConfig, projectPath: string) {
  // README.md
  const readme = generateReadme(config);
  await fs.writeFile(path.join(projectPath, "README.md"), readme);

  // .env.example
  const envExample = generateEnvExample(config);
  await fs.writeFile(path.join(projectPath, ".env.example"), envExample);

  // .editorconfig
  const editorconfig = `root = true

[*]
indent_style = space
indent_size = 2
end_of_line = lf
charset = utf-8
trim_trailing_whitespace = true
insert_final_newline = true

[*.md]
trim_trailing_whitespace = false
`;
  await fs.writeFile(path.join(projectPath, ".editorconfig"), editorconfig);

  // .nvmrc (Node version)
  await fs.writeFile(path.join(projectPath, ".nvmrc"), "20\n");
}

function generateReadme(config: ProjectConfig): string {
  const lines = [
    `# ${config.name}`,
    "",
    "Built with Precast App Generator",
    "",
    "## Tech Stack",
    "",
    `- **Framework**: ${config.framework}`,
    config.backend !== "none" ? `- **Backend**: ${config.backend}` : null,
    config.database !== "none" ? `- **Database**: ${config.database}` : null,
    config.orm !== "none" ? `- **ORM**: ${config.orm}` : null,
    `- **Styling**: ${config.styling}`,
    config.typescript
      ? "- **Language**: TypeScript"
      : "- **Language**: JavaScript",
    "",
    "## Getting Started",
    "",
    "### Prerequisites",
    "",
    "- Node.js 20+",
    "- npm/yarn/pnpm/bun",
  ].filter(Boolean);

  if (config.docker) {
    lines.push("- Docker & Docker Compose");
  }

  lines.push(
    "",
    "### Installation",
    "",
    "```bash",
    "# Install dependencies",
    "npm install",
    "```",
    "",
    "### Development",
    "",
    "```bash",
    "# Run development server",
    "npm run dev",
    "```",
    "",
    "### Build",
    "",
    "```bash",
    "# Build for production",
    "npm run build",
    "```",
  );

  if (config.docker) {
    lines.push(
      "",
      "### Docker",
      "",
      "```bash",
      "# Build and run with Docker Compose",
      "docker-compose up -d",
      "```",
    );
  }

  if (config.database !== "none" && config.orm !== "none") {
    lines.push(
      "",
      "### Database",
      "",
      "```bash",
      "# Run database migrations",
      "npm run db:migrate",
      "",
      "# Seed database (development)",
      "npm run db:seed",
      "```",
    );
  }

  lines.push("", "## License", "", "MIT");

  return lines.join("\n");
}

function generateEnvExample(config: ProjectConfig): string {
  const lines = ["# Environment variables"];

  if (config.framework === "next" || config.framework === "nuxt") {
    lines.push("", "# App", "NODE_ENV=development");
  }

  if (config.database !== "none") {
    lines.push("", "# Database");

    switch (config.database) {
      case "postgres":
        lines.push(
          "DATABASE_URL=postgresql://postgres:postgres@localhost:5432/mydb",
        );
        break;
      case "mysql":
        lines.push("DATABASE_URL=mysql://user:password@localhost:3306/mydb");
        break;
      case "mongodb":
        lines.push("DATABASE_URL=mongodb://localhost:27017/mydb");
        break;
      case "supabase":
        lines.push(
          "SUPABASE_URL=https://your-project.supabase.co",
          "SUPABASE_ANON_KEY=your-anon-key",
        );
        break;
      case "firebase":
        lines.push(
          "FIREBASE_API_KEY=your-api-key",
          "FIREBASE_AUTH_DOMAIN=your-auth-domain",
          "FIREBASE_PROJECT_ID=your-project-id",
        );
        break;
    }
  }

  if (config.backend !== "none") {
    lines.push(
      "",
      "# API",
      "API_URL=http://localhost:3001",
      "JWT_SECRET=your-secret-key",
    );
  }

  return lines.join("\n");
}

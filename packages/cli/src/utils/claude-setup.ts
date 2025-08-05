import path from "path";

import { consola } from "consola";
import { ensureDir, writeJSON, writeFile, pathExists, readFile } from "fs-extra";

import type { ProjectConfig } from "../../../shared/stack-config.js";

interface ClaudeSettings {
  permissions?: {
    allow?: string[];
    deny?: string[];
  };
}

export async function setupClaudeIntegration(
  config: ProjectConfig,
  projectPath: string
): Promise<void> {
  consola.info("🤖 Setting up Claude Code integration...");

  try {
    // Create .claude directory
    const claudeDir = path.join(projectPath, ".claude");
    await ensureDir(claudeDir);

    // Create settings.json with project-specific permissions
    const settings = await generateClaudeSettings(config);
    await writeJSON(path.join(claudeDir, "settings.json"), settings, { spaces: 2 });

    // Create CLAUDE.md in project root
    const claudeMd = await generateClaudeMd(config);
    await writeFile(path.join(projectPath, "CLAUDE.md"), claudeMd);

    // Create .gitignore entry for .claude/settings.local.json
    await addToGitignore(projectPath, ".claude/settings.local.json");

    consola.success("Claude Code integration configured successfully");
  } catch (error) {
    consola.warn("Failed to setup Claude Code integration:", error);
  }
}

async function generateClaudeSettings(config: ProjectConfig): Promise<ClaudeSettings> {
  const settings: ClaudeSettings = {
    permissions: {
      allow: [],
      deny: [],
    },
  };

  // Add package manager specific permissions
  const pm = config.packageManager || "npm";
  const pmCommands = [
    `Bash(${pm} install:*)`,
    `Bash(${pm} add:*)`,
    `Bash(${pm} remove:*)`,
    `Bash(${pm} run:*)`,
    `Bash(${pm} test:*)`,
    `Bash(${pm} build:*)`,
  ];

  if (pm === "bun") {
    pmCommands.push(`Bash(bunx:*)`);
  } else if (pm === "npm" || pm === "yarn") {
    pmCommands.push(`Bash(npx:*)`);
  } else if (pm === "pnpm") {
    pmCommands.push(`Bash(pnpx:*)`);
  }

  settings.permissions!.allow!.push(...pmCommands);

  // Add common development permissions
  settings.permissions!.allow!.push(
    "Bash(mkdir:*)",
    "Bash(touch:*)",
    "Bash(rm:*)",
    "Bash(mv:*)",
    "Bash(cp:*)",
    "Bash(cat:*)",
    "Bash(ls:*)",
    "Bash(find:*)",
    "Bash(grep:*)",
    "Bash(sed:*)",
    "Bash(awk:*)",
    "Bash(echo:*)",
    "Bash(node:*)",
    "Bash(git:*)",
    "Bash(curl:*)",
    "Bash(chmod:*)",
    "WebFetch(domain:github.com)",
    "WebSearch"
  );

  // Add framework-specific permissions
  if (config.framework === "next") {
    settings.permissions!.allow!.push("WebFetch(domain:nextjs.org)", "WebFetch(domain:vercel.com)");
  } else if (config.framework === "vue" || config.framework === "nuxt") {
    settings.permissions!.allow!.push("WebFetch(domain:vuejs.org)", "WebFetch(domain:nuxt.com)");
  } else if (config.framework === "react") {
    settings.permissions!.allow!.push("WebFetch(domain:react.dev)", "WebFetch(domain:reactjs.org)");
  } else if (config.framework === "svelte") {
    settings.permissions!.allow!.push(
      "WebFetch(domain:svelte.dev)",
      "WebFetch(domain:kit.svelte.dev)"
    );
  }

  // Add styling-specific permissions
  if (config.styling === "tailwind") {
    settings.permissions!.allow!.push("WebFetch(domain:tailwindcss.com)");
  }

  // Add UI library permissions
  if (config.uiLibrary === "shadcn") {
    settings.permissions!.allow!.push("WebFetch(domain:ui.shadcn.com)");
  } else if (config.uiLibrary === "daisyui") {
    settings.permissions!.allow!.push("WebFetch(domain:daisyui.com)");
  }

  // Add database/ORM permissions
  if (config.orm === "prisma") {
    settings.permissions!.allow!.push(
      "WebFetch(domain:prisma.io)",
      "Bash(npx prisma:*)",
      "Bash(bunx prisma:*)"
    );
  } else if (config.orm === "drizzle") {
    settings.permissions!.allow!.push(
      "WebFetch(domain:orm.drizzle.team)",
      "Bash(npx drizzle-kit:*)",
      "Bash(bunx drizzle-kit:*)"
    );
  }

  // Add auth permissions
  if (config.authProvider === "auth.js") {
    settings.permissions!.allow!.push("WebFetch(domain:authjs.dev)");
  } else if (config.authProvider === "better-auth") {
    settings.permissions!.allow!.push("WebFetch(domain:better-auth.com)");
  }

  // Add TypeScript permissions
  if (config.typescript) {
    settings.permissions!.allow!.push(
      "Bash(npx tsc:*)",
      "Bash(bunx tsc:*)",
      "WebFetch(domain:typescriptlang.org)"
    );
  }

  return settings;
}

async function generateClaudeMd(config: ProjectConfig): Promise<string> {
  const sections: string[] = [];

  // Header
  sections.push(`# ${config.name} - Claude Code Context\n`);
  sections.push(
    `This project was scaffolded with create-precast-app and is configured for optimal Claude Code integration.\n`
  );

  // Project Overview
  sections.push(`## Project Overview\n`);
  sections.push(
    `This is a ${config.framework} application${config.uiLibrary ? ` using ${config.uiLibrary} for UI components` : ""}.`
  );
  sections.push(
    `The project uses ${config.typescript ? "TypeScript" : "JavaScript"} and is managed with ${config.packageManager}.\n`
  );

  // Technology Stack
  sections.push(`## Technology Stack\n`);
  const stack = [
    `- **Framework**: ${config.framework}`,
    `- **Language**: ${config.language}`,
    `- **Package Manager**: ${config.packageManager}`,
    `- **Runtime**: ${config.runtime || "node"}`,
  ];

  if (config.styling) stack.push(`- **Styling**: ${config.styling}`);
  if (config.uiLibrary) stack.push(`- **UI Library**: ${config.uiLibrary}`);
  if (config.backend && config.backend !== "none") stack.push(`- **Backend**: ${config.backend}`);
  if (config.database && config.database !== "none")
    stack.push(`- **Database**: ${config.database}`);
  if (config.orm && config.orm !== "none") stack.push(`- **ORM**: ${config.orm}`);
  if (config.authProvider) stack.push(`- **Authentication**: ${config.authProvider}`);

  sections.push(stack.join("\n") + "\n");

  // Development Commands
  sections.push(`## Common Commands\n`);
  sections.push(`\`\`\`bash
# Install dependencies
${config.packageManager} install

# Start development server
${config.packageManager} run dev

# Build for production
${config.packageManager} run build

# Run tests
${config.packageManager} test

# Lint and format code
${config.packageManager} run lint
${config.packageManager} run format
\`\`\`\n`);

  // Project Structure
  sections.push(`## Project Structure\n`);
  sections.push(`\`\`\`
${config.name}/
├── .claude/             # Claude Code configuration
│   └── settings.json    # Project-specific Claude settings
├── src/                 # Source code
${getFrameworkStructure(config)}├── public/             # Static assets
├── package.json         # Dependencies and scripts
├── CLAUDE.md           # This file - Claude context
└── README.md           # Project documentation
\`\`\`\n`);

  // Code Style Guidelines
  sections.push(`## Code Style Guidelines\n`);
  if (config.typescript) {
    sections.push(`### TypeScript
- Use strict mode TypeScript configuration
- Prefer interfaces over types for object shapes
- Use proper type annotations, avoid \`any\`
- Export types alongside implementations\n`);
  }

  if (config.styling === "tailwind") {
    sections.push(`### Styling with Tailwind CSS
- Use utility classes for styling
- Follow mobile-first responsive design
- Create custom components for repeated patterns
- Use CSS variables for theme customization\n`);
  }

  if (config.uiLibrary === "shadcn") {
    sections.push(`### UI Components (shadcn/ui)
- Components are in \`src/components/ui\`
- They are fully customizable and owned by the project
- Follow the shadcn/ui patterns for consistency
- Use the CLI to add new components: \`npx shadcn-ui@latest add [component]\`\n`);
  }

  // Best Practices
  sections.push(`## Best Practices\n`);
  sections.push(`1. **Component Design**: Keep components small, focused, and reusable
2. **Error Handling**: Always use try-catch blocks and handle errors gracefully
3. **State Management**: Use appropriate state management for your use case
4. **Performance**: Implement code splitting and lazy loading where appropriate
5. **Accessibility**: Follow WCAG guidelines and test with screen readers
6. **Security**: Validate all inputs, sanitize outputs, use environment variables
7. **Testing**: Write unit tests for utilities, integration tests for features\n`);

  // Development Workflow
  sections.push(`## Development Workflow\n`);
  sections.push(`1. Create a new branch for your feature/fix
2. Make your changes following the code style guidelines
3. Test your changes thoroughly
4. Commit with clear, descriptive messages
5. Push and create a pull request\n`);

  // Environment Variables
  sections.push(`## Environment Variables\n`);
  sections.push(`Environment variables are managed through \`.env\` files:
- \`.env\` - Default environment variables
- \`.env.local\` - Local overrides (not committed)
- \`.env.production\` - Production variables
- \`.env.test\` - Test environment variables\n`);

  if (config.database && config.database !== "none") {
    sections.push(`### Database Configuration
\`\`\`env
DATABASE_URL="your-database-connection-string"
\`\`\`\n`);
  }

  if (config.authProvider) {
    sections.push(`### Authentication Configuration
\`\`\`env
AUTH_SECRET="your-auth-secret"
${config.authProvider === "auth.js" ? 'NEXTAUTH_URL="http://localhost:3000"' : ""}
\`\`\`\n`);
  }

  // Important Notes
  sections.push(`## Important Notes for Claude\n`);
  sections.push(`- Always check existing code patterns before implementing new features
- Use the established project structure and naming conventions
- Follow the TypeScript/JavaScript style used in the project
- Test your changes before marking tasks as complete
- Ask for clarification if requirements are unclear
- Consider performance and accessibility in all implementations\n`);

  // Common Tasks Examples
  sections.push(`## Common Task Examples\n`);
  sections.push(getFrameworkExamples(config));

  return sections.join("\n");
}

function getFrameworkStructure(config: ProjectConfig): string {
  switch (config.framework) {
    case "next":
      return `│   ├── app/            # Next.js App Router
│   ├── components/     # Shared components
│   └── lib/            # Utilities and helpers
`;
    case "react":
      return `│   ├── components/     # React components
│   ├── hooks/          # Custom hooks
│   ├── contexts/       # React contexts
│   └── utils/          # Utility functions
`;
    case "vue":
    case "nuxt":
      return `│   ├── components/     # Vue components
│   ├── composables/    # Vue composables
│   ├── pages/          # Route pages
│   └── utils/          # Utility functions
`;
    case "svelte":
      return `│   ├── lib/            # Svelte components
│   ├── routes/         # SvelteKit routes
│   └── stores/         # Svelte stores
`;
    default:
      return `│   ├── components/     # UI components
│   └── utils/          # Utility functions
`;
  }
}

function getFrameworkExamples(config: ProjectConfig): string {
  const examples: string[] = [];

  if (config.framework === "react" || config.framework === "next") {
    examples.push(`### Creating a New Component
\`\`\`tsx
// src/components/Button.tsx
interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
}

export function Button({ children, onClick, variant = 'primary' }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className={\`btn btn-\${variant}\`}
    >
      {children}
    </button>
  );
}
\`\`\`\n`);
  }

  if (config.framework === "next") {
    examples.push(`### Creating a New API Route
\`\`\`ts
// src/app/api/hello/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ message: 'Hello from API' });
}
\`\`\`\n`);
  }

  if (config.orm === "prisma") {
    examples.push(`### Database Query with Prisma
\`\`\`ts
import { prisma } from '@/lib/prisma';

// Find all users
const users = await prisma.user.findMany();

// Create a new user
const newUser = await prisma.user.create({
  data: {
    name: 'John Doe',
    email: 'john@example.com'
  }
});
\`\`\`\n`);
  }

  return examples.join("\n");
}

async function addToGitignore(projectPath: string, entry: string): Promise<void> {
  const gitignorePath = path.join(projectPath, ".gitignore");

  try {
    let content = "";
    if (await pathExists(gitignorePath)) {
      content = await readFile(gitignorePath, "utf-8");
    }

    // Check if entry already exists
    if (!content.includes(entry)) {
      // Add to local development section or create it
      if (content.includes("# Local development")) {
        content = content.replace(/# Local development/, `# Local development\n${entry}`);
      } else {
        content += `\n# Local development\n${entry}\n`;
      }

      await writeFile(gitignorePath, content);
    }
  } catch (error) {
    consola.debug("Failed to update .gitignore:", error);
  }
}

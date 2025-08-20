import { motion } from "framer-motion";
import React, { useState } from "react";
import {
  FaBrain,
  FaChevronDown,
  FaChevronRight,
  FaFile,
  FaFolder,
  FaFolderOpen,
  FaFileAlt,
  FaClipboardList,
} from "react-icons/fa";

import { BuilderIcon } from "./BuilderIcon";
import { CollapsibleSection } from "./CollapsibleSection";
import { aiAssistants } from "./constants";
import { PublicIcon } from "./PublicIcon";
import type { ExtendedProjectConfig } from "./types";

interface AIAssistanceSectionProps {
  config: ExtendedProjectConfig;
  setConfig: React.Dispatch<React.SetStateAction<ExtendedProjectConfig>>;
}

interface FileTreeNode {
  name: string;
  type: "file" | "folder";
  path: string;
  children?: FileTreeNode[];
}

/**
 * AI Assistance configuration section for selecting and configuring AI coding assistants.
 * Displays available AI options and generates appropriate configuration files.
 */
export const AIAssistanceSection: React.FC<AIAssistanceSectionProps> = ({ config, setConfig }) => {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  const [expandedFiles, setExpandedFiles] = useState<{ [key: string]: boolean }>({});
  const [isGeneratedFilesExpanded, setIsGeneratedFilesExpanded] = useState(false);

  const toggleFolder = (folderPath: string) => {
    setExpandedFolders((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(folderPath)) {
        newSet.delete(folderPath);
      } else {
        newSet.add(folderPath);
      }
      return newSet;
    });
  };

  const toggleFile = (filePath: string) => {
    setExpandedFiles((prev) => ({
      ...prev,
      [filePath]: !prev[filePath],
    }));
  };

  /**
   * Processes Handlebars-like template strings with project configuration values
   * @param template - Template string with {{variable}} placeholders
   * @param config - Project configuration to use for replacements
   * @returns Processed template string
   */
  const processTemplate = (template: string, config: ExtendedProjectConfig) => {
    let processed = template;
    processed = processed.replace(/\{\{name\}\}/g, config.name);
    processed = processed.replace(/\{\{projectName\}\}/g, config.name);
    processed = processed.replace(/\{\{framework\}\}/g, config.framework);
    processed = processed.replace(
      /\{\{language\}\}/g,
      config.typescript ? "TypeScript" : "JavaScript"
    );
    processed = processed.replace(/\{\{packageManager\}\}/g, config.packageManager || "npm");
    processed = processed.replace(/\{\{styling\}\}/g, config.styling);
    processed = processed.replace(/\{\{uiLibrary\}\}/g, config.uiLibrary || "");
    processed = processed.replace(/\{\{backend\}\}/g, config.backend);
    processed = processed.replace(/\{\{database\}\}/g, config.database);
    processed = processed.replace(/\{\{orm\}\}/g, config.orm);
    processed = processed.replace(/\{\{typescript\}\}/g, config.typescript ? "true" : "false");

    processed = processed.replace(
      /\{\{#if\s+(\w+)\}\}([\s\S]*?)\{\{\/if\}\}/g,
      (_match, variable, content) => {
        const value = getConfigValue(variable, config);
        return value && value !== "none" && value !== "false" ? content : "";
      }
    );

    processed = processed.replace(
      /\{\{#if\s+\(eq\s+(\w+)\s+"([^"]+)"\)\}\}([\s\S]*?)\{\{\/if\}\}/g,
      (_match, variable, compareValue, content) => {
        const value = getConfigValue(variable, config);
        return value === compareValue ? content : "";
      }
    );

    processed = processed.replace(
      /\{\{#if\s+\(ne\s+(\w+)\s+'([^']+)'\)\}\}([\s\S]*?)\{\{\/if\}\}/g,
      (_match, variable, compareValue, content) => {
        const value = getConfigValue(variable, config);
        return value !== compareValue ? content : "";
      }
    );

    processed = processed.replace(/\{\{[^}]*\}\}/g, "");

    return processed.trim();
  };

  const getConfigValue = (variable: string, config: ExtendedProjectConfig): string => {
    switch (variable) {
      case "name":
      case "projectName":
        return config.name;
      case "framework":
        return config.framework;
      case "language":
        return config.typescript ? "TypeScript" : "JavaScript";
      case "typescript":
        return config.typescript ? "true" : "false";
      case "packageManager":
        return config.packageManager || "npm";
      case "styling":
        return config.styling;
      case "uiLibrary":
        return config.uiLibrary || "none";
      case "backend":
        return config.backend;
      case "database":
        return config.database;
      case "orm":
        return config.orm;
      default:
        return "";
    }
  };

  /**
   * Returns the content for a specific file based on AI assistant type
   * @param filePath - Path of the file to get content for
   * @param aiId - ID of the selected AI assistant
   * @returns File content as a string
   */
  const getFileContent = (filePath: string, aiId: string) => {
    const isMonorepo = config.backend && config.backend !== "none" && config.backend !== "next-api";

    const templates: { [key: string]: { [key: string]: string } } = {
      claude: {
        ".claude/settings.json": `// Note: You can also create .claude/settings.local.json for user-specific settings
// that won't be committed to version control (added to .gitignore automatically)
{
  "permissions": {
    "allow": [
      "Read",
      "Write",
      "Edit",
      "MultiEdit",
      "NotebookEdit",
      "Glob",
      "Grep",
      "LS",
      "WebSearch",
      "WebFetch",
      "TodoWrite"${
        config.framework !== "vanilla" || config.backend !== "none" ? ',\n      "Bash"' : ""
      }${config.backend && config.backend !== "none" ? ',\n      "Task"' : ""}${
        config.backend && config.backend !== "none" && config.database !== "none"
          ? ',\n      "ExitPlanMode"'
          : ""
      }
    ]
  },
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": ".claude/hooks/enforce-package-manager.sh"
          },
          {
            "type": "command",
            "command": ".claude/hooks/security-scanner.sh"
          }
        ]
      }
    ]${
      config.eslint || config.prettier
        ? `,
    "PostToolUse": [
      {
        "matcher": "Edit|Write|MultiEdit",
        "hooks": [
          {
            "type": "command",
            "command": ".claude/hooks/lint-check.sh"
          }
        ]
      }
    ]`
        : ""
    }
  }
}`,
        ".claude/mcp.json":
          config.mcpServers && config.mcpServers.length > 0
            ? `{
  "mcpServers": {
    ${config.mcpServers
      .map((server) => {
        if (server === "filesystem") {
          return `"filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/home/user/projects"]
    }`;
        } else if (server === "github") {
          return `"github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "\${GITHUB_PERSONAL_ACCESS_TOKEN}"
      }
    }`;
        } else if (server === "postgresql") {
          return `"postgresql": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres", "\${DATABASE_URL}"]
    }`;
        } else if (server === "sqlite") {
          return `"sqlite": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-sqlite", "path/to/your/database.db"]
    }`;
        } else if (server === "mongodb") {
          return `"mongodb": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-mongodb"],
      "env": {
        "MONGODB_URI": "\${MONGODB_URI}"
      }
    }`;
        }
        return "";
      })
      .filter(Boolean)
      .join(",\n    ")}
  }
}`
            : `// MCP servers configuration
// This file is only created when MCP servers are selected`,
        "CLAUDE.md": `# {{name}} - AI Assistant Context

## Project Overview

This is a {{framework}} project created with Precast CLI.

## Project Structure

${
  isMonorepo
    ? `Monorepo structure with:
- apps/web: ${config.framework} frontend application
- apps/api: ${config.backend} backend application  
- packages/shared: Shared types and utilities`
    : config.framework === "next" && config.backend === "next-api"
      ? `Next.js full-stack application with API routes`
      : `Single ${config.framework} frontend application`
}

## Technology Stack

- **Framework**: {{framework}}
{{#if (ne backend 'none')}}
- **Backend**: {{backend}}
{{/if}}
{{#if (ne database 'none')}}
- **Database**: {{database}}
{{/if}}
{{#if (ne orm 'none')}}
- **ORM**: {{orm}}
{{/if}}
- **Styling**: {{styling}}
{{#if uiLibrary}}
- **UI Library**: {{uiLibrary}}
{{/if}}
- **Language**: {{language}}
- **Package Manager**: {{packageManager}}
{{#if runtime}}
- **Runtime**: {{runtime}}
{{/if}}

## Development Guidelines

### Code Style
{{#if (eq language "TypeScript")}}
- Use TypeScript for all new code
- Prefer interfaces over types for object shapes
- Use strict mode TypeScript configuration
{{else}}
- Use modern JavaScript (ES2022+)
- Add JSDoc comments for better type hints
{{/if}}
{{#if (eq styling "tailwind")}}
- Use Tailwind CSS utility classes for styling
- Follow mobile-first responsive design
{{/if}}

### Best Practices
1. Keep components small and focused
2. Use proper error handling with try-catch blocks
3. Implement proper loading and error states
4. Follow accessibility guidelines (WCAG)
5. Write clean, self-documenting code

## Important Notes
- Always validate user input
- Sanitize data before rendering
- Use environment variables for sensitive configuration
- Follow the principle of least privilege for permissions
- Keep dependencies up to date for security`,
        ".claude/agents/code-reviewer.md": `---
name: code-reviewer
description: Reviews code against project standards and best practices
tools: Read, Grep, Glob
---

You are a code review specialist for the {{name}} project.

## Review Checklist

1. **Code Quality**
   - Clean, readable, and self-documenting code
   - Proper naming conventions (PascalCase for components, camelCase for functions)
   - No unnecessary complexity

2. **{{framework}} Best Practices**
{{#if (eq framework "react")}}
   - Functional components with hooks
   - Proper prop destructuring and typing
   - Memoization where appropriate (useMemo, useCallback)
{{else if (eq framework "vue")}}
   - Composition API with <script setup>
   - Proper prop validation
   - Reactive references used correctly
{{else if (eq framework "next")}}
   - Server/Client components used appropriately
   - Data fetching patterns followed
   - Proper use of Next.js features
{{/if}}

3. **TypeScript/JavaScript**
{{#if typescript}}
   - Proper type annotations (no \`any\` unless necessary)
   - Interfaces over type aliases for objects
   - Generic types used appropriately
{{else}}
   - JSDoc comments for better type hints
   - Consistent ES6+ syntax usage
{{/if}}

4. **Security**
   - Input validation implemented
   - No sensitive data exposed
   - XSS prevention measures in place

When reviewing, provide specific, actionable feedback with code examples where helpful.`,
        ".claude/agents/architecture-guide.md": `---
name: architecture-guide
description: Understands and guides on project architecture patterns
tools: Read, Glob, Grep, Task
---

You are an architecture specialist for the {{name}} project.

## Project Architecture

${
  isMonorepo
    ? `### Monorepo Structure
- **apps/web**: ${config.framework} frontend application
- **apps/api**: ${config.backend} backend API
- **packages/shared**: Shared types and utilities

### Key Principles
1. Separation of concerns between apps
2. Shared code in packages/shared
3. Type safety across boundaries
4. Independent deployment capability`
    : `### Application Structure
- **src/components**: Reusable UI components
- **src/pages**: Page/Route components
- **src/hooks**: Custom React hooks
- **src/utils**: Utility functions
- **src/services**: API service layer`
}

## Technology Decisions

- **Framework**: {{framework}} - ${
          config.framework === "react"
            ? "Component-based UI library"
            : config.framework === "vue"
              ? "Progressive JavaScript framework"
              : config.framework === "next"
                ? "Full-stack React framework"
                : "Modern web framework"
        }
{{#if backend}}
- **Backend**: {{backend}} - API and business logic
{{/if}}
{{#if database}}
- **Database**: {{database}} - Data persistence
{{/if}}
{{#if orm}}
- **ORM**: {{orm}} - Database abstraction layer
{{/if}}
- **Styling**: {{styling}} - Visual design system

## Design Patterns

1. **Component Patterns**
   - Container/Presentational separation
   - Composition over inheritance
   - Single responsibility principle

2. **State Management**
   - Local state for component-specific data
   - Global state for app-wide concerns
   - Server state for API data

3. **Error Handling**
   - Error boundaries for React components
   - Try-catch for async operations
   - Graceful degradation

When providing architecture guidance, ensure recommendations align with existing patterns.`,
        ".claude/agents/standards-enforcer.md": `---
name: standards-enforcer
description: Ensures coding standards and conventions are followed
tools: Read, Edit, MultiEdit, Grep
---

You are responsible for maintaining coding standards in {{name}}.

## Coding Standards

### Naming Conventions
- **Components**: PascalCase (e.g., UserProfile)
- **Functions/Methods**: camelCase (e.g., getUserData)
- **Constants**: UPPER_SNAKE_CASE (e.g., API_BASE_URL)
- **Files**: 
  - Components: PascalCase.{{#if typescript}}tsx{{else}}jsx{{/if}}
  - Utilities: camelCase.{{#if typescript}}ts{{else}}js{{/if}}

### Code Organization
1. **Import Order**:
   - External packages
   - Internal packages
   - Relative imports
   - Style imports

2. **File Structure**:
   - Imports at top
   - Type definitions (if TypeScript)
   - Main component/function
   - Helper functions
   - Exports at bottom

### {{styling}} Standards
{{#if (eq styling "tailwind")}}
- Use Tailwind utility classes
- Custom classes only when necessary
- Mobile-first responsive design
- Consistent spacing scale
{{else if (eq styling "css-modules")}}
- One CSS module per component
- BEM naming for classes
- Variables for colors and spacing
{{/if}}

### Quality Checks
- No console.log in production code
- Proper error handling
- Accessibility attributes (aria-labels, alt text)
- Performance optimizations applied

When enforcing standards, provide fixes along with explanations.`,
        ".claude/commands/review.md": `---
description: Review code changes against project standards
allowed-tools: Read, Grep, Glob
---

Review the code to ensure it follows {{name}} project standards.

## Review Process

1. **Read Project Context**
   - @CLAUDE.md for project overview
   - Check existing patterns in similar files

2. **Review Checklist**
   ✓ Code follows {{framework}} best practices
   ✓ {{#if typescript}}TypeScript types properly defined{{else}}JSDoc comments included{{/if}}
   ✓ Naming conventions followed
   ✓ Error handling implemented
   ✓ Security considerations addressed
   ✓ Performance optimizations applied
   ✓ Accessibility requirements met

3. **Provide Feedback**
   - Specific issues found
   - Suggested improvements
   - Examples of correct patterns

Use the code-reviewer agent for detailed analysis:
$ARGUMENTS`,
        ".claude/commands/implement.md": `---
description: Implement features following project patterns
allowed-tools: Read, Write, Edit, MultiEdit, Task
---

Implement the requested feature for {{name}} following established patterns.

## Implementation Process

1. **Understand Context**
   - Read @CLAUDE.md for project guidelines
   - Study existing similar implementations
   - Check packages/shared for types (if monorepo)

2. **Plan Implementation**
   - Break down into smaller tasks
   - Identify affected files
   - Consider edge cases

3. **Write Code**
   - Follow {{framework}} patterns
   - Use {{styling}} for UI styling
   {{#if typescript}}
   - Add proper TypeScript types
   {{/if}}
   - Include error handling
   - Add comments for complex logic

4. **Verify**
   - Code compiles without errors
   - Follows project conventions
   - Handles edge cases

Use the architecture-guide agent for structural decisions:
$ARGUMENTS`,
        ".claude/commands/refactor.md": `---
description: Refactor code using project conventions
allowed-tools: Read, Edit, MultiEdit, Glob
---

Refactor the specified code to improve quality and maintainability.

## Refactoring Guidelines

1. **Analyze Current Code**
   - Identify code smells
   - Find repeated patterns
   - Check performance issues

2. **Apply Refactoring**
   - Extract reusable functions
   - Simplify complex logic
   - Improve naming
   - Add type safety
   - Reduce duplication

3. **Maintain Behavior**
   - Ensure functionality unchanged
   - Keep existing API contracts
   - Preserve test coverage

4. **{{framework}} Specific**
{{#if (eq framework "react")}}
   - Extract custom hooks
   - Optimize re-renders
   - Use composition patterns
{{else if (eq framework "vue")}}
   - Extract composables
   - Optimize reactivity
   - Use component slots
{{/if}}

Use the standards-enforcer agent to ensure compliance:
$ARGUMENTS`,
        ".claude/commands/explain.md": `---
description: Explain architecture decisions and code patterns
allowed-tools: Read, Grep, Glob
---

Explain the code structure and architectural decisions in {{name}}.

## Explanation Areas

1. **Project Structure**
   - Why this architecture was chosen
   - Benefits of the current setup
   - Trade-offs made

2. **Technology Choices**
   - Why {{framework}} for the frontend
   {{#if backend}}
   - Why {{backend}} for the API
   {{/if}}
   {{#if database}}
   - Why {{database}} for data storage
   {{/if}}

3. **Design Patterns**
   - Component architecture
   - State management approach
   - API communication patterns

4. **Best Practices**
   - Security measures
   - Performance optimizations
   - Scalability considerations

Provide clear, educational explanations with examples from the codebase.

Use the architecture-guide agent for detailed insights:
$ARGUMENTS`,
        ".claude/hooks/enforce-package-manager.sh": `#!/usr/bin/env bash
# Package Manager Enforcement Hook (PreToolUse)
# Ensures correct package manager usage based on project configuration

set -euo pipefail

INPUT=$(cat)
TOOL_NAME=$(echo "$INPUT" | jq -r '.tool_name // ""')

if [[ "$TOOL_NAME" != "Bash" ]]; then
  exit 0
fi

COMMAND=$(echo "$INPUT" | jq -r '.tool_input.command // ""')

if [[ -z "$COMMAND" ]]; then
  exit 0
fi

get_configured_package_manager() {
  local config_file="precast.jsonc"
  
  if [[ ! -f "$config_file" ]]; then
    echo "{{packageManager}}"
    return
  fi
  
  local pm=$(cat "$config_file" | grep -E '"packageManager"' | sed -E 's/.*"packageManager"[[:space:]]*:[[:space:]]*"([^"]+)".*/\\1/' | head -1)
  
  if [[ -n "$pm" ]]; then
    echo "$pm"
    return
  fi
  
  echo "{{packageManager}}"
}

CONFIGURED_PM=$(get_configured_package_manager)

# Check for incorrect package manager usage and provide corrections
exit 0`,
        ".claude/hooks/security-scanner.sh": `#!/usr/bin/env bash
# Security Scanner Hook (PreToolUse)
# Checks for exposed secrets and validates sensitive files

set -euo pipefail

INPUT=$(cat)
TOOL_NAME=$(echo "$INPUT" | jq -r '.tool_name // ""')

if [[ "$TOOL_NAME" != "Bash" ]]; then
  exit 0
fi

COMMAND=$(echo "$INPUT" | jq -r '.tool_input.command // ""')

if [[ -z "$COMMAND" ]]; then
  exit 0
fi

# Check for sensitive file operations
if echo "$COMMAND" | grep -qE "^(cat|echo|printf|print).*\\.(env|key|pem)"; then
  if echo "$COMMAND" | grep -qE "\\.env\\.example|\\.env\\.sample|\\.env\\.template"; then
    exit 0
  fi
  
  echo "Error: Attempting to display sensitive file content" >&2
  echo "Use caution when working with sensitive files." >&2
  exit 2
fi

# Check for git operations with sensitive files
if echo "$COMMAND" | grep -qE "^git (add|commit|push)"; then
  SENSITIVE_FILES=(".env" ".env.local" "*.key" "*.pem")
  
  for file_pattern in "\${SENSITIVE_FILES[@]}"; do
    if echo "$COMMAND" | grep -qE "$file_pattern"; then
      echo "Error: Attempting to commit sensitive file: $file_pattern" >&2
      echo "Add this file to .gitignore instead." >&2
      exit 2
    fi
  done
fi

exit 0`,
        ".claude/hooks/lint-check.sh": `#!/usr/bin/env bash
# Lint Check Hook (PostToolUse)
# Runs linting and formatting checks after file modifications

set -euo pipefail

INPUT=$(cat)
TOOL_NAME=$(echo "$INPUT" | jq -r '.tool_name // ""')
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // ""')

if [[ -z "$FILE_PATH" ]]; then
  exit 0
fi

# Check file extension
EXT="\${FILE_PATH##*.}"

case "$EXT" in
  ts|tsx|js|jsx)
    {{#if eslint}}
    # Run ESLint
    if command -v eslint &> /dev/null; then
      eslint --fix "$FILE_PATH" 2>/dev/null || true
    fi
    {{/if}}
    
    {{#if prettier}}
    # Run Prettier
    if command -v prettier &> /dev/null; then
      prettier --write "$FILE_PATH" 2>/dev/null || true
    fi
    {{/if}}
    ;;
  css|scss|less)
    {{#if prettier}}
    # Run Prettier for CSS files
    if command -v prettier &> /dev/null; then
      prettier --write "$FILE_PATH" 2>/dev/null || true
    fi
    {{/if}}
    ;;
esac

exit 0`,
      },
      copilot: {
        ".github/copilot-instructions.md": `# GitHub Copilot Instructions for {{name}}

## Project Context
You are working on a {{framework}} application{{#if uiLibrary}} that uses {{uiLibrary}} for UI components{{/if}}.

## Technology Stack
- Framework: {{framework}}
- Language: {{language}}
- Package Manager: {{packageManager}}
{{#if styling}}- Styling: {{styling}}{{/if}}
{{#if uiLibrary}}- UI Library: {{uiLibrary}}{{/if}}
{{#if database}}- Database: {{database}}{{/if}}
{{#if orm}}- ORM: {{orm}}{{/if}}

## Code Generation Rules

### General Rules
{{#if (eq language "TypeScript")}}
- Always use TypeScript with proper type annotations
- Avoid using \`any\` type
- Prefer \`interface\` over \`type\` for object shapes
{{else}}
- Use modern JavaScript syntax (ES2022+)
- Include JSDoc comments for better type inference
{{/if}}
- Follow functional programming principles where applicable
- Prefer composition over inheritance

{{#if (eq framework "react")}}
### React Specific
- Use functional components with hooks
- Prefer named exports for components
- Use proper prop destructuring
- Implement proper error boundaries
- Follow React best practices for performance (useMemo, useCallback)
{{else if (eq framework "vue")}}
### Vue Specific
- Use Composition API with \`<script setup>\`
- Use TypeScript for all components
- Follow Vue 3 best practices
- Use proper prop validation
{{else if (eq framework "next")}}
### Next.js Specific
- Use App Router patterns
- Implement proper loading and error states
- Use Server Components where appropriate
- Follow Next.js best practices for performance
{{/if}}

## File Naming Conventions
{{#if (eq framework "react")}}
- Components: \`PascalCase.tsx\` (e.g., \`UserProfile.tsx\`)
- Hooks: \`camelCase.ts\` starting with \`use\` (e.g., \`useAuth.ts\`)
- Utilities: \`camelCase.ts\` (e.g., \`formatDate.ts\`)
{{else if (eq framework "vue")}}
- Components: \`PascalCase.vue\` (e.g., \`UserProfile.vue\`)
- Composables: \`camelCase.ts\` starting with \`use\` (e.g., \`useAuth.ts\`)
- Utilities: \`camelCase.ts\` (e.g., \`formatDate.ts\`)
{{/if}}

## Security Best Practices
- Validate all user inputs
- Sanitize data before rendering
- Use HTTPS for all external requests
- Implement proper authentication checks
- Never expose sensitive data in client code`,
      },
      cursor: {
        ".cursorrules": `# Cursor AI Rules for {{projectName}}

## Project Context
This is a {{framework}} project{{#if typescript}} with TypeScript{{/if}}{{#if (ne backend 'none')}} and {{backend}} backend{{/if}}{{#if (ne database 'none')}} using {{database}} database{{#if (ne orm 'none')}} with {{orm}}{{/if}}{{/if}}.

## Tech Stack
- **Framework**: {{framework}}
- **Language**: {{language}}
{{#if (ne backend 'none')}}
- **Backend**: {{backend}}
{{/if}}
{{#if (ne database 'none')}}
- **Database**: {{database}}
{{/if}}
{{#if (ne orm 'none')}}
- **ORM**: {{orm}}
{{/if}}
- **Styling**: {{styling}}
{{#if uiLibrary}}
- **UI Library**: {{uiLibrary}}
{{/if}}

## Coding Preferences
- Always use {{language}}
- Follow the existing code style and patterns
- Use modern ES6+ features
- Prefer functional components in React
{{#if (eq styling 'tailwind')}}
- Use Tailwind CSS for styling
{{/if}}
{{#if uiLibrary}}
- Use {{uiLibrary}} components when possible
{{/if}}

## Best Practices
- Write clean, readable code
- Add proper error handling
- Include JSDoc comments for functions
- Use semantic HTML elements
- Ensure accessibility (a11y) compliance
{{#if typescript}}
- Always provide proper TypeScript types
- Avoid using \`any\` type
{{/if}}

## Security
- Validate all user inputs
- Sanitize data before database operations
- Use environment variables for sensitive data
- Implement proper authentication and authorization`,
      },
      gemini: {
        "gemini.md": `# {{name}} - Gemini AI Context

## Project Information
- **Name**: {{name}}
- **Type**: {{framework}} Application
- **Primary Language**: {{language}}
- **Package Manager**: {{packageManager}}

## Architecture Overview
This is a modern {{framework}} application with the following architecture:

### Technology Stack
| Layer | Technology |
|-------|------------|
| Frontend Framework | {{framework}} |
| Language | {{language}} |
{{#if styling}}| Styling | {{styling}} |{{/if}}
{{#if uiLibrary}}| UI Components | {{uiLibrary}} |{{/if}}
{{#if database}}| Database | {{database}} |{{/if}}
{{#if orm}}| ORM/Query Builder | {{orm}} |{{/if}}
| Package Manager | {{packageManager}} |

## Development Patterns

{{#if (eq styling "tailwind")}}
### Styling Approach
- Use Tailwind CSS utility classes
- Mobile-first responsive design
- Custom classes only when necessary
- Example: \`<div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-md">\`
{{/if}}

## Coding Standards

### TypeScript Usage
{{#if (eq language "TypeScript")}}
- Enable strict mode
- Define interfaces for all props
- Avoid \`any\` type
- Use proper generics
{{/if}}

## Best Practices

### Performance
1. Lazy load components and routes
2. Optimize images and assets
3. Minimize bundle size
4. Use proper memoization

### Security
1. Input validation on all user data
2. Output encoding to prevent XSS
3. Use environment variables for secrets
4. Implement proper authentication
5. Follow OWASP guidelines

### Accessibility
1. Semantic HTML elements
2. Proper ARIA labels
3. Keyboard navigation support
4. Screen reader compatibility
5. Color contrast compliance`,
      },
    };

    const documentationTemplates: { [key: string]: string } = {
      "docs/ai/SPEC.md": `# {{name}} - Technical Specification

## Project Overview

_[Provide a brief technical overview of the project]_

## Architecture

### Application Structure

_[Describe the high-level architecture and folder structure]_

\`\`\`
{{name}}/
├── src/           # _[Source code]_
├── public/        # _[Static assets]_
├── tests/         # _[Test files]_
└── ...            # _[Other directories]_
\`\`\`

### Technology Stack

| Component | Technology | Version |
|-----------|------------|---------|
| Frontend | {{framework}} | _[Version]_ |
{{#if (ne backend 'none')}}| Backend | {{backend}} | _[Version]_ |{{/if}}
{{#if (ne database 'none')}}| Database | {{database}} | _[Version]_ |{{/if}}
{{#if (ne orm 'none')}}| ORM/ODM | {{orm}} | _[Version]_ |{{/if}}
| Styling | {{styling}} | _[Version]_ |
{{#if uiLibrary}}| UI Library | {{uiLibrary}} | _[Version]_ |{{/if}}
{{#if auth}}| Authentication | {{auth}} | _[Version]_ |{{/if}}
| Package Manager | {{packageManager}} | _[Version]_ |
| Language | {{#if typescript}}TypeScript{{else}}JavaScript{{/if}} | _[Version]_ |

## Technical Requirements

### Performance Requirements
- _[Define initial page load target]_
- _[Define route transition target]_
- _[Define API response time target]_
- _[Define bundle size limit]_

### Browser Support
- _[List supported browsers and versions]_

### Security Requirements
- _[Define security requirement 1]_
- _[Define security requirement 2]_
- _[Define security requirement 3]_
- _[Define security requirement 4]_

## API Specifications

{{#if (ne backend 'none')}}
### API Design

Base URL: _[Define base URL]_

#### Endpoint Structure
\`\`\`
METHOD /resource
METHOD /resource/:id
METHOD /resource/:id/sub-resource
\`\`\`

#### Example Endpoints
- \`GET /example\` - _[Description]_
- \`POST /example\` - _[Description]_
- \`PUT /example/:id\` - _[Description]_
- \`DELETE /example/:id\` - _[Description]_

### Response Format
\`\`\`json
{
  "data": "_[Response data structure]_",
  "meta": "_[Metadata if applicable]_"
}
\`\`\`
{{else}}
_No backend API - frontend only application_
{{/if}}

## Database Schema

{{#if (ne database 'none')}}
### Database Design

#### Example Table Structure
\`\`\`sql
-- Example table definition
CREATE TABLE table_name (
  id _[PRIMARY KEY TYPE]_,
  field1 _[TYPE AND CONSTRAINTS]_,
  field2 _[TYPE AND CONSTRAINTS]_,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
\`\`\`

_[Add additional tables and relationships as needed]_
{{else}}
_No database required - frontend only application_
{{/if}}

## Deployment

### Environment Configuration
- **Development**: _[Define dev environment]_
- **Staging**: _[Define staging environment]_
- **Production**: _[Define production environment]_

### CI/CD Pipeline
1. _[Define step 1]_
2. _[Define step 2]_
3. _[Define step 3]_
4. _[Define step 4]_
5. _[Define step 5]_

## Testing Strategy

### Unit Tests
- _[Define unit test approach]_
- _[Define what to test]_
- _[Define test coverage goals]_

### Integration Tests
- _[Define integration test approach]_
- _[Define integration scenarios]_
- _[Define test environments]_

### Performance Testing
- _[Define performance test approach]_
- _[Define performance benchmarks]_
- _[Define monitoring strategy]_

## Monitoring and Logging

### Application Monitoring
- _[Define monitoring approach]_
- _[Define metrics to track]_
- _[Define alerting rules]_
- _[Define monitoring tools]_

### Logging Strategy
- _[Define logging approach]_
- _[Define log levels]_
- _[Define log storage]_
- _[Define retention policy]_

## Security Considerations

### Authentication & Authorization
{{#if auth}}
- **Auth Provider**: {{auth}}
- _[Define authentication flow]_
- _[Define authorization strategy]_
- _[Define session management]_
{{else}}
- _[Define authentication approach]_
- _[Define authorization approach]_
{{/if}}

### Data Protection
- _[Define data protection measures]_
- _[Define input validation]_
- _[Define encryption strategy]_
- _[Define compliance requirements]_

### Infrastructure Security
- _[Define infrastructure security measures]_
- _[Define network security]_
- _[Define audit procedures]_
- _[Define incident response]_

## Additional Resources
- _[Add relevant documentation links]_
- _[Add relevant tutorials or guides]_
- _[Add team documentation]_
- _[Add architectural decision records]_`,

      "docs/ai/PRD.md": `# {{name}} - Product Requirements Document

## Product Overview

### Vision Statement
_[Describe the overall vision and purpose of the application]_

### Target Audience
- **Primary Users**: _[Define primary user group]_
- **Secondary Users**: _[Define secondary user group]_
- **Technical Users**: _[Define technical stakeholders]_

## Business Objectives

### Primary Goals
1. _[Define primary business goal]_
2. _[Define secondary business goal]_
3. _[Define tertiary business goal]_
4. _[Define additional goals as needed]_

### Success Metrics
- _[Define key metric 1]_
- _[Define key metric 2]_
- _[Define key metric 3]_
- _[Define key metric 4]_

## Features and Requirements

### Core Features

#### Feature Category 1
- **Feature 1.1**: _[Description]_
- **Feature 1.2**: _[Description]_
- **Feature 1.3**: _[Description]_
- **Feature 1.4**: _[Description]_

#### Feature Category 2
- **Feature 2.1**: _[Description]_
- **Feature 2.2**: _[Description]_
- **Feature 2.3**: _[Description]_
- **Feature 2.4**: _[Description]_

### Technical Requirements

#### Frontend Stack
- **Framework**: {{framework}}
- **Styling**: {{styling}}
{{#if uiLibrary}}- **UI Library**: {{uiLibrary}}{{/if}}
{{#if typescript}}- **Language**: TypeScript{{else}}- **Language**: JavaScript{{/if}}
- **Additional Requirements**: _[Add specific frontend requirements]_

#### Backend Stack
{{#if (ne backend 'none')}}
- **Framework**: {{backend}}
{{#if auth}}- **Authentication**: {{auth}}{{/if}}
- **Additional Requirements**: _[Add specific backend requirements]_
{{else}}
- **Backend**: Not applicable (frontend-only application)
{{/if}}

#### Data Layer
{{#if (ne database 'none')}}
- **Database**: {{database}}
{{#if (ne orm 'none')}}- **ORM/ODM**: {{orm}}{{/if}}
- **Additional Requirements**: _[Add specific database requirements]_
{{else}}
- **Database**: Not applicable
{{/if}}

## User Stories

### Epic 1: _[Epic Title]_
**_[Epic Description]_**

- **US001**: _[User story description]_
  - Acceptance Criteria:
    - _[Criterion 1]_
    - _[Criterion 2]_
    - _[Criterion 3]_

- **US002**: _[User story description]_
  - Acceptance Criteria:
    - _[Criterion 1]_
    - _[Criterion 2]_
    - _[Criterion 3]_

### Epic 2: _[Epic Title]_
**_[Epic Description]_**

- **US003**: _[User story description]_
  - Acceptance Criteria:
    - _[Criterion 1]_
    - _[Criterion 2]_
    - _[Criterion 3]_

## Design and User Experience

### Design Principles
1. _[Define design principle 1]_
2. _[Define design principle 2]_
3. _[Define design principle 3]_
4. _[Define design principle 4]_

### User Interface Guidelines
- **Color Scheme**: _[Define color palette]_
- **Typography**: _[Define font choices]_
- **Layout**: _[Define layout approach]_
- **Interactions**: _[Define interaction patterns]_

### Mobile Experience
- _[Define mobile strategy]_
- _[Define touch optimization]_
- _[Define performance requirements]_
- _[Define offline capabilities]_

## Technical Constraints

### Browser Support
- _[Define supported browsers]_
- _[Define mobile browser support]_
- _[Define legacy browser strategy]_

### Performance Requirements
- **Loading Time**: _[Define target]_
- **Bundle Size**: _[Define limit]_
- **Memory Usage**: _[Define constraints]_
- **Network**: _[Define requirements]_

### Security Requirements
- **Data Protection**: _[Define approach]_
- **Input Validation**: _[Define strategy]_
- **Authentication**: _[Define method]_
- **Privacy**: _[Define compliance needs]_

## Development and Deployment

### Technology Stack
- **Frontend**: {{framework}} with {{#if typescript}}TypeScript{{else}}JavaScript{{/if}}
- **Styling**: {{styling}}{{#if uiLibrary}} + {{uiLibrary}}{{/if}}
{{#if (ne backend 'none')}}
- **Backend**: {{backend}}
{{/if}}
{{#if (ne database 'none')}}
- **Database**: {{database}}{{#if (ne orm 'none')}} with {{orm}}{{/if}}
{{/if}}
- **Package Manager**: {{packageManager}}

### Development Workflow
1. **Version Control**: Git with feature branches
2. **Code Review**: Pull request reviews required
3. **Testing**: Automated unit and integration tests
4. **CI/CD**: Automated build and deployment pipeline

### Deployment Strategy
- **Environments**: _[Define environments]_
- **Monitoring**: _[Define monitoring approach]_
- **Logging**: _[Define logging strategy]_
- **Backup**: _[Define backup procedures]_

## Risk Management

### Technical Risks
- **Risk 1**: _[Description and impact]_
- **Risk 2**: _[Description and impact]_
- **Risk 3**: _[Description and impact]_
- **Risk 4**: _[Description and impact]_

### Mitigation Strategies
- **Strategy 1**: _[Mitigation approach]_
- **Strategy 2**: _[Mitigation approach]_
- **Strategy 3**: _[Mitigation approach]_
- **Strategy 4**: _[Mitigation approach]_

## Timeline and Milestones

### Phase 1: _[Phase Name]_ (_[Duration]_)
- _[Deliverable 1]_
- _[Deliverable 2]_
- _[Deliverable 3]_

### Phase 2: _[Phase Name]_ (_[Duration]_)
- _[Deliverable 1]_
- _[Deliverable 2]_
- _[Deliverable 3]_

### Phase 3: _[Phase Name]_ (_[Duration]_)
- _[Deliverable 1]_
- _[Deliverable 2]_
- _[Deliverable 3]_

### Phase 4: _[Phase Name]_ (_[Duration]_)
- _[Deliverable 1]_
- _[Deliverable 2]_
- _[Deliverable 3]_

## Appendix

### Technology Stack Reference

| Component | Technology | Version |
|-----------|------------|---------|  
| Frontend | {{framework}} | _[Version]_ |
{{#if (ne backend 'none')}}| Backend | {{backend}} | _[Version]_ |{{/if}}
{{#if (ne database 'none')}}| Database | {{database}} | _[Version]_ |{{/if}}
{{#if (ne orm 'none')}}| ORM/ODM | {{orm}} | _[Version]_ |{{/if}}
| Styling | {{styling}} | _[Version]_ |
{{#if uiLibrary}}| UI Library | {{uiLibrary}} | _[Version]_ |{{/if}}
{{#if auth}}| Authentication | {{auth}} | _[Version]_ |{{/if}}
| Package Manager | {{packageManager}} | _[Version]_ |
| Language | {{#if typescript}}TypeScript{{else}}JavaScript{{/if}} | _[Version]_ |

### Additional Resources
- _[Add relevant documentation links]_
- _[Add relevant tutorials or guides]_
- _[Add team documentation]_
- _[Add architectural decision records]_`,
    };

    const template = templates[aiId]?.[filePath] || documentationTemplates[filePath];
    if (!template) {
      return `# ${filePath}\n\n// Content will be generated by Precast CLI`;
    }

    return processTemplate(template, config);
  };

  /**
   * Builds a tree structure of files for the selected AI assistant
   * @param aiId - ID of the selected AI assistant
   * @returns Array of FileTreeNode representing the file structure
   */
  const buildFileTree = (aiId: string): FileTreeNode[] => {
    const ai = aiAssistants.find((a) => a.id === aiId);
    if (!ai || !ai.files) return [];

    const allFiles = [...ai.files];
    if (config.generateSpec ?? true) {
      allFiles.push("docs/ai/SPEC.md");
    }
    if (config.generatePrd ?? true) {
      allFiles.push("docs/ai/PRD.md");
    }

    const filteredFiles = allFiles.filter((file) => {
      if (file === ".claude/mcp.json") {
        return config.mcpServers && config.mcpServers.length > 0;
      }
      return true;
    });

    const tree: FileTreeNode[] = [];
    const nodeMap = new Map<string, FileTreeNode>();

    filteredFiles.forEach((filePath) => {
      const parts = filePath.split("/");
      let currentPath = "";

      parts.forEach((part, index) => {
        const parentPath = currentPath;
        currentPath = currentPath ? `${currentPath}/${part}` : part;

        if (!nodeMap.has(currentPath)) {
          const node: FileTreeNode = {
            name: part,
            type: index === parts.length - 1 ? "file" : "folder",
            path: currentPath,
            children: index === parts.length - 1 ? undefined : [],
          };

          nodeMap.set(currentPath, node);

          if (parentPath) {
            const parent = nodeMap.get(parentPath);
            if (parent && parent.children) {
              parent.children.push(node);
            }
          } else {
            tree.push(node);
          }
        }
      });
    });

    return tree;
  };

  /**
   * Recursively renders the file tree structure as JSX
   * @param nodes - Array of FileTreeNode to render
   * @param level - Current nesting level for indentation
   * @returns Array of JSX elements representing the tree
   */
  const renderFileTree = (nodes: FileTreeNode[], level = 0): React.JSX.Element[] => {
    return nodes.map((node) => {
      const isHook = node.path.includes(".claude/hooks/");
      const isAgent = node.path.includes(".claude/agents/");
      const isCommand = node.path.includes(".claude/commands/");
      const isDoc = node.path.includes("docs/ai/");

      let fileColor = "text-comic-black";
      // let _bgHover = "hover:bg-comic-green/20";

      if (isHook) {
        fileColor = "text-comic-red";
        // _bgHover = "hover:bg-comic-red/20";
      } else if (isAgent) {
        fileColor = "text-comic-blue";
        // _bgHover = "hover:bg-comic-blue/20";
      } else if (isCommand) {
        fileColor = "text-comic-orange";
        // _bgHover = "hover:bg-comic-orange/20";
      } else if (isDoc) {
        fileColor = "text-comic-purple";
        // _bgHover = "hover:bg-comic-purple/20";
      }

      return (
        <div key={node.path} style={{ marginLeft: `${level * 16}px` }}>
          {node.type === "folder" ? (
            <>
              <button
                onClick={() => toggleFolder(node.path)}
                className={`flex items-center gap-2 w-full text-left p-2 rounded transition-colors ${
                  expandedFolders.has(node.path) ? "bg-comic-gray/20" : "hover:bg-comic-gray/10"
                }`}
              >
                {expandedFolders.has(node.path) ? (
                  <BuilderIcon icon={FaFolderOpen} className="text-comic-blue text-sm" />
                ) : (
                  <BuilderIcon icon={FaFolder} className="text-comic-blue text-sm" />
                )}
                <span className="font-comic text-sm text-comic-black">{node.name}/</span>
                {expandedFolders.has(node.path) ? (
                  <BuilderIcon icon={FaChevronDown} className="text-xs ml-auto text-comic-gray" />
                ) : (
                  <BuilderIcon icon={FaChevronRight} className="text-xs ml-auto text-comic-gray" />
                )}
              </button>
              {expandedFolders.has(node.path) && node.children && (
                <div className="mt-1">{renderFileTree(node.children, level + 1)}</div>
              )}
            </>
          ) : (
            <>
              <button
                onClick={() => toggleFile(node.path)}
                className={`flex items-center gap-2 w-full text-left p-2 rounded transition-colors ${
                  expandedFiles[node.path] ? "bg-comic-gray/20" : "hover:bg-comic-gray/10"
                }`}
              >
                <BuilderIcon icon={FaFile} className={`${fileColor} text-sm`} />
                <span className="font-comic text-xs text-comic-black">
                  {node.name}
                  {isHook && (
                    <span className="ml-2 text-[9px] text-comic-red opacity-60">HOOK</span>
                  )}
                  {isAgent && (
                    <span className="ml-2 text-[9px] text-comic-blue opacity-60">AGENT</span>
                  )}
                  {isCommand && (
                    <span className="ml-2 text-[9px] text-comic-orange opacity-60">CMD</span>
                  )}
                  {isDoc && (
                    <span className="ml-2 text-[9px] text-comic-purple opacity-60">DOC</span>
                  )}
                </span>
                {expandedFiles[node.path] ? (
                  <BuilderIcon icon={FaChevronDown} className="text-xs ml-auto text-comic-gray" />
                ) : (
                  <BuilderIcon icon={FaChevronRight} className="text-xs ml-auto text-comic-gray" />
                )}
              </button>
              {expandedFiles[node.path] && (
                <div className="mt-2 ml-4 p-4 rounded bg-gray-50 border border-gray-200">
                  <pre className="text-xs font-mono text-gray-700 whitespace-pre-wrap overflow-x-auto">
                    {getFileContent(node.path, config.aiAssistant!)}
                  </pre>
                </div>
              )}
            </>
          )}
        </div>
      );
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.6 }}
    >
      <CollapsibleSection
        icon={<BuilderIcon icon={FaBrain} className="text-3xl" />}
        title={<h3 className="font-display text-2xl">AI ASSISTANCE</h3>}
        className="bg-comic-purple text-comic-white"
      >
        <p className="font-comic text-sm mb-4 text-comic-white/90">
          Supercharge your development - integrate AI coding assistants for smarter, faster coding
        </p>
        <div className="grid grid-cols-1 min-[320px]:grid-cols-2 gap-2 sm:gap-3">
          {aiAssistants.map((ai) => (
            <button
              key={ai.id}
              onClick={() => setConfig({ ...config, aiAssistant: ai.id })}
              data-active={config.aiAssistant === ai.id}
              className={`filter-btn-comic flex items-center justify-center gap-2 ${
                config.aiAssistant === ai.id
                  ? "bg-comic-yellow text-comic-black"
                  : "bg-comic-white text-comic-black hover:bg-comic-yellow"
              }`}
              title={ai.description}
            >
              {ai.icon &&
                (typeof ai.icon === "string" ? (
                  <PublicIcon name={ai.icon} className="text-2xl" />
                ) : (
                  <BuilderIcon icon={ai.icon} className="text-2xl" />
                ))}
              <span className="text-xs">{ai.name}</span>
            </button>
          ))}
        </div>
        {config.aiAssistant && config.aiAssistant !== "none" && (
          <div className="mt-3 p-3 bg-comic-white/20 rounded-lg">
            <p className="text-xs font-comic">
              {aiAssistants.find((ai) => ai.id === config.aiAssistant)?.description}
            </p>

            {/* Documentation Options - Comic Style */}
            <div className="mt-4">
              <div
                className="comic-panel bg-comic-yellow p-3 border-2 border-comic-black"
                style={{ boxShadow: "3px 3px 0 var(--comic-black)" }}
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                  <h4 className="font-display text-sm text-comic-black flex items-center gap-2">
                    <BuilderIcon icon={FaFileAlt} className="text-comic-red" />
                    AI DOCUMENTATION
                  </h4>
                  <button
                    onClick={() => {
                      const bothEnabled =
                        (config.generateSpec ?? true) && (config.generatePrd ?? true);
                      setConfig({
                        ...config,
                        generateSpec: !bothEnabled,
                        generatePrd: !bothEnabled,
                      });
                    }}
                    className={`px-2 py-1 rounded-lg font-comic text-xs border-2 border-comic-black transition-all self-start sm:self-auto ${
                      (config.generateSpec ?? true) || (config.generatePrd ?? true)
                        ? "bg-comic-green text-comic-white"
                        : "bg-comic-white text-comic-black"
                    }`}
                    style={{ boxShadow: "2px 2px 0 var(--comic-black)" }}
                  >
                    {(config.generateSpec ?? true) || (config.generatePrd ?? true)
                      ? "ENABLED"
                      : "DISABLED"}
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() =>
                      setConfig({ ...config, generateSpec: !(config.generateSpec ?? true) })
                    }
                    className={`p-2 rounded-lg border-2 border-comic-black transition-all ${
                      (config.generateSpec ?? true)
                        ? "bg-comic-blue text-comic-white"
                        : "bg-comic-white text-comic-black hover:bg-comic-blue/10"
                    }`}
                    style={{ boxShadow: "2px 2px 0 var(--comic-black)" }}
                  >
                    <div className="flex flex-col items-center gap-1">
                      <BuilderIcon icon={FaFileAlt} className="text-lg" />
                      <span className="font-comic text-xs font-bold">SPEC.md</span>
                      <span className="font-comic text-[10px]">Technical</span>
                    </div>
                  </button>

                  <button
                    onClick={() =>
                      setConfig({ ...config, generatePrd: !(config.generatePrd ?? true) })
                    }
                    className={`p-2 rounded-lg border-2 border-comic-black transition-all ${
                      (config.generatePrd ?? true)
                        ? "bg-comic-orange text-comic-white"
                        : "bg-comic-white text-comic-black hover:bg-comic-orange/10"
                    }`}
                    style={{ boxShadow: "2px 2px 0 var(--comic-black)" }}
                  >
                    <div className="flex flex-col items-center gap-1">
                      <BuilderIcon icon={FaClipboardList} className="text-lg" />
                      <span className="font-comic text-xs font-bold">PRD.md</span>
                      <span className="font-comic text-[10px]">Product</span>
                    </div>
                  </button>
                </div>

                <div className="mt-2 p-2 bg-comic-white/80 rounded border border-comic-black">
                  <p className="font-comic text-[10px] text-comic-black text-center">
                    Generate comprehensive project documentation for AI assistants
                  </p>
                </div>
              </div>
            </div>

            {aiAssistants.find((ai) => ai.id === config.aiAssistant)?.files && (
              <div className="mt-4">
                <div className="bg-comic-gray/10 p-4 border-2 border-comic-gray rounded-lg">
                  <div
                    className="flex items-center justify-between cursor-pointer select-none"
                    onClick={() => setIsGeneratedFilesExpanded(!isGeneratedFilesExpanded)}
                  >
                    <h4 className="font-display text-lg text-comic-black flex items-center gap-2">
                      <BuilderIcon icon={FaFolder} className="text-comic-blue" />
                      Generated Files
                    </h4>
                    <div className="flex items-center gap-2">
                      {config.aiAssistant === "claude" && (
                        <div className="flex items-center gap-1 text-xs text-comic-gray">
                          <span>Hooks</span>
                          <span>•</span>
                          <span>Agents</span>
                          <span>•</span>
                          <span>Commands</span>
                        </div>
                      )}
                      {config.aiAssistant === "copilot" && (
                        <span className="text-xs text-comic-gray">Instructions</span>
                      )}
                      {config.aiAssistant === "cursor" && (
                        <span className="text-xs text-comic-gray">Rules</span>
                      )}
                      {config.aiAssistant === "gemini" && (
                        <span className="text-xs text-comic-gray">Context</span>
                      )}
                      <button
                        className="p-1 rounded hover:bg-comic-gray/20 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsGeneratedFilesExpanded(!isGeneratedFilesExpanded);
                        }}
                      >
                        <BuilderIcon
                          icon={isGeneratedFilesExpanded ? FaChevronDown : FaChevronRight}
                          className="text-comic-gray text-sm"
                        />
                      </button>
                    </div>
                  </div>
                  {isGeneratedFilesExpanded && (
                    <div className="mt-4">
                      <div className="bg-white rounded-lg p-4 border border-comic-gray/30 overflow-auto max-h-96">
                        {renderFileTree(buildFileTree(config.aiAssistant!))}
                      </div>
                      <div className="mt-3 p-2 bg-comic-blue/10 rounded text-center">
                        <p className="font-comic text-xs text-comic-gray">
                          Click files to preview their content
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </CollapsibleSection>
    </motion.div>
  );
};

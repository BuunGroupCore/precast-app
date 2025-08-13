import { motion } from "framer-motion";
import React, { useState } from "react";
import {
  FaBrain,
  FaChevronDown,
  FaChevronRight,
  FaFile,
  FaFolder,
  FaFolderOpen,
  FaToggleOff,
  FaToggleOn,
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

export const AIAssistanceSection: React.FC<AIAssistanceSectionProps> = ({ config, setConfig }) => {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  const [expandedFiles, setExpandedFiles] = useState<{ [key: string]: boolean }>({});

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

  const processTemplate = (template: string, config: ExtendedProjectConfig) => {
    /** Simple Handlebars-like template processing */
    let processed = template;

    /** Replace basic variables */
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

    /** Process conditionals
     * {{#if variable}}content{{/if}}
     */
    processed = processed.replace(
      /\{\{#if\s+(\w+)\}\}([\s\S]*?)\{\{\/if\}\}/g,
      (_match, variable, content) => {
        const value = getConfigValue(variable, config);
        return value && value !== "none" && value !== "false" ? content : "";
      }
    );

    /** {{#if (eq variable "value")}}content{{/if}} */
    processed = processed.replace(
      /\{\{#if\s+\(eq\s+(\w+)\s+"([^"]+)"\)\}\}([\s\S]*?)\{\{\/if\}\}/g,
      (_match, variable, compareValue, content) => {
        const value = getConfigValue(variable, config);
        return value === compareValue ? content : "";
      }
    );

    /** {{#if (ne variable "value")}}content{{/if}} */
    processed = processed.replace(
      /\{\{#if\s+\(ne\s+(\w+)\s+'([^']+)'\)\}\}([\s\S]*?)\{\{\/if\}\}/g,
      (_match, variable, compareValue, content) => {
        const value = getConfigValue(variable, config);
        return value !== compareValue ? content : "";
      }
    );

    /** Clean up remaining Handlebars syntax */
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

  const getFileContent = (filePath: string, aiId: string) => {
    /** Match actual CLI generation structure */
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

    const template = templates[aiId]?.[filePath];
    if (!template) {
      return `# ${filePath}\n\n// Content will be generated by Precast CLI`;
    }

    return processTemplate(template, config);
  };

  const buildFileTree = (aiId: string): FileTreeNode[] => {
    const ai = aiAssistants.find((a) => a.id === aiId);
    if (!ai || !ai.files) return [];

    // Only show mcp.json if MCP servers are selected
    const filteredFiles = ai.files.filter((file) => {
      if (file === ".claude/mcp.json") {
        return config.mcpServers && config.mcpServers.length > 0;
      }
      return true;
    });

    // Build tree structure from file paths
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

  const renderFileTree = (nodes: FileTreeNode[], level = 0): JSX.Element[] => {
    return nodes.map((node) => (
      <div key={node.path} style={{ marginLeft: `${level * 16}px` }}>
        {node.type === "folder" ? (
          <>
            <button
              onClick={() => toggleFolder(node.path)}
              className="flex items-center gap-2 w-full text-left p-1 hover:bg-comic-white/10 rounded transition-colors"
            >
              {expandedFolders.has(node.path) ? (
                <BuilderIcon icon={FaFolderOpen} className="text-comic-yellow text-sm" />
              ) : (
                <BuilderIcon icon={FaFolder} className="text-comic-yellow text-sm" />
              )}
              <span className="font-mono text-xs font-bold">{node.name}/</span>
              {expandedFolders.has(node.path) ? (
                <BuilderIcon icon={FaChevronDown} className="text-xs ml-auto" />
              ) : (
                <BuilderIcon icon={FaChevronRight} className="text-xs ml-auto" />
              )}
            </button>
            {expandedFolders.has(node.path) && node.children && (
              <div>{renderFileTree(node.children, level + 1)}</div>
            )}
          </>
        ) : (
          <>
            <button
              onClick={() => toggleFile(node.path)}
              className="flex items-center gap-2 w-full text-left p-1 hover:bg-comic-white/10 rounded transition-colors"
            >
              <BuilderIcon icon={FaFile} className="text-comic-green text-sm" />
              <span className="font-mono text-xs">{node.name}</span>
              {expandedFiles[node.path] ? (
                <BuilderIcon icon={FaChevronDown} className="text-xs ml-auto" />
              ) : (
                <BuilderIcon icon={FaChevronRight} className="text-xs ml-auto" />
              )}
            </button>
            {expandedFiles[node.path] && (
              <div className="mt-2 ml-4 p-3 bg-comic-black/30 rounded border border-comic-white/10">
                <pre className="text-xs font-mono text-comic-white whitespace-pre-wrap overflow-x-auto">
                  {getFileContent(node.path, config.aiAssistant!)}
                </pre>
              </div>
            )}
          </>
        )}
      </div>
    ));
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

            {/* Documentation Options */}
            <div className="mt-3 pt-3 border-t border-comic-white/20">
              <p className="text-xs font-bold mb-2 text-comic-white">Documentation Generation:</p>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 bg-comic-black/20 rounded border border-comic-white/10">
                  <div className="flex items-center gap-2">
                    <BuilderIcon icon={FaFileAlt} className="text-comic-blue text-sm" />
                    <span className="text-xs font-mono">SPEC.md</span>
                    <span className="text-[10px] text-comic-white/70">Technical Specification</span>
                  </div>
                  <button
                    onClick={() =>
                      setConfig({ ...config, generateSpec: !(config.generateSpec ?? true) })
                    }
                    className={`p-1 rounded transition-colors ${
                      (config.generateSpec ?? true) ? "text-comic-green" : "text-comic-red"
                    }`}
                    title={`${(config.generateSpec ?? true) ? "Disable" : "Enable"} SPEC.md generation`}
                  >
                    {(config.generateSpec ?? true) ? (
                      <BuilderIcon icon={FaToggleOn} className="text-lg" />
                    ) : (
                      <BuilderIcon icon={FaToggleOff} className="text-lg" />
                    )}
                  </button>
                </div>

                <div className="flex items-center justify-between p-2 bg-comic-black/20 rounded border border-comic-white/10">
                  <div className="flex items-center gap-2">
                    <BuilderIcon icon={FaClipboardList} className="text-comic-orange text-sm" />
                    <span className="text-xs font-mono">PRD.md</span>
                    <span className="text-[10px] text-comic-white/70">Product Requirements</span>
                  </div>
                  <button
                    onClick={() =>
                      setConfig({ ...config, generatePrd: !(config.generatePrd ?? true) })
                    }
                    className={`p-1 rounded transition-colors ${
                      (config.generatePrd ?? true) ? "text-comic-green" : "text-comic-red"
                    }`}
                    title={`${(config.generatePrd ?? true) ? "Disable" : "Enable"} PRD.md generation`}
                  >
                    {(config.generatePrd ?? true) ? (
                      <BuilderIcon icon={FaToggleOn} className="text-lg" />
                    ) : (
                      <BuilderIcon icon={FaToggleOff} className="text-lg" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {aiAssistants.find((ai) => ai.id === config.aiAssistant)?.files && (
              <div className="mt-3 pt-3 border-t border-comic-white/20">
                <p className="text-xs font-bold mb-2">Generated Files:</p>
                <div className="bg-comic-black/20 rounded p-2 border border-comic-white/10">
                  {renderFileTree(buildFileTree(config.aiAssistant!))}
                </div>
              </div>
            )}
          </div>
        )}
      </CollapsibleSection>
    </motion.div>
  );
};

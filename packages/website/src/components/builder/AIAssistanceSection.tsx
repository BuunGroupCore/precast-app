import { motion } from "framer-motion";
import React, { useState } from "react";
import { FaBrain, FaChevronDown, FaChevronRight, FaFile } from "react-icons/fa";

import { aiAssistants } from "./constants";
import { PublicIcon } from "./PublicIcon";
import type { ExtendedProjectConfig } from "./types";

interface AIAssistanceSectionProps {
  config: ExtendedProjectConfig;
  setConfig: React.Dispatch<React.SetStateAction<ExtendedProjectConfig>>;
}

export const AIAssistanceSection: React.FC<AIAssistanceSectionProps> = ({ config, setConfig }) => {
  const [expandedFiles, setExpandedFiles] = useState<{ [key: string]: boolean }>({});

  const toggleFile = (fileName: string) => {
    setExpandedFiles((prev) => ({
      ...prev,
      [fileName]: !prev[fileName],
    }));
  };

  const processTemplate = (template: string, config: ExtendedProjectConfig) => {
    // Simple Handlebars-like template processing
    let processed = template;

    // Replace basic variables
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

    // Process conditionals
    // {{#if variable}}content{{/if}}
    processed = processed.replace(
      /\{\{#if\s+(\w+)\}\}([\s\S]*?)\{\{\/if\}\}/g,
      (match, variable, content) => {
        const value = getConfigValue(variable, config);
        return value && value !== "none" && value !== "false" ? content : "";
      }
    );

    // {{#if (eq variable "value")}}content{{/if}}
    processed = processed.replace(
      /\{\{#if\s+\(eq\s+(\w+)\s+"([^"]+)"\)\}\}([\s\S]*?)\{\{\/if\}\}/g,
      (match, variable, compareValue, content) => {
        const value = getConfigValue(variable, config);
        return value === compareValue ? content : "";
      }
    );

    // {{#if (ne variable "value")}}content{{/if}}
    processed = processed.replace(
      /\{\{#if\s+\(ne\s+(\w+)\s+'([^']+)'\)\}\}([\s\S]*?)\{\{\/if\}\}/g,
      (match, variable, compareValue, content) => {
        const value = getConfigValue(variable, config);
        return value !== compareValue ? content : "";
      }
    );

    // Clean up remaining Handlebars syntax
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

  const getFileContent = (fileName: string, aiId: string) => {
    // Real CLI templates
    const templates: { [key: string]: { [key: string]: string } } = {
      claude: {
        "CLAUDE.md": `# {{name}} - AI Assistant Context

## Project Overview
This is a {{framework}} application{{#if uiLibrary}} using {{uiLibrary}} for UI components{{/if}}.

## Technology Stack
- **Framework**: {{framework}}
- **Language**: {{language}}
- **Package Manager**: {{packageManager}}
{{#if styling}}
- **Styling**: {{styling}}
{{/if}}
{{#if uiLibrary}}
- **UI Library**: {{uiLibrary}}
{{/if}}
{{#if database}}
- **Database**: {{database}}
{{/if}}
{{#if orm}}
- **ORM**: {{orm}}
{{/if}}

## Project Structure
\`\`\`
{{name}}/
├── src/                 # Source code
{{#if (eq framework "next")}}
│   ├── app/            # Next.js App Router
│   ├── components/     # React components
│   └── lib/            # Utility functions
{{else if (eq framework "react")}}
│   ├── components/     # React components
│   ├── hooks/          # Custom React hooks
│   └── utils/          # Utility functions
{{else if (eq framework "vue")}}
│   ├── components/     # Vue components
│   ├── composables/    # Vue composables
│   └── utils/          # Utility functions
{{else if (eq framework "svelte")}}
│   ├── lib/            # Svelte components
│   └── routes/         # SvelteKit routes
{{/if}}
├── public/             # Static assets
└── package.json        # Dependencies
\`\`\`

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

    const template = templates[aiId]?.[fileName];
    if (!template) {
      return `# ${fileName}\n\n// Content will be generated by Precast CLI`;
    }

    return processTemplate(template, config);
  };
  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.6 }}
      className="comic-card bg-comic-purple text-comic-white"
    >
      <div className="flex items-center gap-3 mb-2">
        <FaBrain className="text-3xl" />
        <h3 className="font-display text-2xl">AI ASSISTANCE</h3>
      </div>
      <div className="border-t-3 border-comic-darkPurple mb-3"></div>
      <p className="font-comic text-sm mb-4 text-comic-white/90">
        Supercharge your development - integrate AI coding assistants for smarter, faster coding
      </p>
      <div className="grid grid-cols-2 gap-3">
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
                <PublicIcon name={ai.icon} className={ai.color} />
              ) : (
                <ai.icon className={ai.color} />
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
          {aiAssistants.find((ai) => ai.id === config.aiAssistant)?.files && (
            <div className="mt-2">
              <p className="text-xs font-bold mb-1">Creates:</p>
              <div className="text-xs space-y-1">
                {aiAssistants
                  .find((ai) => ai.id === config.aiAssistant)
                  ?.files?.map((file, idx) => (
                    <div key={idx} className="space-y-1">
                      <button
                        onClick={() => toggleFile(file)}
                        className="flex items-center gap-2 w-full text-left p-2 bg-comic-white/10 hover:bg-comic-white/20 rounded border border-comic-white/20 transition-colors"
                      >
                        <FaFile className="text-comic-yellow" />
                        <span className="font-mono flex-1">{file}</span>
                        {expandedFiles[file] ? (
                          <FaChevronDown className="text-xs" />
                        ) : (
                          <FaChevronRight className="text-xs" />
                        )}
                      </button>
                      {expandedFiles[file] && (
                        <div className="ml-6 p-3 bg-comic-black/30 rounded border border-comic-white/10">
                          <pre className="text-xs font-mono text-comic-white whitespace-pre-wrap overflow-x-auto">
                            {getFileContent(file, config.aiAssistant!)}
                          </pre>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
};

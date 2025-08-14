# Precast CLI Developer Guide

## Table of Contents

- [Getting Started](#getting-started)
- [Development Environment](#development-environment)
- [Code Organization](#code-organization)
- [Working with Templates](#working-with-templates)
- [Adding New Features](#adding-new-features)
- [Testing Strategy](#testing-strategy)
- [Debugging](#debugging)
- [Performance Optimization](#performance-optimization)
- [Best Practices](#best-practices)

## Getting Started

### Prerequisites

- **Node.js** 18+ or **Bun** (recommended)
- **Git** for version control
- **Docker** (optional, for Docker features)
- **VS Code** or similar editor with TypeScript support

### Initial Setup

```bash
# Clone the repository
git clone https://github.com/BuunGroupCore/precast-app.git
cd precast-app

# Install dependencies (from root)
bun install

# Build all packages
bun run build

# Navigate to CLI package
cd packages/cli

# Run CLI locally
./dist/cli.js init test-project
```

### Development Scripts

```bash
# Watch mode for development
bun run dev

# Build the CLI
bun run build

# Run tests
bun test

# Run tests with coverage
bun test --coverage

# Lint code
bun run lint

# Type check
bun run typecheck

# Format code
bun run format
```

## Development Environment

### Recommended VS Code Extensions

```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-typescript-tsc",
    "christian-kohler.path-intellisense",
    "streetsidesoftware.code-spell-checker",
    "wayou.vscode-todo-highlight"
  ]
}
```

### Environment Variables

Create a `.env.local` file for development:

```bash
# Debug mode
DEBUG=precast:*

# Disable telemetry during development
PRECAST_TELEMETRY_DISABLED=1

# Enable verbose logging
VERBOSE=true

# Custom API endpoints (if needed)
POSTHOG_HOST=http://localhost:8000
```

### Development Workflow

1. **Feature Branch** - Create a feature branch from main
2. **Development** - Make changes with watch mode running
3. **Testing** - Write and run tests for your changes
4. **Linting** - Ensure code passes linting
5. **Build** - Verify the build succeeds
6. **Manual Testing** - Test various configurations
7. **Documentation** - Update relevant docs
8. **Pull Request** - Submit for review

## Code Organization

### Directory Structure

```
packages/cli/
├── src/
│   ├── cli.ts                 # Main entry point
│   ├── commands/              # Command implementations
│   │   ├── init.ts           # Project creation
│   │   ├── deploy.ts         # Docker management
│   │   ├── generate.ts       # ORM generation
│   │   └── status.ts         # Project info
│   ├── core/                  # Core functionality
│   │   ├── config-validator.ts
│   │   ├── template-engine.ts
│   │   └── plugin-manager.ts
│   ├── generators/            # Framework generators
│   │   ├── base-generator.ts # Abstract base
│   │   ├── react-template.ts
│   │   ├── vue-template.ts
│   │   └── ...
│   ├── templates/             # Handlebars templates
│   │   ├── frameworks/
│   │   ├── backends/
│   │   └── features/
│   ├── utils/                 # Utility functions
│   │   ├── package-manager.ts
│   │   ├── analytics.ts
│   │   └── ...
│   └── types/                 # TypeScript types
│       └── index.ts
├── tests/                     # Test files
├── docs/                      # Documentation
└── package.json
```

### Import Guidelines

```typescript
// 1. Node.js built-ins
import * as path from "path";
import { fileURLToPath } from "url";

// 2. External dependencies
import { Command } from "commander";
import fsExtra from "fs-extra";

// 3. Shared packages
import type { ProjectConfig } from "../../../shared/stack-config.js";

// 4. Internal imports
import { TemplateEngine } from "../core/template-engine.js";
import { logger } from "../utils/logger.js";
```

## Working with Templates

### Template Structure

Templates use Handlebars for dynamic content generation:

```handlebars
{{! src/templates/frameworks/react/base/package.json.hbs }}
{ "name": "{{name}}", "version": "1.0.0", "private": true,
{{#if typescript}}
  "scripts": { "dev": "vite", "build": "tsc && vite build", "preview": "vite preview" },
{{else}}
  "scripts": { "dev": "vite", "build": "vite build", "preview": "vite preview" },
{{/if}}
"dependencies": { "react": "^18.2.0", "react-dom": "^18.2.0"{{#if (eq styling "tailwind")}},
  "tailwindcss": "^3.4.0"{{/if}}
} }
```

### Available Handlebars Helpers

```handlebars
{{! Conditionals }}
{{#if typescript}}...{{/if}}
{{#unless docker}}...{{/unless}}

{{! Comparisons }}
{{#if (eq framework "react")}}...{{/if}}
{{#if (ne backend "none")}}...{{/if}}

{{! Multiple conditions }}
{{#ifAny (eq database "postgres") (eq database "mysql")}}...{{/ifAny}}
{{#ifAll typescript docker}}...{{/ifAll}}

{{! String manipulation }}
{{capitalize name}}
{{lowercase framework}}

{{! Custom helpers }}
{{stripHashFromHex primaryColor}}
```

### Creating Templates

1. **File Naming**
   - Use `.hbs` extension for Handlebars templates
   - Use `_` prefix for dotfiles (e.g., `_gitignore` → `.gitignore`)
   - Use descriptive names

2. **Template Context**

   ```typescript
   interface TemplateContext {
     name: string;
     framework: string;
     backend?: string;
     database?: string;
     orm?: string;
     styling?: string;
     typescript: boolean;
     docker: boolean;
     // ... more fields
   }
   ```

3. **Testing Templates**

   ```bash
   # Quick test without building
   npx tsx src/cli.ts test-app --framework react --typescript

   # Check generated output
   cat test-app/package.json
   ```

## Adding New Features

### Adding a New Framework

1. **Create the Generator**

```typescript
// src/generators/solid-template.ts
import { BaseGenerator } from "./base-generator.js";
import type { ProjectConfig } from "../../../shared/stack-config.js";

export async function generateSolidTemplate(
  config: ProjectConfig,
  projectPath: string
): Promise<void> {
  const generator = new BaseGenerator(config, projectPath);

  // Copy base template
  await generator.processTemplate("frameworks/solid/base", "");

  // Add TypeScript support
  if (config.typescript) {
    await generator.processTemplate("frameworks/solid/typescript", "src");
  }

  // Setup routing
  await generator.setupRouting();

  // Configure styling
  await generator.setupStyling();
}
```

2. **Add Templates**

```
src/templates/frameworks/solid/
├── base/
│   ├── package.json.hbs
│   ├── vite.config.js.hbs
│   ├── index.html.hbs
│   └── _gitignore
├── src/
│   ├── App.tsx.hbs
│   ├── index.tsx.hbs
│   └── styles.css.hbs
└── typescript/
    ├── tsconfig.json.hbs
    └── vite-env.d.ts.hbs
```

3. **Update Configuration**

```typescript
// packages/shared/stack-config.ts
export const FRAMEWORKS = [
  // ... existing frameworks
  {
    id: "solid",
    name: "Solid",
    description: "Fine-grained reactive UI library",
    icon: "SolidIcon",
    compatibleBackends: ["express", "fastify", "hono"],
    compatibleStyling: ["tailwind", "css", "scss"],
    requiresTypeScript: false,
  },
];
```

4. **Add to Generator Index**

```typescript
// src/generators/index.ts
case "solid":
  await generateSolidTemplate(config, projectPath);
  break;
```

5. **Write Tests**

```typescript
// tests/solid.test.ts
describe("Solid Generator", () => {
  test("generates Solid project with TypeScript", async () => {
    const config = {
      name: "test-solid",
      framework: "solid",
      typescript: true,
      // ... other config
    };

    await generateTemplate(config, testPath);

    expect(await pathExists(path.join(testPath, "package.json"))).toBe(true);
    expect(await pathExists(path.join(testPath, "tsconfig.json"))).toBe(true);
  });
});
```

### Adding a New Backend

Similar process in `src/templates/backends/[backend]/`

### Adding a New Database/ORM

1. Add templates in `src/templates/database/[database]/`
2. Update `src/utils/database-setup.ts`
3. Add compatibility rules in `src/core/config-validator.ts`

### Adding a New UI Library

1. Create setup function in `src/utils/ui-library-setup.ts`
2. Add templates if needed
3. Update dependencies
4. Add configuration logic

## Testing Strategy

### Unit Tests

```typescript
// Test individual functions
describe("TemplateEngine", () => {
  test("processes Handlebars template correctly", () => {
    const template = "Hello {{name}}!";
    const context = { name: "World" };
    const result = engine.processTemplate(template, context);
    expect(result).toBe("Hello World!");
  });
});
```

### Integration Tests

```typescript
// Test complete flows
describe("CLI Integration", () => {
  test("creates React project with all features", async () => {
    const result = await execCommand([
      "init",
      "test-app",
      "--framework",
      "react",
      "--backend",
      "express",
      "--database",
      "postgres",
      "--orm",
      "prisma",
    ]);

    expect(result.exitCode).toBe(0);
    // Verify files exist
    // Check package.json contents
    // Validate configuration
  });
});
```

### Snapshot Tests

```typescript
// Test template output
test("generates correct package.json", () => {
  const result = generatePackageJson(config);
  expect(result).toMatchSnapshot();
});
```

### Manual Testing Checklist

- [ ] React + TypeScript + Tailwind
- [ ] Vue + JavaScript + SCSS
- [ ] Next.js + Prisma + PostgreSQL
- [ ] Angular + NestJS + MongoDB
- [ ] Docker generation
- [ ] Authentication setup
- [ ] Deployment configurations
- [ ] Error scenarios

## Debugging

### Debug Mode

```bash
# Enable debug output
DEBUG=precast:* ./dist/cli.js init test-app

# Verbose logging
VERBOSE=true ./dist/cli.js init test-app

# Debug analytics
DEBUG_ANALYTICS=true ./dist/cli.js init test-app
```

### Using Node Inspector

```bash
# Start with inspector
node --inspect-brk dist/cli.js init test-app

# In Chrome, open:
chrome://inspect
```

### VS Code Debugging

```json
// .vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug CLI",
      "program": "${workspaceFolder}/dist/cli.js",
      "args": ["init", "test-app", "--framework", "react"],
      "console": "integratedTerminal",
      "sourceMaps": true
    }
  ]
}
```

### Common Issues

1. **Template Not Found**
   - Check template path resolution
   - Verify template exists
   - Check case sensitivity

2. **Dependency Conflicts**
   - Clear node_modules
   - Update lock files
   - Check version compatibility

3. **Generation Failures**
   - Enable verbose logging
   - Check error collector output
   - Verify file permissions

## Performance Optimization

### Profiling

```typescript
// Add performance tracking
const start = performance.now();
await generateTemplate(config, projectPath);
const duration = performance.now() - start;
console.log(`Generation took ${duration}ms`);
```

### Optimization Tips

1. **Lazy Loading**

   ```typescript
   // Load generators only when needed
   const { generateReactTemplate } = await import("./react-template.js");
   ```

2. **Parallel Operations**

   ```typescript
   // Install dependencies in parallel
   await Promise.all([installDependencies(deps), installDevDependencies(devDeps)]);
   ```

3. **Template Caching**

   ```typescript
   // Cache compiled templates
   const templateCache = new Map();
   if (templateCache.has(templatePath)) {
     return templateCache.get(templatePath);
   }
   ```

4. **Efficient File Operations**
   ```typescript
   // Batch file writes
   const writes = files.map((file) => writeFile(file.path, file.content));
   await Promise.all(writes);
   ```

## Best Practices

### Code Style

1. **TypeScript**
   - Use strict mode
   - Avoid `any` types
   - Proper error types
   - Exhaustive switch cases

2. **Async/Await**
   - Always use async/await over callbacks
   - Proper error handling with try/catch
   - Avoid blocking operations

3. **Error Handling**

   ```typescript
   try {
     await riskyOperation();
   } catch (error) {
     if (error instanceof SpecificError) {
       // Handle specific error
     } else {
       // Handle generic error
       logger.error("Operation failed:", error);
       throw error;
     }
   }
   ```

4. **Logging**
   ```typescript
   // Use appropriate log levels
   logger.debug("Detailed debug info");
   logger.info("General information");
   logger.warn("Warning message");
   logger.error("Error occurred", error);
   ```

### Template Best Practices

1. **Keep It Simple**
   - Minimize logic in templates
   - Use helpers for complex operations
   - Clear, readable structure

2. **Consistency**
   - Follow existing patterns
   - Use same naming conventions
   - Consistent indentation

3. **Documentation**
   - Comment complex logic
   - Document helper functions
   - Explain configuration options

### Git Workflow

1. **Branch Naming**
   - `feature/add-solid-framework`
   - `fix/docker-generation-error`
   - `docs/update-readme`

2. **Commit Messages**

   ```
   feat: add Solid.js framework support
   fix: resolve Docker generation issue with PostgreSQL
   docs: update README with new features
   chore: update dependencies
   ```

3. **Pull Request Process**
   - Clear description
   - Link related issues
   - Screenshots if UI changes
   - Test coverage report

### Security Considerations

1. **Input Validation**

   ```typescript
   function validateProjectName(name: string): boolean {
     const valid = /^[a-zA-Z0-9-_]+$/.test(name);
     if (!valid) {
       throw new Error("Invalid project name");
     }
     return true;
   }
   ```

2. **Path Safety**

   ```typescript
   // Always use path.resolve
   const safePath = path.resolve(projectPath);
   if (!safePath.startsWith(process.cwd())) {
     throw new Error("Invalid path");
   }
   ```

3. **Command Execution**
   ```typescript
   // Never use string concatenation
   // BAD: exec(`git init ${projectPath}`)
   // GOOD:
   execSync("git init", { cwd: projectPath });
   ```

## Troubleshooting

### Common Development Issues

1. **Build Failures**
   - Clear dist directory
   - Check TypeScript errors
   - Verify imports

2. **Test Failures**
   - Update snapshots if needed
   - Check test environment
   - Verify mock data

3. **Template Issues**
   - Validate Handlebars syntax
   - Check context variables
   - Test with different configs

### Getting Help

- **GitHub Issues** - Report bugs
- **GitHub Discussions** - Ask questions
- **Documentation** - Check existing docs
- **Code Comments** - Read inline documentation
- **Team Chat** - Internal communication

## Resources

### Internal Documentation

- [Architecture](ARCHITECTURE.md)
- [Contributing](../CONTRIBUTING.md)
- [Security](SECURITY.md)
- [Telemetry](TELEMETRY.md)

### External Resources

- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Handlebars Guide](https://handlebarsjs.com/guide/)
- [Commander.js Documentation](https://github.com/tj/commander.js)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)

## Conclusion

This guide provides the foundation for contributing to the Precast CLI. Always prioritize code quality, user experience, and maintainability. When in doubt, look at existing implementations or ask for guidance.

# Contributing to Precast CLI

Thank you for your interest in contributing to the Precast CLI! This guide will help you understand the project structure, development workflow, and how to make meaningful contributions.

## Table of Contents

- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Development Setup](#development-setup)
- [Important Files & Directories](#important-files--directories)
- [Development Workflow](#development-workflow)
- [Testing](#testing)
- [Adding New Features](#adding-new-features)
- [Documentation](#documentation)
- [Code Style](#code-style)
- [Pull Request Process](#pull-request-process)

## Getting Started

### Prerequisites

- Node.js 18+ or Bun
- Git
- Basic knowledge of TypeScript/JavaScript
- Understanding of modern web frameworks

### Quick Setup

```bash
# Clone the repository
git clone https://github.com/BuunGroupCore/precast-app.git
cd precast-app/packages/cli

# Install dependencies
bun install

# Build the CLI
bun run build

# Test locally
./dist/cli.js init test-project
```

## Project Structure

```
packages/cli/
├── src/
│   ├── commands/          # CLI commands (init, add, add-features)
│   ├── core/             # Core functionality (template engine, validation)
│   ├── generators/       # Framework-specific generators
│   ├── templates/        # Handlebars templates for all features
│   ├── utils/           # Utilities (analytics, auth, database setup)
│   ├── cli.ts           # Main CLI entry point
│   └── index.ts         # Package exports
├── tests/               # Test files
├── docs/                # Additional documentation
│   ├── SECURITY.md      # Security documentation
│   ├── TELEMETRY.md     # Analytics documentation
│   └── developer/       # Developer setup guides
├── dist/                # Built output
├── schema/              # JSON schema for configuration
└── package.json
```

## Development Setup

### Fast Development with tsx

For quick iterations without rebuilding:

```bash
# Run CLI directly with tsx (fastest)
npx tsx src/cli.ts test-project --framework react --backend express

# Or use the dev script
bun run dev -- test-project --framework react
```

### Watch Mode

Start watch mode in one terminal:

```bash
bun run dev
```

In another terminal, test your changes:

```bash
node dist/cli.js test-app --framework react
```

## Important Files & Directories

### Core Files

- **`src/cli.ts`** - Main CLI entry point using Commander.js
- **`src/commands/init.ts`** - Primary project creation logic
- **`src/core/template-engine.ts`** - Handlebars template processing
- **`src/core/config-validator.ts`** - Input validation and compatibility checks
- **`package.json`** - Dependencies, scripts, and package metadata

### Key Utilities

- **`src/utils/analytics.ts`** - Anonymous telemetry collection (GA4)
- **`src/utils/package-manager.ts`** - Smart package manager detection/fallback
- **`src/utils/claude-setup.ts`** - Claude Code integration
- **`src/utils/database-setup.ts`** - Database configuration
- **`src/utils/auth-setup.ts`** - Authentication provider setup
- **`src/utils/ui-library-setup.ts`** - UI component library integration

### Template System

- **`src/templates/frameworks/`** - Framework-specific templates (React, Vue, Angular, etc.)
- **`src/templates/backends/`** - Backend server templates (Express, Fastify, NestJS, etc.)
- **`src/templates/database/`** - Database and ORM configurations
- **`src/templates/features/`** - Additional feature templates
- **`src/generators/`** - Framework generators that orchestrate template usage

### Configuration & Schema

- **`schema/precast.schema.json`** - JSON schema for project configuration
- **`src/core/config-validator.ts`** - Runtime validation using the schema
- **`packages/shared/stack-config.ts`** - Shared configuration between CLI and website

### Documentation

- **`README.md`** - Main documentation and usage guide
- **`CLAUDE.md`** - Project context for Claude Code users
- **`src/docs/DEVELOPER-GUIDE.md`** - Detailed development guide
- **`src/docs/ARCHITECTURE.md`** - System architecture overview
- **`docs/TELEMETRY.md`** - Analytics and privacy documentation
- **`docs/SECURITY.md`** - Security practices and audit information

## Development Workflow

### 1. Template Development

When working on templates:

```bash
# Edit templates
code src/templates/frameworks/react/base/package.json.hbs

# Test immediately without build
npx tsx src/cli.ts test-app -y --framework react

# Check generated output
cat test-output/test-app/package.json
```

### 2. Core Feature Development

When working on core features:

```bash
# Edit core files
code src/core/template-engine.ts

# Run unit tests
bun test src/core/__tests__/template-engine.test.ts

# Test CLI integration
npx tsx src/cli.ts test-app -y
```

### 3. Adding New Frameworks

1. Create generator: `src/generators/[framework]-template.ts`
2. Add templates: `src/templates/frameworks/[framework]/`
3. Update shared config: `packages/shared/stack-config.ts`
4. Add tests: `tests/framework-[framework].test.ts`

## Testing

### Unit Tests

```bash
# Run all tests
bun test

# Run specific test file
bun test src/core/__tests__/template-engine.test.ts

# Run in watch mode
bun test --watch

# Run with coverage
bun test --coverage
```

### Integration Tests

```bash
# Build first (required for integration tests)
bun run build

# Run CLI integration tests
bun test tests/cli.test.ts
```

### Manual Testing

Essential combinations to test:

- React + TypeScript + Tailwind + Express + PostgreSQL + Prisma
- React + JavaScript + CSS + No Backend
- Vue + TypeScript + SCSS + Fastify + MySQL + Drizzle
- Angular + TypeScript + Material UI + NestJS + MongoDB
- Validation failures (incompatible combinations)
- Git initialization and Docker generation

## Adding New Features

### 1. Adding a New Framework

Example: Adding Qwik framework

1. **Create the generator** (`src/generators/qwik-template.ts`):

```typescript
import { BaseGenerator } from "./base-generator.js";
import type { ProjectConfig } from "../types.js";

export class QwikGenerator extends BaseGenerator {
  async generate(config: ProjectConfig) {
    await this.processTemplate("frameworks/qwik/base", "", config);

    if (config.typescript) {
      await this.processTemplate("frameworks/qwik/src", "src/", config);
    }

    // Add framework-specific logic
  }
}
```

2. **Create templates** (`src/templates/frameworks/qwik/`):

```
qwik/
├── base/
│   ├── package.json.hbs
│   ├── vite.config.ts.hbs
│   └── _gitignore
└── src/
    ├── entry.ssr.tsx.hbs
    ├── root.tsx.hbs
    └── routes/
        └── index.tsx.hbs
```

3. **Update configuration** (`packages/shared/stack-config.ts`):

```typescript
export const FRAMEWORKS = [
  // ... existing frameworks
  {
    id: "qwik",
    name: "Qwik",
    description: "Resumable web framework",
    supportedStyling: ["tailwind", "css", "scss"],
    requiresNode: true,
  },
] as const;
```

4. **Add tests**:

```typescript
describe("Qwik Generator", () => {
  test("generates Qwik project with TypeScript", async () => {
    // Test implementation
  });
});
```

### 2. Adding a New Backend

Similar process for backends in `src/templates/backends/[backend]/`

### 3. Adding a New Database/ORM

1. Add templates in `src/templates/database/[database]/`
2. Update `src/utils/database-setup.ts`
3. Add compatibility rules in `src/core/config-validator.ts`

## Documentation

### Essential Documentation to Read

Before contributing, familiarize yourself with:

1. **`README.md`** - Main usage guide and feature overview
2. **`CLAUDE.md`** - Complete project context and architecture
3. **`src/docs/DEVELOPER-GUIDE.md`** - Detailed development workflows
4. **`src/docs/ARCHITECTURE.md`** - System design and technical decisions
5. **`docs/TELEMETRY.md`** - Analytics implementation and privacy
6. **`docs/SECURITY.md`** - Security practices and audit information

### When to Update Documentation

- Adding new frameworks, backends, or databases
- Changing CLI flags or commands
- Modifying the template system
- Adding new utilities or core features
- Security or privacy changes

## Code Style

### TypeScript Standards

- Use strict TypeScript settings
- Prefer interfaces over types for object shapes
- Use proper type annotations for function parameters and returns
- Avoid `any` types

### Template Guidelines

- Use `.hbs` extension for all Handlebars templates
- Use `_` prefix for dotfiles (e.g., `_gitignore` → `.gitignore`)
- Keep conditional logic simple and readable
- Test templates with various configuration combinations

### Handlebars Helpers

Available helpers in templates:

```handlebars
{{#if typescript}}TypeScript code{{/if}}
{{#if (eq framework "react")}}React-specific code{{/if}}
{{#ifAny (eq database "postgres") (eq database "mysql")}}SQL database{{/ifAny}}
```

### Error Handling

- Provide clear, actionable error messages
- Validate inputs early and thoroughly
- Use proper TypeScript error types
- Log helpful context for debugging

## Pull Request Process

### Before Submitting

1. **Run all tests**: `bun test`
2. **Test manually** with various configurations
3. **Check formatting**: `bun run lint`
4. **Update documentation** if needed
5. **Test the build**: `bun run build && ./dist/cli.js init test-pr`

### PR Guidelines

1. **Clear description** - Explain what the PR does and why
2. **Breaking changes** - Mark clearly if this is a breaking change
3. **Screenshots** - Include terminal output for CLI changes
4. **Testing** - Describe how you tested the changes
5. **Documentation** - Update relevant docs

### PR Template

```markdown
## Description

Brief description of changes

## Type of Change

- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing

- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing completed
- [ ] Tested with multiple framework combinations

## Documentation

- [ ] README updated if needed
- [ ] CLAUDE.md updated if needed
- [ ] Developer docs updated if needed

## Screenshots

<!-- Terminal output showing the changes work -->
```

### Review Process

1. Automated tests must pass
2. Code review by maintainers
3. Manual testing of key scenarios
4. Documentation review
5. Approval and merge

## Getting Help

- **GitHub Issues** - Report bugs or request features
- **GitHub Discussions** - Ask questions or discuss ideas
- **Documentation** - Check existing docs first
- **Code Examples** - Look at similar implementations in the codebase

## Common Pitfalls

1. **Template paths** - Ensure templates are correctly referenced
2. **Package manager compatibility** - Test with npm, yarn, pnpm, and bun
3. **Cross-platform paths** - Use `path.join()` instead of string concatenation
4. **TypeScript/JavaScript variants** - Test both language modes
5. **Dependency versions** - Keep dependencies up to date

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

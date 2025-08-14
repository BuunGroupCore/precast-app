# Contributing to Precast CLI

Thank you for your interest in contributing to the Precast CLI! This guide will help you understand the project structure, development workflow, and how to make meaningful contributions.

## Table of Contents

- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Development Setup](#development-setup)
- [Development Workflow](#development-workflow)
- [Testing](#testing)
- [Adding New Features](#adding-new-features)
- [Code Style Guidelines](#code-style-guidelines)
- [Pull Request Process](#pull-request-process)
- [Documentation](#documentation)

## Getting Started

### Prerequisites

- **Node.js 18+** or **Bun** (recommended for performance)
- **Git** for version control
- **Docker** (optional, for Docker-related features)
- **VS Code** or similar editor with TypeScript support

### Quick Setup

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

# Test the CLI locally
./dist/cli.js init test-project
```

## Project Structure

```
packages/cli/
├── src/
│   ├── cli.ts                 # Main CLI entry point
│   ├── commands/              # CLI commands
│   │   ├── init.ts           # Project creation
│   │   ├── deploy.ts         # Docker management
│   │   ├── generate.ts       # ORM generation
│   │   └── status.ts         # Project status
│   ├── core/                 # Core functionality
│   │   ├── config-validator.ts
│   │   ├── template-engine.ts
│   │   └── plugin-manager.ts
│   ├── generators/           # Framework generators
│   │   ├── base-generator.ts
│   │   ├── react-template.ts
│   │   └── [framework]-template.ts
│   ├── templates/            # Handlebars templates
│   │   ├── frameworks/
│   │   ├── backends/
│   │   ├── database/
│   │   └── features/
│   ├── utils/               # Utility functions
│   │   ├── package-manager.ts
│   │   ├── analytics.ts
│   │   └── [utility].ts
│   └── prompts/            # Interactive prompts
├── tests/                  # Test files
├── docs/                   # Documentation
│   ├── ARCHITECTURE.md
│   ├── DEVELOPER-GUIDE.md
│   ├── QUICK-START.md
│   └── SECURITY.md
└── package.json
```

## Development Setup

### Fast Development with tsx

For quick iterations without rebuilding:

```bash
# Run CLI directly with tsx (no build needed!)
npx tsx src/cli.ts init test-app --framework react --backend express

# Or use the dev script
bun run dev -- init test-app --framework react
```

### Watch Mode

Start watch mode in one terminal:

```bash
bun run dev
```

In another terminal, test your changes:

```bash
./dist/cli.js init test-app --framework react
```

### Environment Variables

Create a `.env.local` file for development:

```bash
# Debug output
DEBUG=precast:*

# Disable telemetry during development
PRECAST_TELEMETRY_DISABLED=1

# Verbose logging
VERBOSE=true

# Debug analytics
DEBUG_ANALYTICS=true
```

## Development Workflow

### 1. Create a Feature Branch

```bash
git checkout -b feature/your-feature-name
```

### 2. Make Your Changes

Follow the project structure and coding standards.

### 3. Test Your Changes

```bash
# Run unit tests
bun test

# Test the CLI manually
npx tsx src/cli.ts init test-app --framework react

# Run linting
bun run lint

# Check types
bun run typecheck
```

### 4. Commit Your Changes

```bash
git add .
git commit -m "feat: add new feature"
```

Follow conventional commit format:

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes
- `refactor:` - Code refactoring
- `test:` - Test changes
- `chore:` - Maintenance tasks

### 5. Push and Create PR

```bash
git push origin feature/your-feature-name
```

Then create a Pull Request on GitHub.

## Testing

### Unit Tests

```bash
# Run all tests
bun test

# Run specific test file
bun test template-engine

# Run with coverage
bun test --coverage

# Run in watch mode
bun test --watch
```

### Integration Tests

```bash
# Build first (required for integration tests)
bun run build

# Run CLI integration tests
bun test tests/cli.test.ts
```

### Manual Testing Checklist

Essential combinations to test:

- [ ] React + TypeScript + Tailwind + Express + PostgreSQL + Prisma
- [ ] Vue + JavaScript + SCSS + Fastify + MySQL + Drizzle
- [ ] Next.js + Better Auth + Shadcn/ui
- [ ] Angular + NestJS + MongoDB + TypeORM
- [ ] Docker generation with PowerUps
- [ ] Deployment configurations (Vercel, Netlify, etc.)

## Adding New Features

### Adding a New Framework

1. **Create the generator** (`src/generators/[framework]-template.ts`):

```typescript
import type { ProjectConfig } from "../../../shared/stack-config.js";
import { createTemplateEngine } from "../core/template-engine.js";

export async function generate[Framework]Template(
  config: ProjectConfig,
  projectPath: string
): Promise<void> {
  const templateEngine = createTemplateEngine();

  // Copy base template
  await templateEngine.processTemplateDirectory(
    "frameworks/[framework]/base",
    projectPath,
    config
  );

  // Add TypeScript support if needed
  if (config.typescript) {
    await templateEngine.processTemplateDirectory(
      "frameworks/[framework]/typescript",
      projectPath,
      config
    );
  }
}
```

2. **Create templates** (`src/templates/frameworks/[framework]/`):

```
[framework]/
├── base/
│   ├── package.json.hbs
│   ├── vite.config.js.hbs
│   └── _gitignore
└── src/
    ├── App.[ext].hbs
    └── main.[ext].hbs
```

3. **Update configuration** (`packages/shared/stack-config.ts`):

```typescript
export const frameworkDefs: StackOption[] = [
  // ... existing frameworks
  {
    id: "[framework]",
    name: "[Framework Name]",
    description: "[Framework description]",
  },
];
```

4. **Add to generator index** (`src/generators/index.ts`):

```typescript
case "[framework]":
  await generate[Framework]Template(config, projectPath);
  break;
```

5. **Write tests**:

```typescript
describe("[Framework] Generator", () => {
  test("generates [framework] project with TypeScript", async () => {
    const config = {
      name: "test-app",
      framework: "[framework]",
      typescript: true,
      // ... other config
    };

    await generateTemplate(config, testPath);

    expect(await pathExists(path.join(testPath, "package.json"))).toBe(true);
  });
});
```

### Adding a New Backend

Similar process in `src/templates/backends/[backend]/`

### Adding a New Feature (Auth, Database, etc.)

1. Create setup function in `src/utils/[feature]-setup.ts`
2. Add templates in `src/templates/[feature]/`
3. Update configuration schema
4. Add to appropriate generator

## Code Style Guidelines

### TypeScript

- Use strict TypeScript settings
- Avoid `any` types - use `unknown` or proper types
- Use interfaces for object shapes
- Proper error handling with typed errors

```typescript
// Good
interface UserConfig {
  name: string;
  age: number;
}

// Bad
const config: any = { name: "John", age: 30 };
```

### Async/Await

Always use async/await over callbacks or raw promises:

```typescript
// Good
async function loadConfig(): Promise<Config> {
  try {
    const data = await readFile("config.json", "utf-8");
    return JSON.parse(data);
  } catch (error) {
    logger.error("Failed to load config:", error);
    throw error;
  }
}

// Bad
function loadConfig(callback: (err: Error, data: Config) => void) {
  fs.readFile("config.json", (err, data) => {
    // ...
  });
}
```

### Template Guidelines

- Use `.hbs` extension for Handlebars templates
- Use `_` prefix for dotfiles (e.g., `_gitignore` → `.gitignore`)
- Keep template logic simple and readable

```handlebars
{{! Good }}
{{#if typescript}}
  "build": "tsc && vite build"
{{else}}
  "build": "vite build"
{{/if}}

{{! Avoid complex logic in templates }}
```

### Error Handling

Provide clear, actionable error messages:

```typescript
if (!config.framework) {
  throw new Error("Framework is required. Please specify --framework <framework-name>");
}
```

### Comments and Documentation

- JSDoc for all exported functions
- Inline comments for complex logic only
- Keep comments concise and meaningful

```typescript
/**
 * Generates a project based on the provided configuration.
 *
 * @param config - Project configuration including framework, backend, etc.
 * @param projectPath - Absolute path where the project will be created
 * @throws {Error} If the project directory already exists
 */
export async function generateProject(config: ProjectConfig, projectPath: string): Promise<void> {
  // Implementation
}
```

## Pull Request Process

### Before Submitting

1. **Run all checks**:

```bash
bun test          # Run tests
bun run lint      # Check linting
bun run typecheck # Check types
bun run build     # Ensure it builds
```

2. **Test manually** with various configurations
3. **Update documentation** if needed
4. **Update CHANGELOG.md** with your changes

### PR Guidelines

1. **Clear title and description**
   - Explain what the PR does
   - Link related issues
   - List breaking changes if any

2. **Screenshots/Output**
   - Include terminal output for CLI changes
   - Show before/after if relevant

3. **Testing checklist**
   - List the configurations you tested
   - Mention any edge cases considered

### PR Template

```markdown
## Description

Brief description of what this PR does

## Type of Change

- [ ] Bug fix (non-breaking change)
- [ ] New feature (non-breaking change)
- [ ] Breaking change
- [ ] Documentation update

## Testing

- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing completed

## Checklist

- [ ] My code follows the project style guidelines
- [ ] I have performed a self-review
- [ ] I have added tests for my changes
- [ ] I have updated documentation as needed
- [ ] All new and existing tests pass
```

## Documentation

### When to Update Documentation

Update docs when you:

- Add new CLI commands or options
- Add new frameworks, backends, or features
- Change existing behavior
- Fix bugs that users should know about
- Add new configuration options

### Documentation Files

- **README.md** - User-facing documentation
- **CONTRIBUTING.md** - This file
- **docs/ARCHITECTURE.md** - System design
- **docs/DEVELOPER-GUIDE.md** - Development details
- **docs/QUICK-START.md** - Quick reference
- **CHANGELOG.md** - Version history

## Getting Help

- **GitHub Issues** - Report bugs or request features
- **GitHub Discussions** - Ask questions or discuss ideas
- **Existing Code** - Look at similar implementations
- **Documentation** - Check the docs folder

## Common Issues

### Template Not Found

- Check template path in `src/templates/`
- Verify case sensitivity
- Ensure `.hbs` extension

### Dependency Installation Fails

- CLI automatically falls back from Bun to npm
- Check package compatibility
- Clear node_modules and try again

### TypeScript Errors

- Run `bun run typecheck` for details
- Check imports and types
- Ensure all dependencies are installed

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

## Thank You!

Your contributions make Precast better for everyone. We appreciate your time and effort! 🎉

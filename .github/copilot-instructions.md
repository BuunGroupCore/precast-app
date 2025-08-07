# Precast App - AI Assistant Context

## Project Overview

Precast App is a modern full-stack application scaffolding tool that enables developers to quickly bootstrap production-ready web applications. It consists of a CLI tool (`create-precast-app`), a visual web builder, and supporting packages for UI components, utilities, and hooks.

## Repository Structure

```
precast-app/
├── packages/
│   ├── cli/                 # Main CLI tool for project generation
│   ├── website/             # Visual builder and documentation site
│   ├── ui/                  # Shared UI component library
│   ├── utils/               # Shared utilities
│   ├── hooks/               # Shared React hooks
│   └── shared/              # Shared configuration and types
├── .github/                 # GitHub workflows and templates
├── docs/                    # Project documentation
└── scripts/                 # Build and maintenance scripts
```

## Key Technologies

### Core Stack
- **Language**: TypeScript
- **Runtime**: Node.js, Bun (preferred)
- **Build Tools**: Vite, tsup, ESBuild
- **Package Manager**: Bun (primary), npm/yarn/pnpm (fallback)
- **Testing**: Vitest, Playwright
- **Linting**: ESLint, Prettier

### Supported Frameworks
- **Frontend**: React, Vue, Angular, Svelte, Solid, Next.js, Nuxt, Remix, Astro, Vite, Vanilla
- **Backend**: Express, Fastify, NestJS, Hono, Next.js API Routes
- **Databases**: PostgreSQL, MySQL, SQLite, MongoDB
- **ORMs**: Prisma, Drizzle, TypeORM, Mongoose
- **Styling**: Tailwind CSS, CSS, SCSS, CSS Modules, Styled Components, Emotion
- **UI Libraries**: shadcn/ui, DaisyUI, Material UI, Chakra UI, Ant Design, Mantine
- **Auth**: Better Auth, NextAuth, Clerk, Supabase Auth, Auth0, Firebase Auth
- **API Clients**: TanStack Query, SWR, Axios, tRPC, Apollo Client

## Development Guidelines

### Code Style
1. **TypeScript First**: Always use TypeScript for new code
2. **Functional Approach**: Prefer functional components and hooks in React
3. **Async/Await**: Use async/await over promises where possible
4. **Error Handling**: Always handle errors gracefully with try/catch blocks
5. **Comments**: Code should be self-documenting; add comments only for complex logic

### File Naming Conventions
- **Components**: PascalCase (e.g., `BuilderPage.tsx`)
- **Utilities**: camelCase (e.g., `packageManager.ts`)
- **Templates**: kebab-case (e.g., `react-template.ts`)
- **Tests**: Same as source file with `.test.ts` suffix
- **Constants**: UPPER_SNAKE_CASE for exports

### Project Structure Patterns
- **Monorepo**: Use monorepo structure for full-stack projects
- **Feature-Based**: Organize code by features rather than file types
- **Barrel Exports**: Use index.ts files for clean imports
- **Separation of Concerns**: Keep business logic separate from UI

## CLI Package (`packages/cli`)

### Architecture
```
src/
├── commands/          # CLI command implementations
├── generators/        # Framework-specific generators
├── templates/         # Project templates
├── utils/            # Utility functions
├── prompts/          # Interactive prompts
└── core/             # Core functionality
```

### Key Files
- `src/cli.ts` - Main CLI entry point
- `src/commands/init.ts` - Project initialization
- `src/generators/base-generator.ts` - Base generator class
- `src/utils/api-client-setup.ts` - API client configuration
- `src/utils/claude-setup.ts` - AI assistant integration

### Adding Features
1. New frameworks: Add generator in `src/generators/`
2. New templates: Add to `src/templates/`
3. New commands: Add to `src/commands/`
4. Update shared config in `packages/shared/stack-config.ts`

## Website Package (`packages/website`)

### Architecture
```
src/
├── pages/            # Page components
├── components/       # Reusable components
├── features/         # Feature-specific modules
├── hooks/           # Custom React hooks
├── utils/           # Utility functions
├── services/        # API and external services
└── config/          # Configuration files
```

### Key Components
- `BuilderPage` - Visual project builder
- `StackSelector` - Technology stack selection
- `CommandPreview` - CLI command generation
- `FeatureGrid` - Feature selection interface

## Testing Strategy

### Unit Tests
- Test utilities and pure functions
- Mock external dependencies
- Focus on edge cases

### Integration Tests
- Test CLI commands end-to-end
- Verify template generation
- Check package installations

### Test Files Location
- Place tests next to source files
- Use `.test.ts` suffix
- Share test utilities in `test-utils.ts`

## Common Tasks

### Building the Project
```bash
# Build all packages
bun run build

# Build specific package
cd packages/cli && bun run build

# Watch mode for development
bun run dev
```

### Running Tests
```bash
# Run all tests
bun test

# Run specific package tests
cd packages/cli && bun test

# Run with coverage
bun test --coverage
```

### Adding Dependencies
```bash
# Add to workspace root
bun add -d <package>

# Add to specific package
cd packages/cli && bun add <package>

# Add dev dependency
bun add -d <package>
```

### Publishing
```bash
# Build and test
bun run build && bun test

# Publish CLI to npm
cd packages/cli && npm publish

# Update version
bun run version:patch
```

## Error Handling Patterns

### CLI Errors
```typescript
try {
  await riskyOperation();
} catch (error) {
  log.error(error instanceof Error ? error.message : "Unknown error");
  process.exit(1);
}
```

### API Errors
```typescript
if (!response.ok) {
  throw new Error(`API error: ${response.statusText}`);
}
```

### File System Errors
```typescript
if (!(await pathExists(path))) {
  throw new Error(`Path does not exist: ${path}`);
}
```

## Performance Considerations

1. **Lazy Loading**: Import heavy modules only when needed
2. **Parallel Execution**: Use Promise.all for concurrent operations
3. **Caching**: Cache frequently accessed data
4. **Bundle Size**: Keep CLI bundle small for faster execution
5. **Template Optimization**: Pre-compile templates where possible

## Security Best Practices

1. **Input Validation**: Always validate user input
2. **Path Traversal**: Use path.resolve for file paths
3. **Command Injection**: Never use string concatenation for shell commands
4. **Dependencies**: Regular security audits with `npm audit`
5. **Secrets**: Never commit secrets; use environment variables

## Debugging Tips

### CLI Debugging
```bash
# Enable debug output
DEBUG=* bun run cli init test-project

# Use Node inspector
node --inspect dist/cli.js init test-project
```

### Common Issues
1. **Package Manager Fallback**: CLI auto-detects and falls back from Bun to npm
2. **Template Generation**: Check template paths and Handlebars syntax
3. **Dependency Conflicts**: Clear node_modules and lock files
4. **Build Errors**: Ensure TypeScript config is correct

## Contributing Guidelines

### Before Making Changes
1. Check existing issues and PRs
2. Discuss major changes in issues first
3. Follow existing code patterns
4. Update tests for new features
5. Update documentation

### Pull Request Process
1. Create feature branch from main
2. Make focused, atomic commits
3. Write descriptive commit messages
4. Update CHANGELOG.md
5. Ensure all tests pass
6. Request review from maintainers

## Important Patterns to Follow

### Async Operations
Always use async/await and handle errors:
```typescript
export async function setupFeature(config: Config): Promise<void> {
  try {
    await validateConfig(config);
    await installDependencies(config);
    await generateFiles(config);
  } catch (error) {
    consola.error("Setup failed:", error);
    throw error;
  }
}
```

### File Generation
Use templates and ensure directories exist:
```typescript
const templatePath = path.join(__dirname, "templates", "component.hbs");
const outputPath = path.join(projectPath, "src", "components");
await ensureDir(outputPath);
await writeFile(path.join(outputPath, "Component.tsx"), content);
```

### Configuration Validation
Always validate before proceeding:
```typescript
const validator = getConfigValidator();
const validation = validator.validate(config);
if (!validation.valid) {
  validation.errors.forEach(error => log.error(error));
  throw new Error("Invalid configuration");
}
```

### Package Manager Detection
Use the utility function for consistency:
```typescript
const pm = await detectPackageManager();
await installDependencies(packages, {
  packageManager: pm,
  projectPath: targetPath,
  dev: false
});
```

## Environment Variables

### Development
```env
NODE_ENV=development
DEBUG=*
TELEMETRY_DISABLED=true
```

### Testing
```env
NODE_ENV=test
CI=true
```

### Production
```env
NODE_ENV=production
TELEMETRY_ENABLED=true
```

## Monorepo Management

### Workspace Commands
```bash
# Install dependencies for all packages
bun install

# Build all packages
bun run build

# Run command in specific package
bun run --filter @precast/cli build

# Add dependency to specific package
cd packages/cli && bun add <package>
```

### Package Dependencies
- Shared packages use workspace protocol
- External dependencies in respective package.json
- Dev dependencies at root level when possible

## Release Process

1. Update version in package.json files
2. Update CHANGELOG.md
3. Run full test suite
4. Build all packages
5. Publish to npm
6. Create GitHub release
7. Update documentation

## Telemetry and Analytics

The CLI collects anonymous usage statistics to improve the tool:
- Framework choices
- Feature selections
- Success/failure rates
- Performance metrics

Users can opt-out with `TELEMETRY_DISABLED=true`

## Support and Resources

- **Documentation**: [https://precast.app/docs](https://precast.app/docs)
- **GitHub Issues**: Report bugs and request features
- **Discord**: Community support and discussions
- **Stack Overflow**: Tag questions with `precast-app`

## Quick Reference

### Common CLI Commands
```bash
# Create new project
bunx create-precast-app@latest my-app

# With options
bunx create-precast-app@latest my-app \
  --framework react \
  --backend express \
  --database postgres \
  --orm prisma \
  --install

# Add feature to existing project
bunx create-precast-app@latest add auth --provider better-auth
```

### Development Workflow
1. Fork and clone repository
2. Install dependencies: `bun install`
3. Make changes in feature branch
4. Run tests: `bun test`
5. Build: `bun run build`
6. Submit PR with description

## Notes for AI Assistants

When working with this codebase:
1. **Maintain consistency** with existing patterns
2. **Test thoroughly** before suggesting changes
3. **Document** any new features or APIs
4. **Consider backwards compatibility** for CLI changes
5. **Optimize for developer experience** in all decisions
6. **Follow security best practices** always
7. **Keep performance** in mind for CLI operations
8. **Respect user choices** and provide good defaults

Remember: The goal is to make web development faster and more enjoyable while maintaining quality and best practices.
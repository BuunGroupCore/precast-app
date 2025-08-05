# create-precast-app CLI - Claude Code Context

This is the Precast CLI tool for scaffolding modern full-stack web applications with optimal Claude Code integration.

## Project Overview

The CLI is a TypeScript application built with Node.js that generates project templates for various frameworks. It includes built-in support for Claude Code, creating `.claude` folders with proper configuration for each generated project.

## Technology Stack

- **Language**: TypeScript
- **Runtime**: Node.js
- **CLI Framework**: Commander.js
- **UI**: @clack/prompts
- **Build Tool**: tsup
- **Package Manager**: Bun (with npm fallback)

## Project Structure

```
packages/cli/
├── src/
│   ├── cli.ts              # Main CLI entry point
│   ├── commands/           # CLI commands (init, add, etc.)
│   ├── generators/         # Framework-specific generators
│   ├── templates/          # Handlebars templates
│   ├── utils/              # Utility functions
│   │   ├── claude-setup.ts # Claude Code integration
│   │   ├── banner.ts       # ASCII banner system
│   │   └── ...
│   └── core/               # Core functionality
├── dist/                   # Built CLI files
└── CLAUDE.md              # This file
```

## Key Features

1. **Claude Code Integration**: Every generated project includes a `.claude` folder with project-specific settings.json
2. **Smart Package Manager Fallback**: Detects problematic packages (like esbuild) with Bun and automatically falls back to npm
3. **Custom Banner Support**: ASCII art banners for branding
4. **Framework Support**: React, Vue, Angular, Next.js, Nuxt, Svelte, Solid, Remix, Astro, Vite, Vanilla
5. **Full-Stack Configuration**: Database, ORM, authentication, styling, UI libraries

## Development Commands

```bash
# Install dependencies
bun install

# Build the CLI
bun run build

# Test locally
./dist/cli.js init test-project

# Run tests
bun test

# Lint and format
bun run lint
bun run format
```

## Important Implementation Details

### Claude Setup (src/utils/claude-setup.ts)
- Generates project-specific `.claude/settings.json` with appropriate permissions
- Creates comprehensive CLAUDE.md files for each project
- Adds `.claude/settings.local.json` to .gitignore automatically

### Package Manager Handling (src/utils/package-manager.ts)
- Detects problematic packages for Bun (esbuild, prisma, native modules)
- Automatically falls back to npm when issues are detected
- Provides clear user feedback during the fallback process

### Template System
- Uses Handlebars templates in `src/templates/`
- Conditional file generation based on project configuration
- Separate .ts.hbs and .js.hbs files (no conditional filenames)

## Common Tasks

### Adding a New Framework
1. Create generator in `src/generators/[framework]-template.ts`
2. Add templates in `src/templates/frameworks/[framework]/`
3. Update framework definitions in `shared/stack-config.ts`
4. Add framework-specific Claude permissions in `claude-setup.ts`

### Updating Claude Integration
- Modify `src/utils/claude-setup.ts` for settings.json generation
- Update CLAUDE.md generation logic for project-specific content
- Add new permissions as needed for different frameworks/tools

### Adding New CLI Commands
1. Create command file in `src/commands/`
2. Register in `src/cli.ts`
3. Add any necessary utilities in `src/utils/`

## Testing Guidelines

- Always test with multiple package managers (npm, yarn, pnpm, bun)
- Verify Claude integration creates proper .claude folder
- Test fallback behavior with problematic packages
- Ensure all frameworks generate correctly

## Important Notes

- The CLI must be robust and handle all edge cases
- Package manager fallbacks are critical for reliability
- Claude integration should be automatic for all projects
- Always validate user input and provide clear error messages
- Maintain backward compatibility with existing projects

## Performance Considerations

- Minimize template processing time
- Use parallel operations where possible
- Cache package manager detection results
- Keep CLI bundle size reasonable

## Security

- Never include sensitive data in templates
- Validate all user inputs
- Use proper file permissions
- Keep dependencies updated
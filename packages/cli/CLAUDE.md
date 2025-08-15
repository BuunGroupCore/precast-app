# Precast CLI - Context for Claude

## Overview

The Precast CLI (`create-precast-app`) is a TypeScript-based command-line tool that scaffolds modern full-stack web applications. It works in tandem with the Precast website's visual builder to provide both CLI and web-based project configuration experiences.

## Architecture

### Core Components

1. **CLI Entry Point** (`src/cli.ts`)
   - Main command orchestration using Commander.js
   - Supports `init`, `add`, and feature commands
   - Default command creates new projects

2. **Commands** (`src/commands/`)
   - `init.ts` - Primary project creation command
   - `add.ts` - Add features to existing projects
   - `deploy.ts` - Docker management commands
   - `generate.ts` - ORM client generation
   - `status.ts` - Project status information

3. **Generators** (`src/generators/`)
   - **frameworks/** - Frontend framework generators (react, vue, angular, next, etc.)
   - **backends/** - Backend generators (convex, cloudflare-workers, etc.)
   - **features/** - Feature generators (auth, backend, claude)
   - `base-generator.ts` - Shared generator logic
   - `index.ts` - Main generator orchestration

4. **Templates** (`src/templates/`)
   - Handlebars templates organized by feature type
   - Framework-specific templates in `frameworks/`
   - Backend templates in `backends/`
   - Feature templates for auth, database, styling, etc.

5. **Utilities** (`src/utils/`)
   - **setup/** - Setup utilities (auth, database, UI libraries, MCP, Claude)
   - **docker/** - Docker utilities (docker-setup, auto-deploy)
   - **config/** - Configuration management (env, precast-config)
   - **ui/** - UI utilities (logger, banner, interactive-ui)
   - **system/** - System utilities (package-manager, error-collector)
   - **analytics/** - Telemetry and analytics tracking

## Integration with Website Builder

### How They Work Together

1. **Website Builder** (`packages/website/src/pages/BuilderPage.tsx`)
   - Visual interface for configuring project options
   - Generates CLI commands based on user selections
   - Provides preset templates and recommended stacks
   - Saves user preferences to IndexedDB

2. **Command Generation**
   - Website builder creates complete CLI commands with all flags
   - Users can copy commands directly from the web interface
   - Example: `bunx create-precast-app@latest my-app --framework react --backend express --database postgres --orm prisma --styling tailwind --auth better-auth --install`

3. **Shared Configuration** (`packages/shared/stack-config.ts`)
   - Defines available frameworks, databases, ORMs, styling options
   - Ensures consistency between CLI and website
   - Single source of truth for supported technologies

## Key Features

### Claude Code Integration

Every generated project includes:

- `.claude/settings.json` with appropriate tool permissions
- Project-specific `CLAUDE.md` documentation
- MCP server configurations when selected
- AI context files for better code understanding

### Smart Package Manager Handling

- Detects user's preferred package manager
- Automatically falls back from Bun to npm for problematic packages
- Handles esbuild, Prisma, and native module issues gracefully

### Template System

- Handlebars templates with conditional logic
- Framework-specific file generation
- Dynamic dependency management
- Post-processing for TypeScript/JavaScript variants

## Project Flow

1. **User Interaction**
   - Either: Use website builder to configure visually
   - Or: Run CLI directly with flags or interactive prompts

2. **Configuration Gathering**
   - Validate user inputs
   - Apply defaults for missing options
   - Check compatibility between selections

3. **Project Generation**
   - Create project directory
   - Copy and process templates
   - Setup framework-specific files
   - Configure selected features (auth, database, UI libs)

4. **Post-Generation**
   - Initialize git repository (optional)
   - Install dependencies (optional)
   - Setup Claude Code integration
   - Display next steps to user

## Development Commands

```bash
# Build the CLI
bun run build

# Test locally
./dist/cli.js init test-project

# Run with specific options
./dist/cli.js init my-app --framework next --database postgres --orm prisma

# Add features to existing project
./dist/cli.js add auth --provider better-auth

# Update template dependencies
bun run update:templates
```

## Configuration Options

### Frameworks

- React, Vue, Angular, Next.js, Nuxt, Svelte, Solid, Remix, Astro, Vite, Vanilla

### Backends

- Node.js, Express, Fastify, Nest.js, Hono, None

### Databases

- PostgreSQL, MySQL, SQLite, MongoDB, None

### ORMs

- Prisma, Drizzle, TypeORM, Mongoose, None

### Styling

- Tailwind CSS, CSS, SCSS, CSS Modules, Styled Components, Emotion

### UI Libraries

- shadcn/ui, DaisyUI, Material UI, Chakra UI, Ant Design, Mantine

### Authentication

- Better Auth, NextAuth, Clerk, Supabase Auth, Auth0, Firebase Auth

### AI Assistance

- Claude (with MCP servers), GitHub Copilot, None

## Important Implementation Details

### Error Handling

- Comprehensive validation before project creation
- Clear error messages with suggested fixes
- Rollback on failure to prevent partial installations

### Performance

- Parallel dependency installation where possible
- Template caching for faster generation
- Minimal runtime dependencies

### Security

- Automatic security audit after installation
- Dependency vulnerability checks
- Safe default configurations

## Testing

The CLI includes comprehensive tests for:

- Template generation
- Package manager detection
- Configuration validation
- Feature additions

Run tests with: `bun test`

## Deployment

Published to npm as `create-precast-app`:

```bash
# Publish new version
bun run publish:patch  # or minor/major

# Test package contents
bun run pack:test
```

## Common Issues & Solutions

1. **Bun Installation Failures**
   - CLI automatically detects and falls back to npm
   - User sees clear feedback about the fallback

2. **Template Generation Errors**
   - Validates all paths before writing
   - Provides detailed error messages

3. **Dependency Conflicts**
   - Uses specific version ranges
   - Regular dependency updates via scripts

## Future Enhancements

- Plugin system for custom generators
- Remote template fetching
- Project migration tools
- Enhanced AI integration features

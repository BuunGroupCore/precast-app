# create-precast-app

CLI tool for scaffolding full-stack web applications with modern frameworks and tools.

## Features

- **Multi-framework support** - React, Vue, Angular, Next.js, Nuxt, Svelte, Solid, Remix, Astro, Vite, and Vanilla JS
- **Backend integration** - Express, Fastify, Hono, NestJS, Koa, or Next.js API Routes
- **Database setup** - PostgreSQL, MySQL, MongoDB, SQLite with Prisma or Drizzle ORM
- **Authentication** - Auth.js or Better Auth with social providers
- **UI libraries** - Shadcn/ui, DaisyUI, Material UI, Chakra UI, Ant Design
- **Claude Code integration** - Automatic .claude folder setup with project-specific configurations
- **Smart package manager handling** - Detects and handles Bun compatibility issues automatically

## Quick Start

```bash
# Interactive mode
npx create-precast-app@latest

# With options
npx create-precast-app my-app --framework react --backend express --database postgres

# Skip all prompts with defaults
npx create-precast-app my-app -y
```

## Available Options

### Frameworks

- `react` - React 18 with Vite
- `vue` - Vue 3 with Vite
- `angular` - Angular 17+
- `next` - Next.js 14 App Router
- `nuxt` - Nuxt 3
- `svelte` - SvelteKit
- `solid` - SolidJS
- `remix` - Remix
- `astro` - Astro
- `vite` - Vanilla Vite
- `vanilla` - Vanilla JavaScript/TypeScript

### Backends

- `express` - Express.js server
- `fastify` - Fastify server
- `hono` - Hono server
- `nestjs` - NestJS framework
- `koa` - Koa server
- `nextjs-api` - Next.js API Routes
- `none` - Frontend only

### Databases

- `postgres` - PostgreSQL
- `mysql` - MySQL
- `mongodb` - MongoDB
- `sqlite` - SQLite
- `none` - No database

### ORMs

- `prisma` - Prisma ORM (SQL databases + MongoDB)
- `drizzle` - Drizzle ORM (SQL databases)
- `none` - No ORM

### Styling

- `tailwind` - Tailwind CSS
- `css` - Plain CSS
- `scss` - SCSS/Sass

### UI Libraries

- `shadcn` - shadcn/ui components
- `daisyui` - DaisyUI components
- `mui` - Material UI
- `chakra` - Chakra UI
- `ant` - Ant Design
- `none` - No UI library

### Authentication

- `auth.js` - Auth.js (NextAuth v5)
- `better-auth` - Better Auth
- `none` - No authentication

### Additional Options

- `--typescript` / `--no-typescript` - TypeScript support (default: true)
- `--git` / `--no-git` - Initialize git repository (default: true)
- `--install` / `--no-install` - Install dependencies after creation
- `--ai` - Include AI context files (.claude, cursor, etc)
- `--docker` - Include Docker configuration
- `--eslint` - Add ESLint configuration
- `--prettier` - Add Prettier configuration
- `--mcp` - Add Model Context Protocol configuration
- `--pm <manager>` - Package manager (npm, yarn, pnpm, bun)
- `-y, --yes` - Skip prompts and use defaults

## Command Line Usage

```bash
# Create a new project
create-precast-app [project-name] [options]

# Add features to existing project
create-precast-app add [feature] [options]

# Show version
create-precast-app --version

# Show help
create-precast-app --help
```

## Project Structure

```
packages/cli/
├── src/
│   ├── commands/        # CLI commands (init, add)
│   ├── generators/      # Framework generators
│   ├── templates/       # Handlebars templates
│   ├── utils/           # Utilities (auth, package manager, etc)
│   └── cli.ts          # Main entry point
├── tests/              # Vitest test files
├── dist/               # Built output
└── package.json
```

## Database Configuration

When you select a database, the CLI:

- Validates ORM compatibility
- Generates connection configuration in `.env.example`
- Adds required dependencies
- Creates configuration files (Prisma schema, Drizzle config, etc.)
- Sets up Docker Compose (if Docker enabled)

### Example: PostgreSQL with Prisma

Generated files include:

- `.env.example` with `DATABASE_URL`
- `docker-compose.yml` for local development
- Database scripts in `package.json`:
  - `db:generate` - Generate Prisma client
  - `db:migrate` - Run migrations
  - `db:push` - Push schema changes
  - `db:studio` - Open Prisma Studio

### Database Setup

```bash
# Using Docker (recommended)
docker-compose up -d
npm run db:migrate

# Using local database
# 1. Install your database
# 2. Update DATABASE_URL in .env
# 3. Run migrations
```

## Testing

### Running Tests

```bash
# Build the CLI
bun run build

# Run all tests
bun test

# Generate test combinations
bun smart-test-generator.ts

# Run tests with coverage
bun test --coverage
```

### Test Coverage

The test suite covers:

- All framework combinations
- Database and ORM compatibility
- TypeScript/JavaScript generation
- Styling options
- Authentication setups
- UI library integrations
- Package manager handling

## Development

### Building from Source

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

### Adding New Frameworks

1. Create a generator file in `src/generators/[framework]-template.ts`
2. Add templates in `src/templates/frameworks/[framework]/`
3. Update framework definitions in `shared/stack-config.ts`
4. Add tests for the new framework

## Template System

### Handlebars Helpers

```handlebars
{{#if typescript}}
  // TypeScript code
{{else}}
  // JavaScript code
{{/if}}

{{#if (eq database "postgres")}}
  DATABASE_URL=postgresql://...
{{/if}}

{{#ifAny (eq backend "express") (eq backend "fastify")}}
  // Server code
{{/ifAny}}
```

### Available Helpers

- `eq` - Equality check
- `and`, `or`, `not` - Logical operators
- `includes` - Array includes
- `ifAny`, `ifAll` - Multiple conditions
- `capitalize` - Capitalize string
- `kebabCase` - Convert to kebab-case

## Contributing

Contributions are welcome! Please ensure all tests pass before submitting a pull request.

## License

MIT

## Package Manager Support

The CLI automatically detects your preferred package manager and handles compatibility issues:

- **Bun** - Uses `--ignore-scripts` flag to avoid postinstall script failures
- **npm** - Standard npm with automatic vulnerability fixing
- **Yarn** - Classic Yarn support
- **pnpm** - Efficient disk space usage

### Bun Compatibility

When using Bun, the CLI automatically adds `--ignore-scripts` to avoid issues with packages that have postinstall scripts (like esbuild, prisma, sharp). This ensures smooth installation without manual intervention.

## Claude Code Integration

Every generated project includes:

- `.claude/settings.json` - Project-specific permissions and configuration
- `CLAUDE.md` - Comprehensive project context for Claude
- MCP configuration for enhanced Claude Code features
- Framework-specific permissions (e.g., WebFetch for documentation sites)

## Troubleshooting

### Installation Issues

If you encounter installation errors:

1. **With Bun**: The CLI automatically uses `--ignore-scripts`. If issues persist, try using npm instead.
2. **Permission errors**: Run with `sudo` on Unix systems or as Administrator on Windows
3. **Network issues**: Check your internet connection and proxy settings

### Common Issues

- **"Command not found"**: Ensure npx is installed or install globally with `npm i -g create-precast-app`
- **Template errors**: Update to the latest version with `npm update create-precast-app`
- **Database connection**: Ensure Docker is running if using containerized databases

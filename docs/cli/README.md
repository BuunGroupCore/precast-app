# Precast CLI Documentation

The Precast CLI (`create-precast-app`) is a powerful scaffolding tool that generates modern web applications with your preferred tech stack. It offers both interactive prompts and declarative configuration via command-line flags.

## 🚀 Quick Start

```bash
# Interactive mode - CLI will prompt you for choices
bunx create-precast-app@latest my-awesome-app

# Declarative mode - specify everything upfront  
bunx create-precast-app@latest my-app \
  --framework react \
  --backend express \
  --database postgres \
  --orm prisma \
  --styling tailwind \
  --auth better-auth \
  --install
```

## 📖 Table of Contents

1. [Installation](#installation)
2. [Commands](#commands)
3. [Stack Options](#stack-options)
4. [CLI Flags](#cli-flags)
5. [Interactive Mode](#interactive-mode)
6. [AI Integration](#ai-integration)
7. [Docker Support](#docker-support)
8. [Examples](#examples)
9. [Advanced Usage](#advanced-usage)
10. [Troubleshooting](#troubleshooting)

## 🛠️ Installation

### NPX (Recommended)
```bash
npx create-precast-app@latest my-project
```

### Bun
```bash
bunx create-precast-app@latest my-project
```

### Yarn
```bash
yarn create precast-app my-project
```

### PNPM
```bash
pnpm create precast-app my-project
```

### Global Installation
```bash
npm install -g create-precast-app
create-precast-app my-project
```

## ⚡ Commands

### `init` (Default Command)
Creates a new project with your chosen stack.

```bash
create-precast-app init my-project [options]
# or simply
create-precast-app my-project [options]
```

### `add`
Adds new resources to an existing project (components, routes, API endpoints).

```bash
create-precast-app add [resource] [options]
```

**Examples:**
```bash
create-precast-app add component --name Button
create-precast-app add route --name dashboard  
create-precast-app add api --name users
```

### `add-features`
Adds features to an existing Precast project.

```bash
create-precast-app add-features [options]
```

**Options:**
- `--ui <library>` - Add UI component library
- `--ai <tools...>` - Add AI assistance tools
- `--yes` - Skip prompts and use defaults

**Examples:**
```bash
create-precast-app add-features --ui shadcn
create-precast-app add-features --ai claude cursor
```

### `banner`
Creates a customizable banner template file.

```bash
create-precast-app banner
```

### `list`
Lists available templates and features *(coming soon)*.

```bash
create-precast-app list
```

## 🏗️ Stack Options

### Frontend Frameworks
| Framework | Description | Recommended With |
|-----------|-------------|------------------|
| **React** | JavaScript library for UIs | TypeScript, Tailwind |
| **Vue** | Progressive JavaScript framework | TypeScript, Tailwind |
| **Angular** | Full-featured platform | TypeScript (required), SCSS |
| **Next.js** | React framework for production | TypeScript, Tailwind, Prisma |
| **Nuxt** | The intuitive Vue framework | TypeScript, Tailwind |
| **Svelte** | Cybernetically enhanced web apps | TypeScript, Tailwind |
| **Solid** | Performant reactive framework | TypeScript, Tailwind |
| **Remix** | Full-stack web framework | TypeScript, Tailwind, Prisma |
| **Astro** | Modern static site generator | TypeScript, Tailwind |
| **React Native** | Mobile app development | TypeScript |
| **TanStack Start** | Full-stack React framework | TypeScript, Tailwind |
| **Vite** | Next-gen frontend tooling | TypeScript |
| **Vanilla** | Plain JavaScript | - |

### UI Frameworks (for Vite)
When using Vite as your build tool, you can specify which UI framework to use:
- **React** - React with Vite
- **Vue** - Vue with Vite  
- **Solid** - SolidJS with Vite
- **Svelte** - Svelte with Vite
- **Vanilla** - Plain JavaScript with Vite

### Backend Options
| Backend | Description | Best For |
|---------|-------------|----------|
| **Express** | Fast, minimalist web framework | APIs, traditional web apps |
| **Fastify** | High-performance web framework | APIs, microservices |
| **Hono** | Ultrafast edge framework | Edge computing, serverless |
| **NestJS** | Enterprise-grade framework | Large applications, microservices |
| **Koa** | Next-gen web framework | Modern APIs |
| **Next.js API** | API routes with Next.js | Full-stack React apps |
| **Cloudflare Workers** | Edge-first serverless functions | Global deployment, edge computing |
| **Node.js** | Basic Node.js setup | Custom backends |
| **None** | Frontend only | Static sites, SPAs |

### Databases
| Database | Type | Best For | Compatible ORMs |
|----------|------|----------|-----------------|
| **PostgreSQL** | Relational | Complex queries, ACID compliance | Prisma, Drizzle, TypeORM |
| **MySQL** | Relational | Traditional web applications | Prisma, Drizzle, TypeORM |
| **MongoDB** | NoSQL | Flexible schema, rapid development | Mongoose |
| **Supabase** | PostgreSQL BaaS | Real-time features, auth | Built-in client |
| **Firebase** | NoSQL BaaS | Real-time apps, mobile | Built-in SDK |
| **Neon** | Serverless Postgres | Branching, autoscaling | Prisma, Drizzle |
| **Turso** | Edge SQLite | Edge computing, distributed | Drizzle |
| **PlanetScale** | Serverless MySQL | Branching, scaling | Prisma, Drizzle |
| **Cloudflare D1** | Edge SQLite | Edge applications | Drizzle |

### ORMs & Database Tools
| ORM | Language | Best For | Compatible Databases |
|-----|----------|----------|---------------------|
| **Prisma** | TypeScript | Type safety, migrations | PostgreSQL, MySQL |
| **Drizzle** | TypeScript | SQL-like syntax, edge computing | PostgreSQL, MySQL, SQLite |
| **TypeORM** | TypeScript | Enterprise apps, decorators | PostgreSQL, MySQL |
| **Mongoose** | JavaScript/TypeScript | MongoDB applications | MongoDB only |

### Styling Solutions
| Solution | Type | Best For |
|----------|------|----------|
| **Tailwind CSS** | Utility-first | Rapid development, consistency |
| **CSS** | Vanilla | Simple projects, learning |
| **SCSS** | Preprocessor | Traditional styling, mixins |
| **Styled Components** | CSS-in-JS | React apps, dynamic styling |

### UI Component Libraries
| Library | Framework | Description |
|---------|-----------|-------------|
| **shadcn/ui** | React | Modern, customizable components |
| **DaisyUI** | Any | Tailwind-based component library |
| **Material-UI** | React | Google Material Design |
| **Chakra UI** | React | Accessible, themeable components |
| **Ant Design** | React | Enterprise-grade UI library |
| **Mantine** | React | Feature-rich component library |

### Runtime Environments
| Runtime | Description | Best For |
|---------|-------------|----------|
| **Node.js** | Traditional JavaScript runtime | Most applications |
| **Bun** | Fast all-in-one runtime | Performance-critical apps |
| **Deno** | Secure TypeScript runtime | Security-focused apps |

### Authentication Providers
| Provider | Type | Best For |
|----------|------|----------|
| **Better Auth** | Library | Modern auth solution |
| **NextAuth.js** | Library | Next.js applications |
| **Clerk** | Service | Drop-in auth solution |
| **Supabase Auth** | Service | With Supabase backend |
| **Auth0** | Service | Enterprise authentication |
| **Firebase Auth** | Service | With Firebase backend |

### API Client Libraries
| Client | Best For | Supported Frameworks |
|--------|----------|---------------------|
| **TanStack Query** | Data fetching, caching | React, Vue, Solid, Svelte |
| **SWR** | Simple data fetching | React |
| **Axios** | HTTP requests | All frameworks |
| **tRPC** | Type-safe APIs | Full-stack TypeScript |
| **Apollo Client** | GraphQL applications | React, Vue, Angular |

## 🚩 CLI Flags

### Project Configuration
| Flag | Description | Example |
|------|-------------|---------|
| `-f, --framework` | Frontend framework | `--framework react` |
| `--ui-framework` | UI framework for Vite | `--ui-framework react` |
| `-b, --backend` | Backend framework | `--backend express` |
| `-d, --database` | Database | `--database postgres` |
| `-o, --orm` | ORM/Database tool | `--orm prisma` |
| `-s, --styling` | Styling solution | `--styling tailwind` |
| `-r, --runtime` | Runtime environment | `--runtime node` |

### Development Options
| Flag | Description | Default |
|------|-------------|---------|
| `--no-typescript` | Disable TypeScript | TypeScript enabled |
| `--no-git` | Skip git initialization | Git enabled |
| `--no-gitignore` | Skip .gitignore creation | Gitignore created |
| `--no-eslint` | Skip ESLint setup | ESLint enabled |
| `--no-prettier` | Skip Prettier setup | Prettier enabled |

### Installation Options
| Flag | Description | Example |
|------|-------------|---------|
| `--install` | Install dependencies | `--install` |
| `--pm, --package-manager` | Package manager | `--pm bun` |

### Enhanced Features
| Flag | Description | Example |
|------|-------------|---------|
| `-u, --ui-library` | UI component library | `--ui-library shadcn` |
| `-a, --auth` | Authentication provider | `--auth better-auth` |
| `--api-client` | API client library | `--api-client tanstack-query` |

### Docker Configuration
| Flag | Description | Default |
|------|-------------|---------|
| `--docker` | Include Docker configuration | Disabled |
| `--no-secure-passwords` | Use generic passwords | Secure passwords enabled |

### AI Integration
| Flag | Description | Example |
|------|-------------|---------|
| `--ai` | AI assistant integration | `--ai claude` |
| `--mcp-servers` | MCP servers for Claude | `--mcp-servers postgresql github` |

### Powerups
| Flag | Description | Example |
|------|-------------|---------|
| `--powerups` | Additional tools/libraries | `--powerups sentry,storybook` |

### Convenience Options
| Flag | Description |
|------|-------------|
| `-y, --yes` | Skip prompts, use defaults |

## 🎯 Interactive Mode

When you run the CLI without specifying options, it enters interactive mode:

```bash
create-precast-app my-project
```

The CLI will guide you through:

1. **Project Name** - If not provided as argument
2. **Framework Selection** - Choose your frontend framework
3. **Backend Options** - Select backend (if applicable)
4. **Database Setup** - Choose database and ORM
5. **Styling Configuration** - Pick your styling solution
6. **Additional Features** - UI libraries, auth, APIs
7. **Development Tools** - TypeScript, linting, formatting
8. **AI Integration** - Claude, Copilot, or other assistants
9. **Installation** - Automatically install dependencies

### Navigation Tips
- Use **arrow keys** to navigate options
- Press **Space** to select/deselect items
- Press **Enter** to confirm selection
- Press **Ctrl+C** to exit

## 🤖 AI Integration

Precast includes comprehensive AI assistant integration:

### Claude Integration
```bash
create-precast-app my-project --ai claude --mcp-servers postgresql github git
```

**Features:**
- Automatic `.claude/settings.json` configuration
- Project-specific `CLAUDE.md` documentation
- MCP (Model Context Protocol) server setup
- Tool permissions for database, git, filesystem access

**Available MCP Servers:**
- `postgresql` - Database operations
- `github-official` - GitHub API access  
- `git` - Git repository operations
- `filesystem` - File system access
- `mongodb` - MongoDB operations
- `supabase` - Supabase operations
- `memory` - Persistent memory
- `cloudflare` - Cloudflare API
- `aws-mcp` - AWS services
- `azure-mcp` - Azure services

### Other AI Tools
```bash
# GitHub Copilot integration
create-precast-app my-project --ai copilot

# Cursor IDE setup
create-precast-app my-project --ai cursor  

# Multiple AI tools
create-precast-app my-project --ai claude,copilot
```

## 🐳 Docker Support

Enable Docker configuration for your project:

```bash
create-precast-app my-project --docker --database postgres
```

**Features:**
- Database containers with proper networking
- Environment-specific configurations
- Secure random passwords (or generic with `--no-secure-passwords`)
- Health checks and restart policies
- Volume persistence for data

**Supported Services:**
- PostgreSQL with initialization scripts
- MySQL with custom configuration
- MongoDB with replica sets
- Redis with custom config
- Neon-compatible PostgreSQL setup
- PlanetScale MySQL setup

## 📋 Examples

### Full-Stack React App
```bash
create-precast-app ecommerce-app \
  --framework react \
  --backend express \
  --database postgres \
  --orm prisma \
  --styling tailwind \
  --ui-library shadcn \
  --auth better-auth \
  --api-client tanstack-query \
  --ai claude \
  --mcp-servers postgresql github \
  --powerups sentry,storybook \
  --docker \
  --install
```

### Next.js with Supabase
```bash
create-precast-app blog-app \
  --framework next \
  --database supabase \
  --styling tailwind \
  --ui-library shadcn \
  --auth supabase \
  --install
```

### Vue SPA with Firebase
```bash
create-precast-app dashboard \
  --framework vue \
  --database firebase \
  --styling tailwind \
  --ui-library daisyui \
  --auth firebase \
  --api-client axios \
  --install
```

### Svelte with Edge Database
```bash
create-precast-app edge-app \
  --framework svelte \
  --backend cloudflare-workers \
  --database cloudflare-d1 \
  --orm drizzle \
  --styling tailwind \
  --install
```

### Mobile App with React Native
```bash
create-precast-app mobile-app \
  --framework react-native \
  --database firebase \
  --auth firebase \
  --install
```

### Vite Multi-Framework Setup
```bash
# Vite with React
create-precast-app vite-react \
  --framework vite \
  --ui-framework react \
  --styling tailwind \
  --ui-library shadcn

# Vite with Vue
create-precast-app vite-vue \
  --framework vite \
  --ui-framework vue \
  --styling tailwind
```

## 🔧 Advanced Usage

### Package Manager Detection
The CLI automatically detects and uses your preferred package manager:

1. **Bun** (if available) - Fastest option
2. **PNPM** (if pnpm-lock.yaml exists)
3. **Yarn** (if yarn.lock exists)  
4. **NPM** (fallback)

Override with: `--package-manager bun|pnpm|yarn|npm`

### Template Customization
Projects include customizable banner files:

```bash
create-precast-app banner
```

This creates `precast-banner.txt` that you can customize for your project branding.

### Powerups System
Add development tools with powerups:

```bash
--powerups sentry,posthog,storybook,prettier,eslint,husky,vitest,playwright
```

**Available Powerups:**
- **sentry** - Error tracking and monitoring
- **posthog** - Product analytics and feature flags  
- **storybook** - Component development environment
- **prettier** - Code formatting
- **eslint** - Code linting and quality
- **husky** - Git hooks and pre-commit checks
- **vitest** - Unit testing framework
- **playwright** - End-to-end testing
- **react-i18next** - Internationalization for React
- **vue-i18n** - Internationalization for Vue
- **turborepo** - Monorepo build system
- **nx** - Smart, fast and extensible build system

### Security Features
- **Dependency Auditing** - Automatic security checks
- **Secure Passwords** - Cryptographically secure Docker passwords
- **Safe Defaults** - Security-first configuration choices
- **Vulnerability Scanning** - Built-in security audits

## 🐛 Troubleshooting

### Common Issues

#### "Command not found"
```bash
# Ensure you're using the correct package runner
npx create-precast-app@latest my-project

# Or install globally
npm install -g create-precast-app
```

#### Package Manager Issues
```bash
# CLI automatically falls back to npm if bun fails
# You can specify explicitly:
create-precast-app my-project --package-manager npm
```

#### TypeScript Errors
```bash
# Some frameworks require TypeScript:
create-precast-app my-project --framework angular  # Requires TS
create-precast-app my-project --framework nestjs   # Requires TS
```

#### Permission Errors
```bash
# Use npx instead of global installation:
npx create-precast-app@latest my-project
```

#### Dependency Conflicts
```bash
# Clear package manager cache:
npm cache clean --force
# or
bun pm cache rm
```

### Getting Help

1. **Check version**: `create-precast-app --version`
2. **View help**: `create-precast-app --help`
3. **Report issues**: [GitHub Issues](https://github.com/BuunGroupCore/precast-app/issues)
4. **Join discussions**: [GitHub Discussions](https://github.com/BuunGroupCore/precast-app/discussions)

### Debug Mode
```bash
# Enable verbose logging
DEBUG=* create-precast-app my-project

# Check CLI configuration
create-precast-app my-project --verbose
```

## 📚 Additional Resources

- [Visual Builder](https://precast.app/builder) - Configure projects visually
- [Templates](../templates/) - Understand project templates
- [Contributing](../contributing/) - Help improve Precast
- [Examples Repository](https://github.com/BuunGroupCore/precast-examples) - Sample projects

---

**Next Steps:**
- **[Command Reference](./commands.md)** - Complete documentation for all CLI commands
- **[Configuration Guide](./configuration.md)** - Stack compatibility and configuration patterns  
- **[Templates Guide](./templates.md)** - Understanding the template system and project structure
- **[Examples](./examples.md)** - Real-world usage examples and common patterns
- **[Troubleshooting](./troubleshooting.md)** - Solutions for common issues and problems
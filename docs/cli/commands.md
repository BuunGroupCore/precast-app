# CLI Command Reference

Complete reference for all Precast CLI commands, options, and usage patterns.

## Command Overview

| Command | Purpose | Status |
|---------|---------|---------|
| [`init`](#init-command) | Create a new project | ✅ Active |
| [`add`](#add-command) | Add resources to existing project | ✅ Active |
| [`add-features`](#add-features-command) | Add features to existing project | ✅ Active |
| [`banner`](#banner-command) | Create banner template | ✅ Active |
| [`list`](#list-command) | List available options | 🚧 Coming Soon |

## `init` Command

**Default command** - Creates a new project with your chosen technology stack.

### Syntax
```bash
create-precast-app init [project-name] [options]
create-precast-app [project-name] [options]  # init is default
```

### Parameters
- `project-name` *(optional)* - Name of the project to create. If omitted, CLI will prompt.

### Core Options

#### Framework Selection
```bash
-f, --framework <framework>
```
**Choices:** `react`, `vue`, `angular`, `next`, `nuxt`, `svelte`, `solid`, `remix`, `astro`, `react-native`, `tanstack-start`, `vite`, `vanilla`, `none`

**Examples:**
```bash
create-precast-app my-app --framework react
create-precast-app my-app --framework next
create-precast-app my-app --framework vite --ui-framework react
```

#### UI Framework (Vite Only)
```bash
--ui-framework <framework>
```
**Used with:** `--framework vite`  
**Choices:** `react`, `vue`, `solid`, `svelte`, `vanilla`

**Examples:**
```bash
create-precast-app vite-app --framework vite --ui-framework react
create-precast-app vite-app --framework vite --ui-framework vue
```

#### Backend Selection
```bash
-b, --backend <backend>
```
**Choices:** `express`, `fastify`, `hono`, `nestjs`, `koa`, `next-api`, `cloudflare-workers`, `node`, `none`

**Examples:**
```bash
create-precast-app api-app --backend express
create-precast-app edge-app --backend cloudflare-workers
create-precast-app frontend-app --backend none
```

#### Database Selection
```bash
-d, --database <database>
```
**Choices:** `postgres`, `mysql`, `mongodb`, `supabase`, `firebase`, `neon`, `turso`, `planetscale`, `cloudflare-d1`, `none`

**Examples:**
```bash
create-precast-app app --database postgres
create-precast-app app --database supabase
create-precast-app app --database none  # No database
```

#### ORM Selection
```bash
-o, --orm <orm>
```
**Choices:** `prisma`, `drizzle`, `typeorm`, `mongoose`, `none`

**Examples:**
```bash
create-precast-app app --orm prisma --database postgres
create-precast-app app --orm drizzle --database turso
create-precast-app app --orm mongoose --database mongodb
```

#### Styling Options
```bash
-s, --styling <styling>
```
**Choices:** `tailwind`, `css`, `scss`, `styled-components`

**Examples:**
```bash
create-precast-app app --styling tailwind
create-precast-app app --styling scss
```

#### Runtime Environment
```bash
-r, --runtime <runtime>
```
**Choices:** `node`, `bun`, `deno`

**Examples:**
```bash
create-precast-app app --runtime node
create-precast-app app --runtime bun
create-precast-app app --runtime deno
```

### Feature Options

#### UI Component Libraries
```bash
-u, --ui-library <library>
```
**Choices:** `shadcn`, `daisyui`, `mui`, `chakra`, `antd`, `mantine`

**Examples:**
```bash
create-precast-app app --framework react --ui-library shadcn
create-precast-app app --framework vue --ui-library daisyui
```

#### Authentication
```bash
-a, --auth <provider>
```
**Choices:** `better-auth`, `nextauth`, `clerk`, `supabase`, `auth0`, `firebase`

**Examples:**
```bash
create-precast-app app --auth better-auth
create-precast-app app --auth nextauth --framework next
create-precast-app app --auth supabase --database supabase
```

#### API Clients
```bash
--api-client <client>
```
**Choices:** `tanstack-query`, `swr`, `axios`, `trpc`, `apollo-client`

**Examples:**
```bash
create-precast-app app --api-client tanstack-query
create-precast-app app --api-client trpc --backend express
create-precast-app app --api-client apollo-client
```

### Development Options

#### TypeScript
```bash
--no-typescript
```
**Default:** TypeScript enabled  
**Effect:** Generates JavaScript instead of TypeScript

**Examples:**
```bash
create-precast-app app --no-typescript  # JavaScript project
create-precast-app app                  # TypeScript project (default)
```

**Note:** Some frameworks require TypeScript and will ignore this flag:
- Angular
- NestJS

#### Git Configuration
```bash
--no-git         # Skip git repository initialization
--no-gitignore   # Skip .gitignore file creation
```

**Examples:**
```bash
create-precast-app app --no-git          # No git repo
create-precast-app app --no-gitignore    # No .gitignore
create-precast-app app --no-git --no-gitignore  # Neither
```

#### Code Quality
```bash
--no-eslint     # Skip ESLint configuration
--no-prettier   # Skip Prettier configuration
```

**Examples:**
```bash
create-precast-app app --no-eslint       # No linting
create-precast-app app --no-prettier     # No formatting
create-precast-app app --no-eslint --no-prettier  # No quality tools
```

### Installation Options

#### Package Manager
```bash
--pm <manager>, --package-manager <manager>
```
**Choices:** `npm`, `yarn`, `pnpm`, `bun`  
**Default:** Auto-detected

**Examples:**
```bash
create-precast-app app --pm bun
create-precast-app app --package-manager pnpm
```

#### Auto-Install
```bash
--install
```
**Effect:** Automatically installs dependencies after project creation

**Examples:**
```bash
create-precast-app app --install          # Install dependencies
create-precast-app app                    # Skip installation (default)
```

### Docker Options

#### Docker Configuration
```bash
--docker                    # Include Docker setup
--no-secure-passwords      # Use generic passwords (less secure)
```

**Examples:**
```bash
create-precast-app app --docker --database postgres
create-precast-app app --docker --no-secure-passwords
```

**Generated Files:**
- `docker-compose.yml` with database services
- Database initialization scripts
- Environment configuration files
- Health check configurations

### AI Integration

#### AI Assistants
```bash
--ai <assistant>
```
**Choices:** `claude`, `copilot`, `cursor`, `gemini`

**Examples:**
```bash
create-precast-app app --ai claude
create-precast-app app --ai copilot
create-precast-app app --ai claude,cursor  # Multiple assistants
```

#### MCP Servers (Claude)
```bash
--mcp-servers <servers...>
```
**Available Servers:**
- `filesystem` - File system operations
- `memory` - Persistent memory
- `github-official` - Official GitHub API
- `github-api` - GitHub API operations  
- `gitlab` - GitLab operations
- `postgresql` - PostgreSQL operations
- `supabase` - Supabase operations
- `mongodb` - MongoDB operations
- `cloudflare` - Cloudflare API
- `aws-mcp` - AWS services
- `azure-mcp` - Azure services

**Examples:**
```bash
create-precast-app app --ai claude --mcp-servers postgresql github
create-precast-app app --ai claude --mcp-servers filesystem memory supabase
```

### Powerups

#### Development Tools
```bash
--powerups <tools>
```
**Format:** Comma-separated list  
**Available Tools:**
- `sentry` - Error tracking
- `posthog` - Product analytics
- `storybook` - Component development
- `prettier` - Code formatting
- `eslint` - Code linting
- `husky` - Git hooks
- `vitest` - Unit testing
- `playwright` - E2E testing
- `react-i18next` - React internationalization
- `vue-i18n` - Vue internationalization
- `turborepo` - Monorepo tooling
- `nx` - Build system

**Examples:**
```bash
create-precast-app app --powerups sentry,storybook
create-precast-app app --powerups prettier,eslint,husky,vitest
```

### Global Options

#### Skip Prompts
```bash
-y, --yes
```
**Effect:** Skip all prompts and use default values

**Examples:**
```bash
create-precast-app app --yes                           # All defaults
create-precast-app app --framework react --yes         # React with defaults
```

### Complete Examples

#### Full-Stack App
```bash
create-precast-app ecommerce \
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
  --install \
  --yes
```

#### Edge Application
```bash
create-precast-app edge-app \
  --framework svelte \
  --backend cloudflare-workers \
  --database cloudflare-d1 \
  --orm drizzle \
  --styling tailwind \
  --runtime deno \
  --install
```

#### Mobile Application
```bash
create-precast-app mobile \
  --framework react-native \
  --database firebase \
  --auth firebase \
  --api-client axios \
  --powerups sentry \
  --install
```

---

## `add` Command

**Status:** ✅ Active  
**Purpose:** Add new resources to an existing project

### Syntax
```bash
create-precast-app add [resource] [options]
```

### Parameters
- `resource` *(optional)* - Type of resource to add. If omitted, CLI will prompt.

### Resource Types
| Resource | Description | Example |
|----------|-------------|---------|
| `component` | React/Vue/Angular component | `Button`, `Modal` |
| `route` | Application route/page | `dashboard`, `profile` |
| `api` | API endpoint | `users`, `posts` |
| `model` | Database model | `User`, `Product` |
| `service` | Business logic service | `UserService` |

### Options

#### Resource Name
```bash
-n, --name <name>
```
**Required** when not specified as positional argument

**Examples:**
```bash
create-precast-app add component --name Button
create-precast-app add route --name dashboard
create-precast-app add api --name users
```

#### Language Selection
```bash
--no-typescript
```
**Default:** Uses project's TypeScript setting  
**Effect:** Generate JavaScript instead of TypeScript

**Examples:**
```bash
create-precast-app add component --name Button --no-typescript
```

### Examples

#### Add React Component
```bash
create-precast-app add component --name Button
# Creates: src/components/Button.tsx (or .jsx)
```

#### Add Vue Component
```bash
create-precast-app add component --name Modal
# Creates: src/components/Modal.vue
```

#### Add API Route
```bash
create-precast-app add api --name users
# Creates: src/api/users.ts (or appropriate structure)
```

#### Interactive Mode
```bash
create-precast-app add
# Prompts for:
# 1. Resource type (component, route, api, etc.)
# 2. Resource name
# 3. Additional options
```

---

## `add-features` Command

**Status:** ✅ Active  
**Purpose:** Add features to an existing Precast project

### Syntax
```bash
create-precast-app add-features [options]
```

### Options

#### UI Libraries
```bash
--ui <library>
```
**Choices:** `shadcn`, `daisyui`, `mui`, `chakra`, `antd`, `mantine`

**Examples:**
```bash
create-precast-app add-features --ui shadcn
create-precast-app add-features --ui mui
```

#### AI Tools
```bash
--ai <tools...>
```
**Choices:** `claude`, `copilot`, `cursor`, `gemini`  
**Format:** Space-separated list

**Examples:**
```bash
create-precast-app add-features --ai claude
create-precast-app add-features --ai claude cursor
```

#### Skip Prompts
```bash
-y, --yes
```
**Effect:** Use defaults for all prompts

**Examples:**
```bash
create-precast-app add-features --ui shadcn --yes
create-precast-app add-features --ai claude --yes
```

### What Gets Added

#### UI Library Addition
- Installs necessary dependencies
- Updates configuration files
- Adds component examples
- Updates import statements
- Configures theme systems

#### AI Tool Integration
- Creates `.claude/settings.json` (for Claude)
- Generates project documentation
- Sets up MCP server configurations
- Adds AI context files

### Examples

#### Add shadcn/ui
```bash
cd my-existing-precast-project
create-precast-app add-features --ui shadcn

# This adds:
# - shadcn/ui dependencies
# - components.json configuration
# - CSS variables setup
# - Example components
```

#### Add Claude Integration
```bash
cd my-existing-precast-project
create-precast-app add-features --ai claude

# This adds:
# - .claude/settings.json
# - CLAUDE.md documentation
# - Project context files
```

#### Interactive Mode
```bash
create-precast-app add-features

# Prompts for:
# 1. Which UI library to add (if any)
# 2. Which AI tools to add (if any)
# 3. Configuration options
```

---

## `banner` Command

**Status:** ✅ Active  
**Purpose:** Create a customizable banner template file

### Syntax
```bash
create-precast-app banner
```

### What It Does
Creates `precast-banner.txt` in your current directory with a customizable ASCII art template.

### Generated File
```
# precast-banner.txt

 ██████╗ ██████╗ ███████╗ ██████╗ █████╗ ███████╗████████╗
██╔══██╗██╔══██╗██╔════╝██╔════╝██╔══██╗██╔════╝╚══██╔══╝
██████╔╝██████╔╝█████╗  ██║     ███████║███████╗   ██║   
██╔═══╝ ██╔══██╗██╔══╝  ██║     ██╔══██║╚════██║   ██║   
██║     ██║  ██║███████╗╚██████╗██║  ██║███████║   ██║   
╚═╝     ╚═╝  ╚═╝╚══════╝ ╚═════╝╚═╝  ╚═╝╚══════╝   ╚═╝   

# Customize this banner for your project!
# This template is used when generating new projects.
```

### Usage
After creation, edit the file to customize your project branding. The CLI will use this template for new projects.

---

## `list` Command

**Status:** 🚧 Coming Soon  
**Purpose:** List available templates and features

### Planned Syntax
```bash
create-precast-app list [category]
```

### Planned Categories
- `frameworks` - Available frontend frameworks
- `backends` - Available backend options
- `databases` - Available database options
- `templates` - Pre-built project templates
- `powerups` - Available development tools

### Planned Examples
```bash
create-precast-app list                    # List all categories
create-precast-app list frameworks         # List frameworks only
create-precast-app list templates          # List project templates
```

---

## Global Flags

These flags work with any command:

| Flag | Description |
|------|-------------|
| `--version` | Show CLI version |
| `--help` | Show help information |
| `--verbose` | Enable verbose logging |
| `--debug` | Enable debug mode |

### Examples
```bash
create-precast-app --version
create-precast-app --help
create-precast-app init --help
create-precast-app add --help
```

---

## Exit Codes

| Code | Meaning |
|------|---------|
| `0` | Success |
| `1` | General error |
| `2` | Invalid arguments |
| `3` | File system error |
| `4` | Network error |
| `5` | Validation error |

---

**Next:** [Configuration Guide](./configuration.md) | [Templates](./templates.md) | [Troubleshooting](./troubleshooting.md)
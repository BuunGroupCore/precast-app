# Configuration Guide

Comprehensive guide to configuring Precast projects, understanding stack compatibility, and optimizing your development setup.

## 📋 Table of Contents

1. [Stack Compatibility](#stack-compatibility)
2. [Configuration Patterns](#configuration-patterns)
3. [Environment Configuration](#environment-configuration)
4. [Package Manager Settings](#package-manager-settings)
5. [AI Integration Setup](#ai-integration-setup)
6. [Docker Configuration](#docker-configuration)
7. [Validation & Troubleshooting](#validation--troubleshooting)

## 🔗 Stack Compatibility

Understanding which technologies work together is crucial for successful project creation.

### Framework Dependencies

#### TypeScript Requirements
Some frameworks **require** TypeScript and will ignore `--no-typescript`:

```bash
# These REQUIRE TypeScript
--framework angular    # Always TypeScript
--framework nestjs     # Always TypeScript

# These RECOMMEND TypeScript but allow JavaScript
--framework react      # Works with both
--framework vue        # Works with both
--framework next       # Works with both
```

#### Framework-Specific Features
```bash
# Next.js specific
--framework next --backend next-api    # Integrated API routes

# React ecosystem
--framework react --ui-library shadcn  # React-only UI library
--framework react --styling styled-components  # React-only styling

# Vue ecosystem  
--framework vue --ui-library daisyui   # Framework-agnostic UI
--framework nuxt                       # Vue-based meta-framework
```

### Database & ORM Compatibility

#### Compatible Combinations
| Database | Compatible ORMs | Recommended |
|----------|-----------------|-------------|
| **PostgreSQL** | Prisma, Drizzle, TypeORM | Prisma |
| **MySQL** | Prisma, Drizzle, TypeORM | Prisma |
| **MongoDB** | Mongoose | Mongoose |
| **SQLite** | Drizzle | Drizzle |
| **Supabase** | Built-in client | Built-in |
| **Firebase** | Built-in SDK | Built-in |
| **Neon** | Prisma, Drizzle | Prisma |
| **Turso** | Drizzle | Drizzle |
| **PlanetScale** | Prisma, Drizzle | Prisma |
| **Cloudflare D1** | Drizzle | Drizzle |

#### Incompatible Combinations
```bash
# These combinations will fail validation:
--database mongodb --orm prisma        ❌ MongoDB requires Mongoose
--database supabase --orm prisma       ❌ Supabase has built-in client
--database cloudflare-d1 --orm prisma  ❌ D1 only works with Drizzle
--database firebase --orm typeorm      ❌ Firebase uses its own SDK
```

#### Edge-Optimized Stacks
```bash
# Recommended for edge computing:
--backend cloudflare-workers --database cloudflare-d1 --orm drizzle
--backend hono --database turso --orm drizzle
--runtime deno --database supabase
```

### Backend Compatibility

#### Framework-Backend Relationships
```bash
# Full-stack frameworks with built-in backends
--framework next --backend next-api     # Recommended combination
--framework nuxt --backend none         # Nuxt handles server-side

# Traditional separation
--framework react --backend express     # Classic React + Express
--framework vue --backend fastify       # Vue + Fastify API
--framework svelte --backend hono       # Svelte + Hono
```

#### Runtime Compatibility
| Runtime | Compatible Backends | Notes |
|---------|-------------------|-------|
| **Node.js** | Express, Fastify, NestJS, Koa | Default choice |
| **Bun** | Express, Fastify, Hono | Fast performance |
| **Deno** | Hono, Fresh | Limited framework support |

### UI Library Compatibility

#### Framework-Specific Libraries
```bash
# React-only libraries
--framework react --ui-library shadcn     ✅
--framework react --ui-library mui        ✅  
--framework react --ui-library chakra     ✅

# Framework-agnostic libraries
--framework vue --ui-library daisyui      ✅
--framework svelte --ui-library daisyui   ✅
--framework angular --ui-library daisyui  ✅
```

#### Styling Dependencies
```bash
# Tailwind-based UI libraries
--ui-library shadcn --styling tailwind    ✅ Required
--ui-library daisyui --styling tailwind   ✅ Required

# CSS-in-JS libraries
--ui-library mui --styling css           ✅ Has built-in styling
--ui-library chakra --styling css        ✅ Has built-in styling
```

## 🎯 Configuration Patterns

Common stack combinations that work well together.

### Full-Stack Web Applications

#### Modern React Stack
```bash
create-precast-app modern-app \
  --framework react \
  --backend express \
  --database postgres \
  --orm prisma \
  --styling tailwind \
  --ui-library shadcn \
  --auth better-auth \
  --api-client tanstack-query \
  --runtime node \
  --docker
```

#### Next.js Production Stack
```bash
create-precast-app nextjs-app \
  --framework next \
  --backend next-api \
  --database neon \
  --orm prisma \
  --styling tailwind \
  --ui-library shadcn \
  --auth nextauth \
  --powerups sentry,storybook
```

#### Vue Enterprise Stack
```bash
create-precast-app vue-app \
  --framework vue \
  --backend nestjs \
  --database postgres \
  --orm typeorm \
  --styling tailwind \
  --ui-library daisyui \
  --auth auth0 \
  --api-client axios
```

### Edge-First Applications

#### Cloudflare Edge Stack
```bash
create-precast-app edge-app \
  --framework svelte \
  --backend cloudflare-workers \
  --database cloudflare-d1 \
  --orm drizzle \
  --styling tailwind \
  --runtime bun
```

#### Vercel Edge Stack
```bash
create-precast-app vercel-app \
  --framework next \
  --database planetscale \
  --orm drizzle \
  --styling tailwind \
  --ui-library shadcn \
  --auth clerk
```

### Mobile & Cross-Platform

#### React Native Stack
```bash
create-precast-app mobile-app \
  --framework react-native \
  --database firebase \
  --auth firebase \
  --styling tailwind \
  --powerups sentry
```

#### Cross-Platform Progressive Web App
```bash
create-precast-app pwa-app \
  --framework solid \
  --backend hono \
  --database turso \
  --orm drizzle \
  --styling tailwind \
  --powerups vite-pwa,workbox
```

### Rapid Prototyping

#### Quick MVP Stack
```bash
create-precast-app mvp \
  --framework react \
  --database supabase \
  --auth supabase \
  --styling tailwind \
  --ui-library shadcn \
  --yes \
  --install
```

#### No-Backend Starter
```bash
create-precast-app frontend-only \
  --framework vue \
  --backend none \
  --database none \
  --styling tailwind \
  --ui-library daisyui
```

## 🌍 Environment Configuration

Generated projects include environment configuration for different stages.

### Environment Files

#### Development (`.env.local`)
```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/myapp_dev"

# Authentication
AUTH_SECRET="dev-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# API Keys
OPENAI_API_KEY="sk-..."
STRIPE_SECRET_KEY="sk_test_..."

# Feature Flags
ENABLE_ANALYTICS=false
DEBUG_MODE=true
```

#### Production (`.env.production`)
```env
# Database
DATABASE_URL="${POSTGRES_URL}"

# Authentication  
AUTH_SECRET="${AUTH_SECRET}"
NEXTAUTH_URL="${VERCEL_URL}"

# API Keys
OPENAI_API_KEY="${OPENAI_API_KEY}"
STRIPE_SECRET_KEY="${STRIPE_SECRET_KEY}"

# Feature Flags
ENABLE_ANALYTICS=true
DEBUG_MODE=false
```

### Docker Environment

When using `--docker`, additional environment files are created:

#### Docker Compose Environment (`.env`)
```env
# Generated automatically with secure passwords
POSTGRES_USER=precast_user
POSTGRES_PASSWORD=secure_random_password_here
POSTGRES_DB=precast_app

# Application
DATABASE_URL=postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@postgres:5432/${POSTGRES_DB}
```

#### Secure Password Generation
```bash
# Default: Secure random passwords
create-precast-app app --docker --database postgres
# Generates: 32-character cryptographically secure passwords

# Generic passwords (less secure, easier for development)
create-precast-app app --docker --database postgres --no-secure-passwords
# Uses: Simple passwords like "password123"
```

## 📦 Package Manager Settings

The CLI intelligently detects and uses your preferred package manager.

### Detection Priority
1. **Bun** - If `bun` command is available
2. **PNPM** - If `pnpm-lock.yaml` exists in parent directories
3. **Yarn** - If `yarn.lock` exists in parent directories
4. **NPM** - Default fallback

### Override Detection
```bash
# Force specific package manager
create-precast-app app --package-manager npm
create-precast-app app --pm pnpm
create-precast-app app --pm bun
create-precast-app app --pm yarn
```

### Package Manager Features

#### Bun (Fastest)
```bash
# Automatic fallback for problematic packages
create-precast-app app --pm bun --database postgres

# CLI automatically detects if Bun fails with certain packages:
# - esbuild native modules
# - Prisma binaries
# - Canvas/image processing libraries
# Falls back to npm for these specific installations
```

#### PNPM (Efficient)
```bash
# Monorepo-friendly
create-precast-app app --pm pnpm --powerups turborepo

# Handles peer dependencies well
create-precast-app app --pm pnpm --ui-library mui
```

#### NPM (Universal)
```bash
# Most compatible, always works
create-precast-app app --pm npm

# Used automatically as fallback when other managers fail
```

## 🤖 AI Integration Setup

Comprehensive AI assistant integration with project-specific configuration.

### Claude Integration

#### Basic Setup
```bash
create-precast-app app --ai claude
```

**Generated Files:**
- `.claude/settings.json` - Claude Code configuration
- `CLAUDE.md` - Project documentation for Claude
- Project-specific context files

#### Advanced Setup with MCP Servers
```bash
create-precast-app app \
  --ai claude \
  --mcp-servers postgresql github filesystem memory
```

**MCP Server Configuration:**
```json
{
  "mcpServers": {
    "postgresql": {
      "command": "npx",
      "args": ["@modelcontextprotocol/server-postgresql"],
      "env": {
        "POSTGRES_CONNECTION_STRING": "postgresql://..."
      }
    },
    "github": {
      "command": "npx", 
      "args": ["@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_..."
      }
    }
  }
}
```

#### Available MCP Servers
| Server | Purpose | Environment Variables |
|--------|---------|---------------------|
| `postgresql` | Database operations | `POSTGRES_CONNECTION_STRING` |
| `github-official` | GitHub API access | `GITHUB_PERSONAL_ACCESS_TOKEN` |
| `filesystem` | File operations | None (uses local filesystem) |
| `memory` | Persistent memory | `MEMORY_STORE_PATH` |
| `supabase` | Supabase operations | `SUPABASE_URL`, `SUPABASE_ANON_KEY` |
| `mongodb` | MongoDB operations | `MONGODB_CONNECTION_STRING` |
| `cloudflare` | Cloudflare API | `CLOUDFLARE_API_TOKEN` |

### GitHub Copilot Integration
```bash
create-precast-app app --ai copilot
```

**Generated Files:**
- `.vscode/settings.json` - VS Code Copilot configuration
- `.gitignore` entries for Copilot cache
- README with Copilot usage guidelines

### Cursor Integration
```bash
create-precast-app app --ai cursor
```

**Generated Files:**
- `.cursorrules` - Cursor AI rules and context
- Project-specific AI prompts
- Code style guidelines for AI

### Multiple AI Tools
```bash
create-precast-app app --ai claude,copilot,cursor
```

Generates configuration for all specified AI tools with proper integration.

## 🐳 Docker Configuration

Comprehensive Docker setup for development and production environments.

### Basic Docker Setup
```bash
create-precast-app app --docker --database postgres
```

**Generated Files:**
- `docker-compose.yml` - Multi-service orchestration
- `Dockerfile` - Application containerization
- Database initialization scripts
- Environment configuration

### Docker Compose Services

#### PostgreSQL Service
```yaml
services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: ${POSTGRES_DB}
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./docker/postgres/init.sql:/docker-entrypoint-initdb.d/init.sql
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER}"]
      interval: 30s
      timeout: 10s
      retries: 5
```

#### Application Service
```yaml
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@postgres:5432/${POSTGRES_DB}
    depends_on:
      postgres:
        condition: service_healthy
    develop:
      watch:
        - action: sync
          path: ./src
          target: /app/src
        - action: rebuild
          path: package.json
```

### Database-Specific Configurations

#### MongoDB with Replica Set
```bash
create-precast-app app --docker --database mongodb
```

```yaml
services:
  mongodb:
    image: mongo:7
    command: mongod --replSet rs0
    environment:
      MONGO_INITDB_ROOT_USERNAME: ${MONGO_USER}
      MONGO_INITDB_ROOT_PASSWORD: ${MONGO_PASSWORD}
    volumes:
      - mongodb_data:/data/db
      - ./docker/mongodb/init-mongo.js:/docker-entrypoint-initdb.d/init-mongo.js
```

#### MySQL with Custom Configuration
```bash
create-precast-app app --docker --database mysql
```

```yaml
services:
  mysql:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: ${MYSQL_ROOT_PASSWORD}
      MYSQL_DATABASE: ${MYSQL_DATABASE}
      MYSQL_USER: ${MYSQL_USER}
      MYSQL_PASSWORD: ${MYSQL_PASSWORD}
    volumes:
      - mysql_data:/var/lib/mysql
      - ./docker/mysql/my.cnf:/etc/mysql/conf.d/my.cnf
      - ./docker/mysql/init.sql:/docker-entrypoint-initdb.d/init.sql
```

### Security Features

#### Secure Password Generation
```bash
# Default: Cryptographically secure 32-character passwords
create-precast-app app --docker
# Generates: "K8mN9pQ2rT5vW8xA1bD4gJ7lO0sU3yE6"

# Development-friendly passwords
create-precast-app app --docker --no-secure-passwords  
# Generates: "password123", "admin123", etc.
```

#### Network Security
```yaml
networks:
  default:
    name: precast_network
    driver: bridge
    ipam:
      config:
        - subnet: 172.20.0.0/16
```

### Development Workflow
```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f app

# Access database
docker-compose exec postgres psql -U precast_user -d precast_app

# Reset database
docker-compose down -v && docker-compose up -d
```

## ✅ Validation & Troubleshooting

The CLI performs extensive validation to prevent incompatible configurations.

### Validation Rules

#### Framework Validation
```bash
# ❌ Angular requires TypeScript
create-precast-app app --framework angular --no-typescript
# Error: Angular requires TypeScript

# ✅ Angular with TypeScript
create-precast-app app --framework angular
# Success: TypeScript enabled automatically
```

#### Database-ORM Validation
```bash
# ❌ MongoDB with Prisma
create-precast-app app --database mongodb --orm prisma
# Error: MongoDB requires Mongoose ORM

# ✅ MongoDB with Mongoose
create-precast-app app --database mongodb --orm mongoose
# Success: Compatible combination
```

#### Dependency Validation
```bash
# ❌ Styled Components without React
create-precast-app app --framework vue --styling styled-components
# Error: Styled Components requires React

# ✅ Styled Components with React
create-precast-app app --framework react --styling styled-components
# Success: Compatible combination
```

### Common Validation Errors

#### Missing Dependencies
```bash
Error: NestJS requires a backend runtime
Solution: NestJS is a backend framework itself

Error: Prisma requires TypeScript
Solution: Enable TypeScript or choose a different ORM

Error: Next.js API Routes require Next.js framework
Solution: Use --framework next with --backend next-api
```

#### Incompatible Combinations
```bash
Error: Supabase is incompatible with Prisma
Solution: Supabase has its own client, remove --orm flag

Error: Cloudflare D1 only works with Drizzle ORM
Solution: Use --orm drizzle with --database cloudflare-d1

Error: React Native requires React framework
Solution: React Native is automatically React-based
```

### Auto-Fix Suggestions
The CLI provides helpful suggestions for fixing validation errors:

```bash
create-precast-app app --framework angular --no-typescript

❌ Validation Error: Angular requires TypeScript
💡 Suggestion: Remove --no-typescript flag
🔧 Auto-fix: create-precast-app app --framework angular

✅ Fixed: TypeScript enabled automatically for Angular
```

### Debug Mode
```bash
# Enable detailed logging
DEBUG=* create-precast-app app --framework react

# Enable CLI debug mode  
create-precast-app app --framework react --debug

# Verbose validation output
create-precast-app app --framework react --verbose
```

### Validation Override
```bash
# Skip validation (advanced users only)
create-precast-app app --framework react --skip-validation

# Force incompatible combinations (not recommended)
create-precast-app app --force --database mongodb --orm prisma
```

## 🔧 Advanced Configuration

### Custom Templates
```bash
# Use custom template directory
create-precast-app app --template-path ./my-templates

# Override specific templates
create-precast-app app --template-override react=./custom-react-template
```

### Configuration Files
Projects can include `.precastrc.json` for default configurations:

```json
{
  "defaultFramework": "react",
  "defaultBackend": "express", 
  "defaultDatabase": "postgres",
  "defaultORM": "prisma",
  "defaultStyling": "tailwind",
  "powerups": ["prettier", "eslint", "husky"],
  "packageManager": "bun",
  "typescript": true,
  "docker": true,
  "ai": {
    "assistant": "claude",
    "mcpServers": ["postgresql", "github", "filesystem"]
  }
}
```

### Environment-Specific Configs
```bash
# Development config
create-precast-app app --config ./configs/dev.json

# Production config  
create-precast-app app --config ./configs/prod.json

# Staging config
create-precast-app app --config ./configs/staging.json
```

---

**Next:** [Templates Guide](./templates.md) | [Troubleshooting](./troubleshooting.md) | [Examples](./examples.md)
# Precast CLI Test Matrix

## Overview

This document outlines the comprehensive testing strategy for the Precast CLI, including all supported technology combinations, test scenarios, and validation procedures.

## Test Runner

The primary test runner is `test-runner.sh` which:

- Creates isolated test projects in `../test-projects/`
- Runs code quality checks (ESLint, Prettier, TypeScript)
- Starts development servers
- Manages Docker containers
- Provides cleanup utilities

### Usage

```bash
# Basic test with all checks
./test-runner.sh --framework react --backend express --database postgres --orm prisma --styling tailwind --runtime node --install --yes

# Test with Docker
./test-runner.sh --framework next --backend hono --database mysql --orm drizzle --styling tailwind --runtime bun --docker --install --yes

# Cleanup all test projects
./test-runner.sh --cleanup

# Cleanup specific project
./test-runner.sh --cleanup test-project-20240101120000-1234
```

## Technology Stack Support

### Frameworks (Active)

- ✅ **react** - React with Vite
- ✅ **vue** - Vue 3 with Vite
- ✅ **svelte** - SvelteKit
- ✅ **next** - Next.js 14+ (App Router)
- ✅ **astro** - Astro
- ✅ **vanilla** - Plain JavaScript
- ✅ **react-native** - React Native (Expo)
- ✅ **tanstack-start** - TanStack Start
- ✅ **vite** - Vite with UI framework selection
- ✅ **none** - Backend only

### Frameworks (Disabled/In Development)

- ⏸️ **angular** - Angular 17+
- ⏸️ **nuxt** - Nuxt 3
- ⏸️ **remix** - Remix
- ⏸️ **solid** - SolidJS

### Backends

- ✅ **node** - Node.js with Express
- ✅ **express** - Express.js
- ✅ **hono** - Hono (Edge-ready)
- ✅ **nestjs** - NestJS (requires TypeScript)
- ✅ **koa** - Koa
- ✅ **next-api** - Next.js API Routes (requires Next.js)
- ✅ **cloudflare-workers** - Cloudflare Workers
- ✅ **none** - Frontend only

### Backends (Disabled/In Development)

- ⏸️ **fastify** - Fastify
- ⏸️ **convex** - Convex BaaS
- ⏸️ **fastapi** - FastAPI (Python)

### Databases

- ✅ **postgres** - PostgreSQL
- ✅ **mysql** - MySQL
- ✅ **mongodb** - MongoDB
- ✅ **cloudflare-d1** - Cloudflare D1 (SQLite at edge)
- ✅ **none** - No database

### Databases (Disabled/In Development)

- ⏸️ **supabase** - Supabase
- ⏸️ **firebase** - Firebase
- ⏸️ **neon** - Neon (Serverless Postgres)
- ⏸️ **turso** - Turso (Edge SQLite)
- ⏸️ **planetscale** - PlanetScale

### ORMs

- ✅ **prisma** - Prisma (requires Node.js, TypeScript)
- ✅ **drizzle** - Drizzle (requires TypeScript)
- ✅ **typeorm** - TypeORM
- ✅ **mongoose** - Mongoose (MongoDB only)
- ✅ **none** - No ORM

### Styling

- ✅ **tailwind** - Tailwind CSS
- ✅ **css** - Plain CSS
- ✅ **scss** - SCSS/Sass
- ✅ **styled-components** - Styled Components (React only)

### UI Libraries (Tailwind only)

- ✅ **shadcn** - shadcn/ui (React/Next only)
- ✅ **daisyui** - DaisyUI (All frameworks)
- ✅ **brutalist** - Brutalist UI
- ⏸️ **mui** - Material UI
- ⏸️ **chakra** - Chakra UI
- ⏸️ **antd** - Ant Design
- ⏸️ **mantine** - Mantine
- ✅ **vuetify** - Vuetify (Vue only)

### Authentication Providers

- ✅ **auth.js** - Auth.js/NextAuth v5
- ✅ **better-auth** - Better Auth
- ✅ **supabase-auth** - Supabase Auth
- ✅ **firebase-auth** - Firebase Auth
- ⏸️ **clerk** - Clerk
- ⏸️ **auth0** - Auth0
- ⏸️ **passport.js** - Passport.js

### API Clients

- ✅ **hono-rpc** - Hono RPC
- ✅ **tanstack-query** - TanStack Query
- ✅ **swr** - SWR (React/Next only)
- ✅ **axios** - Axios
- ✅ **trpc** - tRPC
- ✅ **apollo-client** - Apollo Client (GraphQL)

### Runtimes

- ✅ **node** - Node.js
- ✅ **bun** - Bun
- ✅ **deno** - Deno

## Test Matrix

### Priority 1: Core Combinations (Must Test)

These are the most common and critical combinations that should be tested first.

| Framework    | Backend  | Database | ORM      | Styling            | Auth        | Status |
| ------------ | -------- | -------- | -------- | ------------------ | ----------- | ------ |
| react        | express  | postgres | prisma   | tailwind           | better-auth | ⏳     |
| next         | next-api | postgres | prisma   | tailwind + shadcn  | auth.js     | ⏳     |
| vue          | express  | mysql    | drizzle  | tailwind + daisyui | better-auth | ⏳     |
| react        | hono     | postgres | drizzle  | tailwind           | better-auth | ⏳     |
| next         | hono     | mysql    | prisma   | tailwind + shadcn  | better-auth | ⏳     |
| svelte       | express  | postgres | prisma   | tailwind           | better-auth | ⏳     |
| astro        | express  | postgres | drizzle  | tailwind           | better-auth | ⏳     |
| vite + react | fastify  | mongodb  | mongoose | css                | none        | ⏳     |
| react-native | express  | postgres | prisma   | -                  | better-auth | ⏳     |
| none         | nestjs   | postgres | typeorm  | -                  | passport.js | ⏳     |

### Priority 2: Edge/Serverless Combinations

| Framework | Backend            | Database      | ORM     | Styling  | Status |
| --------- | ------------------ | ------------- | ------- | -------- | ------ |
| next      | cloudflare-workers | cloudflare-d1 | drizzle | tailwind | ⏳     |
| react     | hono               | cloudflare-d1 | drizzle | tailwind | ⏳     |
| astro     | cloudflare-workers | cloudflare-d1 | drizzle | tailwind | ⏳     |

### Priority 3: Alternative Stacks

| Framework      | Backend | Database | ORM      | Styling           | UI Library | Status |
| -------------- | ------- | -------- | -------- | ----------------- | ---------- | ------ |
| vue            | koa     | mysql    | drizzle  | scss              | vuetify    | ⏳     |
| react          | express | mongodb  | mongoose | styled-components | -          | ⏳     |
| vanilla        | express | postgres | none     | css               | -          | ⏳     |
| tanstack-start | express | postgres | prisma   | tailwind          | -          | ⏳     |

### Priority 4: Docker Configurations

All Priority 1 tests should also be run with `--docker` flag to test containerization.

## Test Validation Checklist

For each test combination, validate:

### 1. Project Generation

- [ ] Project created successfully
- [ ] All files generated correctly
- [ ] No missing templates
- [ ] Correct file structure

### 2. Dependencies

- [ ] All dependencies installed
- [ ] No version conflicts
- [ ] Lock file generated (bun.lockb/package-lock.json)
- [ ] Peer dependencies satisfied

### 3. Code Quality

- [ ] ESLint passes with no errors
- [ ] Prettier formatting check passes
- [ ] TypeScript compilation successful (if applicable)
- [ ] No unused dependencies

### 4. Development Server

- [ ] Frontend starts on expected port (usually 5173/3000)
- [ ] Backend starts on expected port (usually 3001)
- [ ] Hot module replacement works
- [ ] API endpoints accessible

### 5. Database (if applicable)

- [ ] Database connection successful
- [ ] Migrations run successfully
- [ ] Seeds apply correctly
- [ ] CRUD operations work

### 6. Authentication (if applicable)

- [ ] Auth routes configured
- [ ] Session management works
- [ ] Protected routes enforce auth
- [ ] OAuth providers configured (if selected)

### 7. Docker (if --docker flag used)

- [ ] docker-compose.yml valid
- [ ] Containers start successfully
- [ ] Database initialized properly
- [ ] Environment variables loaded
- [ ] Inter-container networking works

### 8. Build Process

- [ ] Production build succeeds
- [ ] No build warnings
- [ ] Bundle size reasonable
- [ ] Static assets generated

## Automated Test Scripts

### run-all-tests.sh

Runs all priority 1 tests sequentially with full validation.

### test-framework.sh

Tests a specific framework with various backend/database combinations.

### test-edge-cases.sh

Tests edge cases and unusual combinations.

### validate-test.sh

Validates a single test project against all criteria.

## Test Results Tracking

Results are logged to `../test-projects/output/` with:

- Timestamp
- Configuration used
- ESLint errors
- Prettier errors
- TypeScript errors
- Build output
- Performance metrics

## Known Issues

### Framework-Specific

- **Next.js**: May have issues with certain auth providers in app router
- **React Native**: Limited backend integration options
- **Astro**: SSR mode compatibility varies with ORMs

### Database-Specific

- **MongoDB**: Incompatible with Drizzle ORM
- **Cloudflare D1**: Incompatible with Prisma

### Package Manager-Specific

- **Bun**: May fall back to npm for native dependencies
- **Prisma**: Requires postinstall script execution
- **Sharp**: May have platform-specific issues

## Continuous Integration

GitHub Actions workflow runs:

1. Matrix of core combinations
2. Code quality checks
3. Build verification
4. Docker build test
5. Performance benchmarks

## Reporting Issues

When reporting test failures:

1. Include full test command
2. Attach log file from `../test-projects/output/`
3. System information (OS, Node version, package manager)
4. Error messages and stack traces
5. Screenshot if UI-related

## Test Coverage Goals

- **Framework Coverage**: 100% of active frameworks
- **Backend Coverage**: 100% of active backends
- **Database Coverage**: 100% of active databases
- **Feature Coverage**: All auth providers, UI libraries, API clients
- **Edge Cases**: Incompatible combinations should fail gracefully
- **Performance**: Project generation < 30 seconds
- **Quality**: Zero ESLint/Prettier errors in generated code

## Next Steps

1. Complete Priority 1 test matrix
2. Automate test execution with CI/CD
3. Add performance benchmarking
4. Create regression test suite
5. Add visual regression testing for UI components
6. Implement smoke tests for deployed applications

---

Last Updated: 2025-08-10
Test Coverage: 0% (Initial setup)

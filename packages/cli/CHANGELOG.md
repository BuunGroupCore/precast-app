# create-precast-app

## 0.2.0

### Minor Changes

- [`1c3bbc2`](https://github.com/BuunGroupCore/precast-app/commit/1c3bbc232e652977258428e9cdbaae4fca7137a8) - feat: Add comprehensive testing architecture with automatic cleanup and quality validation

  ## Summary

  Implemented a robust testing framework for the CLI with automatic cleanup, quality validation, and comprehensive coverage for all supported technologies.

  ## Features Added

  ### Testing Architecture
  - **Automatic cleanup system** - TestSandbox manages temporary directories with guaranteed cleanup
  - **Quality validation** - TypeScript, ESLint, and Prettier checks on generated projects
  - **Fixture-based testing** - Reusable test configurations for consistent testing
  - **Test reporting** - Markdown reports with success rates, cleanup stats, and performance metrics
  - **Parallel test execution control** - Optimized test running with `fileParallelism: false`

  ### Test Coverage
  - **Docker deployment tests** - All databases, Redis, admin tools, security configurations
  - **Plugin system tests** - Stripe, email services (Resend, SendGrid), analytics (PostHog, Plausible), storage
  - **PowerUps tests** - Testing frameworks (Vitest, Playwright), code quality tools, bundlers, i18n, monorepo
  - **Framework/backend matrix** - All compatible combinations tested
  - **Edge case handling** - Invalid combinations, special characters, package manager fallbacks
  - **Quality validation** - Build verification, dependency checks, structure validation

  ### Test Fixtures
  - Added 40+ comprehensive test fixtures covering:
    - React, Vue, Next.js, Svelte, Solid, Angular, Remix, Astro, Vanilla
    - Express, Hono, NestJS, Fastify, Koa, Cloudflare Workers
    - PostgreSQL, MySQL, MongoDB, SQLite with Prisma, Drizzle, TypeORM
    - Docker configurations with auto-deploy
    - Authentication providers (Better Auth, NextAuth, Clerk, Supabase)
    - UI libraries (shadcn/ui, DaisyUI, Material UI, Chakra UI)
    - AI integrations (Claude with MCP servers)

  ### Developer Experience
  - **Test commands** - `pnpm test`, `pnpm test:integration`, `pnpm test:quality`, `pnpm test:full`
  - **Automatic test reports** - TEST_REPORT.md generated after each run
  - **CI/CD integration** - GitHub Actions workflow with matrix testing
  - **Debugging support** - Environment variables for keeping test dirs, verbose output
  - **Documentation** - Comprehensive test README and architecture docs

  ## Implementation Details

  ### New Files
  - `tests/config/` - Test configuration and setup
  - `tests/fixtures/` - Core and expanded test fixtures
  - `tests/helpers/` - Test utilities (sandbox, CLI runner, validators, reporter)
  - `tests/integration/` - Comprehensive integration test suites
  - `tests/README.md` - Complete testing documentation
  - `docs/developer/tests/testing-architecture.md` - Architecture documentation

  ### Updated Files
  - `vitest.config.ts` - Fixed `concurrent` to `fileParallelism`
  - `test-matrix.ts` - Extended interface for all CLI options
  - `.github/workflows/test.yml` - Updated for new test framework
  - `CONTRIBUTING.md` - Updated with new test structure

  ### Removed Files
  - `smart-test-generator.ts` - Replaced by fixture system

  ## Breaking Changes

  None - All changes are backwards compatible.

  ## Migration Guide

  For existing tests:
  1. Move test files to `tests/integration/`
  2. Use TestSandbox for temporary directories
  3. Add fixtures to `tests/fixtures/`
  4. Update test commands to use new scripts

  ## Testing

  All tests passing with 100% success rate:
  - 5 quality validation tests
  - Docker deployment configurations
  - Plugin integrations
  - PowerUps features
  - Framework/backend combinations
  - Edge cases and error handling

  ## Performance
  - Tests run in parallel where safe
  - Automatic cleanup prevents disk space issues
  - Optimized timeouts for different test types
  - Smart fixture categorization (critical, common, edge, experimental)

- [`156a900`](https://github.com/BuunGroupCore/precast-app/commit/156a900a9b6c39d6f3ceae160318ef84ca29d893) - Update Remix references to React Router v7 throughout the codebase

  This update reflects the evolution of Remix to React Router v7 and ensures consistency across all user-facing text and internal framework references:

  **Breaking Changes:**
  - Framework ID changed from "remix" to "react-router" in configuration files
  - Preferred stack renamed from "Remix Full-Stack" to "React Router v7 Full-Stack"

  **Updated Components:**
  - Stack configuration and compatibility arrays
  - Preferred stacks dialog and UI components
  - Framework detection logic for `@remix-run/react` dependency
  - Auth provider configurations and supported frameworks
  - Powerup configurations (React Aria, React Helmet, Playwright)
  - Template files and test specifications

  **Compatibility:**
  - Maintains backward compatibility for existing projects using `@remix-run/react`
  - All functionality preserved with updated naming and references
  - Template generation updated to use "react-router" framework ID

  Users with existing Remix projects will continue to work normally, while new projects will be created with the updated React Router v7 references.

### Patch Changes

- [`0086142`](https://github.com/BuunGroupCore/precast-app/commit/00861426cec7578b26521d662be9c7cbded13c62) - Updated, pipelines to be more specific to there action, updated missing handlebar files for powerups, additional testing for project generation, working on fixing bugs within authentications and identifying and clenaing up project code generated to ensure clean consistent code for projects added a survey on the website to help users understand the stack and the application they want to build by recommendating them stack options and many more bug fixes

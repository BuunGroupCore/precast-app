# create-precast-app

## 0.2.1

### Patch Changes

- [`b84ca5e`](https://github.com/BuunGroupCore/precast-app/commit/b84ca5e9664d8be0f0baad4d1b261a6735f91c92) - fix: Correct CI/CD workflows based on actual package structure

  ## Package Structure (Correct Understanding)

  ### Public Package (Published to npm)
  - **`create-precast-app`** - The CLI tool (only package in changesets)

  ### Private Packages (Not published, ignored by changesets)
  - **`@precast/website`** - Has build script
  - **`@precast/ui`** - Has build script
  - **`@precast/utils`** - NO build script (exports TypeScript directly)
  - **`@precast/hooks`** - NO build script (exports TypeScript directly)

  ### Not a Package
  - **`/packages/shared/`** - Just shared TypeScript files, no package.json

  ## Fixes Applied

  ### Test Workflow
  - Only build UI package (the only dependency with a build script)
  - Don't try to build @precast/shared (doesn't exist as package)
  - Don't try to build @precast/utils (no build script)
  - Fixed pnpm execution context issues

  ### Release Workflow
  - Split into two workflows (release-pr.yml and github-release.yml)
  - Only include `create-precast-app` in changesets (others are ignored)
  - Build UI, CLI, and website in correct order

  ### Changeset Configuration
  - Correctly ignores all private packages
  - Only tracks `create-precast-app` for versioning

- [`37eee42`](https://github.com/BuunGroupCore/precast-app/commit/37eee42d6cd2762ac5152631e3a2ad4feae3b369) - Fix Docker deployment tests to match CLI implementation
  - Updated test expectations to match actual Docker file structure (files in `docker/{database}/` directory)
  - Fixed auto-deploy script tests to handle platform-specific generation (.sh on Unix, .bat on Windows)
  - Corrected Next.js MySQL test fixture to use `backend: "next-api"` (databases require backends per CLI validation)
  - Removed invalid Redis database test (Redis is not a database option)
  - Added debug logging to Docker setup for better troubleshooting
  - All 10 Docker deployment tests now passing with proper validation

- [`b332305`](https://github.com/BuunGroupCore/precast-app/commit/b332305f01b2921878f5f7340ac6885cd1a55018) - fix: Split release workflow for proper GitHub releases

  ## Problem

  The previous release workflow tried to create GitHub releases in the same run as the changesets PR creation, which would never work since the PR needs to be merged first.

  ## Solution

  Split the release process into two separate workflows:

  ### 1. `release-pr.yml` - Release PR Creation
  - Creates changesets PR with version bumps
  - Runs on push to main
  - Builds all packages before creating PR
  - Handles npm publishing when PR is merged

  ### 2. `github-release.yml` - GitHub Release Creation
  - Triggers automatically on tag push (`v*`)
  - Can also be triggered manually with a specific tag
  - Creates GitHub release with:
    - Full monorepo archive
    - Standalone CLI archive
    - Extracted changelog for the version
    - Build instructions
  - Prevents duplicate releases
  - No npm references, GitHub-only distribution

  ## Benefits
  - **Actually works** - Proper separation of PR creation and release creation
  - **Automatic triggering** - Tag push automatically creates GitHub release
  - **Manual fallback** - Can manually create releases if needed
  - **Better archives** - Both full repo and standalone CLI archives
  - **Changelog integration** - Extracts version-specific changes
  - **Duplicate prevention** - Won't recreate existing releases

  ## Migration

  The old `release.yml` workflow is marked as deprecated but kept for reference. New releases will use the split workflow approach.

- [`b332305`](https://github.com/BuunGroupCore/precast-app/commit/b332305f01b2921878f5f7340ac6885cd1a55018) - chore: Update CI/CD workflows for new testing framework and GitHub-only releases

  ## CI/CD Improvements

  ### Testing Workflow Updates
  - **Matrix testing** on Node.js 18 and 20 for broader compatibility
  - **Separated test runs** by category (unit, integration, Docker, plugins, PowerUps, edge cases)
  - **Test report generation** with automatic upload to GitHub artifacts
  - **Cleanup verification** to ensure no leftover test directories
  - **Appropriate timeouts** for each test category
  - **GitHub job summaries** for quick test result overview
  - **Updated to upload-artifact@v4** to fix deprecation warning

  ### Release Workflow Updates
  - **GitHub-focused releases** without npm publishing references
  - **Dual archive creation**:
    - Full monorepo archive (`precast-app-v{version}.tar.gz`)
    - Standalone CLI archive (`precast-cli-v{version}.tar.gz`)
  - **Improved release notes** with:
    - All package versions listed
    - Build from source instructions
    - Clone from git tag instructions
    - Package descriptions and contents
    - Verification steps for GitHub releases

  ## Testing Changes

  The test workflow now:
  1. Builds all shared packages before testing
  2. Runs tests in logical groups with proper isolation
  3. Generates comprehensive test reports
  4. Verifies automatic cleanup worked correctly
  5. Supports both bun and pnpm as needed

  ## Release Changes

  The release workflow now:
  1. Creates GitHub releases with proper tags
  2. Provides source archives for distribution
  3. Focuses on GitHub as the primary distribution method
  4. Includes detailed build instructions for users

  These changes improve CI/CD reliability, test visibility, and make releases more accessible to users who want to build from source.

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

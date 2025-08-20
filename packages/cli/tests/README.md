# CLI Test Suite

## Overview

This directory contains the comprehensive test suite for the Precast CLI. The tests are designed to validate project generation, feature integration, and quality standards across all supported technology stacks.

## Test Architecture

```
tests/
├── config/                 # Test configuration
│   ├── setup.ts           # Global test setup
│   ├── test-matrix.ts     # Test combination definitions
│   └── vitest.config.ts   # Vitest configuration
├── fixtures/              # Test fixtures and data
│   ├── index.ts          # Core fixtures
│   └── expanded-fixtures.ts # Extended fixtures for all features
├── helpers/               # Test utilities
│   ├── sandbox.ts        # Temporary directory management
│   ├── test-cli.ts       # CLI wrapper for testing
│   ├── project-validator.ts # Project structure validation
│   ├── project-quality-validator.ts # Quality checks
│   └── vitest-reporter.ts # Custom test reporter
└── integration/           # Integration test suites
    ├── project-quality.test.ts # Quality validation tests
    ├── docker-deployment.test.ts # Docker configuration tests
    ├── plugins.test.ts    # Plugin system tests
    ├── powerups.test.ts   # PowerUps tests
    ├── framework-backend-matrix.test.ts # Framework/backend combinations
    └── edge-cases.test.ts # Edge cases and error handling
```

## Running Tests

### Quick Commands

```bash
# Run all tests
pnpm test

# Run integration tests only
pnpm test:integration

# Run with quality checks
pnpm test:quality

# Run full test suite with all checks
pnpm test:full

# Run specific test file
pnpm test tests/integration/docker-deployment.test.ts

# Run tests matching a pattern
pnpm test --grep "Docker"

# Run tests in watch mode
pnpm test --watch

# Run with coverage
pnpm test --coverage
```

### Test Scripts

Add these scripts to your `package.json`:

```json
{
  "scripts": {
    "test": "vitest run --config tests/config/vitest.config.ts",
    "test:watch": "vitest watch --config tests/config/vitest.config.ts",
    "test:integration": "vitest run tests/integration --config tests/config/vitest.config.ts",
    "test:quality": "RUN_QUALITY_TESTS=true vitest run tests/integration/project-quality.test.ts --config tests/config/vitest.config.ts",
    "test:docker": "vitest run tests/integration/docker-deployment.test.ts --config tests/config/vitest.config.ts",
    "test:plugins": "vitest run tests/integration/plugins.test.ts --config tests/config/vitest.config.ts",
    "test:powerups": "vitest run tests/integration/powerups.test.ts --config tests/config/vitest.config.ts",
    "test:matrix": "vitest run tests/integration/framework-backend-matrix.test.ts --config tests/config/vitest.config.ts",
    "test:edge": "vitest run tests/integration/edge-cases.test.ts --config tests/config/vitest.config.ts",
    "test:full": "vitest run --config tests/config/vitest.config.ts --reporter=default --reporter=./tests/helpers/vitest-reporter.ts",
    "test:coverage": "vitest run --coverage --config tests/config/vitest.config.ts"
  }
}
```

### Environment Variables

```bash
# Skip dependency installation (faster tests)
SKIP_INSTALL=true pnpm test

# Run quality checks
RUN_QUALITY_TESTS=true pnpm test:quality

# Enable debug output
DEBUG=precast:* pnpm test

# Set custom timeout (milliseconds)
TEST_TIMEOUT=60000 pnpm test

# Keep test directories for debugging
KEEP_TEST_DIRS=true pnpm test
```

## Test Report

After running tests, a markdown report is automatically generated at `TEST_REPORT.md` in the CLI package root. This report includes:

- **Summary**: Total tests, pass/fail counts, success rate
- **Cleanup Status**: Temporary directories created/cleaned
- **Test Suites**: Results grouped by test suite
- **Detailed Results**: Individual test results with duration
- **Test Trends**: Success rate tracking

The report is **automatically overwritten** after each test run to provide the latest results.

### Report Location

```
packages/cli/TEST_REPORT.md  # Always overwritten with latest results
```

### Report Contents

- Test execution timestamp
- Overall success/failure statistics
- Cleanup verification (ensures no leftover test directories)
- Performance metrics for each test
- Quick commands for re-running specific test categories

## Adding New Tests

### 1. Create a Test Fixture

Add to `tests/fixtures/expanded-fixtures.ts`:

```typescript
export const MY_FEATURE_FIXTURES: ProjectFixture[] = [
  {
    name: "my-feature-test",
    config: {
      framework: "react",
      backend: "express",
      myFeature: true, // Your feature flag
      database: "postgres",
      orm: "prisma",
      styling: "tailwind",
      runtime: "node",
      typescript: true,
      category: "common",
      expectedDuration: 10000,
    },
    expectedFiles: ["package.json", "src/features/my-feature.ts"],
    expectedDependencies: ["my-feature-package"],
    validationRules: [
      { type: "file-exists", path: "src/features/my-feature.ts" },
      { type: "dependency-exists", name: "my-feature-package" },
    ],
  },
];
```

### 2. Create Integration Test

Create `tests/integration/my-feature.test.ts`:

```typescript
import { describe, it, expect, beforeEach, afterEach } from "vitest";

import { MY_FEATURE_FIXTURES } from "../fixtures/expanded-fixtures";
import { ProjectValidator } from "../helpers/project-validator";
import { TestSandbox } from "../helpers/sandbox";
import { CLITestRunner } from "../helpers/test-cli";

describe("My Feature Tests", () => {
  let testRunner: CLITestRunner;
  let validator: ProjectValidator;
  let sandbox: TestSandbox;

  beforeEach(async () => {
    testRunner = new CLITestRunner();
    validator = new ProjectValidator();
    sandbox = new TestSandbox();
    await sandbox.setup();
  });

  afterEach(async () => {
    // Automatic cleanup
    await sandbox.cleanup();
  });

  describe("Feature Generation", () => {
    MY_FEATURE_FIXTURES.forEach((fixture) => {
      it(`should generate ${fixture.name} successfully`, async () => {
        const projectName = `my-feature-${fixture.name}`;
        const workingDir = sandbox.getTempDir();

        // Generate project
        const result = await testRunner.generateProject(
          projectName,
          fixture.config,
          workingDir,
          { install: false } // Set to true for full installation test
        );

        expect(result.exitCode).toBe(0);

        const projectPath = sandbox.getPath(projectName);

        // Validate project structure
        const validation = await validator.validateProject(projectPath, fixture);
        expect(validation.valid).toBe(true);

        // Add custom validations
        const { existsSync, readFileSync } = await import("fs");
        expect(existsSync(`${projectPath}/src/features/my-feature.ts`)).toBe(true);

        // Check package.json
        const packageJson = JSON.parse(readFileSync(`${projectPath}/package.json`, "utf-8"));
        expect(packageJson.dependencies?.["my-feature-package"]).toBeDefined();
      }, 30000); // 30 second timeout
    });
  });
});
```

### 3. Run Your New Test

```bash
# Run just your new test
pnpm test tests/integration/my-feature.test.ts

# Run with install flag for full validation
FULL_INSTALL=true pnpm test tests/integration/my-feature.test.ts
```

## Test Utilities

### TestSandbox

Manages temporary directories with automatic cleanup:

```typescript
const sandbox = new TestSandbox();
await sandbox.setup(); // Creates temp directory

const tempDir = sandbox.getTempDir(); // Get temp directory path
const projectPath = sandbox.getPath("my-project"); // Get project path

await sandbox.cleanup(); // Cleans up automatically
```

### CLITestRunner

Wraps CLI for testing:

```typescript
const testRunner = new CLITestRunner();

// Generate a project
const result = await testRunner.generateProject(
  "project-name",
  config,
  workingDir,
  { install: true } // Install dependencies
);

expect(result.exitCode).toBe(0);
console.log(result.stdout); // CLI output
```

### ProjectValidator

Validates project structure:

```typescript
const validator = new ProjectValidator();

const validation = await validator.validateProject(projectPath, fixture);
expect(validation.valid).toBe(true);

if (!validation.valid) {
  console.error("Validation errors:", validation.errors);
}
```

### ProjectQualityValidator

Runs quality checks (TypeScript, ESLint, Prettier):

```typescript
const qualityValidator = new ProjectQualityValidator();

const result = await qualityValidator.runFullQualityCheck(projectPath, {
  skipInstall: false,
  skipBuild: false,
  skipTypeCheck: false,
  skipLint: false,
  skipPrettier: false,
});

expect(result.passed).toBe(true);
```

## Test Categories

### Critical Tests

Essential functionality that must always work:

- React + Express + PostgreSQL
- Next.js fullstack
- Vue + Fastify
- TypeScript projects

### Common Tests

Frequently used configurations:

- JavaScript projects
- Alternative databases (MongoDB, MySQL)
- Different frameworks (Remix, Astro)

### Edge Cases

Unusual but valid configurations:

- Vanilla JavaScript
- Complex nested features
- Maximum feature combinations
- Special characters in names

### Docker Tests

Docker deployment configurations:

- Multiple databases
- Redis integration
- Admin tools
- Security settings

### Plugin Tests

Third-party integrations:

- Stripe payments
- Email services (Resend, SendGrid)
- Analytics (PostHog, Plausible)
- Storage (Uploadthing, AWS S3)

### PowerUps Tests

Development tools:

- Testing frameworks (Vitest, Playwright)
- Code quality (ESLint, Prettier, Husky)
- Bundlers (Webpack, Rollup)
- Monorepo tools

## Debugging Tests

### Keep Test Directories

```bash
# Prevent cleanup for debugging
KEEP_TEST_DIRS=true pnpm test

# Check leftover directories
ls -la /tmp/ | grep precast-test-
```

### Verbose Output

```bash
# Enable debug logging
DEBUG=precast:* pnpm test

# Show all CLI output
VERBOSE=true pnpm test
```

### Run Single Test

```bash
# Run specific test by name
pnpm test -t "should generate react-express-postgres"

# Run with Node debugger
node --inspect-brk node_modules/.bin/vitest run tests/integration/docker-deployment.test.ts
```

## Continuous Integration

### GitHub Actions

```yaml
name: Test CLI

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - uses: actions/setup-node@v3
        with:
          node-version: "18"

      - uses: oven-sh/setup-bun@v1

      - name: Install dependencies
        run: bun install

      - name: Build CLI
        run: bun run build

      - name: Run tests
        run: pnpm test:full

      - name: Upload test report
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: test-report
          path: packages/cli/TEST_REPORT.md
```

## Best Practices

1. **Use Fixtures**: Define reusable test configurations in fixtures
2. **Automatic Cleanup**: Always use TestSandbox for temp directories
3. **Validate Structure**: Use ProjectValidator for consistent checks
4. **Test Isolation**: Each test should be independent
5. **Meaningful Names**: Use descriptive test and fixture names
6. **Timeout Management**: Set appropriate timeouts for install tests
7. **Skip When Appropriate**: Use `{ install: false }` for faster structure tests
8. **Check Reports**: Review TEST_REPORT.md after test runs

## Troubleshooting

### Tests Failing with Timeout

Increase timeout for tests with installation:

```typescript
it("should install dependencies", async () => {
  // test code
}, 300000); // 5 minutes
```

### Cleanup Not Working

Check for leftover directories:

```bash
# Find test directories
find /tmp -name "precast-test-*" -type d

# Manual cleanup if needed
rm -rf /tmp/precast-test-*
```

### Missing Dependencies

Ensure CLI is built before running integration tests:

```bash
bun run build
pnpm test:integration
```

### Test Report Not Generating

Ensure the reporter is configured:

```bash
pnpm test:full  # Uses custom reporter
```

## Support

For issues or questions about testing:

1. Check this README
2. Review existing test files for examples
3. Check `docs/developer/tests/testing-architecture.md`
4. Open an issue on GitHub

#!/bin/bash

# Script to run CLI tests with proper structure
set -e

echo "🧪 Running Precast CLI Tests"
echo "============================"

# Ensure we're in the right directory
cd "$(dirname "$0")/.."

# Build the CLI first
echo "📦 Building CLI..."
bun run build

# Clean up old test files
echo "🧹 Cleaning up old test files..."
rm -rf /tmp/precast-test-* /tmp/test-* /tmp/matrix-* /tmp/perf-* /tmp/quality-* /tmp/cleanup-* /tmp/install-* 2>/dev/null || true

# Run unit tests
echo ""
echo "🔬 Running Unit Tests..."
bun test src/**/*.test.ts --config tests/config/vitest.config.ts

# Run integration tests
echo ""
echo "🔗 Running Integration Tests..."
bun test tests/integration/project-generation.test.ts --config tests/config/vitest.config.ts

# Run quality tests (with install and validation)
if [ "$RUN_QUALITY_TESTS" = "true" ]; then
  echo ""
  echo "🎯 Running Quality Tests (with install)..."
  bun test tests/integration/project-quality.test.ts --config tests/config/vitest.config.ts
else
  echo ""
  echo "⏭️  Skipping quality tests (set RUN_QUALITY_TESTS=true to run)"
fi

# Run E2E tests (optional, based on environment)
if [ "$RUN_E2E" = "true" ]; then
  echo ""
  echo "🌐 Running E2E Tests..."
  bun test tests/e2e/**/*.test.ts --config tests/config/vitest.config.ts
else
  echo ""
  echo "⏭️  Skipping E2E tests (set RUN_E2E=true to run)"
fi

# Verify cleanup
echo ""
echo "🧹 Verifying cleanup..."
REMAINING_TEST_DIRS=$(ls -la /tmp/ | grep -E "precast-test-|test-|matrix-|quality-" | wc -l || echo "0")
if [ "$REMAINING_TEST_DIRS" -gt "0" ]; then
  echo "⚠️  Warning: Found $REMAINING_TEST_DIRS test directories not cleaned up"
  ls -la /tmp/ | grep -E "precast-test-|test-|matrix-|quality-" || true
else
  echo "✅ All test directories cleaned up successfully"
fi

# Generate test report
echo ""
echo "📊 Generating Test Report..."
bun test --reporter=json > test-results.json || true

echo ""
echo "✅ Testing complete!"
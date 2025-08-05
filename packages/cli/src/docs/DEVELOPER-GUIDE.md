# Developer Guide - Testing the CLI

This guide explains how to test the CLI during development without constantly rebuilding.

## Quick Development Setup

### 1. Using tsx for Development (Recommended)

The fastest way to test changes without rebuilding:

```bash
# Run the CLI directly with tsx
npx tsx src/cli.ts my-test-app --framework react --backend express

# Or use the dev script
npm run dev -- my-test-app --framework react
```

### 2. Watch Mode for Continuous Development

Start the watch mode in one terminal:

```bash
npm run dev
```

This watches for changes and auto-recompiles. In another terminal, you can run:

```bash
node dist/cli.js test-app --framework react
```

### 3. Testing Without Installing

Create a test script for quick iterations:

```bash
# Create test-cli.sh
cat > test-cli.sh << 'EOF'
#!/bin/bash
# Test CLI without rebuilding
cd test-output
rm -rf test-app
npx tsx ../src/cli.ts test-app "$@"
EOF

chmod +x test-cli.sh

# Use it
./test-cli.sh --framework react --backend express -y
```

## Development Workflow

### 1. Template Development

When working on templates:

```bash
# Edit templates
code src/templates/frameworks/react/base/package.json.hbs

# Test immediately without build
npx tsx src/cli.ts test-app -y --framework react

# Check generated output
cat test-output/test-app/package.json
```

### 2. Core Development

When working on core features:

```bash
# Edit core files
code src/core/template-engine.ts

# Run tests directly
npx vitest src/core/__tests__/template-engine.test.ts

# Test CLI integration
npx tsx src/cli.ts test-app -y
```

### 3. Quick Testing Commands

```bash
# Test React + TypeScript + Tailwind
npx tsx src/cli.ts test-react -y \
  --framework react \
  --backend express \
  --database postgres \
  --orm prisma \
  --styling tailwind

# Test React + JavaScript + CSS
npx tsx src/cli.ts test-js -y \
  --framework react \
  --backend none \
  --styling css \
  --no-typescript

# Test with Docker
npx tsx src/cli.ts test-docker -y \
  --framework react \
  --backend express \
  --database postgres \
  --docker

# Test validation (should fail)
npx tsx src/cli.ts test-invalid -y \
  --framework react \
  --backend none \
  --database postgres  # Invalid: database without backend
```

## Debugging

### 1. Enable Debug Logging

```bash
# Set debug environment variable
DEBUG=* npx tsx src/cli.ts test-app -y

# Or use Node inspector
node --inspect-brk -r tsx/cjs src/cli.ts test-app
```

### 2. Template Debugging

Add console logs to templates:

```handlebars
{{! In package.json.hbs }}
{{log "Database:" database}}
{{log "ORM:" orm}}
```

### 3. Test Specific Components

```bash
# Test only template engine
npx tsx -e "
import { createTemplateEngine } from './src/core/template-engine.js';
const engine = createTemplateEngine('./src/templates');
// Test code here
"

# Test only validation
npx tsx -e "
import { getConfigValidator } from './src/core/config-validator.js';
const validator = getConfigValidator();
const result = validator.validate({
  name: 'test',
  framework: 'react',
  backend: 'none',
  database: 'postgres', // Should fail
  // ...
});
console.log(result);
"
```

## Running Tests

### Unit Tests

```bash
# Run all tests
npm test

# Run specific test file
npx vitest src/core/__tests__/template-engine.test.ts

# Run in watch mode
npx vitest --watch

# Run with UI
npx vitest --ui
```

### Integration Tests

```bash
# Build first (required for integration tests)
npm run build

# Run CLI integration tests
npx vitest src/__tests__/cli-options.test.ts

# Run with coverage
npx vitest --coverage
```

### Manual Testing Checklist

Before committing, test these combinations:

- [ ] React + TypeScript + Tailwind + Express + PostgreSQL + Prisma
- [ ] React + JavaScript + CSS + No Backend
- [ ] React + SCSS + Fastify + MySQL + Drizzle
- [ ] React + Styled Components + Express + MongoDB + Mongoose
- [ ] Validation failures (incompatible combinations)
- [ ] Git initialization (--git and --no-git)
- [ ] Docker generation (--docker)

## Template Development Tips

### 1. Template File Naming

- Use `.hbs` extension for all templates
- Use `_` prefix for dotfiles (e.g., `_gitignore` → `.gitignore`)
- Keep names consistent with generated files

### 2. Testing Template Changes

```bash
# Quick test cycle
while true; do
  clear
  echo "Generating project..."
  npx tsx src/cli.ts test-app -y --framework react
  echo "Generated files:"
  tree test-output/test-app -L 2
  echo "Press Enter to regenerate, Ctrl+C to exit"
  read
  rm -rf test-output/test-app
done
```

### 3. Handlebars Helpers

Test helpers in isolation:

```javascript
// test-helpers.js
import handlebars from "handlebars";

// Register helpers
handlebars.registerHelper("eq", (a, b) => a === b);

// Test
const template = handlebars.compile('{{#if (eq framework "react")}}React!{{/if}}');
console.log(template({ framework: "react" })); // "React!"
```

## Common Issues

### Templates Not Found

```bash
# Ensure templates are copied during build
npm run build

# Or manually copy for testing
cp -r src/templates dist/
```

### Path Resolution Issues

```bash
# Check where templates are being looked for
DEBUG=template-engine npx tsx src/cli.ts test-app
```

### TypeScript Errors

```bash
# Type check without building
npx tsc --noEmit

# Ignore type errors during development
npx tsx --no-warnings src/cli.ts test-app
```

## Performance Testing

```bash
# Time the CLI execution
time npx tsx src/cli.ts perf-test -y --framework react

# Profile with Node.js
node --cpu-prof -r tsx/cjs src/cli.ts profile-test -y
```

## Release Testing

Before releasing:

1. Clean build:

   ```bash
   rm -rf dist dist-test node_modules
   npm install
   npm run build
   ```

2. Test as a user would:

   ```bash
   cd /tmp
   npx /path/to/cli/dist/cli.js test-release
   ```

3. Test with different Node versions:
   ```bash
   nvm use 18 && npm test
   nvm use 20 && npm test
   nvm use 21 && npm test
   ```

## Useful Aliases

Add to your shell profile:

```bash
# Quick CLI test
alias test-cli='npx tsx /path/to/cli/src/cli.ts'

# Clean test
alias clean-test='rm -rf test-output/* && test-cli'

# Watch templates
alias watch-templates='watch -n 1 "tree src/templates -I node_modules"'
```

## VS Code Launch Configuration

Add to `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug CLI",
      "program": "${workspaceFolder}/src/cli.ts",
      "args": ["test-app", "-y", "--framework", "react"],
      "runtimeArgs": ["-r", "tsx/cjs"],
      "console": "integratedTerminal",
      "skipFiles": ["<node_internals>/**"]
    }
  ]
}
```

Now you can debug with breakpoints directly in VS Code!

# ESLint Setup Guide

## Overview

ESLint has been configured for the entire monorepo with TypeScript support, Prettier integration, and specific rules for each package type.

## Installation

Run the following command from the root directory to install all required ESLint dependencies:

```bash
pnpm add -D -w eslint @typescript-eslint/eslint-plugin @typescript-eslint/parser eslint-config-prettier eslint-plugin-prettier eslint-plugin-import eslint-plugin-react eslint-plugin-react-hooks eslint-import-resolver-typescript
```

## Configuration Structure

### Root Configuration (`.eslintrc.json`)
- Base ESLint configuration for all packages
- TypeScript parser and plugin
- Import order rules
- Prettier integration
- Common rules for the entire monorepo

### Package-Specific Configurations
Each package has its own `.eslintrc.json` that extends the root configuration:

- **CLI Package** (`packages/cli/.eslintrc.json`)
  - Allows console statements (needed for CLI output)
  - Relaxed `any` type rules for flexibility

- **Website Package** (`packages/website/.eslintrc.json`)
  - React and React Hooks plugins
  - Browser environment
  - React-specific rules

- **UI Package** (`packages/ui/.eslintrc.json`)
  - React component library configuration
  - Same React rules as website

- **Hooks Package** (`packages/hooks/.eslintrc.json`)
  - React Hooks plugin with strict hook rules
  - Ensures proper hook usage

- **Shared/Utils Packages**
  - Basic TypeScript configuration
  - Extends root config

## Available Scripts

### Root Level
```bash
# Run lint on all packages
pnpm lint

# Format all code with Prettier
pnpm format
```

### Package Level (e.g., in `packages/cli`)
```bash
# Check for lint errors
pnpm lint

# Fix auto-fixable lint errors
pnpm lint:fix

# Format code with Prettier
pnpm format

# Type check without emitting
pnpm typecheck
```

## IDE Integration

### VS Code
1. Install the ESLint extension
2. Add to your workspace settings (`.vscode/settings.json`):
```json
{
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact"
  ]
}
```

### WebStorm/IntelliJ
1. Go to Settings → Languages & Frameworks → JavaScript → Code Quality Tools → ESLint
2. Enable "Automatic ESLint configuration"
3. Check "Run eslint --fix on save"

## Common Issues and Solutions

### Issue: ESLint can't find configuration
**Solution**: Make sure you've installed all dependencies at the root level using the installation command above.

### Issue: Import resolution errors
**Solution**: The configuration uses `eslint-import-resolver-typescript` to handle TypeScript paths. Make sure your `tsconfig.json` files are properly configured.

### Issue: Prettier conflicts
**Solution**: The setup includes `eslint-config-prettier` to disable ESLint rules that conflict with Prettier. Always run Prettier after ESLint.

## Customization

### Adding New Rules
Edit the appropriate `.eslintrc.json` file:
- For global rules: Edit the root `.eslintrc.json`
- For package-specific rules: Edit the package's `.eslintrc.json`

### Ignoring Files
- Global ignores: Edit `.eslintignore` at the root
- Package-specific ignores: Add patterns to the package's `.eslintrc.json` under `ignorePatterns`

## Best Practices

1. **Run lint before committing**: Consider adding a pre-commit hook
2. **Fix lint errors immediately**: Don't let them accumulate
3. **Use auto-fix**: Many issues can be fixed automatically with `pnpm lint:fix`
4. **Configure your IDE**: Enable ESLint integration for real-time feedback
5. **Keep rules consistent**: Discuss rule changes with the team before implementing

## Prettier Integration

The setup includes Prettier integration. The `.prettierrc.json` file defines formatting rules:
- 2 spaces for indentation
- Double quotes
- Semicolons required
- Trailing commas in ES5-compatible locations
- 100 character line width

Run `pnpm format` to format all code according to these rules.
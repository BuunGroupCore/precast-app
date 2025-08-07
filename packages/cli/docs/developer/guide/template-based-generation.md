# Template-Based Generation System

## Overview

The Precast CLI uses a sophisticated template-based generation system that separates file content from generation logic. This approach uses Handlebars templates (`.hbs` files) to generate project files, making templates easier to maintain, test, and understand.

## Architecture

### Directory Structure

```
src/
├── core/
│   └── template-engine.ts      # Core template engine with Handlebars
├── generators/
│   ├── base-generator.ts       # Base generator with shared logic
│   └── [framework]-template.ts # Framework-specific generators
└── templates/
    └── frameworks/
        └── [framework-name]/
            ├── base/           # Base configuration files
            │   ├── package.json.hbs
            │   ├── tsconfig.json.hbs
            │   ├── _gitignore      # Files starting with _ are renamed
            │   └── ...
            └── src/            # Source code templates
                ├── App.tsx.hbs
                ├── App.jsx.hbs
                └── components/
                    └── ...
```

## Core Components

### Template Engine (`src/core/template-engine.ts`)

The template engine provides a centralized system for processing Handlebars templates:

```typescript
import { createTemplateEngine } from "../core/template-engine.js";

const templateEngine = createTemplateEngine(templateRoot);
```

### Base Generator (`src/generators/base-generator.ts`)

The base generator provides the `generateBaseTemplate` function used by most framework generators:

```typescript
import { generateBaseTemplate } from "./base-generator.js";

export async function generateReactTemplate(config: ProjectConfig, projectPath: string) {
  await generateBaseTemplate("react", config, projectPath);
}
```

## Writing Templates

### Basic Template Structure

All templates use Handlebars syntax for dynamic content. Here's an example `package.json.hbs`:

```json
{
  "name": "{{name}}",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "{{#if (eq framework 'next')}}next dev{{else}}vite{{/if}}",
    "build": "{{#if (eq framework 'next')}}next build{{else}}vite build{{/if}}"
  },
  "dependencies": {
    "react": "^18.2.0"{{#if typescript}},
    "@types/react": "^18.2.0"{{/if}}
  }
}
```

### Available Handlebars Helpers

The template engine includes several built-in helpers registered in `template-engine.ts`:

- `{{#if condition}}` - Conditional rendering
- `{{#eq a b}}` - Equality comparison
- `{{#and a b}}` - Logical AND
- `{{#or a b}}` - Logical OR
- `{{#not a}}` - Logical NOT
- `{{#includes array value}}` - Check if array includes value
- `{{capitalize str}}` - Capitalize first letter
- `{{kebabCase str}}` - Convert to kebab-case
- `{{camelCase str}}` - Convert to camelCase
- `{{#ifAny ...args}}` - True if any argument is truthy
- `{{#ifAll ...args}}` - True if all arguments are truthy

### Escaping Curly Braces in JSX

When writing JSX templates, you need to escape object literals to prevent Handlebars from interpreting them:

```jsx
// ❌ Wrong - Handlebars will try to parse this
<Component options={{ title: "{{name}}" }} />

// ✅ Correct - Use backslash to escape
<Component options=\{{ title: "{{name}}" }} />

// ✅ Alternative - Use variables
function Component() {
  const options = { title: "{{name}}" };
  return <Component options={options} />;
}
```

## Creating a New Generator

### Step 1: Create Template Files

Create your template structure in `src/templates/frameworks/[framework-name]/`:

```
frameworks/my-framework/
├── base/
│   ├── package.json.hbs
│   ├── tsconfig.json.hbs
│   ├── _gitignore         # Will be renamed to .gitignore
│   └── .eslintrc.js       # Static files don't need .hbs extension
└── src/
    ├── main.ts.hbs
    └── main.js.hbs
```

### Step 2: Create the Generator (Simple Method)

For most frameworks, simply create a generator that uses `generateBaseTemplate`:

```typescript
import { type ProjectConfig } from "../../../shared/stack-config.js";
import { generateBaseTemplate } from "./base-generator.js";

/**
 * Generate a MyFramework project template
 * @param config - Project configuration
 * @param projectPath - Path where the project will be created
 */
export async function generateMyFrameworkTemplate(config: ProjectConfig, projectPath: string) {
  await generateBaseTemplate("my-framework", config, projectPath);
}
```

### Step 3: Register the Generator

Add your generator to `src/generators/index.ts`:

```typescript
import { generateMyFrameworkTemplate } from "./my-framework-template.js";

export async function generateTemplate(config: ProjectConfig, projectPath: string) {
  switch (config.framework) {
    // ... other cases
    case "my-framework":
      await generateMyFrameworkTemplate(config, projectPath);
      break;
    // ... rest of cases
  }
}
```

## Code Style Guidelines

### 1. Always Use JSDoc Comments

Every function should have JSDoc documentation:

```typescript
/**
 * Generate a framework project template
 * @param config - Project configuration
 * @param projectPath - Path where the project will be created
 */
export async function generateFrameworkTemplate(
  config: ProjectConfig,
  projectPath: string
): Promise<void> {
  // Implementation
}
```

### 2. Import Organization

Always organize imports in this order:

```typescript
// 1. Type imports
import { type ProjectConfig } from "../../../shared/stack-config.js";

// 2. Internal modules
import { generateBaseTemplate } from "./base-generator.js";
```

### 3. Consistent String Quotes

Always use double quotes for strings:

```typescript
// ✅ Correct
const message = "Hello World";
import { Something } from "module";

// ❌ Wrong
const message = "Hello World";
import { Something } from "module";
```

### 4. Avoid ESLint Warnings

When using fs-extra, destructure methods to avoid import warnings:

```typescript
// Add this comment and destructuring pattern
// eslint-disable-next-line import/no-named-as-default-member
const { readFile, writeFile, ensureDir, pathExists } = fsExtra;
```

## Template Best Practices

### 1. File Naming Conventions

- Use `.hbs` extension for all template files that need processing
- Prefix with `_` for files that need renaming (e.g., `_gitignore` → `.gitignore`)
- Static files (no variables) don't need `.hbs` extension

### 2. Conditional Dependencies

Use Handlebars conditionals for optional dependencies:

```json
{
  "dependencies": {
    "react": "^18.2.0"{{#if (eq styling "tailwind")}},
    "tailwindcss": "^3.3.0"{{/if}}{{#if typescript}},
    "@types/react": "^18.2.0"{{/if}}
  }
}
```

### 3. Multiple File Variants

Create separate template files for TypeScript and JavaScript:

```
src/
├── App.tsx.hbs    # TypeScript version
└── App.jsx.hbs    # JavaScript version
```

The base generator automatically selects the appropriate file based on the `typescript` config option.

## How the System Works

### 1. Framework Generators

Most framework generators are simple wrappers around `generateBaseTemplate`:

```typescript
// src/generators/react-template.ts
export async function generateReactTemplate(config: ProjectConfig, projectPath: string) {
  await generateBaseTemplate("react", config, projectPath);
}
```

### 2. Base Generator Flow

The `generateBaseTemplate` function:

1. Creates a template engine instance
2. Determines if it's a monorepo or single app project
3. Processes templates from the framework directory
4. Handles file renaming (e.g., `_gitignore` → `.gitignore`)
5. Applies Handlebars transformations based on config

### 3. Template Processing

The template engine:

1. Loads template files from the filesystem
2. Compiles them with Handlebars
3. Applies the project configuration as context
4. Writes the processed files to the project directory

## Testing Templates

### 1. Test with the CLI

```bash
# Build the CLI
bun run build

# Test template generation
./dist/cli.js init test-app --framework my-framework --typescript
```

### 2. Validate Generated Output

Always verify that:

- All expected files are created
- Template variables are replaced correctly
- Generated code passes linting and formatting checks
- The project builds and runs successfully

## Common Issues and Solutions

### Issue: Handlebars Parse Errors

**Problem**: `Parse error: Expecting 'CLOSE_RAW_BLOCK'...`

**Solution**: Escape curly braces in JSX:

```jsx
// Change this:
options={{ key: "value" }}

// To this:
options=\{{ key: "value" }}
```

### Issue: Missing Template Files

**Problem**: Template files not found

**Solution**: Ensure templates exist in the correct directory:

```
src/templates/frameworks/[framework-name]/
```

### Issue: Variables Not Replaced

**Problem**: Template variables like `{{name}}` appear in output

**Solution**: Ensure the config object is passed correctly and contains all required fields.

## Supported Frameworks

The following frameworks use the template-based generation system:

- React (`react`)
- Vue (`vue`)
- Angular (`angular`)
- Next.js (`next`)
- Nuxt (`nuxt`)
- Svelte (`svelte`)
- SvelteKit (via `svelte`)
- Solid (`solid`)
- Astro (`astro`)
- Remix (`remix`)
- Vite (`vite`)
- Vanilla (`vanilla`)
- React Native (`react-native`)

Special cases that use custom generation:

- TanStack Start (`tanstack-start`) - Custom inline generation
- None (`none`) - Backend-only projects

## Migration Guide

To migrate an existing inline generator to template-based:

1. Extract all inline strings to `.hbs` files in `src/templates/frameworks/[name]/`
2. Organize templates in `base/` and `src/` directories
3. Replace the generator with a simple call to `generateBaseTemplate`
4. Test thoroughly to ensure output matches original
5. Remove old inline content generation code

## Performance Considerations

1. **Template Caching**: The template engine caches compiled templates
2. **Parallel Processing**: Multiple files are processed concurrently
3. **Lazy Loading**: Templates are only loaded when needed

## Conclusion

The template-based generation system provides:

- **Better maintainability**: Templates are easier to read and edit
- **Improved testability**: Templates can be tested independently
- **Enhanced reusability**: Templates can be shared across generators
- **Cleaner code**: Generators focus on orchestration, not content
- **Consistency**: All frameworks follow the same pattern

Follow these guidelines to ensure consistent, maintainable, and high-quality code generation in the Precast CLI.

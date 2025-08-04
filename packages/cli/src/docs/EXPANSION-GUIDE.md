# CLI Expansion Guide

This guide explains how to expand the CLI with new frameworks, features, and test all available options.

## Table of Contents
1. [Architecture Overview](#architecture-overview)
2. [Adding New Frameworks](#adding-new-frameworks)
3. [Adding New Features](#adding-new-features)
4. [Database Configuration](#database-configuration)
5. [Testing All Options](#testing-all-options)
6. [Best Practices](#best-practices)

## Architecture Overview

The CLI uses a template-based architecture with these key components:

```
src/
├── core/
│   ├── template-engine.ts    # Handlebars template processing
│   ├── plugin-manager.ts     # Plugin system for extensibility
│   └── config-validator.ts   # Configuration validation
├── templates/
│   ├── frameworks/          # Framework-specific templates
│   │   └── react/
│   ├── features/           # Feature templates (auth, testing, etc.)
│   └── base/              # Common base templates
└── generators/
    └── react-template.ts   # React generator using templates
```

## Adding New Frameworks

### Step 1: Create Template Structure

For a new framework (e.g., Vue), create the following structure:

```bash
src/templates/frameworks/vue/
├── base/                    # Base project files
│   ├── package.json.hbs
│   ├── vite.config.js.hbs
│   ├── tsconfig.json.hbs
│   └── _gitignore
└── src/                     # Source files
    ├── main.js.hbs
    ├── App.vue.hbs
    └── style.css.hbs
```

### Step 2: Create Framework Generator

Create `src/generators/vue-template.ts`:

```typescript
import path from "path";
import { fileURLToPath } from "url";
import { type ProjectConfig } from "../../../shared/stack-config.js";
import { createTemplateEngine } from "../core/template-engine.js";
import { getPluginManager } from "../core/plugin-manager.js";
import { consola } from "consola";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function generateVueTemplate(
  config: ProjectConfig,
  projectPath: string,
) {
  const templateRoot = path.join(__dirname, "templates");
  const templateEngine = createTemplateEngine(templateRoot);
  const pluginManager = getPluginManager();
  
  const context = {
    config,
    projectPath,
    templateEngine,
    logger: consola,
  };
  
  try {
    await pluginManager.runPreGenerate(context);
    
    // Copy base Vue templates
    await templateEngine.copyTemplateDirectory(
      "frameworks/vue/base",
      projectPath,
      config,
      { overwrite: true }
    );
    
    // Copy src directory
    await templateEngine.copyTemplateDirectory(
      "frameworks/vue/src",
      path.join(projectPath, "src"),
      config,
      { overwrite: true }
    );
    
    // Add conditional features
    await templateEngine.processConditionalTemplates([
      {
        condition: config.typescript,
        sourceDir: "features/typescript/vue",
      },
      {
        condition: config.styling === "tailwind",
        sourceDir: "features/styling/tailwind/vue",
      },
    ], projectPath, config);
    
    await pluginManager.runPostGenerate(context);
    
    consola.success("Vue project generated successfully!");
  } catch (error) {
    consola.error("Failed to generate Vue project:", error);
    throw error;
  }
}
```

### Step 3: Update Generator Index

Add the new generator to `src/generators/index.ts`:

```typescript
case "vue":
  await generateVueTemplate(config, projectPath);
  break;
```

## Adding New Features

### 1. Authentication Feature

Create authentication templates:

```
src/templates/features/auth/
├── react/
│   ├── src/
│   │   ├── components/
│   │   │   ├── LoginForm.tsx.hbs
│   │   │   └── ProtectedRoute.tsx.hbs
│   │   └── hooks/
│   │       └── useAuth.ts.hbs
│   └── package.json.hbs    # Additional dependencies
└── base/
    ├── .env.example.hbs     # Auth environment variables
    └── auth.config.js.hbs   # Auth configuration
```

### 2. Testing Feature

Create testing templates:

```
src/templates/features/testing/
├── react/
│   ├── src/
│   │   └── __tests__/
│   │       └── App.test.tsx.hbs
│   ├── jest.config.js.hbs
│   ├── setupTests.ts.hbs
│   └── package.json.hbs
└── vitest/
    ├── vitest.config.ts.hbs
    └── package.json.hbs
```

## Database Configuration

### How Database Selection Works

When a user selects a database, the CLI:

1. **Validates compatibility** with the chosen ORM
2. **Generates connection configuration** in `.env.example`
3. **Adds required dependencies** to `package.json`
4. **Creates database configuration files** (if needed)
5. **Sets up Docker Compose** (if Docker is enabled)

### PostgreSQL Example

When PostgreSQL is selected:

#### 1. Environment Variables (.env.example)
```env
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
```

#### 2. Docker Compose (if enabled)
```yaml
services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
      POSTGRES_DB: dbname
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

#### 3. Prisma Configuration (if Prisma ORM selected)
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

### Supporting New Databases

To add a new database:

1. **Update stack-config.ts** with the new database option
2. **Create database templates**:
   ```
   src/templates/features/database/newdb/
   ├── docker-compose.yml.hbs
   ├── config.js.hbs
   └── migrations/
   ```
3. **Update validation rules** in `config-validator.ts`
4. **Add connection string format** to `.env.example` generation

## Testing All Options

### Creating Comprehensive Tests

Create `src/__tests__/cli-integration.test.ts`:

```typescript
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { execa } from "execa";
import fs from "fs-extra";
import path from "path";
import os from "os";

describe("CLI Integration Tests", () => {
  let testDir: string;
  
  beforeEach(async () => {
    testDir = await fs.mkdtemp(path.join(os.tmpdir(), "cli-test-"));
  });
  
  afterEach(async () => {
    await fs.remove(testDir);
  });
  
  describe("React Projects", () => {
    it("should generate React + Express + PostgreSQL + Prisma + Tailwind + TypeScript", async () => {
      const projectName = "test-full-stack";
      const projectPath = path.join(testDir, projectName);
      
      // Run CLI
      await execa("node", [
        "dist/cli.js",
        projectName,
        "-y",
        "--framework", "react",
        "--backend", "express",
        "--database", "postgres",
        "--orm", "prisma",
        "--styling", "tailwind"
      ], { cwd: process.cwd() });
      
      // Verify structure
      expect(await fs.pathExists(projectPath)).toBe(true);
      expect(await fs.pathExists(path.join(projectPath, "package.json"))).toBe(true);
      expect(await fs.pathExists(path.join(projectPath, "tsconfig.json"))).toBe(true);
      expect(await fs.pathExists(path.join(projectPath, "tailwind.config.js"))).toBe(true);
      expect(await fs.pathExists(path.join(projectPath, "vite.config.ts"))).toBe(true);
      
      // Verify package.json
      const pkg = await fs.readJson(path.join(projectPath, "package.json"));
      expect(pkg.dependencies).toHaveProperty("react");
      expect(pkg.dependencies).toHaveProperty("@prisma/client");
      expect(pkg.dependencies).toHaveProperty("axios");
      expect(pkg.devDependencies).toHaveProperty("typescript");
      expect(pkg.devDependencies).toHaveProperty("tailwindcss");
      expect(pkg.devDependencies).toHaveProperty("prisma");
      
      // Verify Prisma setup
      expect(pkg.scripts).toHaveProperty("db:generate");
      expect(pkg.scripts).toHaveProperty("db:migrate");
    });
    
    it("should generate React + Vite + No Backend", async () => {
      const projectName = "test-frontend-only";
      
      await execa("node", [
        "dist/cli.js",
        projectName,
        "-y",
        "--framework", "react",
        "--backend", "none",
        "--styling", "css"
      ], { cwd: process.cwd() });
      
      const pkg = await fs.readJson(path.join(testDir, projectName, "package.json"));
      expect(pkg.dependencies).not.toHaveProperty("axios");
      expect(pkg.dependencies).not.toHaveProperty("@tanstack/react-query");
    });
  });
  
  describe("Database Configurations", () => {
    const databases = ["postgres", "mysql", "mongodb", "sqlite"];
    const orms = {
      postgres: ["prisma", "drizzle", "none"],
      mysql: ["prisma", "drizzle", "none"],
      mongodb: ["mongoose", "prisma", "none"],
      sqlite: ["prisma", "drizzle", "none"]
    };
    
    databases.forEach(db => {
      orms[db].forEach(orm => {
        it(`should generate with ${db} + ${orm}`, async () => {
          const projectName = `test-${db}-${orm}`;
          
          await execa("node", [
            "dist/cli.js",
            projectName,
            "-y",
            "--framework", "react",
            "--backend", "express",
            "--database", db,
            "--orm", orm
          ], { cwd: process.cwd() });
          
          const envExample = await fs.readFile(
            path.join(testDir, projectName, ".env.example"),
            "utf-8"
          );
          
          // Verify database URL format
          if (db === "postgres") {
            expect(envExample).toContain("postgresql://");
          } else if (db === "mysql") {
            expect(envExample).toContain("mysql://");
          } else if (db === "mongodb") {
            expect(envExample).toContain("mongodb://");
          }
        });
      });
    });
  });
  
  describe("Validation", () => {
    it("should fail with incompatible ORM/database", async () => {
      await expect(
        execa("node", [
          "dist/cli.js",
          "test-invalid",
          "-y",
          "--framework", "react",
          "--backend", "express",
          "--database", "mongodb",
          "--orm", "drizzle" // Drizzle doesn't support MongoDB
        ], { cwd: process.cwd() })
      ).rejects.toThrow();
    });
  });
});
```

### Test Matrix

Create a test matrix to ensure all combinations work:

| Framework | Backend | Database | ORM | Styling | TypeScript |
|-----------|---------|----------|-----|---------|------------|
| React | Express | PostgreSQL | Prisma | Tailwind | ✓ |
| React | Fastify | MySQL | Drizzle | CSS | ✓ |
| React | None | None | None | Styled-Components | ✗ |
| Vue | Express | MongoDB | Mongoose | SCSS | ✓ |
| Next | Next | PostgreSQL | Prisma | Tailwind | ✓ |

### Running Tests

```bash
# Run all integration tests
npm test

# Run specific test suite
npm test -- --grep "Database Configurations"

# Run with coverage
npm test -- --coverage
```

## Best Practices

### 1. Template Organization
- Keep templates small and focused
- Use partials for reusable components
- Name files clearly (e.g., `auth-config.js.hbs`)

### 2. Conditional Logic
- Use Handlebars helpers for complex conditions
- Keep conditional blocks readable
- Document template variables

### 3. Validation
- Add validation rules for new combinations
- Provide helpful error messages
- Test edge cases

### 4. Documentation
- Document all template variables
- Add examples for each feature
- Keep README files updated

### 5. Testing
- Test all major combinations
- Include edge cases
- Verify generated code compiles

## Example: Adding Vite Support

Here's a complete example of adding Vite as a framework option:

1. **Create templates**:
   ```
   src/templates/frameworks/vite/
   ├── base/
   │   ├── package.json.hbs
   │   ├── vite.config.js.hbs
   │   ├── index.html.hbs
   │   └── _gitignore
   └── src/
       ├── main.js.hbs
       └── style.css.hbs
   ```

2. **Add generator** (`src/generators/vite-template.ts`)
3. **Update validation** (if needed)
4. **Add tests**
5. **Update documentation**

## Troubleshooting

### Common Issues

1. **Template not found**: Ensure paths are correct and templates are copied during build
2. **Invalid configuration**: Check validation rules in `config-validator.ts`
3. **Missing dependencies**: Update package.json template with required packages
4. **Build failures**: Verify generated code syntax and dependencies

### Debugging Tips

1. Use `--verbose` flag for detailed output
2. Check generated files manually
3. Run `npm install` and `npm run build` in generated project
4. Review template compilation errors in console
# Precast CLI Architecture

## Table of Contents

- [Overview](#overview)
- [System Architecture](#system-architecture)
- [Core Components](#core-components)
- [Template System](#template-system)
- [Generator Architecture](#generator-architecture)
- [Plugin System](#plugin-system)
- [Configuration Management](#configuration-management)
- [Error Handling](#error-handling)
- [Performance Considerations](#performance-considerations)
- [Security Architecture](#security-architecture)

## Overview

The Precast CLI is a sophisticated project scaffolding tool built with TypeScript, designed to generate full-stack web applications with optimal configurations. The architecture emphasizes modularity, extensibility, and maintainability.

### Design Principles

1. **Modularity** - Each component is self-contained and loosely coupled
2. **Extensibility** - Easy to add new frameworks, backends, and features
3. **Performance** - Optimized for fast project generation
4. **Developer Experience** - Clear error messages and intuitive interfaces
5. **Type Safety** - Full TypeScript coverage with strict typing

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         User Input                          │
│                    (CLI Args / Interactive)                 │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                      CLI Entry Point                        │
│                       (src/cli.ts)                          │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                    Command Dispatcher                       │
│                  (Commander.js Router)                      │
└──────────────────────────┬──────────────────────────────────┘
                           │
        ┌──────────────────┼──────────────────┐
        ▼                  ▼                  ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│   init       │  │    deploy    │  │   generate   │
│   Command    │  │   Command    │  │   Command    │
└──────┬───────┘  └──────┬───────┘  └──────┬───────┘
       │                 │                  │
       ▼                 ▼                  ▼
┌─────────────────────────────────────────────────────────────┐
│                  Configuration Validator                    │
│                 (src/core/config-validator.ts)              │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                     Generator System                        │
│                  (src/generators/index.ts)                  │
└──────────────────────────┬──────────────────────────────────┘
                           │
        ┌──────────────────┼──────────────────┐
        ▼                  ▼                  ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│  Framework   │  │   Backend    │  │   Feature    │
│  Generators  │  │  Generators  │  │  Generators  │
└──────┬───────┘  └──────┬───────┘  └──────┬───────┘
       │                 │                  │
       └─────────────────┼──────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                    Template Engine                          │
│                (src/core/template-engine.ts)                │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                   Handlebars Templates                      │
│                    (src/templates/*)                        │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                     File System                             │
│                  (Generated Project)                        │
└─────────────────────────────────────────────────────────────┘
```

## Core Components

### 1. CLI Entry Point (`src/cli.ts`)

The main entry point that:

- Configures Commander.js for command parsing
- Sets up global options and flags
- Routes to appropriate command handlers
- Manages telemetry and analytics

```typescript
interface CLIOptions {
  framework?: string;
  backend?: string;
  database?: string;
  orm?: string;
  styling?: string;
  typescript?: boolean;
  docker?: boolean;
  // ... more options
}
```

### 2. Command Handlers (`src/commands/`)

Each command has its own handler module:

#### `init.ts` - Project Creation

- Gathers configuration through prompts or flags
- Validates configuration compatibility
- Orchestrates generation process
- Manages installation and git initialization

#### `deploy.ts` - Docker Management

- Starts/stops Docker services
- Manages container lifecycle
- Handles environment variable updates
- Provides service status information

#### `generate.ts` - ORM Client Generation

- Generates Prisma/Drizzle/TypeORM clients
- Rebuilds shared packages in monorepos
- Handles database migrations

#### `status.ts` - Project Information

- Displays current project configuration
- Shows installed dependencies
- Provides health checks

### 3. Configuration Validator (`src/core/config-validator.ts`)

Ensures configuration integrity:

- Validates framework/backend compatibility
- Checks database/ORM compatibility
- Validates authentication provider requirements
- Prevents invalid technology combinations

```typescript
class ConfigValidator {
  validate(config: ProjectConfig): ValidationResult {
    // Check framework compatibility
    // Validate backend requirements
    // Ensure database/ORM alignment
    // Verify authentication setup
  }
}
```

### 4. Plugin Manager (`src/core/plugin-manager.ts`)

Manages extensibility:

- Loads and validates plugins
- Manages plugin lifecycle
- Handles plugin dependencies
- Provides plugin API

## Template System

### Template Engine (`src/core/template-engine.ts`)

The heart of the generation system:

```typescript
class TemplateEngine {
  // Register Handlebars helpers
  registerHelpers(): void;

  // Process individual templates
  processTemplate(template: string, context: TemplateContext): string;

  // Copy entire directories with processing
  copyTemplateDirectory(source: string, dest: string, context: TemplateContext): void;

  // Handle binary files
  copyBinaryFile(source: string, dest: string): void;
}
```

### Handlebars Templates

Templates use Handlebars for dynamic content:

```handlebars
{ "name": "{{name}}", "version": "1.0.0",
{{#if typescript}}
  "scripts": { "dev": "tsx src/index.ts", "build": "tsc" },
{{/if}}
"dependencies": {
{{#if (eq framework "react")}}
  "react": "^18.2.0", "react-dom": "^18.2.0"
{{/if}}
} }
```

### Template Organization

```
src/templates/
├── frameworks/       # Framework-specific templates
│   ├── react/
│   ├── vue/
│   └── angular/
├── backends/        # Backend server templates
│   ├── express/
│   ├── fastify/
│   └── nestjs/
├── database/        # Database configurations
│   ├── postgres/
│   ├── mysql/
│   └── mongodb/
├── auth/           # Authentication templates
│   ├── better-auth/
│   └── clerk/
└── common/         # Shared templates
    ├── styles/
    └── components/
```

## Generator Architecture

### Base Generator (`src/generators/base-generator.ts`)

Abstract base class for all generators:

```typescript
export abstract class BaseGenerator {
  protected templateEngine: TemplateEngine;
  protected config: ProjectConfig;
  protected projectPath: string;

  abstract generate(): Promise<void>;

  protected async processTemplate(templatePath: string, outputPath: string): Promise<void>;
  protected async copyDirectory(source: string, dest: string): Promise<void>;
  protected async installDependencies(): Promise<void>;
}
```

### Framework Generators

Each framework has its own generator:

```typescript
export class ReactGenerator extends BaseGenerator {
  async generate(): Promise<void> {
    // Copy base React files
    await this.processTemplate("frameworks/react/base", "");

    // Add TypeScript support if needed
    if (this.config.typescript) {
      await this.processTemplate("frameworks/react/typescript", "");
    }

    // Configure routing
    await this.setupRouting();

    // Add styling
    await this.setupStyling();
  }
}
```

### Feature Generators

Modular generators for specific features:

- **AuthGenerator** - Authentication setup
- **DatabaseGenerator** - Database configuration
- **DockerGenerator** - Container setup
- **DeploymentGenerator** - Deployment configurations
- **UILibraryGenerator** - Component library integration

## Plugin System

### Plugin Architecture

Plugins extend CLI functionality:

```typescript
interface Plugin {
  name: string;
  version: string;

  // Lifecycle hooks
  beforeGenerate?(config: ProjectConfig): Promise<void>;
  afterGenerate?(config: ProjectConfig): Promise<void>;

  // Template contributions
  templates?: TemplateContribution[];

  // Custom commands
  commands?: CommandContribution[];
}
```

### Plugin Loading

```typescript
class PluginManager {
  private plugins: Map<string, Plugin> = new Map();

  async loadPlugin(name: string): Promise<void> {
    const plugin = await import(name);
    this.validatePlugin(plugin);
    this.plugins.set(name, plugin);
  }

  async executeHook(hook: string, config: ProjectConfig): Promise<void> {
    for (const plugin of this.plugins.values()) {
      if (plugin[hook]) {
        await plugin[hook](config);
      }
    }
  }
}
```

## Configuration Management

### Project Configuration (`precast.jsonc`)

Stores project metadata and configuration:

```jsonc
{
  "$schema": "https://precast.dev/precast.schema.json",
  "version": "1.0.0",
  "createdAt": "2024-01-01T00:00:00Z",
  "framework": "react",
  "backend": "express",
  "database": "postgres",
  "orm": "prisma",
  "typescript": true,
  "docker": true,
  "powerups": ["traefik", "ngrok"],
  "plugins": ["stripe", "resend"],
}
```

### Configuration Flow

1. **Input Gathering** - CLI flags or interactive prompts
2. **Validation** - ConfigValidator ensures compatibility
3. **Normalization** - Convert to canonical format
4. **Persistence** - Save to precast.jsonc
5. **Usage** - Read by commands for operations

## Error Handling

### Error Collector (`src/utils/error-collector.ts`)

Centralized error management:

```typescript
class ErrorCollector {
  private errors: ErrorEntry[] = [];
  private warnings: WarningEntry[] = [];

  addError(error: Error, context?: string): void {
    this.errors.push({
      message: error.message,
      stack: error.stack,
      context,
      timestamp: new Date(),
    });
  }

  hasErrors(): boolean {
    return this.errors.length > 0;
  }

  displayErrors(): void {
    // Format and display all collected errors
  }
}
```

### Error Recovery

The CLI implements graceful error recovery:

1. **Package Manager Fallback** - Automatic fallback from Bun to npm
2. **Template Fallback** - Use default templates on specific failures
3. **Partial Generation** - Complete what's possible, report failures
4. **Rollback** - Clean up on critical failures

## Performance Considerations

### Optimization Strategies

1. **Lazy Loading** - Load generators only when needed
2. **Parallel Processing** - Install dependencies concurrently
3. **Template Caching** - Cache compiled Handlebars templates
4. **Minimal Dependencies** - Keep package size small
5. **Efficient File Operations** - Batch file system operations

### Performance Metrics

```typescript
class PerformanceTracker {
  private metrics: Map<string, number> = new Map();

  startTimer(label: string): void {
    this.metrics.set(label, Date.now());
  }

  endTimer(label: string): number {
    const start = this.metrics.get(label);
    const duration = Date.now() - start;

    // Track for analytics
    trackPerformance(label, duration);

    return duration;
  }
}
```

## Security Architecture

### Security Measures

1. **Input Validation** - Sanitize all user inputs
2. **Path Traversal Prevention** - Use path.resolve for all paths
3. **Command Injection Prevention** - No string concatenation for shell commands
4. **Dependency Auditing** - Regular security audits
5. **Secret Management** - Never log or commit secrets

### Security Validation

```typescript
class SecurityValidator {
  validatePath(path: string): boolean {
    // Ensure path doesn't escape project directory
    const resolved = path.resolve(path);
    return resolved.startsWith(process.cwd());
  }

  sanitizeInput(input: string): string {
    // Remove potentially dangerous characters
    return input.replace(/[^a-zA-Z0-9-_]/g, "");
  }

  validateCommand(command: string): boolean {
    // Ensure command doesn't contain injection attempts
    const dangerous = [";", "&&", "||", "|", ">", "<", "`", "$"];
    return !dangerous.some((char) => command.includes(char));
  }
}
```

## Data Flow

### Project Generation Flow

```
User Input → Validation → Configuration → Generator Selection →
Template Processing → File Writing → Post-Processing →
Dependency Installation → Git Initialization → Success
```

### Template Processing Flow

```
Load Template → Parse Handlebars → Apply Context →
Process Conditionals → Replace Variables →
Format Output → Write File
```

## Extension Points

### Adding New Frameworks

1. Create generator in `src/generators/[framework]-template.ts`
2. Add templates in `src/templates/frameworks/[framework]/`
3. Update configuration in `packages/shared/stack-config.ts`
4. Add validation rules in `src/core/config-validator.ts`
5. Write tests in `tests/[framework].test.ts`

### Adding New Features

1. Create feature generator in `src/generators/`
2. Add templates in `src/templates/features/`
3. Update configuration schema
4. Add command flags if needed
5. Document in README

## Future Architecture Plans

### Planned Enhancements

1. **Remote Templates** - Fetch templates from external sources
2. **Plugin Registry** - Central plugin repository
3. **Custom Generators** - User-defined generators
4. **Migration Tools** - Upgrade existing projects
5. **Cloud Integration** - Cloud-based project generation

### Scalability Considerations

- **Microservices Architecture** - Split into smaller services
- **Template CDN** - Serve templates from CDN
- **Distributed Generation** - Generate projects in cloud
- **Caching Layer** - Redis for template caching
- **Queue System** - Handle generation requests asynchronously

## Conclusion

The Precast CLI architecture is designed to be modular, extensible, and performant. The separation of concerns between commands, generators, templates, and utilities ensures maintainability and ease of contribution. The plugin system and template engine provide flexibility for future expansion while maintaining backward compatibility.

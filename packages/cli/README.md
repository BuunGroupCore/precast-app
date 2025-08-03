# Create Precast App - Modern CLI Architecture

A powerful, extensible CLI for scaffolding modern web applications with a template-based architecture.

## ✨ Features

- 🎯 **Template-Based Generation** - Handlebars templates for maintainable code generation
- 🔌 **Plugin System** - Extensible architecture with lifecycle hooks
- ✅ **Smart Validation** - Configuration compatibility checking with helpful errors
- 🎨 **Beautiful CLI** - Modern prompts with progress indicators
- 🐳 **Docker Support** - Optional containerization for databases and apps
- 🧪 **Comprehensive Testing** - Test suite for all configuration combinations

## 🚀 Quick Start

```bash
# Interactive mode
npx create-precast-app

# With options
npx create-precast-app my-app --framework react --backend express --database postgres

# Skip all prompts
npx create-precast-app my-app -y
```

## 📋 Available Options

### Frameworks
- `react` - React with Vite
- `vue` - Vue 3 (coming soon)
- `angular` - Angular (coming soon)
- `next` - Next.js (coming soon)
- `nuxt` - Nuxt 3 (coming soon)
- `svelte` - SvelteKit (coming soon)
- `solid` - SolidJS (coming soon)
- `astro` - Astro (coming soon)

### Backends
- `express` - Express.js server
- `fastify` - Fastify server
- `hono` - Hono server
- `none` - Frontend only

### Databases
- `postgres` - PostgreSQL
- `mysql` - MySQL
- `mongodb` - MongoDB
- `sqlite` - SQLite
- `supabase` - Supabase
- `firebase` - Firebase
- `none` - No database

### ORMs
- `prisma` - Prisma ORM (SQL databases + MongoDB)
- `drizzle` - Drizzle ORM (SQL databases)
- `mongoose` - Mongoose (MongoDB only)
- `none` - No ORM

### Styling
- `tailwind` - Tailwind CSS
- `css` - Plain CSS
- `scss` - SCSS/Sass
- `styled-components` - Styled Components

### Additional Options
- `--typescript` / `--no-typescript` - TypeScript support (default: true)
- `--git` / `--no-git` - Initialize git repository (default: true)
- `--docker` - Include Docker configuration
- `--install` - Install dependencies after creation
- `--pm <manager>` - Package manager (npm, yarn, pnpm, bun)

## 🏗️ Architecture

```
packages/cli/
├── src/
│   ├── core/                    # Core systems
│   │   ├── template-engine.ts   # Handlebars template processor
│   │   ├── plugin-manager.ts    # Plugin lifecycle management
│   │   └── config-validator.ts  # Configuration validation
│   ├── templates/               # Template files
│   │   ├── frameworks/          # Framework-specific templates
│   │   │   └── react/          # React templates
│   │   ├── features/           # Feature templates
│   │   │   ├── auth/          # Authentication
│   │   │   ├── testing/       # Testing setup
│   │   │   └── database/      # Database configs
│   │   └── base/              # Common templates
│   ├── generators/             # Template generators
│   ├── commands/               # CLI commands
│   └── plugins/                # Built-in plugins
```

## 🗄️ Database Configuration

### How It Works

When you select a database, the CLI:

1. **Validates** ORM compatibility
2. **Generates** connection configuration in `.env.example`
3. **Adds** required dependencies
4. **Creates** configuration files (Prisma schema, Drizzle config, etc.)
5. **Sets up** Docker Compose (if Docker enabled)

### PostgreSQL Example

When you select PostgreSQL with Prisma:

#### Generated `.env.example`:
```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/myapp
```

#### Generated `docker-compose.yml`:
```yaml
services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: myapp
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
```

#### Generated Scripts in `package.json`:
```json
{
  "scripts": {
    "db:generate": "prisma generate",
    "db:migrate": "prisma migrate dev",
    "db:push": "prisma db push",
    "db:studio": "prisma studio"
  }
}
```

### Setting Up Your Database

1. **Using Docker (Recommended)**:
   ```bash
   # Start database
   docker-compose up -d

   # Run migrations
   npm run db:migrate
   ```

2. **Using Local Database**:
   - Install PostgreSQL/MySQL/MongoDB
   - Update DATABASE_URL in `.env`
   - Run migrations

## 🧪 Testing

### Running Tests

```bash
# Build the CLI
npm run build

# Run all tests
npm test

# Run specific test
npm test -- --grep "PostgreSQL"
```

### Test Coverage

The test suite covers:
- ✅ All framework combinations
- ✅ All database + ORM combinations
- ✅ TypeScript/JavaScript generation
- ✅ All styling options
- ✅ Docker configuration
- ✅ Git initialization
- ✅ Validation rules

## 🔧 Extending the CLI

See [EXPANSION-GUIDE.md](./EXPANSION-GUIDE.md) for detailed instructions on:
- Adding new frameworks
- Creating feature templates
- Writing plugins
- Testing new options

### Quick Example: Adding a Feature

1. Create template structure:
   ```
   src/templates/features/auth/
   ├── react/
   │   ├── src/
   │   │   ├── components/
   │   │   │   └── LoginForm.tsx.hbs
   │   │   └── hooks/
   │   │       └── useAuth.ts.hbs
   │   └── package.json.hbs
   ```

2. Update generator to use templates:
   ```typescript
   await templateEngine.processConditionalTemplates([
     {
       condition: config.auth === true,
       sourceDir: "features/auth/react",
       destDir: "src",
     }
   ], projectPath, config);
   ```

## 📚 Template System

### Handlebars Helpers

```handlebars
{{#if typescript}}
  // TypeScript code
{{else}}
  // JavaScript code
{{/if}}

{{#if (eq database "postgres")}}
  DATABASE_URL=postgresql://...
{{/if}}

{{#ifAny (eq backend "express") (eq backend "fastify")}}
  // Server code
{{/ifAny}}
```

### Available Helpers
- `eq` - Equality check
- `and`, `or`, `not` - Logical operators
- `includes` - Array includes
- `ifAny`, `ifAll` - Multiple conditions
- `capitalize` - Capitalize string
- `kebabCase` - Convert to kebab-case

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Add tests for new features
4. Ensure all tests pass
5. Submit a pull request

## 📝 License

MIT

---

## Comparison with Original

### Old Approach (String-based)
```typescript
function generatePackageJson(config) {
  return JSON.stringify({
    name: config.name,
    dependencies: {
      react: "^18.2.0",
      ...(config.styling === "tailwind" && {
        tailwindcss: "^3.0.0"
      })
    }
  }, null, 2);
}
```

### New Approach (Template-based)
```handlebars
{
  "name": "{{name}}",
  "dependencies": {
    "react": "^18.3.1"
    {{#if (eq styling "tailwind")}}
    ,"tailwindcss": "^3.4.0"
    {{/if}}
  }
}
```

### Benefits
- ✅ Easier to maintain
- ✅ Version control friendly
- ✅ No string escaping issues
- ✅ Better IDE support
- ✅ Reusable templates
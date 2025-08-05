# User Guide

Complete guide for using Precast CLI to generate modern web applications.

## Installation

### Global Installation

```bash
npm install -g create-precast-app
```

### One-time Usage

```bash
npx create-precast-app my-project
```

## Basic Usage

### Interactive Mode

Run without arguments to start interactive mode:

```bash
create-precast-app
```

The CLI will prompt you for:

- Project name
- Frontend framework
- Backend option
- Database choice
- ORM selection
- Styling solution
- Additional options (TypeScript, Git, Docker)

### CLI Arguments

Specify options directly via command line:

```bash
create-precast-app my-project \
  --framework react \
  --backend express \
  --database postgres \
  --orm prisma \
  --styling tailwind \
  --typescript \
  --git \
  --docker
```

## Available Options

### Frontend Frameworks

| Framework | Description                      | TypeScript | Key Features                          |
| --------- | -------------------------------- | ---------- | ------------------------------------- |
| `react`   | JavaScript library for UIs       | Optional   | Component-based, Virtual DOM          |
| `vue`     | Progressive JavaScript framework | Optional   | Reactive data, Template syntax        |
| `angular` | Platform for web applications    | Required   | Full framework, Dependency injection  |
| `next`    | React framework for production   | Optional   | SSR/SSG, API routes, File routing     |
| `nuxt`    | Vue framework                    | Optional   | SSR/SSG, Auto-imports, Modules        |
| `svelte`  | Compiled web framework           | Optional   | No virtual DOM, Small bundles         |
| `solid`   | Reactive JavaScript library      | Optional   | Fine-grained reactivity               |
| `astro`   | Static site generator            | Optional   | Island architecture, Multi-framework  |
| `remix`   | Full-stack React framework       | Optional   | Progressive enhancement, Data loading |
| `vite`    | Frontend build tool              | Optional   | Fast HMR, Plugin ecosystem            |
| `vanilla` | Plain JavaScript                 | Optional   | No framework dependencies             |

### Backend Options

| Backend   | Description                      | Language              | Use Case               |
| --------- | -------------------------------- | --------------------- | ---------------------- |
| `express` | Minimalist web framework         | JavaScript/TypeScript | APIs, Web servers      |
| `fastapi` | Modern Python web framework      | Python                | APIs, Machine learning |
| `hono`    | Ultrafast edge runtime framework | JavaScript/TypeScript | Edge computing, APIs   |
| `none`    | Frontend only                    | N/A                   | Static sites, JAMstack |

### Databases

| Database   | Type  | Description                      | Best For                          |
| ---------- | ----- | -------------------------------- | --------------------------------- |
| `postgres` | SQL   | Advanced relational database     | Complex queries, ACID compliance  |
| `mysql`    | SQL   | Popular relational database      | Web applications, WordPress       |
| `mongodb`  | NoSQL | Document database                | Flexible schemas, JSON-like data  |
| `sqlite`   | SQL   | File-based database              | Development, Small applications   |
| `firebase` | BaaS  | Google's backend service         | Rapid prototyping, Real-time apps |
| `supabase` | BaaS  | Open source Firebase alternative | PostgreSQL-based, Real-time       |
| `none`     | N/A   | No database                      | Static sites, External APIs       |

### ORMs

| ORM        | Languages             | Databases                 | Features                      |
| ---------- | --------------------- | ------------------------- | ----------------------------- |
| `prisma`   | TypeScript/JavaScript | PostgreSQL, MySQL, SQLite | Type-safe, Schema migrations  |
| `drizzle`  | TypeScript            | PostgreSQL, MySQL, SQLite | SQL-like syntax, Edge-ready   |
| `typeorm`  | TypeScript/JavaScript | Most SQL databases        | Decorators, Active Record     |
| `mongoose` | JavaScript/TypeScript | MongoDB                   | Schema validation, Middleware |
| `none`     | N/A                   | N/A                       | Direct database access        |

### Styling Solutions

| Option              | Description                 | Framework Support     | Features                       |
| ------------------- | --------------------------- | --------------------- | ------------------------------ |
| `tailwind`          | Utility-first CSS framework | All                   | Utility classes, Design system |
| `scss`              | CSS preprocessor            | All                   | Variables, Nesting, Mixins     |
| `css`               | Plain CSS                   | All                   | Standard CSS, CSS modules      |
| `styled-components` | CSS-in-JS                   | React, Next.js, Remix | Component styling, Theming     |

### Additional Options

| Flag              | Description                         | Default |
| ----------------- | ----------------------------------- | ------- |
| `--typescript`    | Enable TypeScript                   | `true`  |
| `--no-typescript` | Disable TypeScript                  |         |
| `--git`           | Initialize Git repository           | `true`  |
| `--no-git`        | Skip Git initialization             |         |
| `--docker`        | Include Docker configuration        | `false` |
| `--yes, -y`       | Skip prompts, use defaults          | `false` |
| `--install`       | Install dependencies after creation | `false` |

## Project Structure

Generated projects follow a consistent structure:

```
my-project/
├── src/                 # Source code
├── public/             # Static assets
├── package.json        # Dependencies and scripts
├── README.md          # Project documentation
├── .gitignore         # Git ignore rules
├── tsconfig.json      # TypeScript config (if enabled)
├── tailwind.config.js # Tailwind config (if selected)
├── Dockerfile         # Docker config (if enabled)
└── docker-compose.yml # Docker Compose (if enabled)
```

## Common Workflows

### Full-Stack TypeScript Application

```bash
create-precast-app my-app \
  --framework next \
  --backend none \
  --database postgres \
  --orm prisma \
  --styling tailwind \
  --typescript \
  --docker \
  --yes
```

### Simple React SPA

```bash
create-precast-app my-spa \
  --framework react \
  --backend none \
  --database none \
  --orm none \
  --styling tailwind \
  --typescript \
  --yes
```

### Vue.js with Express API

```bash
create-precast-app my-vue-app \
  --framework vue \
  --backend express \
  --database mongodb \
  --orm mongoose \
  --styling scss \
  --typescript \
  --yes
```

## Environment Setup

After project creation:

1. **Navigate to project directory**:

   ```bash
   cd my-project
   ```

2. **Install dependencies**:

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   # or
   bun install
   ```

3. **Start development server**:

   ```bash
   npm run dev
   ```

4. **Set up environment variables** (if using database):
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```

## Troubleshooting

### Common Issues

**Template not found error**:

- Ensure you're using the latest version
- Check network connectivity
- Try clearing npm cache: `npm cache clean --force`

**TypeScript errors**:

- Run `npm run type-check` to see detailed errors
- Ensure all dependencies are installed
- Check tsconfig.json configuration

**Database connection issues**:

- Verify database credentials in .env
- Ensure database server is running
- Check network connectivity to database

**Build failures**:

- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Check for conflicting global packages
- Verify Node.js version compatibility

### Getting Help

- Check the [FAQ](./faq.md)
- Review [troubleshooting guide](./troubleshooting.md)
- Open an issue on [GitHub](https://github.com/your-org/precast-app)
- Join our [Discord community](https://discord.gg/precast)

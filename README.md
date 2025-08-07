<div align="center">
  <img src="https://brutalist.precast.dev/logo.png" alt="Precast Logo" width="200" />
  
  # Precast App
  
  ### 🚀 Build TypeScript projects with SUPERHUMAN SPEED!
  **Choose your stack, configure your powers, and launch into action!**
  
  [![npm version](https://img.shields.io/npm/v/create-precast-app.svg?style=flat-square)](https://www.npmjs.com/package/create-precast-app)
  [![npm downloads](https://img.shields.io/npm/dm/create-precast-app.svg?style=flat-square)](https://www.npmjs.com/package/create-precast-app)
  [![GitHub Stars](https://img.shields.io/github/stars/BuunGroupCore/precast-app?style=flat-square)](https://github.com/BuunGroupCore/precast-app)
  [![License](https://img.shields.io/github/license/BuunGroupCore/precast-app?style=flat-square)](https://github.com/BuunGroupCore/precast-app/blob/main/LICENSE)
  
  [**Website**](https://precast.dev) • [**Builder**](https://precast.dev/builder) • [**Documentation**](https://precast.dev/docs) • [**Discord**](https://discord.gg/precast)
</div>

---

## ✨ Features

- 🎯 **Visual Builder** - Configure your stack visually at [precast.dev/builder](https://precast.dev/builder)
- 🎨 **Multi-framework support** - React, Vue, Angular, Next.js, Nuxt, Svelte, Solid, Remix, Astro, Vite, and Vanilla JS
- 🔧 **Backend integration** - Express, Fastify, Hono, NestJS, or Next.js API Routes
- 🗄️ **Database setup** - PostgreSQL, MySQL, MongoDB, SQLite with Prisma, Drizzle, or TypeORM
- 🔐 **Authentication** - Better Auth, NextAuth, Clerk, Supabase Auth, Auth0, Firebase Auth
- 💅 **UI libraries** - Shadcn/ui, DaisyUI, Material UI, Chakra UI, Ant Design, Mantine
- 🤖 **AI Integration** - Claude Code with MCP servers, GitHub Copilot configuration
- 📦 **Smart package management** - Automatic fallback handling for compatibility issues

## 🚀 Quick Start

### Option 1: Visual Builder (Recommended)

Visit [precast.dev/builder](https://precast.dev/builder) to visually configure your stack and copy the generated command.

### Option 2: Command Line

```bash
# Interactive mode
npx create-precast-app@latest

# With options
npx create-precast-app my-app --framework react --backend express --database postgres

# Full configuration
npx create-precast-app my-app \
  --framework next \
  --backend express \
  --database postgres \
  --orm prisma \
  --styling tailwind \
  --ui-library shadcn \
  --auth better-auth \
  --install
```

## 📖 Commands

| Command        | Description                                               | Documentation                                 |
| -------------- | --------------------------------------------------------- | --------------------------------------------- |
| `init`         | Create a new project with your chosen stack               | [Docs](https://precast.dev/docs#init)         |
| `add`          | Add resources to existing project (component, route, api) | [Docs](https://precast.dev/docs#add)          |
| `add-features` | Add features to existing project (UI libs, AI context)    | [Docs](https://precast.dev/docs#add-features) |
| `list`         | List available templates and features                     | [Docs](https://precast.dev/docs#list)         |
| `banner`       | Create a banner template for customization                | [Docs](https://precast.dev/docs#banner)       |

### Examples

```bash
# Create a Next.js app with everything configured
npx create-precast-app my-nextjs-app \
  --framework next \
  --backend none \
  --database postgres \
  --orm prisma \
  --styling tailwind \
  --ui-library shadcn \
  --auth better-auth \
  --ai claude \
  --mcp-servers postgresql,github \
  --install

# Create a React + Express full-stack app
npx create-precast-app my-fullstack-app \
  --framework react \
  --backend express \
  --database postgres \
  --orm drizzle \
  --api-client tanstack-query \
  --install

# Add authentication to existing project
npx create-precast-app add-features \
  --auth better-auth \
  --provider github,google
```

## 🛠️ Available Options

| Category                | Options                                                                                 |
| ----------------------- | --------------------------------------------------------------------------------------- |
| **Frontend Frameworks** | `react` `vue` `angular` `next` `nuxt` `svelte` `solid` `remix` `astro` `vite` `vanilla` |
| **Backend Frameworks**  | `express` `fastify` `hono` `nest` `none`                                                |
| **Databases**           | `postgres` `mysql` `sqlite` `mongodb` `none`                                            |
| **ORMs**                | `prisma` `drizzle` `typeorm` `mongoose` `none`                                          |
| **Styling**             | `tailwind` `css` `scss` `css-modules` `styled-components` `emotion`                     |
| **UI Libraries**        | `shadcn` `daisyui` `material-ui` `chakra-ui` `ant-design` `mantine`                     |
| **Authentication**      | `better-auth` `next-auth` `clerk` `supabase-auth` `auth0` `firebase-auth`               |
| **AI Assistance**       | `claude` `copilot` `none`                                                               |

## 📈 Star History

<a href="https://star-history.com/#BuunGroupCore/precast-app&Date">
 <picture>
   <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/svg?repos=BuunGroupCore/precast-app&type=Date&theme=dark" />
   <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/svg?repos=BuunGroupCore/precast-app&type=Date" />
   <img alt="Star History Chart" src="https://api.star-history.com/svg?repos=BuunGroupCore/precast-app&type=Date" />
 </picture>
</a>

## 🎯 Why Precast?

- **Zero Config** - Sensible defaults that just work
- **Production Ready** - Best practices and security built-in
- **Type Safe** - Full TypeScript support across the stack
- **Modern Stack** - Latest versions of all dependencies
- **AI Ready** - Claude Code and GitHub Copilot pre-configured
- **Fast Development** - Hot reload, auto-completion, and more
- **Extensible** - Easy to customize and extend

## 📦 Repository Structure

```
precast-app/
├── packages/
│   ├── cli/                 # Main CLI tool (create-precast-app)
│   ├── website/             # Visual builder and documentation site
│   ├── ui/                  # Shared UI component library
│   ├── utils/               # Shared utilities
│   ├── hooks/               # Shared React hooks
│   └── shared/              # Shared configuration and types
├── .github/                 # GitHub workflows and templates
├── docs/                    # Project documentation
└── scripts/                 # Build and maintenance scripts
```

## 🔧 Development

```bash
# Clone the repository
git clone https://github.com/BuunGroupCore/precast-app.git

# Install dependencies
pnpm install

# Build all packages
pnpm build

# Run the website locally
pnpm dev

# Test the CLI locally
cd packages/cli && node dist/cli.js init test-project
```

### Package Scripts

```bash
# Run tests
pnpm test

# Run linting
pnpm lint

# Run type checking
pnpm typecheck

# Format code
pnpm format

# Clean all builds
pnpm clean
```

## 🤝 Contributing

We love contributions! Please see our [Contributing Guide](https://github.com/BuunGroupCore/precast-app/blob/main/CONTRIBUTING.md) for details.

### How to Contribute

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Write tests for new features
- Follow the existing code style
- Update documentation as needed
- Keep commits atomic and descriptive
- Ensure all tests pass before submitting PR

## 💖 Sponsors

A huge thank you to our sponsors who make this project possible!

<a href="https://github.com/sponsors/BuunGroupCore">
  <img src="https://img.shields.io/badge/Sponsor%20Us-GitHub%20Sponsors-ea4aaa?style=for-the-badge&logo=github-sponsors" alt="Sponsor us on GitHub" />
</a>

### Gold Sponsors

<!-- Add sponsor logos/links here -->

_Become our first gold sponsor!_

### Silver Sponsors

<!-- Add sponsor logos/links here -->

_Your company here_

### Bronze Sponsors

<!-- Add sponsor logos/links here -->

_Support the project_

## 📊 Stats

![Alt](https://repobeats.axiom.co/api/embed/5bb7c1882deca2295845fa807bc19bde4fa5e8e2.svg "Repobeats analytics image")

## 🌟 Showcase

Projects built with Precast:

- [Your Project Here] - Submit your project via PR!
- [Example App] - Full-stack demo application
- [Production Site] - Real-world production deployment

_Submit your project to be featured here!_

## 👥 Contributors

Thanks to all the amazing people who have contributed to this project!

<a href="https://github.com/BuunGroupCore/precast-app/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=BuunGroupCore/precast-app" />
</a>

## 📄 License

MIT © [Buun Group](https://github.com/BuunGroupCore)

## 🚨 Security

For security issues, please email security@precast.dev instead of using the issue tracker.

## 🔗 Links

- [Website](https://precast.dev)
- [Visual Builder](https://precast.dev/builder)
- [Documentation](https://precast.dev/docs)
- [GitHub](https://github.com/BuunGroupCore/precast-app)
- [npm Package](https://www.npmjs.com/package/create-precast-app)
- [Discord Community](https://discord.gg/precast)
- [Twitter](https://twitter.com/precastdev)

---

<div align="center">
  Made with ❤️ by the <a href="https://github.com/BuunGroupCore">Buun Group</a> team
  <br />
  <br />
  <a href="https://precast.dev/builder">Try the Visual Builder →</a>
</div>

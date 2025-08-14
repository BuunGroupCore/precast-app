<div align="center">
  <img src="https://brutalist.precast.dev/logo.png" alt="Precast Logo" width="200" />
  
  # create-precast-app
  
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
- 🎨 **Multi-framework support** - React, Vue, Angular, Next.js, Nuxt, Svelte, Solid, Astro, Vite, TanStack Start, and Vanilla JS
- 🔧 **Backend integration** - Express, Fastify, Hono, NestJS, Convex, Cloudflare Workers, or Next.js API Routes
- 🗄️ **Database setup** - PostgreSQL, MySQL, MongoDB, SQLite with Prisma, Drizzle, or TypeORM
- 🔐 **Authentication** - Better Auth, NextAuth, Clerk, Supabase Auth, Auth0, Firebase Auth
- 💅 **UI libraries** - Shadcn/ui, DaisyUI, Material UI, Chakra UI, Ant Design, Mantine
- 🎨 **Color Palettes** - Pre-configured color themes for instant beautiful designs
- 🤖 **AI Integration** - Claude Code with MCP servers, GitHub Copilot configuration
- 🐳 **Docker Support** - Auto-configured Docker containers for databases and services
- 🚀 **PowerUps** - Traefik, ngrok, Cloudflare Tunnels for advanced networking
- 🔌 **Plugins** - Stripe, Resend, SendGrid, Twilio, and more business integrations
- 📦 **Smart package management** - Automatic fallback handling for compatibility issues
- 🎯 **Deployment Ready** - Vercel, Netlify, Cloudflare Pages, Railway configurations

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
  --docker \
  --install
```

## 📦 Available Technologies

### Frontend Frameworks

- **React** - The classic choice with React Router v7
- **Next.js** - Full-stack React framework with App Router
- **Vue** - Progressive JavaScript framework
- **Nuxt** - Full-stack Vue framework
- **Angular** - Enterprise-ready framework
- **Svelte** - Compile-time optimized framework
- **Solid** - Fine-grained reactive framework
- **Astro** - Content-focused framework
- **TanStack Start** - Full-stack React with TanStack Router
- **Vite** - Lightning fast build tool
- **Vanilla** - Pure JavaScript/TypeScript

### Backend Options

- **Express** - Fast, minimalist web framework
- **Fastify** - High performance alternative to Express
- **Hono** - Small, simple, ultrafast web framework
- **NestJS** - Enterprise-grade Node.js framework
- **Convex** - Backend-as-a-Service platform
- **Cloudflare Workers** - Edge computing platform
- **Next.js API Routes** - Integrated API endpoints
- **None** - Frontend only

### Databases

- **PostgreSQL** - Advanced open-source database
- **MySQL** - Popular open-source database
- **MongoDB** - NoSQL document database
- **SQLite** - Lightweight embedded database

### ORMs

- **Prisma** - Next-generation ORM
- **Drizzle** - TypeScript ORM with SQL-like syntax
- **TypeORM** - Mature ORM with Active Record and Data Mapper
- **Mongoose** - MongoDB object modeling

### Authentication Providers

- **Better Auth** - Modern authentication library
- **NextAuth** - Authentication for Next.js
- **Clerk** - Complete user management
- **Supabase Auth** - Open source auth service
- **Auth0** - Identity platform
- **Firebase Auth** - Google's auth solution

### UI Libraries

- **Shadcn/ui** - Radix UI + Tailwind components
- **DaisyUI** - Tailwind CSS components
- **Material UI** - React components with Material Design
- **Chakra UI** - Modular component library
- **Ant Design** - Enterprise design language
- **Mantine** - Full-featured React components

### Styling Options

- **Tailwind CSS** - Utility-first CSS framework
- **CSS** - Plain CSS
- **SCSS** - CSS with superpowers
- **CSS Modules** - Locally scoped CSS
- **Styled Components** - CSS-in-JS
- **Emotion** - CSS-in-JS library

### PowerUps (Advanced Features)

- **Traefik** - Modern reverse proxy and load balancer
- **ngrok** - Secure tunnels to localhost
- **Cloudflare Tunnel** - Secure connection to Cloudflare network

### Business Plugins

- **Stripe** - Payment processing
- **Resend** - Email API for developers
- **SendGrid** - Email delivery service
- **Twilio** - Communication APIs
- **Plivo** - Voice and SMS platform
- **Mailgun** - Email automation
- **Postmark** - Transactional email
- **Pusher** - Real-time communication
- **Segment** - Customer data platform
- **Sentry** - Error tracking
- **Datadog** - Monitoring and analytics

## 🎯 Commands

### `init` - Create a new project

```bash
npx create-precast-app init my-app [options]
```

### `add` - Add features to existing project (Coming Soon)

```bash
npx create-precast-app add auth --provider clerk
```

### `deploy` - Manage Docker services

```bash
# Start all Docker services
npx create-precast-app deploy

# Check service status
npx create-precast-app deploy --status

# Stop services
npx create-precast-app deploy --stop

# Destroy all services and data
npx create-precast-app deploy --destroy
```

### `generate` - Generate ORM client

```bash
# Generate Prisma/Drizzle/TypeORM client
npx create-precast-app generate
```

### `status` - Check project configuration

```bash
# Display project information and configuration
npx create-precast-app status
```

## 🐳 Docker Integration

Projects with Docker enabled get:

- Database containers with persistent volumes
- Admin tools (pgAdmin, phpMyAdmin, MongoDB Compass)
- Redis cache (optional)
- PowerUp services (Traefik, ngrok, etc.)
- Auto-deploy scripts for easy management

### Docker Commands

```bash
# Generated npm scripts
npm run docker:deploy    # Start all services
npm run docker:stop      # Stop all services
npm run docker:status    # Check service status
npm run docker:down      # Stop and remove containers
```

## 🤖 AI Integration

### Claude Code Support

Every project includes Claude Code integration with:

- `.claude/settings.json` - Pre-configured tool permissions
- Project-specific `CLAUDE.md` documentation
- MCP server configurations (when selected)

### Available MCP Servers

- **Supabase** - Database and auth management
- **Brave Search** - Web search capabilities
- **Context** - Documentation retrieval
- **IDE** - Editor integration

## 🎨 Color Palettes

Pre-configured professional color themes:

- **Amber Warmth** - Warm, inviting colors
- **Arctic Blue** - Cool, professional palette
- **Coral Reef** - Vibrant, energetic theme
- **Desert Sand** - Earthy, natural tones
- **Emerald** - Fresh, modern green theme
- **Forest** - Deep, natural greens
- **Ocean** - Calming blue palette
- **Purple** - Royal, creative theme
- **Ruby** - Bold, passionate reds
- **Slate** - Professional grayscale
- **Sunset** - Warm gradient theme
- **Teal** - Modern cyan palette

## 🚀 Deployment

Pre-configured deployment setups for:

- **Vercel** - Optimized for Next.js and frontend apps
- **Netlify** - Great for static sites and SPAs
- **Cloudflare Pages** - Edge deployment with Workers
- **Railway** - Full-stack deployment platform

## 📊 Telemetry

The CLI collects anonymous usage statistics to improve the tool. This includes:

- Framework and technology choices
- Success/failure rates
- Performance metrics
- No personal data is collected

To opt-out:

```bash
export PRECAST_TELEMETRY_DISABLED=1
```

## 🔧 Configuration

Projects include a `precast.jsonc` file that documents all configuration choices:

```jsonc
{
  "$schema": "https://precast.dev/precast.schema.json",
  "version": "1.0.0",
  "framework": "react",
  "backend": "express",
  "database": "postgres",
  "orm": "prisma",
  "styling": "tailwind",
  "uiLibrary": "shadcn",
  "authProvider": "better-auth",
  "typescript": true,
  "docker": true,
  "powerups": ["traefik", "ngrok"],
  "plugins": ["stripe", "resend"],
}
```

## 🛠️ Development

### Prerequisites

- Node.js 18+ or Bun
- Git
- Docker (optional, for Docker features)

### Local Development

```bash
# Clone the repository
git clone https://github.com/BuunGroupCore/precast-app.git
cd precast-app/packages/cli

# Install dependencies
bun install

# Build the CLI
bun run build

# Test locally
./dist/cli.js init test-project
```

## 📚 Documentation

- [Contributing Guide](CONTRIBUTING.md) - How to contribute to the project
- [Architecture](docs/ARCHITECTURE.md) - System design and technical decisions
- [Developer Guide](docs/DEVELOPER-GUIDE.md) - Detailed development workflows
- [Security](docs/SECURITY.md) - Security practices and audit information
- [Telemetry](docs/TELEMETRY.md) - Analytics implementation and privacy

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Quick Contribution Steps

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

MIT © [Buun Group Core](https://github.com/BuunGroupCore)

## 🙏 Acknowledgments

Built with ❤️ by the Precast team and contributors.

Special thanks to all the open-source projects that make this possible.

---

<div align="center">
  <strong>Happy coding! 🚀</strong>
  
  [Report Bug](https://github.com/BuunGroupCore/precast-app/issues) • [Request Feature](https://github.com/BuunGroupCore/precast-app/issues) • [Join Discord](https://discord.gg/precast)
</div>

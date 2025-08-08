# CLI Examples

Real-world examples of using the Precast CLI to create different types of applications.

## 📋 Table of Contents

1. [Quick Start Examples](#quick-start-examples)
2. [Web Application Examples](#web-application-examples)
3. [API & Backend Examples](#api--backend-examples)
4. [Mobile App Examples](#mobile-app-examples)
5. [Edge & Serverless Examples](#edge--serverless-examples)
6. [Enterprise Examples](#enterprise-examples)
7. [Specialized Use Cases](#specialized-use-cases)

## ⚡ Quick Start Examples

### Minimal React App
```bash
# Simplest React app with Vite
bunx create-precast-app@latest my-react-app \
  --framework react \
  --styling tailwind \
  --yes \
  --install
```
**Generated:** React + Vite + Tailwind + TypeScript

### Vue 3 Starter
```bash
# Modern Vue 3 application
bunx create-precast-app@latest my-vue-app \
  --framework vue \
  --styling tailwind \
  --ui-library daisyui \
  --yes \
  --install
```
**Generated:** Vue 3 + Vite + Tailwind + DaisyUI

### Next.js Quick Start
```bash
# Next.js with built-in optimizations
bunx create-precast-app@latest my-nextjs-app \
  --framework next \
  --styling tailwind \
  --ui-library shadcn \
  --yes \
  --install
```
**Generated:** Next.js 14 + App Router + shadcn/ui

## 🌐 Web Application Examples

### E-commerce Application
```bash
bunx create-precast-app@latest ecommerce-store \
  --framework next \
  --backend next-api \
  --database postgres \
  --orm prisma \
  --styling tailwind \
  --ui-library shadcn \
  --auth clerk \
  --api-client tanstack-query \
  --powerups sentry,storybook \
  --docker \
  --install
```

**Features:**
- Next.js 14 with App Router
- PostgreSQL database with Prisma ORM  
- Clerk authentication with user management
- shadcn/ui component library
- TanStack Query for data fetching
- Docker setup for local development
- Sentry error tracking
- Storybook for component development

**Perfect for:** Online stores, marketplace platforms, product catalogs

### Social Media Dashboard
```bash
bunx create-precast-app@latest social-dashboard \
  --framework react \
  --backend express \
  --database mongodb \
  --orm mongoose \
  --styling tailwind \
  --ui-library mui \
  --auth better-auth \
  --api-client axios \
  --powerups posthog,prettier,eslint \
  --ai claude \
  --mcp-servers mongodb github \
  --docker \
  --install
```

**Features:**
- React SPA with Express API
- MongoDB with Mongoose ODM
- Material-UI component library
- Better Auth for authentication
- PostHog analytics integration
- Claude AI integration with MCP servers
- Docker services for MongoDB

**Perfect for:** Analytics dashboards, social platforms, content management

### Blog & Content Platform
```bash
bunx create-precast-app@latest content-platform \
  --framework astro \
  --backend none \
  --database supabase \
  --styling tailwind \
  --ui-library daisyui \
  --auth supabase \
  --powerups prettier,eslint,storybook \
  --install
```

**Features:**
- Astro for static site generation with partial hydration
- Supabase backend-as-a-service
- Built-in authentication and real-time features
- DaisyUI for rapid UI development
- Perfect for SEO-optimized content sites

**Perfect for:** Blogs, documentation sites, marketing pages

### Enterprise Web App
```bash
bunx create-precast-app@latest enterprise-app \
  --framework angular \
  --backend nestjs \
  --database postgres \
  --orm typeorm \
  --styling scss \
  --auth auth0 \
  --api-client axios \
  --powerups prettier,eslint,husky,vitest,playwright \
  --runtime node \
  --docker \
  --install
```

**Features:**
- Angular with TypeScript (strict mode)
- NestJS backend with decorators and dependency injection
- PostgreSQL with TypeORM for enterprise-grade data modeling
- Auth0 for enterprise authentication
- Comprehensive testing with Vitest and Playwright
- Git hooks with Husky for code quality
- Docker for consistent development environments

**Perfect for:** Enterprise applications, CRM systems, admin panels

## 🔧 API & Backend Examples

### REST API Server
```bash
bunx create-precast-app@latest api-server \
  --framework none \
  --backend express \
  --database postgres \
  --orm prisma \
  --runtime node \
  --powerups prettier,eslint,vitest \
  --docker \
  --install
```

**Features:**
- Express.js REST API
- PostgreSQL with Prisma ORM
- API documentation generation
- Docker services for database
- Unit testing with Vitest

**Perfect for:** Microservices, API backends, data services

### GraphQL API
```bash
bunx create-precast-app@latest graphql-api \
  --framework none \
  --backend nestjs \
  --database postgres \
  --orm prisma \
  --api-client apollo-client \
  --powerups prettier,eslint,husky \
  --docker \
  --install
```

**Features:**
- NestJS with GraphQL integration
- PostgreSQL database with Prisma
- Apollo Client setup for frontend consumption
- Type-safe GraphQL schema generation
- Docker services

**Perfect for:** GraphQL APIs, complex data relationships, modern APIs

### High-Performance API
```bash
bunx create-precast-app@latest fast-api \
  --framework none \
  --backend fastify \
  --database redis \
  --runtime bun \
  --powerups prettier,eslint \
  --docker \
  --install
```

**Features:**
- Fastify for high-performance HTTP server
- Bun runtime for maximum speed
- Redis for caching and session storage
- Optimized for high-throughput scenarios

**Perfect for:** High-traffic APIs, real-time services, performance-critical applications

## 📱 Mobile App Examples

### React Native App
```bash
bunx create-precast-app@latest mobile-app \
  --framework react-native \
  --database firebase \
  --auth firebase \
  --styling tailwind \
  --powerups sentry \
  --runtime node \
  --install
```

**Features:**
- React Native for iOS and Android
- Firebase backend with real-time database
- Firebase Authentication
- NativeWind (Tailwind for React Native)
- Sentry for crash reporting

**Perfect for:** Mobile apps, cross-platform development

### PWA with Offline Support
```bash
bunx create-precast-app@latest pwa-app \
  --framework solid \
  --backend hono \
  --database sqlite \
  --orm drizzle \
  --styling tailwind \
  --powerups vite-pwa,workbox \
  --runtime bun \
  --install
```

**Features:**
- SolidJS for reactive UI
- Hono for lightweight API
- SQLite with Drizzle for local data
- PWA capabilities with offline support
- Service worker for caching

**Perfect for:** Progressive web apps, offline-first applications

## ⚡ Edge & Serverless Examples

### Cloudflare Edge App
```bash
bunx create-precast-app@latest edge-app \
  --framework svelte \
  --backend cloudflare-workers \
  --database cloudflare-d1 \
  --orm drizzle \
  --styling tailwind \
  --runtime bun \
  --install
```

**Features:**
- Svelte for lightweight frontend
- Cloudflare Workers for edge computing
- D1 SQLite database at the edge
- Drizzle ORM optimized for edge environments
- Global deployment and low latency

**Perfect for:** Global applications, edge computing, low-latency services

### Vercel Serverless
```bash
bunx create-precast-app@latest vercel-app \
  --framework next \
  --backend next-api \
  --database planetscale \
  --orm drizzle \
  --styling tailwind \
  --ui-library shadcn \
  --auth nextauth \
  --powerups sentry \
  --install
```

**Features:**
- Next.js with API Routes
- PlanetScale serverless MySQL
- Drizzle ORM for edge compatibility
- NextAuth.js for authentication
- Optimized for Vercel deployment

**Perfect for:** Serverless applications, scalable web apps

### Deno Deploy Application
```bash
bunx create-precast-app@latest deno-app \
  --framework solid \
  --backend hono \
  --database supabase \
  --styling tailwind \
  --runtime deno \
  --install
```

**Features:**
- SolidJS reactive framework
- Hono web framework (Deno compatible)
- Supabase for backend services
- Deno runtime for modern JavaScript
- Deploy to Deno Deploy

**Perfect for:** Modern JavaScript apps, secure runtime environment

## 🏢 Enterprise Examples

### Microservices Architecture
```bash
# API Gateway Service
bunx create-precast-app@latest api-gateway \
  --framework none \
  --backend express \
  --database redis \
  --powerups prettier,eslint,husky,vitest \
  --docker \
  --install

# User Service
bunx create-precast-app@latest user-service \
  --framework none \
  --backend nestjs \
  --database postgres \
  --orm prisma \
  --auth auth0 \
  --powerups prettier,eslint,husky,vitest \
  --docker \
  --install

# Frontend Application  
bunx create-precast-app@latest admin-frontend \
  --framework react \
  --backend none \
  --styling tailwind \
  --ui-library mui \
  --auth auth0 \
  --api-client tanstack-query \
  --powerups prettier,eslint,husky,vitest,storybook \
  --install
```

**Architecture:**
- API Gateway for request routing
- Dedicated user management service
- React admin interface
- Shared authentication with Auth0
- Comprehensive testing and documentation

### Multi-tenant SaaS
```bash
bunx create-precast-app@latest saas-platform \
  --framework next \
  --backend next-api \
  --database postgres \
  --orm prisma \
  --styling tailwind \
  --ui-library shadcn \
  --auth clerk \
  --api-client tanstack-query \
  --powerups sentry,posthog,storybook,prettier,eslint,husky \
  --ai claude \
  --mcp-servers postgresql github \
  --docker \
  --install
```

**Features:**
- Next.js full-stack application
- Multi-tenant database design with Prisma
- Clerk for user management and organizations
- Advanced analytics with PostHog
- AI integration for enhanced development
- Comprehensive monitoring and error tracking

## 🎯 Specialized Use Cases

### AI-Powered Application
```bash
bunx create-precast-app@latest ai-app \
  --framework react \
  --backend express \
  --database postgres \
  --orm prisma \
  --styling tailwind \
  --ui-library shadcn \
  --auth better-auth \
  --api-client tanstack-query \
  --ai claude \
  --mcp-servers postgresql github memory \
  --powerups sentry \
  --docker \
  --install
```

**Features:**
- Claude AI integration with MCP servers
- Memory persistence for AI conversations
- PostgreSQL for data storage
- React frontend optimized for AI interactions
- Error tracking for AI-related issues

**Perfect for:** AI applications, chatbots, intelligent assistants

### Real-time Collaboration Platform
```bash
bunx create-precast-app@latest collab-platform \
  --framework vue \
  --backend nestjs \
  --database postgres \
  --orm prisma \
  --styling tailwind \
  --ui-library daisyui \
  --auth better-auth \
  --api-client axios \
  --powerups prettier,eslint,vitest \
  --docker \
  --install
```

**Features:**
- Vue 3 with reactive state management
- NestJS with WebSocket support
- PostgreSQL for persistent data
- Real-time communication capabilities
- Scalable architecture

**Perfect for:** Collaborative tools, team platforms, real-time applications

### E-learning Platform
```bash
bunx create-precast-app@latest learning-platform \
  --framework next \
  --backend next-api \
  --database supabase \
  --styling tailwind \
  --ui-library shadcn \
  --auth supabase \
  --powerups prettier,eslint,storybook \
  --install
```

**Features:**
- Next.js for SEO-optimized content
- Supabase for real-time features and storage
- Built-in authentication and user management
- File upload capabilities for course content
- Real-time progress tracking

**Perfect for:** Online courses, educational platforms, training systems

### IoT Dashboard
```bash
bunx create-precast-app@latest iot-dashboard \
  --framework solid \
  --backend fastify \
  --database mongodb \
  --orm mongoose \
  --styling tailwind \
  --ui-library daisyui \
  --powerups prettier,eslint,vitest \
  --docker \
  --install
```

**Features:**
- SolidJS for reactive real-time updates
- Fastify for high-performance API
- MongoDB for flexible IoT data storage
- Real-time data visualization
- Efficient handling of time-series data

**Perfect for:** IoT applications, sensor dashboards, monitoring systems

## 🔄 Migration & Integration Examples

### Legacy System Integration
```bash
bunx create-precast-app@latest legacy-integration \
  --framework react \
  --backend express \
  --database mysql \
  --orm typeorm \
  --styling css \
  --api-client axios \
  --powerups prettier,eslint \
  --docker \
  --install
```

**Features:**
- React for modern frontend
- Express.js for API layer
- MySQL compatibility for legacy databases
- TypeORM for complex database relationships
- Gradual migration strategy

### Headless CMS Frontend
```bash
bunx create-precast-app@latest headless-frontend \
  --framework astro \
  --backend none \
  --database none \
  --styling tailwind \
  --ui-library daisyui \
  --api-client axios \
  --powerups prettier,eslint \
  --install
```

**Features:**
- Astro for static site generation
- API integration for headless CMS
- SEO-optimized output
- Fast loading times
- Easy content management

## 🚀 Deployment-Specific Examples

### Vercel Deployment
```bash
bunx create-precast-app@latest vercel-optimized \
  --framework next \
  --backend next-api \
  --database planetscale \
  --orm drizzle \
  --styling tailwind \
  --ui-library shadcn \
  --auth nextauth \
  --install
```

### Netlify Deployment
```bash
bunx create-precast-app@latest netlify-optimized \
  --framework astro \
  --backend netlify-functions \
  --database supabase \
  --styling tailwind \
  --ui-library daisyui \
  --install
```

### Self-Hosted Deployment
```bash
bunx create-precast-app@latest self-hosted \
  --framework vue \
  --backend express \
  --database postgres \
  --orm prisma \
  --styling tailwind \
  --ui-library daisyui \
  --auth better-auth \
  --docker \
  --install
```

## 💡 Pro Tips

### Development Workflow
```bash
# Create project with all development tools
bunx create-precast-app@latest my-project \
  --framework react \
  --backend express \
  --database postgres \
  --orm prisma \
  --styling tailwind \
  --ui-library shadcn \
  --powerups prettier,eslint,husky,vitest,playwright,storybook \
  --ai claude \
  --mcp-servers postgresql github filesystem \
  --docker \
  --install

# This gives you:
# - Code formatting with Prettier
# - Linting with ESLint  
# - Git hooks with Husky
# - Unit testing with Vitest
# - E2E testing with Playwright
# - Component development with Storybook
# - AI assistance with Claude
# - Database operations with MCP
# - Local development with Docker
```

### Quick Prototyping
```bash
# Minimal setup for rapid prototyping
bunx create-precast-app@latest prototype \
  --framework react \
  --database supabase \
  --styling tailwind \
  --ui-library shadcn \
  --auth supabase \
  --yes \
  --install

# Everything you need to start building immediately
```

### Performance-Focused
```bash
# Optimized for performance
bunx create-precast-app@latest fast-app \
  --framework solid \
  --backend hono \
  --database turso \
  --orm drizzle \
  --styling tailwind \
  --runtime bun \
  --install

# Fastest possible stack combination
```

---

**Next:** [Troubleshooting](./troubleshooting.md) | [Command Reference](./commands.md) | [Contributing](../contributing.md)
# Templates Guide

Understanding Precast's template system, project structure, and customization options.

## 📋 Table of Contents

1. [Template System Overview](#template-system-overview)
2. [Project Structure](#project-structure)
3. [Framework Templates](#framework-templates)
4. [Feature Templates](#feature-templates)
5. [Template Customization](#template-customization)
6. [Generated Files](#generated-files)

## 🏗️ Template System Overview

Precast uses a sophisticated template system based on **Handlebars** to generate projects tailored to your specific stack choices.

### How Templates Work

1. **Selection Phase**: CLI determines which templates to use based on your configuration
2. **Processing Phase**: Handlebars processes templates with your project configuration
3. **Generation Phase**: Processed templates are written to your project directory
4. **Post-Processing**: Dependencies are installed and additional setup is performed

### Template Structure
```
packages/cli/src/templates/
├── frameworks/          # Framework-specific templates
├── backends/            # Backend server templates  
├── database/            # Database configuration
├── api-clients/         # API client integrations
├── powerups/            # Development tools
├── docker/              # Container configurations
├── deployment/          # Deployment configurations
└── workspace/           # Monorepo templates
```

### Template Variables
Templates receive a configuration object with all your choices:

```javascript
{
  name: "my-app",
  framework: "react",
  backend: "express", 
  database: "postgres",
  orm: "prisma",
  styling: "tailwind",
  typescript: true,
  uiLibrary: "shadcn",
  auth: "better-auth",
  apiClient: "tanstack-query",
  docker: true,
  // ... more configuration
}
```

## 📁 Project Structure

Generated projects follow consistent, framework-appropriate structures.

### React Project Structure
```
my-react-app/
├── public/              # Static assets
├── src/
│   ├── components/      # React components
│   ├── hooks/          # Custom React hooks
│   ├── pages/          # Page components
│   ├── utils/          # Utility functions
│   ├── styles/         # Global styles
│   ├── App.tsx         # Main App component
│   └── main.tsx        # Application entry point
├── .claude/            # Claude Code configuration
├── docker-compose.yml  # Docker services (if --docker)
├── package.json        # Dependencies and scripts
├── tailwind.config.js  # Tailwind configuration
├── vite.config.js      # Vite build configuration
├── tsconfig.json       # TypeScript configuration
└── README.md           # Project documentation
```

### Next.js Project Structure
```
my-nextjs-app/
├── public/             # Static assets
├── src/
│   ├── app/           # App Router (Next.js 13+)
│   │   ├── api/       # API routes
│   │   ├── globals.css # Global styles
│   │   ├── layout.tsx # Root layout
│   │   └── page.tsx   # Home page
│   ├── components/    # React components
│   ├── lib/          # Utility libraries
│   └── hooks/        # Custom hooks
├── .env.local        # Environment variables
├── next.config.js    # Next.js configuration
├── prisma/           # Database schema (if Prisma)
│   └── schema.prisma
└── package.json
```

### Vue Project Structure  
```
my-vue-app/
├── public/           # Static assets
├── src/
│   ├── components/   # Vue components
│   ├── views/        # Page views
│   ├── composables/  # Vue composables
│   ├── stores/       # Pinia stores
│   ├── router/       # Vue Router configuration
│   ├── App.vue       # Root component
│   └── main.ts       # Application entry point
├── vite.config.js    # Vite configuration
└── package.json
```

### Angular Project Structure
```
my-angular-app/
├── src/
│   ├── app/
│   │   ├── components/   # Angular components
│   │   ├── services/     # Angular services  
│   │   ├── guards/       # Route guards
│   │   ├── models/       # TypeScript models
│   │   ├── app.component.ts
│   │   ├── app.module.ts
│   │   └── app-routing.module.ts
│   ├── assets/          # Static assets
│   ├── environments/    # Environment configs
│   └── main.ts          # Bootstrap file
├── angular.json         # Angular CLI configuration
└── package.json
```

### Backend Project Structure
```
my-backend/
├── src/
│   ├── routes/         # API routes
│   ├── middleware/     # Express middleware
│   ├── models/         # Database models
│   ├── services/       # Business logic
│   ├── utils/          # Utility functions
│   ├── types/          # TypeScript types
│   └── index.ts        # Server entry point
├── prisma/             # Database schema (if Prisma)
├── docker-compose.yml  # Database services
├── .env.example        # Environment template
└── package.json
```

## 🎨 Framework Templates

Each framework has optimized templates with framework-specific best practices.

### React Template Features
- **Vite** for fast development and building
- **React 18** with Suspense and concurrent features
- **TypeScript** support with strict configuration
- **Tailwind CSS** with responsive design utilities
- **ESLint + Prettier** for code quality
- **Hot Module Replacement** for instant updates

**Key Files:**
```typescript
// src/App.tsx
import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          Welcome to {projectName}
        </h1>
        <button 
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => setCount(count + 1)}
        >
          Count: {count}
        </button>
      </div>
    </div>
  )
}

export default App
```

### Next.js Template Features
- **App Router** (Next.js 13+) for improved routing
- **Server Components** by default with client components when needed
- **API Routes** with type-safe responses
- **Image Optimization** with Next.js Image component
- **Font Optimization** with next/font
- **Metadata API** for SEO optimization

**Key Files:**
```typescript
// src/app/layout.tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: '{{name}}',
  description: 'Generated by Precast',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}

// src/app/page.tsx
export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-8">
          Welcome to {{name}}
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Built with Next.js and Precast
        </p>
      </div>
    </main>
  )
}
```

### Vue Template Features
- **Vue 3** with Composition API
- **Vite** for development and building
- **Vue Router** for client-side routing
- **Pinia** for state management
- **TypeScript** support with script setup syntax
- **Scoped CSS** with preprocessor support

**Key Files:**
```vue
<!-- src/App.vue -->
<template>
  <div id="app">
    <nav class="bg-white shadow">
      <div class="container mx-auto px-4">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <h1 class="text-xl font-bold text-gray-900">{{name}}</h1>
          </div>
        </div>
      </div>
    </nav>
    
    <router-view />
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
```

### Angular Template Features
- **Angular 17+** with standalone components
- **TypeScript** with strict mode
- **Angular CLI** for development tooling
- **RxJS** for reactive programming
- **Angular Material** option for UI components
- **Lazy Loading** for route-based code splitting

**Key Files:**
```typescript
// src/app/app.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = '{{name}}';
}
```

## ⚡ Feature Templates

Feature templates add functionality to your base project.

### Authentication Templates

#### Better Auth Setup
```typescript
// src/lib/auth.ts
import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { prisma } from './database'

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql'
  }),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }
  }
})
```

#### NextAuth.js Setup
```typescript
// src/app/api/auth/[...nextauth]/route.ts
import NextAuth from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from '@/lib/database'
import GoogleProvider from 'next-auth/providers/google'

const handler = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
})

export { handler as GET, handler as POST }
```

### Database Templates

#### Prisma Configuration
```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("users")
}
```

#### Drizzle Configuration
```typescript
// src/lib/database.ts
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'

const connectionString = process.env.DATABASE_URL!
const client = postgres(connectionString)
export const db = drizzle(client, { schema })

// src/lib/schema.ts
import { pgTable, text, timestamp } from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  name: text('name'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})
```

### API Client Templates

#### TanStack Query Setup
```typescript
// src/lib/query-client.ts
import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      cacheTime: 1000 * 60 * 30, // 30 minutes
    },
  },
})

// src/hooks/use-users.ts
import { useQuery } from '@tanstack/react-query'

export function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const response = await fetch('/api/users')
      if (!response.ok) throw new Error('Failed to fetch users')
      return response.json()
    },
  })
}
```

#### tRPC Setup
```typescript
// src/lib/trpc.ts
import { createTRPCReact } from '@trpc/react-query'
import type { AppRouter } from '../server/api/root'

export const api = createTRPCReact<AppRouter>()

// src/server/api/routers/users.ts
import { z } from 'zod'
import { createTRPCRouter, publicProcedure } from '../trpc'

export const usersRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return ctx.prisma.user.findMany()
  }),
  
  create: publicProcedure
    .input(z.object({ name: z.string(), email: z.string().email() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.user.create({
        data: input,
      })
    }),
})
```

### UI Library Templates

#### shadcn/ui Setup
```typescript
// components.json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "default",
  "rsc": {{#if (eq framework "next")}}true{{else}}false{{/if}},
  "tsx": {{typescript}},
  "tailwind": {
    "config": "tailwind.config.js",
    "css": "src/app/globals.css",
    "baseColor": "slate",
    "cssVariables": true
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils"
  }
}

// src/components/ui/button.tsx
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)
```

## 🎛️ Template Customization

Advanced users can customize templates for their specific needs.

### Template Override
```bash
# Use custom template directory
create-precast-app my-app --template-dir ./my-templates

# Override specific framework template
create-precast-app my-app --framework react --template-override react=./my-react-template
```

### Custom Template Structure
```
my-custom-templates/
├── frameworks/
│   └── react/
│       ├── base/
│       │   ├── package.json.hbs
│       │   └── tsconfig.json.hbs
│       └── src/
│           ├── App.tsx.hbs
│           └── main.tsx.hbs
├── features/
│   └── auth/
│       └── better-auth/
│           └── config.ts.hbs
└── powerups/
    └── storybook/
        └── main.ts.hbs
```

### Template Helpers
Custom Handlebars helpers for advanced template logic:

```javascript
// Custom helper registration
Handlebars.registerHelper('ifEquals', function(arg1, arg2, options) {
  return (arg1 === arg2) ? options.fn(this) : options.inverse(this);
});

// Usage in templates
{{#ifEquals framework "react"}}
import React from 'react'
{{/ifEquals}}

{{#ifEquals framework "vue"}}
import { defineComponent } from 'vue'
{{/ifEquals}}
```

### Conditional Content
```handlebars
{{!-- Framework-specific imports --}}
{{#if (eq framework "react")}}
import React from 'react'
import ReactDOM from 'react-dom/client'
{{/if}}

{{#if (eq framework "vue")}}
import { createApp } from 'vue'
{{/if}}

{{!-- TypeScript vs JavaScript --}}
{{#if typescript}}
interface Props {
  name: string;
  age?: number;
}
{{else}}
// Props: { name: string, age?: number }
{{/if}}

{{!-- Database-specific configuration --}}
{{#if (eq database "postgres")}}
DATABASE_URL="postgresql://user:password@localhost:5432/{{name}}"
{{/if}}

{{#if (eq database "mongodb")}}
MONGODB_URI="mongodb://localhost:27017/{{name}}"
{{/if}}
```

## 📄 Generated Files

Understanding the files generated by different configurations.

### Base Files (All Projects)
```
├── README.md                # Project documentation
├── package.json             # Dependencies and scripts  
├── .gitignore              # Git ignore rules
├── .env.example            # Environment template
└── tsconfig.json           # TypeScript config (if TS enabled)
```

### Framework-Specific Files

#### React Projects
```
├── index.html              # HTML entry point
├── vite.config.js          # Vite configuration
├── src/
│   ├── App.tsx             # Main App component
│   ├── main.tsx            # React app mounting
│   └── index.css           # Global styles
```

#### Next.js Projects
```
├── next.config.js          # Next.js configuration
├── src/app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Home page
│   ├── globals.css         # Global styles
│   └── api/                # API routes directory
```

### Database Files

#### With Prisma
```
├── prisma/
│   ├── schema.prisma       # Database schema
│   └── migrations/         # Migration files
└── src/lib/database.ts     # Prisma client setup
```

#### With Drizzle
```
├── drizzle.config.ts       # Drizzle configuration
├── src/lib/
│   ├── database.ts         # Database client
│   └── schema.ts           # Table schemas
```

### Docker Files
```
├── Dockerfile              # Application container
├── docker-compose.yml      # Multi-service setup
├── .dockerignore          # Docker ignore rules
└── docker/
    ├── postgres/
    │   └── init.sql        # Database initialization
    └── mysql/
        ├── init.sql
        └── my.cnf
```

### AI Integration Files

#### Claude Integration
```
├── .claude/
│   └── settings.json       # Claude Code settings
├── CLAUDE.md              # Project context for Claude
└── .env.example           # Environment variables for MCP
```

#### GitHub Copilot
```
├── .vscode/
│   └── settings.json       # VS Code settings
└── .github/
    └── copilot.yml         # Copilot configuration
```

### Development Tool Files

#### ESLint + Prettier
```
├── .eslintrc.js            # ESLint configuration
├── .prettierrc             # Prettier configuration
└── .prettierignore         # Prettier ignore rules
```

#### Testing Setup
```
├── vitest.config.ts        # Vitest configuration
├── playwright.config.ts    # Playwright E2E config
└── src/
    ├── __tests__/          # Unit tests
    └── components/
        └── __tests__/      # Component tests
```

### Deployment Files

#### Vercel
```
├── vercel.json             # Vercel configuration
└── .vercelignore          # Vercel ignore rules
```

#### Netlify
```
├── netlify.toml            # Netlify configuration
└── _redirects             # Redirect rules
```

#### Cloudflare Pages
```
├── wrangler.toml          # Cloudflare configuration
└── _routes.json           # Route configuration
```

---

**Next:** [Examples](./examples.md) | [Troubleshooting](./troubleshooting.md) | [Contributing](../contributing.md)
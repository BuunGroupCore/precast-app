/**
 * Simple Handlebars template processor for preview functionality
 */

/**
 * Context object for template processing with project configuration
 */
interface TemplateContext {
  name: string;
  framework: string;
  typescript?: boolean;
  styling?: string;
  backend?: string;
  database?: string;
  orm?: string;
  apiClient?: string;
  auth?: string;
  [key: string]: string | boolean | undefined;
}

/**
 * Process a Handlebars template string with the given context
 * @param template - The template string to process
 * @param context - Context object with values for template variables
 * @returns Processed template string with variables replaced
 */
export function processTemplate(template: string, context: TemplateContext): string {
  let result = template;

  // Replace simple variables {{name}}, {{framework}}, etc.
  result = result.replace(/\{\{([^#/].*?)\}\}/g, (_match, key) => {
    const trimmedKey = key.trim();
    return context[trimmedKey] !== undefined ? String(context[trimmedKey]) : _match;
  });

  // Handle {{#if condition}} blocks
  result = result.replace(
    /\{\{#if\s+(.*?)\}\}([\s\S]*?)\{\{\/if\}\}/g,
    (_match, condition, content) => {
      const trimmedCondition = condition.trim();

      // Handle simple boolean conditions
      if (context[trimmedCondition]) {
        return processTemplate(content, context);
      }

      // Handle (eq a b) comparisons
      const eqMatch = trimmedCondition.match(/\(eq\s+(\w+)\s+"([^"]+)"\)/);
      if (eqMatch) {
        const [, key, value] = eqMatch;
        if (context[key] === value) {
          return processTemplate(content, context);
        }
      }

      return "";
    }
  );

  // Handle {{else if condition}} within if blocks
  result = result.replace(
    /\{\{#if\s+(.*?)\}\}([\s\S]*?)\{\{else if\s+(.*?)\}\}([\s\S]*?)\{\{else\}\}([\s\S]*?)\{\{\/if\}\}/g,
    (_match, cond1, content1, cond2, content2, elseContent) => {
      const condition1 = evaluateCondition(cond1.trim(), context);
      if (condition1) {
        return processTemplate(content1, context);
      }

      const condition2 = evaluateCondition(cond2.trim(), context);
      if (condition2) {
        return processTemplate(content2, context);
      }

      return processTemplate(elseContent, context);
    }
  );

  // Handle simple {{#if condition}}...{{else}}...{{/if}} blocks
  result = result.replace(
    /\{\{#if\s+(.*?)\}\}([\s\S]*?)\{\{else\}\}([\s\S]*?)\{\{\/if\}\}/g,
    (_match, condition, ifContent, elseContent) => {
      const trimmedCondition = condition.trim();
      if (evaluateCondition(trimmedCondition, context)) {
        return processTemplate(ifContent, context);
      }
      return processTemplate(elseContent, context);
    }
  );

  // Handle {{#ifAny}} blocks
  result = result.replace(
    /\{\{#ifAny\s+(.*?)\}\}([\s\S]*?)\{\{\/ifAny\}\}/g,
    (_match, conditions, content) => {
      const conditionList = conditions.split(/\s+/).filter((c: string) => c);
      const anyTrue = conditionList.some((cond: string) => evaluateCondition(cond, context));
      return anyTrue ? processTemplate(content, context) : "";
    }
  );

  // Handle {{#unless}} blocks
  result = result.replace(
    /\{\{#unless\s+(.*?)\}\}([\s\S]*?)\{\{\/unless\}\}/g,
    (_match, condition, content) => {
      const trimmedCondition = condition.trim();
      if (!context[trimmedCondition]) {
        return processTemplate(content, context);
      }
      return "";
    }
  );

  // Handle {{else}} for final if blocks
  result = result.replace(/\{\{else\}\}/g, "");

  // Clean up any remaining unmatched tags
  result = result.replace(/\{\{[#/].*?\}\}/g, "");

  return result;
}

/**
 * Evaluate a condition with context
 * @param condition - The condition string to evaluate
 * @param context - Context object for variable lookup
 * @returns True if condition evaluates to true
 */
function evaluateCondition(condition: string, context: TemplateContext): boolean {
  // Simple boolean check
  if (context[condition] !== undefined) {
    return !!context[condition];
  }

  // Handle (eq a b) comparisons
  const eqMatch = condition.match(/\(eq\s+(\w+)\s+"([^"]+)"\)/);
  if (eqMatch) {
    const [, key, value] = eqMatch;
    return context[key] === value;
  }

  // Handle (and condition1 condition2)
  const andMatch = condition.match(/\(and\s+(.*?)\s+(.*?)\)/);
  if (andMatch) {
    const [, cond1, cond2] = andMatch;
    return evaluateCondition(cond1, context) && evaluateCondition(cond2, context);
  }

  return false;
}

/**
 * Get template file content (simulated for now)
 * @param templatePath - Path to the template file
 * @returns Template content as string
 */
export function getTemplateContent(templatePath: string): string {
  // This is a simplified version - in reality, you'd read from the actual template files
  const templates: Record<string, string> = {
    ".gitignore": `# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

node_modules
dist
dist-ssr
*.local

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?

# Environment files
.env
.env.local
.env.*.local

# TypeScript
*.tsbuildinfo

# Testing
coverage
.nyc_output

# Misc
.DS_Store
.vite`,
    "main.tsx": `import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App{{#if typescript}}.tsx{{else}}.jsx{{/if}}'
{{#if (eq styling "css")}}import './index.css'{{/if}}
{{#if (eq styling "scss")}}import './index.scss'{{/if}}
{{#if (eq styling "tailwind")}}import './index.css'{{/if}}

ReactDOM.createRoot(document.getElementById('root'){{#if typescript}}!{{/if}}).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)`,
    "App.tsx": `{{#if typescript}}import { useState } from 'react'{{else}}import { useState } from 'react'{{/if}}
{{#if (eq styling "tailwind")}}
function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="text-center">
          <h1 className="text-5xl sm:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 mb-4">
            {{name}}
          </h1>
          <p className="text-xl text-gray-300 mb-12">
            Modern web app powered by React + Vite + Tailwind CSS
          </p>
        </div>
      </div>
    </div>
  )
}
{{else}}
function App() {
  return (
    <div className="App">
      <h1>{{name}}</h1>
      <p>Welcome to your React app!</p>
    </div>
  )
}
{{/if}}

export default App`,
    "index.html": `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>{{name}}</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.{{#if typescript}}tsx{{else}}jsx{{/if}}"></script>
  </body>
</html>`,
    "main.ts": `import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));`,
    "app.component.ts": `import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HelloWorldComponent } from './components/hello-world/hello-world.component';
import { CounterComponent } from './components/counter/counter.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, HelloWorldComponent, CounterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = '{{name}}';
}`,
    "app.component.html": `<div{{#if (eq styling "tailwind")}} class="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8"{{else}} class="app-container"{{/if}}>
  <div{{#if (eq styling "tailwind")}} class="max-w-7xl mx-auto"{{else}} class="container"{{/if}}>
    <header{{#if (eq styling "tailwind")}} class="text-center mb-12"{{else}} class="header"{{/if}}>
      <h1{{#if (eq styling "tailwind")}} class="text-4xl font-bold text-gray-900 mb-4"{{/if}}>Welcome to {{ title }}</h1>
      <p{{#if (eq styling "tailwind")}} class="text-lg text-gray-600"{{else}} class="subtitle"{{/if}}>An Angular project with {{styling}}</p>
    </header>

    <main{{#if (eq styling "tailwind")}} class="grid grid-cols-1 md:grid-cols-2 gap-8"{{else}} class="main-content"{{/if}}>
      <app-counter></app-counter>
      <app-hello-world [message]="'Hello from Angular!'"></app-hello-world>
    </main>
  </div>
</div>`,
    "App.vue": `<script setup{{#if typescript}} lang="ts"{{/if}}>
import { ref } from 'vue'
import HelloWorld from './components/HelloWorld.vue'
import Counter from './components/Counter.vue'

const projectName = '{{name}}'
</script>

<template>
  <div{{#if (eq styling "tailwind")}} class="min-h-screen bg-gradient-to-br from-green-50 to-teal-100"{{/if}}>
    <div{{#if (eq styling "tailwind")}} class="max-w-4xl mx-auto px-4 py-16"{{else}} class="container"{{/if}}>
      <header{{#if (eq styling "tailwind")}} class="text-center mb-12"{{/if}}>
        <h1{{#if (eq styling "tailwind")}} class="text-5xl font-bold text-gray-800 mb-4"{{/if}}>{{ projectName }}</h1>
        <p{{#if (eq styling "tailwind")}} class="text-xl text-gray-600"{{/if}}>Vue + Vite{{#if (eq styling "tailwind")}} + Tailwind CSS{{/if}}</p>
      </header>
      
      <main{{#if (eq styling "tailwind")}} class="space-y-8"{{/if}}>
        <HelloWorld msg="Welcome to your Vue app!" />
        <Counter />
      </main>
    </div>
  </div>
</template>{{#unless (eq styling "tailwind")}}

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}
</style>{{/unless}}`,
    "main.vue": `import { createApp } from 'vue'
import App from './App.vue'
{{#if (eq styling "css")}}import './style.css'{{/if}}
{{#if (eq styling "tailwind")}}import './style.css'{{/if}}

createApp(App).mount('#app')`,
    "page.tsx": `{{#if typescript}}export default function Home() {{{else}}export default function Home() {{{/if}}
  return (
    <main{{#if (eq styling "tailwind")}} className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100"{{/if}}>
      <div{{#if (eq styling "tailwind")}} className="max-w-6xl mx-auto px-4 py-16 sm:px-6 lg:px-8"{{else}} className="container"{{/if}}>
        <h1{{#if (eq styling "tailwind")}} className="text-6xl font-bold text-center text-gray-900 mb-8"{{/if}}>
          Welcome to {{name}}
        </h1>
        <p{{#if (eq styling "tailwind")}} className="text-xl text-center text-gray-600 mb-12"{{/if}}>
          Get started by editing app/page.{{#if typescript}}tsx{{else}}jsx{{/if}}
        </p>
      </div>
    </main>
  )
}`,
    "layout.tsx": `{{#if typescript}}export default function RootLayout({ children }: { children: React.ReactNode }) {{{else}}export default function RootLayout({ children }) {{{/if}}
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  )
}`,
    "+page.svelte": `<script{{#if typescript}} lang="ts"{{/if}}>
  import Counter from '$lib/Counter.svelte'
  import Hello from '$lib/Hello.svelte'
</script>

<div{{#if (eq styling "tailwind")}} class="min-h-screen bg-gradient-to-br from-orange-50 to-red-100"{{/if}}>
  <div{{#if (eq styling "tailwind")}} class="max-w-4xl mx-auto px-4 py-16"{{else}} class="container"{{/if}}>
    <h1{{#if (eq styling "tailwind")}} class="text-5xl font-bold text-center text-gray-800 mb-8"{{/if}}>{{name}}</h1>
    <p{{#if (eq styling "tailwind")}} class="text-xl text-center text-gray-600 mb-12"{{/if}}>SvelteKit app is running!</p>
    
    <div{{#if (eq styling "tailwind")}} class="space-y-8"{{/if}}>
      <Hello />
      <Counter />
    </div>
  </div>
</div>`,
    "index.astro": `---
import Layout from '../layouts/Layout.astro';
import Card from '../components/Card.astro';
---

<Layout title="{{name}}">
  <main{{#if (eq styling "tailwind")}} class="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100"{{/if}}>
    <div{{#if (eq styling "tailwind")}} class="max-w-6xl mx-auto px-4 py-16"{{else}} class="container"{{/if}}>
      <h1{{#if (eq styling "tailwind")}} class="text-6xl font-bold text-center text-gray-900 mb-8"{{/if}}>Welcome to <span{{#if (eq styling "tailwind")}} class="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600"{{/if}}>{{name}}</span></h1>
      <p{{#if (eq styling "tailwind")}} class="text-xl text-center text-gray-600 mb-12"{{/if}}>To get started, open the directory in your editor and edit <code>src/pages/index.astro</code></p>
    </div>
  </main>
</Layout>`,
    "index.tsx": `import { render } from 'solid-js/web'
import { createSignal } from 'solid-js'
import App from './App'
{{#if (eq styling "css")}}import './index.css'{{/if}}
{{#if (eq styling "tailwind")}}import './index.css'{{/if}}

const root = document.getElementById('root')

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
  throw new Error('Root element not found')
}

render(() => <App />, root{{#if typescript}}!{{/if}})`,
  };

  // Extract filename from path
  const filename = templatePath.split("/").pop() || "";
  const cleanFilename = filename.replace(".hbs", "");

  return templates[cleanFilename] || "";
}

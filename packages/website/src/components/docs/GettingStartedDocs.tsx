import {
  FaRocket,
  FaCode,
  FaDatabase,
  FaShieldAlt,
  FaPaintBrush,
  FaTools,
  FaPlug,
  FaRobot,
} from "react-icons/fa";

import { CodeBlock } from "@/features/common";

/**
 * Getting started documentation component
 */
export function GettingStartedDocs() {
  return (
    <div className="space-y-8">
      <section id="overview" className="comic-panel p-6">
        <div className="flex items-center gap-3 mb-4">
          <FaRocket className="text-2xl text-comic-blue" />
          <h2 className="font-comic text-2xl text-comic-blue mb-0">Overview</h2>
        </div>
        <p className="font-comic mb-4">
          PRECAST is a powerful CLI tool that helps you scaffold modern web applications with your
          preferred technology stack. It&apos;s designed to save you time and ensure best practices
          from the start.
        </p>
        <div className="bg-comic-yellow/20 p-4 rounded-lg border-2 border-comic-black">
          <div className="flex items-center gap-2 mb-3">
            <FaCode className="text-comic-yellow" />
            <p className="font-comic font-bold mb-0">Key Features</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div className="flex items-start gap-2">
              <FaCode className="text-comic-blue mt-0.5 flex-shrink-0" />
              <div>
                <strong>Frontend Frameworks:</strong> React, Vue, Next.js, Svelte, Angular, Astro,
                Vite
              </div>
            </div>
            <div className="flex items-start gap-2">
              <FaDatabase className="text-comic-green mt-0.5 flex-shrink-0" />
              <div>
                <strong>Backend Options:</strong> Express, Hono, NestJS, Fastify, Next.js API
              </div>
            </div>
            <div className="flex items-start gap-2">
              <FaDatabase className="text-comic-purple mt-0.5 flex-shrink-0" />
              <div>
                <strong>Databases:</strong> PostgreSQL, MySQL, MongoDB, SQLite
              </div>
            </div>
            <div className="flex items-start gap-2">
              <FaShieldAlt className="text-comic-red mt-0.5 flex-shrink-0" />
              <div>
                <strong>Authentication:</strong> Better Auth, NextAuth, Clerk
              </div>
            </div>
            <div className="flex items-start gap-2">
              <FaPaintBrush className="text-comic-orange mt-0.5 flex-shrink-0" />
              <div>
                <strong>UI Libraries:</strong> shadcn/ui, DaisyUI, Material UI
              </div>
            </div>
            <div className="flex items-start gap-2">
              <FaTools className="text-comic-gray mt-0.5 flex-shrink-0" />
              <div>
                <strong>Tooling:</strong> TypeScript, ESLint, Prettier, Docker, Git
              </div>
            </div>
            <div className="flex items-start gap-2">
              <FaPlug className="text-comic-blue mt-0.5 flex-shrink-0" />
              <div>
                <strong>Plugins:</strong> Stripe, Resend, Sentry, PostHog
              </div>
            </div>
            <div className="flex items-start gap-2">
              <FaRobot className="text-comic-green mt-0.5 flex-shrink-0" />
              <div>
                <strong>AI Integration:</strong> Claude MCP servers, GitHub Copilot
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="requirements" className="comic-panel p-6">
        <div className="flex items-center gap-3 mb-4">
          <FaTools className="text-2xl text-comic-green" />
          <h2 className="font-comic text-2xl text-comic-green mb-0">System Requirements</h2>
        </div>
        <p className="font-comic mb-4">
          Before you begin, ensure your system meets these requirements:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-comic-green/10 p-4 rounded-lg border border-comic-green">
            <div className="flex items-center gap-2 mb-2">
              <FaTools className="text-comic-green" />
              <h3 className="font-comic font-bold text-comic-green mb-0">Minimum Requirements</h3>
            </div>
            <CodeBlock
              code={`Node.js >= 18.0.0
npm >= 8.0.0 (or yarn, pnpm, bun)
4GB RAM
2GB free disk space`}
              language="text"
            />
          </div>
          <div className="bg-comic-blue/10 p-4 rounded-lg border border-comic-blue">
            <div className="flex items-center gap-2 mb-2">
              <FaRocket className="text-comic-blue" />
              <h3 className="font-comic font-bold text-comic-blue mb-0">Recommended</h3>
            </div>
            <CodeBlock
              code={`Node.js >= 20.0.0
Bun >= 1.0.0 (fastest)
8GB RAM
5GB free disk space
Git >= 2.0.0`}
              language="text"
            />
          </div>
        </div>
      </section>

      <section id="quick-start" className="comic-panel p-6">
        <div className="flex items-center gap-3 mb-4">
          <FaRocket className="text-2xl text-comic-purple" />
          <h2 className="font-comic text-2xl text-comic-purple mb-0">Quick Start Guide</h2>
        </div>
        <p className="font-comic mb-4">Get up and running with PRECAST in just a few minutes:</p>

        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <div className="action-text text-3xl text-comic-red">1</div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <FaRocket className="text-comic-red" />
                <h3 className="font-comic text-xl text-comic-black mb-0">Run the CLI</h3>
              </div>
              <p className="font-comic mb-3 text-sm">
                Use your preferred package manager to create a new project:
              </p>
              <div className="space-y-2">
                <CodeBlock code="$ npx create-precast-app@latest my-awesome-app" />
                <CodeBlock code="$ bun create precast-app@latest my-awesome-app" />
                <CodeBlock code="$ pnpm create precast-app@latest my-awesome-app" />
              </div>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="action-text text-3xl text-comic-blue">2</div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <FaTools className="text-comic-blue" />
                <h3 className="font-comic text-xl text-comic-black mb-0">Configure Your Stack</h3>
              </div>
              <p className="font-comic mb-3">
                PRECAST will guide you through an interactive setup process:
              </p>
              <div className="bg-comic-blue/10 p-4 rounded-lg border border-comic-blue">
                <ul className="list-disc list-inside font-comic space-y-1 text-sm">
                  <li>
                    <strong>Framework:</strong> Choose from React, Vue, Next.js, Svelte, Angular,
                    and more
                  </li>
                  <li>
                    <strong>Backend:</strong> Select Express, Hono, NestJS, or go frontend-only
                  </li>
                  <li>
                    <strong>Database:</strong> Pick PostgreSQL, MySQL, MongoDB, or serverless
                    options
                  </li>
                  <li>
                    <strong>Authentication:</strong> Add Better Auth, NextAuth, Clerk, or skip
                  </li>
                  <li>
                    <strong>Styling:</strong> Choose Tailwind CSS, CSS, SCSS, or styled-components
                  </li>
                  <li>
                    <strong>UI Library:</strong> Optional shadcn/ui, DaisyUI, Material UI
                    integration
                  </li>
                  <li>
                    <strong>Features:</strong> Enable TypeScript, Docker, ESLint, Prettier, Git
                  </li>
                  <li>
                    <strong>Plugins:</strong> Add Stripe payments, email services, and more
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="action-text text-3xl text-comic-green">3</div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <FaCode className="text-comic-green" />
                <h3 className="font-comic text-xl text-comic-black mb-0">Start Building</h3>
              </div>
              <p className="font-comic mb-3">Navigate to your project and start development:</p>
              <CodeBlock
                code={`$ cd my-awesome-app
$ bun install  # or npm install
$ bun dev      # or npm run dev`}
              />
              <div className="mt-3 bg-comic-green/10 p-3 rounded-lg border border-comic-green">
                <div className="flex items-start gap-2">
                  <FaRocket className="text-comic-green mt-0.5 flex-shrink-0" />
                  <p className="font-comic text-sm mb-0">
                    <strong>Pro Tip:</strong> Your project comes pre-configured with modern tooling,
                    linting, formatting, and hot reload for the best development experience.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="cli-options" className="comic-panel p-6">
        <div className="flex items-center gap-3 mb-4">
          <FaTools className="text-2xl text-comic-orange" />
          <h2 className="font-comic text-2xl text-comic-orange mb-0">CLI Options & Flags</h2>
        </div>
        <p className="font-comic mb-4">
          Speed up your workflow with command-line flags to skip the interactive prompts:
        </p>

        <div className="space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <FaRocket className="text-comic-blue" />
              <h3 className="font-comic text-lg font-bold mb-0">Quick Setup Examples</h3>
            </div>
            <div className="space-y-3">
              <div>
                <p className="font-comic text-sm mb-1">
                  <strong>React + TypeScript + Tailwind:</strong>
                </p>
                <CodeBlock code="$ npx create-precast-app@latest my-app --framework react --styling tailwind --typescript --yes" />
              </div>
              <div>
                <p className="font-comic text-sm mb-1">
                  <strong>Full-stack Next.js with PostgreSQL:</strong>
                </p>
                <CodeBlock code="$ npx create-precast-app@latest my-app --framework next --database postgres --orm prisma --auth better-auth --install" />
              </div>
              <div>
                <p className="font-comic text-sm mb-1">
                  <strong>Vue + Express API:</strong>
                </p>
                <CodeBlock code="$ npx create-precast-app@latest my-app --framework vue --backend express --database mongodb --orm mongoose --styling tailwind" />
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-3">
              <FaCode className="text-comic-green" />
              <h3 className="font-comic text-lg font-bold mb-0">Common Flags</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full border border-comic-black bg-comic-white text-sm">
                <thead>
                  <tr className="bg-comic-orange/20">
                    <th className="border border-comic-black p-2 font-comic text-left">Flag</th>
                    <th className="border border-comic-black p-2 font-comic text-left">
                      Description
                    </th>
                    <th className="border border-comic-black p-2 font-comic text-left">Example</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-comic-black p-2 font-mono">--framework</td>
                    <td className="border border-comic-black p-2 font-comic">Frontend framework</td>
                    <td className="border border-comic-black p-2 font-mono text-xs">
                      react, vue, next, svelte
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-comic-black p-2 font-mono">--backend</td>
                    <td className="border border-comic-black p-2 font-comic">Backend framework</td>
                    <td className="border border-comic-black p-2 font-mono text-xs">
                      express, hono, nestjs
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-comic-black p-2 font-mono">--database</td>
                    <td className="border border-comic-black p-2 font-comic">Database choice</td>
                    <td className="border border-comic-black p-2 font-mono text-xs">
                      postgres, mysql, mongodb
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-comic-black p-2 font-mono">--auth</td>
                    <td className="border border-comic-black p-2 font-comic">
                      Authentication provider
                    </td>
                    <td className="border border-comic-black p-2 font-mono text-xs">
                      better-auth, nextauth
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-comic-black p-2 font-mono">--install</td>
                    <td className="border border-comic-black p-2 font-comic">
                      Auto-install dependencies
                    </td>
                    <td className="border border-comic-black p-2 font-mono text-xs">--install</td>
                  </tr>
                  <tr>
                    <td className="border border-comic-black p-2 font-mono">--yes</td>
                    <td className="border border-comic-black p-2 font-comic">
                      Accept all defaults
                    </td>
                    <td className="border border-comic-black p-2 font-mono text-xs">--yes</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      <section id="next-steps" className="comic-panel p-6">
        <div className="flex items-center gap-3 mb-4">
          <FaRocket className="text-2xl text-comic-red" />
          <h2 className="font-comic text-2xl text-comic-red mb-0">What&apos;s Next?</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-comic-red/10 p-4 rounded-lg border border-comic-red">
            <div className="flex items-center gap-2 mb-2">
              <FaCode className="text-comic-red" />
              <h3 className="font-comic font-bold text-comic-red mb-0">Explore the Docs</h3>
            </div>
            <ul className="list-disc list-inside font-comic text-sm space-y-1">
              <li>Learn about CLI commands</li>
              <li>Understand project structure</li>
              <li>Discover advanced features</li>
            </ul>
          </div>
          <div className="bg-comic-purple/10 p-4 rounded-lg border border-comic-purple">
            <div className="flex items-center gap-2 mb-2">
              <FaTools className="text-comic-purple" />
              <h3 className="font-comic font-bold text-comic-purple mb-0">Customize Your Setup</h3>
            </div>
            <ul className="list-disc list-inside font-comic text-sm space-y-1">
              <li>Add authentication flows</li>
              <li>Configure database schemas</li>
              <li>Set up deployment pipelines</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}

import {
  FaRocket,
  FaCode,
  FaDatabase,
  FaShieldAlt,
  FaPaintBrush,
  FaTools,
  FaPlug,
  FaRobot,
  FaCheckCircle,
  FaTerminal,
} from "react-icons/fa";

import { CodeBlock } from "@/features/common";

/**
 * Getting started documentation component with professional styling
 */
export function GettingStartedDocs() {
  return (
    <div className="space-y-8">
      {/* Overview Section */}
      <section id="overview" className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="flex items-center gap-3 mb-6">
          <FaRocket className="text-2xl text-blue-600" />
          <h2
            className="text-3xl font-semibold text-gray-900 mb-0"
            style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
          >
            Overview
          </h2>
        </div>
        <p
          className="text-gray-700 leading-relaxed mb-6"
          style={{ fontSize: "16px", lineHeight: "1.7" }}
        >
          PRECAST is a powerful CLI tool that helps you scaffold modern web applications with your
          preferred technology stack. It&apos;s designed to save you time and ensure best practices
          from the start.
        </p>
        <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg">
          <div className="flex items-center gap-2 mb-4">
            <FaCode className="text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900 mb-0">Key Features</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-start gap-3">
              <FaCode className="text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <strong className="text-gray-900">Frontend Frameworks:</strong>
                <span className="text-gray-700">
                  {" "}
                  React, Vue, Next.js, Svelte, Angular, Astro, Vite
                </span>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <FaDatabase className="text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <strong className="text-gray-900">Backend Options:</strong>
                <span className="text-gray-700"> Express, Hono, NestJS, Fastify, Next.js API</span>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <FaDatabase className="text-purple-600 mt-0.5 flex-shrink-0" />
              <div>
                <strong className="text-gray-900">Databases:</strong>
                <span className="text-gray-700"> PostgreSQL, MySQL, MongoDB, Cloudflare D1</span>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <FaShieldAlt className="text-red-600 mt-0.5 flex-shrink-0" />
              <div>
                <strong className="text-gray-900">Authentication:</strong>
                <span className="text-gray-700"> Better Auth, NextAuth, Clerk</span>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <FaPaintBrush className="text-orange-600 mt-0.5 flex-shrink-0" />
              <div>
                <strong className="text-gray-900">UI Libraries:</strong>
                <span className="text-gray-700"> shadcn/ui, DaisyUI, Material UI</span>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <FaTools className="text-gray-600 mt-0.5 flex-shrink-0" />
              <div>
                <strong className="text-gray-900">Tooling:</strong>
                <span className="text-gray-700"> TypeScript, ESLint, Prettier, Docker, Git</span>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <FaPlug className="text-indigo-600 mt-0.5 flex-shrink-0" />
              <div>
                <strong className="text-gray-900">Plugins:</strong>
                <span className="text-gray-700"> Stripe, Resend, Sentry, PostHog</span>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <FaRobot className="text-teal-600 mt-0.5 flex-shrink-0" />
              <div>
                <strong className="text-gray-900">AI Integration:</strong>
                <span className="text-gray-700"> Claude MCP servers, GitHub Copilot</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* System Requirements Section */}
      <section
        id="requirements"
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-8"
      >
        <div className="flex items-center gap-3 mb-6">
          <FaTools className="text-2xl text-green-600" />
          <h2
            className="text-3xl font-semibold text-gray-900 mb-0"
            style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
          >
            System Requirements
          </h2>
        </div>
        <p
          className="text-gray-700 leading-relaxed mb-6"
          style={{ fontSize: "16px", lineHeight: "1.7" }}
        >
          Before you begin, ensure your system meets these requirements:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-green-50 border border-green-200 p-6 rounded-lg">
            <div className="flex items-center gap-2 mb-4">
              <FaTools className="text-green-600" />
              <h3 className="text-lg font-semibold text-gray-900 mb-0">Minimum Requirements</h3>
            </div>
            <div className="bg-white rounded p-4 border border-gray-200">
              <CodeBlock
                code={`Node.js >= 18.0.0
npm >= 8.0.0 (or yarn, pnpm, bun)
4GB RAM
2GB free disk space`}
              />
            </div>
          </div>
          <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg">
            <div className="flex items-center gap-2 mb-4">
              <FaRocket className="text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900 mb-0">Recommended</h3>
            </div>
            <div className="bg-white rounded p-4 border border-gray-200">
              <CodeBlock
                code={`Node.js >= 20.0.0
Bun >= 1.0.0 (fastest)
8GB RAM
5GB free disk space
Git >= 2.0.0`}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Quick Start Guide Section */}
      <section
        id="quick-start"
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-8"
      >
        <div className="flex items-center gap-3 mb-6">
          <FaRocket className="text-2xl text-purple-600" />
          <h2
            className="text-3xl font-semibold text-gray-900 mb-0"
            style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
          >
            Quick Start Guide
          </h2>
        </div>
        <p
          className="text-gray-700 leading-relaxed mb-6"
          style={{ fontSize: "16px", lineHeight: "1.7" }}
        >
          Get up and running with PRECAST in just a few minutes:
        </p>

        <div className="space-y-6">
          {/* Step 1 */}
          <div className="flex items-start gap-4">
            <div className="bg-purple-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">
              1
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Create Your Project</h3>
              <p className="text-gray-700 mb-3">Run the PRECAST CLI to create a new project:</p>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <CodeBlock code="bunx create-precast-app@latest my-awesome-app" />
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex items-start gap-4">
            <div className="bg-purple-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">
              2
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Choose Your Stack</h3>
              <p className="text-gray-700 mb-3">
                Follow the interactive prompts to select your preferred technologies:
              </p>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <CodeBlock
                  code={`✓ Framework: React
✓ Backend: Express
✓ Database: PostgreSQL
✓ ORM: Prisma
✓ Styling: Tailwind CSS
✓ UI Library: shadcn/ui
✓ Authentication: Better Auth`}
                />
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex items-start gap-4">
            <div className="bg-purple-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">
              3
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Start Development</h3>
              <p className="text-gray-700 mb-3">
                Navigate to your project and start the development server:
              </p>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <CodeBlock
                  code={`cd my-awesome-app
bun install
bun run dev`}
                />
              </div>
            </div>
          </div>

          {/* Step 4 */}
          <div className="flex items-start gap-4">
            <div className="bg-purple-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">
              4
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Build & Deploy</h3>
              <p className="text-gray-700 mb-3">When ready, build your project for production:</p>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <CodeBlock code="bun run build" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Advanced Options Section */}
      <section
        id="advanced-options"
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-8"
      >
        <div className="flex items-center gap-3 mb-6">
          <FaTerminal className="text-2xl text-indigo-600" />
          <h2
            className="text-3xl font-semibold text-gray-900 mb-0"
            style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
          >
            Advanced Options
          </h2>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Skip Interactive Mode</h3>
            <p className="text-gray-700 mb-3">
              Use command-line flags to skip prompts and create projects quickly:
            </p>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <CodeBlock code="bunx create-precast-app@latest my-app --framework react --backend express --database postgres --orm prisma --auth better-auth --install" />
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Docker Support</h3>
            <p className="text-gray-700 mb-3">
              Add Docker configuration for containerized development:
            </p>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <CodeBlock code="bunx create-precast-app@latest my-app --docker --auto-deploy" />
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">AI Integration</h3>
            <p className="text-gray-700 mb-3">
              Include AI assistant context files for better development workflow:
            </p>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <CodeBlock code="bunx create-precast-app@latest my-app --ai claude --mcp-servers postgresql github-official" />
            </div>
          </div>
        </div>
      </section>

      {/* What&apos;s Included Section */}
      <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="flex items-center gap-3 mb-6">
          <FaCheckCircle className="text-2xl text-green-600" />
          <h2
            className="text-3xl font-semibold text-gray-900 mb-0"
            style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
          >
            What&apos;s Included
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Development Tools</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-1">✓</span>
                <span>TypeScript configuration</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-1">✓</span>
                <span>ESLint & Prettier setup</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-1">✓</span>
                <span>Git repository initialization</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-1">✓</span>
                <span>VS Code settings and extensions</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-1">✓</span>
                <span>Hot reload development server</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Production Ready</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-1">✓</span>
                <span>Environment variables setup</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-1">✓</span>
                <span>Docker configuration (optional)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-1">✓</span>
                <span>CI/CD pipeline templates</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-1">✓</span>
                <span>Build optimization</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-1">✓</span>
                <span>Security best practices</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Next Steps Section */}
      <section className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 p-8">
        <div className="flex items-center gap-3 mb-6">
          <FaRocket className="text-2xl text-blue-600" />
          <h2 className="text-2xl font-semibold text-gray-900 mb-0">Next Steps</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center gap-3 mb-3">
              <FaTerminal className="text-blue-600 text-xl" />
              <h3 className="font-semibold text-gray-900">CLI Commands</h3>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">
              Learn about all available CLI commands and their options for advanced project
              management.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center gap-3 mb-3">
              <FaCode className="text-green-600 text-xl" />
              <h3 className="font-semibold text-gray-900">Examples</h3>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">
              Explore real-world examples and templates to understand best practices and patterns.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center gap-3 mb-3">
              <FaTools className="text-purple-600 text-xl" />
              <h3 className="font-semibold text-gray-900">Customization</h3>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">
              Learn how to customize and extend your generated projects with additional features.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

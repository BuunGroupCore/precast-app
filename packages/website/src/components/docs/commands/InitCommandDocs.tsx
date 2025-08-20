import {
  FaRocket,
  FaCode,
  FaTerminal,
  FaPlug,
  FaRobot,
  FaMobile,
  FaShieldAlt,
  FaCog,
  FaLightbulb,
  FaCheckCircle,
  FaPaintBrush,
} from "react-icons/fa";

import { CodeBlock } from "@/features/common";
import { generateCliOptions } from "@/utils/cliOptionsGenerator";

/**
 * Documentation for the init command
 */
export function InitCommandDocs() {
  const options = generateCliOptions();

  return (
    <div className="space-y-8">
      {/* Overview Section */}
      <section
        id="init-overview"
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-8"
      >
        <div className="flex items-center gap-3 mb-6">
          <FaRocket className="text-2xl text-blue-600" />
          <h2
            className="text-3xl font-semibold text-gray-900 mb-0"
            style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
          >
            init Command
          </h2>
        </div>

        <div className="space-y-6">
          <p
            className="text-gray-700 leading-relaxed"
            style={{ fontSize: "16px", lineHeight: "1.7" }}
          >
            Create a new PRECAST project with your chosen technology stack. This command scaffolds a
            complete, production-ready application with modern tooling and best practices.
          </p>

          <div className="bg-blue-50 border-l-4 border-blue-500 p-5 rounded-r">
            <div className="flex items-center gap-2 mb-3">
              <FaTerminal className="text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900 mb-0">Basic Usage</h3>
            </div>
            <CodeBlock code="bunx create-precast-app@latest [project-name] [options]" />
          </div>

          <div className="bg-green-50 border-l-4 border-green-500 p-5 rounded-r">
            <div className="flex items-center gap-2 mb-3">
              <FaRocket className="text-green-600" />
              <h3 className="text-lg font-semibold text-gray-900 mb-0">
                Quick Start (Recommended)
              </h3>
            </div>
            <CodeBlock code="bunx create-precast-app@latest my-app --install" />
          </div>

          <div className="bg-purple-50 border-l-4 border-purple-500 p-5 rounded-r">
            <div className="flex items-center gap-2 mb-3">
              <FaPaintBrush className="text-purple-600" />
              <h3 className="text-lg font-semibold text-gray-900 mb-0">
                Visual Builder Alternative
              </h3>
            </div>
            <p className="text-gray-700 text-sm mb-3">
              Prefer a visual interface? Use our web-based builder instead of the CLI for a guided
              experience.
            </p>
            <CodeBlock code="Visit: https://precast.app/builder" />
          </div>
        </div>
      </section>

      {/* Options Section */}
      <section
        id="init-options"
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-8"
      >
        <div className="flex items-center gap-3 mb-6">
          <FaCog className="text-2xl text-purple-600" />
          <h3 className="text-2xl font-semibold text-gray-900 mb-0">Configuration Options</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left p-4 font-semibold text-gray-900">Option</th>
                <th className="text-left p-4 font-semibold text-gray-900">Available Values</th>
                <th className="text-left p-4 font-semibold text-gray-900">Description</th>
              </tr>
            </thead>
            <tbody>
              {options.map((option, index) => (
                <tr
                  key={option.flag}
                  className={`border-b border-gray-100 ${index % 2 === 1 ? "bg-gray-50/50" : ""}`}
                >
                  <td className="p-4">
                    <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">
                      {option.flag}
                    </code>
                  </td>
                  <td className="p-4 text-gray-700 text-sm">{option.values}</td>
                  <td className="p-4 text-gray-700 text-sm">{option.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-lg p-5 border border-blue-200">
            <div className="flex items-center gap-2 mb-3">
              <FaRobot className="text-blue-600" />
              <h4 className="font-semibold text-gray-900">AI Integration</h4>
            </div>
            <p className="text-sm text-gray-700">
              Add <code className="bg-blue-100 px-1.5 py-0.5 rounded text-xs">--ai claude</code> to
              include AI assistant files like CLAUDE.md and context files
            </p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100/50 rounded-lg p-5 border border-green-200">
            <div className="flex items-center gap-2 mb-3">
              <FaPlug className="text-green-600" />
              <h4 className="font-semibold text-gray-900">Auto Install</h4>
            </div>
            <p className="text-sm text-gray-700">
              Use <code className="bg-green-100 px-1.5 py-0.5 rounded text-xs">--install</code> to
              automatically install dependencies after project creation
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-lg p-5 border border-purple-200">
            <div className="flex items-center gap-2 mb-3">
              <FaMobile className="text-purple-600" />
              <h4 className="font-semibold text-gray-900">Platform Support</h4>
            </div>
            <p className="text-sm text-gray-700">
              Set <code className="bg-purple-100 px-1.5 py-0.5 rounded text-xs">--platform</code> to
              web, mobile, or desktop for specialized setups
            </p>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-orange-100/50 rounded-lg p-5 border border-orange-200">
            <div className="flex items-center gap-2 mb-3">
              <FaShieldAlt className="text-orange-600" />
              <h4 className="font-semibold text-gray-900">Authentication</h4>
            </div>
            <p className="text-sm text-gray-700">
              Choose from multiple auth providers with{" "}
              <code className="bg-orange-100 px-1.5 py-0.5 rounded text-xs">--auth</code>
            </p>
          </div>
        </div>
      </section>

      {/* Examples Section */}
      <section
        id="init-examples"
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-8"
      >
        <div className="flex items-center gap-3 mb-6">
          <FaTerminal className="text-2xl text-indigo-600" />
          <h3 className="text-2xl font-semibold text-gray-900 mb-0">Examples</h3>
        </div>

        <div className="space-y-6">
          <div>
            <p className="text-gray-700 mb-3 font-medium">
              Interactive Mode (Recommended for beginners):
            </p>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <CodeBlock code="bunx create-precast-app@latest" />
            </div>
            <p className="text-sm text-gray-600 mt-2 italic">
              Launches an interactive wizard to guide you through all options
            </p>
          </div>

          <div>
            <p className="text-gray-700 mb-3 font-medium">React + Express + PostgreSQL Stack:</p>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <CodeBlock code="bunx create-precast-app@latest my-app --framework react --backend express --database postgres --orm prisma --install" />
            </div>
          </div>

          <div>
            <p className="text-gray-700 mb-3 font-medium">Next.js Full-Stack with Tailwind:</p>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <CodeBlock code="bunx create-precast-app@latest my-nextjs-app --framework next --styling tailwind --ui-library shadcn --auth better-auth --install" />
            </div>
          </div>

          <div>
            <p className="text-gray-700 mb-3 font-medium">Vue + Fastify API:</p>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <CodeBlock code="bunx create-precast-app@latest vue-project --framework vue --backend fastify --api-client tanstack-query --install" />
            </div>
          </div>

          <div>
            <p className="text-gray-700 mb-3 font-medium">Minimal Setup (Frontend Only):</p>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <CodeBlock code="bunx create-precast-app@latest simple-app --framework react --backend none --database none" />
            </div>
          </div>

          <div>
            <p className="text-gray-700 mb-3 font-medium">Mobile App with React Native:</p>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <CodeBlock code="bunx create-precast-app@latest mobile-app --framework react --backend express" />
            </div>
          </div>
        </div>
      </section>

      {/* Project Structure Section */}
      <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="flex items-center gap-3 mb-6">
          <FaCode className="text-2xl text-teal-600" />
          <h3 className="text-2xl font-semibold text-gray-900 mb-0">Generated Project Structure</h3>
        </div>

        <div className="space-y-6">
          <p className="text-gray-700 leading-relaxed">
            The init command creates a well-organized project structure based on your selections:
          </p>

          <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
            <CodeBlock
              code={`# Single App Structure (default)
my-app/
├── src/                    # Application source code
│   ├── components/         # React/Vue/Angular components
│   ├── pages/             # Page components or routes
│   ├── styles/            # Global styles and themes
│   ├── utils/             # Utility functions
│   └── App.tsx            # Main application component
├── prisma/                # Database schema (if Prisma selected)
├── public/                # Static assets
├── .env.example           # Environment variables template
├── package.json          # Dependencies and scripts
└── tsconfig.json         # TypeScript configuration

# Monorepo Structure (with backend)
my-app/
├── apps/
│   ├── web/               # Frontend application
│   │   ├── src/
│   │   ├── public/
│   │   └── package.json
│   └── api/               # Backend application
│       ├── src/
│       └── package.json
├── packages/
│   └── shared/            # Shared utilities and types
├── prisma/                # Database schema
├── package.json          # Workspace configuration
└── turbo.json            # Turbo configuration`}
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="flex items-center gap-3 mb-6">
          <FaCheckCircle className="text-2xl text-green-600" />
          <h3 className="text-2xl font-semibold text-gray-900 mb-0">What&apos;s Included</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Development Tools</h4>
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
                <span>VS Code settings</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Production Ready</h4>
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
            </ul>
          </div>
        </div>
      </section>

      {/* Tips Section */}
      <section className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 p-8">
        <div className="flex items-center gap-3 mb-4">
          <FaLightbulb className="text-xl text-blue-600" />
          <h3 className="text-xl font-semibold text-gray-900">Pro Tips</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">•</span>
              <span>Use Bun for 10x faster installation speed</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">•</span>
              <span>Run without arguments for interactive mode</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">•</span>
              <span>The --install flag saves time by auto-installing deps</span>
            </li>
          </ul>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">•</span>
              <span>Choose &quot;monorepo&quot; for full-stack projects</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">•</span>
              <span>Add --ai flag for AI assistant documentation</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">•</span>
              <span>Review precast.jsonc after creation</span>
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
}

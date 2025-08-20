import {
  FaGithub,
  FaCode,
  FaBug,
  FaLightbulb,
  FaHandsHelping,
  FaRocket,
  FaBook,
  FaUsers,
  FaCheckCircle,
  FaExternalLinkAlt,
  FaTerminal,
  FaCodeBranch,
  FaHeart,
} from "react-icons/fa";

import { CodeBlock } from "@/features/common";

/**
 * Documentation for contributing to PRECAST with professional styling
 */
export function ContributingDocs() {
  return (
    <div className="space-y-8">
      {/* Header Section */}
      <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="flex items-center gap-3 mb-6">
          <FaHandsHelping className="text-3xl text-purple-600" />
          <h1
            className="text-3xl font-semibold text-gray-900 mb-0"
            style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
          >
            Contributing to PRECAST
          </h1>
        </div>

        <div className="mb-6">
          <p
            className="text-gray-700 leading-relaxed mb-4"
            style={{ fontSize: "16px", lineHeight: "1.7" }}
          >
            Welcome to the PRECAST community! We&apos;re excited to have you contribute to making
            web development more accessible and enjoyable. This guide will help you get started with
            contributing to our open-source project.
          </p>

          <div className="bg-purple-50 border border-purple-200 p-6 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <FaHeart className="text-purple-600" />
              <h3 className="text-lg font-semibold text-gray-900 mb-0">Why Contribute?</h3>
            </div>
            <ul className="text-sm text-gray-700 space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-purple-600 mt-1">•</span>
                <span>Help developers worldwide build better applications faster</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600 mt-1">•</span>
                <span>Learn from experienced maintainers and community members</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600 mt-1">•</span>
                <span>Build your portfolio with meaningful open-source contributions</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600 mt-1">•</span>
                <span>Shape the future of modern web development tooling</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Ways to Contribute Section */}
      <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="flex items-center gap-3 mb-6">
          <FaCode className="text-2xl text-blue-600" />
          <h2
            className="text-2xl font-semibold text-gray-900 mb-0"
            style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
          >
            Ways to Contribute
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <FaRocket className="text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900 mb-0">New Features</h3>
            </div>
            <ul className="text-sm text-gray-700 space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Add framework support (Angular, Nuxt, etc.)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Create new project templates</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Build UI components for the builder</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Enhance CLI commands and options</span>
              </li>
            </ul>
          </div>

          <div className="bg-green-50 border border-green-200 p-6 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <FaBug className="text-green-600" />
              <h3 className="text-lg font-semibold text-gray-900 mb-0">Bug Fixes</h3>
            </div>
            <ul className="text-sm text-gray-700 space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-1">•</span>
                <span>Fix reported issues from GitHub</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-1">•</span>
                <span>Improve error handling and messages</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-1">•</span>
                <span>Resolve edge cases and compatibility issues</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-1">•</span>
                <span>Update and maintain dependencies</span>
              </li>
            </ul>
          </div>

          <div className="bg-purple-50 border border-purple-200 p-6 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <FaBook className="text-purple-600" />
              <h3 className="text-lg font-semibold text-gray-900 mb-0">Documentation</h3>
            </div>
            <ul className="text-sm text-gray-700 space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-purple-600 mt-1">•</span>
                <span>Write comprehensive guides and tutorials</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600 mt-1">•</span>
                <span>Improve existing documentation clarity</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600 mt-1">•</span>
                <span>Fix typos and grammatical errors</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600 mt-1">•</span>
                <span>Add translations for international users</span>
              </li>
            </ul>
          </div>

          <div className="bg-orange-50 border border-orange-200 p-6 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <FaCheckCircle className="text-orange-600" />
              <h3 className="text-lg font-semibold text-gray-900 mb-0">Testing & QA</h3>
            </div>
            <ul className="text-sm text-gray-700 space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-orange-600 mt-1">•</span>
                <span>Write comprehensive unit tests</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-600 mt-1">•</span>
                <span>Add end-to-end testing scenarios</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-600 mt-1">•</span>
                <span>Test edge cases and error scenarios</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-600 mt-1">•</span>
                <span>Improve overall test coverage</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Getting Started Section */}
      <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="flex items-center gap-3 mb-6">
          <FaGithub className="text-2xl text-gray-900" />
          <h2
            className="text-2xl font-semibold text-gray-900 mb-0"
            style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
          >
            Getting Started
          </h2>
        </div>

        <div className="space-y-6">
          {/* Step 1: Fork & Clone */}
          <div className="flex items-start gap-4">
            <div className="bg-green-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">
              1
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Fork & Clone Repository</h3>
              <p className="text-gray-700 mb-3">
                Start by forking the repository on GitHub, then clone it locally:
              </p>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <CodeBlock
                  code={`# Fork the repository on GitHub, then:
git clone https://github.com/YOUR_USERNAME/precast-app.git
cd precast-app`}
                />
              </div>
            </div>
          </div>

          {/* Step 2: Install Dependencies */}
          <div className="flex items-start gap-4">
            <div className="bg-green-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">
              2
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Install Dependencies</h3>
              <p className="text-gray-700 mb-3">
                We recommend using Bun for faster installation, but pnpm works too:
              </p>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <CodeBlock
                  code={`# Recommended: Using Bun (fastest)
bun install

# Alternative: Using pnpm
pnpm install`}
                />
              </div>
            </div>
          </div>

          {/* Step 3: Development Setup */}
          <div className="flex items-start gap-4">
            <div className="bg-green-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">
              3
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Setup Development Environment
              </h3>
              <p className="text-gray-700 mb-3">
                Initialize git hooks, build packages, and start development:
              </p>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <CodeBlock
                  code={`# Install git hooks for code quality
node .husky/install.mjs

# Build all packages
bun run build

# Start development mode
bun dev`}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Development Workflow Section */}
      <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="flex items-center gap-3 mb-6">
          <FaCodeBranch className="text-2xl text-indigo-600" />
          <h2
            className="text-2xl font-semibold text-gray-900 mb-0"
            style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
          >
            Development Workflow
          </h2>
        </div>

        <div className="bg-indigo-50 border border-indigo-200 p-6 rounded-lg">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">1. Create Feature Branch</h3>
              <div className="bg-white rounded p-4 border border-gray-200">
                <CodeBlock code="git checkout -b feature/your-feature-name" />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">2. Make Changes & Test</h3>
              <div className="bg-white rounded p-4 border border-gray-200">
                <CodeBlock
                  code={`# Run comprehensive tests
bun test

# Type checking across all packages
bun typecheck

# Lint and format code
bun lint
bun format`}
                />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                3. Commit with Conventional Format
              </h3>
              <div className="bg-white rounded p-4 border border-gray-200">
                <CodeBlock
                  code={`# Examples of good commit messages:
git commit -m &apos;feat(cli): add support for Qwik framework&apos;
git commit -m &apos;fix(website): correct animation timing issues&apos;
git commit -m &apos;docs(readme): update installation instructions&apos;`}
                />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                4. Push & Create Pull Request
              </h3>
              <div className="bg-white rounded p-4 border border-gray-200">
                <CodeBlock
                  code={`git push origin feature/your-feature-name
# Then create a pull request on GitHub with:
# - Clear title and description
# - Link to relevant issues
# - Screenshots/demos if applicable`}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Code Standards Section */}
      <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="flex items-center gap-3 mb-6">
          <FaLightbulb className="text-2xl text-yellow-600" />
          <h2
            className="text-2xl font-semibold text-gray-900 mb-0"
            style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
          >
            Code Standards & Best Practices
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-red-50 border border-red-200 p-6 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <FaCode className="text-red-600" />
              <h3 className="text-lg font-semibold text-gray-900 mb-0">TypeScript Guidelines</h3>
            </div>
            <ul className="text-sm text-gray-700 space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-red-600 mt-1">•</span>
                <span>Use explicit types and interfaces</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 mt-1">•</span>
                <span>Avoid using &apos;any&apos; - use proper typing</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 mt-1">•</span>
                <span>Handle errors with proper try/catch blocks</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 mt-1">•</span>
                <span>Document complex logic with JSDoc comments</span>
              </li>
            </ul>
          </div>

          <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <FaRocket className="text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900 mb-0">React Best Practices</h3>
            </div>
            <ul className="text-sm text-gray-700 space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Use functional components exclusively</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Extract logic into custom hooks</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Properly type all props and state</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Use memoization for performance optimization</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Commit Convention Section */}
      <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="flex items-center gap-3 mb-6">
          <FaTerminal className="text-2xl text-gray-600" />
          <h2
            className="text-2xl font-semibold text-gray-900 mb-0"
            style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
          >
            Commit Convention
          </h2>
        </div>

        <p className="text-gray-700 mb-6">
          We follow conventional commits for clear, semantic commit messages:
        </p>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left p-4 font-semibold text-gray-900">Type</th>
                <th className="text-left p-4 font-semibold text-gray-900">Description</th>
                <th className="text-left p-4 font-semibold text-gray-900">Example</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-100">
                <td className="p-4">
                  <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">feat</code>
                </td>
                <td className="p-4 text-gray-700">New feature or enhancement</td>
                <td className="p-4 text-sm">
                  <code className="text-gray-600">feat(cli): add Qwik framework support</code>
                </td>
              </tr>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <td className="p-4">
                  <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">fix</code>
                </td>
                <td className="p-4 text-gray-700">Bug fix or error correction</td>
                <td className="p-4 text-sm">
                  <code className="text-gray-600">fix(ui): correct button hover state</code>
                </td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="p-4">
                  <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">docs</code>
                </td>
                <td className="p-4 text-gray-700">Documentation updates</td>
                <td className="p-4 text-sm">
                  <code className="text-gray-600">docs: update contributing guidelines</code>
                </td>
              </tr>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <td className="p-4">
                  <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">test</code>
                </td>
                <td className="p-4 text-gray-700">Adding or updating tests</td>
                <td className="p-4 text-sm">
                  <code className="text-gray-600">test: add CLI integration tests</code>
                </td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="p-4">
                  <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">chore</code>
                </td>
                <td className="p-4 text-gray-700">Maintenance and housekeeping</td>
                <td className="p-4 text-sm">
                  <code className="text-gray-600">chore: update dependencies to latest</code>
                </td>
              </tr>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <td className="p-4">
                  <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">refactor</code>
                </td>
                <td className="p-4 text-gray-700">Code refactoring without functional changes</td>
                <td className="p-4 text-sm">
                  <code className="text-gray-600">
                    refactor(core): improve template engine performance
                  </code>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Resources Section */}
      <section className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg border border-purple-200 p-8">
        <div className="flex items-center gap-3 mb-6">
          <FaGithub className="text-2xl text-purple-600" />
          <h2 className="text-2xl font-semibold text-gray-900 mb-0">Helpful Resources</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center gap-3 mb-3">
              <FaGithub className="text-gray-900 text-xl" />
              <h3 className="font-semibold text-gray-900">GitHub Repository</h3>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed mb-3">
              Main repository with source code, issues, and discussions.
            </p>
            <a
              href="https://github.com/BuunGroupCore/precast-app"
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-600 hover:text-purple-800 text-sm font-medium inline-flex items-center gap-1"
            >
              View Repository <FaExternalLinkAlt className="text-xs" />
            </a>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center gap-3 mb-3">
              <FaBug className="text-red-600 text-xl" />
              <h3 className="font-semibold text-gray-900">Report Issues</h3>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed mb-3">
              Found a bug? Report it using our issue template for faster resolution.
            </p>
            <a
              href="https://github.com/BuunGroupCore/precast-app/issues/new?template=bug_report.md"
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-600 hover:text-purple-800 text-sm font-medium inline-flex items-center gap-1"
            >
              Create Bug Report <FaExternalLinkAlt className="text-xs" />
            </a>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center gap-3 mb-3">
              <FaUsers className="text-blue-600 text-xl" />
              <h3 className="font-semibold text-gray-900">Discussions</h3>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed mb-3">
              Join community discussions, ask questions, and share ideas.
            </p>
            <a
              href="https://github.com/BuunGroupCore/precast-app/discussions"
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-600 hover:text-purple-800 text-sm font-medium inline-flex items-center gap-1"
            >
              Join Discussions <FaExternalLinkAlt className="text-xs" />
            </a>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center gap-3 mb-3">
              <FaBook className="text-green-600 text-xl" />
              <h3 className="font-semibold text-gray-900">Developer Docs</h3>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed mb-3">
              Detailed guidelines in CONTRIBUTING.md and AI context files.
            </p>
            <div className="space-y-1">
              <div className="text-purple-600 text-sm">• CONTRIBUTING.md</div>
              <div className="text-purple-600 text-sm">• CLAUDE.md (AI assistant context)</div>
              <div className="text-purple-600 text-sm">• Project architecture documentation</div>
            </div>
          </div>
        </div>
      </section>

      {/* Getting Help Section */}
      <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="flex items-center gap-3 mb-6">
          <FaUsers className="text-2xl text-green-600" />
          <h2
            className="text-2xl font-semibold text-gray-900 mb-0"
            style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
          >
            Getting Help
          </h2>
        </div>

        <div className="space-y-4">
          <p className="text-gray-700 leading-relaxed">
            Stuck on something? Here&apos;s how to get help from our community:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Search First</h3>
              <p className="text-sm text-gray-700">
                Check existing issues and discussions before asking new questions.
              </p>
            </div>

            <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Ask Questions</h3>
              <p className="text-sm text-gray-700">
                Use GitHub Discussions for questions and community support.
              </p>
            </div>

            <div className="bg-purple-50 border border-purple-200 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Report Bugs</h3>
              <p className="text-sm text-gray-700">
                Use our bug report template with reproduction steps and system info.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

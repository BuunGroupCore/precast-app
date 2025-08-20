import {
  FaInfoCircle,
  FaCheckCircle,
  FaCog,
  FaServer,
  FaTerminal,
  FaExclamationTriangle,
} from "react-icons/fa";

import { CodeBlock } from "@/features/common";

/**
 * Documentation for the status command
 */
export function StatusCommandDocs() {
  return (
    <div className="space-y-8">
      {/* Overview Section */}
      <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="flex items-center gap-3 mb-6">
          <FaInfoCircle className="text-2xl text-blue-600" />
          <h2
            className="text-3xl font-semibold text-gray-900 mb-0"
            style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
          >
            status Command
          </h2>
        </div>

        <div className="space-y-6">
          <p
            className="text-gray-700 leading-relaxed"
            style={{ fontSize: "16px", lineHeight: "1.7" }}
          >
            Display comprehensive information about your PRECAST project configuration,
            dependencies, and health status. Perfect for debugging and understanding your project
            setup.
          </p>

          <div className="bg-blue-50 border-l-4 border-blue-500 p-5 rounded-r">
            <div className="flex items-center gap-2 mb-3">
              <FaTerminal className="text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900 mb-0">Basic Usage</h3>
            </div>
            <CodeBlock code="bunx create-precast-app@latest status [path]" />
          </div>
        </div>
      </section>

      {/* Information Displayed Section */}
      <section
        id="status-info"
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-8"
      >
        <div className="flex items-center gap-3 mb-6">
          <FaCheckCircle className="text-2xl text-green-600" />
          <h3 className="text-2xl font-semibold text-gray-900 mb-0">Information Displayed</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-green-50 to-green-100/50 rounded-lg p-5 border border-green-200">
            <h4 className="font-semibold text-gray-900 mb-3">Project Details</h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-1">•</span>
                <span>Project name and version</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-1">•</span>
                <span>Configured framework and backend</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-1">•</span>
                <span>Database and ORM setup</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-1">•</span>
                <span>Authentication provider</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-1">•</span>
                <span>UI library and styling</span>
              </li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-lg p-5 border border-purple-200">
            <h4 className="font-semibold text-gray-900 mb-3">Environment Info</h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-purple-600 mt-1">•</span>
                <span>Node.js version</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600 mt-1">•</span>
                <span>Package manager (npm/yarn/pnpm/bun)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600 mt-1">•</span>
                <span>Installed dependencies</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600 mt-1">•</span>
                <span>Environment variables status</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600 mt-1">•</span>
                <span>Git repository status</span>
              </li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-lg p-5 border border-blue-200">
            <h4 className="font-semibold text-gray-900 mb-3">Health Checks</h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Package.json validation</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Dependencies conflicts</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>TypeScript configuration</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Build tools configuration</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Database connectivity</span>
              </li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-orange-100/50 rounded-lg p-5 border border-orange-200">
            <h4 className="font-semibold text-gray-900 mb-3">Configuration Files</h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-orange-600 mt-1">•</span>
                <span>precast.jsonc presence</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-600 mt-1">•</span>
                <span>.env file detection</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-600 mt-1">•</span>
                <span>Docker configuration</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-600 mt-1">•</span>
                <span>CI/CD pipeline files</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-600 mt-1">•</span>
                <span>Linting and formatting rules</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Command Options Section */}
      <section
        id="status-options"
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-8"
      >
        <div className="flex items-center gap-3 mb-6">
          <FaCog className="text-2xl text-gray-600" />
          <h3 className="text-2xl font-semibold text-gray-900 mb-0">Command Options</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left p-4 font-semibold text-gray-900">Option</th>
                <th className="text-left p-4 font-semibold text-gray-900">Description</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-100">
                <td className="p-4">
                  <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">--debug</code>
                </td>
                <td className="p-4 text-gray-700">Enable debug mode for verbose output</td>
              </tr>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <td className="p-4">
                  <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">path</code>
                </td>
                <td className="p-4 text-gray-700">
                  Path to the project directory (defaults to current directory)
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Examples Section */}
      <section
        id="status-examples"
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-8"
      >
        <div className="flex items-center gap-3 mb-6">
          <FaTerminal className="text-2xl text-indigo-600" />
          <h3 className="text-2xl font-semibold text-gray-900 mb-0">Examples</h3>
        </div>

        <div className="space-y-6">
          <div>
            <p className="text-gray-700 mb-3">Check status of current project:</p>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <CodeBlock code="bunx create-precast-app@latest status" />
            </div>
          </div>

          <div>
            <p className="text-gray-700 mb-3">Check status of a specific project:</p>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <CodeBlock code="bunx create-precast-app@latest status ./my-project" />
            </div>
          </div>

          <div>
            <p className="text-gray-700 mb-3">Enable debug output for detailed information:</p>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <CodeBlock code="bunx create-precast-app@latest status --debug" />
            </div>
          </div>
        </div>
      </section>

      {/* Output Format Section */}
      <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="flex items-center gap-3 mb-6">
          <FaServer className="text-2xl text-teal-600" />
          <h3 className="text-2xl font-semibold text-gray-900 mb-0">Output Format</h3>
        </div>

        <div className="space-y-6">
          <p className="text-gray-700 leading-relaxed">
            The status command provides a clear, organized output showing:
          </p>

          <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
            <CodeBlock
              code={`✅ PRECAST Project Status
─────────────────────────
📦 Project: my-awesome-app (v1.0.0)
🚀 Framework: React
🔧 Backend: Express
💾 Database: PostgreSQL (Prisma ORM)
🔐 Auth: Better Auth
🎨 UI: shadcn/ui with Tailwind CSS

Environment:
• Node: v20.11.0
• Package Manager: bun
• Environment: development

Health Status:
✅ All checks passed
• Dependencies installed
• Configuration valid
• Database connected
• No conflicts detected`}
            />
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-5">
            <div className="flex gap-3">
              <FaExclamationTriangle className="text-amber-600 text-xl flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-amber-900 font-semibold mb-1">Troubleshooting</p>
                <p className="text-amber-700 text-sm">
                  If health checks fail, the command will display specific issues and suggest fixes.
                  Use <code className="bg-amber-100 px-2 py-0.5 rounded">--debug</code> for detailed
                  diagnostic information.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tips Section */}
      <section className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 p-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Pro Tips</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">•</span>
              <span>Run status before deploying to catch configuration issues</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">•</span>
              <span>Use JSON output for automated monitoring</span>
            </li>
          </ul>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">•</span>
              <span>Include status checks in your CI/CD pipeline</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">•</span>
              <span>Share status output when reporting issues</span>
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
}

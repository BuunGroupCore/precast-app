import {
  FaDocker,
  FaRocket,
  FaServer,
  FaCheckCircle,
  FaTerminal,
  FaCog,
  FaGlobe,
} from "react-icons/fa";

import { CodeBlock } from "@/features/common";

/**
 * Documentation for the deploy command
 */
export function DeployCommandDocs() {
  return (
    <div className="space-y-8">
      {/* Overview Section */}
      <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="flex items-center gap-3 mb-6">
          <FaDocker className="text-2xl text-blue-600" />
          <h2
            className="text-3xl font-semibold text-gray-900 mb-0"
            style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
          >
            deploy Command
          </h2>
        </div>

        <div className="space-y-6">
          <p
            className="text-gray-700 leading-relaxed"
            style={{ fontSize: "16px", lineHeight: "1.7" }}
          >
            Manage Docker services for your PRECAST project. Automatically start databases,
            services, and configure ngrok tunnels for local development with secure HTTPS endpoints.
          </p>

          <div className="bg-blue-50 border-l-4 border-blue-500 p-5 rounded-r">
            <div className="flex items-center gap-2 mb-3">
              <FaRocket className="text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900 mb-0">Quick Start</h3>
            </div>
            <CodeBlock code="bunx create-precast-app@latest deploy" />
          </div>

          <div className="bg-green-50 border-l-4 border-green-500 p-5 rounded-r">
            <div className="flex items-center gap-2 mb-3">
              <FaCheckCircle className="text-green-600" />
              <h3 className="text-lg font-semibold text-gray-900 mb-0">Auto-detection</h3>
            </div>
            <p className="text-gray-700 text-sm">
              Automatically detects required services based on your project configuration
            </p>
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section
        id="deploy-features"
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-8"
      >
        <div className="flex items-center gap-3 mb-6">
          <FaCheckCircle className="text-2xl text-green-600" />
          <h3 className="text-2xl font-semibold text-gray-900 mb-0">Key Features</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-lg p-5 border border-blue-200">
            <div className="flex items-center gap-2 mb-3">
              <FaDocker className="text-blue-600" />
              <h4 className="font-semibold text-gray-900">Docker Services</h4>
            </div>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>PostgreSQL, MySQL, MongoDB databases</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Redis cache and session storage</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Custom service configurations</span>
              </li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100/50 rounded-lg p-5 border border-green-200">
            <div className="flex items-center gap-2 mb-3">
              <FaGlobe className="text-green-600" />
              <h4 className="font-semibold text-gray-900">ngrok Integration</h4>
            </div>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-1">•</span>
                <span>Secure HTTPS tunnels for local dev</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-1">•</span>
                <span>Webhook testing and API development</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-1">•</span>
                <span>Custom domain configuration</span>
              </li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-lg p-5 border border-purple-200">
            <div className="flex items-center gap-2 mb-3">
              <FaServer className="text-purple-600" />
              <h4 className="font-semibold text-gray-900">Service Management</h4>
            </div>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-purple-600 mt-1">•</span>
                <span>Start, stop, restart services</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600 mt-1">•</span>
                <span>Health checks and monitoring</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600 mt-1">•</span>
                <span>Log streaming and debugging</span>
              </li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-orange-100/50 rounded-lg p-5 border border-orange-200">
            <div className="flex items-center gap-2 mb-3">
              <FaCog className="text-orange-600" />
              <h4 className="font-semibold text-gray-900">Auto Configuration</h4>
            </div>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-orange-600 mt-1">•</span>
                <span>Reads project configuration</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-600 mt-1">•</span>
                <span>Generates Docker Compose files</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-600 mt-1">•</span>
                <span>Environment variable management</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Command Options Section */}
      <section
        id="deploy-options"
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
                  <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">--stop</code>
                </td>
                <td className="p-4 text-gray-700">Stop all Docker services</td>
              </tr>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <td className="p-4">
                  <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">--status</code>
                </td>
                <td className="p-4 text-gray-700">Show status of running Docker services</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="p-4">
                  <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">--destroy</code>
                </td>
                <td className="p-4 text-gray-700">
                  Destroy all Docker services and data (DESTRUCTIVE)
                </td>
              </tr>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <td className="p-4">
                  <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">--approve</code>
                </td>
                <td className="p-4 text-gray-700">
                  Skip confirmation prompts (use with --destroy)
                </td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="p-4">
                  <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">-y, --yes</code>
                </td>
                <td className="p-4 text-gray-700">
                  Auto-confirm all prompts and update environment variables
                </td>
              </tr>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <td className="p-4">
                  <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">
                    --update-env
                  </code>
                </td>
                <td className="p-4 text-gray-700">Update environment variables with ngrok URLs</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="p-4">
                  <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">
                    --skip-env-update
                  </code>
                </td>
                <td className="p-4 text-gray-700">Skip environment variable updates</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Usage Examples Section */}
      <section
        id="deploy-examples"
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-8"
      >
        <div className="flex items-center gap-3 mb-6">
          <FaTerminal className="text-2xl text-indigo-600" />
          <h3 className="text-2xl font-semibold text-gray-900 mb-0">Usage Examples</h3>
        </div>

        <div className="space-y-6">
          <div>
            <p className="text-gray-700 mb-3 font-medium">Start all services (default action):</p>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <CodeBlock code="bunx create-precast-app@latest deploy" />
            </div>
          </div>

          <div>
            <p className="text-gray-700 mb-3 font-medium">Check service status:</p>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <CodeBlock code="bunx create-precast-app@latest deploy --status" />
            </div>
          </div>

          <div>
            <p className="text-gray-700 mb-3 font-medium">Stop all running services:</p>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <CodeBlock code="bunx create-precast-app@latest deploy --stop" />
            </div>
          </div>

          <div>
            <p className="text-gray-700 mb-3 font-medium">
              Auto-confirm prompts and update environment:
            </p>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <CodeBlock code="bunx create-precast-app@latest deploy --yes" />
            </div>
          </div>

          <div>
            <p className="text-gray-700 mb-3 font-medium">
              Destroy all containers and data (DANGEROUS):
            </p>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <CodeBlock code="bunx create-precast-app@latest deploy --destroy --approve" />
            </div>
          </div>
        </div>
      </section>

      {/* Available Services Section */}
      <section
        id="deploy-services"
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-8"
      >
        <div className="flex items-center gap-3 mb-6">
          <FaServer className="text-2xl text-teal-600" />
          <h3 className="text-2xl font-semibold text-gray-900 mb-0">Available Services</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <h4 className="font-semibold text-gray-900 mb-2">PostgreSQL</h4>
            <p className="text-sm text-gray-700">Production-ready PostgreSQL 15</p>
            <p className="text-xs text-gray-600 mt-1">Port: 5432</p>
          </div>

          <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
            <h4 className="font-semibold text-gray-900 mb-2">MySQL</h4>
            <p className="text-sm text-gray-700">MySQL 8.0 with optimized settings</p>
            <p className="text-xs text-gray-600 mt-1">Port: 3306</p>
          </div>

          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <h4 className="font-semibold text-gray-900 mb-2">MongoDB</h4>
            <p className="text-sm text-gray-700">MongoDB 7.0 with replica set</p>
            <p className="text-xs text-gray-600 mt-1">Port: 27017</p>
          </div>

          <div className="bg-red-50 rounded-lg p-4 border border-red-200">
            <h4 className="font-semibold text-gray-900 mb-2">Redis</h4>
            <p className="text-sm text-gray-700">Redis 7.0 for caching and sessions</p>
            <p className="text-xs text-gray-600 mt-1">Port: 6379</p>
          </div>

          <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
            <h4 className="font-semibold text-gray-900 mb-2">ngrok</h4>
            <p className="text-sm text-gray-700">Secure tunnels to localhost</p>
            <p className="text-xs text-gray-600 mt-1">Dynamic HTTPS URL</p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <h4 className="font-semibold text-gray-900 mb-2">Custom</h4>
            <p className="text-sm text-gray-700">Your own Docker services</p>
            <p className="text-xs text-gray-600 mt-1">Configurable ports</p>
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
              <span>Services auto-restart when you restart Docker</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">•</span>
              <span>Use --clean to free up disk space periodically</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">•</span>
              <span>ngrok requires account for custom domains</span>
            </li>
          </ul>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">•</span>
              <span>Check Docker Desktop is running first</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">•</span>
              <span>Database data persists between restarts</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">•</span>
              <span>Use --logs to debug service issues</span>
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
}

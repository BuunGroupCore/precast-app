import {
  FaChartLine,
  FaUserShield,
  FaToggleOn,
  FaToggleOff,
  FaTerminal,
  FaShieldAlt,
  FaInfoCircle,
} from "react-icons/fa";

import { CodeBlock } from "@/features/common";

/**
 * Documentation for the telemetry command
 */
export function TelemetryCommandDocs() {
  return (
    <div className="space-y-8">
      {/* Overview Section */}
      <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="flex items-center gap-3 mb-6">
          <FaChartLine className="text-2xl text-blue-600" />
          <h2
            className="text-3xl font-semibold text-gray-900 mb-0"
            style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
          >
            telemetry Command
          </h2>
        </div>

        <div className="space-y-6">
          <p
            className="text-gray-700 leading-relaxed"
            style={{ fontSize: "16px", lineHeight: "1.7" }}
          >
            Manage anonymous usage analytics for PRECAST. Help us improve the tool by sharing how
            you use it, or disable data collection entirely. Your privacy is our priority.
          </p>

          <div className="bg-blue-50 border-l-4 border-blue-500 p-5 rounded-r">
            <div className="flex items-center gap-2 mb-3">
              <FaTerminal className="text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900 mb-0">Basic Usage</h3>
            </div>
            <CodeBlock code="bunx create-precast-app@latest telemetry [enable|disable|status]" />
          </div>
        </div>
      </section>

      {/* Actions Section */}
      <section
        id="telemetry-actions"
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-8"
      >
        <div className="flex items-center gap-3 mb-6">
          <FaToggleOn className="text-2xl text-green-600" />
          <h3 className="text-2xl font-semibold text-gray-900 mb-0">Available Actions</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-green-50 to-green-100/50 rounded-lg p-6 border border-green-200">
            <div className="flex items-center gap-2 mb-3">
              <FaToggleOn className="text-green-600" />
              <h4 className="font-semibold text-gray-900">Enable</h4>
            </div>
            <p className="text-sm text-gray-700 mb-4">
              Turn on anonymous usage analytics to help improve PRECAST
            </p>
            <div className="bg-green-100 rounded p-3">
              <CodeBlock code="bunx create-precast-app@latest telemetry enable" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-red-50 to-red-100/50 rounded-lg p-6 border border-red-200">
            <div className="flex items-center gap-2 mb-3">
              <FaToggleOff className="text-red-600" />
              <h4 className="font-semibold text-gray-900">Disable</h4>
            </div>
            <p className="text-sm text-gray-700 mb-4">Turn off all data collection and analytics</p>
            <div className="bg-red-100 rounded p-3">
              <CodeBlock code="bunx create-precast-app@latest telemetry disable" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-lg p-6 border border-blue-200">
            <div className="flex items-center gap-2 mb-3">
              <FaInfoCircle className="text-blue-600" />
              <h4 className="font-semibold text-gray-900">Status</h4>
            </div>
            <p className="text-sm text-gray-700 mb-4">
              Check current telemetry settings and preferences
            </p>
            <div className="bg-blue-100 rounded p-3">
              <CodeBlock code="bunx create-precast-app@latest telemetry status" />
            </div>
          </div>
        </div>
      </section>

      {/* What We Collect Section */}
      <section
        id="telemetry-data"
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-8"
      >
        <div className="flex items-center gap-3 mb-6">
          <FaChartLine className="text-2xl text-indigo-600" />
          <h3 className="text-2xl font-semibold text-gray-900 mb-0">What We Collect</h3>
        </div>

        <div className="space-y-6">
          <p className="text-gray-700 leading-relaxed">
            We collect anonymous usage data to understand how PRECAST is used and improve the
            developer experience. All data is anonymized and cannot be traced back to individual
            users.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <h4 className="font-semibold text-gray-900 mb-4">✅ What We DO Collect</h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">•</span>
                  <span>Framework and technology choices</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">•</span>
                  <span>Command usage frequency</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">•</span>
                  <span>Error types and frequencies</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">•</span>
                  <span>Performance metrics (speed, success rates)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">•</span>
                  <span>Node.js and package manager versions</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">•</span>
                  <span>Operating system type (Windows/Mac/Linux)</span>
                </li>
              </ul>
            </div>

            <div className="bg-red-50 rounded-lg p-6 border border-red-200">
              <h4 className="font-semibold text-gray-900 mb-4">❌ What We DON&apos;T Collect</h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-red-600 mt-1">•</span>
                  <span>Personal information or names</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 mt-1">•</span>
                  <span>Email addresses or contact details</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 mt-1">•</span>
                  <span>Project names or file paths</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 mt-1">•</span>
                  <span>Source code or project contents</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 mt-1">•</span>
                  <span>Environment variables or secrets</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 mt-1">•</span>
                  <span>IP addresses or location data</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Privacy Section */}
      <section
        id="telemetry-privacy"
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-8"
      >
        <div className="flex items-center gap-3 mb-6">
          <FaShieldAlt className="text-2xl text-emerald-600" />
          <h3 className="text-2xl font-semibold text-gray-900 mb-0">Privacy First</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-emerald-50 rounded-lg p-6 border border-emerald-200">
            <div className="flex items-center gap-2 mb-3">
              <FaUserShield className="text-emerald-600" />
              <h4 className="font-semibold text-gray-900">Your Control</h4>
            </div>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 mt-1">✓</span>
                <span>Opt-out anytime with one command</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 mt-1">✓</span>
                <span>No tracking across projects</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 mt-1">✓</span>
                <span>Data is automatically anonymized</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 mt-1">✓</span>
                <span>Clear about what we collect</span>
              </li>
            </ul>
          </div>

          <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
            <div className="flex items-center gap-2 mb-3">
              <FaChartLine className="text-blue-600" />
              <h4 className="font-semibold text-gray-900">How It Helps</h4>
            </div>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Identify popular frameworks to prioritize</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Find and fix common error patterns</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Improve performance and reliability</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Guide future feature development</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Environment Variables Section */}
      <section
        id="telemetry-env"
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-8"
      >
        <div className="flex items-center gap-3 mb-6">
          <FaTerminal className="text-2xl text-gray-600" />
          <h3 className="text-2xl font-semibold text-gray-900 mb-0">Environment Variables</h3>
        </div>

        <div className="space-y-6">
          <p className="text-gray-700 leading-relaxed">
            You can also control telemetry using environment variables, which is useful for CI/CD
            environments or when you want to set a global preference.
          </p>

          <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
            <h4 className="font-semibold text-gray-900 mb-4">Disable Telemetry Globally</h4>
            <CodeBlock code="export PRECAST_TELEMETRY_DISABLED=1" />
            <p className="text-sm text-gray-600 mt-2">
              Add this to your shell profile (.bashrc, .zshrc) to disable telemetry for all PRECAST
              commands.
            </p>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-5">
            <div className="flex gap-3">
              <FaInfoCircle className="text-yellow-600 text-xl flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-yellow-900 font-semibold mb-1">CI/CD Environments</p>
                <p className="text-yellow-700 text-sm">
                  Telemetry is automatically disabled in CI/CD environments (when CI=true is set).
                  No additional configuration needed.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Examples Section */}
      <section
        id="telemetry-examples"
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-8"
      >
        <div className="flex items-center gap-3 mb-6">
          <FaTerminal className="text-2xl text-purple-600" />
          <h3 className="text-2xl font-semibold text-gray-900 mb-0">Examples</h3>
        </div>

        <div className="space-y-6">
          <div>
            <p className="text-gray-700 mb-3 font-medium">Check current telemetry status:</p>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <CodeBlock code="bunx create-precast-app@latest telemetry status" />
            </div>
            <div className="bg-gray-50 rounded-lg p-4 mt-2 border border-gray-200">
              <CodeBlock
                code={`Telemetry Status: ENABLED
Last update: 2024-01-15
Data sent: Framework choices, command usage
Next sync: In 7 days`}
              />
            </div>
          </div>

          <div>
            <p className="text-gray-700 mb-3 font-medium">Disable telemetry completely:</p>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <CodeBlock code="bunx create-precast-app@latest telemetry disable" />
            </div>
            <div className="bg-green-50 rounded-lg p-4 mt-2 border border-green-200">
              <CodeBlock code="✅ Telemetry has been disabled. No data will be collected." />
            </div>
          </div>

          <div>
            <p className="text-gray-700 mb-3 font-medium">Re-enable telemetry:</p>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <CodeBlock code="bunx create-precast-app@latest telemetry enable" />
            </div>
            <div className="bg-blue-50 rounded-lg p-4 mt-2 border border-blue-200">
              <CodeBlock code="✅ Telemetry enabled. Thank you for helping improve PRECAST!" />
            </div>
          </div>

          <div>
            <p className="text-gray-700 mb-3 font-medium">Disable for current session only:</p>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <CodeBlock code="PRECAST_TELEMETRY_DISABLED=1 bunx create-precast-app@latest init my-app" />
            </div>
          </div>
        </div>
      </section>

      {/* Tips Section */}
      <section className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 p-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Best Practices</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">•</span>
              <span>Enable telemetry to help improve PRECAST for everyone</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">•</span>
              <span>Use environment variables for team-wide settings</span>
            </li>
          </ul>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">•</span>
              <span>Check status regularly to stay informed</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">•</span>
              <span>Disable in sensitive or regulated environments</span>
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
}

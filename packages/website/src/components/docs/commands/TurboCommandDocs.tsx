import {
  FaTachometerAlt,
  FaRocket,
  FaTerminal,
  FaCog,
  FaPlay,
  FaTools,
  FaExclamationTriangle,
  FaCheck,
  FaChartBar,
} from "react-icons/fa";

import { CodeBlock } from "@/features/common";

/**
 * Documentation for the turbo command
 */
export function TurboCommandDocs() {
  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-red-500 text-white rounded-lg">
            <FaTachometerAlt className="text-xl" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">turbo Command</h1>
            <p className="text-gray-600 text-sm">Turbo monorepo build system with enhanced TUI</p>
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <FaExclamationTriangle className="text-amber-600 mt-0.5" />
            <div>
              <h3 className="font-medium text-amber-900 mb-2">⚠️ Under Active Development</h3>
              <p className="text-sm text-amber-800">
                This command is currently under active development and may not work as expected.
                Some features might be broken or incomplete. Use with caution in production
                environments.
              </p>
            </div>
          </div>
        </div>

        <p className="text-gray-700 mb-6">
          Turbo-powered monorepo build system with an enhanced Terminal User Interface (TUI).
          Provides real-time visualization of build processes, interactive task management, and
          intelligent caching for lightning-fast builds.
        </p>

        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <FaTachometerAlt className="text-red-600" />
            <span className="font-medium text-red-900">Basic Usage</span>
          </div>
          <CodeBlock code="bunx create-precast-app@latest turbo [subcommand]" />
        </div>
      </div>

      {/* Subcommands Section */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center gap-3 mb-6">
          <FaRocket className="text-2xl text-purple-600" />
          <h2 className="text-xl font-semibold text-gray-900">Subcommands</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="border border-purple-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <FaTools className="text-purple-600" />
              <h3 className="font-semibold text-purple-900">turbo build</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Run builds with TUI dashboard showing real-time progress
            </p>
            <CodeBlock code="bunx create-precast-app@latest turbo build" />
            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FaCheck className="text-green-500 text-xs" />
                <span>Visual progress bars</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FaCheck className="text-green-500 text-xs" />
                <span>Package dependency graph</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FaCheck className="text-green-500 text-xs" />
                <span>Cache hit indicators</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FaCheck className="text-green-500 text-xs" />
                <span>Error highlighting</span>
              </div>
            </div>
          </div>

          <div className="border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <FaPlay className="text-green-600" />
              <h3 className="font-semibold text-green-900">turbo dev</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Interactive development mode with task management
            </p>
            <CodeBlock code="bunx create-precast-app@latest turbo dev" />
            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FaCheck className="text-green-500 text-xs" />
                <span>Start/stop individual services</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FaCheck className="text-green-500 text-xs" />
                <span>Live log streaming</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FaCheck className="text-green-500 text-xs" />
                <span>Resource monitoring</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FaCheck className="text-green-500 text-xs" />
                <span>Hot reload support</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Build Options Section */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center gap-3 mb-6">
          <FaCog className="text-2xl text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900">Build Options</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-900 bg-gray-50">Option</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900 bg-gray-50">
                  Description
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr>
                <td className="py-3 px-4">
                  <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">
                    --filter &lt;packages...&gt;
                  </code>
                </td>
                <td className="py-3 px-4 text-sm text-gray-600">
                  Filter packages to build (e.g., --filter @precast/cli)
                </td>
              </tr>
              <tr className="bg-gray-50">
                <td className="py-3 px-4">
                  <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">
                    --no-parallel
                  </code>
                </td>
                <td className="py-3 px-4 text-sm text-gray-600">
                  Run builds sequentially instead of in parallel
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4">
                  <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">
                    --no-cache
                  </code>
                </td>
                <td className="py-3 px-4 text-sm text-gray-600">
                  Force rebuild without using cache
                </td>
              </tr>
              <tr className="bg-gray-50">
                <td className="py-3 px-4">
                  <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">--force</code>
                </td>
                <td className="py-3 px-4 text-sm text-gray-600">
                  Force rebuild all packages ignoring cache
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4">
                  <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">
                    --output-logs &lt;type&gt;
                  </code>
                </td>
                <td className="py-3 px-4 text-sm text-gray-600">
                  Output log type: full, errors-only, new-only (default: errors-only)
                </td>
              </tr>
              <tr className="bg-gray-50">
                <td className="py-3 px-4">
                  <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">
                    --no-dashboard
                  </code>
                </td>
                <td className="py-3 px-4 text-sm text-gray-600">
                  Disable TUI dashboard, use standard output
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4">
                  <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">--demo</code>
                </td>
                <td className="py-3 px-4 text-sm text-gray-600">
                  Run dashboard demo mode for testing
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* TUI Features Section */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center gap-3 mb-6">
          <FaTerminal className="text-2xl text-green-600" />
          <h2 className="text-xl font-semibold text-gray-900">TUI Features</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <FaChartBar className="text-green-600" />
              <h3 className="font-semibold text-green-900">Build Dashboard</h3>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FaCheck className="text-green-500 text-xs" />
                <span>Real-time progress bars</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FaCheck className="text-green-500 text-xs" />
                <span>Package dependency visualization</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FaCheck className="text-green-500 text-xs" />
                <span>Build time statistics</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FaCheck className="text-green-500 text-xs" />
                <span>Cache hit/miss indicators</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FaCheck className="text-green-500 text-xs" />
                <span>Error and warning highlights</span>
              </div>
            </div>
          </div>

          <div className="border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <FaPlay className="text-blue-600" />
              <h3 className="font-semibold text-blue-900">Dev Mode Interface</h3>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FaCheck className="text-green-500 text-xs" />
                <span>Interactive service control</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FaCheck className="text-green-500 text-xs" />
                <span>Live log streaming</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FaCheck className="text-green-500 text-xs" />
                <span>CPU and memory monitoring</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FaCheck className="text-green-500 text-xs" />
                <span>Port management</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FaCheck className="text-green-500 text-xs" />
                <span>Quick restart capabilities</span>
              </div>
            </div>
          </div>

          <div className="border border-orange-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <FaTachometerAlt className="text-orange-600" />
              <h3 className="font-semibold text-orange-900">Performance</h3>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FaCheck className="text-green-500 text-xs" />
                <span>Intelligent caching system</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FaCheck className="text-green-500 text-xs" />
                <span>Parallel execution</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FaCheck className="text-green-500 text-xs" />
                <span>Incremental builds</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FaCheck className="text-green-500 text-xs" />
                <span>Remote caching support</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FaCheck className="text-green-500 text-xs" />
                <span>Task deduplication</span>
              </div>
            </div>
          </div>

          <div className="border border-purple-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <FaChartBar className="text-purple-600" />
              <h3 className="font-semibold text-purple-900">Monitoring</h3>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FaCheck className="text-green-500 text-xs" />
                <span>Build analytics</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FaCheck className="text-green-500 text-xs" />
                <span>Performance metrics</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FaCheck className="text-green-500 text-xs" />
                <span>Dependency insights</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FaCheck className="text-green-500 text-xs" />
                <span>Bottleneck detection</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FaCheck className="text-green-500 text-xs" />
                <span>Historical comparisons</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Usage Examples Section */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center gap-3 mb-6">
          <FaRocket className="text-2xl text-orange-600" />
          <h2 className="text-xl font-semibold text-gray-900">Usage Examples</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Build all packages with TUI</h3>
            <p className="text-sm text-gray-600 mb-3">
              Run builds for entire monorepo with visual dashboard:
            </p>
            <CodeBlock code="bunx create-precast-app@latest turbo build" />
          </div>

          <div>
            <h3 className="font-medium text-gray-900 mb-2">Build specific packages</h3>
            <p className="text-sm text-gray-600 mb-3">Filter and build only selected packages:</p>
            <CodeBlock code="bunx create-precast-app@latest turbo build --filter @precast/cli --filter @precast/ui" />
          </div>

          <div>
            <h3 className="font-medium text-gray-900 mb-2">Force rebuild without cache</h3>
            <p className="text-sm text-gray-600 mb-3">Ignore cache and rebuild everything:</p>
            <CodeBlock code="bunx create-precast-app@latest turbo build --force" />
          </div>

          <div>
            <h3 className="font-medium text-gray-900 mb-2">Development mode</h3>
            <p className="text-sm text-gray-600 mb-3">Interactive development with TUI:</p>
            <CodeBlock code="bunx create-precast-app@latest turbo dev" />
          </div>

          <div>
            <h3 className="font-medium text-gray-900 mb-2">Full logs output</h3>
            <p className="text-sm text-gray-600 mb-3">
              Show all build logs instead of errors only:
            </p>
            <CodeBlock code="bunx create-precast-app@latest turbo build --output-logs full" />
          </div>

          <div>
            <h3 className="font-medium text-gray-900 mb-2">Test TUI dashboard</h3>
            <p className="text-sm text-gray-600 mb-3">Demo mode to preview dashboard features:</p>
            <CodeBlock code="bunx create-precast-app@latest turbo build --demo" />
          </div>
        </div>
      </div>

      {/* Monorepo Workflow Section */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center gap-3 mb-6">
          <FaTools className="text-2xl text-red-600" />
          <h2 className="text-xl font-semibold text-gray-900">Monorepo Workflow</h2>
        </div>

        <div className="space-y-6">
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                1
              </div>
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-gray-900 mb-2">Initial Setup</h3>
              <p className="text-sm text-gray-600">
                Configure turbo.json for your monorepo tasks and pipeline definition
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                2
              </div>
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-gray-900 mb-2">Development</h3>
              <p className="text-sm text-gray-600">
                Use <code className="bg-gray-100 px-1 rounded">turbo dev</code> for interactive
                development with hot reload and service management
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                3
              </div>
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-gray-900 mb-2">Building</h3>
              <p className="text-sm text-gray-600">
                Run <code className="bg-gray-100 px-1 rounded">turbo build</code> for optimized
                parallel builds with intelligent caching
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                4
              </div>
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-gray-900 mb-2">CI/CD</h3>
              <p className="text-sm text-gray-600">
                Use <code className="bg-gray-100 px-1 rounded">--no-dashboard</code> flag for CI
                environments to disable TUI
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Pro Tips Section */}
      <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <FaTachometerAlt className="text-xl text-red-600" />
          <h3 className="text-lg font-semibold text-gray-900">Pro Tips</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
              <span className="text-sm text-gray-700">
                Use filters to build only changed packages
              </span>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
              <span className="text-sm text-gray-700">
                Enable remote caching for team collaboration
              </span>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
              <span className="text-sm text-gray-700">
                The TUI works best in terminals with 80+ columns
              </span>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
              <span className="text-sm text-gray-700">
                Press &apos;q&apos; in TUI to quit gracefully
              </span>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
              <span className="text-sm text-gray-700">
                Cache is stored in node_modules/.cache/turbo
              </span>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
              <span className="text-sm text-gray-700">
                Configure pipeline in turbo.json for custom tasks
              </span>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
              <span className="text-sm text-gray-700">Use --demo to see TUI capabilities</span>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
              <span className="text-sm text-gray-700">
                Combine with --filter for targeted builds
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

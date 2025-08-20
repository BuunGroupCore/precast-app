import { FaDatabase, FaCog, FaSync, FaCheck, FaTerminal } from "react-icons/fa";

import { CodeBlock } from "@/features/common";

/**
 * Documentation for the generate command
 */
export function GenerateCommandDocs() {
  return (
    <div className="space-y-8">
      {/* Overview Section */}
      <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="flex items-center gap-3 mb-6">
          <FaDatabase className="text-2xl text-blue-600" />
          <h2
            className="text-3xl font-semibold text-gray-900 mb-0"
            style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
          >
            generate Command
          </h2>
        </div>

        <div className="space-y-6">
          <p
            className="text-gray-700 leading-relaxed"
            style={{ fontSize: "16px", lineHeight: "1.7" }}
          >
            Generate ORM client code and TypeScript types from your database schema. Keeps your
            application in sync with database changes and provides type-safe database operations.
          </p>

          <div className="bg-blue-50 border-l-4 border-blue-500 p-5 rounded-r">
            <div className="flex items-center gap-2 mb-3">
              <FaTerminal className="text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900 mb-0">Basic Usage</h3>
            </div>
            <CodeBlock code="bunx create-precast-app@latest generate" />
          </div>

          <div className="bg-green-50 border-l-4 border-green-500 p-5 rounded-r">
            <div className="flex items-center gap-2 mb-3">
              <FaSync className="text-green-600" />
              <h3 className="text-lg font-semibold text-gray-900 mb-0">Alias</h3>
            </div>
            <CodeBlock code="bunx create-precast-app@latest gen" />
          </div>
        </div>
      </section>

      {/* Supported ORMs Section */}
      <section
        id="generate-features"
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-8"
      >
        <div className="flex items-center gap-3 mb-6">
          <FaDatabase className="text-2xl text-indigo-600" />
          <h3 className="text-2xl font-semibold text-gray-900 mb-0">Supported ORMs</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-lg p-6 border border-blue-200">
            <div className="flex items-center gap-2 mb-3">
              <FaDatabase className="text-blue-600" />
              <h4 className="font-semibold text-gray-900">Prisma</h4>
            </div>
            <ul className="space-y-2 text-sm text-gray-700 mb-4">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Generates Prisma Client</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>TypeScript types from schema</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Database migrations</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Type-safe queries</span>
              </li>
            </ul>
            <div className="bg-white rounded p-3 border border-gray-200">
              <CodeBlock code="bunx create-precast-app@latest generate --orm prisma" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100/50 rounded-lg p-6 border border-green-200">
            <div className="flex items-center gap-2 mb-3">
              <FaDatabase className="text-green-600" />
              <h4 className="font-semibold text-gray-900">Drizzle</h4>
            </div>
            <ul className="space-y-2 text-sm text-gray-700 mb-4">
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-1">•</span>
                <span>Generates SQL migrations</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-1">•</span>
                <span>TypeScript schema types</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-1">•</span>
                <span>Query builder types</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-1">•</span>
                <span>Introspection support</span>
              </li>
            </ul>
            <div className="bg-white rounded p-3 border border-gray-200">
              <CodeBlock code="bunx create-precast-app@latest generate --orm drizzle" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-orange-100/50 rounded-lg p-6 border border-orange-200">
            <div className="flex items-center gap-2 mb-3">
              <FaDatabase className="text-orange-600" />
              <h4 className="font-semibold text-gray-900">TypeORM</h4>
            </div>
            <ul className="space-y-2 text-sm text-gray-700 mb-4">
              <li className="flex items-start gap-2">
                <span className="text-orange-600 mt-1">•</span>
                <span>Entity synchronization</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-600 mt-1">•</span>
                <span>Migration generation</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-600 mt-1">•</span>
                <span>Repository patterns</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-600 mt-1">•</span>
                <span>Decorator metadata</span>
              </li>
            </ul>
            <div className="bg-white rounded p-3 border border-gray-200">
              <CodeBlock code="bunx create-precast-app@latest generate --orm typeorm" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-lg p-6 border border-purple-200">
            <div className="flex items-center gap-2 mb-3">
              <FaCheck className="text-purple-600" />
              <h4 className="font-semibold text-gray-900">Auto-Detection</h4>
            </div>
            <ul className="space-y-2 text-sm text-gray-700 mb-4">
              <li className="flex items-start gap-2">
                <FaCheck className="text-green-500 text-xs mt-1" />
                <span>Reads precast.jsonc config</span>
              </li>
              <li className="flex items-start gap-2">
                <FaCheck className="text-green-500 text-xs mt-1" />
                <span>Detects monorepo structure</span>
              </li>
              <li className="flex items-start gap-2">
                <FaCheck className="text-green-500 text-xs mt-1" />
                <span>Finds schema files</span>
              </li>
              <li className="flex items-start gap-2">
                <FaCheck className="text-green-500 text-xs mt-1" />
                <span>Rebuilds shared packages</span>
              </li>
            </ul>
            <div className="bg-white rounded p-3 border border-gray-200">
              <CodeBlock code="bunx create-precast-app@latest generate" />
            </div>
          </div>
        </div>
      </section>

      {/* Command Options Section */}
      <section
        id="generate-options"
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
                  <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">
                    --orm &lt;orm&gt;
                  </code>
                </td>
                <td className="p-4 text-gray-700">
                  Specify ORM type (prisma, drizzle, typeorm). Auto-detects if not provided.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Typical Workflow Section */}
      <section
        id="generate-workflow"
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-8"
      >
        <div className="flex items-center gap-3 mb-6">
          <FaSync className="text-2xl text-green-600" />
          <h3 className="text-2xl font-semibold text-gray-900 mb-0">Typical Workflow</h3>
        </div>

        <div className="space-y-6">
          <div className="border-l-4 border-green-500 pl-6 bg-green-50 p-4 rounded-r-lg">
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-green-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">
                1
              </span>
              <h4 className="font-semibold text-gray-900">Update Schema</h4>
            </div>
            <p className="text-sm text-gray-600 mb-3">Modify your database schema file:</p>
            <div className="bg-white rounded p-4 border border-gray-200">
              <CodeBlock
                code={`// prisma/schema.prisma
model User {
  id    Int     @id @default(autoincrement())
  email String  @unique
  name  String?
}`}
              />
            </div>
          </div>

          <div className="border-l-4 border-blue-500 pl-6 bg-blue-50 p-4 rounded-r-lg">
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-blue-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">
                2
              </span>
              <h4 className="font-semibold text-gray-900">Generate Client</h4>
            </div>
            <p className="text-sm text-gray-600 mb-3">Run the generate command:</p>
            <div className="bg-white rounded p-4 border border-gray-200">
              <CodeBlock code="bunx create-precast-app@latest generate" />
            </div>
          </div>

          <div className="border-l-4 border-purple-500 pl-6 bg-purple-50 p-4 rounded-r-lg">
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-purple-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">
                3
              </span>
              <h4 className="font-semibold text-gray-900">Use Types</h4>
            </div>
            <p className="text-sm text-gray-600 mb-3">Enjoy type-safe database operations:</p>
            <div className="bg-white rounded p-4 border border-gray-200">
              <CodeBlock
                code={`const user = await prisma.user.create({
  data: {
    email: &apos;user@example.com&apos;,
    name: &apos;John Doe&apos;
  }
});`}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Examples Section */}
      <section
        id="generate-examples"
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-8"
      >
        <div className="flex items-center gap-3 mb-6">
          <FaTerminal className="text-2xl text-indigo-600" />
          <h3 className="text-2xl font-semibold text-gray-900 mb-0">Examples</h3>
        </div>

        <div className="space-y-6">
          <div>
            <p className="text-gray-700 mb-3 font-medium">Auto-detect and generate:</p>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <CodeBlock code="bunx create-precast-app@latest generate" />
            </div>
          </div>

          <div>
            <p className="text-gray-700 mb-3 font-medium">Generate Prisma client:</p>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <CodeBlock code="bunx create-precast-app@latest generate --orm prisma" />
            </div>
          </div>

          <div>
            <p className="text-gray-700 mb-3 font-medium">Generate Drizzle migrations:</p>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <CodeBlock code="bunx create-precast-app@latest gen --orm drizzle" />
            </div>
          </div>

          <div>
            <p className="text-gray-700 mb-3 font-medium">Part of build process:</p>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <CodeBlock
                code={`// package.json
"scripts": {
  "build": "bunx create-precast-app@latest generate && next build"
}`}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Pro Tips Section */}
      <section className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 p-8">
        <div className="flex items-center gap-3 mb-4">
          <FaDatabase className="text-xl text-blue-600" />
          <h3 className="text-xl font-semibold text-gray-900">Pro Tips</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">•</span>
              <span>Run generate after every schema change to keep types in sync</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">•</span>
              <span>Add to your build script for CI/CD pipelines</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">•</span>
              <span>Generated files are typically in .gitignore (regenerated on install)</span>
            </li>
          </ul>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">•</span>
              <span>Use with --install flag during init for automatic generation</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">•</span>
              <span>Check ORM-specific docs for advanced generation options</span>
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
}

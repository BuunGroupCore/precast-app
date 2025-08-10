import {
  FaPlus,
  FaPuzzlePiece,
  FaDoorOpen,
  FaWrench,
  FaDatabase,
  FaPlug,
  FaBullseye,
  FaTools,
} from "react-icons/fa";

import { CodeBlock } from "@/features/common";
import { generateAddOptions } from "@/utils/cliOptionsGenerator";

/**
 * Documentation for the add command
 */
export function AddCommandDocs() {
  const options = generateAddOptions();

  return (
    <section className="comic-panel p-6">
      <div className="flex items-center gap-3 mb-6">
        <FaPlus className="text-3xl text-comic-green" />
        <h2 className="font-comic text-3xl text-comic-green mb-0">add Command</h2>
      </div>

      <div className="mb-6">
        <p className="font-comic mb-4">
          Add new resources to your existing PRECAST project like components, pages, API routes,
          hooks, features, and more. The tool maintains consistency with your project&apos;s
          architecture and patterns.
        </p>
        <div className="bg-comic-green/10 p-4 rounded-lg border border-comic-green">
          <p className="font-comic font-bold text-comic-green mb-2">Basic Usage:</p>
          <CodeBlock code="precast add [resource] [name] [options]" />
        </div>
      </div>

      <div id="add-resources" className="mb-8">
        <h3 className="font-comic text-2xl text-comic-purple mb-4">Available Resources</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-comic-blue/10 p-4 rounded-lg border border-comic-blue">
            <div className="flex items-center gap-2 mb-2">
              <FaPuzzlePiece className="text-comic-blue" />
              <h4 className="font-comic font-bold text-comic-blue mb-0">Components</h4>
            </div>
            <ul className="font-comic text-sm space-y-1">
              <li>
                <code>component</code> - React/Vue/Svelte component
              </li>
              <li>
                <code>page</code> - Full page component
              </li>
              <li>
                <code>layout</code> - Layout wrapper component
              </li>
            </ul>
          </div>
          <div className="bg-comic-green/10 p-4 rounded-lg border border-comic-green">
            <div className="flex items-center gap-2 mb-2">
              <FaDoorOpen className="text-comic-green" />
              <h4 className="font-comic font-bold text-comic-green mb-0">API & Routes</h4>
            </div>
            <ul className="font-comic text-sm space-y-1">
              <li>
                <code>api</code> - API endpoint
              </li>
              <li>
                <code>route</code> - Frontend route
              </li>
              <li>
                <code>middleware</code> - Express/Hono middleware
              </li>
            </ul>
          </div>
          <div className="bg-comic-purple/10 p-4 rounded-lg border border-comic-purple">
            <div className="flex items-center gap-2 mb-2">
              <FaWrench className="text-comic-purple" />
              <h4 className="font-comic font-bold text-comic-purple mb-0">Logic & Utils</h4>
            </div>
            <ul className="font-comic text-sm space-y-1">
              <li>
                <code>hook</code> - Custom React hook
              </li>
              <li>
                <code>service</code> - Business logic service
              </li>
              <li>
                <code>util</code> - Utility function
              </li>
            </ul>
          </div>
          <div className="bg-comic-orange/10 p-4 rounded-lg border border-comic-orange">
            <h4 className="font-comic font-bold text-comic-orange mb-2">📊 Database</h4>
            <ul className="font-comic text-sm space-y-1">
              <li>
                <code>model</code> - Database model/schema
              </li>
              <li>
                <code>migration</code> - Database migration
              </li>
              <li>
                <code>seed</code> - Database seeder
              </li>
            </ul>
          </div>
          <div className="bg-comic-red/10 p-4 rounded-lg border border-comic-red">
            <h4 className="font-comic font-bold text-comic-red mb-2">🧪 Testing</h4>
            <ul className="font-comic text-sm space-y-1">
              <li>
                <code>test</code> - Test file
              </li>
              <li>
                <code>story</code> - Storybook story
              </li>
              <li>
                <code>e2e</code> - End-to-end test
              </li>
            </ul>
          </div>
          <div className="bg-comic-yellow/10 p-4 rounded-lg border border-comic-yellow">
            <div className="flex items-center gap-2 mb-2">
              <FaPlug className="text-comic-yellow" />
              <h4 className="font-comic font-bold text-comic-yellow mb-0">Features</h4>
            </div>
            <ul className="font-comic text-sm space-y-1">
              <li>
                <code>auth</code> - Authentication setup
              </li>
              <li>
                <code>ui-library</code> - UI component library
              </li>
              <li>
                <code>plugin</code> - Business feature plugin
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div id="add-options" className="mb-8">
        <h3 className="font-comic text-2xl text-comic-red mb-4">Command Options</h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-comic-green/20 border-2 border-comic-black">
                <th className="font-comic text-left p-3 border-r-2 border-comic-black">Option</th>
                <th className="font-comic text-left p-3 border-r-2 border-comic-black">Values</th>
                <th className="font-comic text-left p-3">Description</th>
              </tr>
            </thead>
            <tbody className="font-comic">
              {options.map((option, index) => (
                <tr
                  key={option.flag}
                  className={`border-2 border-t-0 border-comic-black ${
                    index % 2 === 1 ? "bg-comic-white/50" : ""
                  }`}
                >
                  <td className="p-3 border-r-2 border-comic-black">
                    <code className="bg-comic-gray/20 px-2 py-1 rounded font-mono text-xs">
                      {option.flag}
                    </code>
                  </td>
                  <td className="p-3 border-r-2 border-comic-black text-sm">
                    <code className="text-xs bg-comic-blue/10 px-1 py-0.5 rounded">
                      {option.values}
                    </code>
                  </td>
                  <td className="p-3 text-sm">{option.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div id="add-examples" className="mb-8">
        <h3 className="font-comic text-2xl text-comic-blue mb-4">🎆 Examples</h3>
        <div className="space-y-6">
          <div>
            <h4 className="font-comic text-lg font-bold mb-2">🧩 Component Generation</h4>
            <div className="space-y-2">
              <CodeBlock code="precast add component Button" />
              <CodeBlock code="precast add page Dashboard --typescript" />
              <CodeBlock code="precast add layout MainLayout" />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <FaDoorOpen className="text-comic-green" />
              <h4 className="font-comic text-lg font-bold mb-0">API Development</h4>
            </div>
            <div className="space-y-2">
              <CodeBlock code="precast add api users" />
              <CodeBlock code="precast add route auth/login" />
              <CodeBlock code="precast add middleware auth" />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <FaWrench className="text-comic-purple" />
              <h4 className="font-comic text-lg font-bold mb-0">Hooks & Utilities</h4>
            </div>
            <div className="space-y-2">
              <CodeBlock code="precast add hook useAuth" />
              <CodeBlock code="precast add util formatDate --no-typescript" />
              <CodeBlock code="precast add service UserService" />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <FaDatabase className="text-comic-orange" />
              <h4 className="font-comic text-lg font-bold mb-0">Database Operations</h4>
            </div>
            <div className="space-y-2">
              <CodeBlock code="precast add model User" />
              <CodeBlock code="precast add migration add_user_table" />
              <CodeBlock code="precast add seed users" />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <FaPlug className="text-comic-red" />
              <h4 className="font-comic text-lg font-bold mb-0">Feature Integration</h4>
            </div>
            <div className="space-y-2">
              <CodeBlock code="precast add auth --provider clerk" />
              <CodeBlock code="precast add ui-library --library shadcn" />
              <CodeBlock code="precast add plugin --plugin stripe" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-comic-yellow/20 p-4 rounded-lg border-2 border-comic-black">
          <div className="flex items-center gap-2 mb-3">
            <FaBullseye className="text-comic-yellow" />
            <h4 className="font-comic text-lg font-bold mb-0">Smart Generation Features</h4>
          </div>
          <ul className="font-comic space-y-2 list-disc list-inside text-sm">
            <li>Detects your project&apos;s framework and patterns</li>
            <li>Maintains consistent file structure</li>
            <li>Follows your naming conventions</li>
            <li>Includes appropriate imports and dependencies</li>
            <li>Generates TypeScript types when enabled</li>
            <li>Creates corresponding test files</li>
            <li>Updates route configurations automatically</li>
          </ul>
        </div>

        <div className="bg-comic-blue/20 p-4 rounded-lg border-2 border-comic-black">
          <div className="flex items-center gap-2 mb-3">
            <FaTools className="text-comic-blue" />
            <h4 className="font-comic text-lg font-bold mb-0">Advanced Options</h4>
          </div>
          <ul className="font-comic space-y-2 list-disc list-inside text-sm">
            <li>
              <code>--dry-run</code> - Preview changes without creating files
            </li>
            <li>
              <code>--force</code> - Overwrite existing files
            </li>
            <li>
              <code>--template</code> - Use custom template
            </li>
            <li>
              <code>--directory</code> - Specify custom output directory
            </li>
            <li>
              <code>--with-tests</code> - Include test files
            </li>
            <li>
              <code>--with-stories</code> - Include Storybook stories
            </li>
            <li>
              <code>--export</code> - Add to barrel exports
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}

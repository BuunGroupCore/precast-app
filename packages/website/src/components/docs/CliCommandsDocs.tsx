import { FaTools, FaRocket, FaPlus, FaTerminal } from "react-icons/fa";

import { CodeBlock } from "@/features/common";
import { generateCliOptions } from "@/utils/cliOptionsGenerator";

/**
 * Complete CLI commands documentation
 */
export function CliCommandsDocs() {
  const options = generateCliOptions();

  return (
    <div className="space-y-8">
      <section id="commands-overview" className="comic-panel p-6">
        <div className="flex items-center gap-3 mb-6">
          <FaTools className="text-3xl text-comic-blue" />
          <h2 className="font-comic text-3xl text-comic-blue mb-0">CLI Commands</h2>
        </div>
        <p className="font-comic mb-4">
          PRECAST provides commands to create and extend your projects. All commands support both
          interactive prompts and flags for automation.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-comic-blue/10 p-4 rounded-lg border border-comic-blue">
            <div className="flex items-center gap-2 mb-2">
              <FaRocket className="text-comic-blue" />
              <h3 className="font-comic font-bold text-comic-blue mb-0">init</h3>
            </div>
            <p className="font-comic text-sm">Create new projects with full stack configuration</p>
          </div>
          <div className="bg-comic-green/10 p-4 rounded-lg border border-comic-green">
            <div className="flex items-center gap-2 mb-2">
              <FaPlus className="text-comic-green" />
              <h3 className="font-comic font-bold text-comic-green mb-0">add</h3>
            </div>
            <p className="font-comic text-sm">Add components and features to existing projects</p>
          </div>
        </div>
      </section>

      <section id="init-command" className="comic-panel p-6">
        <div className="flex items-center gap-3 mb-4">
          <FaRocket className="text-2xl text-comic-blue" />
          <h2 className="font-comic text-2xl text-comic-blue mb-0">init Command</h2>
        </div>
        <p className="font-comic mb-4">
          The primary command for creating new PRECAST projects. Supports multiple frameworks,
          backends, databases, authentication providers, and modern tooling.
        </p>

        <div className="bg-comic-blue/10 p-4 rounded-lg border border-comic-blue mb-4">
          <div className="flex items-center gap-2 mb-2">
            <FaTerminal className="text-comic-blue" />
            <p className="font-comic font-bold text-comic-blue mb-0">Basic Syntax</p>
          </div>
          <CodeBlock code="npx create-precast-app@latest [project-name] [options]" />
        </div>

        <div className="overflow-x-auto mb-6">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-comic-yellow/20 border-2 border-comic-black">
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
      </section>

      <section id="add-command" className="comic-panel p-6">
        <div className="flex items-center gap-3 mb-4">
          <FaPlus className="text-2xl text-comic-green" />
          <h2 className="font-comic text-2xl text-comic-green mb-0">add Command</h2>
        </div>
        <p className="font-comic mb-4">
          Add new components or features to existing PRECAST projects. Currently supports component
          generation with more features in development.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <FaRocket className="text-comic-blue" />
              <h4 className="font-comic font-bold mb-0">Components</h4>
            </div>
            <CodeBlock code="create-precast-app add component UserProfile" />
            <p className="font-comic text-xs text-comic-gray mt-1">
              Note: Run from within your project directory
            </p>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <FaPlus className="text-comic-green" />
              <h4 className="font-comic font-bold mb-0">Features</h4>
            </div>
            <p className="font-comic text-sm text-comic-gray">Additional features coming soon</p>
          </div>
        </div>

        <div className="bg-comic-orange/20 p-4 rounded-lg border border-comic-orange">
          <div className="flex items-center gap-2 mb-2">
            <FaTools className="text-comic-orange" />
            <h4 className="font-comic font-bold text-comic-orange mb-0">Current Status</h4>
          </div>
          <p className="font-comic text-sm">
            Currently only React component generation is fully implemented. More resources and
            frameworks coming soon.
          </p>
        </div>
      </section>

      <section id="examples" className="comic-panel p-6">
        <div className="flex items-center gap-3 mb-6">
          <FaTerminal className="text-3xl text-comic-red" />
          <h2 className="font-comic text-3xl text-comic-red mb-0">Usage Examples</h2>
        </div>

        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <FaRocket className="text-comic-blue" />
              <h3 className="font-comic text-lg font-bold mb-0">Quick Start</h3>
            </div>
            <p className="font-comic text-sm mb-2">Interactive setup:</p>
            <CodeBlock code="npx create-precast-app@latest my-app" />
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <FaRocket className="text-comic-green" />
              <h3 className="font-comic text-lg font-bold mb-0">Full-Stack Application</h3>
            </div>
            <p className="font-comic text-sm mb-2">React + Express + PostgreSQL:</p>
            <CodeBlock code="npx create-precast-app@latest my-app \\\n  --framework react \\\n  --backend express \\\n  --database postgres \\\n  --orm prisma \\\n  --auth better-auth \\\n  --ui-library shadcn \\\n  --install" />
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <FaRocket className="text-comic-purple" />
              <h3 className="font-comic text-lg font-bold mb-0">Next.js with Authentication</h3>
            </div>
            <p className="font-comic text-sm mb-2">Modern Next.js setup:</p>
            <CodeBlock code="npx create-precast-app@latest next-app \\\n  --framework next \\\n  --database postgres \\\n  --orm prisma \\\n  --auth nextauth \\\n  --styling tailwind \\\n  --install" />
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <FaRocket className="text-comic-orange" />
              <h3 className="font-comic text-lg font-bold mb-0">Frontend Only</h3>
            </div>
            <p className="font-comic text-sm mb-2">Vue with styling:</p>
            <CodeBlock code="npx create-precast-app@latest frontend-app \\\n  --framework vue \\\n  --backend none \\\n  --styling tailwind \\\n  --ui-library daisyui \\\n  --install" />
          </div>
        </div>
      </section>
    </div>
  );
}

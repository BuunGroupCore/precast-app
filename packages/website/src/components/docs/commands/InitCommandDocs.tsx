import {
  FaRocket,
  FaCode,
  FaTerminal,
  FaPlug,
  FaRobot,
  FaMobile,
  FaShieldAlt,
} from "react-icons/fa";

import { CodeBlock } from "@/features/common";
import { generateInitOptions } from "@/utils/cliOptionsGenerator";

/**
 * Documentation for the init command
 */
export function InitCommandDocs() {
  const options = generateInitOptions();

  return (
    <section className="comic-panel p-6">
      <div className="flex items-center gap-3 mb-6">
        <FaRocket className="text-3xl text-comic-blue" />
        <h2 className="font-comic text-3xl text-comic-blue mb-0">init Command</h2>
      </div>

      <div className="mb-6">
        <p className="font-comic mb-4">
          Create a new PRECAST project with your chosen technology stack. This command scaffolds a
          complete, production-ready application with modern tooling and best practices.
        </p>
        <div className="bg-comic-blue/10 p-4 rounded-lg border border-comic-blue mb-4">
          <div className="flex items-center gap-2 mb-2">
            <FaTerminal className="text-comic-blue" />
            <p className="font-comic font-bold text-comic-blue mb-0">Basic Usage</p>
          </div>
          <CodeBlock code="npx create-precast-app@latest [project-name] [options]" />
        </div>
        <div className="bg-comic-green/10 p-4 rounded-lg border border-comic-green">
          <div className="flex items-center gap-2 mb-2">
            <FaRocket className="text-comic-green" />
            <p className="font-comic font-bold text-comic-green mb-0">Quick Start (Recommended)</p>
          </div>
          <CodeBlock code="bun create precast-app@latest my-app --install" />
        </div>
      </div>

      <div id="init-options" className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <FaCode className="text-2xl text-comic-purple" />
          <h3 className="font-comic text-2xl text-comic-purple mb-0">Available Options</h3>
        </div>
        <div className="overflow-x-auto">
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
      </div>

      <div id="advanced-features" className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <FaPlug className="text-2xl text-comic-red" />
          <h3 className="font-comic text-2xl text-comic-red mb-0">Advanced Features</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-comic-red/10 p-4 rounded-lg border border-comic-red">
            <div className="flex items-center gap-2 mb-2">
              <FaPlug className="text-comic-red" />
              <h4 className="font-comic font-bold text-comic-red mb-0">Plugin System</h4>
            </div>
            <p className="font-comic text-sm mb-2">Add business features instantly:</p>
            <CodeBlock code="--plugins stripe,resend,sendgrid" />
            <p className="font-comic text-xs mt-2">Available: stripe, resend, sendgrid, socketio</p>
          </div>
          <div className="bg-comic-purple/10 p-4 rounded-lg border border-comic-purple">
            <div className="flex items-center gap-2 mb-2">
              <FaRobot className="text-comic-purple" />
              <h4 className="font-comic font-bold text-comic-purple mb-0">AI Integration</h4>
            </div>
            <p className="font-comic text-sm mb-2">Claude MCP servers for enhanced development:</p>
            <CodeBlock code="--ai claude --mcp-servers postgresql,github-official" />
            <p className="font-comic text-xs mt-2">
              MCP servers: postgresql, github-official, mongodb, cloudflare
            </p>
          </div>
          <div className="bg-comic-green/10 p-4 rounded-lg border border-comic-green">
            <div className="flex items-center gap-2 mb-2">
              <FaCode className="text-comic-green" />
              <h4 className="font-comic font-bold text-comic-green mb-0">Powerups</h4>
            </div>
            <p className="font-comic text-sm mb-2">Enhanced development tools:</p>
            <CodeBlock code="--powerups storybook,sentry,posthog" />
            <p className="font-comic text-xs mt-2">
              Available: sentry, posthog, storybook, husky, vitest, playwright
            </p>
          </div>
          <div className="bg-comic-orange/10 p-4 rounded-lg border border-comic-orange">
            <div className="flex items-center gap-2 mb-2">
              <FaShieldAlt className="text-comic-orange" />
              <h4 className="font-comic font-bold text-comic-orange mb-0">API Clients</h4>
            </div>
            <p className="font-comic text-sm mb-2">Data fetching and state management:</p>
            <CodeBlock code="--api-client tanstack-query" />
            <p className="font-comic text-xs mt-2">
              Available: tanstack-query, swr, axios, trpc, apollo-client
            </p>
          </div>
        </div>
      </div>

      <div id="init-examples" className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <FaTerminal className="text-2xl text-comic-green" />
          <h3 className="font-comic text-2xl text-comic-green mb-0">Real-World Examples</h3>
        </div>
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <FaRocket className="text-comic-blue" />
              <h4 className="font-comic text-lg font-bold mb-0">SaaS Application</h4>
            </div>
            <p className="font-comic text-sm mb-2">
              Full-stack SaaS with authentication, payments, and database:
            </p>
            <CodeBlock code="npx create-precast-app@latest my-saas \\\n  --framework next \\\n  --database postgres \\\n  --orm prisma \\\n  --auth better-auth \\\n  --ui-library shadcn \\\n  --plugins stripe,resend \\\n  --docker --install" />
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <FaCode className="text-comic-purple" />
              <h4 className="font-comic text-lg font-bold mb-0">Portfolio Website</h4>
            </div>
            <p className="font-comic text-sm mb-2">
              Static site with modern styling and animations:
            </p>
            <CodeBlock code="npx create-precast-app@latest my-portfolio \\\n  --framework astro \\\n  --styling tailwind \\\n  --ui-library shadcn \\\n  --typescript --install" />
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <FaMobile className="text-comic-green" />
              <h4 className="font-comic text-lg font-bold mb-0">Mobile App</h4>
            </div>
            <p className="font-comic text-sm mb-2">Cross-platform mobile application:</p>
            <CodeBlock code="npx create-precast-app@latest my-mobile-app \\\n  --framework react-native \\\n  --auth clerk \\\n  --styling tailwind \\\n  --database supabase \\\n  --install" />
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <FaRocket className="text-comic-orange" />
              <h4 className="font-comic text-lg font-bold mb-0">Rapid Prototyping</h4>
            </div>
            <p className="font-comic text-sm mb-2">Quick setup for experimentation:</p>
            <CodeBlock code="npx create-precast-app@latest prototype \\\n  --framework vite \\\n  --ui-framework react \\\n  --styling tailwind \\\n  --yes --install" />
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <FaShieldAlt className="text-comic-red" />
              <h4 className="font-comic text-lg font-bold mb-0">Enterprise API</h4>
            </div>
            <p className="font-comic text-sm mb-2">
              Scalable backend with monitoring and documentation:
            </p>
            <CodeBlock code="npx create-precast-app@latest enterprise-api \\\n  --framework none \\\n  --backend nestjs \\\n  --database postgres \\\n  --orm prisma \\\n  --auth passport \\\n  --docker \\\n  --plugins monitoring,analytics \\\n  --install" />
          </div>
        </div>
      </div>

      <div id="pro-tips" className="bg-comic-yellow/20 p-6 rounded-lg border-2 border-comic-black">
        <div className="flex items-center gap-3 mb-4">
          <FaRocket className="text-xl text-comic-orange" />
          <h3 className="font-comic text-xl font-bold mb-0">Pro Tips</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <FaRocket className="text-comic-blue" />
              <h4 className="font-comic font-bold mb-0">Performance</h4>
            </div>
            <ul className="list-disc list-inside font-comic text-sm space-y-1">
              <li>
                Use <code>bun</code> for 3x faster installs
              </li>
              <li>
                Add <code>--install</code> to skip manual steps
              </li>
              <li>
                Use <code>--yes</code> for automation scripts
              </li>
            </ul>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <FaCode className="text-comic-green" />
              <h4 className="font-comic font-bold mb-0">Best Practices</h4>
            </div>
            <ul className="list-disc list-inside font-comic text-sm space-y-1">
              <li>Always enable TypeScript for better DX</li>
              <li>Include Docker for consistent environments</li>
              <li>Choose shadcn/ui for flexible components</li>
            </ul>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <FaTerminal className="text-comic-purple" />
              <h4 className="font-comic font-bold mb-0">Automation</h4>
            </div>
            <ul className="list-disc list-inside font-comic text-sm space-y-1">
              <li>Save common configs as shell aliases</li>
              <li>Use environment variables for team setups</li>
              <li>Combine with CI/CD for automated deployments</li>
            </ul>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <FaShieldAlt className="text-comic-red" />
              <h4 className="font-comic font-bold mb-0">Security</h4>
            </div>
            <ul className="list-disc list-inside font-comic text-sm space-y-1">
              <li>Secure passwords generated automatically</li>
              <li>Environment files created with examples</li>
              <li>Git secrets protection included</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

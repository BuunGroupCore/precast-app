import {
  FaList,
  FaRocket,
  FaChartBar,
  FaFire,
  FaSearch,
  FaFolder,
  FaChartPie,
  FaPlug,
  FaExclamationTriangle,
} from "react-icons/fa";

import { CodeBlock } from "@/features/common";

/**
 * Documentation for the list command
 */
export function ListCommandDocs() {
  return (
    <section className="comic-panel p-6">
      <div className="flex items-center gap-3 mb-6">
        <FaList className="text-3xl text-comic-red" />
        <h2 className="font-comic text-3xl text-comic-red mb-0">list Command</h2>
      </div>

      <div className="mb-6">
        <p className="font-comic mb-4">
          Display available options, project information, and system status. Perfect for discovering
          supported technologies and debugging configurations.
        </p>
        <div className="bg-comic-red/10 p-4 rounded-lg border border-comic-red">
          <div className="flex items-center gap-2 mb-2">
            <FaExclamationTriangle className="text-comic-red" />
            <p className="font-comic font-bold text-comic-red mb-0">Command Not Implemented</p>
          </div>
          <p className="font-comic text-sm mb-3">
            The list command is planned for future releases but not currently available in the
            published version.
          </p>
          <p className="font-comic text-sm">
            Use the online documentation or GitHub repository to explore available options.
          </p>
        </div>
      </div>

      <div id="list-categories" className="mb-8">
        <h3 className="font-comic text-2xl text-comic-purple mb-4">Available Categories</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-comic-blue/10 p-4 rounded-lg border border-comic-blue">
            <div className="flex items-center gap-2 mb-2">
              <FaRocket className="text-comic-blue" />
              <h4 className="font-comic font-bold text-comic-blue mb-0">Technologies</h4>
            </div>
            <div className="space-y-2 text-sm">
              <CodeBlock code="npx create-precast-app@latest list frameworks" />
              <CodeBlock code="npx create-precast-app@latest list backends" />
              <CodeBlock code="npx create-precast-app@latest list databases" />
              <CodeBlock code="npx create-precast-app@latest list ui-libraries" />
              <CodeBlock code="npx create-precast-app@latest list auth-providers" />
            </div>
          </div>
          <div className="bg-comic-green/10 p-4 rounded-lg border border-comic-green">
            <div className="flex items-center gap-2 mb-2">
              <FaChartBar className="text-comic-green" />
              <h4 className="font-comic font-bold text-comic-green mb-0">Project Info</h4>
            </div>
            <div className="space-y-2 text-sm">
              <CodeBlock code="npx create-precast-app@latest list dependencies" />
              <CodeBlock code="npx create-precast-app@latest list scripts" />
              <CodeBlock code="npx create-precast-app@latest list config" />
              <CodeBlock code="npx create-precast-app@latest list features" />
            </div>
          </div>
        </div>
      </div>

      <div id="list-examples" className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <FaFire className="text-2xl text-comic-green" />
          <h3 className="font-comic text-2xl text-comic-green mb-0">Usage Examples</h3>
        </div>
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <FaSearch className="text-comic-blue" />
              <h4 className="font-comic text-lg font-bold mb-0">Explore Available Options</h4>
            </div>
            <div className="space-y-2">
              <CodeBlock code="npx create-precast-app@latest list frameworks --status" />
              <CodeBlock code="npx create-precast-app@latest list databases --with-orms" />
              <CodeBlock code="npx create-precast-app@latest list --all --verbose" />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <FaFolder className="text-comic-purple" />
              <h4 className="font-comic text-lg font-bold mb-0">Project Analysis</h4>
            </div>
            <div className="space-y-2">
              <CodeBlock code="npx create-precast-app@latest list config --format json" />
              <CodeBlock code="npx create-precast-app@latest list dependencies --outdated" />
              <CodeBlock code="npx create-precast-app@latest list scripts --executable" />
            </div>
          </div>
        </div>
      </div>

      <div id="list-output" className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <FaChartPie className="text-2xl text-comic-orange" />
          <h3 className="font-comic text-2xl text-comic-orange mb-0">Output Formats</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-comic-orange/10 p-4 rounded-lg border border-comic-orange">
            <h4 className="font-comic font-bold mb-2">Table (default)</h4>
            <p className="font-comic text-sm">
              Clean tabular format with colors and status indicators
            </p>
          </div>
          <div className="bg-comic-blue/10 p-4 rounded-lg border border-comic-blue">
            <h4 className="font-comic font-bold mb-2">JSON</h4>
            <p className="font-comic text-sm">Machine-readable format for scripts and automation</p>
          </div>
          <div className="bg-comic-green/10 p-4 rounded-lg border border-comic-green">
            <h4 className="font-comic font-bold mb-2">Tree</h4>
            <p className="font-comic text-sm">
              Hierarchical view showing dependencies and relationships
            </p>
          </div>
        </div>
      </div>

      <div className="bg-comic-yellow/20 p-6 rounded-lg border-2 border-comic-black">
        <div className="flex items-center gap-2 mb-4">
          <FaSearch className="text-lg text-comic-black" />
          <h4 className="font-comic text-lg font-bold mb-0">What You Can Discover</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h5 className="font-comic font-bold mb-2">✅ Production Ready</h5>
            <ul className="font-comic text-sm space-y-1 list-disc list-inside">
              <li>React, Vue, Next.js, Svelte, Astro</li>
              <li>Express, Hono, NestJS</li>
              <li>PostgreSQL, MySQL, MongoDB</li>
              <li>Better Auth, NextAuth, shadcn/ui</li>
            </ul>
          </div>
          <div>
            <h5 className="font-comic font-bold mb-2">🧪 Under Testing</h5>
            <ul className="font-comic text-sm space-y-1 list-disc list-inside">
              <li>Angular, Nuxt, Remix</li>
              <li>Fastify, Supabase, Neon</li>
              <li>Clerk, Material UI</li>
              <li>Mobile frameworks</li>
            </ul>
          </div>
          <div>
            <h5 className="font-comic font-bold mb-2">📅 Coming Soon</h5>
            <ul className="font-comic text-sm space-y-1 list-disc list-inside">
              <li>SolidJS, Auth0, Passport.js</li>
              <li>Convex, Firebase, Turso</li>
              <li>Chakra UI, Ant Design</li>
              <li>React Native, Capacitor</li>
            </ul>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <FaPlug className="text-comic-purple" />
              <h5 className="font-comic font-bold mb-0">New Features</h5>
            </div>
            <ul className="font-comic text-sm space-y-1 list-disc list-inside">
              <li>Plugin system (Stripe, Resend)</li>
              <li>AI integration (Claude MCP)</li>
              <li>Mobile development</li>
              <li>Advanced deployment options</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

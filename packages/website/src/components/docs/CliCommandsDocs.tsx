import { CodeBlock } from "@/features/common";

export function CliCommandsDocs() {
  return (
    <div className="space-y-8">
      <section id="commands" className="comic-panel p-6">
        <h2 className="font-display text-3xl text-comic-blue mb-6">CLI Commands</h2>

        <div className="mb-8">
          <h3 className="font-display text-xl text-comic-black mb-3">Basic Usage</h3>
          <CodeBlock code="npx create-precast-app@latest [project-name] [options]" />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-comic-yellow/20 border-2 border-comic-black">
                <th className="font-display text-left p-3 border-r-2 border-comic-black">Option</th>
                <th className="font-display text-left p-3 border-r-2 border-comic-black">Values</th>
                <th className="font-display text-left p-3">Description</th>
              </tr>
            </thead>
            <tbody className="font-comic">
              <tr className="border-2 border-t-0 border-comic-black">
                <td className="p-3 border-r-2 border-comic-black">
                  <code className="bg-comic-gray/20 px-2 py-1 rounded">-f, --framework</code>
                </td>
                <td className="p-3 border-r-2 border-comic-black text-sm">
                  react, next, vue, nuxt, svelte, solid, angular, remix, astro, vite, vanilla
                </td>
                <td className="p-3 text-sm">Frontend framework</td>
              </tr>
              <tr className="border-2 border-t-0 border-comic-black bg-comic-white/50">
                <td className="p-3 border-r-2 border-comic-black">
                  <code className="bg-comic-gray/20 px-2 py-1 rounded">-b, --backend</code>
                </td>
                <td className="p-3 border-r-2 border-comic-black text-sm">node, none</td>
                <td className="p-3 text-sm">Backend option</td>
              </tr>
              <tr className="border-2 border-t-0 border-comic-black">
                <td className="p-3 border-r-2 border-comic-black">
                  <code className="bg-comic-gray/20 px-2 py-1 rounded">-d, --database</code>
                </td>
                <td className="p-3 border-r-2 border-comic-black text-sm">
                  postgres, mysql, sqlite, mongodb, none
                </td>
                <td className="p-3 text-sm">Database choice</td>
              </tr>
              <tr className="border-2 border-t-0 border-comic-black bg-comic-white/50">
                <td className="p-3 border-r-2 border-comic-black">
                  <code className="bg-comic-gray/20 px-2 py-1 rounded">-o, --orm</code>
                </td>
                <td className="p-3 border-r-2 border-comic-black text-sm">
                  prisma, drizzle, mongoose, none
                </td>
                <td className="p-3 text-sm">ORM/ODM</td>
              </tr>
              <tr className="border-2 border-t-0 border-comic-black">
                <td className="p-3 border-r-2 border-comic-black">
                  <code className="bg-comic-gray/20 px-2 py-1 rounded">-s, --styling</code>
                </td>
                <td className="p-3 border-r-2 border-comic-black text-sm">tailwind, css, scss</td>
                <td className="p-3 text-sm">Styling solution</td>
              </tr>
              <tr className="border-2 border-t-0 border-comic-black bg-comic-white/50">
                <td className="p-3 border-r-2 border-comic-black">
                  <code className="bg-comic-gray/20 px-2 py-1 rounded">-r, --runtime</code>
                </td>
                <td className="p-3 border-r-2 border-comic-black text-sm">node, bun</td>
                <td className="p-3 text-sm">Runtime environment</td>
              </tr>
              <tr className="border-2 border-t-0 border-comic-black">
                <td className="p-3 border-r-2 border-comic-black">
                  <code className="bg-comic-gray/20 px-2 py-1 rounded">-u, --ui-library</code>
                </td>
                <td className="p-3 border-r-2 border-comic-black text-sm">
                  shadcn, daisyui, mui, chakra, antd, mantine, brutalist
                </td>
                <td className="p-3 text-sm">UI component library</td>
              </tr>
              <tr className="border-2 border-t-0 border-comic-black bg-comic-white/50">
                <td className="p-3 border-r-2 border-comic-black">
                  <code className="bg-comic-gray/20 px-2 py-1 rounded">-a, --auth</code>
                </td>
                <td className="p-3 border-r-2 border-comic-black text-sm">
                  better-auth, auth.js, clerk, lucia, passport
                </td>
                <td className="p-3 text-sm">Authentication provider</td>
              </tr>
              <tr className="border-2 border-t-0 border-comic-black">
                <td className="p-3 border-r-2 border-comic-black">
                  <code className="bg-comic-gray/20 px-2 py-1 rounded">--pm</code>
                </td>
                <td className="p-3 border-r-2 border-comic-black text-sm">npm, yarn, pnpm, bun</td>
                <td className="p-3 text-sm">Package manager</td>
              </tr>
              <tr className="border-2 border-t-0 border-comic-black bg-comic-white/50">
                <td className="p-3 border-r-2 border-comic-black">
                  <code className="bg-comic-gray/20 px-2 py-1 rounded">--no-typescript</code>
                </td>
                <td className="p-3 border-r-2 border-comic-black text-sm">-</td>
                <td className="p-3 text-sm">Use JavaScript instead of TypeScript</td>
              </tr>
              <tr className="border-2 border-t-0 border-comic-black">
                <td className="p-3 border-r-2 border-comic-black">
                  <code className="bg-comic-gray/20 px-2 py-1 rounded">--no-git</code>
                </td>
                <td className="p-3 border-r-2 border-comic-black text-sm">-</td>
                <td className="p-3 text-sm">Skip git initialization</td>
              </tr>
              <tr className="border-2 border-t-0 border-comic-black bg-comic-white/50">
                <td className="p-3 border-r-2 border-comic-black">
                  <code className="bg-comic-gray/20 px-2 py-1 rounded">--docker</code>
                </td>
                <td className="p-3 border-r-2 border-comic-black text-sm">-</td>
                <td className="p-3 text-sm">Include Docker configuration</td>
              </tr>
              <tr className="border-2 border-t-0 border-comic-black">
                <td className="p-3 border-r-2 border-comic-black">
                  <code className="bg-comic-gray/20 px-2 py-1 rounded">--install</code>
                </td>
                <td className="p-3 border-r-2 border-comic-black text-sm">-</td>
                <td className="p-3 text-sm">Install dependencies automatically</td>
              </tr>
              <tr className="border-2 border-t-0 border-comic-black bg-comic-white/50">
                <td className="p-3 border-r-2 border-comic-black">
                  <code className="bg-comic-gray/20 px-2 py-1 rounded">-y, --yes</code>
                </td>
                <td className="p-3 border-r-2 border-comic-black text-sm">-</td>
                <td className="p-3 text-sm">Skip all prompts and use defaults</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section id="examples" className="comic-panel p-6">
        <h2 className="font-display text-3xl text-comic-red mb-6">Examples</h2>

        <div className="space-y-4">
          <div>
            <h3 className="font-display text-lg mb-2">Quick Start</h3>
            <CodeBlock code="npx create-precast-app@latest" />
          </div>

          <div>
            <h3 className="font-display text-lg mb-2">With Project Name</h3>
            <CodeBlock code="npx create-precast-app@latest my-app" />
          </div>

          <div>
            <h3 className="font-display text-lg mb-2">Full Stack Application</h3>
            <CodeBlock code="npx create-precast-app@latest my-app --framework=next --database=postgres --orm=prisma --styling=tailwind --install --yes" />
          </div>

          <div>
            <h3 className="font-display text-lg mb-2">Frontend Only</h3>
            <CodeBlock code="npx create-precast-app@latest my-app --framework=react --backend=none --styling=tailwind --yes" />
          </div>
        </div>
      </section>
    </div>
  );
}

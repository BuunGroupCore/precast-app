import { CodeBlock } from "@/features/common";

export function InitCommandDocs() {
  return (
    <section className="comic-panel p-6">
      <h2 id="init-overview" className="font-display text-3xl text-comic-blue mb-6">
        init Command
      </h2>

      <div className="mb-6">
        <p className="font-comic mb-4">
          Create a new Precast project with your chosen technology stack.
        </p>
        <CodeBlock code="npx create-precast-app@latest [project-name] [options]" />
      </div>

      <div id="init-options" className="overflow-x-auto">
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
                prisma, drizzle, mongoose
              </td>
              <td className="p-3 text-sm">ORM/ODM library</td>
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
                shadcn, daisyui, mui, chakra, antd, mantine
              </td>
              <td className="p-3 text-sm">UI component library</td>
            </tr>
            <tr className="border-2 border-t-0 border-comic-black bg-comic-white/50">
              <td className="p-3 border-r-2 border-comic-black">
                <code className="bg-comic-gray/20 px-2 py-1 rounded">-a, --auth</code>
              </td>
              <td className="p-3 border-r-2 border-comic-black text-sm">auth.js, better-auth</td>
              <td className="p-3 text-sm">Authentication provider</td>
            </tr>
            <tr className="border-2 border-t-0 border-comic-black">
              <td className="p-3 border-r-2 border-comic-black">
                <code className="bg-comic-gray/20 px-2 py-1 rounded">-y, --yes</code>
              </td>
              <td className="p-3 border-r-2 border-comic-black text-sm">-</td>
              <td className="p-3 text-sm">Skip all prompts and use defaults</td>
            </tr>
            <tr className="border-2 border-t-0 border-comic-black bg-comic-white/50">
              <td className="p-3 border-r-2 border-comic-black">
                <code className="bg-comic-gray/20 px-2 py-1 rounded">--no-typescript</code>
              </td>
              <td className="p-3 border-r-2 border-comic-black text-sm">-</td>
              <td className="p-3 text-sm">Disable TypeScript</td>
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
              <td className="p-3 text-sm">Install dependencies after project creation</td>
            </tr>
            <tr className="border-2 border-t-0 border-comic-black bg-comic-white/50">
              <td className="p-3 border-r-2 border-comic-black">
                <code className="bg-comic-gray/20 px-2 py-1 rounded">--pm</code>
              </td>
              <td className="p-3 border-r-2 border-comic-black text-sm">npm, yarn, pnpm, bun</td>
              <td className="p-3 text-sm">Package manager to use</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div id="init-examples" className="mt-6">
        <h3 className="font-display text-xl mb-3">Examples</h3>
        <div className="space-y-3">
          <CodeBlock code="npx create-precast-app@latest my-app" />
          <CodeBlock code="npx create-precast-app@latest my-app --framework=next --database=postgres --yes" />
          <CodeBlock code="npx create-precast-app@latest todo-app --ui-library=shadcn --auth=better-auth --docker" />
        </div>
      </div>
    </section>
  );
}

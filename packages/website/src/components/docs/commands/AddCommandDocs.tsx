import { CodeBlock } from "@/features/common";

export function AddCommandDocs() {
  return (
    <section className="comic-panel p-6">
      <h2 id="add-overview" className="font-display text-3xl text-comic-green mb-6">
        add Command
      </h2>

      <div className="mb-6">
        <p className="font-comic mb-4">
          Add new resources to your existing Precast project like components, routes, APIs, hooks,
          and utility functions.
        </p>
        <CodeBlock code="npx create-precast-app@latest add [resource] [options]" />
      </div>

      <div id="add-resources" className="mb-6">
        <h3 className="font-display text-xl mb-3">Available Resources</h3>
        <ul className="font-comic space-y-2 list-disc list-inside">
          <li>
            <code className="bg-comic-gray/20 px-2 py-1 rounded">component</code> - Add a new
            React/Vue/Svelte component
          </li>
          <li>
            <code className="bg-comic-gray/20 px-2 py-1 rounded">route</code> - Add a new route/page
          </li>
          <li>
            <code className="bg-comic-gray/20 px-2 py-1 rounded">api</code> - Add a new API endpoint
          </li>
          <li>
            <code className="bg-comic-gray/20 px-2 py-1 rounded">hook</code> - Add a custom React
            hook
          </li>
          <li>
            <code className="bg-comic-gray/20 px-2 py-1 rounded">util</code> - Add a utility
            function
          </li>
        </ul>
        <p className="font-comic text-sm mt-3 text-comic-gray">
          Note: Currently, only React component generation is fully implemented. Other resources
          coming soon!
        </p>
      </div>

      <div id="add-options" className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-comic-green/20 border-2 border-comic-black">
              <th className="font-display text-left p-3 border-r-2 border-comic-black">Option</th>
              <th className="font-display text-left p-3 border-r-2 border-comic-black">Values</th>
              <th className="font-display text-left p-3">Description</th>
            </tr>
          </thead>
          <tbody className="font-comic">
            <tr className="border-2 border-t-0 border-comic-black">
              <td className="p-3 border-r-2 border-comic-black">
                <code className="bg-comic-gray/20 px-2 py-1 rounded">-n, --name</code>
              </td>
              <td className="p-3 border-r-2 border-comic-black text-sm">string</td>
              <td className="p-3 text-sm">Resource name</td>
            </tr>
            <tr className="border-2 border-t-0 border-comic-black bg-comic-white/50">
              <td className="p-3 border-r-2 border-comic-black">
                <code className="bg-comic-gray/20 px-2 py-1 rounded">--no-typescript</code>
              </td>
              <td className="p-3 border-r-2 border-comic-black text-sm">-</td>
              <td className="p-3 text-sm">Generate JavaScript instead of TypeScript</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div id="add-examples" className="mt-6">
        <h3 className="font-display text-xl mb-3">Examples</h3>
        <div className="space-y-3">
          <CodeBlock code="npx create-precast-app@latest add component --name=Button" />
          <CodeBlock code="npx create-precast-app@latest add hook --name=useAuth" />
          <CodeBlock code="npx create-precast-app@latest add util --name=formatDate --no-typescript" />
        </div>
        <div className="mt-6 bg-comic-yellow/20 p-4 rounded-lg border-2 border-comic-black">
          <h4 className="font-display text-lg mb-2">Component Generation Features</h4>
          <p className="font-comic mb-2">
            When adding a React component, you&apos;ll be prompted for:
          </p>
          <ul className="font-comic space-y-1 list-disc list-inside">
            <li>Include styles (CSS modules)</li>
            <li>Include test file (React Testing Library)</li>
            <li>Include Storybook story</li>
          </ul>
        </div>
      </div>
    </section>
  );
}

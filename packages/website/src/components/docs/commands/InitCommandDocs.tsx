import { CodeBlock } from "@/features/common";
import { generateInitOptions } from "@/utils/cliOptionsGenerator";

export function InitCommandDocs() {
  const options = generateInitOptions();

  return (
    <section className="comic-panel p-6">
      <h2 id="init-overview" className="font-comic text-3xl text-comic-blue mb-6">
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
                  <code className="bg-comic-gray/20 px-2 py-1 rounded">{option.flag}</code>
                </td>
                <td className="p-3 border-r-2 border-comic-black text-sm">{option.values}</td>
                <td className="p-3 text-sm">{option.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div id="init-examples" className="mt-6">
        <h3 className="font-comic text-xl mb-3">Examples</h3>
        <div className="space-y-3">
          <CodeBlock code="npx create-precast-app@latest my-app" />
          <CodeBlock code="npx create-precast-app@latest my-app --framework=next --database=postgres --yes" />
          <CodeBlock code="npx create-precast-app@latest todo-app --ui-library=shadcn --auth=better-auth --docker" />
        </div>
      </div>
    </section>
  );
}

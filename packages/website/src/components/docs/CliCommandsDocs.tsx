import { CodeBlock } from "@/features/common";
import { generateCliOptions } from "@/utils/cliOptionsGenerator";

export function CliCommandsDocs() {
  const options = generateCliOptions();

  return (
    <div className="space-y-8">
      <section id="commands" className="comic-panel p-6">
        <h2 className="font-comic text-3xl text-comic-blue mb-6">CLI Commands</h2>

        <div className="mb-8">
          <h3 className="font-comic text-xl text-comic-black mb-3">Basic Usage</h3>
          <CodeBlock code="npx create-precast-app@latest [project-name] [options]" />
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
                    <code className="bg-comic-gray/20 px-2 py-1 rounded">{option.flag}</code>
                  </td>
                  <td className="p-3 border-r-2 border-comic-black text-sm">{option.values}</td>
                  <td className="p-3 text-sm">{option.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section id="examples" className="comic-panel p-6">
        <h2 className="font-comic text-3xl text-comic-red mb-6">Examples</h2>

        <div className="space-y-4">
          <div>
            <h3 className="font-comic text-lg mb-2">Quick Start</h3>
            <CodeBlock code="npx create-precast-app@latest" />
          </div>

          <div>
            <h3 className="font-comic text-lg mb-2">With Project Name</h3>
            <CodeBlock code="npx create-precast-app@latest my-app" />
          </div>

          <div>
            <h3 className="font-comic text-lg mb-2">Full Stack Application</h3>
            <CodeBlock code="npx create-precast-app@latest my-app --framework=next --database=postgres --orm=prisma --styling=tailwind --install --yes" />
          </div>

          <div>
            <h3 className="font-comic text-lg mb-2">Frontend Only</h3>
            <CodeBlock code="npx create-precast-app@latest my-app --framework=react --backend=none --styling=tailwind --yes" />
          </div>
        </div>
      </section>
    </div>
  );
}

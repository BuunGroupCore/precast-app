import { CodeBlock } from "@/features/common";
import { generateAddFeaturesOptions } from "@/utils/cliOptionsGenerator";

export function AddFeaturesCommandDocs() {
  const options = generateAddFeaturesOptions();

  return (
    <section className="comic-panel p-6">
      <h2 id="add-features-overview" className="font-comic text-3xl text-comic-purple mb-6">
        add-features Command
      </h2>

      <div className="mb-6">
        <p className="font-comic mb-4">
          Add UI component libraries and AI assistance context files to an existing Precast project.
          Detects your current project configuration and installs compatible features.
        </p>
        <CodeBlock code="npx create-precast-app@latest add-features [options]" />
      </div>

      <div id="add-features-options" className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-comic-purple/20 border-2 border-comic-black">
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

      <div id="add-features-examples" className="mt-6">
        <h3 className="font-comic text-xl mb-3">Examples</h3>
        <div className="space-y-3">
          <CodeBlock code="npx create-precast-app@latest add-features --ui=shadcn" />
          <CodeBlock code="npx create-precast-app@latest add-features --ai claude copilot cursor" />
          <CodeBlock code="npx create-precast-app@latest add-features --ui=daisyui --ai=claude --yes" />
        </div>
        <div className="mt-6 bg-comic-purple/20 p-4 rounded-lg border-2 border-comic-black">
          <h4 className="font-comic text-lg mb-2">AI Context Files Generated</h4>
          <ul className="font-comic space-y-1 list-disc list-inside">
            <li>
              <strong>Claude:</strong> .claude/CLAUDE.md - Project context for Claude
            </li>
            <li>
              <strong>Copilot:</strong> .github/copilot-instructions.md - GitHub Copilot
              instructions
            </li>
            <li>
              <strong>Cursor:</strong> .cursorrules - Cursor IDE rules
            </li>
            <li>
              <strong>Gemini:</strong> GEMINI.md - Project context for Gemini
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}

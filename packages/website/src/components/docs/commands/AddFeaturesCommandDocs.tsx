import { CodeBlock } from "../../CodeBlock";

export function AddFeaturesCommandDocs() {
  return (
    <section className="comic-panel p-6">
      <h2 id="add-features-overview" className="font-display text-3xl text-comic-purple mb-6">
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
              <th className="font-display text-left p-3 border-r-2 border-comic-black">Option</th>
              <th className="font-display text-left p-3 border-r-2 border-comic-black">Values</th>
              <th className="font-display text-left p-3">Description</th>
            </tr>
          </thead>
          <tbody className="font-comic">
            <tr className="border-2 border-t-0 border-comic-black">
              <td className="p-3 border-r-2 border-comic-black">
                <code className="bg-comic-gray/20 px-2 py-1 rounded">--ui</code>
              </td>
              <td className="p-3 border-r-2 border-comic-black text-sm">
                shadcn, daisyui, mui, chakra, antd, mantine
              </td>
              <td className="p-3 text-sm">UI component library to add</td>
            </tr>
            <tr className="border-2 border-t-0 border-comic-black bg-comic-white/50">
              <td className="p-3 border-r-2 border-comic-black">
                <code className="bg-comic-gray/20 px-2 py-1 rounded">--ai</code>
              </td>
              <td className="p-3 border-r-2 border-comic-black text-sm">
                claude, copilot, cursor, gemini
              </td>
              <td className="p-3 text-sm">AI assistance context files to generate</td>
            </tr>
            <tr className="border-2 border-t-0 border-comic-black">
              <td className="p-3 border-r-2 border-comic-black">
                <code className="bg-comic-gray/20 px-2 py-1 rounded">-y, --yes</code>
              </td>
              <td className="p-3 border-r-2 border-comic-black text-sm">-</td>
              <td className="p-3 text-sm">Skip all prompts and use defaults</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div id="add-features-examples" className="mt-6">
        <h3 className="font-display text-xl mb-3">Examples</h3>
        <div className="space-y-3">
          <CodeBlock code="npx create-precast-app@latest add-features --ui=shadcn" />
          <CodeBlock code="npx create-precast-app@latest add-features --ai claude copilot cursor" />
          <CodeBlock code="npx create-precast-app@latest add-features --ui=daisyui --ai=claude --yes" />
        </div>
        <div className="mt-6 bg-comic-purple/20 p-4 rounded-lg border-2 border-comic-black">
          <h4 className="font-display text-lg mb-2">AI Context Files Generated</h4>
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

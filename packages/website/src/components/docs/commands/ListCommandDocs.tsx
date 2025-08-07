import { CodeBlock } from "@/features/common";

export function ListCommandDocs() {
  return (
    <section className="comic-panel p-6">
      <h2 id="list-overview" className="font-comic text-3xl text-comic-red mb-6">
        list Command
      </h2>

      <div className="mb-6">
        <p className="font-comic mb-4">
          List all available templates and features supported by Precast.
        </p>
        <CodeBlock code="npx create-precast-app@latest list" />
      </div>

      <div className="bg-comic-red/20 p-4 rounded-lg border-2 border-comic-black">
        <p className="font-comic">
          <strong>Status:</strong> This command is not yet implemented. Currently outputs:
          &quot;List command not yet implemented&quot;
        </p>
      </div>

      <div id="list-future" className="mt-6">
        <h3 className="font-comic text-xl mb-3">Planned Functionality</h3>
        <p className="font-comic mb-4">When implemented, this command will display:</p>
        <ul className="font-comic space-y-2 list-disc list-inside">
          <li>All available framework templates (React, Next.js, Vue, etc.)</li>
          <li>Supported database options (PostgreSQL, MySQL, SQLite, MongoDB)</li>
          <li>Available UI component libraries (shadcn/ui, DaisyUI, MUI, etc.)</li>
          <li>Authentication providers (Auth.js, Better Auth)</li>
          <li>AI assistant integrations (Claude, Copilot, Cursor, Gemini)</li>
          <li>Styling solutions (Tailwind CSS, CSS, SCSS)</li>
          <li>Runtime environments (Node.js, Bun)</li>
        </ul>
        <div className="mt-4 bg-comic-yellow/20 p-3 rounded border border-comic-black">
          <p className="font-comic text-sm">
            <strong>Current workaround:</strong> Use the interactive builder at the homepage or
            check the init command documentation for all available options.
          </p>
        </div>
      </div>
    </section>
  );
}

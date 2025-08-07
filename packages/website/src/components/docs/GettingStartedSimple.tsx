import { CodeBlock } from "@/features/common";

export function GettingStartedSimple() {
  return (
    <div className="space-y-8">
      <section id="installation" className="comic-panel p-6">
        <h2 className="font-display text-3xl text-comic-blue mb-6">Installation</h2>

        <div className="space-y-4">
          <p className="font-comic">Precast requires Node.js 18+ to be installed on your system.</p>

          <div className="bg-comic-yellow/20 p-4 rounded-lg border-2 border-comic-black">
            <h3 className="font-display text-lg mb-2">Quick Start</h3>
            <CodeBlock code="npx create-precast-app@latest" />
          </div>

          <div className="space-y-3">
            <h3 className="font-display text-lg">Alternative Package Managers</h3>
            <CodeBlock
              code={`# Yarn
yarn create precast-app

# pnpm
pnpm create precast-app

# Bun
bun create precast-app`}
            />
          </div>
        </div>
      </section>

      <section id="project-setup" className="comic-panel p-6">
        <h2 className="font-display text-3xl text-comic-green mb-6">Project Setup</h2>

        <div className="space-y-6">
          <div>
            <h3 className="font-display text-lg mb-3">1. Navigate to your project</h3>
            <CodeBlock code="cd my-app" />
          </div>

          <div>
            <h3 className="font-display text-lg mb-3">
              2. Install dependencies (if not auto-installed)
            </h3>
            <CodeBlock code="npm install" />
          </div>

          <div>
            <h3 className="font-display text-lg mb-3">3. Start the development server</h3>
            <CodeBlock code="npm run dev" />
          </div>
        </div>
      </section>

      <section id="next-steps" className="comic-panel p-6">
        <h2 className="font-display text-3xl text-comic-purple mb-6">Next Steps</h2>

        <ul className="font-comic space-y-3 list-disc list-inside">
          <li>
            Edit your code in the <code className="bg-comic-gray/20 px-2 py-1 rounded">src</code>{" "}
            directory
          </li>
          <li>Check the README.md in your project for framework-specific information</li>
          <li>
            Configure your environment variables in{" "}
            <code className="bg-comic-gray/20 px-2 py-1 rounded">.env</code>
          </li>
          <li>
            Run <code className="bg-comic-gray/20 px-2 py-1 rounded">npm run build</code> to build
            for production
          </li>
        </ul>
      </section>
    </div>
  );
}

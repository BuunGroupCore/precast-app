import { CodeBlock } from "@/features/common";

export function GettingStartedDocs() {
  return (
    <div className="space-y-8">
      <section id="overview" className="comic-panel p-6">
        <h2 className="font-comic text-2xl text-comic-blue mb-4">Overview</h2>
        <p className="font-comic mb-4">
          PRECAST is a powerful CLI tool that helps you scaffold modern web applications with your
          preferred technology stack. It&apos;s designed to save you time and ensure best practices
          from the start.
        </p>
        <div className="bg-comic-yellow/20 p-4 rounded-lg border-2 border-comic-black">
          <p className="font-comic font-bold">Key Features:</p>
          <ul className="list-disc list-inside font-comic mt-2 space-y-1">
            <li>Multiple framework support (React, Vue, Angular, etc.)</li>
            <li>Backend integration options</li>
            <li>Database configuration</li>
            <li>TypeScript support</li>
            <li>Docker integration</li>
          </ul>
        </div>
      </section>

      <section id="requirements" className="comic-panel p-6">
        <h2 className="font-comic text-2xl text-comic-green mb-4">Requirements</h2>
        <p className="font-comic mb-4">
          Before you begin, make sure you have the following installed:
        </p>
        <CodeBlock
          code={`Node.js >= 16.0.0
npm >= 7.0.0 (or yarn, pnpm, bun)`}
          language="text"
        />
      </section>

      <section id="quick-start" className="comic-panel p-6">
        <h2 className="font-comic text-2xl text-comic-purple mb-4">Quick Start Guide</h2>
        <p className="font-comic mb-4">Get up and running with PRECAST in just a few minutes:</p>

        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="action-text text-3xl text-comic-red">1</div>
            <div>
              <h3 className="font-comic text-xl text-comic-black mb-2">Run the CLI</h3>
              <CodeBlock code="$ npx create-precast-app my-awesome-app" />
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="action-text text-3xl text-comic-blue">2</div>
            <div>
              <h3 className="font-comic text-xl text-comic-black mb-2">Choose Your Stack</h3>
              <p className="font-comic">
                Select your preferred frontend framework, backend option, database, and styling
                solution from our interactive prompts.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="action-text text-3xl text-comic-green">3</div>
            <div>
              <h3 className="font-comic text-xl text-comic-black mb-2">Start Building!</h3>
              <CodeBlock
                code={`$ cd my-awesome-app
$ npm run dev`}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

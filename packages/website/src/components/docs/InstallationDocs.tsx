import { CodeBlock } from "../CodeBlock";

export function InstallationDocs() {
  return (
    <div className="space-y-8">
      <section id="installation" className="comic-panel p-6">
        <h2 className="font-display text-2xl text-comic-purple mb-4">
          Installation
        </h2>
        <p className="font-comic mb-4">
          You don't need to install PRECAST globally. You can use it directly with npx:
        </p>
        <div className="mb-4">
          <CodeBlock code="$ npx create-precast-app my-app" />
        </div>
        <p className="font-comic mb-4" id="package-managers">
          Or with other package managers:
        </p>
        <div className="space-y-3">
          <CodeBlock code="$ npm create precast-app@latest my-app" />
          <CodeBlock code="$ yarn create precast-app my-app" />
          <CodeBlock code="$ pnpm create precast-app my-app" />
          <CodeBlock code="$ bun create precast-app my-app" />
        </div>
      </section>

      <section id="global-installation" className="comic-panel p-6">
        <h2 className="font-display text-2xl text-comic-red mb-4">
          Global Installation (Optional)
        </h2>
        <p className="font-comic mb-4">
          If you prefer to install PRECAST globally for repeated use:
        </p>
        <div className="mb-4">
          <CodeBlock code="$ npm install -g create-precast-app" />
        </div>
        <p className="font-comic mb-4">
          Then you can use it without npx:
        </p>
        <CodeBlock code="$ create-precast-app my-app" />
      </section>
    </div>
  );
}
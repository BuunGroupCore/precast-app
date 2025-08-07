import { CodeBlock } from "@/features/common";

export function BannerCommandDocs() {
  return (
    <section className="comic-panel p-6">
      <h2 id="banner-overview" className="font-display text-3xl text-comic-orange mb-6">
        banner Command
      </h2>

      <div className="mb-6">
        <p className="font-comic mb-4">
          Create a custom ASCII art banner template file that will be displayed when running Precast
          commands from that directory.
        </p>
        <CodeBlock code="npx create-precast-app@latest banner" />
      </div>

      <div className="mb-6">
        <p className="font-comic">
          This command creates a{" "}
          <code className="bg-comic-gray/20 px-2 py-1 rounded">precast-banner.txt</code> file in
          your current directory with a customizable ASCII art template.
        </p>
      </div>

      <div
        id="banner-how-it-works"
        className="bg-comic-yellow/20 p-4 rounded-lg border-2 border-comic-black"
      >
        <h3 className="font-display text-lg mb-2">How it works</h3>
        <ol className="font-comic space-y-2 list-decimal list-inside">
          <li>Run the banner command to create the precast-banner.txt template file</li>
          <li>Edit the template file with your custom ASCII art</li>
          <li>
            The custom banner will automatically display when running Precast commands from that
            directory
          </li>
          <li>Alternatively, place banner.txt in the CLI installation directory for global use</li>
        </ol>
      </div>

      <div id="banner-example" className="mt-6">
        <h3 className="font-display text-xl mb-3">Example</h3>
        <CodeBlock code="npx create-precast-app@latest banner" />
        <div className="mt-4 bg-comic-gray/10 p-4 rounded-lg border border-comic-black">
          <p className="font-comic text-sm mb-2">Output:</p>
          <CodeBlock
            code="Created banner template at /path/to/your/project/precast-banner.txt
Customize this file with your own ASCII art!"
          />
        </div>
        <p className="font-comic text-sm mt-3">
          The template includes a sample banner that you can replace with your own ASCII art design.
        </p>
      </div>
    </section>
  );
}

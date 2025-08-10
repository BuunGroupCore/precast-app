import { FaDownload, FaTerminal, FaCheck, FaExclamationTriangle } from "react-icons/fa";

import { CodeBlock } from "@/features/common";

/**
 * Installation documentation component
 */
export function InstallationDocs() {
  return (
    <div className="space-y-8">
      <section id="installation" className="comic-panel p-6">
        <div className="flex items-center gap-3 mb-4">
          <FaDownload className="text-2xl text-comic-purple" />
          <h2 className="font-comic text-2xl text-comic-purple mb-0">Installation</h2>
        </div>
        <p className="font-comic mb-4">
          You don&apos;t need to install PRECAST globally. You can use it directly with npx:
        </p>
        <div className="mb-4">
          <CodeBlock code="$ npx create-precast-app@latest my-app" />
        </div>
        <p className="font-comic mb-4" id="package-managers">
          Or with other package managers:
        </p>
        <div className="space-y-3">
          <CodeBlock code="$ npm create precast-app@latest my-app" />
          <CodeBlock code="$ yarn create precast-app@latest my-app" />
          <CodeBlock code="$ pnpm create precast-app@latest my-app" />
          <CodeBlock code="$ bun create precast-app@latest my-app" />
        </div>
        <div className="bg-comic-blue/20 p-4 rounded-lg border-2 border-comic-black mt-4">
          <div className="flex items-center gap-2 mb-2">
            <FaTerminal className="text-comic-blue" />
            <p className="font-comic font-bold text-comic-blue mb-0">Pro Tip</p>
          </div>
          <p className="font-comic text-sm">
            We recommend using <strong>bun</strong> for the fastest installation and package
            management experience.
          </p>
        </div>
      </section>

      <section id="global-installation" className="comic-panel p-6">
        <div className="flex items-center gap-3 mb-4">
          <FaCheck className="text-2xl text-comic-red" />
          <h2 className="font-comic text-2xl text-comic-red mb-0">
            Global Installation (Optional)
          </h2>
        </div>
        <p className="font-comic mb-4">
          If you prefer to install PRECAST globally for repeated use:
        </p>
        <div className="mb-4">
          <CodeBlock code="$ npm install -g create-precast-app" />
        </div>
        <p className="font-comic mb-4">Then you can use it without npx:</p>
        <CodeBlock code="$ create-precast-app my-app" />
      </section>

      <section id="feature-status" className="comic-panel p-6">
        <div className="flex items-center gap-3 mb-4">
          <FaExclamationTriangle className="text-2xl text-comic-green" />
          <h2 className="font-comic text-2xl text-comic-green mb-0">Feature Support Status</h2>
        </div>
        <p className="font-comic mb-4">
          PRECAST supports a wide range of modern web technologies. Here&apos;s the current status
          of all supported tools and frameworks:
        </p>

        <div className="overflow-x-auto">
          <table className="w-full border-2 border-comic-black bg-comic-white">
            <thead>
              <tr className="bg-comic-yellow">
                <th className="border border-comic-black p-3 font-comic text-left">Category</th>
                <th className="border border-comic-black p-3 font-comic text-left">
                  Tool/Framework
                </th>
                <th className="border border-comic-black p-3 font-comic text-center">Status</th>
                <th className="border border-comic-black p-3 font-comic text-left">Notes</th>
              </tr>
            </thead>
            <tbody>
              {/* Frontend Frameworks */}
              <tr>
                <td className="border border-comic-black p-3 font-comic font-bold bg-comic-red/20">
                  Frontend
                </td>
                <td className="border border-comic-black p-3 font-comic">React</td>
                <td className="border border-comic-black p-3 text-center">
                  <span className="px-2 py-1 bg-comic-green text-comic-white text-xs font-bold rounded-full">
                    STABLE
                  </span>
                </td>
                <td className="border border-comic-black p-3 font-comic text-sm">
                  Full support with TypeScript, hooks, and modern patterns
                </td>
              </tr>
              <tr>
                <td className="border border-comic-black p-3 font-comic"></td>
                <td className="border border-comic-black p-3 font-comic">Next.js</td>
                <td className="border border-comic-black p-3 text-center">
                  <span className="px-2 py-1 bg-comic-green text-comic-white text-xs font-bold rounded-full">
                    STABLE
                  </span>
                </td>
                <td className="border border-comic-black p-3 font-comic text-sm">
                  App Router, API routes, middleware support
                </td>
              </tr>
              <tr>
                <td className="border border-comic-black p-3 font-comic"></td>
                <td className="border border-comic-black p-3 font-comic">Vue</td>
                <td className="border border-comic-black p-3 text-center">
                  <span className="px-2 py-1 bg-comic-green text-comic-white text-xs font-bold rounded-full">
                    STABLE
                  </span>
                </td>
                <td className="border border-comic-black p-3 font-comic text-sm">
                  Vue 3 with Composition API and script setup
                </td>
              </tr>
              <tr>
                <td className="border border-comic-black p-3 font-comic"></td>
                <td className="border border-comic-black p-3 font-comic">Svelte</td>
                <td className="border border-comic-black p-3 text-center">
                  <span className="px-2 py-1 bg-comic-green text-comic-white text-xs font-bold rounded-full">
                    STABLE
                  </span>
                </td>
                <td className="border border-comic-black p-3 font-comic text-sm">
                  SvelteKit with modern tooling
                </td>
              </tr>
              <tr>
                <td className="border border-comic-black p-3 font-comic"></td>
                <td className="border border-comic-black p-3 font-comic">Astro</td>
                <td className="border border-comic-black p-3 text-center">
                  <span className="px-2 py-1 bg-comic-green text-comic-white text-xs font-bold rounded-full">
                    STABLE
                  </span>
                </td>
                <td className="border border-comic-black p-3 font-comic text-sm">
                  Static site generation with islands architecture
                </td>
              </tr>
              <tr>
                <td className="border border-comic-black p-3 font-comic"></td>
                <td className="border border-comic-black p-3 font-comic">Vite</td>
                <td className="border border-comic-black p-3 text-center">
                  <span className="px-2 py-1 bg-comic-green text-comic-white text-xs font-bold rounded-full">
                    STABLE
                  </span>
                </td>
                <td className="border border-comic-black p-3 font-comic text-sm">
                  Fast development with HMR and modern tooling
                </td>
              </tr>
              <tr>
                <td className="border border-comic-black p-3 font-comic"></td>
                <td className="border border-comic-black p-3 font-comic">Angular</td>
                <td className="border border-comic-black p-3 text-center">
                  <span className="px-2 py-1 bg-comic-yellow text-comic-black text-xs font-bold rounded-full">
                    TESTING
                  </span>
                </td>
                <td className="border border-comic-black p-3 font-comic text-sm">
                  Under active development and testing
                </td>
              </tr>
              <tr>
                <td className="border border-comic-black p-3 font-comic"></td>
                <td className="border border-comic-black p-3 font-comic">Nuxt</td>
                <td className="border border-comic-black p-3 text-center">
                  <span className="px-2 py-1 bg-comic-yellow text-comic-black text-xs font-bold rounded-full">
                    TESTING
                  </span>
                </td>
                <td className="border border-comic-black p-3 font-comic text-sm">
                  Vue framework with SSR support
                </td>
              </tr>
              <tr>
                <td className="border border-comic-black p-3 font-comic"></td>
                <td className="border border-comic-black p-3 font-comic">Remix</td>
                <td className="border border-comic-black p-3 text-center">
                  <span className="px-2 py-1 bg-comic-yellow text-comic-black text-xs font-bold rounded-full">
                    TESTING
                  </span>
                </td>
                <td className="border border-comic-black p-3 font-comic text-sm">
                  React framework with nested routing
                </td>
              </tr>
              <tr>
                <td className="border border-comic-black p-3 font-comic"></td>
                <td className="border border-comic-black p-3 font-comic">SolidJS</td>
                <td className="border border-comic-black p-3 text-center">
                  <span className="px-2 py-1 bg-comic-blue text-comic-white text-xs font-bold rounded-full">
                    PLANNED
                  </span>
                </td>
                <td className="border border-comic-black p-3 font-comic text-sm">
                  Performant reactive framework - Q1 2026
                </td>
              </tr>

              {/* Backend */}
              <tr>
                <td className="border border-comic-black p-3 font-comic font-bold bg-comic-blue/20">
                  Backend
                </td>
                <td className="border border-comic-black p-3 font-comic">Express</td>
                <td className="border border-comic-black p-3 text-center">
                  <span className="px-2 py-1 bg-comic-green text-comic-white text-xs font-bold rounded-full">
                    STABLE
                  </span>
                </td>
                <td className="border border-comic-black p-3 font-comic text-sm">
                  Minimalist web framework for Node.js
                </td>
              </tr>
              <tr>
                <td className="border border-comic-black p-3 font-comic"></td>
                <td className="border border-comic-black p-3 font-comic">Hono</td>
                <td className="border border-comic-black p-3 text-center">
                  <span className="px-2 py-1 bg-comic-green text-comic-white text-xs font-bold rounded-full">
                    STABLE
                  </span>
                </td>
                <td className="border border-comic-black p-3 font-comic text-sm">
                  Ultrafast web framework for the Edge
                </td>
              </tr>
              <tr>
                <td className="border border-comic-black p-3 font-comic"></td>
                <td className="border border-comic-black p-3 font-comic">NestJS</td>
                <td className="border border-comic-black p-3 text-center">
                  <span className="px-2 py-1 bg-comic-green text-comic-white text-xs font-bold rounded-full">
                    STABLE
                  </span>
                </td>
                <td className="border border-comic-black p-3 font-comic text-sm">
                  Progressive Node.js framework
                </td>
              </tr>
              <tr>
                <td className="border border-comic-black p-3 font-comic"></td>
                <td className="border border-comic-black p-3 font-comic">Fastify</td>
                <td className="border border-comic-black p-3 text-center">
                  <span className="px-2 py-1 bg-comic-yellow text-comic-black text-xs font-bold rounded-full">
                    TESTING
                  </span>
                </td>
                <td className="border border-comic-black p-3 font-comic text-sm">
                  Fast and low overhead web framework
                </td>
              </tr>
              <tr>
                <td className="border border-comic-black p-3 font-comic"></td>
                <td className="border border-comic-black p-3 font-comic">Convex</td>
                <td className="border border-comic-black p-3 text-center">
                  <span className="px-2 py-1 bg-comic-blue text-comic-white text-xs font-bold rounded-full">
                    PLANNED
                  </span>
                </td>
                <td className="border border-comic-black p-3 font-comic text-sm">
                  Backend-as-a-Service with real-time sync - Q1 2026
                </td>
              </tr>

              {/* Databases */}
              <tr>
                <td className="border border-comic-black p-3 font-comic font-bold bg-comic-green/20">
                  Database
                </td>
                <td className="border border-comic-black p-3 font-comic">PostgreSQL</td>
                <td className="border border-comic-black p-3 text-center">
                  <span className="px-2 py-1 bg-comic-green text-comic-white text-xs font-bold rounded-full">
                    STABLE
                  </span>
                </td>
                <td className="border border-comic-black p-3 font-comic text-sm">
                  Advanced open source relational database
                </td>
              </tr>
              <tr>
                <td className="border border-comic-black p-3 font-comic"></td>
                <td className="border border-comic-black p-3 font-comic">MySQL</td>
                <td className="border border-comic-black p-3 text-center">
                  <span className="px-2 py-1 bg-comic-green text-comic-white text-xs font-bold rounded-full">
                    STABLE
                  </span>
                </td>
                <td className="border border-comic-black p-3 font-comic text-sm">
                  World&apos;s most popular open source database
                </td>
              </tr>
              <tr>
                <td className="border border-comic-black p-3 font-comic"></td>
                <td className="border border-comic-black p-3 font-comic">MongoDB</td>
                <td className="border border-comic-black p-3 text-center">
                  <span className="px-2 py-1 bg-comic-green text-comic-white text-xs font-bold rounded-full">
                    STABLE
                  </span>
                </td>
                <td className="border border-comic-black p-3 font-comic text-sm">
                  Most popular NoSQL database
                </td>
              </tr>
              <tr>
                <td className="border border-comic-black p-3 font-comic"></td>
                <td className="border border-comic-black p-3 font-comic">Supabase</td>
                <td className="border border-comic-black p-3 text-center">
                  <span className="px-2 py-1 bg-comic-yellow text-comic-black text-xs font-bold rounded-full">
                    TESTING
                  </span>
                </td>
                <td className="border border-comic-black p-3 font-comic text-sm">
                  Open source Firebase alternative
                </td>
              </tr>
              <tr>
                <td className="border border-comic-black p-3 font-comic"></td>
                <td className="border border-comic-black p-3 font-comic">Neon</td>
                <td className="border border-comic-black p-3 text-center">
                  <span className="px-2 py-1 bg-comic-yellow text-comic-black text-xs font-bold rounded-full">
                    TESTING
                  </span>
                </td>
                <td className="border border-comic-black p-3 font-comic text-sm">
                  Serverless Postgres with branching
                </td>
              </tr>

              {/* Authentication */}
              <tr>
                <td className="border border-comic-black p-3 font-comic font-bold bg-comic-orange/20">
                  Auth
                </td>
                <td className="border border-comic-black p-3 font-comic">Better Auth</td>
                <td className="border border-comic-black p-3 text-center">
                  <span className="px-2 py-1 bg-comic-green text-comic-white text-xs font-bold rounded-full">
                    STABLE
                  </span>
                </td>
                <td className="border border-comic-black p-3 font-comic text-sm">
                  Modern authentication library
                </td>
              </tr>
              <tr>
                <td className="border border-comic-black p-3 font-comic"></td>
                <td className="border border-comic-black p-3 font-comic">NextAuth</td>
                <td className="border border-comic-black p-3 text-center">
                  <span className="px-2 py-1 bg-comic-green text-comic-white text-xs font-bold rounded-full">
                    STABLE
                  </span>
                </td>
                <td className="border border-comic-black p-3 font-comic text-sm">
                  Authentication for Next.js
                </td>
              </tr>
              <tr>
                <td className="border border-comic-black p-3 font-comic"></td>
                <td className="border border-comic-black p-3 font-comic">Clerk</td>
                <td className="border border-comic-black p-3 text-center">
                  <span className="px-2 py-1 bg-comic-yellow text-comic-black text-xs font-bold rounded-full">
                    TESTING
                  </span>
                </td>
                <td className="border border-comic-black p-3 font-comic text-sm">
                  Complete user management solution
                </td>
              </tr>
              <tr>
                <td className="border border-comic-black p-3 font-comic"></td>
                <td className="border border-comic-black p-3 font-comic">Auth0</td>
                <td className="border border-comic-black p-3 text-center">
                  <span className="px-2 py-1 bg-comic-blue text-comic-white text-xs font-bold rounded-full">
                    PLANNED
                  </span>
                </td>
                <td className="border border-comic-black p-3 font-comic text-sm">
                  Identity platform - Q1 2026
                </td>
              </tr>

              {/* UI Libraries */}
              <tr>
                <td className="border border-comic-black p-3 font-comic font-bold bg-comic-purple/20">
                  UI Libraries
                </td>
                <td className="border border-comic-black p-3 font-comic">shadcn/ui</td>
                <td className="border border-comic-black p-3 text-center">
                  <span className="px-2 py-1 bg-comic-green text-comic-white text-xs font-bold rounded-full">
                    STABLE
                  </span>
                </td>
                <td className="border border-comic-black p-3 font-comic text-sm">
                  Copy-paste React components
                </td>
              </tr>
              <tr>
                <td className="border border-comic-black p-3 font-comic"></td>
                <td className="border border-comic-black p-3 font-comic">DaisyUI</td>
                <td className="border border-comic-black p-3 text-center">
                  <span className="px-2 py-1 bg-comic-green text-comic-white text-xs font-bold rounded-full">
                    STABLE
                  </span>
                </td>
                <td className="border border-comic-black p-3 font-comic text-sm">
                  Semantic component classes for Tailwind
                </td>
              </tr>
              <tr>
                <td className="border border-comic-black p-3 font-comic"></td>
                <td className="border border-comic-black p-3 font-comic">Material UI</td>
                <td className="border border-comic-black p-3 text-center">
                  <span className="px-2 py-1 bg-comic-yellow text-comic-black text-xs font-bold rounded-full">
                    TESTING
                  </span>
                </td>
                <td className="border border-comic-black p-3 font-comic text-sm">
                  Google&apos;s Material Design components
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-comic-green/20 p-3 rounded-lg border border-comic-green">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-1 bg-comic-green text-comic-white text-xs font-bold rounded-full">
                STABLE
              </span>
              <span className="font-comic font-bold">Production Ready</span>
            </div>
            <p className="font-comic text-sm">Fully tested and ready for production use</p>
          </div>
          <div className="bg-comic-yellow/20 p-3 rounded-lg border border-comic-yellow">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-1 bg-comic-yellow text-comic-black text-xs font-bold rounded-full">
                TESTING
              </span>
              <span className="font-comic font-bold">Under Testing</span>
            </div>
            <p className="font-comic text-sm">Available but requires thorough testing</p>
          </div>
          <div className="bg-comic-blue/20 p-3 rounded-lg border border-comic-blue">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-1 bg-comic-blue text-comic-white text-xs font-bold rounded-full">
                PLANNED
              </span>
              <span className="font-comic font-bold">Coming Soon</span>
            </div>
            <p className="font-comic text-sm">In development, expected release noted</p>
          </div>
        </div>
      </section>

      <section id="system-requirements" className="comic-panel p-6">
        <h2 className="font-comic text-2xl text-comic-orange mb-4">System Requirements</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-comic text-lg font-bold mb-2">Minimum Requirements</h3>
            <ul className="list-disc list-inside font-comic space-y-1">
              <li>Node.js 18.0.0+</li>
              <li>npm 8.0.0+ (or equivalent)</li>
              <li>4GB RAM</li>
              <li>2GB free disk space</li>
            </ul>
          </div>
          <div>
            <h3 className="font-comic text-lg font-bold mb-2">Recommended</h3>
            <ul className="list-disc list-inside font-comic space-y-1">
              <li>Node.js 20.0.0+</li>
              <li>Bun 1.0.0+ (fastest package manager)</li>
              <li>8GB RAM</li>
              <li>5GB free disk space</li>
              <li>Git 2.0.0+</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}

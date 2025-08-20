import {
  FaRocket,
  FaTerminal,
  FaCheckCircle,
  FaInfoCircle,
  FaBook,
  FaPalette,
  FaPlug,
  FaCloudUploadAlt,
  FaCircle,
} from "react-icons/fa";
import { FaDiscord, FaGithub } from "react-icons/fa";

import { CodeBlock } from "@/features/common";

export function GettingStartedProfessional() {
  return (
    <div className="space-y-8">
      {/* Installation Section */}
      <section
        id="installation"
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-8"
      >
        <div className="flex items-center gap-3 mb-6">
          <FaRocket className="text-2xl text-blue-600" />
          <h2
            className="text-3xl font-semibold text-gray-900 mb-0"
            style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
          >
            Installation
          </h2>
        </div>

        <div className="space-y-6">
          <p
            className="text-gray-700 leading-relaxed"
            style={{ fontSize: "16px", lineHeight: "1.7" }}
          >
            Precast requires Node.js 18+ to be installed on your system. Get started with a single
            command:
          </p>

          <div className="bg-blue-50 border-l-4 border-blue-500 p-5 rounded-r">
            <div className="flex items-center gap-2 mb-3">
              <FaTerminal className="text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900 mb-0">Quick Start</h3>
            </div>
            <CodeBlock code="npx create-precast-app@latest" />
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Alternative Package Managers</h3>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <CodeBlock
                code={`# Using Yarn
yarn create precast-app

# Using pnpm
pnpm create precast-app

# Using Bun (recommended for speed)
bun create precast-app`}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Project Setup Section */}
      <section
        id="project-setup"
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-8"
      >
        <div className="flex items-center gap-3 mb-6">
          <FaTerminal className="text-2xl text-green-600" />
          <h2
            className="text-3xl font-semibold text-gray-900 mb-0"
            style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
          >
            Project Setup
          </h2>
        </div>

        <div className="space-y-6">
          <p
            className="text-gray-700 leading-relaxed"
            style={{ fontSize: "16px", lineHeight: "1.7" }}
          >
            Follow these steps to get your project up and running:
          </p>

          <div className="space-y-5">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold">
                1
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Navigate to your project
                </h3>
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                  <CodeBlock code="cd my-app" />
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold">
                2
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Install dependencies
                  <span className="text-sm font-normal text-gray-500 ml-2">
                    (if not auto-installed)
                  </span>
                </h3>
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                  <CodeBlock code="npm install" />
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold">
                3
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Start the development server
                </h3>
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                  <CodeBlock code="npm run dev" />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-5 mt-6">
            <div className="flex gap-3">
              <FaCheckCircle className="text-green-600 text-xl flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-green-900 font-semibold mb-1">Success!</p>
                <p className="text-green-700 text-sm">
                  Your app should now be running at{" "}
                  <code className="bg-green-100 px-2 py-0.5 rounded">http://localhost:3000</code>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Next Steps Section */}
      <section id="next-steps" className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="flex items-center gap-3 mb-6">
          <FaInfoCircle className="text-2xl text-purple-600" />
          <h2
            className="text-3xl font-semibold text-gray-900 mb-0"
            style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
          >
            Next Steps
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-lg p-5 border border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <FaBook className="text-blue-600" />
              <h3 className="font-semibold text-gray-900">Learn the Basics</h3>
            </div>
            <p className="text-gray-700 text-sm leading-relaxed">
              Explore the project structure and understand how everything fits together.
            </p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100/50 rounded-lg p-5 border border-green-200">
            <div className="flex items-center gap-2 mb-2">
              <FaPalette className="text-green-600" />
              <h3 className="font-semibold text-gray-900">Customize Your App</h3>
            </div>
            <p className="text-gray-700 text-sm leading-relaxed">
              Modify the theme, add components, and make it uniquely yours.
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-lg p-5 border border-purple-200">
            <div className="flex items-center gap-2 mb-2">
              <FaPlug className="text-purple-600" />
              <h3 className="font-semibold text-gray-900">Add Features</h3>
            </div>
            <p className="text-gray-700 text-sm leading-relaxed">
              Use the CLI to add authentication, databases, and more with a single command.
            </p>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-orange-100/50 rounded-lg p-5 border border-orange-200">
            <div className="flex items-center gap-2 mb-2">
              <FaCloudUploadAlt className="text-orange-600" />
              <h3 className="font-semibold text-gray-900">Deploy Your App</h3>
            </div>
            <p className="text-gray-700 text-sm leading-relaxed">
              Deploy to Vercel, Netlify, or your preferred hosting platform.
            </p>
          </div>
        </div>

        <div className="mt-8 p-5 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-3">Need Help?</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <FaCircle className="text-blue-600 mt-1 text-xs" />
              <span>
                Check out our{" "}
                <a href="/docs" className="text-blue-600 hover:text-blue-700 underline">
                  comprehensive documentation
                </a>
              </span>
            </li>
            <li className="flex items-start gap-2">
              <FaCircle className="text-blue-600 mt-1 text-xs" />
              <span className="flex items-center gap-1">
                Join our <FaDiscord className="inline text-blue-600" />{" "}
                <a
                  href="https://discord.gg/4Wen9Pg3rG"
                  className="text-blue-600 hover:text-blue-700 underline"
                >
                  Discord community
                </a>
              </span>
            </li>
            <li className="flex items-start gap-2">
              <FaCircle className="text-blue-600 mt-1 text-xs" />
              <span className="flex items-center gap-1">
                Report issues on <FaGithub className="inline text-blue-600" />{" "}
                <a
                  href="https://github.com/BuunGroup/precast-app"
                  className="text-blue-600 hover:text-blue-700 underline"
                >
                  GitHub
                </a>
              </span>
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
}

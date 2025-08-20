import {
  FaGithub,
  FaCode,
  FaBug,
  FaLightbulb,
  FaHandsHelping,
  FaRocket,
  FaBook,
  FaUsers,
  FaCheckCircle,
  FaExternalLinkAlt,
  FaTerminal,
  FaCodeBranch,
  FaHeart,
  FaPlay,
  FaCogs,
  FaTools,
  FaClone,
  FaFileCode,
  FaDiscord,
  FaNewspaper,
  FaRoute,
  FaStar,
} from "react-icons/fa";

import { CodeBlock } from "@/features/common";

/**
 * Developer home page with quick actions and resources
 */
export function DeveloperHomeDocs() {
  const quickActions = [
    {
      title: "Fork Repository",
      description: "Start contributing by forking the main repository",
      icon: <FaCodeBranch className="text-blue-600" />,
      action: "Fork on GitHub",
      href: "https://github.com/BuunGroupCore/precast-app/fork",
      color: "blue",
    },
    {
      title: "Clone & Setup",
      description: "Get the codebase running locally in minutes",
      icon: <FaClone className="text-green-600" />,
      action: "Quick Setup",
      href: "#quick-setup",
      color: "green",
    },
    {
      title: "Report Bug",
      description: "Found an issue? Report it with our template",
      icon: <FaBug className="text-red-600" />,
      action: "Create Issue",
      href: "https://github.com/BuunGroupCore/precast-app/issues/new?template=bug_report.md",
      color: "red",
    },
    {
      title: "Join Discussions",
      description: "Connect with the community and ask questions",
      icon: <FaUsers className="text-purple-600" />,
      action: "Join Now",
      href: "https://github.com/BuunGroupCore/precast-app/discussions",
      color: "purple",
    },
    {
      title: "View Roadmap",
      description: "See what features are coming next",
      icon: <FaRoute className="text-indigo-600" />,
      action: "View Roadmap",
      href: "https://github.com/BuunGroupCore/precast-app/milestones",
      color: "indigo",
    },
    {
      title: "Read Docs",
      description: "Comprehensive guides and API documentation",
      icon: <FaBook className="text-orange-600" />,
      action: "Browse Docs",
      href: "/docs",
      color: "orange",
    },
  ];

  const contributionAreas = [
    {
      title: "Core CLI",
      description: "Enhance the command-line interface and project generation",
      icon: <FaTerminal className="text-blue-600" />,
      tasks: [
        "Add new framework support",
        "Improve error handling",
        "Optimize performance",
        "Add new CLI commands",
      ],
      difficulty: "Intermediate to Advanced",
      languages: ["TypeScript", "Node.js"],
    },
    {
      title: "Web Builder",
      description: "Visual project builder and documentation website",
      icon: <FaRocket className="text-green-600" />,
      tasks: [
        "UI/UX improvements",
        "New builder features",
        "Documentation updates",
        "Component library",
      ],
      difficulty: "Beginner to Intermediate",
      languages: ["React", "TypeScript", "Tailwind CSS"],
    },
    {
      title: "Templates & Generators",
      description: "Project templates and code generation logic",
      icon: <FaFileCode className="text-purple-600" />,
      tasks: [
        "New framework templates",
        "Template optimization",
        "Generator improvements",
        "Template testing",
      ],
      difficulty: "Intermediate",
      languages: ["TypeScript", "Handlebars", "Various Frameworks"],
    },
    {
      title: "Testing & QA",
      description: "Test coverage, quality assurance, and automation",
      icon: <FaCheckCircle className="text-orange-600" />,
      tasks: [
        "Unit test coverage",
        "E2E test scenarios",
        "Performance testing",
        "CI/CD improvements",
      ],
      difficulty: "Beginner to Advanced",
      languages: ["TypeScript", "Vitest", "Playwright"],
    },
  ];

  const resources = [
    {
      title: "Architecture Guide",
      description: "Understand the codebase structure and design patterns",
      icon: <FaCode className="text-blue-600" />,
      href: "/docs/developers/architecture",
    },
    {
      title: "API Reference",
      description: "Complete API documentation for all packages",
      icon: <FaBook className="text-green-600" />,
      href: "/docs/api",
    },
    {
      title: "Testing Guide",
      description: "How to write and run tests effectively",
      icon: <FaCheckCircle className="text-purple-600" />,
      href: "/docs/developers/testing",
    },
    {
      title: "Release Process",
      description: "How we release new versions and manage changes",
      icon: <FaNewspaper className="text-orange-600" />,
      href: "/docs/developers/releases",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-700 rounded-lg text-white p-8">
        <div className="max-w-4xl">
          <div className="flex items-center gap-3 mb-4">
            <FaHandsHelping className="text-3xl" />
            <h1
              className="text-3xl font-bold mb-0"
              style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
            >
              Developer Hub
            </h1>
          </div>
          <p className="text-xl leading-relaxed mb-6 text-blue-100">
            Welcome to the PRECAST developer community! Join us in building the future of web
            development tooling. Whether you&apos;re fixing bugs, adding features, or improving docs
            - every contribution matters.
          </p>
          <div className="flex flex-wrap gap-4">
            <a
              href="https://github.com/BuunGroupCore/precast-app"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors duration-200 inline-flex items-center gap-2"
            >
              <FaGithub /> View on GitHub
            </a>
            <a
              href="/docs/developers/contributing"
              className="bg-blue-500 hover:bg-blue-400 px-6 py-3 rounded-lg font-semibold transition-colors duration-200 inline-flex items-center gap-2"
            >
              <FaRocket /> Start Contributing
            </a>
          </div>
        </div>
      </section>

      {/* Quick Actions Grid */}
      <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="flex items-center gap-3 mb-6">
          <FaPlay className="text-2xl text-blue-600" />
          <h2
            className="text-2xl font-semibold text-gray-900 mb-0"
            style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
          >
            Quick Actions
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quickActions.map((action, index) => (
            <div
              key={index}
              className={`bg-${action.color}-50 border border-${action.color}-200 p-6 rounded-lg hover:shadow-md transition-all duration-200 group`}
            >
              <div className="flex items-center gap-3 mb-3">
                {action.icon}
                <h3 className="text-lg font-semibold text-gray-900">{action.title}</h3>
              </div>
              <p className="text-gray-700 text-sm leading-relaxed mb-4">{action.description}</p>
              <a
                href={action.href}
                target={action.href.startsWith("http") ? "_blank" : undefined}
                rel={action.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className={`text-${action.color}-600 hover:text-${action.color}-800 font-medium text-sm inline-flex items-center gap-1 group-hover:gap-2 transition-all duration-200`}
              >
                {action.action}
                {action.href.startsWith("http") ? (
                  <FaExternalLinkAlt className="text-xs" />
                ) : (
                  <span>→</span>
                )}
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* Quick Setup Section */}
      <section
        id="quick-setup"
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-8"
      >
        <div className="flex items-center gap-3 mb-6">
          <FaCogs className="text-2xl text-green-600" />
          <h2
            className="text-2xl font-semibold text-gray-900 mb-0"
            style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
          >
            Quick Setup Guide
          </h2>
        </div>

        <p className="text-gray-700 leading-relaxed mb-6">
          Get the PRECAST development environment running in under 5 minutes:
        </p>

        <div className="space-y-6">
          <div className="bg-green-50 border border-green-200 p-6 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <div className="bg-green-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">
                1
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-0">Clone Repository</h3>
            </div>
            <div className="bg-white rounded p-4 border border-gray-200">
              <CodeBlock
                code={`git clone https://github.com/BuunGroupCore/precast-app.git
cd precast-app`}
              />
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <div className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">
                2
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-0">Install Dependencies</h3>
            </div>
            <div className="bg-white rounded p-4 border border-gray-200">
              <CodeBlock
                code={`bun install
bun run build`}
              />
            </div>
          </div>

          <div className="bg-purple-50 border border-purple-200 p-6 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <div className="bg-purple-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">
                3
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-0">Start Developing</h3>
            </div>
            <div className="bg-white rounded p-4 border border-gray-200">
              <CodeBlock code="bun dev" />
            </div>
          </div>
        </div>

        <div className="mt-6 bg-blue-50 border border-blue-200 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <FaLightbulb className="text-blue-600" />
            <h4 className="font-semibold text-gray-900 mb-0">Pro Tip</h4>
          </div>
          <p className="text-sm text-gray-700">
            Use <code className="bg-blue-100 px-1.5 py-0.5 rounded">bun</code> instead of npm for 3x
            faster installs. Don&apos;t have Bun? Install it with:{" "}
            <code className="bg-blue-100 px-1.5 py-0.5 rounded">
              curl -fsSL https://bun.sh/install | bash
            </code>
          </p>
        </div>
      </section>

      {/* Contribution Areas */}
      <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="flex items-center gap-3 mb-6">
          <FaTools className="text-2xl text-indigo-600" />
          <h2
            className="text-2xl font-semibold text-gray-900 mb-0"
            style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
          >
            Contribution Areas
          </h2>
        </div>

        <p className="text-gray-700 leading-relaxed mb-6">
          Find the perfect area to contribute based on your skills and interests:
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {contributionAreas.map((area, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-center gap-3 mb-4">
                {area.icon}
                <h3 className="text-lg font-semibold text-gray-900">{area.title}</h3>
              </div>

              <p className="text-gray-700 text-sm leading-relaxed mb-4">{area.description}</p>

              <div className="space-y-3">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Current Tasks:</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    {area.tasks.map((task, taskIndex) => (
                      <li key={taskIndex} className="flex items-start gap-2">
                        <span className="text-green-600 mt-1">•</span>
                        <span>{task}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                  <div>
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Difficulty
                    </span>
                    <div className="text-sm font-medium text-gray-900">{area.difficulty}</div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Technologies
                    </span>
                    <div className="text-sm font-medium text-gray-900">
                      {area.languages.join(", ")}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Resources Section */}
      <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="flex items-center gap-3 mb-6">
          <FaBook className="text-2xl text-orange-600" />
          <h2
            className="text-2xl font-semibold text-gray-900 mb-0"
            style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
          >
            Developer Resources
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {resources.map((resource, index) => (
            <div
              key={index}
              className="bg-gray-50 border border-gray-200 p-6 rounded-lg hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-center gap-3 mb-3">
                {resource.icon}
                <h3 className="text-lg font-semibold text-gray-900">{resource.title}</h3>
              </div>
              <p className="text-gray-700 text-sm leading-relaxed mb-4">{resource.description}</p>
              <a
                href={resource.href}
                className="text-blue-600 hover:text-blue-800 font-medium text-sm inline-flex items-center gap-1"
              >
                Read More →
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* Community Section */}
      <section className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg border border-purple-200 p-8">
        <div className="flex items-center gap-3 mb-6">
          <FaUsers className="text-2xl text-purple-600" />
          <h2 className="text-2xl font-semibold text-gray-900 mb-0">Join Our Community</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center gap-3 mb-3">
              <FaGithub className="text-gray-900 text-xl" />
              <h3 className="font-semibold text-gray-900">GitHub</h3>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed mb-3">
              Main hub for code, issues, discussions, and pull requests.
            </p>
            <div className="flex flex-wrap gap-2">
              <a
                href="https://github.com/BuunGroupCore/precast-app"
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-600 hover:text-purple-800 text-sm font-medium inline-flex items-center gap-1"
              >
                Repository <FaExternalLinkAlt className="text-xs" />
              </a>
              <span className="text-gray-400">•</span>
              <a
                href="https://github.com/BuunGroupCore/precast-app/discussions"
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-600 hover:text-purple-800 text-sm font-medium inline-flex items-center gap-1"
              >
                Discussions <FaExternalLinkAlt className="text-xs" />
              </a>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center gap-3 mb-3">
              <FaDiscord className="text-indigo-600 text-xl" />
              <h3 className="font-semibold text-gray-900">Discord</h3>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed mb-3">
              Real-time chat with maintainers and community members.
            </p>
            <a
              href="https://discord.gg/4Wen9Pg3rG"
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-600 hover:text-purple-800 text-sm font-medium inline-flex items-center gap-1"
            >
              Join Server <FaExternalLinkAlt className="text-xs" />
            </a>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center gap-3 mb-3">
              <FaStar className="text-yellow-500 text-xl" />
              <h3 className="font-semibold text-gray-900">Star & Watch</h3>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed mb-3">
              Stay updated with releases and show your support.
            </p>
            <a
              href="https://github.com/BuunGroupCore/precast-app"
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-600 hover:text-purple-800 text-sm font-medium inline-flex items-center gap-1"
            >
              Star on GitHub <FaExternalLinkAlt className="text-xs" />
            </a>
          </div>
        </div>
      </section>

      {/* Recognition Section */}
      <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="flex items-center gap-3 mb-6">
          <FaHeart className="text-2xl text-red-600" />
          <h2
            className="text-2xl font-semibold text-gray-900 mb-0"
            style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
          >
            Recognition & Rewards
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-red-50 border border-red-200 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">🏆 Contributor Spotlight</h3>
            <p className="text-gray-700 text-sm leading-relaxed">
              Outstanding contributors are featured in our README, release notes, and social media.
              Your contributions help thousands of developers worldwide!
            </p>
          </div>

          <div className="bg-purple-50 border border-purple-200 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">📚 Learning Opportunities</h3>
            <p className="text-gray-700 text-sm leading-relaxed">
              Work directly with experienced maintainers, learn modern development practices, and
              build features used by the global development community.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

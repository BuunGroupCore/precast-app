import {
  FaRocket,
  FaPlus,
  FaTerminal,
  FaList,
  FaDatabase,
  FaInfoCircle,
  FaCloud,
  FaSync,
  FaChartLine,
  FaCog,
} from "react-icons/fa";

import { FEATURES } from "@/config/constants";
import { CodeBlock } from "@/features/common";

interface CliCommandsDocsProps {
  onNavigateToCommand?: (command: string) => void;
}

/**
 * Complete CLI commands documentation with professional styling
 */
export function CliCommandsDocs({ onNavigateToCommand }: CliCommandsDocsProps) {
  const commands = [
    {
      name: "init",
      icon: FaRocket,
      color: "blue",
      description: "Create new projects with your chosen technology stack",
      usage: "bunx create-precast-app@latest [project-name] [options]",
      features: [
        "Interactive setup wizard",
        "Multiple framework support",
        "Full-stack configuration",
        "Modern tooling included",
      ],
    },
    {
      name: "add",
      icon: FaPlus,
      color: "green",
      description: "Add components, pages, and features to existing projects",
      usage: "bunx create-precast-app@latest add [resource] [options]",
      features: [
        "Component generation",
        "Feature integration",
        "Template-based creation",
        "Smart file placement",
      ],
    },
    {
      name: "status",
      icon: FaInfoCircle,
      color: "purple",
      description: "Display project health, configuration, and diagnostic information",
      usage: "bunx create-precast-app@latest status [path]",
      features: [
        "Health checks",
        "Configuration validation",
        "Dependency analysis",
        "Environment status",
      ],
    },
    {
      name: "deploy",
      icon: FaCloud,
      color: "orange",
      description: "Manage Docker services and deployment for your project",
      usage: "bunx create-precast-app@latest deploy [options]",
      features: [
        "Docker automation",
        "Service management",
        "Environment setup",
        "One-command deployment",
      ],
    },
    {
      name: "generate",
      icon: FaDatabase,
      color: "indigo",
      description: "Generate ORM clients, database schemas, and shared types",
      usage: "bunx create-precast-app@latest generate [options]",
      features: [
        "ORM client generation",
        "Type generation",
        "Schema validation",
        "Cross-platform support",
      ],
    },
    {
      name: "turbo",
      icon: FaSync,
      color: "red",
      description: "Enhanced Turbo build system with interactive dashboard",
      usage: "bunx create-precast-app@latest turbo [subcommand]",
      features: [
        "Interactive TUI",
        "Build optimization",
        "Parallel execution",
        "Real-time monitoring",
      ],
    },
    {
      name: "list",
      icon: FaList,
      color: "teal",
      description: "Browse available components, features, and integrations",
      usage: "bunx create-precast-app@latest list [options]",
      features: [
        "Feature discovery",
        "Category filtering",
        "Search functionality",
        "Multiple display formats",
      ],
    },
    {
      name: "telemetry",
      icon: FaChartLine,
      color: "gray",
      description: "Manage anonymous usage analytics and telemetry settings",
      usage: "bunx create-precast-app@latest telemetry [action]",
      features: ["Privacy controls", "Usage analytics", "Anonymous data", "Easy opt-out"],
    },
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: "text-blue-600 bg-blue-50 border-blue-200",
      green: "text-green-600 bg-green-50 border-green-200",
      purple: "text-purple-600 bg-purple-50 border-purple-200",
      orange: "text-orange-600 bg-orange-50 border-orange-200",
      indigo: "text-indigo-600 bg-indigo-50 border-indigo-200",
      red: "text-red-600 bg-red-50 border-red-200",
      teal: "text-teal-600 bg-teal-50 border-teal-200",
      gray: "text-gray-600 bg-gray-50 border-gray-200",
    };
    return colors[color as keyof typeof colors] || colors.gray;
  };

  return (
    <div className="space-y-8">
      {/* Overview Section */}
      <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="flex items-center gap-3 mb-6">
          <FaTerminal className="text-3xl text-blue-600" />
          <h1
            className="text-3xl font-semibold text-gray-900 mb-0"
            style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
          >
            CLI Commands Reference
          </h1>
        </div>

        <div className="mb-8">
          <p
            className="text-gray-700 leading-relaxed mb-4"
            style={{ fontSize: "16px", lineHeight: "1.7" }}
          >
            PRECAST provides a comprehensive set of CLI commands to create, extend, and manage your
            projects. All commands support both interactive prompts and command-line flags for
            automation.
          </p>

          <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <FaRocket className="text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900 mb-0">Quick Start</h3>
            </div>
            <p className="text-sm text-gray-700 mb-3">
              New to PRECAST? Start with the init command to create your first project:
            </p>
            <CodeBlock code="bunx create-precast-app@latest my-app --install" />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900">8</div>
            <div className="text-sm text-gray-600">Commands</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900">50+</div>
            <div className="text-sm text-gray-600">Options</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900">15+</div>
            <div className="text-sm text-gray-600">Frameworks</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900">100%</div>
            <div className="text-sm text-gray-600">TypeScript</div>
          </div>
        </div>
      </section>

      {/* Commands Grid */}
      <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="flex items-center gap-3 mb-6">
          <FaCog className="text-2xl text-gray-600" />
          <h2
            className="text-2xl font-semibold text-gray-900 mb-0"
            style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
          >
            Available Commands
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {commands
            .filter((command) => {
              if (command.name === "list" && !FEATURES.SHOW_LIST_COMMAND_DOCS) return false;
              if (command.name === "add" && !FEATURES.SHOW_ADD_COMMAND_DOCS) return false;
              return true;
            })
            .map((command) => {
              const IconComponent = command.icon;
              const colorClasses = getColorClasses(command.color);

              return (
                <div
                  key={command.name}
                  className={`border rounded-lg p-6 hover:shadow-md transition-shadow duration-200 ${colorClasses}`}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <IconComponent
                      className={`text-2xl ${command.color === "gray" ? "text-gray-600" : `text-${command.color}-600`}`}
                    />
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">{command.name}</h3>
                      <p className="text-sm text-gray-600">{command.description}</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-medium text-gray-900 mb-2">Usage:</h4>
                    <div className="bg-white rounded p-3 border border-gray-200">
                      <code className="text-sm text-gray-800">{command.usage}</code>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-medium text-gray-900 mb-2">Key Features:</h4>
                    <ul className="text-sm text-gray-700 space-y-1">
                      {command.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span
                            className={`${command.color === "gray" ? "text-gray-600" : `text-${command.color}-600`} mt-1`}
                          >
                            •
                          </span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    onClick={() => {
                      if (onNavigateToCommand) {
                        onNavigateToCommand(command.name);
                      }
                    }}
                    className={`w-full py-2 px-4 rounded-lg text-sm font-medium transition-colors duration-200 ${
                      command.color === "gray"
                        ? "bg-gray-600 text-white hover:bg-gray-700"
                        : `bg-${command.color}-600 text-white hover:bg-${command.color}-700`
                    }`}
                  >
                    View {command.name} Documentation →
                  </button>
                </div>
              );
            })}
        </div>
      </section>

      {/* Examples Section */}
      <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="flex items-center gap-3 mb-6">
          <FaTerminal className="text-2xl text-indigo-600" />
          <h2
            className="text-2xl font-semibold text-gray-900 mb-0"
            style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
          >
            Usage Examples
          </h2>
        </div>

        <div className="space-y-6">
          <div className="border-l-4 border-blue-500 pl-6 bg-blue-50 p-4 rounded-r-lg">
            <div className="flex items-center gap-2 mb-2">
              <FaRocket className="text-blue-600" />
              <h3 className="font-semibold text-gray-900">Quick Start</h3>
            </div>
            <p className="text-sm text-gray-600 mb-3">Interactive setup with prompts:</p>
            <CodeBlock code="bunx create-precast-app@latest my-app" />
          </div>

          <div className="border-l-4 border-green-500 pl-6 bg-green-50 p-4 rounded-r-lg">
            <div className="flex items-center gap-2 mb-2">
              <FaRocket className="text-green-600" />
              <h3 className="font-semibold text-gray-900">Full-Stack Application</h3>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              React + Express + PostgreSQL with authentication:
            </p>
            <CodeBlock code="bunx create-precast-app@latest my-app --framework react --backend express --database postgres --orm prisma --auth better-auth --ui-library shadcn --install" />
          </div>

          <div className="border-l-4 border-purple-500 pl-6 bg-purple-50 p-4 rounded-r-lg">
            <div className="flex items-center gap-2 mb-2">
              <FaRocket className="text-purple-600" />
              <h3 className="font-semibold text-gray-900">Next.js with Authentication</h3>
            </div>
            <p className="text-sm text-gray-600 mb-3">Modern Next.js setup with database:</p>
            <CodeBlock code="bunx create-precast-app@latest next-app --framework next --database postgres --orm prisma --auth better-auth --styling tailwind --install" />
          </div>

          <div className="border-l-4 border-orange-500 pl-6 bg-orange-50 p-4 rounded-r-lg">
            <div className="flex items-center gap-2 mb-2">
              <FaRocket className="text-orange-600" />
              <h3 className="font-semibold text-gray-900">Frontend Only</h3>
            </div>
            <p className="text-sm text-gray-600 mb-3">Vue application with styling:</p>
            <CodeBlock code="bunx create-precast-app@latest frontend-app --framework vue --backend none --styling tailwind --ui-library daisyui --install" />
          </div>
        </div>
      </section>
    </div>
  );
}

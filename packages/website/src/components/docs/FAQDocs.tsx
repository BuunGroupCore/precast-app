import { useState } from "react";
import {
  FaChevronDown,
  FaChevronRight,
  FaRocket,
  FaTools,
  FaMobile,
  FaShieldAlt,
  FaQuestionCircle,
  FaComments,
  FaBook,
  FaBug,
  FaPalette,
  FaRobot,
  FaCode,
  FaBullseye,
  FaGithub,
  FaDiscord,
  FaSearch,
  FaLightbulb,
  FaHeart,
  FaInfoCircle,
} from "react-icons/fa";

import { CodeBlock } from "@/features/common";

interface FAQItem {
  question: string;
  answer: string;
  category?: string;
  code?: string;
}

/**
 * Comprehensive FAQ data covering all PRECAST features
 */
const faqs: FAQItem[] = [
  // Getting Started
  {
    question: "What is PRECAST?",
    answer:
      "PRECAST is a powerful CLI tool that helps you quickly scaffold modern, production-ready web applications with your preferred technology stack. It supports 15+ frontend frameworks, multiple backends, databases, authentication providers, UI libraries, and modern development tools. Think of it as your personal full-stack application generator that follows industry best practices.",
    category: "Getting Started",
  },
  {
    question: "What are the system requirements?",
    answer:
      "PRECAST requires Node.js 18.0.0+ and at least 4GB RAM. We recommend Node.js 20.0.0+, Bun 1.0.0+ for the fastest experience, 8GB RAM, and Git 2.0.0+ for version control features. The tool works on Windows, macOS, and Linux.",
    category: "Getting Started",
  },
  {
    question: "How do I install PRECAST?",
    answer:
      "You don&apos;t need to install PRECAST globally. Just use npx for the latest version: npx create-precast-app@latest my-app. You can also use other package managers like bun, pnpm, or yarn. For the fastest experience, we recommend using Bun.",
    category: "Getting Started",
    code: "npx create-precast-app@latest my-app --install",
  },
  {
    question: "Can I skip the interactive prompts?",
    answer:
      "Yes! Use the --yes flag to accept all defaults, or specify exact options with flags like --framework react --database postgres --auth better-auth. This is perfect for automation scripts or when you know exactly what you want.",
    category: "Getting Started",
    code: "npx create-precast-app@latest my-app --framework react --database postgres --yes",
  },

  // Frameworks & Technologies
  {
    question: "Which frontend frameworks are supported?",
    answer:
      "PRECAST supports React, Vue, Next.js, Nuxt, Svelte, Angular, Astro, Vite, Vanilla JavaScript, and React Native for mobile. Some frameworks like Angular, Nuxt, and Remix are currently in testing phase. Check our roadmap for the latest status of each framework.",
    category: "Frameworks & Technologies",
  },
  {
    question: "What backend options are available?",
    answer:
      "Choose from Express.js, Hono, NestJS, Fastify (testing), Next.js API Routes, Cloudflare Workers, FastAPI (Python), Koa, or go frontend-only with no backend. Each backend comes pre-configured with TypeScript support and best practices.",
    category: "Frameworks & Technologies",
  },
  {
    question: "Which databases and ORMs are supported?",
    answer:
      "PRECAST supports a wide range of databases and ORMs with automatic compatibility checking. See the support tables below for current status and recommendations.",
    category: "Frameworks & Technologies",
  },
  {
    question: "Can I use TypeScript?",
    answer:
      "TypeScript is enabled by default in all projects because it dramatically improves developer experience and code quality. You can disable it with --no-typescript, but we strongly recommend keeping it enabled for better IntelliSense, error catching, and maintainability.",
    category: "Frameworks & Technologies",
  },

  // Authentication & Security
  {
    question: "How do I add authentication?",
    answer:
      "Use the --auth flag with options like better-auth (recommended for new projects), NextAuth (great for Next.js), Clerk (managed solution with UI), Auth0 (enterprise), or Passport.js (traditional). Each option comes with pre-configured routes, middleware, and database schemas.",
    category: "Authentication & Security",
    code: "npx create-precast-app@latest my-app --auth better-auth --database postgres",
  },
  {
    question: "Are passwords and secrets handled securely?",
    answer:
      "Yes! PRECAST automatically generates secure random passwords for database services, creates .env files with example values, includes .gitignore rules to prevent secret commits, and sets up environment variable validation. Never commit your actual secrets to version control.",
    category: "Authentication & Security",
  },

  // UI & Styling
  {
    question: "Which UI libraries and styling options are available?",
    answer:
      "UI Libraries: shadcn/ui (recommended), DaisyUI, Material UI (testing), Chakra UI (planned), Ant Design (planned), Mantine (planned), Brutalist UI. Styling: Tailwind CSS (recommended), plain CSS, SCSS, Styled Components. All options come with proper configuration and example components.",
    category: "UI & Styling",
  },
  {
    question: "What is shadcn/ui and why is it recommended?",
    answer:
      "shadcn/ui is a collection of copy-paste React components built with Radix UI and Tailwind CSS. It&apos;s recommended because components are fully customizable (you own the code), accessible by default, and beautifully designed. Unlike traditional UI libraries, you copy only what you need.",
    category: "UI & Styling",
  },

  // Mobile Development
  {
    question: "Can I create mobile applications?",
    answer:
      "Yes! PRECAST supports React Native with Expo for cross-platform mobile development. Use --framework react-native to create iOS and Android apps with shared codebase, navigation, and styling. Full TypeScript support and modern development tools included.",
    category: "Mobile Development",
    code: "npx create-precast-app@latest my-mobile-app --framework react-native --auth clerk",
  },
  {
    question: "Does React Native support work with authentication and databases?",
    answer:
      "Absolutely! React Native projects can use Clerk for managed authentication, Supabase for real-time databases, or any REST API backend. The setup includes navigation, async storage, and mobile-optimized patterns.",
    category: "Mobile Development",
  },

  // Business Features
  {
    question: "What business plugins are available?",
    answer:
      "PRECAST includes plugins for common business needs: Stripe for payments, Resend for transactional emails, analytics integration, monitoring setup, and more. Use --plugins stripe,resend to add them during project creation with proper configuration and example code.",
    category: "Business Features",
    code: "npx create-precast-app@latest my-saas --plugins stripe,resend,analytics",
  },
  {
    question: "How do Stripe payments work with PRECAST?",
    answer:
      "The Stripe plugin sets up payment processing with webhooks, customer management, subscription handling, and TypeScript types. It includes example components for checkout, customer portal, and subscription management with proper error handling and security.",
    category: "Business Features",
  },

  // AI Integration
  {
    question: "What is AI integration and Claude MCP?",
    answer:
      "PRECAST can set up Claude MCP (Model Context Protocol) servers that enhance your development workflow with AI assistance. This includes database schema analysis, code generation helpers, Git integration, and file system operations—all securely integrated with Claude AI.",
    category: "AI Integration",
    code: "npx create-precast-app@latest my-app --ai claude --mcp-servers postgresql,github",
  },
  {
    question: "Which MCP servers are available?",
    answer:
      "Available MCP servers include PostgreSQL (database operations), GitHub (repository management), Git (version control), and filesystem (file operations). These provide Claude with context about your project structure, database schema, and development workflow.",
    category: "AI Integration",
  },

  // Development & Deployment
  {
    question: "Is Docker supported?",
    answer:
      "Yes! Add --docker to include Docker and Docker Compose configuration with multi-stage builds, development hot-reload, production optimization, database services, and environment-specific configurations. Perfect for consistent development and deployment environments.",
    category: "Development & Deployment",
  },
  {
    question: "Which package managers are supported?",
    answer:
      "PRECAST supports npm, yarn, pnpm, and Bun with automatic detection and fallback. Bun is recommended for 3x faster installs and better performance. The tool detects your preferred manager from existing projects or uses system defaults.",
    category: "Development & Deployment",
    code: "npx create-precast-app@latest my-app --package-manager bun --install",
  },
  {
    question: "What development tools are included?",
    answer:
      "Every project includes ESLint for code quality, Prettier for formatting, Git repository initialization, .gitignore with sensible defaults, TypeScript configuration, modern build tools (Vite/Next.js), hot-reload development server, and environment variable management.",
    category: "Development & Deployment",
  },

  // Troubleshooting
  {
    question: "What if my package manager fails during installation?",
    answer:
      "PRECAST automatically falls back to npm if your chosen package manager encounters issues. This ensures your project is always created successfully. You can then manually install with your preferred manager later or use --package-manager to force a specific one.",
    category: "Troubleshooting",
  },
  {
    question: "How do I report bugs or request features?",
    answer:
      "Report bugs and request features on our GitHub repository. Include your system info (run precast --version), the exact command used, and the error message. Check existing issues first to avoid duplicates. Use our bug report template for faster resolution.",
    category: "Troubleshooting",
    code: `# Get system info first
bunx create-precast-app@latest --version

# Then report at:
# https://github.com/BuunGroupCore/precast-app/issues/new?template=bug_report.md`,
  },
  {
    question: "Can I customize the generated project structure?",
    answer:
      "Yes! After generation, you can modify the structure, add custom configurations, or extend functionality. PRECAST creates a solid foundation following best practices, but you maintain full control over your codebase.",
    category: "Troubleshooting",
  },

  // Roadmap & Contributing
  {
    question: "What features are coming soon?",
    answer:
      "Check our roadmap for upcoming features: Angular and Nuxt are in testing, Supabase and Firebase database integration, more authentication providers (Auth0, Passport.js), additional UI libraries (Material UI, Chakra UI), and mobile framework expansions. View our detailed roadmap for timelines and progress.",
    category: "Roadmap & Contributing",
    code: `# View roadmap at:
# https://precast.app/roadmap

# Or check GitHub milestones:
# https://github.com/BuunGroupCore/precast-app/milestones`,
  },
  {
    question: "How can I contribute to PRECAST?",
    answer:
      "Contribute by reporting bugs, suggesting features, improving documentation, or submitting pull requests on GitHub. Check CONTRIBUTING.md for guidelines. We especially welcome help with testing new framework integrations and expanding our template library.",
    category: "Roadmap & Contributing",
  },
];

/**
 * FAQ documentation component with categorized questions and professional styling
 */
export function FAQDocs() {
  const [openItems, setOpenItems] = useState<number[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const categories = [
    "All",
    ...Array.from(new Set(faqs.map((f) => f.category).filter(Boolean) as string[])),
  ];

  const filteredFaqs = faqs.filter((faq) => {
    const matchesCategory = selectedCategory === "All" || faq.category === selectedCategory;
    const matchesSearch =
      searchQuery === "" ||
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (faq.category && faq.category.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  const toggleItem = (index: number) => {
    setOpenItems((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Getting Started":
        return <FaRocket className="text-blue-600" />;
      case "Frameworks & Technologies":
        return <FaTools className="text-green-600" />;
      case "Mobile Development":
        return <FaMobile className="text-purple-600" />;
      case "Authentication & Security":
        return <FaShieldAlt className="text-red-600" />;
      case "UI & Styling":
        return <FaPalette className="text-pink-600" />;
      case "Business Features":
        return <FaBullseye className="text-orange-600" />;
      case "AI Integration":
        return <FaRobot className="text-indigo-600" />;
      case "Development & Deployment":
        return <FaCode className="text-teal-600" />;
      case "Troubleshooting":
        return <FaBug className="text-yellow-600" />;
      case "Roadmap & Contributing":
        return <FaHeart className="text-rose-600" />;
      default:
        return <FaQuestionCircle className="text-gray-600" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Getting Started":
        return "blue";
      case "Frameworks & Technologies":
        return "green";
      case "Mobile Development":
        return "purple";
      case "Authentication & Security":
        return "red";
      case "UI & Styling":
        return "pink";
      case "Business Features":
        return "orange";
      case "AI Integration":
        return "indigo";
      case "Development & Deployment":
        return "teal";
      case "Troubleshooting":
        return "yellow";
      case "Roadmap & Contributing":
        return "rose";
      default:
        return "gray";
    }
  };

  const getCategoryButtonStyles = (category: string, isSelected: boolean) => {
    const color = getCategoryColor(category);

    if (isSelected) {
      switch (color) {
        case "blue":
          return "bg-blue-600 text-white shadow-lg";
        case "green":
          return "bg-green-600 text-white shadow-lg";
        case "purple":
          return "bg-purple-600 text-white shadow-lg";
        case "red":
          return "bg-red-600 text-white shadow-lg";
        case "pink":
          return "bg-pink-600 text-white shadow-lg";
        case "orange":
          return "bg-orange-600 text-white shadow-lg";
        case "indigo":
          return "bg-indigo-600 text-white shadow-lg";
        case "teal":
          return "bg-teal-600 text-white shadow-lg";
        case "yellow":
          return "bg-yellow-600 text-white shadow-lg";
        case "rose":
          return "bg-rose-600 text-white shadow-lg";
        case "gray":
          return "bg-gray-600 text-white shadow-lg";
        default:
          return "bg-blue-600 text-white shadow-lg";
      }
    } else {
      switch (color) {
        case "blue":
          return "bg-white border border-gray-300 text-gray-700 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700";
        case "green":
          return "bg-white border border-gray-300 text-gray-700 hover:bg-green-50 hover:border-green-300 hover:text-green-700";
        case "purple":
          return "bg-white border border-gray-300 text-gray-700 hover:bg-purple-50 hover:border-purple-300 hover:text-purple-700";
        case "red":
          return "bg-white border border-gray-300 text-gray-700 hover:bg-red-50 hover:border-red-300 hover:text-red-700";
        case "pink":
          return "bg-white border border-gray-300 text-gray-700 hover:bg-pink-50 hover:border-pink-300 hover:text-pink-700";
        case "orange":
          return "bg-white border border-gray-300 text-gray-700 hover:bg-orange-50 hover:border-orange-300 hover:text-orange-700";
        case "indigo":
          return "bg-white border border-gray-300 text-gray-700 hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-700";
        case "teal":
          return "bg-white border border-gray-300 text-gray-700 hover:bg-teal-50 hover:border-teal-300 hover:text-teal-700";
        case "yellow":
          return "bg-white border border-gray-300 text-gray-700 hover:bg-yellow-50 hover:border-yellow-300 hover:text-yellow-700";
        case "rose":
          return "bg-white border border-gray-300 text-gray-700 hover:bg-rose-50 hover:border-rose-300 hover:text-rose-700";
        case "gray":
          return "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700";
        default:
          return "bg-white border border-gray-300 text-gray-700 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700";
      }
    }
  };

  return (
    <div className="space-y-8 pt-6">
      {/* Header Section */}
      <section
        id="faq-section"
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-8"
      >
        <div className="flex items-center gap-3 mb-6">
          <FaQuestionCircle className="text-2xl text-blue-600" />
          <h2
            className="text-3xl font-semibold text-gray-900 mb-0"
            style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
          >
            Frequently Asked Questions
          </h2>
        </div>

        <p
          className="text-gray-700 leading-relaxed mb-6"
          style={{ fontSize: "16px", lineHeight: "1.7" }}
        >
          Find answers to common questions about PRECAST features, setup, and usage. Can&apos;t find
          what you&apos;re looking for? Check our GitHub issues or create a new one.
        </p>

        {/* Search Bar */}
        <div className="relative mb-6">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search questions, answers, or categories..."
            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              <span className="h-4 w-4 text-gray-400 hover:text-gray-600 cursor-pointer">×</span>
            </button>
          )}
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-3 mb-8">
          {categories.map((category) => {
            const isSelected = selectedCategory === category;

            return (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${getCategoryButtonStyles(category, isSelected)}`}
              >
                {category !== "All" && getCategoryIcon(category)}
                {category === "All" ? "All Categories" : category}
              </button>
            );
          })}
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {filteredFaqs.map((faq, _index) => {
            const globalIndex = faqs.indexOf(faq);
            const isOpen = openItems.includes(globalIndex);
            const color = getCategoryColor(faq.category || "");

            return (
              <div
                key={globalIndex}
                className="border border-gray-200 rounded-lg overflow-hidden bg-white hover:shadow-md transition-shadow duration-200"
              >
                <button
                  onClick={() => toggleItem(globalIndex)}
                  className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
                >
                  <div className="flex items-start gap-4 flex-1 text-left">
                    {faq.category && (
                      <div className="flex-shrink-0 mt-1">{getCategoryIcon(faq.category)}</div>
                    )}
                    <div className="flex-1">
                      {faq.category && (
                        <div
                          className={`text-xs font-medium text-${color}-600 uppercase tracking-wider mb-2`}
                        >
                          {faq.category}
                        </div>
                      )}
                      <h3 className="text-lg font-semibold text-gray-900 leading-snug">
                        {faq.question}
                      </h3>
                    </div>
                  </div>
                  <div className="ml-4 flex-shrink-0">
                    {isOpen ? (
                      <FaChevronDown className="text-gray-400 transition-transform duration-200" />
                    ) : (
                      <FaChevronRight className="text-gray-400 transition-transform duration-200" />
                    )}
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 pb-6">
                    <div className="pl-12">
                      <div className="border-t border-gray-100 pt-4">
                        <p
                          className="text-gray-700 leading-relaxed mb-4"
                          style={{ lineHeight: "1.7" }}
                        >
                          {faq.answer}
                        </p>
                        {faq.code && (
                          <div className="mt-4">
                            <div className="flex items-center gap-2 mb-3">
                              <FaLightbulb className="text-yellow-500 text-sm" />
                              <span className="text-sm font-medium text-gray-700">Example:</span>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                              <CodeBlock code={faq.code} />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {filteredFaqs.length === 0 && (
          <div className="text-center py-12">
            <FaSearch className="mx-auto text-4xl text-gray-300 mb-4" />
            <p className="text-gray-500 text-lg">
              {searchQuery
                ? "No questions found matching your search."
                : "No questions found in this category."}
            </p>
            <p className="text-gray-400 text-sm mt-2">
              {searchQuery
                ? "Try different keywords or clear the search."
                : "Try selecting a different category or search all questions."}
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                Clear Search
              </button>
            )}
          </div>
        )}
      </section>

      {/* Support Tables Section */}
      <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="flex items-center gap-3 mb-6">
          <FaTools className="text-2xl text-green-600" />
          <h3 className="text-2xl font-semibold text-gray-900 mb-0">Technology Support Matrix</h3>
        </div>

        <div className="space-y-8">
          {/* Databases Table */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Supported Databases</h4>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left p-4 font-semibold text-gray-900">Database</th>
                    <th className="text-left p-4 font-semibold text-gray-900">Status</th>
                    <th className="text-left p-4 font-semibold text-gray-900">Recommended ORMs</th>
                    <th className="text-left p-4 font-semibold text-gray-900">Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100">
                    <td className="p-4 font-medium">PostgreSQL</td>
                    <td className="p-4">
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                        Stable
                      </span>
                    </td>
                    <td className="p-4 text-sm">Prisma, Drizzle</td>
                    <td className="p-4 text-sm text-gray-600">
                      World&apos;s most advanced open source database
                    </td>
                  </tr>
                  <tr className="border-b border-gray-100 bg-gray-50/50">
                    <td className="p-4 font-medium">MySQL</td>
                    <td className="p-4">
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                        Stable
                      </span>
                    </td>
                    <td className="p-4 text-sm">Prisma, Drizzle</td>
                    <td className="p-4 text-sm text-gray-600">
                      Popular open source relational database
                    </td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="p-4 font-medium">MongoDB</td>
                    <td className="p-4">
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                        Stable
                      </span>
                    </td>
                    <td className="p-4 text-sm">Mongoose</td>
                    <td className="p-4 text-sm text-gray-600">Popular NoSQL document database</td>
                  </tr>
                  <tr className="border-b border-gray-100 bg-gray-50/50">
                    <td className="p-4 font-medium">Cloudflare D1</td>
                    <td className="p-4">
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                        Stable
                      </span>
                    </td>
                    <td className="p-4 text-sm">Drizzle</td>
                    <td className="p-4 text-sm text-gray-600">Serverless SQLite at the edge</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="p-4 font-medium">DuckDB</td>
                    <td className="p-4">
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                        Stable
                      </span>
                    </td>
                    <td className="p-4 text-sm">-</td>
                    <td className="p-4 text-sm text-gray-600">In-process analytical database</td>
                  </tr>
                  <tr className="border-b border-gray-100 bg-gray-50/50">
                    <td className="p-4 font-medium">Supabase</td>
                    <td className="p-4">
                      <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                        Testing
                      </span>
                    </td>
                    <td className="p-4 text-sm">Supabase Client</td>
                    <td className="p-4 text-sm text-gray-600">Open source Firebase alternative</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="p-4 font-medium">Firebase</td>
                    <td className="p-4">
                      <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                        Testing
                      </span>
                    </td>
                    <td className="p-4 text-sm">Firebase SDK</td>
                    <td className="p-4 text-sm text-gray-600">
                      Google&apos;s app development platform
                    </td>
                  </tr>
                  <tr className="border-b border-gray-100 bg-gray-50/50">
                    <td className="p-4 font-medium">Neon</td>
                    <td className="p-4">
                      <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                        Testing
                      </span>
                    </td>
                    <td className="p-4 text-sm">Prisma, Drizzle</td>
                    <td className="p-4 text-sm text-gray-600">
                      Serverless Postgres with branching
                    </td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="p-4 font-medium">Turso</td>
                    <td className="p-4">
                      <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                        Testing
                      </span>
                    </td>
                    <td className="p-4 text-sm">Drizzle</td>
                    <td className="p-4 text-sm text-gray-600">Edge-hosted distributed SQLite</td>
                  </tr>
                  <tr className="border-b border-gray-100 bg-gray-50/50">
                    <td className="p-4 font-medium">PlanetScale</td>
                    <td className="p-4">
                      <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                        Testing
                      </span>
                    </td>
                    <td className="p-4 text-sm">Prisma, Drizzle</td>
                    <td className="p-4 text-sm text-gray-600">Serverless MySQL with branching</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* ORMs Table */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4">
              Supported ORMs & Database Clients
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left p-4 font-semibold text-gray-900">ORM/Client</th>
                    <th className="text-left p-4 font-semibold text-gray-900">Status</th>
                    <th className="text-left p-4 font-semibold text-gray-900">
                      Compatible Databases
                    </th>
                    <th className="text-left p-4 font-semibold text-gray-900">Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100">
                    <td className="p-4 font-medium">Prisma</td>
                    <td className="p-4">
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                        Stable
                      </span>
                    </td>
                    <td className="p-4 text-sm">PostgreSQL, MySQL, MongoDB</td>
                    <td className="p-4 text-sm text-gray-600">Next-generation TypeScript ORM</td>
                  </tr>
                  <tr className="border-b border-gray-100 bg-gray-50/50">
                    <td className="p-4 font-medium">Drizzle</td>
                    <td className="p-4">
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                        Stable
                      </span>
                    </td>
                    <td className="p-4 text-sm">PostgreSQL, MySQL, Cloudflare D1</td>
                    <td className="p-4 text-sm text-gray-600">
                      TypeScript ORM that feels like SQL
                    </td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="p-4 font-medium">TypeORM</td>
                    <td className="p-4">
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                        Stable
                      </span>
                    </td>
                    <td className="p-4 text-sm">PostgreSQL, MySQL</td>
                    <td className="p-4 text-sm text-gray-600">ORM for TypeScript and JavaScript</td>
                  </tr>
                  <tr className="border-b border-gray-100 bg-gray-50/50">
                    <td className="p-4 font-medium">Mongoose</td>
                    <td className="p-4">
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                        Stable
                      </span>
                    </td>
                    <td className="p-4 text-sm">MongoDB</td>
                    <td className="p-4 text-sm text-gray-600">Elegant MongoDB object modeling</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-5">
            <div className="flex gap-3">
              <FaInfoCircle className="text-blue-600 text-xl flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-blue-900 font-semibold mb-1">Automatic Compatibility Checking</p>
                <p className="text-blue-700 text-sm">
                  PRECAST automatically validates your technology stack choices and prevents
                  incompatible combinations. For example, MongoDB requires Mongoose ORM, while
                  Cloudflare D1 only works with Drizzle.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Help Section */}
      <section className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 p-8">
        <div className="flex items-center gap-3 mb-6">
          <FaComments className="text-2xl text-blue-600" />
          <h3 className="text-2xl font-semibold text-gray-900 mb-0">Still Have Questions?</h3>
        </div>

        <p className="text-gray-700 leading-relaxed mb-8">
          If you can&apos;t find the answer you&apos;re looking for, here are some ways to get help:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center gap-3 mb-3">
              <FaBook className="text-blue-600 text-xl" />
              <h4 className="font-semibold text-gray-900">Documentation</h4>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">
              Browse our complete documentation with examples and guides for every feature.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center gap-3 mb-3">
              <FaGithub className="text-gray-900 text-xl" />
              <h4 className="font-semibold text-gray-900">GitHub Issues</h4>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed mb-3">
              Report bugs, request features, or ask questions in our GitHub repository.
            </p>
            <a
              href="https://github.com/BuunGroupCore/precast-app/issues/new?template=bug_report.md"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              Create Bug Report →
            </a>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center gap-3 mb-3">
              <FaDiscord className="text-indigo-600 text-xl" />
              <h4 className="font-semibold text-gray-900">Discord Community</h4>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">
              Join our Discord server for real-time help and community discussions.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

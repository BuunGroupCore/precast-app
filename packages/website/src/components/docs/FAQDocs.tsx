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
  FaDiscord,
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
      "You don't need to install PRECAST globally. Just use npx for the latest version: npx create-precast-app@latest my-app. You can also use other package managers like bun, pnpm, or yarn. For the fastest experience, we recommend using Bun.",
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
    category: "Frameworks",
  },
  {
    question: "What backend options are available?",
    answer:
      "Choose from Express.js, Hono, NestJS, Fastify (testing), Next.js API Routes, Cloudflare Workers, FastAPI (Python), Koa, or go frontend-only with no backend. Each backend comes pre-configured with TypeScript support and best practices.",
    category: "Frameworks",
  },
  {
    question: "Which databases and ORMs are supported?",
    answer:
      "Databases: PostgreSQL, MySQL, MongoDB, Supabase (testing), Firebase (testing), Neon (testing), Turso (testing), PlanetScale (testing), Cloudflare D1. ORMs: Prisma, Drizzle, TypeORM, Mongoose. The tool automatically handles compatibility checks between your chosen database and ORM.",
    category: "Frameworks",
  },
  {
    question: "Can I use TypeScript?",
    answer:
      "TypeScript is enabled by default in all projects because it dramatically improves developer experience and code quality. You can disable it with --no-typescript, but we strongly recommend keeping it enabled for better IntelliSense, error catching, and maintainability.",
    category: "Frameworks",
  },

  // Authentication & Security
  {
    question: "How do I add authentication?",
    answer:
      "Use the --auth flag with options like better-auth (recommended for new projects), NextAuth (great for Next.js), Clerk (managed solution with UI), Auth0 (enterprise), or Passport.js (traditional). Each option comes with pre-configured routes, middleware, and database schemas.",
    category: "Authentication",
    code: "npx create-precast-app@latest my-app --auth better-auth --database postgres",
  },
  {
    question: "Are passwords and secrets handled securely?",
    answer:
      "Yes! PRECAST automatically generates secure random passwords for database services, creates .env files with example values, includes .gitignore rules to prevent secret commits, and sets up environment variable validation. Never commit your actual secrets to version control.",
    category: "Authentication",
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
      "shadcn/ui is a collection of copy-paste React components built with Radix UI and Tailwind CSS. It's recommended because components are fully customizable (you own the code), accessible by default, and beautifully designed. Unlike traditional UI libraries, you copy only what you need.",
    category: "UI & Styling",
  },

  // Mobile Development
  {
    question: "Can I create mobile applications?",
    answer:
      "Yes! PRECAST supports React Native with Expo for cross-platform mobile development. Use --framework react-native to create iOS and Android apps with shared codebase, navigation, and styling. Full TypeScript support and modern development tools included.",
    category: "Mobile",
    code: "npx create-precast-app@latest my-mobile-app --framework react-native --auth clerk",
  },
  {
    question: "Does React Native support work with authentication and databases?",
    answer:
      "Absolutely! React Native projects can use Clerk for managed authentication, Supabase for real-time databases, or any REST API backend. The setup includes navigation, async storage, and mobile-optimized patterns.",
    category: "Mobile",
  },

  // Business Features & Plugins
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
    category: "Development",
  },
  {
    question: "Which package managers are supported?",
    answer:
      "PRECAST supports npm, yarn, pnpm, and Bun with automatic detection and fallback. Bun is recommended for 3x faster installs and better performance. The tool detects your preferred manager from existing projects or uses system defaults.",
    category: "Development",
    code: "npx create-precast-app@latest my-app --package-manager bun --install",
  },
  {
    question: "What development tools are included?",
    answer:
      "Every project includes ESLint for code quality, Prettier for formatting, Git repository initialization, .gitignore with sensible defaults, TypeScript configuration, modern build tools (Vite/Next.js), hot-reload development server, and environment variable management.",
    category: "Development",
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
      "Report bugs and request features on our GitHub repository at github.com/BuunGroupCore/precast-app. Include your system info (run precast --version), the exact command used, and the error message. Check existing issues first to avoid duplicates.",
    category: "Troubleshooting",
  },
  {
    question: "Can I customize the generated project structure?",
    answer:
      "Yes! After generation, you can modify the structure, add custom configurations, or extend functionality. PRECAST creates a solid foundation following best practices, but you maintain full control over your codebase.",
    category: "Troubleshooting",
  },

  // Roadmap & Future
  {
    question: "What features are coming soon?",
    answer:
      "Check our roadmap for upcoming features: Angular and Nuxt are in testing, Supabase and Firebase database integration, more authentication providers (Auth0, Passport.js), additional UI libraries (Material UI, Chakra UI), and mobile framework expansions. Some features are planned for Q1-Q3 2026.",
    category: "Roadmap",
  },
  {
    question: "How can I contribute to PRECAST?",
    answer:
      "Contribute by reporting bugs, suggesting features, improving documentation, or submitting pull requests on GitHub. Check CONTRIBUTING.md for guidelines. We especially welcome help with testing new framework integrations and expanding our template library.",
    category: "Roadmap",
  },
];

/**
 * FAQ documentation component with categorized questions
 */
export function FAQDocs() {
  const [openItems, setOpenItems] = useState<number[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const categories = [
    "All",
    ...Array.from(new Set(faqs.map((f) => f.category).filter(Boolean) as string[])),
  ];
  const filteredFaqs =
    selectedCategory === "All" ? faqs : faqs.filter((faq) => faq.category === selectedCategory);

  const toggleItem = (index: number) => {
    setOpenItems((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Getting Started":
        return <FaRocket className="text-comic-blue" />;
      case "Frameworks":
        return <FaTools className="text-comic-green" />;
      case "Mobile":
        return <FaMobile className="text-comic-purple" />;
      case "Authentication":
        return <FaShieldAlt className="text-comic-red" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8">
      <section id="faq-section" className="comic-panel p-6">
        <div className="flex items-center gap-3 mb-6">
          <FaQuestionCircle className="text-3xl text-comic-blue" />
          <h2 className="font-comic text-3xl text-comic-blue mb-0">Frequently Asked Questions</h2>
        </div>
        <p className="font-comic mb-6 text-comic-gray">
          Find answers to common questions about PRECAST features, setup, and usage. Can&apos;t find
          what you&apos;re looking for? Check our GitHub issues or create a new one.
        </p>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 py-2 rounded-lg border-2 border-comic-black font-comic text-sm flex items-center gap-2 transition-all ${
                selectedCategory === category
                  ? "bg-comic-blue text-comic-white"
                  : "bg-comic-white text-comic-black hover:bg-comic-yellow"
              }`}
              style={{ boxShadow: "2px 2px 0 rgba(0,0,0,0.3)" }}
            >
              {getCategoryIcon(category)}
              {category}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {filteredFaqs.map((faq, _index) => {
            const globalIndex = faqs.indexOf(faq);
            return (
              <div
                key={globalIndex}
                className="border-2 border-comic-black rounded-lg overflow-hidden bg-comic-white"
              >
                <button
                  onClick={() => toggleItem(globalIndex)}
                  className="w-full p-4 flex items-center justify-between hover:bg-comic-yellow/10 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {faq.category && (
                      <div className="flex items-center gap-1">
                        {getCategoryIcon(faq.category)}
                        <span className="text-xs font-comic text-comic-gray uppercase">
                          {faq.category}
                        </span>
                      </div>
                    )}
                    <h3 className="font-comic text-lg text-left">{faq.question}</h3>
                  </div>
                  <div className="ml-2 flex-shrink-0">
                    {openItems.includes(globalIndex) ? (
                      <FaChevronDown className="text-comic-black" />
                    ) : (
                      <FaChevronRight className="text-comic-black" />
                    )}
                  </div>
                </button>
                {openItems.includes(globalIndex) && (
                  <div className="p-4 pt-0 border-t border-comic-gray/20">
                    <p className="font-comic text-comic-gray mb-3">{faq.answer}</p>
                    {faq.code && (
                      <div className="mt-3">
                        <p className="font-comic text-sm text-comic-blue mb-2">Example:</p>
                        <CodeBlock code={faq.code} />
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {filteredFaqs.length === 0 && (
          <div className="text-center py-8">
            <p className="font-comic text-comic-gray">No questions found in this category.</p>
          </div>
        )}
      </section>

      <section className="comic-panel p-6 bg-comic-blue/10 border-comic-blue">
        <div className="flex items-center gap-3 mb-4">
          <FaComments className="text-2xl text-comic-blue" />
          <h3 className="font-comic text-2xl text-comic-blue mb-0">Still Have Questions?</h3>
        </div>
        <p className="font-comic mb-4">
          If you can&apos;t find the answer you&apos;re looking for, here are some ways to get help:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-comic-white p-4 rounded-lg border-2 border-comic-black">
            <div className="flex items-center gap-2 mb-2">
              <FaBook className="text-comic-blue" />
              <h4 className="font-comic font-bold mb-0">Documentation</h4>
            </div>
            <p className="font-comic text-sm">
              Browse our complete documentation with examples and guides.
            </p>
          </div>
          <div className="bg-comic-white p-4 rounded-lg border-2 border-comic-black">
            <div className="flex items-center gap-2 mb-2">
              <FaBug className="text-comic-red" />
              <h4 className="font-comic font-bold mb-0">GitHub Issues</h4>
            </div>
            <p className="font-comic text-sm">
              Report bugs, request features, or ask questions on GitHub.
            </p>
          </div>
          <div className="bg-comic-white p-4 rounded-lg border-2 border-comic-black">
            <div className="flex items-center gap-2 mb-2">
              <FaDiscord className="text-comic-purple" />
              <h4 className="font-comic font-bold mb-0">Discord Community</h4>
            </div>
            <p className="font-comic text-sm">
              Join our Discord server for real-time help and discussions.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

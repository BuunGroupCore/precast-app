import {
  FaCode,
  FaRocket,
  FaDatabase,
  FaCog,
  FaCloud,
  FaShieldAlt,
  FaBookOpen,
  FaLightbulb,
  FaArrowRight,
  FaExternalLinkAlt,
  FaClock,
  FaUser,
  FaUsers,
} from "react-icons/fa";

/**
 * Comprehensive guides index with professional styling
 */
export function GuidesIndexDocs() {
  const guideCategories = [
    {
      id: "getting-started",
      title: "Getting Started",
      icon: FaRocket,
      color: "blue",
      description: "Essential guides to get up and running quickly",
      guides: [
        {
          title: "Quick Start Guide",
          description: "Get your first PRECAST project running in under 5 minutes",
          difficulty: "Beginner",
          duration: "5 min",
          status: "available",
          href: "#quick-start",
        },
        {
          title: "Project Structure Overview",
          description: "Understanding the generated project architecture",
          difficulty: "Beginner",
          duration: "10 min",
          status: "available",
          href: "#project-structure",
        },
        {
          title: "Configuration Guide",
          description: "Learn how to configure your PRECAST project",
          difficulty: "Intermediate",
          duration: "15 min",
          status: "available",
          href: "#configuration",
        },
      ],
    },
    {
      id: "frameworks",
      title: "Framework Guides",
      icon: FaCode,
      color: "green",
      description: "Deep dives into supported frontend and backend frameworks",
      guides: [
        {
          title: "React + TypeScript Setup",
          description: "Complete guide for React projects with TypeScript",
          difficulty: "Beginner",
          duration: "20 min",
          status: "available",
          href: "#react-typescript",
        },
        {
          title: "Next.js Full-Stack Development",
          description: "Build full-stack applications with Next.js",
          difficulty: "Intermediate",
          duration: "30 min",
          status: "available",
          href: "#nextjs-fullstack",
        },
        {
          title: "Vue 3 + Composition API",
          description: "Modern Vue development with Composition API",
          difficulty: "Intermediate",
          duration: "25 min",
          status: "coming-soon",
          href: "#vue-composition",
        },
        {
          title: "Express.js Backend Integration",
          description: "Building robust APIs with Express.js",
          difficulty: "Intermediate",
          duration: "35 min",
          status: "available",
          href: "#express-backend",
        },
      ],
    },
    {
      id: "database",
      title: "Database & ORM",
      icon: FaDatabase,
      color: "purple",
      description: "Working with databases and ORMs in your projects",
      guides: [
        {
          title: "Prisma Setup & Best Practices",
          description: "Complete Prisma integration and optimization guide",
          difficulty: "Intermediate",
          duration: "40 min",
          status: "available",
          href: "#prisma-guide",
        },
        {
          title: "Drizzle ORM Configuration",
          description: "Setting up and using Drizzle ORM effectively",
          difficulty: "Advanced",
          duration: "45 min",
          status: "coming-soon",
          href: "#drizzle-orm",
        },
        {
          title: "Database Migrations Guide",
          description: "Managing database schema changes and migrations",
          difficulty: "Intermediate",
          duration: "30 min",
          status: "available",
          href: "#database-migrations",
        },
      ],
    },
    {
      id: "deployment",
      title: "Deployment",
      icon: FaCloud,
      color: "orange",
      description: "Deploy your applications to various platforms",
      guides: [
        {
          title: "Docker Deployment",
          description: "Containerize and deploy with Docker",
          difficulty: "Intermediate",
          duration: "35 min",
          status: "available",
          href: "#docker-deployment",
        },
        {
          title: "Vercel Deployment",
          description: "Deploy Next.js apps to Vercel",
          difficulty: "Beginner",
          duration: "15 min",
          status: "available",
          href: "#vercel-deployment",
        },
        {
          title: "AWS Deployment Guide",
          description: "Deploy to AWS with best practices",
          difficulty: "Advanced",
          duration: "60 min",
          status: "coming-soon",
          href: "#aws-deployment",
        },
      ],
    },
    {
      id: "authentication",
      title: "Authentication",
      icon: FaShieldAlt,
      color: "red",
      description: "Implement secure authentication in your applications",
      guides: [
        {
          title: "Better Auth Integration",
          description: "Complete authentication setup with Better Auth",
          difficulty: "Intermediate",
          duration: "45 min",
          status: "available",
          href: "#better-auth",
        },
        {
          title: "NextAuth.js Setup",
          description: "Authentication for Next.js applications",
          difficulty: "Intermediate",
          duration: "40 min",
          status: "available",
          href: "#nextauth",
        },
        {
          title: "JWT & Session Management",
          description: "Advanced authentication patterns and security",
          difficulty: "Advanced",
          duration: "50 min",
          status: "coming-soon",
          href: "#jwt-sessions",
        },
      ],
    },
    {
      id: "advanced",
      title: "Advanced Topics",
      icon: FaCog,
      color: "indigo",
      description: "Advanced patterns and optimization techniques",
      guides: [
        {
          title: "Performance Optimization",
          description: "Optimize your application for production",
          difficulty: "Advanced",
          duration: "60 min",
          status: "coming-soon",
          href: "#performance",
        },
        {
          title: "Custom Template Creation",
          description: "Create your own project templates",
          difficulty: "Advanced",
          duration: "90 min",
          status: "coming-soon",
          href: "#custom-templates",
        },
        {
          title: "CI/CD Pipeline Setup",
          description: "Automated testing and deployment pipelines",
          difficulty: "Advanced",
          duration: "75 min",
          status: "coming-soon",
          href: "#cicd-pipelines",
        },
      ],
    },
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner":
        return "text-green-600 bg-green-50";
      case "Intermediate":
        return "text-orange-600 bg-orange-50";
      case "Advanced":
        return "text-red-600 bg-red-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "text-green-600 bg-green-50 border-green-200";
      case "coming-soon":
        return "text-orange-600 bg-orange-50 border-orange-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getCategoryColor = (color: string) => {
    const colors = {
      blue: "text-blue-600",
      green: "text-green-600",
      purple: "text-purple-600",
      orange: "text-orange-600",
      red: "text-red-600",
      indigo: "text-indigo-600",
    };
    return colors[color as keyof typeof colors] || "text-gray-600";
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="flex items-center gap-3 mb-6">
          <FaBookOpen className="text-3xl text-blue-600" />
          <h1
            className="text-3xl font-semibold text-gray-900 mb-0"
            style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
          >
            Developer Guides
          </h1>
        </div>

        <div className="mb-8">
          <p
            className="text-gray-700 leading-relaxed mb-4"
            style={{ fontSize: "16px", lineHeight: "1.7" }}
          >
            Comprehensive guides to help you build amazing applications with PRECAST. From getting
            started to advanced deployment strategies, we&apos;ve got you covered.
          </p>

          <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <FaLightbulb className="text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900 mb-0">New to PRECAST?</h3>
            </div>
            <p className="text-sm text-gray-700 mb-3">
              Start with our Quick Start Guide to create your first project in minutes, then explore
              framework-specific guides based on your needs.
            </p>
            <div className="flex gap-3">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2">
                <FaRocket className="text-xs" />
                Quick Start Guide
              </button>
              <button className="bg-white border border-blue-300 text-blue-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors duration-200">
                Browse All Guides
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900">15+</div>
            <div className="text-sm text-gray-600">Guides Available</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900">6</div>
            <div className="text-sm text-gray-600">Categories</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900">3</div>
            <div className="text-sm text-gray-600">Skill Levels</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900">500+</div>
            <div className="text-sm text-gray-600">Min Content</div>
          </div>
        </div>
      </section>

      {/* Guide Categories */}
      {guideCategories.map((category) => (
        <section
          key={category.id}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <category.icon className={`text-2xl ${getCategoryColor(category.color)}`} />
            <h2
              className="text-2xl font-semibold text-gray-900 mb-0"
              style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
            >
              {category.title}
            </h2>
          </div>

          <p className="text-gray-700 mb-6 leading-relaxed">{category.description}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {category.guides.map((guide) => (
              <div
                key={guide.title}
                className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-200 bg-white"
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-900 leading-tight">
                    {guide.title}
                  </h3>
                  <div
                    className={`px-2 py-1 rounded text-xs font-medium border ${getStatusColor(guide.status)}`}
                  >
                    {guide.status === "available" ? "Available" : "Coming Soon"}
                  </div>
                </div>

                <p className="text-gray-600 text-sm mb-4 leading-relaxed">{guide.description}</p>

                <div className="flex items-center gap-4 mb-4 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <FaUser className="text-xs" />
                    <span className={`px-2 py-1 rounded ${getDifficultyColor(guide.difficulty)}`}>
                      {guide.difficulty}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FaClock className="text-xs" />
                    <span>{guide.duration}</span>
                  </div>
                </div>

                <button
                  className={`w-full py-2 px-4 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center justify-center gap-2 ${
                    guide.status === "available"
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "bg-gray-100 text-gray-500 cursor-not-allowed"
                  }`}
                  disabled={guide.status !== "available"}
                >
                  {guide.status === "available" ? (
                    <>
                      <span>Read Guide</span>
                      <FaArrowRight className="text-xs" />
                    </>
                  ) : (
                    <span>Coming Soon</span>
                  )}
                </button>
              </div>
            ))}
          </div>
        </section>
      ))}

      {/* Help Section */}
      <section className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 p-8">
        <div className="flex items-center gap-3 mb-6">
          <FaUsers className="text-2xl text-blue-600" />
          <h2 className="text-2xl font-semibold text-gray-900 mb-0">Need Help?</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-2">Community Support</h3>
            <p className="text-gray-600 text-sm leading-relaxed mb-3">
              Join our community discussions for help, tips, and to share your projects.
            </p>
            <a
              href="https://github.com/BuunGroupCore/precast-app/discussions"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 text-sm font-medium inline-flex items-center gap-1"
            >
              Join Discussions <FaExternalLinkAlt className="text-xs" />
            </a>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-2">Request a Guide</h3>
            <p className="text-gray-600 text-sm leading-relaxed mb-3">
              Don&apos;t see a guide for your use case? Let us know what you&apos;d like to see
              covered.
            </p>
            <a
              href="https://github.com/BuunGroupCore/precast-app/issues/new?template=guide_request.md"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 text-sm font-medium inline-flex items-center gap-1"
            >
              Request Guide <FaExternalLinkAlt className="text-xs" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaReact,
  FaVuejs,
  FaAngular,
  FaNodeJs,
  FaPython,
  FaDatabase,
  FaDocker,
  FaGitAlt,
  FaJs,
  FaCss3,
  FaHtml5,
  FaPhp,
  FaJava,
  FaBolt,
  FaRocket,
  FaCog,
  FaServer,
  FaCode,
  FaGem,
} from "react-icons/fa";
import {
  SiTypescript,
  SiNextdotjs,
  SiSvelte,
  SiNuxtdotjs,
  SiVite,
  SiExpress,
  SiFastapi,
  SiDjango,
  SiFlask,
  SiRubyonrails,
  SiSpring,
  SiPostgresql,
  SiMongodb,
  SiMysql,
  SiRedis,
  SiPrisma,
  SiDrizzle,
  SiSequelize,
  SiTailwindcss,
  SiBootstrap,
  SiStyledcomponents,
  SiSass,
} from "react-icons/si";

// Service information database
const serviceInfo = {
  // Frontend Frameworks
  react: {
    name: "React",
    icon: FaReact,
    color: "text-blue-500",
    description:
      "A JavaScript library for building user interfaces with components",
    features: [
      "Virtual DOM",
      "Component-based",
      "Declarative",
      "Large ecosystem",
    ],
    category: "Frontend Framework",
    difficulty: "Intermediate",
    popularity: "★★★★★",
  },
  vue: {
    name: "Vue.js",
    icon: FaVuejs,
    color: "text-green-500",
    description: "Progressive JavaScript framework for building UIs",
    features: [
      "Template syntax",
      "Reactive data",
      "Easy learning curve",
      "Flexible",
    ],
    category: "Frontend Framework",
    difficulty: "Beginner",
    popularity: "★★★★☆",
  },
  angular: {
    name: "Angular",
    icon: FaAngular,
    color: "text-red-500",
    description: "Full-featured TypeScript framework by Google",
    features: [
      "TypeScript",
      "Dependency injection",
      "CLI tools",
      "Enterprise-ready",
    ],
    category: "Frontend Framework",
    difficulty: "Advanced",
    popularity: "★★★★☆",
  },
  next: {
    name: "Next.js",
    icon: SiNextdotjs,
    color: "text-black",
    description: "React framework with SSR, SSG, and routing built-in",
    features: [
      "Server-side rendering",
      "Static generation",
      "API routes",
      "Optimized",
    ],
    category: "Full-stack Framework",
    difficulty: "Intermediate",
    popularity: "★★★★★",
  },
  svelte: {
    name: "Svelte",
    icon: SiSvelte,
    color: "text-orange-500",
    description: "Compile-time framework with no runtime overhead",
    features: ["No virtual DOM", "Smaller bundles", "Less boilerplate", "Fast"],
    category: "Frontend Framework",
    difficulty: "Intermediate",
    popularity: "★★★☆☆",
  },
  nuxt: {
    name: "Nuxt.js",
    icon: SiNuxtdotjs,
    color: "text-green-400",
    description: "Vue.js framework with SSR and static site generation",
    features: ["Vue-based", "Auto-routing", "SEO friendly", "Module ecosystem"],
    category: "Full-stack Framework",
    difficulty: "Intermediate",
    popularity: "★★★☆☆",
  },
  vite: {
    name: "Vite",
    icon: SiVite,
    color: "text-purple-500",
    description: "Lightning fast build tool and dev server",
    features: ["Instant HMR", "ES modules", "Fast builds", "Plugin ecosystem"],
    category: "Build Tool",
    difficulty: "Beginner",
    popularity: "★★★★☆",
  },
  vanilla: {
    name: "Vanilla JS",
    icon: FaJs,
    color: "text-yellow-500",
    description: "Pure JavaScript without frameworks",
    features: [
      "No dependencies",
      "Full control",
      "Lightweight",
      "Standards-based",
    ],
    category: "Language",
    difficulty: "Intermediate",
    popularity: "★★★★★",
  },

  // Backend Frameworks
  node: {
    name: "Node.js",
    icon: FaNodeJs,
    color: "text-green-600",
    description: "JavaScript runtime for server-side development",
    features: [
      "Event-driven",
      "Non-blocking I/O",
      "NPM ecosystem",
      "Fast development",
    ],
    category: "Runtime",
    difficulty: "Intermediate",
    popularity: "★★★★★",
  },
  express: {
    name: "Express.js",
    icon: SiExpress,
    color: "text-gray-600",
    description: "Fast, minimalist web framework for Node.js",
    features: ["Middleware", "Routing", "Template engines", "Minimal setup"],
    category: "Backend Framework",
    difficulty: "Beginner",
    popularity: "★★★★★",
  },
  fastapi: {
    name: "FastAPI",
    icon: SiFastapi,
    color: "text-teal-500",
    description: "Modern Python web framework with automatic API docs",
    features: ["Type hints", "Auto docs", "Fast performance", "Async support"],
    category: "Backend Framework",
    difficulty: "Intermediate",
    popularity: "★★★★☆",
  },
  django: {
    name: "Django",
    icon: SiDjango,
    color: "text-green-700",
    description: "High-level Python web framework with batteries included",
    features: ["Admin interface", "ORM", "Security", "Scalable"],
    category: "Backend Framework",
    difficulty: "Intermediate",
    popularity: "★★★★☆",
  },
  flask: {
    name: "Flask",
    icon: SiFlask,
    color: "text-gray-700",
    description: "Lightweight Python web framework",
    features: ["Minimal", "Flexible", "Extensions", "Easy to learn"],
    category: "Backend Framework",
    difficulty: "Beginner",
    popularity: "★★★☆☆",
  },
  rails: {
    name: "Ruby on Rails",
    icon: SiRubyonrails,
    color: "text-red-600",
    description: "Web framework that follows convention over configuration",
    features: ["MVC pattern", "ActiveRecord", "Generators", "Testing built-in"],
    category: "Backend Framework",
    difficulty: "Intermediate",
    popularity: "★★★☆☆",
  },
  spring: {
    name: "Spring Boot",
    icon: SiSpring,
    color: "text-green-500",
    description: "Java framework for building production-ready applications",
    features: [
      "Auto-configuration",
      "Embedded servers",
      "Production-ready",
      "Enterprise",
    ],
    category: "Backend Framework",
    difficulty: "Advanced",
    popularity: "★★★★☆",
  },

  // Databases
  postgres: {
    name: "PostgreSQL",
    icon: SiPostgresql,
    color: "text-blue-600",
    description: "Advanced open-source relational database",
    features: ["ACID compliant", "JSON support", "Extensions", "Reliable"],
    category: "Database",
    difficulty: "Intermediate",
    popularity: "★★★★★",
  },
  mongodb: {
    name: "MongoDB",
    icon: SiMongodb,
    color: "text-green-500",
    description: "NoSQL document database with flexible schema",
    features: [
      "Document-based",
      "Horizontal scaling",
      "Flexible schema",
      "JSON-like",
    ],
    category: "NoSQL Database",
    difficulty: "Beginner",
    popularity: "★★★★☆",
  },
  mysql: {
    name: "MySQL",
    icon: SiMysql,
    color: "text-blue-500",
    description: "Popular open-source relational database",
    features: ["Reliable", "Fast", "Easy to use", "Wide support"],
    category: "Database",
    difficulty: "Beginner",
    popularity: "★★★★★",
  },
  redis: {
    name: "Redis",
    icon: SiRedis,
    color: "text-red-500",
    description: "In-memory data structure store used as cache and database",
    features: ["In-memory", "Key-value store", "Pub/Sub", "Lightning fast"],
    category: "Cache/Database",
    difficulty: "Intermediate",
    popularity: "★★★★☆",
  },

  // ORMs
  prisma: {
    name: "Prisma",
    icon: SiPrisma,
    color: "text-indigo-600",
    description: "Next-generation ORM with type safety and auto-completion",
    features: [
      "Type-safe",
      "Auto-migration",
      "Query builder",
      "Database introspection",
    ],
    category: "ORM",
    difficulty: "Beginner",
    popularity: "★★★★☆",
  },
  drizzle: {
    name: "Drizzle ORM",
    icon: SiDrizzle,
    color: "text-green-400",
    description: "Lightweight TypeScript ORM with SQL-like syntax",
    features: ["Lightweight", "SQL-like", "Type-safe", "Zero dependencies"],
    category: "ORM",
    difficulty: "Intermediate",
    popularity: "★★★☆☆",
  },
  sequelize: {
    name: "Sequelize",
    icon: SiSequelize,
    color: "text-blue-400",
    description: "Feature-rich ORM for Node.js with Promise support",
    features: ["Migrations", "Validations", "Associations", "Transactions"],
    category: "ORM",
    difficulty: "Intermediate",
    popularity: "★★★☆☆",
  },

  // Styling
  tailwind: {
    name: "Tailwind CSS",
    icon: SiTailwindcss,
    color: "text-cyan-500",
    description: "Utility-first CSS framework for rapid UI development",
    features: ["Utility classes", "Responsive", "Customizable", "Small bundle"],
    category: "CSS Framework",
    difficulty: "Beginner",
    popularity: "★★★★★",
  },
  bootstrap: {
    name: "Bootstrap",
    icon: SiBootstrap,
    color: "text-purple-600",
    description: "Popular CSS framework with pre-built components",
    features: ["Components", "Grid system", "Responsive", "Themes"],
    category: "CSS Framework",
    difficulty: "Beginner",
    popularity: "★★★★☆",
  },
  styled: {
    name: "Styled Components",
    icon: SiStyledcomponents,
    color: "text-pink-500",
    description: "CSS-in-JS library for styling React components",
    features: [
      "CSS-in-JS",
      "Dynamic styling",
      "Theme support",
      "No class conflicts",
    ],
    category: "CSS-in-JS",
    difficulty: "Intermediate",
    popularity: "★★★☆☆",
  },
  sass: {
    name: "Sass/SCSS",
    icon: SiSass,
    color: "text-pink-400",
    description: "CSS extension language with variables and nesting",
    features: ["Variables", "Nesting", "Mixins", "Functions"],
    category: "CSS Preprocessor",
    difficulty: "Beginner",
    popularity: "★★★★☆",
  },
  css: {
    name: "Plain CSS",
    icon: FaCss3,
    color: "text-blue-500",
    description: "Standard styling language for web pages",
    features: ["Universal", "Standards-based", "No build step", "Full control"],
    category: "Styling",
    difficulty: "Beginner",
    popularity: "★★★★★",
  },

  // Tools
  typescript: {
    name: "TypeScript",
    icon: SiTypescript,
    color: "text-blue-600",
    description:
      "Typed superset of JavaScript that compiles to plain JavaScript",
    features: [
      "Static typing",
      "IntelliSense",
      "Compile-time checks",
      "Modern JS features",
    ],
    category: "Language",
    difficulty: "Intermediate",
    popularity: "★★★★★",
  },
  docker: {
    name: "Docker",
    icon: FaDocker,
    color: "text-blue-500",
    description:
      "Platform for developing, shipping, and running applications in containers",
    features: [
      "Containerization",
      "Portable",
      "Consistent environments",
      "Scalable",
    ],
    category: "DevOps Tool",
    difficulty: "Intermediate",
    popularity: "★★★★★",
  },
  git: {
    name: "Git",
    icon: FaGitAlt,
    color: "text-orange-500",
    description: "Distributed version control system for tracking code changes",
    features: ["Version control", "Branching", "Distributed", "Collaboration"],
    category: "Version Control",
    difficulty: "Intermediate",
    popularity: "★★★★★",
  },
};

interface ServiceTooltipProps {
  serviceId: keyof typeof serviceInfo;
  children: React.ReactNode;
  placement?: "top" | "bottom" | "left" | "right";
  delay?: number;
}

export function ServiceTooltip({
  serviceId,
  children,
  placement = "top",
  delay = 300,
}: ServiceTooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  const service = serviceInfo[serviceId];
  if (!service) return <>{children}</>;

  const handleMouseEnter = () => {
    const id = setTimeout(() => setIsVisible(true), delay);
    setTimeoutId(id);
  };

  const handleMouseLeave = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      setTimeoutId(null);
    }
    setIsVisible(false);
  };

  const getPlacementStyles = () => {
    switch (placement) {
      case "top":
        return "bottom-full left-1/2 -translate-x-1/2 mb-2";
      case "bottom":
        return "top-full left-1/2 -translate-x-1/2 mt-2";
      case "left":
        return "right-full top-1/2 -translate-y-1/2 mr-2";
      case "right":
        return "left-full top-1/2 -translate-y-1/2 ml-2";
      default:
        return "bottom-full left-1/2 -translate-x-1/2 mb-2";
    }
  };

  const getArrowStyles = () => {
    switch (placement) {
      case "top":
        return "top-full left-1/2 -translate-x-1/2 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-comic-black";
      case "bottom":
        return "bottom-full left-1/2 -translate-x-1/2 border-l-8 border-r-8 border-b-8 border-l-transparent border-r-transparent border-b-comic-black";
      case "left":
        return "left-full top-1/2 -translate-y-1/2 border-t-8 border-b-8 border-l-8 border-t-transparent border-b-transparent border-l-comic-black";
      case "right":
        return "right-full top-1/2 -translate-y-1/2 border-t-8 border-b-8 border-r-8 border-t-transparent border-b-transparent border-r-comic-black";
      default:
        return "top-full left-1/2 -translate-x-1/2 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-comic-black";
    }
  };

  return (
    <div
      className="relative inline-block w-full h-full"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}

      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.8,
              y: placement === "top" ? 10 : -10,
            }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: placement === "top" ? 10 : -10 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 20,
              duration: 0.2,
            }}
            className={`
              absolute z-50 ${getPlacementStyles()}
              comic-panel p-4 w-72 pointer-events-none
              transform-gpu
            `}
            style={{
              backgroundColor: "var(--comic-white)",
              borderColor: "var(--comic-black)",
              boxShadow: "4px 4px 0px var(--comic-black)",
            }}
          >
            {/* Comic book arrow */}
            <div className={`absolute w-0 h-0 ${getArrowStyles()}`} />

            {/* Service header */}
            <div className="flex items-center gap-3 mb-3 pb-3 border-b-2 border-comic-black border-dashed">
              <div className="flex-shrink-0">
                <service.icon className={`text-2xl ${service.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-display text-base font-bold text-comic-darkBlue truncate">
                  {service.name}
                </h3>
                <div className="flex items-center gap-2 text-xs mt-1">
                  <span
                    className="px-2 py-1 rounded-full font-comic font-bold text-xs"
                    style={{
                      backgroundColor: "var(--comic-yellow)",
                      color: "var(--comic-black)",
                    }}
                  >
                    {service.category}
                  </span>
                  <span className="text-comic-gray font-comic">
                    {service.difficulty}
                  </span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mb-3 pb-3 border-b-2 border-comic-black border-dashed">
              <p className="text-xs text-comic-darkBlue font-comic leading-relaxed">
                {service.description}
              </p>
            </div>

            {/* Features */}
            <div className="mb-3 pb-3 border-b-2 border-comic-black border-dashed">
              <h4 className="font-comic font-bold text-xs uppercase text-comic-gray mb-2 flex items-center gap-1">
                <FaBolt className="text-comic-orange" size={10} />
                KEY FEATURES
              </h4>
              <div className="space-y-1">
                {service.features.map((feature, index) => (
                  <motion.div
                    key={feature}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center gap-2 text-xs"
                  >
                    <div className="w-1 h-1 bg-comic-orange rounded-full flex-shrink-0" />
                    <span className="font-comic text-comic-darkBlue">
                      {feature}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Popularity */}
            <div className="flex items-center justify-between text-xs">
              <span className="font-comic font-bold text-comic-gray flex items-center gap-1">
                <FaBolt className="text-comic-red" size={8} />
                POPULARITY
              </span>
              <span className="text-comic-orange font-bold font-display">
                {service.popularity}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// HOC for easy wrapping of service buttons
export function withServiceTooltip<T extends { serviceId?: string }>(
  Component: React.ComponentType<T>,
  defaultPlacement: "top" | "bottom" | "left" | "right" = "top",
) {
  return function WrappedComponent(props: T) {
    const { serviceId, ...otherProps } = props;

    if (!serviceId || !(serviceId in serviceInfo)) {
      return <Component {...(props as T)} />;
    }

    return (
      <ServiceTooltip
        serviceId={serviceId as keyof typeof serviceInfo}
        placement={defaultPlacement}
      >
        <Component {...(props as T)} />
      </ServiceTooltip>
    );
  };
}

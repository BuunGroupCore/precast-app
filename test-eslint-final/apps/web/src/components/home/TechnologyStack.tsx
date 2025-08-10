import { ExternalLink } from "lucide-react";
import { FaReact, FaNode } from "react-icons/fa";
import { SiVite, SiTailwindcss, SiTypescript } from "react-icons/si";

/**
 * Technology item interface
 */
interface TechnologyItem {
  name: string;
  icon: React.ReactNode;
  url: string;
  description: string;
  color: {
    gradient: string;
    border: string;
    bg: string;
    text: string;
  };
}

/**
 * Technology Stack component showcasing the selected technologies
 * Displays beautiful cards for each technology in the stack
 */
export function TechnologyStack() {
  const technologies: TechnologyItem[] = [
    {
      name: "React",
      icon: <FaReact className="w-12 h-12" />,
      url: "https://react.dev",
      description:
        "The library for web and native user interfaces. Learn about components, hooks, and the React ecosystem.",
      color: {
        gradient: "from-blue-600 to-cyan-600",
        border: "hover:border-blue-500/50",
        bg: "bg-blue-500/10 group-hover:bg-blue-500/20",
        text: "text-blue-400 group-hover:text-blue-300",
      },
    },
    {
      name: "Vite",
      icon: <SiVite className="w-12 h-12" />,
      url: "https://vitejs.dev",
      description:
        "Next generation frontend tooling with lightning fast development server and optimized builds.",
      color: {
        gradient: "from-yellow-600 to-orange-600",
        border: "hover:border-yellow-500/50",
        bg: "bg-yellow-500/10 group-hover:bg-yellow-500/20",
        text: "text-yellow-400 group-hover:text-yellow-300",
      },
    },
    {
      name: "Tailwind CSS",
      icon: <SiTailwindcss className="w-12 h-12" />,
      url: "https://tailwindcss.com",
      description:
        "Utility-first CSS framework for building beautiful interfaces without leaving your HTML.",
      color: {
        gradient: "from-cyan-600 to-teal-600",
        border: "hover:border-cyan-500/50",
        bg: "bg-cyan-500/10 group-hover:bg-cyan-500/20",
        text: "text-cyan-400 group-hover:text-cyan-300",
      },
    },
    {
      name: "TypeScript",
      icon: <SiTypescript className="w-12 h-12" />,
      url: "https://www.typescriptlang.org",
      description:
        "Strongly typed programming language that builds on JavaScript, giving you better tooling at any scale.",
      color: {
        gradient: "from-blue-600 to-indigo-600",
        border: "hover:border-blue-500/50",
        bg: "bg-blue-500/10 group-hover:bg-blue-500/20",
        text: "text-blue-400 group-hover:text-blue-300",
      },
    },
    {
      name: "Node.js",
      icon: <FaNode className="w-12 h-12" />,
      url: "https://nodejs.org",
      description:
        "JavaScript runtime built on Chrome's V8 JavaScript engine with a rich ecosystem of packages.",
      color: {
        gradient: "from-green-600 to-emerald-600",
        border: "hover:border-green-500/50",
        bg: "bg-green-500/10 group-hover:bg-green-500/20",
        text: "text-green-400 group-hover:text-green-300",
      },
    },
  ];

  return (
    <section className="mb-20">
      <h3 className="text-3xl font-bold text-white text-center mb-12">
        Explore Your Technology Stack
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {technologies.map((tech, index) => (
          <div key={index} className="group relative">
            <div
              className={`absolute -inset-0.5 bg-gradient-to-r ${tech.color.gradient} rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-300`}
            ></div>
            <a
              href={tech.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`relative flex flex-col h-full p-8 bg-slate-800/90 rounded-2xl border border-slate-700/50 ${tech.color.border} transition-all duration-300 group-hover:scale-105`}
            >
              <div
                className={`w-20 h-20 mb-6 p-4 ${tech.color.bg} rounded-2xl flex items-center justify-center transition-colors`}
              >
                <div className={tech.color.text.replace("group-hover:", "")}>{tech.icon}</div>
              </div>

              <h4 className="text-2xl font-bold text-white mb-3 group-hover:text-white/90 transition-colors">
                {tech.name}
              </h4>

              <p className="text-gray-400 text-center mb-6 leading-relaxed flex-grow">
                {tech.description}
              </p>

              <div
                className={`flex items-center justify-center gap-2 font-medium ${tech.color.text} transition-colors`}
              >
                <span>Learn {tech.name}</span>
                <ExternalLink className="w-4 h-4" />
              </div>
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}

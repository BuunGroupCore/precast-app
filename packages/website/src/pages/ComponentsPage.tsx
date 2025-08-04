import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ComponentsPageSEO } from "../components/SEO";
import {
  FaExternalLinkAlt,
  FaGithub,
  FaTerminal,
} from "react-icons/fa";

interface ComponentLibrary {
  name: string;
  description: string;
  url: string;
  github?: string;
  logo?: string;
  color: string;
  status: "live" | "coming-soon";
  tags: string[];
}

export function ComponentsPage() {
  const navigate = useNavigate();

  const componentLibraries: ComponentLibrary[] = [
    {
      name: "Brutalist UI",
      description: "Bold, raw, and unapologetically powerful UI components",
      url: "https://brutalist.precast.dev",
      github: "https://github.com/buun-group/brutalist-ui",
      color: "var(--comic-red)",
      status: "live",
      tags: ["React", "TypeScript", "Tailwind CSS"],
    },
    {
      name: "Comic Components",
      description: "Superhero-themed components with POW and BANG!",
      url: "#",
      color: "var(--comic-yellow)",
      status: "coming-soon",
      tags: ["React", "Framer Motion", "Comic Style"],
    },
    {
      name: "Neon Glow Kit",
      description: "Cyberpunk-inspired components that shine in the dark",
      url: "#",
      color: "var(--comic-purple)",
      status: "coming-soon",
      tags: ["Vue", "CSS Animations", "Dark Mode"],
    },
    {
      name: "Retro Wave",
      description: "80s synthwave aesthetic components for nostalgic builds",
      url: "#",
      color: "var(--comic-blue)",
      status: "coming-soon",
      tags: ["React", "Styled Components", "Retro"],
    },
    {
      name: "Minimal Plus",
      description: "Clean and simple components with a modern twist",
      url: "#",
      color: "var(--comic-gray)",
      status: "coming-soon",
      tags: ["React", "CSS Modules", "Minimal"],
    },
    {
      name: "Glass Morphism",
      description: "Translucent and blurred components for elegant UIs",
      url: "#",
      color: "var(--comic-blue)",
      status: "coming-soon",
      tags: ["React", "Glassmorphism", "Modern"],
    },
    {
      name: "Terminal UI",
      description: "Command-line inspired components for dev-focused apps",
      url: "#",
      color: "var(--comic-green)",
      status: "coming-soon",
      tags: ["React", "Monospace", "CLI Style"],
    },
    {
      name: "Paper Stack",
      description: "Material design inspired with paper-like aesthetics",
      url: "#",
      color: "var(--comic-orange)",
      status: "coming-soon",
      tags: ["React", "Material UI", "Shadows"],
    },
  ];

  return (
    <div>
      <ComponentsPageSEO />
      {/* Hero Section */}
      <section className="pb-8 sm:pb-12 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8 sm:mb-12"
          >
            <h1 className="action-text text-4xl sm:text-6xl md:text-8xl text-comic-green mb-6 sm:mb-8">
              COMPONENT ARSENAL
            </h1>
            <div className="speech-bubble max-w-2xl mx-auto">
              <p className="font-comic text-xl">
                Discover our collection of <strong>SUPER-POWERED</strong> UI
                component libraries! Each crafted with unique themes and
                extraordinary abilities!
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Component Libraries Grid */}
      <section className="pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {componentLibraries.map((library, index) => (
              <motion.div
                key={library.name}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                <div
                  className="comic-panel p-6 h-full"
                  style={{
                    backgroundColor:
                      library.status === "coming-soon"
                        ? "var(--comic-gray)"
                        : "var(--comic-white)",
                  }}
                >
                  {/* Status Badge */}
                  {library.status === "coming-soon" && (
                    <div
                      className="absolute -top-4 -right-4 action-text text-2xl"
                      style={{ color: library.color }}
                    >
                      SOON!
                    </div>
                  )}

                  {/* Library Header */}
                  <div className="flex items-start justify-between mb-4">
                    <h3
                      className="font-display text-3xl"
                      style={{ color: library.color }}
                    >
                      {library.name}
                    </h3>
                    <div className="flex gap-2">
                      {library.github && (
                        <motion.a
                          href={library.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          className="text-comic-black hover:text-comic-blue transition-colors"
                        >
                          <FaGithub size={24} />
                        </motion.a>
                      )}
                      {library.status === "live" && (
                        <motion.a
                          href={library.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          className="text-comic-black hover:text-comic-green transition-colors"
                        >
                          <FaExternalLinkAlt size={24} />
                        </motion.a>
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  <p className="font-comic text-lg mb-6">{library.description}</p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {library.tags.map((tag) => (
                      <span
                        key={tag}
                        className="badge-comic text-xs"
                        style={{
                          backgroundColor: library.color,
                          color: "var(--comic-white)",
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* CTA Button */}
                  {library.status === "live" ? (
                    <motion.a
                      href={library.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="btn-comic w-full text-center block"
                      style={{
                        backgroundColor: library.color,
                        color: "var(--comic-white)",
                      }}
                    >
                      EXPLORE COMPONENTS
                    </motion.a>
                  ) : (
                    <button
                      disabled
                      className="btn-comic w-full opacity-50 cursor-not-allowed"
                      style={{
                        backgroundColor: "var(--comic-gray)",
                        color: "var(--comic-black)",
                      }}
                    >
                      COMING SOON
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section
        className="py-20 px-4"
        style={{ backgroundColor: "var(--comic-yellow)" }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="action-text text-5xl md:text-6xl text-comic-black mb-6">
              BUILD YOUR OWN!
            </h2>
            <div className="speech-bubble bg-comic-white max-w-2xl mx-auto mb-8">
              <p className="font-comic text-xl text-comic-black">
                Want to create your own <strong>LEGENDARY</strong> component
                library? Use our CLI builder to kickstart your heroic journey!
              </p>
            </div>
            <motion.button
              onClick={() => navigate("/builder")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-bam flex items-center gap-2 mx-auto"
            >
              <FaTerminal />
              START BUILDING
            </motion.button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
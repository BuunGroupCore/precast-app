import { motion } from "framer-motion";
import { FaExternalLinkAlt, FaGithub, FaTerminal } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import { ComponentsPageSEO } from "@/features/common";

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

/**
 * Components page showcasing available UI component libraries.
 * Features brutalist UI and other component collections for rapid development.
 */
export function ComponentsPage() {
  const navigate = useNavigate();

  const componentLibraries: ComponentLibrary[] = [
    {
      name: "Brutalist UI",
      description: "Bold, raw, and unapologetically powerful UI components",
      url: "https://brutalist.precast.dev",
      github: "https://github.com/BuunGroup-Packages/precast-brutalist-components",
      logo: "https://brutalist.precast.dev/logo.png",
      color: "var(--comic-red)",
      status: "live",
      tags: ["React", "TypeScript", "Tailwind CSS"],
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
                Discover our collection of <strong>SUPER-POWERED</strong> UI component libraries!
                Each crafted with unique themes and extraordinary abilities!
              </p>
            </div>
          </motion.div>
        </div>

        {/* Comic Separator */}
        <div className="max-w-2xl mx-auto mb-16">
          <div className="relative">
            <div className="h-2 bg-comic-black rounded-full"></div>
            <div className="absolute left-1/2 transform -translate-x-1/2 -top-4">
              <div className="action-text text-2xl text-comic-green bg-comic-black px-4 py-1 rounded-full border-4 border-comic-green">
                ARSENAL!
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Component Libraries Grid */}
      <section className="pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center">
            {componentLibraries.map((library, index) => (
              <motion.div
                key={library.name}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                <div
                  className="comic-panel p-6 h-full max-w-md"
                  style={{
                    backgroundColor:
                      library.status === "coming-soon" ? "var(--comic-gray)" : "var(--comic-white)",
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

                  {/* Logo */}
                  {library.logo && (
                    <div className="mb-6 text-center">
                      <img
                        src={library.logo}
                        alt={`${library.name} logo`}
                        className="mx-auto h-16 w-auto"
                        loading="lazy"
                      />
                    </div>
                  )}

                  {/* Library Header */}
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="font-display text-3xl" style={{ color: library.color }}>
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
      <section className="py-20 px-4" style={{ backgroundColor: "var(--comic-yellow)" }}>
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
                Want to create your own <strong>LEGENDARY</strong> component library? Use our CLI
                builder to kickstart your heroic journey!
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

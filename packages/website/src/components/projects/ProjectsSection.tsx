import { motion } from "framer-motion";
import { useState } from "react";
import {
  FaGithub,
  FaExternalLinkAlt,
  FaCode,
  FaRocket,
  FaGamepad,
  FaTools,
  FaCube,
  FaServer,
  FaMagic,
  FaSearch,
  FaPaintBrush,
  FaBoxes,
  FaDatabase,
  FaCloud,
  FaRoute,
  FaFastForward,
  FaBook,
  FaWrench,
  FaBriefcase,
  FaUser,
} from "react-icons/fa";
import {
  SiTypescript,
  SiReact,
  SiNodedotjs,
  SiNextdotjs,
  SiTailwindcss,
  SiThreedotjs,
} from "react-icons/si";

import { ComicPageSeparator } from "@/components/home";
import { BrutalityUIIcon } from "@/components/icons/BrutalityUIIcon";
import { projects, projectCategories } from "@/data/projects";

/**
 * Get project-specific icon based on project title
 * @param title - Project title to match against
 * @returns React icon component for the project
 */
const getProjectIcon = (title: string) => {
  const titleLower = title.toLowerCase();

  if (titleLower.includes("starfighters")) return FaGamepad;
  if (titleLower.includes("buun group")) return FaRocket;
  if (titleLower.includes("interparcel")) return FaBoxes;
  if (titleLower.includes("osint") || titleLower.includes("intelligence")) return FaSearch;
  if (titleLower.includes("piixels")) return FaPaintBrush;
  if (titleLower.includes("brutalist")) return BrutalityUIIcon;

  return FaCode;
};

/**
 * Map project category to icon (fallback)
 * @param category - Project category string
 * @returns React icon component for the category
 */
const getCategoryIcon = (category: string) => {
  switch (category.toLowerCase()) {
    case "game":
    case "games":
      return FaGamepad;
    case "web applications":
    case "productivity":
      return FaRocket;
    case "opensource":
    case "npm packages":
      return FaCube;
    case "open source intelligence":
      return FaServer;
    default:
      return FaCode;
  }
};

/**
 * Get background color for project based on category count
 * @param categories - Array of project categories
 * @returns CSS class for background color
 */
const getCategoryColor = (categories: string[]) => {
  const colors = [
    "bg-comic-red",
    "bg-comic-blue",
    "bg-comic-green",
    "bg-comic-purple",
    "bg-comic-yellow",
    "bg-comic-orange",
  ];
  return colors[categories.length % colors.length];
};

/**
 * Get technology icon component based on technology name
 * @param tech - Technology/tool name
 * @returns React icon component for the technology
 */
const getTechIcon = (tech: string) => {
  const techLower = tech.toLowerCase();

  if (techLower.includes("typescript")) return SiTypescript;
  if (techLower.includes("react") && !techLower.includes("router")) return SiReact;
  if (techLower.includes("next")) return SiNextdotjs;
  if (techLower.includes("node")) return SiNodedotjs;
  if (techLower.includes("tailwind")) return SiTailwindcss;
  if (techLower.includes("three") || techLower.includes("3d")) return SiThreedotjs;
  if (techLower.includes("javascript")) return FaCode;
  if (techLower.includes("bun")) return FaFastForward;
  if (techLower.includes("shadcn") || techLower.includes("ui")) return FaCube;
  if (techLower.includes("storybook")) return FaBook;
  if (techLower.includes("supabase")) return FaServer;
  if (techLower.includes("dexie") || techLower.includes("database")) return FaDatabase;
  if (techLower.includes("cloudflare")) return FaCloud;
  if (techLower.includes("router")) return FaRoute;
  if (techLower.includes("vite")) return FaTools;
  if (techLower.includes("make")) return FaWrench;
  if (techLower.includes("github actions")) return FaRocket;
  if (techLower.includes("framer") || techLower.includes("motion")) return FaMagic;
  if (techLower.includes("jest") || techLower.includes("test")) return FaRocket;
  if (techLower.includes("axios")) return FaBoxes;
  if (techLower.includes("npm")) return FaCube;

  return FaCode;
};

/**
 * Filter options for project categories with their display labels and icons
 */
const categoryFilters: {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = projectCategories.map((category) => ({
  id: category,
  label: category.toUpperCase(),
  icon: getCategoryIcon(category),
}));

/**
 * Projects section component displaying all Buun Group open source projects.
 * Features category filtering, featured projects, and project statistics.
 */
export function ProjectsSection() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All Missions");
  const [hoveredProject, setHoveredProject] = useState<number | null>(null);
  const [failedImages, setFailedImages] = useState<Set<number>>(new Set());

  const filteredProjects = projects.filter(
    (project) =>
      selectedCategory === "All Missions" || project.categories.includes(selectedCategory)
  );

  const featuredProjects = filteredProjects.filter((p) => p.featured);
  const regularProjects = filteredProjects.filter((p) => !p.featured);

  return (
    <div className="min-h-screen bg-comic-dots">
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative py-20 px-4 overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-comic-yellow/20 via-comic-red/10 to-comic-blue/20" />
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="text-center mb-12"
          >
            <h1 className="action-text text-6xl md:text-8xl text-comic-black mb-4">OUR PROJECTS</h1>
            <p className="font-comic text-xl md:text-2xl text-comic-black">
              Projects from the Buun Group universe
            </p>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categoryFilters.map((category) => {
              const Icon = category.icon;
              return (
                <motion.button
                  key={category.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-lg border-3 border-comic-black font-display text-sm flex items-center gap-2 transition-all ${
                    selectedCategory === category.id
                      ? "bg-comic-red text-comic-white"
                      : "bg-comic-white text-comic-black hover:bg-comic-yellow"
                  }`}
                  style={{ boxShadow: "3px 3px 0 rgba(0,0,0,0.3)" }}
                >
                  <Icon className="text-lg" />
                  {category.label}
                </motion.button>
              );
            })}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="comic-panel bg-comic-yellow p-4 text-center"
            >
              <div className="action-text text-3xl text-comic-black">{projects.length}</div>
              <div className="font-comic text-sm text-comic-black">TOTAL PROJECTS</div>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="comic-panel bg-comic-green p-4 text-center"
            >
              <div className="action-text text-3xl text-comic-white">
                {projects.filter((p) => p.status === "active").length}
              </div>
              <div className="font-comic text-sm text-comic-white">ACTIVE</div>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="comic-panel bg-comic-blue p-4 text-center"
            >
              <div className="action-text text-3xl text-comic-white">
                {projects.filter((p) => p.featured).length}
              </div>
              <div className="font-comic text-sm text-comic-white">FEATURED</div>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="comic-panel bg-comic-purple p-4 text-center"
            >
              <div className="action-text text-3xl text-comic-white">∞</div>
              <div className="font-comic text-sm text-comic-white">POSSIBILITIES</div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {featuredProjects.length > 0 && (
        <section className="py-12 px-4">
          <div className="max-w-7xl mx-auto">
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="action-text text-3xl md:text-4xl text-comic-red mb-8"
            >
              ⭐ FEATURED PROJECTS
            </motion.h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProjects.map((project, index) => {
                const Icon = getProjectIcon(project.title);
                const color = getCategoryColor(project.categories);
                return (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    onMouseEnter={() => setHoveredProject(project.id)}
                    onMouseLeave={() => setHoveredProject(null)}
                    className="relative"
                  >
                    <div className={`comic-panel ${color} p-6 h-full relative overflow-hidden`}>
                      <div className="absolute top-4 right-4">
                        <span
                          className={`px-2 py-1 text-xs font-comic font-bold rounded-full border-2 border-comic-black ${
                            project.status === "Production"
                              ? "bg-comic-green text-comic-white"
                              : "bg-comic-yellow text-comic-black"
                          }`}
                        >
                          {project.status.toUpperCase()}
                        </span>
                      </div>

                      <div className="mb-4 flex justify-center">
                        {project.image && !failedImages.has(project.id) ? (
                          <img
                            src={project.image}
                            alt={project.title}
                            className={`${
                              project.title.toLowerCase().includes("interparcel")
                                ? "w-full h-16"
                                : "w-16 h-16"
                            } rounded-lg border-2 border-comic-white object-contain bg-white/10`}
                            onError={() => {
                              setFailedImages((prev) => new Set([...prev, project.id]));
                            }}
                          />
                        ) : (
                          <div className="flex justify-center">
                            <Icon className="text-5xl text-comic-white" />
                          </div>
                        )}
                      </div>

                      <h3 className="font-display text-2xl text-comic-white mb-2">
                        {project.title}
                      </h3>
                      <p className="font-comic text-sm text-comic-white/90 mb-4">
                        {project.description}
                      </p>

                      <div className="flex gap-2 mb-4 flex-wrap">
                        {project.technologies.slice(0, 4).map((tech, i) => {
                          const TechIcon = getTechIcon(tech);
                          return TechIcon ? (
                            <TechIcon key={i} className="text-xl text-comic-white/80" />
                          ) : null;
                        })}
                        {project.technologies.length > 4 && (
                          <span className="text-comic-white/60 text-sm font-comic">
                            +{project.technologies.length - 4}
                          </span>
                        )}
                      </div>

                      <div className="flex gap-3">
                        {project.githubUrl && (
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-2 bg-comic-black/20 hover:bg-comic-black/30 rounded-lg border-2 border-comic-black flex items-center gap-2 transition-colors"
                          >
                            <FaGithub className="text-comic-white" />
                            <span className="font-comic text-xs text-comic-white">
                              {project.stars ? `⭐ ${project.stars}` : "VIEW"}
                            </span>
                          </a>
                        )}
                        {project.liveUrl && (
                          <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-2 bg-comic-white/20 hover:bg-comic-white/30 rounded-lg border-2 border-comic-black flex items-center gap-2 transition-colors"
                          >
                            <FaExternalLinkAlt className="text-comic-white" />
                            <span className="font-comic text-xs text-comic-white">VISIT</span>
                          </a>
                        )}
                      </div>

                      {hoveredProject === project.id && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none"
                        />
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {regularProjects.length > 0 && (
        <section className="py-12 px-4 pb-20">
          <div className="max-w-7xl mx-auto">
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="action-text text-3xl md:text-4xl text-comic-blue mb-8"
            >
              MORE PROJECTS
            </motion.h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {regularProjects.map((project, index) => {
                const Icon = getProjectIcon(project.title);
                const color = getCategoryColor(project.categories);
                return (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    className="comic-panel bg-comic-white p-6"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1 flex justify-center">
                        {project.image && !failedImages.has(project.id) ? (
                          <img
                            src={project.image}
                            alt={project.title}
                            className={`${
                              project.title.toLowerCase().includes("interparcel")
                                ? "w-full h-12"
                                : "w-12 h-12"
                            } rounded-lg border-2 border-comic-black object-contain bg-gray-50`}
                            onError={() => {
                              setFailedImages((prev) => new Set([...prev, project.id]));
                            }}
                          />
                        ) : (
                          <div className="flex justify-center">
                            <Icon className={`text-4xl ${color.replace("bg-", "text-")}`} />
                          </div>
                        )}
                      </div>
                      <span
                        className={`px-2 py-1 text-xs font-comic font-bold rounded-full border-2 border-comic-black ${
                          project.status === "Production"
                            ? "bg-comic-green text-comic-white"
                            : "bg-comic-yellow text-comic-black"
                        }`}
                      >
                        {project.status.toUpperCase()}
                      </span>
                    </div>

                    <h3 className="font-display text-xl text-comic-black mb-2">{project.title}</h3>
                    <p className="font-comic text-sm text-comic-gray mb-4">{project.description}</p>

                    <div className="flex gap-2 mb-4 flex-wrap">
                      {project.technologies.slice(0, 4).map((tech, i) => {
                        const TechIcon = getTechIcon(tech);
                        return TechIcon ? (
                          <TechIcon key={i} className="text-lg text-comic-gray" />
                        ) : null;
                      })}
                      {project.technologies.length > 4 && (
                        <span className="text-comic-gray text-sm font-comic">
                          +{project.technologies.length - 4}
                        </span>
                      )}
                    </div>

                    <div className="flex gap-3">
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 px-3 py-2 bg-comic-black text-comic-white rounded-lg border-2 border-comic-black hover:bg-comic-gray transition-colors flex items-center justify-center gap-2"
                        >
                          <FaGithub />
                          <span className="font-comic text-xs">CODE</span>
                        </a>
                      )}
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 px-3 py-2 bg-comic-blue text-comic-white rounded-lg border-2 border-comic-black hover:bg-comic-darkBlue transition-colors flex items-center justify-center gap-2"
                        >
                          <FaExternalLinkAlt />
                          <span className="font-comic text-xs">VISIT</span>
                        </a>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      <ComicPageSeparator
        topColor="transparent"
        bottomColor="var(--comic-blue)"
        text="HIRE ME!"
        icon={<FaBriefcase />}
        pageNumber={1}
        textBgColor="var(--comic-yellow)"
        textColor="var(--comic-orange)"
      />

      <section className="py-16 px-4 bg-comic-blue">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex justify-center mb-6">
              <div className="comic-panel bg-comic-yellow p-4">
                <FaUser className="text-4xl text-comic-black" />
              </div>
            </div>
            <h2 className="action-text text-4xl md:text-5xl text-comic-yellow mb-4">
              LIKE MY WORK?
            </h2>
            <p className="font-comic text-xl text-comic-white mb-8">
              If you like my web design, automation, and AI integration skills, let&apos;s work
              together!
            </p>
            <motion.a
              href="https://sacha.roussakis-notter.com"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-comic bg-comic-yellow text-comic-black hover:bg-comic-white inline-flex items-center gap-3 text-lg"
            >
              <FaBriefcase className="text-2xl" />
              HIRE ME
            </motion.a>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

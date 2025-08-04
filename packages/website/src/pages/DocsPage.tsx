import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { DocsPageSEO } from "../components/SEO";
import { GettingStartedDocs } from "../components/docs/GettingStartedDocs";
import { InstallationDocs } from "../components/docs/InstallationDocs";
import {
  FaBook,
  FaRocket,
  FaCode,
  FaCog,
  FaTerminal,
  FaDatabase,
  FaPuzzlePiece,
  FaShieldAlt,
  FaChevronRight,
  FaChevronDown,
  FaHashtag,
  FaBars,
  FaTimes,
} from "react-icons/fa";

interface DocSection {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  subsections?: { id: string; title: string }[];
}

const docSections: DocSection[] = [
  {
    id: "getting-started",
    title: "Getting Started",
    icon: FaRocket,
    subsections: [
      { id: "installation", title: "Installation" },
      { id: "quick-start", title: "Quick Start" },
      { id: "project-structure", title: "Project Structure" },
    ],
  },
  {
    id: "cli-usage",
    title: "CLI Usage",
    icon: FaTerminal,
    subsections: [
      { id: "commands", title: "Commands" },
      { id: "options", title: "Options" },
      { id: "configuration", title: "Configuration" },
    ],
  },
  {
    id: "frameworks",
    title: "Frameworks",
    icon: FaCode,
    subsections: [
      { id: "react", title: "React" },
      { id: "vue", title: "Vue" },
      { id: "angular", title: "Angular" },
      { id: "next", title: "Next.js" },
    ],
  },
  {
    id: "backends",
    title: "Backend Options",
    icon: FaCog,
    subsections: [
      { id: "node", title: "Node.js" },
      { id: "express", title: "Express" },
      { id: "fastapi", title: "FastAPI" },
      { id: "hono", title: "Hono" },
    ],
  },
  {
    id: "databases",
    title: "Databases",
    icon: FaDatabase,
    subsections: [
      { id: "postgres", title: "PostgreSQL" },
      { id: "mongodb", title: "MongoDB" },
      { id: "mysql", title: "MySQL" },
      { id: "supabase", title: "Supabase" },
    ],
  },
  {
    id: "plugins",
    title: "Plugins & Extensions",
    icon: FaPuzzlePiece,
  },
  {
    id: "advanced",
    title: "Advanced Topics",
    icon: FaShieldAlt,
    subsections: [
      { id: "custom-templates", title: "Custom Templates" },
      { id: "plugin-development", title: "Plugin Development" },
      { id: "ci-cd", title: "CI/CD Integration" },
    ],
  },
];

export function DocsPage() {
  const [activeSection, setActiveSection] = useState("getting-started");
  const [expandedSections, setExpandedSections] = useState<string[]>(["getting-started"]);
  const [activeTocItem, setActiveTocItem] = useState("");
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isMobileTocOpen, setIsMobileTocOpen] = useState(false);

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) =>
      prev.includes(sectionId)
        ? prev.filter((id) => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const currentSection = docSections.find((s) => s.id === activeSection);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const yOffset = -160; // Account for fixed header
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
      setActiveTocItem(sectionId);
    }
  };

  return (
    <>
      <DocsPageSEO />
      {/* Mobile Navigation Toggle */}
      <div className="xl:hidden fixed top-36 left-4 z-40">
        <button
          onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
          className="p-3 rounded-lg border-2 font-comic"
          style={{
            backgroundColor: "var(--comic-yellow)",
            borderColor: "var(--comic-black)",
            boxShadow: "2px 2px 0 var(--comic-black)"
          }}
        >
          {isMobileNavOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile TOC Toggle */}
      <div className="xl:hidden fixed top-36 right-4 z-40">
        <button
          onClick={() => setIsMobileTocOpen(!isMobileTocOpen)}
          className="p-3 rounded-lg border-2 font-comic"
          style={{
            backgroundColor: "var(--comic-blue)",
            borderColor: "var(--comic-black)",
            color: "var(--comic-white)",
            boxShadow: "2px 2px 0 var(--comic-black)"
          }}
        >
          <FaHashtag />
        </button>
      </div>

      <div className="flex min-h-[calc(100vh-8rem)]">
        {/* Left Sidebar */}
      <aside className={`w-80 sticky top-32 h-[calc(100vh-8rem)] p-4 flex-shrink-0 xl:block ${isMobileNavOpen ? 'fixed inset-0 z-30 bg-white' : 'hidden'}`}>
        <div
          className="relative border-4 rounded-lg p-4 h-full overflow-y-auto"
          style={{
            borderColor: "var(--comic-black)",
            backgroundColor: "var(--comic-white)",
            boxShadow: "4px 4px 0 var(--comic-black)"
          }}
        >
          <h2 className="font-display text-2xl text-comic-purple mb-6">
            DOCUMENTATION
          </h2>
          <nav className="space-y-2">
          {docSections.map((section) => (
            <div key={section.id}>
              <button
                onClick={() => {
                  setActiveSection(section.id);
                  if (section.subsections) {
                    toggleSection(section.id);
                  }
                }}
                className={`w-full flex items-center justify-between p-3 rounded-lg font-comic text-sm transition-all ${
                  activeSection === section.id
                    ? "bg-comic-yellow text-comic-black border-2 border-comic-black shadow-comic"
                    : "hover:bg-comic-yellow/20"
                }`}
              >
                <div className="flex items-center gap-2">
                  <section.icon className="text-lg" />
                  <span>{section.title}</span>
                </div>
                {section.subsections && (
                  expandedSections.includes(section.id) ? (
                    <FaChevronDown className="text-xs" />
                  ) : (
                    <FaChevronRight className="text-xs" />
                  )
                )}
              </button>
              {section.subsections && expandedSections.includes(section.id) && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="ml-6 mt-1 space-y-1"
                >
                  {section.subsections.map((sub) => (
                    <button
                      key={sub.id}
                      onClick={() => setActiveSection(`${section.id}-${sub.id}`)}
                      className={`w-full text-left p-2 rounded font-comic text-xs transition-all ${
                        activeSection === `${section.id}-${sub.id}`
                          ? "bg-comic-blue text-comic-white"
                          : "hover:bg-comic-blue/20"
                      }`}
                    >
                      {sub.title}
                    </button>
                  ))}
                </motion.div>
              )}
            </div>
          ))}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 px-4 xl:px-8 py-6 overflow-y-auto">
        <motion.div
          key={activeSection}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Content Header */}
          <div className="mb-8">
            <h1 className="action-text text-4xl md:text-5xl text-comic-red mb-4">
              {currentSection?.title || "Documentation"}
            </h1>
            <div className="speech-bubble max-w-2xl">
              <p className="font-comic text-lg">
                Learn how to use PRECAST to build amazing projects with superhero speed!
              </p>
            </div>
          </div>

          {/* Dynamic Content Rendering */}
          <div className="space-y-8">
            {activeSection === "getting-started" && <GettingStartedDocs />}
            {activeSection === "getting-started-installation" && <InstallationDocs />}
            
            {/* Placeholder content for other sections */}
            {activeSection === "cli-usage" && (
              <div className="comic-panel p-6">
                <h2 className="font-display text-3xl text-comic-blue mb-4">CLI Usage</h2>
                <p className="font-comic">Documentation for CLI usage coming soon!</p>
              </div>
            )}
            
            {activeSection === "frameworks" && (
              <div className="comic-panel p-6">
                <h2 className="font-display text-3xl text-comic-red mb-4">Frameworks</h2>
                <p className="font-comic">Framework-specific documentation coming soon!</p>
              </div>
            )}
            
            {activeSection === "backends" && (
              <div className="comic-panel p-6">
                <h2 className="font-display text-3xl text-comic-green mb-4">Backend Options</h2>
                <p className="font-comic">Backend integration documentation coming soon!</p>
              </div>
            )}
            
            {activeSection === "databases" && (
              <div className="comic-panel p-6">
                <h2 className="font-display text-3xl text-comic-purple mb-4">Databases</h2>
                <p className="font-comic">Database configuration documentation coming soon!</p>
              </div>
            )}
            
            {activeSection === "plugins" && (
              <div className="comic-panel p-6">
                <h2 className="font-display text-3xl text-comic-yellow mb-4">Plugins & Extensions</h2>
                <p className="font-comic">Plugin system documentation coming soon!</p>
              </div>
            )}
            
            {activeSection === "advanced" && (
              <div className="comic-panel p-6">
                <h2 className="font-display text-3xl text-comic-orange mb-4">Advanced Topics</h2>
                <p className="font-comic">Advanced usage documentation coming soon!</p>
              </div>
            )}
          </div>
        </motion.div>
      </main>

      {/* Right Table of Contents */}
      <aside className={`w-80 sticky top-32 h-[calc(100vh-8rem)] p-4 flex-shrink-0 xl:block ${isMobileTocOpen ? 'fixed inset-0 z-30 bg-white' : 'hidden'}`}>
        <div
          className="relative border-4 rounded-lg p-4 h-full"
          style={{
            borderColor: "var(--comic-black)",
            backgroundColor: "var(--comic-white)",
            boxShadow: "4px 4px 0 var(--comic-black)"
          }}
        >
          <h3 className="font-display text-xl text-comic-purple mb-4 flex items-center gap-2">
            <FaHashtag />
            ON THIS PAGE
          </h3>
          <nav className="space-y-2">
            {activeSection === "getting-started" && (
              <>
                <button
                  onClick={() => scrollToSection("overview")}
                  className={`w-full text-left font-comic text-sm transition-all py-2 px-3 rounded-lg border-2 ${
                    activeTocItem === "overview"
                      ? "bg-comic-yellow text-comic-black border-comic-black shadow-comic"
                      : "text-comic-black hover:bg-comic-yellow/20 border-transparent"
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => scrollToSection("requirements")}
                  className={`w-full text-left font-comic text-sm transition-all py-2 px-3 rounded-lg border-2 ${
                    activeTocItem === "requirements"
                      ? "bg-comic-yellow text-comic-black border-comic-black shadow-comic"
                      : "text-comic-black hover:bg-comic-yellow/20 border-transparent"
                  }`}
                >
                  Requirements
                </button>
                <button
                  onClick={() => scrollToSection("quick-start")}
                  className={`w-full text-left font-comic text-sm transition-all py-2 px-3 rounded-lg border-2 ${
                    activeTocItem === "quick-start"
                      ? "bg-comic-yellow text-comic-black border-comic-black shadow-comic"
                      : "text-comic-black hover:bg-comic-yellow/20 border-transparent"
                  }`}
                >
                  Quick Start Guide
                </button>
              </>
            )}
            {activeSection === "getting-started-installation" && (
              <>
                <button
                  onClick={() => scrollToSection("installation")}
                  className={`w-full text-left font-comic text-sm transition-all py-2 px-3 rounded-lg border-2 ${
                    activeTocItem === "installation"
                      ? "bg-comic-yellow text-comic-black border-comic-black shadow-comic"
                      : "text-comic-black hover:bg-comic-yellow/20 border-transparent"
                  }`}
                >
                  Installation
                </button>
                <button
                  onClick={() => scrollToSection("package-managers")}
                  className={`w-full text-left font-comic text-sm transition-all py-2 px-3 rounded-lg border-2 ${
                    activeTocItem === "package-managers"
                      ? "bg-comic-yellow text-comic-black border-comic-black shadow-comic"
                      : "text-comic-black hover:bg-comic-yellow/20 border-transparent"
                  }`}
                >
                  Package Managers
                </button>
                <button
                  onClick={() => scrollToSection("global-installation")}
                  className={`w-full text-left font-comic text-sm transition-all py-2 px-3 rounded-lg border-2 ${
                    activeTocItem === "global-installation"
                      ? "bg-comic-yellow text-comic-black border-comic-black shadow-comic"
                      : "text-comic-black hover:bg-comic-yellow/20 border-transparent"
                  }`}
                >
                  Global Installation
                </button>
              </>
            )}
          </nav>
        </div>
      </aside>
      </div>
    </>
  );
}
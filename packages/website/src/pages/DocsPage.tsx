import { motion } from "framer-motion";
import { useState } from "react";
import {
  FaRocket,
  FaCode,
  FaTerminal,
  FaDatabase,
  FaChevronRight,
  FaChevronDown,
  FaHashtag,
  FaBars,
  FaTimes,
} from "react-icons/fa";

import { CliCommandsDocs } from "../components/docs/CliCommandsDocs";
import { AddCommandDocs } from "../components/docs/commands/AddCommandDocs";
import { AddFeaturesCommandDocs } from "../components/docs/commands/AddFeaturesCommandDocs";
import { BannerCommandDocs } from "../components/docs/commands/BannerCommandDocs";
import { InitCommandDocs } from "../components/docs/commands/InitCommandDocs";
import { ListCommandDocs } from "../components/docs/commands/ListCommandDocs";
import { FAQDocs } from "../components/docs/FAQDocs";
import { GettingStartedSimple } from "../components/docs/GettingStartedSimple";
import { DocsPageSEO } from "../components/SEO";

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
  },
  {
    id: "cli-commands",
    title: "CLI Commands",
    icon: FaTerminal,
    subsections: [
      { id: "init", title: "init" },
      { id: "add", title: "add" },
      { id: "add-features", title: "add-features" },
      { id: "banner", title: "banner" },
      { id: "list", title: "list" },
    ],
  },
  {
    id: "guides",
    title: "Guides",
    icon: FaCode,
  },
  {
    id: "faq",
    title: "FAQ",
    icon: FaDatabase,
  },
];

/**
 * Documentation page with sidebar navigation and table of contents.
 * Displays guides, CLI commands documentation, and FAQs.
 */
export function DocsPage() {
  const [activeSection, setActiveSection] = useState("getting-started");
  const [expandedSections, setExpandedSections] = useState<string[]>(["getting-started"]);
  const [activeTocItem, setActiveTocItem] = useState("");
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isMobileTocOpen, setIsMobileTocOpen] = useState(false);

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) =>
      prev.includes(sectionId) ? prev.filter((id) => id !== sectionId) : [...prev, sectionId]
    );
  };

  const currentSection = docSections.find((s) => s.id === activeSection);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      // Account for fixed header
      const yOffset = -160;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
      setActiveTocItem(sectionId);
    }
  };

  return (
    <>
      <DocsPageSEO />
      <div className="xl:hidden fixed top-36 left-4 z-40">
        <button
          onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
          className="p-3 rounded-lg border-2 font-comic"
          style={{
            backgroundColor: "var(--comic-yellow)",
            borderColor: "var(--comic-black)",
            boxShadow: "2px 2px 0 var(--comic-black)",
          }}
        >
          {isMobileNavOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      <div className="xl:hidden fixed top-36 right-4 z-40">
        <button
          onClick={() => setIsMobileTocOpen(!isMobileTocOpen)}
          className="p-3 rounded-lg border-2 font-comic"
          style={{
            backgroundColor: "var(--comic-blue)",
            borderColor: "var(--comic-black)",
            color: "var(--comic-white)",
            boxShadow: "2px 2px 0 var(--comic-black)",
          }}
        >
          <FaHashtag />
        </button>
      </div>

      <div className="flex min-h-[calc(100vh-8rem)]">
        <aside
          className={`w-80 sticky top-32 h-[calc(100vh-8rem)] p-4 flex-shrink-0 xl:block ${isMobileNavOpen ? "fixed inset-0 z-30 bg-white" : "hidden"}`}
        >
          <div
            className="relative border-4 rounded-lg p-4 h-full overflow-y-auto"
            style={{
              borderColor: "var(--comic-black)",
              backgroundColor: "var(--comic-white)",
              boxShadow: "4px 4px 0 var(--comic-black)",
            }}
          >
            <h2 className="font-display text-2xl text-comic-purple mb-6">DOCUMENTATION</h2>
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
                    {section.subsections &&
                      (expandedSections.includes(section.id) ? (
                        <FaChevronDown className="text-xs" />
                      ) : (
                        <FaChevronRight className="text-xs" />
                      ))}
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

        <main className="flex-1 px-4 xl:px-8 py-6 overflow-y-auto">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="mb-8">
              <h1 className="action-text text-4xl md:text-5xl text-comic-red mb-4">
                {activeSection.startsWith("cli-commands-")
                  ? "CLI Commands"
                  : currentSection?.title || "Documentation"}
              </h1>
              <div className="speech-bubble max-w-2xl">
                <p className="font-comic text-lg">
                  Learn how to use PRECAST to build amazing projects with superhero speed!
                </p>
              </div>
            </div>

            <div className="max-w-2xl mb-8">
              <div className="relative">
                <div className="h-2 bg-comic-black rounded-full"></div>
                <div className="absolute left-1/2 transform -translate-x-1/2 -top-4">
                  <div className="action-text text-2xl text-comic-red bg-comic-black px-4 py-1 rounded-full border-4 border-comic-red">
                    LEARN!
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              {activeSection === "getting-started" && <GettingStartedSimple />}
              {activeSection === "cli-commands" && <CliCommandsDocs />}
              {activeSection === "cli-commands-init" && <InitCommandDocs />}
              {activeSection === "cli-commands-add" && <AddCommandDocs />}
              {activeSection === "cli-commands-add-features" && <AddFeaturesCommandDocs />}
              {activeSection === "cli-commands-banner" && <BannerCommandDocs />}
              {activeSection === "cli-commands-list" && <ListCommandDocs />}
              {activeSection === "guides" && (
                <div className="comic-panel p-6">
                  <h2 className="font-display text-3xl text-comic-green mb-4">Guides</h2>
                  <p className="font-comic">Detailed guides coming soon!</p>
                </div>
              )}
              {activeSection === "faq" && <FAQDocs />}
            </div>
          </motion.div>
        </main>

        <aside
          className={`w-80 sticky top-32 h-[calc(100vh-8rem)] p-4 flex-shrink-0 xl:block ${isMobileTocOpen ? "fixed inset-0 z-30 bg-white" : "hidden"}`}
        >
          <div
            className="relative border-4 rounded-lg p-4 h-full"
            style={{
              borderColor: "var(--comic-black)",
              backgroundColor: "var(--comic-white)",
              boxShadow: "4px 4px 0 var(--comic-black)",
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
                    onClick={() => scrollToSection("project-setup")}
                    className={`w-full text-left font-comic text-sm transition-all py-2 px-3 rounded-lg border-2 ${
                      activeTocItem === "project-setup"
                        ? "bg-comic-yellow text-comic-black border-comic-black shadow-comic"
                        : "text-comic-black hover:bg-comic-yellow/20 border-transparent"
                    }`}
                  >
                    Project Setup
                  </button>
                  <button
                    onClick={() => scrollToSection("next-steps")}
                    className={`w-full text-left font-comic text-sm transition-all py-2 px-3 rounded-lg border-2 ${
                      activeTocItem === "next-steps"
                        ? "bg-comic-yellow text-comic-black border-comic-black shadow-comic"
                        : "text-comic-black hover:bg-comic-yellow/20 border-transparent"
                    }`}
                  >
                    Next Steps
                  </button>
                </>
              )}
              {activeSection === "cli-commands" && (
                <>
                  <button
                    onClick={() => scrollToSection("commands")}
                    className={`w-full text-left font-comic text-sm transition-all py-2 px-3 rounded-lg border-2 ${
                      activeTocItem === "commands"
                        ? "bg-comic-yellow text-comic-black border-comic-black shadow-comic"
                        : "text-comic-black hover:bg-comic-yellow/20 border-transparent"
                    }`}
                  >
                    CLI Commands
                  </button>
                  <button
                    onClick={() => scrollToSection("examples")}
                    className={`w-full text-left font-comic text-sm transition-all py-2 px-3 rounded-lg border-2 ${
                      activeTocItem === "examples"
                        ? "bg-comic-yellow text-comic-black border-comic-black shadow-comic"
                        : "text-comic-black hover:bg-comic-yellow/20 border-transparent"
                    }`}
                  >
                    Examples
                  </button>
                </>
              )}
              {activeSection === "cli-commands-init" && (
                <>
                  <button
                    onClick={() => scrollToSection("init-overview")}
                    className={`w-full text-left font-comic text-sm transition-all py-2 px-3 rounded-lg border-2 ${
                      activeTocItem === "init-overview"
                        ? "bg-comic-yellow text-comic-black border-comic-black shadow-comic"
                        : "text-comic-black hover:bg-comic-yellow/20 border-transparent"
                    }`}
                  >
                    Overview
                  </button>
                  <button
                    onClick={() => scrollToSection("init-options")}
                    className={`w-full text-left font-comic text-sm transition-all py-2 px-3 rounded-lg border-2 ${
                      activeTocItem === "init-options"
                        ? "bg-comic-yellow text-comic-black border-comic-black shadow-comic"
                        : "text-comic-black hover:bg-comic-yellow/20 border-transparent"
                    }`}
                  >
                    Options
                  </button>
                  <button
                    onClick={() => scrollToSection("init-examples")}
                    className={`w-full text-left font-comic text-sm transition-all py-2 px-3 rounded-lg border-2 ${
                      activeTocItem === "init-examples"
                        ? "bg-comic-yellow text-comic-black border-comic-black shadow-comic"
                        : "text-comic-black hover:bg-comic-yellow/20 border-transparent"
                    }`}
                  >
                    Examples
                  </button>
                </>
              )}
              {activeSection === "cli-commands-add" && (
                <>
                  <button
                    onClick={() => scrollToSection("add-overview")}
                    className={`w-full text-left font-comic text-sm transition-all py-2 px-3 rounded-lg border-2 ${
                      activeTocItem === "add-overview"
                        ? "bg-comic-yellow text-comic-black border-comic-black shadow-comic"
                        : "text-comic-black hover:bg-comic-yellow/20 border-transparent"
                    }`}
                  >
                    Overview
                  </button>
                  <button
                    onClick={() => scrollToSection("add-resources")}
                    className={`w-full text-left font-comic text-sm transition-all py-2 px-3 rounded-lg border-2 ${
                      activeTocItem === "add-resources"
                        ? "bg-comic-yellow text-comic-black border-comic-black shadow-comic"
                        : "text-comic-black hover:bg-comic-yellow/20 border-transparent"
                    }`}
                  >
                    Available Resources
                  </button>
                  <button
                    onClick={() => scrollToSection("add-options")}
                    className={`w-full text-left font-comic text-sm transition-all py-2 px-3 rounded-lg border-2 ${
                      activeTocItem === "add-options"
                        ? "bg-comic-yellow text-comic-black border-comic-black shadow-comic"
                        : "text-comic-black hover:bg-comic-yellow/20 border-transparent"
                    }`}
                  >
                    Options
                  </button>
                  <button
                    onClick={() => scrollToSection("add-examples")}
                    className={`w-full text-left font-comic text-sm transition-all py-2 px-3 rounded-lg border-2 ${
                      activeTocItem === "add-examples"
                        ? "bg-comic-yellow text-comic-black border-comic-black shadow-comic"
                        : "text-comic-black hover:bg-comic-yellow/20 border-transparent"
                    }`}
                  >
                    Examples
                  </button>
                </>
              )}
              {activeSection === "cli-commands-add-features" && (
                <>
                  <button
                    onClick={() => scrollToSection("add-features-overview")}
                    className={`w-full text-left font-comic text-sm transition-all py-2 px-3 rounded-lg border-2 ${
                      activeTocItem === "add-features-overview"
                        ? "bg-comic-yellow text-comic-black border-comic-black shadow-comic"
                        : "text-comic-black hover:bg-comic-yellow/20 border-transparent"
                    }`}
                  >
                    Overview
                  </button>
                  <button
                    onClick={() => scrollToSection("add-features-options")}
                    className={`w-full text-left font-comic text-sm transition-all py-2 px-3 rounded-lg border-2 ${
                      activeTocItem === "add-features-options"
                        ? "bg-comic-yellow text-comic-black border-comic-black shadow-comic"
                        : "text-comic-black hover:bg-comic-yellow/20 border-transparent"
                    }`}
                  >
                    Options
                  </button>
                  <button
                    onClick={() => scrollToSection("add-features-examples")}
                    className={`w-full text-left font-comic text-sm transition-all py-2 px-3 rounded-lg border-2 ${
                      activeTocItem === "add-features-examples"
                        ? "bg-comic-yellow text-comic-black border-comic-black shadow-comic"
                        : "text-comic-black hover:bg-comic-yellow/20 border-transparent"
                    }`}
                  >
                    Examples
                  </button>
                </>
              )}
              {activeSection === "cli-commands-banner" && (
                <>
                  <button
                    onClick={() => scrollToSection("banner-overview")}
                    className={`w-full text-left font-comic text-sm transition-all py-2 px-3 rounded-lg border-2 ${
                      activeTocItem === "banner-overview"
                        ? "bg-comic-yellow text-comic-black border-comic-black shadow-comic"
                        : "text-comic-black hover:bg-comic-yellow/20 border-transparent"
                    }`}
                  >
                    Overview
                  </button>
                  <button
                    onClick={() => scrollToSection("banner-how-it-works")}
                    className={`w-full text-left font-comic text-sm transition-all py-2 px-3 rounded-lg border-2 ${
                      activeTocItem === "banner-how-it-works"
                        ? "bg-comic-yellow text-comic-black border-comic-black shadow-comic"
                        : "text-comic-black hover:bg-comic-yellow/20 border-transparent"
                    }`}
                  >
                    How it Works
                  </button>
                  <button
                    onClick={() => scrollToSection("banner-example")}
                    className={`w-full text-left font-comic text-sm transition-all py-2 px-3 rounded-lg border-2 ${
                      activeTocItem === "banner-example"
                        ? "bg-comic-yellow text-comic-black border-comic-black shadow-comic"
                        : "text-comic-black hover:bg-comic-yellow/20 border-transparent"
                    }`}
                  >
                    Example
                  </button>
                </>
              )}
              {activeSection === "cli-commands-list" && (
                <>
                  <button
                    onClick={() => scrollToSection("list-overview")}
                    className={`w-full text-left font-comic text-sm transition-all py-2 px-3 rounded-lg border-2 ${
                      activeTocItem === "list-overview"
                        ? "bg-comic-yellow text-comic-black border-comic-black shadow-comic"
                        : "text-comic-black hover:bg-comic-yellow/20 border-transparent"
                    }`}
                  >
                    Overview
                  </button>
                  <button
                    onClick={() => scrollToSection("list-future")}
                    className={`w-full text-left font-comic text-sm transition-all py-2 px-3 rounded-lg border-2 ${
                      activeTocItem === "list-future"
                        ? "bg-comic-yellow text-comic-black border-comic-black shadow-comic"
                        : "text-comic-black hover:bg-comic-yellow/20 border-transparent"
                    }`}
                  >
                    Future Functionality
                  </button>
                </>
              )}
              {activeSection === "faq" && (
                <button
                  onClick={() => scrollToSection("faq-section")}
                  className={`w-full text-left font-comic text-sm transition-all py-2 px-3 rounded-lg border-2 ${
                    activeTocItem === "faq-section"
                      ? "bg-comic-yellow text-comic-black border-comic-black shadow-comic"
                      : "text-comic-black hover:bg-comic-yellow/20 border-transparent"
                  }`}
                >
                  Frequently Asked Questions
                </button>
              )}
            </nav>
          </div>
        </aside>
      </div>
    </>
  );
}

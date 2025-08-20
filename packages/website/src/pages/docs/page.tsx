import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
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
  FaUsers,
} from "react-icons/fa";

import {
  CliCommandsDocs,
  DocsNavigation,
  FAQDocs,
  GettingStartedProfessional,
  GuidesIndexDocs,
} from "@/components/docs";
import {
  AddCommandDocs,
  InitCommandDocs,
  ListCommandDocs,
  StatusCommandDocs,
  DeployCommandDocs,
  GenerateCommandDocs,
  TurboCommandDocs,
  TelemetryCommandDocs,
} from "@/components/docs/commands";
import { ContributingDocs, DeveloperHomeDocs } from "@/components/docs/developers";
import { FEATURES } from "@/config/constants";
import { DocsPageSEO } from "@/features/common";

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
      ...(FEATURES.SHOW_ADD_COMMAND_DOCS ? [{ id: "add", title: "add" }] : []),
      { id: "status", title: "status" },
      { id: "deploy", title: "deploy" },
      { id: "generate", title: "generate" },
      { id: "turbo", title: "turbo" },
      { id: "telemetry", title: "telemetry" },
      ...(FEATURES.SHOW_LIST_COMMAND_DOCS ? [{ id: "list", title: "list" }] : []),
    ],
  },
  {
    id: "developers",
    title: "Developers",
    icon: FaUsers,
    subsections: [{ id: "contributing", title: "Contributing" }],
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

  // Build a flat list of all navigable sections
  const allSections = docSections.reduce<{ id: string; title: string }[]>((acc, section) => {
    if (section.subsections) {
      section.subsections.forEach((sub) => {
        if (!(sub.id === "add" && !FEATURES.SHOW_ADD_COMMAND_DOCS)) {
          acc.push({ id: `${section.id}-${sub.id}`, title: sub.title });
        }
      });
    } else {
      acc.push({ id: section.id, title: section.title });
    }
    return acc;
  }, []);

  const currentIndex = allSections.findIndex((s) => s.id === activeSection);
  const prevPage = currentIndex > 0 ? allSections[currentIndex - 1] : undefined;
  const nextPage =
    currentIndex < allSections.length - 1 ? allSections[currentIndex + 1] : undefined;

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) =>
      prev.includes(sectionId) ? prev.filter((id) => id !== sectionId) : [...prev, sectionId]
    );
  };

  // Close mobile nav when clicking outside or on escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsMobileNavOpen(false);
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  // Auto-close mobile nav when selecting an item
  const handleSectionClick = (sectionId: string) => {
    setActiveSection(sectionId);
    // Auto-close on mobile
    if (window.innerWidth < 1280) {
      setIsMobileNavOpen(false);
    }
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

      {/* Mobile Navigation Button */}
      <div className="xl:hidden fixed top-24 left-4 z-50">
        <button
          onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
          className="px-3 py-2 rounded-lg border-3 font-comic flex items-center gap-2 transition-all"
          style={{
            backgroundColor: isMobileNavOpen ? "var(--comic-red)" : "var(--comic-yellow)",
            borderColor: "var(--comic-black)",
            color: isMobileNavOpen ? "var(--comic-white)" : "var(--comic-black)",
            boxShadow: "3px 3px 0 var(--comic-black)",
          }}
        >
          <FaBars size={16} />
          <span className="text-sm font-bold">DOCS</span>
        </button>
      </div>

      {/* Mobile Bottom Sheet Overlay */}
      <AnimatePresence>
        {isMobileNavOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="xl:hidden fixed inset-0 bg-black/50"
              style={{ zIndex: 40 }}
              onClick={() => setIsMobileNavOpen(false)}
            />

            {/* Mobile Bottom Sheet Navigation */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="xl:hidden fixed bottom-0 left-0 right-0 bg-comic-white border-t-4 border-comic-black max-h-[70vh] overflow-hidden"
              style={{ zIndex: 50 }}
            >
              <div className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="font-comic text-2xl text-comic-purple">DOCUMENTATION</h2>
                  <button
                    onClick={() => setIsMobileNavOpen(false)}
                    className="p-2 rounded-lg border-2 border-comic-black bg-comic-red text-comic-white"
                  >
                    <FaTimes size={20} />
                  </button>
                </div>
                <nav className="space-y-2 overflow-y-auto max-h-[50vh]">
                  {docSections.map((section) => (
                    <div key={section.id}>
                      <button
                        onClick={() => {
                          if (section.subsections) {
                            // For sections with subsections, just toggle expansion
                            setActiveSection(section.id);
                            toggleSection(section.id);
                            // Don't close the mobile nav when expanding/collapsing
                          } else {
                            // For sections without subsections, navigate and close
                            handleSectionClick(section.id);
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
                              onClick={() => handleSectionClick(`${section.id}-${sub.id}`)}
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
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="flex min-h-[calc(100vh-8rem)]">
        {/* Desktop Sidebar */}
        <aside className="hidden xl:block w-80 sticky top-32 h-[calc(100vh-8rem)] p-4 flex-shrink-0">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 h-full overflow-y-auto">
            <h2
              className="text-2xl font-semibold text-gray-900 mb-6"
              style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
            >
              Documentation
            </h2>
            <nav className="space-y-1">
              {docSections.map((section) => (
                <div key={section.id}>
                  <button
                    onClick={() => {
                      setActiveSection(section.id);
                      if (section.subsections) {
                        toggleSection(section.id);
                      }
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-all ${
                      activeSection === section.id
                        ? "bg-blue-50 text-blue-700 font-semibold border-l-4 border-blue-600 pl-2"
                        : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <section.icon
                        className={`text-base ${activeSection === section.id ? "text-blue-600" : "text-gray-500"}`}
                      />
                      <span>{section.title}</span>
                    </div>
                    {section.subsections &&
                      (expandedSections.includes(section.id) ? (
                        <FaChevronDown className="text-xs text-gray-400" />
                      ) : (
                        <FaChevronRight className="text-xs text-gray-400" />
                      ))}
                  </button>
                  {section.subsections && expandedSections.includes(section.id) && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="ml-9 mt-1 space-y-0.5"
                    >
                      {section.subsections.map((sub) => (
                        <button
                          key={sub.id}
                          onClick={() => setActiveSection(`${section.id}-${sub.id}`)}
                          className={`w-full text-left px-3 py-2 rounded-md text-sm transition-all ${
                            activeSection === `${section.id}-${sub.id}`
                              ? "bg-gray-100 text-gray-900 font-medium"
                              : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
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

        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto px-4 py-6 max-w-5xl">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-8">
                <h1
                  className="text-4xl font-bold text-gray-900 mb-2"
                  style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
                >
                  {activeSection.startsWith("cli-commands-")
                    ? "CLI Commands"
                    : currentSection?.title || "Documentation"}
                </h1>
                <div className="h-1 w-20 bg-blue-600 rounded"></div>
              </div>

              <div className="space-y-8">
                {activeSection === "getting-started" && <GettingStartedProfessional />}
                {activeSection === "cli-commands" && (
                  <CliCommandsDocs
                    onNavigateToCommand={(command) => setActiveSection(`cli-commands-${command}`)}
                  />
                )}
                {activeSection === "cli-commands-init" && <InitCommandDocs />}
                {FEATURES.SHOW_ADD_COMMAND_DOCS && activeSection === "cli-commands-add" && (
                  <AddCommandDocs />
                )}
                {activeSection === "cli-commands-status" && <StatusCommandDocs />}
                {activeSection === "cli-commands-deploy" && <DeployCommandDocs />}
                {activeSection === "cli-commands-generate" && <GenerateCommandDocs />}
                {activeSection === "cli-commands-turbo" && <TurboCommandDocs />}
                {activeSection === "cli-commands-telemetry" && <TelemetryCommandDocs />}
                {activeSection === "cli-commands-list" && <ListCommandDocs />}
                {activeSection === "developers" && <DeveloperHomeDocs />}
                {activeSection === "developers-contributing" && <ContributingDocs />}
                {activeSection === "guides" && <GuidesIndexDocs />}
                {activeSection === "faq" && <FAQDocs />}
              </div>

              {/* Navigation buttons */}
              <DocsNavigation
                prevPage={
                  prevPage
                    ? {
                        title: prevPage.title,
                        onClick: () => {
                          setActiveSection(prevPage.id);
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        },
                      }
                    : undefined
                }
                nextPage={
                  nextPage
                    ? {
                        title: nextPage.title,
                        onClick: () => {
                          setActiveSection(nextPage.id);
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        },
                      }
                    : undefined
                }
              />
            </motion.div>
          </div>
        </main>

        {/* Desktop TOC - Hidden on mobile */}
        <aside className="hidden xl:block w-80 sticky top-32 h-[calc(100vh-8rem)] p-4 flex-shrink-0">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 h-full">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
              <FaHashtag className="text-gray-400" />
              On this page
            </h3>
            <nav className="space-y-2">
              {activeSection === "getting-started" && (
                <>
                  <button
                    onClick={() => scrollToSection("installation")}
                    className={`w-full text-left text-sm transition-all py-2 px-3 rounded-md ${
                      activeTocItem === "installation"
                        ? "bg-blue-50 text-blue-700 font-medium border-l-2 border-blue-600 pl-2"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50 border-l-2 border-transparent"
                    }`}
                  >
                    Installation
                  </button>
                  <button
                    onClick={() => scrollToSection("project-setup")}
                    className={`w-full text-left text-sm transition-all py-2 px-3 rounded-md ${
                      activeTocItem === "project-setup"
                        ? "bg-blue-50 text-blue-700 font-medium border-l-2 border-blue-600 pl-2"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50 border-l-2 border-transparent"
                    }`}
                  >
                    Project Setup
                  </button>
                  <button
                    onClick={() => scrollToSection("next-steps")}
                    className={`w-full text-left text-sm transition-all py-2 px-3 rounded-md ${
                      activeTocItem === "next-steps"
                        ? "bg-blue-50 text-blue-700 font-medium border-l-2 border-blue-600 pl-2"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50 border-l-2 border-transparent"
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
                    className={`w-full text-left text-sm transition-all py-2 px-3 rounded-md ${
                      activeTocItem === "commands"
                        ? "bg-blue-50 text-blue-700 font-medium border-l-2 border-blue-600 pl-2"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50 border-l-2 border-transparent"
                    }`}
                  >
                    CLI Commands
                  </button>
                  <button
                    onClick={() => scrollToSection("examples")}
                    className={`w-full text-left text-sm transition-all py-2 px-3 rounded-md ${
                      activeTocItem === "examples"
                        ? "bg-blue-50 text-blue-700 font-medium border-l-2 border-blue-600 pl-2"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50 border-l-2 border-transparent"
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
                    className={`w-full text-left text-sm transition-all py-2 px-3 rounded-md ${
                      activeTocItem === "init-overview"
                        ? "bg-blue-50 text-blue-700 font-medium border-l-2 border-blue-600 pl-2"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50 border-l-2 border-transparent"
                    }`}
                  >
                    Overview
                  </button>
                  <button
                    onClick={() => scrollToSection("init-options")}
                    className={`w-full text-left text-sm transition-all py-2 px-3 rounded-md ${
                      activeTocItem === "init-options"
                        ? "bg-blue-50 text-blue-700 font-medium border-l-2 border-blue-600 pl-2"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50 border-l-2 border-transparent"
                    }`}
                  >
                    Options
                  </button>
                  <button
                    onClick={() => scrollToSection("init-examples")}
                    className={`w-full text-left text-sm transition-all py-2 px-3 rounded-md ${
                      activeTocItem === "init-examples"
                        ? "bg-blue-50 text-blue-700 font-medium border-l-2 border-blue-600 pl-2"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50 border-l-2 border-transparent"
                    }`}
                  >
                    Examples
                  </button>
                </>
              )}
              {FEATURES.SHOW_ADD_COMMAND_DOCS && activeSection === "cli-commands-add" && (
                <>
                  <button
                    onClick={() => scrollToSection("add-overview")}
                    className={`w-full text-left text-sm transition-all py-2 px-3 rounded-md ${
                      activeTocItem === "add-overview"
                        ? "bg-blue-50 text-blue-700 font-medium border-l-2 border-blue-600 pl-2"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50 border-l-2 border-transparent"
                    }`}
                  >
                    Overview
                  </button>
                  <button
                    onClick={() => scrollToSection("add-resources")}
                    className={`w-full text-left text-sm transition-all py-2 px-3 rounded-md ${
                      activeTocItem === "add-resources"
                        ? "bg-blue-50 text-blue-700 font-medium border-l-2 border-blue-600 pl-2"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50 border-l-2 border-transparent"
                    }`}
                  >
                    Available Resources
                  </button>
                  <button
                    onClick={() => scrollToSection("add-options")}
                    className={`w-full text-left text-sm transition-all py-2 px-3 rounded-md ${
                      activeTocItem === "add-options"
                        ? "bg-blue-50 text-blue-700 font-medium border-l-2 border-blue-600 pl-2"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50 border-l-2 border-transparent"
                    }`}
                  >
                    Options
                  </button>
                  <button
                    onClick={() => scrollToSection("add-examples")}
                    className={`w-full text-left text-sm transition-all py-2 px-3 rounded-md ${
                      activeTocItem === "add-examples"
                        ? "bg-blue-50 text-blue-700 font-medium border-l-2 border-blue-600 pl-2"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50 border-l-2 border-transparent"
                    }`}
                  >
                    Examples
                  </button>
                </>
              )}
              {activeSection === "cli-commands-status" && (
                <>
                  <button
                    onClick={() => scrollToSection("status-info")}
                    className={`w-full text-left text-sm transition-all py-2 px-3 rounded-md ${
                      activeTocItem === "status-info"
                        ? "bg-blue-50 text-blue-700 font-medium border-l-2 border-blue-600 pl-2"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50 border-l-2 border-transparent"
                    }`}
                  >
                    Information Displayed
                  </button>
                  <button
                    onClick={() => scrollToSection("status-options")}
                    className={`w-full text-left text-sm transition-all py-2 px-3 rounded-md ${
                      activeTocItem === "status-options"
                        ? "bg-blue-50 text-blue-700 font-medium border-l-2 border-blue-600 pl-2"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50 border-l-2 border-transparent"
                    }`}
                  >
                    Command Options
                  </button>
                  <button
                    onClick={() => scrollToSection("status-examples")}
                    className={`w-full text-left text-sm transition-all py-2 px-3 rounded-md ${
                      activeTocItem === "status-examples"
                        ? "bg-blue-50 text-blue-700 font-medium border-l-2 border-blue-600 pl-2"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50 border-l-2 border-transparent"
                    }`}
                  >
                    Examples
                  </button>
                </>
              )}
              {activeSection === "cli-commands-deploy" && (
                <>
                  <button
                    onClick={() => scrollToSection("deploy-features")}
                    className={`w-full text-left text-sm transition-all py-2 px-3 rounded-md ${
                      activeTocItem === "deploy-features"
                        ? "bg-blue-50 text-blue-700 font-medium border-l-2 border-blue-600 pl-2"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50 border-l-2 border-transparent"
                    }`}
                  >
                    Key Features
                  </button>
                  <button
                    onClick={() => scrollToSection("deploy-options")}
                    className={`w-full text-left text-sm transition-all py-2 px-3 rounded-md ${
                      activeTocItem === "deploy-options"
                        ? "bg-blue-50 text-blue-700 font-medium border-l-2 border-blue-600 pl-2"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50 border-l-2 border-transparent"
                    }`}
                  >
                    Command Options
                  </button>
                  <button
                    onClick={() => scrollToSection("deploy-examples")}
                    className={`w-full text-left text-sm transition-all py-2 px-3 rounded-md ${
                      activeTocItem === "deploy-examples"
                        ? "bg-blue-50 text-blue-700 font-medium border-l-2 border-blue-600 pl-2"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50 border-l-2 border-transparent"
                    }`}
                  >
                    Usage Examples
                  </button>
                  <button
                    onClick={() => scrollToSection("deploy-services")}
                    className={`w-full text-left text-sm transition-all py-2 px-3 rounded-md ${
                      activeTocItem === "deploy-services"
                        ? "bg-blue-50 text-blue-700 font-medium border-l-2 border-blue-600 pl-2"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50 border-l-2 border-transparent"
                    }`}
                  >
                    Available Services
                  </button>
                </>
              )}
              {activeSection === "cli-commands-generate" && (
                <>
                  <button
                    onClick={() => scrollToSection("generate-features")}
                    className={`w-full text-left text-sm transition-all py-2 px-3 rounded-md ${
                      activeTocItem === "generate-features"
                        ? "bg-blue-50 text-blue-700 font-medium border-l-2 border-blue-600 pl-2"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50 border-l-2 border-transparent"
                    }`}
                  >
                    Supported ORMs
                  </button>
                  <button
                    onClick={() => scrollToSection("generate-options")}
                    className={`w-full text-left text-sm transition-all py-2 px-3 rounded-md ${
                      activeTocItem === "generate-options"
                        ? "bg-blue-50 text-blue-700 font-medium border-l-2 border-blue-600 pl-2"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50 border-l-2 border-transparent"
                    }`}
                  >
                    Command Options
                  </button>
                  <button
                    onClick={() => scrollToSection("generate-workflow")}
                    className={`w-full text-left text-sm transition-all py-2 px-3 rounded-md ${
                      activeTocItem === "generate-workflow"
                        ? "bg-blue-50 text-blue-700 font-medium border-l-2 border-blue-600 pl-2"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50 border-l-2 border-transparent"
                    }`}
                  >
                    Typical Workflow
                  </button>
                  <button
                    onClick={() => scrollToSection("generate-examples")}
                    className={`w-full text-left text-sm transition-all py-2 px-3 rounded-md ${
                      activeTocItem === "generate-examples"
                        ? "bg-blue-50 text-blue-700 font-medium border-l-2 border-blue-600 pl-2"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50 border-l-2 border-transparent"
                    }`}
                  >
                    Examples
                  </button>
                </>
              )}
              {activeSection === "cli-commands-turbo" && (
                <>
                  <button
                    onClick={() => scrollToSection("turbo-subcommands")}
                    className={`w-full text-left text-sm transition-all py-2 px-3 rounded-md ${
                      activeTocItem === "turbo-subcommands"
                        ? "bg-blue-50 text-blue-700 font-medium border-l-2 border-blue-600 pl-2"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50 border-l-2 border-transparent"
                    }`}
                  >
                    Subcommands
                  </button>
                  <button
                    onClick={() => scrollToSection("turbo-build-options")}
                    className={`w-full text-left text-sm transition-all py-2 px-3 rounded-md ${
                      activeTocItem === "turbo-build-options"
                        ? "bg-blue-50 text-blue-700 font-medium border-l-2 border-blue-600 pl-2"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50 border-l-2 border-transparent"
                    }`}
                  >
                    Build Options
                  </button>
                  <button
                    onClick={() => scrollToSection("turbo-features")}
                    className={`w-full text-left text-sm transition-all py-2 px-3 rounded-md ${
                      activeTocItem === "turbo-features"
                        ? "bg-blue-50 text-blue-700 font-medium border-l-2 border-blue-600 pl-2"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50 border-l-2 border-transparent"
                    }`}
                  >
                    TUI Features
                  </button>
                  <button
                    onClick={() => scrollToSection("turbo-examples")}
                    className={`w-full text-left text-sm transition-all py-2 px-3 rounded-md ${
                      activeTocItem === "turbo-examples"
                        ? "bg-blue-50 text-blue-700 font-medium border-l-2 border-blue-600 pl-2"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50 border-l-2 border-transparent"
                    }`}
                  >
                    Usage Examples
                  </button>
                  <button
                    onClick={() => scrollToSection("turbo-workflow")}
                    className={`w-full text-left text-sm transition-all py-2 px-3 rounded-md ${
                      activeTocItem === "turbo-workflow"
                        ? "bg-blue-50 text-blue-700 font-medium border-l-2 border-blue-600 pl-2"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50 border-l-2 border-transparent"
                    }`}
                  >
                    Monorepo Workflow
                  </button>
                </>
              )}
              {activeSection === "cli-commands-telemetry" && (
                <>
                  <button
                    onClick={() => scrollToSection("telemetry-actions")}
                    className={`w-full text-left text-sm transition-all py-2 px-3 rounded-md ${
                      activeTocItem === "telemetry-actions"
                        ? "bg-blue-50 text-blue-700 font-medium border-l-2 border-blue-600 pl-2"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50 border-l-2 border-transparent"
                    }`}
                  >
                    Available Actions
                  </button>
                  <button
                    onClick={() => scrollToSection("telemetry-data")}
                    className={`w-full text-left text-sm transition-all py-2 px-3 rounded-md ${
                      activeTocItem === "telemetry-data"
                        ? "bg-blue-50 text-blue-700 font-medium border-l-2 border-blue-600 pl-2"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50 border-l-2 border-transparent"
                    }`}
                  >
                    What We Collect
                  </button>
                  <button
                    onClick={() => scrollToSection("telemetry-privacy")}
                    className={`w-full text-left text-sm transition-all py-2 px-3 rounded-md ${
                      activeTocItem === "telemetry-privacy"
                        ? "bg-blue-50 text-blue-700 font-medium border-l-2 border-blue-600 pl-2"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50 border-l-2 border-transparent"
                    }`}
                  >
                    Privacy First
                  </button>
                  <button
                    onClick={() => scrollToSection("telemetry-env")}
                    className={`w-full text-left text-sm transition-all py-2 px-3 rounded-md ${
                      activeTocItem === "telemetry-env"
                        ? "bg-blue-50 text-blue-700 font-medium border-l-2 border-blue-600 pl-2"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50 border-l-2 border-transparent"
                    }`}
                  >
                    Environment Variables
                  </button>
                  <button
                    onClick={() => scrollToSection("telemetry-examples")}
                    className={`w-full text-left text-sm transition-all py-2 px-3 rounded-md ${
                      activeTocItem === "telemetry-examples"
                        ? "bg-blue-50 text-blue-700 font-medium border-l-2 border-blue-600 pl-2"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50 border-l-2 border-transparent"
                    }`}
                  >
                    Examples
                  </button>
                </>
              )}
              {activeSection === "cli-commands-list" && (
                <>
                  <button
                    onClick={() => scrollToSection("list-overview")}
                    className={`w-full text-left text-sm transition-all py-2 px-3 rounded-md ${
                      activeTocItem === "list-overview"
                        ? "bg-blue-50 text-blue-700 font-medium border-l-2 border-blue-600 pl-2"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50 border-l-2 border-transparent"
                    }`}
                  >
                    Overview
                  </button>
                  <button
                    onClick={() => scrollToSection("list-future")}
                    className={`w-full text-left text-sm transition-all py-2 px-3 rounded-md ${
                      activeTocItem === "list-future"
                        ? "bg-blue-50 text-blue-700 font-medium border-l-2 border-blue-600 pl-2"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50 border-l-2 border-transparent"
                    }`}
                  >
                    Future Functionality
                  </button>
                </>
              )}
              {activeSection === "developers-contributing" && (
                <>
                  <button
                    onClick={() => scrollToSection("contribute-types")}
                    className={`w-full text-left text-sm transition-all py-2 px-3 rounded-md ${
                      activeTocItem === "contribute-types"
                        ? "bg-blue-50 text-blue-700 font-medium border-l-2 border-blue-600 pl-2"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50 border-l-2 border-transparent"
                    }`}
                  >
                    Ways to Contribute
                  </button>
                  <button
                    onClick={() => scrollToSection("contribute-setup")}
                    className={`w-full text-left text-sm transition-all py-2 px-3 rounded-md ${
                      activeTocItem === "contribute-setup"
                        ? "bg-blue-50 text-blue-700 font-medium border-l-2 border-blue-600 pl-2"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50 border-l-2 border-transparent"
                    }`}
                  >
                    Getting Started
                  </button>
                  <button
                    onClick={() => scrollToSection("contribute-workflow")}
                    className={`w-full text-left text-sm transition-all py-2 px-3 rounded-md ${
                      activeTocItem === "contribute-workflow"
                        ? "bg-blue-50 text-blue-700 font-medium border-l-2 border-blue-600 pl-2"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50 border-l-2 border-transparent"
                    }`}
                  >
                    Development Workflow
                  </button>
                  <button
                    onClick={() => scrollToSection("contribute-standards")}
                    className={`w-full text-left text-sm transition-all py-2 px-3 rounded-md ${
                      activeTocItem === "contribute-standards"
                        ? "bg-blue-50 text-blue-700 font-medium border-l-2 border-blue-600 pl-2"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50 border-l-2 border-transparent"
                    }`}
                  >
                    Code Standards
                  </button>
                  <button
                    onClick={() => scrollToSection("contribute-commit")}
                    className={`w-full text-left text-sm transition-all py-2 px-3 rounded-md ${
                      activeTocItem === "contribute-commit"
                        ? "bg-blue-50 text-blue-700 font-medium border-l-2 border-blue-600 pl-2"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50 border-l-2 border-transparent"
                    }`}
                  >
                    Commit Convention
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

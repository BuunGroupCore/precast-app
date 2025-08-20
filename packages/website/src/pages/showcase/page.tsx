import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import {
  FaGithub,
  FaStar,
  FaEye,
  FaCode,
  FaRocket,
  FaBolt,
  FaUsers,
  FaSearch,
  FaChevronLeft,
  FaChevronRight,
  FaPlus,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

interface GitHubLabel {
  name: string;
}

interface GitHubUser {
  login: string;
}

interface GitHubIssue {
  number: number;
  title: string;
  body: string;
  user: GitHubUser;
  created_at: string;
  labels: GitHubLabel[];
}

interface ShowcaseProject {
  id: number;
  title: string;
  description: string;
  demoUrl?: string;
  repoUrl?: string;
  techStack: string[];
  author: string;
  createdAt: string;
  labels: string[];
}

/**
 * Community showcase page displaying user-submitted projects built with the stack builder.
 * Fetches projects from GitHub issues and provides search and pagination functionality.
 */
export function ShowcasePage() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<ShowcaseProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const projectsPerPage = 6;

  useEffect(() => {
    fetchShowcaseProjects();
  }, []);

  const fetchShowcaseProjects = async () => {
    try {
      const response = await fetch(
        "https://api.github.com/repos/BuunGroupCore/precast-app/issues?labels=showcase&state=open",
        {
          headers: {
            Accept: "application/vnd.github.v3+json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch showcase projects");
      }

      const issues = await response.json();

      const parsedProjects: ShowcaseProject[] = issues.map((issue: GitHubIssue) => {
        const body = issue.body || "";

        const demoMatch = body.match(/(?:\*\*Demo URL:\*\*|Demo URL:)\s*(https?:\/\/[^\s\n]+)/i);
        const repoMatch = body.match(
          /(?:\*\*Repository:\*\*|Repository:)\s*(https?:\/\/[^\s\n]+)/i
        );
        const techMatch = body.match(/(?:\*\*Tech Stack:\*\*|Tech Stack:)\s*(.+)/i);

        let description = "";
        const descMatch = body.match(/(?:\*\*Description:\*\*|Description:)\s*(.+)/i);
        if (descMatch) {
          description = descMatch[1].trim();
        } else {
          const lines = body
            .split("\n")
            .filter(
              (line) =>
                line.trim() &&
                !line.startsWith("#") &&
                !line.startsWith("**Project Name:**") &&
                !line.includes("Project Name:")
            );
          description = lines[0] || issue.title;
        }

        const project = {
          id: issue.number,
          title: issue.title.replace(/^\[Showcase\]\s*/i, ""),
          description: description.trim(),
          demoUrl: demoMatch ? demoMatch[1].trim() : undefined,
          repoUrl: repoMatch ? repoMatch[1].trim() : undefined,
          techStack: techMatch
            ? techMatch[1]
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean)
            : [],
          author: issue.user.login,
          createdAt: issue.created_at,
          labels: issue.labels.map((label: GitHubLabel) => label.name),
        };

        return project;
      });

      setProjects(parsedProjects);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredProjects = projects.filter(
    (project) =>
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredProjects.length / projectsPerPage);
  const startIndex = (currentPage - 1) * projectsPerPage;
  const paginatedProjects = filteredProjects.slice(startIndex, startIndex + projectsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Remove the loading state here since we're using the global loading system
  // The global loading indicator will handle the loading state

  return (
    <div className="min-h-screen pt-32 pb-20">
      {/* Page Header - Outside the main container like other pages */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="action-text text-5xl md:text-7xl text-comic-purple mb-6">HALL OF HEROES</h1>

        {/* Comic Speech Bubble */}
        <div className="relative max-w-3xl mx-auto mb-8 px-4">
          <div
            className="speech-bubble bg-comic-yellow border-4 border-comic-black p-6 rounded-3xl relative"
            style={{
              backgroundColor: "var(--comic-yellow)",
              borderColor: "var(--comic-black)",
              boxShadow: "4px 4px 0 var(--comic-black)",
            }}
          >
            <p className="font-comic text-lg md:text-xl text-comic-black">
              <FaUsers className="inline text-comic-red mr-2" />
              Behold the <strong>LEGENDARY PROJECTS</strong> created by developers using Precast!
              These heroes have assembled their ultimate tech stacks and built amazing things.
            </p>

            {/* Fixed Speech bubble tail - positioned outside */}
            <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2">
              <div
                className="w-0 h-0 border-l-[20px] border-r-[20px] border-t-[20px] border-l-transparent border-r-transparent"
                style={{
                  borderTopColor: "var(--comic-black)",
                }}
              />
              <div
                className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[16px] border-r-[16px] border-t-[16px] border-l-transparent border-r-transparent"
                style={{
                  borderTopColor: "var(--comic-yellow)",
                }}
              />
            </div>
          </div>
        </div>

        {/* Comic Separator */}
        <div className="mb-12 max-w-7xl mx-auto px-4">
          <div className="relative">
            <div className="h-2 bg-comic-black rounded-full"></div>
            <div className="absolute left-1/2 transform -translate-x-1/2 -top-4">
              <div className="action-text text-2xl text-comic-purple bg-comic-black px-4 py-1 rounded-full border-4 border-comic-purple">
                ASSEMBLE!
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Comic Book Page Container */}
      <div className="max-w-7xl mx-auto px-4">
        {/* Comic Book Page Background */}
        <div
          className="relative bg-comic-white border-8 border-comic-black rounded-3xl p-8 shadow-2xl"
          style={{
            backgroundColor: "var(--comic-white)",
            borderColor: "var(--comic-black)",
            boxShadow: "8px 8px 0 var(--comic-black), 16px 16px 0 rgba(0, 0, 0, 0.3)",
            background: `
              var(--comic-white) 
              radial-gradient(circle at 20px 20px, transparent 2px, rgba(0,0,0,0.05) 2px, rgba(0,0,0,0.05) 4px, transparent 4px),
              linear-gradient(0deg, transparent 24px, rgba(0,0,0,0.05) 25px, rgba(0,0,0,0.05) 26px, transparent 27px, transparent 74px, rgba(0,0,0,0.05) 75px, rgba(0,0,0,0.05) 76px, transparent 77px),
              linear-gradient(90deg, transparent 24px, rgba(0,0,0,0.05) 25px, rgba(0,0,0,0.05) 26px, transparent 27px, transparent 74px, rgba(0,0,0,0.05) 75px, rgba(0,0,0,0.05) 76px, transparent 77px)
            `,
            backgroundSize: "50px 50px, 100px 100px, 100px 100px",
          }}
        >
          {/* Submit Hero Project Button */}
          <div className="text-center mb-8">
            <motion.button
              onClick={() => navigate("/submit-project")}
              whileHover={{ scale: 1.05, rotate: 1 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-3 px-6 py-3 rounded-full border-4 border-comic-black font-comic font-bold text-lg transition-all"
              style={{
                backgroundColor: "var(--comic-red)",
                borderColor: "var(--comic-black)",
                color: "var(--comic-white)",
                boxShadow: "4px 4px 0 var(--comic-black)",
              }}
            >
              <FaPlus />
              SUBMIT YOUR HERO PROJECT
            </motion.button>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <div
                className="relative border-4 border-comic-black rounded-2xl p-1"
                style={{
                  backgroundColor: "var(--comic-white)",
                  borderColor: "var(--comic-black)",
                  boxShadow: "4px 4px 0 var(--comic-black)",
                }}
              >
                <div className="flex items-center">
                  <div className="pl-4 pr-2">
                    <FaSearch className="text-comic-black text-xl" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search heroes by name, author, or description..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1 p-3 bg-transparent font-comic text-lg text-comic-black placeholder-comic-black/60 outline-none"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm("")}
                      className="pr-4 pl-2 text-comic-black hover:text-comic-red transition-colors"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>
              {/* Search Results Count */}
              {searchTerm && (
                <div className="text-center mt-2">
                  <span className="font-comic text-sm text-comic-black/70">
                    Found {filteredProjects.length} hero{filteredProjects.length !== 1 ? "s" : ""}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Error State */}
          {error && (
            <div className="comic-panel p-6 bg-comic-red text-comic-white mb-8 max-w-2xl mx-auto">
              <p className="font-comic">
                <strong>Oops!</strong> Couldn&apos;t fetch live projects from GitHub. Showing some
                example projects instead. {error}
              </p>
            </div>
          )}

          {/* Comic Book Page Separator */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex-grow h-1 bg-comic-black opacity-20"></div>
            <div className="px-6">
              <FaBolt className="text-3xl text-comic-red" />
            </div>
            <div className="flex-grow h-1 bg-comic-black opacity-20"></div>
          </div>

          {/* Empty State - No Projects */}
          {!loading && paginatedProjects.length === 0 && (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="comic-panel p-12 bg-comic-white max-w-2xl mx-auto"
              >
                <div className="mb-8">
                  <FaUsers className="text-6xl text-comic-gray mx-auto mb-4" />
                  <h3 className="action-text text-4xl text-comic-red mb-4">AWAITING FIRST HERO!</h3>
                </div>

                <div className="speech-bubble bg-comic-yellow max-w-xl mx-auto mb-8">
                  <p className="font-comic text-lg text-comic-black">
                    The Hall of Heroes is <strong>EMPTY</strong> and waiting for its first legendary
                    project! Be the pioneer who shows the world what&apos;s possible with Precast
                    CLI!
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <motion.button
                    onClick={() => navigate("/submit-project")}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn-comic bg-comic-red text-comic-white hover:bg-comic-darkRed px-6 py-3 text-lg"
                  >
                    <FaRocket className="inline mr-2" />
                    BE THE FIRST HERO!
                  </motion.button>

                  <motion.button
                    onClick={() => navigate("/builder")}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn-comic bg-comic-green text-comic-white hover:bg-comic-darkGreen px-6 py-3 text-lg"
                  >
                    BUILD YOUR PROJECT
                  </motion.button>
                </div>

                <p className="font-comic text-sm text-comic-gray mt-6 opacity-70">
                  Projects are fetched from GitHub issues with the &quot;showcase&quot; label
                </p>
              </motion.div>
            </div>
          )}

          {/* Projects Grid - Comic Book Panels */}
          {paginatedProjects.length > 0 && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 min-h-[600px]">
              {paginatedProjects.map((project, index) => {
                const handleProjectClick = () => {
                  if (project.demoUrl) {
                    window.open(project.demoUrl, "_blank", "noopener,noreferrer");
                  } else if (project.repoUrl) {
                    window.open(project.repoUrl, "_blank", "noopener,noreferrer");
                  }
                };

                return (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.05, rotate: index % 2 === 0 ? 2 : -2 }}
                    className="relative group cursor-pointer"
                    onClick={handleProjectClick}
                  >
                    {/* Comic Panel Container */}
                    <div
                      className="relative border-6 border-comic-black rounded-2xl p-6 bg-comic-white overflow-hidden transform transition-all duration-300"
                      style={{
                        backgroundColor: "var(--comic-white)",
                        borderColor: "var(--comic-black)",
                        boxShadow: "6px 6px 0 var(--comic-black), 12px 12px 0 rgba(0, 0, 0, 0.2)",
                        background: `
                        var(--comic-white)
                        repeating-linear-gradient(
                          90deg,
                          transparent,
                          transparent 24px,
                          rgba(0,0,0,0.03) 25px,
                          rgba(0,0,0,0.03) 26px
                        )
                      `,
                      }}
                    >
                      {/* Comic Panel Border Effect */}
                      <div className="absolute inset-2 border-2 border-comic-black rounded-xl opacity-20"></div>

                      {/* Project Icon */}
                      <div className="flex justify-center mb-4">
                        <div
                          className="w-16 h-16 rounded-full border-4 border-comic-black flex items-center justify-center"
                          style={{
                            backgroundColor: "var(--comic-yellow)",
                            borderColor: "var(--comic-black)",
                            boxShadow: "3px 3px 0 var(--comic-black)",
                          }}
                        >
                          <FaRocket className="text-2xl text-comic-black" />
                        </div>
                      </div>

                      {/* Project Title */}
                      <h3 className="font-display text-xl md:text-2xl text-comic-black text-center mb-3 group-hover:text-comic-red transition-colors">
                        {project.title}
                      </h3>

                      {/* Description */}
                      <p className="font-comic text-comic-black mb-4 text-center leading-relaxed text-sm">
                        {project.description}
                      </p>

                      {/* Comic Separator */}
                      <div className="flex items-center justify-center mb-4">
                        <div className="flex-grow h-0.5 bg-comic-black opacity-30"></div>
                        <FaStar className="mx-2 text-comic-red" />
                        <div className="flex-grow h-0.5 bg-comic-black opacity-30"></div>
                      </div>

                      {/* Tech Stack */}
                      <div className="mb-4">
                        <div className="flex flex-wrap gap-2 justify-center">
                          {project.techStack.slice(0, 3).map((tech) => (
                            <span
                              key={tech}
                              className="px-2 py-1 text-xs font-comic font-bold border-2 border-comic-black rounded"
                              style={{
                                backgroundColor: "var(--comic-yellow)",
                                borderColor: "var(--comic-black)",
                                color: "var(--comic-black)",
                              }}
                            >
                              {tech}
                            </span>
                          ))}
                          {project.techStack.length > 3 && (
                            <span className="px-2 py-1 text-xs font-comic text-comic-black/70">
                              +{project.techStack.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Author & Date */}
                      <div className="text-center mb-4">
                        <div className="flex items-center justify-center gap-2 text-xs text-comic-black/70">
                          <FaGithub />
                          <span className="font-comic">by {project.author}</span>
                        </div>
                        <div className="font-comic text-xs text-comic-black/60 mt-1">
                          {new Date(project.createdAt).toLocaleDateString()}
                        </div>
                      </div>

                      {/* Click Indicator */}
                      <div className="text-center">
                        <div
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border-3 border-comic-black font-comic font-bold text-sm group-hover:scale-110 transition-transform"
                          style={{
                            backgroundColor: project.demoUrl
                              ? "var(--comic-green)"
                              : "var(--comic-blue)",
                            borderColor: "var(--comic-black)",
                            color: "var(--comic-white)",
                            boxShadow: "2px 2px 0 var(--comic-black)",
                          }}
                        >
                          {project.demoUrl ? (
                            <>
                              <FaEye />
                              VISIT WEBSITE
                            </>
                          ) : (
                            <>
                              <FaCode />
                              VIEW CODE
                            </>
                          )}
                        </div>
                      </div>

                      {/* Background Pattern */}
                      <div className="absolute bottom-2 right-2 text-4xl opacity-5">
                        <FaStar />
                      </div>
                    </div>

                    {/* Action Text - Outside container */}
                    <div className="absolute -top-4 -right-4 z-30">
                      <div
                        className="action-text text-lg px-3 py-1 rounded-full border-3 border-comic-black transform rotate-12"
                        style={{
                          backgroundColor:
                            index % 4 === 0
                              ? "var(--comic-red)"
                              : index % 4 === 1
                                ? "var(--comic-blue)"
                                : index % 4 === 2
                                  ? "var(--comic-green)"
                                  : "var(--comic-purple)",
                          color: "var(--comic-white)",
                          borderColor: "var(--comic-black)",
                          boxShadow: "2px 2px 0 var(--comic-black)",
                        }}
                      >
                        {index % 4 === 0
                          ? "POW!"
                          : index % 4 === 1
                            ? "ZAP!"
                            : index % 4 === 2
                              ? "BAM!"
                              : "BOOM!"}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* Pagination Controls */}
          {filteredProjects.length > projectsPerPage && (
            <div className="flex justify-center items-center gap-4 mt-12">
              {/* Previous Button */}
              <motion.button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                whileHover={currentPage > 1 ? { scale: 1.05 } : {}}
                whileTap={currentPage > 1 ? { scale: 0.95 } : {}}
                className={`flex items-center gap-2 px-4 py-3 rounded-full border-4 border-comic-black font-comic font-bold transition-all ${
                  currentPage === 1 ? "opacity-50 cursor-not-allowed" : "hover:scale-105"
                }`}
                style={{
                  backgroundColor: currentPage === 1 ? "var(--comic-white)" : "var(--comic-blue)",
                  borderColor: "var(--comic-black)",
                  color: currentPage === 1 ? "var(--comic-black)" : "var(--comic-white)",
                  boxShadow: "3px 3px 0 var(--comic-black)",
                }}
              >
                <FaChevronLeft />
                PREV
              </motion.button>

              {/* Page Numbers */}
              <div className="flex items-center gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <motion.button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className={`w-12 h-12 rounded-full border-4 border-comic-black font-comic font-bold text-lg transition-all ${
                      currentPage === page ? "scale-110" : ""
                    }`}
                    style={{
                      backgroundColor:
                        currentPage === page ? "var(--comic-red)" : "var(--comic-white)",
                      borderColor: "var(--comic-black)",
                      color: currentPage === page ? "var(--comic-white)" : "var(--comic-black)",
                      boxShadow:
                        currentPage === page
                          ? "4px 4px 0 var(--comic-black)"
                          : "2px 2px 0 var(--comic-black)",
                    }}
                  >
                    {page}
                  </motion.button>
                ))}
              </div>

              {/* Next Button */}
              <motion.button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                whileHover={currentPage < totalPages ? { scale: 1.05 } : {}}
                whileTap={currentPage < totalPages ? { scale: 0.95 } : {}}
                className={`flex items-center gap-2 px-4 py-3 rounded-full border-4 border-comic-black font-comic font-bold transition-all ${
                  currentPage === totalPages ? "opacity-50 cursor-not-allowed" : "hover:scale-105"
                }`}
                style={{
                  backgroundColor:
                    currentPage === totalPages ? "var(--comic-white)" : "var(--comic-blue)",
                  borderColor: "var(--comic-black)",
                  color: currentPage === totalPages ? "var(--comic-black)" : "var(--comic-white)",
                  boxShadow: "3px 3px 0 var(--comic-black)",
                }}
              >
                NEXT
                <FaChevronRight />
              </motion.button>
            </div>
          )}

          {/* Empty State */}
          {filteredProjects.length === 0 && !loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              {/* Comic Separator */}
              <div className="flex items-center justify-center mb-8">
                <div className="flex-grow h-1 bg-comic-black opacity-20"></div>
                <div className="px-6">
                  <FaBolt className="text-3xl text-comic-red" />
                </div>
                <div className="flex-grow h-1 bg-comic-black opacity-20"></div>
              </div>

              {/* Empty State Hero Icon */}
              <div className="mb-6">
                <div
                  className="w-24 h-24 rounded-full border-6 border-comic-black flex items-center justify-center mx-auto"
                  style={{
                    backgroundColor: "var(--comic-red)",
                    borderColor: "var(--comic-black)",
                    boxShadow: "6px 6px 0 var(--comic-black)",
                  }}
                >
                  <FaRocket className="text-4xl text-comic-white" />
                </div>
              </div>

              <h3 className="font-display text-3xl text-comic-black mb-4">Be the First Hero!</h3>

              <p className="font-comic text-lg text-comic-black/70 mb-8 max-w-2xl mx-auto">
                The Hall of Heroes is waiting for its first legendary project! Have you built
                something amazing with Precast CLI?
              </p>

              <motion.button
                onClick={() => navigate("/submit-project")}
                whileHover={{ scale: 1.05, rotate: 2 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-3 text-xl px-8 py-4 rounded-full border-4 border-comic-black font-comic font-bold transition-all"
                style={{
                  backgroundColor: "var(--comic-red)",
                  borderColor: "var(--comic-black)",
                  color: "var(--comic-white)",
                  boxShadow: "4px 4px 0 var(--comic-black)",
                }}
              >
                <FaRocket />
                SUBMIT YOUR PROJECT
              </motion.button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

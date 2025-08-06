import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import {
  FaRocket,
  FaCode,
  FaCog,
  FaTerminal,
  FaGithub,
  FaBolt,
  FaReact,
  FaVuejs,
  FaAngular,
  FaNodeJs,
  FaDatabase,
  FaPalette,
  FaStar,
  FaCodeBranch,
  FaDownload,
  FaUsers,
} from "react-icons/fa";
import { HiSparkles } from "react-icons/hi";
import {
  SiNextdotjs,
  SiExpress,
  SiFastapi,
  SiPostgresql,
  SiMongodb,
  SiMysql,
  SiSupabase,
  SiTailwindcss,
  SiSass,
  SiNpm,
  SiYarn,
  SiBun,
} from "react-icons/si";
import { useNavigate } from "react-router-dom";

import { HomePageSEO } from "../components/SEO";

export function HomePage() {
  const navigate = useNavigate();
  const [selectedPackageManager, setSelectedPackageManager] = useState("npx");
  const [githubStats, setGithubStats] = useState({
    stars: 0,
    forks: 0,
    contributors: 0,
    openIssues: 0,
    loading: true,
  });

  const fetchGitHubStats = async () => {
    try {
      const [repoData, contributorsData] = await Promise.all([
        fetch("https://api.github.com/repos/BuunGroupCore/precast-app").then((res) => res.json()),
        fetch("https://api.github.com/repos/BuunGroupCore/precast-app/contributors").then((res) =>
          res.json()
        ),
      ]);

      setGithubStats({
        stars: repoData.stargazers_count || 0,
        forks: repoData.forks_count || 0,
        contributors: Array.isArray(contributorsData) ? contributorsData.length : 0,
        openIssues: repoData.open_issues_count || 0,
        loading: false,
      });
    } catch (error) {
      console.error("Error fetching GitHub stats:", error);
      setGithubStats((prev) => ({ ...prev, loading: false }));
    }
  };

  useEffect(() => {
    /** Initial fetch */
    fetchGitHubStats();

    /** Refresh every 30 seconds */
    const interval = setInterval(fetchGitHubStats, 30000);

    return () => clearInterval(interval);
  }, []);

  const packageManagers = [
    {
      id: "npx",
      name: "NPX",
      icon: SiNpm,
      command: "npx create-precast-app",
      color: "var(--comic-red)",
    },
    {
      id: "npm",
      name: "NPM",
      icon: SiNpm,
      command: "npm create precast-app",
      color: "var(--comic-red)",
    },
    {
      id: "yarn",
      name: "Yarn",
      icon: SiYarn,
      command: "yarn create precast-app",
      color: "var(--comic-blue)",
    },
    {
      id: "bun",
      name: "Bun",
      icon: SiBun,
      command: "bun create precast-app",
      color: "var(--comic-yellow)",
    },
  ];

  const features = [
    {
      icon: FaRocket,
      title: "INSTANT SETUP",
      description:
        "Skip hours of boilerplate configuration. Get from zero to production-ready in minutes.",
      color: "var(--comic-red)",
      effect: "POW!",
    },
    {
      icon: FaCog,
      title: "SMART CONFIG",
      description: "Pre-configured best practices, linting, testing, and build tools included.",
      color: "var(--comic-blue)",
      effect: "ZAP!",
    },
    {
      icon: FaCode,
      title: "TYPE SAFETY",
      description: "Full TypeScript setup with proper types and IDE intelligence out of the box.",
      color: "var(--comic-green)",
      effect: "BAM!",
    },
    {
      icon: HiSparkles,
      title: "MODERN STACK",
      description: "Latest versions of your favorite tools with optimized configurations.",
      color: "var(--comic-purple)",
      effect: "BOOM!",
    },
  ];

  return (
    <div className="overflow-hidden">
      <HomePageSEO />
      {/* Hero Section */}
      <section className="relative">
        <div className="relative max-w-7xl mx-auto px-4 py-10 sm:py-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            {/* Logo with Comic Effect */}
            <div className="relative inline-block mb-6 sm:mb-8">
              <img
                src="https://brutalist.precast.dev/logo.png"
                alt="Precast Logo"
                className="h-20 sm:h-32 mx-auto filter drop-shadow-lg"
                style={{
                  filter: "hue-rotate(340deg) saturate(2) brightness(1.2)",
                }}
              />
            </div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-6"
            >
              <span className="action-text text-5xl sm:text-7xl md:text-9xl text-comic-red">
                PRECAST
              </span>
              <br />
              <span className="font-display text-2xl sm:text-4xl md:text-5xl text-comic-black">
                The Superhero CLI Builder
              </span>
            </motion.h1>

            {/* Subtitle in Speech Bubble */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="inline-block mb-12"
            >
              <div className="speech-bubble max-w-2xl">
                <p className="font-comic text-lg sm:text-xl md:text-2xl">
                  Build TypeScript projects with <strong>SUPERHUMAN SPEED!</strong>
                  Choose your stack, configure your powers, and launch into action!
                </p>
              </div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-6 justify-center"
            >
              <motion.button
                onClick={() => navigate("/builder")}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-pow flex items-center gap-3"
              >
                <FaTerminal className="text-2xl" />
                <span>OPEN BUILDER</span>
              </motion.button>

              <motion.button
                onClick={() => navigate("/origin-story")}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-bam"
              >
                READ ORIGIN STORY
              </motion.button>
            </motion.div>

            {/* Quick Start Terminal with Package Manager Tabs */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="mt-16 max-w-4xl mx-auto"
            >
              {/* Package Manager Tabs */}
              <div className="flex justify-center mb-4">
                <div className="flex gap-2 p-2 bg-comic-white rounded-lg border-4 border-comic-black comic-shadow">
                  {packageManagers.map((pm) => (
                    <button
                      key={pm.id}
                      onClick={() => setSelectedPackageManager(pm.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-comic font-bold text-sm border-2 transition-all ${
                        selectedPackageManager === pm.id
                          ? "border-comic-black comic-shadow"
                          : "border-transparent hover:border-comic-black"
                      }`}
                      style={{
                        backgroundColor:
                          selectedPackageManager === pm.id ? pm.color : "transparent",
                        color:
                          selectedPackageManager === pm.id
                            ? "var(--comic-white)"
                            : "var(--comic-black)",
                      }}
                    >
                      <pm.icon className="text-lg" />
                      <span>{pm.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Terminal */}
              <div className="comic-panel p-6 bg-comic-black">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-comic-red border border-comic-black" />
                    <div className="w-3 h-3 rounded-full bg-comic-yellow border border-comic-black" />
                    <div className="w-3 h-3 rounded-full bg-comic-green border border-comic-black" />
                  </div>
                  <span className="font-display text-comic-green">QUICK START</span>
                </div>
                <div className="font-mono text-lg">
                  <span className="text-comic-yellow">$</span>{" "}
                  <span className="text-comic-green">
                    {packageManagers.find((pm) => pm.id === selectedPackageManager)?.command}
                  </span>{" "}
                  <span className="text-comic-blue">my-super-app</span>
                  <span className="animate-pulse text-comic-green ml-2">_</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 relative" style={{ backgroundColor: "var(--comic-yellow)" }}>
        <div className="relative max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="action-text text-5xl md:text-7xl text-comic-black mb-4">SUPER POWERS</h2>
            <p className="font-comic text-xl md:text-2xl text-comic-black">
              Every hero needs their special abilities!
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="relative"
              >
                <div
                  className="relative border-6 border-comic-black rounded-2xl p-6 text-center h-full"
                  style={{
                    backgroundColor: feature.color,
                    color: "var(--comic-white)",
                    boxShadow: "8px 8px 0 var(--comic-black)",
                  }}
                >
                  <div className="absolute -top-3 -right-3 action-text text-2xl text-comic-black bg-comic-yellow px-3 py-1 rounded-full border-3 border-comic-black">
                    {feature.effect}
                  </div>
                  <feature.icon className="text-6xl mx-auto mb-4" />
                  <h3 className="font-display text-2xl mb-2">{feature.title}</h3>
                  <p className="font-comic">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* GitHub Stats Section */}
      <section className="py-20 px-4 relative" style={{ backgroundColor: "var(--comic-purple)" }}>
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="action-text text-5xl md:text-7xl text-comic-yellow mb-4">
              COMMUNITY POWER
            </h2>
            <p className="font-comic text-xl md:text-2xl text-comic-white">
              Join our growing league of developers!
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="grid md:grid-cols-4 gap-8 mb-12"
          >
            {/* GitHub Stars */}
            <motion.div whileHover={{ scale: 1.05 }} className="relative">
              <div className="relative border-6 border-comic-black rounded-2xl p-6 text-center bg-comic-yellow h-full">
                <div className="absolute -top-3 -right-3 action-text text-sm bg-comic-red text-comic-white px-2 py-1 rounded-full border-2 border-comic-black">
                  HOT!
                </div>
                <FaStar className="text-5xl mx-auto mb-3 text-comic-black" />
                <div className="action-text text-4xl mb-2 text-comic-black">
                  {githubStats.loading ? "..." : githubStats.stars}
                </div>
                <div className="font-display text-xl text-comic-black">GITHUB STARS</div>
              </div>
            </motion.div>

            {/* NPM Downloads */}
            <motion.div whileHover={{ scale: 1.05 }} className="relative">
              <div className="relative border-6 border-comic-black rounded-2xl p-6 text-center bg-comic-red h-full">
                <div className="absolute -top-3 -left-3 action-text text-sm bg-comic-yellow text-comic-black px-2 py-1 rounded-full border-2 border-comic-black">
                  NEW!
                </div>
                <FaDownload className="text-5xl mx-auto mb-3 text-comic-white" />
                <div className="action-text text-4xl mb-2 text-comic-white">SOON</div>
                <div className="font-display text-xl text-comic-white">NPM DOWNLOADS</div>
              </div>
            </motion.div>

            {/* Contributors */}
            <motion.div whileHover={{ scale: 1.05 }} className="relative">
              <div className="relative border-6 border-comic-black rounded-2xl p-6 text-center bg-comic-blue h-full">
                <FaUsers className="text-5xl mx-auto mb-3 text-comic-white" />
                <div className="action-text text-4xl mb-2 text-comic-white">
                  {githubStats.loading ? "..." : githubStats.contributors}
                </div>
                <div className="font-display text-xl text-comic-white">CONTRIBUTORS</div>
              </div>
            </motion.div>

            {/* Forks */}
            <motion.div whileHover={{ scale: 1.05 }} className="relative">
              <div className="relative border-6 border-comic-black rounded-2xl p-6 text-center bg-comic-green h-full">
                <FaCodeBranch className="text-5xl mx-auto mb-3 text-comic-white" />
                <div className="action-text text-4xl mb-2 text-comic-white">
                  {githubStats.loading ? "..." : githubStats.forks}
                </div>
                <div className="font-display text-xl text-comic-white">FORKS</div>
              </div>
            </motion.div>
          </motion.div>

          <div className="text-center">
            <motion.a
              href="https://github.com/BuunGroupCore/precast-app"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-comic bg-comic-yellow text-comic-black hover:bg-comic-white inline-flex items-center gap-3"
            >
              <FaGithub className="text-2xl" />
              STAR US ON GITHUB
            </motion.a>
          </div>
        </div>
      </section>

      {/* Stack Preview */}
      <section className="py-20 px-4 relative">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="section-title">
              <span className="action-text text-5xl md:text-7xl text-comic-purple">
                CHOOSE YOUR ARSENAL
              </span>
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="comic-panel bg-comic-white p-8 md:p-12"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Frontend */}
              <div
                className="comic-panel p-6 text-center"
                style={{ backgroundColor: "var(--comic-red)", color: "var(--comic-white)" }}
              >
                <FaReact className="text-6xl mx-auto mb-4" />
                <div className="action-text text-2xl mb-4">FRONTEND</div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 font-comic font-bold">
                    <FaReact className="text-xl" />
                    <span>React</span>
                  </div>
                  <div className="flex items-center gap-2 font-comic font-bold">
                    <FaVuejs className="text-xl" />
                    <span>Vue</span>
                  </div>
                  <div className="flex items-center gap-2 font-comic font-bold">
                    <FaAngular className="text-xl" />
                    <span>Angular</span>
                  </div>
                  <div className="flex items-center gap-2 font-comic font-bold">
                    <SiNextdotjs className="text-xl" />
                    <span>Next.js</span>
                  </div>
                </div>
              </div>

              {/* Backend */}
              <div
                className="comic-panel p-6 text-center"
                style={{ backgroundColor: "var(--comic-blue)", color: "var(--comic-white)" }}
              >
                <FaNodeJs className="text-6xl mx-auto mb-4" />
                <div className="action-text text-2xl mb-4">BACKEND</div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 font-comic font-bold">
                    <FaNodeJs className="text-xl" />
                    <span>Node.js</span>
                  </div>
                  <div className="flex items-center gap-2 font-comic font-bold">
                    <SiExpress className="text-xl" />
                    <span>Express</span>
                  </div>
                  <div className="flex items-center gap-2 font-comic font-bold">
                    <SiFastapi className="text-xl" />
                    <span>FastAPI</span>
                  </div>
                  <div className="flex items-center gap-2 font-comic font-bold">
                    <FaCode className="text-xl" />
                    <span>Hono</span>
                  </div>
                </div>
              </div>

              {/* Database */}
              <div
                className="comic-panel p-6 text-center"
                style={{ backgroundColor: "var(--comic-green)", color: "var(--comic-white)" }}
              >
                <FaDatabase className="text-6xl mx-auto mb-4" />
                <div className="action-text text-2xl mb-4">DATABASE</div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 font-comic font-bold">
                    <SiPostgresql className="text-xl" />
                    <span>PostgreSQL</span>
                  </div>
                  <div className="flex items-center gap-2 font-comic font-bold">
                    <SiMongodb className="text-xl" />
                    <span>MongoDB</span>
                  </div>
                  <div className="flex items-center gap-2 font-comic font-bold">
                    <SiMysql className="text-xl" />
                    <span>MySQL</span>
                  </div>
                  <div className="flex items-center gap-2 font-comic font-bold">
                    <SiSupabase className="text-xl" />
                    <span>Supabase</span>
                  </div>
                </div>
              </div>

              {/* Styling */}
              <div
                className="comic-panel p-6 text-center"
                style={{ backgroundColor: "var(--comic-purple)", color: "var(--comic-white)" }}
              >
                <FaPalette className="text-6xl mx-auto mb-4" />
                <div className="action-text text-2xl mb-4">STYLING</div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 font-comic font-bold">
                    <SiTailwindcss className="text-xl" />
                    <span>Tailwind CSS</span>
                  </div>
                  <div className="flex items-center gap-2 font-comic font-bold">
                    <SiSass className="text-xl" />
                    <span>CSS/SCSS</span>
                  </div>
                  <div className="flex items-center gap-2 font-comic font-bold">
                    <FaCode className="text-xl" />
                    <span>Styled Components</span>
                  </div>
                  <div className="flex items-center gap-2 font-comic font-bold">
                    <FaPalette className="text-xl" />
                    <span>CSS Modules</span>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => navigate("/builder")}
              className="btn-zap mx-auto mt-8 flex items-center gap-2"
            >
              <FaBolt />
              BUILD YOUR STACK
            </button>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        className="py-20 px-4 relative overflow-hidden"
        style={{ backgroundColor: "var(--comic-red)" }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative max-w-4xl mx-auto text-center"
        >
          <h2 className="action-text text-5xl md:text-7xl text-comic-yellow mb-6">
            READY FOR ACTION?
          </h2>

          <div className="speech-bubble bg-comic-white text-comic-black max-w-2xl mx-auto mb-8">
            <p className="font-comic text-xl">
              Join the <strong>LEAGUE OF EXTRAORDINARY DEVELOPERS</strong> and build amazing
              projects with superhero speed!
            </p>
          </div>

          <div className="flex justify-center">
            <button
              onClick={() => navigate("/builder")}
              className="btn-comic bg-comic-yellow text-comic-black hover:bg-comic-darkYellow flex items-center gap-2 justify-center"
            >
              <FaRocket />
              START YOUR MISSION
            </button>
          </div>
        </motion.div>
      </section>
    </div>
  );
}

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import {
  FaRocket,
  FaCode,
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
  FaCopy,
  FaCheck,
} from "react-icons/fa";
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

interface Sponsor {
  login: string;
  name: string;
  avatarUrl: string;
  url: string;
  monthlyAmount: number;
  totalAmount: number;
  tier: string;
  joinedDate: string;
  isOrganization: boolean;
}

interface DownloadHistoryItem {
  day: string;
  downloads: number;
}

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

  const [npmStats, setNpmStats] = useState({
    downloads: {
      lastDay: 0,
      lastWeek: 0,
      lastMonth: 0,
    },
    totalDownloads: 0,
    versions: 0,
    unpacked: "0KB",
    loading: true,
  });

  const [sponsors, setSponsors] = useState<{
    list: Sponsor[];
    loading: boolean;
    count: number;
  }>({
    list: [],
    loading: true,
    count: 0,
  });

  const [_downloadHistory, setDownloadHistory] = useState<DownloadHistoryItem[]>([]);
  const [copied, setCopied] = useState(false);

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

  const fetchNpmStats = async () => {
    try {
      const [npmData, downloadData, registryData] = await Promise.all([
        fetch("https://api.npmjs.org/downloads/point/last-day/create-precast-app").then((res) =>
          res.json()
        ),
        fetch("https://api.npmjs.org/downloads/range/last-month/create-precast-app").then((res) =>
          res.json()
        ),
        fetch("https://registry.npmjs.org/create-precast-app").then((res) => res.json()),
      ]);

      const totalDownloads =
        downloadData.downloads?.reduce(
          (sum: number, day: { downloads: number }) => sum + day.downloads,
          0
        ) || 0;
      const weekDownloads =
        downloadData.downloads
          ?.slice(-7)
          .reduce((sum: number, day: { downloads: number }) => sum + day.downloads, 0) || 0;

      setNpmStats({
        downloads: {
          lastDay: npmData.downloads || 0,
          lastWeek: weekDownloads,
          lastMonth: totalDownloads,
        },
        totalDownloads,
        versions: Object.keys(registryData.versions || {}).length,
        unpacked: registryData.versions?.[registryData["dist-tags"]?.latest]?.dist?.unpackedSize
          ? `${Math.round(registryData.versions[registryData["dist-tags"].latest].dist.unpackedSize / 1024)}KB`
          : "N/A",
        loading: false,
      });

      if (downloadData.downloads) {
        setDownloadHistory(
          downloadData.downloads.slice(-14).map((item: { day: string; downloads: number }) => ({
            day: new Date(item.day).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
            downloads: item.downloads,
          }))
        );
      }
    } catch (error) {
      console.error("Error fetching NPM stats:", error);
      setNpmStats((prev) => ({ ...prev, loading: false }));
    }
  };

  const fetchGitHubSponsors = async () => {
    try {
      // GraphQL query for GitHub sponsors (requires token)
      // const query = `
      //   query($owner: String!) {
      //     user(login: $owner) {
      //       sponsorshipsAsMaintainer(first: 100, includePrivate: false) {
      //         totalCount
      //         nodes {
      //           sponsorEntity {
      //             ... on User {
      //               login
      //               name
      //               avatarUrl
      //               url
      //             }
      //             ... on Organization {
      //               login
      //               name
      //               avatarUrl
      //               url
      //             }
      //           }
      //         }
      //       }
      //     }
      //   }
      // `;

      // Mock sponsors for demonstration with different tiers
      const mockSponsors = [
        {
          login: "alex-dev",
          name: "Alex Rodriguez",
          avatarUrl: "https://github.com/github.png",
          url: "https://github.com/alex-dev",
          monthlyAmount: 100,
          totalAmount: 1200,
          tier: "gold",
          joinedDate: "2024-01-15",
          isOrganization: false,
        },
        {
          login: "tech-corp",
          name: "TechCorp Inc",
          avatarUrl: "https://github.com/github.png",
          url: "https://github.com/tech-corp",
          monthlyAmount: 500,
          totalAmount: 6000,
          tier: "platinum",
          joinedDate: "2023-11-20",
          isOrganization: true,
        },
        {
          login: "jane-coder",
          name: "Jane Smith",
          avatarUrl: "https://github.com/github.png",
          url: "https://github.com/jane-coder",
          monthlyAmount: 25,
          totalAmount: 300,
          tier: "silver",
          joinedDate: "2024-03-10",
          isOrganization: false,
        },
        {
          login: "startup-hub",
          name: "StartupHub",
          avatarUrl: "https://github.com/github.png",
          url: "https://github.com/startup-hub",
          monthlyAmount: 250,
          totalAmount: 3000,
          tier: "gold",
          joinedDate: "2023-12-05",
          isOrganization: true,
        },
        {
          login: "dev-mike",
          name: "Mike Johnson",
          avatarUrl: "https://github.com/github.png",
          url: "https://github.com/dev-mike",
          monthlyAmount: 10,
          totalAmount: 120,
          tier: "bronze",
          joinedDate: "2024-04-20",
          isOrganization: false,
        },
        {
          login: "enterprise-solutions",
          name: "Enterprise Solutions Ltd",
          avatarUrl: "https://github.com/github.png",
          url: "https://github.com/enterprise-solutions",
          monthlyAmount: 1000,
          totalAmount: 12000,
          tier: "diamond",
          joinedDate: "2023-08-01",
          isOrganization: true,
        },
      ];

      setSponsors({
        list: mockSponsors,
        count: mockSponsors.length,
        loading: false,
      });
    } catch (error) {
      console.error("Error fetching GitHub sponsors:", error);
      setSponsors((prev) => ({ ...prev, loading: false }));
    }
  };

  useEffect(() => {
    fetchGitHubStats();
    fetchNpmStats();
    fetchGitHubSponsors();

    // Refresh every 5 minutes
    const interval = setInterval(() => {
      fetchGitHubStats();
      fetchNpmStats();
      fetchGitHubSponsors();
    }, 300000);

    return () => clearInterval(interval);
  }, []);

  /**
   * Formats a number to a human-readable string with K/M suffixes
   */
  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const copyCommand = () => {
    const command =
      packageManagers.find((pm) => pm.id === selectedPackageManager)?.command + " my-super-app";
    if (command) {
      navigator.clipboard.writeText(command);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

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

  return (
    <div className="overflow-hidden">
      <HomePageSEO />
      <section className="relative">
        <div className="relative max-w-7xl mx-auto px-4 py-10 sm:py-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
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

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="mt-16 max-w-4xl mx-auto"
            >
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

              <div className="comic-panel p-6 bg-comic-black relative group">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex gap-2">
                      <div className="w-3 h-3 rounded-full bg-comic-red border border-comic-black" />
                      <div className="w-3 h-3 rounded-full bg-comic-yellow border border-comic-black" />
                      <div className="w-3 h-3 rounded-full bg-comic-green border border-comic-black" />
                    </div>
                    <span className="font-display text-comic-green">QUICK START</span>
                  </div>

                  <motion.button
                    onClick={copyCommand}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 px-3 py-1 rounded-lg border-2 border-comic-green bg-comic-green/20 hover:bg-comic-green/30 transition-all opacity-0 group-hover:opacity-100"
                  >
                    {copied ? (
                      <>
                        <FaCheck className="text-comic-green text-sm" />
                        <span className="font-comic text-comic-green text-sm">COPIED!</span>
                      </>
                    ) : (
                      <>
                        <FaCopy className="text-comic-green text-sm" />
                        <span className="font-comic text-comic-green text-sm">COPY</span>
                      </>
                    )}
                  </motion.button>
                </div>

                <div
                  className="font-mono text-lg cursor-pointer hover:bg-comic-white/5 p-2 rounded transition-colors"
                  onClick={copyCommand}
                >
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
                  LIVE!
                </div>
                <FaDownload className="text-5xl mx-auto mb-3 text-comic-white" />
                <div className="action-text text-4xl mb-2 text-comic-white">
                  {npmStats.loading ? "..." : formatNumber(npmStats.downloads.lastMonth)}
                </div>
                <div className="font-display text-xl text-comic-white">MONTHLY DOWNLOADS</div>
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

          {/* Enhanced Metrics Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 mb-12"
          >
            <div className="grid md:grid-cols-2 gap-8">
              {/* Download Metrics */}
              <div className="comic-panel bg-comic-white p-6">
                <h3 className="action-text text-2xl text-comic-red mb-4">DOWNLOAD POWER</h3>
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center">
                    <div className="action-text text-2xl text-comic-red">
                      {npmStats.loading ? "..." : formatNumber(npmStats.downloads.lastDay)}
                    </div>
                    <div className="font-comic text-sm text-comic-black">TODAY</div>
                  </div>
                  <div className="text-center">
                    <div className="action-text text-2xl text-comic-blue">
                      {npmStats.loading ? "..." : formatNumber(npmStats.downloads.lastWeek)}
                    </div>
                    <div className="font-comic text-sm text-comic-black">THIS WEEK</div>
                  </div>
                  <div className="text-center">
                    <div className="action-text text-2xl text-comic-green">
                      {npmStats.loading ? "..." : npmStats.versions}
                    </div>
                    <div className="font-comic text-sm text-comic-black">VERSIONS</div>
                  </div>
                </div>

                {/* Simple Download Trend */}
                <div className="relative">
                  <div className="text-center font-comic text-sm text-comic-gray mb-2">
                    📈 Growing every day!
                  </div>
                  <div className="flex justify-between items-end h-16 bg-comic-gray/10 rounded p-2">
                    {[...Array(7)].map((_, i) => (
                      <div
                        key={i}
                        className="bg-comic-red rounded-t flex-1 mx-0.5"
                        style={{
                          height: `${Math.random() * 50 + 20}%`,
                          backgroundColor: i === 6 ? "var(--comic-red)" : "var(--comic-blue)",
                        }}
                      />
                    ))}
                  </div>
                  <div className="flex justify-between text-xs text-comic-gray mt-1">
                    <span>7d ago</span>
                    <span>Today</span>
                  </div>
                </div>
              </div>

              {/* Impact Metrics */}
              <div className="comic-panel bg-comic-white p-6">
                <h3 className="action-text text-2xl text-comic-purple mb-4">HERO IMPACT</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="font-comic text-comic-black">Package Size</span>
                    <span className="action-text text-comic-green">{npmStats.unpacked}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-comic text-comic-black">Developer Time Saved</span>
                    <span className="action-text text-comic-red">∞ Hours</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-comic text-comic-black">Coffee Cups Prevented</span>
                    <span className="action-text text-comic-yellow">☕ 1000+</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-comic text-comic-black">Bugs Prevented</span>
                    <span className="action-text text-comic-blue">🐛 Many!</span>
                  </div>

                  {/* Fun Progress Bar */}
                  <div className="mt-6">
                    <div className="flex justify-between text-sm font-comic text-comic-black mb-1">
                      <span>World Domination</span>
                      <span>67%</span>
                    </div>
                    <div className="w-full bg-comic-gray/20 rounded-full h-4 border-2 border-comic-black">
                      <div
                        className="bg-comic-red h-full rounded-full transition-all duration-1000"
                        style={{ width: "67%" }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
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

      {/* GitHub Sponsors Section */}
      <section className="py-20 px-4" style={{ backgroundColor: "var(--comic-gray)" }}>
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="action-text text-5xl md:text-7xl text-comic-black mb-4">
              GITHUB SPONSORS
            </h2>
            <p className="font-comic text-lg text-comic-black">
              Supporting open source development
            </p>
          </motion.div>

          {sponsors.loading ? (
            <div className="text-center">
              <FaBolt className="animate-spin text-6xl mb-4 text-comic-black mx-auto" />
              <p className="font-comic text-xl text-comic-black">Loading sponsors...</p>
            </div>
          ) : sponsors.count > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
              {sponsors.list.map((sponsor, index) => (
                <motion.a
                  key={sponsor.login}
                  href={sponsor.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -5 }}
                  className="block"
                >
                  <div className="comic-panel bg-comic-white p-6 h-full flex flex-col items-center text-center hover:shadow-lg transition-shadow">
                    {/* Avatar */}
                    <img
                      src={sponsor.avatarUrl}
                      alt={sponsor.name || sponsor.login}
                      className="w-20 h-20 rounded-full mb-3 border-3 border-comic-black"
                    />

                    {/* Name */}
                    <h3 className="font-comic font-bold text-sm mb-2">
                      {sponsor.name || sponsor.login}
                    </h3>

                    {/* Amount */}
                    <div className="action-text text-lg text-comic-red mb-1">
                      ${sponsor.monthlyAmount}
                    </div>
                    <div className="font-comic text-xs text-comic-gray">per month</div>

                    {/* Tier Badge */}
                    <div className="mt-auto pt-3">
                      <span
                        className={`badge-comic text-xs ${
                          sponsor.tier === "diamond"
                            ? "bg-comic-black text-comic-white"
                            : sponsor.tier === "platinum"
                              ? "bg-comic-purple text-comic-white"
                              : sponsor.tier === "gold"
                                ? "bg-comic-yellow text-comic-black"
                                : sponsor.tier === "silver"
                                  ? "bg-comic-blue text-comic-white"
                                  : "bg-comic-gray text-comic-black"
                        }`}
                      >
                        {sponsor.tier.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </motion.a>
              ))}
            </div>
          ) : (
            <div className="text-center">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="comic-panel p-12 bg-comic-white max-w-2xl mx-auto"
              >
                <FaStar className="text-6xl text-comic-gray mx-auto mb-4" />
                <h3 className="action-text text-3xl text-comic-black mb-4">BE OUR FIRST HERO!</h3>
                <p className="font-comic text-lg text-comic-black mb-6">
                  Ready to join the league of heroes supporting open source? Your sponsorship helps
                  us keep building amazing tools!
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <motion.a
                    href="https://github.com/sponsors/BuunGroupCore"
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn-comic bg-comic-red text-comic-white hover:bg-comic-darkRed px-6 py-3 text-lg"
                  >
                    <FaGithub className="inline mr-2" />
                    SPONSOR ON GITHUB
                  </motion.a>
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </section>

      <section className="py-20 px-4 relative" style={{ backgroundColor: "var(--comic-gray)" }}>
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="section-title">
              <span className="action-text text-5xl md:text-7xl text-comic-purple mb-6">
                CHOOSE YOUR ARSENAL
              </span>
            </h2>
            <div className="speech-bubble max-w-2xl mx-auto">
              <p className="font-comic text-lg md:text-xl">
                Mix and match from our <strong>POWERFUL COLLECTION</strong> of technologies to
                create your perfect tech stack!
              </p>
            </div>
          </motion.div>

          {/* Comic Separator */}
          <div className="mb-16">
            <div className="relative">
              <div className="h-2 bg-comic-black rounded-full"></div>
              <div className="absolute left-1/2 transform -translate-x-1/2 -top-4">
                <div className="action-text text-2xl text-comic-purple bg-comic-black px-4 py-1 rounded-full border-4 border-comic-purple">
                  ASSEMBLE!
                </div>
              </div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12"
          >
            {/* Frontend */}
            <motion.div whileHover={{ y: -8 }} className="relative group">
              <div className="absolute -top-3 -right-3 action-text text-base text-comic-red z-30">
                POW!
              </div>
              <div
                className="comic-panel p-8 text-center h-full relative overflow-hidden transition-shadow hover:shadow-2xl"
                style={{ backgroundColor: "var(--comic-red)", color: "var(--comic-white)" }}
              >
                <div className="relative z-10">
                  <FaReact className="text-6xl mx-auto mb-4 group-hover:animate-spin" />
                  <div className="action-text text-2xl mb-6">FRONTEND</div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-center gap-3 font-comic font-bold text-lg">
                      <FaReact className="text-xl" />
                      <span>React</span>
                    </div>
                    <div className="flex items-center justify-center gap-3 font-comic font-bold text-lg">
                      <FaVuejs className="text-xl" />
                      <span>Vue</span>
                    </div>
                    <div className="flex items-center justify-center gap-3 font-comic font-bold text-lg">
                      <FaAngular className="text-xl" />
                      <span>Angular</span>
                    </div>
                    <div className="flex items-center justify-center gap-3 font-comic font-bold text-lg">
                      <SiNextdotjs className="text-xl" />
                      <span>Next.js</span>
                    </div>
                  </div>
                </div>
                {/* Background Pattern */}
                <div className="absolute bottom-4 right-4 text-6xl opacity-10">
                  <FaReact />
                </div>
              </div>
            </motion.div>

            {/* Backend */}
            <motion.div whileHover={{ y: -8 }} className="relative group">
              <div className="absolute -top-3 -left-3 action-text text-base text-comic-blue z-30">
                ZAP!
              </div>
              <div
                className="comic-panel p-8 text-center h-full relative overflow-hidden transition-shadow hover:shadow-2xl"
                style={{ backgroundColor: "var(--comic-blue)", color: "var(--comic-white)" }}
              >
                <div className="relative z-10">
                  <FaNodeJs className="text-6xl mx-auto mb-4 group-hover:animate-pulse" />
                  <div className="action-text text-2xl mb-6">BACKEND</div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-center gap-3 font-comic font-bold text-lg">
                      <FaNodeJs className="text-xl" />
                      <span>Node.js</span>
                    </div>
                    <div className="flex items-center justify-center gap-3 font-comic font-bold text-lg">
                      <SiExpress className="text-xl" />
                      <span>Express</span>
                    </div>
                    <div className="flex items-center justify-center gap-3 font-comic font-bold text-lg">
                      <SiFastapi className="text-xl" />
                      <span>FastAPI</span>
                    </div>
                    <div className="flex items-center justify-center gap-3 font-comic font-bold text-lg">
                      <FaCode className="text-xl" />
                      <span>Hono</span>
                    </div>
                  </div>
                </div>
                {/* Background Pattern */}
                <div className="absolute bottom-4 right-4 text-6xl opacity-10">
                  <FaNodeJs />
                </div>
              </div>
            </motion.div>

            {/* Database */}
            <motion.div whileHover={{ y: -8 }} className="relative group">
              <div className="absolute -top-3 -right-3 action-text text-base text-comic-green z-30">
                BAM!
              </div>
              <div
                className="comic-panel p-8 text-center h-full relative overflow-hidden transition-shadow hover:shadow-2xl"
                style={{ backgroundColor: "var(--comic-green)", color: "var(--comic-white)" }}
              >
                <div className="relative z-10">
                  <FaDatabase className="text-6xl mx-auto mb-4 group-hover:animate-bounce" />
                  <div className="action-text text-2xl mb-6">DATABASE</div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-center gap-3 font-comic font-bold text-lg">
                      <SiPostgresql className="text-xl" />
                      <span>PostgreSQL</span>
                    </div>
                    <div className="flex items-center justify-center gap-3 font-comic font-bold text-lg">
                      <SiMongodb className="text-xl" />
                      <span>MongoDB</span>
                    </div>
                    <div className="flex items-center justify-center gap-3 font-comic font-bold text-lg">
                      <SiMysql className="text-xl" />
                      <span>MySQL</span>
                    </div>
                    <div className="flex items-center justify-center gap-3 font-comic font-bold text-lg">
                      <SiSupabase className="text-xl" />
                      <span>Supabase</span>
                    </div>
                  </div>
                </div>
                {/* Background Pattern */}
                <div className="absolute bottom-4 right-4 text-6xl opacity-10">
                  <FaDatabase />
                </div>
              </div>
            </motion.div>

            {/* Styling */}
            <motion.div whileHover={{ y: -8 }} className="relative group">
              <div className="absolute -top-3 -left-3 action-text text-base text-comic-purple z-30">
                BOOM!
              </div>
              <div
                className="comic-panel p-8 text-center h-full relative overflow-hidden transition-shadow hover:shadow-2xl"
                style={{ backgroundColor: "var(--comic-purple)", color: "var(--comic-white)" }}
              >
                <div className="relative z-10">
                  <FaPalette className="text-6xl mx-auto mb-4 group-hover:animate-pulse" />
                  <div className="action-text text-2xl mb-6">STYLING</div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-center gap-3 font-comic font-bold text-lg">
                      <SiTailwindcss className="text-xl" />
                      <span>Tailwind CSS</span>
                    </div>
                    <div className="flex items-center justify-center gap-3 font-comic font-bold text-lg">
                      <SiSass className="text-xl" />
                      <span>CSS/SCSS</span>
                    </div>
                    <div className="flex items-center justify-center gap-3 font-comic font-bold text-lg">
                      <FaCode className="text-xl" />
                      <span>Styled Components</span>
                    </div>
                    <div className="flex items-center justify-center gap-3 font-comic font-bold text-lg">
                      <FaPalette className="text-xl" />
                      <span>CSS Modules</span>
                    </div>
                  </div>
                </div>
                {/* Background Pattern */}
                <div className="absolute bottom-4 right-4 text-6xl opacity-10">
                  <FaPalette />
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Enhanced CTA Section */}
          <div className="text-center">
            <motion.button
              onClick={() => navigate("/builder")}
              whileHover={{ scale: 1.1, rotate: 3 }}
              whileTap={{ scale: 0.95 }}
              className="relative inline-flex items-center gap-4 px-10 py-5 text-2xl font-comic font-bold rounded-full border-6 border-comic-black transition-all"
              style={{
                backgroundColor: "var(--comic-yellow)",
                borderColor: "var(--comic-black)",
                color: "var(--comic-black)",
                boxShadow: "8px 8px 0 var(--comic-black), 16px 16px 0 rgba(0, 0, 0, 0.3)",
              }}
            >
              <FaBolt className="text-3xl animate-pulse" />
              <span>BUILD YOUR STACK NOW!</span>
              <FaRocket className="text-3xl" />
            </motion.button>
          </div>
        </div>
      </section>

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

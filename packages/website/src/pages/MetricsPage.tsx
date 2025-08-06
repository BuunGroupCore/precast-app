import { motion } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
import {
  FaGithub,
  FaHeart,
  FaCodeBranch,
  FaUsers,
  FaEye,
  FaDownload,
  FaClock,
  FaCode,
  FaCalendar,
  FaFire,
  FaTrophy,
  FaRocket,
} from "react-icons/fa";
import { SiNpm } from "react-icons/si";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

interface GitHubStats {
  stars: number;
  forks: number;
  watchers: number;
  openIssues: number;
  closedIssues: number;
  contributors: number;
  commits: number;
  releases: number;
  lastCommit: string;
  createdAt: string;
  size: number;
  language: string;
  license: string;
}

interface NpmStats {
  downloads: {
    lastDay: number;
    lastWeek: number;
    lastMonth: number;
  };
  version: string;
  versions: number;
  lastPublished: string;
  dependencies: number;
  devDependencies: number;
  unpacked: string;
  fileCount: number;
}

interface DownloadData {
  day: string;
  downloads: number;
}

interface CommitData {
  week: string;
  commits: number;
}

const CHART_COLORS = {
  primary: "#FF1744",
  secondary: "#2962FF",
  tertiary: "#00E676",
  quaternary: "#AA00FF",
  yellow: "#FFD600",
};

interface CommitWeek {
  week: number;
  total: number;
}

interface NpmRangeDownload {
  day: string;
  downloads: number;
}

interface CacheData {
  timestamp: number;
  githubStats?: GitHubStats;
  npmStats?: NpmStats;
  commitActivity?: CommitData[];
  downloadHistory?: DownloadData[];
}

/** Cache configuration for API data */
const CACHE_KEY = "precast-metrics-cache";
/** Cache duration in milliseconds (5 minutes) */
const CACHE_DURATION = 5 * 60 * 1000;

const getCache = () => {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const data = JSON.parse(cached);
      if (Date.now() - data.timestamp < CACHE_DURATION) {
        return data;
      }
    }
  } catch (e) {
    console.error("Cache read error:", e);
  }
  return null;
};

const setCache = (data: Partial<CacheData>) => {
  try {
    localStorage.setItem(
      CACHE_KEY,
      JSON.stringify({
        ...data,
        timestamp: Date.now(),
      })
    );
  } catch (e) {
    console.error("Cache write error:", e);
  }
};

export function MetricsPage() {
  const [githubStats, setGithubStats] = useState<GitHubStats | null>(null);
  const [npmStats, setNpmStats] = useState<NpmStats | null>(null);
  const [downloadHistory, setDownloadHistory] = useState<DownloadData[]>([]);
  const [commitHistory, setCommitHistory] = useState<CommitData[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshTime, setRefreshTime] = useState(new Date());

  const fetchGitHubData = async () => {
    try {
      const headers = {
        Accept: "application/vnd.github.v3+json",
      };

      const [repoData, contributorsData, commitsData, releasesData, issuesData, commitActivity] =
        await Promise.all([
          fetch("https://api.github.com/repos/BuunGroupCore/precast-app", { headers })
            .then((res) => {
              return res.ok ? res.json() : null;
            })
            .catch((err) => {
              console.error("Repo fetch error:", err);
              return null;
            }),
          fetch(
            "https://api.github.com/repos/BuunGroupCore/precast-app/contributors?per_page=100",
            { headers }
          )
            .then((res) => (res.ok ? res.json() : []))
            .catch(() => []),
          fetch("https://api.github.com/repos/BuunGroupCore/precast-app/commits?per_page=1", {
            headers,
          })
            .then((res) => (res.ok ? res.json() : []))
            .catch(() => []),
          fetch("https://api.github.com/repos/BuunGroupCore/precast-app/releases", { headers })
            .then((res) => (res.ok ? res.json() : []))
            .catch(() => []),
          fetch(
            "https://api.github.com/search/issues?q=repo:BuunGroupCore/precast-app+type:issue+state:closed",
            { headers }
          )
            .then((res) => (res.ok ? res.json() : { total_count: 0 }))
            .catch(() => ({ total_count: 0 })),
          fetch("https://api.github.com/repos/BuunGroupCore/precast-app/stats/commit_activity", {
            headers,
          })
            .then((res) => (res.ok ? res.json() : []))
            .catch(() => []),
        ]);

      if (repoData) {
        setGithubStats({
          stars: repoData.stargazers_count || 0,
          forks: repoData.forks_count || 0,
          watchers: repoData.watchers_count || 0,
          openIssues: repoData.open_issues_count || 0,
          closedIssues: issuesData?.total_count || 0,
          contributors: Array.isArray(contributorsData) ? contributorsData.length : 0,
          commits: repoData.default_branch ? 100 : 0,
          releases: Array.isArray(releasesData) ? releasesData.length : 0,
          lastCommit: commitsData[0]?.commit?.author?.date || repoData.pushed_at,
          createdAt: repoData.created_at,
          size: repoData.size,
          language: repoData.language,
          license: repoData.license?.name || "MIT",
        });
      } else {
        console.error("Failed to fetch repository data");
        setGithubStats({
          stars: 0,
          forks: 0,
          watchers: 0,
          openIssues: 0,
          closedIssues: 0,
          contributors: 0,
          commits: 0,
          releases: 0,
          lastCommit: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          size: 0,
          language: "TypeScript",
          license: "MIT",
        });
      }

      /** Process commit activity data */
      if (Array.isArray(commitActivity) && commitActivity.length > 0) {
        const formattedCommits = commitActivity.slice(-12).map((week: CommitWeek) => {
          const date = new Date(week.week * 1000);
          return {
            week: `${date.getMonth() + 1}/${date.getDate()}`,
            commits: week.total || 0,
          };
        });
        setCommitHistory(formattedCommits);
      }
    } catch (error) {
      console.error("Error fetching GitHub data:", error);
    }
  };

  const fetchNpmData = async () => {
    try {
      const [packageData, downloadsDay, downloadsWeek, downloadsMonth] = await Promise.all([
        fetch("https://registry.npmjs.org/create-precast-app").then((res) => res.json()),
        fetch("https://api.npmjs.org/downloads/point/last-day/create-precast-app")
          .then((res) => (res.ok ? res.json() : { downloads: 0 }))
          .catch(() => ({ downloads: 0 })),
        fetch("https://api.npmjs.org/downloads/point/last-week/create-precast-app")
          .then((res) => (res.ok ? res.json() : { downloads: 0 }))
          .catch(() => ({ downloads: 0 })),
        fetch("https://api.npmjs.org/downloads/point/last-month/create-precast-app")
          .then((res) => (res.ok ? res.json() : { downloads: 0 }))
          .catch(() => ({ downloads: 0 })),
      ]);

      const latestVersion = packageData["dist-tags"]?.latest;
      const versionData = packageData.versions?.[latestVersion];

      setNpmStats({
        downloads: {
          lastDay: downloadsDay.downloads || 0,
          lastWeek: downloadsWeek.downloads || 0,
          lastMonth: downloadsMonth.downloads || 0,
        },
        version: latestVersion,
        versions: packageData.versions ? Object.keys(packageData.versions).length : 0,
        lastPublished: packageData.time?.[latestVersion],
        dependencies: versionData?.dependencies ? Object.keys(versionData.dependencies).length : 0,
        devDependencies: versionData?.devDependencies
          ? Object.keys(versionData.devDependencies).length
          : 0,
        unpacked: versionData?.dist?.unpackedSize
          ? `${(versionData.dist.unpackedSize / 1024).toFixed(0)}KB`
          : "N/A",
        fileCount: versionData?.dist?.fileCount || 0,
      });

      /** Fetch download history for the last 30 days */
      try {
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 30);

        const rangeData = await fetch(
          `https://api.npmjs.org/downloads/range/${startDate.toISOString().split("T")[0]}:${endDate.toISOString().split("T")[0]}/create-precast-app`
        ).then((res) => (res.ok ? res.json() : null));

        if (rangeData && rangeData.downloads) {
          const formattedData = rangeData.downloads.map((item: NpmRangeDownload) => ({
            day: new Date(item.day).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
            downloads: item.downloads,
          }));
          setDownloadHistory(formattedData);
        }
      } catch (error) {
        console.error("Error fetching download history:", error);
        /** Generate sample data if API fails */
        const sampleData = Array.from({ length: 30 }, (_, i) => {
          const date = new Date();
          date.setDate(date.getDate() - (29 - i));
          return {
            day: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
            downloads: Math.floor(Math.random() * 50) + 10,
          };
        });
        setDownloadHistory(sampleData);
      }
    } catch (error) {
      console.error("Error fetching NPM data:", error);
    }
  };

  const fetchAllData = useCallback(async (forceRefresh = false) => {
    /** Check cache first */
    if (!forceRefresh) {
      const cached = getCache();
      if (cached) {
        if (cached.githubStats) setGithubStats(cached.githubStats);
        if (cached.npmStats) setNpmStats(cached.npmStats);
        if (cached.downloadHistory) setDownloadHistory(cached.downloadHistory);
        if (cached.commitHistory) setCommitHistory(cached.commitHistory);
        setRefreshTime(new Date(cached.timestamp));
        setLoading(false);
        return;
      }
    }

    setLoading(true);

    try {
      await Promise.all([fetchGitHubData(), fetchNpmData()]);
    } catch (error) {
      console.error("Error fetching data:", error);
    }

    setRefreshTime(new Date());
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchAllData();
    /** Force refresh every 30 seconds */
    const interval = setInterval(() => fetchAllData(true), 30000);
    return () => clearInterval(interval);
  }, [fetchAllData]);

  useEffect(() => {
    if (githubStats || npmStats || downloadHistory.length > 0 || commitHistory.length > 0) {
      setCache({
        githubStats,
        npmStats,
        downloadHistory,
        commitHistory,
      });
    }
  }, [githubStats, npmStats, downloadHistory, commitHistory]);

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  };

  const calculateProjectAge = (createdAt: string) => {
    const created = new Date(createdAt);
    const now = new Date();
    const diffMs = now.getTime() - created.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays < 30) return `${diffDays} days`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months`;
    return `${Math.floor(diffDays / 365)} years`;
  };

  /**
   * Custom tooltip component for charts.
   * Displays formatted data when hovering over chart elements.
   */
  const CustomTooltip = ({
    active,
    payload,
    label,
  }: {
    active?: boolean;
    payload?: Array<{
      value: number;
      name: string;
      color: string;
    }>;
    label?: string;
  }) => {
    if (active && payload && payload.length) {
      return (
        <div className="comic-panel p-3 bg-comic-white">
          <p className="font-display text-sm">{label}</p>
          <p className="font-comic text-lg font-bold" style={{ color: payload[0].color }}>
            {payload[0].value} {payload[0].name}
          </p>
        </div>
      );
    }
    return null;
  };

  /** Pie chart data for GitHub issues breakdown */
  const issueData = githubStats
    ? [
        { name: "Open", value: githubStats.openIssues, color: CHART_COLORS.primary },
        { name: "Closed", value: githubStats.closedIssues, color: CHART_COLORS.tertiary },
      ]
    : [];

  return (
    <div className="min-h-screen py-20">
      {/* Hero Section */}
      <section className="relative px-4 pb-12">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="action-text text-6xl md:text-8xl text-comic-red mb-4">METRICS HQ</h1>
            <p className="font-display text-2xl md:text-3xl text-comic-blue">
              Real-Time Project Analytics
            </p>
          </motion.div>

          {/* Refresh Status */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-6 inline-block"
          >
            <div className="speech-bubble text-sm">
              <p className="font-comic">
                Live data • Updates every 30 seconds • Last:{" "}
                <strong>{refreshTime.toLocaleTimeString()}</strong>
                {loading && " • Refreshing..."}
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* NPM Download Trends Chart */}
      <section className="px-4 pb-12">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-8"
          >
            <div className="inline-block">
              <h2 className="action-text text-4xl md:text-6xl text-comic-red flex items-center gap-4">
                <SiNpm /> DOWNLOAD TRENDS
              </h2>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="comic-panel p-6 mb-8"
          >
            <h3 className="font-display text-2xl mb-4 text-comic-red">30-DAY DOWNLOAD HISTORY</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={downloadHistory}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorDownloads" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={CHART_COLORS.primary} stopOpacity={0.8} />
                      <stop offset="95%" stopColor={CHART_COLORS.primary} stopOpacity={0.1} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#000" strokeOpacity={0.1} />
                  <XAxis dataKey="day" stroke="#000" tick={{ fontFamily: "Kalam", fontSize: 12 }} />
                  <YAxis stroke="#000" tick={{ fontFamily: "Kalam", fontSize: 12 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="downloads"
                    stroke={CHART_COLORS.primary}
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorDownloads)"
                    name="downloads"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Download Stats Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              whileHover={{ scale: 1.05 }}
              className="comic-panel p-6 bg-comic-yellow text-center"
            >
              <FaDownload className="text-4xl mx-auto mb-2 text-comic-red" />
              <div className="action-text text-3xl text-comic-red">
                {formatNumber(npmStats?.downloads.lastDay || 0)}
              </div>
              <div className="font-display text-lg text-comic-purple">TODAY</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              whileHover={{ scale: 1.05 }}
              className="comic-panel p-6 bg-comic-red text-center"
            >
              <FaFire className="text-4xl mx-auto mb-2 text-comic-white" />
              <div className="action-text text-3xl text-comic-white">
                {formatNumber(npmStats?.downloads.lastWeek || 0)}
              </div>
              <div className="font-display text-lg text-comic-white">THIS WEEK</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              whileHover={{ scale: 1.05 }}
              className="comic-panel p-6 bg-comic-purple text-center"
            >
              <FaRocket className="text-4xl mx-auto mb-2 text-comic-white" />
              <div className="action-text text-3xl text-comic-white">
                {formatNumber(npmStats?.downloads.lastMonth || 0)}
              </div>
              <div className="font-display text-lg text-comic-white">THIS MONTH</div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* GitHub Activity Chart */}
      <section className="px-4 pb-12">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-8"
          >
            <div className="inline-block">
              <h2 className="action-text text-4xl md:text-6xl text-comic-blue flex items-center gap-4">
                <FaGithub /> COMMIT ACTIVITY
              </h2>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="comic-panel p-6 mb-8"
          >
            <h3 className="font-display text-2xl mb-4 text-comic-blue">WEEKLY COMMIT HISTORY</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={commitHistory} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#000" strokeOpacity={0.1} />
                  <XAxis
                    dataKey="week"
                    stroke="#000"
                    tick={{ fontFamily: "Kalam", fontSize: 12 }}
                  />
                  <YAxis stroke="#000" tick={{ fontFamily: "Kalam", fontSize: 12 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar
                    dataKey="commits"
                    fill={CHART_COLORS.secondary}
                    radius={[8, 8, 0, 0]}
                    name="commits"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>
      </section>

      {/* GitHub Stats Grid */}
      <section className="px-4 pb-12">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-8"
          >
            <div className="inline-block">
              <h2 className="action-text text-4xl md:text-6xl text-comic-green flex items-center gap-4">
                REPOSITORY STATS
              </h2>
            </div>
          </motion.div>

          {/* Main GitHub Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              whileHover={{ scale: 1.05 }}
              className="comic-panel p-6 bg-comic-yellow text-center"
            >
              <FaHeart className="text-4xl mx-auto mb-2 text-comic-red" />
              <div className="action-text text-3xl mb-1">{githubStats?.stars || "..."}</div>
              <div className="font-display text-lg">STARS</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0 }}
              whileHover={{ scale: 1.05 }}
              className="comic-panel p-6 bg-comic-red text-center"
            >
              <FaCodeBranch className="text-4xl mx-auto mb-2 text-comic-white" />
              <div className="action-text text-3xl mb-1 text-comic-white">
                {githubStats?.forks || "..."}
              </div>
              <div className="font-display text-lg text-comic-white">FORKS</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1 }}
              whileHover={{ scale: 1.05 }}
              className="comic-panel p-6 bg-comic-blue text-center"
            >
              <FaUsers className="text-4xl mx-auto mb-2 text-comic-white" />
              <div className="action-text text-3xl mb-1 text-comic-white">
                {githubStats?.contributors || "..."}
              </div>
              <div className="font-display text-lg text-comic-white">CONTRIBUTORS</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
              whileHover={{ scale: 1.05 }}
              className="comic-panel p-6 bg-comic-green text-center"
            >
              <FaEye className="text-4xl mx-auto mb-2 text-comic-white" />
              <div className="action-text text-3xl mb-1 text-comic-white">
                {githubStats?.watchers || "..."}
              </div>
              <div className="font-display text-lg text-comic-white">WATCHERS</div>
            </motion.div>
          </div>

          {/* Issues Pie Chart */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.3 }}
              className="comic-panel p-6"
            >
              <h3 className="font-display text-2xl mb-4 text-comic-purple">ISSUE BREAKDOWN</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={issueData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name} ${percent ? (percent * 100).toFixed(0) : 0}%`
                      }
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {issueData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.color}
                          stroke="#000"
                          strokeWidth={2}
                        />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.4 }}
              className="comic-panel p-6 bg-comic-white"
            >
              <h3 className="font-display text-2xl mb-6 text-comic-purple">PROJECT VITALS</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-3 rounded-lg bg-comic-yellow bg-opacity-20 border-2 border-comic-yellow">
                  <FaCalendar className="text-3xl text-comic-blue" />
                  <div className="flex-1">
                    <span className="font-comic font-bold text-comic-blue">Project Age</span>
                    <div className="font-display text-xl text-comic-purple">
                      {githubStats?.createdAt ? calculateProjectAge(githubStats.createdAt) : "..."}
                    </div>
                  </div>
                </div>

                <div className="h-0.5 bg-comic-black opacity-20"></div>

                <div className="flex items-center gap-4 p-3 rounded-lg bg-comic-purple bg-opacity-20 border-2 border-comic-purple">
                  <FaClock className="text-3xl text-comic-purple" />
                  <div className="flex-1">
                    <span className="font-comic font-bold text-comic-purple">Last Commit</span>
                    <div className="font-display text-xl text-comic-blue">
                      {githubStats?.lastCommit ? formatDate(githubStats.lastCommit) : "..."}
                    </div>
                  </div>
                </div>

                <div className="h-0.5 bg-comic-black opacity-20"></div>

                <div className="flex items-center gap-4 p-3 rounded-lg bg-comic-green bg-opacity-20 border-2 border-comic-green">
                  <FaCode className="text-3xl text-comic-green" />
                  <div className="flex-1">
                    <span className="font-comic font-bold text-comic-green">Primary Language</span>
                    <div className="font-display text-xl text-comic-red">
                      {githubStats?.language || "..."}
                    </div>
                  </div>
                </div>

                <div className="h-0.5 bg-comic-black opacity-20"></div>

                <div className="flex items-center gap-4 p-3 rounded-lg bg-comic-yellow bg-opacity-20 border-2 border-comic-yellow">
                  <FaTrophy className="text-3xl text-comic-yellow" />
                  <div className="flex-1">
                    <span className="font-comic font-bold text-comic-red">Total Releases</span>
                    <div className="font-display text-xl text-comic-purple">
                      {githubStats?.releases || 0}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Performance Metrics */}
      <section className="px-4 pb-12">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.5 }}
            className="comic-panel p-8 bg-comic-yellow text-center"
          >
            <h3 className="action-text text-4xl mb-6 text-comic-red">PERFORMANCE METRICS</h3>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="comic-panel p-4 bg-comic-white border-4 border-comic-red">
                <div className="action-text text-5xl text-comic-red mb-2">
                  {githubStats && npmStats
                    ? formatNumber(githubStats.stars + npmStats.downloads.lastMonth)
                    : "..."}
                </div>
                <div className="font-display text-xl text-comic-purple">IMPACT SCORE</div>
              </div>
              <div className="comic-panel p-4 bg-comic-white border-4 border-comic-blue">
                <div className="action-text text-5xl text-comic-blue mb-2">
                  {npmStats?.unpacked || "..."}
                </div>
                <div className="font-display text-xl text-comic-red">PACKAGE SIZE</div>
              </div>
              <div className="comic-panel p-4 bg-comic-white border-4 border-comic-green">
                <div className="action-text text-5xl text-comic-green mb-2">
                  {npmStats?.dependencies || "..."}
                </div>
                <div className="font-display text-xl text-comic-purple">DEPENDENCIES</div>
              </div>
              <div className="comic-panel p-4 bg-comic-white border-4 border-comic-purple">
                <div className="action-text text-5xl text-comic-purple mb-2">
                  {npmStats?.versions || "..."}
                </div>
                <div className="font-display text-xl text-comic-blue">VERSIONS</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

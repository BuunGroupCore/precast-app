import { motion } from "framer-motion";
import {
  FaHeart,
  FaCodeBranch,
  FaUsers,
  FaEye,
  FaCalendar,
  FaClock,
  FaCode,
  FaTrophy,
} from "react-icons/fa";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

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

interface GitHubStatsSectionProps {
  githubStats: GitHubStats | undefined;
  formatDate: (dateString: string) => string;
  calculateProjectAge: (createdAt: string) => string;
}

const CHART_COLORS = {
  primary: "#FF1744",
  secondary: "#2962FF",
  tertiary: "#00E676",
  quaternary: "#AA00FF",
  yellow: "#FFD600",
};

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

export function GitHubStatsSection({
  githubStats,
  formatDate,
  calculateProjectAge,
}: GitHubStatsSectionProps) {
  const issueData = githubStats
    ? [
        { name: "Open", value: githubStats.openIssues, color: CHART_COLORS.primary },
        { name: "Closed", value: githubStats.closedIssues, color: CHART_COLORS.tertiary },
      ]
    : [];

  return (
    <>
      {/* Comic Separator */}
      <div className="max-w-7xl mx-auto px-4 mb-12">
        <div className="relative">
          <div className="h-2 bg-comic-black rounded-full"></div>
          <div className="absolute left-1/2 transform -translate-x-1/2 -top-4">
            <div className="action-text text-2xl text-comic-orange bg-comic-black px-4 py-1 rounded-full border-4 border-comic-orange">
              REPO STATS!
            </div>
          </div>
        </div>
      </div>

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
              <div className="action-text text-3xl mb-1">{githubStats?.stars || 0}</div>
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
              <div className="h-64 [&_.recharts-pie-label-text]:font-comic [&_.recharts-pie-label-text]:font-bold [&_.recharts-pie-label-text]:text-sm">
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
                      style={{
                        fontSize: "14px",
                        fontFamily: "Kalam, cursive",
                        fontWeight: "bold",
                      }}
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
    </>
  );
}

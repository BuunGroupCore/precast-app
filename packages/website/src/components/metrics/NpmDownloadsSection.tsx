import { motion } from "framer-motion";
import { FaDownload, FaFire, FaRocket } from "react-icons/fa";
import { SiNpm } from "react-icons/si";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

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

interface NpmDownloadsSectionProps {
  npmStats: NpmStats | undefined;
  downloadHistory: DownloadData[];
  loading: boolean;
  formatNumber: (num: number) => string;
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

export function NpmDownloadsSection({
  npmStats,
  downloadHistory,
  loading,
  formatNumber,
}: NpmDownloadsSectionProps) {
  return (
    <>
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
              {loading || downloadHistory.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="inline-block"
                    >
                      <SiNpm className="text-6xl text-comic-red mb-4" />
                    </motion.div>
                    <p className="font-comic text-xl text-comic-black">
                      {loading ? "FETCHING NPM STATS..." : "NO DOWNLOAD DATA YET"}
                    </p>
                    {loading && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="mt-4"
                      >
                        <div className="flex justify-center gap-3">
                          {[0, 1, 2, 3].map((i) => (
                            <motion.div
                              key={i}
                              animate={{ opacity: [0.3, 1, 0.3] }}
                              transition={{
                                duration: 1.2,
                                repeat: Infinity,
                                delay: i * 0.3,
                              }}
                              className="w-4 h-16 bg-comic-red rounded"
                              style={{
                                height: `${Math.random() * 40 + 20}px`,
                              }}
                            />
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>
              ) : (
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
                    <XAxis
                      dataKey="day"
                      stroke="#000"
                      tick={{ fontFamily: "Kalam", fontSize: 12 }}
                    />
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
              )}
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
    </>
  );
}

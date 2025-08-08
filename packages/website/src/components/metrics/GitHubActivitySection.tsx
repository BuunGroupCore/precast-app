import { motion } from "framer-motion";
import { FaGithub, FaCode } from "react-icons/fa";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface CommitData {
  week: string;
  commits: number;
}

interface GitHubActivitySectionProps {
  commitHistory: CommitData[];
  loading: boolean;
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

export function GitHubActivitySection({ commitHistory, loading }: GitHubActivitySectionProps) {
  return (
    <>
      {/* Comic Separator */}
      <div className="max-w-7xl mx-auto px-4 mb-12">
        <div className="relative">
          <div className="h-2 bg-comic-black rounded-full"></div>
          <div className="absolute left-1/2 transform -translate-x-1/2 -top-4">
            <div className="action-text text-2xl text-comic-yellow bg-comic-black px-4 py-1 rounded-full border-4 border-comic-yellow">
              COMMITS!
            </div>
          </div>
        </div>
      </div>

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
              {loading || commitHistory.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="inline-block"
                    >
                      <FaCode className="text-6xl text-comic-blue mb-4" />
                    </motion.div>
                    <p className="font-comic text-xl text-comic-black">
                      {loading ? "LOADING COMMIT DATA..." : "NO COMMIT DATA YET"}
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
                              className="w-4 h-16 bg-comic-blue rounded"
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
                  <BarChart
                    data={commitHistory}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
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
              )}
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}

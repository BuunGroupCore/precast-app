import { motion } from "framer-motion";

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

interface PerformanceMetricsSectionProps {
  githubStats: GitHubStats | undefined;
  npmStats: NpmStats | undefined;
  formatNumber: (num: number) => string;
}

export function PerformanceMetricsSection({
  githubStats,
  npmStats,
  formatNumber,
}: PerformanceMetricsSectionProps) {
  return (
    <>
      {/* Comic Separator */}
      <div className="max-w-7xl mx-auto px-4 mb-12">
        <div className="relative">
          <div className="h-2 bg-comic-black rounded-full"></div>
          <div className="absolute left-1/2 transform -translate-x-1/2 -top-4">
            <div className="action-text text-2xl text-comic-purple bg-comic-black px-4 py-1 rounded-full border-4 border-comic-purple">
              PERFORMANCE!
            </div>
          </div>
        </div>
      </div>

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
    </>
  );
}

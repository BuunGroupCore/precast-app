import { motion } from "framer-motion";
import { FaStar, FaDownload, FaUsers, FaCodeBranch, FaGithub } from "react-icons/fa";

import { EXTERNAL_LINKS } from "../../config/constants";
import { useGitHubStats } from "../../hooks/useGitHubStats";
import { useNpmStats } from "../../hooks/useNpmStats";

/**
 * Community section component displaying GitHub and NPM statistics.
 * Shows real-time community metrics and engagement data.
 */
export function CommunitySection() {
  const githubStats = useGitHubStats();
  const { stats: npmStats } = useNpmStats();

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
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

          <motion.div whileHover={{ scale: 1.05 }} className="relative">
            <div className="relative border-6 border-comic-black rounded-2xl p-6 text-center bg-comic-blue h-full">
              <FaUsers className="text-5xl mx-auto mb-3 text-comic-white" />
              <div className="action-text text-4xl mb-2 text-comic-white">
                {githubStats.loading ? "..." : githubStats.contributors}
              </div>
              <div className="font-display text-xl text-comic-white">CONTRIBUTORS</div>
            </div>
          </motion.div>

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

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 mb-12"
        >
          <div className="grid md:grid-cols-2 gap-8">
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
            href={EXTERNAL_LINKS.GITHUB}
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
  );
}

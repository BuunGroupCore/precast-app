import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { FaGithub, FaHeart, FaCodeBranch, FaExclamationCircle, FaEye } from "react-icons/fa";

interface GitHubRepoData {
  stargazers_count: number;
  forks_count: number;
  watchers_count: number;
  open_issues_count: number;
}

export function GitHubStars() {
  const [stars, setStars] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [showTooltip, setShowTooltip] = useState(false);
  const [repoData, setRepoData] = useState<GitHubRepoData | null>(null);

  useEffect(() => {
    fetch("https://api.github.com/repos/BuunGroupCore/precast-app")
      .then((res) => res.json())
      .then((data) => {
        setStars(data.stargazers_count);
        setRepoData(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  const formatStars = (count: number) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  return (
    <div className="relative">
      <motion.a
        href="https://github.com/BuunGroupCore/precast-app"
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className="flex items-center gap-2 bg-comic-white border-2 border-comic-black rounded-full px-3 py-1 hover:bg-comic-yellow transition-all relative z-10"
        style={{ boxShadow: "2px 2px 0 var(--comic-black)" }}
      >
        <FaGithub size={20} />
        <div className="flex items-center gap-1">
          <FaHeart className="text-comic-red text-sm animate-pulse" />
          <span className="font-comic font-bold text-sm">
            {loading ? "..." : stars ? formatStars(stars) : "Star"}
          </span>
        </div>
      </motion.a>

      <AnimatePresence>
        {showTooltip && repoData && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full mt-2 right-0 z-50"
          >
            <div
              className="relative border-4 border-comic-black rounded-xl p-4 bg-comic-white min-w-[200px]"
              style={{
                boxShadow: "6px 6px 0 var(--comic-black)",
                background: `
                  var(--comic-white) 
                  repeating-linear-gradient(
                    45deg,
                    transparent,
                    transparent 10px,
                    rgba(0,0,0,0.03) 10px,
                    rgba(0,0,0,0.03) 20px
                  )
                `,
              }}
            >
              {/* Action text */}
              <div className="absolute -top-3 -left-3 action-text text-sm text-comic-red bg-comic-yellow px-2 py-1 rounded-full border-2 border-comic-black">
                STATS!
              </div>

              {/* Stats content */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <FaHeart className="text-comic-red" />
                  <span className="font-comic font-bold">{repoData.stargazers_count}</span>
                  <span className="font-comic text-sm">Stars</span>
                </div>

                <div className="flex items-center gap-2">
                  <FaCodeBranch className="text-comic-green" />
                  <span className="font-comic font-bold">{repoData.forks_count}</span>
                  <span className="font-comic text-sm">Forks</span>
                </div>

                <div className="flex items-center gap-2">
                  <FaEye className="text-comic-blue" />
                  <span className="font-comic font-bold">{repoData.watchers_count}</span>
                  <span className="font-comic text-sm">Watchers</span>
                </div>

                <div className="flex items-center gap-2">
                  <FaExclamationCircle className="text-comic-purple" />
                  <span className="font-comic font-bold">{repoData.open_issues_count}</span>
                  <span className="font-comic text-sm">Issues</span>
                </div>
              </div>

              {/* Comic effect dots */}
              <div className="absolute bottom-1 right-1 w-2 h-2 rounded-full bg-comic-black opacity-10"></div>
              <div className="absolute top-1 left-1 w-1 h-1 rounded-full bg-comic-black opacity-10"></div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

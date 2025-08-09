import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { FaGithub, FaHeart, FaCodeBranch, FaExclamationCircle, FaEye } from "react-icons/fa";

import { usePrecastAPI, formatNumber } from "@/hooks/usePrecastAPI";
import { trackOutboundLink } from "@/utils/analytics";

/**
 * GitHub stars component that displays repository statistics from the Precast API worker.
 * Shows stars count with a tooltip displaying forks, watchers, and open issues.
 */
export function GitHubStars() {
  const { metrics, loading, error } = usePrecastAPI();
  const [showTooltip, setShowTooltip] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

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
        onClick={() => {
          trackOutboundLink("https://github.com/BuunGroupCore/precast-app", "github");
        }}
        className="flex items-center gap-2 bg-comic-white border-2 border-comic-black rounded-full px-3 py-1 hover:bg-comic-yellow transition-all relative z-10"
        style={{ boxShadow: "2px 2px 0 var(--comic-black)" }}
      >
        <FaGithub size={20} />
        <div className="flex items-center gap-1">
          <FaHeart className="text-comic-red text-sm animate-pulse" />
          <span className="font-comic font-bold text-sm">
            {loading ? "..." : metrics ? formatNumber(metrics.stars) : error ? "Error" : "Star"}
          </span>
        </div>
      </motion.a>

      <AnimatePresence>
        {showTooltip && metrics && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            className={`absolute top-full mt-2 z-50 ${isMobile ? "right-0" : "right-0"}`}
          >
            <div
              className={`relative border-4 border-comic-black rounded-xl p-4 bg-comic-white ${isMobile ? "min-w-[150px]" : "min-w-[200px]"}`}
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
              <div className="absolute -top-3 -left-3 action-text text-sm text-comic-red bg-comic-yellow px-2 py-1 rounded-full border-2 border-comic-black">
                STATS!
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <FaHeart className="text-comic-red" />
                  <span className="font-comic font-bold">{metrics.stars}</span>
                  <span className="font-comic text-sm">Stars</span>
                </div>

                <div className="flex items-center gap-2">
                  <FaCodeBranch className="text-comic-green" />
                  <span className="font-comic font-bold">{metrics.forks}</span>
                  <span className="font-comic text-sm">Forks</span>
                </div>

                <div className="flex items-center gap-2">
                  <FaEye className="text-comic-blue" />
                  <span className="font-comic font-bold">{metrics.watchers}</span>
                  <span className="font-comic text-sm">Watchers</span>
                </div>

                <div className="flex items-center gap-2">
                  <FaExclamationCircle className="text-comic-purple" />
                  <span className="font-comic font-bold">{metrics.openIssues}</span>
                  <span className="font-comic text-sm">Open Issues</span>
                </div>
              </div>

              <div className="absolute bottom-1 right-1 w-2 h-2 rounded-full bg-comic-black opacity-10"></div>
              <div className="absolute top-1 left-1 w-1 h-1 rounded-full bg-comic-black opacity-10"></div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { FaDownload, FaTag, FaClock, FaChartLine } from "react-icons/fa";
import { SiNpm } from "react-icons/si";

interface NpmPackageData {
  "dist-tags": {
    latest: string;
  };
  time: {
    [version: string]: string;
  };
  versions?: {
    [version: string]: {
      dist?: {
        unpackedSize?: number;
      };
    };
  };
}

interface NpmDownloadData {
  downloads: number;
  start: string;
  end: string;
  package: string;
}

/**
 * NPM statistics component displaying package download stats and version information.
 * Fetches data from NPM registry and shows weekly downloads with detailed tooltip.
 */
export function NpmStats() {
  const [loading, setLoading] = useState(true);
  const [showTooltip, setShowTooltip] = useState(false);
  const [npmData, setNpmData] = useState<NpmPackageData | null>(null);
  const [downloads, setDownloads] = useState<NpmDownloadData | null>(null);

  useEffect(() => {
    Promise.all([
      fetch("https://registry.npmjs.org/create-precast-app").then((res) => {
        if (!res.ok) throw new Error("Package not found");
        return res.json();
      }),
      fetch("https://api.npmjs.org/downloads/point/last-week/create-precast-app")
        .then((res) => {
          if (!res.ok) {
            return null;
          }
          return res.json();
        })
        .catch(() => null),
    ])
      .then(([packageData, downloadData]) => {
        setNpmData(packageData);
        setDownloads(downloadData);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching NPM data:", error);
        setLoading(false);
      });
  }, []);

  const formatDownloads = (count: number | undefined) => {
    if (!count || count === undefined) return "0";
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    }
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  const getLatestVersion = () => {
    if (!npmData) return null;
    return npmData["dist-tags"]?.latest || null;
  };

  const getLastPublished = () => {
    if (!npmData || !npmData.time) return null;
    const version = getLatestVersion();
    if (!version) return null;
    const publishTime = npmData.time[version];
    if (!publishTime) return null;

    const date = new Date(publishTime);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  return (
    <div className="relative">
      <motion.a
        href="https://www.npmjs.com/package/create-precast-app"
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className="flex items-center gap-2 bg-comic-white border-2 border-comic-black rounded-full px-3 py-1 hover:bg-comic-red hover:text-comic-white transition-all relative z-10"
        style={{ boxShadow: "2px 2px 0 var(--comic-black)" }}
      >
        <SiNpm size={20} />
        <div className="flex items-center gap-1">
          <FaDownload className="text-sm" />
          <span className="font-comic font-bold text-sm">
            {loading ? "..." : downloads?.downloads ? formatDownloads(downloads.downloads) : "NPM"}
          </span>
        </div>
      </motion.a>

      <AnimatePresence>
        {showTooltip && npmData && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full mt-2 right-0 z-50"
          >
            <div
              className="relative border-4 border-comic-black rounded-xl p-4 bg-comic-white min-w-[250px]"
              style={{
                boxShadow: "6px 6px 0 var(--comic-black)",
                background: `
                  var(--comic-white) 
                  repeating-linear-gradient(
                    -45deg,
                    transparent,
                    transparent 10px,
                    rgba(231,76,60,0.03) 10px,
                    rgba(231,76,60,0.03) 20px
                  )
                `,
              }}
            >
              <div className="absolute -top-3 -left-3 action-text text-sm text-comic-white bg-comic-red px-2 py-1 rounded-full border-2 border-comic-black">
                NPM!
              </div>

              <div className="font-display text-lg mb-3 text-comic-black">create-precast-app</div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <FaTag className="text-comic-red" />
                  <span className="font-comic font-bold">v{getLatestVersion()}</span>
                  <span className="font-comic text-sm">Latest</span>
                </div>

                <div className="flex items-center gap-2">
                  <FaDownload className="text-comic-blue" />
                  <span className="font-comic font-bold">
                    {downloads?.downloads ? formatDownloads(downloads.downloads) : "..."}
                  </span>
                  <span className="font-comic text-sm">Weekly Downloads</span>
                </div>

                <div className="flex items-center gap-2">
                  <FaChartLine className="text-comic-green" />
                  <span className="font-comic font-bold">
                    {npmData?.versions ? Object.keys(npmData.versions).length : "..."}
                  </span>
                  <span className="font-comic text-sm">Versions</span>
                </div>

                <div className="flex items-center gap-2">
                  <FaClock className="text-comic-purple" />
                  <span className="font-comic font-bold">{getLastPublished() || "..."}</span>
                  <span className="font-comic text-sm">Published</span>
                </div>
              </div>

              <div className="absolute bottom-2 right-2">
                <div className="action-text text-xs text-comic-red opacity-50">INSTALL NOW!</div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

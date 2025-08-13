import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { FaCodeBranch, FaArrowUp, FaExclamationTriangle } from "react-icons/fa";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

import { usePrecastAnalytics } from "../../hooks/usePrecastAPI";

interface CLIVersionChartProps {}

// Helper function to compare semantic versions
function compareVersions(a: string, b: string): number {
  const aParts = a.split(".").map(Number);
  const bParts = b.split(".").map(Number);

  for (let i = 0; i < Math.max(aParts.length, bParts.length); i++) {
    const aVal = aParts[i] || 0;
    const bVal = bParts[i] || 0;

    if (aVal < bVal) return -1;
    if (aVal > bVal) return 1;
  }
  return 0;
}

interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    payload: {
      status: string;
    };
  }>;
  label?: string | number;
  latestVersion: string;
}

const CustomTooltip = ({ active, payload, label, latestVersion }: TooltipProps) => {
  if (active && payload && payload.length) {
    const isLatest = label === latestVersion;
    const isOutdated = compareVersions(String(label || ""), latestVersion) < 0;

    return (
      <div className="comic-panel bg-comic-black text-comic-white p-3 border-2 border-comic-yellow">
        <div className="flex items-center gap-2 mb-1">
          <FaCodeBranch className="text-comic-yellow" />
          <p className="action-text text-comic-yellow">v{label}</p>
        </div>
        <p className="font-comic text-comic-white">
          Users: <span className="action-text">{payload[0]?.value || 0}</span>
        </p>
        {isLatest && (
          <p className="font-comic text-comic-green text-sm flex items-center gap-1">
            <FaArrowUp /> Latest Version
          </p>
        )}
        {isOutdated && (
          <p className="font-comic text-comic-red text-sm flex items-center gap-1">
            <FaExclamationTriangle /> Outdated
          </p>
        )}
      </div>
    );
  }
  return null;
};

export function CLIVersionChart(_props: CLIVersionChartProps) {
  const { analytics, loading, error } = usePrecastAnalytics();
  const [latestVersion, setLatestVersion] = useState<string>("0.1.31");

  // Fetch latest version from npm
  useEffect(() => {
    const fetchLatestVersion = async () => {
      try {
        const response = await fetch("https://registry.npmjs.org/create-precast-app/latest");
        const data = await response.json();
        setLatestVersion(data.version);
      } catch (error) {
        console.error("Failed to fetch latest version:", error);
        // Keep default version if fetch fails
      }
    };

    fetchLatestVersion();
  }, []);

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.2 }}
        className="comic-panel p-6 mb-8 text-center"
      >
        <FaCodeBranch className="text-4xl mx-auto mb-4 text-comic-blue animate-pulse" />
        <h3 className="font-display text-2xl text-comic-blue">CLI VERSION DISTRIBUTION</h3>
        <div className="font-comic text-comic-black">Loading version data...</div>
      </motion.div>
    );
  }

  if (error || !analytics) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.2 }}
        className="comic-panel p-6 mb-8 text-center"
      >
        <FaCodeBranch className="text-4xl mx-auto mb-4 text-comic-red" />
        <h3 className="font-display text-2xl text-comic-red">CLI VERSION DISTRIBUTION</h3>
        <div className="font-comic text-comic-black">
          Error loading version data: {error?.message || "No data available"}
        </div>
      </motion.div>
    );
  }

  // Extract real CLI version data from analytics timeline (raw events with cli_version property)
  const versionCounts =
    analytics.events?.timeline?.reduce(
      (acc: Record<string, number>, event: Record<string, unknown>) => {
        const version = event.cli_version || event.cliVersion;
        if (version && version !== "unknown" && typeof version === "string") {
          acc[version] = (acc[version] || 0) + 1;
        }
        return acc;
      },
      {}
    ) || {};

  const totalUsers = Object.values(versionCounts).reduce(
    (sum, count) => sum + (count as number),
    0
  );

  const versionData = Object.entries(versionCounts)
    .map(([version, users]) => {
      const percentage = totalUsers > 0 ? Math.round(((users as number) / totalUsers) * 100) : 0;

      // Determine status based on version
      let status = "supported";
      if (version === latestVersion) status = "latest";
      else if (compareVersions(version, latestVersion) < 0) status = "outdated";

      return {
        version,
        users: users as number,
        percentage,
        status,
      };
    })
    .sort((a, b) => a.version.localeCompare(b.version));

  // Fallback if no data
  if (versionData.length === 0) {
    versionData.push({ version: "No data", users: 0, percentage: 0, status: "supported" });
  }

  const usersOnLatest = versionData.find((v) => v.version === latestVersion)?.users || 0;
  const adoptionRate = totalUsers > 0 ? Math.round((usersOnLatest / totalUsers) * 100) : 0;

  // Calculate users that need update (outdated versions only, not supported ones)
  const usersNeedingUpdate = versionData
    .filter((v) => v.status === "outdated")
    .reduce((sum, v) => sum + v.users, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 2.5 }}
      className="comic-panel p-6 mb-8"
    >
      <h3 className="font-display text-lg sm:text-xl md:text-2xl mb-4 text-comic-green flex items-center gap-2">
        <FaCodeBranch className="text-base sm:text-lg md:text-xl" />
        <span>CLI VERSION DISTRIBUTION</span>
      </h3>

      {/* Version Stats - Mobile Responsive */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4 mb-6">
        <div className="comic-panel p-2 sm:p-3 bg-comic-green bg-opacity-10 text-center">
          <div className="action-text text-sm sm:text-lg md:text-2xl text-comic-green break-all">
            v{latestVersion}
          </div>
          <div className="font-comic text-[10px] sm:text-xs md:text-sm text-comic-black">
            Latest<span className="hidden sm:inline"> Version</span>
          </div>
        </div>
        <div className="comic-panel p-2 sm:p-3 bg-comic-blue bg-opacity-10 text-center">
          <div className="action-text text-base sm:text-xl md:text-2xl text-comic-blue">
            {adoptionRate}%
          </div>
          <div className="font-comic text-[10px] sm:text-xs md:text-sm text-comic-black">
            On Latest
          </div>
        </div>
        <div className="comic-panel p-2 sm:p-3 bg-comic-purple bg-opacity-10 text-center">
          <div className="action-text text-base sm:text-xl md:text-2xl text-comic-purple">
            {versionData.length}
          </div>
          <div className="font-comic text-[10px] sm:text-xs md:text-sm text-comic-black">
            Active<span className="hidden sm:inline"> Versions</span>
          </div>
        </div>
        <div className="comic-panel p-2 sm:p-3 bg-comic-yellow bg-opacity-10 text-center">
          <div className="action-text text-base sm:text-xl md:text-2xl text-comic-red">
            {usersNeedingUpdate}
          </div>
          <div className="font-comic text-[10px] sm:text-xs md:text-sm text-comic-black">
            Need Update
          </div>
        </div>
      </div>

      {/* Bar Chart */}
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={versionData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#000" opacity={0.1} />
          <XAxis
            dataKey="version"
            tick={{ fontSize: 12, fontFamily: "Comic Sans MS, cursive", fill: "#374151" }}
          />
          <YAxis tick={{ fontSize: 12, fontFamily: "Comic Sans MS, cursive", fill: "#374151" }} />
          <Tooltip
            content={(props) => (
              <CustomTooltip {...props} latestVersion={latestVersion} label={props.label} />
            )}
          />
          <Bar dataKey="users" radius={[4, 4, 0, 0]} stroke="#000" strokeWidth={1}>
            {versionData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={
                  entry.status === "latest"
                    ? "#10B981" // Brighter green for latest
                    : entry.status === "supported"
                      ? "#3B82F6" // Brighter blue for supported
                      : "#EF4444" // Brighter red for outdated
                }
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Version List */}
      <div className="mt-6 space-y-2">
        {versionData
          .slice()
          .reverse()
          .map((version) => (
            <motion.div
              key={version.version}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`flex flex-col sm:flex-row items-start sm:items-center justify-between p-2 sm:p-3 rounded-lg gap-2 sm:gap-0 ${
                version.status === "latest"
                  ? "bg-comic-green bg-opacity-10"
                  : version.status === "supported"
                    ? "bg-comic-blue bg-opacity-10"
                    : "bg-comic-red bg-opacity-10"
              }`}
            >
              <div className="flex items-center gap-1 sm:gap-3 flex-wrap">
                <FaCodeBranch
                  className={`text-sm sm:text-lg flex-shrink-0 ${
                    version.status === "latest"
                      ? "text-green-600"
                      : version.status === "supported"
                        ? "text-blue-600"
                        : "text-red-600"
                  }`}
                />
                <span
                  className={`font-comic font-bold text-xs sm:text-sm ${
                    version.status === "latest"
                      ? "text-green-600"
                      : version.status === "supported"
                        ? "text-blue-600"
                        : "text-red-600"
                  }`}
                >
                  v{version.version}
                </span>
                {version.status === "latest" && (
                  <span className="comic-panel px-1 sm:px-2 py-0.5 sm:py-1 bg-comic-green text-comic-white text-[10px] sm:text-xs font-comic">
                    LATEST
                  </span>
                )}
                {version.status === "outdated" && (
                  <span className="comic-panel px-1 sm:px-2 py-0.5 sm:py-1 bg-comic-red text-comic-white text-[10px] sm:text-xs font-comic">
                    OUTDATED
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto">
                <div className="text-right flex-shrink-0">
                  <div
                    className={`action-text text-sm sm:text-lg ${
                      version.status === "latest"
                        ? "text-green-600"
                        : version.status === "supported"
                          ? "text-blue-600"
                          : "text-red-600"
                    }`}
                  >
                    {version.users}
                  </div>
                  <div className="font-comic text-[10px] sm:text-xs text-gray-700">users</div>
                </div>
                <div className="w-16 sm:w-24 bg-comic-black bg-opacity-10 rounded-full h-3 sm:h-4 overflow-hidden flex-shrink-0">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${version.percentage}%` }}
                    transition={{ delay: 2.6, duration: 0.5 }}
                    className={`h-full ${
                      version.status === "latest"
                        ? "bg-green-500"
                        : version.status === "supported"
                          ? "bg-blue-500"
                          : "bg-red-500"
                    }`}
                  />
                </div>
                <span
                  className={`font-comic text-[10px] sm:text-sm w-8 sm:w-10 text-right flex-shrink-0 ${
                    version.status === "latest"
                      ? "text-green-600"
                      : version.status === "supported"
                        ? "text-blue-600"
                        : "text-red-600"
                  }`}
                >
                  {version.percentage}%
                </span>
              </div>
            </motion.div>
          ))}
      </div>
    </motion.div>
  );
}

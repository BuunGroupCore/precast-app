import { useState, useEffect, useCallback } from "react";
import { FaBug, FaLightbulb, FaTag, FaQuestionCircle, FaStar, FaComments } from "react-icons/fa";

import {
  MetricsHeader,
  NpmDownloadsSection,
  GitHubActivitySection,
  GitHubStatsSection,
  IssueBreakdownSection,
  CliUsageSection,
  PerformanceMetricsSection,
} from "@/components/metrics";
import { useCliAnalytics } from "@/hooks";
import { usePrecastAPI, usePrecastAnalytics } from "@/hooks/usePrecastAPI";

interface IssueBreakdown {
  label: string;
  name: string;
  open: number;
  closed: number;
  total: number;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

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
  issueBreakdown?: IssueBreakdown[];
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

interface NpmRangeDownload {
  day: string;
  downloads: number;
}

interface CacheData {
  timestamp: number;
  npmStats?: NpmStats;
  downloadHistory?: DownloadData[];
}

/** Cache configuration for API data */
const CACHE_KEY = "precast-metrics-cache";
/** Cache duration in milliseconds (30 minutes - matches worker update schedule) */
const CACHE_DURATION = 30 * 60 * 1000;

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

/**
 * Metrics page displaying comprehensive GitHub and npm statistics.
 * Shows real-time data with charts and visualizations for project analytics.
 */
export function MetricsPage() {
  const [npmStats, setNpmStats] = useState<NpmStats | undefined>(undefined);
  const [downloadHistory, setDownloadHistory] = useState<DownloadData[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshTime, setRefreshTime] = useState(new Date());

  // Helper functions to map issue labels to icons and colors
  const getIconForLabel = (label: string) => {
    switch (label) {
      case "bug":
        return FaBug;
      case "enhancement":
        return FaLightbulb;
      case "showcase":
        return FaStar;
      case "testimonial-approved":
        return FaComments;
      case "documentation":
        return FaQuestionCircle;
      case "help wanted":
        return FaTag;
      default:
        return FaTag;
    }
  };

  const getColorForLabel = (label: string) => {
    switch (label) {
      case "bug":
        return "text-comic-red";
      case "enhancement":
        return "text-comic-yellow";
      case "showcase":
        return "text-comic-purple";
      case "testimonial-approved":
        return "text-comic-green";
      case "documentation":
        return "text-comic-blue";
      case "help wanted":
        return "text-comic-orange";
      default:
        return "text-comic-black";
    }
  };

  // Use Precast API for GitHub data and CLI analytics hook
  const {
    metrics: githubMetrics,
    issueBreakdown: precastIssueBreakdown,
    commitActivity: precastCommitActivity,
    loading: precastLoading,
  } = usePrecastAPI();
  const { analytics: cliAnalytics } = useCliAnalytics();

  // Use PostHog analytics hook
  const {
    analytics: postHogAnalytics,
    loading: analyticsLoading,
    error: analyticsError,
    refetch: refetchAnalytics,
  } = usePrecastAnalytics();

  // Transform Precast API data to match existing interfaces
  const githubStats: GitHubStats | undefined = githubMetrics
    ? {
        stars: githubMetrics.stars,
        forks: githubMetrics.forks,
        watchers: githubMetrics.watchers,
        openIssues: githubMetrics.openIssues,
        closedIssues: githubMetrics.closedIssues,
        contributors: githubMetrics.contributors,
        commits: githubMetrics.commits,
        releases: 0, // Not available in Precast API yet
        lastCommit: githubMetrics.pushed_at || githubMetrics.updated_at || new Date().toISOString(),
        createdAt:
          githubMetrics.created_at ||
          new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString(),
        size: githubMetrics.size || 2048,
        language: githubMetrics.language,
        license: githubMetrics.license,
        issueBreakdown: precastIssueBreakdown.map((issue) => ({
          label: issue.label,
          name: issue.name,
          open: issue.open,
          closed: issue.closed,
          total: issue.total,
          icon: getIconForLabel(issue.label),
          color: getColorForLabel(issue.label),
        })),
      }
    : undefined;

  const commitHistory: CommitData[] = precastCommitActivity.map((activity) => ({
    week: activity.week,
    commits: activity.commits,
  }));

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
    /** Check cache first for npm data only - GitHub data comes from usePrecastAPI */
    if (!forceRefresh) {
      const cached = getCache();
      if (cached) {
        if (cached.npmStats) setNpmStats(cached.npmStats);
        if (cached.downloadHistory) setDownloadHistory(cached.downloadHistory);
        setRefreshTime(new Date(cached.timestamp));
        setLoading(false);
        return;
      }
    }

    setLoading(true);

    try {
      await fetchNpmData();
    } catch (error) {
      console.error("Error fetching npm data:", error);
    }

    setRefreshTime(new Date());
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchAllData();
    /** Force refresh every 30 minutes to match worker update schedule */
    const interval = setInterval(() => fetchAllData(true), 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchAllData]);

  useEffect(() => {
    if (npmStats || downloadHistory.length > 0) {
      setCache({
        npmStats,
        downloadHistory,
      });
    }
  }, [npmStats, downloadHistory]);

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

  // Combine loading states
  const combinedLoading = loading || precastLoading;

  // PostHog analytics components will handle their own loading/error states inline

  return (
    <div className="min-h-screen py-20">
      <MetricsHeader loading={combinedLoading} refreshTime={refreshTime} />

      {/* Existing GitHub/NPM Metrics */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Repository Metrics
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            GitHub activity, NPM downloads, and community engagement metrics.
          </p>
        </div>

        <NpmDownloadsSection
          npmStats={npmStats}
          downloadHistory={downloadHistory}
          loading={loading}
          formatNumber={formatNumber}
        />

        <GitHubActivitySection commitHistory={commitHistory} loading={precastLoading} />

        <GitHubStatsSection
          githubStats={githubStats}
          formatDate={formatDate}
          calculateProjectAge={calculateProjectAge}
        />

        <IssueBreakdownSection
          issueBreakdown={githubStats?.issueBreakdown}
          loading={precastLoading}
        />

        <CliUsageSection
          cliAnalytics={cliAnalytics}
          formatNumber={formatNumber}
          postHogAnalytics={postHogAnalytics}
          analyticsLoading={analyticsLoading}
          analyticsError={analyticsError}
          refetchAnalytics={refetchAnalytics}
        />

        <PerformanceMetricsSection
          githubStats={githubStats}
          npmStats={npmStats}
          formatNumber={formatNumber}
        />
      </div>
    </div>
  );
}

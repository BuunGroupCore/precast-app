import { useState, useEffect } from "react";

export interface PrecastMetrics {
  stars: number;
  forks: number;
  watchers: number;
  openIssues: number;
  closedIssues: number;
  contributors: number;
  commits: number;
  language: string;
  license: string;
}

export interface IssueBreakdown {
  label: string;
  name: string;
  icon: string;
  color: string;
  open: number;
  closed: number;
  total: number;
}

export interface CommitActivity {
  week: string;
  commits: number;
}

export interface PrecastAPIResponse {
  timestamp: string;
  repository: PrecastMetrics;
  issues: {
    breakdown: IssueBreakdown[];
    totalOpen: number;
    totalClosed: number;
  };
  commits: {
    total: number;
    recentActivity: CommitActivity[];
  };
}

interface UsePrecastAPIResult {
  metrics: PrecastMetrics | null;
  issueBreakdown: IssueBreakdown[];
  commitActivity: CommitActivity[];
  totalIssues: { open: number; closed: number };
  loading: boolean;
  error: Error | null;
  lastUpdated: string | null;
  refetch: () => void;
}

const PRECAST_API_URL = "https://api.precast.dev/data";
const CACHE_KEY = "precast_metrics_cache";
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes - matches worker update schedule

/**
 * Custom hook to fetch metrics from the Precast API worker
 * This is NOT GitHub API - it's your dedicated worker endpoint
 */
export function usePrecastAPI(): UsePrecastAPIResult {
  const [metrics, setMetrics] = useState<PrecastMetrics | null>(null);
  const [issueBreakdown, setIssueBreakdown] = useState<IssueBreakdown[]>([]);
  const [commitActivity, setCommitActivity] = useState<CommitActivity[]>([]);
  const [totalIssues, setTotalIssues] = useState({ open: 0, closed: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  const fetchMetrics = async () => {
    try {
      setLoading(true);
      setError(null);

      // Check cache first
      const cachedData = localStorage.getItem(CACHE_KEY);
      if (cachedData) {
        try {
          const parsed = JSON.parse(cachedData);
          const cacheAge = Date.now() - parsed.cachedAt;

          if (cacheAge < CACHE_DURATION) {
            // Use cached data
            const data: PrecastAPIResponse = parsed.data;
            setMetrics(data.repository);
            setIssueBreakdown(data.issues.breakdown);
            setCommitActivity(data.commits.recentActivity);
            setTotalIssues({
              open: data.issues.totalOpen,
              closed: data.issues.totalClosed,
            });
            setLastUpdated(data.timestamp);
            setLoading(false);
            return;
          }
        } catch (cacheError) {
          console.warn("Failed to parse cached data:", cacheError);
          localStorage.removeItem(CACHE_KEY);
        }
      }

      // Fetch fresh data from Precast API worker
      const response = await fetch(PRECAST_API_URL);

      if (!response.ok) {
        throw new Error(`Precast API error: ${response.status} ${response.statusText}`);
      }

      const data: PrecastAPIResponse = await response.json();

      // Update state with fresh data
      setMetrics(data.repository);
      setIssueBreakdown(data.issues.breakdown);
      setCommitActivity(data.commits.recentActivity);
      setTotalIssues({
        open: data.issues.totalOpen,
        closed: data.issues.totalClosed,
      });
      setLastUpdated(data.timestamp);

      // Cache the fresh data
      localStorage.setItem(
        CACHE_KEY,
        JSON.stringify({
          data,
          cachedAt: Date.now(),
        })
      );

      setLoading(false);
    } catch (err) {
      console.error("Error fetching Precast API data:", err);
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch Precast API data";
      setError(new Error(errorMessage));

      // Try to use expired cached data as fallback
      const cachedData = localStorage.getItem(CACHE_KEY);
      if (cachedData) {
        try {
          const parsed = JSON.parse(cachedData);
          const data: PrecastAPIResponse = parsed.data;
          setMetrics(data.repository);
          setIssueBreakdown(data.issues.breakdown);
          setCommitActivity(data.commits.recentActivity);
          setTotalIssues({
            open: data.issues.totalOpen,
            closed: data.issues.totalClosed,
          });
          setLastUpdated(data.timestamp);
          console.info("Using cached data as fallback");
        } catch (cacheError) {
          console.warn("Failed to use cached fallback data:", cacheError);
        }
      }

      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  return {
    metrics,
    issueBreakdown,
    commitActivity,
    totalIssues,
    loading,
    error,
    lastUpdated,
    refetch: fetchMetrics,
  };
}

/**
 * Format numbers for display (stars, etc.)
 */
export function formatNumber(count: number): string {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`;
  }
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`;
  }
  return count.toString();
}

/**
 * Get time elapsed since last update
 */
export function getTimeElapsed(timestamp: string): string {
  const updated = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - updated.getTime();

  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${diffDays}d ago`;
}

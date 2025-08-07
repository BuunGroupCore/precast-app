import { useState, useEffect } from "react";

import { API_ENDPOINTS, CACHE_DURATIONS } from "@/config/constants";

interface GitHubStats {
  stars: number;
  forks: number;
  contributors: number;
  openIssues: number;
  loading: boolean;
  error: Error | null;
}

/**
 * Custom hook to fetch GitHub repository statistics.
 * Includes caching to prevent excessive API calls.
 */
export function useGitHubStats() {
  const [stats, setStats] = useState<GitHubStats>({
    stars: 0,
    forks: 0,
    contributors: 0,
    openIssues: 0,
    loading: true,
    error: null,
  });

  useEffect(() => {
    let mounted = true;
    const cacheKey = "github_stats";
    const cached = localStorage.getItem(cacheKey);

    if (cached) {
      const { data, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp < CACHE_DURATIONS.GITHUB_STATS) {
        setStats({ ...data, loading: false, error: null });
        return;
      }
    }

    const fetchStats = async () => {
      try {
        const [repoData, contributorsData] = await Promise.all([
          fetch(API_ENDPOINTS.GITHUB_REPO).then((res) => {
            if (!res.ok) throw new Error("Failed to fetch repo data");
            return res.json();
          }),
          fetch(API_ENDPOINTS.GITHUB_CONTRIBUTORS).then((res) => {
            if (!res.ok) throw new Error("Failed to fetch contributors");
            return res.json();
          }),
        ]);

        if (!mounted) return;

        const newStats = {
          stars: repoData.stargazers_count || 0,
          forks: repoData.forks_count || 0,
          contributors: Array.isArray(contributorsData) ? contributorsData.length : 0,
          openIssues: repoData.open_issues_count || 0,
        };

        localStorage.setItem(
          cacheKey,
          JSON.stringify({
            data: newStats,
            timestamp: Date.now(),
          })
        );

        setStats({
          ...newStats,
          loading: false,
          error: null,
        });
      } catch (error) {
        if (mounted) {
          setStats((prev) => ({
            ...prev,
            loading: false,
            error: error instanceof Error ? error : new Error("Unknown error"),
          }));
        }
      }
    };

    fetchStats();

    return () => {
      mounted = false;
    };
  }, []);

  return stats;
}

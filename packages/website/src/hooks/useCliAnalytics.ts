import { useState, useEffect } from "react";

import { DATA_URLS } from "@/config/constants";

interface CliAnalytics {
  updated: string;
  lastUpdatedFormatted: string;
  totals: {
    projects: number;
    users: number;
    totalEvents: number;
  };
  frameworks: Record<string, number>;
  backends: Record<string, number>;
  databases: Record<string, number>;
  styling: Record<string, number>;
  uiLibraries: Record<string, number>;
  features: Record<string, number>;
  popularStacks: Array<{
    framework: string;
    backend: string;
    database: string;
    styling: string;
    uiLibrary: string;
    count: number;
    users: number;
    percentage: string;
  }>;
  topCombinations: {
    reactStacks: Array<{
      framework: string;
      backend: string;
      database: string;
      styling: string;
      uiLibrary: string;
      count: number;
      users: number;
      percentage: string;
    }>;
    fullStack: Array<{
      framework: string;
      backend: string;
      database: string;
      styling: string;
      uiLibrary: string;
      count: number;
      users: number;
      percentage: string;
    }>;
    frontendOnly: Array<{
      framework: string;
      backend: string;
      database: string;
      styling: string;
      uiLibrary: string;
      count: number;
      users: number;
      percentage: string;
    }>;
  };
  loading: boolean;
  error: Error | null;
}

const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

/**
 * Custom hook to fetch CLI analytics data from GitHub repository.
 * Data is updated every 6 hours via GitHub Actions.
 */
export function useCliAnalytics() {
  const [analytics, setAnalytics] = useState<CliAnalytics>({
    updated: new Date().toISOString(),
    lastUpdatedFormatted: "No data available yet",
    totals: { projects: 0, users: 0, totalEvents: 0 },
    frameworks: {},
    backends: {},
    databases: {},
    styling: {},
    uiLibraries: {},
    features: {},
    popularStacks: [],
    topCombinations: { reactStacks: [], fullStack: [], frontendOnly: [] },
    loading: true,
    error: null,
  });

  useEffect(() => {
    let mounted = true;
    const cacheKey = "cli_analytics";
    const cached = localStorage.getItem(cacheKey);

    // Check cache first
    if (cached) {
      try {
        const { data, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < CACHE_DURATION) {
          setAnalytics({ ...data, loading: false, error: null });
          return;
        }
      } catch (error) {
        console.warn("Failed to parse cached CLI analytics:", error);
        localStorage.removeItem(cacheKey);
      }
    }

    const fetchAnalytics = async () => {
      try {
        const response = await fetch(DATA_URLS.ANALYTICS_JSON);

        if (!response.ok) {
          throw new Error(`Failed to fetch CLI analytics: ${response.status}`);
        }

        const data = await response.json();

        if (!mounted) return;

        const analyticsData: CliAnalytics = {
          ...data,
          loading: false,
          error: null,
        };

        // Cache the data
        localStorage.setItem(
          cacheKey,
          JSON.stringify({
            data: analyticsData,
            timestamp: Date.now(),
          })
        );

        setAnalytics(analyticsData);
      } catch (error) {
        if (mounted) {
          // Set empty state when no data is available
          const emptyState: CliAnalytics = {
            updated: new Date().toISOString(),
            lastUpdatedFormatted: "No data available yet",
            totals: { projects: 0, users: 0, totalEvents: 0 },
            frameworks: {},
            backends: {},
            databases: {},
            styling: {},
            uiLibraries: {},
            features: {},
            popularStacks: [],
            topCombinations: { reactStacks: [], fullStack: [], frontendOnly: [] },
            loading: false,
            error: error instanceof Error ? error : new Error("Failed to fetch CLI analytics"),
          };

          setAnalytics(emptyState);
        }
      }
    };

    fetchAnalytics();

    return () => {
      mounted = false;
    };
  }, []);

  return { analytics };
}

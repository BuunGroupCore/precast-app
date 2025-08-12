import { useState } from "react";

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

/**
 * Custom hook for CLI analytics - now using PostHog data instead of GitHub analytics file.
 * Kept for backwards compatibility but returns empty state.
 * Use usePrecastAnalytics hook for actual analytics data.
 */
export function useCliAnalytics() {
  // Return empty state - analytics now come from PostHog via usePrecastAnalytics
  const [analytics] = useState<CliAnalytics>({
    updated: new Date().toISOString(),
    lastUpdatedFormatted: "Using PostHog analytics",
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
    error: null,
  });

  return { analytics };
}

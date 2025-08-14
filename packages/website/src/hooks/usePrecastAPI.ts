import { useState, useEffect, useCallback } from "react";

// GitHub metrics types
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
const ANALYTICS_API_URL = "https://api.precast.dev/analytics";
const CACHE_KEY = "precast_metrics_cache";
const ANALYTICS_CACHE_KEY = "precast_analytics_cache";
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes - matches worker update schedule

// PostHog Analytics types
export interface AnalyticsMetrics {
  timestamp: string;
  project: {
    name: string;
    id: string;
  };
  usage: {
    totalEvents: number;
    uniqueUsers: number;
    eventsLast30Days: number;
    eventsLast7Days: number;
    activeUsersLast30Days: number;
    activeUsersLast7Days: number;
  };
  events: {
    breakdown: Array<{
      event: string;
      count: number;
      percentage: number;
    }>;
    topEvents: Array<{
      event: string;
      count: number;
      percentage: number;
    }>;
    timeline: Array<{
      date: string;
      count: number;
    }>;
  };
  frameworks: {
    breakdown: Record<string, number>;
    topFrameworks: Array<{
      name: string;
      count: number;
      percentage: number;
    }>;
  };
  features: {
    breakdown: Record<string, number>;
    topFeatures: Array<{
      name: string;
      count: number;
      percentage: number;
    }>;
  };
  stackCombinations?: Array<{
    framework: string;
    backend: string;
    database: string;
    orm: string;
    styling: string;
    frequency: number;
    successRate: number;
    avgSetupTime: number;
  }>;
  developerExperience?: {
    typeScriptAdoption: number;
    dockerUsage: number;
    gitInitRate: number;
    eslintEnabled: number;
    prettierEnabled: number;
    testingSetup: number;
    cicdConfigured: number;
  };
  performance?: {
    avgProjectSetupTime: number;
    avgDependencyInstallTime: Record<string, number>;
    successRates: {
      overall: number;
      byFramework: Record<string, number>;
      byPackageManager: Record<string, number>;
    };
  };
  userJourney?: {
    entryPoint: string;
    completionRate: number;
    avgTimeToCompletion: number;
    dropoffPoints: string[];
    retryAttempts: number;
    commonPaths: Array<{
      path: string[];
      frequency: number;
    }>;
  };
  aiAutomation?: {
    claudeIntegrationRate: number;
    mcpServerAdoption: Record<string, number>;
    aiAssistedProjects: number;
    automationFeatures: {
      docker: number;
      githubActions: number;
      cicd: number;
    };
  };
  errors?: {
    commonErrors: Array<{
      type: string;
      message: string;
      frequency: number;
      avgTimeToResolve: number;
      resolution: string;
    }>;
    fallbackUsage: {
      bunToNpm: number;
      templateRetries: number;
      manualInterventions: number;
    };
    recoveryRate: number;
  };
  plugins?: {
    popularPlugins: Array<{
      name: string;
      usage: number;
      successRate: number;
    }>;
    pluginCombinations: Array<{
      plugins: string[];
      frequency: number;
    }>;
    authProviderPreferences: Record<string, number>;
    paymentIntegrations: Record<string, number>;
  };
  quality?: {
    securityAuditPass: number;
    codeQualityTools: {
      eslint: number;
      prettier: number;
      husky: number;
      lintStaged: number;
    };
    testingFrameworks: Record<string, number>;
    documentationAdded: number;
  };
  templates?: {
    templateUsage?: Record<string, number>;
    avgGenerationTime?: Record<string, number>;
    templateSuccessRate?: Record<string, number>;
    totalTemplatesGenerated?: number;
  };
  userPreferences?: {
    packageManagerPreferences?: Record<string, number>;
    installModePreferences?: Record<string, number>;
    workflowTypes?: Record<string, number>;
    aiUsagePatterns?: Record<string, number>;
  };
  lastUpdated: string;
}

export interface UseAnalyticsResult {
  analytics: AnalyticsMetrics | null;
  loading: boolean;
  error: Error | null;
  lastUpdated: string | null;
  refetch: () => void;
}

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
 * Custom hook to fetch PostHog analytics data
 */
export function usePrecastAnalytics(): UseAnalyticsResult {
  const [analytics, setAnalytics] = useState<AnalyticsMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);

      // Check cache first
      const cachedData = localStorage.getItem(ANALYTICS_CACHE_KEY);
      if (cachedData) {
        try {
          const parsed = JSON.parse(cachedData);
          const cacheAge = Date.now() - parsed.cachedAt;

          if (cacheAge < CACHE_DURATION) {
            // Use cached data
            const data: AnalyticsMetrics = parsed.data;
            setAnalytics(data);
            setLastUpdated(data.lastUpdated);
            setLoading(false);
            return;
          }
        } catch (cacheError) {
          console.warn("Failed to parse analytics cached data:", cacheError);
          localStorage.removeItem(ANALYTICS_CACHE_KEY);
        }
      }

      // Fetch fresh data from PostHog analytics worker
      const response = await fetch(`${ANALYTICS_API_URL}/data`);

      if (!response.ok) {
        throw new Error(`Analytics API error: ${response.status} ${response.statusText}`);
      }

      const data: AnalyticsMetrics = await response.json();

      // Update state with fresh data
      setAnalytics(data);
      setLastUpdated(data.lastUpdated);

      // Cache the fresh data
      localStorage.setItem(
        ANALYTICS_CACHE_KEY,
        JSON.stringify({
          data,
          cachedAt: Date.now(),
        })
      );

      setLoading(false);
    } catch (err) {
      console.error("Error fetching analytics data:", err);
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch analytics data";
      setError(new Error(errorMessage));

      // Try to use expired cached data as fallback
      const cachedData = localStorage.getItem(ANALYTICS_CACHE_KEY);
      if (cachedData) {
        try {
          const parsed = JSON.parse(cachedData);
          const data: AnalyticsMetrics = parsed.data;
          setAnalytics(data);
          setLastUpdated(data.lastUpdated);
          console.info("Using cached analytics data as fallback");
        } catch (cacheError) {
          console.warn("Failed to use cached analytics fallback data:", cacheError);
        }
      }

      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  return {
    analytics,
    loading,
    error,
    lastUpdated,
    refetch: fetchAnalytics,
  };
}

/**
 * Custom hook to fetch specific endpoint data with caching
 */
function useAnalyticsEndpoint<T>(endpoint: string, cacheKey: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Check cache first
      const cachedData = localStorage.getItem(cacheKey);
      if (cachedData) {
        try {
          const parsed = JSON.parse(cachedData);
          const cacheAge = Date.now() - parsed.cachedAt;

          if (cacheAge < CACHE_DURATION) {
            setData(parsed.data);
            setLoading(false);
            return;
          }
        } catch {
          localStorage.removeItem(cacheKey);
        }
      }

      // Fetch fresh data
      const response = await fetch(`${ANALYTICS_API_URL}${endpoint}`);
      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }

      const responseData: T = await response.json();
      setData(responseData);

      // Cache the data
      localStorage.setItem(
        cacheKey,
        JSON.stringify({
          data: responseData,
          cachedAt: Date.now(),
        })
      );

      setLoading(false);
    } catch (err) {
      console.error(`Error fetching ${endpoint}:`, err);
      setError(err instanceof Error ? err : new Error(`Failed to fetch ${endpoint}`));
      setLoading(false);
    }
  }, [endpoint, cacheKey]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

/**
 * Hook to fetch user journey analytics
 */
export function useUserJourney() {
  return useAnalyticsEndpoint<{
    entryPoint?: string;
    completionRate?: number;
    avgTimeToCompletion?: number;
    retryAttempts?: number;
    commonPaths?: Array<{ path: string[]; frequency: number }>;
    dropoffPoints?: string[];
  }>("/journey", "user_journey_cache");
}

/**
 * Hook to fetch framework analytics
 */
export function useFrameworks() {
  return useAnalyticsEndpoint("/frameworks", "frameworks_cache");
}

/**
 * Hook to fetch feature analytics
 */
export function useFeatures() {
  return useAnalyticsEndpoint("/features", "features_cache");
}

/**
 * Hook to fetch stack combinations
 */
export function useStackCombinations() {
  return useAnalyticsEndpoint("/stacks", "stacks_cache");
}

/**
 * Hook to fetch developer experience metrics
 */
export function useDeveloperExperience() {
  return useAnalyticsEndpoint("/developer-experience", "dev_experience_cache");
}

/**
 * Hook to fetch performance metrics
 */
export function usePerformanceMetrics() {
  return useAnalyticsEndpoint("/performance", "performance_cache");
}

/**
 * Hook to fetch AI automation metrics
 */
export function useAIAutomation() {
  return useAnalyticsEndpoint("/ai-automation", "ai_automation_cache");
}

/**
 * Hook to fetch error metrics
 */
export function useErrorMetrics() {
  return useAnalyticsEndpoint("/errors", "errors_cache");
}

/**
 * Hook to fetch plugin metrics
 */
export function usePluginMetrics() {
  return useAnalyticsEndpoint("/plugins", "plugins_cache");
}

/**
 * Hook to fetch quality metrics
 */
export function useQualityMetrics() {
  return useAnalyticsEndpoint("/quality", "quality_cache");
}

/**
 * Hook to fetch template metrics
 */
export function useTemplateMetrics() {
  return useAnalyticsEndpoint<{
    templateUsage?: Record<string, number>;
    avgGenerationTime?: Record<string, number>;
    templateSuccessRate?: Record<string, number>;
    totalTemplatesGenerated?: number;
  }>("/templates", "templates_cache");
}

/**
 * Hook to fetch user preference metrics
 */
export function useUserPreferences() {
  return useAnalyticsEndpoint<{
    packageManagerPreferences?: Record<string, number>;
    installModePreferences?: Record<string, number>;
    workflowTypes?: Record<string, number>;
    aiUsagePatterns?: Record<string, number>;
  }>("/user-preferences", "user_preferences_cache");
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

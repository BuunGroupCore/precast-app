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
  created_at?: string;
  updated_at?: string;
  pushed_at?: string;
  size?: number;
  topics?: string[];
  default_branch?: string;
  visibility?: string;
  archived?: boolean;
  disabled?: boolean;
  has_issues?: boolean;
  has_projects?: boolean;
  has_wiki?: boolean;
  has_pages?: boolean;
  has_discussions?: boolean;
  subscribers_count?: number;
  network_count?: number;
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

// Analytics data types
interface AnalyticsData {
  templates?: unknown;
  userJourney?: unknown;
  userPreferences?: unknown;
  frameworks?: unknown;
  features?: unknown;
  stackCombinations?: unknown;
  developerExperience?: unknown;
  performance?: unknown;
  aiAutomation?: unknown;
  errors?: unknown;
  plugins?: unknown;
  quality?: unknown;
}

// Data deduplication to prevent multiple simultaneous API calls
const ongoingDataRequests = new Map<string, Promise<unknown>>();

async function dedupedFetchJson<T = unknown>(
  url: string,
  options?: Record<string, unknown>
): Promise<T> {
  const key = `${url}-${JSON.stringify(options)}`;

  if (ongoingDataRequests.has(key)) {
    return ongoingDataRequests.get(key)! as Promise<T>;
  }

  const request = fetch(url, options)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      return response.json();
    })
    .finally(() => {
      ongoingDataRequests.delete(key);
    });

  ongoingDataRequests.set(key, request);
  return request;
}

// Legacy fetch function for compatibility
function dedupedFetch(url: string, options?: Record<string, unknown>): Promise<Response> {
  return fetch(
    url,
    options as Record<string, unknown> & {
      method?: string;
      headers?: Record<string, string>;
      body?: string;
    }
  );
}

// PostHog Analytics types
export interface RawEvent {
  id: string;
  timestamp: string;
  event: string;
  properties: Record<string, unknown>;
}

export interface RawEventsAnalysis {
  totalEvents: number;
  last24Hours: {
    count: number;
    events: RawEvent[];
    eventTypes: Record<string, number>;
    uniqueUsers: number;
  };
  last7Days: {
    count: number;
    events: RawEvent[];
    eventTypes: Record<string, number>;
    uniqueUsers: number;
  };
  last30Days: {
    count: number;
    events: RawEvent[];
    eventTypes: Record<string, number>;
    uniqueUsers: number;
    dailyBreakdown: Array<{ date: string; count: number }>;
  };
  frameworks: Record<string, number>;
  getEventsInRange: (startDate: Date, endDate: Date) => RawEvent[];
}

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
  rawEvents?: RawEvent[];
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
  analyzeRawEvents: () => RawEventsAnalysis | null;
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

      // Fetch fresh data directly from R2 public URL (bypasses worker)
      let response = await dedupedFetch("https://github.precast.dev/metrics-data.json");

      // If R2 direct access fails, fallback to worker endpoint
      if (!response.ok) {
        console.warn("R2 direct access failed for GitHub metrics, falling back to worker endpoint");
        response = await dedupedFetch(PRECAST_API_URL);

        if (!response.ok) {
          throw new Error(`Precast API error: ${response.status} ${response.statusText}`);
        }
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

      // Clean up old localStorage items to prevent quota issues
      try {
        const keysToRemove: string[] = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith("analytics_") && key !== ANALYTICS_CACHE_KEY) {
            keysToRemove.push(key);
          }
        }
        keysToRemove.forEach((key) => localStorage.removeItem(key));
      } catch {
        // Ignore cleanup errors
      }

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

      // Fetch fresh data directly from R2 public URL (bypasses worker)
      let data: AnalyticsMetrics;
      try {
        data = await dedupedFetchJson("https://analytics.precast.dev/posthog-analytics.json");
      } catch {
        console.warn("R2 direct access failed, falling back to worker endpoint");
        data = await dedupedFetchJson(`${ANALYTICS_API_URL}/data`);
      }

      // Update state with fresh data
      setAnalytics(data);
      setLastUpdated(data.lastUpdated);

      // Cache the fresh data with error handling for quota exceeded
      try {
        // Clear old cache if quota is exceeded
        const cacheData = JSON.stringify({
          data,
          cachedAt: Date.now(),
        });

        // Only cache if data is reasonable size (< 2MB)
        if (cacheData.length < 2 * 1024 * 1024) {
          localStorage.setItem(ANALYTICS_CACHE_KEY, cacheData);
        }
      } catch (storageError) {
        // If quota exceeded, clear analytics cache and try again
        if (storageError instanceof DOMException && storageError.name === "QuotaExceededError") {
          console.warn("localStorage quota exceeded, clearing analytics cache");
          localStorage.removeItem(ANALYTICS_CACHE_KEY);
          // Try one more time with cleared cache
          try {
            const minimalData = JSON.stringify({
              data: {
                ...data,
                // Only keep essential data to reduce size
                events: {
                  ...data.events,
                  timeline: [], // Remove timeline data which can be large
                },
              },
              cachedAt: Date.now(),
            });
            localStorage.setItem(ANALYTICS_CACHE_KEY, minimalData);
          } catch {
            // If still failing, just skip caching
            console.warn("Unable to cache analytics data");
          }
        }
      }

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

  // Helper functions to analyze raw events
  const analyzeRawEvents = useCallback(() => {
    if (!analytics?.rawEvents) return null;

    const now = new Date();
    const events = analytics.rawEvents;

    // Filter events by time period
    const getEventsInPeriod = (days: number) => {
      const cutoffDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
      return events.filter((event) => {
        const eventDate = new Date(event.timestamp);
        return eventDate >= cutoffDate;
      });
    };

    // Get events for different periods
    const last7Days = getEventsInPeriod(7);
    const last30Days = getEventsInPeriod(30);
    const last24Hours = getEventsInPeriod(1);

    // Count events by type
    const countEventsByType = (eventList: RawEvent[]) => {
      const counts: Record<string, number> = {};
      eventList.forEach((event) => {
        const eventType = event.event || "unknown";
        counts[eventType] = (counts[eventType] || 0) + 1;
      });
      return counts;
    };

    // Get daily breakdown for last 6 months (180 days)
    const getDailyBreakdown = () => {
      const dailyData: Record<string, number> = {};
      const sixMonthsAgo = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000);

      // Initialize all days for 6 months
      for (let i = 0; i < 180; i++) {
        const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
        const dateKey = `${date.getMonth() + 1}/${date.getDate()}`;
        dailyData[dateKey] = 0;
      }

      // Count events per day from all available events
      events.forEach((event) => {
        const eventDate = new Date(event.timestamp);
        if (eventDate >= sixMonthsAgo) {
          const dateKey = `${eventDate.getMonth() + 1}/${eventDate.getDate()}`;
          if (dateKey in dailyData) {
            dailyData[dateKey]++;
          }
        }
      });

      // Return sorted by date
      return Object.entries(dailyData)
        .map(([date, count]) => ({ date, count }))
        .reverse(); // Reverse to show oldest first
    };

    // Get framework usage from events
    const getFrameworkUsage = () => {
      const frameworks: Record<string, number> = {};
      events.forEach((event) => {
        if (event.properties?.framework) {
          const framework = event.properties.framework as string;
          frameworks[framework] = (frameworks[framework] || 0) + 1;
        }
      });
      return frameworks;
    };

    // Get unique users/sessions
    const getUniqueUsers = (eventList: RawEvent[]) => {
      const uniqueSessions = new Set();
      eventList.forEach((event) => {
        if (event.properties?.sessionId) {
          uniqueSessions.add(event.properties.sessionId);
        }
      });
      return uniqueSessions.size;
    };

    return {
      totalEvents: events.length,
      last24Hours: {
        count: last24Hours.length,
        events: last24Hours,
        eventTypes: countEventsByType(last24Hours),
        uniqueUsers: getUniqueUsers(last24Hours),
      },
      last7Days: {
        count: last7Days.length,
        events: last7Days,
        eventTypes: countEventsByType(last7Days),
        uniqueUsers: getUniqueUsers(last7Days),
      },
      last30Days: {
        count: last30Days.length,
        events: last30Days,
        eventTypes: countEventsByType(last30Days),
        uniqueUsers: getUniqueUsers(last30Days),
        dailyBreakdown: getDailyBreakdown(),
      },
      frameworks: getFrameworkUsage(),

      // Custom time range function
      getEventsInRange: (startDate: Date, endDate: Date) => {
        return events.filter((event) => {
          const eventDate = new Date(event.timestamp);
          return eventDate >= startDate && eventDate <= endDate;
        });
      },
    };
  }, [analytics]);

  return {
    analytics,
    loading,
    error,
    lastUpdated,
    refetch: fetchAnalytics,
    analyzeRawEvents, // New function to analyze raw events
  };
}

/**
 * Optimized hook to fetch specific analytics data with R2 fallback
 * First tries R2 direct access, then falls back to worker endpoint
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

      let response: Response;
      let fetchSource = "worker";

      // Try R2 main analytics file first (all data is in posthog-analytics.json)
      try {
        const fullData = await dedupedFetchJson<AnalyticsData>(
          "https://analytics.precast.dev/posthog-analytics.json"
        );
        fetchSource = "r2";

        // Extract specific data based on endpoint
        let specificData;
        switch (endpoint) {
          case "/templates":
            specificData = fullData.templates;
            break;
          case "/journey":
            specificData = fullData.userJourney;
            break;
          case "/user-preferences":
            specificData = fullData.userPreferences;
            break;
          case "/frameworks":
            specificData = fullData.frameworks;
            break;
          case "/features":
            specificData = fullData.features;
            break;
          case "/stacks":
            specificData = fullData.stackCombinations;
            break;
          case "/developer-experience":
            specificData = fullData.developerExperience;
            break;
          case "/performance":
            specificData = fullData.performance;
            break;
          case "/ai-automation":
            specificData = fullData.aiAutomation;
            break;
          case "/errors":
            specificData = fullData.errors;
            break;
          case "/plugins":
            specificData = fullData.plugins;
            break;
          case "/quality":
            specificData = fullData.quality;
            break;
          default:
            specificData = fullData;
        }

        setData(specificData as T);
        setError(null);
        setLoading(false);

        // Cache the extracted data
        localStorage.setItem(
          cacheKey,
          JSON.stringify({
            data: specificData,
            cachedAt: Date.now(),
            source: "r2",
          })
        );
        return;
      } catch (r2Error) {
        console.warn(`R2 direct access failed, falling back to worker:`, r2Error);
        // Fallback to worker endpoint with timeout protection
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout

        try {
          response = await dedupedFetch(`${ANALYTICS_API_URL}${endpoint}`, {
            signal: controller.signal,
          });
          clearTimeout(timeoutId);

          if (!response.ok) {
            throw new Error(`Worker API error: ${response.status} ${response.statusText}`);
          }
        } catch (workerError) {
          clearTimeout(timeoutId);
          console.error(
            `Both R2 and worker endpoints failed. R2: ${r2Error}. Worker: ${workerError}`
          );
          setError(workerError instanceof Error ? workerError : new Error("Network error"));
          setLoading(false);
          return;
        }
      }

      const responseData: T = await response.json();
      setData(responseData);

      // Cache the data with source info
      try {
        localStorage.setItem(
          cacheKey,
          JSON.stringify({
            data: responseData,
            cachedAt: Date.now(),
            source: fetchSource,
          })
        );
      } catch {
        // If caching fails, still proceed
        console.warn(`Failed to cache data for ${cacheKey}`);
      }

      setLoading(false);
    } catch (err) {
      console.error(`Error fetching ${endpoint}:`, err);
      setError(err instanceof Error ? err : new Error(`Failed to fetch ${endpoint}`));

      // Try to use expired cached data as fallback
      const cachedData = localStorage.getItem(cacheKey);
      if (cachedData) {
        try {
          const parsed = JSON.parse(cachedData);
          setData(parsed.data);
          console.info(`Using expired cache as fallback for ${cacheKey}`);
        } catch {
          // If cache parsing fails, show placeholder data
          setData(null);
        }
      }

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

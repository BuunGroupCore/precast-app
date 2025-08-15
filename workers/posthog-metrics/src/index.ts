/**
 * @fileoverview Cloudflare Worker entry point for PostHog metrics collection
 * @module index
 */

import { CORS_HEADERS, RATE_LIMITS } from "./config/constants";
import { DataProcessorService } from "./services/data-processor.service";
import { PostHogAuthService } from "./services/posthog-auth.service";
import { PostHogClientService } from "./services/posthog-client.service";
import { R2StorageService } from "./services/r2-storage.service";
import type { WorkerEnv, PostHogMetricsData, PostHogEventResponse, PostHogPersonResponse } from "./types";

/**
 * Request handler interface
 * @interface RequestHandler
 */
interface RequestHandler {
  (env: WorkerEnv, headers: Record<string, string>): Promise<Response>;
}

/**
 * Cloudflare Worker export
 */
export default {
  /**
   * Handles incoming HTTP requests
   * @param {Request} request - Incoming request
   * @param {WorkerEnv} env - Worker environment bindings
   * @param {ExecutionContext} ctx - Worker execution context
   * @returns {Promise<Response>} HTTP response
   */
  async fetch(request: Request, env: WorkerEnv, _ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    const headers = { ...CORS_HEADERS };

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers });
    }

    // PostHog endpoints under /analytics path
    const handlers: Record<string, RequestHandler> = {
      "/analytics": handleAnalyticsRequest,
      "/analytics/data": handleAnalyticsDataRequest,
      "/analytics/refresh": handleAnalyticsRefreshRequest,
      "/analytics/status": handleAnalyticsStatusRequest,
      "/analytics/events": handleEventsRequest,
      "/analytics/frameworks": handleFrameworksRequest,
      "/analytics/features": handleFeaturesRequest,
      // Advanced metrics endpoints
      "/analytics/stacks": handleStacksRequest,
      "/analytics/developer-experience": handleDeveloperExperienceRequest,
      "/analytics/performance": handlePerformanceRequest,
      "/analytics/journey": handleJourneyRequest,
      "/analytics/ai-automation": handleAIAutomationRequest,
      "/analytics/errors": handleErrorsRequest,
      "/analytics/plugins": handlePluginsRequest,
      "/analytics/quality": handleQualityRequest,
      "/analytics/templates": handleTemplatesRequest,
      "/analytics/user-preferences": handleUserPreferencesRequest,
    };

    const handler = handlers[url.pathname];
    if (!handler) {
      return new Response("Not Found", { status: 404, headers });
    }

    try {
      return await handler(env, headers);
    } catch (error) {
      // Log error in production environments
      if (typeof error === "object" && error !== null && "message" in error) {
        // Error will be logged by Cloudflare Workers runtime
      }
      return new Response(JSON.stringify({ error: "Internal Server Error" }), {
        status: 500,
        headers: {
          ...headers,
          "Content-Type": "application/json",
        },
      });
    }
  },

  /**
   * Handles scheduled events (runs every 6 hours)
   * @param {ScheduledEvent} event - Scheduled event
   * @param {WorkerEnv} env - Worker environment bindings
   * @param {ExecutionContext} ctx - Worker execution context
   * @returns {Promise<void>}
   */
  async scheduled(_event: ScheduledEvent, env: WorkerEnv, ctx: ExecutionContext): Promise<void> {
    ctx.waitUntil(updateAnalytics(env));
  },
};

/**
 * Handles GET /analytics requests - returns summary
 * @param {WorkerEnv} env - Worker environment
 * @param {Record<string, string>} headers - Response headers
 * @returns {Promise<Response>} Analytics summary
 */
async function handleAnalyticsRequest(
  env: WorkerEnv,
  headers: Record<string, string>
): Promise<Response> {
  const storage = new R2StorageService(env);
  const metrics = await storage.getCachedData();

  if (!metrics) {
    return new Response("No analytics data available", {
      status: 404,
      headers,
    });
  }

  // Return summary data
  const summary = {
    project: metrics.project,
    usage: metrics.usage,
    lastUpdated: metrics.lastUpdated,
    timestamp: metrics.timestamp,
  };

  return new Response(JSON.stringify(summary), {
    status: 200,
    headers: {
      ...headers,
      "Content-Type": "application/json",
    },
  });
}

/**
 * Handles GET /analytics/data requests - returns full data
 * @param {WorkerEnv} env - Worker environment
 * @param {Record<string, string>} headers - Response headers
 * @returns {Promise<Response>} Full analytics data
 */
async function handleAnalyticsDataRequest(
  env: WorkerEnv,
  headers: Record<string, string>
): Promise<Response> {
  const storage = new R2StorageService(env);
  const metrics = await storage.getCachedData();

  if (!metrics) {
    return new Response("No analytics data available", {
      status: 404,
      headers,
    });
  }

  return new Response(JSON.stringify(metrics), {
    status: 200,
    headers: {
      ...headers,
      "Content-Type": "application/json",
    },
  });
}

/**
 * Handles GET /analytics/refresh requests with rate limiting
 * @param {WorkerEnv} env - Worker environment
 * @param {Record<string, string>} headers - Response headers
 * @returns {Promise<Response>} Updated analytics data
 */
async function handleAnalyticsRefreshRequest(
  env: WorkerEnv,
  headers: Record<string, string>
): Promise<Response> {
  const storage = new R2StorageService(env);

  // Check rate limit
  const isAllowed = await storage.isRefreshAllowed();
  if (!isAllowed) {
    const remainingTime = Math.ceil(RATE_LIMITS.REFRESH_INTERVAL / 1000);
    return new Response(
      JSON.stringify({
        error: "Rate limited",
        message: `Please wait ${remainingTime} seconds before refreshing again`,
      }),
      {
        status: 429,
        headers: {
          ...headers,
          "Content-Type": "application/json",
          "Retry-After": remainingTime.toString(),
        },
      }
    );
  }

  // Update metrics
  const metrics = await updateAnalytics(env);

  return new Response(JSON.stringify(metrics), {
    status: 200,
    headers: {
      ...headers,
      "Content-Type": "application/json",
    },
  });
}

/**
 * Handles GET /analytics/status requests
 * @param {WorkerEnv} env - Worker environment
 * @param {Record<string, string>} headers - Response headers
 * @returns {Promise<Response>} Worker status
 */
async function handleAnalyticsStatusRequest(
  env: WorkerEnv,
  headers: Record<string, string>
): Promise<Response> {
  const storage = new R2StorageService(env);
  const metrics = await storage.getCachedData();

  const status = {
    status: "ok",
    service: "posthog-analytics",
    hasData: !!metrics,
    lastUpdated: metrics?.lastUpdated || null,
    endpoints: [
      "/analytics",
      "/analytics/data",
      "/analytics/refresh",
      "/analytics/status",
      "/analytics/events",
      "/analytics/frameworks",
      "/analytics/features",
      "/analytics/stacks",
      "/analytics/developer-experience",
      "/analytics/performance",
      "/analytics/journey",
      "/analytics/ai-automation",
      "/analytics/errors",
      "/analytics/plugins",
      "/analytics/quality",
      "/analytics/templates",
      "/analytics/user-preferences",
    ],
  };

  return new Response(JSON.stringify(status), {
    status: 200,
    headers: {
      ...headers,
      "Content-Type": "application/json",
    },
  });
}

/**
 * Handles GET /analytics/events requests
 * @param {WorkerEnv} env - Worker environment
 * @param {Record<string, string>} headers - Response headers
 * @returns {Promise<Response>} Events data
 */
async function handleEventsRequest(
  env: WorkerEnv,
  headers: Record<string, string>
): Promise<Response> {
  const storage = new R2StorageService(env);
  const metrics = await storage.getCachedData();

  if (!metrics || !metrics.events) {
    return new Response("No events data available", {
      status: 404,
      headers,
    });
  }

  return new Response(JSON.stringify(metrics.events), {
    status: 200,
    headers: {
      ...headers,
      "Content-Type": "application/json",
    },
  });
}

/**
 * Handles GET /analytics/frameworks requests
 * @param {WorkerEnv} env - Worker environment
 * @param {Record<string, string>} headers - Response headers
 * @returns {Promise<Response>} Framework usage data
 */
async function handleFrameworksRequest(
  env: WorkerEnv,
  headers: Record<string, string>
): Promise<Response> {
  const storage = new R2StorageService(env);
  const metrics = await storage.getCachedData();

  if (!metrics || !metrics.frameworks) {
    return new Response("No frameworks data available", {
      status: 404,
      headers,
    });
  }

  return new Response(JSON.stringify(metrics.frameworks), {
    status: 200,
    headers: {
      ...headers,
      "Content-Type": "application/json",
    },
  });
}

/**
 * Handles GET /analytics/features requests
 * @param {WorkerEnv} env - Worker environment
 * @param {Record<string, string>} headers - Response headers
 * @returns {Promise<Response>} Feature usage data
 */
async function handleFeaturesRequest(
  env: WorkerEnv,
  headers: Record<string, string>
): Promise<Response> {
  const storage = new R2StorageService(env);
  const metrics = await storage.getCachedData();

  if (!metrics || !metrics.features) {
    return new Response("No features data available", {
      status: 404,
      headers,
    });
  }

  return new Response(JSON.stringify(metrics.features), {
    status: 200,
    headers: {
      ...headers,
      "Content-Type": "application/json",
    },
  });
}

/**
 * Handles GET /analytics/stacks requests
 * @param {WorkerEnv} env - Worker environment
 * @param {Record<string, string>} headers - Response headers
 * @returns {Promise<Response>} Stack combinations data
 */
async function handleStacksRequest(
  env: WorkerEnv,
  headers: Record<string, string>
): Promise<Response> {
  const storage = new R2StorageService(env);
  const metrics = await storage.getCachedData();

  if (!metrics || !metrics.stackCombinations) {
    return new Response("No stack combination data available", {
      status: 404,
      headers,
    });
  }

  return new Response(JSON.stringify(metrics.stackCombinations), {
    status: 200,
    headers: {
      ...headers,
      "Content-Type": "application/json",
    },
  });
}

/**
 * Handles GET /analytics/developer-experience requests
 * @param {WorkerEnv} env - Worker environment
 * @param {Record<string, string>} headers - Response headers
 * @returns {Promise<Response>} Developer experience metrics
 */
async function handleDeveloperExperienceRequest(
  env: WorkerEnv,
  headers: Record<string, string>
): Promise<Response> {
  const storage = new R2StorageService(env);
  const metrics = await storage.getCachedData();

  if (!metrics || !metrics.developerExperience) {
    return new Response("No developer experience data available", {
      status: 404,
      headers,
    });
  }

  return new Response(JSON.stringify(metrics.developerExperience), {
    status: 200,
    headers: {
      ...headers,
      "Content-Type": "application/json",
    },
  });
}

/**
 * Handles GET /analytics/performance requests
 * @param {WorkerEnv} env - Worker environment
 * @param {Record<string, string>} headers - Response headers
 * @returns {Promise<Response>} Performance metrics
 */
async function handlePerformanceRequest(
  env: WorkerEnv,
  headers: Record<string, string>
): Promise<Response> {
  const storage = new R2StorageService(env);
  const metrics = await storage.getCachedData();

  if (!metrics || !metrics.performance) {
    return new Response("No performance data available", {
      status: 404,
      headers,
    });
  }

  return new Response(JSON.stringify(metrics.performance), {
    status: 200,
    headers: {
      ...headers,
      "Content-Type": "application/json",
    },
  });
}

/**
 * Handles GET /analytics/journey requests
 * @param {WorkerEnv} env - Worker environment
 * @param {Record<string, string>} headers - Response headers
 * @returns {Promise<Response>} User journey analytics
 */
async function handleJourneyRequest(
  env: WorkerEnv,
  headers: Record<string, string>
): Promise<Response> {
  const storage = new R2StorageService(env);
  const metrics = await storage.getCachedData();

  if (!metrics || !metrics.userJourney) {
    return new Response("No user journey data available", {
      status: 404,
      headers,
    });
  }

  return new Response(JSON.stringify(metrics.userJourney), {
    status: 200,
    headers: {
      ...headers,
      "Content-Type": "application/json",
    },
  });
}

/**
 * Handles GET /analytics/ai-automation requests
 * @param {WorkerEnv} env - Worker environment
 * @param {Record<string, string>} headers - Response headers
 * @returns {Promise<Response>} AI and automation metrics
 */
async function handleAIAutomationRequest(
  env: WorkerEnv,
  headers: Record<string, string>
): Promise<Response> {
  const storage = new R2StorageService(env);
  const metrics = await storage.getCachedData();

  if (!metrics || !metrics.aiAutomation) {
    return new Response("No AI automation data available", {
      status: 404,
      headers,
    });
  }

  return new Response(JSON.stringify(metrics.aiAutomation), {
    status: 200,
    headers: {
      ...headers,
      "Content-Type": "application/json",
    },
  });
}

/**
 * Handles GET /analytics/errors requests
 * @param {WorkerEnv} env - Worker environment
 * @param {Record<string, string>} headers - Response headers
 * @returns {Promise<Response>} Error metrics
 */
async function handleErrorsRequest(
  env: WorkerEnv,
  headers: Record<string, string>
): Promise<Response> {
  const storage = new R2StorageService(env);
  const metrics = await storage.getCachedData();

  if (!metrics || !metrics.errors) {
    return new Response("No error data available", {
      status: 404,
      headers,
    });
  }

  return new Response(JSON.stringify(metrics.errors), {
    status: 200,
    headers: {
      ...headers,
      "Content-Type": "application/json",
    },
  });
}

/**
 * Handles GET /analytics/plugins requests
 * @param {WorkerEnv} env - Worker environment
 * @param {Record<string, string>} headers - Response headers
 * @returns {Promise<Response>} Plugin ecosystem metrics
 */
async function handlePluginsRequest(
  env: WorkerEnv,
  headers: Record<string, string>
): Promise<Response> {
  const storage = new R2StorageService(env);
  const metrics = await storage.getCachedData();

  if (!metrics || !metrics.plugins) {
    return new Response("No plugin data available", {
      status: 404,
      headers,
    });
  }

  return new Response(JSON.stringify(metrics.plugins), {
    status: 200,
    headers: {
      ...headers,
      "Content-Type": "application/json",
    },
  });
}

/**
 * Handles GET /analytics/quality requests
 * @param {WorkerEnv} env - Worker environment
 * @param {Record<string, string>} headers - Response headers
 * @returns {Promise<Response>} Quality metrics
 */
async function handleQualityRequest(
  env: WorkerEnv,
  headers: Record<string, string>
): Promise<Response> {
  const storage = new R2StorageService(env);
  const metrics = await storage.getCachedData();

  if (!metrics || !metrics.quality) {
    return new Response("No quality data available", {
      status: 404,
      headers,
    });
  }

  return new Response(JSON.stringify(metrics.quality), {
    status: 200,
    headers: {
      ...headers,
      "Content-Type": "application/json",
    },
  });
}

/**
 * Handles GET /analytics/templates requests
 * @param {WorkerEnv} env - Worker environment
 * @param {Record<string, string>} headers - Response headers
 * @returns {Promise<Response>} Template metrics
 */
async function handleTemplatesRequest(
  env: WorkerEnv,
  headers: Record<string, string>
): Promise<Response> {
  const storage = new R2StorageService(env);
  const metrics = await storage.getCachedData();

  if (!metrics || !metrics.templates) {
    return new Response("No template data available", {
      status: 404,
      headers,
    });
  }

  return new Response(JSON.stringify(metrics.templates), {
    status: 200,
    headers: {
      ...headers,
      "Content-Type": "application/json",
    },
  });
}

/**
 * Handles GET /analytics/user-preferences requests
 * @param {WorkerEnv} env - Worker environment
 * @param {Record<string, string>} headers - Response headers
 * @returns {Promise<Response>} User preference metrics
 */
async function handleUserPreferencesRequest(
  env: WorkerEnv,
  headers: Record<string, string>
): Promise<Response> {
  const storage = new R2StorageService(env);
  const metrics = await storage.getCachedData();

  if (!metrics || !metrics.userPreferences) {
    return new Response("No user preferences data available", {
      status: 404,
      headers,
    });
  }

  return new Response(JSON.stringify(metrics.userPreferences), {
    status: 200,
    headers: {
      ...headers,
      "Content-Type": "application/json",
    },
  });
}

/**
 * Updates analytics data from PostHog
 * @param {WorkerEnv} env - Worker environment
 * @returns {Promise<PostHogMetricsData>} Updated metrics data
 */
async function updateAnalytics(env: WorkerEnv): Promise<PostHogMetricsData> {
  // Analytics update started - logged by Cloudflare Workers runtime

  const authService = new PostHogAuthService(env);
  authService.validateCredentials();

  const clientService = new PostHogClientService(env);
  const dataProcessor = new DataProcessorService();
  const storage = new R2StorageService(env);

  // Get the last sync timestamp from storage
  const lastSyncData = await storage.getLastSyncTimestamp();
  const lastSyncTime = lastSyncData ? new Date(lastSyncData).toISOString() : null;
  
  // Get existing cached data
  const existingData = await storage.getCachedData();
  const existingRawEvents = existingData?.rawEvents || [];
  
  // If this is an incremental update (we have a sync timestamp)
  if (lastSyncTime && existingData) {
    // Fetch only NEW events since last sync
    const PAGE_SIZE = 1000; // Smaller page size for incremental updates
    
    const [newEvents, persons] = await Promise.all([
      clientService.fetchEvents({ 
        limit: PAGE_SIZE,
        after: lastSyncTime 
      }),
      clientService.fetchPersons({ limit: 100 }),
    ]);
    
    // If we have new events, merge them with existing
    if (newEvents.results.length > 0) {
      // Merge new events with existing raw events
      const allRawEvents = [...existingRawEvents, ...newEvents.results];
      
      // Keep only last 10000 events to prevent unbounded growth
      const trimmedEvents = allRawEvents.slice(-10000);
      
      // Create a response object with all events for processing
      const allEventsResponse: PostHogEventResponse = {
        results: trimmedEvents,
        count: trimmedEvents.length,
        next: null,
        previous: null
      };
      
      // Process ALL events (existing + new) to get accurate metrics
      const processedData = dataProcessor.processMetrics({
        events: allEventsResponse,
        persons,
        projectId: env.POSTHOG_PROJECT_ID,
      });
      
      // Store updated metrics with raw events
      await storage.storeCachedData({
        ...processedData,
        rawEvents: trimmedEvents
      });
      
      return processedData;
    } else {
      // No new events, return existing data
      return existingData;
    }
  } else {
    // First sync or no existing data - fetch initial dataset
    return await fetchFullDataset(env);
  }
}

// Helper function to merge metrics incrementally
function mergeMetrics(
  existing: PostHogMetricsData | null,
  newData: PostHogMetricsData
): PostHogMetricsData {
  if (!existing) return newData;
  
  // Merge event counts
  const mergedUsage = {
    totalEvents: (existing.usage?.totalEvents || 0) + (newData.usage?.totalEvents || 0),
    uniqueUsers: Math.max(existing.usage?.uniqueUsers || 0, newData.usage?.uniqueUsers || 0),
    eventsLast30Days: newData.usage?.eventsLast30Days || existing.usage?.eventsLast30Days || 0,
    eventsLast7Days: newData.usage?.eventsLast7Days || existing.usage?.eventsLast7Days || 0,
    activeUsersLast30Days: newData.usage?.activeUsersLast30Days || existing.usage?.activeUsersLast30Days || 0,
    activeUsersLast7Days: newData.usage?.activeUsersLast7Days || existing.usage?.activeUsersLast7Days || 0,
  };
  
  // Use the latest data for everything else
  return {
    ...newData,
    usage: mergedUsage,
    lastUpdated: new Date().toISOString(),
  };
}

// Helper function to fetch full dataset on first run
async function fetchFullDataset(env: WorkerEnv): Promise<PostHogMetricsData> {
  const authService = new PostHogAuthService(env);
  authService.validateCredentials();

  const clientService = new PostHogClientService(env);
  const dataProcessor = new DataProcessorService();
  const storage = new R2StorageService(env);
  
  // Fetch initial batch of events
  const INITIAL_LIMIT = 5000; // Get a good sample for initial metrics
  
  const [events, persons] = await Promise.all([
    clientService.fetchEvents({ limit: INITIAL_LIMIT }),
    clientService.fetchPersons({ limit: 100 }),
  ]);

  // Process the data
  const processedData = dataProcessor.processMetrics({
    events,
    persons,
    projectId: env.POSTHOG_PROJECT_ID,
  });

  // Store in R2 WITH raw events for historical data
  await storage.storeCachedData({
    ...processedData,
    rawEvents: events.results.slice(-10000) // Keep last 10000 events
  });

  // Update completed successfully
  return processedData;
}

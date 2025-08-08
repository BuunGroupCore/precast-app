/**
 * @fileoverview Cloudflare Worker entry point for GitHub metrics collection
 * @module index
 */

import { CORS_HEADERS, RATE_LIMITS } from "./config/constants";
import { DataProcessorService } from "./services/data-processor.service";
import { GitHubAuthService } from "./services/github-auth.service";
import { GitHubClientService } from "./services/github-client.service";
import { R2StorageService } from "./services/r2-storage.service";
import type { WorkerEnv, MetricsData } from "./types";

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

    const handlers: Record<string, RequestHandler> = {
      "/data": handleDataRequest,
      "/refresh": handleRefreshRequest,
      "/status": handleStatusRequest,
    };

    const handler = handlers[url.pathname];
    if (!handler) {
      return new Response("Not Found", { status: 404, headers });
    }

    try {
      return await handler(env, headers);
    } catch (error) {
      console.error("Request error:", error);
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
   * Handles scheduled events
   * @param {ScheduledEvent} event - Scheduled event
   * @param {WorkerEnv} env - Worker environment bindings
   * @param {ExecutionContext} ctx - Worker execution context
   * @returns {Promise<void>}
   */
  async scheduled(_event: ScheduledEvent, env: WorkerEnv, ctx: ExecutionContext): Promise<void> {
    ctx.waitUntil(updateMetrics(env));
  },
};

/**
 * Handles GET /data requests
 * @param {WorkerEnv} env - Worker environment
 * @param {Record<string, string>} headers - Response headers
 * @returns {Promise<Response>} Cached metrics data
 */
async function handleDataRequest(
  env: WorkerEnv,
  headers: Record<string, string>
): Promise<Response> {
  const storage = new R2StorageService(env.METRICS_BUCKET);
  const metrics = await storage.getMetrics();

  if (!metrics) {
    return new Response("No metrics data available", {
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
 * Handles GET /refresh requests with rate limiting
 * @param {WorkerEnv} env - Worker environment
 * @param {Record<string, string>} headers - Response headers
 * @returns {Promise<Response>} Fresh metrics data
 */
async function handleRefreshRequest(
  env: WorkerEnv,
  headers: Record<string, string>
): Promise<Response> {
  const lastRefresh = await env.METRICS_BUCKET.get("last-refresh");
  const now = Date.now();

  const isLocal = env.REPO_OWNER === "BuunGroupCore" && !headers["cf-ray"];

  if (lastRefresh && !isLocal) {
    const lastRefreshTime = parseInt(await lastRefresh.text());
    if (now - lastRefreshTime < RATE_LIMITS.REFRESH_COOLDOWN) {
      return new Response("Rate limited. Try again in a few minutes.", {
        status: 429,
        headers,
      });
    }
  }

  await env.METRICS_BUCKET.put("last-refresh", now.toString());

  const metrics = await updateMetrics(env);

  return new Response(JSON.stringify(metrics), {
    status: 200,
    headers: {
      ...headers,
      "Content-Type": "application/json",
    },
  });
}

/**
 * Handles GET /status requests
 * @param {WorkerEnv} env - Worker environment
 * @param {Record<string, string>} headers - Response headers
 * @returns {Promise<Response>} Worker status
 */
async function handleStatusRequest(
  env: WorkerEnv,
  headers: Record<string, string>
): Promise<Response> {
  const storage = new R2StorageService(env.METRICS_BUCKET);
  const metrics = await storage.getMetrics();

  return new Response(
    JSON.stringify({
      status: "ok",
      hasData: !!metrics,
      lastUpdated: metrics?.lastUpdated || null,
    }),
    {
      status: 200,
      headers: {
        ...headers,
        "Content-Type": "application/json",
      },
    }
  );
}

/**
 * Updates metrics data from GitHub API
 * @param {WorkerEnv} env - Worker environment
 * @returns {Promise<MetricsData>} Updated metrics data
 */
async function updateMetrics(env: WorkerEnv): Promise<MetricsData> {
  const auth = new GitHubAuthService(
    env.GITHUB_APP_ID,
    env.GITHUB_APP_PRIVATE_KEY,
    env.GITHUB_INSTALLATION_ID
  );

  const client = new GitHubClientService(auth, env.REPO_OWNER, env.REPO_NAME);
  const processor = new DataProcessorService(client);
  const storage = new R2StorageService(env.METRICS_BUCKET);

  const metrics = await processor.collectAllMetrics();
  await storage.storeMetrics(metrics);

  return metrics;
}

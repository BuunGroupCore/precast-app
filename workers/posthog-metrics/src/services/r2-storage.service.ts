/**
 * @fileoverview R2 storage service for caching metrics
 * @module services/r2-storage
 */

import type { WorkerEnv, PostHogMetricsData } from "../types";

export class R2StorageService {
  private bucket: R2Bucket;
  private readonly CACHE_KEY = "posthog-analytics.json";
  private readonly SYNC_KEY = "posthog-sync-state.json";
  private readonly CACHE_DURATION = 6 * 60 * 60 * 1000; // 6 hours

  constructor(env: WorkerEnv) {
    this.bucket = env.METRICS_BUCKET;
  }

  /**
   * Get cached metrics data
   */
  async getCachedData(): Promise<PostHogMetricsData | null> {
    try {
      const object = await this.bucket.get(this.CACHE_KEY);
      if (!object) return null;

      const data = await object.json<PostHogMetricsData>();

      // Check if cache is still valid
      const lastUpdated = new Date(data.lastUpdated);
      const now = new Date();
      const age = now.getTime() - lastUpdated.getTime();

      if (age > this.CACHE_DURATION) {
        return null; // Cache expired
      }

      return data;
    } catch (error) {
      // Error handled silently, returns null to indicate no cache
      return null;
    }
  }

  /**
   * Store metrics data in cache with raw events
   */
  async storeCachedData(data: PostHogMetricsData & { rawEvents?: any[] }): Promise<void> {
    // Store the processed metrics
    await this.bucket.put(this.CACHE_KEY, JSON.stringify(data), {
      httpMetadata: {
        contentType: "application/json",
      },
    });
    
    // Store sync state with timestamp
    const syncState = {
      lastSyncTime: new Date().toISOString(),
      eventCount: data.rawEvents?.length || 0,
    };
    await this.bucket.put(this.SYNC_KEY, JSON.stringify(syncState), {
      httpMetadata: {
        contentType: "application/json",
      },
    });
  }
  
  /**
   * Get last sync timestamp
   */
  async getLastSyncTimestamp(): Promise<string | null> {
    try {
      const object = await this.bucket.get(this.SYNC_KEY);
      if (!object) return null;
      
      const syncState = await object.json<{ lastSyncTime: string; eventCount: number }>();
      return syncState.lastSyncTime;
    } catch (error) {
      return null;
    }
  }

  /**
   * Get last refresh timestamp
   */
  async getLastRefreshTime(): Promise<Date | null> {
    try {
      const object = await this.bucket.head(this.CACHE_KEY);
      if (!object) return null;

      return object.uploaded;
    } catch (error) {
      // Error handled silently, returns null to indicate no previous refresh
      return null;
    }
  }

  /**
   * Check if refresh is allowed (rate limiting)
   */
  async isRefreshAllowed(): Promise<boolean> {
    const lastRefresh = await this.getLastRefreshTime();
    if (!lastRefresh) return true;

    const now = new Date();
    const timeSinceRefresh = now.getTime() - lastRefresh.getTime();
    const minRefreshInterval = 5 * 60 * 1000; // 5 minutes

    return timeSinceRefresh >= minRefreshInterval;
  }
}

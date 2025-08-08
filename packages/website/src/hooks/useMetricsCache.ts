/**
 * @fileoverview Metrics data caching hook using localStorage
 * @module hooks/useMetricsCache
 */

import { useCallback } from "react";

import type { GitHubStats, CommitData } from "./useGitHubApi";
import type { NpmStats, DownloadData } from "./useNpmData";

export interface MetricsCacheData {
  timestamp: number;
  githubStats?: GitHubStats;
  npmStats?: NpmStats;
  commitHistory?: CommitData[];
  downloadHistory?: DownloadData[];
}

interface UseMetricsCacheReturn {
  getCache: () => MetricsCacheData | null;
  setCache: (data: Partial<Omit<MetricsCacheData, "timestamp">>) => void;
  clearCache: () => void;
  isCacheValid: (maxAge?: number) => boolean;
}

const CACHE_KEY = "precast-metrics-cache";
const DEFAULT_CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

/**
 * Custom hook for managing metrics data cache in localStorage
 */
export function useMetricsCache(): UseMetricsCacheReturn {
  /**
   * Get cached data from localStorage
   */
  const getCache = useCallback((): MetricsCacheData | null => {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const data = JSON.parse(cached);
        // Validate that the data structure is correct
        if (typeof data === "object" && data !== null && typeof data.timestamp === "number") {
          return data as MetricsCacheData;
        }
      }
    } catch (error) {
      console.warn("Failed to read metrics cache:", error);
      // Clear corrupted cache
      localStorage.removeItem(CACHE_KEY);
    }
    return null;
  }, []);

  /**
   * Set cache data in localStorage
   */
  const setCache = useCallback((data: Partial<Omit<MetricsCacheData, "timestamp">>) => {
    try {
      const cacheData: MetricsCacheData = {
        ...data,
        timestamp: Date.now(),
      };
      localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
    } catch (error) {
      console.warn("Failed to write metrics cache:", error);
    }
  }, []);

  /**
   * Clear all cached data
   */
  const clearCache = useCallback(() => {
    try {
      localStorage.removeItem(CACHE_KEY);
    } catch (error) {
      console.warn("Failed to clear metrics cache:", error);
    }
  }, []);

  /**
   * Check if cached data is still valid
   */
  const isCacheValid = useCallback(
    (maxAge: number = DEFAULT_CACHE_DURATION): boolean => {
      const cache = getCache();
      if (!cache) return false;

      const age = Date.now() - cache.timestamp;
      return age < maxAge;
    },
    [getCache]
  );

  return {
    getCache,
    setCache,
    clearCache,
    isCacheValid,
  };
}

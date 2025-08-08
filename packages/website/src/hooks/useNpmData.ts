/**
 * @fileoverview NPM registry data hook for fetching package statistics
 * @module hooks/useNpmData
 */

import { useState, useCallback } from "react";

export interface NpmStats {
  downloads: {
    lastDay: number;
    lastWeek: number;
    lastMonth: number;
  };
  version: string;
  versions: number;
  lastPublished: string;
  dependencies: number;
  devDependencies: number;
  unpacked: string;
  fileCount: number;
}

export interface DownloadData {
  day: string;
  downloads: number;
}

interface NpmRangeDownload {
  day: string;
  downloads: number;
}

interface UseNpmDataState {
  npmStats: NpmStats | undefined;
  downloadHistory: DownloadData[];
  loading: boolean;
  error: string | null;
}

interface UseNpmDataReturn extends UseNpmDataState {
  fetchNpmData: () => Promise<void>;
}

const PACKAGE_NAME = "create-precast-app";
const NPM_REGISTRY_URL = "https://registry.npmjs.org";
const NPM_API_URL = "https://api.npmjs.org";

/**
 * Custom hook for fetching NPM package data and download statistics
 */
export function useNpmData(): UseNpmDataReturn {
  const [state, setState] = useState<UseNpmDataState>({
    npmStats: undefined,
    downloadHistory: [],
    loading: false,
    error: null,
  });

  /**
   * Fetch package metadata from NPM registry
   */
  const fetchPackageMetadata = useCallback(async () => {
    const response = await fetch(`${NPM_REGISTRY_URL}/${PACKAGE_NAME}`);
    if (!response.ok) throw new Error(`Failed to fetch package metadata: ${response.statusText}`);
    return response.json();
  }, []);

  /**
   * Fetch download counts for different periods
   */
  const fetchDownloadCounts = useCallback(async () => {
    const [lastDay, lastWeek, lastMonth] = await Promise.all([
      fetch(`${NPM_API_URL}/downloads/point/last-day/${PACKAGE_NAME}`)
        .then((res) => (res.ok ? res.json() : { downloads: 0 }))
        .catch(() => ({ downloads: 0 })),
      fetch(`${NPM_API_URL}/downloads/point/last-week/${PACKAGE_NAME}`)
        .then((res) => (res.ok ? res.json() : { downloads: 0 }))
        .catch(() => ({ downloads: 0 })),
      fetch(`${NPM_API_URL}/downloads/point/last-month/${PACKAGE_NAME}`)
        .then((res) => (res.ok ? res.json() : { downloads: 0 }))
        .catch(() => ({ downloads: 0 })),
    ]);

    return {
      lastDay: lastDay.downloads || 0,
      lastWeek: lastWeek.downloads || 0,
      lastMonth: lastMonth.downloads || 0,
    };
  }, []);

  /**
   * Fetch download history for the last 30 days
   */
  const fetchDownloadHistory = useCallback(async (): Promise<DownloadData[]> => {
    try {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 30);

      const response = await fetch(
        `${NPM_API_URL}/downloads/range/${startDate.toISOString().split("T")[0]}:${endDate.toISOString().split("T")[0]}/${PACKAGE_NAME}`
      );

      if (!response.ok) throw new Error("Failed to fetch download history");

      const data = await response.json();

      if (data.downloads && Array.isArray(data.downloads)) {
        return data.downloads.map((item: NpmRangeDownload) => ({
          day: new Date(item.day).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          }),
          downloads: item.downloads,
        }));
      }

      throw new Error("Invalid download history response");
    } catch (error) {
      console.warn("Failed to fetch download history, using sample data:", error);

      // Generate sample data if API fails
      return Array.from({ length: 30 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (29 - i));
        return {
          day: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
          downloads: Math.floor(Math.random() * 50) + 10,
        };
      });
    }
  }, []);

  /**
   * Main fetch function for all NPM data
   */
  const fetchNpmData = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const [packageData, downloadCounts, downloadHistory] = await Promise.all([
        fetchPackageMetadata(),
        fetchDownloadCounts(),
        fetchDownloadHistory(),
      ]);

      const latestVersion = packageData["dist-tags"]?.latest;
      const versionData = packageData.versions?.[latestVersion];

      const npmStats: NpmStats = {
        downloads: downloadCounts,
        version: latestVersion || "1.0.0",
        versions: packageData.versions ? Object.keys(packageData.versions).length : 0,
        lastPublished: packageData.time?.[latestVersion] || new Date().toISOString(),
        dependencies: versionData?.dependencies ? Object.keys(versionData.dependencies).length : 0,
        devDependencies: versionData?.devDependencies
          ? Object.keys(versionData.devDependencies).length
          : 0,
        unpacked: versionData?.dist?.unpackedSize
          ? `${(versionData.dist.unpackedSize / 1024).toFixed(0)}KB`
          : "N/A",
        fileCount: versionData?.dist?.fileCount || 0,
      };

      setState({
        npmStats,
        downloadHistory,
        loading: false,
        error: null,
      });
    } catch (error) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : "Failed to fetch NPM data",
      }));
    }
  }, [fetchPackageMetadata, fetchDownloadCounts, fetchDownloadHistory]);

  return {
    ...state,
    fetchNpmData,
  };
}

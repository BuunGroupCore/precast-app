import { useState, useEffect } from "react";

import { API_ENDPOINTS, NPM_PACKAGE, CACHE_DURATIONS } from "@/config/constants";

interface NpmStats {
  downloads: {
    lastDay: number;
    lastWeek: number;
    lastMonth: number;
  };
  totalDownloads: number;
  versions: number;
  unpacked: string;
  loading: boolean;
  error: Error | null;
}

interface DownloadHistoryItem {
  day: string;
  downloads: number;
}

/**
 * Custom hook to fetch NPM package statistics.
 * Includes download history and package metadata.
 */
export function useNpmStats() {
  const [stats, setStats] = useState<NpmStats>({
    downloads: {
      lastDay: 0,
      lastWeek: 0,
      lastMonth: 0,
    },
    totalDownloads: 0,
    versions: 0,
    unpacked: "0KB",
    loading: true,
    error: null,
  });

  const [downloadHistory, setDownloadHistory] = useState<DownloadHistoryItem[]>([]);

  useEffect(() => {
    let mounted = true;
    const cacheKey = "npm_stats";
    const cached = localStorage.getItem(cacheKey);

    if (cached) {
      const { data, history, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp < CACHE_DURATIONS.NPM_STATS) {
        setStats({ ...data, loading: false, error: null });
        setDownloadHistory(history || []);
        return;
      }
    }

    const fetchStats = async () => {
      try {
        const [npmData, downloadData, registryData] = await Promise.all([
          fetch(`${API_ENDPOINTS.NPM_DOWNLOADS}/point/last-day/${NPM_PACKAGE}`).then((res) => {
            if (!res.ok) throw new Error("Failed to fetch daily downloads");
            return res.json();
          }),
          fetch(`${API_ENDPOINTS.NPM_DOWNLOADS}/range/last-month/${NPM_PACKAGE}`).then((res) => {
            if (!res.ok) throw new Error("Failed to fetch monthly downloads");
            return res.json();
          }),
          fetch(API_ENDPOINTS.NPM_PACKAGE).then((res) => {
            if (!res.ok) throw new Error("Failed to fetch package data");
            return res.json();
          }),
        ]);

        if (!mounted) return;

        const totalDownloads =
          downloadData.downloads?.reduce(
            (sum: number, day: { downloads: number }) => sum + day.downloads,
            0
          ) || 0;

        const weekDownloads =
          downloadData.downloads
            ?.slice(-7)
            .reduce((sum: number, day: { downloads: number }) => sum + day.downloads, 0) || 0;

        const newStats = {
          downloads: {
            lastDay: npmData.downloads || 0,
            lastWeek: weekDownloads,
            lastMonth: totalDownloads,
          },
          totalDownloads,
          versions: Object.keys(registryData.versions || {}).length,
          unpacked: registryData.versions?.[registryData["dist-tags"]?.latest]?.dist?.unpackedSize
            ? `${Math.round(registryData.versions[registryData["dist-tags"].latest].dist.unpackedSize / 1024)}KB`
            : "N/A",
        };

        const history =
          downloadData.downloads?.slice(-14).map((item: { day: string; downloads: number }) => ({
            day: new Date(item.day).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            }),
            downloads: item.downloads,
          })) || [];

        localStorage.setItem(
          cacheKey,
          JSON.stringify({
            data: newStats,
            history,
            timestamp: Date.now(),
          })
        );

        setStats({
          ...newStats,
          loading: false,
          error: null,
        });
        setDownloadHistory(history);
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

  return { stats, downloadHistory };
}

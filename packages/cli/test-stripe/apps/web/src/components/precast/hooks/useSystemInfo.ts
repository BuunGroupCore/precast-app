/**
 * useSystemInfo Hook
 * Handles fetching and managing system information
 * Extracted from PrecastWidget fetchSystemInfo function
 */

import { useState, useEffect, useCallback } from "react";
import { SystemInfo } from "../types";
import { getApiUrl, getSimpleApiHeaders } from "../utils/environmentUtils";

/**
 * Hook to fetch and manage system information
 * Exact copy of fetchSystemInfo logic from original PrecastWidget (lines 423-459)
 */
export function useSystemInfo() {
  const [systemInfo, setSystemInfo] = useState<SystemInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSystemInfo = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const apiUrl = getApiUrl() || "";
      const response = await fetch(`${apiUrl}/api/health`);
      if (response.ok) {
        const data = await response.json();
        setSystemInfo({
          uptime: data.uptime || 0,
          environment: data.environment || "development",
          apiPort: 3001,
          dbPort: false,
        });
      }
    } catch (error) {
      console.error("Failed to fetch system info:", error);
      setError(error instanceof Error ? error.message : "Unknown error");
      // Set default system info when API is unavailable
      setSystemInfo({
        uptime: 0,
        environment: "development",
        apiPort: 3001,
        dbPort: false,
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSystemInfo();
  }, [fetchSystemInfo]);

  return {
    systemInfo,
    isLoading,
    error,
    refetch: fetchSystemInfo,
    setSystemInfo, // Allow manual updates (used by API health test)
  };
}

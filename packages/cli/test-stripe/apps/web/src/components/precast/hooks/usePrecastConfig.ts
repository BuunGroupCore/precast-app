/**
 * usePrecastConfig Hook
 * @module usePrecastConfig
 * @description Hook for loading and managing Precast project configuration
 */

import { useState, useEffect } from "react";
import { PrecastConfig } from "../types";

/**
 * Hook to load and manage Precast configuration
 * @returns {Object} Configuration state and utilities
 * @returns {PrecastConfig|null} precastConfig - Current configuration object
 * @returns {boolean} isLoading - Loading state indicator
 * @returns {string|null} error - Error message if loading failed
 * @returns {Function} reloadConfig - Function to reload configuration
 */
export function usePrecastConfig() {
  const [precastConfig, setPrecastConfig] = useState<PrecastConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Loads Precast configuration from file or API
   */
  const loadPrecastConfig = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/precast.jsonc");
      if (response.ok) {
        try {
          const config = await response.json();
          setPrecastConfig(config);
        } catch (jsonError) {
          const text = await response.text();
          const cleanJson = text
            .replace(/\/\*[\s\S]*?\*\//g, "")
            .replace(/^\s*\/\/.*$/gm, "")
            .replace(/,\s*([}\]])/g, "$1");

          const config = JSON.parse(cleanJson);
          setPrecastConfig(config);
        }
      } else {
        setPrecastConfig({
          docker: false,
          database: "postgres",
          backend: "express",
          powerups: [],
        });
      }
    } catch (error) {
      console.error("Failed to load precast config:", error);
      setError(error instanceof Error ? error.message : "Unknown error");
      setPrecastConfig({
        docker: false,
        database: "postgres",
        backend: "express",
        powerups: [],
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPrecastConfig();
  }, []);

  return {
    precastConfig,
    isLoading,
    error,
    reloadConfig: loadPrecastConfig,
  };
}

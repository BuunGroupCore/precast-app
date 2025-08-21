/**
 * API Service Testing Module
 * @module apiService
 * @description Extracted from PrecastWidget - exact copy of testApiHealth function
 */

import { TestResult, ServiceTestContext } from "../types";
import { getApiHeaders } from "../utils/environmentUtils";

/**
 * API Health Check
 * @param {(updater: (prev: Record<string, boolean>) => Record<string, boolean>) => void} setLoading - Loading state setter
 * @param {(service: string, result: Omit<TestResult, "timestamp">) => void} addTestResult - Test result handler
 * @param {(info: any) => void} setSystemInfo - System info setter
 * @param {string} apiUrl - API base URL
 */
export const testApiHealth = async (
  setLoading: (updater: (prev: Record<string, boolean>) => Record<string, boolean>) => void,
  addTestResult: (service: string, result: Omit<TestResult, "timestamp">) => void,
  setSystemInfo: (info: any) => void,
  apiUrl: string
): Promise<void> => {
  setLoading((prev) => ({ ...prev, api: true }));
  try {
    const response = await fetch(`${apiUrl}/api/health`);
    const data = await response.json();

    if (response.ok) {
      addTestResult("api", {
        success: true,
        message: "API HEALTHY",
        details: data,
      });
      setSystemInfo({
        uptime: data.uptime || 0,
        environment: data.environment || "development",
        apiPort: 3001,
        dbPort: false,
      });
    } else {
      addTestResult("api", {
        success: false,
        message: "API UNHEALTHY",
        details: data,
      });
    }
  } catch (error) {
    addTestResult("api", {
      success: false,
      message: "API UNREACHABLE",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  } finally {
    setLoading((prev) => ({ ...prev, api: false }));
  }
};

/**
 * Simplified API health test for use with service registry
 * @param {ServiceTestContext} context - Test context with API URL and headers
 * @returns {Promise<TestResult>} Test result
 */
export const testApiHealthSimple = async (context: ServiceTestContext): Promise<TestResult> => {
  try {
    const response = await fetch(`${context.apiUrl}/api/health`, {
      headers: context.headers,
    });
    const data = await response.json();

    if (response.ok) {
      return {
        success: true,
        message: "API HEALTHY",
        details: data,
        timestamp: new Date().toISOString(),
      };
    } else {
      return {
        success: false,
        message: "API UNHEALTHY",
        details: data,
        timestamp: new Date().toISOString(),
      };
    }
  } catch (error) {
    return {
      success: false,
      message: "API UNREACHABLE",
      details: error instanceof Error ? error.message : "Unknown error",
      timestamp: new Date().toISOString(),
    };
  }
};

/**
 * Check if API service is available
 * @returns {boolean} True if API service is configured
 */
export const isApiServiceAvailable = (): boolean => {
  return true; // API service is always available when backend is configured
};

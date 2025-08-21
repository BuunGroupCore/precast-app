/**
 * Docker Service Testing Module
 * Extracted from PrecastWidget - exact copy of testDockerHealth function
 */

import { TestResult, ServiceTestContext } from "../types";

// No Docker configured - Docker service not available
export const testDockerHealth = async (): Promise<void> => {
  console.warn("Docker service not configured");
};

export const testDockerHealthSimple = async (): Promise<TestResult> => {
  return {
    success: false,
    message: "DOCKER NOT CONFIGURED",
    details: "Docker is not configured for this project",
    timestamp: new Date().toISOString(),
  };
};

export const isDockerServiceAvailable = (): boolean => {
  return false;
};

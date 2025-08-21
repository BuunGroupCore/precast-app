/**
 * Authentication Service Testing Module
 * @module authService
 * @description Provides authentication testing utilities for the PrecastWidget
 */

import { TestResult, ServiceTestContext, AuthMode } from "../types";
import { getAuthApiUrl } from "../utils/environmentUtils";

// No auth provider configured
export const testAuthStatus = async (): Promise<void> => {
  console.warn("Auth service not configured");
};

export const testAuthService = async (): Promise<void> => {
  console.warn("Auth service not configured");
};

export const testAuthStatusSimple = async (): Promise<TestResult> => {
  return {
    success: false,
    message: "AUTH NOT CONFIGURED",
    details: "No authentication provider configured for this project",
    timestamp: new Date().toISOString(),
  };
};

export const isAuthServiceAvailable = (): boolean => {
  return false;
};

/**
 * Email Service Testing Module
 * Extracted from PrecastWidget - exact copy of testEmailService function
 */

import { TestResult, ServiceTestContext } from "../types";

// No email service configured
export const testEmailService = async (): Promise<void> => {
  console.warn("Email service not configured");
};

export const testEmailServiceSimple = async (): Promise<TestResult> => {
  return {
    success: false,
    message: "EMAIL NOT CONFIGURED",
    details: "No email service configured for this project",
    timestamp: new Date().toISOString(),
  };
};

export const isEmailServiceAvailable = (): boolean => {
  return false;
};

/**
 * AuthTestForm Component
 * Extracted from PrecastWidget - authentication testing UI
 */

import React from "react";
import { AuthMode } from "../types";
import { TestButton } from "./TestButton";

interface AuthTestFormProps {
  authMode: AuthMode;
  authEmail: string;
  authPassword: string;
  authName: string;
  isLoading: boolean;
  onModeChange: (mode: AuthMode) => void;
  onEmailChange: (email: string) => void;
  onPasswordChange: (password: string) => void;
  onNameChange: (name: string) => void;
  onTest: () => void;
  onStatusTest: () => void;
  isStatusLoading: boolean;
}

// Auth not configured - return empty component
export function AuthTestForm() {
  return null;
}

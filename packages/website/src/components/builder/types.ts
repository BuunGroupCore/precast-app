import { IconType } from "react-icons";

import { type SavedProject } from "../../lib/db";

// Extended config type to include AI and UI libraries
export interface ExtendedProjectConfig
  extends Omit<SavedProject, "id" | "createdAt" | "updatedAt"> {
  aiAssistant?: string;
  uiLibrary?: string;
  autoInstall?: boolean;
  packageManager?: string;
  deploymentMethod?: string;
  runtime?: string;
  auth?: string;
  powerups?: string[];
  mcpServers?: string[];
  apiClient?: string;
}

// AI Assistant options
export interface AIAssistant {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }> | string | null;
  color: string;
  description: string;
  files?: string[];
}

// UI Component Libraries with framework dependencies
export interface UILibrary {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }> | string | null;
  color: string;
  description: string;
  frameworks: string[];
  requires?: string[];
}

// Package Manager option
export interface PackageManager {
  id: string;
  name: string;
  icon: IconType;
  color: string;
  description: string;
}

// Deployment Method option
export interface DeploymentMethod {
  id: string;
  name: string;
  icon: IconType | string | null;
  color: string;
  description: string;
}

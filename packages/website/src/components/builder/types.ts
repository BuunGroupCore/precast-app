import { IconType } from "react-icons";

import { type SavedProject } from "@/lib/db";

/**
 * Extended project configuration including all builder options and integrations.
 */
export interface ExtendedProjectConfig
  extends Omit<SavedProject, "id" | "createdAt" | "updatedAt"> {
  aiAssistant?: string;
  uiLibrary?: string;
  uiFramework?: string; // New: UI framework when using build tools like Vite
  buildTool?: string; // New: separate build tool selection
  autoInstall?: boolean;
  packageManager?: string;
  deploymentMethod?: string;
  runtime?: string;
  auth?: string;
  powerups?: string[];
  mcpServers?: string[];
  apiClient?: string;
  databaseDeployment?: "local" | "cloud";
}

/**
 * Configuration for AI assistant integrations.
 */
export interface AIAssistant {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }> | string | null;
  color: string;
  description: string;
  files?: string[];
  beta?: boolean;
}

/**
 * Configuration for UI component libraries and their framework dependencies.
 */
export interface UILibrary {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }> | string | null;
  color: string;
  description: string;
  frameworks: string[];
  requires?: string[];
  incompatible?: string[];
  beta?: boolean;
}

/**
 * File node structure for folder visualization.
 */
export interface FileNode {
  name: string;
  type: "file" | "folder";
  children?: FileNode[];
  previewContent?: string;
  path?: string;
  icon?: React.ComponentType<{ className?: string }> | React.ReactElement;
  description?: string;
}

/**
 * Configuration for package managers.
 */
export interface PackageManager {
  id: string;
  name: string;
  icon: IconType;
  color: string;
  description: string;
}

/** Deployment Method option */
export interface DeploymentMethod {
  id: string;
  name: string;
  icon: IconType | string | null;
  color: string;
  description: string;
  frameworkOnly?: string;
  supportsStatic?: boolean;
  supportsDynamic?: boolean;
}

/**
 * Plugin configuration types shared between CLI and website
 */

export interface PluginEnvVariable {
  name: string;
  required: boolean;
  description: string;
  example?: string;
  validation?: string; // Regex pattern for validation
}

export interface PluginCompatibility {
  frameworks:
    | Record<
        string,
        {
          minVersion?: string;
          tested: boolean;
          notes?: string;
        }
      >
    | string[]; // Support both detailed config and simple array
  backends?: string[];
  packageManagers?: string[];
}

export interface PluginDependencies {
  production: Record<string, Record<string, string>>;
  development?: Record<string, Record<string, string>>;
  peer?: Record<string, string>;
}

export interface PluginTemplate {
  condition?: string; // Handlebars condition
  framework: string;
  backend?: string;
  files: Array<{
    template: string;
    output: string;
    overwrite?: boolean;
  }>;
}

export interface PluginSecurity {
  envVariables: PluginEnvVariable[];
  cors?: {
    origins: string[];
    credentials: boolean;
  };
  csp?: Record<string, string>;
}

export interface PluginConfig {
  id: string;
  name: string;
  category: "email" | "payments" | "storage" | "realtime" | "search" | "analytics" | "sms";
  description: string;
  version?: string;
  pricing?: "free" | "freemium" | "paid";

  // Compatibility
  compatibility: PluginCompatibility;
  requiresBackend?: boolean;
  requiresDatabase?: boolean;
  incompatible?: string[];

  // Dependencies
  dependencies: PluginDependencies;

  // Security
  security: PluginSecurity;

  // Templates
  templates: PluginTemplate[];

  // Post-install
  postInstall?: {
    scripts?: Record<string, string>;
    instructions: string[];
    verificationSteps?: string[];
  };

  // Documentation
  documentationUrl?: string;
  setupUrl?: string;
}

/**
 * Plugin definition for UI display
 */
export interface Plugin {
  id: string;
  name: string;
  category: "email" | "payments" | "storage" | "realtime" | "search" | "analytics" | "sms";
  description: string;
  icon?: any; // IconType for React Icons
  pricing: "free" | "freemium" | "paid";

  // Simplified compatibility for UI
  frameworks: string[]; // ['*'] for all
  requiresBackend: boolean;
  requiresDatabase?: boolean;
  incompatible?: string[];

  // UI helpers
  envVariables: string[];
  setupUrl?: string;
  documentationUrl: string;
  quickstartSteps?: string[];
}

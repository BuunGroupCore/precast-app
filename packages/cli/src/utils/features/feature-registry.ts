import * as path from "path";
import * as fs from "fs-extra";
import type { ProjectConfig } from "@shared/stack-config.js";

export interface FeatureDependency {
  required: Record<string, string>;
  optional?: Record<string, string>;
  peer?: Record<string, string>;
}

export interface FeatureCompatibility {
  frameworks: {
    supported: string[];
    requirements: Record<string, any>;
  };
  backends: {
    supported: string[];
    requirements: Record<string, any>;
  };
  authProviders?: {
    supported: string[];
    requirements: Record<string, any>;
  };
  styling: {
    required: string[];
    supported: string[];
  };
}

export interface FeatureDetection {
  requiredFiles: string[];
  packageJsonChecks: {
    dependencies?: string[];
    devDependencies?: string[];
    scripts?: string[];
  };
  fileSystemChecks: Array<{
    path: string;
    type: "file" | "directory";
    required: boolean;
  }>;
  frameworkDetection: Record<string, string[]>;
}

export interface FeatureManifest {
  id: string;
  name: string;
  description: string;
  version: string;
  category: string;
  tags: string[];
  dependencies: FeatureDependency;
  compatibility: FeatureCompatibility;
  detection: FeatureDetection;
  installation: {
    preInstall: Array<{
      command: string;
      description: string;
      packages?: string[];
      dev?: boolean;
    }>;
    install: Array<{
      command: string;
      packages?: string[];
      dev?: boolean;
    }>;
    postInstall: Array<{
      command: string;
      description?: string;
      source?: string;
      destination?: string;
      file?: string;
      optional?: boolean;
    }>;
  };
  files: {
    structure: Record<string, any>;
    templates?: {
      conditional?: Record<string, any>;
    };
  };
  configuration?: {
    options: Array<{
      key: string;
      type: string;
      default: any;
      description: string;
      options?: string[];
    }>;
  };
  usage: {
    quickStart: string[];
    examples: Array<{
      title: string;
      code: string;
    }>;
  };
}

export interface DetectedProject {
  framework: string;
  backend?: string;
  authProvider?: string;
  styling: string[];
  packageManager: string;
  typescript: boolean;
  monorepo: boolean;
  projectPath: string;
}

/**
 * Feature Registry for managing installable features
 */
export class FeatureRegistry {
  private featuresPath: string;
  private features: Map<string, FeatureManifest> = new Map();

  constructor(cliPath: string) {
    this.featuresPath = path.join(cliPath, "src/templates/common/features");
  }

  /**
   * Load all available features from the features directory
   */
  async loadFeatures(): Promise<void> {
    try {
      const indexPath = path.join(this.featuresPath, "index.json");

      if (await fs.pathExists(indexPath)) {
        const index = await fs.readJson(indexPath);

        for (const feature of index.features) {
          const featurePath = path.join(this.featuresPath, feature.id, "feature.json");

          if (await fs.pathExists(featurePath)) {
            const manifest: FeatureManifest = await fs.readJson(featurePath);
            this.features.set(feature.id, manifest);
          }
        }
      }
    } catch (error) {
      console.error("Failed to load features:", error);
    }
  }

  /**
   * Get all available features
   */
  getFeatures(): FeatureManifest[] {
    return Array.from(this.features.values());
  }

  /**
   * Get a specific feature by ID
   */
  getFeature(id: string): FeatureManifest | undefined {
    return this.features.get(id);
  }

  /**
   * Detect the current project structure and configuration
   */
  async detectProject(projectPath: string): Promise<DetectedProject> {
    const packageJsonPath = path.join(projectPath, "package.json");

    if (!(await fs.pathExists(packageJsonPath))) {
      throw new Error("No package.json found in project");
    }

    const packageJson = await fs.readJson(packageJsonPath);
    const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };

    // Detect framework
    let framework = "unknown";
    if (dependencies.next) framework = "next";
    else if (dependencies["@remix-run/react"]) framework = "remix";
    else if (dependencies["@tanstack/react-router"]) framework = "tanstack-router";
    else if (dependencies["@tanstack/start"]) framework = "tanstack-start";
    else if (dependencies.react) framework = "react";
    else if (dependencies.vue) framework = "vue";
    else if (dependencies.svelte) framework = "svelte";

    // Detect backend (in monorepo)
    let backend: string | undefined;
    const appsPath = path.join(projectPath, "apps/api");
    if (await fs.pathExists(appsPath)) {
      const apiPackageJson = path.join(appsPath, "package.json");
      if (await fs.pathExists(apiPackageJson)) {
        const apiPkg = await fs.readJson(apiPackageJson);
        const apiDeps = { ...apiPkg.dependencies, ...apiPkg.devDependencies };

        if (apiDeps.hono) backend = "hono";
        else if (apiDeps.express) backend = "express";
        else if (apiDeps.fastify) backend = "fastify";
        else if (apiDeps["@nestjs/core"]) backend = "nest";
      }
    }

    // Detect auth provider
    let authProvider: string | undefined;
    if (dependencies["next-auth"] || dependencies["@auth/core"]) authProvider = "auth.js";
    else if (dependencies["better-auth"]) authProvider = "better-auth";

    // Detect styling
    const styling: string[] = [];
    if (dependencies.tailwindcss) styling.push("tailwindcss");
    if (dependencies["styled-components"]) styling.push("styled-components");
    if (dependencies["@emotion/react"]) styling.push("emotion");

    // Detect package manager
    let packageManager = "npm";
    if (await fs.pathExists(path.join(projectPath, "bun.lockb"))) packageManager = "bun";
    else if (await fs.pathExists(path.join(projectPath, "pnpm-lock.yaml"))) packageManager = "pnpm";
    else if (await fs.pathExists(path.join(projectPath, "yarn.lock"))) packageManager = "yarn";

    // Check TypeScript
    const typescript =
      (await fs.pathExists(path.join(projectPath, "tsconfig.json"))) ||
      dependencies.typescript ||
      dependencies["@types/react"];

    // Check if monorepo
    const monorepo =
      (await fs.pathExists(path.join(projectPath, "apps"))) ||
      (await fs.pathExists(path.join(projectPath, "packages")));

    return {
      framework,
      backend,
      authProvider,
      styling,
      packageManager,
      typescript: Boolean(typescript),
      monorepo,
      projectPath,
    };
  }

  /**
   * Check if a feature is compatible with the detected project
   */
  isCompatible(
    feature: FeatureManifest,
    project: DetectedProject
  ): {
    compatible: boolean;
    reasons: string[];
  } {
    const reasons: string[] = [];

    // Check framework compatibility
    if (!feature.compatibility.frameworks.supported.includes(project.framework)) {
      reasons.push(
        `Framework ${project.framework} is not supported. Supported: ${feature.compatibility.frameworks.supported.join(", ")}`
      );
    }

    // Check backend compatibility if specified
    if (feature.compatibility.backends && project.backend) {
      if (!feature.compatibility.backends.supported.includes(project.backend)) {
        reasons.push(
          `Backend ${project.backend} is not supported. Supported: ${feature.compatibility.backends.supported.join(", ")}`
        );
      }
    }

    // Check auth provider compatibility if specified
    if (feature.compatibility.authProviders && project.authProvider) {
      if (!feature.compatibility.authProviders.supported.includes(project.authProvider)) {
        reasons.push(
          `Auth provider ${project.authProvider} is not supported. Supported: ${feature.compatibility.authProviders.supported.join(", ")}`
        );
      }
    }

    // Check styling requirements
    const hasRequiredStyling = feature.compatibility.styling.required.some((style) =>
      project.styling.includes(style)
    );
    if (!hasRequiredStyling && feature.compatibility.styling.required.length > 0) {
      reasons.push(
        `Missing required styling: ${feature.compatibility.styling.required.join(" or ")}`
      );
    }

    // Check TypeScript requirement
    if (feature.compatibility.frameworks.requirements?.typescript && !project.typescript) {
      reasons.push("TypeScript is required for this feature");
    }

    return {
      compatible: reasons.length === 0,
      reasons,
    };
  }

  /**
   * Get compatible features for a project
   */
  getCompatibleFeatures(project: DetectedProject): Array<{
    feature: FeatureManifest;
    compatibility: { compatible: boolean; reasons: string[] };
  }> {
    return this.getFeatures().map((feature) => ({
      feature,
      compatibility: this.isCompatible(feature, project),
    }));
  }

  /**
   * Search features by query
   */
  searchFeatures(query: string): FeatureManifest[] {
    const searchTerm = query.toLowerCase();

    return this.getFeatures().filter(
      (feature) =>
        feature.name.toLowerCase().includes(searchTerm) ||
        feature.description.toLowerCase().includes(searchTerm) ||
        feature.tags.some((tag) => tag.toLowerCase().includes(searchTerm)) ||
        feature.category.toLowerCase().includes(searchTerm)
    );
  }
}

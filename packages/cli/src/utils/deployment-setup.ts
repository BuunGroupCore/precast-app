import path from "path";

import { consola } from "consola";
import fsExtra from "fs-extra";

import type { ProjectConfig } from "../../../shared/stack-config.js";
import type { TemplateEngine } from "../core/template-engine.js";

// eslint-disable-next-line import/no-named-as-default-member
const { pathExists, readJSON, writeJSON } = fsExtra;

export interface DeploymentConfig {
  id: string;
  name: string;
  description: string;
  frameworks: string[];
  configFiles: string[];
  envVars?: string[];
  buildCommand?: string;
  outputDir?: string;
  disabled?: boolean;
}

/**
 * Deployment platform configuration mappings
 */
export const DEPLOYMENT_CONFIGS: Record<string, DeploymentConfig> = {
  "cloudflare-pages": {
    id: "cloudflare-pages",
    name: "Cloudflare Pages",
    description: "Fast, secure sites on Cloudflare's edge network",
    frameworks: ["*"],
    configFiles: ["wrangler.toml", "_routes.json"],
    buildCommand: "npm run build",
    outputDir: "dist",
  },
  "azure-static": {
    id: "azure-static",
    name: "Azure Static Web Apps",
    description: "Full-stack web apps with serverless APIs",
    frameworks: ["*"],
    configFiles: [".github/workflows/azure-static-web-apps.yml"],
    buildCommand: "npm run build",
    outputDir: "dist",
    disabled: true,
  },
  vercel: {
    id: "vercel",
    name: "Vercel",
    description: "The platform for frontend developers",
    frameworks: ["*"],
    configFiles: ["vercel.json"],
    buildCommand: "npm run build",
    outputDir: "dist",
  },
  netlify: {
    id: "netlify",
    name: "Netlify",
    description: "Build and deploy modern web projects",
    frameworks: ["*"],
    configFiles: ["netlify.toml"],
    buildCommand: "npm run build",
    outputDir: "dist",
  },
  "github-pages": {
    id: "github-pages",
    name: "GitHub Pages",
    description: "Host directly from your GitHub repository",
    frameworks: ["*"],
    configFiles: [".github/workflows/deploy.yml"],
    buildCommand: "npm run build",
    outputDir: "dist",
    disabled: true,
  },
};

/**
 * Setup deployment configuration for the project
 * @param config - Project configuration with deployment method
 * @param projectPath - Path to the project directory
 * @param templateEngine - Template engine instance
 */
export async function setupDeploymentConfig(
  config: ProjectConfig & { deploymentMethod?: string },
  projectPath: string,
  templateEngine: TemplateEngine
): Promise<void> {
  if (!config.deploymentMethod || config.deploymentMethod === "none") {
    return;
  }

  const deployConfig = DEPLOYMENT_CONFIGS[config.deploymentMethod];
  if (!deployConfig) {
    consola.warn(`Unknown deployment method: ${config.deploymentMethod}`);
    return;
  }

  consola.info(`Setting up ${deployConfig.name} deployment...`);

  try {
    for (const configFile of deployConfig.configFiles) {
      const templatePath = `deployment/${config.deploymentMethod}/${configFile}.hbs`;
      const outputPath = path.join(projectPath, configFile);

      try {
        await templateEngine.processTemplate(templatePath, outputPath, {
          ...config,
          deployment: deployConfig,
        });
      } catch (error) {
        consola.warn(`Failed to create ${configFile}:`, error);
      }
    }

    const packageJsonPath = path.join(projectPath, "package.json");
    if (await pathExists(packageJsonPath)) {
      const packageJson = await readJSON(packageJsonPath);

      if (!packageJson.scripts) packageJson.scripts = {};

      switch (config.deploymentMethod) {
        case "cloudflare-pages":
          packageJson.scripts.deploy = "wrangler pages deploy dist";
          packageJson.scripts["deploy:preview"] =
            "wrangler pages deploy dist --compatibility-date=2023-05-18";
          break;
        case "vercel":
          packageJson.scripts.deploy = "vercel --prod";
          packageJson.scripts["deploy:preview"] = "vercel";
          break;
        case "netlify":
          packageJson.scripts.deploy = "netlify deploy --prod --dir=dist";
          packageJson.scripts["deploy:preview"] = "netlify deploy --dir=dist";
          break;
        case "github-pages":
          packageJson.scripts["deploy:gh-pages"] = "gh-pages -d dist";
          break;
      }

      await writeJSON(packageJsonPath, packageJson, { spaces: 2 });
    }

    consola.success(`${deployConfig.name} deployment configuration added!`);

    const nextSteps = getDeploymentNextSteps(config.deploymentMethod);
    if (nextSteps.length > 0) {
      consola.box({
        title: `${deployConfig.name} Setup`,
        message: `Next steps:\n${nextSteps.map((step, i) => `${i + 1}. ${step}`).join("\n")}`,
      });
    }
  } catch (error) {
    consola.error(`Failed to setup ${deployConfig.name} deployment:`, error);
  }
}

/**
 * Get next steps for deployment setup
 * @param deploymentMethod - Deployment method identifier
 * @returns List of next steps
 */
function getDeploymentNextSteps(deploymentMethod: string): string[] {
  switch (deploymentMethod) {
    case "cloudflare-pages":
      return [
        "Install Wrangler CLI: npm install -g wrangler",
        "Login to Cloudflare: wrangler login",
        "Create Pages project: wrangler pages project create <project-name>",
        "Deploy: npm run deploy",
      ];
    case "azure-static":
      return [
        "Create Azure Static Web Apps resource in Azure portal",
        "Configure GitHub repository connection",
        "Update workflow file with your app details",
        "Push to trigger deployment",
      ];
    case "vercel":
      return [
        "Install Vercel CLI: npm install -g vercel",
        "Login to Vercel: vercel login",
        "Deploy: npm run deploy",
      ];
    case "netlify":
      return [
        "Install Netlify CLI: npm install -g netlify-cli",
        "Login to Netlify: netlify login",
        "Connect site: netlify init",
        "Deploy: npm run deploy",
      ];
    case "github-pages":
      return [
        "Enable GitHub Pages in repository settings",
        "Configure workflow permissions for GITHUB_TOKEN",
        "Push to trigger deployment workflow",
      ];
    default:
      return [];
  }
}

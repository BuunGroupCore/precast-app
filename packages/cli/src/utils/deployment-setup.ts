import path from "path";

import { consola } from "consola";
import fsExtra from "fs-extra";

import type { ProjectConfig } from "../../../shared/stack-config.js";
import type { TemplateEngine } from "../core/template-engine.js";

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

  const isMonorepo = config.backend && config.backend !== "none" && config.backend !== "next-api";

  let deploymentType: "static" | "fullstack" | "api" | "hybrid" = "fullstack";
  if (config.backend === "none" && config.database === "none") {
    deploymentType = "static";
  } else if (config.backend !== "none" && config.database === "none") {
    deploymentType = "api";
  } else if (
    config.framework === "next" ||
    config.framework === "nuxt" ||
    config.framework === "remix"
  ) {
    deploymentType = "hybrid";
  }

  let deploymentPath = projectPath;
  let buildCommand = deployConfig.buildCommand || "npm run build";
  let outputDir = deployConfig.outputDir || "dist";

  if (isMonorepo) {
    deploymentPath = path.join(projectPath, "apps", "web");
    buildCommand = "npm run build";
    outputDir = "dist";

    if (config.backend === "cloudflare-workers") {
      // Workers has its own deployment in apps/workers
      consola.info(
        "Cloudflare Workers backend has its own deployment configuration in apps/workers"
      );
    }
  }

  try {
    for (const configFile of deployConfig.configFiles) {
      const templatePath = `deployment/${config.deploymentMethod}/${configFile}.hbs`;
      const outputPath = path.join(deploymentPath, configFile);

      try {
        await templateEngine.processTemplate(templatePath, outputPath, {
          ...config,
          deployment: {
            ...deployConfig,
            buildCommand,
            outputDir,
          },
          isMonorepo,
          deploymentType,
        });
      } catch (error) {
        consola.warn(`Failed to create ${configFile}:`, error);
      }
    }

    const packageJsonPath = path.join(projectPath, "package.json");
    if (await pathExists(packageJsonPath)) {
      const packageJson = await readJSON(packageJsonPath);

      if (!packageJson.scripts) packageJson.scripts = {};

      if (isMonorepo) {
        switch (config.deploymentMethod) {
          case "cloudflare-pages":
            packageJson.scripts["deploy:web"] = "cd apps/web && wrangler pages deploy dist";
            packageJson.scripts["deploy:web:preview"] =
              "cd apps/web && wrangler pages deploy dist --compatibility-date=2023-05-18";
            if (config.backend === "cloudflare-workers") {
              packageJson.scripts["deploy:workers"] = "cd apps/workers && wrangler deploy";
              packageJson.scripts["deploy:workers:preview"] =
                "cd apps/workers && wrangler deploy --env preview";
              packageJson.scripts.deploy = "npm run deploy:web && npm run deploy:workers";
            } else {
              packageJson.scripts.deploy = "npm run deploy:web";
            }
            break;
          case "vercel":
            packageJson.scripts["deploy:web"] = "vercel --prod --cwd apps/web";
            packageJson.scripts["deploy:web:preview"] = "vercel --cwd apps/web";
            packageJson.scripts.deploy = "npm run deploy:web";
            break;
          case "netlify":
            packageJson.scripts["deploy:web"] = "netlify deploy --prod --dir=apps/web/dist";
            packageJson.scripts["deploy:web:preview"] = "netlify deploy --dir=apps/web/dist";
            packageJson.scripts.deploy = "npm run deploy:web";
            break;
          case "github-pages":
            packageJson.scripts["deploy:gh-pages"] = "gh-pages -d apps/web/dist";
            break;
        }
      } else {
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
      }

      await writeJSON(packageJsonPath, packageJson, { spaces: 2 });
    }

    consola.success(`${deployConfig.name} deployment configuration added!`);

    const nextSteps = getDeploymentNextSteps(
      config.deploymentMethod,
      isMonorepo || undefined,
      config.backend
    );
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
 * @param isMonorepo - Whether this is a monorepo project
 * @param backend - Backend type if applicable
 * @returns List of next steps
 */
function getDeploymentNextSteps(
  deploymentMethod: string,
  isMonorepo?: boolean,
  backend?: string
): string[] {
  const steps: string[] = [];

  switch (deploymentMethod) {
    case "cloudflare-pages":
      steps.push(
        "Install Wrangler CLI: npm install -g wrangler",
        "Login to Cloudflare: wrangler login"
      );

      if (isMonorepo) {
        steps.push("Create Pages project: wrangler pages project create <project-name>");

        if (backend === "cloudflare-workers") {
          steps.push(
            "Deploy frontend: npm run deploy:web",
            "Deploy Workers backend: npm run deploy:workers",
            "Or deploy both: npm run deploy"
          );
        } else {
          steps.push("Deploy frontend: npm run deploy:web");
        }
      } else {
        steps.push(
          "Create Pages project: wrangler pages project create <project-name>",
          "Deploy: npm run deploy"
        );
      }
      break;

    case "vercel":
      steps.push("Install Vercel CLI: npm install -g vercel", "Login to Vercel: vercel login");

      if (isMonorepo) {
        steps.push("Link project: cd apps/web && vercel link", "Deploy: npm run deploy:web");
      } else {
        steps.push("Deploy: npm run deploy");
      }
      break;

    case "netlify":
      steps.push(
        "Install Netlify CLI: npm install -g netlify-cli",
        "Login to Netlify: netlify login"
      );

      if (isMonorepo) {
        steps.push("Connect site: cd apps/web && netlify init", "Deploy: npm run deploy:web");
      } else {
        steps.push("Connect site: netlify init", "Deploy: npm run deploy");
      }
      break;

    case "azure-static":
      steps.push(
        "Create Azure Static Web Apps resource in Azure portal",
        "Configure GitHub repository connection",
        "Update workflow file with your app details",
        "Push to trigger deployment"
      );
      break;

    case "github-pages":
      steps.push(
        "Enable GitHub Pages in repository settings",
        "Configure workflow permissions for GITHUB_TOKEN",
        "Push to trigger deployment workflow"
      );
      break;
  }

  return steps;
}

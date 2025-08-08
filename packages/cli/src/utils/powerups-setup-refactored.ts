/**
 * Refactored powerups setup that delegates to individual generators
 * This is an example of how to migrate from the monolithic powerups-setup.ts
 */

import { consola } from "consola";

import type { ProjectConfig } from "../../../shared/stack-config.js";
import { generateSentryTemplate } from "../generators/powerups/sentry-generator.js";
// Import other generators as they are created:
// import { generatePosthogTemplate } from "../generators/powerups/posthog-generator.js";
// import { generateStorybookTemplate } from "../generators/powerups/storybook-generator.js";
// etc...

export async function setupPowerUpsRefactored(
  projectPath: string,
  framework: string,
  powerUpIds: string[],
  typescript: boolean = true,
  packageManager: string = "npm"
): Promise<void> {
  consola.info(`⚡ Setting up power-ups: ${powerUpIds.join(", ")}`);

  for (const powerUpId of powerUpIds) {
    try {
      switch (powerUpId) {
        case "sentry":
          await generateSentryTemplate({
            framework,
            typescript,
            projectPath,
            packageManager,
          });
          break;

        // Add cases for other powerups as they are migrated:
        /*
        case "posthog":
          await generatePosthogTemplate({
            framework,
            typescript,
            projectPath,
            packageManager,
          });
          break;

        case "storybook":
          await generateStorybookTemplate({
            framework,
            typescript,
            projectPath,
            packageManager,
          });
          break;

        case "vitest":
          await generateVitestTemplate({
            framework,
            typescript,
            projectPath,
            packageManager,
          });
          break;

        case "playwright":
          await generatePlaywrightTemplate({
            framework,
            typescript,
            projectPath,
            packageManager,
          });
          break;
        */

        // For powerups not yet migrated, fall back to the old system
        default:
          consola.warn(`Power-up ${powerUpId} not yet migrated to new generator system`);
        // You could call the old setupPowerUps function here for backwards compatibility
        // await setupPowerUpsLegacy(projectPath, framework, [powerUpId], typescript);
      }
    } catch (error) {
      consola.error(`Failed to setup ${powerUpId}:`, error);
      // Continue with other powerups even if one fails
    }
  }

  consola.success("✅ Power-ups setup complete!");
}

/**
 * Helper function to check if a powerup is compatible with a framework
 */
export function isPowerUpCompatible(powerUpId: string, framework: string): boolean {
  const compatibility: Record<string, string[]> = {
    sentry: [
      "react",
      "next",
      "vue",
      "nuxt",
      "angular",
      "svelte",
      "solid",
      "remix",
      "astro",
      "vite",
      "vanilla",
    ],
    posthog: ["react", "next", "vue", "nuxt", "angular", "svelte", "solid", "remix", "astro"],
    storybook: ["react", "vue", "angular", "svelte"],
    vitest: ["react", "vue", "solid", "svelte", "vite"],
    playwright: ["*"], // Compatible with all frameworks
    prettier: ["*"],
    eslint: ["*"],
    husky: ["*"],
    // Add more as needed
  };

  const supportedFrameworks = compatibility[powerUpId];
  if (!supportedFrameworks) {
    return false;
  }

  return supportedFrameworks.includes("*") || supportedFrameworks.includes(framework);
}

/**
 * Get available powerups for a given framework
 */
export function getAvailablePowerUps(framework: string): string[] {
  const allPowerUps = [
    "sentry",
    "posthog",
    "storybook",
    "prettier",
    "eslint",
    "husky",
    "vitest",
    "playwright",
    // Add more as they are migrated
  ];

  return allPowerUps.filter((powerUp) => isPowerUpCompatible(powerUp, framework));
}

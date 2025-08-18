import path from "path";

import { select, confirm, cancel, intro, outro, spinner } from "@clack/prompts";
import chalk from "chalk";
import cliWidth from "cli-width";
import gradient from "gradient-string";

import { FeatureRegistry, type DetectedProject } from "@/utils/features/feature-registry.js";
import { FeatureInstaller } from "@/utils/features/feature-installer.js";
import { theme } from "@/utils/ui/cli-theme.js";
import { EnhancedUI } from "@/utils/ui/enhanced-ui.js";

interface AddOptions {
  feature?: string;
  force?: boolean;
  dryRun?: boolean;
  skipDependencies?: boolean;
  theme?: string;
  noSocial?: boolean;
  noExample?: boolean;
  list?: boolean;
  search?: string;
  check?: string;
  verbose?: boolean;
  ui?: string;
  auth?: string;
  apiClient?: string;
  ai?: string;
  plugin?: string;
  typescript?: boolean;
}

/**
 * Display enhanced feature list with comic book styling
 */
function displayFeatureList(features: any[], title: string): void {
  const termWidth = cliWidth({ defaultWidth: 80 });
  const boxWidth = Math.min(termWidth - 4, 80);

  console.log();
  console.log(theme.accent("━".repeat(boxWidth)));
  console.log(theme.primary.bold(`  [ADD] ${title}`));
  console.log(theme.accent("━".repeat(boxWidth)));
  console.log();

  features.forEach((feature, index) => {
    const icon = getFeatureIcon(feature.category);
    const statusColor = feature.status === "available" ? theme.success : theme.warning;
    const status = feature.status || "available";

    console.log(
      `  ${theme.info.bold((index + 1).toString().padStart(2))}. ${icon} ${theme.bold(feature.name)}`
    );
    console.log(`      ${theme.muted(feature.description)}`);
    console.log(
      `      ${theme.muted("Category:")} ${theme.secondary(feature.category)} ${theme.muted("•")} ${theme.muted("Status:")} ${statusColor(status)}`
    );

    if (feature.tags && feature.tags.length > 0) {
      const tags = feature.tags
        .slice(0, 4)
        .map((tag: string) => theme.dim(`#${tag}`))
        .join(" ");
      console.log(`      ${theme.muted("Tags:")} ${tags}`);
    }
    console.log();
  });

  console.log(theme.accent("━".repeat(boxWidth)));
  console.log();
}

/**
 * Display compatibility check results
 */
function displayCompatibilityCheck(
  feature: any,
  project: DetectedProject,
  compatibility: any
): void {
  const termWidth = cliWidth({ defaultWidth: 80 });
  const boxWidth = Math.min(termWidth - 4, 70);

  console.log();
  console.log(theme.accent("━".repeat(boxWidth)));
  console.log(theme.info.bold(`  [CHECK] COMPATIBILITY CHECK: ${feature.name}`));
  console.log(theme.accent("━".repeat(boxWidth)));
  console.log();

  // Project info
  console.log(theme.secondary.bold("  [PROJECT] Detected Project:"));
  console.log(`    ${theme.success("◆")} Framework: ${theme.bold(project.framework)}`);
  if (project.backend) {
    console.log(`    ${theme.success("◆")} Backend: ${theme.bold(project.backend)}`);
  }
  if (project.authProvider) {
    console.log(`    ${theme.success("◆")} Auth: ${theme.bold(project.authProvider)}`);
  }
  console.log(
    `    ${theme.success("◆")} Styling: ${theme.bold(project.styling.join(", ") || "none")}`
  );
  console.log(
    `    ${theme.success("◆")} TypeScript: ${theme.bold(project.typescript ? "Yes" : "No")}`
  );
  console.log();

  // Compatibility results
  if (compatibility.compatible) {
    console.log(theme.success.bold("  [OK] COMPATIBLE"));
    console.log(`    ${theme.success("This feature is fully compatible with your project!")}`);
  } else {
    console.log(theme.error.bold("  [ERR] NOT COMPATIBLE"));
    console.log(`    ${theme.error("The following issues were found:")}`);
    compatibility.reasons.forEach((reason: string) => {
      console.log(`    ${theme.error("•")} ${theme.muted(reason)}`);
    });
  }

  console.log();
  console.log(theme.accent("━".repeat(boxWidth)));
  console.log();
}

/**
 * Display installation summary
 */
function displayInstallationSummary(feature: any, project: DetectedProject): void {
  const termWidth = cliWidth({ defaultWidth: 80 });
  const boxWidth = Math.min(termWidth - 4, 70);

  console.log();
  console.log(theme.accent("━".repeat(boxWidth)));
  console.log(theme.primary.bold("  💥 INSTALLATION SUMMARY"));
  console.log(theme.accent("━".repeat(boxWidth)));
  console.log();

  console.log(theme.info.bold("  📦 Feature:"));
  console.log(`    ${theme.accent("◆")} ${theme.bold(feature.name)} v${feature.version}`);
  console.log(`    ${theme.accent("◆")} ${theme.muted(feature.description)}`);
  console.log();

  console.log(theme.info.bold("  📁 Installation Path:"));
  const basePath = project.monorepo ? "apps/web/src" : "src";
  console.log(
    `    ${theme.success("◆")} ${theme.bold(path.join(basePath, "features", feature.id))}`
  );
  console.log();

  if (feature.dependencies?.required) {
    const deps = Object.keys(feature.dependencies.required);
    if (deps.length > 0) {
      console.log(theme.info.bold("  📚 Dependencies:"));
      deps.forEach((dep: string) => {
        console.log(`    ${theme.warning("◆")} ${theme.bold(dep)}`);
      });
      console.log();
    }
  }

  console.log(theme.accent("━".repeat(boxWidth)));
  console.log();
}

/**
 * Get icon for feature category
 */
function getFeatureIcon(category: string): string {
  const icons: Record<string, string> = {
    authentication: "🔐",
    dashboard: "📊",
    payments: "💳",
    ui: "🎨",
    utils: "🔧",
    default: "⚡",
  };
  return icons[category] || icons.default;
}

/**
 * Add a feature to an existing project
 */
export async function addCommand(featureId: string | undefined, options: AddOptions) {
  const ui = new EnhancedUI({ debug: options.verbose });

  // Show beautiful intro
  intro(theme.gradient.precast("🚀 Add Feature to Project"));

  try {
    const cliPath = process.cwd();
    const projectPath = process.cwd();

    // Initialize feature system
    const registry = new FeatureRegistry(cliPath);
    await registry.loadFeatures();

    // Handle list command
    if (options.list) {
      const features = registry.getFeatures();
      displayFeatureList(features, "AVAILABLE FEATURES");
      outro(theme.success("✨ Use 'precast add <feature-id>' to install a feature"));
      return;
    }

    // Handle search command
    if (options.search) {
      const features = registry.searchFeatures(options.search);
      if (features.length === 0) {
        console.log(theme.warning(`No features found matching "${options.search}"`));
        return;
      }
      displayFeatureList(features, `SEARCH RESULTS: "${options.search}"`);
      outro(theme.success("✨ Use 'precast add <feature-id>' to install a feature"));
      return;
    }

    // Detect current project
    const s = spinner();
    s.start("🔍 Analyzing your project...");

    let project: DetectedProject;
    try {
      project = await registry.detectProject(projectPath);
      s.stop("✅ Project analysis complete");
    } catch (error) {
      s.stop(theme.error("❌ Failed to analyze project"));
      cancel(theme.error("This doesn't appear to be a valid project directory"));
      return;
    }

    // Handle check command
    if (options.check) {
      const feature = registry.getFeature(options.check);
      if (!feature) {
        cancel(theme.error(`Feature "${options.check}" not found`));
        return;
      }

      const compatibility = registry.isCompatible(feature, project);
      displayCompatibilityCheck(feature, project, compatibility);

      if (compatibility.compatible) {
        outro(theme.success("🎉 This feature is compatible with your project!"));
      } else {
        outro(theme.error("💥 This feature is not compatible with your project"));
      }
      return;
    }

    // Get feature ID (prompt if not provided)
    let selectedFeatureId = featureId;

    if (!selectedFeatureId) {
      const compatibleFeatures = registry
        .getCompatibleFeatures(project)
        .filter(({ compatibility }) => compatibility.compatible)
        .map(({ feature }) => ({
          value: feature.id,
          label: `${getFeatureIcon(feature.category)} ${feature.name}`,
          hint: feature.description,
        }));

      if (compatibleFeatures.length === 0) {
        cancel(theme.warning("No compatible features found for your project"));
        return;
      }

      selectedFeatureId = (await select({
        message: "Which feature would you like to add?",
        options: compatibleFeatures,
      })) as string;

      if (typeof selectedFeatureId === "symbol") {
        cancel("Operation cancelled");
        return;
      }
    }

    // Get feature
    const feature = registry.getFeature(selectedFeatureId);
    if (!feature) {
      cancel(theme.error(`Feature "${selectedFeatureId}" not found`));
      return;
    }

    // Check compatibility
    const compatibility = registry.isCompatible(feature, project);
    if (!compatibility.compatible) {
      console.log(theme.error.bold("❌ COMPATIBILITY ERROR"));
      compatibility.reasons.forEach((reason) => {
        console.log(`  ${theme.error("•")} ${reason}`);
      });
      cancel("Feature is not compatible with your project");
      return;
    }

    // Show installation summary
    displayInstallationSummary(feature, project);

    // Confirm installation
    const shouldInstall = await confirm({
      message: `Install ${theme.bold(feature.name)}?`,
      initialValue: true,
    });

    if (!shouldInstall || typeof shouldInstall === "symbol") {
      cancel("Installation cancelled");
      return;
    }

    // Install feature
    const installer = new FeatureInstaller(cliPath);
    const installOptions = {
      force: options.force,
      dryRun: options.dryRun,
      skipDependencies: options.skipDependencies,
      configuration: {
        theme: options.theme || "blue",
        enableSocialLogin: !options.noSocial,
        enableExample: !options.noExample,
      },
    };

    const installSpinner = spinner();
    installSpinner.start(`🚀 Installing ${feature.name}...`);

    try {
      await installer.installFeature(feature, project, installOptions);
      installSpinner.stop(theme.success("✅ Installation complete!"));

      // Success outro with next steps
      console.log();
      console.log(theme.gradient.precast("🎉 Feature installed successfully!"));
      console.log();
      console.log(theme.info.bold("📚 Quick Start:"));
      feature.usage.quickStart.forEach((step: string, index: number) => {
        console.log(`  ${theme.accent((index + 1).toString())}. ${step}`);
      });

      if (feature.usage.examples.length > 0) {
        console.log();
        console.log(theme.info.bold("💡 Example Usage:"));
        console.log(theme.dim(`  ${feature.usage.examples[0].code.split("\n")[0]}`));
      }

      outro(theme.success("Happy coding! 🚀"));
    } catch (error) {
      installSpinner.stop(theme.error("❌ Installation failed"));
      cancel(
        theme.error(
          `Installation error: ${error instanceof Error ? error.message : "Unknown error"}`
        )
      );
    }
  } catch (error) {
    cancel(theme.error(`Error: ${error instanceof Error ? error.message : "Unknown error"}`));
  }
}

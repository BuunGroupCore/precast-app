import cliWidth from "cli-width";

import { FeatureRegistry } from "@/utils/features/feature-registry.js";
import { theme } from "@/utils/ui/cli-theme.js";

interface ListOptions {
  category?: string;
  search?: string;
  verbose?: boolean;
  format?: "table" | "grid" | "compact";
}

/**
 * Display enhanced feature list with comic book styling
 */
function displayFeatureGrid(features: any[], title: string): void {
  const termWidth = cliWidth({ defaultWidth: 80 });
  const boxWidth = Math.min(termWidth - 4, 80);

  console.log();
  console.log(theme.accent("━".repeat(boxWidth)));
  console.log(theme.primary.bold(`  [LIST] ${title}`));
  console.log(theme.accent("━".repeat(boxWidth)));
  console.log();

  // Group features by category
  const categorizedFeatures = features.reduce((acc, feature) => {
    const category = feature.category || "other";
    if (!acc[category]) acc[category] = [];
    acc[category].push(feature);
    return acc;
  }, {});

  // Sort categories
  const sortedCategories = Object.keys(categorizedFeatures).sort();

  sortedCategories.forEach((category, categoryIndex) => {
    const categoryFeatures = categorizedFeatures[category];
    const categoryIcon = getCategoryIcon(category);

    console.log(theme.secondary.bold(`  ${categoryIcon} ${category.toUpperCase()}`));
    console.log(theme.muted(`  ${theme.dim("─".repeat(category.length + 4))}`));
    console.log();

    categoryFeatures.forEach((feature: any, index: number) => {
      const statusColor = getStatusColor(feature.status);
      const status = feature.status || "available";

      console.log(
        `    ${theme.info.bold((index + 1).toString().padStart(2))}. ${theme.bold(feature.name)}`
      );
      console.log(`        ${theme.muted(feature.description)}`);
      console.log(
        `        ${theme.muted("Status:")} ${statusColor(status)} ${theme.muted("•")} ${theme.muted("Version:")} ${theme.accent(feature.version || "1.0.0")}`
      );

      if (feature.tags && feature.tags.length > 0) {
        const tags = feature.tags
          .slice(0, 3)
          .map((tag: string) => theme.dim(`#${tag}`))
          .join(" ");
        console.log(`        ${theme.muted("Tags:")} ${tags}`);
      }

      // Show compatibility info
      if (feature.compatibility?.frameworks) {
        const frameworks = feature.compatibility.frameworks.slice(0, 4).join(", ");
        console.log(`        ${theme.muted("Works with:")} ${theme.success(frameworks)}`);
      }

      console.log();
    });

    // Add separator between categories (except last)
    if (categoryIndex < sortedCategories.length - 1) {
      console.log(theme.dim("  " + "─".repeat(boxWidth - 4)));
      console.log();
    }
  });

  console.log(theme.accent("━".repeat(boxWidth)));
  console.log();
}

/**
 * Display features in compact table format
 */
function displayFeatureTable(features: any[]): void {
  const termWidth = cliWidth({ defaultWidth: 80 });

  console.log();
  console.log(theme.primary.bold("  [PKG] AVAILABLE FEATURES"));
  console.log(theme.accent("━".repeat(Math.min(termWidth - 4, 70))));
  console.log();

  // Table headers
  console.log(
    `  ${theme.bold("NAME").padEnd(20)} ${theme.bold("CATEGORY").padEnd(15)} ${theme.bold("STATUS").padEnd(12)} ${theme.bold("DESCRIPTION")}`
  );
  console.log(
    `  ${theme.dim("─".repeat(20))} ${theme.dim("─".repeat(15))} ${theme.dim("─".repeat(12))} ${theme.dim("─".repeat(25))}`
  );

  features.forEach((feature) => {
    const name = feature.name.length > 18 ? feature.name.slice(0, 15) + "..." : feature.name;
    const category =
      (feature.category || "other").length > 13
        ? (feature.category || "other").slice(0, 10) + "..."
        : feature.category || "other";
    const statusColor = getStatusColor(feature.status);
    const status = (feature.status || "available").padEnd(12);
    const description =
      feature.description.length > 30
        ? feature.description.slice(0, 27) + "..."
        : feature.description;

    console.log(
      `  ${theme.info(name.padEnd(20))} ${theme.secondary(category.padEnd(15))} ${statusColor(status)} ${theme.muted(description)}`
    );
  });

  console.log();
  console.log(theme.accent("━".repeat(Math.min(termWidth - 4, 70))));
  console.log();
}

/**
 * Display features in compact list format
 */
function displayCompactList(features: any[]): void {
  console.log();
  console.log(theme.primary.bold("  [REF] QUICK REFERENCE"));
  console.log(theme.accent("━".repeat(50)));
  console.log();

  features.forEach((feature, index) => {
    const statusColor = getStatusColor(feature.status);
    const categoryIcon = getCategoryIcon(feature.category);

    console.log(
      `  ${theme.info.bold((index + 1).toString().padStart(2))}. ${categoryIcon} ${theme.bold(feature.name)} ${statusColor("●")}`
    );
    console.log(`      ${theme.dim(`precast add ${feature.id}`)}`);
    if (index < features.length - 1) console.log();
  });

  console.log();
  console.log(theme.accent("━".repeat(50)));
  console.log();
}

/**
 * Get icon for feature category
 */
function getCategoryIcon(category: string): string {
  const icons: Record<string, string> = {
    authentication: "[AUTH]",
    dashboard: "[DASH]",
    payments: "[PAY]",
    ui: "[UI]",
    utils: "[UTIL]",
    database: "[DB]",
    analytics: "[STATS]",
    communication: "[MAIL]",
    storage: "[STORE]",
    deployment: "[DEPLOY]",
    testing: "[TEST]",
    monitoring: "[WATCH]",
    default: "[FEAT]",
  };
  return icons[category] || icons.default;
}

/**
 * Get status color function
 */
function getStatusColor(status: string) {
  switch (status) {
    case "stable":
    case "available":
      return theme.success;
    case "beta":
    case "experimental":
      return theme.warning;
    case "deprecated":
    case "disabled":
      return theme.error;
    default:
      return theme.info;
  }
}

/**
 * Display usage instructions
 */
function displayUsageInstructions(): void {
  console.log(theme.info.bold("  [INFO] USAGE INSTRUCTIONS"));
  console.log(theme.accent("━".repeat(50)));
  console.log();
  console.log(
    `  ${theme.accent("◆")} Install a feature: ${theme.bold("precast add <feature-id>")}`
  );
  console.log(
    `  ${theme.accent("◆")} Search features: ${theme.bold("precast list --search <term>")}`
  );
  console.log(
    `  ${theme.accent("◆")} Filter by category: ${theme.bold("precast list --category <category>")}`
  );
  console.log(
    `  ${theme.accent("◆")} Check compatibility: ${theme.bold("precast add <feature-id> --check")}`
  );
  console.log();
  console.log(theme.accent("━".repeat(50)));
  console.log();
}

/**
 * Display statistics summary
 */
function displayStatistics(features: any[]): void {
  const stats = {
    total: features.length,
    stable: features.filter(
      (f) => (f.status || "available") === "available" || (f.status || "available") === "stable"
    ).length,
    beta: features.filter(
      (f) => (f.status || "available") === "beta" || (f.status || "available") === "experimental"
    ).length,
    categories: [...new Set(features.map((f) => f.category || "other"))].length,
  };

  console.log(theme.info.bold("  [STATS] FEATURE STATISTICS"));
  console.log(theme.accent("━".repeat(45)));
  console.log();
  console.log(`  ${theme.success("◆")} Total Features: ${theme.bold(stats.total)}`);
  console.log(`  ${theme.success("◆")} Stable/Available: ${theme.bold(stats.stable)}`);
  console.log(`  ${theme.warning("◆")} Beta/Experimental: ${theme.bold(stats.beta)}`);
  console.log(`  ${theme.info("◆")} Categories: ${theme.bold(stats.categories)}`);
  console.log();
  console.log(theme.accent("━".repeat(45)));
  console.log();
}

/**
 * List all available downloadable components/features
 */
export async function listCommand(options: ListOptions = {}) {
  const { category, search, verbose = false, format = "grid" } = options;

  try {
    // Initialize feature registry
    const cliPath = process.cwd();
    const registry = new FeatureRegistry(cliPath);
    await registry.loadFeatures();

    // Get all features
    let features = registry.getFeatures();

    // Apply filters
    if (category) {
      features = features.filter(
        (f) => (f.category || "other").toLowerCase() === category.toLowerCase()
      );
    }

    if (search) {
      features = registry.searchFeatures(search);
    }

    // Show header
    console.log();
    console.log(theme.gradient.precast("[PRECAST] COMPONENT LIBRARY"));
    console.log();

    if (features.length === 0) {
      if (search) {
        console.log(theme.warning(`  No features found matching "${search}"`));
      } else if (category) {
        console.log(theme.warning(`  No features found in category "${category}"`));
      } else {
        console.log(theme.warning("  No features available"));
      }
      console.log();
      return;
    }

    // Display features based on format
    switch (format) {
      case "table":
        displayFeatureTable(features);
        break;
      case "compact":
        displayCompactList(features);
        break;
      case "grid":
      default:
        displayFeatureGrid(
          features,
          search
            ? `SEARCH RESULTS: "${search}"`
            : category
              ? `${category.toUpperCase()} FEATURES`
              : "AVAILABLE FEATURES"
        );
        break;
    }

    // Show statistics if verbose
    if (verbose) {
      displayStatistics(features);
    }

    // Show usage instructions
    displayUsageInstructions();

    // Success message
    console.log(
      theme.success(
        `[OK] Found ${features.length} available feature${features.length === 1 ? "" : "s"}!`
      )
    );
    console.log();
  } catch (error) {
    console.log();
    console.log(theme.error.bold("[ERR] FAILED TO LOAD FEATURES"));
    console.log(theme.accent("━".repeat(50)));
    console.log();
    console.log(theme.error(`Error: ${error instanceof Error ? error.message : "Unknown error"}`));
    console.log();
    console.log(
      theme.info(
        "[TIP] Make sure you're in a Precast project directory or the CLI is properly installed."
      )
    );
    console.log();
    process.exit(1);
  }
}

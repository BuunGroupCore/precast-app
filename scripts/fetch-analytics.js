/**
 * Fetch analytics data from Google Analytics 4 and save to JSON/CSV files
 * This script runs via GitHub Actions every 6 hours
 */
/* eslint-disable no-console */

import fs from "fs";
import path from "path";

import { BetaAnalyticsDataClient } from "@google-analytics/data";

// GA4 Configuration
const GA_PROPERTY_ID = process.env.GA_PROPERTY_ID;
const GA_SERVICE_ACCOUNT_KEY = process.env.GA_SERVICE_ACCOUNT_KEY;

if (!GA_PROPERTY_ID || !GA_SERVICE_ACCOUNT_KEY) {
  console.error("❌ Missing required environment variables:");
  console.error("   GA_PROPERTY_ID:", GA_PROPERTY_ID ? "✓" : "✗");
  console.error("   GA_SERVICE_ACCOUNT_KEY:", GA_SERVICE_ACCOUNT_KEY ? "✓" : "✗");
  process.exit(1);
}

// Initialize GA4 client
const credentials = JSON.parse(GA_SERVICE_ACCOUNT_KEY);
const analyticsDataClient = new BetaAnalyticsDataClient({ credentials });

/**
 * Fetch framework and stack data from GA4
 */
async function fetchFrameworkData() {
  console.log("🔍 Fetching framework data...");

  try {
    // First, try with custom dimensions
    const [response] = await analyticsDataClient.runReport({
      property: `properties/${GA_PROPERTY_ID}`,
      dateRanges: [{ startDate: "30daysAgo", endDate: "today" }],
      dimensions: [
        { name: "customEvent:framework" },
        { name: "customEvent:backend" },
        { name: "customEvent:database" },
        { name: "customEvent:styling" },
        { name: "customEvent:ui_library" },
      ],
      metrics: [{ name: "eventCount" }, { name: "totalUsers" }],
      dimensionFilter: {
        filter: {
          fieldName: "eventName",
          stringFilter: { value: "project_created" },
        },
      },
      orderBys: [{ metric: { metricName: "eventCount" }, desc: true }],
    });

    return response.rows || [];
  } catch (error) {
    console.warn(
      "⚠️ Custom dimensions not available yet, falling back to basic event data:",
      error.message
    );

    // Fallback: just get basic event counts
    try {
      const [response] = await analyticsDataClient.runReport({
        property: `properties/${GA_PROPERTY_ID}`,
        dateRanges: [{ startDate: "30daysAgo", endDate: "today" }],
        dimensions: [{ name: "eventName" }],
        metrics: [{ name: "eventCount" }, { name: "totalUsers" }],
        dimensionFilter: {
          filter: {
            fieldName: "eventName",
            stringFilter: { value: "project_created" },
          },
        },
      });

      return response.rows || [];
    } catch (fallbackError) {
      console.error("❌ Error fetching basic framework data:", fallbackError.message);
      return [];
    }
  }
}

/**
 * Fetch feature adoption data
 */
async function fetchFeatureData() {
  console.log("🔍 Fetching feature adoption data...");

  try {
    const [response] = await analyticsDataClient.runReport({
      property: `properties/${GA_PROPERTY_ID}`,
      dateRanges: [{ startDate: "30daysAgo", endDate: "today" }],
      dimensions: [
        { name: "eventName" }, // Use standard dimension instead of custom ones that might not exist yet
      ],
      metrics: [{ name: "eventCount" }, { name: "totalUsers" }],
      dimensionFilter: {
        filter: {
          fieldName: "eventName",
          stringFilter: { value: "feature_added" },
        },
      },
    });

    return response.rows || [];
  } catch (error) {
    console.warn(
      "⚠️ Feature data not available (likely no feature_added events yet):",
      error.message
    );
    return [];
  }
}

/**
 * Fetch overall metrics
 */
async function fetchOverallMetrics() {
  console.log("🔍 Fetching overall metrics...");

  try {
    const [response] = await analyticsDataClient.runReport({
      property: `properties/${GA_PROPERTY_ID}`,
      dateRanges: [{ startDate: "30daysAgo", endDate: "today" }],
      dimensions: [{ name: "eventName" }],
      metrics: [{ name: "eventCount" }, { name: "totalUsers" }],
    });

    return response.rows || [];
  } catch (error) {
    console.error("❌ Error fetching overall metrics:", error.message);
    return [];
  }
}

/**
 * Process and structure the analytics data
 */
function processAnalyticsData(frameworkData, featureData, overallData) {
  const stats = {
    updated: new Date().toISOString(),
    lastUpdatedFormatted: new Date().toLocaleString("en-US", {
      timeZone: "UTC",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZoneName: "short",
    }),
    totals: {
      projects: 0,
      users: 0,
      totalEvents: 0,
    },
    frameworks: {},
    backends: {},
    databases: {},
    styling: {},
    uiLibraries: {},
    features: {},
    popularStacks: [],
    topCombinations: {
      reactStacks: [],
      fullStack: [],
      frontendOnly: [],
    },
  };

  // Process overall metrics
  overallData.forEach((row) => {
    const eventName = row.dimensionValues[0].value;
    const eventCount = parseInt(row.metricValues[0].value);
    const users = parseInt(row.metricValues[1].value);

    stats.totals.totalEvents += eventCount;

    if (eventName === "project_created") {
      stats.totals.projects = eventCount;
      stats.totals.users = Math.max(stats.totals.users, users);
    }
  });

  // Process framework/stack data
  frameworkData.forEach((row) => {
    const framework = row.dimensionValues[0].value || "unknown";
    const backend = row.dimensionValues[1].value || "none";
    const database = row.dimensionValues[2].value || "none";
    const styling = row.dimensionValues[3].value || "css";
    const uiLibrary = row.dimensionValues[4].value || "none";

    const eventCount = parseInt(row.metricValues[0].value);
    const users = parseInt(row.metricValues[1].value);

    // Aggregate by category
    stats.frameworks[framework] = (stats.frameworks[framework] || 0) + eventCount;
    stats.backends[backend] = (stats.backends[backend] || 0) + eventCount;
    stats.databases[database] = (stats.databases[database] || 0) + eventCount;
    stats.styling[styling] = (stats.styling[styling] || 0) + eventCount;
    stats.uiLibraries[uiLibrary] = (stats.uiLibraries[uiLibrary] || 0) + eventCount;

    // Store popular combinations
    const stackCombo = {
      framework,
      backend,
      database,
      styling,
      uiLibrary,
      count: eventCount,
      users,
      percentage: 0, // Will calculate after processing all data
    };

    stats.popularStacks.push(stackCombo);

    // Categorize combinations
    if (framework === "react" || framework === "next") {
      stats.topCombinations.reactStacks.push(stackCombo);
    }

    if (backend !== "none" && database !== "none") {
      stats.topCombinations.fullStack.push(stackCombo);
    } else {
      stats.topCombinations.frontendOnly.push(stackCombo);
    }
  });

  // Process feature adoption data
  featureData.forEach((row) => {
    const featureType = row.dimensionValues[0].value || "unknown";
    const eventCount = parseInt(row.metricValues[0].value);

    stats.features[featureType] = (stats.features[featureType] || 0) + eventCount;
  });

  // Sort and calculate percentages
  stats.popularStacks = stats.popularStacks
    .sort((a, b) => b.count - a.count)
    .slice(0, 20)
    .map((stack) => ({
      ...stack,
      percentage: ((stack.count / stats.totals.projects) * 100).toFixed(1),
    }));

  // Sort category data
  stats.topCombinations.reactStacks = stats.topCombinations.reactStacks
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  stats.topCombinations.fullStack = stats.topCombinations.fullStack
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  stats.topCombinations.frontendOnly = stats.topCombinations.frontendOnly
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  return stats;
}

/**
 * Convert data to CSV format
 */
function convertToCSV(stats) {
  const csvData = [];

  // Header
  csvData.push("Category,Item,Count,Percentage");

  // Frameworks
  Object.entries(stats.frameworks)
    .sort(([, a], [, b]) => b - a)
    .forEach(([framework, count]) => {
      const percentage = ((count / stats.totals.projects) * 100).toFixed(1);
      csvData.push(`Framework,${framework},${count},${percentage}%`);
    });

  // Databases
  Object.entries(stats.databases)
    .sort(([, a], [, b]) => b - a)
    .forEach(([database, count]) => {
      const percentage = ((count / stats.totals.projects) * 100).toFixed(1);
      csvData.push(`Database,${database},${count},${percentage}%`);
    });

  // Styling
  Object.entries(stats.styling)
    .sort(([, a], [, b]) => b - a)
    .forEach(([styling, count]) => {
      const percentage = ((count / stats.totals.projects) * 100).toFixed(1);
      csvData.push(`Styling,${styling},${count},${percentage}%`);
    });

  // UI Libraries
  Object.entries(stats.uiLibraries)
    .sort(([, a], [, b]) => b - a)
    .forEach(([library, count]) => {
      const percentage = ((count / stats.totals.projects) * 100).toFixed(1);
      csvData.push(`UI Library,${library},${count},${percentage}%`);
    });

  return csvData.join("\n");
}

/**
 * Ensure data directory exists and validate paths
 */
function ensureDataDirectory() {
  const dataDir = path.join(process.cwd(), "data");

  // Security: Ensure we're only working with the data directory
  if (!dataDir.endsWith("/data") && !dataDir.endsWith("\\data")) {
    throw new Error("❌ Security: Invalid data directory path");
  }

  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
    console.log("📁 Created data directory");
  }
}

/**
 * Validate file path is within data directory
 */
function validateDataPath(filePath) {
  const resolvedPath = path.resolve(filePath);
  const dataDir = path.resolve(process.cwd(), "data");

  if (!resolvedPath.startsWith(dataDir)) {
    throw new Error(`❌ Security: Attempted to write outside data directory: ${filePath}`);
  }

  // Additional check: ensure filename is expected
  const allowedFiles = ["analytics.json", "analytics.csv"];
  const filename = path.basename(resolvedPath);

  if (!allowedFiles.includes(filename)) {
    throw new Error(
      `❌ Security: Invalid filename: ${filename}. Only ${allowedFiles.join(", ")} are allowed`
    );
  }

  return resolvedPath;
}

/**
 * Main function
 */
async function main() {
  console.log("🚀 Starting analytics data fetch...");

  try {
    // Ensure directory exists
    ensureDataDirectory();

    // Fetch data from GA4
    const [frameworkData, featureData, overallData] = await Promise.all([
      fetchFrameworkData(),
      fetchFeatureData(),
      fetchOverallMetrics(),
    ]);

    console.log(`📊 Fetched ${frameworkData.length} framework records`);
    console.log(`🔧 Fetched ${featureData.length} feature records`);
    console.log(`📈 Fetched ${overallData.length} overall records`);

    // Process the data
    const stats = processAnalyticsData(frameworkData, featureData, overallData);

    // Save JSON file
    const jsonPath = validateDataPath(path.join(process.cwd(), "data", "analytics.json"));
    fs.writeFileSync(jsonPath, JSON.stringify(stats, null, 2));
    console.log(`💾 Saved JSON data to ${jsonPath}`);

    // Save CSV file
    const csvData = convertToCSV(stats);
    const csvPath = validateDataPath(path.join(process.cwd(), "data", "analytics.csv"));
    fs.writeFileSync(csvPath, csvData);
    console.log(`📊 Saved CSV data to ${csvPath}`);

    // Log summary
    console.log("\n📈 Analytics Summary:");
    console.log(`   Total Projects: ${stats.totals.projects.toLocaleString()}`);
    console.log(`   Total Users: ${stats.totals.users.toLocaleString()}`);
    console.log(`   Total Events: ${stats.totals.totalEvents.toLocaleString()}`);
    console.log(
      `   Top Framework: ${Object.entries(stats.frameworks).sort(([, a], [, b]) => b - a)[0]?.[0] || "N/A"}`
    );
    console.log(`   Last Updated: ${stats.lastUpdatedFormatted}`);

    console.log("\n✅ Analytics data updated successfully!");
  } catch (error) {
    console.error("❌ Error updating analytics:", error);
    process.exit(1);
  }
}

// Run the script
main();

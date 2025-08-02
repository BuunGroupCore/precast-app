#!/usr/bin/env node

import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";
import { createCoreTests } from "./tests/core.test.js";
import { createProjectGenerationTests } from "./tests/project-generation.test.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface TestConfig {
  suites: string[];
  tags?: string[];
  pattern?: string;
  reportFormat?: "json" | "junit" | "html";
  reportPath?: string;
  parallel?: boolean;
  verbose?: boolean;
}

async function main() {
  const args = process.argv.slice(2);

  // Parse command line arguments
  const config: TestConfig = {
    suites: ["core", "generation"],
    reportFormat: "json",
    parallel: false,
    verbose: false,
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    switch (arg) {
      case "--suites":
        config.suites = args[++i].split(",");
        break;
      case "--tags":
        config.tags = args[++i].split(",");
        break;
      case "--pattern":
        config.pattern = args[++i];
        break;
      case "--report-format":
        config.reportFormat = args[++i] as "json" | "junit" | "html";
        break;
      case "--report-path":
        config.reportPath = args[++i];
        break;
      case "--parallel":
        config.parallel = true;
        break;
      case "--verbose":
        config.verbose = true;
        break;
      case "--help":
        printHelp();
        process.exit(0);
    }
  }

  console.log("🚀 CLI Test Framework v1.0.0\n");

  if (config.verbose) {
    console.log("Configuration:", JSON.stringify(config, null, 2));
  }

  // Ensure CLI is built
  const cliDistPath = path.resolve(process.cwd(), "dist/index.js");
  if (!(await fs.pathExists(cliDistPath))) {
    console.error('❌ CLI not built. Run "bun run build" first.');
    console.error(`Looking for CLI at: ${cliDistPath}`);
    process.exit(1);
  }

  // Create test suites
  const suites = [];

  if (config.suites.includes("core")) {
    suites.push({
      name: "Core CLI Tests",
      suite: createCoreTests(),
    });
  }

  if (config.suites.includes("generation")) {
    suites.push({
      name: "Project Generation Tests",
      suite: createProjectGenerationTests(),
    });
  }

  if (suites.length === 0) {
    console.error("❌ No test suites selected");
    process.exit(1);
  }

  // Run tests
  const allResults = [];
  let totalPassed = 0;
  let totalFailed = 0;
  let totalDuration = 0;

  const startTime = Date.now();

  if (config.parallel && suites.length > 1) {
    console.log("🔄 Running test suites in parallel...\n");

    const promises = suites.map(async ({ name, suite }) => {
      console.log(`📋 Starting ${name}...`);

      const options: any = {};
      if (config.tags) options.tags = config.tags;
      if (config.pattern) options.pattern = new RegExp(config.pattern);

      return suite.run(options);
    });

    const results = await Promise.all(promises);
    results.forEach((result) => allResults.push(...result));
  } else {
    console.log("🔄 Running test suites sequentially...\n");

    for (const { name, suite } of suites) {
      console.log(`📋 Running ${name}...`);

      const options: any = {};
      if (config.tags) options.tags = config.tags;
      if (config.pattern) options.pattern = new RegExp(config.pattern);

      const results = await suite.run(options);
      allResults.push(...results);

      console.log(); // Add spacing between suites
    }
  }

  // Calculate totals
  totalPassed = allResults.filter((r) => r.passed).length;
  totalFailed = allResults.filter((r) => !r.passed).length;
  totalDuration = Date.now() - startTime;

  // Print final summary
  console.log("🏁 Final Results:");
  console.log(`   Total Tests: ${allResults.length}`);
  console.log(`   Passed: ${totalPassed}`);
  console.log(`   Failed: ${totalFailed}`);
  console.log(`   Duration: ${totalDuration}ms`);

  if (totalFailed > 0) {
    console.log("\n❌ Failed Tests:");
    allResults
      .filter((r) => !r.passed)
      .forEach((r) => {
        console.log(`   • ${r.name}: ${r.error}`);
      });
  }

  // Generate report if requested
  if (config.reportPath) {
    const reportData = {
      summary: {
        total: allResults.length,
        passed: totalPassed,
        failed: totalFailed,
        duration: totalDuration,
        timestamp: new Date().toISOString(),
      },
      tests: allResults,
      config,
    };

    let reportContent: string;

    switch (config.reportFormat) {
      case "json":
        reportContent = JSON.stringify(reportData, null, 2);
        break;
      case "junit":
        reportContent = generateJUnitReport(reportData);
        break;
      case "html":
        reportContent = generateHTMLReport(reportData);
        break;
      default:
        reportContent = JSON.stringify(reportData, null, 2);
    }

    await fs.ensureDir(path.dirname(config.reportPath));
    await fs.writeFile(config.reportPath, reportContent);
    console.log(`\n📊 Report saved to: ${config.reportPath}`);
  }

  // Exit with appropriate code
  process.exit(totalFailed > 0 ? 1 : 0);
}

function printHelp() {
  console.log(`
CLI Test Framework

Usage: test-runner [options]

Options:
  --suites <suites>        Comma-separated list of test suites (core,generation)
  --tags <tags>           Run only tests with specified tags
  --pattern <pattern>     Run only tests matching regex pattern
  --report-format <fmt>   Report format: json, junit, html (default: json)
  --report-path <path>    Path to save test report
  --parallel              Run test suites in parallel
  --verbose               Verbose output
  --help                  Show this help message

Examples:
  test-runner                                    # Run all tests
  test-runner --suites core                     # Run only core tests
  test-runner --tags validation,error-handling  # Run tests with specific tags
  test-runner --pattern "React.*"               # Run tests matching pattern
  test-runner --report-path ./reports/test.json # Save JSON report
  test-runner --parallel --verbose              # Parallel execution with verbose output
`);
}

function generateJUnitReport(data: any): string {
  const { summary, tests } = data;

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<testsuite name="CLI Tests" tests="${summary.total}" failures="${summary.failed}" time="${summary.duration / 1000}" timestamp="${summary.timestamp}">`;

  for (const test of tests) {
    xml += `
  <testcase name="${escapeXML(test.name)}" time="${test.duration / 1000}">`;

    if (!test.passed) {
      xml += `
    <failure message="${escapeXML(test.error || "Test failed")}">${escapeXML(test.error || "Test failed")}</failure>`;
    }

    xml += `
  </testcase>`;
  }

  xml += `
</testsuite>`;

  return xml;
}

function generateHTMLReport(data: any): string {
  const { summary, tests } = data;

  return `
<!DOCTYPE html>
<html>
<head>
  <title>CLI Test Report</title>
  <meta charset="utf-8">
  <style>
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      margin: 0; padding: 20px; background: #f5f5f5;
    }
    .container { max-width: 1200px; margin: 0 auto; }
    .header { background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin: 20px 0; }
    .stat { background: white; padding: 20px; border-radius: 8px; text-align: center; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    .stat-value { font-size: 2em; font-weight: bold; margin-bottom: 5px; }
    .stat-label { color: #666; }
    .passed .stat-value { color: #4CAF50; }
    .failed .stat-value { color: #f44336; }
    .duration .stat-value { color: #2196F3; }
    .test-results { background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    .test { padding: 15px 20px; border-bottom: 1px solid #eee; }
    .test:last-child { border-bottom: none; }
    .test.passed { border-left: 4px solid #4CAF50; }
    .test.failed { border-left: 4px solid #f44336; }
    .test-name { font-weight: 600; margin-bottom: 5px; }
    .test-duration { color: #666; font-size: 0.9em; }
    .test-error { color: #f44336; font-family: monospace; font-size: 0.9em; margin-top: 10px; padding: 10px; background: #ffeaea; border-radius: 4px; }
    .filters { margin: 20px 0; }
    .filter-input { padding: 8px 12px; border: 1px solid #ddd; border-radius: 4px; margin-right: 10px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🧪 CLI Test Report</h1>
      <p>Generated on ${new Date(summary.timestamp).toLocaleString()}</p>
    </div>

    <div class="summary">
      <div class="stat">
        <div class="stat-value">${summary.total}</div>
        <div class="stat-label">Total Tests</div>
      </div>
      <div class="stat passed">
        <div class="stat-value">${summary.passed}</div>
        <div class="stat-label">Passed</div>
      </div>
      <div class="stat failed">
        <div class="stat-value">${summary.failed}</div>
        <div class="stat-label">Failed</div>
      </div>
      <div class="stat duration">
        <div class="stat-value">${(summary.duration / 1000).toFixed(2)}s</div>
        <div class="stat-label">Duration</div>
      </div>
    </div>

    <div class="filters">
      <input type="text" class="filter-input" id="testFilter" placeholder="Filter tests...">
      <button onclick="filterTests('passed')">Show Passed</button>
      <button onclick="filterTests('failed')">Show Failed</button>
      <button onclick="filterTests('all')">Show All</button>
    </div>

    <div class="test-results">
      ${tests
        .map(
          (test: any) => `
        <div class="test ${test.passed ? "passed" : "failed"}" data-name="${escapeHTML(test.name)}">
          <div class="test-name">${escapeHTML(test.name)}</div>
          <div class="test-duration">${test.duration}ms</div>
          ${test.error ? `<div class="test-error">${escapeHTML(test.error)}</div>` : ""}
        </div>
      `,
        )
        .join("")}
    </div>
  </div>

  <script>
    function filterTests(type) {
      const tests = document.querySelectorAll('.test');
      tests.forEach(test => {
        if (type === 'all') {
          test.style.display = 'block';
        } else {
          test.style.display = test.classList.contains(type) ? 'block' : 'none';
        }
      });
    }

    document.getElementById('testFilter').addEventListener('input', function(e) {
      const filter = e.target.value.toLowerCase();
      const tests = document.querySelectorAll('.test');
      tests.forEach(test => {
        const name = test.getAttribute('data-name').toLowerCase();
        test.style.display = name.includes(filter) ? 'block' : 'none';
      });
    });
  </script>
</body>
</html>`;
}

function escapeXML(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function escapeHTML(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// Run if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    console.error("❌ Test runner failed:", error);
    process.exit(1);
  });
}

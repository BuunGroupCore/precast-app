#!/usr/bin/env node

import path from "path";
import { fileURLToPath } from "url";

// Import all test suites
import { createCoreTests } from "./tests/core.test.js";
import { createFrameworkGenerationTests } from "./tests/framework-generation.test.js";
import { createGeneratorStructureTests } from "./tests/generator-structure.test.js";
import { createProjectGenerationTests } from "./tests/project-generation.test.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  const args = process.argv.slice(2);
  const options = {
    tags: [] as string[],
    suites: [] as string[],
    verbose: false,
    reportPath: "",
    reportFormat: "json" as "json" | "junit" | "html",
  };

  // Parse command line arguments
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === "--tags") {
      options.tags = args[++i]?.split(",") || [];
    } else if (arg === "--suites") {
      options.suites = args[++i]?.split(",") || [];
    } else if (arg === "--verbose") {
      options.verbose = true;
    } else if (arg === "--report-path") {
      options.reportPath = args[++i] || "";
    } else if (arg === "--report-format") {
      options.reportFormat = (args[++i] as any) || "json";
    }
  }

  // Create test suites
  const suites = [];

  if (options.suites.length === 0 || options.suites.includes("core")) {
    suites.push(createCoreTests());
  }

  if (options.suites.length === 0 || options.suites.includes("generation")) {
    suites.push(createProjectGenerationTests());
    suites.push(createFrameworkGenerationTests());
    suites.push(createGeneratorStructureTests());
  }

  let totalPassed = 0;
  let totalFailed = 0;
  let allResults: any[] = [];

  // Run all test suites
  for (const suite of suites) {
    const results = await suite.run({ tags: options.tags });
    const passed = results.filter((r) => r.passed).length;
    const failed = results.filter((r) => !r.passed).length;

    totalPassed += passed;
    totalFailed += failed;
    allResults = allResults.concat(results);
  }

  // Generate report if requested
  if (options.reportPath && suites.length > 0) {
    const report = suites[0].generateReport(options.reportFormat);

    // Write report to file
    const fs = await import("fs-extra");
    await fs.ensureDir(path.dirname(options.reportPath));
    await fs.writeFile(options.reportPath, report);
    console.log(`📝 Report written to ${options.reportPath}`);
  }

  console.log(`\n🏁 Final Results: ${totalPassed} passed, ${totalFailed} failed`);

  // Exit with appropriate code
  process.exit(totalFailed > 0 ? 1 : 0);
}

main().catch((error) => {
  console.error("❌ Test runner failed:", error);
  process.exit(1);
});

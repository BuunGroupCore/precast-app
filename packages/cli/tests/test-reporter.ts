import { writeFileSync } from "fs";
import path from "path";

import { SMART_TEST_COMBINATIONS } from "../generated-tests/smart-combinations";
import { runCLI, projectExists } from "../src/test-utils";

interface TestResult {
  name: string;
  command: string;
  exitCode: number;
  success: boolean;
  duration: number;
  stdout: string;
  stderr: string;
  projectCreated: boolean;
  error?: string;
}

export async function generateTestReport() {
  const results: TestResult[] = [];
  const startTime = Date.now();

  console.log("🧪 Running comprehensive CLI test report...\n");

  // Test each critical combination
  for (const combination of SMART_TEST_COMBINATIONS.critical) {
    const projectName = `test-report-${combination.name}`;
    const args = [
      "init",
      projectName,
      `--framework=${combination.framework}`,
      `--backend=${combination.backend}`,
      `--database=${combination.database}`,
      `--orm=${combination.orm}`,
      `--styling=${combination.styling}`,
      `--runtime=${combination.runtime}`,
      combination.typescript ? "" : "--no-typescript",
      "--no-git",
      "--yes",
    ].filter(Boolean);

    const command = `create-precast-app ${args.join(" ")}`;
    console.log(`Testing: ${combination.name}`);
    console.log(`Command: ${command}`);

    const testStart = Date.now();
    const result = runCLI(args);
    const duration = Date.now() - testStart;
    const created = projectExists(projectName);

    const testResult: TestResult = {
      name: combination.name,
      command,
      exitCode: result.exitCode,
      success: result.exitCode === 0 && created,
      duration,
      stdout: result.stdout,
      stderr: result.stderr,
      projectCreated: created,
    };

    if (!testResult.success) {
      testResult.error = result.stderr || "Project not created";
    }

    results.push(testResult);

    console.log(`Result: ${testResult.success ? "✅ PASS" : "❌ FAIL"}`);
    console.log(`Duration: ${duration}ms`);
    console.log(`Project Created: ${created}`);
    if (testResult.error) {
      console.log(`Error: ${testResult.error}`);
    }
    console.log("---\n");

    // Cleanup
    if (created) {
      const { rmSync } = await import("fs");
      rmSync(projectName, { recursive: true, force: true });
    }
  }

  const totalDuration = Date.now() - startTime;

  // Generate report
  const report = {
    timestamp: new Date().toISOString(),
    totalDuration,
    totalTests: results.length,
    passed: results.filter((r) => r.success).length,
    failed: results.filter((r) => !r.success).length,
    results,
    summary: {
      successRate: `${Math.round((results.filter((r) => r.success).length / results.length) * 100)}%`,
      averageDuration: Math.round(results.reduce((sum, r) => sum + r.duration, 0) / results.length),
      frameworks: {
        react: results.filter((r) => r.name.includes("react")).filter((r) => r.success).length,
        vue: results.filter((r) => r.name.includes("vue")).filter((r) => r.success).length,
        next: results.filter((r) => r.name.includes("next")).filter((r) => r.success).length,
        svelte: results.filter((r) => r.name.includes("svelte")).filter((r) => r.success).length,
      },
      backends: {
        none: results.filter((r) => r.name.includes("frontend-only")).filter((r) => r.success)
          .length,
        express: results.filter((r) => r.name.includes("express")).filter((r) => r.success).length,
        nestjs: results.filter((r) => r.name.includes("nestjs")).filter((r) => r.success).length,
        fastify: results.filter((r) => r.name.includes("fastify")).filter((r) => r.success).length,
        hono: results.filter((r) => r.name.includes("hono")).filter((r) => r.success).length,
      },
    },
  };

  // Save JSON report
  const reportPath = path.join(process.cwd(), "test-report.json");
  writeFileSync(reportPath, JSON.stringify(report, null, 2));

  // Generate markdown report
  const markdown = `# CLI Test Report

Generated: ${report.timestamp}

## Summary

- **Total Tests**: ${report.totalTests}
- **Passed**: ${report.passed} ✅
- **Failed**: ${report.failed} ❌
- **Success Rate**: ${report.summary.successRate}
- **Total Duration**: ${Math.round(report.totalDuration / 1000)}s
- **Average Test Duration**: ${report.summary.averageDuration}ms

## Framework Results

- React: ${report.summary.frameworks.react} passed
- Vue: ${report.summary.frameworks.vue} passed
- Next.js: ${report.summary.frameworks.next} passed
- Svelte: ${report.summary.frameworks.svelte} passed

## Backend Results

- Frontend Only: ${report.summary.backends.none} passed
- Express: ${report.summary.backends.express} passed
- NestJS: ${report.summary.backends.nestjs} passed
- Fastify: ${report.summary.backends.fastify} passed
- Hono: ${report.summary.backends.hono} passed

## Detailed Results

| Test Name | Command | Exit Code | Duration | Success | Error |
|-----------|---------|-----------|----------|---------|-------|
${results
  .map(
    (r) =>
      `| ${r.name} | \`${r.command.substring(0, 50)}...\` | ${r.exitCode} | ${r.duration}ms | ${
        r.success ? "✅" : "❌"
      } | ${r.error || "-"} |`
  )
  .join("\n")}

## Failed Tests Details

${results
  .filter((r) => !r.success)
  .map(
    (r) => `### ${r.name}

**Command**: \`${r.command}\`

**Exit Code**: ${r.exitCode}

**Error**: ${r.error}

**Stderr**:
\`\`\`
${r.stderr || "No stderr output"}
\`\`\`

**Stdout**:
\`\`\`
${r.stdout.substring(0, 500)}...
\`\`\`
`
  )
  .join("\n")}
`;

  const mdPath = path.join(process.cwd(), "test-report.md");
  writeFileSync(mdPath, markdown);

  console.log("\n📊 Test Report Summary:");
  console.log(`Total Tests: ${report.totalTests}`);
  console.log(`Passed: ${report.passed} ✅`);
  console.log(`Failed: ${report.failed} ❌`);
  console.log(`Success Rate: ${report.summary.successRate}`);
  console.log(`\nReports saved to:`);
  console.log(`- JSON: ${reportPath}`);
  console.log(`- Markdown: ${mdPath}`);

  return report;
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  generateTestReport().catch(console.error);
}

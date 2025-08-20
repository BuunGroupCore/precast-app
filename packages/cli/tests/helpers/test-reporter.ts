import { writeFile } from "fs/promises";
import path from "path";

/**
 * Test result for a single test
 */
export interface TestResult {
  name: string;
  suite: string;
  status: "pass" | "fail" | "skip";
  duration: number;
  error?: string;
  timestamp: Date;
}

/**
 * Test suite summary
 */
export interface TestSuiteSummary {
  name: string;
  total: number;
  passed: number;
  failed: number;
  skipped: number;
  duration: number;
  successRate: number;
}

/**
 * Overall test report
 */
export interface TestReport {
  timestamp: Date;
  totalTests: number;
  totalPassed: number;
  totalFailed: number;
  totalSkipped: number;
  totalDuration: number;
  successRate: number;
  suites: TestSuiteSummary[];
  results: TestResult[];
  cleanupStatus: {
    tempDirsCreated: number;
    tempDirsCleaned: number;
    leftoverDirs: string[];
  };
}

/**
 * TestReporter generates and updates markdown reports for test results.
 * Maintains a single report file that gets updated with each test run.
 */
export class TestReporter {
  private reportPath: string;
  private results: TestResult[] = [];
  private startTime: Date;
  private cleanupTracking = {
    created: new Set<string>(),
    cleaned: new Set<string>(),
  };
  private hasGeneratedReport = false;

  constructor(reportPath: string = "TEST_REPORT.md") {
    this.reportPath = path.resolve(process.cwd(), reportPath);
    this.startTime = new Date();
  }

  /**
   * Records a test result
   */
  addTestResult(result: TestResult): void {
    this.results.push(result);
  }

  /**
   * Tracks temporary directory creation
   */
  trackTempDirCreated(dir: string): void {
    this.cleanupTracking.created.add(dir);
  }

  /**
   * Tracks temporary directory cleanup
   */
  trackTempDirCleaned(dir: string): void {
    this.cleanupTracking.cleaned.add(dir);
  }

  /**
   * Generates a comprehensive test report
   */
  async generateReport(): Promise<TestReport> {
    const suites = this.calculateSuiteSummaries();
    const totalDuration = Date.now() - this.startTime.getTime();

    // Check for leftover directories
    const leftoverDirs = Array.from(this.cleanupTracking.created).filter(
      (dir) => !this.cleanupTracking.cleaned.has(dir)
    );

    const report: TestReport = {
      timestamp: new Date(),
      totalTests: this.results.length,
      totalPassed: this.results.filter((r) => r.status === "pass").length,
      totalFailed: this.results.filter((r) => r.status === "fail").length,
      totalSkipped: this.results.filter((r) => r.status === "skip").length,
      totalDuration,
      successRate:
        this.results.length > 0
          ? (this.results.filter((r) => r.status === "pass").length / this.results.length) * 100
          : 0,
      suites,
      results: this.results,
      cleanupStatus: {
        tempDirsCreated: this.cleanupTracking.created.size,
        tempDirsCleaned: this.cleanupTracking.cleaned.size,
        leftoverDirs,
      },
    };

    return report;
  }

  /**
   * Calculates summary statistics for each test suite
   */
  private calculateSuiteSummaries(): TestSuiteSummary[] {
    const suiteMap = new Map<string, TestResult[]>();

    // Group results by suite
    for (const result of this.results) {
      const suite = result.suite || "Unknown";
      if (!suiteMap.has(suite)) {
        suiteMap.set(suite, []);
      }
      suiteMap.get(suite)!.push(result);
    }

    // Calculate summaries
    const summaries: TestSuiteSummary[] = [];
    for (const [suiteName, suiteResults] of suiteMap.entries()) {
      const passed = suiteResults.filter((r) => r.status === "pass").length;
      const failed = suiteResults.filter((r) => r.status === "fail").length;
      const skipped = suiteResults.filter((r) => r.status === "skip").length;
      const duration = suiteResults.reduce((sum, r) => sum + r.duration, 0);

      summaries.push({
        name: suiteName,
        total: suiteResults.length,
        passed,
        failed,
        skipped,
        duration,
        successRate: suiteResults.length > 0 ? (passed / suiteResults.length) * 100 : 0,
      });
    }

    return summaries.sort((a, b) => a.name.localeCompare(b.name));
  }

  /**
   * Writes the report to a markdown file
   */
  async writeMarkdownReport(report: TestReport): Promise<void> {
    const markdown = this.generateMarkdown(report);
    await writeFile(this.reportPath, markdown, "utf8");
  }

  /**
   * Generates markdown content from the report
   */
  private generateMarkdown(report: TestReport): string {
    const formatDuration = (ms: number): string => {
      if (ms < 1000) return `${ms}ms`;
      if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
      return `${Math.floor(ms / 60000)}m ${Math.floor((ms % 60000) / 1000)}s`;
    };

    const formatDate = (date: Date): string => {
      return date.toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      });
    };

    const getStatusEmoji = (status: string): string => {
      switch (status) {
        case "pass":
          return "✅";
        case "fail":
          return "❌";
        case "skip":
          return "⏭️";
        default:
          return "❓";
      }
    };

    const getHealthEmoji = (successRate: number): string => {
      if (successRate >= 95) return "🟢";
      if (successRate >= 80) return "🟡";
      if (successRate >= 60) return "🟠";
      return "🔴";
    };

    let md = `# CLI Test Report

> Last Updated: ${formatDate(report.timestamp)}

## Summary

| Metric | Value | Status |
|--------|-------|--------|
| **Total Tests** | ${report.totalTests} | - |
| **Passed** | ${report.totalPassed} | ✅ |
| **Failed** | ${report.totalFailed} | ${report.totalFailed > 0 ? "❌" : "✅"} |
| **Skipped** | ${report.totalSkipped} | ${report.totalSkipped > 0 ? "⏭️" : "-"} |
| **Success Rate** | ${report.successRate.toFixed(1)}% | ${getHealthEmoji(report.successRate)} |
| **Total Duration** | ${formatDuration(report.totalDuration)} | - |

## Cleanup Status

| Metric | Value | Status |
|--------|-------|--------|
| **Temp Directories Created** | ${report.cleanupStatus.tempDirsCreated} | - |
| **Temp Directories Cleaned** | ${report.cleanupStatus.tempDirsCleaned} | ${report.cleanupStatus.tempDirsCleaned === report.cleanupStatus.tempDirsCreated ? "✅" : "⚠️"} |
| **Leftover Directories** | ${report.cleanupStatus.leftoverDirs.length} | ${report.cleanupStatus.leftoverDirs.length === 0 ? "✅ Clean" : "❌ " + report.cleanupStatus.leftoverDirs.length + " remaining"} |

`;

    if (report.cleanupStatus.leftoverDirs.length > 0) {
      md += `### ⚠️ Leftover Directories

The following directories were not cleaned up:
${report.cleanupStatus.leftoverDirs.map((dir) => `- \`${dir}\``).join("\n")}

`;
    }

    md += `## Test Suites

| Suite | Total | Passed | Failed | Skipped | Success Rate | Duration |
|-------|-------|--------|--------|---------|--------------|----------|
`;

    for (const suite of report.suites) {
      md += `| **${suite.name}** | ${suite.total} | ${suite.passed} ${suite.passed > 0 ? "✅" : ""} | ${suite.failed} ${suite.failed > 0 ? "❌" : ""} | ${suite.skipped} ${suite.skipped > 0 ? "⏭️" : ""} | ${suite.successRate.toFixed(1)}% ${getHealthEmoji(suite.successRate)} | ${formatDuration(suite.duration)} |\n`;
    }

    // Add failed tests details if any
    const failedTests = report.results.filter((r) => r.status === "fail");
    if (failedTests.length > 0) {
      md += `
## Failed Tests

| Test | Suite | Error | Duration |
|------|-------|-------|----------|
`;
      for (const test of failedTests) {
        const error = test.error
          ? test.error.substring(0, 100) + (test.error.length > 100 ? "..." : "")
          : "Unknown error";
        md += `| ${test.name} | ${test.suite} | \`${error}\` | ${formatDuration(test.duration)} |\n`;
      }
    }

    // Add detailed results table
    md += `
## Detailed Results

<details>
<summary>Click to expand all test results</summary>

| Status | Test Name | Suite | Duration |
|--------|-----------|-------|----------|
`;

    for (const result of report.results) {
      md += `| ${getStatusEmoji(result.status)} | ${result.name} | ${result.suite} | ${formatDuration(result.duration)} |\n`;
    }

    md += `
</details>

## Test Trends

\`\`\`
Success Rate Trend (last 5 runs):
${this.generateSuccessTrend(report.successRate)}
\`\`\`

## Quick Commands

\`\`\`bash
# Run all tests
pnpm test

# Run integration tests only
pnpm test:integration

# Run with quality checks
pnpm test:quality

# Run full test suite
pnpm test:full

# Check for leftover test directories
ls -la /tmp/ | grep precast-test- | wc -l
\`\`\`

---

*Generated by CLI Test Reporter at ${formatDate(new Date())}*
`;

    return md;
  }

  /**
   * Generates a simple ASCII success trend graph
   */
  private generateSuccessTrend(currentRate: number): string {
    // This would ideally read from historical data
    // For now, just show current
    const bars = Math.floor(currentRate / 10);
    const graph = "█".repeat(bars) + "░".repeat(10 - bars);
    return `Current: [${graph}] ${currentRate.toFixed(1)}%`;
  }

  /**
   * Updates the report file, preserving historical data if configured
   */
  async updateReport(): Promise<void> {
    // Only generate report once per test run
    if (this.hasGeneratedReport && this.results.length === 0) {
      return;
    }

    const report = await this.generateReport();
    await this.writeMarkdownReport(report);
    this.hasGeneratedReport = true;

    console.info(`\n📊 Test report updated: ${this.reportPath}`);
    console.info(`   Success rate: ${report.successRate.toFixed(1)}%`);
    console.info(
      `   Cleanup: ${report.cleanupStatus.tempDirsCleaned}/${report.cleanupStatus.tempDirsCreated} directories cleaned`
    );

    if (report.cleanupStatus.leftoverDirs.length > 0) {
      console.warn(`   ⚠️  ${report.cleanupStatus.leftoverDirs.length} directories not cleaned up`);
    }
  }
}

/**
 * Global test reporter instance
 */
export const globalReporter = new TestReporter();

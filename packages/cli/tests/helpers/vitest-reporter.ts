import type { File, Reporter, Task } from "vitest";

import { globalReporter } from "./test-reporter";

/**
 * Custom Vitest reporter that tracks test results in our global reporter.
 * This allows us to generate comprehensive markdown reports after test runs.
 */
export default class PrecastTestReporter implements Reporter {
  onInit(): void {
    console.log("📊 Custom test reporter initialized");
  }

  async onFinished(files: File[] = []): Promise<void> {
    console.log(`📊 Processing ${files.length} test files`);

    // Process all test files
    for (const file of files) {
      this.processFile(file);
    }

    // Generate final report after processing all tests
    const report = await globalReporter.generateReport();
    console.log(`📊 Captured ${report.totalTests} tests in reporter`);

    // Write the final report
    await globalReporter.writeMarkdownReport(report);
    console.info(`\n📊 Final test report written: TEST_REPORT.md`);
    console.info(
      `   Total: ${report.totalTests} | Passed: ${report.totalPassed} | Failed: ${report.totalFailed}`
    );
    console.info(`   Success rate: ${report.successRate.toFixed(1)}%`);
  }

  private processFile(file: File): void {
    // Process all tasks in the file
    if (file.tasks) {
      for (const task of file.tasks) {
        this.processTask(task, file.name);
      }
    }
  }

  private processTask(task: Task, fileName: string): void {
    // Handle test cases
    if (task.type === "test") {
      const suite = this.getSuiteName(task) || fileName;
      const duration = task.result?.duration || 0;
      const status = this.getTestStatus(task);
      const error = task.result?.errors?.[0]?.message;

      console.log(`📊 Recording test: ${task.name} (${status})`);

      globalReporter.addTestResult({
        name: task.name,
        suite,
        status,
        duration,
        error,
        timestamp: new Date(),
      });
    }

    // Handle test suites - process nested tasks
    if (task.type === "suite" && task.tasks) {
      for (const subtask of task.tasks) {
        this.processTask(subtask, fileName);
      }
    }
  }

  private getSuiteName(task: Task): string {
    // Build the full suite name by walking up the parent chain
    const names: string[] = [];
    let current = task.suite;

    while (current) {
      if (current.name) {
        names.unshift(current.name);
      }
      current = current.suite;
    }

    return names.join(" > ") || "Unknown Suite";
  }

  private getTestStatus(task: Task): "pass" | "fail" | "skip" {
    if (task.mode === "skip" || task.mode === "todo") {
      return "skip";
    }
    if (task.result?.state === "fail") {
      return "fail";
    }
    if (task.result?.state === "pass") {
      return "pass";
    }
    return "skip";
  }
}

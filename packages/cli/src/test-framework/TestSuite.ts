import { spawn } from "child_process";
import path from "path";

import { pathExists, readFile, ensureDir, remove } from "fs-extra";

export interface TestContext {
  tempDir: string;
  cliPath: string;
  cleanup: () => Promise<void>;
}

export interface TestResult {
  name: string;
  passed: boolean;
  error?: string;
  duration: number;
  output?: {
    stdout: string;
    stderr: string;
    exitCode: number | null;
  };
}

export interface CLIRunResult {
  exitCode: number | null;
  stdout: string;
  stderr: string;
  duration: number;
}

export class TestSuite {
  private tests: Array<{
    name: string;
    fn: (context: TestContext) => Promise<void>;
    timeout?: number;
    tags?: string[];
  }> = [];

  private beforeEachHooks: Array<(context: TestContext) => Promise<void>> = [];
  private afterEachHooks: Array<(context: TestContext) => Promise<void>> = [];
  private beforeAllHooks: Array<() => Promise<void>> = [];
  private afterAllHooks: Array<() => Promise<void>> = [];

  private results: TestResult[] = [];
  private context: TestContext | null = null;

  constructor(
    private cliPath: string,
    private baseTestDir: string = path.join(process.cwd(), "test-output")
  ) {}

  // Test registration
  test(
    name: string,
    fn: (context: TestContext) => Promise<void>,
    options: { timeout?: number; tags?: string[] } = {}
  ) {
    this.tests.push({
      name,
      fn,
      timeout: options.timeout || 30000,
      tags: options.tags || [],
    });
  }

  // Hooks
  beforeAll(fn: () => Promise<void>) {
    this.beforeAllHooks.push(fn);
  }

  afterAll(fn: () => Promise<void>) {
    this.afterAllHooks.push(fn);
  }

  beforeEach(fn: (context: TestContext) => Promise<void>) {
    this.beforeEachHooks.push(fn);
  }

  afterEach(fn: (context: TestContext) => Promise<void>) {
    this.afterEachHooks.push(fn);
  }

  // CLI execution
  async runCLI(
    args: string[],
    options: {
      input?: string;
      timeout?: number;
      cwd?: string;
      env?: Record<string, string>;
    } = {}
  ): Promise<CLIRunResult> {
    const startTime = Date.now();

    return new Promise((resolve) => {
      const child = spawn("node", [this.cliPath, ...args], {
        cwd: options.cwd || this.context?.tempDir,
        stdio: ["pipe", "pipe", "pipe"],
        env: { ...process.env, ...options.env },
      });

      let stdout = "";
      let stderr = "";

      child.stdout?.on("data", (data) => {
        stdout += data.toString();
      });

      child.stderr?.on("data", (data) => {
        stderr += data.toString();
      });

      // Send input immediately if provided
      if (options.input) {
        child.stdin?.write(options.input);
      }
      child.stdin?.end();

      child.on("close", (code) => {
        resolve({
          exitCode: code,
          stdout,
          stderr,
          duration: Date.now() - startTime,
        });
      });

      child.on("error", () => {
        resolve({
          exitCode: null,
          stdout,
          stderr,
          duration: Date.now() - startTime,
        });
      });

      // Timeout handling
      const timeout = setTimeout(() => {
        child.kill("SIGKILL");
        resolve({
          exitCode: null,
          stdout,
          stderr,
          duration: Date.now() - startTime,
        });
      }, options.timeout || 15000);

      child.on("close", () => clearTimeout(timeout));
    });
  }

  // Assertions
  async expect(actual: any, expected: any, message?: string) {
    if (actual !== expected) {
      throw new Error(message || `Expected ${expected}, got ${actual}`);
    }
  }

  async expectContains(text: string, substring: string, message?: string) {
    if (!text.includes(substring)) {
      throw new Error(message || `Expected "${text}" to contain "${substring}"`);
    }
  }

  async expectNotContains(text: string, substring: string, message?: string) {
    if (text.includes(substring)) {
      throw new Error(message || `Expected "${text}" to not contain "${substring}"`);
    }
  }

  async expectFileExists(filePath: string, message?: string) {
    const fullPath = path.isAbsolute(filePath)
      ? filePath
      : path.join(this.context!.tempDir, filePath);

    if (!(await pathExists(fullPath))) {
      throw new Error(message || `File ${filePath} does not exist`);
    }
  }

  async expectFileNotExists(filePath: string, message?: string) {
    const fullPath = path.isAbsolute(filePath)
      ? filePath
      : path.join(this.context!.tempDir, filePath);

    if (await pathExists(fullPath)) {
      throw new Error(message || `File ${filePath} should not exist`);
    }
  }

  async expectFileContains(filePath: string, content: string, message?: string) {
    const fullPath = path.isAbsolute(filePath)
      ? filePath
      : path.join(this.context!.tempDir, filePath);

    const fileContent = await readFile(fullPath, "utf-8");
    if (!fileContent.includes(content)) {
      throw new Error(message || `File ${filePath} does not contain "${content}"`);
    }
  }

  async expectFileNotContains(filePath: string, content: string, message?: string) {
    const fullPath = path.isAbsolute(filePath)
      ? filePath
      : path.join(this.context!.tempDir, filePath);

    const fileContent = await readFile(fullPath, "utf-8");
    if (fileContent.includes(content)) {
      throw new Error(message || `File ${filePath} should not contain "${content}"`);
    }
  }

  async expectExitCode(result: CLIRunResult, expectedCode: number, message?: string) {
    if (result.exitCode !== expectedCode) {
      throw new Error(message || `Expected exit code ${expectedCode}, got ${result.exitCode}`);
    }
  }

  // Test execution
  async run(options: { tags?: string[]; pattern?: RegExp } = {}): Promise<TestResult[]> {
    console.log("🧪 Starting CLI Test Suite\n");

    // Run beforeAll hooks
    for (const hook of this.beforeAllHooks) {
      await hook();
    }

    // Filter tests
    let testsToRun = this.tests;
    if (options.tags) {
      testsToRun = testsToRun.filter((test) =>
        test.tags?.some((tag) => options.tags!.includes(tag))
      );
    }
    if (options.pattern) {
      testsToRun = testsToRun.filter((test) => options.pattern!.test(test.name));
    }

    for (const test of testsToRun) {
      const startTime = Date.now();

      try {
        console.log(`  ⏳ ${test.name}`);

        // Setup test context
        const tempDir = path.join(
          this.baseTestDir,
          `test-${Date.now()}-${Math.random().toString(36).slice(2)}`
        );
        await ensureDir(tempDir);

        this.context = {
          tempDir,
          cliPath: this.cliPath,
          cleanup: async () => {
            await remove(tempDir);
          },
        };

        // Run beforeEach hooks
        for (const hook of this.beforeEachHooks) {
          await hook(this.context);
        }

        // Run test with timeout
        await Promise.race([
          test.fn(this.context),
          new Promise((_, reject) =>
            setTimeout(() => reject(new Error("Test timeout")), test.timeout!)
          ),
        ]);

        // Run afterEach hooks
        for (const hook of this.afterEachHooks) {
          await hook(this.context);
        }

        // Cleanup
        await this.context.cleanup();

        const result: TestResult = {
          name: test.name,
          passed: true,
          duration: Date.now() - startTime,
        };

        this.results.push(result);
        console.log(`  ✅ ${test.name} (${result.duration}ms)`);
      } catch (error) {
        // Cleanup on error
        if (this.context) {
          await this.context.cleanup().catch(() => {});
        }

        const result: TestResult = {
          name: test.name,
          passed: false,
          error: error instanceof Error ? error.message : String(error),
          duration: Date.now() - startTime,
        };

        this.results.push(result);
        console.log(`  ❌ ${test.name} (${result.duration}ms)`);
        console.log(`     Error: ${result.error}`);
      }
    }

    // Run afterAll hooks
    for (const hook of this.afterAllHooks) {
      await hook();
    }

    // Print summary
    const passed = this.results.filter((r) => r.passed).length;
    const failed = this.results.filter((r) => !r.passed).length;
    const totalDuration = this.results.reduce((sum, r) => sum + r.duration, 0);

    console.log(`\n📊 Test Results: ${passed} passed, ${failed} failed (${totalDuration}ms total)`);

    if (failed > 0) {
      console.log("\n❌ Failed Tests:");
      this.results
        .filter((r) => !r.passed)
        .forEach((r) => {
          console.log(`  • ${r.name}: ${r.error}`);
        });
    }

    return this.results;
  }

  // Generate test report
  generateReport(format: "json" | "junit" | "html" = "json"): string {
    switch (format) {
      case "json":
        return JSON.stringify(
          {
            summary: {
              total: this.results.length,
              passed: this.results.filter((r) => r.passed).length,
              failed: this.results.filter((r) => !r.passed).length,
              duration: this.results.reduce((sum, r) => sum + r.duration, 0),
            },
            tests: this.results,
          },
          null,
          2
        );

      case "junit":
        return this.generateJUnitReport();

      case "html":
        return this.generateHTMLReport();

      default:
        throw new Error(`Unsupported report format: ${format}`);
    }
  }

  private generateJUnitReport(): string {
    const total = this.results.length;
    const failures = this.results.filter((r) => !r.passed).length;
    const duration = this.results.reduce((sum, r) => sum + r.duration, 0) / 1000;

    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<testsuite name="CLI Tests" tests="${total}" failures="${failures}" time="${duration}">`;

    for (const result of this.results) {
      xml += `
  <testcase name="${result.name}" time="${result.duration / 1000}">`;

      if (!result.passed) {
        xml += `
    <failure message="${result.error}">${result.error}</failure>`;
      }

      xml += `
  </testcase>`;
    }

    xml += `
</testsuite>`;

    return xml;
  }

  private generateHTMLReport(): string {
    const passed = this.results.filter((r) => r.passed).length;
    const failed = this.results.filter((r) => !r.passed).length;

    return `
<!DOCTYPE html>
<html>
<head>
  <title>CLI Test Report</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 20px; }
    .summary { background: #f5f5f5; padding: 15px; border-radius: 5px; margin-bottom: 20px; }
    .test { margin: 10px 0; padding: 10px; border-left: 4px solid #ccc; }
    .passed { border-left-color: #4CAF50; }
    .failed { border-left-color: #f44336; }
    .error { color: #f44336; font-family: monospace; }
  </style>
</head>
<body>
  <h1>CLI Test Report</h1>
  
  <div class="summary">
    <h2>Summary</h2>
    <p><strong>Total:</strong> ${this.results.length}</p>
    <p><strong>Passed:</strong> ${passed}</p>
    <p><strong>Failed:</strong> ${failed}</p>
  </div>

  <h2>Test Results</h2>
  ${this.results
    .map(
      (result) => `
    <div class="test ${result.passed ? "passed" : "failed"}">
      <h3>${result.name} (${result.duration}ms)</h3>
      ${result.error ? `<div class="error">${result.error}</div>` : ""}
    </div>
  `
    )
    .join("")}
</body>
</html>`;
  }
}

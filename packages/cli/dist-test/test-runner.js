#!/usr/bin/env node

// test-runner.ts
import fs2 from "fs-extra";
import path4 from "path";
import { fileURLToPath as fileURLToPath3 } from "url";

// tests/core.test.ts
import path2 from "path";
import { fileURLToPath } from "url";

// src/test-framework/TestSuite.ts
import { spawn } from "child_process";
import fs from "fs-extra";
import path from "path";
var TestSuite = class {
  constructor(cliPath, baseTestDir = path.join(process.cwd(), "test-output")) {
    this.cliPath = cliPath;
    this.baseTestDir = baseTestDir;
  }
  tests = [];
  beforeEachHooks = [];
  afterEachHooks = [];
  beforeAllHooks = [];
  afterAllHooks = [];
  results = [];
  context = null;
  // Test registration
  test(name, fn, options = {}) {
    this.tests.push({
      name,
      fn,
      timeout: options.timeout || 3e4,
      tags: options.tags || []
    });
  }
  // Hooks
  beforeAll(fn) {
    this.beforeAllHooks.push(fn);
  }
  afterAll(fn) {
    this.afterAllHooks.push(fn);
  }
  beforeEach(fn) {
    this.beforeEachHooks.push(fn);
  }
  afterEach(fn) {
    this.afterEachHooks.push(fn);
  }
  // CLI execution
  async runCLI(args, options = {}) {
    const startTime = Date.now();
    return new Promise((resolve) => {
      const child = spawn("node", [this.cliPath, ...args], {
        cwd: options.cwd || this.context?.tempDir,
        stdio: ["pipe", "pipe", "pipe"],
        env: { ...process.env, ...options.env }
      });
      let stdout = "";
      let stderr = "";
      child.stdout?.on("data", (data) => {
        stdout += data.toString();
      });
      child.stderr?.on("data", (data) => {
        stderr += data.toString();
      });
      if (options.input) {
        child.stdin?.write(options.input);
      }
      child.stdin?.end();
      child.on("close", (code) => {
        resolve({
          exitCode: code,
          stdout,
          stderr,
          duration: Date.now() - startTime
        });
      });
      child.on("error", () => {
        resolve({
          exitCode: null,
          stdout,
          stderr,
          duration: Date.now() - startTime
        });
      });
      const timeout = setTimeout(() => {
        child.kill("SIGKILL");
        resolve({
          exitCode: null,
          stdout,
          stderr,
          duration: Date.now() - startTime
        });
      }, options.timeout || 15e3);
      child.on("close", () => clearTimeout(timeout));
    });
  }
  // Assertions
  async expect(actual, expected, message) {
    if (actual !== expected) {
      throw new Error(message || `Expected ${expected}, got ${actual}`);
    }
  }
  async expectContains(text, substring, message) {
    if (!text.includes(substring)) {
      throw new Error(
        message || `Expected "${text}" to contain "${substring}"`
      );
    }
  }
  async expectNotContains(text, substring, message) {
    if (text.includes(substring)) {
      throw new Error(
        message || `Expected "${text}" to not contain "${substring}"`
      );
    }
  }
  async expectFileExists(filePath, message) {
    const fullPath = path.isAbsolute(filePath) ? filePath : path.join(this.context.tempDir, filePath);
    if (!await fs.pathExists(fullPath)) {
      throw new Error(message || `File ${filePath} does not exist`);
    }
  }
  async expectFileNotExists(filePath, message) {
    const fullPath = path.isAbsolute(filePath) ? filePath : path.join(this.context.tempDir, filePath);
    if (await fs.pathExists(fullPath)) {
      throw new Error(message || `File ${filePath} should not exist`);
    }
  }
  async expectFileContains(filePath, content, message) {
    const fullPath = path.isAbsolute(filePath) ? filePath : path.join(this.context.tempDir, filePath);
    const fileContent = await fs.readFile(fullPath, "utf-8");
    if (!fileContent.includes(content)) {
      throw new Error(
        message || `File ${filePath} does not contain "${content}"`
      );
    }
  }
  async expectFileNotContains(filePath, content, message) {
    const fullPath = path.isAbsolute(filePath) ? filePath : path.join(this.context.tempDir, filePath);
    const fileContent = await fs.readFile(fullPath, "utf-8");
    if (fileContent.includes(content)) {
      throw new Error(
        message || `File ${filePath} should not contain "${content}"`
      );
    }
  }
  async expectExitCode(result, expectedCode, message) {
    if (result.exitCode !== expectedCode) {
      throw new Error(
        message || `Expected exit code ${expectedCode}, got ${result.exitCode}`
      );
    }
  }
  // Test execution
  async run(options = {}) {
    console.log("\u{1F9EA} Starting CLI Test Suite\n");
    for (const hook of this.beforeAllHooks) {
      await hook();
    }
    let testsToRun = this.tests;
    if (options.tags) {
      testsToRun = testsToRun.filter(
        (test) => test.tags?.some((tag) => options.tags.includes(tag))
      );
    }
    if (options.pattern) {
      testsToRun = testsToRun.filter(
        (test) => options.pattern.test(test.name)
      );
    }
    for (const test of testsToRun) {
      const startTime = Date.now();
      try {
        console.log(`  \u23F3 ${test.name}`);
        const tempDir = path.join(
          this.baseTestDir,
          `test-${Date.now()}-${Math.random().toString(36).slice(2)}`
        );
        await fs.ensureDir(tempDir);
        this.context = {
          tempDir,
          cliPath: this.cliPath,
          cleanup: async () => {
            await fs.remove(tempDir);
          }
        };
        for (const hook of this.beforeEachHooks) {
          await hook(this.context);
        }
        await Promise.race([
          test.fn(this.context),
          new Promise(
            (_, reject) => setTimeout(() => reject(new Error("Test timeout")), test.timeout)
          )
        ]);
        for (const hook of this.afterEachHooks) {
          await hook(this.context);
        }
        await this.context.cleanup();
        const result = {
          name: test.name,
          passed: true,
          duration: Date.now() - startTime
        };
        this.results.push(result);
        console.log(`  \u2705 ${test.name} (${result.duration}ms)`);
      } catch (error) {
        if (this.context) {
          await this.context.cleanup().catch(() => {
          });
        }
        const result = {
          name: test.name,
          passed: false,
          error: error instanceof Error ? error.message : String(error),
          duration: Date.now() - startTime
        };
        this.results.push(result);
        console.log(`  \u274C ${test.name} (${result.duration}ms)`);
        console.log(`     Error: ${result.error}`);
      }
    }
    for (const hook of this.afterAllHooks) {
      await hook();
    }
    const passed = this.results.filter((r) => r.passed).length;
    const failed = this.results.filter((r) => !r.passed).length;
    const totalDuration = this.results.reduce((sum, r) => sum + r.duration, 0);
    console.log(
      `
\u{1F4CA} Test Results: ${passed} passed, ${failed} failed (${totalDuration}ms total)`
    );
    if (failed > 0) {
      console.log("\n\u274C Failed Tests:");
      this.results.filter((r) => !r.passed).forEach((r) => {
        console.log(`  \u2022 ${r.name}: ${r.error}`);
      });
    }
    return this.results;
  }
  // Generate test report
  generateReport(format = "json") {
    switch (format) {
      case "json":
        return JSON.stringify(
          {
            summary: {
              total: this.results.length,
              passed: this.results.filter((r) => r.passed).length,
              failed: this.results.filter((r) => !r.passed).length,
              duration: this.results.reduce((sum, r) => sum + r.duration, 0)
            },
            tests: this.results
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
  generateJUnitReport() {
    const total = this.results.length;
    const failures = this.results.filter((r) => !r.passed).length;
    const duration = this.results.reduce((sum, r) => sum + r.duration, 0) / 1e3;
    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<testsuite name="CLI Tests" tests="${total}" failures="${failures}" time="${duration}">`;
    for (const result of this.results) {
      xml += `
  <testcase name="${result.name}" time="${result.duration / 1e3}">`;
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
  generateHTMLReport() {
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
  ${this.results.map(
      (result) => `
    <div class="test ${result.passed ? "passed" : "failed"}">
      <h3>${result.name} (${result.duration}ms)</h3>
      ${result.error ? `<div class="error">${result.error}</div>` : ""}
    </div>
  `
    ).join("")}
</body>
</html>`;
  }
};

// tests/core.test.ts
var __filename = fileURLToPath(import.meta.url);
var __dirname = path2.dirname(__filename);
var CLI_PATH = path2.resolve(process.cwd(), "dist/index.js");
function createCoreTests() {
  const suite = new TestSuite(CLI_PATH);
  suite.beforeAll(async () => {
    console.log("\u{1F527} Setting up core CLI tests...");
  });
  suite.afterAll(async () => {
    console.log("\u{1F9F9} Cleaning up core CLI tests...");
  });
  suite.test(
    "CLI shows help correctly",
    async (context) => {
      const result = await suite.runCLI(["--help"]);
      await suite.expectExitCode(result, 0, "Help should exit successfully");
      await suite.expectContains(
        result.stdout,
        "create-precast-app",
        "Should show program name"
      );
      await suite.expectContains(
        result.stdout,
        "Frontend framework",
        "Should show framework option"
      );
      await suite.expectContains(
        result.stdout,
        "Backend framework",
        "Should show backend option"
      );
    },
    { tags: ["basic", "help"] }
  );
  suite.test(
    "CLI shows version correctly",
    async (context) => {
      const result = await suite.runCLI(["--version"]);
      await suite.expectExitCode(result, 0, "Version should exit successfully");
      await suite.expectContains(
        result.stdout,
        "0.1.0",
        "Should show correct version"
      );
    },
    { tags: ["basic", "version"] }
  );
  suite.test(
    "CLI validates Angular requires TypeScript",
    async (context) => {
      const result = await suite.runCLI([
        "test-project",
        "--framework=angular",
        "--backend=none",
        "--database=none",
        "--orm=none",
        "--styling=css",
        "--no-typescript",
        "--no-git"
      ]);
      await suite.expectExitCode(result, 1, "Should fail validation");
      await suite.expectContains(
        result.stdout,
        "Configuration errors",
        "Should show validation errors"
      );
      await suite.expectContains(
        result.stdout,
        "Angular requires TypeScript",
        "Should show specific error"
      );
    },
    { tags: ["validation", "error-handling"] }
  );
  suite.test(
    "CLI validates ORM database compatibility",
    async (context) => {
      const result = await suite.runCLI([
        "test-project",
        "--framework=react",
        "--backend=node",
        "--database=mongodb",
        "--orm=drizzle",
        "--styling=tailwind",
        "--no-git"
      ]);
      await suite.expectExitCode(result, 1, "Should fail validation");
      await suite.expectContains(
        result.stdout,
        "Configuration errors",
        "Should show validation errors"
      );
      await suite.expectContains(
        result.stdout,
        "incompatible",
        "Should mention incompatibility"
      );
    },
    { tags: ["validation", "error-handling"] }
  );
  suite.test(
    "CLI creates a complete React project",
    async (context) => {
      const result = await suite.runCLI(
        [
          "test-react-project",
          "--framework=react",
          "--backend=none",
          "--database=none",
          "--orm=none",
          "--styling=tailwind",
          "--no-git",
          "--yes"
        ],
        {
          timeout: 45e3
        }
      );
      await suite.expectExitCode(result, 0, "Project creation should succeed");
      await suite.expectFileExists(
        "test-react-project/package.json",
        "Should create package.json"
      );
      await suite.expectFileExists(
        "test-react-project/src/App.tsx",
        "Should create React App component"
      );
      await suite.expectFileExists(
        "test-react-project/vite.config.ts",
        "Should create Vite config"
      );
      await suite.expectFileExists(
        "test-react-project/tsconfig.json",
        "Should create TypeScript config"
      );
      await suite.expectFileExists(
        "test-react-project/tailwind.config.js",
        "Should create Tailwind config"
      );
      await suite.expectFileContains(
        "test-react-project/package.json",
        '"react"',
        "Should include React dependency"
      );
      await suite.expectFileContains(
        "test-react-project/package.json",
        '"typescript"',
        "Should include TypeScript"
      );
      await suite.expectFileContains(
        "test-react-project/package.json",
        '"tailwindcss"',
        "Should include Tailwind CSS"
      );
      await suite.expectFileContains(
        "test-react-project/package.json",
        '"vite"',
        "Should include Vite"
      );
    },
    { tags: ["validation", "generation"], timeout: 6e4 }
  );
  return suite;
}

// tests/project-generation.test.ts
import path3 from "path";
import { fileURLToPath as fileURLToPath2 } from "url";
var __filename2 = fileURLToPath2(import.meta.url);
var __dirname2 = path3.dirname(__filename2);
var CLI_PATH2 = path3.resolve(process.cwd(), "dist/index.js");
function createProjectGenerationTests() {
  const suite = new TestSuite(CLI_PATH2);
  suite.beforeAll(async () => {
    console.log("\u{1F3D7}\uFE0F Setting up project generation tests...");
  });
  suite.afterAll(async () => {
    console.log("\u{1F9F9} Cleaning up project generation tests...");
  });
  suite.test(
    "Creates React project with TypeScript",
    async (context) => {
      const result = await suite.runCLI(
        [
          "react-ts-project",
          "--framework=react",
          "--backend=none",
          "--database=none",
          "--orm=none",
          "--styling=tailwind",
          "--no-git"
        ],
        {
          input: "n\ny\n",
          // Docker: no, Confirm: yes
          timeout: 45e3
        }
      );
      await suite.expectExitCode(result, 0, "Project creation should succeed");
      await suite.expectFileExists("react-ts-project/package.json");
      await suite.expectFileExists("react-ts-project/src/App.tsx");
      await suite.expectFileExists("react-ts-project/vite.config.ts");
      await suite.expectFileExists("react-ts-project/tsconfig.json");
      await suite.expectFileExists("react-ts-project/tailwind.config.js");
      await suite.expectFileContains(
        "react-ts-project/package.json",
        '"react"'
      );
      await suite.expectFileContains(
        "react-ts-project/package.json",
        '"typescript"'
      );
      await suite.expectFileContains(
        "react-ts-project/package.json",
        '"tailwindcss"'
      );
    },
    {
      tags: ["generation", "react", "typescript"],
      timeout: 6e4
    }
  );
  suite.test(
    "Creates Vue project without TypeScript",
    async (context) => {
      const result = await suite.runCLI(
        [
          "vue-js-project",
          "--framework=vue",
          "--backend=none",
          "--database=none",
          "--orm=none",
          "--styling=css",
          "--no-typescript",
          "--no-git"
        ],
        {
          input: "n\ny\n",
          // Docker: no, Confirm: yes
          timeout: 45e3
        }
      );
      await suite.expectExitCode(result, 0, "Project creation should succeed");
      await suite.expectFileExists("vue-js-project/package.json");
      await suite.expectFileExists("vue-js-project/src/App.vue");
      await suite.expectFileExists("vue-js-project/vite.config.js");
      await suite.expectFileNotExists("vue-js-project/tsconfig.json");
      await suite.expectFileContains("vue-js-project/package.json", '"vue"');
      await suite.expectFileNotContains(
        "vue-js-project/package.json",
        '"typescript"'
      );
    },
    {
      tags: ["generation", "vue", "javascript"],
      timeout: 6e4
    }
  );
  suite.test(
    "Creates full-stack project with Prisma and PostgreSQL",
    async (context) => {
      const result = await suite.runCLI(
        [
          "fullstack-project",
          "--framework=next",
          "--backend=node",
          "--database=postgres",
          "--orm=prisma",
          "--styling=tailwind",
          "--no-git"
        ],
        {
          input: "y\ny\n",
          // Docker: yes, Confirm: yes
          timeout: 6e4
        }
      );
      await suite.expectExitCode(result, 0, "Project creation should succeed");
      await suite.expectFileExists("fullstack-project/package.json");
      await suite.expectFileExists("fullstack-project/prisma/schema.prisma");
      await suite.expectFileExists("fullstack-project/Dockerfile");
      await suite.expectFileExists("fullstack-project/docker-compose.yml");
      await suite.expectFileContains(
        "fullstack-project/package.json",
        '"next"'
      );
      await suite.expectFileContains(
        "fullstack-project/package.json",
        '"@prisma/client"'
      );
      await suite.expectFileContains(
        "fullstack-project/package.json",
        '"prisma"'
      );
      await suite.expectFileContains(
        "fullstack-project/docker-compose.yml",
        "postgres"
      );
      await suite.expectFileContains(
        "fullstack-project/Dockerfile",
        "FROM node"
      );
    },
    {
      tags: ["generation", "fullstack", "database", "docker"],
      timeout: 9e4
    }
  );
  suite.test(
    "Handles existing directory error gracefully",
    async (context) => {
      const fs3 = await import("fs-extra");
      const existingDir = path3.join(context.tempDir, "existing-project");
      await fs3.ensureDir(existingDir);
      const result = await suite.runCLI(
        [
          "existing-project",
          "--framework=react",
          "--backend=none",
          "--database=none",
          "--orm=none",
          "--styling=css",
          "--no-git"
        ],
        {
          timeout: 1e4
        }
      );
      if (result.exitCode === 0) {
        throw new Error("Should have failed for existing directory");
      }
      await suite.expectContains(
        result.stderr,
        "already exists",
        "Should show directory exists error"
      );
    },
    {
      tags: ["error-handling", "validation"],
      timeout: 15e3
    }
  );
  return suite;
}

// test-runner.ts
var __filename3 = fileURLToPath3(import.meta.url);
var __dirname3 = path4.dirname(__filename3);
async function main() {
  const args = process.argv.slice(2);
  const config = {
    suites: ["core", "generation"],
    reportFormat: "json",
    parallel: false,
    verbose: false
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
        config.reportFormat = args[++i];
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
  console.log("\u{1F680} CLI Test Framework v1.0.0\n");
  if (config.verbose) {
    console.log("Configuration:", JSON.stringify(config, null, 2));
  }
  const cliDistPath = path4.resolve(process.cwd(), "dist/index.js");
  if (!await fs2.pathExists(cliDistPath)) {
    console.error('\u274C CLI not built. Run "bun run build" first.');
    console.error(`Looking for CLI at: ${cliDistPath}`);
    process.exit(1);
  }
  const suites = [];
  if (config.suites.includes("core")) {
    suites.push({
      name: "Core CLI Tests",
      suite: createCoreTests()
    });
  }
  if (config.suites.includes("generation")) {
    suites.push({
      name: "Project Generation Tests",
      suite: createProjectGenerationTests()
    });
  }
  if (suites.length === 0) {
    console.error("\u274C No test suites selected");
    process.exit(1);
  }
  const allResults = [];
  let totalPassed = 0;
  let totalFailed = 0;
  let totalDuration = 0;
  const startTime = Date.now();
  if (config.parallel && suites.length > 1) {
    console.log("\u{1F504} Running test suites in parallel...\n");
    const promises = suites.map(async ({ name, suite }) => {
      console.log(`\u{1F4CB} Starting ${name}...`);
      const options = {};
      if (config.tags) options.tags = config.tags;
      if (config.pattern) options.pattern = new RegExp(config.pattern);
      return suite.run(options);
    });
    const results = await Promise.all(promises);
    results.forEach((result) => allResults.push(...result));
  } else {
    console.log("\u{1F504} Running test suites sequentially...\n");
    for (const { name, suite } of suites) {
      console.log(`\u{1F4CB} Running ${name}...`);
      const options = {};
      if (config.tags) options.tags = config.tags;
      if (config.pattern) options.pattern = new RegExp(config.pattern);
      const results = await suite.run(options);
      allResults.push(...results);
      console.log();
    }
  }
  totalPassed = allResults.filter((r) => r.passed).length;
  totalFailed = allResults.filter((r) => !r.passed).length;
  totalDuration = Date.now() - startTime;
  console.log("\u{1F3C1} Final Results:");
  console.log(`   Total Tests: ${allResults.length}`);
  console.log(`   Passed: ${totalPassed}`);
  console.log(`   Failed: ${totalFailed}`);
  console.log(`   Duration: ${totalDuration}ms`);
  if (totalFailed > 0) {
    console.log("\n\u274C Failed Tests:");
    allResults.filter((r) => !r.passed).forEach((r) => {
      console.log(`   \u2022 ${r.name}: ${r.error}`);
    });
  }
  if (config.reportPath) {
    const reportData = {
      summary: {
        total: allResults.length,
        passed: totalPassed,
        failed: totalFailed,
        duration: totalDuration,
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      },
      tests: allResults,
      config
    };
    let reportContent;
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
    await fs2.ensureDir(path4.dirname(config.reportPath));
    await fs2.writeFile(config.reportPath, reportContent);
    console.log(`
\u{1F4CA} Report saved to: ${config.reportPath}`);
  }
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
function generateJUnitReport(data) {
  const { summary, tests } = data;
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<testsuite name="CLI Tests" tests="${summary.total}" failures="${summary.failed}" time="${summary.duration / 1e3}" timestamp="${summary.timestamp}">`;
  for (const test of tests) {
    xml += `
  <testcase name="${escapeXML(test.name)}" time="${test.duration / 1e3}">`;
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
function generateHTMLReport(data) {
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
      <h1>\u{1F9EA} CLI Test Report</h1>
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
        <div class="stat-value">${(summary.duration / 1e3).toFixed(2)}s</div>
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
      ${tests.map(
    (test) => `
        <div class="test ${test.passed ? "passed" : "failed"}" data-name="${escapeHTML(test.name)}">
          <div class="test-name">${escapeHTML(test.name)}</div>
          <div class="test-duration">${test.duration}ms</div>
          ${test.error ? `<div class="test-error">${escapeHTML(test.error)}</div>` : ""}
        </div>
      `
  ).join("")}
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
function escapeXML(str) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}
function escapeHTML(str) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    console.error("\u274C Test runner failed:", error);
    process.exit(1);
  });
}

#!/usr/bin/env node

// test-runner.ts
import path6 from "path";
import { fileURLToPath as fileURLToPath5 } from "url";

// tests/core.test.ts
import path2 from "path";
import { fileURLToPath } from "url";

// src/test-framework/TestSuite.ts
import { spawn } from "child_process";
import path from "path";
import fsExtra from "fs-extra";
var { pathExists, readFile, ensureDir, remove } = fsExtra;
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
  test(name, fn, options = {}) {
    this.tests.push({
      name,
      fn,
      timeout: options.timeout || 3e4,
      tags: options.tags || []
    });
  }
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
  async expect(actual, expected, message) {
    if (actual !== expected) {
      throw new Error(message || `Expected ${expected}, got ${actual}`);
    }
  }
  async expectContains(text, substring, message) {
    if (!text.includes(substring)) {
      throw new Error(message || `Expected "${text}" to contain "${substring}"`);
    }
  }
  async expectNotContains(text, substring, message) {
    if (text.includes(substring)) {
      throw new Error(message || `Expected "${text}" to not contain "${substring}"`);
    }
  }
  async expectFileExists(filePath, message) {
    const fullPath = path.isAbsolute(filePath) ? filePath : path.join(this.context.tempDir, filePath);
    if (!await pathExists(fullPath)) {
      throw new Error(message || `File ${filePath} does not exist`);
    }
  }
  async expectFileNotExists(filePath, message) {
    const fullPath = path.isAbsolute(filePath) ? filePath : path.join(this.context.tempDir, filePath);
    if (await pathExists(fullPath)) {
      throw new Error(message || `File ${filePath} should not exist`);
    }
  }
  async expectFileContains(filePath, content, message) {
    const fullPath = path.isAbsolute(filePath) ? filePath : path.join(this.context.tempDir, filePath);
    const fileContent = await readFile(fullPath, "utf-8");
    if (!fileContent.includes(content)) {
      throw new Error(message || `File ${filePath} does not contain "${content}"`);
    }
  }
  async expectFileNotContains(filePath, content, message) {
    const fullPath = path.isAbsolute(filePath) ? filePath : path.join(this.context.tempDir, filePath);
    const fileContent = await readFile(fullPath, "utf-8");
    if (fileContent.includes(content)) {
      throw new Error(message || `File ${filePath} should not contain "${content}"`);
    }
  }
  async expectExitCode(result, expectedCode, message) {
    if (result.exitCode !== expectedCode) {
      throw new Error(message || `Expected exit code ${expectedCode}, got ${result.exitCode}`);
    }
  }
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
      testsToRun = testsToRun.filter((test) => options.pattern.test(test.name));
    }
    for (const test of testsToRun) {
      const startTime = Date.now();
      try {
        console.log(`  \u23F3 ${test.name}`);
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
    console.log(`
\u{1F4CA} Test Results: ${passed} passed, ${failed} failed (${totalDuration}ms total)`);
    if (failed > 0) {
      console.log("\n\u274C Failed Tests:");
      this.results.filter((r) => !r.passed).forEach((r) => {
        console.log(`  \u2022 ${r.name}: ${r.error}`);
      });
    }
    return this.results;
  }
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
var CLI_PATH = path2.resolve(process.cwd(), "dist/cli.js");
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
    async (_context) => {
      const result = await suite.runCLI(["--help"]);
      await suite.expectExitCode(result, 0, "Help should exit successfully");
      await suite.expectContains(result.stdout, "create-precast-app", "Should show program name");
      await suite.expectContains(result.stdout, "Create a new project", "Should show init command");
      await suite.expectContains(result.stdout, "Add a feature", "Should show add command");
    },
    { tags: ["basic", "help"] }
  );
  suite.test(
    "CLI shows version correctly",
    async (_context) => {
      const result = await suite.runCLI(["--version"]);
      await suite.expectExitCode(result, 0, "Version should exit successfully");
      await suite.expectContains(result.stdout, "0.1.0", "Should show correct version");
    },
    { tags: ["basic", "version"] }
  );
  suite.test(
    "CLI auto-corrects Angular to use TypeScript",
    async (_context) => {
      const result = await suite.runCLI([
        "init",
        "test-project",
        "--framework=angular",
        "--backend=none",
        "--database=none",
        "--orm=none",
        "--styling=css",
        "--no-typescript",
        "--no-git",
        "--yes"
      ]);
      await suite.expectExitCode(result, 0, "Should succeed with auto-correction");
      await suite.expectContains(
        result.stdout,
        "TypeScript \u2713",
        "Should auto-enable TypeScript for Angular"
      );
    },
    { tags: ["validation", "auto-correction"] }
  );
  suite.test(
    "CLI accepts compatible ORM database combinations",
    async (_context) => {
      const result = await suite.runCLI([
        "init",
        "test-project-prisma",
        "--framework=react",
        "--backend=node",
        "--database=postgres",
        "--orm=prisma",
        "--styling=tailwind",
        "--no-git",
        "--yes"
      ]);
      await suite.expectExitCode(result, 0, "Should succeed with compatible combination");
      await suite.expectContains(
        result.stdout,
        "Database   postgres",
        "Should show selected database"
      );
      await suite.expectContains(result.stdout, "ORM        prisma", "Should show selected ORM");
    },
    { tags: ["validation", "compatibility"] }
  );
  suite.test(
    "CLI creates a complete React project",
    async (_context) => {
      const result = await suite.runCLI(
        [
          "init",
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
      await suite.expectFileExists("test-react-project/package.json", "Should create package.json");
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
      await suite.expectFileExists("test-react-project/index.html", "Should create HTML file");
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

// tests/framework-generation.test.ts
import path3 from "path";
import { fileURLToPath as fileURLToPath2 } from "url";
var __filename2 = fileURLToPath2(import.meta.url);
var __dirname2 = path3.dirname(__filename2);
var CLI_PATH2 = path3.resolve(process.cwd(), "dist/cli.js");
function createFrameworkGenerationTests() {
  const suite = new TestSuite(CLI_PATH2);
  suite.beforeAll(async () => {
    console.log("\u{1F3D7}\uFE0F Setting up framework generation tests...");
  });
  suite.afterAll(async () => {
    console.log("\u{1F9F9} Cleaning up framework generation tests...");
  });
  const frameworks = [
    {
      name: "react",
      expectedFiles: ["src/App.tsx", "vite.config.ts", "tsconfig.json"],
      expectedPackages: ["react", "react-dom", "@vitejs/plugin-react"]
    },
    {
      name: "vue",
      expectedFiles: ["src/App.vue", "vite.config.ts", "tsconfig.json"],
      expectedPackages: ["vue", "@vitejs/plugin-vue"]
    },
    {
      name: "angular",
      expectedFiles: ["src/main.ts", "angular.json", "tsconfig.json"],
      expectedPackages: ["@angular/core", "@angular/common", "@angular/platform-browser"]
    },
    {
      name: "next",
      expectedFiles: ["next.config.js", "tsconfig.json", "app/page.tsx"],
      expectedPackages: ["next", "react", "react-dom"]
    },
    {
      name: "nuxt",
      expectedFiles: ["nuxt.config.ts", "tsconfig.json", "app.vue"],
      expectedPackages: ["nuxt", "vue"]
    },
    {
      name: "svelte",
      expectedFiles: ["src/App.svelte", "vite.config.ts", "tsconfig.json"],
      expectedPackages: ["svelte", "@sveltejs/vite-plugin-svelte"]
    },
    {
      name: "solid",
      expectedFiles: ["src/App.tsx", "vite.config.ts", "tsconfig.json"],
      expectedPackages: ["solid-js", "vite-plugin-solid"]
    },
    {
      name: "astro",
      expectedFiles: ["src/pages/index.astro", "astro.config.mjs", "tsconfig.json"],
      expectedPackages: ["astro"]
    },
    {
      name: "remix",
      expectedFiles: ["remix.config.js", "tsconfig.json", "app/root.tsx"],
      expectedPackages: ["@remix-run/node", "@remix-run/react"]
    },
    {
      name: "vite",
      expectedFiles: ["src/main.ts", "vite.config.ts", "tsconfig.json"],
      expectedPackages: ["vite"]
    },
    {
      name: "vanilla",
      expectedFiles: ["src/main.js", "index.html", "vite.config.js"],
      expectedPackages: ["vite"]
    }
  ];
  frameworks.forEach((framework) => {
    suite.test(
      `Creates ${framework.name} project with TypeScript and Tailwind`,
      async (_context) => {
        const projectName = `${framework.name}-test-project`;
        const result = await suite.runCLI(
          [
            "init",
            projectName,
            `--framework=${framework.name}`,
            "--backend=none",
            "--database=none",
            "--orm=none",
            "--styling=tailwind",
            "--no-git"
          ],
          {
            input: "n\ny\n",
            // Docker: no, Confirm: yes
            timeout: 6e4
          }
        );
        await suite.expectExitCode(result, 0, `${framework.name} project creation should succeed`);
        await suite.expectFileExists(`${projectName}/package.json`);
        for (const file of framework.expectedFiles) {
          await suite.expectFileExists(`${projectName}/${file}`);
        }
        for (const pkg of framework.expectedPackages) {
          await suite.expectFileContains(`${projectName}/package.json`, `"${pkg}"`);
        }
        await suite.expectFileContains(`${projectName}/package.json`, '"tailwindcss"');
        await suite.expectFileExists(`${projectName}/tailwind.config.js`);
        if (framework.name !== "vanilla") {
          await suite.expectFileContains(`${projectName}/package.json`, '"typescript"');
        }
      },
      {
        tags: ["generation", framework.name, "typescript", "tailwind"],
        timeout: 9e4
      }
    );
    if (framework.name !== "angular") {
      suite.test(
        `Creates ${framework.name} project without TypeScript`,
        async (_context) => {
          const projectName = `${framework.name}-js-project`;
          const result = await suite.runCLI(
            [
              "init",
              projectName,
              `--framework=${framework.name}`,
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
              timeout: 6e4
            }
          );
          await suite.expectExitCode(
            result,
            0,
            `${framework.name} JavaScript project creation should succeed`
          );
          await suite.expectFileExists(`${projectName}/package.json`);
          await suite.expectFileNotContains(`${projectName}/package.json`, '"typescript"');
          await suite.expectFileNotExists(`${projectName}/tsconfig.json`);
          if (framework.name === "vite" || framework.name === "vanilla") {
            await suite.expectFileExists(`${projectName}/vite.config.js`);
          }
        },
        {
          tags: ["generation", framework.name, "javascript"],
          timeout: 9e4
        }
      );
    }
  });
  suite.test(
    "Creates Next.js project with Express backend",
    async (_context) => {
      const result = await suite.runCLI(
        [
          "init",
          "next-express-project",
          "--framework=next",
          "--backend=express",
          "--database=none",
          "--orm=none",
          "--styling=tailwind",
          "--no-git"
        ],
        {
          input: "n\ny\n",
          // Docker: no, Confirm: yes
          timeout: 6e4
        }
      );
      await suite.expectExitCode(result, 0, "Next.js + Express project creation should succeed");
      await suite.expectFileExists("next-express-project/package.json");
      await suite.expectFileExists("next-express-project/next.config.js");
      await suite.expectFileContains("next-express-project/package.json", '"express"');
    },
    {
      tags: ["generation", "next", "backend", "express"],
      timeout: 9e4
    }
  );
  suite.test(
    "Creates React project with Prisma and PostgreSQL",
    async (_context) => {
      const result = await suite.runCLI(
        [
          "init",
          "react-prisma-project",
          "--framework=react",
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
      await suite.expectExitCode(result, 0, "React + Prisma project creation should succeed");
      await suite.expectFileExists("react-prisma-project/package.json");
      await suite.expectFileExists("react-prisma-project/prisma/schema.prisma");
      await suite.expectFileExists("react-prisma-project/docker-compose.yml");
      await suite.expectFileContains("react-prisma-project/package.json", '"@prisma/client"');
      await suite.expectFileContains("react-prisma-project/package.json", '"prisma"');
    },
    {
      tags: ["generation", "react", "database", "prisma"],
      timeout: 9e4
    }
  );
  suite.test(
    "Handles incompatible framework-backend combination",
    async (_context) => {
      const result = await suite.runCLI(
        [
          "init",
          "invalid-project",
          "--framework=angular",
          "--backend=fastapi",
          // FastAPI is incompatible with TypeScript
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
        throw new Error("Should have failed for incompatible combination");
      }
      await suite.expectContains(
        result.stderr,
        "incompatible",
        "Should show incompatibility error"
      );
    },
    {
      tags: ["error-handling", "validation", "angular"],
      timeout: 15e3
    }
  );
  return suite;
}

// tests/generator-structure.test.ts
import path4 from "path";
import { fileURLToPath as fileURLToPath3 } from "url";
var __filename3 = fileURLToPath3(import.meta.url);
var __dirname3 = path4.dirname(__filename3);
var CLI_PATH3 = path4.resolve(process.cwd(), "dist/cli.js");
function createGeneratorStructureTests() {
  const suite = new TestSuite(CLI_PATH3);
  suite.beforeAll(async () => {
    console.log("\u{1F3D7}\uFE0F Setting up generator structure tests...");
  });
  suite.afterAll(async () => {
    console.log("\u{1F9F9} Cleaning up generator structure tests...");
  });
  suite.test(
    "All framework generators are available",
    async (_context) => {
      const generators = await import("./generators-V4D4TCXJ.js");
      if (typeof generators.generateTemplate !== "function") {
        throw new Error("generateTemplate function not found");
      }
      const frameworks = [
        "react",
        "vue",
        "angular",
        "next",
        "nuxt",
        "svelte",
        "solid",
        "astro",
        "remix",
        "vite",
        "vanilla"
      ];
      const mockConfig = {
        name: "test-project",
        framework: "",
        backend: "none",
        database: "none",
        orm: "none",
        styling: "css",
        typescript: true,
        git: false,
        docker: false
      };
      for (const framework of frameworks) {
        try {
          await generators.generateTemplate({ ...mockConfig, framework }, "/tmp/test-" + framework);
        } catch (error) {
          const errorMessage = error.message || "";
          if (errorMessage.includes("not yet implemented")) {
            throw new Error(`${framework} generator is not properly implemented: ${errorMessage}`);
          }
          if (!errorMessage.includes("ENOENT") && !errorMessage.includes("no such file")) {
            throw new Error(`Unexpected error for ${framework}: ${errorMessage}`);
          }
        }
      }
    },
    {
      tags: ["structure", "generators"],
      timeout: 3e4
    }
  );
  suite.test(
    "Individual generator modules exist",
    async (_context) => {
      const generatorModules = [
        "../src/generators/react-template.js",
        "../src/generators/vue-template.js",
        "../src/generators/angular-template.js",
        "../src/generators/next-template.js",
        "../src/generators/nuxt-template.js",
        "../src/generators/svelte-template.js",
        "../src/generators/solid-template.js",
        "../src/generators/astro-template.js",
        "../src/generators/remix-template.js",
        "../src/generators/vite-template.js",
        "../src/generators/vanilla-template.js"
      ];
      for (const modulePath of generatorModules) {
        try {
          const module = await import(modulePath);
          const frameworkName = modulePath.split("/").pop()?.replace("-template.js", "");
          const functionName = `generate${frameworkName?.charAt(0).toUpperCase()}${frameworkName?.slice(1)}Template`;
          if (typeof module[functionName] !== "function") {
            throw new Error(`${functionName} not found in ${modulePath}`);
          }
        } catch (error) {
          throw new Error(`Failed to import ${modulePath}: ${error.message}`);
        }
      }
    },
    {
      tags: ["structure", "imports"],
      timeout: 1e4
    }
  );
  return suite;
}

// tests/project-generation.test.ts
import path5 from "path";
import { fileURLToPath as fileURLToPath4 } from "url";
var __filename4 = fileURLToPath4(import.meta.url);
var __dirname4 = path5.dirname(__filename4);
var CLI_PATH4 = path5.resolve(process.cwd(), "dist/cli.js");
function createProjectGenerationTests() {
  const suite = new TestSuite(CLI_PATH4);
  suite.beforeAll(async () => {
    console.log("\u{1F3D7}\uFE0F Setting up project generation tests...");
  });
  suite.afterAll(async () => {
    console.log("\u{1F9F9} Cleaning up project generation tests...");
  });
  suite.test(
    "Creates React project with TypeScript",
    async (_context) => {
      const result = await suite.runCLI(
        [
          "init",
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
      await suite.expectFileContains("react-ts-project/package.json", '"react"');
      await suite.expectFileContains("react-ts-project/package.json", '"typescript"');
      await suite.expectFileContains("react-ts-project/package.json", '"tailwindcss"');
    },
    {
      tags: ["generation", "react", "typescript"],
      timeout: 6e4
    }
  );
  suite.test(
    "Creates Vue project without TypeScript",
    async (_context) => {
      const result = await suite.runCLI(
        [
          "init",
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
      await suite.expectFileNotContains("vue-js-project/package.json", '"typescript"');
    },
    {
      tags: ["generation", "vue", "javascript"],
      timeout: 6e4
    }
  );
  suite.test(
    "Creates full-stack project with Prisma and PostgreSQL",
    async (_context) => {
      const result = await suite.runCLI(
        [
          "init",
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
      await suite.expectFileContains("fullstack-project/package.json", '"next"');
      await suite.expectFileContains("fullstack-project/package.json", '"@prisma/client"');
      await suite.expectFileContains("fullstack-project/package.json", '"prisma"');
      await suite.expectFileContains("fullstack-project/docker-compose.yml", "postgres");
      await suite.expectFileContains("fullstack-project/Dockerfile", "FROM node");
    },
    {
      tags: ["generation", "fullstack", "database", "docker"],
      timeout: 9e4
    }
  );
  suite.test(
    "Handles existing directory error gracefully",
    async (_context) => {
      const fs = await import("fs-extra");
      const existingDir = path5.join(_context.tempDir, "existing-project");
      await fs.ensureDir(existingDir);
      const result = await suite.runCLI(
        [
          "init",
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
var __filename5 = fileURLToPath5(import.meta.url);
var __dirname5 = path6.dirname(__filename5);
async function main() {
  const args = process.argv.slice(2);
  const options = {
    tags: [],
    suites: [],
    verbose: false,
    reportPath: "",
    reportFormat: "json"
  };
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
      options.reportFormat = args[++i] || "json";
    }
  }
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
  let allResults = [];
  for (const suite of suites) {
    const results = await suite.run({ tags: options.tags });
    const passed = results.filter((r) => r.passed).length;
    const failed = results.filter((r) => !r.passed).length;
    totalPassed += passed;
    totalFailed += failed;
    allResults = allResults.concat(results);
  }
  if (options.reportPath && suites.length > 0) {
    const report = suites[0].generateReport(options.reportFormat);
    const fs = await import("fs-extra");
    await fs.ensureDir(path6.dirname(options.reportPath));
    await fs.writeFile(options.reportPath, report);
    console.log(`\u{1F4DD} Report written to ${options.reportPath}`);
  }
  console.log(`
\u{1F3C1} Final Results: ${totalPassed} passed, ${totalFailed} failed`);
  process.exit(totalFailed > 0 ? 1 : 0);
}
main().catch((error) => {
  console.error("\u274C Test runner failed:", error);
  process.exit(1);
});

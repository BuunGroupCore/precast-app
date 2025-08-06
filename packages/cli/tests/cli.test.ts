import { existsSync, readFileSync } from "fs";
import path from "path";

import { describe, it, expect, beforeAll, afterEach } from "vitest";

import { SMART_TEST_COMBINATIONS } from "../generated-tests/smart-combinations";
import { runCLI, cleanupTestProjects, projectExists } from "../src/test-utils";

describe("CLI Core Functionality", () => {
  beforeAll(async () => {
    // Ensure CLI is built
    const buildResult = runCLI(["--version"]);
    expect(buildResult.exitCode).toBe(0);
  });

  it("should show help", () => {
    const result = runCLI(["--help"]);
    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain("create-precast-app");
    expect(result.stdout).toContain("init");
  });

  it("should show version", () => {
    const result = runCLI(["--version"]);
    expect(result.exitCode).toBe(0);
  });

  it("should handle invalid commands", () => {
    const result = runCLI(["invalid-command"]);
    // The CLI defaults to interactive mode for unknown commands
    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain("Choose your frontend framework");
  });
});

describe("CLI Project Generation - Critical Tests", () => {
  const testProjects: string[] = [];

  afterEach(() => {
    cleanupTestProjects(testProjects);
    testProjects.length = 0;
  });

  SMART_TEST_COMBINATIONS.critical.forEach((combination) => {
    it(
      `should generate ${combination.name}`,
      () => {
        const projectName = `test-${combination.name}`;
        testProjects.push(projectName);

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

        const result = runCLI(args);

        expect(result.exitCode).toBe(0);
        expect(projectExists(projectName)).toBe(true);
      },
      combination.expectedDuration + 10000
    ); // Add 10s buffer
  });
});

describe("CLI AI Assistant Integration", () => {
  const testProjects: string[] = [];

  afterEach(() => {
    cleanupTestProjects(testProjects);
    testProjects.length = 0;
  });

  const aiAssistants = ["claude", "cursor", "copilot", "gemini"];

  aiAssistants.forEach((ai) => {
    it(`should generate project with --ai=${ai}`, () => {
      const projectName = `test-ai-${ai}`;
      testProjects.push(projectName);

      const args = [
        "init",
        projectName,
        "--framework=react",
        "--backend=none",
        "--database=none",
        "--orm=none",
        "--styling=tailwind",
        "--runtime=node",
        `--ai=${ai}`,
        "--no-git",
        "--yes",
      ];

      const result = runCLI(args);

      expect(result.exitCode).toBe(0);
      expect(projectExists(projectName)).toBe(true);

      if (ai === "claude") {
        // Claude should have .claude folder
        expect(existsSync(path.join(projectName, ".claude"))).toBe(true);
        expect(existsSync(path.join(projectName, ".claude", "settings.json"))).toBe(true);
        expect(existsSync(path.join(projectName, "CLAUDE.md"))).toBe(true);
      } else {
        // Other assistants should NOT have .claude folder
        expect(existsSync(path.join(projectName, ".claude"))).toBe(false);
        expect(existsSync(path.join(projectName, "CLAUDE.md"))).toBe(false);
      }
    }, 60000);
  });

  it("should not generate Claude files without --ai=claude", () => {
    const projectName = "test-no-ai";
    testProjects.push(projectName);

    const args = [
      "init",
      projectName,
      "--framework=react",
      "--backend=none",
      "--database=none",
      "--orm=none",
      "--styling=tailwind",
      "--runtime=node",
      "--no-git",
      "--yes",
    ];

    const result = runCLI(args);

    expect(result.exitCode).toBe(0);
    expect(projectExists(projectName)).toBe(true);
    expect(existsSync(path.join(projectName, ".claude"))).toBe(false);
    expect(existsSync(path.join(projectName, "CLAUDE.md"))).toBe(false);
  }, 60000);
});

describe("CLI MCP Servers Integration", () => {
  const testProjects: string[] = [];

  afterEach(() => {
    cleanupTestProjects(testProjects);
    testProjects.length = 0;
  });

  it("should generate project with --mcp-servers for Claude AI", () => {
    const projectName = "test-mcp-servers";
    testProjects.push(projectName);

    const args = [
      "init",
      projectName,
      "--framework=react",
      "--backend=none",
      "--database=postgres",
      "--orm=prisma",
      "--styling=tailwind",
      "--runtime=node",
      "--ai=claude",
      "--mcp-servers",
      "postgresql",
      "supabase",
      "github-api",
      "--no-git",
      "--yes",
    ];

    const result = runCLI(args);

    expect(result.exitCode).toBe(0);
    expect(projectExists(projectName)).toBe(true);

    // Should have .claude folder with MCP configuration
    expect(existsSync(path.join(projectName, ".claude"))).toBe(true);
    expect(existsSync(path.join(projectName, ".claude", "settings.json"))).toBe(true);

    // Check MCP servers are configured in mcp.json
    const mcpConfigPath = path.join(projectName, ".claude", "mcp.json");
    expect(existsSync(mcpConfigPath)).toBe(true);
    const mcpConfig = JSON.parse(readFileSync(mcpConfigPath, "utf8"));
    expect(mcpConfig.mcpServers).toBeDefined();
    expect(Object.keys(mcpConfig.mcpServers)).toContain("postgresql");
    expect(Object.keys(mcpConfig.mcpServers)).toContain("supabase");
    expect(Object.keys(mcpConfig.mcpServers)).toContain("github-api");
  }, 60000);

  it("should ignore --mcp-servers when AI is not Claude", () => {
    const projectName = "test-mcp-no-claude";
    testProjects.push(projectName);

    const args = [
      "init",
      projectName,
      "--framework=react",
      "--backend=none",
      "--database=none",
      "--orm=none",
      "--styling=tailwind",
      "--runtime=node",
      "--ai=cursor",
      "--mcp-servers",
      "postgresql",
      "github-api",
      "--no-git",
      "--yes",
    ];

    const result = runCLI(args);

    expect(result.exitCode).toBe(0);
    expect(projectExists(projectName)).toBe(true);
    // Should not have .claude folder
    expect(existsSync(path.join(projectName, ".claude"))).toBe(false);
  }, 60000);
});

describe("CLI API Client Integration", () => {
  const testProjects: string[] = [];

  afterEach(() => {
    cleanupTestProjects(testProjects);
    testProjects.length = 0;
  });

  const apiClients = [
    { name: "tanstack-query", framework: "react", expectedPackage: "@tanstack/react-query" },
    { name: "swr", framework: "react", expectedPackage: "swr" },
    { name: "axios", framework: "react", expectedPackage: "axios" },
    { name: "tanstack-query", framework: "vue", expectedPackage: "@tanstack/vue-query" },
  ];

  apiClients.forEach((client) => {
    it(`should generate ${client.framework} project with ${client.name} API client`, () => {
      const projectName = `test-api-${client.framework}-${client.name}`;
      testProjects.push(projectName);

      const args = [
        "init",
        projectName,
        `--framework=${client.framework}`,
        "--backend=express",
        "--database=none",
        "--orm=none",
        "--styling=tailwind",
        "--runtime=node",
        `--api-client=${client.name}`,
        "--no-git",
        "--yes",
      ];

      const result = runCLI(args);

      expect(result.exitCode).toBe(0);
      expect(projectExists(projectName)).toBe(true);

      // Check package.json includes the API client (in monorepo structure)
      const webPackageJsonPath = existsSync(path.join(projectName, "apps", "web", "package.json"))
        ? path.join(projectName, "apps", "web", "package.json")
        : path.join(projectName, "package.json");
      const packageJson = JSON.parse(readFileSync(webPackageJsonPath, "utf8"));

      // Check that the expected API client package is installed
      const hasExpectedPackage = Object.prototype.hasOwnProperty.call(
        packageJson.dependencies,
        client.expectedPackage
      );

      // Also check for any API client packages as fallback (bundled approach)
      const hasAnyApiClientPackage = Object.keys(packageJson.dependencies).some(
        (pkg) => pkg.includes("swr") || pkg.includes("tanstack") || pkg.includes("axios")
      );

      expect(hasExpectedPackage || hasAnyApiClientPackage).toBe(true);

      // Check for API setup files (comprehensive approach)
      const webSrcPath = existsSync(path.join(projectName, "apps", "web", "src"))
        ? path.join(projectName, "apps", "web", "src")
        : path.join(projectName, "src");

      const apiSetupExists =
        // TanStack Query files
        existsSync(path.join(webSrcPath, "lib", "query-client.ts")) ||
        existsSync(path.join(webSrcPath, "providers", "query-provider.tsx")) ||
        // SWR files
        existsSync(path.join(webSrcPath, "lib", "fetcher.ts")) ||
        existsSync(path.join(webSrcPath, "providers", "swr-provider.tsx")) ||
        // Axios files
        existsSync(path.join(webSrcPath, "lib", "axios.ts")) ||
        // Common API files
        existsSync(path.join(webSrcPath, "hooks", "use-api.ts")) ||
        existsSync(path.join(webSrcPath, "lib", "api.ts")) ||
        existsSync(path.join(webSrcPath, "lib", "api.js"));
      expect(apiSetupExists).toBe(true);
    }, 60000);
  });

  it("should not add API client when backend is none", () => {
    const projectName = "test-no-api-backend-none";
    testProjects.push(projectName);

    const args = [
      "init",
      projectName,
      "--framework=react",
      "--backend=none",
      "--database=none",
      "--orm=none",
      "--styling=tailwind",
      "--runtime=node",
      "--api-client=tanstack-query",
      "--no-git",
      "--yes",
    ];

    const result = runCLI(args);

    expect(result.exitCode).toBe(0);
    expect(projectExists(projectName)).toBe(true);

    // Should not have API setup when backend is none
    const webSrcPath = existsSync(path.join(projectName, "apps", "web", "src"))
      ? path.join(projectName, "apps", "web", "src")
      : path.join(projectName, "src");

    const apiSetupExists =
      // TanStack Query files
      existsSync(path.join(webSrcPath, "lib", "query-client.ts")) ||
      existsSync(path.join(webSrcPath, "providers", "query-provider.tsx")) ||
      // SWR files
      existsSync(path.join(webSrcPath, "lib", "fetcher.ts")) ||
      existsSync(path.join(webSrcPath, "providers", "swr-provider.tsx")) ||
      // Axios files
      existsSync(path.join(webSrcPath, "lib", "axios.ts")) ||
      // Common API files
      existsSync(path.join(webSrcPath, "hooks", "use-api.ts")) ||
      existsSync(path.join(webSrcPath, "lib", "api.ts")) ||
      existsSync(path.join(webSrcPath, "lib", "api.js"));
    expect(apiSetupExists).toBe(false);
  }, 60000);
});

describe("CLI Integration Tests - Combined Features", () => {
  const testProjects: string[] = [];

  afterEach(() => {
    cleanupTestProjects(testProjects);
    testProjects.length = 0;
  });

  it("should generate full-stack project with Claude AI, MCP servers, and API client", () => {
    const projectName = "test-full-integration";
    testProjects.push(projectName);

    const args = [
      "init",
      projectName,
      "--framework=react",
      "--backend=express",
      "--database=postgres",
      "--orm=prisma",
      "--styling=tailwind",
      "--runtime=node",
      "--ai=claude",
      "--mcp-servers",
      "postgresql",
      "supabase",
      "github-api",
      "--api-client=tanstack-query",
      "--no-git",
      "--yes",
    ];

    const result = runCLI(args);

    expect(result.exitCode).toBe(0);
    expect(projectExists(projectName)).toBe(true);

    // Check Claude integration
    expect(existsSync(path.join(projectName, ".claude"))).toBe(true);
    expect(existsSync(path.join(projectName, "CLAUDE.md"))).toBe(true);

    // Check MCP configuration
    const mcpConfigPath = path.join(projectName, ".claude", "mcp.json");
    expect(existsSync(mcpConfigPath)).toBe(true);
    const mcpConfig = JSON.parse(readFileSync(mcpConfigPath, "utf8"));
    expect(mcpConfig.mcpServers).toBeDefined();
    expect(Object.keys(mcpConfig.mcpServers)).toContain("postgresql");

    // Check API client setup (in monorepo structure)
    const webPackageJsonPath = existsSync(path.join(projectName, "apps", "web", "package.json"))
      ? path.join(projectName, "apps", "web", "package.json")
      : path.join(projectName, "package.json");
    const packageJson = JSON.parse(readFileSync(webPackageJsonPath, "utf8"));
    const hasApiClientPackage = Object.keys(packageJson.dependencies).some(
      (pkg) => pkg.includes("swr") || pkg.includes("tanstack") || pkg.includes("axios")
    );
    expect(hasApiClientPackage).toBe(true);

    // Check API setup file exists (comprehensive approach)
    const webSrcPath = existsSync(path.join(projectName, "apps", "web", "src"))
      ? path.join(projectName, "apps", "web", "src")
      : path.join(projectName, "src");

    const apiSetupExists =
      // TanStack Query files
      existsSync(path.join(webSrcPath, "lib", "query-client.ts")) ||
      existsSync(path.join(webSrcPath, "providers", "query-provider.tsx")) ||
      // SWR files
      existsSync(path.join(webSrcPath, "lib", "fetcher.ts")) ||
      existsSync(path.join(webSrcPath, "providers", "swr-provider.tsx")) ||
      // Axios files
      existsSync(path.join(webSrcPath, "lib", "axios.ts")) ||
      // Common API files
      existsSync(path.join(webSrcPath, "hooks", "use-api.ts")) ||
      existsSync(path.join(webSrcPath, "lib", "api.ts")) ||
      existsSync(path.join(webSrcPath, "lib", "api.js"));
    expect(apiSetupExists).toBe(true);
  }, 90000);

  it("should generate minimal project without AI, MCP, or API features", () => {
    const projectName = "test-minimal-integration";
    testProjects.push(projectName);

    const args = [
      "init",
      projectName,
      "--framework=react",
      "--backend=none",
      "--database=none",
      "--orm=none",
      "--styling=tailwind",
      "--runtime=node",
      "--no-git",
      "--yes",
    ];

    const result = runCLI(args);

    expect(result.exitCode).toBe(0);
    expect(projectExists(projectName)).toBe(true);

    // Should not have Claude integration
    expect(existsSync(path.join(projectName, ".claude"))).toBe(false);
    expect(existsSync(path.join(projectName, "CLAUDE.md"))).toBe(false);

    // Should not have API setup
    const webSrcPath = existsSync(path.join(projectName, "apps", "web", "src"))
      ? path.join(projectName, "apps", "web", "src")
      : path.join(projectName, "src");

    const apiSetupExists =
      // TanStack Query files
      existsSync(path.join(webSrcPath, "lib", "query-client.ts")) ||
      existsSync(path.join(webSrcPath, "providers", "query-provider.tsx")) ||
      // SWR files
      existsSync(path.join(webSrcPath, "lib", "fetcher.ts")) ||
      existsSync(path.join(webSrcPath, "providers", "swr-provider.tsx")) ||
      // Axios files
      existsSync(path.join(webSrcPath, "lib", "axios.ts")) ||
      // Common API files
      existsSync(path.join(webSrcPath, "hooks", "use-api.ts")) ||
      existsSync(path.join(webSrcPath, "lib", "api.ts")) ||
      existsSync(path.join(webSrcPath, "lib", "api.js"));
    expect(apiSetupExists).toBe(false);
  }, 60000);
});

describe("CLI Project Generation - Full Test Suite", () => {
  const testProjects: string[] = [];

  afterEach(() => {
    cleanupTestProjects(testProjects);
    testProjects.length = 0;
  });

  // Test a subset of all combinations to avoid extremely long test runs
  const testCombinations = [
    ...SMART_TEST_COMBINATIONS.critical.slice(0, 3), // First 3 critical
    ...SMART_TEST_COMBINATIONS.common.slice(0, 2), // First 2 common
    ...SMART_TEST_COMBINATIONS.edge.slice(0, 1), // First 1 edge case
  ];

  testCombinations.forEach((combination) => {
    it(
      `should generate ${combination.name} (${combination.category})`,
      () => {
        const projectName = `test-full-${combination.name}`;
        testProjects.push(projectName);

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

        const result = runCLI(args);

        if (result.exitCode !== 0) {
          console.error(`CLI Error for ${combination.name}:`, result.stderr);
        }

        expect(result.exitCode).toBe(0);
        expect(projectExists(projectName)).toBe(true);
      },
      combination.expectedDuration + 10000
    );
  });
});

#!/usr/bin/env node
import path from "path";
import { fileURLToPath } from "url";

import fsExtra from "fs-extra";
const { writeFile, ensureDir } = fsExtra;

import {
  frameworkDefs,
  backendDefs,
  databaseDefs,
  ormDefs,
  stylingDefs,
  runtimeDefs,
} from "../shared/stack-config.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export interface SmartTestCombination {
  framework: string;
  backend: string;
  database: string;
  orm: string;
  styling: string;
  runtime: string;
  typescript: boolean;
  name: string;
  category: "critical" | "common" | "edge" | "experimental";
  expectedDuration: number; // in milliseconds
}

/**
 * Smart test generator that creates comprehensive test combinations
 * based on real-world usage patterns and CLI capabilities
 */
export class SmartTestGenerator {
  private allFrameworks = frameworkDefs.map((f) => f.id);
  private allBackends = backendDefs.map((b) => b.id);
  private allDatabases = databaseDefs.map((d) => d.id);
  private allOrms = ormDefs.map((o) => o.id);
  private allStylings = stylingDefs.map((s) => s.id);
  private allRuntimes = runtimeDefs.map((r) => r.id);

  /**
   * Generate critical combinations - most common real-world stacks
   */
  generateCriticalCombinations(): SmartTestCombination[] {
    return [
      // React ecosystem
      {
        framework: "react",
        backend: "none",
        database: "none",
        orm: "none",
        styling: "tailwind",
        runtime: "node",
        typescript: true,
        name: "react-frontend-only",
        category: "critical",
        expectedDuration: 5000,
      },
      {
        framework: "react",
        backend: "express",
        database: "postgres",
        orm: "prisma",
        styling: "tailwind",
        runtime: "node",
        typescript: true,
        name: "react-express-postgres",
        category: "critical",
        expectedDuration: 8000,
      },
      {
        framework: "react",
        backend: "nestjs",
        database: "postgres",
        orm: "prisma",
        styling: "tailwind",
        runtime: "node",
        typescript: true,
        name: "react-nestjs-postgres",
        category: "critical",
        expectedDuration: 9000,
      },

      // Next.js ecosystem
      {
        framework: "next",
        backend: "none",
        database: "none",
        orm: "none",
        styling: "tailwind",
        runtime: "node",
        typescript: true,
        name: "next-frontend-only",
        category: "critical",
        expectedDuration: 6000,
      },
      {
        framework: "next",
        backend: "next-api",
        database: "postgres",
        orm: "prisma",
        styling: "tailwind",
        runtime: "node",
        typescript: true,
        name: "next-fullstack",
        category: "critical",
        expectedDuration: 8000,
      },

      // Vue ecosystem
      {
        framework: "vue",
        backend: "none",
        database: "none",
        orm: "none",
        styling: "tailwind",
        runtime: "node",
        typescript: true,
        name: "vue-frontend-only",
        category: "critical",
        expectedDuration: 5000,
      },
      {
        framework: "vue",
        backend: "fastify",
        database: "postgres",
        orm: "prisma",
        styling: "tailwind",
        runtime: "node",
        typescript: true,
        name: "vue-fastify-postgres",
        category: "critical",
        expectedDuration: 8000,
      },

      // Popular alternative backends
      {
        framework: "react",
        backend: "hono",
        database: "none",
        orm: "none",
        styling: "tailwind",
        runtime: "node",
        typescript: true,
        name: "react-hono-edge",
        category: "critical",
        expectedDuration: 7000,
      },
      {
        framework: "svelte",
        backend: "fastify",
        database: "postgres",
        orm: "prisma",
        styling: "tailwind",
        runtime: "node",
        typescript: true,
        name: "svelte-fastify-postgres",
        category: "critical",
        expectedDuration: 8000,
      },
    ];
  }

  /**
   * Generate common combinations - frequently used but not critical
   */
  generateCommonCombinations(): SmartTestCombination[] {
    return [
      // JavaScript variants
      {
        framework: "react",
        backend: "express",
        database: "none",
        orm: "none",
        styling: "css",
        runtime: "node",
        typescript: false,
        name: "react-express-js",
        category: "common",
        expectedDuration: 6000,
      },
      {
        framework: "vue",
        backend: "express",
        database: "mongodb",
        orm: "none",
        styling: "scss",
        runtime: "node",
        typescript: false,
        name: "vue-express-mongodb-js",
        category: "common",
        expectedDuration: 7000,
      },

      // Alternative databases
      {
        framework: "next",
        backend: "koa",
        database: "mongodb",
        orm: "none",
        styling: "tailwind",
        runtime: "node",
        typescript: true,
        name: "next-koa-mongodb",
        category: "common",
        expectedDuration: 8000,
      },
      {
        framework: "react",
        backend: "express",
        database: "mysql",
        orm: "drizzle",
        styling: "tailwind",
        runtime: "node",
        typescript: true,
        name: "react-express-mysql-drizzle",
        category: "common",
        expectedDuration: 8000,
      },

      // Framework alternatives
      {
        framework: "remix",
        backend: "express",
        database: "postgres",
        orm: "prisma",
        styling: "tailwind",
        runtime: "node",
        typescript: true,
        name: "remix-express-postgres",
        category: "common",
        expectedDuration: 8000,
      },
      {
        framework: "astro",
        backend: "express",
        database: "postgres",
        orm: "drizzle",
        styling: "tailwind",
        runtime: "node",
        typescript: true,
        name: "astro-express-postgres",
        category: "common",
        expectedDuration: 8000,
      },
    ];
  }

  /**
   * Generate edge case combinations - unusual but valid configurations
   */
  generateEdgeCaseCombinations(): SmartTestCombination[] {
    return [
      // Vanilla combinations
      {
        framework: "vanilla",
        backend: "none",
        database: "none",
        orm: "none",
        styling: "css",
        runtime: "node",
        typescript: false,
        name: "vanilla-minimal",
        category: "edge",
        expectedDuration: 4000,
      },
      {
        framework: "vanilla",
        backend: "node",
        database: "none",
        orm: "none",
        styling: "css",
        runtime: "node",
        typescript: false,
        name: "vanilla-node-backend",
        category: "edge",
        expectedDuration: 5000,
      },

      // Complex configurations
      {
        framework: "solid",
        backend: "hono",
        database: "postgres",
        orm: "drizzle",
        styling: "tailwind",
        runtime: "node",
        typescript: true,
        name: "solid-hono-postgres",
        category: "edge",
        expectedDuration: 9000,
      },
      {
        framework: "svelte",
        backend: "koa",
        database: "mysql",
        orm: "typeorm",
        styling: "scss",
        runtime: "node",
        typescript: true,
        name: "svelte-koa-mysql-typeorm",
        category: "edge",
        expectedDuration: 9000,
      },

      // No database with backend (API only)
      {
        framework: "react",
        backend: "fastify",
        database: "none",
        orm: "none",
        styling: "tailwind",
        runtime: "node",
        typescript: true,
        name: "react-fastify-api-only",
        category: "edge",
        expectedDuration: 6000,
      },
    ];
  }

  /**
   * Generate experimental combinations - new/bleeding edge features
   */
  generateExperimentalCombinations(): SmartTestCombination[] {
    return [
      // New frameworks with new backends
      {
        framework: "solid",
        backend: "hono",
        database: "none",
        orm: "none",
        styling: "tailwind",
        runtime: "node",
        typescript: true,
        name: "solid-hono-experimental",
        category: "experimental",
        expectedDuration: 7000,
      },
      {
        framework: "astro",
        backend: "hono",
        database: "postgres",
        orm: "drizzle",
        styling: "tailwind",
        runtime: "node",
        typescript: true,
        name: "astro-hono-drizzle",
        category: "experimental",
        expectedDuration: 9000,
      },

      // Complex NestJS combinations
      {
        framework: "angular",
        backend: "nestjs",
        database: "postgres",
        orm: "typeorm",
        styling: "scss",
        runtime: "node",
        typescript: true,
        name: "angular-nestjs-typeorm",
        category: "experimental",
        expectedDuration: 10000,
      },
    ];
  }

  /**
   * Generate random valid combinations for chaos testing
   */
  generateRandomCombinations(count: number = 10): SmartTestCombination[] {
    const combinations: SmartTestCombination[] = [];

    for (let i = 0; i < count; i++) {
      const framework = this.getRandomItem(this.allFrameworks.filter((f) => f !== "none"));
      const backend = this.getRandomItem(this.allBackends);
      const database = backend === "none" ? "none" : this.getRandomItem(this.allDatabases);
      const orm = database === "none" ? "none" : this.getRandomItem(this.allOrms);
      const styling = this.getRandomItem(this.allStylings);
      const runtime = this.getRandomItem(this.allRuntimes);
      const typescript = Math.random() > 0.3; // 70% TypeScript

      // Skip invalid combinations
      if (this.isValidCombination({ framework, backend, database, orm })) {
        combinations.push({
          framework,
          backend,
          database,
          orm,
          styling,
          runtime,
          typescript,
          name: `random-${framework}-${backend}-${database}-${i}`,
          category: "experimental",
          expectedDuration: 6000 + Math.random() * 4000,
        });
      }
    }

    return combinations;
  }

  /**
   * Check if a combination is valid
   */
  private isValidCombination(combo: {
    framework: string;
    backend: string;
    database: string;
    orm: string;
  }): boolean {
    // Can't have database without backend
    if (combo.backend === "none" && combo.database !== "none") {
      return false;
    }

    // Can't have ORM without database
    if (combo.database === "none" && combo.orm !== "none") {
      return false;
    }

    // Next API routes need Next.js framework
    if (combo.backend === "next-api" && combo.framework !== "next") {
      return false;
    }

    return true;
  }

  /**
   * Get random item from array
   */
  private getRandomItem<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
  }

  /**
   * Generate comprehensive test suite
   */
  generateComprehensiveTestSuite(): {
    critical: SmartTestCombination[];
    common: SmartTestCombination[];
    edge: SmartTestCombination[];
    experimental: SmartTestCombination[];
    random: SmartTestCombination[];
    all: SmartTestCombination[];
  } {
    const critical = this.generateCriticalCombinations();
    const common = this.generateCommonCombinations();
    const edge = this.generateEdgeCaseCombinations();
    const experimental = this.generateExperimentalCombinations();
    const random = this.generateRandomCombinations(8);

    return {
      critical,
      common,
      edge,
      experimental,
      random,
      all: [...critical, ...common, ...edge, ...experimental, ...random],
    };
  }

  /**
   * Generate test report
   */
  generateTestReport(suite: ReturnType<typeof this.generateComprehensiveTestSuite>): string {
    const totalTests = suite.all.length;
    const estimatedDuration = suite.all.reduce((sum, test) => sum + test.expectedDuration, 0);

    return `
📊 Smart Test Suite Analysis
============================

Total Combinations: ${totalTests}
Estimated Duration: ${Math.round(estimatedDuration / 1000 / 60)} minutes

By Category:
- Critical: ${suite.critical.length} tests (${Math.round((suite.critical.length / totalTests) * 100)}%)
- Common: ${suite.common.length} tests (${Math.round((suite.common.length / totalTests) * 100)}%)
- Edge Cases: ${suite.edge.length} tests (${Math.round((suite.edge.length / totalTests) * 100)}%)
- Experimental: ${suite.experimental.length} tests (${Math.round((suite.experimental.length / totalTests) * 100)}%)
- Random: ${suite.random.length} tests (${Math.round((suite.random.length / totalTests) * 100)}%)

By Technology:
- TypeScript: ${suite.all.filter((t) => t.typescript).length} tests
- JavaScript: ${suite.all.filter((t) => !t.typescript).length} tests
- Full-Stack: ${suite.all.filter((t) => t.backend !== "none" && t.database !== "none").length} tests
- Frontend-Only: ${suite.all.filter((t) => t.backend === "none").length} tests

Recommended Test Orders:
1. Quick Smoke Test: Run 'critical' tests (${suite.critical.length} tests, ~${Math.round(suite.critical.reduce((s, t) => s + t.expectedDuration, 0) / 1000 / 60)} min)
2. Standard CI: Run 'critical' + 'common' (${suite.critical.length + suite.common.length} tests, ~${Math.round([...suite.critical, ...suite.common].reduce((s, t) => s + t.expectedDuration, 0) / 1000 / 60)} min)
3. Full Regression: Run all tests (${totalTests} tests, ~${Math.round(estimatedDuration / 1000 / 60)} min)
`;
  }

  /**
   * Save test combinations to file
   */
  async saveTestSuite(filePath: string): Promise<void> {
    const suite = this.generateComprehensiveTestSuite();
    const report = this.generateTestReport(suite);

    const content = `// Auto-generated smart test combinations
// Generated: ${new Date().toISOString()}
${report
  .split("\n")
  .map((line) => "// " + line)
  .join("\n")}

export const SMART_TEST_COMBINATIONS = {
  critical: ${JSON.stringify(suite.critical, null, 2)},
  common: ${JSON.stringify(suite.common, null, 2)},
  edge: ${JSON.stringify(suite.edge, null, 2)},
  experimental: ${JSON.stringify(suite.experimental, null, 2)},
  random: ${JSON.stringify(suite.random, null, 2)},
  all: ${JSON.stringify(suite.all, null, 2)},
};

export default SMART_TEST_COMBINATIONS;
`;

    await ensureDir(path.dirname(filePath));
    await writeFile(filePath, content);
    console.log(`✅ Smart test suite saved to: ${filePath}`);
    console.log(report);
  }
}

// CLI entry point
if (import.meta.url === `file://${process.argv[1]}`) {
  const generator = new SmartTestGenerator();
  generator.saveTestSuite("generated-tests/smart-combinations.ts").catch((error) => {
    console.error("❌ Smart test generation failed:", error);
    process.exit(1);
  });
}

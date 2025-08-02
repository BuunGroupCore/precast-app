import path from "path";
import { fileURLToPath } from "url";
import { TestSuite } from "../src/test-framework/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CLI_PATH = path.resolve(process.cwd(), "dist/index.js");

export function createCoreTests() {
  const suite = new TestSuite(CLI_PATH);

  // Setup hooks
  suite.beforeAll(async () => {
    console.log("🔧 Setting up core CLI tests...");
  });

  suite.afterAll(async () => {
    console.log("🧹 Cleaning up core CLI tests...");
  });

  // Test 1: Help Command
  suite.test(
    "CLI shows help correctly",
    async (context) => {
      const result = await suite.runCLI(["--help"]);

      await suite.expectExitCode(result, 0, "Help should exit successfully");
      await suite.expectContains(
        result.stdout,
        "create-precast-app",
        "Should show program name",
      );
      await suite.expectContains(
        result.stdout,
        "Frontend framework",
        "Should show framework option",
      );
      await suite.expectContains(
        result.stdout,
        "Backend framework",
        "Should show backend option",
      );
    },
    { tags: ["basic", "help"] },
  );

  // Test 2: Version Command
  suite.test(
    "CLI shows version correctly",
    async (context) => {
      const result = await suite.runCLI(["--version"]);

      await suite.expectExitCode(result, 0, "Version should exit successfully");
      await suite.expectContains(
        result.stdout,
        "0.1.0",
        "Should show correct version",
      );
    },
    { tags: ["basic", "version"] },
  );

  // Test 3: Validation - Invalid Configuration
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
        "--no-git",
      ]);

      await suite.expectExitCode(result, 1, "Should fail validation");
      await suite.expectContains(
        result.stdout,
        "Configuration errors",
        "Should show validation errors",
      );
      await suite.expectContains(
        result.stdout,
        "Angular requires TypeScript",
        "Should show specific error",
      );
    },
    { tags: ["validation", "error-handling"] },
  );

  // Test 4: Validation - Incompatible ORM/Database
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
        "--no-git",
      ]);

      await suite.expectExitCode(result, 1, "Should fail validation");
      await suite.expectContains(
        result.stdout,
        "Configuration errors",
        "Should show validation errors",
      );
      await suite.expectContains(
        result.stdout,
        "incompatible",
        "Should mention incompatibility",
      );
    },
    { tags: ["validation", "error-handling"] },
  );

  // Test 5: Actually Create a Project
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
          "--yes",
        ],
        {
          timeout: 45000,
        },
      );

      await suite.expectExitCode(result, 0, "Project creation should succeed");

      // Verify project structure was actually created
      await suite.expectFileExists(
        "test-react-project/package.json",
        "Should create package.json",
      );
      await suite.expectFileExists(
        "test-react-project/src/App.tsx",
        "Should create React App component",
      );
      await suite.expectFileExists(
        "test-react-project/vite.config.ts",
        "Should create Vite config",
      );
      await suite.expectFileExists(
        "test-react-project/tsconfig.json",
        "Should create TypeScript config",
      );
      await suite.expectFileExists(
        "test-react-project/tailwind.config.js",
        "Should create Tailwind config",
      );

      // Verify package.json has correct dependencies
      await suite.expectFileContains(
        "test-react-project/package.json",
        '"react"',
        "Should include React dependency",
      );
      await suite.expectFileContains(
        "test-react-project/package.json",
        '"typescript"',
        "Should include TypeScript",
      );
      await suite.expectFileContains(
        "test-react-project/package.json",
        '"tailwindcss"',
        "Should include Tailwind CSS",
      );
      await suite.expectFileContains(
        "test-react-project/package.json",
        '"vite"',
        "Should include Vite",
      );
    },
    { tags: ["validation", "generation"], timeout: 60000 },
  );

  return suite;
}

// Export for direct execution
export default createCoreTests;

import path from "path";
import { fileURLToPath } from "url";

import { TestSuite } from "../src/test-framework/index.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CLI_PATH = path.resolve(process.cwd(), "dist/cli.js");
export function createCoreTests() {
  const suite = new TestSuite(CLI_PATH);
  suite.beforeAll(async () => {
    console.log("🔧 Setting up core CLI tests...");
  });
  suite.afterAll(async () => {
    console.log("🧹 Cleaning up core CLI tests...");
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
        "--yes",
      ]);
      await suite.expectExitCode(result, 0, "Should succeed with auto-correction");
      await suite.expectContains(
        result.stdout,
        "TypeScript ✓",
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
        "--yes",
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
          "--yes",
        ],
        {
          timeout: 45000,
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
    { tags: ["validation", "generation"], timeout: 60000 }
  );
  return suite;
}
export default createCoreTests;

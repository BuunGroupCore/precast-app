import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { execa } from "execa";
import fs from "fs-extra";
import path from "path";
import os from "os";

describe("CLI Options Integration Tests", () => {
  let testDir: string;
  const CLI_PATH = path.join(process.cwd(), "dist", "cli.js");
  
  beforeEach(async () => {
    // Create temporary test directory
    testDir = await fs.mkdtemp(path.join(os.tmpdir(), "precast-cli-test-"));
    process.chdir(testDir);
  });
  
  afterEach(async () => {
    // Clean up
    process.chdir(path.dirname(testDir));
    await fs.remove(testDir);
  });

  describe("Framework + Backend + Database Combinations", () => {
    const testCases = [
      {
        name: "React + Express + PostgreSQL + Prisma + Tailwind + TypeScript",
        args: [
          "--framework", "react",
          "--backend", "express",
          "--database", "postgres",
          "--orm", "prisma",
          "--styling", "tailwind"
        ],
        verify: {
          files: [
            "package.json",
            "tsconfig.json",
            "tailwind.config.js",
            "postcss.config.js",
            "vite.config.ts",
            ".env.example",
            "src/App.tsx",
            "src/main.tsx"
          ],
          packageJson: {
            dependencies: ["react", "react-dom", "@prisma/client", "axios", "@tanstack/react-query"],
            devDependencies: ["typescript", "tailwindcss", "prisma", "@types/react"]
          },
          envVars: ["DATABASE_URL=postgresql://"]
        }
      },
      {
        name: "React + Fastify + MySQL + Drizzle + CSS",
        args: [
          "--framework", "react",
          "--backend", "fastify",
          "--database", "mysql",
          "--orm", "drizzle",
          "--styling", "css",
          "--no-typescript"
        ],
        verify: {
          files: [
            "package.json",
            "vite.config.js",
            ".env.example",
            "src/App.jsx",
            "src/index.css"
          ],
          notFiles: ["tsconfig.json", "tailwind.config.js"],
          packageJson: {
            dependencies: ["react", "react-dom", "drizzle-orm", "axios"],
            notDependencies: ["typescript", "tailwindcss"]
          },
          envVars: ["DATABASE_URL=mysql://"]
        }
      },
      {
        name: "React + No Backend + No Database",
        args: [
          "--framework", "react",
          "--backend", "none",
          "--database", "none",
          "--styling", "styled-components"
        ],
        verify: {
          files: ["package.json", "src/App.tsx"],
          packageJson: {
            dependencies: ["react", "react-dom", "styled-components"],
            notDependencies: ["axios", "@tanstack/react-query", "@prisma/client"]
          }
        }
      },
      {
        name: "React + MongoDB + Mongoose",
        args: [
          "--framework", "react",
          "--backend", "express",
          "--database", "mongodb",
          "--orm", "mongoose",
          "--styling", "scss"
        ],
        verify: {
          files: ["package.json", ".env.example"],
          packageJson: {
            dependencies: ["react", "mongoose"],
            devDependencies: ["sass"]
          },
          envVars: ["DATABASE_URL=mongodb://"]
        }
      }
    ];

    testCases.forEach(testCase => {
      it(testCase.name, async () => {
        const projectName = "test-project";
        
        // Run CLI
        const { stdout } = await execa("node", [
          CLI_PATH,
          projectName,
          "-y",
          ...testCase.args
        ]);
        
        expect(stdout).toContain("Project created successfully");
        
        const projectPath = path.join(testDir, projectName);
        
        // Verify files exist
        if (testCase.verify.files) {
          for (const file of testCase.verify.files) {
            const filePath = path.join(projectPath, file);
            expect(await fs.pathExists(filePath), `File ${file} should exist`).toBe(true);
          }
        }
        
        // Verify files don't exist
        if (testCase.verify.notFiles) {
          for (const file of testCase.verify.notFiles) {
            const filePath = path.join(projectPath, file);
            expect(await fs.pathExists(filePath), `File ${file} should not exist`).toBe(false);
          }
        }
        
        // Verify package.json
        if (testCase.verify.packageJson) {
          const pkg = await fs.readJson(path.join(projectPath, "package.json"));
          
          // Check dependencies
          if (testCase.verify.packageJson.dependencies) {
            for (const dep of testCase.verify.packageJson.dependencies) {
              expect(pkg.dependencies || pkg.devDependencies).toHaveProperty(dep);
            }
          }
          
          // Check not dependencies
          if (testCase.verify.packageJson.notDependencies) {
            for (const dep of testCase.verify.packageJson.notDependencies) {
              expect(pkg.dependencies?.[dep]).toBeUndefined();
              expect(pkg.devDependencies?.[dep]).toBeUndefined();
            }
          }
          
          // Check dev dependencies
          if (testCase.verify.packageJson.devDependencies) {
            for (const dep of testCase.verify.packageJson.devDependencies) {
              expect(pkg.devDependencies).toHaveProperty(dep);
            }
          }
        }
        
        // Verify environment variables
        if (testCase.verify.envVars) {
          const envContent = await fs.readFile(
            path.join(projectPath, ".env.example"),
            "utf-8"
          );
          
          for (const envVar of testCase.verify.envVars) {
            expect(envContent).toContain(envVar);
          }
        }
      }, 30000); // 30 second timeout for CLI operations
    });
  });

  describe("Validation Tests", () => {
    it("should reject incompatible database/ORM combinations", async () => {
      await expect(
        execa("node", [
          CLI_PATH,
          "invalid-project",
          "-y",
          "--framework", "react",
          "--database", "mongodb",
          "--orm", "drizzle" // Drizzle doesn't support MongoDB
        ])
      ).rejects.toThrow();
    });

    it("should reject database without backend", async () => {
      await expect(
        execa("node", [
          CLI_PATH,
          "invalid-project",
          "-y",
          "--framework", "react",
          "--backend", "none",
          "--database", "postgres"
        ])
      ).rejects.toThrow();
    });
  });

  describe("Git and Docker Options", () => {
    it("should initialize git repository", async () => {
      await execa("node", [
        CLI_PATH,
        "git-project",
        "-y",
        "--framework", "react",
        "--backend", "none",
        "--styling", "css"
      ]);
      
      const gitDir = path.join(testDir, "git-project", ".git");
      expect(await fs.pathExists(gitDir)).toBe(true);
    });

    it("should skip git with --no-git", async () => {
      await execa("node", [
        CLI_PATH,
        "no-git-project",
        "-y",
        "--framework", "react",
        "--backend", "none",
        "--styling", "css",
        "--no-git"
      ]);
      
      const gitDir = path.join(testDir, "no-git-project", ".git");
      expect(await fs.pathExists(gitDir)).toBe(false);
    });

    it("should generate Docker files with --docker", async () => {
      await execa("node", [
        CLI_PATH,
        "docker-project",
        "-y",
        "--framework", "react",
        "--backend", "express",
        "--database", "postgres",
        "--orm", "prisma",
        "--docker"
      ]);
      
      const dockerFiles = [
        "Dockerfile",
        "docker-compose.yml",
        ".dockerignore"
      ];
      
      for (const file of dockerFiles) {
        const filePath = path.join(testDir, "docker-project", file);
        expect(await fs.pathExists(filePath)).toBe(true);
      }
    });
  });

  describe("Package Manager Detection", () => {
    it("should use specified package manager", async () => {
      const { stdout } = await execa("node", [
        CLI_PATH,
        "pnpm-project",
        "-y",
        "--framework", "react",
        "--backend", "none",
        "--pm", "pnpm"
      ]);
      
      expect(stdout).toContain("pnpm install");
    });
  });
});

describe("Database Setup Documentation", () => {
  it("should generate correct PostgreSQL setup instructions", async () => {
    const readme = await fs.readFile(
      path.join(__dirname, "..", "..", "src", "templates", "base", "README.md.hbs"),
      "utf-8"
    );
    
    expect(readme).toContain("PostgreSQL");
    expect(readme).toContain("docker-compose");
    expect(readme).toContain("db:migrate");
  });
});
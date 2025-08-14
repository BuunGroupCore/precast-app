import os from "os";
import path from "path";

import fsExtra from "fs-extra";
import { describe, it, expect, beforeEach, afterEach } from "vitest";

const { mkdtemp, ensureDir, remove, writeFile, readFile, readJSON, pathExists } = fsExtra;

import { TemplateEngine } from "../template-engine.js";

describe("TemplateEngine", () => {
  let tempDir: string;
  let templateEngine: TemplateEngine;
  let templateRoot: string;

  beforeEach(async () => {
    tempDir = await mkdtemp(path.join(os.tmpdir(), "template-test-"));
    templateRoot = path.join(tempDir, "templates");
    await ensureDir(templateRoot);

    templateEngine = new TemplateEngine(templateRoot);
  });

  afterEach(async () => {
    await remove(tempDir);
  });

  describe("processTemplate", () => {
    it("should process a simple template", async () => {
      const templatePath = path.join(templateRoot, "test.txt.hbs");
      const outputPath = path.join(tempDir, "output.txt");

      await writeFile(templatePath, "Hello {{name}}!");
      await templateEngine.processTemplate(templatePath, outputPath, { name: "World" } as any);
      const content = await readFile(outputPath, "utf-8");
      expect(content).toBe("Hello World!");
    });

    it("should handle conditional blocks", async () => {
      const templatePath = path.join(templateRoot, "conditional.hbs");
      const outputPath = path.join(tempDir, "conditional.txt");

      await writeFile(
        templatePath,
        "{{#if typescript}}TypeScript enabled{{else}}JavaScript{{/if}}"
      );

      await templateEngine.processTemplate(templatePath, outputPath, { typescript: true } as any);

      let content = await readFile(outputPath, "utf-8");
      expect(content).toBe("TypeScript enabled");

      await templateEngine.processTemplate(templatePath, outputPath, { typescript: false } as any, {
        overwrite: true,
      });

      content = await readFile(outputPath, "utf-8");
      expect(content).toBe("JavaScript");
    });

    it("should use custom helpers", async () => {
      const templatePath = path.join(templateRoot, "helpers.hbs");
      const outputPath = path.join(tempDir, "helpers.txt");

      await writeFile(templatePath, "{{#if (eq framework 'react')}}React App{{/if}}");

      await templateEngine.processTemplate(templatePath, outputPath, { framework: "react" } as any);

      const content = await readFile(outputPath, "utf-8");
      expect(content).toBe("React App");
    });
  });

  describe("copyTemplateDirectory", () => {
    it("should copy and process all templates in a directory", async () => {
      const sourceDir = path.join(templateRoot, "project");
      const destDir = path.join(tempDir, "output");

      await ensureDir(path.join(sourceDir, "src"));
      await writeFile(
        path.join(sourceDir, "package.json.hbs"),
        '{"name": "{{name}}", "version": "1.0.0"}'
      );
      await writeFile(
        path.join(sourceDir, "src", "index.js.hbs"),
        "console.log('Hello {{name}}!');"
      );
      await writeFile(path.join(sourceDir, "_gitignore"), "node_modules\n");

      await templateEngine.copyTemplateDirectory("project", destDir, { name: "test-app" } as any);

      const packageJson = await readJSON(path.join(destDir, "package.json"));
      expect(packageJson.name).toBe("test-app");

      const indexJs = await readFile(path.join(destDir, "src", "index.js"), "utf-8");
      expect(indexJs).toBe("console.log('Hello test-app!');");

      const gitignore = await readFile(path.join(destDir, ".gitignore"), "utf-8");
      expect(gitignore).toBe("node_modules\n");
    });
  });

  describe("processConditionalTemplates", () => {
    it("should process templates based on conditions", async () => {
      const destDir = path.join(tempDir, "output");

      await ensureDir(path.join(templateRoot, "feature1"));
      await writeFile(path.join(templateRoot, "feature1", "config.json.hbs"), '{"feature1": true}');

      await ensureDir(path.join(templateRoot, "feature2"));
      await writeFile(path.join(templateRoot, "feature2", "config.json.hbs"), '{"feature2": true}');

      await templateEngine.processConditionalTemplates(
        [
          {
            condition: true,
            sourceDir: "feature1",
          },
          {
            condition: false,
            sourceDir: "feature2",
          },
          {
            condition: (ctx) => ctx.name === "test-app",
            sourceDir: "feature1",
            destDir: "nested",
          },
        ],
        destDir,
        { name: "test-app" } as any
      );

      expect(await pathExists(path.join(destDir, "config.json"))).toBe(true);
      expect(await pathExists(path.join(destDir, "nested", "config.json"))).toBe(true);

      const config1 = await readJSON(path.join(destDir, "config.json"));
      expect(config1.feature1).toBe(true);
      expect(config1.feature2).toBeUndefined();
    });
  });
});

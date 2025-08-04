import path from "path";
import { fileURLToPath } from "url";

import fs from "fs-extra";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function getTemplateRoot(): string {
  // In development, templates are in src/templates
  // In built version, templates are in dist/templates
  const devPath = path.join(__dirname, "..", "templates");
  const distPath = path.join(__dirname, "..", "..", "templates");

  // Check if we're in the built version (dist directory)
  if (__dirname.includes(path.sep + "dist" + path.sep)) {
    return distPath;
  }

  // Check which path actually exists
  if (fs.existsSync(devPath)) {
    return devPath;
  }

  if (fs.existsSync(distPath)) {
    return distPath;
  }

  // Fallback - try relative to current working directory
  const cwd = process.cwd();
  const fallbackPath = path.join(cwd, "dist", "templates");
  if (fs.existsSync(fallbackPath)) {
    return fallbackPath;
  }

  throw new Error(
    `Template directory not found. Tried paths: ${devPath}, ${distPath}, ${fallbackPath}`
  );
}

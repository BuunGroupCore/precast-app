import path from "path";
import { fileURLToPath } from "url";

import { existsSync } from "fs-extra";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export function getTemplateRoot(): string {
  // In production, templates are in the same directory as the compiled JS
  const prodPath = path.join(__dirname, "templates");

  // In development, templates are in src/templates
  const devPath = path.join(__dirname, "..", "templates");

  // Alternative path for different build structures
  const altPath = path.join(__dirname, "..", "..", "templates");

  // Check if we're in a dist directory and templates might be at dist/templates
  const distPath = __dirname.includes("dist")
    ? path.join(__dirname.split("dist")[0], "dist", "templates")
    : null;

  if (existsSync(prodPath)) {
    return prodPath;
  }
  if (existsSync(devPath)) {
    return devPath;
  }
  if (existsSync(altPath)) {
    return altPath;
  }
  if (distPath && existsSync(distPath)) {
    return distPath;
  }

  // Last resort: check relative to cwd
  const cwd = process.cwd();
  const cwdPath = path.join(cwd, "dist", "templates");
  if (existsSync(cwdPath)) {
    return cwdPath;
  }

  throw new Error(
    `Template directory not found. Tried paths: ${prodPath}, ${devPath}, ${altPath}, ${distPath}, ${cwdPath}. __dirname: ${__dirname}`
  );
}

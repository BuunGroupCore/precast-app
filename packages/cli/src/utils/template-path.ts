import path from "path";
import { fileURLToPath } from "url";

import fsExtra from "fs-extra";

const { existsSync } = fsExtra;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Get the root path for templates directory
 * @returns Path to the templates directory
 */
export function getTemplateRoot(): string {
  const prodPath = path.join(__dirname, "templates");

  const devPath = path.join(__dirname, "..", "templates");

  const altPath = path.join(__dirname, "..", "..", "templates");

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

  const cwd = process.cwd();
  const cwdPath = path.join(cwd, "dist", "templates");
  if (existsSync(cwdPath)) {
    return cwdPath;
  }

  throw new Error(
    `Template directory not found. Tried paths: ${prodPath}, ${devPath}, ${altPath}, ${distPath}, ${cwdPath}. __dirname: ${__dirname}`
  );
}

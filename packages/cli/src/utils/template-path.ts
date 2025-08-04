import path from "path";
import { fileURLToPath } from "url";

import fsExtra from "fs-extra";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export function getTemplateRoot(): string {
  const prodPath = path.join(__dirname, "templates");
  const devPath = path.join(__dirname, "..", "templates");
  const altPath = path.join(__dirname, "..", "..", "templates");
  if (fsExtra.existsSync(prodPath)) {
    return prodPath;
  }
  if (fsExtra.existsSync(devPath)) {
    return devPath;
  }
  if (fsExtra.existsSync(altPath)) {
    return altPath;
  }
  const cwd = process.cwd();
  const cwdPath = path.join(cwd, "dist", "templates");
  if (fsExtra.existsSync(cwdPath)) {
    return cwdPath;
  }
  throw new Error(
    `Template directory not found. Tried paths: ${prodPath}, ${devPath}, ${altPath}, ${cwdPath}. __dirname: ${__dirname}`
  );
}

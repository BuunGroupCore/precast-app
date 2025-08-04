import path from "node:path";

import fsExtra from "fs-extra";

export async function getPackageVersion(): Promise<string> {
  try {
    const packageJsonPath = path.join(import.meta.dirname, "../../package.json");
    const packageJson = await fsExtra.readJSON(packageJsonPath);
    return packageJson.version || "1.0.0";
  } catch {
    return "1.0.0";
  }
}

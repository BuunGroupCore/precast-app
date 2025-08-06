import path from "node:path";

import fsExtra from "fs-extra";
// eslint-disable-next-line import/no-named-as-default-member
const { readJSON } = fsExtra;

/**
 * Get the version number from package.json
 * @returns Package version string
 */
export async function getPackageVersion(): Promise<string> {
  try {
    const packageJsonPath = path.join(import.meta.dirname, "../../package.json");
    const packageJson = await readJSON(packageJsonPath);
    return packageJson.version || "1.0.0";
  } catch {
    return "1.0.0";
  }
}

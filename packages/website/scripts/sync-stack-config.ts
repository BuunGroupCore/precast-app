#!/usr/bin/env node
import { readFileSync, writeFileSync } from "fs";
import { resolve } from "path";

export {};

/**
 * Syncs stack configuration from the shared config to local data
 * This ensures the docs always reflect the current stack options
 */
const syncStackConfig = () => {
  const sharedConfigPath = resolve(process.cwd(), "../shared/stack-config.ts");
  const localDataPath = resolve(process.cwd(), "src/data/stackOptions.ts");

  try {
    // Read the shared config file
    const sharedConfig = readFileSync(sharedConfigPath, "utf-8");

    // Extract the relevant parts (definitions arrays)
    const frameworkDefsMatch = sharedConfig.match(
      /export const frameworkDefs[\s\S]*?(?=\nexport|$)/
    );
    const backendDefsMatch = sharedConfig.match(/export const backendDefs[\s\S]*?(?=\nexport|$)/);
    const databaseDefsMatch = sharedConfig.match(/export const databaseDefs[\s\S]*?(?=\nexport|$)/);
    const ormDefsMatch = sharedConfig.match(/export const ormDefs[\s\S]*?(?=\nexport|$)/);
    const stylingDefsMatch = sharedConfig.match(/export const stylingDefs[\s\S]*?(?=\nexport|$)/);
    const runtimeDefsMatch = sharedConfig.match(/export const runtimeDefs[\s\S]*?(?=\nexport|$)/);
    const stackOptionInterface = sharedConfig.match(
      /export interface StackOption[\s\S]*?(?=\n\nexport|$)/
    );

    if (
      !frameworkDefsMatch ||
      !backendDefsMatch ||
      !databaseDefsMatch ||
      !ormDefsMatch ||
      !stylingDefsMatch ||
      !runtimeDefsMatch ||
      !stackOptionInterface
    ) {
      throw new Error("Could not extract all required definitions from shared config");
    }

    // Generate the local data file
    const localDataContent = `// This file is auto-generated from the shared stack-config.ts
// To update this file, run: bun run sync:stack-config

${stackOptionInterface[0]}

${frameworkDefsMatch[0]}

${backendDefsMatch[0]}

${databaseDefsMatch[0]}

${ormDefsMatch[0]}

${stylingDefsMatch[0]}

${runtimeDefsMatch[0]}
`;

    // Write the local data file
    writeFileSync(localDataPath, localDataContent, "utf-8");

    console.log("✅ Stack configuration synced successfully!");
  } catch (error) {
    console.error("❌ Failed to sync stack configuration:", error);
    process.exit(1);
  }
};

// Run the sync
syncStackConfig();

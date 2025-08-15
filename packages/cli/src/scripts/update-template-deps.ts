#!/usr/bin/env node
import { consola } from "consola";

import { updateTemplateDependencies } from "@/utils/system/update-dependencies.js";

/**
 * Main function to update template dependencies
 */
async function main() {
  consola.start("Updating template dependencies to secure versions...");

  try {
    await updateTemplateDependencies();
    consola.success("✅ All template dependencies have been updated!");
  } catch (error) {
    consola.error("Failed to update template dependencies:", error);
    process.exit(1);
  }
}

main().catch(console.error);

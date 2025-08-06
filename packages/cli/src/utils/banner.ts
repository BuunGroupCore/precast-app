import path from "path";
import { fileURLToPath } from "url";

import fsExtra from "fs-extra";
// eslint-disable-next-line import/no-named-as-default-member
const { pathExists, readFile, writeFile } = fsExtra;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Get the default ASCII art banner for the CLI
 * @returns Default banner string
 */
export function getDefaultBanner(): string {
  return `
████████████████████████████████████████████████████████████████████████████████
█                                                                              █
█  ██████╗ ██████╗ ███████╗ ██████╗ █████╗ ███████╗████████╗                   █
█  ██╔══██╗██╔══██╗██╔════╝██╔════╝██╔══██╗██╔════╝╚══██╔══╝                   █
█  ██████╔╝██████╔╝█████╗  ██║     ███████║███████╗   ██║                      █
█  ██╔═══╝ ██╔══██╗██╔══╝  ██║     ██╔══██║╚════██║   ██║                      █
█  ██║     ██║  ██║███████╗╚██████╗██║  ██║███████║   ██║                      █
█  ╚═╝     ╚═╝  ╚═╝╚══════╝ ╚═════╝╚═╝  ╚═╝╚══════╝   ╚═╝                      █
█                                                                              █
█                                                                              █
████████████████████████████████████████████████████████████████████████████████
  `;
}

/**
 * Load a custom banner from file if available
 * @returns Custom banner string or null if not found
 */
export async function loadCustomBanner(): Promise<string | null> {
  try {
    // Look for banner file in CLI root directory
    const bannerPath = path.join(__dirname, "..", "..", "banner.txt");

    if (await pathExists(bannerPath)) {
      const customBanner = await readFile(bannerPath, "utf-8");
      return customBanner.trim();
    }

    // Also check for banner in current working directory
    const cwdBannerPath = path.join(process.cwd(), "precast-banner.txt");
    if (await pathExists(cwdBannerPath)) {
      const customBanner = await readFile(cwdBannerPath, "utf-8");
      return customBanner.trim();
    }

    return null;
  } catch {
    return null;
  }
}

/**
 * Display the banner (custom or default) to the console
 */
export async function displayBanner(): Promise<void> {
  const customBanner = await loadCustomBanner();
  const banner = customBanner || getDefaultBanner();

  // Use console.log directly for banner to avoid @clack styling
  console.log(banner);
}

/**
 * Create a banner template file for customization
 */
export async function createBannerTemplate(): Promise<void> {
  const bannerPath = path.join(process.cwd(), "precast-banner.txt");
  const template = `
████████████████████████████████████████████████████████████████████████████████
█                                                                              █
█     _____ _   _ _____ _____ _____  __  __ _____   ____   ___  _   _ _   _ _____ █
█    / ____| | | / ____|_   _/ _ \\ \\|  \\/  |_   _| |  _ \\ / _ \\| \\ | | \\ | | ____|█
█   | |    | | | \\___ \\ | || | | | |\\/| | | |   | |_) | |_| |  \\| |  \\| |  _|  █
█   | |__| | |_| |___) || || |_| | |  | | | |   |  _ <|  _  | |\\   | |\\  | |___ █
█    \\_____|\\___/|____/ |_| \\___/|_|  |_| |_|   |_| \\_\\_| |_|_| \\__|_| \\_|_____|█
█                                                                              █
█                          Your Custom Project Banner                         █
█                                                                              █
████████████████████████████████████████████████████████████████████████████████

# Replace this template with your custom ASCII art banner
# This file should be named 'precast-banner.txt' in your project directory
# Or place 'banner.txt' in the CLI installation directory
`;

  if (!(await pathExists(bannerPath))) {
    await writeFile(bannerPath, template.trim());
    console.log(`Created banner template at ${bannerPath}`);
    console.log("Customize this file with your own ASCII art!");
  } else {
    console.log(`Banner template already exists at ${bannerPath}`);
  }
}

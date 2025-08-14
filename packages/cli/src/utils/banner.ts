import path from "path";
import { fileURLToPath } from "url";

import fsExtra from "fs-extra";

const { pathExists, readFile, writeFile } = fsExtra;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Retrieves the default ASCII art banner for the Precast CLI.
 * This banner is displayed when the CLI starts up, providing visual branding
 * and enhancing the user experience.
 *
 * @returns {string} The default ASCII art banner as a multi-line string with decorative borders
 */
export function getDefaultBanner(): string {
  return `
███████████████████████████████████████████████████████████████
█                                                             █
█  ██████╗ ██████╗ ███████╗ ██████╗ █████╗ ███████╗████████╗  █
█  ██╔══██╗██╔══██╗██╔════╝██╔════╝██╔══██╗██╔════╝╚══██╔══╝  █
█  ██████╔╝██████╔╝█████╗  ██║     ███████║███████╗   ██║     █
█  ██╔═══╝ ██╔══██╗██╔══╝  ██║     ██╔══██║╚════██║   ██║     █
█  ██║     ██║  ██║███████╗╚██████╗██║  ██║███████║   ██║     █
█  ╚═╝     ╚═╝  ╚═╝╚══════╝ ╚═════╝╚═╝  ╚═╝╚══════╝   ╚═╝     █
█                                                             █
█                                                             █
███████████████████████████████████████████████████████████████
  `;
}

/**
 * Attempts to load a custom banner from predefined file locations.
 * Looks for banner files in two locations:
 * 1. `banner.txt` in the CLI installation directory
 * 2. `precast-banner.txt` in the current working directory
 *
 * This allows users to customize the CLI banner by providing their own ASCII art.
 *
 * @returns {Promise<string | null>} The custom banner content if found and readable, null otherwise
 * @throws {never} Does not throw - all errors are caught and return null
 */
export async function loadCustomBanner(): Promise<string | null> {
  try {
    const bannerPath = path.join(__dirname, "..", "..", "banner.txt");

    if (await pathExists(bannerPath)) {
      const customBanner = await readFile(bannerPath, "utf-8");
      return customBanner.trim();
    }

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
 * Displays the CLI banner to the console.
 * First attempts to load a custom banner using loadCustomBanner().
 * If no custom banner is found, displays the default banner.
 *
 * This is typically called at the start of CLI execution to provide
 * visual feedback and branding to the user.
 *
 * @returns {Promise<void>} Resolves when the banner has been displayed
 */
export async function displayBanner(): Promise<void> {
  const customBanner = await loadCustomBanner();
  const banner = customBanner || getDefaultBanner();

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

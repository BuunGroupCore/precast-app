import path from "path";
import { fileURLToPath } from "url";

import { pathExists, readFile, writeFile } from "fs-extra";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

export async function displayBanner(): Promise<void> {
  const customBanner = await loadCustomBanner();
  const banner = customBanner || getDefaultBanner();

  // Use console.log directly for banner to avoid @clack styling
  console.log(banner);
}

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

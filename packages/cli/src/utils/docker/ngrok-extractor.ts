/**
 * ngrok URL Extractor
 * Extracts ngrok tunnel URLs from running Docker containers
 */

import { execSync } from "child_process";

export interface NgrokUrls {
  frontend: string;
  api: string;
}

/**
 * Extracts ngrok tunnel URLs from running Docker containers.
 *
 * This function attempts multiple strategies to discover ngrok tunnel URLs:
 * 1. First tries the ngrok API endpoints (ports 4040/4041) for direct URL access
 * 2. Falls back to parsing Docker container logs for tunnel URLs
 *
 * This is useful for development environments where ngrok provides secure tunnels
 * to locally running applications, allowing external access and testing.
 *
 * @returns {Promise<NgrokUrls | null>} Object containing frontend and API tunnel URLs, or null if not found
 * @throws {never} Does not throw - all errors are caught and logged as warnings
 */
export const getNgrokUrls = async (): Promise<NgrokUrls | null> => {
  try {
    const apiUrls = await getNgrokUrlsFromApi();
    if (apiUrls) {
      return apiUrls;
    }

    const logUrls = await getNgrokUrlsFromLogs();
    if (logUrls) {
      return logUrls;
    }

    return null;
  } catch (error) {
    console.warn("Failed to extract ngrok URLs:", error);
    return null;
  }
};

/**
 * Get ngrok URLs from the ngrok API (port 4040/4041)
 */
const getNgrokUrlsFromApi = async (): Promise<NgrokUrls | null> => {
  try {
    const [frontendUrl, apiUrl] = await Promise.all([
      getNgrokUrlFromPort(4040), // Frontend tunnel
      getNgrokUrlFromPort(4041), // API tunnel
    ]);

    if (frontendUrl && apiUrl) {
      return {
        frontend: frontendUrl,
        api: apiUrl,
      };
    }

    return null;
  } catch (error) {
    console.warn("Failed to get URLs from ngrok API:", error);
    return null;
  }
};

/**
 * Get ngrok URL from a specific inspection port
 */
const getNgrokUrlFromPort = async (port: number): Promise<string | null> => {
  try {
    const response = await fetch(`http://localhost:${port}/api/tunnels`);
    if (!response.ok) {
      return null;
    }

    const data = (await response.json()) as any;
    const tunnel = data.tunnels?.find((t: any) => t.public_url?.includes("https://"));

    return tunnel?.public_url || null;
  } catch {
    return null;
  }
};

/**
 * Get ngrok URLs from container logs (fallback method)
 */
const getNgrokUrlsFromLogs = async (): Promise<NgrokUrls | null> => {
  try {
    const containers = execSync('docker ps --format "{{.Names}}" | grep ngrok', {
      encoding: "utf8",
    })
      .trim()
      .split("\n")
      .filter((name) => name);

    if (containers.length < 2) {
      return null;
    }

    const urls: Record<string, string> = {};

    for (const container of containers) {
      try {
        const logs = execSync(`docker logs ${container}`, { encoding: "utf8" });

        const urlMatch = logs.match(/https:\/\/[a-z0-9-]+\.(ngrok-free\.app|ngrok\.app|ngrok\.io)/);
        if (urlMatch) {
          if (container.includes("web") || container.includes("frontend")) {
            urls.frontend = urlMatch[0];
          } else if (container.includes("api") || container.includes("backend")) {
            urls.api = urlMatch[0];
          }
        }
      } catch (containerError) {
        console.warn(`Failed to get logs from ${container}:`, containerError);
      }
    }

    if (urls.frontend && urls.api) {
      return {
        frontend: urls.frontend,
        api: urls.api,
      };
    }

    return null;
  } catch (error) {
    console.warn("Failed to get URLs from logs:", error);
    return null;
  }
};

/**
 * Checks if ngrok Docker containers are currently running.
 *
 * This function verifies the presence of at least 2 ngrok containers,
 * which is the expected minimum for a typical setup (frontend + API tunnels).
 * Useful for determining if the ngrok infrastructure is ready before
 * attempting to extract tunnel URLs.
 *
 * @returns {boolean} True if 2 or more ngrok containers are running, false otherwise
 * @throws {never} Does not throw - returns false on any Docker command failure
 */
export const areNgrokContainersRunning = (): boolean => {
  try {
    const output = execSync('docker ps --format "{{.Names}}" | grep ngrok | wc -l', {
      encoding: "utf8",
    });
    const count = parseInt(output.trim());
    return count >= 2;
  } catch {
    return false;
  }
};

/**
 * Get detailed ngrok container status
 */
export const getNgrokContainerStatus = (): Array<{
  name: string;
  status: string;
  ports: string;
}> => {
  try {
    const output = execSync(
      'docker ps --filter "name=ngrok" --format "{{.Names}}|{{.Status}}|{{.Ports}}"',
      { encoding: "utf8" }
    );

    return output
      .trim()
      .split("\n")
      .filter((line) => line)
      .map((line) => {
        const [name, status, ports] = line.split("|");
        return { name, status, ports };
      });
  } catch {
    return [];
  }
};

/**
 * Waits for ngrok tunnels to be established with a configurable timeout.
 *
 * This function polls for tunnel availability at 2-second intervals until either:
 * - Tunnel URLs are successfully extracted
 * - The timeout period expires
 *
 * Useful during container startup when tunnels may take time to initialize.
 * The default 30-second timeout should be sufficient for most ngrok startup scenarios.
 *
 * @param {number} [timeoutMs=30000] Maximum time to wait in milliseconds (default: 30 seconds)
 * @returns {Promise<NgrokUrls | null>} The tunnel URLs if found within timeout, null if timeout expires
 * @throws {never} Does not throw - returns null on timeout or errors
 */
export const waitForNgrokTunnels = async (timeoutMs: number = 30000): Promise<NgrokUrls | null> => {
  const startTime = Date.now();

  while (Date.now() - startTime < timeoutMs) {
    const urls = await getNgrokUrls();
    if (urls) {
      return urls;
    }

    await new Promise((resolve) => setTimeout(resolve, 2000));
  }

  return null;
};

/**
 * Display ngrok status information
 */
export const displayNgrokStatus = async (): Promise<void> => {
  const containers = getNgrokContainerStatus();

  if (containers.length === 0) {
    console.log("❌ No ngrok containers found");
    return;
  }

  console.log("🔍 ngrok Container Status:");
  containers.forEach((container) => {
    console.log(`   ${container.name}: ${container.status}`);
    if (container.ports) {
      console.log(`      Ports: ${container.ports}`);
    }
  });

  const urls = await getNgrokUrls();
  if (urls) {
    console.log("\n🌐 Active Tunnels:");
    console.log(`   Frontend: ${urls.frontend}`);
    console.log(`   API: ${urls.api}`);
  } else {
    console.log("\n⚠️  Tunnels not yet established or URLs not accessible");
  }
};

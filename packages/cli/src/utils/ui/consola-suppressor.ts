/**
 * Global consola output suppressor for clean user experience
 */

/** Map to store original consola log levels */
let originalLevels: Map<any, number> = new Map();
/** Flag to track if suppression is currently active */
let isSuppressionActive = false;

/**
 * Suppress all consola instances globally to reduce verbose output
 * This affects all modules that use consola and intercepts console methods
 * @param debug - If true, suppression is skipped to allow debugging
 */
export async function suppressConsolaGlobally(debug: boolean = false): Promise<void> {
  if (isSuppressionActive || debug) return;

  try {
    // Import all possible consola instances
    const { consola } = await import("consola");
    const consolaModule = await import("consola");
    const defaultConsola = consolaModule.default;

    // Store original levels
    originalLevels.set(consola, consola.level);
    if (defaultConsola && defaultConsola !== consola) {
      originalLevels.set(defaultConsola, defaultConsola.level);
    }

    // Set to error-only mode (level 0 = errors only)
    // This will suppress info, success, and warning messages
    consola.level = 0;
    if (defaultConsola && defaultConsola !== consola) {
      defaultConsola.level = 0;
    }

    // Also intercept console methods that might be used directly
    const originalConsoleLog = console.log;
    const originalConsoleInfo = console.info;

    // Override console methods to filter out verbose messages
    console.log = (...args: any[]) => {
      const message = args.join(" ").toLowerCase();
      // Filter out common verbose patterns
      if (
        message.includes("setting up") ||
        message.includes("configuring") ||
        message.includes("installing") ||
        message.includes("🚀") ||
        message.includes("📦")
      ) {
        return; // Suppress these messages
      }
      originalConsoleLog.apply(console, args);
    };

    console.info = (...args: any[]) => {
      const message = args.join(" ").toLowerCase();
      // Filter out info messages in non-debug mode
      if (
        message.includes("setting up") ||
        message.includes("configuring") ||
        message.includes("installing") ||
        message.includes("🚀") ||
        message.includes("📦")
      ) {
        return; // Suppress these messages
      }
      originalConsoleInfo.apply(console, args);
    };

    // Store original methods for restoration
    (global as any).__originalConsoleLog = originalConsoleLog;
    (global as any).__originalConsoleInfo = originalConsoleInfo;

    isSuppressionActive = true;
  } catch (_error) {
    // Fail silently if consola isn't available
  }
}

/**
 * Restore all consola instances to their original levels and console methods
 */
export async function restoreConsolaGlobally(): Promise<void> {
  if (!isSuppressionActive) return;

  try {
    // Restore consola levels
    for (const [consolaInstance, originalLevel] of originalLevels) {
      if (consolaInstance) {
        consolaInstance.level = originalLevel;
      }
    }

    // Restore console methods
    if ((global as any).__originalConsoleLog) {
      console.log = (global as any).__originalConsoleLog;
      delete (global as any).__originalConsoleLog;
    }

    if ((global as any).__originalConsoleInfo) {
      console.info = (global as any).__originalConsoleInfo;
      delete (global as any).__originalConsoleInfo;
    }

    originalLevels.clear();
    isSuppressionActive = false;
  } catch (_error) {
    // Fail silently
  }
}

/**
 * Check if suppression is currently active
 * @returns True if suppression is active, false otherwise
 */
export function getSuppressionStatus(): boolean {
  return isSuppressionActive;
}

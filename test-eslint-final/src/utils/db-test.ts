/**
 * Database Connection Test
 * This file tests the database connection from the frontend
 * For production, you should use a proper backend API
 */

/**
 * Test PostgreSQL connection through a backend API
 * Note: Direct database connections from frontend are not secure
 * This should only be used for development testing
 */
export async function testDatabaseConnection(): Promise<boolean> {
  try {
    // In a real app, this would call your backend API
    const response = await fetch("/api/health/database", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      console.error("Database connection failed:", response.statusText);
      return false;
    }

    const data = await response.json();
    console.log("Database connection successful:", data);
    return true;
  } catch (error) {
    console.error("Failed to test database connection:", error);
    return false;
  }
}

/**
 * Example of how to structure your backend API endpoint
 * This would be in your Express/Fastify/Hono backend
 *
 * app.get('/api/health/database', async (req, res) => {
 *   try {
 *     // Test database connection using your ORM
 *
 *     await db.execute('SELECT 1');
 *
 *
 *     res.json({ status: 'connected', database: 'postgres' });
 *   } catch (error) {
 *     res.status(500).json({ status: 'error', message: error.message });
 *   }
 * });
 */

/**
 * Initialize database connection test on page load
 */
export function initDatabaseTest(): void {
  // Add a button or indicator to test database connection
  const testButton = document.createElement("button");
  testButton.textContent = "Test Database Connection";
  testButton.className = "db-test-button";
  testButton.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    padding: 10px 20px;
    background: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    z-index: 1000;
  `;

  testButton.addEventListener("click", async () => {
    testButton.disabled = true;
    testButton.textContent = "Testing...";

    const isConnected = await testDatabaseConnection();

    if (isConnected) {
      testButton.style.background = "#28a745";
      testButton.textContent = "✓ Database Connected";
    } else {
      testButton.style.background = "#dc3545";
      testButton.textContent = "✗ Connection Failed";
    }

    setTimeout(() => {
      testButton.disabled = false;
      testButton.style.background = "#007bff";
      testButton.textContent = "Test Database Connection";
    }, 3000);
  });

  document.body.appendChild(testButton);
}

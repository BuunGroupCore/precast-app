import { test, expect } from "@playwright/test";

test.describe("Builder Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/builder");
  });

  test("should display builder page with all sections", async ({ page }) => {
    // Check main elements
    await expect(page.locator("text=CHOOSE YOUR POWERS!")).toBeVisible();
    await expect(page.locator("text=FRONTEND POWER")).toBeVisible();
    await expect(page.locator("text=BACKEND STRENGTH")).toBeVisible();
    await expect(page.locator("text=DATA STORAGE")).toBeVisible();
    await expect(page.locator("text=STYLE POWER")).toBeVisible();
    await expect(page.locator("text=POWER-UPS")).toBeVisible();
  });

  test("should generate valid command", async ({ page }) => {
    // Default selection should generate a command
    const command = await page.locator(".terminal-comic pre").textContent();
    expect(command).toContain("npx create-precast-app");
    expect(command).toContain("--framework=react");
    expect(command).toContain("--backend=node");
    expect(command).toContain("--database=postgres");
  });

  test("should update command when changing framework", async ({ page }) => {
    // Click on Vue
    await page.click("text=Vue");

    const command = await page.locator(".terminal-comic pre").textContent();
    expect(command).toContain("--framework=vue");
  });

  test("should show ORM section only when database is selected", async ({ page }) => {
    // ORM should be visible by default
    await expect(page.locator("text=ORM MAGIC")).toBeVisible();

    // Select "None" for database
    await page.click("text=DATA STORAGE");
    await page.click('button:has-text("None"):near(:text("DATA STORAGE"))');

    // ORM section should be hidden
    await expect(page.locator("text=ORM MAGIC")).not.toBeVisible();
  });

  test("should handle incompatible selections", async ({ page }) => {
    // Select MongoDB
    await page.click("text=MongoDB");

    // Try to select Drizzle (incompatible with MongoDB)
    const drizzleButton = page.locator('button:has-text("Drizzle")');

    // Should be disabled
    await expect(drizzleButton).toHaveAttribute("disabled", "");
  });

  test("should copy command to clipboard", async ({ page, context }) => {
    // Grant clipboard permissions
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);

    // Click copy button
    await page.click("text=COPY COMMAND");

    // Check for success state
    await expect(page.locator("text=COPIED!")).toBeVisible();
  });

  test("should generate random project names", async ({ page }) => {
    const initialName = await page.inputValue('input[type="text"]');

    // Click random button
    await page.click('button:has-text("RANDOM")');

    const newName = await page.inputValue('input[type="text"]');
    expect(newName).not.toBe(initialName);
    expect(newName).toMatch(/^[a-z0-9-]+$/);
  });

  test("should validate project name", async ({ page }) => {
    // Enter invalid name
    await page.fill('input[type="text"]', "Invalid Name!");

    // Should not show valid badge
    await expect(page.locator("text=valid ✓")).not.toBeVisible();

    // Enter valid name
    await page.fill('input[type="text"]', "valid-project-name");

    // Should show valid badge
    await expect(page.locator("text=valid ✓")).toBeVisible();
  });

  test("should save and load project configurations", async ({ page }) => {
    // Configure a unique setup
    await page.fill('input[type="text"]', "test-save-project");
    await page.click("text=Angular");
    await page.click("text=FastAPI");

    // Save configuration
    await page.click("text=SAVE");
    await expect(page.locator("text=PROJECT SAVED!")).toBeVisible();

    // Reset to different config
    await page.fill('input[type="text"]', "different-project");
    await page.click("text=React");

    // Load saved project
    await page.click('button[title*="LOAD SAVED PROJECTS"]');
    await page.click("text=test-save-project");

    // Verify configuration is restored
    const projectName = await page.inputValue('input[type="text"]');
    expect(projectName).toBe("test-save-project");
    await expect(page.locator('button[data-active="true"]:has-text("Angular")')).toBeVisible();
  });

  test("should show stack summary with correct counts", async ({ page }) => {
    // Check default power count
    const powerCount = await page
      .locator('.action-text:near(:text("POWERS ACTIVATED"))')
      .textContent();
    expect(parseInt(powerCount || "0")).toBeGreaterThan(5);

    // Disable some options
    await page.click("text=TypeScript");
    await page.click("text=Git");

    // Power count should decrease
    const newPowerCount = await page
      .locator('.action-text:near(:text("POWERS ACTIVATED"))')
      .textContent();
    expect(parseInt(newPowerCount || "0")).toBeLessThan(parseInt(powerCount || "0"));
  });
});

test.describe("Theme Switching", () => {
  test("should switch between themes", async ({ page }) => {
    await page.goto("/");

    // Click theme switcher
    await page.click("text=THEME");

    // Should show theme options
    await expect(page.locator("text=CHOOSE STYLE!")).toBeVisible();
    await expect(page.locator("text=CLASSIC")).toBeVisible();
    await expect(page.locator("text=DARK KNIGHT")).toBeVisible();
    await expect(page.locator("text=RETRO POP")).toBeVisible();

    // Switch to dark theme
    await page.click("text=DARK KNIGHT");

    // Check that theme is applied
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");

    // Theme should persist on reload
    await page.reload();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  });
});

test.describe("Responsive Design", () => {
  test("should be mobile responsive", async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/builder");

    // Check that elements are still visible and functional
    await expect(page.locator("text=CHOOSE YOUR POWERS!")).toBeVisible();

    // Navigation should work
    await page.click("text=HOME");
    await expect(page).toHaveURL("/");
  });
});

test.describe("Accessibility", () => {
  test("should have proper focus management", async ({ page }) => {
    await page.goto("/builder");

    // Tab through interactive elements
    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");

    // Should be able to activate buttons with keyboard
    await page.keyboard.press("Enter");

    // Check that tooltips appear on hover
    await page.hover('button:has-text("RANDOM")');
    await expect(page.locator("text=GENERATE HERO NAME!")).toBeVisible();
  });
});

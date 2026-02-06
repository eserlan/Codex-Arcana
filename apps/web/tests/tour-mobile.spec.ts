import { test, expect } from "@playwright/test";

test.describe("Tour Overlay Mobile", () => {
  test.use({ viewport: { width: 375, height: 667 } }); // iPhone SE

  test.beforeEach(async ({ page }) => {
    page.on('console', msg => console.log(`BROWSER: ${msg.text()}`));
    await page.addInitScript(() => {
        localStorage.clear();
        (window as any).DISABLE_ONBOARDING = false;
        (window as any).__E2E__ = true;
    });
    await page.goto("/");
    await expect(page.locator('.app-layout')).toBeVisible({ timeout: 20000 });
  });

  test("should be able to dismiss the tour on mobile", async ({ page }) => {
    // 1. Verify Tour is Visible
    const tourHeader = page.getByRole("heading", { name: "Welcome to Codex Cryptica" });
    await expect(tourHeader).toBeVisible();
    
    // 2. Click Dismiss in Footer
    const dismissBtn = page.getByRole("button", { name: "Dismiss" });
    await expect(dismissBtn).toBeVisible();
    await dismissBtn.click();
    
    // 3. Verify gone
    await expect(tourHeader).not.toBeVisible();
  });

  test("should be able to close tour via X button in header", async ({ page }) => {
    const tourHeader = page.getByRole("heading", { name: "Welcome to Codex Cryptica" });
    await expect(tourHeader).toBeVisible();
    
    // 2. Click X in Header
    const closeBtn = page.getByRole("button", { name: "Skip Tour" });
    await expect(closeBtn).toBeVisible();
    await closeBtn.click();
    
    // 3. Verify gone
    await expect(tourHeader).not.toBeVisible();
  });
});
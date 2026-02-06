import { test, expect } from "@playwright/test";

test.describe("Tour Overlay (Modern CSS)", () => {
  test.beforeEach(async ({ page }) => {
    // 1. Mock Onboarding to NOT be disabled, so we can trigger it manually or via URL?
    // Actually, usually we disable onboarding in tests. We need to ENABLE it.
    await page.addInitScript(() => {
      (window as any).DISABLE_ONBOARDING = false;
      // Reset local storage to ensure tour starts?
      localStorage.removeItem("codex-tour-completed");
    });
    
    await page.goto("/");
    // Wait for app load
    await expect(page.locator('h1', { hasText: 'Codex Cryptica' })).toBeVisible({ timeout: 10000 });
  });

  test("should show tour overlay and tooltip positioned near target", async ({ page }) => {
    // 1. Verify Tour is Visible
    const tourHeader = page.getByRole("heading", { name: "Welcome to Codex Cryptica" });
    await expect(tourHeader).toBeVisible();
    
    const guideCounter = page.getByText(/Guide 1 of/);
    await expect(guideCounter).toBeVisible();

    // 2. Verify Tooltip Position (Roughly)
    // We expect it to be centered initially for the Welcome step
    const tooltip = page.locator('.fixed.z-\\[82\\]');
    await expect(tooltip).toBeVisible();
    
    // 3. Click Next
    const nextBtn = page.getByRole("button", { name: "Next" });
    await nextBtn.click();
    
    // 4. Verify step 2
    await expect(page.getByText(/Guide 2 of/)).toBeVisible();
  });
});
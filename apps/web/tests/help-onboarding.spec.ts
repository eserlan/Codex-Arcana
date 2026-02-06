import { test, expect } from "@playwright/test";

test.describe("Help Onboarding Walkthrough", () => {
    test.beforeEach(async ({ page }) => {
        // Ensure clean state before load
        await page.addInitScript(() => {
            localStorage.clear();
            (window as any).DISABLE_ONBOARDING = false;
            (window as any).__E2E__ = true;
        });
        await page.goto("/");
        // Wait for app load
        await expect(page.locator('h1', { hasText: 'Codex Cryptica' })).toBeVisible({ timeout: 10000 });
    });

    test("should automatically start onboarding for new users", async ({ page }) => {
        // 1. Check if welcome modal appears
        await expect(page.getByText("Welcome to Codex Cryptica")).toBeVisible();

        // 2. Click Next
        await page.getByRole("button", { name: "Next" }).click();

        // 3. Check if Vault step is highlighted (Vault info should be visible)
        await expect(page.getByText("Your Archive")).toBeVisible();

        // 4. Navigate through all steps
        await page.getByRole("button", { name: "Next" }).click(); // Search
        await expect(page.getByText("Omni-Search")).toBeVisible();

        await page.getByRole("button", { name: "Next" }).click(); // Graph
        await expect(page.getByText("Knowledge Graph")).toBeVisible();

        await page.getByRole("button", { name: "Next" }).click(); // Oracle
        await expect(page.getByText("Lore Oracle")).toBeVisible();

        await page.getByRole("button", { name: "Next" }).click(); // Settings
        await expect(page.getByText("Configuration")).toBeVisible();

        // 5. Finish tour
        await page.getByRole("button", { name: "Finish" }).click();

        // 6. Verify tour is gone and doesn't reappear
        await expect(page.getByText("Configuration")).not.toBeVisible();
        await page.reload();
        await expect(page.getByText("Welcome to Codex Cryptica")).not.toBeVisible();
    });

    test("should NOT dim the screen on welcome step (body target)", async ({ page }) => {
        // Welcome step targets "body" so should NOT show dimming overlay
        await expect(page.getByText("Welcome to Codex Cryptica")).toBeVisible();

        // In the new 4-div system, we check if any of the masks are visible
        const dimmingOverlay = page.locator('[role="presentation"].bg-black\\/60');
        await expect(dimmingOverlay).toHaveCount(0);

        // Click Next to go to Vault step which HAS a specific target
        await page.getByRole("button", { name: "Next" }).click();
        await expect(page.getByText("Your Archive")).toBeVisible();

        // Now the dimming overlay SHOULD be visible (4 anchored divs)
        await expect(dimmingOverlay).toHaveCount(4);
    });

    test("should allow skipping the tour", async ({ page }) => {
        await expect(page.getByText("Welcome to Codex Cryptica")).toBeVisible();
        await page.getByRole("button", { name: "Dismiss" }).click();
        await expect(page.getByText("Welcome to Codex Cryptica")).not.toBeVisible();

        // Verify it doesn't reappear
        await page.reload();
        await expect(page.getByText("Welcome to Codex Cryptica")).not.toBeVisible();
    });

    test("should show contextual hints for advanced features", async ({ page }) => {
        // Skip onboarding
        await expect(page.getByText("Welcome to Codex Cryptica")).toBeVisible();
        await page.getByRole("button", { name: "Dismiss" }).click();

        // 1. Activate Connect Mode (press C)
        await page.keyboard.press("c");

        // 2. Verify hint appears
        await expect(page.getByText("CONNECT MODE")).toBeVisible();

        // 3. Dismiss hint
        await page.getByTestId("dismiss-hint-button").click();

        // Wait for removal of the hint UI
        await expect(page.getByTestId("dismiss-hint-button")).not.toBeVisible();

        // 4. Verify it stays dismissed when toggling Connect Mode again
        await page.keyboard.press("c"); // toggle off
        await page.keyboard.press("c"); // toggle on
        await expect(page.getByTestId("dismiss-hint-button")).not.toBeVisible();
    });
});
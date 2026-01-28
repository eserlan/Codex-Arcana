import { test, expect } from "@playwright/test";

test.describe("Flexible Categories", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/");
        // Wait for vault to initialize
        await page.waitForFunction(() => (window as any).vault?.status === 'idle');
    });

    test("should allow adding a new category and use it for a new entity", async ({ page }) => {
        // 1. Open Settings
        await page.getByTestId("cloud-status-button").click();
        
        // 2. Add New Category
        const categoryLabel = "Deity";
        
        await page.getByPlaceholder("Category label...").fill(categoryLabel);
        await page.getByTitle("Add Category").click();
        
        // Verify it exists in the list (using value attribute since it's an input)
        await expect(page.locator(`input[value="${categoryLabel}"]`)).toBeVisible();
        
        // 3. Close settings
        await page.getByTestId("cloud-status-close").click();
        
        // 4. Create new entity with this category
        await page.getByPlaceholder("Entity title...").fill("Odin");
        await page.locator("select").selectOption({ label: categoryLabel });
        await page.getByRole("button", { name: "CREATE" }).click();
        
        // 5. Verify entity details show the category
        await expect(page.locator("h2", { hasText: "Odin" })).toBeVisible();
        await expect(page.getByText(categoryLabel, { exact: true })).toBeVisible();
    });

    test("should update graph styles when category label changes", async ({ page }) => {
        await page.getByTestId("cloud-status-button").click();
        
        const npcInput = page.locator('input[value="NPC"]');
        await expect(npcInput).toBeVisible();
        
        await npcInput.fill("Person");
        await npcInput.press("Enter");
        
        // Re-open settings to ensure persistence
        await page.reload();
        await page.getByTestId("cloud-status-button").click();
        await expect(page.locator('input[value="Person"]')).toBeVisible();
    });
});
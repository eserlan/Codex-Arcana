import { test, expect } from "@playwright/test";

test.describe("Mobile UX Fixes", () => {
    test.beforeEach(async ({ page }) => {
        // Mock init
        await page.addInitScript(() => {
            (window as any).DISABLE_ONBOARDING = true;
            (window as any).__E2E__ = true;
            // Mock vault if needed, though layout initializes it
        });
        await page.goto("/");
        
        // Wait for app load - check for anything common
        await expect(page.locator('.app-layout')).toBeVisible({ timeout: 10000 });
    });

    test("Minimap should be collapsed by default", async ({ page }) => {
        // Locate the minimap container
        const minimap = page.locator('.minimap-container');
        await expect(minimap).toBeVisible();

        // Check if it has the 'collapsed' class
        await expect(minimap).toHaveClass(/collapsed/);
        
        // Width/Height check (collapsed is 40x40)
        const box = await minimap.boundingBox();
        if (box) {
            expect(box.width).toBe(40);
            expect(box.height).toBe(40);
        }
    });

    test("Entity Detail Panel should have solid background and high z-index", async ({ page }) => {
        // Wait for vault store to be exposed
        await page.waitForFunction(() => (window as any).vault);

        // Inject state to show panel
        await page.evaluate(() => {
            const vault = (window as any).vault;
            vault.isInitialized = true;
            vault.rootHandle = {}; // Mock handle
            
            // Need to ensure vault entities is reactive. 
            // In Svelte 5, reassigning the property on the proxy works.
            vault.entities = {
                "test-id": {
                    id: "test-id",
                    title: "Test Entity",
                    type: "npc",
                    content: "Content",
                    // Add minimal fields to satisfy type
                    tags: [],
                    labels: [],
                    connections: []
                }
            };
            vault.selectedEntityId = "test-id";
        });

        // The panel is an <aside>
        const panel = page.locator("aside").first();
        
        // Wait for it to appear (transition)
        await expect(panel).toBeVisible({ timeout: 5000 });

        // Check z-index
        await expect(panel).toHaveCSS("z-index", "50");

        // Check background color.
        const bg = await panel.evaluate((el) => {
            return window.getComputedStyle(el).backgroundColor;
        });

        // Should be rgb(10, 10, 10) or #0a0a0a. 
        // Definitely not rgba(0, 0, 0, 0)
        expect(bg).not.toBe("rgba(0, 0, 0, 0)");
        expect(bg).not.toBe("transparent");
    });
});
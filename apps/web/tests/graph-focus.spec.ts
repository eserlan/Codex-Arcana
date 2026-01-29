import { test, expect } from "@playwright/test";

test.describe("Graph Focus Mode", () => {
    test.beforeEach(async ({ page }) => {
        // Mock initialization to ensure a consistent graph state
        await page.addInitScript(() => {
            const applyMocks = () => {
                if ((window as any).vault) {
                    (window as any).vault.isAuthorized = true;
                    (window as any).vault.status = 'idle';
                    (window as any).vault.rootHandle = { kind: 'directory' };
                    // Inject some dummy entities with connections
                    (window as any).vault.entities = {
                        "node-1": { 
                            id: "node-1", 
                            title: "Node 1", 
                            connections: [{ target: "node-2", type: "related" }] 
                        },
                        "node-2": { 
                            id: "node-2", 
                            title: "Node 2", 
                            connections: [] 
                        },
                        "node-3": { 
                            id: "node-3", 
                            title: "Node 3", 
                            connections: [] 
                        }
                    };
                }
            };
            applyMocks();
            setInterval(applyMocks, 100);
        });

        await page.goto("/");
        // Wait for graph to be ready
        await page.waitForTimeout(2000); 
    });

    test("should highlight neighborhood and dim others on node click", async ({ page }) => {
        // Click on Node 1
        // We'll use page.evaluate to simulate the tap or just click the canvas at position
        // Better yet, we can check for the existence of the 'dimmed' class on elements
        // But since we can't easily query Cytoscape internal state from Playwright locators,
        // we'll use page.evaluate to check the classes on elements.

        await page.evaluate(() => {
            const cy = (window as any).cy; // Assume we exposed cy for testing in layout
            if (cy) {
                const node1 = cy.$id('node-1');
                node1.emit('tap');
            }
        });

        // Wait for transition
        await page.waitForTimeout(500);

        const focusState = await page.evaluate(() => {
            const cy = (window as any).cy;
            if (!cy) return null;
            return {
                node1Dimmed: cy.$id('node-1').hasClass('dimmed'),
                node2Dimmed: cy.$id('node-2').hasClass('dimmed'),
                node3Dimmed: cy.$id('node-3').hasClass('dimmed'),
                edgeDimmed: cy.edges().hasClass('dimmed')
            };
        });

        expect(focusState?.node1Dimmed).toBe(false); // Focused
        expect(focusState?.node2Dimmed).toBe(false); // Neighbor
        expect(focusState?.node3Dimmed).toBe(true);  // Distant
        expect(focusState?.edgeDimmed).toBe(false);  // Connecting edge
    });

    test("should clear focus when clicking background", async ({ page }) => {
        // 1. Focus a node
        await page.evaluate(() => {
            const cy = (window as any).cy;
            if (cy) cy.$id('node-1').emit('tap');
        });

        // 2. Click background
        await page.evaluate(() => {
            const cy = (window as any).cy;
            if (cy) cy.emit('tap');
        });

        // Wait for transition
        await page.waitForTimeout(500);

        const isAnythingDimmed = await page.evaluate(() => {
            const cy = (window as any).cy;
            return cy ? cy.elements('.dimmed').length > 0 : false;
        });

        expect(isAnythingDimmed).toBe(false);
    });
});

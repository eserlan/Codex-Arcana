import { test, expect } from '@playwright/test';

test.describe('Visual Styling Templates', () => {
    test.beforeEach(async ({ page }) => {
        await page.addInitScript(() => {
            (window as any).DISABLE_ONBOARDING = true;
        });
        await page.goto('http://localhost:5173/');
        // Open a vault to enable settings
        await page.getByRole('button', { name: 'OPEN VAULT' }).click();
    });

    test('Switch to Fantasy theme and verify visual changes', async ({ page }) => {
        // 1. Open Settings
        await page.getByTestId('settings-button').click();
        
        // 2. Go to Aesthetics tab
        await page.getByRole('tab', { name: 'Aesthetics' }).click();
        
        // 3. Select Fantasy theme
        await page.getByRole('button', { name: 'Ancient Parchment' }).click();
        
        // 4. Verify CSS variable change on document root
        const bgPrimary = await page.evaluate(() => 
            getComputedStyle(document.documentElement).getPropertyValue('--color-bg-primary').trim()
        );
        expect(bgPrimary).toBe('#fdf6e3'); // Fantasy background from config (parchment)

        // 5. Verify font change
        const fontHeader = await page.evaluate(() => 
            getComputedStyle(document.documentElement).getPropertyValue('--font-header').trim()
        );
        expect(fontHeader).toContain('Cinzel');
    });

    test('Theme selection persists across reloads', async ({ page }) => {
        await page.getByTestId('settings-button').click();
        await page.getByRole('tab', { name: 'Aesthetics' }).click();
        await page.getByRole('button', { name: 'Neon Night' }).click();
        
        // Verify cyberpunk color
        let primary = await page.evaluate(() => 
            getComputedStyle(document.documentElement).getPropertyValue('--color-accent-primary').trim()
        );
        expect(primary).toBe('#f472b6');

        // Reload page
        await page.reload();
        
        // Wait for theme to be applied
        await page.waitForFunction(() => 
            getComputedStyle(document.documentElement).getPropertyValue('--color-accent-primary').trim() !== ""
        );

        // Verify it persisted
        primary = await page.evaluate(() => 
            getComputedStyle(document.documentElement).getPropertyValue('--color-accent-primary').trim()
        );
        expect(primary).toBe('#f472b6');
    });
});

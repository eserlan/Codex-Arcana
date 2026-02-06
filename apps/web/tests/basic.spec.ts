import { test, expect } from "@playwright/test";

test("basic test", async ({ page }) => {
  page.on('console', msg => console.log('LOG:', msg.text()));
  page.on('pageerror', err => console.log('ERROR:', err.message));
  page.on('requestfailed', req => console.log('REQ FAIL:', req.url(), req.failure()?.errorText));

  await page.goto("/");
  await page.waitForTimeout(5000);
  const html = await page.content();
  console.log('HTML:', html.substring(0, 500));
});
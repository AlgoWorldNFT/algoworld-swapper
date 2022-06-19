import { test, expect } from '@playwright/test';

test(`should navigate to the about page`, async ({ page }) => {
  await page.goto(`http://localhost:3000/`);
  await expect(page.locator(`h1`)).toContainText(`🏠 Dashboard`);

  await page.locator(`button:has-text("About")`).click();
  await expect(
    page.locator(`text=AlgoWorld Swapper v0.2.0`).first(),
  ).toBeVisible();

  await page.locator(`button:has-text("Close")`).click();
  await expect(
    page.locator(`text=AlgoWorld Swapper v0.2.0`).first(),
  ).toBeHidden();
});

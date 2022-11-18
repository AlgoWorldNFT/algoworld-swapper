import { test, expect } from '@playwright/test';
import { AW_SWAPPER_BASE_URL } from '../common';
import pJson from 'package.json';

test(`should navigate to the about page`, async ({ page }) => {
  await page.goto(AW_SWAPPER_BASE_URL);
  await expect(page.locator(`h1`)).toContainText(`🏠 Dashboard`);

  await page.locator(`#AWNavigationBar >> text=About`).click();
  await expect(
    page.locator(`text=AlgoWorld Swapper v${pJson.version}`).first(),
  ).toBeVisible();

  await page.locator(`button:has-text("Close")`).click();
  await expect(
    page.locator(`text=AlgoWorld Swapper v${pJson.version}`).first(),
  ).toBeHidden();
});

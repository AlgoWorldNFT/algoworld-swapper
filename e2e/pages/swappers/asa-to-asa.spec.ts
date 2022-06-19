import { test, expect, Page } from '@playwright/test';

// Annotate entire file as serial.
test.describe.configure({ mode: `serial` });

let page: Page;

test.beforeAll(async ({ browser }) => {
  page = await browser.newPage();

  await page.goto(`http://localhost:3000/`);
  // Click text=Connect Wallet
  await page.locator(`text=Connect Wallet`).click();
  // Click div[role="button"]:has-text("Mnemonic")
  await page.locator(`div[role="button"]:has-text("Mnemonic")`).click();
});

test.afterAll(async () => {
  // Click [aria-label="Open settings"]
  await page.locator(`[aria-label="Open settings"]`).click();
  // Click text=My Swaps
  await Promise.all([
    page.waitForNavigation(/*{ url: 'http://localhost:3000/swappers/my-swaps' }*/),
    page.locator(`text=My Swaps`).click(),
  ]);
  // Click text=Manage
  await page.locator(`text=Manage`).click();
  // Click text=Delete
  await page.locator(`text=Delete`).click();

  await expect(
    page.locator(`text=No swaps available for your account`),
  ).toBeVisible({
    timeout: 120000,
  });

  await page.close();
});

test(`should be able to perform ASA to ASA swap`, async () => {
  await Promise.all([
    page.waitForNavigation(/*{ url: 'http://localhost:3000/swappers/asa-to-asa' }*/),
    page.locator(`button:has-text("ASA to ASA")`).click(),
  ]);

  // Click text=Select Offering Asset
  await page.locator(`text=Select Offering Asset`).click();
  // Click [placeholder="Pick the assets you want to offer"]
  await page
    .locator(`[placeholder="Pick the assets you want to offer"]`)
    .click();
  // Click text=96044943: AWS_TEST
  await page.locator(`text=96044943: AWS_TEST`).click();

  // Click [placeholder="Enter amount"]
  await page.locator(`[placeholder="Enter amount"]`).click();
  // Fill [placeholder="Enter amount"]
  await page.locator(`[placeholder="Enter amount"]`).fill(`1`);
  // Click div[role="dialog"] button:has-text("Select")
  await page.locator(`div[role="dialog"] button:has-text("Select")`).click();

  // Click text=Select Requesting Asset
  await page.locator(`text=Select Requesting Asset`).click();
  // Click div[role="dialog"] div:has-text("Requesting assets") >> nth=3
  await page
    .locator(`div[role="dialog"] div:has-text("Requesting assets")`)
    .nth(3)
    .click();
  // Fill [placeholder="Pick the assets you want to receive"]
  await page
    .locator(`[placeholder="Pick the assets you want to receive"]`)
    .fill(`SASA`);
  // Click text=16040857: SASA
  await page.locator(`text=16040857: SASA`).click();
  // Click [placeholder="Enter amount"]
  await page.locator(`[placeholder="Enter amount"]`).click();
  // Click div[role="dialog"] button:has-text("Select")
  await page.locator(`div[role="dialog"] button:has-text("Select")`).click();

  // Click text=Create Swap
  await page.locator(`text=Create Swap`).click();
  // Click button:has-text("Proceed")
  await page.locator(`button:has-text("Proceed")`).click();

  // Await for share popup
  await expect(page.locator(`text=Share AlgoWorld Swap`)).toBeVisible({
    timeout: 60000,
  });

  // Click text=Close
  await page.locator(`text=Close`).click();
});

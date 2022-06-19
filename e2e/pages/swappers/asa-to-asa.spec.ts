import { test, expect, Page } from '@playwright/test';
import { AW_SWAPPER_BASE_URL } from '@/e2e/consts';
import {
  NAV_BAR_CONNECT_BTN_ID,
  NAV_BAR_SETTINGS_BTN_ID,
  NAV_BAR_SETTINGS_MENU_ITEM_ID,
} from '@/components/Headers/constants';
import {
  CONNECT_WALLET_DIALOG_ID,
  FROM_ASSET_PICKER_DIALOG_SEARCH_ID,
  DIALOG_SELECT_BTN_ID,
  FROM_ASSET_PICKER_DIALOG_ID,
  TO_ASSET_PICKER_DIALOG_SEARCH_ID,
  TO_ASSET_PICKER_DIALOG_ID,
  CONFIRM_DIALOG_ID,
  SHARE_SWAP_DIALOG_ID,
  SHARE_SWAP_COPY_BTN_ID,
  DIALOG_CANCEL_BTN_ID,
  SWAP_DEACTIVATION_PERFORMED_MESSAGE,
} from '@/components/Dialogs/constants';
import {
  SWAP_TYPE_PICKER_CARD_ID,
  FROM_SWAP_OFFERING_ASSET_BTN_ID,
  TO_SWAP_REQUESTING_BTN_ID,
} from '@/components/Cards/constants';
import {
  ASA_TO_ASA_PAGE_HEADER_ID,
  CREATE_SWAP_BTN_ID,
  MY_SWAPS_PAGE_HEADER_ID,
} from '@/pages/_constants';
import { MY_SWAPS_TABLE_MANAGE_BTN_ID } from '@/components/Tables/constants';
import { CRYPTO_TEXT_FIELD_ID } from '@/components/TextFields/constants';

const DUMMY_ASA_TO_OFFER = `96044943: AWS_TEST`;
const DUMMY_ASA_TO_REQUEST_TITLE = `SASA`;
const DUMMY_ASA_TO_REQUEST = `16040857: ${DUMMY_ASA_TO_REQUEST_TITLE}`;

let page: Page;

test.beforeAll(async ({ browser }) => {
  const context = await browser.newContext();
  context.grantPermissions([`clipboard-read`, `clipboard-write`]);
  page = await context.newPage();
  await page.goto(AW_SWAPPER_BASE_URL);
});

test.afterAll(async () => {
  await page.close();
});

test.describe(`Asa to Asa Swap`, () => {
  test(`should be able to load and connect wallet`, async () => {
    await page.locator(`id=${NAV_BAR_CONNECT_BTN_ID}`).click();
    await expect(page.locator(`id=${CONNECT_WALLET_DIALOG_ID}`)).toBeVisible();
    await page.locator(`div[role="button"]:has-text("Mnemonic")`).click();
    await expect(page.locator(`id=${CONNECT_WALLET_DIALOG_ID}`)).toBeHidden();
  });

  test(`should be able to navigate to Asa to Asa page`, async () => {
    await expect(page.locator(`id=${ASA_TO_ASA_PAGE_HEADER_ID}`)).toBeHidden();
    await Promise.all([
      page.waitForNavigation(),
      page.locator(`id=${SWAP_TYPE_PICKER_CARD_ID(`ASA to ASA`)}`).click(),
    ]);
    await expect(page.locator(`id=${ASA_TO_ASA_PAGE_HEADER_ID}`)).toBeVisible();
  });

  test(`should be able to select offering asset`, async () => {
    await expect(
      page.locator(`id=${FROM_ASSET_PICKER_DIALOG_ID}`),
    ).toBeHidden();
    await page.locator(`id=${FROM_SWAP_OFFERING_ASSET_BTN_ID}`).click();
    await expect(
      page.locator(`id=${FROM_ASSET_PICKER_DIALOG_ID}`),
    ).toBeVisible();

    await page.locator(`id=${FROM_ASSET_PICKER_DIALOG_SEARCH_ID}`).click();
    await page.locator(`text=${DUMMY_ASA_TO_OFFER}`).click();

    await page.locator(`id=${CRYPTO_TEXT_FIELD_ID}`).click();
    await page.locator(`id=${CRYPTO_TEXT_FIELD_ID}`).fill(`1`);
    await page.locator(`id=${DIALOG_SELECT_BTN_ID}`).click();
    await expect(
      page.locator(`id=${FROM_ASSET_PICKER_DIALOG_ID}`),
    ).toBeHidden();
  });

  test(`should be able to select requesting asset`, async () => {
    await expect(page.locator(`id=${TO_ASSET_PICKER_DIALOG_ID}`)).toBeHidden();
    await page.locator(`id=${TO_SWAP_REQUESTING_BTN_ID}`).click();
    await expect(page.locator(`id=${TO_ASSET_PICKER_DIALOG_ID}`)).toBeVisible();

    await page
      .locator(`id=${TO_ASSET_PICKER_DIALOG_SEARCH_ID}`)
      .fill(DUMMY_ASA_TO_REQUEST_TITLE);
    await page.locator(`text=${DUMMY_ASA_TO_REQUEST}`).click();

    await page.locator(`id=${CRYPTO_TEXT_FIELD_ID}`).click();
    await page.locator(`id=${CRYPTO_TEXT_FIELD_ID}`).fill(`1`);
    await page.locator(`id=${DIALOG_SELECT_BTN_ID}`).click();
    await expect(page.locator(`id=${TO_ASSET_PICKER_DIALOG_ID}`)).toBeHidden();
  });

  test(`should be able to initiate create swap`, async () => {
    await expect(page.locator(`id=${CONFIRM_DIALOG_ID}`)).toBeHidden();
    await page.locator(`id=${CREATE_SWAP_BTN_ID}`).click({ timeout: 120000 });
    await expect(page.locator(`id=${CONFIRM_DIALOG_ID}`)).toBeVisible();
    await page.locator(`id=${DIALOG_SELECT_BTN_ID}`).click();
    await expect(page.locator(`id=${CONFIRM_DIALOG_ID}`)).toBeHidden();
  });

  test(`should successfully create swap and display share dialog`, async () => {
    await expect(page.locator(`id=${SHARE_SWAP_DIALOG_ID}`)).toBeVisible({
      timeout: 100000,
    });
    await page.locator(`id=${SHARE_SWAP_COPY_BTN_ID}`).click();
    expect(
      await page.evaluate(() => {
        const content = navigator.clipboard.readText();
        return content;
      }),
    ).toContain(`/swap/`);
    await page.locator(`id=${DIALOG_CANCEL_BTN_ID}`).click();
    await expect(page.locator(`id=${SHARE_SWAP_DIALOG_ID}`)).toBeHidden();
  });

  test(`should successfully remove created swap`, async () => {
    await page.locator(`id=${NAV_BAR_SETTINGS_BTN_ID}`).click();
    await Promise.all([
      page.waitForNavigation(),
      page.locator(`id=${NAV_BAR_SETTINGS_MENU_ITEM_ID(`My Swaps`)}`).click(),
    ]);
    await expect(page.locator(`id=${MY_SWAPS_PAGE_HEADER_ID}`)).toBeVisible();

    const escrowAddress = await page.evaluate(async () => {
      const clipboardContent = await navigator.clipboard.readText();
      const escrow = clipboardContent
        .substring(clipboardContent.lastIndexOf(`/`) + 1)
        .split(`?`)[0];
      return escrow;
    });

    await page
      .locator(`id=${MY_SWAPS_TABLE_MANAGE_BTN_ID(escrowAddress)}`)
      .click();
    await page.locator(`text=Delete`).click();

    await expect(
      page.locator(`text=${SWAP_DEACTIVATION_PERFORMED_MESSAGE}`),
    ).toBeVisible({
      timeout: 120000,
    });
  });
});

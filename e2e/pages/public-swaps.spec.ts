import { test, expect, Page, BrowserContext } from '@playwright/test';
import {
  NAV_BAR_CONNECT_BTN_ID,
  NAV_BAR_ICON_HOME_BTN_ID,
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
  MNEMONIC_DIALOG_ID,
  MNEMONIC_DIALOG_TEXT_INPUT_ID,
  MNEMONIC_DIALOG_SELECT_BUTTON_ID,
  INFO_DIALOG_ID,
  INFO_DIALOG_CLOSE_BTN_ID,
  CONFIRM_DIALOG_PUBLIC_SWAP_SWITCH_ID,
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
  PERFORM_SWAP_OPTIN_BUTTON_ID,
  PERFORM_SWAP_PERFORM_BUTTON_ID,
  PUBLIC_SWAPS_SEARCH_BUTTON_ID,
  PUBLIC_SWAPS_SEARCH_FIELD_ID,
} from '@/common/constants';
import {
  MY_SWAPS_TABLE_MANAGE_BTN_ID,
  PUBLIC_SWAP_OPEN_SWAP_BUTTON_ID,
} from '@/components/Tables/constants';
import { CRYPTO_TEXT_FIELD_ID } from '@/components/TextFields/constants';
import { AW_SWAPPER_BASE_URL, BOB_ADDRESS, delay } from '@/e2e/common';

const DUMMY_ASA_TO_OFFER = `96044943: AWS_TEST`;
const DUMMY_ASA_ID_TO_REQUEST = `96044943`;
const DUMMY_ASA_TO_REQUEST = `${DUMMY_ASA_ID_TO_REQUEST}: AWS_TEST`;

let context: BrowserContext;
let page: Page;

test.beforeAll(async ({ browser }) => {
  context = await browser.newContext();
  context.grantPermissions([`clipboard-read`, `clipboard-write`]);
  page = await context.newPage();
  await page.goto(AW_SWAPPER_BASE_URL);
});

test.afterAll(async () => {
  await page.close();
});

test.describe(`Public Swaps`, () => {
  test(`Bob should be able to load and connect wallet`, async () => {
    await page.locator(`id=${NAV_BAR_CONNECT_BTN_ID}`).click();
    await expect(page.locator(`id=${CONNECT_WALLET_DIALOG_ID}`)).toBeVisible();
    await page.locator(`div[role="button"]:has-text("Mnemonic")`).click();
    await expect(page.locator(`id=${MNEMONIC_DIALOG_ID}`)).toBeVisible();
    await page
      .locator(`id=${MNEMONIC_DIALOG_TEXT_INPUT_ID}`)
      .fill(process.env.E2E_TESTS_BOB_MNEMONIC ?? ``);

    await page.locator(`id=${MNEMONIC_DIALOG_SELECT_BUTTON_ID}`).click();

    await expect(page.locator(`id=${MNEMONIC_DIALOG_ID}`)).toBeHidden();
    await expect(page.locator(`id=${CONNECT_WALLET_DIALOG_ID}`)).toBeHidden();
  });

  test(`Bob should be able to navigate to Asa to Asa page`, async () => {
    await expect(page.locator(`id=${ASA_TO_ASA_PAGE_HEADER_ID}`)).toBeHidden();
    await Promise.all([
      page.waitForNavigation(),
      page.locator(`id=${SWAP_TYPE_PICKER_CARD_ID(`ASA to ASA`)}`).click(),
    ]);
    await expect(page.locator(`id=${ASA_TO_ASA_PAGE_HEADER_ID}`)).toBeVisible();
  });

  test(`Bob should be able to select offering asset`, async () => {
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

  test(`Bob should be able to select requesting asset`, async () => {
    await expect(page.locator(`id=${TO_ASSET_PICKER_DIALOG_ID}`)).toBeHidden();
    await page.locator(`id=${TO_SWAP_REQUESTING_BTN_ID}`).click();
    await expect(page.locator(`id=${TO_ASSET_PICKER_DIALOG_ID}`)).toBeVisible();

    await page
      .locator(`id=${TO_ASSET_PICKER_DIALOG_SEARCH_ID}`)
      .fill(DUMMY_ASA_ID_TO_REQUEST);
    await delay(2000);

    const elements = await page.$$(`text=${DUMMY_ASA_TO_REQUEST}`);
    await elements[1].click();

    await page.locator(`id=${CRYPTO_TEXT_FIELD_ID}`).click();
    await page.locator(`id=${CRYPTO_TEXT_FIELD_ID}`).fill(`1`);
    await page.locator(`id=${DIALOG_SELECT_BTN_ID}`).click();
    await expect(page.locator(`id=${TO_ASSET_PICKER_DIALOG_ID}`)).toBeHidden();
  });

  test(`Bob should be able to initiate create public swap`, async () => {
    await expect(page.locator(`id=${CONFIRM_DIALOG_ID}`)).toBeHidden();
    await page.locator(`id=${CREATE_SWAP_BTN_ID}`).click({ timeout: 120000 });
    await expect(page.locator(`id=${CONFIRM_DIALOG_ID}`)).toBeVisible();
    await page.locator(`id=${CONFIRM_DIALOG_PUBLIC_SWAP_SWITCH_ID}`).click();
    await page.locator(`id=${DIALOG_SELECT_BTN_ID}`).click();
    await expect(page.locator(`id=${CONFIRM_DIALOG_ID}`)).toBeHidden();
  });

  test(`Bob should successfully create swap and display share dialog`, async () => {
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

    await page.locator(`id=${NAV_BAR_ICON_HOME_BTN_ID}`).click();
    await page.locator(`id=${NAV_BAR_SETTINGS_BTN_ID}`).click();
    await page.locator(`id=${NAV_BAR_SETTINGS_MENU_ITEM_ID(`Logout`)}`).click();

    await page.goto(`${AW_SWAPPER_BASE_URL}/public-swaps`);
  });

  test(`Anonymous user should find Bob's public swap`, async () => {
    await page.locator(`id=${PUBLIC_SWAPS_SEARCH_FIELD_ID}`).fill(BOB_ADDRESS);
    await page.locator(`id=${PUBLIC_SWAPS_SEARCH_BUTTON_ID}`).click();
    await page.locator(`id=${PUBLIC_SWAP_OPEN_SWAP_BUTTON_ID}`).click();
    await page.waitForTimeout(5000);
    const pages = context.pages();
    await pages[0].close();
    page = pages[1];
  });

  test(`Alice should be able to load and connect wallet`, async () => {
    await page.locator(`id=${NAV_BAR_CONNECT_BTN_ID}`).click();
    await expect(page.locator(`id=${CONNECT_WALLET_DIALOG_ID}`)).toBeVisible();
    await page.locator(`div[role="button"]:has-text("Mnemonic")`).click();
    await expect(page.locator(`id=${MNEMONIC_DIALOG_ID}`)).toBeVisible();
    await page
      .locator(`id=${MNEMONIC_DIALOG_TEXT_INPUT_ID}`)
      .fill(process.env.E2E_TESTS_ALICE_MNEMONIC ?? ``);

    await page.locator(`id=${MNEMONIC_DIALOG_SELECT_BUTTON_ID}`).click();
    await expect(page.locator(`id=${MNEMONIC_DIALOG_ID}`)).toBeHidden();
    await expect(page.locator(`id=${CONNECT_WALLET_DIALOG_ID}`)).toBeHidden();
  });

  test(`Alice should perform swaps`, async () => {
    const optInButtonVisible = await page
      .locator(`id=${PERFORM_SWAP_OPTIN_BUTTON_ID}`)
      .isVisible();

    if (optInButtonVisible) {
      await page.locator(`id=${PERFORM_SWAP_OPTIN_BUTTON_ID}`).click();
      await expect(
        page.locator(`id=${PERFORM_SWAP_OPTIN_BUTTON_ID}`),
      ).toBeHidden({ timeout: 30000 });
    }

    await page.locator(`id=${PERFORM_SWAP_PERFORM_BUTTON_ID}`).click();
    await expect(page.locator(`id=${CONFIRM_DIALOG_ID}`)).toBeVisible();
    await page.locator(`id=${DIALOG_SELECT_BTN_ID}`).click();
    await expect(page.locator(`id=${CONFIRM_DIALOG_ID}`)).toBeHidden();

    await expect(page.locator(`id=${INFO_DIALOG_ID}`)).toBeVisible({
      timeout: 100000,
    });

    await page.locator(`id=${INFO_DIALOG_CLOSE_BTN_ID}`).click();
    await expect(page.locator(`id=${INFO_DIALOG_ID}`)).toBeHidden();

    await page.locator(`id=${NAV_BAR_ICON_HOME_BTN_ID}`).click();
    await page.locator(`id=${NAV_BAR_SETTINGS_BTN_ID}`).click();
    await page.locator(`id=${NAV_BAR_SETTINGS_MENU_ITEM_ID(`Logout`)}`).click();
  });

  test(`Bob should successfully remove created swap`, async () => {
    await page.locator(`id=${NAV_BAR_CONNECT_BTN_ID}`).click();
    await expect(page.locator(`id=${CONNECT_WALLET_DIALOG_ID}`)).toBeVisible();
    await page.locator(`div[role="button"]:has-text("Mnemonic")`).click();
    await expect(page.locator(`id=${MNEMONIC_DIALOG_ID}`)).toBeVisible();
    await page
      .locator(`id=${MNEMONIC_DIALOG_TEXT_INPUT_ID}`)
      .fill(process.env.E2E_TESTS_BOB_MNEMONIC ?? ``);
    await page.locator(`id=${MNEMONIC_DIALOG_SELECT_BUTTON_ID}`).click();
    await expect(page.locator(`id=${MNEMONIC_DIALOG_ID}`)).toBeHidden();
    await expect(page.locator(`id=${CONNECT_WALLET_DIALOG_ID}`)).toBeHidden();

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

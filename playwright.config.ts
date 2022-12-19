import { PlaywrightTestConfig, devices } from '@playwright/test';

import dotenv from 'dotenv';

dotenv.config();

const BASE_URL = process.env.E2E_TESTS_BASE_URL ?? `http://localhost:3000`;
const VERCEL_TOKEN = process.env.VERCEL_TOKEN ?? null;
const config: PlaywrightTestConfig = {
  projects: [
    {
      name: `chromium`,
      use: { ...devices[`Desktop Chrome`] },
    },
  ],
  timeout: 5 * 60 * 1000,
  testDir: `e2e`,
  reporter: `html`,
  use: {
    baseURL: BASE_URL,
  },
};

if (BASE_URL.includes(`localhost:3000`)) {
  config[`webServer`] = {
    command:
      VERCEL_TOKEN === null
        ? `vercel dev`
        : `vercel dev --token ${VERCEL_TOKEN}`,
    url: `http://localhost:3000`,
    timeout: 120 * 1000,
    reuseExistingServer: !process.env.CI,
  };
}

export default config;

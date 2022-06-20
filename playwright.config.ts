import { PlaywrightTestConfig, devices } from '@playwright/test';

const BASE_URL = process.env.E2E_TESTS_BASE_URL ?? `http://localhost:3000/`;
const config: PlaywrightTestConfig = {
  projects: [
    {
      name: `chromium`,
      use: { ...devices[`Desktop Chrome`] },
    },
  ],
  reporter: `html`,
  use: {
    baseURL: BASE_URL,
  },
};

if (BASE_URL.includes(`localhost:3000`)) {
  config[`webServer`] = {
    command: `vercel dev`,
    url: `http://localhost:3000/`,
    timeout: 120 * 1000,
    reuseExistingServer: !process.env.CI,
  };
}

export default config;

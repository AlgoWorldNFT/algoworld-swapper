import { PlaywrightTestConfig } from '@playwright/test';
const config: PlaywrightTestConfig = {
  webServer: {
    command: `vercel dev`,
    url: `http://localhost:3000/`,
    timeout: 120 * 1000,
    reuseExistingServer: !process.env.CI,
  },
  use: {
    baseURL: `http://localhost:3000/`,
  },
};
export default config;

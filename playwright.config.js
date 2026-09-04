import fs from 'node:fs';
import { defineConfig, devices } from '@playwright/test';

// Prefer a Chromium that is already on the machine. Playwright's own browsers
// are ~300MB and this suite needs exactly one engine, so a local run reuses the
// system install. CI has none, so it falls back to `playwright install
// chromium` and this stays empty.
const systemChromium = process.env.CHROMIUM_PATH || '/usr/bin/chromium';
const launchOptions = fs.existsSync(systemChromium)
  ? { executablePath: systemChromium }
  : {};

export default defineConfig({
  testDir: './test/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? 'github' : 'list',

  use: {
    baseURL: 'http://127.0.0.1:8123',
    trace: 'retain-on-failure',
    launchOptions,
  },

  projects: [
    {
      name: 'desktop',
      use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } },
    },
    {
      // 320px is the WCAG 1.4.10 reflow floor, and the width where a grid item
      // with min-width:auto once clipped the manifesto text.
      name: 'mobile',
      use: { ...devices['Desktop Chrome'], viewport: { width: 320, height: 780 }, isMobile: false },
    },
  ],

  webServer: {
    command: 'python3 -m http.server 8123',
    url: 'http://127.0.0.1:8123',
    reuseExistingServer: !process.env.CI,
    stdout: 'ignore',
  },
});

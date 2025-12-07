import { type PlaywrightTestConfig, type ViewportSize } from "@playwright/test";
import { devices } from "playwright";

const baseUrl = "http://localhost:3000";
const viewPort: ViewportSize = { width: 1280, height: 800 };

const config: PlaywrightTestConfig = {
  testDir: "./tests/playwright",
  fullyParallel: true,
  reporter: "list",
  timeout: 60_000,
  retries: process.env.CI ? 5 : 0,
  workers: Number(process.env.WORKERS) || undefined,
  expect: {
    timeout: 10_000,
    toHaveScreenshot: {
      maxDiffPixelRatio: Number(process.env.MAX_DIFF_PIXEL_RATIO) || 0,
      animations: "disabled",
    },
  },
  webServer: [
    {
      command: "pnpm run http",
      reuseExistingServer: !process.env.CI,
      stdout: "ignore",
      stderr: "ignore",
      timeout: 30_000,
      url: "http://localhost:8000",
    },
    {
      command: "pnpm run preview",
      reuseExistingServer: !process.env.CI,
      stdout: "ignore",
      stderr: "pipe",
      timeout: 30_000,
      url: "http://localhost:3000",
    },
  ],
  projects: [
    {
      name: "firefox",

      use: {
        ...devices["Desktop Firefox"],
        baseURL: baseUrl,
        viewport: viewPort,
        screenshot: "off",
        video: "off",
        trace: "off",
      },
    },
    {
      name: "webkit",
      use: {
        ...devices["Desktop Safari"],
        baseURL: baseUrl,
        viewport: viewPort,
        screenshot: "off",
        video: "off",
        trace: "off",
      },
    },
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        baseURL: baseUrl,
        viewport: viewPort,
        screenshot: "off",
        video: "off",
        trace: "off",
      },
    },
  ],
};

export default config;

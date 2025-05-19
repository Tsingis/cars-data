import { defineConfig, devices } from "@playwright/test"

export default defineConfig({
  testDir: "./tests/playwright",
  fullyParallel: true,
  reporter: "list",
  timeout: 180_000,
  retries: 3,
  expect: {
    timeout: 60_000,
    toHaveScreenshot: {
      maxDiffPixelRatio: Number(process.env.MAX_DIFF_PIXEL_RATIO) || 0,
      animations: "disabled",
    },
  },
  webServer: [
    {
      command: "npm run http",
      reuseExistingServer: !process.env.CI,
      stdout: "ignore",
      stderr: "ignore",
      timeout: 60_000,
      url: "http://localhost:8000",
    },
    {
      command: "npm run preview",
      reuseExistingServer: !process.env.CI,
      stdout: "ignore",
      stderr: "pipe",
      timeout: 60_000,
      url: "http://localhost:3000",
    },
  ],
  projects: [
    {
      name: "firefox",
      use: {
        ...devices["Desktop Firefox"],
        viewport: { width: 1280, height: 800 },
        screenshot: "off",
        video: "off",
        trace: "off",
      },
    },
    {
      name: "webkit",
      use: {
        ...devices["Desktop Safari"],
        viewport: { width: 1280, height: 800 },
        screenshot: "off",
        video: "off",
        trace: "off",
      },
    },
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1280, height: 800 },
        screenshot: "off",
        video: "off",
        trace: "off",
      },
    },
  ],
})

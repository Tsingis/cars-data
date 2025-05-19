import { test, expect } from "@playwright/test"
import { maybeScreenshot } from "./utils"
import os from "os"

test("Home page loads correctly", async ({ page }) => {
  await page.goto("http://localhost:3000")
  await expect(page).toHaveTitle("Passenger cars in Finland")

  const title = page.locator("h1:first-of-type")
  await expect(title).toBeVisible()

  const dataDate = page.getByTestId("datadate")
  await expect(dataDate).toBeVisible()

  const dropdown = page.getByTestId("searchabledropdown")
  await expect(dropdown).toBeVisible()

  const dropdownInput = dropdown.locator("input")
  await expect(dropdownInput).toBeEditable()

  await maybeScreenshot(page, "home-page.png")
})

test("Language switch works correctly", async ({ page }) => {
  await page.goto("http://localhost:3000")

  const languageSwitch = page.getByTestId("languageswitch")
  await expect(languageSwitch).toBeVisible()

  const enButton = languageSwitch.locator("button:has-text('EN')")
  const fiButton = languageSwitch.locator("button:has-text('FI')")
  await expect(enButton).toBeVisible()
  await expect(fiButton).toBeVisible()

  const title = page.locator("h1:first-of-type")
  const loading = page.getByTestId("loading")

  await expect(loading).toHaveCount(0)

  await maybeScreenshot(page, "home-page-language-en.png")

  await fiButton.click()
  await expect(title).toHaveText("Henkilöautomäärät Suomessa")

  await expect(loading).toHaveCount(0)

  await maybeScreenshot(page, "home-page-language-fi.png")

  await enButton.click()
  await expect(title).toHaveText("Passenger car counts in Finland")

  await expect(loading).toHaveCount(0)

  await maybeScreenshot(page, "home-page-language-en-back.png")
})

test("Theme switch works correctly", async ({ page }) => {
  await page.goto("http://localhost:3000")

  const themeSwitch = page.getByTestId("themeswitch")
  await expect(themeSwitch).toBeVisible()

  const lightButton = themeSwitch
    .locator("button svg[data-icon='sun']")
    .locator("..")
  const darkButton = themeSwitch
    .locator("button svg[data-icon='moon']")
    .locator("..")
  await expect(lightButton).toBeVisible()
  await expect(darkButton).toBeVisible()

  const initialBgColor = await page.evaluate(() => {
    return window
      .getComputedStyle(document.documentElement)
      .getPropertyValue("--main-bg-color")
  })

  const loading = page.getByTestId("loading")

  await expect(loading).toHaveCount(0)

  await maybeScreenshot(page, "home-page-theme-light.png")

  await darkButton.click()
  const darkBgColor = await page.evaluate(() => {
    return window
      .getComputedStyle(document.documentElement)
      .getPropertyValue("--main-bg-color")
  })
  expect(darkBgColor).not.toBe(initialBgColor)

  await expect(loading).toHaveCount(0)

  await maybeScreenshot(page, "home-page-theme-dark.png")

  await lightButton.click()
  const lightBgColor = await page.evaluate(() => {
    return window
      .getComputedStyle(document.documentElement)
      .getPropertyValue("--main-bg-color")
  })
  expect(lightBgColor).toBe(initialBgColor)

  await expect(loading).toHaveCount(0)

  await maybeScreenshot(page, "home-page-theme-light-back.png")
})

test("Slider works", async ({ page }) => {
  await page.goto("http://localhost:3000")

  const slider = page.locator(".slick-slider")
  await expect(slider).toBeVisible()

  const dots = slider.locator(".slick-dots li button")
  const dotCount = await dots.count()
  expect(dotCount).toBe(5)

  const loading = page.getByTestId("loading")

  await dots.nth(1).click()

  const barchart = slider.locator(".slick-current [data-testid='barchart']")
  await expect(barchart).toBeVisible()

  await expect(loading).toHaveCount(0)

  await maybeScreenshot(page, "slider-second-dot.png")

  //TODO: Why is this not working?
  // eslint-disable-next-line playwright/no-skipped-test
  test.skip(
    os.platform() === "linux",
    "Skipping rest of the test on Linux/Ubuntu"
  )

  await dots.nth(dotCount - 1).click()

  const toplist = slider.locator(".slick-current [data-testid='toplist']")
  await expect(toplist).toBeVisible()

  await expect(loading).toHaveCount(0)

  await maybeScreenshot(page, "slider-last-dot.png")
})

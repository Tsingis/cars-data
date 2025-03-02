import { test, expect } from "@playwright/test"

test("Home page loads correctly", async ({ page }) => {
  await page.goto("http://localhost:3000")
  await expect(page).toHaveTitle("Passenger cars in Finland")

  const heading = page.locator("h1:first-of-type")
  await expect(heading).toBeVisible()

  const dropdown = page.locator(".dropdown-input")
  await expect(dropdown).toBeVisible()

  const dropdownInput = dropdown.locator("input")
  await expect(dropdownInput).toBeEditable()
})

test("Language switch works correctly", async ({ page }) => {
  await page.goto("http://localhost:3000")

  const languageSwitch = page.locator(".language-switch-container")
  await expect(languageSwitch).toBeVisible()

  const enButton = languageSwitch.locator("button:has-text('EN')")
  const fiButton = languageSwitch.locator("button:has-text('FI')")
  await expect(enButton).toBeVisible()
  await expect(fiButton).toBeVisible()

  const titleElement = page.locator(".title")

  await fiButton.click()
  await expect(titleElement).toHaveText("Henkilöautomäärät Suomessa")

  await enButton.click()
  await expect(titleElement).toHaveText("Passenger car counts in Finland")
})

test("Theme switch works correctly", async ({ page }) => {
  await page.goto("http://localhost:3000")

  const themeSwitch = page.locator(".theme-switch-container")
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

  await darkButton.click()
  const darkBgColor = await page.evaluate(() => {
    return window
      .getComputedStyle(document.documentElement)
      .getPropertyValue("--main-bg-color")
  })
  await expect(darkBgColor).not.toBe(initialBgColor)

  await lightButton.click()
  const lightBgColor = await page.evaluate(() => {
    return window
      .getComputedStyle(document.documentElement)
      .getPropertyValue("--main-bg-color")
  })
  await expect(lightBgColor).toBe(initialBgColor)
})

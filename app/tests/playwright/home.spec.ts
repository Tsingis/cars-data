import { test, expect } from "@playwright/test"

test("Home page loads correctly", async ({ page }) => {
  await page.goto("http://localhost:3000")
  await expect(page).toHaveTitle("Passenger cars in Finland")

  const title = page.locator("h1:first-of-type")
  await expect(title).toBeVisible()

  const dataDate = page.locator("[data-testid=datadate]")
  await expect(dataDate).toBeVisible()

  const dropdown = page.locator("[data-testid=searchabledropdown]")
  await expect(dropdown).toBeVisible()

  const dropdownInput = dropdown.locator("input")
  await expect(dropdownInput).toBeEditable()
})

test("Language switch works correctly", async ({ page }) => {
  await page.goto("http://localhost:3000")

  const languageSwitch = page.locator("[data-testid=languageswitch]")
  await expect(languageSwitch).toBeVisible()

  const enButton = languageSwitch.locator("button:has-text('EN')")
  const fiButton = languageSwitch.locator("button:has-text('FI')")
  await expect(enButton).toBeVisible()
  await expect(fiButton).toBeVisible()

  const title = page.locator("h1:first-of-type")

  await fiButton.click()
  await expect(title).toHaveText("Henkilöautomäärät Suomessa")

  await enButton.click()
  await expect(title).toHaveText("Passenger car counts in Finland")
})

test("Theme switch works correctly", async ({ page }) => {
  await page.goto("http://localhost:3000")

  const themeSwitch = page.locator("[data-testid=themeswitch]")
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
  expect(darkBgColor).not.toBe(initialBgColor)

  await lightButton.click()
  const lightBgColor = await page.evaluate(() => {
    return window
      .getComputedStyle(document.documentElement)
      .getPropertyValue("--main-bg-color")
  })
  expect(lightBgColor).toBe(initialBgColor)
})

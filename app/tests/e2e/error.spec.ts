import { test, expect } from "@playwright/test"

test("Error page loads correctly", async ({ page }) => {
  await page.goto("http://localhost:3000/error")
  await expect(page).toHaveTitle("Passenger cars in Finland")

  const error = page.locator("[data-testid=error]")
  const title = error.locator("h1")
  const text = error.locator("p")

  await expect(title).toHaveText("Error")
  await expect(text).toHaveText("An unexpected error occurred")
})

test("Language switch works correctly", async ({ page }) => {
  await page.goto("http://localhost:3000/error")

  const languageSwitch = page.locator("[data-testid=languageswitch]")
  await expect(languageSwitch).toBeVisible()

  const enButton = languageSwitch.locator("button:has-text('EN')")
  const fiButton = languageSwitch.locator("button:has-text('FI')")
  await expect(enButton).toBeVisible()
  await expect(fiButton).toBeVisible()

  const error = page.locator("[data-testid=error]")
  const title = error.locator("h1")
  const text = error.locator("p")

  await fiButton.click()
  await expect(title).toHaveText("Virhe")
  await expect(text).toHaveText("Odottamaton virhe tapahtui")

  await enButton.click()
  await expect(title).toHaveText("Error")
  await expect(text).toHaveText("An unexpected error occurred")
})

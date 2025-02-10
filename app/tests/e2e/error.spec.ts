import { test, expect } from "@playwright/test"

test("Error page loads correctly", async ({ page }) => {
  await page.goto("http://localhost:3000/error")
  await expect(page).toHaveTitle("Passenger cars in Finland")

  const error = page.locator(".error-text")

  const title = error.locator("h1")
  await expect(title).toHaveText("Error")

  const text = error.locator("p")
  await expect(text).toHaveText("An unexpected error occurred")
})

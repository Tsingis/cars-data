import { expect, test } from "@playwright/test";

test("Error page loads correctly", async ({ page }) => {
  await page.goto("/error");
  await expect(page).toHaveTitle("Passenger cars in Finland");

  const error = page.getByTestId("error");
  const title = error.locator("h1");
  const text = error.locator("p");

  await expect(title).toHaveText("Error");
  await expect(text).toHaveText("An unexpected error occurred");

  await expect(page).toHaveScreenshot("error-page.png");
});

test("Language switch works correctly", async ({ page }) => {
  await page.goto("/error");

  const languageSwitch = page.getByTestId("languageswitch");
  await expect(languageSwitch).toBeVisible();

  const enButton = languageSwitch.locator("button:has-text('EN')");
  const fiButton = languageSwitch.locator("button:has-text('FI')");
  await expect(enButton).toBeVisible();
  await expect(fiButton).toBeVisible();

  const error = page.getByTestId("error");
  const title = error.locator("h1");
  const text = error.locator("p");

  await expect(page).toHaveScreenshot("error-page-language-en.png");

  await fiButton.click();
  await expect(title).toHaveText("Virhe");
  await expect(text).toHaveText("Odottamaton virhe tapahtui");

  await expect(page).toHaveScreenshot("error-page-language-fi.png");

  await enButton.click();
  await expect(title).toHaveText("Error");
  await expect(text).toHaveText("An unexpected error occurred");

  await expect(page).toHaveScreenshot("error-page-language-en-back.png");
});

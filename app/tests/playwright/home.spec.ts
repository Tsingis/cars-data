import { expect, test } from "@playwright/test";

test("Home page loads correctly", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle("Passenger cars in Finland");

  const title = page.locator("h1:first-of-type");
  await expect(title).toBeVisible();

  const dataDate = page.getByTestId("datadate");
  await expect(dataDate).toBeVisible();

  const dropdown = page.getByTestId("searchabledropdown");
  await expect(dropdown).toBeVisible();

  const dropdownInput = dropdown.locator("input");
  await expect(dropdownInput).toBeEditable();

  await expect(page).toHaveScreenshot("home-page.png");
});

test("Language switch works correctly", async ({ page }) => {
  await page.goto("/");

  const languageSwitch = page.getByTestId("languageswitch");
  await expect(languageSwitch).toBeVisible();

  const enButton = languageSwitch.locator("button:has-text('EN')");
  const fiButton = languageSwitch.locator("button:has-text('FI')");
  await expect(enButton).toBeVisible();
  await expect(fiButton).toBeVisible();

  const title = page.locator("h1:first-of-type");
  const loading = page.getByTestId("loading");

  await expect(loading).toHaveCount(0);

  await expect(page).toHaveScreenshot("home-page-language-en.png");

  await fiButton.click();

  await expect(title).toHaveText("Henkilöautomäärät Suomessa");

  await expect(loading).toHaveCount(0);

  await expect(page).toHaveScreenshot("home-page-language-fi.png");

  await enButton.click();

  await expect(title).toHaveText("Passenger car counts in Finland");

  await expect(loading).toHaveCount(0);

  await expect(page).toHaveScreenshot("home-page-language-en-back.png");
});

test("Theme switch works correctly", async ({ page }) => {
  await page.goto("/");

  const themeSwitch = page.getByTestId("themeswitch");
  await expect(themeSwitch).toBeVisible();

  const lightButton = themeSwitch
    .locator("button svg[data-icon='sun']")
    .locator("..");
  const darkButton = themeSwitch
    .locator("button svg[data-icon='moon']")
    .locator("..");
  await expect(lightButton).toBeVisible();
  await expect(darkButton).toBeVisible();

  const initialBgColor = await page.evaluate(() => {
    return window
      .getComputedStyle(document.documentElement)
      .getPropertyValue("--main-bg-color");
  });

  const loading = page.getByTestId("loading");

  await expect(loading).toHaveCount(0);

  await expect(page).toHaveScreenshot("home-page-theme-light.png");

  await darkButton.click();

  const darkBgColor = await page.evaluate(() => {
    return window
      .getComputedStyle(document.documentElement)
      .getPropertyValue("--main-bg-color");
  });
  expect(darkBgColor).not.toBe(initialBgColor);

  await expect(loading).toHaveCount(0);

  await expect(page).toHaveScreenshot("home-page-theme-dark.png");

  await lightButton.click();

  const lightBgColor = await page.evaluate(() => {
    return window
      .getComputedStyle(document.documentElement)
      .getPropertyValue("--main-bg-color");
  });
  expect(lightBgColor).toBe(initialBgColor);

  await expect(loading).toHaveCount(0);

  await expect(page).toHaveScreenshot("home-page-theme-light-back.png");
});

test("Carousel slider works correctly", async ({ page }) => {
  await page.goto("/");

  const carousel = page.getByTestId("carousel");

  await expect(carousel).toBeVisible();

  const dots = carousel.getByTestId("dot");
  const dotCount = await dots.count();
  expect(dotCount).toBe(5);

  const loading = page.getByTestId("loading");

  const secondDot = dots.nth(1);
  await expect(secondDot).toBeVisible();
  await secondDot.hover();
  await secondDot.click();

  const barchart = carousel.getByTestId("barchart");
  expect(barchart.boundingBox()).not.toBeNull();

  await expect(loading).toHaveCount(0);

  await expect(page).toHaveScreenshot("carousel-slider-second-dot.png");

  await expect(loading).toHaveCount(0);

  const finalDot = dots.nth(dotCount - 1);
  await expect(finalDot).toBeVisible();
  await finalDot.hover();
  await finalDot.click();

  const toplist = carousel.getByTestId("toplist");
  expect(toplist.boundingBox()).not.toBeNull();

  await expect(loading).toHaveCount(0);

  await expect(page).toHaveScreenshot("carousel-slider-last-dot.png");
});

import { expect, type Page } from "@playwright/test"

type ToHaveScreenshotArgs =
  | [
      name: string,
      options?: Parameters<
        ReturnType<typeof expect<Page>>["toHaveScreenshot"]
      >[0],
    ]
  | [
      options?: Parameters<
        ReturnType<typeof expect<Page>>["toHaveScreenshot"]
      >[0],
    ]

export function maybeScreenshot(page: Page, ...args: ToHaveScreenshotArgs) {
  if (process.env.NO_SCREENSHOTS !== "true") {
    if (typeof args[0] === "string") {
      return expect(page).toHaveScreenshot(args[0], args[1])
    }
    return expect(page).toHaveScreenshot(args[0])
  }
  return Promise.resolve()
}

import { fireEvent, render } from "@testing-library/react";
import { expect } from "vitest";
import ThemeSwitch from "../../src/components/ThemeSwitch/ThemeSwitch";

describe("ThemeSwitch", () => {
  beforeEach(() => {
    localStorage.clear();
    delete document.documentElement.dataset.theme;
  });

  test("renders theme switch buttons", () => {
    render(<ThemeSwitch />);

    const lightButton = document
      .querySelector("svg[data-icon='sun']")
      ?.closest("button");
    const darkButton = document
      .querySelector("svg[data-icon='moon']")
      ?.closest("button");

    expect(lightButton).toBeInTheDocument();
    expect(darkButton).toBeInTheDocument();
  });

  test("toggles theme and updates localStorage", () => {
    render(<ThemeSwitch />);

    const lightButton = document
      .querySelector("svg[data-icon='sun']")
      ?.closest("button");
    const darkButton = document
      .querySelector("svg[data-icon='moon']")
      ?.closest("button");

    // Set initial theme to 'light'
    expect(document.documentElement).toHaveAttribute("data-theme", "light");
    expect(localStorage.getItem("theme")).toBe("light");

    if (darkButton) {
      fireEvent.click(darkButton);
      expect(document.documentElement).toHaveAttribute("data-theme", "dark");
      expect(localStorage.getItem("theme")).toBe("dark");
    }

    if (lightButton) {
      fireEvent.click(lightButton);
      expect(document.documentElement).toHaveAttribute("data-theme", "light");
      expect(localStorage.getItem("theme")).toBe("light");
    }
  });
});

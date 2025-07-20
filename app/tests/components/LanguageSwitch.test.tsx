import React from "react";
import { I18nextProvider } from "react-i18next";
import { render, screen, fireEvent } from "@testing-library/react";
import { expect } from "vitest";
import LanguageSwitch from "../../src/components/LanguageSwitch/LanguageSwitch";
import i18n from "../../src/i18n";

describe("LanguageSwitch component", () => {
  beforeEach(() => {
    // Reset the language to 'en' before each test
    i18n.changeLanguage("en");
    localStorage.setItem("language", "en");
  });

  test("renders the language switch buttons", () => {
    render(
      <I18nextProvider i18n={i18n}>
        <LanguageSwitch />
      </I18nextProvider>
    );

    expect(screen.getByText("EN")).toBeInTheDocument();
    expect(screen.getByText("FI")).toBeInTheDocument();
  });

  test("changes the language to 'fi' when the FI button is clicked", () => {
    render(
      <I18nextProvider i18n={i18n}>
        <LanguageSwitch />
      </I18nextProvider>
    );

    fireEvent.click(screen.getByText("FI"));

    expect(i18n.language).toBe("fi");
    expect(localStorage.getItem("language")).toBe("fi");
  });

  test("changes the language to 'en' when the EN button is clicked", () => {
    // Set initial language to 'fi'
    i18n.changeLanguage("fi");
    localStorage.setItem("language", "fi");

    render(
      <I18nextProvider i18n={i18n}>
        <LanguageSwitch />
      </I18nextProvider>
    );

    fireEvent.click(screen.getByText("EN"));

    expect(i18n.language).toBe("en");
    expect(localStorage.getItem("language")).toBe("en");
  });
});

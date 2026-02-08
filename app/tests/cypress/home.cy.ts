/// <reference types="cypress" />

describe("Home Page", () => {
  it("Loads correctly", () => {
    cy.visit("/");
    cy.title().should("eq", "Passenger cars in Finland");

    cy.get("h1").first().should("be.visible");
    cy.get("[data-testid=data-date]").should("be.visible");
    cy.get("[data-testid=searchable-dropdown]").should("be.visible");
    cy.get("[data-testid=searchable-dropdown] input").should("be.enabled");
  });

  it("Language switch works correctly", () => {
    cy.visit("/");

    cy.get("[data-testid=language-switch]").should("be.visible");
    cy.get("[data-testid=language-switch] button")
      .contains("FI")
      .should("be.visible");
    cy.get("[data-testid=language-switch] button")
      .contains("EN")
      .should("be.visible");

    cy.get("[data-testid=language-switch] button").contains("FI").click();
    cy.get("h1").first().should("have.text", "Henkilöautomäärät Suomessa");

    cy.get("[data-testid=language-switch] button").contains("EN").click();
    cy.get("h1").first().should("have.text", "Passenger car counts in Finland");
  });

  it("Theme switch works correctly", () => {
    cy.visit("/");

    cy.get("[data-testid=theme-switch]").should("be.visible");
    cy.get('[data-testid=theme-switch] button svg[data-icon="sun"]')
      .parent()
      .should("be.visible");
    cy.get('[data-testid=theme-switch] button svg[data-icon="moon"]')
      .parent()
      .should("be.visible");

    cy.get("html").then(($html) => {
      const initialColor = getComputedStyle($html[0]).getPropertyValue(
        "--main-bg-color"
      );

      cy.get('[data-testid=theme-switch] button svg[data-icon="moon"]')
        .parent()
        .click();
      cy.get("html").should(($htmlAfterDark) => {
        expect(
          getComputedStyle($htmlAfterDark[0]).getPropertyValue(
            "--main-bg-color"
          )
        ).not.to.eq(initialColor);
      });

      cy.get('[data-testid=theme-switch] button svg[data-icon="sun"]')
        .parent()
        .click();
      cy.get("html").should(($htmlAfterLight) => {
        expect(
          getComputedStyle($htmlAfterLight[0]).getPropertyValue(
            "--main-bg-color"
          )
        ).to.eq(initialColor);
      });
    });
  });

  it("Carousel slider works", () => {
    cy.visit("/");

    cy.get('[data-testid="carousel"]').should("be.visible");

    cy.get('[data-testid="dot"]').eq(1).click();

    cy.get('[data-testid^="slide-"][data-active="true"]')
      .should("have.attr", "data-testid", "slide-1")
      .within(() => {
        cy.get('[data-testid="bar-chart"]').should("exist").and("be.visible");
      });

    cy.get('[data-testid="dot"]').eq(4).click();

    cy.get('[data-testid^="slide-"][data-active="true"]')
      .should("have.attr", "data-testid", "slide-4")
      .within(() => {
        cy.get('[data-testid="toplist"]').should("exist").and("be.visible");
      });
  });
});

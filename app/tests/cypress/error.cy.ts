/// <reference types="cypress" />

describe("Error Page", () => {
  it("Loads correctly", () => {
    cy.visit("/error");
    cy.title().should("eq", "Passenger cars in Finland");

    cy.get("[data-testid=error] h1").should("have.text", "Error");
    cy.get("[data-testid=error] p").should(
      "have.text",
      "An unexpected error occurred"
    );
  });

  it("Language switch works correctly", () => {
    cy.visit("/error");

    cy.get("[data-testid=language-switch]").should("be.visible");
    cy.get("[data-testid=language-switch] button")
      .contains("EN")
      .should("be.visible");
    cy.get("[data-testid=language-switch] button")
      .contains("FI")
      .should("be.visible");

    cy.get("[data-testid=language-switch] button").contains("FI").click();
    cy.get("[data-testid=error] h1").should("have.text", "Virhe");
    cy.get("[data-testid=error] p").should(
      "have.text",
      "Odottamaton virhe tapahtui"
    );

    cy.get("[data-testid=language-switch] button").contains("EN").click();
    cy.get("[data-testid=error] h1").should("have.text", "Error");
    cy.get("[data-testid=error] p").should(
      "have.text",
      "An unexpected error occurred"
    );
  });
});

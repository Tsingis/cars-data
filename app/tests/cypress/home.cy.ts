/// <reference types="cypress" />

describe("Home Page", () => {
  it("Loads correctly", () => {
    cy.visit("/")
    cy.title().should("eq", "Passenger cars in Finland")

    cy.get("h1").first().should("be.visible")
    cy.get("[data-testid=datadate]").should("be.visible")
    cy.get("[data-testid=searchabledropdown]").should("be.visible")
    cy.get("[data-testid=searchabledropdown] input").should("be.enabled")
  })

  it("Language switch works correctly", () => {
    cy.visit("/")

    cy.get("[data-testid=languageswitch]").should("be.visible")
    cy.get("[data-testid=languageswitch] button")
      .contains("FI")
      .should("be.visible")
    cy.get("[data-testid=languageswitch] button")
      .contains("EN")
      .should("be.visible")

    cy.get("[data-testid=languageswitch] button").contains("FI").click()
    cy.get("h1").first().should("have.text", "Henkilöautomäärät Suomessa")

    cy.get("[data-testid=languageswitch] button").contains("EN").click()
    cy.get("h1").first().should("have.text", "Passenger car counts in Finland")
  })

  it("Theme switch works correctly", () => {
    cy.visit("/")

    cy.get("[data-testid=themeswitch]").should("be.visible")
    cy.get('[data-testid=themeswitch] button svg[data-icon="sun"]')
      .parent()
      .should("be.visible")
    cy.get('[data-testid=themeswitch] button svg[data-icon="moon"]')
      .parent()
      .should("be.visible")

    cy.get("html").then(($html) => {
      const initialColor = getComputedStyle($html[0]).getPropertyValue(
        "--main-bg-color"
      )

      cy.get('[data-testid=themeswitch] button svg[data-icon="moon"]')
        .parent()
        .click()
      cy.get("html").should(($htmlAfterDark) => {
        expect(
          getComputedStyle($htmlAfterDark[0]).getPropertyValue(
            "--main-bg-color"
          )
        ).not.to.eq(initialColor)
      })

      cy.get('[data-testid=themeswitch] button svg[data-icon="sun"]')
        .parent()
        .click()
      cy.get("html").should(($htmlAfterLight) => {
        expect(
          getComputedStyle($htmlAfterLight[0]).getPropertyValue(
            "--main-bg-color"
          )
        ).to.eq(initialColor)
      })
    })
  })

  it("Slider works", () => {
    cy.visit("/")

    cy.get(".slick-slider")
      .should("be.visible")
      .within(() => {
        cy.get(".slick-dots li button").eq(1).click()
        cy.get(".slick-current [data-testid='barchart']").should("exist")

        cy.get(".slick-dots li button").eq(4).click()
        cy.get(".slick-current [data-testid='toplist']").should("exist")
      })
  })
})

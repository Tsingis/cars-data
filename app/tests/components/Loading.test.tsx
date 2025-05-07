import React from "react"
import { render } from "@testing-library/react"
import { expect } from "vitest"
import Loading from "../../src/components/Loading/Loading"

describe("Loading Component", () => {
  test("renders with default size", () => {
    const { container } = render(<Loading />)

    const spinner = container.querySelector("svg")
    expect(spinner).toBeInTheDocument()
    expect(spinner).toHaveClass("fa-spin")
    expect(spinner).toHaveAttribute("data-icon", "spinner")
    expect(spinner).toHaveAttribute("data-prefix", "fas")
    expect(spinner).toHaveAttribute("aria-hidden", "true")
    expect(spinner).toHaveAttribute("role", "img")
    expect(spinner).toHaveAttribute("viewBox", "0 0 512 512")
  })
})

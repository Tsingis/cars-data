import React from "react"
import { render, screen } from "@testing-library/react"
import ErrorPage from "../../src/components/ErrorPage/ErrorPage"

describe("Error Component", () => {
  test("renders with error message", () => {
    const errorMessage = "This is error"

    render(<ErrorPage message={errorMessage} />)

    const heading = screen.getByRole("heading", { level: 1 })

    expect(heading).toHaveTextContent("Error")

    expect(screen.getByText(errorMessage)).toBeInTheDocument()
  })
})

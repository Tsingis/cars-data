import React from "react"
import { render, screen, fireEvent } from "@testing-library/react"
import SearchableDropdown from "../../src/components/SearchableDropdown/SearchableDropdown" // Adjust import path

const options = [
  { code: "1", name: "Option 1" },
  { code: "2", name: "Option 2" },
  { code: "3", name: "Option 3" },
]

describe("SearchableDropdown Component", () => {
  test("opens dropdown menu when input is clicked", () => {
    render(
      <SearchableDropdown
        options={options}
        onSelect={() => {}}
        initialValue={options[0]}
      />
    )

    fireEvent.click(screen.getByRole("textbox"))

    expect(screen.getByRole("list")).toBeInTheDocument()
    expect(screen.getByText("Option 1")).toBeInTheDocument()
    expect(screen.getByText("Option 2")).toBeInTheDocument()
    expect(screen.getByText("Option 3")).toBeInTheDocument()
  })
})

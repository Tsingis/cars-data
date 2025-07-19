import React from "react"
import { render, screen, fireEvent } from "@testing-library/react"
import { expect } from "vitest"
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
        onSelect={() => null}
        initialValue={options[0]}
      />
    )

    fireEvent.click(screen.getByRole("textbox"))

    expect(
      document.querySelector("[data-testid=dropdownmenulist]")
    ).toBeInTheDocument()
    expect(screen.getByText("Option 1")).toBeInTheDocument()
    expect(screen.getByText("Option 2")).toBeInTheDocument()
    expect(screen.getByText("Option 3")).toBeInTheDocument()
  })

  test("filters options based on search query", () => {
    render(
      <SearchableDropdown
        options={options}
        onSelect={() => null}
        initialValue={options[0]}
      />
    )

    fireEvent.click(screen.getByRole("textbox"))
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "Opt" } })

    expect(screen.getByText("Option 1")).toBeInTheDocument()
    expect(screen.getByText("Option 2")).toBeInTheDocument()
    expect(screen.getByText("Option 3")).toBeInTheDocument()
  })

  test("filters options based on partial search query", () => {
    render(
      <SearchableDropdown
        options={options}
        onSelect={() => null}
        initialValue={options[0]}
      />
    )

    fireEvent.click(screen.getByRole("textbox"))
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "2" } })

    expect(screen.queryByText("Option 1")).not.toBeInTheDocument()
    expect(screen.getByText("Option 2")).toBeInTheDocument()
    expect(screen.queryByText("Option 3")).not.toBeInTheDocument()
  })

  test("selects an option when clicked", () => {
    render(
      <SearchableDropdown
        options={options}
        onSelect={() => null}
        initialValue={options[0]}
      />
    )

    fireEvent.click(screen.getByRole("textbox"))
    fireEvent.click(screen.getByText("Option 2"))

    expect(screen.queryByRole("option")).not.toBeInTheDocument()
  })

  test("closes dropdown when clicking outside", () => {
    render(
      <SearchableDropdown
        options={options}
        onSelect={() => null}
        initialValue={options[0]}
      />
    )

    fireEvent.click(screen.getByRole("textbox"))
    fireEvent.mouseDown(document)

    expect(document.querySelector("#dropdown-menu")).not.toBeInTheDocument()
  })
})

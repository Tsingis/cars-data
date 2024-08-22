import React from "react"
import { render, screen } from "@testing-library/react"
import TopList from "../../src/components/TopList/TopList"
import { Count } from "../../src/types"

const data: Count = {
  ItemA: 30,
  ItemB: 20,
  ItemC: 50,
  ItemD: 40,
}

describe("TopList Component", () => {
  test("renders with title and topX items", () => {
    render(<TopList data={data} topX={3} title="Top Items" />)

    expect(screen.getByText("Top Items")).toBeInTheDocument()

    const items = screen.getAllByRole("listitem")

    expect(items[0]).toHaveTextContent("ItemC: 50")
    expect(items[1]).toHaveTextContent("ItemD: 40")
    expect(items[2]).toHaveTextContent("ItemA: 30")

    expect(screen.queryByText("ItemB")).toBeNull()
  })
})

import React from "react"
import { render } from "@testing-library/react"
import TreeMapChart from "../../src/components/TreeMapChart/TreeMapChart"
import { Count } from "../../src/types"

const data: Count = {
  ItemA: 30,
  ItemB: 20,
  ItemC: 50,
}

describe("TreeMapChart Component", () => {
  test("renders a canvas element", () => {
    const { container } = render(
      <TreeMapChart data={data} title="Test TreeMap Chart" />
    )

    const canvas = container.querySelector("canvas")
    expect(canvas).toBeInTheDocument()
  })
})

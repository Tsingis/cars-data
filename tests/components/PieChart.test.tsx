import React from "react"
import { render } from "@testing-library/react"
import PieChart from "../../src/components/PieChart/PieChart"
import { Count } from "../../src/types"

const data: Count = {
  Apple: 30,
  Banana: 20,
  Cherry: 50,
}

describe("PieChart Component", () => {
  test("renders a canvas element", () => {
    render(
      <PieChart
        data={data}
        labelMap={{ Apple: "ItemA", Banana: "ItemB", Cherry: "ItemC" }}
        colorMap={{ Apple: "red", Banana: "yellow", Cherry: "pink" }}
        title="Test title"
      />
    )

    const canvas = document.querySelector("canvas")
    expect(canvas).toBeInTheDocument()
  })
})

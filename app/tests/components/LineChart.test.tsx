import React from "react"
import { render } from "@testing-library/react"
import LineChart from "../../src/components/LineChart/LineChart"
import { Count } from "../../src/types"

const data: Count = {
  ItemA: 30,
  ItemB: 20,
  ItemC: 50,
}

describe("LineChart Component", () => {
  test("renders a canvas element", () => {
    render(
      <LineChart
        data={data}
        title="Test title"
        xAxisText="Months"
        yAxisText="Values"
      />
    )

    const canvas = document.querySelector("canvas")
    expect(canvas).toBeInTheDocument()
  })
})

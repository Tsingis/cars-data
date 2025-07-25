import { render } from "@testing-library/react";
import { expect } from "vitest";
import BarChart from "../../src/components/BarChart/BarChart";

describe("BarChart Component", () => {
  test("renders a canvas element", () => {
    const data = { ItemA: 10, ItemB: 20, ItemC: 30 };

    render(
      <BarChart
        data={data}
        title="Test title"
        xAxisText="Categories"
        yAxisText="Values"
      />
    );

    const canvas = document.querySelector("canvas");
    expect(canvas).toBeInTheDocument();
  });
});

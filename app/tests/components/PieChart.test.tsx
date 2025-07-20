import { render } from "@testing-library/react";
import { expect } from "vitest";
import PieChart from "../../src/components/PieChart/PieChart";
import type { Count } from "../../src/types";

const data: Count = {
  ItemA: 30,
  ItemB: 20,
  ItemC: 50,
};

describe("PieChart Component", () => {
  test("renders a canvas element", () => {
    render(
      <PieChart
        data={data}
        labelMap={{ A: "ItemA", B: "ItemB", C: "ItemC" }}
        colorMap={{ A: "red", B: "yellow", C: "pink" }}
        title="Test title"
      />
    );

    const canvas = document.querySelector("canvas");
    expect(canvas).toBeInTheDocument();
  });
});

import React from "react";
import { render } from "@testing-library/react";
import { expect } from "vitest";
import ChartsContainer from "../../src/components/ChartsContainer/ChartsContainer";

describe("ChartsContainer Component", () => {
  const selectedMunicipality = {
    mileageCount: { key1: 100, key2: 200 },
    drivingForce: { force1: 50, force2: 150 },
    color: { black: 20, red: 30 },
    registrationYear: { "2010": 2010, "2015": 2015 },
    maker: { maker1: 10, maker2: 20 },
  };

  test("renders all charts", () => {
    render(<ChartsContainer selectedMunicipality={selectedMunicipality} />);

    expect(
      document.querySelector("[data-testid=piechart]")
    ).toBeInTheDocument();
    expect(
      document.querySelector("[data-testid=barchart]")
    ).toBeInTheDocument();
    expect(
      document.querySelector("[data-testid=linechart]")
    ).toBeInTheDocument();
    expect(
      document.querySelector("[data-testid=treemapchart]")
    ).toBeInTheDocument();
    expect(document.querySelector("[data-testid=toplist]")).toBeInTheDocument();
  });

  test("renders nothing when data is missing", () => {
    const emptyData = {
      mileageCount: null,
      drivingForce: null,
      color: null,
      registrationYear: null,
      maker: null,
    };

    const { container } = render(
      <ChartsContainer selectedMunicipality={emptyData} />
    );

    expect(container).toBeEmptyDOMElement();
  });
});

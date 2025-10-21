/* eslint-disable i18next/no-literal-string */
/* eslint-disable css-modules/no-unused-class */
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, test, expect, beforeEach, vi } from "vitest";
import Carousel from "../../src/components/Carousel/Carousel";
import styles from "../../src/components/Carousel/Carousel.module.css";


describe("Carousel component", () => {
  const slides = [
    <div key="1">Slide 1</div>,
    <div key="2">Slide 2</div>,
    <div key="3">Slide 3</div>,
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("renders all slides and dots", () => {
    render(<Carousel>{slides}</Carousel>);

    const carousel = screen.getByTestId("carousel");
    expect(carousel).toBeInTheDocument();

    const dots = screen.getAllByTestId("dot");
    expect(dots.length).toBe(slides.length);
  });

  test("renders arrows when enabled", () => {
    render(<Carousel arrows>{slides}</Carousel>);

    expect(screen.getByText("‹")).toBeVisible();
    expect(screen.getByText("›")).toBeVisible();
  });

  test("navigates to next and previous slide with arrows", () => {
    render(<Carousel arrows>{slides}</Carousel>);

    const nextButton = screen.getByText("›");
    const prevButton = screen.getByText("‹");

    expect(screen.getByTestId("slide-0")).toHaveClass(styles.active);

    fireEvent.click(nextButton);
    expect(screen.getByTestId("slide-1")).toHaveClass(styles.active);

    fireEvent.click(prevButton);
    expect(screen.getByTestId("slide-0")).toHaveClass(styles.active);
  });

  test("clicking on a dot changes the slide", () => {
    render(<Carousel>{slides}</Carousel>);

    const dots = screen.getAllByTestId("dot");

    expect(screen.getByTestId("slide-0")).toHaveClass(styles.active);

    fireEvent.click(dots[1]);
    expect(screen.getByTestId("slide-1")).toHaveClass(styles.active);
  });

  test("navigates with keyboard arrows", () => {
    render(<Carousel>{slides}</Carousel>);

    const carousel = screen.getByTestId("carousel");

    expect(screen.getByTestId("slide-0")).toHaveClass(styles.active);

    fireEvent.keyDown(carousel, { key: "ArrowRight" });
    expect(screen.getByTestId("slide-1")).toHaveClass(styles.active);

    fireEvent.keyDown(carousel, { key: "ArrowLeft" });
    expect(screen.getByTestId("slide-0")).toHaveClass(styles.active);
  });
});

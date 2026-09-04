import "@testing-library/jest-dom/vitest";

globalThis.matchMedia =
  globalThis.matchMedia ||
  (() => ({
    matches: false,
    addListener: () => null,
    removeListener: () => null,
  }));

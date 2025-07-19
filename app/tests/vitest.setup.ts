import "@testing-library/jest-dom"

globalThis.matchMedia =
  globalThis.matchMedia ||
  function () {
    return {
      matches: false,
      addListener: () => null,
      removeListener: () => null,
    }
  }

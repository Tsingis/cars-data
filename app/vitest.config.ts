import { defineConfig } from "vitest/config"

export default defineConfig({
  test: {
    environment: "jsdom",
    setupFiles: ["tests/vitest.setup.ts"],
    globals: true,
    include: [
      "tests/components/**/*.test.tsx",
      "tests/components/**/*.test.ts",
    ],
    exclude: ["tests/e2e/**/*"],
  },
})

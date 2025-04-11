import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import checker from "vite-plugin-checker"

const args = process.argv.slice(3)
const useChecker = args.includes("--use-checker")

export default defineConfig({
  plugins: [
    react(),
    useChecker &&
      checker({
        typescript: {
          tsconfigPath: "./tsconfig.json",
        },
        eslint: {
          lintCommand: "eslint . --config ./eslint.config.js",
          useFlatConfig: true,
        },
      }),
  ],
  root: "src",
  publicDir: "public",
  envDir: "..",
  build: {
    outDir: "../dist",
    emptyOutDir: true,
    rollupOptions: {
      input: "src/index.html",
    },
  },
  server: {
    port: 3000,
    host: true,
    strictPort: true,
    watch: {
      usePolling: true,
    },
  },
})

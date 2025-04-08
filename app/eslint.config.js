import path from "path"
import js from "@eslint/js"
import parser from "@typescript-eslint/parser"
import react from "eslint-plugin-react"
import hooks from "eslint-plugin-react-hooks"
import refresh from "eslint-plugin-react-refresh"
import i18next from "eslint-plugin-i18next"
import i18nJsonPlugin from "eslint-plugin-i18n-json"

export default [
  js.configs.recommended,
  i18next.configs["flat/recommended"],
  {
    files: ["src/i18n/**/*.json"],

    plugins: { "i18n-json": i18nJsonPlugin },
    processor: {
      meta: { name: ".json" },
      ...i18nJsonPlugin.processors[".json"],
    },
    rules: {
      ...i18nJsonPlugin.configs.recommended.rules,
      "i18n-json/valid-message-syntax": "off",
      "i18n-json/identical-keys": [
        "error",
        {
          filePath: path.resolve("src/i18n/en.json"),
        },
      ],
    },
  },
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    languageOptions: {
      ...react.configs.flat.recommended.languageOptions,
      parser: parser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        ecmaVersion: "latest",
        sourceType: "module",
      },
      globals: {
        window: "readonly",
        document: "readonly",
        process: "readonly",
        HTMLCanvasElement: "readonly",
        HTMLDivElement: "readonly",
        HTMLInputElement: "readonly",
        MouseEvent: "readonly",
        Node: "readonly",
        fetch: "readonly",
        console: "readonly",
        localStorage: "readonly",
        URL: "readonly",
      },
    },
    plugins: {
      react,
      "react-hooks": hooks,
      "react-refresh": refresh,
    },
    rules: {
      ...react.configs.recommended.rules,
      ...react.configs["jsx-runtime"].rules,
      ...hooks.configs.recommended.rules,
      semi: ["error", "never"],
      "no-undef": "warn",
      "no-unused-vars": "warn",
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  },
  {
    ignores: ["dist", "**/*test.tsx"],
  },
]

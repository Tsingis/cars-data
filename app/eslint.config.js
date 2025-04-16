import path from "path"
import js from "@eslint/js"
import parser from "@typescript-eslint/parser"
import tsPlugin from "@typescript-eslint/eslint-plugin"
import reactPlugin from "eslint-plugin-react"
import hooksPlugin from "eslint-plugin-react-hooks"
import refreshPlugin from "eslint-plugin-react-refresh"
import i18nextPlugin from "eslint-plugin-i18next"
import i18nJsonPlugin from "eslint-plugin-i18n-json"
import importPlugin from "eslint-plugin-import"

export default [
  js.configs.recommended,
  i18nextPlugin.configs["flat/recommended"],
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
      ...reactPlugin.configs.flat.recommended.languageOptions,
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
      "@typescript-eslint": tsPlugin,
      react: reactPlugin,
      "react-hooks": hooksPlugin,
      "react-refresh": refreshPlugin,
      import: importPlugin,
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      ...reactPlugin.configs.recommended.rules,
      ...reactPlugin.configs["jsx-runtime"].rules,
      ...hooksPlugin.configs.recommended.rules,
      ...importPlugin.configs.recommended.rules,
      "@typescript-eslint/consistent-type-imports": [
        "error",
        { prefer: "type-imports" },
      ],

      "import/no-unresolved": "off",
      semi: ["error", "never"],
      "no-undef": "warn",
      "no-unused-vars": "off",
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

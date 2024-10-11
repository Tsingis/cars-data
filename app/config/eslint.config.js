import js from "@eslint/js"
import parser from "@typescript-eslint/parser"
import globals from "globals"
import react from "eslint-plugin-react"
import hooks from "eslint-plugin-react-hooks"
import refresh from "eslint-plugin-react-refresh"

export default [
  js.configs.recommended,
  {
    files: ["**/*.ts", "**/*.tsx", "**/*.js", "**/*.jsx"],
    ignores: ["dist", "**/*.test.tsx", "**/eslint.config.js"],
    languageOptions: {
      ...react.configs.flat.recommended.languageOptions,
      parser: parser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        ecmaVersion: "latest",
        sourceType: "module",
        globals: {
          ...globals.browser,
          ...globals.node,
        },
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
]

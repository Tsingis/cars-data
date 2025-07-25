import js from "@eslint/js";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import parser from "@typescript-eslint/parser";
import cssModulesPlugin from "eslint-plugin-css-modules";
import cypressPlugin from "eslint-plugin-cypress";
import i18nJsonPlugin from "eslint-plugin-i18n-json";
import i18nextPlugin from "eslint-plugin-i18next";
import importPlugin from "eslint-plugin-import";
import playwrightPlugin from "eslint-plugin-playwright";
import reactPlugin from "eslint-plugin-react";
import hooksPlugin from "eslint-plugin-react-hooks";
import refreshPlugin from "eslint-plugin-react-refresh";
import securityPlugin from "eslint-plugin-security";
import sonarPlugin from "eslint-plugin-sonarjs";
import globals from "globals";
import path from "path";

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
    ...playwrightPlugin.configs["flat/recommended"],
    files: ["tests/playwright/**"],
    rules: {
      ...playwrightPlugin.configs["flat/recommended"].rules,
    },
  },
  {
    ...cypressPlugin.configs["flat/recommended"],
    files: ["tests/cypress/**/*.cy.ts"],
    plugins: {
      cypress: cypressPlugin,
    },
    languageOptions: {
      globals: {
        cy: "readonly",
        Cypress: "readonly",
        describe: "readonly",
        it: "readonly",
        before: "readonly",
        after: "readonly",
        beforeEach: "readonly",
        afterEach: "readonly",
        expect: "readonly",
        getComputedStyle: "readonly",
      },
    },
    rules: {
      ...cypressPlugin.configs.recommended.rules,
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
        ...globals.jest,
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
      security: securityPlugin,
      "css-modules": cssModulesPlugin,
      sonarjs: sonarPlugin,
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      ...reactPlugin.configs.recommended.rules,
      ...reactPlugin.configs["jsx-runtime"].rules,
      ...hooksPlugin.configs.recommended.rules,
      ...importPlugin.configs.recommended.rules,
      ...securityPlugin.configs.recommended.rules,
      ...sonarPlugin.configs.recommended.rules,
      "@typescript-eslint/consistent-type-imports": [
        "error",
        { prefer: "type-imports" },
      ],
      "css-modules/no-unused-class": "error",
      "css-modules/no-undef-class": "error",
      "import/no-unresolved": "off",
      "sonarjs/todo-tag": "off",
      "security/detect-object-injection": "off",
      semi: "off",
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
    ignores: ["dist"],
  },
];

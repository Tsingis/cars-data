import fs from "node:fs";
import path from "node:path";
import js from "@eslint/js";
import json from "@eslint/json";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import parser from "@typescript-eslint/parser";
import cypressPlugin from "eslint-plugin-cypress";
import i18nextPlugin from "eslint-plugin-i18next";
import { importX as importXPlugin } from "eslint-plugin-import-x";
import playwrightPlugin from "eslint-plugin-playwright";
import reactPlugin from "eslint-plugin-react";
import hooksPlugin from "eslint-plugin-react-hooks";
import refreshPlugin from "eslint-plugin-react-refresh";
import securityPlugin from "eslint-plugin-security";
import sonarPlugin from "eslint-plugin-sonarjs";
import globals from "globals";

const localeKeyConsistency = {
  rules: {
    "match-english-keys": {
      meta: {
        type: "problem",
        schema: [],
      },
      create(context) {
        const englishFile = path.resolve(
          process.cwd(),
          "src/i18n/locales/en.json"
        );
        const currentFile = context.filename;

        if (currentFile === englishFile || !currentFile.endsWith(".json")) {
          return {};
        }

        return {
          Document(node) {
            try {
              const currentJson = JSON.parse(context.sourceCode.text);
              const englishJson = JSON.parse(
                fs.readFileSync(englishFile, "utf8")
              );

              const flattenKeys = (value, prefix = "") => {
                if (
                  !value ||
                  typeof value !== "object" ||
                  Array.isArray(value)
                ) {
                  return prefix ? [prefix] : [];
                }

                return Object.entries(value).flatMap(([key, nestedValue]) => {
                  const nextPrefix = prefix ? `${prefix}.${key}` : key;

                  if (
                    nestedValue &&
                    typeof nestedValue === "object" &&
                    !Array.isArray(nestedValue)
                  ) {
                    return flattenKeys(nestedValue, nextPrefix);
                  }

                  return [nextPrefix];
                });
              };

              const englishKeys = new Set(flattenKeys(englishJson));

              for (const key of flattenKeys(currentJson)) {
                if (!englishKeys.has(key)) {
                  context.report({
                    node,
                    message: `Translation key "${key}" is not present in en.json.`,
                  });
                }
              }
            } catch {
              // Let the JSON parser report syntax issues.
            }
          },
        };
      },
    },
  },
};

export default [
  {
    ...js.configs.recommended,
    files: ["**/*.{js,mjs,cjs,jsx,ts,tsx}"],
  },
  {
    ...i18nextPlugin.configs["flat/recommended"],
    files: ["**/*.{js,mjs,cjs,jsx,ts,tsx}"],
  },
  {
    files: ["src/i18n/**/*.json"],
    ...json.configs.recommended,
    plugins: { json, "locale-key-consistency": localeKeyConsistency },
    language: "json/json",
    rules: {
      ...json.configs.recommended.rules,
      "json/no-duplicate-keys": "error",
      "json/no-empty-keys": "error",
      "locale-key-consistency/match-english-keys": "error",
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
        Element: "readonly",
        HTMLElement: "readonly",
        HTMLButtonElement: "readonly",
        HTMLCanvasElement: "readonly",
        HTMLDivElement: "readonly",
        HTMLInputElement: "readonly",
        MouseEvent: "readonly",
        PointerEvent: "readonly",
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
      "import-x": importXPlugin,
      security: securityPlugin,
      sonarjs: sonarPlugin,
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      ...reactPlugin.configs.recommended.rules,
      ...reactPlugin.configs["jsx-runtime"].rules,
      ...hooksPlugin.configs.recommended.rules,
      ...importXPlugin.configs.recommended.rules,
      ...securityPlugin.configs.recommended.rules,
      ...sonarPlugin.configs.recommended.rules,
      "@typescript-eslint/consistent-type-imports": [
        "error",
        { prefer: "type-imports" },
      ],
      "import-x/no-unresolved": "off",
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
    ignores: ["**/dist/**", "**/node_modules/**"],
  },
];

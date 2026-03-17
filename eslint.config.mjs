import { FlatCompat } from "@eslint/eslintrc";
import pluginQuery from "@tanstack/eslint-plugin-query";
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";
import perfectionist from "eslint-plugin-perfectionist";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  {
    ignores: [
      "node_modules/**",
      "lib/i18n/**",
      ".next/**",
      "out/**",
      "build/**",
      "backend/**",
      "next-env.d.ts",
    ],
  },
  ...nextCoreWebVitals,
  ...nextTypescript,
  ...compat.config({
    plugins: ["perfectionist", "import"],

    rules: {
      "@next/next/no-unserializable-props": "off",
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": "warn",
      "import/no-duplicates": ["warn", { "prefer-inline": true }],
      "import/order": "off",
      "perfectionist/sort-exports": [
        "warn",
        {
          customGroups: [
            {
              elementNamePattern: ["^generateMetadata$", "^metadata$"],
              groupName: "next-metadata",
              selector: "export",
            },
          ],
          groups: ["next-metadata", "type-export", "value-export"],
          order: "asc",
          type: "natural",
        },
      ],
      "perfectionist/sort-imports": [
        "warn",
        {
          customGroups: [
            {
              elementNamePattern: ["react-scan$"],
              groupName: "top",
              selector: "import",
            },
            {
              elementNamePattern: ["^react$", "^react-.+"],
              groupName: "react",
              selector: "import",
            },
            {
              elementNamePattern: ["^next$", "^next/.*"],
              groupName: "next",
              selector: "import",
            },
            {
              elementNamePattern: ["@/components/.*"],
              groupName: "components",
              selector: "import",
            },
            {
              elementNamePattern: ["^@/app/(Dashboard)/.*/_.*/hooks"],
              groupName: "features-hooks",
              selector: "import",
            },
            {
              elementNamePattern: ["^@/app/(Dashboard)/.*/_.*/tables"],
              groupName: "features-tables",
              selector: "import",
            },
            {
              elementNamePattern: ["^@/app/(Dashboard)/.*/_.*/forms"],
              groupName: "features-forms",
              selector: "import",
            },
            {
              elementNamePattern: ["^@/app/(Dashboard)/.*/_.*/form-options"],
              groupName: "features-form-options",
              selector: "import",
            },
            {
              elementNamePattern: ["^@/app/(Dashboard)/.*/_.*/types"],
              groupName: "type-import",
              selector: "import",
            },
            {
              elementNamePattern: ["^@/app/(Dashboard)/.*/_.*"],
              groupName: "features-other",
              selector: "import",
            },
            {
              elementNamePattern: ["^@/hooks/.*"],
              groupName: "hooks",
              selector: "import",
            },
            {
              elementNamePattern: ["^@/utils/.*", "^@/utils"],
              groupName: "utils",
              selector: "import",
            },
            {
              elementNamePattern: ["^@/query/.*"],
              groupName: "query",
              selector: "import",
            },
            {
              elementNamePattern: ["^@/lib/.*", "^@/lib"],
              groupName: "lib",
              selector: "import",
            },

            {
              elementNamePattern: ["^@/types/.*"],
              groupName: "type-import",
              selector: "import",
            },
          ],

          groups: [
            "top",
            ["react", "next"],
            ["value-builtin", "value-external"],
            "lib",
            "query",
            "hooks",
            "utils",
            "components",
            "features-hooks",
            "features-tables",
            "features-forms",
            "features-form-options",
            "features-other",
            "value-internal",
            ["value-parent", "value-sibling", "value-index"],
            "ts-equals-import",
            "unknown",
            ["type-import", "type-internal"],
            ["type-parent", "type-sibling", "type-index"],
          ],
          internalPattern: ["^@/.+", "^~/.+"],
          newlinesBetween: 1,
          order: "asc",
          type: "natural",
        },
      ],
      "perfectionist/sort-object-types": "warn",
      "perfectionist/sort-objects": [
        "warn",
        {
          type: "unsorted",
          useConfigurationIf: {
            callingFunctionNamePattern: ".*useInfiniteQuery$",
          },
        },
        {
          type: "unsorted",
          useConfigurationIf: {
            callingFunctionNamePattern: ".*infiniteQueryOptions$",
          },
        },
      ],
      "react/no-children-prop": "off",
      "sort-imports": "off",
    },

    settings: {
      ...perfectionist.configs["recommended-natural"].settings,
      "import/resolver": {
        typescript: {
          project: "./tsconfig.json",
        },
      },
    },
  }),
  {
    files: ["**/*.d.json.ts", "lib/i18n/messages.ts"],
    rules: {
      "perfectionist/sort-exports": "off",
      "perfectionist/sort-object-types": "off",
      "perfectionist/sort-objects": "off",
      "prettier/prettier": "off",
    },
  },
  {
    files: ["lib/auth/permissions.ts"],
    rules: {
      "perfectionist/sort-exports": "off",
      "perfectionist/sort-imports": "off",
      "perfectionist/sort-object-types": "off",
      "perfectionist/sort-objects": "off",
    },
  },
  ...pluginQuery.configs["flat/recommended"],
];

export default eslintConfig;

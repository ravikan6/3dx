import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

// Get the current file path and directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize FlatCompat with the base directory
const compat = new FlatCompat({
  baseDirectory: __dirname,
});

// Define the ESLint configuration
const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      "@typescript-eslint/no-unused-vars": "off", // Turn off the rule for unused vars
      "@typescript-eslint/no-explicit-any": "off", // Turn off the rule for 'any' type
      "react/no-unescaped-entities": "off", // Turn off the rule for unescaped entities in JSX
      "@typescript-eslint/no-non-null-asserted-optional-chain": "off", // Allow non-null assertions on optional chains
    },
  },
];

export default eslintConfig;

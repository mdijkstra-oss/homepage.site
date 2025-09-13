# --- Copy and paste the entire block below into your terminal for Flat Config Setup ---

# Check for jq
if ! command -v jq &> /dev/null; then
  echo "Error: 'jq' is required but not installed. Please install it (e.g., 'brew install jq' or 'sudo apt install jq') and try again."; exit 1;
fi;

# Install dependencies including flat config requirements
npm install -D \
  eslint \
  @eslint/js \
  prettier \
  @typescript-eslint/eslint-plugin \
  @typescript-eslint/parser \
  eslint-config-prettier \
  eslint-plugin-prettier \
  eslint-plugin-react \
  eslint-plugin-react-hooks \
  globals \
  husky \
  lint-staged;

# Remove any old ESLint config files if they exist
rm -f .eslintrc.js .eslintrc.cjs;

# Create/overwrite eslint.config.js with the new Flat Config syntax for React/TS
echo "import js from '@eslint/js';
import globals from 'globals';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import ts from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import prettier from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';

export default [
  {
    // 1. Apply recommended JS rules globally
    ...js.configs.recommended,
    files: ['**/*.{js,mjs,cjs,jsx,mjsx,ts,tsx,mtsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node, // Important for Vite tooling
      },
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: {
      react,
      'react-hooks': reactHooks,
    },
    settings: {
      react: { version: 'detect' },
    },
    rules: {
      ...react.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      // Disable deprecated rules for new JSX transform if using React 17+
      'react/react-in-jsx-scope': 'off',
      'react/jsx-uses-react': 'off',
    },
  },
  {
    // 2. Apply TypeScript-specific rules
    files: ['**/*.{ts,tsx,mtsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: ['./tsconfig.json'],
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': ts,
    },
    rules: {
      ...ts.configs['recommended'].rules,
      // Example: Disable prop-types as TS handles types
      'react/prop-types': 'off',
    },
  },
  {
    // 3. Apply Prettier integration last to override other rules
    files: ['**/*.{js,mjs,cjs,jsx,mjsx,ts,tsx,mtsx}'],
    plugins: {
      prettier,
    },
    rules: {
      ...prettierConfig.rules,
      'prettier/prettier': 'error',
    },
  },
  {
    // 4. Define files to ignore
    ignores: ['dist/', 'node_modules/'],
  },
];" > eslint.config.js;

# Create/overwrite .prettierrc with modern settings
echo '{
  "semi": true,
  "trailingComma": "all",
  "singleQuote": true,
  "printWidth": 120,
  "tabWidth": 2
}' > .prettierrc;

# Update package.json scripts and lint-staged config using jq
jq '.scripts.lint = "eslint . --fix" |
    .scripts.format = "prettier --write ." |
    .["lint-staged"] = {
      "*.{ts,tsx,js,jsx}": [
        "eslint --fix",
        "prettier --write"
      ]
    }' package.json > package.json.tmp && mv package.json.tmp package.json;

# Set up Husky and the pre-commit hook to run tests and then lint-staged
npx husky install;
echo '#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

# Run tests first. If they fail, abort the commit.
npm run test

# If tests pass, run linters/formatters on staged files.
npx lint-staged' > .husky/pre-commit;
chmod +x .husky/pre-commit; # Ensure the hook is executable

echo "Setup complete using ESLint's new Flat Config (eslint.config.js)!";
echo " - ESLint (Flat Config), Prettier, React, and TypeScript are configured.";
echo " - Scripts 'npm run lint' and 'npm run format' added.";
echo " - Pre-commit hook runs 'npm run test' then 'lint-staged'.";
echo " - Prettier set to trailingComma: all, printWidth: 120.";
echo "Restart your editor's TS/ESLint server if needed."

# --- End of copy-paste block ---

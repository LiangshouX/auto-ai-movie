module.exports = {
  root: true,
  env: {
    browser: true,
    es2022: true,
    node: true,
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['react', 'react-hooks', 'react-refresh', '@typescript-eslint'],
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  rules: {
    'react/react-in-jsx-scope': 'off',
    'react-refresh/only-export-components': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'react/prop-types': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
    'no-case-declarations': 'off',
    '@typescript-eslint/no-unused-vars': ['warn', { 'argsIgnorePattern': '^_', 'varsIgnorePattern': '^_' }],
  },
  ignorePatterns: ['dist', 'storybook-static'],
};

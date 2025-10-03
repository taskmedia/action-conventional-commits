// @ts-check

const eslint = require('@eslint/js')
const tseslint = require('typescript-eslint')
const jest = require('eslint-plugin-jest')

module.exports = tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.ts'],
    languageOptions: {
      parserOptions: {project: './tsconfig.json', tsconfigRootDir: __dirname}
    },
    plugins: {jest},
    rules: {
      // Disable base rules that are covered by TypeScript equivalents
      'no-unused-vars': 'off',
      camelcase: 'off',

      // TypeScript ESLint rules that are still available
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/explicit-member-accessibility': [
        'error',
        {accessibility: 'no-public'}
      ],
      '@typescript-eslint/no-require-imports': 'error',
      '@typescript-eslint/array-type': 'error',
      '@typescript-eslint/await-thenable': 'error',
      '@typescript-eslint/ban-ts-comment': 'error',
      '@typescript-eslint/consistent-type-assertions': 'error',
      '@typescript-eslint/explicit-function-return-type': [
        'error',
        {allowExpressions: true}
      ],
      '@typescript-eslint/no-array-constructor': 'error',
      '@typescript-eslint/no-empty-interface': 'error',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-extraneous-class': 'error',
      '@typescript-eslint/no-for-in-array': 'error',
      '@typescript-eslint/no-inferrable-types': 'error',
      '@typescript-eslint/no-misused-new': 'error',
      '@typescript-eslint/no-namespace': 'error',
      '@typescript-eslint/no-non-null-assertion': 'warn',
      '@typescript-eslint/no-useless-constructor': 'error',
      '@typescript-eslint/no-var-requires': 'error',
      '@typescript-eslint/prefer-for-of': 'warn',
      '@typescript-eslint/prefer-includes': 'error',
      '@typescript-eslint/prefer-string-starts-ends-with': 'error',
      '@typescript-eslint/promise-function-async': 'error',
      '@typescript-eslint/require-array-sort-compare': 'error',
      '@typescript-eslint/restrict-plus-operands': 'error',
      '@typescript-eslint/unbound-method': 'error'
    }
  },
  {
    files: ['**/*.test.ts', '**/*.spec.ts', '__tests__/**/*.ts'],
    plugins: {jest},
    rules: {...jest.configs.recommended.rules},
    languageOptions: {globals: {...jest.environments.globals.globals}}
  },
  {ignores: ['dist/', 'lib/', 'node_modules/', 'jest.config.js']}
)

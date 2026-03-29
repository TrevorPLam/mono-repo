import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintConfigPrettier from 'eslint-config-prettier';

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  eslintConfigPrettier,
  {
    files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
    ignores: [
      'node_modules/**',
      'dist/**',
      '.next/**',
      'coverage/**',
      '.turbo/**',
      'packages/*/generated/**'
    ],
    rules: {
      // Enforce strict boundaries
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['../../*'],
              message: 'Use workspace: protocol for cross-package imports'
            }
          ]
        }
      ],
      // Prevent direct vendor SDK imports when shared packages exist
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@google-analytics/*', '@meta-pixel/*', 'posthog-js'],
              message: 'Use @repo/analytics instead of direct vendor imports'
            }
          ]
        }
      ]
    }
  },
  {
    files: ['apps/**/*.{js,mjs,cjs,ts,jsx,tsx}'],
    rules: {
      // Apps should not import private internals from other apps
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['../apps/*'],
              message: 'Apps should not import from other apps'
            }
          ]
        }
      ]
    }
  }
];

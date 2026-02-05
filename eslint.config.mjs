import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-config-prettier';

export default [
  // regras base JS
  js.configs.recommended,

  // regras TS (sem typed linting)
  ...tseslint.configs.recommended,

  // prettier
  prettier,

  // arquivos de build / scripts Node
  {
    files: ['**/*.mjs'],
    languageOptions: {
      globals: {
        console: 'readonly',
        process: 'readonly',
      },
    },
  },

  {
    ignores: ['dist/**', 'node_modules/**'],
  },
];

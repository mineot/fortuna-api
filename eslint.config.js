import { configApp } from '@adonisjs/eslint-config';

export default configApp({
  rules: {
    'prettier/prettier': [
      'error',
      {
        endOfLine: 'auto',
        semi: true,
        singleQuote: true,
        trailingComma: 'all',
        printWidth: 100,
        tabWidth: 2,
        useTabs: false,
      },
    ],
  },
});

import nextPlugin from '@next/eslint-plugin-next';

import { FlatCompat } from '@eslint/eslintrc';
 
const compat = new FlatCompat({
  // import.meta.dirname is available after Node.js v20.11.0
  baseDirectory: import.meta.dirname,
})

const eslintConfig = [
  ...compat.config({
    extends: ['next/core-web-vitals', 'next/typescript'],
  }),

  // --- Next.js Specific Rules ---
  {
    plugins: {
      '@next/next': nextPlugin,
    },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs['core-web-vitals'].rules,
    },
  },

  // --- Custom Rule Overrides ---
  {
    rules: {
      'react/prefer-destructuring-assignment': 'off',
      'node/prefer-global/process': 'off',
    },
  },
  // --- Shadcn Ignore ---
  {
    files: ['src/components/ui/shadcn/**'],
    ignores: ['src/components/ui/shadcn/**'],
  },
];

export default eslintConfig;
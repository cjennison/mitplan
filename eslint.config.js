import globals from 'globals';
import pluginJs from '@eslint/js';
import pluginReact from 'eslint-plugin-react';
import pluginReactHooks from 'eslint-plugin-react-hooks';

export default [
  {
    ignores: ['dist/**', 'node_modules/**'],
  },
  pluginJs.configs.recommended,
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2026,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
        // ACT/Cactbot globals
        addOverlayListener: 'readonly',
        removeOverlayListener: 'readonly',
        callOverlayHandler: 'readonly',
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      react: pluginReact,
      'react-hooks': pluginReactHooks,
    },
    rules: {
      // React rules
      'react/react-in-jsx-scope': 'off', // React 19 doesn't need import
      'react/prop-types': 'warn',
      'react/jsx-uses-react': 'off',
      'react/jsx-uses-vars': 'error',

      // React Hooks rules
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      // General rules
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'prefer-const': 'error',
      'no-var': 'error',
      eqeqeq: 'error',
      curly: 'error',
      'no-console': ['warn', { allow: ['warn', 'error', 'log'] }],
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
];

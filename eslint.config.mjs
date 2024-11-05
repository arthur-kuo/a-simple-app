import globals from 'globals';
import pluginJs from '@eslint/js';
import googleConfig from 'eslint-config-google';

export default [
  googleConfig,
  {
    files: ['**/*.js'],
    languageOptions: {
      sourceType: 'commonjs',
      globals: {
        process: 'readonly',
      },
    },
  },
  {languageOptions: {globals: globals.browser}},
  pluginJs.configs.recommended,
];

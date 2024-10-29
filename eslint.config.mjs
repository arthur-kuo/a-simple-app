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
        process: 'readonly', // 明確告訴 ESLint process 是只讀的
      },
    },
  },
  {languageOptions: {globals: globals.browser}},
  pluginJs.configs.recommended,
];

// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');
const prettierConfig = require('eslint-config-prettier');

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ['dist/*'],
    rules: {
      'import/no-named-as-default': 'off',
    },
  },
  // Por ultimo: desliga qualquer regra de estilo do ESLint que brigue com o Prettier
  // (o Prettier cuida de formatacao, o ESLint fica so com regras de qualidade/bugs).
  prettierConfig,
]);

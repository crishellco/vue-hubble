module.exports = {
  env: {
    browser: true,
    jest: true,
    node: true,
  },

  extends: [
    'plugin:nuxt/recommended',
    'plugin:vue/recommended',
    'plugin:prettier-vue/recommended',
    'plugin:@crishellco/recommended',
    'prettier',
  ],
  globals: {
    __basedir: true,
    createStore: true,
  },
  overrides: [
    {
      files: ['*.vue'],
      rules: {
        'sort-keys-fix/sort-keys-fix': 'off',
      },
    },
  ],
  parserOptions: {
    parser: '@babel/eslint-parser',
    requireConfigFile: false,
  },
  plugins: ['jest-formatting', '@crishellco', 'sort-keys-fix', 'unused-imports'],
  root: true,
  rules: {
    'jest-formatting/padding-around-describe-blocks': 2,
    'jest-formatting/padding-around-test-blocks': 2,
    'newline-before-return': 'error',
    'sort-keys-fix/sort-keys-fix': 'warn',
    'unused-imports/no-unused-imports': 'error',
    'vue/component-name-in-template-casing': ['error', 'kebab-case'],
    'vue/html-self-closing': [
      'error',
      {
        html: {
          component: 'always',
          normal: 'always',
          void: 'always',
        },
        math: 'always',
        svg: 'always',
      },
    ],
    'vue/multi-word-component-names': 'off',
    'vue/new-line-between-multi-line-property': 'error',
    'vue/padding-line-between-blocks': 'error',
    'vue/require-name-property': 'error',
    'vue/static-class-names-order': 'error',
  },
};

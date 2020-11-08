module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:jest/recommended',
    'plugin:vue/recommended',
    'eslint:recommended',
    'prettier/vue',
    'plugin:prettier/recommended'
  ],
  parserOptions: {
    parser: 'babel-eslint'
  }
};

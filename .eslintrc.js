module.exports = {
  root: true,
  env: {
    node: true
  },

  extends: [
    'plugin:vue/recommended',
    'plugin:prettier-vue/recommended',
    'prettier',
  ],
  parserOptions: {
    parser: 'babel-eslint'
  },
};

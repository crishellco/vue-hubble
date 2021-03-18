module.exports = {
  root: true,
  env: {
    node: true
  },

  extends: ['plugin:jest/recommended', 'prettier', 'eslint:recommended', 'plugin:vue/recommended'],
  parserOptions: {
    parser: 'babel-eslint'
  }
};

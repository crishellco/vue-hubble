module.exports = {
  root: true,
  env: {
    node: true,
    "jest/globals": true
  },
  plugins: ["jest"],
  extends: [
    "plugin:vue/recommended",
    "eslint:recommended",
    "@vue/prettier"
  ],
  parserOptions: {
    parser: 'babel-eslint'
  }
};

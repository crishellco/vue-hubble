module.exports = {
  root: true,
  env: {
    node: true,
    'jest/globals': true,
  },
  plugins: ['jest'],
  extends: ['plugin:vue/recommended', 'eslint:recommended', '@vue/prettier'],
  parserOptions: {
    requireConfigFile: false,
    babelOptions: {
      babelrc: false,
      configFile: false,
      presets: ['babel-eslint'],
    },
  },
};

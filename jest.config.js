module.exports = {
  collectCoverage: true,
  collectCoverageFrom: ['plugin/**/*.{js,vue}'],
  coverageReporters: ['json-summary', 'text', 'lcov'],
  moduleFileExtensions: [
    'js',
    'json',
    // tell Jest to handle `*.vue` files
    'vue',
  ],
  testEnvironment: 'jsdom',
  transform: {
    // process `*.vue` files with `vue-jest`
    '.*\\.(vue)$': 'vue-jest',
    '^.+\\.js$': '<rootDir>/node_modules/babel-jest',
  },
};

module.exports = {
    collectCoverage: true,
    collectCoverageFrom: [
      'src/**/*.{js,vue}',
      '!src/index.js',
    ],
    moduleFileExtensions: [
      'js',
      'jsx',
      'json',
      'vue',
    ],
    moduleNameMapper: {
      '^@/(.*)$': '<rootDir>',
    },
    snapshotSerializers: [
      'jest-serializer-vue',
    ],
    testMatch: [
      '**/test/**/*.spec.(js|jsx|ts|tsx)|**/__tests__/*.(js|jsx|ts|tsx)',
    ],
    // transform: {
    //   '^.+\\.vue$': 'vue-jest',
    //   '.+\\.(css|styl|less|sass|scss|svg|png|jpg|ttf|woff|woff2)$': 'jest-transform-stub',
    //   '^.+\\.jsx?$': 'babel-jest',
    // },
  };

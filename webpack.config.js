const path = require('path');

module.exports = {
  mode: 'none',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.js',
    libraryTarget: 'commonjs2',
  },
  module: {
    rules: [{
      test: /\.js$/,
      include: path.resolve(__dirname, 'src'),
      exclude: /(node_modules|dist)/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['env'],
        },
      },
    }],
  },
};

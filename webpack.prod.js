const webpack = require('webpack');
const { merge } = require('webpack-merge');
// const MinifyPlugin = require('babel-minify-webpack-plugin');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  output: {
    publicPath: '/dist/',
  },
  mode: 'production',
  plugins: [
    // new MinifyPlugin(),
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false,
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"',
      },
    }),
  ],
});

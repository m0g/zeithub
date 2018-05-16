const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    contentBase: './dist'
  },
  plugins: [
    new HardSourceWebpackPlugin(),
    new BundleAnalyzerPlugin({
      analyzerHost: '0.0.0.0'
    })
  ]
});
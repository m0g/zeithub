const webpack = require('webpack');
const { VueLoaderPlugin } = require('vue-loader');

module.exports = {
  entry: [
    './src/client/index.ts'
  ],
  output: { filename: 'bundle.js' },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
        options: {
          appendTsSuffixTo: [/\.vue$/],
        }
      },
      {
        test: /\.css$/,
        use: [
          'vue-style-loader',
          'style-loader', 
          'css-loader' 
        ]
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
    ]
  },
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm.js'
    },
    extensions: ['*', '.ts', '.js', '.vue', '.json']
  },
  plugins: [
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    new VueLoaderPlugin(),
  ],
  node: {
    fs: 'empty'
 }
};

module.exports = {
  mode: 'development',
  entry: [
    './src/client/index.js'
  ],
  output: { filename: 'bundle.js' },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      }
    ]
  },
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm.js'
    },
    extensions: ['*', '.js', '.vue', '.json']
  }
}

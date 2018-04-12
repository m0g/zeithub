module.exports = {
  mode: 'development',
  entry: [
    './src/client.js'
  ],
  output: { filename: 'bundle.js' },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      }
    ]
  }
}

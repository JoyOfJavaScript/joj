module.exports = {
  entry: './src/index.js',
  mode: 'development',
  target: 'web',
  output: {
    path: require('path').resolve(__dirname),
    filename: 'index.js'
  },
  devtool: 'sourcemap',
  module: {
    rules: [
      {
        test: /.js?$/,
        exclude: [/node_modules/],
        use: [
          { loader: 'babel-loader' },
          {
            loader: 'babel-loader',
            query: {
              presets: ['env']
            }
          }
        ]
      }
    ]
  },
  resolve: {
    extensions: ['.js']
  }
}

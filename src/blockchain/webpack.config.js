const path = require('path')

module.exports = {
  entry: './src/app.js',
  output: {
    filename: 'blockchain-app.js',
    path: path.resolve(__dirname, 'webpack-dist')
  },
  module: {
    rules: [
      {
        test: /\.(js)$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      }
    ]
  },
  node: {
    fs: 'empty'
  },
  resolve: {
    extensions: ['.js']
  },
  mode: 'development',
  optimization: {
    usedExports: true
  }
}

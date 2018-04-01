const path = require('path')

module.exports = {
  entry: './src/client/app.js',
  mode: 'development',
  target: 'web',
  watch: true,
  output: {
    path: path.resolve(__dirname, 'public', 'dist'),
    filename: 'app.js'
  },
  devtool: 'sourcemap',
  module: {
    rules: [
      {
        test: /.js?$/,
        exclude: [
          /node_modules\/babel-/m,
          /node_modules\/core-js\//m,
          /node_modules\/regenerator-runtime\//m
        ],
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

const path = require('path')
const fs = require('fs')

module.exports = {
  entry: './src/app.js',
  mode: 'development',
  target: 'web',
  watch: true,
  output: {
    path: path.resolve(__dirname, 'public', 'dist'),
    filename: 'app.js'
  },
  module: {
    rules: [
      {
        test: /.js?$/,
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
  },
  externals: fs.readdirSync('node_modules').reduce(function(acc, mod) {
    if (mod === '.bin') {
      return acc
    }

    acc[mod] = 'commonjs ' + mod
    return acc
  }, {})
}

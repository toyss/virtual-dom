const webpack = require('webpack')

module.exports  = {
  entry: __dirname + '/index.js',
  output: {
    path: __dirname + '/build',
    filename: 'bundle.js-[hash:6].js'
  },
  devServer: {
    contentBase: './public',
    hot: true
  }
}
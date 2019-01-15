const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const resolve = (dir) => path.resolve(__dirname, dir)

module.exports  = {
  entry: resolve('src/index.js'),
  output: {
    path: resolve('dist'),
    filename: 'bundle.js-[hash:6].js'
  },
  mode: 'development',
  devtool: 'source-map',
  devServer: {
    contentBase: resolve('dist'),
    hot: true
  },
  plugins: [
    new HtmlWebpackPlugin({title: 'virtual-dom'}),
    new webpack.HotModuleReplacementPlugin()
  ]
}
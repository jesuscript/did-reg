var webpack = require("webpack"),
    WebpackErrorNotificationPlugin = require('webpack-error-notification'),
    path = require("path")

var ENV = process.env.NODE_ENV || "development"

module.exports = {
  context: path.join(__dirname, "./app"),
  entry: {
    index: "./entry.js"
  },
  output: {
    path: path.join(__dirname, "./build"),
    filename: "bundle.js"
  },
  resolve:{
    extensions: ["", ".js", ".jsx"]
  },
  resolveLoader: { root: path.join(__dirname, 'node_modules') },
  devServer: {
    hot: true,
    contentBase: "./build"
  },
  module: {
    loaders: [
      {
        test: /\.js$|.jsx$/,
        exclude: /node_modules/,
        loader:  'babel'
      },
      { test   : /\.(ttf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/, loader : 'file-loader' },
      { test: /\.css$/, loader: "style-loader!css-loader" },
      { test: /\.less$/, loader: "style!css!less" },
      { test: /\.scss$/, loaders: ["style", "css", "sass"] },
      { test: /\.json$/, loader: "json-loader" },
      {
        test: /\.html$/,
        loader: 'file?name=[name].[ext]'
      }
    ]
  },
  plugins: [
    new WebpackErrorNotificationPlugin(),
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery"
      
    })
  ]
  
}


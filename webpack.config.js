var webpack = require('webpack');
var path = require('path');
var nodeModulesPath = path.resolve(__dirname, 'node_modules');

module.exports = {
    devtool: 'source-map',
    entry: path.resolve(__dirname, 'app/index.jsx'),
    output: {
        path: path.resolve(__dirname, 'build'),
        publicPath: "app/", 
        filename: 'bundle.js',
    },
    module: {
    loaders: [
      {
        test: /\.jsx$/,
        loader: 'babel',
        exclude: /node_modules/,

      }
    ]
  },
  resolve: {
    extensions: ['',  '.jsx','.js']
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ]
};
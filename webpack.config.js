var path = require('path');
var nodeModulesPath = path.resolve(__dirname, 'node_modules');

module.exports = {
    entry: path.resolve(__dirname, 'js/controller.js'),
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'bundle.js',
    },
    module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015', 'react']
        }
      }
    ]
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  }
};
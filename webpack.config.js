var webpack = require('webpack');
var path = require('path');
var nodeModulesPath = path.resolve(__dirname, 'node_modules');

const rules = [
  {
    test: /\.(js|jsx)$/,
    exclude: /node_modules/,
    use: [
      'babel-loader',
    ],
  },
];

module.exports = {
    devtool: 'source-map',
    entry: './app/index.jsx',
    output: {
        path: path.resolve(__dirname, 'build'),
        publicPath: "app/", 
        filename: 'bundle.js',
    },
    module:{
      rules,
    },
    resolve: {
      extensions: ['.jsx','.js']
    },
};
const webpack = require('webpack');
const config = {
  entry:  __dirname + '/js/index.jsx',
  output: {
    path: __dirname + '/dist',
    filename: 'bundle.js',
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.css']
  },
  module: {
    rules: [
      {
        test: /(\.jsx?|\.tsx?)/,
        exclude: /node_modules/,
        use: 'ts-loader'
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ],
  },
  stats: {
    errorDetails: true,
    colors: false,
    modules: true,
    reasons: true,
  },
  devtool: 'source-map',
};
module.exports = config;
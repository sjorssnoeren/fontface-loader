'use strict';

const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const path = require('path');

module.exports = {
  entry: {
    js: './assets/app.js',
  },
  output: {
    filename: './js/app.js',
    path: path.join(__dirname, '/dist/'),
    publicPath: '/dist',
  },
  module: {
    rules: [{
      test: /\.css$/,
      use: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: 'css-loader',
      }),
    }, {
      test: /^(?!.*\.generated\.ttf$).*\.ttf$/,
      use: ExtractTextPlugin.extract({
        use: ['css-loader', 'fontface-loader']
      }),
    }, {
      test: /\.generated.(ttf|eot|woff|woff2)$/,
      use: [{
        loader: 'file-loader',
        options: {
          outputPath: '/fonts/',
        },
      }],
    }],
  },
  resolveLoader: {
    modules: [
      'node_modules',
      '../lib',
    ],
  },
  plugins: [
    new ExtractTextPlugin('/css/style.css'),
  ],
  devtool: 'eval',
};

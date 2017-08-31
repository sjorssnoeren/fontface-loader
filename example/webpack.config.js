'use strict';

const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const path = require('path');

module.exports = {
  entry: {
    js: './assets/app.js',
  },
  output: {
    filename: './dist/js/app.js',
  },
  module: {
    rules: [{
      test: /\.css$/,
      use: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: 'css-loader',
      }),
    }, {
      test: /\.ttf$/,
      use: ExtractTextPlugin.extract({
        use: ['css-loader', 'fontface-loader']
      }),
    }],
  },
  resolveLoader: {
    modules: [
      'node_modules',
      '../lib',
    ],
  },
  plugins: [
    new ExtractTextPlugin('/dist/css/style.css'),
  ],
  devtool: 'eval',
};

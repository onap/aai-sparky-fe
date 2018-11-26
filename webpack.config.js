/*
 * ============LICENSE_START=======================================================
 * org.onap.aai
 * ================================================================================
 * Copyright © 2017-2018 AT&T Intellectual Property. All rights reserved.
 * Copyright © 2017-2018 Amdocs
 * ================================================================================
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *       http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ============LICENSE_END=========================================================
 */
'use strict';

var webpack = require('webpack');
var path = require('path');

module.exports = {
  devtool: 'source-map',
  cache: 'true',
  entry: {
    bundle: [
      'app/main.app.jsx',
      'webpack/hot/only-dev-server'
    ]
  },
  output: {
    path: path.join(__dirname, 'dist'),
    publicPath: ``,
    filename: '[name].js',
    sourceMapFilename: '[name].js.map'
  },
  resolve: {
    root: [path.resolve('.')],
    alias: {
      app: 'src/app',
      'generic-components': 'src/generic-components',
      utils: 'src/utils',
      images: 'resources/images'
    },
    extensions: ["", ".webpack.js", ".web.js", ".js", ".json", ".jsx"]
  },
  resolveLoader: {
    root: [path.resolve('.')],
    alias: {
      'config-json-loader': 'tools/webpack/config-json-loader/index.js'
  }
  },
  module: {
    loaders: [
      {test: /\.(js|jsx)$/, loaders: ['babel-loader', 'eslint-loader'], exclude: /node_modules/},
      {test: /\.(css|scss)$/, loaders: ['style', 'css?sourceMap', 'sass?sourceMap']},
      // required for font icons
      {test: /\.(woff|woff2|ttf|eot|otf)(\?.*)?$/, loader: 'url-loader?limit=163840&mimetype=application/font-woff&name=[name].[ext]'},
      {test: /\.(png|jpg|svg)(\?.*)?$/, loader: 'url-loader?limit=163840'},
      {test: /\.json$/, loaders: ['json']},
      { test: /\.xml$/, loader: 'xml-loader' }
    ]
  },
  eslint: {
    configFile: './.eslintrc',
    failOnError: true,
    emitError: true,
    emitWarning: true
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
      }),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({ sourceMap: true })
  ]
};

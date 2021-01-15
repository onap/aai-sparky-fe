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

var path = require('path');
var webpack = require('webpack');
var devPort = process.env.PORT || 8001;
var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  devtool: 'source-map',
  entry: {
    bundle: [
      'app/main.app.jsx',
      'webpack/hot/only-dev-server'
    ]
  },
  externals: [
      {
        xmlhttprequest: 'XMLHttpRequest'
      }
   ],
  output: {
    path: path.join(__dirname, 'dist/aai'),
    publicPath: 'https://localhost:8001/',
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
  devServer: {
    port: devPort,
    disableHostCheck: true,
    historyApiFallback: true,
    publicPath: ``,
    contentBase: path.join(__dirname, 'dist'),
    hot: true,
    progress: true,
    inline: true,
    debug: true,
    https: true,
    stats: {
      colors: true
    }
  },
  module: {
    loaders: [
      {test: /\.(js|jsx)$/, loaders: ['babel-loader'], exclude: /node_modules/},
      {test: /\.(css|scss)$/, loaders: ['style-loader', 'css-loader', 'sass-loader']},
      // required for font icons
      {test: /\.(woff|woff2|ttf|eot|otf)(\?.*)?$/, loader: 'url-loader?limit=163840&mimetype=application/font-woff&name=[name].[ext]'},
      {test: /\.(png|jpg|svg)(\?.*)?$/, loader: 'url-loader?limit=163840&name=[name].[ext]'},
      {test: /\.json$/, loaders: ['json']},
      { test: /\.xml$/, loader: 'xml-loader' }
    ]
  },
  eslint: {
    configFile: './.eslintrc',
    failOnError: false,
    emitError: false,
    emitWarning: true
  },
  plugins: [
    //new BundleAnalyzerPlugin(),
    new webpack.DefinePlugin({
      DEBUG: true
    }),

    new webpack.HotModuleReplacementPlugin()
  ]
};

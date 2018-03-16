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

module.exports = {
	devtool: 'eval-source-map',
	entry: {
		'aai/bundle': [
			'app/main.app.jsx',
			`webpack-dev-server/client?https://localhost:${devPort}`,
			'webpack/hot/only-dev-server'
		],
		'editAttributes/editAttributesBundle': [
			'editAttributes/main.app.jsx',
			`webpack-dev-server/client?https://localhost:${devPort}`,
			'webpack/hot/only-dev-server'
		]
	},
	output: {
		path: path.join(__dirname, 'dist'),
		publicPath: `https://localhost:${devPort}/`,
		filename: '[name].js'
	},
	resolve: {
		root: [path.resolve('.')],
		alias: {
			app: 'src/app',
			'generic-components': 'src/generic-components',
			utils: 'src/utils',
			images: 'resources/images',
			editAttributes: 'src/editAttributes'
		}
	},
	devServer: {
		port: devPort,
		historyApiFallback: true,
		publicPath: `https://localhost:${devPort}/`,
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
		preLoaders: [
			{test: /\.(js|jsx)$/, loader: 'source-map-loader'}
		],
		loaders: [
			{test: /\.(js|jsx)$/, loaders: ['babel-loader', 'eslint-loader'], exclude: /node_modules/},
			{test: /\.(css|scss)$/, loaders: ['style', 'css?sourceMap', 'sass?sourceMap']},
			// required for font icons
			{test: /\.(woff|woff2)(\?.*)?$/, loader: 'url-loader?limit=16384&mimetype=application/font-woff'},
			{test: /\.(ttf|eot|otf)(\?.*)?$/, loader: 'file-loader'},
			{test: /\.(png|jpg|svg)(\?.*)?$/, loader: 'url-loader?limit=16384'},
			{test: /\.json$/, loaders: ['json']}
		]
	},
	eslint: {
		configFile: './.eslintrc',
		emitError: true,
		emitWarning: true
	},
	plugins: [
		new webpack.DefinePlugin({
			DEBUG: true
		}),

		new webpack.HotModuleReplacementPlugin()
	]
};

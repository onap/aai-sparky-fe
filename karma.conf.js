/*
 * ============LICENSE_START=======================================================
 * org.onap.aai
 * ================================================================================
 * Copyright © 2017 AT&T Intellectual Property. All rights reserved.
 * Copyright © 2017 Amdocs
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
 *
 * ECOMP is a trademark and service mark of AT&T Intellectual Property.
 */

var path = require('path');
var webpack = require('webpack');
var isparta = require('isparta');

module.exports = function (config) {
	config.set({

		browsers: [process.env.CONTINUOUS_INTEGRATION ? 'Firefox' : 'Chrome'],

		singleRun: true,

		frameworks: ['mocha'],

		files: ['tests.webpack.js'],

		preprocessors: {
			'tests.webpack.js': ['webpack', 'sourcemap'],
			'src/**/*.jsx': ['coverage']
		},

		reporters: ['progress', 'coverage'],

		coverageReporter: {
			dir: 'dist/coverage/',
			reporters: [
				{type: 'html'},
				{type: 'text-summary'}
			],
			includeAllSources: true,
			instrumenters: {isparta: isparta},
			instrumenter: {
				'**/*.js': 'isparta',
				'**/*.jsx': 'isparta'
			},
			instrumenterOptions: {
				isparta: {
					embedSource: true,
					noAutoWrap: true
				}
			}
		},

		webpack: {
			babel: {
				presets: ['es2015', 'stage-0', 'react']
			},
			isparta: {
				embedSource: true,
				noAutoWrap: true,
				// these babel options will be passed only to isparta and not to babel-loader
				babel: {
					presets: ['es2015', 'stage-0', 'react']
				}
			},
			devtool: 'inline-source-map',
			resolve: {
				root: [path.resolve('.')],
				alias: {
					app: 'src/app',
					'generic-components': 'src/generic-components',
					utils: 'src/utils',
					'test-utils': 'test/utils'
				}
			},
			module: {
				preLoaders: [
					{test: /\.(js|jsx)$/, exclude: /node_modules/, loader: 'babel-loader'},
					{test: /\.(js|jsx)$/, exclude: /(test|test\.js|node_modules)/, loader: 'isparta'}
				],
				loaders: [
					{test: /\.css$/, loaders: ['style', 'css', 'resolve-url']},
					{test: /\.scss$/, loaders: ['style', 'css', 'resolve-url', 'sass?sourceMap']},
					// required for font icons
					{test: /\.(woff|woff2)(\?.*)?$/, loader: 'url-loader?limit=16384&mimetype=application/font-woff'},
					{test: /\.(ttf|eot|otf)(\?.*)?$/, loader: 'file-loader'},
					{test: /\.(png|jpg|svg)(\?.*)?$/, loader: 'url-loader?limit=16384'},

					{test: /\.json$/, loaders: ['json']}
				]
			}
		},

		webpackServer: {
			noInfo: true
		}

	});
};

/*
 * ============LICENSE_START===================================================
 * SPARKY (AAI UI service)
 * ============================================================================
 * Copyright © 2017 AT&T Intellectual Property.
 * Copyright © 2017 Amdocs
 * All rights reserved.
 * ============================================================================
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ============LICENSE_END=====================================================
 *
 * ECOMP and OpenECOMP are trademarks
 * and service marks of AT&T Intellectual Property.
 */

'use strict';

var localPath = require('path');
var gulp = require('gulp');
var gulpHelpers = require('gulp-helpers');
var taskMaker = gulpHelpers.taskMaker(gulp);
var runSequence = gulpHelpers.framework('run-sequence');
var gulpCssUsage = require('gulp-css-usage').default;
var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var devWebpackConfig = require('./webpack.devConfig.js');
var webpackConfig = require('./webpack.config');

let appName = 'aai';
let dist = 'dist/';

let path = {
	output: dist,
	aaiOutput: dist + '/aai/',
	assets: './resources/**/*.{css,png,svg,eot,ttf,woff,woff2,otf}',
	json: './src/**/*.json',
	aaiIndex: './src/index.html',
	scss: './resources/scss/**/*.scss',
	aaiCss: dist + '/css',
	war: [dist + '**/*.html', dist + '**/*.js', dist + '**/*.{css,png,svg,eot,ttf,woff,woff2,otf}', dist + '**/*.json', 'webapp/**'],
	wardest: dist
};

taskMaker.defineTask('clean', {taskName: 'clean', src: path.output});
taskMaker.defineTask('copy', {taskName: 'copy-aai-index.html', src: path.aaiIndex, dest: path.output, rename: 'index.html'});

gulp.task('copy-dev-stuff', callback => {
	return runSequence(['copy-aai-index.html'], callback);
});

gulp.task('copy-stuff', callback => {
	return runSequence(['copy-aai-index.html'], callback);
});

gulp.task('dev', callback => {
	return runSequence('clean', 'copy-dev-stuff', 'webpack-dev-server', callback);
});

// Production build
gulp.task('build', callback => {
	return runSequence('clean', ['copy-stuff'], 'prod', callback);
});

gulp.task('default', ['dev']);

gulp.task('prod', () => {

	return new Promise((resolve, reject)=> {
		// configure webpack for production
		let webpackProductionConfig = Object.create(webpackConfig);

		for (let name in webpackProductionConfig.entry) {
			webpackProductionConfig.entry[name] = webpackProductionConfig.entry[name].filter(path => !path.startsWith('webpack'));
		}

		webpackProductionConfig.cache = true;
		webpackProductionConfig.output = {
			path: localPath.join(__dirname, 'dist'),
			publicPath: '/services/aai/webapp/',
			filename: '[name].js'
		};
		webpackProductionConfig.resolveLoader = {
			root: [localPath.resolve('.')],
			alias: {
				'config-json-loader': 'tools/webpack/config-json-loader/index.js'
			}
		};

		// remove source maps
		webpackProductionConfig.devtool = undefined;
		webpackProductionConfig.module.preLoaders = webpackProductionConfig.module.preLoaders.filter(preLoader => preLoader.loader != 'source-map-loader');
		webpackProductionConfig.module.loaders.forEach(loader => {
			if (loader.loaders && loader.loaders[0] === 'style') {
				loader.loaders = loader.loaders.map(loaderName => loaderName.replace('?sourceMap', ''));
			}
		});

		webpackProductionConfig.module.loaders.push({test: /config.json$/, loaders: ['config-json-loader']});
		webpackProductionConfig.eslint = {
			configFile: './.eslintrc',
			failOnError: true
		};
		webpackProductionConfig.plugins = [
			new webpack.DefinePlugin({
				'process.env': {
					// This has effect on the react lib size
					'NODE_ENV': JSON.stringify('production')
				},
				DEBUG: false,
				DEV: false
			}),
			new webpack.optimize.DedupePlugin(),
			new webpack.optimize.UglifyJsPlugin()
		];

		// run production build
		webpack(webpackProductionConfig, function (err, stats) {
			console.log('[webpack:build]', stats.toString());
			if (err || stats.hasErrors()) {
				console.log('bundleJS : Failure!!');
				reject();
			}
			else {
				console.log('bundleJS : Done');
				resolve();
			}
		});
	});

});

gulp.task('webpack-dev-server', () => {
	let myConfig = Object.create(devWebpackConfig);

	// Start a webpack-dev-server
	let server = new WebpackDevServer(webpack(myConfig), myConfig.devServer);
	server.listen(myConfig.devServer.port, '0.0.0.0', err => {
		if (err) {
			throw new Error('webpack-dev-server' + err);
		}
	});
});

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
	saOutput: dist + '/editAttributes/',
	assets: './resources/**/*.{css,png,svg,eot,ttf,woff,woff2,otf}',
	json: './src/**/*.json',
	aaiIndex: './src/index.html',
	saIndex: './src/editAttributes/index.html',
	scss: './resources/scss/**/*.scss',
	aaiCss: dist + '/css',
	saCss: dist + '/editAttributes/css',
	war: [dist + '**/*.html', dist + '**/*.js', dist + '**/*.{css,png,svg,eot,ttf,woff,woff2,otf}', dist + '**/*.json', 'webapp/**'],
	wardest: dist
};

taskMaker.defineTask('clean', {taskName: 'clean', src: path.output});
taskMaker.defineTask('copy', {taskName: 'copy-aai-index.html', src: path.aaiIndex, dest: path.output, rename: 'index.html'});
taskMaker.defineTask('copy', {taskName: 'copy-sa-index.html', src: path.saIndex, dest: path.saOutput, rename: 'index.html'});
/** Uncomment the loine below to generate a .war file with a local build */
// taskMaker.defineTask('compress', {taskName: 'compress-war', src: path.war, filename: appName + '.war', dest: path.wardest})

gulp.task('copy-dev-stuff', callback => {
	return runSequence(['copy-aai-index.html', 'copy-sa-index.html'], callback);
});

gulp.task('copy-stuff', callback => {
	return runSequence(['copy-aai-index.html', 'copy-sa-index.html'], callback);
});

gulp.task('dev', callback => {
	return runSequence('clean', 'copy-dev-stuff', 'webpack-dev-server', callback);
});

// Production build
gulp.task('build', callback => {
	return runSequence('clean', ['copy-stuff'], 'prod', callback);
	/** Uncomment the loine below to generate a .war file with a local build */
	//return runSequence('clean', ['copy-stuff'], 'prod', 'compress-war', callback);
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
			publicPath: '',
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
				'process.env.NODE_ENV': JSON.stringify('production')
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

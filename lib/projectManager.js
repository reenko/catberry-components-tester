'use strict';

module.exports = new ProjectManager();

var path = require('path'),
	map = require('map-stream'),
	vinylFs = require('vinyl-fs'),
	changed = require('gulp-changed'),
	jsonCombine = require('gulp-jsoncombine');

var STORES = 'catberry_stores',
	COMPONENTS = 'catberry_components',
	TESTS = 'tests',
	TEST_STORES = 'test_stores',
	TEST_CASES_JSON = 'testCases.json',
	TEMPLATES = 'templates';

/**
 * Project manager
 * @constructor
 */
function ProjectManager () {

}

/**
 * Creates test-project.
 * @param {string} src
 * @param {string|Array<string>} globCopyParams
 * @param {string|Array<string>} globSymlinkParams
 * @param {string} destination
 */
ProjectManager.prototype.create =
	function (src, globCopyParams, globSymlinkParams, destination) {
		var self = this;
		// copy
		vinylFs.src(globCopyParams, {cwd: src})
			.pipe(changed(destination, {hasChanged: changed.compareSha1Digest}))
			.pipe(vinylFs.dest(destination))
			.on('end', function () {
				// copy test stores
				self.copyTestStores(destination);

				// copy test cases
				self.copyTestCases(destination);

				// copy template files
				self.extendWithTemplateFiles(destination);
			});

		// create symlinks
		vinylFs.src(globSymlinkParams, {cwd: src})
			.pipe(vinylFs.symlink(destination));
	};

/**
 * Copies test stores.
 * @param {string} destination
 */
ProjectManager.prototype.copyTestStores = function (destination) {
	vinylFs.src(
			path.join(COMPONENTS, '**', TESTS, TEST_STORES, '*'),
			{cwd: destination}
		)
		.pipe(map(function (file, cb) {
			file.path = file.path
				.replace('/' + path.join(TESTS, TEST_STORES), '');
			cb(null, file);
		}))
		.pipe(vinylFs.dest(path.join(destination, STORES, TEST_STORES)));
};

/**
 * Copies test cases.
 * @param {string} destination
 */
ProjectManager.prototype.copyTestCases = function (destination) {
	vinylFs.src(
			path.join(COMPONENTS, '**', TESTS, 'cat-cases.json'),
			{cwd: destination}
		)
		.pipe(jsonCombine(TEST_CASES_JSON, function (data) {
			var componentCases = {};
			Object.keys(data).forEach(function (component) {
				componentCases[data[component].name] = {
					cases: data[component].cases
				};
			});
			return new Buffer(JSON.stringify(componentCases, null, '\t'));
		}))
		.pipe(vinylFs.dest(destination));
};

/**
 * Extends with template files.
 * @param {string} destination
 */
ProjectManager.prototype.extendWithTemplateFiles = function (destination) {
	vinylFs.src(path.join(TEMPLATES, '**', '*'))
		.pipe(vinylFs.dest(destination));
};
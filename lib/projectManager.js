'use strict';

module.exports = new ProjectManager();

var path = require('path'),
	map = require('map-stream'),
	vinylFs = require('vinyl-fs'),
	glob = require('glob'),
	changed = require('gulp-changed'),
	jsonCombine = require('gulp-jsoncombine');

var STORES = 'catberry_stores',
	COMPONENTS = 'catberry_components',
	TESTS = 'tests',
	TEST_STORES = 'test_stores',
	TEST_CASES_JSON = 'testCases.json',
	CAT_COMPONENT_JSON = 'cat-component.json',
	TEMPLATES = 'templates';

/**
 * Project manager
 * @constructor
 */
function ProjectManager () {

}

/**
 * Gets components info.
 * @param {string} destination
 * @returns {Array<Object>}
 */
ProjectManager.prototype.getComponentNames = function (destination) {
	var catComponents = glob.sync(path.join(destination, '**', CAT_COMPONENT_JSON));
	return catComponents.map(function (filePath) {
		var componentJSON = require(filePath);
		return {
			name: componentJSON.name,
			path: filePath.substr(0, filePath.length - CAT_COMPONENT_JSON.length)
		};
	});
};

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
				var components = self.getComponentNames(destination);

				// copy test stores
				self.copyTestStores(destination, components);

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
 * @param {Array<Object>} components
 */
ProjectManager.prototype.copyTestStores = function (destination, components) {
	components.forEach(function (component) {
		vinylFs.src(
				path.join(component.path, TESTS, TEST_STORES, '*'),
				{cwd: destination}
			)
			.pipe(vinylFs.dest(
				path.join(destination, STORES, TEST_STORES, component.name
			)));
	});
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
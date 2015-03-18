'use strict';

module.exports = new ProjectManager();

var path = require('path'),
	map = require('map-stream'),
	vinylFs = require('vinyl-fs'),
	fs = require('fs'),
	glob = require('glob'),
	changed = require('gulp-changed');

var STORES = 'catberry_stores',
	COMPONENTS = 'catberry_components',
	TESTS = 'tests',
	TEST_STORES = 'test_stores',
	CAT_COMPONENT_JSON = 'cat-component.json',
	CAT_TESTS_JSON = 'cat-component-tests.json',
	PRESET_FILES = 'presets';

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
ProjectManager.prototype.getComponentTests = function (destination) {
	var catTestCases = glob.sync(
		path.join(destination, COMPONENTS, '**', TESTS, CAT_TESTS_JSON)
	);
	return catTestCases.map(function (filePath) {
		var componentDir = filePath.substr(0,
				filePath.length - path.join(TESTS, CAT_TESTS_JSON).length),
			componentJSON = require(path.join(componentDir, CAT_COMPONENT_JSON));
		return {
			name: componentJSON.name,
			path: componentDir,
			tests: require(filePath)
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
				var componentTests = self.getComponentTests(destination);

				// copy test stores
				self.copyTestStores(destination, componentTests);

				// collect tests for all components
				self.collectTests(destination, componentTests);

				// copy preset files
				self.extendWithPresetFiles(destination);

				console.log(componentTests);
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
 * Collects tests.
 * @param {string} destination
 */
ProjectManager.prototype.collectTests = function (destination, componentTests) {
	var componentCases = {};
	componentTests.forEach(function (component) {
		componentCases[component.name] = component.tests;
	});
	fs.createWriteStream(path.join(destination, CAT_TESTS_JSON))
		.end(JSON.stringify(componentCases, null, '\t'));
};

/**
 * Extends with preset files.
 * @param {string} destination
 */
ProjectManager.prototype.extendWithPresetFiles = function (destination) {
	vinylFs.src(path.join(PRESET_FILES, '**', '*'))
		.pipe(vinylFs.dest(destination));
};
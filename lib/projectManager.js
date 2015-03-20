'use strict';

module.exports = new ProjectManager();

var path = require('path'),
	map = require('map-stream'),
	vinylFs = require('vinyl-fs'),
	fs = require('fs'),
	glob = require('glob'),
	changed = require('gulp-changed'),
	packageConfig = require('../package.json');

var STORES = 'catberry_stores',
	COMPONENTS = 'catberry_components',
	TESTS = 'tests',
	TEST_STORES = 'test_stores',
	TEST_COMPONENTS = 'test_components',
	CAT_COMPONENT_JSON = 'cat-component.json',
	CAT_TESTS_JSON = 'cat-component-tests.json',
	PRESET_FILES = 'presets',
	TEMPLATE_FILES = 'templates';

var CURRENT_PATH = path.join(process.cwd(), 'node_modules', packageConfig.name);

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

				// create test components
				self.createTestComponents(destination, componentTests);

				console.log('Done! ' + componentTests.length + ' component test' +
					(componentTests.length !== 1 ? 's' : '') + ' found');
			});

		// create symlinks
		vinylFs.src(globSymlinkParams, {cwd: src})
			.pipe(vinylFs.symlink(destination));
	};

/**
 * Copies test stores.
 * @param {string} destination
 * @param {Array<Object>} componentTests
 */
ProjectManager.prototype.copyTestStores =
	function (destination, componentTests) {
		componentTests.forEach(function (component) {
			vinylFs.src(
					path.join(component.path, TESTS, TEST_STORES, '*'),
					{cwd: destination}
				)
				.pipe(map(function (file, cb) {
					file._contents = new Buffer(file._contents.toString()
						.replace('require(\'__catberry_stores__\'', '../..'));
					cb(null, file);
				}))
				.pipe(vinylFs.dest(
					path.join(destination, STORES, TEST_STORES, component.name
				)));
		});
	};

/**
 * Collects tests.
 * @param {string} destination
 * @param {Array<Object>} componentTests
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
	vinylFs.src(path.join(CURRENT_PATH, PRESET_FILES, '**', '*'))
		.pipe(vinylFs.dest(destination));
};

/**
 * Create test components.
 * @param {string} destination
 * @param {Array<Object>} componentTests
 */
ProjectManager.prototype.createTestComponents =
	function (destination, componentTests) {
		var testCaseLogicTemplate = fs.readFileSync(
				path.join(
					CURRENT_PATH, TEMPLATE_FILES,
					'test-case-component', 'logic.js'
				), 'utf8');

		componentTests.forEach(function (component) {
			vinylFs.src(
				[
					path.join(component.path, '*.*')
				])
				.pipe(vinylFs.dest(path.join(
					destination, COMPONENTS, TEST_COMPONENTS, component.name
				)))
				.on('end', function () {
					var componentJSONPath = path.join(
							destination, COMPONENTS, TEST_COMPONENTS,
							component.name, CAT_COMPONENT_JSON
						),
						componentJSON = require(componentJSONPath);

					componentJSON.name = 'test-case-' + componentJSON.name;

					fs.createWriteStream(componentJSONPath)
						.end(JSON.stringify(componentJSON, null, '\t'));

					var testCaseLogicFilePath = path.join(destination,
							COMPONENTS, TEST_COMPONENTS,
							component.name,
							componentJSON.logic || './index.js'
						),
						realLogicFilePath = path.join(component.path,
							componentJSON.logic || './index.js'
						);

					fs.createWriteStream(testCaseLogicFilePath)
						.end(testCaseLogicTemplate
							.replace(
								'__path__',
								path.relative(
									testCaseLogicFilePath,
									realLogicFilePath
								).substring(3)
						));
				});
		});
	};
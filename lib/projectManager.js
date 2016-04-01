'use strict';

const path = require('path');
const map = require('map-stream');
const vinylFs = require('vinyl-fs');
const fs = require('fs');
const glob = require('glob');
const changed = require('gulp-changed');
const packageConfig = require('../package.json');

const STORES = 'catberry_stores';
const COMPONENTS = 'catberry_components';
const TESTS = 'tests';
const TEST_STORES = 'test_stores';
const TEST_COMPONENTS = 'test_components';
const CAT_COMPONENT_JSON = 'cat-component.json';
const CAT_TESTS_JSON = 'cat-component-tests.json';
const PRESET_FILES = 'presets';
const TEMPLATE_FILES = 'templates';

const CURRENT_PATH = path.join(process.cwd(), 'node_modules', packageConfig.name);

class ProjectManager {

	/**
	 * Gets components info.
	 * @param {string} destination
	 * @returns {Array<Object>}
	 */
	getComponentTests(destination) {
		const catTestCases = glob.sync(
			path.join(destination, COMPONENTS, '**', TESTS, CAT_TESTS_JSON)
		);
		return catTestCases.map(filePath => {
			const componentDir = filePath.substr(
				0, filePath.length - path.join(TESTS, CAT_TESTS_JSON).length
			);
			const componentJSON = require(path.join(componentDir, CAT_COMPONENT_JSON));
			return {
				name: componentJSON.name,
				path: componentDir,
				tests: require(filePath)
			};
		});
	}

	/**
	 * Creates test-project.
	 * @param {string} src
	 * @param {string|Array<string>} globCopyParams
	 * @param {string|Array<string>} globSymlinkParams
	 * @param {string} destination
	 */
	create(src, globCopyParams, globSymlinkParams, destination) {
		// copy
		vinylFs.src(globCopyParams, {cwd: src})
			.pipe(changed(destination, {hasChanged: changed.compareSha1Digest}))
			.pipe(vinylFs.dest(destination))
			.on('end', () => {
				const componentTests = this.getComponentTests(destination);

				// copy test stores
				this.copyTestStores(destination, componentTests);

				// collect tests for all components
				this.collectTests(destination, componentTests);

				// copy preset files
				this.extendWithPresetFiles(destination);

				// create test components
				this.createTestComponents(destination, componentTests);

				/* eslint no-console: 0 */
				console.log(
					`${componentTests.length !== 1}Done! ${componentTests.length} component test${componentTests.length !== 1 ? 's' : ''} found`
				);
			});

		// create symlinks
		vinylFs.src(globSymlinkParams, {cwd: src})
			.pipe(vinylFs.symlink(destination));
	}

	/**
	 * Copies test stores.
	 * @param {string} destination
	 * @param {Array<Object>} componentTests
	 */
	copyTestStores(destination, componentTests) {
		componentTests.forEach(component => {
			vinylFs.src(
					path.join(component.path, TESTS, TEST_STORES, '*'),
					{cwd: destination}
				)
				.pipe(map((file, cb) => {

					/* eslint no-underscore-dangle: 0 */
					file._contents = new Buffer(file._contents.toString()
						.replace('require(\'__catberry_stores__', 'require(\'../..'));
					cb(null, file);
				}))
				.pipe(vinylFs.dest(
					path.join(destination, STORES, TEST_STORES, component.name
				)));
		});
	}

	/**
	 * Collects tests.
	 * @param {string} destination
	 * @param {Array<Object>} componentTests
	 */
	collectTests(destination, componentTests) {
		const componentCases = {};
		componentTests.forEach(component => {
			componentCases[component.name] = component.tests;
		});
		fs.createWriteStream(path.join(destination, CAT_TESTS_JSON))
			.end(JSON.stringify(componentCases, null, '\t'));
	}

	/**
	 * Extends with preset files.
	 * @param {string} destination
	 */
	extendWithPresetFiles(destination) {
		vinylFs.src(path.join(CURRENT_PATH, PRESET_FILES, '**', '*'))
			.pipe(vinylFs.dest(destination));
	}

	/**
	 * Create test components.
	 * @param {string} destination
	 * @param {Array<Object>} componentTests
	 */
	createTestComponents(destination, componentTests) {

		/* eslint no-sync: 0 */
		const testCaseLogicTemplate = fs.readFileSync(
				path.join(
					CURRENT_PATH, TEMPLATE_FILES,
					'test-case-component', 'logic.js'
				), 'utf8');

		componentTests.forEach(component => {
			vinylFs.src(
				[
					path.join(component.path, '*.*')
				])
				.pipe(vinylFs.dest(path.join(
					destination, COMPONENTS, TEST_COMPONENTS, component.name
				)))
				.on('end', () => {
					const componentJSONPath = path.join(
						destination, COMPONENTS, TEST_COMPONENTS,
						component.name, CAT_COMPONENT_JSON
					);
					const componentJSON = require(componentJSONPath);

					componentJSON.name = `test-case-${componentJSON.name}`;

					fs.createWriteStream(componentJSONPath)
						.end(JSON.stringify(componentJSON, null, '\t'));

					const testCaseLogicFilePath = path.join(destination,
						COMPONENTS, TEST_COMPONENTS,
						component.name,
						componentJSON.logic || './index.js'
					);
					const realLogicFilePath = path.join(component.path,
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
	}
}

module.exports = new ProjectManager();

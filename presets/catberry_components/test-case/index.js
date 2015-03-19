'use strict';

module.exports = TestCase;

var tests = require('../../cat-component-tests.json');

/*
 * This is a Catberry Cat-component file.
 * More details can be found here
 * https://github.com/catberry/catberry/blob/master/docs/index.md#cat-components
 */

/**
 * Creates new instance of "test-case" component.
 * @constructor
 */
function TestCase() {

}

/**
 * Gets data context for template engine.
 * This method is optional.
 * @returns {Promise<Object>|Object|null|undefined} Data context
 * for template engine.
 */
TestCase.prototype.render = function () {
	return this.$context.getStoreData()
		.then(function (data) {
			var componentName = data.componentName,
				cases = (tests[componentName] ?
					tests[componentName].cases : null) || [];
			return {
				cases: cases.map(function (testCase) {
					testCase.string = testCase.string ||
						JSON.stringify(testCase, null, '\t');
					testCase.visible =
						data.viewMode != 'gallery' || testCase.showInGallery;
					return testCase;
				}),
				componentName: componentName,
				isGalleryViewMode: data.viewMode === 'gallery'
			};
		});
};

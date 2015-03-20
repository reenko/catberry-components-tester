'use strict';

module.exports = TestList;

var tests = require('../../cat-component-tests.json');

/*
 * This is a Catberry Cat-component file.
 * More details can be found here
 * https://github.com/catberry/catberry/blob/master/docs/index.md#cat-components
 */

/**
 * Creates new instance of "document" component.
 * @constructor
 */
function TestList() {

}

/**
 * Gets data context for template engine.
 * This method is optional.
 * @returns {Promise<Object>|Object|null|undefined} Data context
 * for template engine.
 */
TestList.prototype.render = function () {
	return this.$context.getStoreData()
		.then(function (data) {
			return {
				components: Object.keys(tests).sort()
					.filter(function (componentName) {
						if (data.viewMode === 'gallery') {
							var cases = tests[componentName].cases || [];
							return cases.some(function (testCase) {
								return testCase.showInGallery;
							});
						}
						return true;
					})
					.map(function (componentName) {
						return {
							name: componentName,
							isActive: componentName === data.componentName,
							cases: (tests[componentName].cases || [])
								.map(function (testCase) {
									testCase.visible =
										data.viewMode != 'gallery' || testCase.showInGallery;
									testCase.isActive = (testCase.name === data.testCaseName);
									return testCase;
								})
						};
					}),
				viewMode: data.viewMode
			};
		});
};

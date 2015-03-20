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
							var cases = tests[componentName].cases || {};
							return Object.keys(cases).some(function (testCaseName) {
								return cases[testCaseName].showInGallery;
							});
						}
						return true;
					})
					.map(function (componentName) {
						var cases = tests[componentName].cases || {};
						return {
							componentName: componentName,
							isActive: componentName === data.componentName,
							cases: Object.keys(cases)
								.map(function (testCaseName) {
									var testCase = cases[testCaseName];
									return {
										visible: data.viewMode != 'gallery' ||
											testCase.showInGallery,
										isActive:
											testCaseName  === data.testCaseName,
										name: testCaseName
									};
								})
						};
					}),
				viewMode: data.viewMode
			};
		});
};

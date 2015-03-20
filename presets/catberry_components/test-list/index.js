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
			var firstVisibleCaseByComponent = {};
			return {
				components: Object.keys(tests).sort()
					.filter(function (componentName) {
						var cases = tests[componentName].cases || {},
							casesNames = Object.keys(cases);

						if (data.viewMode === 'gallery') {
							return casesNames.some(function (testCaseName) {
								if (cases[testCaseName].showInGallery) {
									firstVisibleCaseByComponent[componentName] =
										testCaseName;
								}
								return cases[testCaseName].showInGallery;
							});
						}

						if (casesNames.length > 0) {
							firstVisibleCaseByComponent[componentName] =
								casesNames[0];
						}

						return true;
					})
					.map(function (componentName) {
						return {
							componentName: componentName,
							isActive: componentName === data.componentName,
							firstTestCaseName:
								firstVisibleCaseByComponent[componentName]
						};
					}),
				viewMode: data.viewMode
			};
		});
};

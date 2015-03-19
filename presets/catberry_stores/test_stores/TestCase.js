'use strict';

module.exports = TestCase;

/*
 * This is a Catberry Store file.
 * More details can be found here
 * https://github.com/catberry/catberry/blob/master/docs/index.md#stores
 */

/**
 * Creates new instance of the test store.
 * @param {ServiceLocator} $serviceLocator Locator of the application.
 * @constructor
 */
function TestCase($serviceLocator) {
	this.$context.setDependency('test_stores/TestPages');
}

/**
 * Loads data from remote source.
 * @returns {Promise<Object>|Object|null|undefined} Loaded data.
 */
TestCase.prototype.load = function () {
	var componentName = this.$context.state.componentName;
	return this.$context.getStoreData('test_stores/TestPages')
		.then(function (data) {
			return {
				componentName: componentName,
				viewMode: data.activePages.main ? 'cases' : data.page
			};
		});
};
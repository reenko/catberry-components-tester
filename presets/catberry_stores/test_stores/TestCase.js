'use strict';

module.exports = Test;

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
function Test($serviceLocator) {

}

/**
 * Loads data from remote source.
 * @returns {Promise<Object>|Object|null|undefined} Loaded data.
 */
Test.prototype.load = function () {
	return {
		state: this.$context.state
	};
};
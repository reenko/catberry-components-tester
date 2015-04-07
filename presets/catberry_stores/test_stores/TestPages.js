'use strict';

module.exports = TestPages;

var PAGES = [
	'main', 'cases'
];

/*
 * This is a Catberry Store file.
 * More details can be found here
 * https://github.com/catberry/catberry/blob/master/docs/index.md#stores
 */

/**
 * Creates new instance of the "Pages" store.
 * @param {ServiceLocator} $serviceLocator Locator of the application.
 * @constructor
 */
function TestPages($serviceLocator) {
}

/**
 * Loads data from remote source.
 * @returns {Promise<Object>|Object|null|undefined} Loaded data.
 */
TestPages.prototype.load = function () {
	var self = this,
		activePages = {},
		activePage = '';

	if (!self.$context.state.viewMode) {
		activePages.main = true;
		activePage = 'main';
	} else {
		PAGES.forEach(function (page) {
			if (page.toLowerCase() != self.$context.state.viewMode) {
				activePages[page] = false;
				return;
			}
			activePages[page] = true;
			activePage = page;
		});
	}

	return {
		page: activePage,
		activePages: activePages
	};
};
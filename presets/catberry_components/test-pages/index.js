'use strict';

module.exports = TestPages;

var packageConfig = require('../../package.json'),
	tests = require('../../cat-component-tests.json');

/*
 * This is a Catberry Cat-component file.
 * More details can be found here
 * https://github.com/catberry/catberry/blob/master/docs/index.md#cat-components
 */

/**
 * Creates new instance of "test-case" component.
 * @constructor
 */
function TestPages() {

}

/**
 * Gets data context for template engine.
 * This method is optional.
 * @returns {Promise<Object>|Object|null|undefined} Data context
 * for template engine.
 */
TestPages.prototype.render = function () {
	return this.$context.getStoreData()
		.then(function (data) {
			return {
				showComponents:
					data.activePages.gallery || data.activePages.cases,
				brand: {
					name: packageConfig.name,
					description: packageConfig.description
				}
			};
		});
};

/**
 * Returns event binding settings for the component.
 * This method is optional.
 * @returns {Promise<Object>|Object|null|undefined} Binding settings.
 */
TestPages.prototype.bind = function () {
	var window = this.$context.locator.resolve('window'),
		highlights = this.$context.element.querySelectorAll('js-highlight');
	for (var i = 0; i < highlights.length; i++) {
		window.hljs.highlightBlock(highlights[i]);
	}
};

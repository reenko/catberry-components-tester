'use strict';

module.exports = Document;

var packageConfig = require('../../package.json'),
	tests = require('../../cat-component-tests.json');

/*
 * This is a Catberry Cat-component file.
 * More details can be found here
 * https://github.com/catberry/catberry/blob/master/docs/index.md#cat-components
 */

/**
 * Creates new instance of "document" component.
 * @constructor
 */
function Document() {

}

/**
 * Gets data context for template engine.
 * This method is optional.
 * @returns {Promise<Object>|Object|null|undefined} Data context
 * for template engine.
 */
Document.prototype.render = function () {
	var self = this;
	return {
		brand: {
			name: packageConfig.name,
			description: packageConfig.description
		},
		components: Object.keys(tests).map(function (componentName) {
			return {
				name: componentName,
				isActive: (new RegExp(componentName + '/?$'))
					.test(self.$context.location.toString())
			};
		})
	};
};

'use strict';

module.exports = TestCaseComponent;

var tests = require('../../../cat-component-tests.json'),
	BaseComponent = require('__path__'),
	util = require('util');

util.inherits(TestCaseComponent, BaseComponent);

/*
 * This is a Catberry Cat-component file.
 * More details can be found here
 * https://github.com/catberry/catberry/blob/master/docs/index.md#cat-components
 */

/**
 * Creates new instance of "document" component.
 * @constructor
 */
function TestCaseComponent () {
	BaseComponent.apply(this, arguments);
}

/**
 * Gets data context for template engine.
 * This method is optional.
 * @returns {Promise<Object>|Object|null|undefined} Data context
 * for template engine.
 */
TestCaseComponent.prototype.render = function () {
	var testCaseName = this.$context.attributes['test-case-name'],
		componentName = this.$context.attributes['test-case-component'],
		currentTestCase = {};

	if (!tests[componentName] || !tests[componentName].cases) {
		return {};
	}

	tests[componentName].cases.every(function (testCase) {
		if (testCaseName === testCase.name) {
			currentTestCase = testCase;
			return false;
		}
		return true;
	});

	return currentTestCase.data || {};
};
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
	var self = this;
	return this.$context.getStoreData()
		.then(function (data) {
			var componentName = data.componentName,
				cases = (tests[componentName] ?
						tests[componentName].cases : {}) || {},
				currentCase = cases[data.testCaseName] || null;

			if (currentCase) {
				currentCase.string = currentCase.string ||
					JSON.stringify(currentCase, null, '\t');
			}

			return {
				cases: Object.keys(cases)
					.map(function (testCaseName) {
						var testCase = {};
						testCase.testCaseName = testCaseName;
						testCase.isActive = data.testCaseName === testCaseName;
						return testCase;
					}),
				testCaseName: data.testCaseName,
				currentCase: currentCase,
				componentName: componentName
			};
		});
};

/**
 * Returns event binding settings for the component.
 * This method is optional.
 * @returns {Promise<Object>|Object|null|undefined} Binding settings.
 */
TestCase.prototype.bind = function () {
	var browserWindow = this.$context.locator.resolve('window'),
		highlights = this.$context.element.querySelectorAll('.js-highlight');
	for (var i = 0; i < highlights.length; i++) {
		browserWindow.hljs.highlightBlock(highlights[i]);
	}

	return {
		click: {
			'.js-show-component-markup': this._handleShowMarkup,
			'.js-show-component-cookie': this._handleShowCookie,
			'.js-show-component-html': this._handleShowHtml,
			'.js-show-component-case': this._handleShowCase
		}
	};
};

/**
 * Shows component markup.
 * @param {Event} event
 * @private
 */
TestCase.prototype._handleShowMarkup = function (event) {
	this._toggleBlock(event, '.js-component-markup');
};

/**
 * Shows component case options.
 * @param {Event} event
 * @private
 */
TestCase.prototype._handleShowCase = function (event) {
	this._toggleBlock(event, '.js-component-case');
};

/**
 * Shows cookie.
 * @param {Event} event
 * @private
 */
TestCase.prototype._handleShowCookie = function (event) {
	var blockSelector = '.js-component-cookie',
		block = this.$context.element.querySelector(blockSelector + ' code'),
		browserWindow = this.$context.locator.resolve('window');

	block.innerText = JSON.stringify(this.$context.cookie.getAll(), null, '\t');

	browserWindow.hljs.highlightBlock(block);

	this._toggleBlock(event, blockSelector);
};

/**
 * Shows html.
 * @param {Event} event
 * @private
 */
TestCase.prototype._handleShowHtml = function (event) {
	var blockSelector = '.js-component-html',
		block = this.$context.element.querySelector(blockSelector + ' code'),
		browserWindow = this.$context.locator.resolve('window');

	block.innerText = this.$context.element
		.querySelector('.js-component-test').innerHTML.trim();

	browserWindow.hljs.highlightBlock(block);

	this._toggleBlock(event, blockSelector);
};

/**
 * Toggles block.
 * @param {Event} event
 * @private
 */
TestCase.prototype._toggleBlock = function (event, blockSelector) {
	event.preventDefault();
	this.$context.element.querySelector(blockSelector)
		.style.display = 'block';
	event.currentTarget.style.display = 'none';
};
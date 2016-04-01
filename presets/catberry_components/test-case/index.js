'use strict';

const tests = require('../../cat-component-tests.json');

class TestCase {
	render() {
		return this.$context.getStoreData()
			.then(data => {
				const componentName = data.componentName;
				const cases = (tests[componentName] ?
					tests[componentName].cases : {}) || {};
				const currentCase = cases[data.testCaseName] || null;

				if (currentCase) {
					currentCase.string = currentCase.string ||
						JSON.stringify(currentCase, null, '\t');
				}

				return {
					cases: Object.keys(cases)
						.map(testCaseName => {
							const testCase = {};
							testCase.testCaseName = testCaseName;
							testCase.isActive = data.testCaseName === testCaseName;
							return testCase;
						}),
					testCaseName: data.testCaseName,
					currentCase,
					componentName
				};
			});
	}

	bind() {
		const browserWindow = this.$context.locator.resolve('window');
		const highlights = this.$context.element.querySelectorAll('.js-highlight');
		for (let i = 0; i < highlights.length; i++) {
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
	}

	/**
	 * Shows component markup.
	 * @param {Event} event
	 * @private
	 */
	_handleShowMarkup(event) {
		this._toggleBlock(event, '.js-component-markup');
	}

	/**
	 * Shows component case options.
	 * @param {Event} event
	 * @private
	 */
	_handleShowCase(event) {
		this._toggleBlock(event, '.js-component-case');
	}

	/**
	 * Shows cookie.
	 * @param {Event} event
	 * @private
	 */
	_handleShowCookie(event) {
		const blockSelector = '.js-component-cookie';
		const block = this.$context.element.querySelector(`${blockSelector} code`);
		const browserWindow = this.$context.locator.resolve('window');

		block.innerText = JSON.stringify(this.$context.cookie.getAll(), null, '\t');

		browserWindow.hljs.highlightBlock(block);

		this._toggleBlock(event, blockSelector);
	}

	/**
	 * Shows html.
	 * @param {Event} event
	 * @private
	 */
	_handleShowHtml(event) {
		const blockSelector = '.js-component-html';
		const block = this.$context.element.querySelector(`${blockSelector} code`);
		const browserWindow = this.$context.locator.resolve('window');

		block.innerText = this.$context.element
			.querySelector('.js-component-test').innerHTML.trim();

		browserWindow.hljs.highlightBlock(block);

		this._toggleBlock(event, blockSelector);
	}

	/**
	 * Toggles block.
	 * @param {Event} event
	 * @private
	 */
	_toggleBlock(event, blockSelector) {
		event.preventDefault();
		this.$context.element.querySelector(blockSelector)
			.style.display = 'block';
		event.currentTarget.style.display = 'none';
	}
}

module.exports = TestCase;

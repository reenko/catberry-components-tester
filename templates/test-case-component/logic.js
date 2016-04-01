'use strict';

const tests = require('../../../cat-component-tests.json');
const BaseComponent = require('__path__');

class TestCaseComponent extends BaseComponent {
	render() {
		const testCaseName = this.$context.attributes['test-case-name'];
		const componentName = this.$context.attributes['test-case-component'];

		try {
			return tests[componentName].cases[testCaseName].data;
		} catch (error) {
			return {};
		}
	}
}

module.exports = TestCaseComponent;

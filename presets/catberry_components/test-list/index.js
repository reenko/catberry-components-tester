'use strict';

const tests = require('../../cat-component-tests.json');

class TestList {
	render() {
		return this.$context.getStoreData()
			.then(data => {
				const firstVisibleCaseByComponent = {};
				return {
					components: Object.keys(tests).sort()
						.filter(componentName => {
							const cases = tests[componentName].cases || {};
							const casesNames = Object.keys(cases);

							if (casesNames.length > 0) {
								firstVisibleCaseByComponent[componentName] = casesNames[0];
							}

							return true;
						})
						.map(componentName => {
							return {
								componentName,
								isActive: componentName === data.componentName,
								firstTestCaseName:
									firstVisibleCaseByComponent[componentName]
							};
						})
				};
			});
	}
}

module.exports = TestList;

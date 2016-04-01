'use strict';

class TestCase {
	constructor() {
		this.$context.setDependency('test_stores/TestPages');
	}

	load() {
		const componentName = this.$context.state.componentName;
		const testCaseName = this.$context.state.testCaseName;
		return this.$context.getStoreData('test_stores/TestPages')
			.then(data => {
				return {
					componentName,
					testCaseName,
					viewMode: data.activePages.main ? 'cases' : data.page
				};
			});
	}
}

module.exports = TestCase;

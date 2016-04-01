'use strict';

const packageConfig = require('../../package.json');
const tests = require('../../cat-component-tests.json');

class TestPages {
	render() {
		return this.$context.getStoreData()
			.then(data => {
				return {
					showComponents: data.activePages.cases,
					brand: {
						name: packageConfig.name,
						description: packageConfig.description
					}
				};
			});
	}
}

module.exports = TestPages;

'use strict';

const PAGES = [
	'main', 'cases'
];

class TestPages {
	load() {
		const activePages = {};
		let activePage = '';

		if (!this.$context.state.viewMode) {
			activePages.main = true;
			activePage = 'main';
		} else {
			PAGES.forEach(page => {
				if (page.toLowerCase() !== this.$context.state.viewMode) {
					activePages[page] = false;
					return;
				}
				activePages[page] = true;
				activePage = page;
			});
		}

		return {
			page: activePage,
			activePages
		};
	}
}

module.exports = TestPages;

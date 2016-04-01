'use strict';

const projectManager = require('./lib/projectManager');

module.exports = {

	/**
	 * Creates test-project.
	 * @param {string} src
	 * @param {string|Array<string>} globCopyParams
	 * @param {string|Array<string>} globSymlinkParams
	 * @param {string} destination
	 */
	build(src, globCopyParams, globSymlinkParams, destination) {
		projectManager.create(src, globCopyParams, globSymlinkParams, destination);
	},

	/**
	 * Runs test creation
	 * @param {string} source
	 * @param {string} destination
	 */
	create(source, destination) {
		this.build(source, [
			'**',
			'!node_modules*/**',
			'!test*/**',
			'!public*/**',
			'!scriptsc*/**',
			'!configs*/**',
			'!lib*/**',
			'!l10n*/**',
			'!processes.json',
			'!routes.js',
			'!gemini*/**'
		], [
			'node_modules',
			'lib',
			'scripts',
			'configs',
			'l10n',
			'gemini'
		], destination);
	}
};

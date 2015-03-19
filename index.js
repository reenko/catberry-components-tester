'use strict';

var projectManager = require('./lib/projectManager');

module.exports = {

	/**
	 * Creates test-project.
	 * @param {string} src
	 * @param {string|Array<string>} globCopyParams
	 * @param {string|Array<string>} globSymlinkParams
	 * @param {string} destination
	 */
	build: function (src, globCopyParams, globSymlinkParams, destination) {
		projectManager.create(src, globCopyParams,
			globSymlinkParams, destination);
	},

	/**
	 * Runs test creation
	 * @param {string} source
	 * @param {string} destination
	 */
	create: function (source, destination) {
		this.build(
			source,
			[
				'**',
				'!node_modules*/**',
				'!test*/**',
				'!public*/**',
				'!scriptsc*/**',
				'!configs*/**',
				'!lib*/**',
				'!l10n*/**',
				'!processes.json',
				'!routes.js'
			],
			[
				'node_modules',
				'lib',
				'scripts',
				'configs',
				'l10n'
			],
			destination
		);
	}
};
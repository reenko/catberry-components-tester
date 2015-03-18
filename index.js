'use strict';

var projectManager = require('./lib/projectManager'),
	path = require('path');

module.exports = {
	build: function (src, globCopyParams, globSymlinkParams, destination) {
		projectManager.create(src, globCopyParams, globSymlinkParams, destination);
	}
};

module.exports.build(
	path.join(process.cwd(), '..', '..', 'flamp', 'flamp3'),
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
	path.join(process.cwd(), 'tester')
);
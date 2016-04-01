'use strict';

// This file contains definitions of rules how location URLs are translated
// to parameters for stores in Catberry application.
//
// Format:
// /some/:parameter[store1,store2,store3]
//
// More details here:
// https://github.com/catberry/catberry/blob/master/docs/index.md#routing

module.exports = [
	'/',
	'/:viewMode[test_stores/TestPages]/',
	'/:viewMode[test_stores/TestPages]/:componentName[test_stores/TestCase]',
	'/:viewMode[test_stores/TestPages]/:componentName[test_stores/TestCase]/' +
		':testCaseName[test_stores/TestCase]'
];

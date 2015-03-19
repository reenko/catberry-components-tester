# catberry-components-tester
Engine for testing Catberry components.

```
npm install --save-dev catberry-components-tester
```

Add to your gulpfile.js
```javascript
gulp.task('tester', function (cb) {
	tester.create(
		process.cwd(),
		path.join(process.cwd(), '..', 'your-project-name-tester')
	);
	cb();
});
```

Execute inside your Catberry project
```
./node_modules/.bin/gulp tester && cd ../your-project-name && npm start
```

var gulp = require('gulp'),
	browserify = require('browserify'),
	source = require('vinyl-source-stream');

gulp.task('browserify', function() {
	return browserify('./lib/extension/main')
		.bundle()
		.pipe(source('unscramble-stack-trace.js'))
		.pipe(gulp.dest('./chrome-extension'));
});
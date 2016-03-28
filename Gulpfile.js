var gulp = require('gulp'),
	browserify = require('browserify'),
	sass = require('gulp-sass'),
	copy = require('gulp-contrib-copy'),
	source = require('vinyl-source-stream'),
	buildFolder = './dist/';

gulp.task('copy', function() {
	return gulp.src('./chrome-extension/**')
		.pipe(copy())
		.pipe(gulp.dest(buildFolder));
});

gulp.task('browserify', function() {
	return browserify('./lib/extension/main')
		.bundle()
		.pipe(source('unscrambler.js'))
		.pipe(gulp.dest(buildFolder));
});

gulp.task('sass', function() {
	return gulp.src('./chrome-extension/scss/**/*.scss')
		.pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
		.pipe(gulp.dest(buildFolder));
});

gulp.task('build', ['copy', 'browserify', 'sass']);
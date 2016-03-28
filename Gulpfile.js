var gulp = require('gulp'),
	browserify = require('browserify'),
	sass = require('gulp-sass'),
	concat = require('gulp-concat'),
	cleanCSS = require('gulp-clean-css'),
	production = require('gulp-environments').production,
	uglify = require('gulp-uglify'),
	buffer = require('vinyl-buffer'),
	source = require('vinyl-source-stream'),
	buildFolder = './dist/';

gulp.task('copy', function() {
	return gulp.src(['./chrome-extension/**', '!./chrome-extension/scss/**/*'])
		.pipe(gulp.dest(buildFolder));
});

gulp.task('browserify', function() {
	return browserify('./lib/extension/main')
		.bundle()
		.pipe(source('unscrambler.js'))
		.pipe(buffer())
		.pipe(production(uglify()))
		.pipe(gulp.dest(buildFolder));
});

gulp.task('sass', function() {
	return gulp.src('./chrome-extension/scss/**/*.scss')
		.pipe(sass().on('error', sass.logError))
		.pipe(concat('main.css'))
		.pipe(production(cleanCSS()))
		.pipe(gulp.dest(buildFolder));
});

gulp.task('build', ['copy', 'browserify', 'sass']);
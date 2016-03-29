var gulp = require('gulp'),
	browserify = require('browserify'),
	sass = require('gulp-sass'),
	concat = require('gulp-concat'),
	cleanCSS = require('gulp-clean-css'),
	production = require('gulp-environments').production,
	uglify = require('gulp-uglify'),
	buffer = require('vinyl-buffer'),
	source = require('vinyl-source-stream'),
	buildFolder = './dist/',
	prodFolder = './prod';

gulp.task('copy', function() {
	return gulp.src(['./chrome-extension/**', '!./chrome-extension/scss/**/*'])
		.pipe(gulp.dest(buildFolder));
});

gulp.task('script:foreground', function() {
	return browserify('./lib/extension/main')
		.bundle()
		.pipe(source('unscrambler.js'))
		.pipe(buffer())
		.pipe(production(uglify()))
		.pipe(gulp.dest(buildFolder));
});

gulp.task('script:background', function() {
	return browserify('./lib/extension/background')
		.bundle()
		.pipe(source('context.js'))
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

gulp.task('build', ['copy', 'script:foreground', 'script:background', 'sass']);

gulp.task('prod', function() {
	return gulp.src(['./chrome-extension/**', '!./chrome-extension/scss/**/*'])
		.pipe(gulp.dest(prodFolder));
});
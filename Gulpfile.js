var gulp = require('gulp'),
	browserify = require('browserify'),
	sass = require('gulp-sass'),
	concat = require('gulp-concat'),
	cleanCSS = require('gulp-clean-css'),
	production = require('gulp-environments').production,
	uglify = require('gulp-uglify'),
	buffer = require('vinyl-buffer'),
	zip = require('gulp-zip'),
	clean = require('gulp-clean'),
	source = require('vinyl-source-stream'),
	distFolder = function() {
		return production() ? './build/' : './dist/';
	};

gulp.task('clean', function() {
	return gulp.src(distFolder() + '**/*', {read: false})
		.pipe(clean());
});

gulp.task('copy', function() {
	return gulp.src(['./chrome-extension/**', '!./chrome-extension/scss{,/**}'])
		.pipe(gulp.dest(distFolder()));
});

gulp.task('copy:pem', function() {
	return gulp.src(['./*.pem'])
		.pipe(gulp.dest(distFolder()));
});

gulp.task('script:foreground', function() {
	return browserify('./lib/extension/main')
		.bundle()
		.pipe(source('unscrambler.js'))
		.pipe(buffer())
		.pipe(production(uglify()))
		.pipe(gulp.dest(distFolder() + 'js'));
});

gulp.task('script:background', function() {
	return browserify('./lib/extension/background')
		.bundle()
		.pipe(source('context.js'))
		.pipe(buffer())
		.pipe(production(uglify()))
		.pipe(gulp.dest(distFolder() + 'js'));
});

gulp.task('sass', function() {
	return gulp.src('./chrome-extension/scss/**/*.scss')
		.pipe(sass().on('error', sass.logError))
		.pipe(concat('main.css'))
		.pipe(production(cleanCSS()))
		.pipe(gulp.dest(distFolder() + 'css'));
});

gulp.task('build', ['clean', 'copy', 'script:foreground', 'script:background', 'sass']);

gulp.task('zip', ['clean', 'copy', 'copy:pem', 'script:foreground', 'script:background', 'sass'], function() {
	var manifest = require('./chrome-extension/manifest'),
		distFileName = manifest.name + ' v' + manifest.version + '.zip';

	return gulp.src([distFolder() + '/**/*'])
		.pipe(zip(distFileName))
		.pipe(gulp.dest(distFolder()));
});

gulp.task('chrome-extension', ['clean'], function() {
	gulp.start('zip');
});